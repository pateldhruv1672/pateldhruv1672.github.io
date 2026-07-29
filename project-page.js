(() => {
  const params = new URLSearchParams(location.search);
  const id = params.get('id') || 'go2';
  const projects = window.PROJECTS || {};
  const order = (window.PROJECT_ORDER || Object.keys(projects)).filter(key => projects[key]);
  const p = projects[id] || projects[order[0]];
  const activeId = projects[id] ? id : order[0];
  const nextId = order[(order.indexOf(activeId) + 1) % order.length];
  const next = projects[nextId];

  const escapeHTML = (value = '') => String(value).replace(/[&<>'"]/g, character => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;'
  }[character]));

  const isIllustration = source => /\.svg(?:$|\?)/i.test(source || '');
  const firstVideo = p.videos?.[0] || null;
  const gallery = (p.gallery?.length ? p.gallery : [
    { src: p.image, alt: `${p.title} project visual`, caption: p.title, kind: isIllustration(p.image) ? 'illustration' : 'project' }
  ]);

  document.title = `${p.title} — Dhruv Patel`;
  document.querySelector('meta[name="description"]')?.setAttribute('content', p.short);

  const visualCards = (compact = false) => gallery.map((visual, index) => `
    <button type="button" class="side-visual-card js-open-image ${escapeHTML(visual.kind || 'project')} ${compact ? 'compact' : ''}"
      data-image-index="${index}" aria-label="Open ${escapeHTML(visual.caption || visual.alt)}">
      <span class="side-visual-frame">
        <img src="${escapeHTML(visual.src)}" alt="${escapeHTML(visual.alt)}" loading="lazy" />
      </span>
      <span class="side-visual-caption">${escapeHTML(visual.caption || '')}<em>↗</em></span>
    </button>`).join('');

  const chapterHTML = (p.chapters || []).map((chapter, index) => {
    const paragraphs = (chapter.paragraphs || (chapter.body ? [chapter.body] : []))
      .map(paragraph => `<p>${escapeHTML(paragraph)}</p>`).join('');
    const bullets = chapter.bullets?.length ? `
      <ul class="technical-points">
        ${chapter.bullets.map(item => `<li>${escapeHTML(item)}</li>`).join('')}
      </ul>` : '';
    return `
      <section class="blog-section reveal" id="chapter-${index + 1}">
        <p class="blog-section-label">${String(index + 2).padStart(2, '0')}</p>
        <h2>${escapeHTML(chapter.title)}</h2>
        <div class="section-prose">${paragraphs}</div>
        ${bullets}
      </section>`;
  }).join('');

  const factHTML = p.facts?.length ? `
    <div class="project-facts page-enter delay-2">
      ${p.facts.map(fact => `<div><span>${escapeHTML(fact.label)}</span><strong>${escapeHTML(fact.value)}</strong></div>`).join('')}
    </div>` : '';

  const demoHTML = p.videos?.length ? `
    <section class="blog-section demo-section reveal" id="demo">
      <p class="blog-section-label">Media</p>
      <h2>Video demos.</h2>
      <div class="section-prose">
        <p>These clips come from the project recordings and are compressed for the web. Go2 clips keep the original audio. Use the player controls for sound, playback speed, and fullscreen.</p>
      </div>
      <div class="demo-grid">
        ${p.videos.map((video, index) => `
          <button type="button" class="demo-card js-open-video" data-video-index="${index}" aria-label="Play ${escapeHTML(video.label)}">
            <span class="demo-card-visual" style="view-transition-name: project-media-${escapeHTML(activeId)}-${index}">
              <img src="${escapeHTML(video.poster || p.image)}" alt="${escapeHTML(video.label)} preview" loading="lazy" />
              <span class="play-disc" aria-hidden="true">▶</span>
              ${video.duration ? `<span class="clip-duration">${escapeHTML(video.duration)}</span>` : ''}${video.hasAudio ? '<span class="sound-badge">Sound</span>' : ''}
            </span>
            <span class="demo-card-copy">
              <strong>${escapeHTML(video.label)}</strong>
              <small>${escapeHTML(video.caption || 'Project demo')}</small>
            </span>
          </button>`).join('')}
      </div>
    </section>` : '';

  const sourceLinks = [
    p.github ? `<a href="${escapeHTML(p.github)}" target="_blank" rel="noreferrer">Repository <span>GitHub ↗</span></a>` : '',
    ...(p.videos || []).map(video => `<a href="${escapeHTML(video.src)}" target="_blank" rel="noreferrer">${escapeHTML(video.label)} <span>Open MP4 ↗</span></a>`)
  ].filter(Boolean).join('');

  const githubHref = p.github || 'https://github.com/pateldhruv1672';
  const githubLabel = p.github ? 'GitHub repository' : 'GitHub profile';
  const externalLinks = [
    `<a href="${escapeHTML(githubHref)}" target="_blank" rel="noreferrer">${githubLabel} <span>↗</span></a>`,
    firstVideo ? `<button type="button" class="text-button js-open-video" data-video-index="0">Play first demo <span>▶</span></button>` : ''
  ].filter(Boolean).join('');

  const heroActions = [
    `<a class="blog-action blog-action-primary" href="${escapeHTML(githubHref)}" target="_blank" rel="noreferrer"><span>${p.github ? 'View GitHub repository' : 'View GitHub profile'}</span><strong>↗</strong></a>`,
    firstVideo ? `<button type="button" class="blog-action blog-action-secondary js-open-video" data-video-index="0"><span>Watch demo</span><strong>▶</strong></button>` : ''
  ].filter(Boolean).join('');

  const featureVisual = firstVideo
    ? `<button type="button" class="evidence-feature js-open-video" data-video-index="0" aria-label="Play ${escapeHTML(firstVideo.label)}">
        <img src="${escapeHTML(firstVideo.poster || p.image)}" alt="${escapeHTML(firstVideo.label)} preview" />
        <span class="evidence-feature-overlay"><span class="play-disc">▶</span><span><strong>${escapeHTML(firstVideo.label)}</strong><small>${escapeHTML(firstVideo.duration || 'Video')}${firstVideo.hasAudio ? ' · sound' : ''}</small></span></span>
      </button>`
    : `<button type="button" class="evidence-feature js-open-image" data-image-index="0" aria-label="Open ${escapeHTML(gallery[0].caption || gallery[0].alt)}">
        <img src="${escapeHTML(gallery[0].src)}" alt="${escapeHTML(gallery[0].alt)}" />
        <span class="evidence-feature-overlay image-only"><span><strong>${escapeHTML(gallery[0].caption || 'Project image')}</strong><small>Open full size ↗</small></span></span>
      </button>`;

  const illustrationClass = (isIllustration(p.image) || p.coverFit === 'contain') ? 'illustration-cover' : '';
  const root = document.getElementById('project-root');
  root.innerHTML = `
    <div class="reading-progress" aria-hidden="true"><span></span></div>
    <article class="project-blog">
      <header class="blog-hero shell">
        <a class="project-back" href="index.html#work">← Selected work</a>
        <div class="blog-hero-grid">
          <div class="blog-heading page-enter">
            <p class="section-kicker">${escapeHTML(p.category)}</p>
            <h1>${escapeHTML(p.title)}</h1>
            <p class="blog-deck">${escapeHTML(p.short)}</p>
          </div>
          <div class="blog-byline page-enter delay-1">
            <p><strong>Dhruv Patel</strong><br>${escapeHTML(p.role)}</p>
            <p>${escapeHTML(p.year)}<br>${escapeHTML(p.readingTime || '6 min read')}</p>
          </div>
        </div>
        <div class="blog-meta page-enter delay-2">
          <div><span>Role</span><strong>${escapeHTML(p.role)}</strong></div>
          <div><span>Timeline</span><strong>${escapeHTML(p.year)}</strong></div>
          <div><span>Discipline</span><strong>${escapeHTML(p.category)}</strong></div>
        </div>
        ${factHTML}
        ${heroActions ? `<div class="blog-actions page-enter delay-2">${heroActions}</div>` : ''}
      </header>

      <figure class="blog-cover ${illustrationClass} page-enter delay-2" style="view-transition-name: project-media-${escapeHTML(activeId)}">
        <img src="${escapeHTML(p.image)}" alt="${escapeHTML(p.title)} project visual" />
        ${firstVideo ? `<button type="button" class="cover-play js-open-video" data-video-index="0"><span class="play-disc">▶</span><span>Play video</span></button>` : ''}
        <figcaption>${escapeHTML(p.title)} · ${escapeHTML(p.category)}</figcaption>
      </figure>

      <div class="article-shell shell">
        <aside class="article-rail">
          <div class="rail-inner">
            <p class="rail-title">On this page</p>
            <nav aria-label="Article table of contents">
              <a href="#overview">Overview</a>
              ${(p.chapters || []).map((chapter, index) => `<a href="#chapter-${index + 1}">${escapeHTML(chapter.title)}</a>`).join('')}
              <a href="#engineering">Architecture</a>
              <a href="#impact">Results</a>
              ${p.videos?.length ? '<a href="#demo">Video demos</a>' : ''}
            </nav>
            <div class="rail-stack">
              <p>Technical stack</p>
              <div>${p.stack.map(item => `<span>${escapeHTML(item)}</span>`).join('')}</div>
            </div>
            <div class="rail-links">${externalLinks || '<span>Private research workspace</span>'}</div>
          </div>
        </aside>

        <main class="article-copy">
          <p class="article-lead reveal">${escapeHTML(p.lead || p.problem)}</p>

          <section class="article-inline-visuals reveal" aria-label="Project media">
            <div class="inline-visuals-heading">
              <p>Images and demos</p>
              <span>Lab photos, project screenshots, and frames from the demo recordings.</span>
            </div>
            <div class="inline-visuals-grid">${visualCards(true)}</div>
          </section>

          <section class="blog-section reveal" id="overview">
            <p class="blog-section-label">01</p>
            <h2>Problem.</h2>
            <div class="section-prose"><p>${escapeHTML(p.problem)}</p></div>
          </section>

          ${chapterHTML}

          <aside class="article-quote reveal">
            <span>Key engineering choice</span>
            <p>${escapeHTML(p.unique)}</p>
          </aside>

          <section class="blog-section reveal" id="engineering">
            <p class="blog-section-label">Architecture</p>
            <h2>Architecture.</h2>
            <ol class="architecture-list">
              ${p.system.map((item, index) => `<li><span>${String(index + 1).padStart(2, '0')}</span><p>${escapeHTML(item)}</p></li>`).join('')}
            </ol>
          </section>

          <section class="blog-section reveal" id="impact">
            <p class="blog-section-label">Results</p>
            <h2>What I completed.</h2>
            <div class="impact-list">
              ${p.impact.map(item => `<div><span aria-hidden="true">↗</span><p>${escapeHTML(item)}</p></div>`).join('')}
            </div>
          </section>

          ${demoHTML}

          <section class="blog-section source-section reveal">
            <p class="blog-section-label">Links</p>
            <h2>Repository and files.</h2>
            <div class="source-links">${sourceLinks || '<p>Supporting code is currently part of a private research workspace.</p>'}</div>
          </section>
        </main>

        <aside class="article-visuals" aria-label="Project media">
          <div class="visual-rail-inner">
            <div class="visual-rail-heading">
              <p>${firstVideo ? 'Demo and images' : 'Project images'}</p>
              <span>${firstVideo ? 'Play the clip or open any image at full size.' : 'Open any image at full size.'}</span>
            </div>
            ${featureVisual}
            <div class="visual-rail-list">${visualCards(false)}</div>
          </div>
        </aside>
      </div>

      <div class="shell">
        <a class="project-next reveal" href="project.html?id=${encodeURIComponent(nextId)}" style="view-transition-name: next-project-card">
          <div><p>Next project</p><h3>${escapeHTML(next.title)}</h3></div><span>→</span>
        </a>
      </div>
    </article>`;

  const videoModal = document.getElementById('video-modal');
  const modalStage = videoModal?.querySelector('.video-modal-stage');
  const modalTitle = videoModal?.querySelector('.video-modal-title');
  const modalExternal = videoModal?.querySelector('.video-modal-external');

  const openVideo = index => {
    const video = p.videos?.[Number(index)];
    if (!video || !videoModal || !modalStage) return;
    modalStage.innerHTML = `<video controls playsinline preload="metadata" poster="${escapeHTML(video.poster || p.image)}"><source src="${escapeHTML(video.src)}" type="video/mp4">Your browser does not support HTML5 video.</video>`;
    const player = modalStage.querySelector('video');
    if (player) {
      player.defaultMuted = false;
      player.muted = false;
      player.volume = 1;
    }
    if (modalTitle) modalTitle.textContent = video.label;
    const modalEyebrow = videoModal.querySelector('.video-modal-eyebrow');
    if (modalEyebrow) modalEyebrow.textContent = video.hasAudio ? 'Project video · original audio' : 'Project video';
    if (modalExternal) {
      modalExternal.href = video.src;
      modalExternal.textContent = 'Open MP4 ↗';
    }
    videoModal.showModal();
    document.body.classList.add('modal-open');
    player?.play().catch(() => {});
  };

  document.addEventListener('click', event => {
    const videoTrigger = event.target.closest('.js-open-video');
    if (videoTrigger) openVideo(videoTrigger.dataset.videoIndex || 0);
    const imageTrigger = event.target.closest('.js-open-image');
    if (imageTrigger) openImage(imageTrigger.dataset.imageIndex || 0);
  });

  const closeVideo = () => videoModal?.close();
  videoModal?.querySelector('.video-modal-close')?.addEventListener('click', closeVideo);
  videoModal?.addEventListener('click', event => {
    if (event.target === videoModal) closeVideo();
  });
  videoModal?.addEventListener('close', () => {
    modalStage?.querySelector('video')?.pause();
    if (modalStage) modalStage.innerHTML = '';
    document.body.classList.remove('modal-open');
  });

  const imageModal = document.getElementById('image-modal');
  const imageModalImage = imageModal?.querySelector('img');
  const imageModalCaption = imageModal?.querySelector('figcaption');

  function openImage(index) {
    const visual = gallery[Number(index)];
    if (!visual || !imageModal || !imageModalImage) return;
    imageModalImage.src = visual.src;
    imageModalImage.alt = visual.alt;
    if (imageModalCaption) imageModalCaption.textContent = visual.caption || '';
    imageModal.showModal();
    document.body.classList.add('modal-open');
  }

  imageModal?.querySelector('.image-modal-close')?.addEventListener('click', () => imageModal.close());
  imageModal?.addEventListener('click', event => {
    if (event.target === imageModal) imageModal.close();
  });
  imageModal?.addEventListener('close', () => {
    document.body.classList.remove('modal-open');
    if (imageModalImage) imageModalImage.src = '';
  });

  const progress = document.querySelector('.reading-progress span');
  const updateProgress = () => {
    const maximum = document.documentElement.scrollHeight - innerHeight;
    const percentage = maximum > 0 ? Math.min(100, Math.max(0, scrollY / maximum * 100)) : 0;
    if (progress) progress.style.width = `${percentage}%`;
  };
  addEventListener('scroll', updateProgress, { passive: true });
  updateProgress();

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.06, rootMargin: '0px 0px -36px' });
  document.querySelectorAll('.reveal').forEach(element => observer.observe(element));

  requestAnimationFrame(() => document.body.classList.add('page-ready'));
})();
