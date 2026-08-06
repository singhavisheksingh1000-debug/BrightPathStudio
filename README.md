# BrightPathStudio — Digital Planner Store

A complete, production-ready, multi-page static website for a digital / printable planner shop. Built as plain HTML, CSS, and JavaScript with no build step — drag the folder into Vercel (or Netlify, Cloudflare Pages, GitHub Pages) and it's live.

Optimised for Google Search out of the box: unique meta tags per page, canonical URLs, Open Graph / Twitter cards, JSON-LD structured data (Organization, WebSite, Store, Product-style aggregate rating, FAQPage, Review, BreadcrumbList), an XML sitemap, and robots.txt.

---

## What's included

| File | Purpose |
|------|---------|
| `index.html` | Homepage — hero, collections, best sellers (working add-to-bag), bundle, testimonials, blog, newsletter |
| `about.html` | Brand story + values grid |
| `faq.html` | Accordion FAQ with **FAQPage** rich-result markup |
| `reviews.html` | Rating summary, distribution bars, review wall with **AggregateRating + Review** markup |
| `contact.html` | Contact form + support sidebar with **ContactPoint** markup |
| `privacy.html` | Privacy Policy |
| `terms.html` | Terms of Service |
| `refund.html` | Refund Policy |
| `cookies.html` | Cookie Policy (with cookie table) |
| `styles.css` | One shared stylesheet for every page |
| `main.js` | Shared JS — cart, mobile menu, cookie consent, forms, blog filter |
| `favicon.svg` | Brand icon |
| `site.webmanifest` | PWA manifest (installable on mobile) |
| `sitemap.xml` | Lists all 9 pages for search engines |
| `robots.txt` | Allows crawling + points to the sitemap |
| `vercel.json` | Security headers + asset caching |

Everything lives in **one flat folder** — that folder is the deploy root.

---

## Quick start (2 minutes)

1. Go to **[vercel.com](https://vercel.com)** and sign in (free).
2. Click **Add New → Project → Deploy** (or just drag this folder onto the Vercel dashboard).
3. When asked for a framework, choose **Other** — there's no build step.
4. Deploy. Your site is live at `https://<your-project>.vercel.app`.

That's it. See `DEPLOY.md` for the detailed walkthrough, custom domains, analytics, and wiring up the forms.

---

## Before you go live — 4 quick edits

1. **Swap the domain.** Every page currently uses `https://brightpathstudio.vercel.app`. Once you know your real URL (Vercel subdomain or custom domain), find-and-replace that string across all files — it appears in `<link rel="canonical">`, Open Graph tags, JSON-LD, `sitemap.xml`, and `robots.txt`.
2. **Set your email.** Replace `hello@brightpathstudio.com` everywhere with your real support address.
3. **Fill in the legal pages.** `privacy.html`, `terms.html`, `refund.html`, and `cookies.html` are solid starting templates for a digital-goods store, but you must review them for your business and jurisdiction. Each ends with a highlighted "Please note" reminder. **These are not legal advice.**
4. **Replace the social/OG image.** All pages point OG/Twitter previews at a stock Unsplash photo. Add a branded `1200×630` image, host it, and update the `og:image` / `twitter:image` URLs (or drop a real `og-image.png` in the folder and reference `/og-image.png`).

---

## Customising

### Colours & fonts
All design tokens live at the top of `styles.css` under `:root` — brand colours, the eight category accent colours, fonts, and radius. Change them once and the whole site updates. Fonts are Fraunces (serif), Inter (sans), and IBM Plex Mono, loaded from Google Fonts.

### Products
Product cards on `index.html` use `data-title` and `data-price` attributes on each **Add to bag** button — that's what the cart reads. Edit those attributes to change what gets added and for how much.

### The cart
The cart is a front-end demo that persists in the browser via `localStorage` (keys `bps_cart` and `bps_cookie_consent`). The **Checkout** button is a placeholder — connect it to a real payment/checkout provider (Stripe, Lemon Squeezy, Gumroad, Shopify, etc.) to actually sell.

### Forms
The newsletter and contact forms currently show a success message but don't send anywhere. `DEPLOY.md` covers wiring them to Formspree, Netlify Forms, or your own endpoint in a couple of lines.

---

## SEO notes

- Each page has a unique `<title>`, meta description, and canonical URL.
- Structured data is embedded as JSON-LD — validate it with Google's **Rich Results Test** (search.google.com/test/rich-results) after deploying.
- After going live, submit `sitemap.xml` in **Google Search Console** to speed up indexing.
- `robots.txt` allows all crawlers and references the sitemap.

---

## License

You own the right to use and customise this site for your own store. The stock imagery is loaded from Unsplash under their license; swap in your own product photography before launch.
