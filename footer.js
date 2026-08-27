document.addEventListener('DOMContentLoaded', async () => {
  // Load the visual Shop menu on every page without duplicating header markup.
  if (!document.querySelector('script[data-header-categories]')) {
    const script = document.createElement('script');
    script.src = '/header-categories.js';
    script.defer = true;
    script.dataset.headerCategories = 'true';
    document.head.appendChild(script);
  }

  // ------------------------------------------------------------
  // Clickable rotating announcement bar
  // ------------------------------------------------------------
  const header = document.querySelector('header');
  if (header && !document.querySelector('.site-announcement')) {
    const announcements = [
      { type:'NEW', label:'NEW: HALLOWEEN PLANNER + DIY KIDS GUIDE', text:'25 screen-free activities + a simple plan for a magical spooky season', href:'/blog/halloween-planner-diy-kids-activities.html', cta:'READ THE GUIDE →' },
      { type:'NEW', label:'NEW: Ultimate Pregnancy Journal Guide', text:'What to write from the first positive test to baby’s first year', href:'/blog/ultimate-pregnancy-journal-guide.html', cta:'READ THE GUIDE →' },
      { type:'FREE', label:'FREE MEMORY BOOK', text:'Start capturing pregnancy & newborn memories today', href:'https://avisheksingh3.gumroad.com/l/qgidbr', cta:'GET IT FREE →' },
      { type:'FEATURED', label:'300+ PAGE WEDDING PLANNER', text:'Plan your wedding with one beautiful all-in-one planner', href:'/category-wedding.html', cta:'SEE WHAT’S INSIDE →' },
      { type:'SEASONAL', label:'🎃 HALLOWEEN COMBO BUNDLE', text:'400+ printable pages + free bonus pages for one special price', href:'https://avisheksingh3.gumroad.com/l/sgcyq', cta:'GET THE COMBO →' },
      { type:'SEASONAL', label:'🎃 HALLOWEEN ACTIVITY MEGA BUNDLE', text:'283 printable pages for kids, crafts, games, coloring & STEM', href:'https://avisheksingh3.gumroad.com/l/tgezay', cta:'SHOP HALLOWEEN →' },
      { type:'SEASONAL', label:'🎃 HALLOWEEN PARTY PLANNER', text:'130+ printable pages to plan a fun Halloween celebration', href:'https://avisheksingh3.gumroad.com/l/nqvqm', cta:'PLAN YOUR PARTY →' }
    ];

    const bar = document.createElement('div');
    bar.className = 'site-announcement';
    bar.setAttribute('aria-label', 'BrightPathStudio latest updates');
    bar.innerHTML = `
      <div class="site-announcement-inner">
        <span class="site-announcement-live"><span class="site-announcement-dot"></span><span class="site-announcement-live-text">LATEST</span></span>
        <div class="site-announcement-viewport" aria-live="polite"><div class="site-announcement-track"></div></div>
        <button class="site-announcement-arrow site-announcement-prev" type="button" aria-label="Previous announcement">‹</button>
        <button class="site-announcement-arrow site-announcement-next" type="button" aria-label="Next announcement">›</button>
      </div>`;
    header.insertAdjacentElement('afterend', bar);

    const track = bar.querySelector('.site-announcement-track');
    let current = 0;
    let timer = null;
    let paused = false;

    const render = (index, direction = 1) => {
      current = (index + announcements.length) % announcements.length;
      const item = announcements[current];
      const external = /^https?:\/\//i.test(item.href);
      const next = document.createElement('a');
      next.className = 'site-announcement-link';
      next.href = item.href;
      if (external) { next.target = '_blank'; next.rel = 'noopener noreferrer'; }
      next.innerHTML = `<span class="site-announcement-copy"><strong>${item.label}</strong><span class="site-announcement-sep">•</span><span>${item.text}</span></span><span class="site-announcement-cta">${item.cta}</span>`;
      track.style.transition = 'none';
      track.style.transform = `translateX(${direction > 0 ? '100%' : '-100%'})`;
      track.innerHTML = '';
      track.appendChild(next);
      requestAnimationFrame(() => requestAnimationFrame(() => {
        track.style.transition = 'transform 520ms cubic-bezier(.22,.61,.36,1)';
        track.style.transform = 'translateX(0)';
      }));
    };

    const stop = () => { if (timer) { clearTimeout(timer); timer = null; } };
    const schedule = () => {
      stop();
      if (paused || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      timer = setTimeout(() => { render(current + 1, 1); schedule(); }, 4500);
    };
    bar.querySelector('.site-announcement-next').addEventListener('click', () => { render(current + 1, 1); schedule(); });
    bar.querySelector('.site-announcement-prev').addEventListener('click', () => { render(current - 1, -1); schedule(); });
    bar.addEventListener('mouseenter', () => { paused = true; stop(); });
    bar.addEventListener('mouseleave', () => { paused = false; schedule(); });
    bar.addEventListener('focusin', () => { paused = true; stop(); });
    bar.addEventListener('focusout', () => { paused = false; schedule(); });
    render(0, 1);
    schedule();

    if (!document.getElementById('siteAnnouncementStyles')) {
      const style = document.createElement('style');
      style.id = 'siteAnnouncementStyles';
      style.textContent = `
        .site-announcement{position:relative;z-index:99;background:var(--ink);color:var(--paper);border-bottom:1px solid rgba(198,154,73,.55);box-shadow:0 8px 22px -18px rgba(32,41,31,.6)}
        .site-announcement-inner{min-height:46px;max-width:1180px;margin:0 auto;padding:0 28px;display:flex;align-items:center;gap:12px}
        .site-announcement-live{display:inline-flex;align-items:center;gap:7px;flex:none;font-family:var(--mono);font-size:10px;letter-spacing:.12em;color:#ead9a9}
        .site-announcement-dot{width:6px;height:6px;border-radius:50%;background:var(--gold);box-shadow:0 0 0 4px rgba(198,154,73,.13);animation:siteAnnouncementPulse 1.8s ease-in-out infinite}
        .site-announcement-viewport{min-width:0;flex:1;overflow:hidden;position:relative}
        .site-announcement-track{width:100%;min-height:46px;display:flex;align-items:center;justify-content:center}
        .site-announcement-link{width:100%;min-height:46px;display:flex;align-items:center;justify-content:center;gap:18px;color:var(--paper);text-decoration:none;font-size:13px;line-height:1.25}
        .site-announcement-link:hover .site-announcement-cta{text-decoration:underline;text-underline-offset:3px}
        .site-announcement-copy{display:inline-flex;align-items:center;justify-content:center;gap:9px;min-width:0;text-align:center}
        .site-announcement-copy strong{font-family:var(--mono);font-size:11px;letter-spacing:.05em;color:#fff;font-weight:600;white-space:nowrap}
        .site-announcement-copy span:not(.site-announcement-sep){color:rgba(248,249,242,.82);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
        .site-announcement-sep{color:var(--gold);flex:none}
        .site-announcement-cta{font-family:var(--mono);font-size:10px;letter-spacing:.05em;color:#ead9a9;white-space:nowrap;flex:none}
        .site-announcement-arrow{width:28px;height:28px;flex:none;border:1px solid rgba(248,249,242,.2);border-radius:50%;background:transparent;color:var(--paper);font-size:20px;line-height:20px;display:grid;place-items:center;padding:0;transition:background .2s ease,border-color .2s ease}
        .site-announcement-arrow:hover{background:rgba(248,249,242,.1);border-color:rgba(248,249,242,.45)}
        @keyframes siteAnnouncementPulse{0%,100%{opacity:.55;transform:scale(.9)}50%{opacity:1;transform:scale(1.1)}}
        @media(max-width:700px){.site-announcement-inner{padding:0 14px;gap:8px;min-height:48px}.site-announcement-live-text{display:none}.site-announcement-track,.site-announcement-link{min-height:48px}.site-announcement-link{display:block;padding:8px 2px;text-align:center}.site-announcement-copy{display:block;max-width:100%}.site-announcement-copy strong{font-size:10px;display:inline}.site-announcement-copy span:not(.site-announcement-sep){font-size:11px;display:inline;margin-left:5px}.site-announcement-sep{display:none}.site-announcement-cta{display:block;font-size:9px;margin-top:2px}.site-announcement-arrow{width:24px;height:24px;font-size:17px}}
        @media(prefers-reduced-motion:reduce){.site-announcement-dot{animation:none}.site-announcement-track{transition:none!important}}
      `;
      document.head.appendChild(style);
    }
  }

  const mount = document.querySelector('[data-site-footer]');
  if (mount) {
    try { const response = await fetch('/footer.html'); if (!response.ok) throw new Error('Footer unavailable'); mount.innerHTML = await response.text(); }
    catch (error) { console.warn('BrightPathStudio footer could not be loaded.', error); }
  }

  const blogSection = Array.from(document.querySelectorAll('section')).find(section => { const heading=section.querySelector('h2'); return heading && heading.textContent.trim()==='Planning Guides & Ideas'; });
  if (!blogSection) return;
  blogSection.id='blog'; blogSection.classList.add('blog-teaser');
  Array.from(blogSection.childNodes).forEach(node=>{if(node.nodeType===Node.TEXT_NODE&&/Blog|class\s*=/.test(node.nodeValue||''))node.remove();});
  const articles=[
    {label:'ADHD & PRODUCTIVITY',title:'ADHD Weekly Planning Guide: A Practical System for a Less Overwhelming Week',text:'Brain-dump, priorities, flexible time blocks, transitions and weekly resets for a more realistic planning system.',href:'/articles/adhd-weekly-planning-guide.html'},
    {label:'WEDDING PLANNING',title:'Wedding Planning Guide: A Calm Step-by-Step Plan for Your Big Day',text:'Budget, guest list, vendors, contracts, timeline and practical details for a smoother wedding-planning journey.',href:'/articles/wedding-planning-guide.html'},
    {label:'WELLNESS & LIFE RESET',title:'How to Reset Your Life When Everything Feels Too Much: A Practical Guide',text:'A gentle system for reducing mental clutter, simplifying routines and creating a realistic fresh start.',href:'/articles/life-reset-guide.html'},
    {label:'PREGNANCY & BABY',title:"How to Create a Pregnancy & Baby Memory Book You'll Treasure Forever",text:'Meaningful prompts for capturing pregnancy milestones, family memories and baby’s first-year moments.',href:'/articles/pregnancy-memory-guide.html'},
    {label:'KIDS & FAMILY',title:'50 Indoor Activities for Kids: Creative Screen-Free Ideas for Home',text:'Creative, screen-free activities for rainy days, holidays and family time.',href:'/articles/indoor-activities-kids-guide.html'}
  ];
  const grid=blogSection.querySelector('.blog-placeholder-grid'); if(!grid)return;
  const existingCards=Array.from(grid.querySelectorAll('article')).slice(0,3);
  existingCards.forEach((card,index)=>{const item=articles[index];const link=document.createElement('a');link.href=item.href;link.className='blog-article-link';link.setAttribute('aria-label',`Read ${item.title}`);link.innerHTML=`<span class="blog-label">${item.label}</span><h3>${item.title}</h3><p>${item.text}</p><span class="blog-read-more">Read article →</span>`;card.replaceWith(link);});
  if(!grid.querySelector('[data-extra-article]'))articles.slice(3).forEach(item=>{const card=document.createElement('a');card.href=item.href;card.className='blog-article-link blog-extra-card';card.dataset.extraArticle='true';card.setAttribute('aria-label',`Read ${item.title}`);card.innerHTML=`<span class="blog-label">${item.label}</span><h3>${item.title}</h3><p>${item.text}</p><span class="blog-read-more">Read article →</span>`;grid.appendChild(card);});
  if(!document.getElementById('blogFixStyles')){const style=document.createElement('style');style.id='blogFixStyles';style.textContent=`#blog.blog-teaser .blog-placeholder-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:22px}#blog.blog-teaser .blog-article-link{display:block;color:inherit;text-decoration:none;padding:4px 0;transition:transform .2s ease,opacity .2s ease}#blog.blog-teaser .blog-article-link:hover{transform:translateY(-3px);opacity:.82}#blog.blog-teaser .blog-article-link h3{text-decoration:none}#blog.blog-teaser .blog-read-more{display:inline-block;margin-top:12px;font-weight:700}@media(max-width:800px){#blog.blog-teaser .blog-placeholder-grid{grid-template-columns:1fr;gap:28px}}`;document.head.appendChild(style);}
});
