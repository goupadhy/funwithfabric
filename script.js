/* =============================================
   Fun With Fabric – Main Script
   ============================================= */

document.addEventListener('DOMContentLoaded', () => {
  // ---- Render customer success stories ----
  if (typeof customerStories !== 'undefined') {
    renderCustomerStories(customerStories);
  }

  // ---- Render fabric samples ----
  renderFabricSamples(fabricSamples);

  // ---- Render resources ----
  renderResources(resources);

  // ---- Build fabric type filter chips ----
  buildFabricFilters();

  // ---- Build resource category chips ----
  buildResourceFilters();

  // ---- Search ----
  const searchInput = document.getElementById('search-input');
  if (searchInput) {
    searchInput.addEventListener('input', () => {
      applyFabricFilters();
    });
  }

  // ---- Mobile nav toggle ----
  const navToggle = document.getElementById('nav-toggle');
  const navLinks = document.getElementById('nav-links');
  if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
      const isOpen = navLinks.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', String(isOpen));
    });
  }

  // ---- Back to top ----
  const backToTop = document.getElementById('back-to-top');
  if (backToTop) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 400) {
        backToTop.classList.add('visible');
      } else {
        backToTop.classList.remove('visible');
      }
    }, { passive: true });

    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // ---- Highlight active nav link on scroll ----
  highlightNavOnScroll();

  // ---- Initialize games ----
  if (typeof initMatchGame === 'function') {
    initMatchGame();
  }
  if (typeof initSpeedGame === 'function') {
    initSpeedGame();
  }
});

/* =============================================
   FABRIC SAMPLES
   ============================================= */

let activeTypeFilter = 'all';
let activeSearch = '';

/* Workload → inline-SVG icon. Stroke uses currentColor so it can be tinted
   per-card via CSS (we render white-on-color since the swatch background is
   the workload's brand color). */
const WORKLOAD_ICONS = {
  'Data Engineering':
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M14.7 6.3a4 4 0 1 1 3 3l-9 9H5v-3.7l9-9z"/><path d="M13 8l3 3"/></svg>',
  'Data Factory':
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 21V10l5 3V10l5 3V7l8 4v10z"/><path d="M3 21h18"/></svg>',
  'Data Warehouse':
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><ellipse cx="12" cy="5" rx="8" ry="2.5"/><path d="M4 5v6c0 1.4 3.6 2.5 8 2.5s8-1.1 8-2.5V5"/><path d="M4 11v6c0 1.4 3.6 2.5 8 2.5s8-1.1 8-2.5v-6"/></svg>',
  'Real-Time Intelligence':
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M13 2L4 14h7l-1 8 9-12h-7z"/></svg>',
  'Power BI':
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="13" width="4" height="8" rx="1"/><rect x="10" y="8" width="4" height="13" rx="1"/><rect x="17" y="3" width="4" height="18" rx="1"/></svg>',
  'Data Science':
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="3"/><ellipse cx="12" cy="12" rx="10" ry="4"/><ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(60 12 12)"/><ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(120 12 12)"/></svg>',
  'OneLake':
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 12c2-2 4-2 6 0s4 2 6 0 4-2 6 0"/><path d="M3 17c2-2 4-2 6 0s4 2 6 0 4-2 6 0"/><path d="M3 7c2-2 4-2 6 0s4 2 6 0 4-2 6 0"/></svg>',
  'Mirroring':
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="5" width="7" height="14" rx="1.5"/><rect x="14" y="5" width="7" height="14" rx="1.5"/><path d="M10 12h4"/><path d="M12.5 10.5L14 12l-1.5 1.5"/><path d="M11.5 13.5L10 12l1.5-1.5"/></svg>',
  'Databases':
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><ellipse cx="12" cy="6" rx="8" ry="2.5"/><path d="M4 6v12c0 1.4 3.6 2.5 8 2.5s8-1.1 8-2.5V6"/><path d="M4 12c0 1.4 3.6 2.5 8 2.5s8-1.1 8-2.5"/></svg>',
  'AI':
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3l2 4 4 2-4 2-2 4-2-4-4-2 4-2z"/><path d="M19 14l1 2 2 1-2 1-1 2-1-2-2-1 2-1z"/></svg>',
  'Governance':
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z"/><path d="M9 12l2 2 4-4"/></svg>',
};

function workloadIcon(fabric) {
  const key = fabric.type || fabric.name;
  return WORKLOAD_ICONS[key] || WORKLOAD_ICONS[fabric.name] || '';
}

/* Pick icon stroke color based on swatch luminance so light swatches
   (e.g. Power BI yellow) get a dark icon and dark swatches get white. */
function iconColorFor(hex) {
  const c = (hex || '').replace('#', '');
  if (c.length !== 6) return '#fff';
  const r = parseInt(c.slice(0, 2), 16) / 255;
  const g = parseInt(c.slice(2, 4), 16) / 255;
  const b = parseInt(c.slice(4, 6), 16) / 255;
  // Relative luminance (sRGB approximation)
  const lum = 0.2126 * r + 0.7152 * g + 0.0722 * b;
  return lum > 0.6 ? '#0E5C4F' : '#fff';
}

function buildFabricFilters() {
  const types = ['all', ...new Set(fabricSamples.map(f => f.type))].sort((a, b) =>
    a === 'all' ? -1 : b === 'all' ? 1 : a.localeCompare(b)
  );

  const container = document.getElementById('fabric-type-chips');
  if (!container) return;

  container.innerHTML = types
    .map(
      t => `<button class="chip ${t === 'all' ? 'active' : ''}" data-type="${t}">${
        t === 'all' ? 'All Types' : t
      }</button>`
    )
    .join('');

  container.addEventListener('click', e => {
    const chip = e.target.closest('.chip');
    if (!chip) return;
    activeTypeFilter = chip.dataset.type;
    container.querySelectorAll('.chip').forEach(c => c.classList.remove('active'));
    chip.classList.add('active');
    applyFabricFilters();
  });
}

function applyFabricFilters() {
  const searchInput = document.getElementById('search-input');
  activeSearch = searchInput ? searchInput.value.trim().toLowerCase() : '';

  const filtered = fabricSamples.filter(fabric => {
    const matchesType =
      activeTypeFilter === 'all' || fabric.type === activeTypeFilter;
    const searchTarget = [
      fabric.name,
      fabric.type,
      fabric.color,
      fabric.description,
      ...fabric.uses,
      ...fabric.tags,
    ]
      .join(' ')
      .toLowerCase();
    const matchesSearch = !activeSearch || searchTarget.includes(activeSearch);
    return matchesType && matchesSearch;
  });

  renderFabricSamples(filtered);
}

function renderFabricSamples(samples) {
  const grid = document.getElementById('fabric-grid');
  if (!grid) return;

  if (samples.length === 0) {
    grid.innerHTML = `
      <div class="no-results">
        <div class="no-results-icon">🔍</div>
        <p>No fabric samples match your search. Try adjusting your filters.</p>
      </div>`;
    return;
  }

  grid.innerHTML = samples.map((f, i) => fabricCardHTML(f, i)).join('');
}

function fabricCardHTML(fabric, index) {
  const usesHTML = fabric.uses
    .map(u => `<span class="use-tag">${u}</span>`)
    .join('');
  const tagsHTML = fabric.tags
    .map(t => `<span class="fabric-tag">#${t}</span>`)
    .join('');

  const icon = workloadIcon(fabric);
  const iconColor = iconColorFor(fabric.colorHex);

  return `
    <article class="fabric-card" style="animation-delay:${index * 0.04}s" aria-label="${fabric.name}">
      <div class="fabric-swatch" style="background-color:${fabric.colorHex}; color:${iconColor};" role="img" aria-label="${fabric.name} icon">
        ${icon}
      </div>
      <div class="fabric-body">
        <div class="fabric-meta">
          <span class="fabric-type-badge">${fabric.type}</span>
          <span class="fabric-weight">${fabric.weight}</span>
        </div>
        <h3 class="fabric-name">${fabric.name}</h3>
        <div class="fabric-color">
          <span class="color-dot" style="background:${fabric.colorHex};"></span>
          ${fabric.color}
        </div>
        <p class="fabric-description">${fabric.description}</p>
        <div class="fabric-uses" aria-label="Common uses">${usesHTML}</div>
        <div class="fabric-tags" aria-label="Tags">${tagsHTML}</div>
      </div>
    </article>`;
}

/* =============================================
   RESOURCES
   ============================================= */

let activeResourceCategory = 'all';

function buildResourceFilters() {
  const categories = ['all', ...new Set(resources.map(r => r.category))].sort(
    (a, b) => (a === 'all' ? -1 : b === 'all' ? 1 : a.localeCompare(b))
  );

  const container = document.getElementById('resource-category-chips');
  if (!container) return;

  container.innerHTML = categories
    .map(
      c => `<button class="chip ${c === 'all' ? 'active' : ''}" data-category="${c}">${
        c === 'all' ? 'All Categories' : c
      }</button>`
    )
    .join('');

  container.addEventListener('click', e => {
    const chip = e.target.closest('.chip');
    if (!chip) return;
    activeResourceCategory = chip.dataset.category;
    container.querySelectorAll('.chip').forEach(c => c.classList.remove('active'));
    chip.classList.add('active');
    applyResourceFilters();
  });
}

function applyResourceFilters() {
  const filtered =
    activeResourceCategory === 'all'
      ? resources
      : resources.filter(r => r.category === activeResourceCategory);
  renderResources(filtered);
}

function renderResources(items) {
  const grid = document.getElementById('resources-grid');
  if (!grid) return;

  if (items.length === 0) {
    grid.innerHTML = `
      <div class="no-results">
        <div class="no-results-icon">📭</div>
        <p>No resources found for this category.</p>
      </div>`;
    return;
  }

  grid.innerHTML = items.map((r, i) => resourceCardHTML(r, i)).join('');
}

function resourceCardHTML(resource, index) {
  const isExternal = resource.url !== '#' && !resource.url.startsWith('/');
  const linkAttr = isExternal
    ? `target="_blank" rel="noopener noreferrer"`
    : '';

  return `
    <a class="resource-card" href="${resource.url}" ${linkAttr}
       style="animation-delay:${index * 0.04}s"
       aria-label="${resource.title}">
      <div class="resource-card-top">
        <span class="resource-icon" aria-hidden="true">${resource.icon}</span>
        <div class="resource-info">
          <div class="resource-category-badge">${resource.category}</div>
          <div class="resource-title">${resource.title}</div>
        </div>
      </div>
      <p class="resource-description">${resource.description}</p>
      <span class="resource-link">
        ${isExternal ? 'Visit site' : 'Learn more'} →
      </span>
    </a>`;
}

/* =============================================
   CUSTOMER SUCCESS STORIES
   ============================================= */

function renderCustomerStories(stories) {
  const grid = document.getElementById('customers-grid');
  if (!grid) return;

  grid.innerHTML = stories.map((s, i) => customerCardHTML(s, i)).join('');
}

function customerCardHTML(story, index) {
  const accent = story.accent || '#117865';
  return `
    <a class="customer-card" href="${story.url}" target="_blank" rel="noopener noreferrer"
       style="animation-delay:${index * 0.05}s; --customer-accent:${accent};"
       aria-label="${story.company} — Microsoft Fabric customer story">
      <div class="customer-card-head">
        <div class="customer-logo" aria-hidden="true">${story.monogram}</div>
        <div class="customer-meta">
          <div class="customer-name">${story.company}</div>
          <div class="customer-industry">${story.industry}</div>
        </div>
      </div>
      <div class="customer-workload">${story.workload}</div>
      <p class="customer-summary">${story.summary}</p>
      <span class="customer-link">Read the story ↗</span>
    </a>`;
}

/* =============================================
   NAV SCROLL HIGHLIGHT
   ============================================= */
function highlightNavOnScroll() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');

  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          navLinks.forEach(link => {
            link.classList.toggle(
              'active',
              link.getAttribute('href') === `#${entry.target.id}`
            );
          });
        }
      });
    },
    { rootMargin: '-30% 0px -60% 0px' }
  );

  sections.forEach(s => observer.observe(s));
}
