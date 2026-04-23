## 0. Project Overview
Build a full-stack **Next.js 14 (App Router) e-commerce web application** called **TechVault** — a storefront for **computers, laptops, monitors, PC components, and accessories** (keyboards, mice, headsets, cables, etc.). Product data comes from the **Best Buy Products API** (public REST API; you are responsible for complying with [Best Buy's API terms](https://developer.bestbuy.com) and acceptable use).
**Best Buy Products API (reference):**
- **Base URL:** `https://api.bestbuy.com/v1/`
- **Catalog:** 1M+ current & historical products
- **Page size:** 10 default, **100 max** per request
- **Pricing:** Near real-time updates (per API docs)
- **Optional SDK:** `npm install bestbuy`
**Key facts for this app:**
- **Currency:** **USD** — display prices from the API (`salePrice` / `regularPrice` as returned). Format with `$` and sensible rounding.
- **Product identity:** Use Best Buy **`sku`** as the stable identifier (detail URLs: `/products/[sku]`).
- **Images:** Use **`image`** / **`largeFront`** (or equivalent fields from API responses) — configure `next/image` `remotePatterns` for Best Buy CDN hostnames.
- **Auth:** Same pattern as the reference build — simple in-memory user store (`data/users.json`) — no external DB required yet.
- **Payment:** Simulated gateway (5-second loader → friendly error → redirect home, **cart preserved**).
- **Member pricing:** **Simulated** — e.g. logged-in users see **5% below** the current `salePrice` (or a fixed rule you document in code comments). This is **not** Best Buy checkout; it is a demo storefront.
- **API key security:** **Never** expose `BESTBUY_API_KEY` to the browser. All Best Buy calls go through **Next.js Route Handlers** (`app/api/...`) or **Server Components** using `process.env.BESTBUY_API_KEY` only.
---
## 1. Tech Stack & Folder Structure
techVault/ ├── app/ │ ├── layout.tsx │ ├── page.tsx # Landing (Home) │ ├── products/ │ │ ├── page.tsx # Listing (search + category filters; server or client per implementation) │ │ └── [sku]/ │ │ └── page.tsx # Product detail by SKU │ ├── affiliate/ │ │ └── page.tsx │ ├── partner/ # optional: rename from "vendor" — e.g. marketplace partners │ │ └── page.tsx │ ├── about/ │ │ └── page.tsx │ ├── contact/ │ │ └── page.tsx │ ├── cart/ │ │ └── page.tsx │ ├── login/ │ │ └── page.tsx │ ├── register/ │ │ └── page.tsx │ └── api/ │ ├── bestbuy/ │ │ ├── products/ │ │ │ └── route.ts # GET proxy: search / list (query params → Best Buy) │ │ └── product/ │ │ └── [sku]/ │ │ └── route.ts # GET single product by SKU │ ├── auth/ │ │ ├── register/route.ts │ │ ├── login/route.ts │ │ └── logout/route.ts │ └── user/ │ └── me/route.ts ├── components/ │ ├── Navbar.tsx │ ├── Footer.tsx │ ├── ProductCard.tsx # props: Best Buy product shape (subset) │ ├── CartIcon.tsx │ ├── AffiliateCard.tsx │ └── PaymentModal.tsx ├── context/ │ ├── CartContext.tsx │ └── AuthContext.tsx ├── data/ │ └── users.json ├── lib/ │ ├── auth.ts │ └── bestbuy.ts # fetch helpers, URL building, format=json, pagination helpers └── public/

**Dependencies to install:**
```bash
npx create-next-app@latest techVault --typescript --tailwind --eslint --app --src-dir=false --import-alias="@/*"
cd techVault
npm install js-cookie @types/js-cookie bcryptjs @types/bcryptjs
# optional: npm install bestbuy
2. Design System
Reuse the "Midnight Gold" palette from the reference project for visual consistency, or rename tokens if you prefer a cooler "tech" accent (cyan on navy). At minimum, keep:

Dark background, card surfaces, gold/cyan accent, readable body text
Display font + UI sans + mono for prices
Apply tokens in tailwind.config.ts and app/globals.css analogous to the BookStem instructions.

3. Data Layer — Best Buy (Server-Side)
lib/bestbuy.ts — responsibilities
Base: https://api.bestbuy.com/v1/
Append apiKey from process.env.BESTBUY_API_KEY
Always request JSON, e.g. &format=json (or per Best Buy docs — ensure responses are JSON, not XML)
Helpers:
searchProducts({ query, page, pageSize, categoryPathName? }) — respect max pageSize 100
getProductBySku(sku: string)
Normalize API errors: surface friendly messages for 404 / rate limits / invalid key
Example API patterns (illustrative — verify against current Best Buy docs)
Text search: products endpoint with (search=...) style filter
Category browsing: filter on category path / slug fields as documented
Single SKU: fetch by sku in the path or filter
Typing: Define a BestBuyProduct TypeScript interface for the fields you actually use (e.g. sku, name, regularPrice, salePrice, image, largeFront, customerReviewAverage, customerReviewCount, longDescription / description, manufacturer, categoryPath).

Client-facing data flow
Listing page and detail page should consume /api/bestbuy/... routes, not call Best Buy directly from the browser.
4. Authentication — Server-Side (No DB)
Same as reference build:

data/users.json starts as []
lib/auth.ts with bcryptjs, readUsers / writeUsers / createUser / verifyUser / getUserById
User fields: include plan: 'free' | 'starter' | 'pro' for affiliate-style upsell
Cookie name: use techvault_session (or similar) instead of bookstem_session.

API routes
Mirror the BookStem auth routes (register, login, logout, me) with the new cookie name and site branding.

5. Context Providers
context/AuthContext.tsx
Same structure as reference; point fetches to /api/auth/* and /api/user/me.

context/CartContext.tsx
Cart items should store a minimal snapshot of each product so the cart works offline from further API calls:
sku, name, unitPrice (the price used when added — base or member), imageUrl, optional slugPath if any
Keys: use sku instead of book slug
Persist to localStorage key e.g. techvault_cart
totalPrice should sum stored unitPrice * qty
6. Root Layout
Wrap with AuthProvider → CartProvider
Navbar + Footer
Metadata title/description for TechVault / computers & accessories
Google Fonts same pattern as reference
7. Navbar Component
Brand: TechVault (text logo: e.g. Tech accent + Vault white)
Links: Home, Products, Affiliate, Partner (or Vendor), About, Contact
Cart with badge → /cart
Auth buttons / user greeting — same behavior as reference
8. Home / Landing Page
Adapt the BookStem homepage sections for tech:

Hero: headline about upgrading your setup / workspace; CTAs: Browse Deals / Become an Affiliate
Featured products: call internal API for a curated query (e.g. top-rated laptops or "on sale") — show 4–8 ProductCards
Why TechVault: fast shipping story (simulated), member savings, affiliate earnings
Affiliate plans: keep two-tier pricing but frame as tech audience (USD or your chosen display)
Teaser: e.g. "Warranty & Support" or "Build Your PC" cards linking to /products with a query
Testimonials
Newsletter strip (client-only success toast)
9. Products Page
app/products/page.tsx
Data: Fetch via /api/bestbuy/products?... with:
Search box (debounced) → passes q to API route
Category chips: map to Best Buy category filters you document (e.g. Laptops, Desktops, Monitors, Accessories)
Pagination: "Load more" or numbered pages — remember max 100 per request
Sort: implement using API-supported fields where possible; otherwise sort client-side on the current page only and document the limitation
Cards: ProductCard shows image, name, manufacturer, review stars, sale vs regular price
Member price: if logged in, show discounted price vs strikethrough API price
Empty / error states: user-friendly messages when API fails or returns zero results.

10. Product Detail Page
app/products/[sku]/page.tsx
Server-fetch product by SKU via lib/bestbuy or internal API route
Layout: large image gallery (primary image + thumbnails if available), title, manufacturer, SKU, ratings, price block with member logic
Description: render API description HTML safely (use allowed tags only or strip HTML per your policy)
Add to cart: uses CartContext; store snapshot with the price shown at add time
Related products: second API call, e.g. same categoryPath or search by manufacturer — horizontal scroll
11. Cart / Checkout Page
Same UX as reference:

Line items with thumb, name, price, qty stepper, remove
Subtotal, shipping line (e.g. TBD or flat $9.99 simulated), total
Checkout form: name, email, phone, address fields
PaymentModal: 5s spinner → error → Try Again / Return Home; cart not cleared
12. ProductCard Component
Props: product: BestBuyProduct (subset), showMemberPrice?: boolean

Image from API CDN
Badges: e.g. "On Sale" if salePrice < regularPrice
Reviews: customerReviewAverage + count
Price row: regular strikethrough when on sale
Add to cart button with brief "Added" state
13. Affiliate Page
Reframe copy for tech creators / deal channels; same structure: hero, how it works, plans, FAQ, CTAs to /register.

14. Partner / Vendor Page
Rename to Authorized Partners or Sell on TechVault — form collects company + contact + categories; success message only (no backend).

15–18. About, Contact, Login, Register
Same patterns as BookStem; update copy and any locale/contact details. Successful login/register redirect to /products.

19. Footer Component
4-column footer: brand, quick links, programs, newsletter. © year TechVault.

20. PaymentModal Component
Identical behavior to reference; currency display USD.

21. Global CSS
Reuse BookStem global CSS (shimmer, spinner, scrollbar, focus rings) with TechVault branding tweaks if desired.

22. Environment & Configuration
.env.local (do not commit)
BESTBUY_API_KEY=your_key_here
NEXT_PUBLIC_SITE_NAME=TechVault
NEXT_PUBLIC_CURRENCY=USD
next.config.js
Add images.remotePatterns for Best Buy image hostnames you observe in API responses (e.g. pisces.bbystatic.com — confirm live hostnames in your responses).

23. Execution Order for Cursor Agent
Scaffold Next.js app + dependencies
Design system (Tailwind + fonts + globals)
lib/bestbuy.ts + app/api/bestbuy/* proxies
data/users.json + lib/auth.ts + auth API routes
Contexts (Auth, Cart with SKU-based items)
Root layout, Navbar, Footer
Home (featured from API)
Products listing (search, filters, pagination)
Product detail [sku]
Cart + PaymentModal
Affiliate + Partner + About + Contact
Login + Register
QA: env key only on server, images load, cart persistence, auth, modal timing
24. Quality Checklist

 Best Buy API key is only used server-side

 JSON responses verified (not XML)

 Pagination respects page size ≤ 100

 Product detail works for arbitrary valid SKU

 Cart persists in localStorage; survives refresh

 Cart survives payment failure flow

 Logged-in users see member pricing where implemented

 next/image allows Best Buy CDN domains

 Mobile nav works

 npm run build passes