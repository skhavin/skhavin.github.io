export const MAIN_SITE_ORIGIN = 'https://skhavin.in';
export const REMOTE_PUBLICATIONS_URL = `${MAIN_SITE_ORIGIN}/publications.json`;

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

export interface PublicationsPayload {
  publications: Publication[];
}

export type SortOrder = 'newest' | 'oldest';
export type ViewMode = 'list' | 'grid';

export const CANONICAL_FILTER_ORDER = [
  'all',
  'nlp',
  'interpretability',
  'efficient',
  'cv',
  'neuro',
] as const;

export const FILTER_LABELS: Record<string, string> = {
  all: 'All Papers',
  nlp: 'NLP & Reasoning',
  interpretability: 'Interpretability',
  efficient: 'Efficient AI',
  cv: 'Computer Vision',
  neuro: 'Neuro',
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

/** Resolve relative portfolio paths (such as thumbnails or /blog/ links) against skhavin.in. */
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

/** Normalize raw JSON entries from skhavin.in/publications.json into strict typed publications. */
export function normalizePublication(raw: unknown, index = 0): Publication | null {
  if (!raw || typeof raw !== 'object') return null;
  const item = raw as Record<string, unknown>;
  const title = typeof item.title === 'string' ? item.title.trim() : '';
  if (!title) return null;

  const year =
    typeof item.year === 'number' && Number.isFinite(item.year)
      ? item.year
      : new Date().getFullYear();

  const rawLinks = Array.isArray(item.links) ? item.links : [];
  const links: PublicationLink[] = [];
  for (const entry of rawLinks) {
    if (!entry || typeof entry !== 'object') continue;
    const linkObj = entry as Record<string, unknown>;
    const label = typeof linkObj.label === 'string' ? linkObj.label.trim() : '';
    const url = typeof linkObj.url === 'string' ? resolveSiteUrl(linkObj.url) : '';
    if (!label || !url) continue;
    links.push({
      label,
      url,
      primary: Boolean(linkObj.primary),
    });
  }

  return {
    id: typeof item.id === 'string' && item.id.trim() ? item.id.trim() : `paper-${index + 1}`,
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

/** Parse a publications payload object safely. */
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

/** Fetch publications from skhavin.in with a short timeout and fallback payload support. */
export async function fetchPublications(
  fallbackData: unknown,
  options: { timeoutMs?: number; noCache?: boolean } = {}
): Promise<{ publications: Publication[]; source: 'live' | 'snapshot' }> {
  const { timeoutMs = 4500, noCache = false } = options;
  const fallback = parsePublicationsPayload(fallbackData);

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const res = await fetch(REMOTE_PUBLICATIONS_URL, {
      signal: controller.signal,
      cache: noCache ? 'no-store' : 'default',
      headers: { Accept: 'application/json' },
    });
    if (!res.ok) {
      return { publications: fallback, source: 'snapshot' };
    }
    const json: unknown = await res.json();
    const parsed = parsePublicationsPayload(json);
    if (parsed.length === 0 && fallback.length > 0) {
      return { publications: fallback, source: 'snapshot' };
    }
    return { publications: parsed, source: 'live' };
  } catch {
    return { publications: fallback, source: 'snapshot' };
  } finally {
    clearTimeout(timer);
  }
}

/** Compute ordered filter keys across the current dataset. */
export function getAvailableFilters(publications: Publication[]): string[] {
  const present = new Set<string>();
  for (const pub of publications) {
    for (const f of pub.filters) present.add(f);
  }

  const ordered: string[] = ['all'];
  for (const key of CANONICAL_FILTER_ORDER) {
    if (key !== 'all' && present.has(key)) {
      ordered.push(key);
      present.delete(key);
    }
  }
  for (const extra of present) {
    ordered.push(extra);
  }
  return ordered;
}

export function formatFilterLabel(key: string): string {
  return FILTER_LABELS[key] ?? key.toUpperCase();
}

export function sortPublications(publications: Publication[], order: SortOrder): Publication[] {
  return [...publications].sort((a, b) => {
    const ta = Date.parse(a.timestamp || a.date || `${a.year}-01-01`) || 0;
    const tb = Date.parse(b.timestamp || b.date || `${b.year}-01-01`) || 0;
    return order === 'newest' ? tb - ta : ta - tb;
  });
}

export function filterPublications(
  publications: Publication[],
  filter: string,
  query: string,
  order: SortOrder
): Publication[] {
  const q = query.trim().toLowerCase();
  const filtered = publications.filter((pub) => {
    if (filter !== 'all' && !pub.filters.includes(filter)) {
      return false;
    }
    if (!q) return true;

    const haystack = [
      pub.title,
      pub.authors,
      pub.venue,
      pub.abstract.replace(/<[^>]+>/g, ' '),
      ...pub.tags,
    ]
      .join(' ')
      .toLowerCase();

    return haystack.includes(q);
  });

  return sortPublications(filtered, order);
}

/** Allow safe formatting markup in paper abstracts while preserving inline LaTeX math. */
export function sanitizeAbstractHtml(raw: string): string {
  if (!raw) return '';

  const withoutDangerousBlocks = raw
    .replace(/<(script|style|iframe|object|embed)\b[\s\S]*?<\/\1>/gi, '')
    .replace(/<(script|style|iframe|object|embed)\b[^>]*\/?>/gi, '');

  return withoutDangerousBlocks.replace(
    /<(\/?)([a-zA-Z][a-zA-Z0-9-]*)\b([^>]*)>/g,
    (match, slash: string, tagRaw: string, attrs: string) => {
      const tag = tagRaw.toLowerCase();
      if (!ALLOWED_TAGS.has(tag)) {
        return '';
      }
      if (slash) {
        return tag === 'br' ? '' : `</${tag}>`;
      }
      if (tag === 'a') {
        const hrefMatch = attrs.match(/\bhref\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+))/i);
        const rawHref = hrefMatch?.[1] ?? hrefMatch?.[2] ?? hrefMatch?.[3] ?? '';
        const safeHref = rawHref.trim();
        if (/^(javascript|vbscript|data):/i.test(safeHref) || !safeHref) {
          return '<a>';
        }
        const resolved = resolveSiteUrl(safeHref).replace(/"/g, '&quot;');
        return `<a href="${resolved}" target="_blank" rel="noopener noreferrer">`;
      }
      return tag === 'br' ? '<br>' : `<${tag}>`;
    }
  );
}

export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/** Build a clean BibTeX entry for one-click academic citation copying. */
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
  if (pub.venue) {
    lines.push(`  howpublished = {${pub.venue}},`);
  }
  if (primaryLink?.url) {
    lines.push(`  url          = {${primaryLink.url}},`);
  }
  lines.push('}');
  return lines.join('\n');
}
