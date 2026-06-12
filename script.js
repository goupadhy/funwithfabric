/* =============================================
   Fun With Fabric – Main Script
   ============================================= */

document.addEventListener('DOMContentLoaded', () => {
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
});

/* =============================================
   FABRIC SAMPLES
   ============================================= */

let activeTypeFilter = 'all';
let activeSearch = '';

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

  return `
    <article class="fabric-card" style="animation-delay:${index * 0.04}s" aria-label="${fabric.name}">
      <div class="fabric-swatch" style="background-color:${fabric.colorHex};" role="img" aria-label="${fabric.color} fabric swatch">
        🧵
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
