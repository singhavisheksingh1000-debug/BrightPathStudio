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

  function saveCart(){ try{ localStorage.setItem('bps_cart', JSON.stringify(cart)); }catch(e){} }
  function showToast(msg){ if(!toast) return; toast.textContent=msg; toast.classList.add('show'); clearTimeout(toastTimer); toastTimer=setTimeout(()=>toast.classList.remove('show'),2000); }
  function updateBagCount(){ if(!bagCount)return; if(cart.length===0){bagCount.hidden=true;}else{bagCount.hidden=false;bagCount.textContent=cart.length;} }
  function renderCart(){
    if(!cartItems||!cartTotal)return;
    if(cart.length===0){cartItems.innerHTML='<p class="cart-empty">Your bag is empty.</p>';cartTotal.textContent='$0.00';return;}
    let total=0;
    cartItems.innerHTML=cart.map((item,idx)=>{total+=item.price;return `<div class="cart-row"><div class="thumb" style="background:${item.color||'var(--accent)'}"></div><div class="meta"><h4>${item.title}</h4><span>$${item.price.toFixed(2)}</span></div><button class="rm" data-idx="${idx}" aria-label="Remove ${item.title}">×</button></div>`;}).join('');
    cartTotal.textContent='$'+total.toFixed(2);
    cartItems.querySelectorAll('.rm').forEach(btn=>btn.addEventListener('click',()=>{const idx=parseInt(btn.getAttribute('data-idx'),10);cart.splice(idx,1);saveCart();updateBagCount();renderCart();showToast('Removed from bag');}));
  }
  function openCart(){if(!cartDrawer||!overlay)return;body.classList.add('no-scroll');overlay.classList.add('open');cartDrawer.classList.add('open');}
  function closeCart(){if(!cartDrawer||!overlay)return;body.classList.remove('no-scroll');overlay.classList.remove('open');cartDrawer.classList.remove('open');}
  function openMenu(){if(!mobileMenu||!overlay)return;body.classList.add('no-scroll');overlay.classList.add('open');mobileMenu.classList.add('open');}
  function closeMenu(){if(!mobileMenu||!overlay)return;body.classList.remove('no-scroll');overlay.classList.remove('open');mobileMenu.classList.remove('open');}
  if(menuToggle)menuToggle.addEventListener('click',openMenu);
  if(menuClose)menuClose.addEventListener('click',closeMenu);
  if(bagBtn)bagBtn.addEventListener('click',openCart);
  if(cartClose)cartClose.addEventListener('click',closeCart);
  if(overlay)overlay.addEventListener('click',()=>{closeMenu();closeCart();});

  document.addEventListener('click',(e)=>{
    const btn=e.target.closest('.add-btn'); if(!btn)return; e.preventDefault();
    const card=btn.closest('.product-card'); const title=btn.dataset.title||(card&&card.querySelector('h3')?card.querySelector('h3').textContent:'Product'); const price=parseFloat(btn.dataset.price||'0')||0; const media=card?card.querySelector('.product-media'):null; const color=media?media.style.getPropertyValue('--tab-c'):'';
    cart.push({title,price,color:color||'var(--accent)'}); saveCart(); updateBagCount(); renderCart(); showToast('Added to bag');
  });

  const filterChips=document.querySelectorAll('.filter-chip'); const blogCards=document.querySelectorAll('.blog-card');
  filterChips.forEach(chip=>chip.addEventListener('click',()=>{filterChips.forEach(c=>c.classList.remove('is-active'));chip.classList.add('is-active');const filter=chip.getAttribute('data-filter');blogCards.forEach(card=>{card.hidden=!(filter==='all'||card.getAttribute('data-category')===filter);});}));

  function checkCookieConsent(){try{return localStorage.getItem('bps_cookie_consent');}catch(e){return null;}}
  function setCookieConsent(val){try{localStorage.setItem('bps_cookie_consent',val);}catch(e){}}
  if(cookieBanner&&!checkCookieConsent())setTimeout(()=>cookieBanner.classList.add('show'),1200);
  if(cookieAccept)cookieAccept.addEventListener('click',()=>{setCookieConsent('accepted');if(cookieBanner)cookieBanner.classList.remove('show');});
  if(cookieDecline)cookieDecline.addEventListener('click',()=>{setCookieConsent('declined');if(cookieBanner)cookieBanner.classList.remove('show');});

  const nform=document.getElementById('newsletterForm'); const nstatus=document.getElementById('nstatus');
  if(nform)nform.addEventListener('submit',(e)=>{e.preventDefault();if(nstatus)nstatus.textContent='Thank you for subscribing!';nform.reset();setTimeout(()=>{if(nstatus)nstatus.textContent='';},3000);});
  const cform=document.getElementById('contactForm'); const cstatus=document.getElementById('cstatus');
  if(cform)cform.addEventListener('submit',(e)=>{e.preventDefault();if(cstatus)cstatus.textContent='Message sent! We will reply soon.';cform.reset();setTimeout(()=>{if(cstatus)cstatus.textContent='';},3500);});

  /* =========================================
     HOMEPAGE HERO SLIDER
     Crisp local artwork, no stock photos.
     Covers every major BrightPathStudio store category.
  ========================================= */
  function initHeroSlider(){
    const slider=document.getElementById('heroSlider');
    if(!slider)return;

    const slides=[
      {title:'ADHD Life OS',subtitle:'Focus, time & task planning with less overwhelm',kicker:'01 • PRODUCTIVITY',image:'/assets/hero-adhd.svg',href:'/category-adhd.html',alt:'ADHD productivity planner and digital planning tools'},
      {title:'Ultimate Wedding Planner',subtitle:'300+ pages to plan, organize & celebrate your perfect day',kicker:'02 • BIG MOMENTS',image:'/assets/hero-wedding.svg',href:'/category-wedding.html',alt:'Ultimate wedding planner digital printable'},
      {title:'Pregnancy & Baby Journals',subtitle:'Capture pregnancy milestones, baby memories & first-year moments',kicker:'03 • NEW BEGINNINGS',image:'/assets/hero-pregnancy.svg',href:'/category-pregnancy-baby.html',alt:'Pregnancy journey journal and baby memory book'},
      {title:"Women's Wellness & Life Reset",subtitle:'Self-care, goals, routines & a fresh start — one page at a time',kicker:'04 • WELLNESS',image:'/assets/hero-wellness.svg',href:'/category-wellness.html',alt:'Women wellness and life reset planner'},
      {title:'Students & Career Success',subtitle:'Career goals, job search, resume, interview & professional planning',kicker:'05 • STUDENTS & CAREER',image:'/assets/hero-career.svg',href:'/category-students-career.html',alt:'Student and career success planner'},
      {title:'Kids Activity Printables',subtitle:'Creative activities, puzzles, coloring, games & learning fun',kicker:'06 • KIDS & FAMILY',image:'/assets/hero-kids.svg',href:'/category-kids.html',alt:'Kids printable activity books and games'},
      {title:'Halloween & Seasonal Printables',subtitle:'Halloween activities, party planning, crafts, games & festive fun',kicker:'07 • SEASONAL',image:'/assets/hero-seasonal.svg',href:'/category-seasonal.html',alt:'Halloween activity bundle and seasonal printable products'}
    ];

    const existingSlides=slider.querySelectorAll('.hero-slide');
    if(existingSlides.length!==slides.length){
      slider.innerHTML=`<div class="hero-slides"></div><button class="hero-slider-arrow hero-slider-prev" type="button" aria-label="Previous collection">‹</button><button class="hero-slider-arrow hero-slider-next" type="button" aria-label="Next collection">›</button><div class="hero-slider-dots" role="tablist" aria-label="Choose BrightPathStudio collection"></div>`;
    }

    const slidesContainer=slider.querySelector('.hero-slides')||slider;
    const dotsContainer=slider.querySelector('.hero-slider-dots');
    slidesContainer.innerHTML='';
    dotsContainer.innerHTML='';

    slides.forEach((slide,index)=>{
      const link=document.createElement('a');
      link.className='hero-slide'+(index===0?' active is-active':'');
      link.href=slide.href;
      link.setAttribute('aria-label',`Explore ${slide.title}`);
      link.innerHTML=`<img class="hero-slide-photo" src="${slide.image}" alt="${slide.alt}" loading="${index===0?'eager':'lazy'}"><div class="hero-slide-shade"></div><div class="hero-slide-content"><span class="hero-slide-kicker">${slide.kicker}</span><strong>${slide.title}</strong><span>${slide.subtitle}</span><em>Explore collection →</em></div>`;
      slidesContainer.appendChild(link);

      const dot=document.createElement('button');
      dot.className='hero-slider-dot'+(index===0?' active':'');
      dot.type='button'; dot.setAttribute('data-dot',String(index)); dot.setAttribute('role','tab'); dot.setAttribute('aria-label',`Show ${slide.title}`); dot.setAttribute('aria-selected',index===0?'true':'false');
      dotsContainer.appendChild(dot);
    });

    const slideEls=Array.from(slider.querySelectorAll('.hero-slide'));
    const dotEls=Array.from(slider.querySelectorAll('[data-dot]'));
    const prev=slider.querySelector('.hero-slider-prev');
    const next=slider.querySelector('.hero-slider-next');
    let current=0;
    let timer=null;

    function showSlide(index,restart=true){
      current=(index+slideEls.length)%slideEls.length;
      slideEls.forEach((el,i)=>{const active=i===current;el.classList.toggle('active',active);el.classList.toggle('is-active',active);});
      dotEls.forEach((el,i)=>{const active=i===current;el.classList.toggle('active',active);el.classList.toggle('is-active',active);el.setAttribute('aria-selected',active?'true':'false');});
      if(restart)startAutoPlay();
    }
    function startAutoPlay(){clearInterval(timer);timer=setInterval(()=>showSlide(current+1,false),5000);}
    if(prev)prev.addEventListener('click',e=>{e.preventDefault();showSlide(current-1);});
    if(next)next.addEventListener('click',e=>{e.preventDefault();showSlide(current+1);});
    dotEls.forEach((dot,index)=>dot.addEventListener('click',()=>showSlide(index)));
    slider.addEventListener('mouseenter',()=>clearInterval(timer));
    slider.addEventListener('mouseleave',startAutoPlay);
    slider.addEventListener('focusin',()=>clearInterval(timer));
    slider.addEventListener('focusout',e=>{if(!slider.contains(e.relatedTarget))startAutoPlay();});

    let touchStartX=0;
    slider.addEventListener('touchstart',e=>{touchStartX=e.changedTouches[0].clientX;},{passive:true});
    slider.addEventListener('touchend',e=>{const distance=e.changedTouches[0].clientX-touchStartX;if(Math.abs(distance)>45)showSlide(current+(distance<0?1:-1));},{passive:true});
    startAutoPlay();
  }

  const sliderStyle=document.createElement('style');
  sliderStyle.textContent=`
    .hero-redesigned .hero-grid{display:grid!important;grid-template-columns:minmax(0,.82fr) minmax(0,1.18fr);align-items:center;gap:46px}
    .hero-redesigned .hero-copy{width:auto!important;max-width:640px!important;margin:0!important;text-align:left!important}
    .hero-redesigned .hero-copy .eyebrow{justify-content:flex-start!important}
    .hero-redesigned .hero-ctas{justify-content:flex-start!important}
    .hero-redesigned .hero-meta{text-align:left!important}
    .hero-redesigned .hero-slider{display:block!important;position:relative;width:100%;height:480px;min-height:480px;overflow:hidden;border-radius:18px;background:#f2eee3;border:1px solid rgba(32,41,31,.12);box-shadow:0 24px 55px rgba(32,41,31,.14);isolation:isolate}
    .hero-redesigned .hero-slider .hero-slides{position:absolute;inset:0}
    .hero-redesigned .hero-slider .hero-slide{position:absolute!important;inset:0!important;width:100%!important;height:100%!important;display:block!important;opacity:0!important;visibility:hidden!important;pointer-events:none!important;overflow:hidden!important;text-decoration:none!important;transform:scale(1.015)!important;transition:opacity .65s ease,visibility .65s ease,transform 5s ease!important}
    .hero-redesigned .hero-slider .hero-slide.active,.hero-redesigned .hero-slider .hero-slide.is-active{opacity:1!important;visibility:visible!important;pointer-events:auto!important;z-index:2!important;transform:scale(1)!important}
    .hero-redesigned .hero-slide-photo{position:absolute!important;inset:0!important;width:100%!important;height:100%!important;display:block!important;object-fit:cover!important;object-position:center!important;filter:none!important;opacity:1!important}
    .hero-redesigned .hero-slide-shade{position:absolute!important;inset:0!important;z-index:1!important;background:linear-gradient(180deg,rgba(255,255,255,.02) 25%,rgba(32,41,31,.76) 100%)!important;pointer-events:none!important}
    .hero-redesigned .hero-slide-content{position:absolute!important;left:28px!important;right:28px!important;bottom:28px!important;z-index:4!important;display:flex!important;flex-direction:column!important;align-items:flex-start!important;max-width:88%!important;padding:0!important;color:#fff!important;text-shadow:0 1px 4px rgba(0,0,0,.28)!important;background:none!important;border:0!important}
    .hero-redesigned .hero-slide-kicker{font-family:"IBM Plex Mono",monospace!important;font-size:10px!important;letter-spacing:.12em!important;text-transform:uppercase!important;color:rgba(255,255,255,.88)!important;margin-bottom:8px!important}
    .hero-redesigned .hero-slide-content strong{font-family:"Fraunces",serif!important;font-size:clamp(30px,3.2vw,48px)!important;line-height:1.02!important;color:#fff!important;margin:0!important}
    .hero-redesigned .hero-slide-content>span:not(.hero-slide-kicker){font-family:"Inter",sans-serif!important;font-size:14px!important;line-height:1.45!important;color:rgba(255,255,255,.9)!important;margin-top:8px!important;max-width:470px!important}
    .hero-redesigned .hero-slide-content em{font-style:normal!important;font-family:"IBM Plex Mono",monospace!important;font-size:11px!important;letter-spacing:.05em!important;color:#fff!important;margin-top:14px!important;border-bottom:1px solid rgba(255,255,255,.8)!important;padding-bottom:3px!important}
    .hero-redesigned .hero-slider-arrow{position:absolute!important;top:50%!important;z-index:8!important;transform:translateY(-50%)!important;width:42px!important;height:42px!important;border:1px solid rgba(255,255,255,.65)!important;border-radius:50%!important;background:rgba(255,255,255,.9)!important;color:#20291f!important;font-size:28px!important;line-height:1!important;display:flex!important;align-items:center!important;justify-content:center!important;cursor:pointer!important;box-shadow:0 8px 22px rgba(0,0,0,.12)!important}
    .hero-redesigned .hero-slider-prev{left:16px!important}.hero-redesigned .hero-slider-next{right:16px!important}
    .hero-redesigned .hero-slider-dots{position:absolute!important;left:50%!important;bottom:14px!important;right:auto!important;top:auto!important;z-index:9!important;transform:translateX(-50%)!important;display:flex!important;gap:7px!important;padding:6px 9px!important;border-radius:999px!important;background:rgba(20,29,22,.3)!important;backdrop-filter:blur(6px)!important}
    .hero-redesigned .hero-slider-dots button{width:8px!important;height:8px!important;padding:0!important;border:0!important;border-radius:50%!important;background:rgba(255,255,255,.58)!important;cursor:pointer!important}
    .hero-redesigned .hero-slider-dots button.active,.hero-redesigned .hero-slider-dots button.is-active{background:#fff!important;transform:scale(1.25)!important}
    @media(max-width:900px){.hero-redesigned .hero-grid{grid-template-columns:1fr;gap:30px}.hero-redesigned .hero-copy{max-width:760px!important;text-align:center!important}.hero-redesigned .hero-copy .eyebrow{justify-content:center!important}.hero-redesigned .hero-ctas{justify-content:center!important}.hero-redesigned .hero-meta{text-align:center!important}.hero-redesigned .hero-slider{height:430px;min-height:430px}}
    @media(max-width:600px){.hero-redesigned .hero-slider{height:390px;min-height:390px;border-radius:14px}.hero-redesigned .hero-slide-content{left:20px!important;right:20px!important;bottom:27px!important}.hero-redesigned .hero-slide-content strong{font-size:28px!important}.hero-redesigned .hero-slide-content>span:not(.hero-slide-kicker){font-size:12px!important}.hero-redesigned .hero-slider-arrow{width:36px!important;height:36px!important;font-size:24px!important}.hero-redesigned .hero-slider-prev{left:10px!important}.hero-redesigned .hero-slider-next{right:10px!important}}
  `;
  document.head.appendChild(sliderStyle);

  /* =========================================
     PREMIUM BEST SELLERS
     Four product cards with direct Gumroad links.
  ========================================= */
  function initBestSellers(){
    const section=document.getElementById('featured-products');
    if(!section)return;
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
