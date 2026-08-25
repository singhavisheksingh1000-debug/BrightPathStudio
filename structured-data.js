// BrightPathStudio SEO structured-data helper
// Add this script to pages that need Organization + WebSite + BreadcrumbList JSON-LD.
(function () {
  const data = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': 'https://brightpathstudio.vercel.app/#organization',
        name: 'BrightPathStudio',
        url: 'https://brightpathstudio.vercel.app/'
      },
      {
        '@type': 'WebSite',
        '@id': 'https://brightpathstudio.vercel.app/#website',
        url: 'https://brightpathstudio.vercel.app/',
        name: 'BrightPathStudio',
        publisher: { '@id': 'https://brightpathstudio.vercel.app/#organization' }
      }
    ]
  };

  const path = window.location.pathname.replace(/\/$/, '') || '/';
  const labels = {
    '/': 'Home',
    '/category-wedding.html': 'Wedding Planning',
    '/category-pregnancy-baby.html': 'Pregnancy & Baby',
    '/category-adhd.html': 'ADHD & Productivity',
    '/category-wellness.html': "Women's Wellness",
    '/category-kids.html': 'Kids',
    '/category-seasonal.html': 'Seasonal',
    '/category-students-career.html': 'Students & Career',
    '/about.html': 'About'
  };
  if (labels[path] && path !== '/') {
    data['@graph'].push({
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://brightpathstudio.vercel.app/' },
        { '@type': 'ListItem', position: 2, name: labels[path], item: 'https://brightpathstudio.vercel.app' + path }
      ]
    });
  }
  const script = document.createElement('script');
  script.type = 'application/ld+json';
  script.textContent = JSON.stringify(data);
  document.head.appendChild(script);
})();