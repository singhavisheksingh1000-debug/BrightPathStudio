// BrightPathStudio SEO structured-data helper
// Add this script to pages that need Organization + WebSite + BreadcrumbList JSON-LD.
(function () {
  const data = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': 'https://brightpathstudio.shop/#organization',
        name: 'BrightPathStudio',
        url: 'https://brightpathstudio.shop/'
      },
      {
        '@type': 'WebSite',
        '@id': 'https://brightpathstudio.shop/#website',
        url: 'https://brightpathstudio.shop/',
        name: 'BrightPathStudio',
        publisher: { '@id': 'https://brightpathstudio.shop/#organization' }
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
        { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://brightpathstudio.shop/' },
        { '@type': 'ListItem', position: 2, name: labels[path], item: 'https://brightpathstudio.shop' + path }
      ]
    });
  }
  const script = document.createElement('script');
  script.type = 'application/ld+json';
  script.textContent = JSON.stringify(data);
  document.head.appendChild(script);
})();