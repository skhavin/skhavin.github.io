import {
  RESEARCH_THEMES,
  escapeHtml,
  getPublicationMeta,
  sanitizeAbstractHtml,
  sortPublications,
  type Publication,
} from './publications';

const QWEN_SPARSITY_TABLE_HTML = `
  <div class="mini-table-wrap">
    <p class="mini-table-caption">Empirical Circuit Budgets — JCCS on Qwen2.5-1.5B (336 heads: 28 layers × 12 heads, RULER 4K)</p>
    <table class="data-table">
      <thead>
        <tr>
          <th>Task</th>
          <th class="num">Active Heads</th>
          <th class="num">Sparsity</th>
        </tr>
      </thead>
      <tbody>
        <tr><td>Counting / Sorting</td><td class="num">5 / 336</td><td class="num">98.5%</td></tr>
        <tr><td>NIAH Single-Needle</td><td class="num">6 / 336</td><td class="num">98.2%</td></tr>
        <tr><td>NIAH Multi-Key / Multi-Value</td><td class="num">6–8 / 336</td><td class="num">97.6%</td></tr>
        <tr><td>Python Syntax / Primitives</td><td class="num">16 / 336</td><td class="num">95.2%</td></tr>
        <tr><td>Python Semantics</td><td class="num">64 / 336</td><td class="num">81.0%</td></tr>
        <tr><td>LongBench-Qasper</td><td class="num">80 / 336</td><td class="num">76.2%</td></tr>
        <tr><td>Python Composition (100% rec.)</td><td class="num">168 / 336</td><td class="num">50.0%</td></tr>
        <tr><td>Variable Tracking / Common Words / HumanEval</td><td class="num">336 / 336 (Dense)</td><td class="num">0.0%</td></tr>
      </tbody>
    </table>
  </div>
`;

function renderPublicationEntryHtml(pub: Publication, displayIndex: string): string {
  const meta = getPublicationMeta(pub);
  const titleText = meta.shortTitle ?? pub.title;
  const primaryUrl = pub.links.find((l) => l.primary)?.url ?? pub.links[0]?.url ?? '';

  const titleHtml = primaryUrl
    ? `<a href="${escapeHtml(primaryUrl)}" target="_blank" rel="noopener noreferrer" class="paper-title-link">${escapeHtml(titleText)}</a>`
    : `<span>${escapeHtml(titleText)}</span>`;

  const statusClass =
    meta.statusKind === 'submitted' ? 'status-stamp status-submitted' : 'status-stamp';

  const linksHtml = pub.links
    .map(
      (link) =>
        `<a href="${escapeHtml(link.url)}" target="_blank" rel="noopener noreferrer" class="cite-link">[${escapeHtml(link.label.toLowerCase())}]</a>`
    )
    .join(' ');

  const benchmarkAddon =
    pub.id === 'k-heads-is-all-you-need' ? QWEN_SPARSITY_TABLE_HTML : '';

  const tagsLine = pub.tags.length
    ? `<p class="detail-tags"><strong>Topics:</strong> ${pub.tags.map((t) => escapeHtml(t)).join(' · ')}</p>`
    : '';

  return `
    <article class="paper-entry" data-paper-id="${escapeHtml(pub.id)}">
      <div class="paper-meta-row">
        <span class="paper-code">REF ${escapeHtml(displayIndex)}</span>
        <span class="${statusClass}">${escapeHtml(meta.statusLabel)}</span>
        <span class="paper-year">${escapeHtml(pub.date)}</span>
      </div>

      <h4 class="paper-title">${titleHtml}</h4>
      <p class="paper-oneliner">${escapeHtml(meta.summaryLine)}</p>

      <div class="paper-links-row">
        ${linksHtml}
        <button type="button" class="cite-btn" data-cite-id="${escapeHtml(pub.id)}">[bibtex]</button>
      </div>

      <details class="paper-details">
        <summary>Methodology, findings &amp; limitations</summary>
        <div class="paper-details-body">
          <div class="paper-abstract">${sanitizeAbstractHtml(pub.abstract)}</div>
          ${benchmarkAddon}
          <p class="detail-limitations"><strong>Documented Limitations:</strong> ${escapeHtml(meta.limitations)}</p>
          ${tagsLine}
        </div>
      </details>
    </article>
  `;
}

/** Render all publications grouped cleanly under the three core research themes. */
export function renderGroupedResearchHtml(
  publications: Publication[],
  activeTheme: 'all' | 'geometry' | 'inference' | 'multimodal' = 'all',
  query = ''
): string {
  const q = query.trim().toLowerCase();
  const sorted = sortPublications(publications);

  const filtered = sorted.filter((pub) => {
    const meta = getPublicationMeta(pub);
    if (activeTheme !== 'all' && meta.theme !== activeTheme) return false;
    if (!q) return true;

    const haystack = [
      pub.title,
      meta.shortTitle ?? '',
      meta.summaryLine,
      pub.venue,
      pub.abstract.replace(/<[^>]+>/g, ' '),
      ...pub.tags,
    ]
      .join(' ')
      .toLowerCase();
    return haystack.includes(q);
  });

  if (filtered.length === 0) {
    return `<p class="empty-msg">No manuscripts match the current filter. <button type="button" class="cite-btn" data-reset-research>[show all directions]</button></p>`;
  }

  const sections: string[] = [];

  for (const theme of RESEARCH_THEMES) {
    const items = filtered.filter((pub) => getPublicationMeta(pub).theme === theme.id);
    if (items.length === 0) continue;

    const rowsHtml = items
      .map((pub, idx) => renderPublicationEntryHtml(pub, `${theme.num}.${idx + 1}`))
      .join('');

    sections.push(`
      <div class="theme-group" data-theme-group="${theme.id}">
        <div class="theme-head">
          <span class="theme-num">${theme.num}</span>
          <div>
            <h3 class="theme-title">${escapeHtml(theme.title)}</h3>
            <p class="theme-subtitle">${escapeHtml(theme.subtitle)}</p>
          </div>
        </div>
        <div class="theme-entries">
          ${rowsHtml}
        </div>
      </div>
    `);
  }

  return sections.join('');
}
