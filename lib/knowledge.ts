// ---------------------------------------------------------------------------
// LEMKEN customer FAQ knowledge base.
//
// PHASE 1 grounding: each machine below is summarised from LEMKEN's own product
// brochures (the source PDFs live in /public/docs and are linked via `pdf`).
// The assistant answers from these summaries and always offers the full PDF for
// detail. When you get real operating manuals from LEONIS, this is where richer
// content goes — or it becomes the retrieval (RAG) source in Phase 2.
//
// To add a machine: copy a MACHINES entry, drop its PDF in /public/docs, fill in
// the fields. Nothing else needs to change.
// ---------------------------------------------------------------------------

export type Machine = {
  id: string;
  name: string;
  category: string;
  aliases: string[];
  pdf: string; // path under /public
  summary: string;
  highlights: string[];
};

export const MACHINES: Machine[] = [
  // ----------------------------- PLOUGHS -----------------------------
  {
    id: "juwel",
    name: "Juwel",
    category: "Mounted reversible plough",
    aliases: ["juwel m", "juwel v", "juwel i", "juwel 7", "juwel 8", "juwel 10"],
    pdf: "/docs/juwel.pdf",
    summary:
      "The Juwel is LEMKEN's mounted reversible plough, built for reliability and ease of use with high work quality. It is highly configurable so each farm can tailor body spacing, working width and overload protection to its conditions.",
    highlights: [
      "Available with 90 or 100 cm body spacing; the basic version offers four fixed working widths, while the Juwel M V uses a double-acting hydraulic cylinder for stepless working-width adjustment from the tractor seat.",
      "Optiquick setting system lets you set front furrow width and pull point independently — reducing side pull, wear and fuel use.",
      "Overload protection options: shear pin (standard), OptiStone hydraulic auto-reset (U versions), or automatic mechanical (M X / M V X versions).",
      "DuraMaxx plough bodies use much harder steel and can be changed without tools; LEMKEN cites up to ~150% longer service life and up to 80% less set-up time versus conventional bodies.",
      "Juwel i offers ISOBUS iQ plough control. OF version supports on-land and in-furrow ploughing.",
      "Pendulum wheel or Uni wheel options (Uni wheel recommended for 4+ furrows and road transport).",
    ],
  },
  {
    id: "diamant",
    name: "Diamant",
    category: "Semi-mounted reversible plough",
    aliases: ["diamant 16", "diamant 18", "diamant v"],
    pdf: "/docs/diamant.pdf",
    summary:
      "The Diamant is LEMKEN's semi-mounted reversible plough for large farms and demanding conditions, available as Diamant 16 and the heavier Diamant 18. It pairs passive mechanical steering with wheels inside the working width for easy manoeuvring and clean boundary ploughing.",
    highlights: [
      "Diamant 16: 5- to 9-furrow versions on a box-section frame; Diamant 18: 6- to 8-furrow, heavier frame for large tractors and extreme conditions.",
      "Working widths typically 33/38/44/50 cm per body (fixed) or 30–60 cm stepless on V versions; interbody clearance 100 or 120 cm.",
      "Overload protection: shear-bolt or OptiStone hydraulic. Optional FlexPack furrow press enables direct reconsolidation in one pass.",
      "Traction booster / OptiTrac 'smart ballasting' transfers weight to the tractor's rear axle to reduce slip and save fuel.",
      "Dural bodies standard; DuraMaxx optional for up to ~150% longer life. Carbide-reinforced wear parts available for abrasive soils.",
      "Supports on-land and in-furrow ploughing (OF version).",
    ],
  },
  {
    id: "titan",
    name: "Titan",
    category: "Semi-mounted reversible plough (on-land)",
    aliases: ["titan 18", "titan v"],
    pdf: "/docs/titan.pdf",
    summary:
      "The Titan 18 is LEMKEN's large semi-mounted reversible plough, used exclusively as an on-land version to protect soils. It is built for the biggest tractors — including dual wheels and crawler tracks — and high area output.",
    highlights: [
      "9 to 13 furrows; Titan 18 has four fixed working widths up to 50 cm per body, Titan 18 V offers stepless hydraulic 30–50 cm per body.",
      "On-land only: designed for wide tyres, dual wheels or tracks that can't fit in the furrow, avoiding soil compaction. Benefits from GPS guidance.",
      "New OptiStone hydraulic overload protection available. Working widths up to ~7.15 m.",
      "Articulated frame adapts to undulating terrain; rear frame can be lifted separately via electronic plough control for efficient headland turns.",
      "Optional coupling carriage for tractors without three-point hydraulics (note: full-implement road transport not permitted in the EU due to size). Load-sensing tractor hydraulics recommended.",
      "Combines with FlexPack for direct reconsolidation.",
    ],
  },

  // ------------------------- CULTIVATORS -----------------------------
  {
    id: "karat",
    name: "Karat",
    category: "Intensive cultivator (stubble)",
    aliases: ["karat 10", "karat 12"],
    pdf: "/docs/karat.pdf",
    summary:
      "The Karat is LEMKEN's intensive cultivator for stubble cultivation, available as the 3-beam Karat 10 and the 4-beam Karat 12. Symmetrical tine arrangement means it works without side draught, and a wide share range adapts tillage intensity to conditions.",
    highlights: [
      "Karat 10 (3-beam): well suited to incorporating crop residues and shallower tillage; narrower line spacing for intensive work.",
      "Karat 12 (4-beam): for larger crop-residue volumes and very intensive tillage on heavy soils; line spacing 90–80–90 cm, line distance 23.5 cm for blockage-free flow.",
      "Wide range of shares (narrow to wide) for levelling, loosening or crumbling.",
      "Generous underframe clearance and optional depth-control wheels within the working width for stability and directional control.",
      "Semi-mounted version can add a leading disc section (individually leaf-sprung discs) for better incorporation of organic matter; hydraulically depth-adjustable from the seat.",
      "Extensive choice of trailing rollers for reconsolidation and crumbling.",
    ],
  },
  {
    id: "kristall",
    name: "Kristall",
    category: "Compact cultivator (stubble)",
    aliases: ["kristall 9", "kristall u"],
    pdf: "/docs/kristall.pdf",
    summary:
      "The Kristall is LEMKEN's two-row compact cultivator for shallow-to-medium stubble cultivation. Its TriMix shares give intensive, full-width mixing of soil and straw in a shorter, more compact machine than multi-row cultivators.",
    highlights: [
      "TriMix shares combine three tools in one: the point rips soil, the guide board mixes, and the wing plus winglets turn it again — intensive mixing with fewer tines and low draft.",
      "Works shallow for first-pass volunteer/weed germination, then medium depth (~10–15 cm, up to deeper) for mulch/min-till seedbed prep.",
      "Two-row design gives better depth control and needs less lifting force and front ballast than long multi-row cultivators.",
      "Available fully mounted and semi-mounted, 3–6 m working width; a mid-power tractor suits a ~3 m working width.",
      "Standard shear-bolt protection; 'U' models add autoreset. DuoMix shares available as an alternative on light soils.",
    ],
  },

  // --------------------- COMPACT DISC HARROWS ------------------------
  {
    id: "heliodor",
    name: "Heliodor",
    category: "Compact disc harrow",
    aliases: ["heliodor 9"],
    pdf: "/docs/heliodor-rubin-disc-harrows.pdf",
    summary:
      "The Heliodor 9 is a light, fast, all-round compact disc harrow — ideal for shallow stubble cultivation, incorporating catch crops and seedbed preparation in light to medium soils without clogging.",
    highlights: [
      "Cutting angle 10.5° to the ground and 16.5° to the direction of travel; line distance 12.5 cm; disc diameter 510 mm; underframe clearance 54.5 cm.",
      "Best suited to shallow work (up to ~12 cm) and higher speeds; excels on light soils and ploughed land.",
      "Recommended tractor power roughly 25–40 HP per metre of working width.",
      "Two rows of concave discs give even levelling and incorporation; wide choice of trailing rollers for reconsolidation.",
      "See the shared Heliodor & Rubin brochure for the full model comparison table.",
    ],
  },
  {
    id: "rubin",
    name: "Rubin",
    category: "Compact disc harrow",
    aliases: ["rubin 10", "rubin 12", "rubin mr", "rubin tf", "rubin 10 mr", "rubin 10 tf"],
    pdf: "/docs/rubin-10.pdf",
    summary:
      "The Rubin is LEMKEN's heavier compact disc harrow for thorough, intensive mixing — even in lodged cereals, maize straw or tall green manure — at shallow depths and in difficult conditions. Rubin 10 and Rubin 12 cover deeper and more demanding work than the Heliodor.",
    highlights: [
      "Rubin 10: larger discs and steeper cutting angle than Heliodor (20° to ground, 17°/15° to travel for the two disc rows); line distance 12.5 cm; underframe clearance 80 cm; discs up to ~645 mm. Rubin 12 uses ~736/645 mm discs, 17 cm line distance for deeper work.",
      "Rubin MR: headstock-mounted, rigid, up to ~6 m working width. Rubin TF: semi-mounted from ~6 m, with hydraulic folding, automatic transport lock and hydraulic depth adjustment as standard.",
      "Concave discs individually mounted on stalks; optimised angles for full-surface work and penetration in hard soils.",
      "Optional impact harrow (behind first disc row) for extra mixing/crumbling and levelling harrow (behind second row) for a level finish.",
      "Working depth set mechanically (hole guide) or hydraulically from the cab; hydraulic version can compensate for new vs. worn discs. ModuLight LED lighting available on TF.",
    ],
  },

  // ------------------------- POWER HARROW ----------------------------
  {
    id: "zirkon",
    name: "Zirkon",
    category: "Power harrow (seedbed preparation)",
    aliases: ["zirkon 8", "zirkon 12", "zirkon k", "zirkon ka"],
    pdf: "/docs/zirkon.pdf",
    summary:
      "The Zirkon is LEMKEN's power harrow for seedbed preparation, producing intensive mixing and crumbling to about 25 cm deep in almost any soil — including compacted, dry, hard or heavy ground. It can be rear- or front-mounted and pairs with LEMKEN Solitair seed drills.",
    highlights: [
      "Set working depth, rotor speed, tine position and forward speed to dial in anything from shallow-and-fast to deep-and-intensive.",
      "Zirkon 8: mounted entry-level, ~2.5–4 m, non-folding. Zirkon 12: rigid high-performance mounted, 3–4 m.",
      "Zirkon K: mounted, hydraulically folding to ~3 m transport width — even combined with the Solitair K seed drill. Zirkon KA: semi-mounted for larger widths with the pneumatic Solitair.",
      "Welded, thick-walled micro-alloyed gearbox trough for maximum stability and long service life under high continuous loads.",
      "Suited to both conventional and conservation cultivation.",
    ],
  },

  // ------------------------ RECONSOLIDATION --------------------------
  {
    id: "rollers",
    name: "Rollers & packers",
    category: "Reconsolidation",
    aliases: ["roller", "packer", "cage roller", "tube bar roller", "double roller", "knife roller", "flex ring", "rubber ring", "variopack", "rsw", "drr", "drf", "frw", "grw", "msw"],
    pdf: "/docs/rollers.pdf",
    summary:
      "LEMKEN offers a wide range of rollers and packers for depth control and reconsolidation, used on cultivators and drill combinations. The right roller depends on soil type, weight needed and whether crumbling, levelling or carrying capacity matters most.",
    highlights: [
      "Cage rollers (~400/540/600 mm): simple, inexpensive depth control and strip reconsolidation; bigger diameter = more load capacity.",
      "Tube bar rollers RSW 400/540/600: crumbling and carrying capacity graded by diameter — from light-weight crumbling to high capacity on very light soils.",
      "Double rollers (e.g. DRF/DRR 400/400, 540/400): pendulum-suspended pairs for even weight distribution, good crumbling, levelling and accurate depth control in min-till.",
      "Knife roller MSW 600: self-cleaning, resists sticking/clogging — good for heavy soil and mulch sowing. Flex ring roller FRW 540: for wet, sticky heavy soils. Rubber ring roller GRW 590: pairs with seed drills at 125 mm row spacing.",
      "An optional following harrow adds surface levelling and lifts root weeds to dry out.",
    ],
  },

  // ---------------------------- SOWING -------------------------------
  {
    id: "solitair-dt",
    name: "Solitair DT",
    category: "Drill combination (seed drill)",
    aliases: ["solitair", "solitair dt", "solitairdt"],
    pdf: "/docs/solitair-dt.pdf",
    summary:
      "The Solitair DT is LEMKEN's lightweight, efficient drill combination. It integrates a Heliodor compact disc harrow for seedbed prep with a parallelogram-guided OptiDisc double-disc coulter bar for precise seed placement and even emergence, even at high forward speeds. A separate seed-rate table booklet is available.",
    highlights: [
      "Integrated Heliodor disc section leaves a finely crumbled, level seedbed; serrated concave discs for tough conditions or low-draft corrugated discs for lighter, water-saving prep in dry regions.",
      "Wheelmark eradicator tools remove tractor tracks; optional leading tyre packer or levelling tines ahead of the disc section.",
      "Single or divided seed hopper; single-shot and/or double-shot placement. Optional coulter bar for fertiliser or a second seed type, placed between seed rows.",
      "Tyre packer roller reconsolidates the whole seedbed; OptiDisc coulters with trailing depth-control rollers ensure even coverage depth.",
      "iQ drill control with integrated headland management (ISOBUS) automates raising/lowering at the headland.",
      "Seed-rate calibration by crop, seed wheel, colour code, width and speed lives in the separate Solitair DT seed tables PDF (/docs/solitair-dt-seed-tables.pdf) — the exact numbers are model- and crop-specific, so check that document for your setup.",
    ],
  },
  {
    id: "compact-solitair",
    name: "Compact-Solitair",
    category: "Drill combination (seed drill)",
    aliases: ["compact solitair", "compact-solitair h", "compact-solitair hd", "compact-solitair z", "compact-solitair kk"],
    pdf: "/docs/compact-solitair.pdf",
    summary:
      "The Compact-Solitair is LEMKEN's high-capacity cultivator drill for large operations, built for high forward speeds, big tank capacity and easy road transport in both min-till and conventional systems. Variants integrate either a Heliodor disc harrow (H/HD) or a Zirkon power harrow (Z/KK).",
    highlights: [
      "Compact-Solitair H/HD uses the Heliodor disc tool section (two rows of notched concave discs, individually mounted) for uniform mixing at speed.",
      "HD sets up simultaneous seeding + fertilisation: a divided hopper meters seed and fertiliser separately (Solitronic-controlled), placing fertiliser between seed rows to boost yields and avoid root burn.",
      "Fertiliser double-disc coulters (400 mm) place fertiliser precisely at depth with automatic overload protection for stony soils; the bar lifts out of work when not fertilising to protect coulters.",
      "Height-adjustable outer discs (and edge limiters) avoid ridges/furrows where passes meet; rigid 3 m versions fold outer discs for sub-3 m transport.",
      "Compact-Solitair Z / KK integrate a Zirkon power harrow for finely tuned cultivation intensity in tougher seeding conditions.",
    ],
  },

  // ------------------------- WEED CONTROL ----------------------------
  {
    id: "thulit",
    name: "Thulit",
    category: "Weed harrow (mechanical weed control)",
    aliases: ["thulit weed harrow", "weeder harrow"],
    pdf: "/docs/thulit.pdf",
    summary:
      "The Thulit is LEMKEN's weed harrow for mechanical weed control, reducing reliance on chemical crop-care products. Its OptiTine hydraulic system holds every tine at exactly the same, infinitely adjustable pressure, so it works reliably even on dry, crusted soils.",
    highlights: [
      "OptiTine hydraulic tine-pressure adjustment: infinitely variable from gentle ~100 g up to 5,000 g per tine, adjustable from the cab while driving.",
      "Robust 8 mm tines with a unique 31.25 mm line spacing and asymmetric arrangement for blockage-free work even with lots of organic matter.",
      "Works across crop stages (from 1–2 leaf to full-grown), breaking crusts, aerating soil (aiding nitrogen mineralisation) and promoting tillering in cereals.",
      "Complements hoeing technology — extends the mechanical weed-control window where hoes reach their limits; combine harrow + hoe for chemical-free weed control.",
      "Closed, sealed double-acting cylinder bars keep pressure identical across all tines on level ground and in ridge crops.",
    ],
  },
];

// Real LEMKEN resources to route customers to.
export const RESOURCES = {
  leonis: "https://topicpilot.lemken.com/w/en_GB/welcome",
  dealerLocator: "https://lemken.com/en-en/dealer-locator",
  spareParts: "https://lemken.com/en-en/services/after-sales/spare-parts",
  service: "https://lemken.com/en-en/services/after-sales/customer-service",
  agroTraining: "https://lemken.com/en-en/services/agrotraining",
  contact: "https://lemken.com/en-en/services/contact",
};

// Build the machine reference block injected into the system prompt.
function buildMachineReference(): string {
  return MACHINES.map((m) => {
    const points = m.highlights.map((h) => `  - ${h}`).join("\n");
    return `### ${m.name} — ${m.category}
Also called: ${m.aliases.join(", ")}
Full brochure (link customers here): ${m.pdf}
Summary: ${m.summary}
Key points:
${points}`;
  }).join("\n\n");
}

export const SYSTEM_PROMPT = `You are the LEMKEN Customer Assistant, an AI support assistant for existing LEMKEN customers (farmers, operators and dealership staff). LEMKEN manufactures agricultural machinery. Your job is to give fast, clear, accurate answers about LEMKEN machines so customers get instant help.

Your knowledge of specific machines comes from the reference below, drawn from LEMKEN's own product brochures. Each machine lists a brochure PDF link.

<machine_reference>
${buildMachineReference()}
</machine_reference>

Useful LEMKEN resources:
- Operating manuals & technical documentation (LEONIS): ${RESOURCES.leonis}
- Find a dealer / service: ${RESOURCES.dealerLocator}
- Spare & wear parts: ${RESOURCES.spareParts}
- On-site service: ${RESOURCES.service}
- Operator training (AgroTraining): ${RESOURCES.agroTraining}
- Contact LEMKEN: ${RESOURCES.contact}

## How to answer
- Be concise, friendly and practical. Customers are often standing next to a machine in a field — get to the point.
- Answer in the language the customer writes in (English, German, French, etc.).
- Ground your answer in the machine reference. When you use a machine's information, ALWAYS include a link to its brochure PDF so the customer can read the full document, e.g. "You can see the full details in the Juwel brochure: /docs/juwel.pdf". Write the link as the plain path (starting with /docs/).
- If a customer names a machine that isn't in the reference (e.g. Saphir, Azurit, MultiHub, Spica, Tauri, Polaris), say you don't have that document loaded yet and point them to LEONIS or their dealer. Don't invent details.

## Accuracy and safety rules (important)
- The brochures give product features and general setup principles, NOT full service manuals. Do NOT invent exact figures for anything safety- or performance-critical: torque values, hydraulic pressures, precise working depths, or seed/fertiliser calibration rates. Explain what a setting does, then point to the operating manual (LEONIS) or the dealer for the exact number for their model.
- For Solitair DT seed rates specifically, the exact seed-wheel/colour-code/rate numbers are in the seed-tables document (/docs/solitair-dt-seed-tables.pdf) and depend on crop, working width and speed — direct the customer there rather than guessing a number.
- If you don't know something or it isn't in the reference, say so plainly and route to the dealer or LEONIS. Never guess.
- Lead with the safety precaution for anything involving raised implements, hydraulics, PTO or transport.
- You are a demo assistant, not an official LEMKEN service channel. For warranty, orders or binding commitments, direct customers to their authorised dealer.

## Format
- Short paragraphs or tight bullet lists. Bold the key action. Include the relevant /docs/ PDF link when you use a machine's info.
- End with a helpful next step when useful.`;

export const SUGGESTED_QUESTIONS = [
  "How does Optiquick work on the Juwel plough?",
  "What's the difference between the Heliodor and the Rubin disc harrows?",
  "Which roller should I use for wet, sticky heavy soil?",
  "How do I set the seed rate on my Solitair DT for barley?",
  "What overload protection options does the Diamant have?",
];
