/* BrightPathStudio — automatic blog navigation + homepage blog sync */
(function () {
  'use strict';
  const DATA_URL = '/blog/posts.json';
  const esc = (value) => String(value || '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const formatDate = (value) => {
    const d = new Date(value);
    return Number.isNaN(d.getTime()) ? '' : d.toLocaleDateString(undefined, {year:'numeric', month:'short', day:'numeric'});
  };
  const isHome = location.pathname === '/' || location.pathname.endsWith('/index.html');

  fetch(DATA_URL, {cache:'no-store'})
    .then(r => r.ok ? r.json() : Promise.reject(new Error('Blog index unavailable')))
    .then(data => {
      const posts = Array.isArray(data.posts) ? data.posts.slice().sort((a,b) => new Date(b.date) - new Date(a.date)) : [];
      if (!posts.length) return;

      /* Add a professional Blog dropdown to every site header. */
      document.querySelectorAll('header .nav').forEach(nav => {
        if (nav.querySelector('.dynamic-blog-nav')) return;
        const links = nav.querySelector('.nav-links');
        if (links) {
          const li = document.createElement('li');
          li.className = 'dynamic-blog-nav';
          li.innerHTML = '<a href="/blog/" aria-haspopup="true">Journal <span aria-hidden="true">⌄</span></a>' +
            '<div class="dynamic-blog-dropdown"><a class="dynamic-blog-all" href="/blog/">All Articles</a>' +
            posts.slice(0,5).map((p,i) => `<a href="${esc(p.url)}"><small>${i===0?'NEW • ':''}${esc(p.category)}</small>${esc(p.title)}</a>`).join('') + '</div>';
          links.appendChild(li);
        } else {
          const a = document.createElement('a');
          a.className = 'dynamic-blog-nav dynamic-blog-simple';
          a.href = '/blog/';
          a.textContent = 'Journal';
          nav.insertBefore(a, nav.lastElementChild || null);
        }
      });

      /* Add Journal to mobile navigation when one exists. */
      const mobile = document.getElementById('mobileMenu');
      if (mobile && !mobile.querySelector('.dynamic-mobile-journal')) {
        const a = document.createElement('a');
        a.className = 'dynamic-mobile-journal';
        a.href = '/blog/';
        a.textContent = 'Journal';
        mobile.insertBefore(a, mobile.querySelector('a[href="/about.html"]') || null);
      }

      /* Refresh the homepage blog teaser from the same single source of truth. */
      const section = document.querySelector('#blog.blog-teaser, section#blog');
      const grid = section && section.querySelector('.blog-placeholder-grid');
      if (grid) {
        grid.innerHTML = posts.slice(0,6).map(p => `<a class="blog-article-link" href="${esc(p.url)}"><span class="blog-label">${esc(p.category)}</span><h3>${esc(p.title)}</h3><p>${esc(p.description)}</p><span class="blog-meta">${esc(formatDate(p.date))} · ${esc(p.readTime || 5)} min read</span><span class="blog-read-more">Read article →</span></a>`).join('');
      }

      /* If the current page is the blog index, render the complete archive. */
      const archive = document.querySelector('[data-blog-archive]');
      if (archive) {
        const search = archive.querySelector('[data-blog-search]');
        const filter = archive.querySelector('[data-blog-filter]');
        const gridEl = archive.querySelector('[data-blog-grid]');
        const count = archive.querySelector('[data-blog-count]');
        const render = () => {
          const q = (search && search.value || '').trim().toLowerCase();
          const f = filter ? filter.value : 'all';
          const visible = posts.filter(p => {
            const hay = `${p.title} ${p.description} ${p.category}`.toLowerCase();
            return (!q || hay.includes(q)) && (f === 'all' || p.category === f);
          });
          if (count) count.textContent = `${visible.length} article${visible.length === 1 ? '' : 's'}`;
          if (!gridEl) return;
          gridEl.innerHTML = visible.map((p,i) => `<article class="article-card ${i===0 && !q && f==='all' ? 'is-latest' : ''}"><a href="${esc(p.url)}" class="article-card-media">${p.image ? `<img src="${esc(p.image)}" alt="${esc(p.title)}" loading="${i<2?'eager':'lazy'}">` : '<span class="article-card-placeholder">BrightPathStudio Journal</span>'}</a><div class="article-card-body"><div class="article-card-meta"><span>${esc(p.category)}</span><time datetime="${esc(p.date)}">${esc(formatDate(p.date))}</time></div><h2><a href="${esc(p.url)}">${esc(p.title)}</a></h2><p>${esc(p.description)}</p><a class="read-link" href="${esc(p.url)}">Read article <span>→</span></a></div></article>`).join('') || '<div class="blog-empty"><strong>No articles found.</strong><span>Try another search or category.</span></div>';
        };
        if (search) search.addEventListener('input', render);
        if (filter) filter.addEventListener('change', render);
        if (filter) {
          [...new Set(posts.map(p => p.category).filter(Boolean))].sort().forEach(cat => {
            const option = document.createElement('option'); option.value = cat; option.textContent = cat; filter.appendChild(option);
          });
        }
        render();
      }
    })
    .catch(() => {
      /* Keep existing HTML visible if the generated manifest is temporarily unavailable. */
    });

  if (!document.getElementById('dynamicBlogStyles')) {
    const style = document.createElement('style');
    style.id = 'dynamicBlogStyles';
    style.textContent = `
      .dynamic-blog-nav{position:relative!important}.dynamic-blog-nav>a{display:flex!important;align-items:center;gap:5px}.dynamic-blog-dropdown{position:absolute;top:calc(100% + 12px);right:0;width:340px;padding:10px;background:var(--paper-card,#fff);border:1px solid var(--line,rgba(32,41,31,.12));border-radius:14px;box-shadow:0 18px 45px rgba(32,41,31,.16);opacity:0;visibility:hidden;transform:translateY(-5px);transition:.2s ease;z-index:200}.dynamic-blog-nav:hover .dynamic-blog-dropdown,.dynamic-blog-nav:focus-within .dynamic-blog-dropdown{opacity:1;visibility:visible;transform:none}.dynamic-blog-dropdown a{display:block!important;padding:11px 12px!important;border-radius:9px;color:var(--ink,#20291f)!important;text-decoration:none!important;line-height:1.3}.dynamic-blog-dropdown a:hover{background:rgba(198,154,73,.1)}.dynamic-blog-dropdown small{display:block;font-family:var(--mono,monospace);font-size:9px;letter-spacing:.08em;color:var(--gold,#c69a49);margin-bottom:4px}.dynamic-blog-dropdown .dynamic-blog-all{font-weight:700;border-bottom:1px solid var(--line,rgba(32,41,31,.12));margin-bottom:4px}.dynamic-blog-simple{font-weight:600}.blog-meta{display:block;margin-top:10px;font-family:var(--mono,monospace);font-size:10px;letter-spacing:.03em;color:var(--ink-soft,#5f665d)}@media(max-width:800px){.dynamic-blog-dropdown{display:none}}
    `;
    document.head.appendChild(style);
  }
})();
