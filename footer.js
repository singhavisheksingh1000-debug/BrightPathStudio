document.addEventListener('DOMContentLoaded', async () => {
  const mount = document.querySelector('[data-site-footer]');
  if (mount) {
    try {
      const response = await fetch('/footer.html');
      if (!response.ok) throw new Error('Footer unavailable');
      mount.innerHTML = await response.text();
    } catch (error) {
      console.warn('BrightPathStudio footer could not be loaded.', error);
    }
  }

  const blogSection = Array.from(document.querySelectorAll('section')).find(section => {
    const heading = section.querySelector('h2');
    return heading && heading.textContent.trim() === 'Planning Guides & Ideas';
  });

  if (!blogSection) return;

  blogSection.id = 'blog';
  blogSection.classList.add('blog-teaser');

  Array.from(blogSection.childNodes).forEach(node => {
    if (node.nodeType === Node.TEXT_NODE && /Blog|class\s*=/.test(node.nodeValue || '')) node.remove();
  });

  const articles = [
    {label:'ADHD & PRODUCTIVITY', title:'ADHD Weekly Planning Guide: A Practical System for a Less Overwhelming Week', text:'Brain-dump, priorities, flexible time blocks, transitions and weekly resets for a more realistic planning system.', href:'/articles/adhd-weekly-planning-guide.html'},
    {label:'WEDDING PLANNING', title:'Wedding Planning Guide: A Calm Step-by-Step Plan for Your Big Day', text:'Budget, guest list, vendors, contracts, timeline and practical details for a smoother wedding-planning journey.', href:'/articles/wedding-planning-guide.html'},
    {label:'WELLNESS & LIFE RESET', title:'How to Reset Your Life When Everything Feels Too Much: A Practical Guide', text:'A gentle system for reducing mental clutter, simplifying routines and creating a realistic fresh start.', href:'/articles/life-reset-guide.html'},
    {label:'PREGNANCY & BABY', title:"How to Create a Pregnancy & Baby Memory Book You'll Treasure Forever", text:'Meaningful prompts for capturing pregnancy milestones, family memories and baby’s first-year moments.', href:'/articles/pregnancy-memory-guide.html'},
    {label:'KIDS & FAMILY', title:'50 Indoor Activities for Kids: Creative Screen-Free Ideas for Home', text:'Creative, screen-free activities for rainy days, holidays and family time.', href:'/articles/indoor-activities-kids-guide.html'}
  ];

  const grid = blogSection.querySelector('.blog-placeholder-grid');
  if (!grid) return;

  const existingCards = Array.from(grid.querySelectorAll('article')).slice(0,3);
  existingCards.forEach((card,index) => {
    const item = articles[index];
    const link = document.createElement('a');
    link.href = item.href;
    link.className = 'blog-article-link';
    link.setAttribute('aria-label', `Read ${item.title}`);
    link.innerHTML = `<span class="blog-label">${item.label}</span><h3>${item.title}</h3><p>${item.text}</p><span class="blog-read-more">Read article →</span>`;
    card.replaceWith(link);
  });

  if (!grid.querySelector('[data-extra-article]')) {
    articles.slice(3).forEach(item => {
      const card = document.createElement('a');
      card.href = item.href;
      card.className = 'blog-article-link blog-extra-card';
      card.dataset.extraArticle = 'true';
      card.setAttribute('aria-label', `Read ${item.title}`);
      card.innerHTML = `<span class="blog-label">${item.label}</span><h3>${item.title}</h3><p>${item.text}</p><span class="blog-read-more">Read article →</span>`;
      grid.appendChild(card);
    });
  }

  if (!document.getElementById('blogFixStyles')) {
    const style = document.createElement('style');
    style.id = 'blogFixStyles';
    style.textContent = `
      #blog.blog-teaser .blog-placeholder-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:22px}
      #blog.blog-teaser .blog-article-link{display:block;color:inherit;text-decoration:none;padding:4px 0;transition:transform .2s ease,opacity .2s ease}
      #blog.blog-teaser .blog-article-link:hover{transform:translateY(-3px);opacity:.82}
      #blog.blog-teaser .blog-article-link h3{text-decoration:none}
      #blog.blog-teaser .blog-read-more{display:inline-block;margin-top:12px;font-weight:700}
      @media(max-width:800px){#blog.blog-teaser .blog-placeholder-grid{grid-template-columns:1fr;gap:28px}}
    `;
    document.head.appendChild(style);
  }
});