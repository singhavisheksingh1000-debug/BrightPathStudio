// BrightPathStudio — shared JavaScript
// Mobile menu, blog filter, add-to-bag cart, cookie consent, newsletter form

(function(){
  'use strict';

  const body = document.body;
  const menuToggle = document.getElementById('menuToggle');
  const mobileMenu = document.getElementById('mobileMenu');
  const menuClose = document.getElementById('menuClose');
  const overlay = document.getElementById('overlay');
  const bagBtn = document.getElementById('bagBtn');
  const cartDrawer = document.getElementById('cartDrawer');
  const cartClose = document.getElementById('cartClose');
  const bagCount = document.getElementById('bagCount');
  const cartItems = document.getElementById('cartItems');
  const cartTotal = document.getElementById('cartTotal');
  const cookieBanner = document.getElementById('cookieBanner');
  const cookieAccept = document.getElementById('cookieAccept');
  const cookieDecline = document.getElementById('cookieDecline');
  const toast = document.getElementById('toast');

  let cart = [];
  let toastTimer = null;

  try{
    const saved = localStorage.getItem('bps_cart');
    if(saved) cart = JSON.parse(saved);
  }catch(e){}

  function saveCart(){
    try{
      localStorage.setItem('bps_cart', JSON.stringify(cart));
    }catch(e){}
  }

  function showToast(msg){
    if(!toast) return;
    toast.textContent = msg;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('show'), 2000);
  }

  function updateBagCount(){
    if(!bagCount) return;
    if(cart.length === 0){
      bagCount.hidden = true;
    }else{
      bagCount.hidden = false;
      bagCount.textContent = cart.length;
    }
  }

  function renderCart(){
    if(!cartItems || !cartTotal) return;
    if(cart.length === 0){
      cartItems.innerHTML = '<p class="cart-empty">Your bag is empty.</p>';
      cartTotal.textContent = '$0.00';
      return;
    }
    let total = 0;
    cartItems.innerHTML = cart.map((item, idx) => {
      total += item.price;
      return `
        <div class="cart-row">
          <div class="thumb" style="background:${item.color || 'var(--accent)'}"></div>
          <div class="meta">
            <h4>${item.title}</h4>
            <span>$${item.price.toFixed(2)}</span>
          </div>
          <button class="rm" data-idx="${idx}" aria-label="Remove ${item.title}">×</button>
        </div>
      `;
    }).join('');
    cartTotal.textContent = '$' + total.toFixed(2);

    cartItems.querySelectorAll('.rm').forEach(btn => {
      btn.addEventListener('click', () => {
        const idx = parseInt(btn.getAttribute('data-idx'), 10);
        cart.splice(idx, 1);
        saveCart();
        updateBagCount();
        renderCart();
        showToast('Removed from bag');
      });
    });
  }

  function openCart(){
    if(!cartDrawer || !overlay) return;
    body.classList.add('no-scroll');
    overlay.classList.add('open');
    cartDrawer.classList.add('open');
  }

  function closeCart(){
    if(!cartDrawer || !overlay) return;
    body.classList.remove('no-scroll');
    overlay.classList.remove('open');
    cartDrawer.classList.remove('open');
  }

  function openMenu(){
    if(!mobileMenu || !overlay) return;
    body.classList.add('no-scroll');
    overlay.classList.add('open');
    mobileMenu.classList.add('open');
  }

  function closeMenu(){
    if(!mobileMenu || !overlay) return;
    body.classList.remove('no-scroll');
    overlay.classList.remove('open');
    mobileMenu.classList.remove('open');
  }

  if(menuToggle) menuToggle.addEventListener('click', openMenu);
  if(menuClose) menuClose.addEventListener('click', closeMenu);

  if(bagBtn) bagBtn.addEventListener('click', openCart);
  if(cartClose) cartClose.addEventListener('click', closeCart);

  if(overlay){
    overlay.addEventListener('click', () => {
      closeMenu();
      closeCart();
    });
  }

  document.addEventListener('click', (e) => {
    const btn = e.target.closest('.add-btn');
    if(!btn) return;
    e.preventDefault();
    const card = btn.closest('.product-card');
    const title = btn.dataset.title || (card && card.querySelector('h3') ? card.querySelector('h3').textContent : 'Product');
    const price = parseFloat(btn.dataset.price || '0') || 0;
    const media = card ? card.querySelector('.product-media') : null;
    const color = media ? media.style.getPropertyValue('--tab-c') : '';
    cart.push({ title: title, price: price, color: color || 'var(--accent)' });
    saveCart();
    updateBagCount();
    renderCart();
    showToast('Added to bag');
  });

  const filterChips = document.querySelectorAll('.filter-chip');
  const blogCards = document.querySelectorAll('.blog-card');
  filterChips.forEach(chip => {
    chip.addEventListener('click', () => {
      filterChips.forEach(c => c.classList.remove('is-active'));
      chip.classList.add('is-active');
      const filter = chip.getAttribute('data-filter');
      blogCards.forEach(card => {
        const show = filter === 'all' || card.getAttribute('data-category') === filter;
        card.hidden = !show;
      });
    });
  });

  function checkCookieConsent(){
    try{
      return localStorage.getItem('bps_cookie_consent');
    }catch(e){ return null; }
  }

  function setCookieConsent(val){
    try{
      localStorage.setItem('bps_cookie_consent', val);
    }catch(e){}
  }

  if(cookieBanner && !checkCookieConsent()){
    setTimeout(() => cookieBanner.classList.add('show'), 1200);
  }

  if(cookieAccept){
    cookieAccept.addEventListener('click', () => {
      setCookieConsent('accepted');
      if(cookieBanner) cookieBanner.classList.remove('show');
    });
  }

  if(cookieDecline){
    cookieDecline.addEventListener('click', () => {
      setCookieConsent('declined');
      if(cookieBanner) cookieBanner.classList.remove('show');
    });
  }

  const nform = document.getElementById('newsletterForm');
  const nstatus = document.getElementById('nstatus');
  if(nform){
    nform.addEventListener('submit', (e) => {
      e.preventDefault();
      if(nstatus) nstatus.textContent = 'Thank you for subscribing!';
      nform.reset();
      setTimeout(() => { if(nstatus) nstatus.textContent = ''; }, 3000);
    });
  }

  const cform = document.getElementById('contactForm');
  const cstatus = document.getElementById('cstatus');
  if(cform){
    cform.addEventListener('submit', (e) => {
      e.preventDefault();
      if(cstatus) cstatus.textContent = 'Message sent! We will reply soon.';
      cform.reset();
      setTimeout(() => { if(cstatus) cstatus.textContent = ''; }, 3500);
    });
  }

  /* =========================================
     HOMEPAGE CATEGORY SLIDER
     Clickable: ADHD, Wedding, Pregnancy,
     Kids, Festive/Halloween
  ========================================= */
  function initHeroSlider(){
    const oldMock = document.querySelector('.planner-mock');
    if(!oldMock) return;

    const slides = [
      {
        title: 'ADHD Life OS',
        subtitle: 'Focus, organize & plan with less overwhelm',
        alt: 'ADHD Life OS digital planner',
        image: 'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?q=85&w=1200&auto=format&fit=crop',
        href: '#adhd-planners'
      },
      {
        title: 'Wedding Planner',
        subtitle: 'Plan your dream wedding from yes to “I do”',
        alt: 'Elegant wedding planning materials',
        image: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=85&w=1200&auto=format&fit=crop',
        href: '#wedding-planners'
      },
      {
        title: 'Pregnancy Planner',
        subtitle: 'Capture the journey and prepare for baby',
        alt: 'Pregnancy and baby memory planning',
        image: 'https://images.unsplash.com/photo-1516627145497-ae6968895b74?q=85&w=1200&auto=format&fit=crop',
        href: '#pregnancy-baby'
      },
      {
        title: 'Kids Activity Books',
        subtitle: 'Fun printable activities for creative kids',
        alt: 'Kids creative activity materials',
        image: 'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?q=85&w=1200&auto=format&fit=crop',
        href: '#halloween-kids'
      },
      {
        title: 'Festive Printables',
        subtitle: 'Halloween fun, party planning & seasonal activities',
        alt: 'Halloween festive planning and activities',
        image: 'https://images.unsplash.com/photo-1543589077-47d81606c1bf?q=85&w=1200&auto=format&fit=crop',
        href: '#halloween-kids'
      }
    ];

    const slider = document.createElement('div');
    slider.className = 'hero-slider';
    slider.setAttribute('aria-label', 'BrightPathStudio planner categories');

    slider.innerHTML = `
      <div class="hero-slides"></div>
      <button class="hero-slider-arrow hero-slider-prev" type="button" aria-label="Previous category">‹</button>
      <button class="hero-slider-arrow hero-slider-next" type="button" aria-label="Next category">›</button>
      <div class="hero-slider-dots" role="tablist" aria-label="Choose planner category"></div>
    `;

    const slidesContainer = slider.querySelector('.hero-slides');
    const dotsContainer = slider.querySelector('.hero-slider-dots');

    slides.forEach((slide, index) => {
      const link = document.createElement('a');
      link.className = 'hero-slide' + (index === 0 ? ' active' : '');
      link.href = slide.href;
      link.setAttribute('aria-label', `Explore ${slide.title}`);
      link.innerHTML = `
        <img src="${slide.image}" alt="${slide.alt}" loading="${index === 0 ? 'eager' : 'lazy'}">
        <div class="hero-slide-shade"></div>
        <div class="hero-slide-content">
          <span class="hero-slide-kicker">BrightPathStudio Collection</span>
          <strong>${slide.title}</strong>
          <span>${slide.subtitle}</span>
          <em>Explore collection →</em>
        </div>
      `;
      slidesContainer.appendChild(link);

      const dot = document.createElement('button');
      dot.className = 'hero-slider-dot' + (index === 0 ? ' active' : '');
      dot.type = 'button';
      dot.setAttribute('role', 'tab');
      dot.setAttribute('aria-label', `Show ${slide.title}`);
      dot.setAttribute('aria-selected', index === 0 ? 'true' : 'false');
      dot.addEventListener('click', () => showSlide(index, true));
      dotsContainer.appendChild(dot);
    });

    oldMock.replaceWith(slider);

    const slideEls = Array.from(slidesContainer.querySelectorAll('.hero-slide'));
    const dotEls = Array.from(dotsContainer.querySelectorAll('.hero-slider-dot'));
    const prev = slider.querySelector('.hero-slider-prev');
    const next = slider.querySelector('.hero-slider-next');
    let current = 0;
    let timer = null;

    function showSlide(index, restartTimer = false){
      current = (index + slideEls.length) % slideEls.length;
      slideEls.forEach((el, i) => el.classList.toggle('active', i === current));
      dotEls.forEach((el, i) => {
        const active = i === current;
        el.classList.toggle('active', active);
        el.setAttribute('aria-selected', active ? 'true' : 'false');
      });
      if(restartTimer) startAutoPlay();
    }

    function startAutoPlay(){
      clearInterval(timer);
      timer = setInterval(() => showSlide(current + 1), 4500);
    }

    prev.addEventListener('click', (event) => {
      event.preventDefault();
      showSlide(current - 1, true);
    });

    next.addEventListener('click', (event) => {
      event.preventDefault();
      showSlide(current + 1, true);
    });

    slider.addEventListener('mouseenter', () => clearInterval(timer));
    slider.addEventListener('mouseleave', startAutoPlay);
    slider.addEventListener('focusin', () => clearInterval(timer));
    slider.addEventListener('focusout', (event) => {
      if(!slider.contains(event.relatedTarget)) startAutoPlay();
    });

    // Touch swipe for mobile
    let touchStartX = 0;
    slider.addEventListener('touchstart', e => {
      touchStartX = e.changedTouches[0].clientX;
    }, {passive: true});
    slider.addEventListener('touchend', e => {
      const distance = e.changedTouches[0].clientX - touchStartX;
      if(Math.abs(distance) > 45){
        showSlide(current + (distance < 0 ? 1 : -1), true);
      }
    }, {passive: true});

    startAutoPlay();
  }

  /* Slider styling is injected here so no manual CSS file edit is required. */
  const sliderStyle = document.createElement('style');
  sliderStyle.textContent = `
    .hero-slider {
      position: relative;
      width: 100%;
      height: clamp(390px, 32vw, 500px);
      min-height: 390px;
      overflow: hidden;
      border-radius: 18px;
      background: #e8eadf;
      box-shadow: 0 22px 50px rgba(32,41,31,.14);
      isolation: isolate;
    }

    .hero-slides,
    .hero-slide {
      position: absolute;
      inset: 0;
    }

    .hero-slide {
      display: block;
      opacity: 0;
      visibility: hidden;
      transform: scale(1.015);
      transition: opacity .65s ease, transform 4.5s ease;
      text-decoration: none;
      color: inherit;
    }

    .hero-slide.active {
      opacity: 1;
      visibility: visible;
      transform: scale(1);
      z-index: 2;
    }

    .hero-slide img {
      width: 100%;
      height: 100%;
      display: block;
      object-fit: cover;
    }

    .hero-slide-shade {
      position: absolute;
      inset: 0;
      background: linear-gradient(180deg, rgba(20,29,22,.04) 30%, rgba(20,29,22,.78) 100%);
    }

    .hero-slide-content {
      position: absolute;
      left: 28px;
      right: 28px;
      bottom: 26px;
      z-index: 3;
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      color: #fff;
      text-shadow: 0 1px 3px rgba(0,0,0,.18);
    }

    .hero-slide-kicker {
      font-family: "IBM Plex Mono", monospace;
      font-size: .68rem;
      letter-spacing: .12em;
      text-transform: uppercase;
      margin-bottom: 7px;
    }

    .hero-slide-content strong {
      font-family: "Fraunces", serif;
      font-size: clamp(1.65rem, 2.8vw, 2.55rem);
      line-height: 1.05;
    }

    .hero-slide-content > span:not(.hero-slide-kicker) {
      margin-top: 7px;
      max-width: 430px;
      font-size: .9rem;
      line-height: 1.45;
    }

    .hero-slide-content em {
      margin-top: 13px;
      font-style: normal;
      font-family: "IBM Plex Mono", monospace;
      font-size: .74rem;
      letter-spacing: .04em;
      border-bottom: 1px solid rgba(255,255,255,.8);
      padding-bottom: 3px;
    }

    .hero-slider-arrow {
      position: absolute;
      top: 50%;
      z-index: 6;
      transform: translateY(-50%);
      width: 42px;
      height: 42px;
      border: 0;
      border-radius: 50%;
      background: rgba(255,255,255,.9);
      color: #20291f;
      font-size: 28px;
      line-height: 1;
      cursor: pointer;
      box-shadow: 0 6px 20px rgba(0,0,0,.14);
      transition: transform .2s ease, background .2s ease;
    }

    .hero-slider-arrow:hover {
      transform: translateY(-50%) scale(1.06);
      background: #fff;
    }

    .hero-slider-prev { left: 16px; }
    .hero-slider-next { right: 16px; }

    .hero-slider-dots {
      position: absolute;
      left: 50%;
      bottom: 13px;
      z-index: 7;
      transform: translateX(-50%);
      display: flex;
      gap: 7px;
      padding: 6px 9px;
      border-radius: 999px;
      background: rgba(20,29,22,.28);
      backdrop-filter: blur(6px);
    }

    .hero-slider-dot {
      width: 8px;
      height: 8px;
      padding: 0;
      border: 0;
      border-radius: 50%;
      background: rgba(255,255,255,.58);
      cursor: pointer;
      transition: transform .2s ease, background .2s ease;
    }

    .hero-slider-dot.active {
      background: #fff;
      transform: scale(1.25);
    }

    @media (max-width: 768px) {
      .hero-slider {
        height: 410px;
        min-height: 410px;
        margin-top: 28px;
        border-radius: 14px;
      }

      .hero-slide-content {
        left: 20px;
        right: 20px;
        bottom: 30px;
      }

      .hero-slide-content strong {
        font-size: 1.65rem;
      }

      .hero-slide-content > span:not(.hero-slide-kicker) {
        font-size: .8rem;
      }

      .hero-slider-arrow {
        width: 36px;
        height: 36px;
        font-size: 24px;
      }

      .hero-slider-prev { left: 10px; }
      .hero-slider-next { right: 10px; }
    }
  `;
  document.head.appendChild(sliderStyle);

  initHeroSlider();

  updateBagCount();
  renderCart();
})();
