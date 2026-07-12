/**
 * scripts/ingest.ts
 *
 * Extracts text from LEMKEN service-manual PDFs, chunks it, embeds with
 * OpenAI text-embedding-3-small, and upserts into the Supabase
 * document_chunks table.
 *
 * Run:  npx tsx scripts/ingest.ts
 */

import dotenv from "dotenv";
import fs from "fs";
import path from "path";
// pdf-parse v1 is a CJS module; handle default-export interop
import pdfParseImport from "pdf-parse";
const pdfParse: typeof pdfParseImport =
  (pdfParseImport as any).default ?? pdfParseImport;
import { createClient } from "@supabase/supabase-js";
import OpenAI from "openai";

// ── env ─────────────────────────────────────────────────────────────────────

dotenv.config();
const envLocalPath = path.resolve(process.cwd(), ".env.local");
if (fs.existsSync(envLocalPath)) {
  dotenv.config({ path: envLocalPath, override: true });
}

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SECRET_KEY = process.env.SUPABASE_SECRET_KEY;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

if (!SUPABASE_URL || !SUPABASE_SECRET_KEY || !OPENAI_API_KEY) {
  console.error(
    "Missing env vars. Set SUPABASE_URL, SUPABASE_SECRET_KEY, and OPENAI_API_KEY in .env.local"
  );
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SECRET_KEY);
const openai = new OpenAI({ apiKey: OPENAI_API_KEY });

// ── manifest ────────────────────────────────────────────────────────────────

interface ManifestEntry {
  file: string;
  machineId: string;
  docTitle: string;
}

const MANIFEST: ManifestEntry[] = [
  {
    file: "solitair-dt-600-operating-manual.pdf",
    machineId: "solitair-dt",
    docTitle: "Solitair DT 600 Operating Manual",
  },
  {
    file: "solitair-dt-600-service-codes.pdf",
    machineId: "solitair-dt",
    docTitle: "Solitair DT 600 Service Codes",
  },
  {
    file: "solitair-dt-900-folding.pdf",
    machineId: "solitair-dt",
    docTitle: "Solitair DT 900 Folding Guide",
  },
  {
    file: "solitair-dt-guide.pdf",
    machineId: "solitair-dt",
    docTitle: "Solitair DT Guide",
  },
  {
    file: "karat-guide.pdf",
    machineId: "karat",
    docTitle: "Karat 10/12 Guide",
  },
  {
    file: "rubin-guide.pdf",
    machineId: "rubin",
    docTitle: "Rubin 10/12 Guide",
  },
];

// ── chunking ────────────────────────────────────────────────────────────────

const CHUNK_SIZE = 600; // target tokens (≈ chars / 4 rough estimate)
const CHUNK_OVERLAP = 100;
const CHARS_PER_TOKEN = 4;
const MIN_CHUNK_CHARS = 40;

function chunkText(text: string): string[] {
  const chunkChars = CHUNK_SIZE * CHARS_PER_TOKEN;
  const overlapChars = CHUNK_OVERLAP * CHARS_PER_TOKEN;
  const chunks: string[] = [];

  let start = 0;
  while (start < text.length) {
    let end = start + chunkChars;

    // Try to break on a sentence/paragraph boundary
    if (end < text.length) {
      const slice = text.slice(start, end + 200);
      const breakIdx = slice.lastIndexOf("\n\n");
      if (breakIdx > chunkChars * 0.5) {
        end = start + breakIdx;
      } else {
        const sentenceBreak = slice.lastIndexOf(". ");
        if (sentenceBreak > chunkChars * 0.5) {
          end = start + sentenceBreak + 1;
        }
      }
    }

    const chunk = text.slice(start, end).trim();
    if (chunk.length >= MIN_CHUNK_CHARS) {
      chunks.push(chunk);
    }

    start = end - overlapChars;
    if (start >= text.length) break;
  }

  return chunks;
}

// ── PDF page extraction ─────────────────────────────────────────────────────

interface PageText {
  page: number;
  text: string;
}

async function extractPages(pdfPath: string): Promise<PageText[]> {
  const dataBuffer = fs.readFileSync(pdfPath);
  const pages: PageText[] = [];
  let pageNum = 0;

  await pdfParse(dataBuffer, {
    pagerender(pageData: any) {
      pageNum++;
      const currentPage = pageNum;
      return pageData.getTextContent().then((content: any) => {
        const strings: string[] = content.items.map((item: any) => item.str);
        const text = strings.join(" ").trim();
        if (text.length > 0) {
          pages.push({ page: currentPage, text });
        }
        return text;
      });
    },
  });

  return pages;
}

// ── embedding with retry ────────────────────────────────────────────────────

const EMBED_BATCH_SIZE = 100;
const MAX_RETRIES = 5;

async function embedBatch(texts: string[]): Promise<number[][]> {
  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      const res = await openai.embeddings.create({
        model: "text-embedding-3-small",
        input: texts,
      });
      return res.data.map((d) => d.embedding);
    } catch (err: any) {
      if (err?.status === 429 && attempt < MAX_RETRIES) {
        const wait = Math.pow(2, attempt) * 1000;
        console.log(`  Rate limited, retrying in ${wait / 1000}s...`);
        await new Promise((r) => setTimeout(r, wait));
        continue;
      }
      throw err;
    }
  }
  throw new Error("Unreachable");
}

// ── main ────────────────────────────────────────────────────────────────────

interface ChunkRecord {
  machine_id: string;
  source_pdf: string;
  doc_title: string;
  page: number;
  chunk_text: string;
  embedding?: number[];
}

async function main() {
  let totalChunks = 0;

  for (const entry of MANIFEST) {
    const pdfPath = path.resolve(process.cwd(), "public/docs", entry.file);
    const sourcePdf = `/docs/${entry.file}`;

    if (!fs.existsSync(pdfPath)) {
      console.warn(`Warning: File not found, skipping: ${pdfPath}`);
      continue;
    }

    console.log(`\n-- ${entry.docTitle} (${entry.file})`);

    // Extract pages
    const pages = await extractPages(pdfPath);
    console.log(`  ${pages.length} pages extracted`);

    // Chunk each page
    const records: ChunkRecord[] = [];
    for (const p of pages) {
      const chunks = chunkText(p.text);
      for (const chunk of chunks) {
        records.push({
          machine_id: entry.machineId,
          source_pdf: sourcePdf,
          doc_title: entry.docTitle,
          page: p.page,
          chunk_text: chunk,
        });
      }
    }
    console.log(`  ${records.length} chunks created`);

    if (records.length === 0) continue;

    // Embed in batches
    console.log(`  Embedding...`);
    for (let i = 0; i < records.length; i += EMBED_BATCH_SIZE) {
      const batch = records.slice(i, i + EMBED_BATCH_SIZE);
      const texts = batch.map((r) => r.chunk_text);
      const embeddings = await embedBatch(texts);
      for (let j = 0; j < batch.length; j++) {
        batch[j].embedding = embeddings[j];
      }
    }

    // Delete existing rows for this source_pdf (idempotent re-run)
    const { error: delError } = await supabase
      .from("document_chunks")
      .delete()
      .eq("source_pdf", sourcePdf);
    if (delError) {
      console.error(`  Delete failed for ${sourcePdf}:`, delError.message);
      continue;
    }

    // Insert
    const { error: insError } = await supabase
      .from("document_chunks")
      .insert(records);
    if (insError) {
      console.error(`  Insert failed for ${sourcePdf}:`, insError.message);
      continue;
    }

    console.log(`  Done: ${records.length} chunks inserted`);
    totalChunks += records.length;
  }

  console.log(`\n== Done. ${totalChunks} total chunks inserted.\n`);
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
