import Anthropic from "@anthropic-ai/sdk";
import { SYSTEM_PROMPT, MACHINES } from "@/lib/knowledge";
import { createClient } from "@supabase/supabase-js";
import OpenAI from "openai";

// Run on the Node.js serverless runtime (Vercel Functions).
export const runtime = "nodejs";
export const maxDuration = 30;

type ChatMessage = { role: "user" | "assistant"; content: string };

const MODEL = process.env.LEMKEN_MODEL || "claude-sonnet-5";

// ── RAG helpers ─────────────────────────────────────────────────────────────

function detectMachine(text: string): string | null {
  const lower = text.toLowerCase();
  // Score each machine: check name and aliases against the user message.
  for (const m of MACHINES) {
    if (lower.includes(m.name.toLowerCase())) return m.id;
    for (const alias of m.aliases) {
      if (lower.includes(alias.toLowerCase())) return m.id;
    }
  }
  return null;
}

interface ChunkRow {
  doc_title: string;
  page: number;
  source_pdf: string;
  chunk_text: string;
  similarity: number;
}

async function retrieveChunks(
  userMessage: string,
  filterMachine: string | null
): Promise<ChunkRow[]> {
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SECRET_KEY;
  const openaiKey = process.env.OPENAI_API_KEY;

  if (!supabaseUrl || !supabaseKey || !openaiKey) return [];

  const openai = new OpenAI({ apiKey: openaiKey });
  const supabase = createClient(supabaseUrl, supabaseKey);

  // Embed the user message
  const embRes = await openai.embeddings.create({
    model: "text-embedding-3-small",
    input: userMessage,
  });
  const embedding = embRes.data[0].embedding;

  // Call the Supabase RPC
  const { data, error } = await supabase.rpc("match_document_chunks", {
    query_embedding: embedding,
    match_count: 6,
    filter_machine: filterMachine,
  });

  if (error) {
    console.error("match_document_chunks error:", error.message);
    return [];
  }

  return (data as ChunkRow[]) ?? [];
}

function buildContextBlock(chunks: ChunkRow[]): string {
  if (chunks.length === 0) return "";

  const sections = chunks.map((c, i) => {
    return `[${i + 1}] ${c.doc_title} — page ${c.page} (${c.source_pdf})\n${c.chunk_text}`;
  });

  return `<manual_context>
The following excerpts were retrieved from LEMKEN operating/service manuals and are relevant to the customer's question. Use them to give a specific, grounded answer. Cite the document title and page number when you use information from a chunk, and link the source PDF path (e.g. ${chunks[0].source_pdf}).

${sections.join("\n\n")}
</manual_context>`;
}

// ── route handler ───────────────────────────────────────────────────────────

export async function POST(req: Request) {
  const apiKey = process.env.ANTHROPIC_API_KEY;

  if (!apiKey) {
    return new Response(
      JSON.stringify({
        error:
          "The assistant is not configured yet. Add an ANTHROPIC_API_KEY environment variable in your Vercel project settings and redeploy.",
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }

  let messages: ChatMessage[];
  try {
    const body = await req.json();
    messages = Array.isArray(body?.messages) ? body.messages : [];
  } catch {
    return new Response(JSON.stringify({ error: "Invalid request body." }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  // Keep only valid, non-empty turns and cap history length to control cost.
  const cleaned = messages
    .filter(
      (m) =>
        (m.role === "user" || m.role === "assistant") &&
        typeof m.content === "string" &&
        m.content.trim().length > 0
    )
    .slice(-12);

  if (cleaned.length === 0) {
    return new Response(JSON.stringify({ error: "No message provided." }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  // ── RAG: retrieve relevant manual chunks ──────────────────────────────
  const latestUserMsg = cleaned.filter((m) => m.role === "user").pop();
  let contextBlock = "";

  if (latestUserMsg) {
    try {
      const filterMachine = detectMachine(latestUserMsg.content);
      const chunks = await retrieveChunks(latestUserMsg.content, filterMachine);
      contextBlock = buildContextBlock(chunks);
    } catch (err) {
      console.error("RAG retrieval failed, falling back to brochure knowledge:", err);
    }
  }

  // ── Build system prompt with optional RAG context ─────────────────────
  let systemPrompt = SYSTEM_PROMPT;

  if (contextBlock) {
    systemPrompt += `\n\n## Retrieved manual context\nBelow are excerpts retrieved from LEMKEN operating and service manuals that may be relevant to the customer's current question. When these excerpts answer the question, prefer them over the general brochure summaries above — they come from the actual manuals and contain more specific information. Cite the document title and page number, and include the /docs/ PDF link so the customer can read more.\nIf the retrieved excerpts are not relevant to the question, ignore them and answer from the brochure reference above as usual.\n\n${contextBlock}`;
  }

  const anthropic = new Anthropic({ apiKey });

  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      try {
        const messageStream = anthropic.messages.stream({
          model: MODEL,
          max_tokens: 1024,
          system: systemPrompt,
          messages: cleaned,
        });

        for await (const event of messageStream) {
          if (
            event.type === "content_block_delta" &&
            event.delta.type === "text_delta"
          ) {
            controller.enqueue(encoder.encode(event.delta.text));
          }
        }
        controller.close();
      } catch (err) {
        const msg =
          err instanceof Error ? err.message : "Unexpected error from the model.";
        controller.enqueue(
          encoder.encode(
            `\n\n[The assistant hit an error: ${msg}. Please try again, or contact your LEMKEN dealer.]`
          )
        );
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-cache, no-transform",
    },
  });
}
