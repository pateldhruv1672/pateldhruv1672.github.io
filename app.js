(() => {
  const qs = (selector, root = document) => root.querySelector(selector);
  const qsa = (selector, root = document) => [...root.querySelectorAll(selector)];
  const projects = window.PROJECTS || {};

  requestAnimationFrame(() => document.body.classList.add('page-ready'));

  const menu = qs('.mobile-nav');
  const toggle = qs('.menu-toggle');
  if (toggle && menu) {
    toggle.addEventListener('click', () => {
      const open = menu.classList.toggle('open');
      toggle.setAttribute('aria-expanded', String(open));
      menu.setAttribute('aria-hidden', String(!open));
    });
    qsa('a', menu).forEach(link => link.addEventListener('click', () => {
      menu.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
      menu.setAttribute('aria-hidden', 'true');
    }));
  }

  const featuredIds = ['go2', 'xarm', 'world3d'];
  const gridIds = ['eval', 'photos', 'degree', 'pinecone', 'avian'];

  const mediaBadge = project => project.videos?.length
    ? '<span class="media-badge"><span>▶</span> Video + story</span>'
    : '<span class="media-badge text-only">Story</span>';

  const featured = qs('#featured-work');
  if (featured) {
    featured.innerHTML = featuredIds.map((id, index) => {
      const project = projects[id];
      return `<a class="feature-card reveal ${index % 2 ? 'reverse' : ''}" href="project.html?id=${id}" aria-label="Read story: ${project.title}">
        <div class="feature-media ${/\.svg(?:$|\?)/i.test(project.image) ? 'illustration-media' : ''}" style="view-transition-name: project-media-${id}">
          <img src="${project.image}" alt="${project.title} project visual" loading="${index ? 'lazy' : 'eager'}" />
          ${mediaBadge(project)}
        </div>
        <div class="feature-content">
          <div>
            <span class="project-index">0${index + 1} · ${project.category}</span>
            <h3>${project.title}</h3>
            <p>${project.short}</p>
            <div class="project-meta"><span>${project.role}</span><span>${project.year}</span></div>
          </div>
          <span class="project-action">Read the project story <span>↗</span></span>
        </div>
      </a>`;
    }).join('');
  }

  const grid = qs('#project-grid');
  if (grid) {
    grid.innerHTML = gridIds.map(id => {
      const project = projects[id];
      return `<a class="project-card reveal" href="project.html?id=${id}" aria-label="Read story: ${project.title}">
        <div class="project-card-media ${/\.svg(?:$|\?)/i.test(project.image) ? 'illustration-media' : ''}" style="view-transition-name: project-media-${id}">
          <img src="${project.image}" alt="${project.title} project visual" loading="lazy" />
          ${mediaBadge(project)}
        </div>
        <div class="project-card-copy">
          <p class="card-category">${project.category}</p>
          <h3>${project.title}</h3>
          <p>${project.short}</p>
          <div class="card-footer"><span>${project.year}</span><span>Read story ↗</span></div>
        </div>
      </a>`;
    }).join('');
  }

  const archive = qs('#archive-list');
  if (archive) {
    archive.innerHTML = (window.PROJECT_ARCHIVE || []).map(project => `<a class="archive-row ${project.image ? 'has-image' : ''}" href="${project.url}" target="_blank" rel="noreferrer">
      ${project.image ? `<span class="archive-thumb"><img src="${project.image}" alt="${project.title} interface" loading="lazy" /></span>` : ''}
      <h3>${project.title}</h3><p>${project.note}</p><span class="archive-stack">${project.stack}</span><span class="archive-arrow">↗</span>
    </a>`).join('');
  }

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -30px' });
  qsa('.reveal').forEach(element => observer.observe(element));
})();
