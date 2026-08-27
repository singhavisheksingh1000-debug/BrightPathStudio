document.addEventListener('DOMContentLoaded', () => {
  const navLinks = document.querySelector('.nav-links');
  if (!navLinks || navLinks.querySelector('.shop-menu')) return;

  const shopItem = Array.from(navLinks.querySelectorAll('li')).find(li => {
    const a = li.querySelector('a');
    return a && a.textContent.trim() === 'Shop';
  });
  if (!shopItem) return;

  shopItem.classList.add('shop-menu');
  shopItem.innerHTML = `
    <button class="shop-menu-trigger" type="button" aria-expanded="false" aria-controls="shopVisualMenu">Shop <span aria-hidden="true">⌄</span></button>
    <div class="shop-visual-menu" id="shopVisualMenu" role="menu">
      <div class="shop-visual-head">
        <span>EXPLORE BRIGHTPATHSTUDIO</span>
        <strong>Choose something made for your moment.</strong>
      </div>
      <div class="shop-visual-grid">
        <a href="/category-adhd.html" role="menuitem"><img src="https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?q=82&w=500&auto=format&fit=crop" alt="Open notebook and planning tools for ADHD and productivity"><span><b>ADHD & Productivity</b><small>Focus, time & task planning</small></span></a>
        <a href="/category-wedding.html" role="menuitem"><img src="https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=82&w=500&auto=format&fit=crop" alt="Romantic wedding celebration"><span><b>Wedding</b><small>Plan the day you'll remember forever</small></span></a>
        <a href="/category-pregnancy-baby.html" role="menuitem"><img src="https://images.unsplash.com/photo-1491021709335-5c6d2f6c6a7d?q=82&w=500&auto=format&fit=crop" alt="Pregnancy and new beginnings"><span><b>Pregnancy & Baby</b><small>Capture precious new beginnings</small></span></a>
        <a href="/category-wellness.html" role="menuitem"><img src="https://images.unsplash.com/photo-1499209974431-9dddcece7f88?q=82&w=500&auto=format&fit=crop" alt="Woman enjoying a calm wellness moment"><span><b>Women's Wellness</b><small>Reset, reflect & rebalance</small></span></a>
        <a href="/category-students-career.html" role="menuitem"><img src="/assets/hero-career.svg" alt="Students and career success planning"><span><b>Students & Career</b><small>Study, jobs & professional growth</small></span></a>
        <a href="/category-kids.html" role="menuitem"><img src="https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?q=82&w=500&auto=format&fit=crop" alt="Happy children playing together"><span><b>Kids & Family</b><small>Creative, screen-free fun</small></span></a>
        <a href="/category-seasonal.html" role="menuitem"><img src="/assets/hero-seasonal.svg" alt="Halloween and seasonal printable collection"><span><b>Halloween & Seasonal</b><small>Party planning, crafts & festive fun</small></span></a>
      </div>
      <div class="shop-visual-footer"><span>🎁 Free resources available</span><a href="/category-seasonal.html">See seasonal collection →</a></div>
    </div>`;

  const trigger = shopItem.querySelector('.shop-menu-trigger');
  const menu = shopItem.querySelector('.shop-visual-menu');
  const close = () => { trigger.setAttribute('aria-expanded','false'); shopItem.classList.remove('is-open'); };
  trigger.addEventListener('click', e => { e.preventDefault(); const open = shopItem.classList.toggle('is-open'); trigger.setAttribute('aria-expanded', open ? 'true' : 'false'); });
  document.addEventListener('click', e => { if (!shopItem.contains(e.target)) close(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') close(); });

  if (!document.getElementById('shopVisualMenuStyles')) {
    const style = document.createElement('style');
    style.id = 'shopVisualMenuStyles';
    style.textContent = `
      .nav-links .shop-menu{position:relative}
      .shop-menu-trigger{appearance:none;border:0;background:none;color:var(--ink-soft);font:inherit;font-size:14px;padding:0;cursor:pointer;display:inline-flex;align-items:center;gap:5px}
      .shop-menu-trigger:hover,.shop-menu.is-open .shop-menu-trigger{color:var(--ink)}
      .shop-menu-trigger span{font-size:14px;transition:transform .2s ease}
      .shop-menu.is-open .shop-menu-trigger span{transform:rotate(180deg)}
      .shop-visual-menu{position:absolute;top:calc(100% + 22px);left:50%;width:min(900px,calc(100vw - 40px));transform:translate(-50%, -8px);opacity:0;visibility:hidden;pointer-events:none;background:rgba(248,249,242,.98);border:1px solid var(--line);box-shadow:0 24px 60px -28px rgba(32,41,31,.48);padding:22px;transition:opacity .18s ease,transform .18s ease,visibility .18s ease;z-index:210}
      .shop-menu.is-open .shop-visual-menu{opacity:1;visibility:visible;pointer-events:auto;transform:translate(-50%,0)}
      .shop-visual-head{display:flex;justify-content:space-between;gap:20px;align-items:end;padding:0 2px 16px;border-bottom:1px solid var(--line)}
      .shop-visual-head span{font-family:var(--mono);font-size:10px;letter-spacing:.12em;color:var(--accent-ink)}
      .shop-visual-head strong{font-family:var(--serif);font-size:20px;font-weight:450;text-align:right}
      .shop-visual-grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:12px;padding:16px 0}
      .shop-visual-grid a{display:flex;flex-direction:column;text-decoration:none;border:1px solid transparent;overflow:hidden;background:var(--paper);transition:transform .18s ease,border-color .18s ease,box-shadow .18s ease}
      .shop-visual-grid a:hover{transform:translateY(-3px);border-color:var(--line);box-shadow:0 12px 25px -20px rgba(32,41,31,.55)}
      .shop-visual-grid img{width:100%;height:94px;object-fit:cover;background:var(--paper-card)}
      .shop-visual-grid span{padding:10px 10px 11px;display:flex;flex-direction:column;gap:3px}
      .shop-visual-grid b{font-family:var(--sans);font-size:12px;color:var(--ink)}
      .shop-visual-grid small{font-size:10px;line-height:1.35;color:var(--ink-soft)}
      .shop-visual-footer{display:flex;justify-content:space-between;gap:15px;align-items:center;padding-top:14px;border-top:1px solid var(--line);font-family:var(--mono);font-size:10px;color:var(--ink-soft)}
      .shop-visual-footer a{color:var(--accent-ink);text-decoration:none}
      .shop-visual-footer a:hover{text-decoration:underline;text-underline-offset:3px}
      @media(max-width:1100px){.shop-visual-grid{grid-template-columns:repeat(3,minmax(0,1fr))}}
      @media(max-width:860px){.shop-visual-menu{display:none}}
      @media(prefers-reduced-motion:reduce){.shop-visual-menu,.shop-visual-grid a{transition:none}}
    `;
    document.head.appendChild(style);
  }
});
