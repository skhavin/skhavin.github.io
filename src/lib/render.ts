import {
  MAIN_SITE_ORIGIN,
  escapeHtml,
  formatFilterLabel,
  sanitizeAbstractHtml,
  type Publication,
} from './publications';

/** Render a single publication card identically for both Astro SSR and live client updates. */
export function renderPaperCardHtml(pub: Publication, index: number): string {
  const num = String(index + 1).padStart(2, '0');
  const primaryUrl = pub.links.find((l) => l.primary)?.url ?? pub.links[0]?.url ?? '';

  const titleHtml = primaryUrl
    ? `<a href="${escapeHtml(primaryUrl)}" target="_blank" rel="noopener noreferrer" class="paper-title-link">${escapeHtml(pub.title)}</a>`
    : `<span>${escapeHtml(pub.title)}</span>`;

  const venueHtml = pub.venue
    ? `<span class="meta-sep" aria-hidden="true">/</span><span class="paper-venue">${escapeHtml(pub.venue)}</span>`
    : '';

  const tagsHtml = pub.tags.length
    ? `<ul class="paper-tags" aria-label="Topics">${pub.tags
        .map((tag) => `<li class="paper-tag">${escapeHtml(tag)}</li>`)
        .join('')}</ul>`
    : '';

  const linksHtml = pub.links
    .map((link) => {
      const cls = link.primary ? 'action-btn action-primary' : 'action-btn';
      return `<a href="${escapeHtml(link.url)}" target="_blank" rel="noopener noreferrer" class="${cls}">${escapeHtml(link.label)}</a>`;
    })
    .join('');

  const mediaHtml = pub.image
    ? `
      <figure class="paper-media">
        <button
          type="button"
          class="media-trigger"
          data-lightbox-src="${escapeHtml(pub.image)}"
          data-lightbox-title="${escapeHtml(pub.title)}"
          aria-label="Inspect figure for ${escapeHtml(pub.title)}"
        >
          <img
            src="${escapeHtml(pub.image)}"
            alt="Figure for ${escapeHtml(pub.title)}"
            loading="lazy"
            decoding="async"
          />
          <span class="media-badge">Inspect</span>
        </button>
      </figure>
    `
    : '';

  return `
    <article class="paper-card${pub.image ? ' has-media' : ''}" data-paper-id="${escapeHtml(pub.id)}">
      <div class="paper-body">
        <div class="paper-meta">
          <span class="paper-index">${num}</span>
          <span class="meta-sep" aria-hidden="true">·</span>
          <time class="paper-date">${escapeHtml(pub.date)}</time>
          ${venueHtml}
        </div>
        <h2 class="paper-title">${titleHtml}</h2>
        <p class="paper-authors">${escapeHtml(pub.authors)}</p>
        <div class="paper-abstract">${sanitizeAbstractHtml(pub.abstract)}</div>
        ${tagsHtml}
        <div class="paper-actions">
          ${linksHtml}
          <button
            type="button"
            class="action-btn action-cite"
            data-cite-id="${escapeHtml(pub.id)}"
          >
            BibTeX
          </button>
        </div>
      </div>
      ${mediaHtml}
    </article>
  `;
}

/** Render the publications list or an editorial empty/loading state. */
export function renderPublicationsListHtml(
  publications: Publication[],
  options: { totalCount: number; isLoading?: boolean }
): string {
  const { totalCount, isLoading = false } = options;

  if (publications.length > 0) {
    return publications.map((pub, idx) => renderPaperCardHtml(pub, idx)).join('');
  }

  if (isLoading && totalCount === 0) {
    return `
      <div class="empty-state">
        <p class="empty-eyebrow">Synchronizing Archive</p>
        <h3 class="empty-title">Fetching papers from skhavin.in…</h3>
        <p class="empty-copy">
          Pulling the live publication feed from
          <a href="${MAIN_SITE_ORIGIN}/research" target="_blank" rel="noopener noreferrer">${MAIN_SITE_ORIGIN}/research</a>.
        </p>
      </div>
    `;
  }

  if (totalCount === 0) {
    return `
      <div class="empty-state">
        <p class="empty-eyebrow">Feed Unavailable</p>
        <h3 class="empty-title">Waiting for skhavin.in/publications.json</h3>
        <p class="empty-copy">
          Unable to reach the live publication feed right now. You can retry syncing or inspect the full archive directly on the main site.
        </p>
        <div class="empty-actions">
          <button type="button" class="action-btn action-primary" data-retry-sync>Retry Sync</button>
          <a href="${MAIN_SITE_ORIGIN}/research" target="_blank" rel="noopener noreferrer" class="action-btn">↗ Open skhavin.in/research</a>
        </div>
      </div>
    `;
  }

  return `
    <div class="empty-state">
      <p class="empty-eyebrow">No Matches</p>
      <h3 class="empty-title">No papers match your active filter.</h3>
      <p class="empty-copy">Clear the search query or switch back to All Papers.</p>
      <div class="empty-actions">
        <button type="button" class="action-btn action-primary" data-reset-filters>Reset Filters</button>
      </div>
    </div>
  `;
}

/** Render filter pills consistently on SSR and after live feed updates. */
export function renderFilterPillsHtml(filters: string[], activeFilter: string): string {
  return filters
    .map((key) => {
      const isActive = key === activeFilter;
      return `<button
        type="button"
        class="filter-pill${isActive ? ' is-active' : ''}"
        data-filter="${escapeHtml(key)}"
        aria-pressed="${isActive ? 'true' : 'false'}"
      >${escapeHtml(formatFilterLabel(key))}</button>`;
    })
    .join('');
}
