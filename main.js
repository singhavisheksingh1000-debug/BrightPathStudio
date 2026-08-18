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
    try{ localStorage.setItem('bps_cart', JSON.stringify(cart)); }catch(e){}
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
    if(cart.length === 0){ bagCount.hidden = true; }
    else{ bagCount.hidden = false; bagCount.textContent = cart.length; }
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
      return `<div class="cart-row"><div class="thumb" style="background:${item.color || 'var(--accent)'}"></div><div class="meta"><h4>${item.title}</h4><span>$${item.price.toFixed(2)}</span></div><button class="rm" data-idx="${idx}" aria-label="Remove ${item.title}">×</button></div>`;
    }).join('');
    cartTotal.textContent = '$' + total.toFixed(2);
    cartItems.querySelectorAll('.rm').forEach(btn => {
      btn.addEventListener('click', () => {
        const idx = parseInt(btn.getAttribute('data-idx'), 10);
        cart.splice(idx, 1); saveCart(); updateBagCount(); renderCart(); showToast('Removed from bag');
      });
    });
  }

  function openCart(){
    if(!cartDrawer || !overlay) return;
    body.classList.add('no-scroll'); overlay.classList.add('open'); cartDrawer.classList.add('open');
  }
  function closeCart(){
    if(!cartDrawer || !overlay) return;
    body.classList.remove('no-scroll'); overlay.classList.remove('open'); cartDrawer.classList.remove('open');
  }
  function openMenu(){
    if(!mobileMenu || !overlay) return;
    body.classList.add('no-scroll'); overlay.classList.add('open'); mobileMenu.classList.add('open');
  }
  function closeMenu(){
    if(!mobileMenu || !overlay) return;
    body.classList.remove('no-scroll'); overlay.classList.remove('open'); mobileMenu.classList.remove('open');
  }

  if(menuToggle) menuToggle.addEventListener('click', openMenu);
  if(menuClose) menuClose.addEventListener('click', closeMenu);
  if(bagBtn) bagBtn.addEventListener('click', openCart);
  if(cartClose) cartClose.addEventListener('click', closeCart);
  if(overlay) overlay.addEventListener('click', () => { closeMenu(); closeCart(); });

  document.addEventListener('click', (e) => {
    const btn = e.target.closest('.add-btn');
    if(!btn) return;
    e.preventDefault();
    const card = btn.closest('.product-card');
    const title = btn.dataset.title || (card && card.querySelector('h3') ? card.querySelector('h3').textContent : 'Product');
    const price = parseFloat(btn.dataset.price || '0') || 0;
    const media = card ? card.querySelector('.product-media') : null;
    const color = media ? media.style.getPropertyValue('--tab-c') : '';
    cart.push({ title, price, color: color || 'var(--accent)' });
    saveCart(); updateBagCount(); renderCart(); showToast('Added to bag');
  });

  const filterChips = document.querySelectorAll('.filter-chip');
  const blogCards = document.querySelectorAll('.blog-card');
  filterChips.forEach(chip => {
    chip.addEventListener('click', () => {
      filterChips.forEach(c => c.classList.remove('is-active'));
      chip.classList.add('is-active');
      const filter = chip.getAttribute('data-filter');
      blogCards.forEach(card => { card.hidden = !(filter === 'all' || card.getAttribute('data-category') === filter); });
    });
  });

  function checkCookieConsent(){ try{ return localStorage.getItem('bps_cookie_consent'); }catch(e){ return null; } }
  function setCookieConsent(val){ try{ localStorage.setItem('bps_cookie_consent', val); }catch(e){} }
  if(cookieBanner && !checkCookieConsent()) setTimeout(() => cookieBanner.classList.add('show'), 1200);
  if(cookieAccept) cookieAccept.addEventListener('click', () => { setCookieConsent('accepted'); if(cookieBanner) cookieBanner.classList.remove('show'); });
  if(cookieDecline) cookieDecline.addEventListener('click', () => { setCookieConsent('declined'); if(cookieBanner) cookieBanner.classList.remove('show'); });

  const nform = document.getElementById('newsletterForm');
  const nstatus = document.getElementById('nstatus');
  if(nform){
    nform.addEventListener('submit', (e) => { e.preventDefault(); if(nstatus) nstatus.textContent = 'Thank you for subscribing!'; nform.reset(); setTimeout(() => { if(nstatus) nstatus.textContent = ''; }, 3000); });
  }
  const cform = document.getElementById('contactForm');
  const cstatus = document.getElementById('cstatus');
  if(cform){
    cform.addEventListener('submit', (e) => { e.preventDefault(); if(cstatus) cstatus.textContent = 'Message sent! We will reply soon.'; cform.reset(); setTimeout(() => { if(cstatus) cstatus.textContent = ''; }, 3500); });
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
      {title:'ADHD Life OS',subtitle:'Focus, organize & plan with less overwhelm',alt:'ADHD Life OS digital planner',image:'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?q=85&w=1200&auto=format&fit=crop',href:'/category-adhd.html'},
      {title:'Wedding Planner',subtitle:'Plan your dream wedding from yes to “I do”',alt:'Elegant wedding planning materials',image:'https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=85&w=1200&auto=format&fit=crop',href:'/category-wedding.html'},
      {title:'Pregnancy Planner',subtitle:'Capture the journey and prepare for baby',alt:'Pregnancy and baby memory planning',image:'https://images.unsplash.com/photo-1516627145497-ae6968895b74?q=85&w=1200&auto=format&fit=crop',href:'/category-pregnancy-baby.html'},
      {title:'Kids Activity Books',subtitle:'Fun printable activities for creative kids',alt:'Kids creative activity materials',image:'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?q=85&w=1200&auto=format&fit=crop',href:'/category-kids.html'},
      {title:'Festive Printables',subtitle:'Halloween fun, party planning & seasonal activities',alt:'Halloween festive planning and activities',image:'https://images.unsplash.com/photo-1543589077-47d81606c1bf?q=85&w=1200&auto=format&fit=crop',href:'/category-seasonal.html'}
    ];
    const slider=document.createElement('div');
    slider.className='hero-slider';
    slider.setAttribute('aria-label','BrightPathStudio planner categories');
    slider.innerHTML='<div class="hero-slides"></div><button class="hero-slider-arrow hero-slider-prev" type="button" aria-label="Previous category">‹</button><button class="hero-slider-arrow hero-slider-next" type="button" aria-label="Next category">›</button><div class="hero-slider-dots" role="tablist" aria-label="Choose planner category"></div>';
    const slidesContainer=slider.querySelector('.hero-slides');
    const dotsContainer=slider.querySelector('.hero-slider-dots');
    slides.forEach((slide,index)=>{
      const link=document.createElement('a');
      link.className='hero-slide'+(index===0?' active':''); link.href=slide.href; link.setAttribute('aria-label',`Explore ${slide.title}`);
      link.innerHTML=`<img src="${slide.image}" alt="${slide.alt}" loading="${index===0?'eager':'lazy'}"><div class="hero-slide-shade"></div><div class="hero-slide-content"><span class="hero-slide-kicker">BrightPathStudio Collection</span><strong>${slide.title}</strong><span>${slide.subtitle}</span><em>Explore collection →</em></div>`;
      slidesContainer.appendChild(link);
      const dot=document.createElement('button'); dot.className='hero-slider-dot'+(index===0?' active':''); dot.type='button'; dot.setAttribute('role','tab'); dot.setAttribute('aria-label',`Show ${slide.title}`); dot.setAttribute('aria-selected',index===0?'true':'false');
      dot.addEventListener('click',()=>showSlide(index,true)); dotsContainer.appendChild(dot);
    });
    oldMock.replaceWith(slider);
    const slideEls=Array.from(slidesContainer.querySelectorAll('.hero-slide')); const dotEls=Array.from(dotsContainer.querySelectorAll('.hero-slider-dot')); const prev=slider.querySelector('.hero-slider-prev'); const next=slider.querySelector('.hero-slider-next'); let current=0; let timer=null;
    function showSlide(index,restartTimer=false){ current=(index+slideEls.length)%slideEls.length; slideEls.forEach((el,i)=>el.classList.toggle('active',i===current)); dotEls.forEach((el,i)=>{const active=i===current;el.classList.toggle('active',active);el.setAttribute('aria-selected',active?'true':'false');}); if(restartTimer) startAutoPlay(); }
    function startAutoPlay(){clearInterval(timer);timer=setInterval(()=>showSlide(current+1),4500);}
    prev.addEventListener('click',event=>{event.preventDefault();showSlide(current-1,true);}); next.addEventListener('click',event=>{event.preventDefault();showSlide(current+1,true);});
    slider.addEventListener('mouseenter',()=>clearInterval(timer)); slider.addEventListener('mouseleave',startAutoPlay); slider.addEventListener('focusin',()=>clearInterval(timer)); slider.addEventListener('focusout',event=>{if(!slider.contains(event.relatedTarget))startAutoPlay();});
    let touchStartX=0; slider.addEventListener('touchstart',e=>{touchStartX=e.changedTouches[0].clientX;},{passive:true}); slider.addEventListener('touchend',e=>{const distance=e.changedTouches[0].clientX-touchStartX;if(Math.abs(distance)>45)showSlide(current+(distance<0?1:-1),true);},{passive:true});
    startAutoPlay();
  }

  const sliderStyle=document.createElement('style');
  sliderStyle.textContent=`
    .hero-slider{position:relative;width:100%;height:clamp(390px,32vw,500px);min-height:390px;overflow:hidden;border-radius:18px;background:#e8eadf;box-shadow:0 22px 50px rgba(32,41,31,.14);isolation:isolate}
    .hero-slides,.hero-slide{position:absolute;inset:0}.hero-slide{display:block;opacity:0;visibility:hidden;transform:scale(1.015);transition:opacity .65s ease,transform 4.5s ease;text-decoration:none;color:inherit}.hero-slide.active{opacity:1;visibility:visible;transform:scale(1);z-index:2}.hero-slide img{width:100%;height:100%;display:block;object-fit:cover}.hero-slide-shade{position:absolute;inset:0;background:linear-gradient(180deg,rgba(20,29,22,.04) 30%,rgba(20,29,22,.78) 100%)}
    .hero-slide-content{position:absolute;left:28px;right:28px;bottom:26px;z-index:3;display:flex;flex-direction:column;align-items:flex-start;color:#fff;text-shadow:0 1px 3px rgba(0,0,0,.18)}.hero-slide-kicker{font-family:"IBM Plex Mono",monospace;font-size:.68rem;letter-spacing:.12em;text-transform:uppercase;margin-bottom:7px}.hero-slide-content strong{font-family:"Fraunces",serif;font-size:clamp(1.65rem,2.8vw,2.55rem);line-height:1.05}.hero-slide-content>span:not(.hero-slide-kicker){margin-top:7px;max-width:430px;font-size:.9rem;line-height:1.45}.hero-slide-content em{margin-top:13px;font-style:normal;font-family:"IBM Plex Mono",monospace;font-size:.74rem;letter-spacing:.04em;border-bottom:1px solid rgba(255,255,255,.8);padding-bottom:3px}
    .hero-slider-arrow{position:absolute;top:50%;z-index:6;transform:translateY(-50%);width:42px;height:42px;border:0;border-radius:50%;background:rgba(255,255,255,.9);color:#20291f;font-size:28px;line-height:1;cursor:pointer;box-shadow:0 6px 20px rgba(0,0,0,.14);transition:transform .2s ease,background .2s ease}.hero-slider-arrow:hover{transform:translateY(-50%) scale(1.06);background:#fff}.hero-slider-prev{left:16px}.hero-slider-next{right:16px}.hero-slider-dots{position:absolute;left:50%;bottom:13px;z-index:7;transform:translateX(-50%);display:flex;gap:7px;padding:6px 9px;border-radius:999px;background:rgba(20,29,22,.28);backdrop-filter:blur(6px)}.hero-slider-dot{width:8px;height:8px;padding:0;border:0;border-radius:50%;background:rgba(255,255,255,.58);cursor:pointer;transition:transform .2s ease,background .2s ease}.hero-slider-dot.active{background:#fff;transform:scale(1.25)}
    @media(max-width:768px){.hero-slider{height:410px;min-height:410px;margin-top:28px;border-radius:14px}.hero-slide-content{left:20px;right:20px;bottom:30px}.hero-slide-content strong{font-size:1.65rem}.hero-slide-content>span:not(.hero-slide-kicker){font-size:.8rem}.hero-slider-arrow{width:36px;height:36px;font-size:24px}.hero-slider-prev{left:10px}.hero-slider-next{right:10px}}
  `;
  document.head.appendChild(sliderStyle);

  /* =========================================
     PREMIUM BEST SELLERS
     Four product cards with direct Gumroad links.
  ========================================= */
  function initBestSellers(){
    const section=document.getElementById('featured-products');
    if(!section) return;
    const products=[
      {category:'ADHD',title:'ADHD Life OS — Complete 2-in-1',desc:'A complete hyperlinked digital planner to organize focus, time, tasks and everyday life with less overwhelm.',image:'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?q=85&w=1000&auto=format&fit=crop',url:'https://avisheksingh3.gumroad.com/l/xzvmyr',badge:'Best Seller'},
      {category:'ADHD',title:'ADHD Focus & Time Planner',desc:'Plan deep work, manage time, organize tasks and build a practical productivity system that works with your day.',image:'https://images.unsplash.com/photo-1499750310107-5fef28a66643?q=85&w=1000&auto=format&fit=crop',url:'https://avisheksingh3.gumroad.com/l/jbeldk',badge:''},
      {category:'Wedding',title:'Ultimate Wedding Planner',desc:'Bring your wedding plans together in one beautiful system—from early decisions to the big day.',image:'https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=85&w=1000&auto=format&fit=crop',url:'https://avisheksingh3.gumroad.com/l/famevm',badge:'Popular'},
      {category:'Wellness',title:'Ultimate Life Reset Planner for Women',desc:'Reset your routines, priorities and goals with guided pages designed for a clearer, more intentional life.',image:'https://images.unsplash.com/photo-1499209974431-9dddcece7f88?q=85&w=1000&auto=format&fit=crop',url:'https://avisheksingh3.gumroad.com/l/3ojr5q',badge:''}
    ];
    section.className='featured-section best-sellers-section';
    section.innerHTML=`<div class="wrap"><div class="best-sellers-heading"><span class="eyebrow">BEST SELLERS</span><h2>Tools people actually use.</h2><p>Start with our most popular planners, journals, and printable tools.</p></div><div class="best-sellers-grid">${products.map(p=>`<article class="best-seller-card"><a class="best-seller-media" href="${p.url}" target="_blank" rel="noopener noreferrer"><img src="${p.image}" alt="${p.title}" loading="lazy">${p.badge?`<span class="best-seller-badge">${p.badge}</span>`:''}<span class="best-seller-category">${p.category}</span></a><div class="best-seller-body"><span class="best-seller-type">DIGITAL PRODUCT</span><h3>${p.title}</h3><p>${p.desc}</p><div class="best-seller-meta"><span class="stars" aria-label="Five star rating">★★★★★</span><span class="price-label">View price</span></div><a class="best-seller-cta" href="${p.url}" target="_blank" rel="noopener noreferrer">View Product →</a></div></article>`).join('')}</div></div>`;
  }

  const bestSellerStyle=document.createElement('style');
  bestSellerStyle.textContent=`
    .best-sellers-section{padding:88px 0;background:var(--paper-card,#f4f1e6);border-top:1px solid var(--line,#d8d5c8);border-bottom:1px solid var(--line,#d8d5c8)}
    .best-sellers-heading{max-width:700px;margin-bottom:38px}.best-sellers-heading h2{font-family:var(--serif,"Fraunces",serif);font-size:clamp(34px,4vw,52px);line-height:1.05;margin:9px 0 12px;color:var(--ink,#20291f)}.best-sellers-heading p{margin:0;color:var(--ink-soft,#5d625a);font-size:16px;max-width:58ch}
    .best-sellers-grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:22px}.best-seller-card{background:var(--paper,#f9f7ef);border:1px solid var(--line,#d8d5c8);box-shadow:0 12px 28px rgba(32,41,31,.07);transition:transform .25s ease,box-shadow .25s ease;overflow:hidden}.best-seller-card:hover{transform:translateY(-5px);box-shadow:0 20px 38px rgba(32,41,31,.13)}
    .best-seller-media{display:block;position:relative;aspect-ratio:4/3;overflow:hidden;background:#e6e3d8}.best-seller-media img{width:100%;height:100%;object-fit:cover;display:block;transition:transform .45s ease}.best-seller-card:hover .best-seller-media img{transform:scale(1.045)}.best-seller-badge,.best-seller-category{position:absolute;top:14px;font-family:var(--mono,"IBM Plex Mono",monospace);font-size:10px;letter-spacing:.08em;text-transform:uppercase;padding:7px 9px;background:#fff;color:var(--ink,#20291f)}.best-seller-badge{left:14px}.best-seller-category{right:14px;background:rgba(255,255,255,.9)}
    .best-seller-body{padding:23px 22px 24px}.best-seller-type{font-family:var(--mono,"IBM Plex Mono",monospace);font-size:9px;letter-spacing:.11em;color:var(--accent-ink,#8a6a26)}.best-seller-body h3{font-family:var(--serif,"Fraunces",serif);font-size:22px;line-height:1.12;margin:9px 0 10px;color:var(--ink,#20291f)}.best-seller-body p{font-size:13px;line-height:1.55;color:var(--ink-soft,#5d625a);margin:0;min-height:82px}.best-seller-meta{display:flex;align-items:center;justify-content:space-between;gap:10px;margin:18px 0 15px;padding-top:14px;border-top:1px solid var(--line,#d8d5c8)}.stars{font-size:13px;letter-spacing:2px;color:#9a762b}.price-label{font-family:var(--mono,"IBM Plex Mono",monospace);font-size:11px;color:var(--ink-soft,#5d625a)}.best-seller-cta{display:flex;align-items:center;justify-content:center;min-height:44px;background:var(--ink,#20291f);color:#fff;text-decoration:none;font-family:var(--mono,"IBM Plex Mono",monospace);font-size:11px;letter-spacing:.03em;border:1px solid var(--ink,#20291f);transition:background .2s ease,transform .2s ease}.best-seller-cta:hover{background:#394535;transform:translateY(-1px)}
    @media(max-width:1100px){.best-sellers-grid{grid-template-columns:repeat(2,minmax(0,1fr))}.best-seller-body p{min-height:0}}
    @media(max-width:600px){.best-sellers-section{padding:64px 0}.best-sellers-grid{grid-template-columns:1fr;gap:18px}.best-seller-media{aspect-ratio:16/10}.best-seller-body{padding:21px}.best-seller-body h3{font-size:23px}}
  `;
  document.head.appendChild(bestSellerStyle);

  initHeroSlider();
  initBestSellers();
  updateBagCount();
  renderCart();
})();
