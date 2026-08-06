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

  // Load cart from localStorage
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

    // Attach remove handlers
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

  // Mobile menu
  if(menuToggle) menuToggle.addEventListener('click', openMenu);
  if(menuClose) menuClose.addEventListener('click', closeMenu);

  // Cart drawer
  if(bagBtn) bagBtn.addEventListener('click', openCart);
  if(cartClose) cartClose.addEventListener('click', closeCart);

  // Overlay closes both
  if(overlay){
    overlay.addEventListener('click', () => {
      closeMenu();
      closeCart();
    });
  }

  // Add to bag
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

  // Blog filter
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

  // Cookie banner
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

  // Newsletter form (placeholder — replace with real backend)
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

  // Contact form (placeholder — replace with real backend)
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

  // Initialize
  updateBagCount();
  renderCart();
})();
