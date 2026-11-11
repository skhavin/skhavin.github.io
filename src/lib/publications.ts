export const MAIN_SITE_ORIGIN = 'https://skhavin.in';
export const REMOTE_PUBLICATIONS_URL = `${MAIN_SITE_ORIGIN}/publications.json`;

export type ResearchThemeId = 'geometry' | 'inference' | 'multimodal';

export interface ThemeMeta {
  id: ResearchThemeId;
  num: string;
  title: string;
  subtitle: string;
}

export const RESEARCH_THEMES: readonly ThemeMeta[] = [
  {
    id: 'geometry',
    num: '01',
    title: 'Computational Geometry & Interpretability',
    subtitle: 'Causal circuit search, attention head taxonomy, and residual-stream task geometry.',
  },
  {
    id: 'inference',
    num: '02',
    title: 'Efficient Inference',
    subtitle: 'Training-free sparse routing and O(1) proactive KV-cache eviction over frozen models.',
  },
  {
    id: 'multimodal',
    num: '03',
    title: 'Multimodal Intelligence',
    subtitle: 'Linear-time long-form video memory graphs and cross-scale temporal reasoning.',
  },
] as const;

export interface PublicationLink {
  label: string;
  url: string;
  primary?: boolean;
}

export interface Publication {
  id: string;
  title: string;
  authors: string;
  venue: string;
  year: number;
  date: string;
  timestamp: string;
  image?: string;
  abstract: string;
  tags: string[];
  filters: string[];
  links: PublicationLink[];
}

export interface CuratedDetail {
  theme: ResearchThemeId;
  shortTitle?: string;
  statusLabel: string;
  statusKind: 'submitted' | 'preprint';
  summaryLine: string;
  limitations: string;
  extraLinks?: PublicationLink[];
}

/** Explicit manuscript-status badges and limitations curated from primary manuscripts. */
const CURATED_METADATA: Record<string, CuratedDetail> = {
  'k-heads-is-all-you-need': {
    theme: 'inference',
    shortTitle: 'K Heads Is All You Need: Task-Dependent Circuit Granularity & Zero-Training Routing',
    statusLabel: 'Submitted Manuscript · ICLR 2027 (under review)',
    statusKind: 'submitted',
    summaryLine:
      'JCCS (greedy ACDC + CoAx specificity) recovers dynamic task-dependent circuits across Qwen, Llama, and Gemma; sparse for retrieval (5–8/336 heads), dense for variable tracking & code synthesis, with a zero-training Layer-4 cosine router.',
    limitations:
      'Greedy JCCS deflation is structurally blind to suppressive heads (two NIAH suppressors were found only via joint 56-candidate ablation); N=1 model per family; OOD router margin (<1 SD at N=100) needs wider calibration; variable tracking resists sparsification across K ∈ [6, 64].',
  },
  'shape-of-computation': {
    theme: 'geometry',
    shortTitle: 'The Shape of Computation (Trunk & Branch)',
    statusLabel: 'Preprint · Planned ICML submission',
    statusKind: 'preprint',
    summaryLine:
      'CKA-constrained DTW across 720 permutations (p ≈ 0.00139, 3× replicated) reveals universal trunk-and-branch residual geometry built by MLPs—yet steering mature centroids fails causal sufficiency checks (r = 0.049, 0.112 vs. r > 0.7 bar).',
    limitations:
      'Demonstrates geometric universality without causal sufficiency; leaves open why models systematically construct conserved, causally inert geometric trajectories.',
    extraLinks: [
      { label: 'OpenReview', url: 'https://openreview.net/forum?id=Mk4NLvM637' },
      { label: 'Code', url: 'https://github.com/skhavin/taskgeometry' },
    ],
  },
  'necessary-but-not-sufficient': {
    theme: 'geometry',
    shortTitle: 'Necessary But Not Sufficient: Convergent Geometry in the Residual Stream',
    statusLabel: 'Preprint · OpenReview / Zenodo',
    statusKind: 'preprint',
    summaryLine:
      'Falsifies fixed CPU-like Head ISAs across 12 phases (WRITE = 0.311, LOAD = 0.079 recall), isolates the Intersection Circuit, and shows OLS-deconfounded residual geometry generalizes across Qwen2.5, Llama-3.2, and Phi-1.5 (Mantel p < 0.003).',
    limitations:
      'Original fixed-head framing failed only after full 12-phase execution rather than fast pilot verification; directions are causally necessary under knockout but not sufficient for additive steering.',
    extraLinks: [{ label: 'Code', url: 'https://github.com/skhavin/necstuff' }],
  },
  headgenome: {
    theme: 'geometry',
    shortTitle: 'The HeadGenome Taxonomy: Structural & Causal Map of 1,568 Attention Heads',
    statusLabel: 'Preprint · OpenReview / Zenodo',
    statusKind: 'preprint',
    summaryLine:
      'Maps 1,568 attention heads into Sink/Local/Retrieval/Induction classes, uncovers a V/Q Frobenius depth law (p = 1.92 × 10⁻¹²⁷), exposes the perplexity illusion, and achieves 13.3× KV compression & up to 2.81× FlexAttention speedup.',
    limitations:
      'Static weight geometry alone cannot separate behavioral head classes; random-covariance null SAEs show comparable qualitative interpretability, distinguishable mainly by L₀ sparsity (4.57 vs. 51.07).',
  },
  'o1-decode-step-attention': {
    theme: 'inference',
    shortTitle: 'O(1) Decode Step Attention via Training-Free Proactive KV Cache Eviction',
    statusLabel: 'Preprint · Zenodo',
    statusKind: 'preprint',
    summaryLine:
      'Offline attention prototype clustering + TF-IDF ingest routing bounds KV cache to budget B, yielding O(B²) = O(1) decode attention per token and 3.09× speedup / 4.6× PPL gain on LLaMA 3.1 8B with zero gradient updates.',
    limitations:
      'Relies on offline calibration prototypes matching inference distributions; ultra-dense state-tracking workloads remain bounded by fixed KV budget B.',
  },
  'trinetra-2026': {
    theme: 'multimodal',
    shortTitle: 'Trinetra: O(N) Video Ingest, O(1) Query — Proactive Temporal Event Graph',
    statusLabel: 'Preprint · OpenReview / Zenodo',
    statusKind: 'preprint',
    summaryLine:
      'Temporal Event Graph + Multi-Scale Temporal Attention Shift (TAS₂, TAS₈, TAS₃₂) + dual FAISS index compresses 20-minute video into linear O(N) ingest and O(1) retrieval (9× temporal awareness, 317,500× fewer query FLOPs).',
    limitations:
      'Static threshold/graph construction trades dense per-frame visual grounding for O(1) event lookup speed.',
    extraLinks: [{ label: 'Essay', url: '/blog/trinetra-overview' }],
  },
};

const ALLOWED_TAGS = new Set([
  'strong',
  'em',
  'b',
  'i',
  'code',
  'sup',
  'sub',
  'br',
  'p',
  'a',
]);

/** Resolve relative portfolio paths (such as /blog/... links) against skhavin.in. */
export function resolveSiteUrl(url?: string): string {
  if (!url) return '';
  const trimmed = url.trim();
  if (!trimmed) return '';
  if (/^(https?:)?\/\//i.test(trimmed) || trimmed.startsWith('data:')) {
    return trimmed;
  }
  const normalized = trimmed.startsWith('/') ? trimmed : `/${trimmed}`;
  return `${MAIN_SITE_ORIGIN}${normalized}`;
}

function cleanExternalUrl(url: string): string {
  const resolved = resolveSiteUrl(url);
  // Strip noisy OpenReview profile referrer suffixes for crisp academic citations.
  if (/openreview\.net\/forum\?id=/i.test(resolved)) {
    const idMatch = resolved.match(/id=([^&#]+)/i);
    if (idMatch?.[1]) {
      return `https://openreview.net/forum?id=${idMatch[1]}`;
    }
  }
  return resolved;
}

export function normalizePublication(raw: unknown, index = 0): Publication | null {
  if (!raw || typeof raw !== 'object') return null;
  const item = raw as Record<string, unknown>;
  const title = typeof item.title === 'string' ? item.title.trim() : '';
  if (!title) return null;

  const id =
    typeof item.id === 'string' && item.id.trim() ? item.id.trim() : `paper-${index + 1}`;
  const year =
    typeof item.year === 'number' && Number.isFinite(item.year)
      ? item.year
      : new Date().getFullYear();

  const rawLinks = Array.isArray(item.links) ? item.links : [];
  const links: PublicationLink[] = [];
  const seenUrls = new Set<string>();

  const pushLink = (label: string, url: string, primary = false) => {
    const cleaned = cleanExternalUrl(url);
    if (!label || !cleaned || seenUrls.has(cleaned.toLowerCase())) return;
    seenUrls.add(cleaned.toLowerCase());
    links.push({ label: label.replace(/^[↗↑→\s]+/, ''), url: cleaned, primary });
  };

  for (const entry of rawLinks) {
    if (!entry || typeof entry !== 'object') continue;
    const obj = entry as Record<string, unknown>;
    if (typeof obj.label === 'string' && typeof obj.url === 'string') {
      pushLink(obj.label.trim(), obj.url, Boolean(obj.primary));
    }
  }

  for (const extra of CURATED_METADATA[id]?.extraLinks ?? []) {
    pushLink(extra.label, extra.url, Boolean(extra.primary));
  }

  return {
    id,
    title,
    authors: typeof item.authors === 'string' && item.authors.trim() ? item.authors.trim() : 'S. Khavin',
    venue: typeof item.venue === 'string' ? item.venue.trim() : '',
    year,
    date: typeof item.date === 'string' ? item.date.trim() : String(year),
    timestamp: typeof item.timestamp === 'string' ? item.timestamp.trim() : `${year}-01-01`,
    image: typeof item.image === 'string' ? resolveSiteUrl(item.image) : undefined,
    abstract: typeof item.abstract === 'string' ? item.abstract : '',
    tags: Array.isArray(item.tags)
      ? item.tags.filter((t): t is string => typeof t === 'string' && t.trim().length > 0)
      : [],
    filters: Array.isArray(item.filters)
      ? item.filters.filter((f): f is string => typeof f === 'string' && f.trim().length > 0)
      : [],
    links,
  };
}

export function parsePublicationsPayload(payload: unknown): Publication[] {
  if (!payload || typeof payload !== 'object') return [];
  const rawList = (payload as { publications?: unknown }).publications;
  if (!Array.isArray(rawList)) return [];

  const result: Publication[] = [];
  rawList.forEach((entry, idx) => {
    const normalized = normalizePublication(entry, idx);
    if (normalized) result.push(normalized);
  });
  return result;
}

function getDedupeKey(pub: Publication): string {
  for (const link of pub.links) {
    const match = link.url.match(/openreview\.net\/forum\?id=([^&#/]+)/i);
    if (match?.[1]) return `openreview:${match[1].toLowerCase()}`;
  }
  return `id:${pub.id.toLowerCase()}`;
}

export function mergePublications(live: Publication[], fallback: Publication[]): Publication[] {
  if (live.length === 0) return fallback;
  const merged = [...live];
  const seen = new Set(live.map(getDedupeKey));

  for (const item of fallback) {
    const key = getDedupeKey(item);
    if (!seen.has(key)) {
      seen.add(key);
      merged.push(item);
    }
  }
  return merged;
}

export async function fetchPublications(
  fallbackData: unknown,
  options: { timeoutMs?: number; noCache?: boolean } = {}
): Promise<{ publications: Publication[]; source: 'live' | 'snapshot' }> {
  const { timeoutMs = 2500, noCache = false } = options;
  const fallback = parsePublicationsPayload(fallbackData);

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const res = await fetch(REMOTE_PUBLICATIONS_URL, {
      signal: controller.signal,
      cache: noCache ? 'no-store' : 'default',
      headers: { Accept: 'application/json' },
    });
    if (!res.ok) return { publications: fallback, source: 'snapshot' };
    const json: unknown = await res.json();
    const parsed = parsePublicationsPayload(json);
    if (parsed.length === 0) return { publications: fallback, source: 'snapshot' };
    return {
      publications: mergePublications(parsed, fallback),
      source: 'live',
    };
  } catch {
    return { publications: fallback, source: 'snapshot' };
  } finally {
    clearTimeout(timer);
  }
}

/** Resolve theme grouping and explicit manuscript-vs-preprint labeling. */
export function getPublicationMeta(pub: Publication): CuratedDetail {
  const curated = CURATED_METADATA[pub.id];
  if (curated) return curated;

  const filtersLower = pub.filters.map((f) => f.toLowerCase());
  let theme: ResearchThemeId = 'geometry';
  if (filtersLower.includes('video') || filtersLower.includes('cv')) {
    theme = 'multimodal';
  } else if (filtersLower.includes('efficient') && !filtersLower.includes('interpretability')) {
    theme = 'inference';
  }

  const venue = pub.venue || 'OpenReview';
  const isSubmitted = /submit|review|iclr|icml|neurips|cvpr/i.test(venue) && !/zenodo/i.test(venue);

  return {
    theme,
    statusLabel: isSubmitted
      ? `Submitted Manuscript · ${venue}`
      : `Preprint · ${venue}`,
    statusKind: isSubmitted ? 'submitted' : 'preprint',
    summaryLine: pub.abstract.replace(/<[^>]+>/g, '').slice(0, 210).trim() + '…',
    limitations: 'Full experimental controls, methodology, and limitations are documented in the linked preprint.',
  };
}

export function sortPublications(publications: Publication[]): Publication[] {
  return [...publications].sort((a, b) => {
    const ta = Date.parse(a.timestamp || `${a.year}-01-01`) || 0;
    const tb = Date.parse(b.timestamp || `${b.year}-01-01`) || 0;
    return tb - ta;
  });
}

export function sanitizeAbstractHtml(raw: string): string {
  if (!raw) return '';
  const withoutDangerousBlocks = raw
    .replace(/<(script|style|iframe|object|embed)\b[\s\S]*?<\/\1>/gi, '')
    .replace(/<(script|style|iframe|object|embed)\b[^>]*\/?>/gi, '');

  const cleanedHtml = withoutDangerousBlocks.replace(
    /<(\/?)([a-zA-Z][a-zA-Z0-9-]*)\b([^>]*)>/g,
    (_match, slash: string, tagRaw: string, attrs: string) => {
      const tag = tagRaw.toLowerCase();
      if (!ALLOWED_TAGS.has(tag)) return '';
      if (slash) return tag === 'br' ? '' : `</${tag}>`;
      if (tag === 'a') {
        const hrefMatch = attrs.match(/\bhref\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+))/i);
        const rawHref = hrefMatch?.[1] ?? hrefMatch?.[2] ?? hrefMatch?.[3] ?? '';
        const safeHref = rawHref.trim();
        if (/^(javascript|vbscript|data):/i.test(safeHref) || !safeHref) return '<a>';
        return `<a href="${cleanExternalUrl(safeHref).replace(/"/g, '&quot;')}" target="_blank" rel="noopener noreferrer">`;
      }
      return tag === 'br' ? '<br>' : `<${tag}>`;
    }
  );

  // Prevent KaTeX auto-render from pairing dollar amounts (e.g. $1,500 ... $0.01) as inline LaTeX.
  return cleanedHtml.replace(/\$(?=\d)/g, '<span class="no-math">$</span>');
}

export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export function toBibtex(pub: Publication): string {
  const slug = pub.id.replace(/[^a-zA-Z0-9]+/g, '').slice(0, 24) || 'work';
  const key = `khavin${pub.year}${slug}`;
  const primaryLink = pub.links.find((l) => l.primary) ?? pub.links[0];
  const lines = [
    `@misc{${key},`,
    `  author       = {${pub.authors}},`,
    `  title        = {${pub.title}},`,
    `  year         = {${pub.year}},`,
  ];
  if (pub.venue) lines.push(`  howpublished = {${pub.venue}},`);
  if (primaryLink?.url) lines.push(`  url          = {${primaryLink.url}},`);
  lines.push('}');
  return lines.join('\n');
}
