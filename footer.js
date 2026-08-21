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

  const links = [
    '/articles/adhd-planning-tips.html',
    '/articles/wedding-planning-mistakes.html',
    '/articles/life-reset-when-overwhelmed.html'
  ];

  const cards = Array.from(blogSection.querySelectorAll('.blog-placeholder-grid article'));
  cards.forEach((card, index) => {
    // Remove every visible Coming soon label from the card.
    Array.from(card.querySelectorAll('*')).forEach(element => {
      if (/^\s*coming soon\b/i.test(element.textContent || '')) element.remove();
    });
    Array.from(card.childNodes).forEach(node => {
      if (node.nodeType === Node.TEXT_NODE && /coming soon/i.test(node.nodeValue || '')) node.remove();
    });

    if (card.parentElement && card.parentElement.tagName === 'A') return;
    const link = document.createElement('a');
    link.href = links[index] || '/';
    link.className = 'blog-article-link';
    link.setAttribute('aria-label', `Read ${card.querySelector('h3')?.textContent.trim() || 'article'}`);
    link.innerHTML = card.innerHTML;
    card.replaceWith(link);
  });

  if (!document.getElementById('blogFixStyles')) {
    const style = document.createElement('style');
    style.id = 'blogFixStyles';
    style.textContent = `
      #blog.blog-teaser .blog-placeholder-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:22px}
      #blog.blog-teaser .blog-article-link{display:block;color:inherit;text-decoration:none;padding:4px 0;transition:transform .2s ease,opacity .2s ease}
      #blog.blog-teaser .blog-article-link:hover{transform:translateY(-3px);opacity:.82}
      #blog.blog-teaser .blog-article-link h3{text-decoration:none}
      @media(max-width:800px){#blog.blog-teaser .blog-placeholder-grid{grid-template-columns:1fr;gap:28px}}
    `;
    document.head.appendChild(style);
  }
});