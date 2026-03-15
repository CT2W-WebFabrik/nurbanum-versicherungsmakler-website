/**
 * Shared tab/accordion/search behavior for index pages
 * (versicherungen, spezialisierungen, ratgeber).
 *
 * Usage: import and call initTabAccordionSearch({ searchInputId, cardSelector })
 * from a page-level <script> tag.
 */

interface Options {
  /** ID of the search <input> element */
  searchInputId: string;
  /** CSS selector for filterable cards (e.g. '.search-card', '.guide-card') */
  cardSelector: string;
}

export function initTabAccordionSearch({ searchInputId, cardSelector }: Options) {
  const tabBtns = document.querySelectorAll<HTMLButtonElement>('[data-tab]');
  const sections = document.querySelectorAll<HTMLElement>('[data-audience]');
  const searchInput = document.getElementById(searchInputId) as HTMLInputElement | null;

  function setTab(audience: string) {
    tabBtns.forEach(btn => {
      const active = btn.dataset.tab === audience;
      btn.setAttribute('aria-pressed', String(active));
      btn.className = `tab-btn px-5 py-2.5 text-sm font-semibold rounded-lg transition-colors whitespace-nowrap ${
        active ? 'bg-amber-100 text-amber-800' : 'bg-slate-50 text-navy-700 hover:text-amber-700 hover:bg-amber-50'
      }`;
    });
    sections.forEach(s => s.classList.toggle('hidden', s.dataset.audience !== audience));
    applySearch();
  }

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      setTab(btn.dataset.tab!);
      history.replaceState(null, '', `#${btn.dataset.tab}`);
    });
  });

  // Accordion — exclusive: opening one closes others in the same section
  document.querySelectorAll<HTMLButtonElement>('.accordion-toggle').forEach(btn => {
    btn.addEventListener('click', () => {
      const expanded = btn.getAttribute('aria-expanded') === 'true';
      const section = btn.closest('[data-audience]');
      if (section && !expanded) {
        section.querySelectorAll<HTMLButtonElement>('.accordion-toggle').forEach(other => {
          if (other !== btn) {
            other.setAttribute('aria-expanded', 'false');
            const ob = document.getElementById(other.getAttribute('aria-controls') || '');
            if (ob) ob.dataset.open = 'false';
          }
        });
      }
      btn.setAttribute('aria-expanded', String(!expanded));
      const body = document.getElementById(btn.getAttribute('aria-controls') || '');
      if (body) body.dataset.open = String(!expanded);
    });
  });

  // Search
  function applySearch() {
    const q = (searchInput?.value || '').toLowerCase().trim();
    sections.forEach(section => {
      if (section.classList.contains('hidden')) return;
      const cards = section.querySelectorAll<HTMLElement>(cardSelector);
      const accordions = section.querySelectorAll<HTMLElement>('.category-accordion');
      const noResults = section.querySelector<HTMLElement>('.no-results');
      let total = 0;

      cards.forEach(card => {
        const match = !q || (card.dataset.search || '').includes(q);
        card.classList.toggle('hidden', !match);
        if (match) total++;
      });

      accordions.forEach(acc => {
        const visible = acc.querySelectorAll(`${cardSelector}:not(.hidden)`).length;
        acc.classList.toggle('hidden', visible === 0);
        if (q && visible > 0) {
          const toggle = acc.querySelector<HTMLButtonElement>('.accordion-toggle');
          toggle?.setAttribute('aria-expanded', 'true');
          const body = document.getElementById(toggle?.getAttribute('aria-controls') || '');
          if (body) body.dataset.open = 'true';
        }
      });

      if (noResults) noResults.classList.toggle('hidden', total > 0 || !q);
    });
  }

  searchInput?.addEventListener('input', applySearch);

  document.querySelectorAll('.clear-search').forEach(btn => {
    btn.addEventListener('click', () => {
      if (searchInput) searchInput.value = '';
      sections.forEach(section => {
        section.querySelectorAll<HTMLElement>('.category-accordion').forEach((acc, i) => {
          acc.classList.remove('hidden');
          const toggle = acc.querySelector<HTMLButtonElement>('.accordion-toggle');
          toggle?.setAttribute('aria-expanded', String(i === 0));
          const body = document.getElementById(toggle?.getAttribute('aria-controls') || '');
          if (body) body.dataset.open = String(i === 0);
        });
        section.querySelectorAll<HTMLElement>(cardSelector).forEach(c => c.classList.remove('hidden'));
        section.querySelector<HTMLElement>('.no-results')?.classList.add('hidden');
      });
    });
  });

  // URL hash handling
  const hash = location.hash.slice(1);
  const audience = hash.startsWith('gewerbe') ? 'gewerbe' : 'privat';
  setTab(audience);

  if (hash.includes('-')) {
    const el = document.getElementById(hash);
    if (el) {
      const section = el.closest('[data-audience]');
      if (section) {
        section.querySelectorAll<HTMLButtonElement>('.accordion-toggle').forEach(other => {
          other.setAttribute('aria-expanded', 'false');
          const ob = document.getElementById(other.getAttribute('aria-controls') || '');
          if (ob) ob.dataset.open = 'false';
        });
      }
      const toggle = el.querySelector<HTMLButtonElement>('.accordion-toggle');
      if (toggle) {
        toggle.setAttribute('aria-expanded', 'true');
        const body = document.getElementById(toggle.getAttribute('aria-controls') || '');
        if (body) body.dataset.open = 'true';
        setTimeout(() => el.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);
      }
    }
  }
}
