# Glantra: E-commerce (Next.js) - Build & handoff spec

This document describes **the app as built** in this repository: a **Glantra**-branded storefront (you can rebrand and swap product verticals by following the “Changing products / vertical” section). It is meant to be **shared with another project or team** to reproduce or extend the same architecture.

> **Not used in this app:** the original “TechVault + Best Buy API” spec. Catalog data here comes from **DummyJSON** (`https://dummyjson.com`). The folder path `app/api/bestbuy/` is a **legacy name**; handlers call DummyJSON, not Best Buy.

---

## 1. One-page summary

| Area | What we use |
|------|-------------|
| **Framework** | **Next.js 16** (App Router), **React 18**, **TypeScript** |
| **Styling** | **Tailwind CSS 3** - slate/cyan/amber, optional **brand** green tokens, Google fonts (Sora, DM Sans, JetBrains Mono) |
| **Catalog** | **DummyJSON Products API** (public, no key). Server-side fetches + Next `revalidate` caching |
| **Auth** | Email/password, **bcrypt** hashes, users in **`src/data/users.json`**, **HTTP-only** signed session cookie `techvault_session` (HMAC, `SESSION_SECRET`) |
| **Cart** | **React Context** + **localStorage** persistence |
| **Checkout** | **Sign-in required** (server + client gate). No guest checkout. Profile PATCH, then **simulated payment** modal (always fails with friendly message, cart kept) |
| **Partner** | **Sign-in required** (server layout redirect). Shown in nav/footer only when logged in |
| **“Chat with us”** | **Guests:** toast + redirect to login. **Signed-in:** opens **AI product assistant** (OpenAI) + link to **Contact**; floating panel **ChatWidgetProvider** |
| **AI assistant** | `POST /api/ai/chat` - OpenAI chat completions, catalog context from DummyJSON, **auth required** |
| **Policies** | Markdown in **`src/content/legal/`**, rendered via `MarkdownArticle` / legal pages |

**Node:** `>=20.9.0` (see `package.json` `engines`).

---

## 2. Product philosophy (this build)

- **Laptops** and **tablets** (and related accessories) as the public story; **phones/smartphones** were **removed** as a product category in UI and in `categories.ts`.
- **USD** display via `Intl` / `formatUsd` in `src/lib/pricing.ts` - not repeated in marketing copy as “US dollars (USD)”.
- **No em dashes (—)** in user-facing copy (policy of this project); use periods, commas, or **·** where needed.
- **Newsletter** exists as a **home page section** (`Newsletter` component) - not in the **footer** (footer has **Policies** column: privacy + returns).

---

## 3. Environment variables

Copy **`.env.local.example`** to **`.env.local`** and set:

| Variable | Purpose |
|----------|---------|
| `SESSION_SECRET` | Long random string for HMAC session tokens (required in production) |
| `NEXT_PUBLIC_SITE_NAME` | Default site name, e.g. `Glantra` (`src/lib/site.ts`) |
| `NEXT_PUBLIC_SITE_DOMAIN` | Domain string in copy, e.g. `glantrastore.com` |
| `NEXT_PUBLIC_SITE_URL` | Used for `metadataBase` in `app/layout.tsx` |
| `NEXT_PUBLIC_CURRENCY` | Documented; pricing code uses `formatUsd` / USD |
| `OPENAI_API_KEY` | **Required** for AI chat to work; without it, `/api/ai/chat` returns 503 |
| `OPENAI_MODEL` | Optional; default **`gpt-4o-mini`** in `app/api/ai/chat/route.ts` |

**No API key** is required for DummyJSON (public).

---

## 4. Install & scripts

```bash
npm install
# or: yarn / pnpm

npm run dev     # next dev
npm run build   # next build
npm run start   # next start
npm run lint    # tsc --noEmit (TypeScript as lint)
```

---

## 5. Dependencies (runtime, notable)

- **next**, **react**, **react-dom**
- **@hookform/resolvers**, **react-hook-form**, **yup** - forms (checkout, contact, auth)
- **bcryptjs** - password hashing
- **framer-motion** - e.g. `AnimatedSection`, home motion
- **react-hot-toast** - toasts
- **react-markdown** - legal pages + AI assistant replies in `AIChatPanel`

---

## 6. High-level folder structure

```
src/
├── app/
│   ├── layout.tsx              # Root: fonts, AuthProvider, ChatWidgetProvider, CartProvider, Navbar, main, Footer, AIChatPanel, ChatUsButton, HotToaster
│   ├── globals.css
│   ├── page.tsx                # Home: HeroCarousel, categories, featured, shipping strip, Newsletter
│   ├── products/
│   │   ├── page.tsx            # Server shell + ProductsClient (search, category, pagination)
│   │   └── [sku]/page.tsx     # Product detail
│   ├── cart/page.tsx
│   ├── checkout/
│   │   ├── layout.tsx         # Server: must be logged in (redirect to /login?next=/checkout)
│   │   └── page.tsx            # Client: shipping form, profile PATCH, PaymentModal
│   ├── login/, register/
│   ├── dashboard/             # Account + “Chat with us” card (contact + “Open product assistant”)
│   ├── partner/               # layout.tsx: auth gate → /login?next=/partner
│   │   └── PartnerForm.tsx
│   ├── about/, contact/
│   ├── privacy/, returns/     # Legal markdown
│   ├── not-found.tsx
│   └── api/
│       ├── bestbuy/
│       │   ├── products/route.ts    # GET → fetchDummyJsonProducts
│       │   └── product/[sku]/route.ts
│       ├── auth/ login, register, logout
│       ├── user/ me, profile
│       └── ai/chat/route.ts         # OpenAI, optional catalog context
├── components/                # Navbar, Footer, ProductCard, CartView, AIChatPanel, ChatUsButton, etc.
├── context/                   # AuthContext, CartContext, ChatWidgetContext
├── data/users.json
├── content/legal/             # privacy-policy.md, return-policy.md
├── lib/
│   ├── site.ts
│   ├── contact-info.ts
│   ├── categories.ts          # Slugs ↔ DummyJSON category slugs
│   ├── dummyjson.ts           # All DummyJSON access + map to StoreProduct
│   ├── store-types.ts
│   ├── pricing.ts
│   ├── auth.ts, session.ts, server-auth.ts
│   └── ai/build-product-context.ts
└── types/user.ts
```

`next.config.mjs` - **`images.remotePatterns`** for DummyJSON CDNs and `placehold.co`.

---

## 7. Catalog: DummyJSON (not Best Buy)

- **Base:** `https://dummyjson.com` (see [DummyJSON products docs](https://dummyjson.com/docs/products)).
- **Normalized type:** `StoreProduct` in `src/lib/store-types.ts` (sku, name, sale/regular price, image, description, categoryPath, reviews, etc.).
- **Mapping:** `src/lib/dummyjson.ts` - `mapDummy` maps API JSON to `StoreProduct`; `fetchDummyJsonProducts` supports pagination, `categorySlug`, search `q`, and merge across categories.
- **HTTP routes (legacy name `bestbuy`):**
  - **`GET /api/bestbuy/products`** - query: `page`, `pageSize`, `q`, `category` (must match a slug in `src/lib/categories.ts`).
  - **`GET /api/bestbuy/product/[sku]`** - single product by id.

**Why “bestbuy” in the path?** Historical; implementation is 100% DummyJSON. You may rename the route folder to e.g. `api/store/products` in a fork (update fetches in `ProductsClient` and any server fetches).

---

## 8. Categories - how they work and how to change the product vertical

**File:** `src/lib/categories.ts`

- Defines **`ProductCategorySlug`** (a union of string literals, e.g. `'laptops-computers' | 'accessories'`).
- Each entry has: **`slug`** (URL/query param), **`label`**, **`description`**, **`dummyjsonCategorySlug`**.

`dummyjsonCategorySlug` must be a **valid DummyJSON product category** string (e.g. `laptops`, `tablets`, `smartphones`, `groceries`, `home-decoration`, etc. - see DummyJSON for the full list).

**To sell a different kind of product (not electronics):**

1. **Pick** DummyJSON categories that match your vertical (e.g. `skincare`, `home-decoration`, `groceries`).
2. **Edit** `PRODUCT_CATEGORIES` in `categories.ts` - set `slug`/`label`/`description` for your UX and set **`dummyjsonCategorySlug`** to the DummyJSON category name.
3. **Update** `ProductCategorySlug` TypeScript union to match your new slugs.
4. **Search and replace** across the repo for old slugs in links (e.g. `products/page.tsx` `SLUGS`, `page.tsx` home “Shop by category” and hero links, `src/lib/ai/build-product-context.ts` intro text, marketing copy on `page.tsx` / `about` / `layout` metadata).
5. **Home / featured** fetches in `app/page.tsx` use `getCategoryBySlug('laptops-computers')` and `accessories` - align those with your new slugs.
6. **AI** system prompt in `app/api/ai/chat/route.ts` and **text** in `lib/ai/build-product-context.ts` still mention “laptops/tablets” until you reword for your store.

**`src/lib/dummyjson.ts`** also filters the **all-products merge** to only `PRODUCT_CATEGORIES`’ `dummyjsonCategorySlug` values when no search query is applied - so your category list is the allowlist for the default catalog.

---

## 9. Auth & sessions

- **Storage:** `src/data/users.json` (array of `UserRecord` - `src/types/user.ts`). No database.
- **Register / login** - `src/app/api/auth/register/route.ts`, `login/route.ts`; cookie **`techvault_session`**, `httpOnly`, `sameSite: lax`, `path: /`.
- **Session format:** HMAC signed payload in `src/lib/session.ts` (`createSessionToken` / `parseSessionToken`); `SESSION_SECRET` must not be the default in production.
- **Client** - `AuthContext` fetches `GET /api/user/me` with credentials; exposes `user`, `loading`, `setUser`, `refresh`.
- **Server** - `src/lib/server-auth.ts` - `getServerUser()` for layouts (partner, checkout).

**Public user shape:** `PublicUser` = user without `passwordHash`.

**Profile** - `PATCH /api/user/profile` (name + profile: phone, address fields); used at checkout to save shipping.

---

## 10. Route protection (login required)

| Feature | Mechanism |
|---------|-----------|
| **Checkout** | `app/checkout/layout.tsx` - `getServerUser()`; if missing, `redirect('/login?next=/checkout')`. Client page also syncs. |
| **Cart → Checkout** | `CartView` - if not `user`, button is **“Log in to checkout”** → `/login?next=/checkout`. |
| **Partner** | `app/partner/layout.tsx` - redirect to login with `next=/partner`. Navbar/footer **Partner** only if `user`. |
| **AI chat** | `POST /api/ai/chat` - 401 if no valid session. Floating `ChatUsButton` for guests: toast + login with `next` = current path. |
| **Dashboard** | Client redirect to login if not authenticated. |

**Login** - `LoginForm` respects `?next=` for return URL after sign-in (must be path starting with `/`).

---

## 11. Cart & pricing

- **`CartContext`** - lines with sku, name, price snapshot, image, quantity; `localStorage` key for persistence.
- **Unit price** - `getUnitPrice` + **`formatUsd`** in `src/lib/pricing.ts` (USD `Intl` formatting).
- **Shipping** - flat constant in `CartView` / checkout (e.g. 9.99) - adjust in code as needed.
- **Payment** - `components/PaymentModal.tsx`: short fake “loading” then error toast; **no real charge**; in error state, **Back to products** calls `router.push('/products')` and closes the modal. **Cancel** closes without navigation.

---

## 12. Key pages (behavior)

- **/** - Server-rendered; fetches featured + tablet spot from DummyJSON; `HeroCarousel` slides; `Newsletter` strip at bottom.
- **/products** - `ProductsClient` fetches `/api/bestbuy/products` with debounced search and category chips.
- **/products/[sku]** - Server component + `AddToCartButton`, `ProductCard` patterns.
- **/cart** - `CartView`.
- **/checkout** - Logged in only; form → `PATCH` profile → `PaymentModal`.
- **/contact** - Contact form, optional fields, toast.
- **/dashboard** - Profile summary, shopping links, “Chat with us” card (call, contact, open AI assistant).
- **/partner** - “Partner with us” form (interest capture + toast) - **auth only** at layout level.
- **/privacy**, **/returns** - `LegalPageShell` + markdown from `content/legal/`.
- **/login**, **/register** - `LoginForm`, `RegisterForm` with yup.

---

## 13. UI / design

- **Fonts:** `layout.tsx` - Sora (display), DM Sans, JetBrains Mono (CSS variables `--font-sora`, etc.).
- **Components:** `PageHeader` (breadcrumbs, title, description), `GlantraLogo`, `ProductCard`, `HeroCarousel` (home), `CartIcon` in `Navbar`, `HotToaster` (react-hot-toast), `Footer` (4 columns: brand, Shop, Company, **Policies**).
- **Floating UI:** `ChatUsButton` (z-index ~60), `AIChatPanel` (~70) when open, above main content.
- **Tailwind** - `tailwind.config.ts`: brand green palette, cyan, `font-display` / `font-sans` / `font-mono` mapped to CSS variables.

---

## 14. AI product assistant

- **Files:** `src/components/AIChatPanel.tsx`, `src/context/ChatWidgetContext.tsx`, `src/app/api/ai/chat/route.ts`, `src/lib/ai/build-product-context.ts`.
- **Flow:** Logged-in user toggles “Chat with us” → panel opens. Messages posted to **OpenAI** with a **system prompt** + **catalog text** built from `buildProductContextForAI()` (samples per category in `categories.ts`).
- **Requires** `OPENAI_API_KEY` (503 with JSON error if missing).
- Assistant messages rendered with **react-markdown**; user can link to **/contact** from panel header.

---

## 15. Contact & brand constants

**`src/lib/contact-info.ts`** - address, phone, payments email, site URL. Update for your deployment and keep legal markdown in sync if needed.

---

## 16. Legal content

- **`src/content/legal/privacy-policy.md`**
- **`src/content/legal/return-policy.md`**

Routes **/privacy** and **/returns** load these. Edit markdown for the new brand/store.

---

## 17. `next.config.mjs` (images)

Allow remote images for:

- `cdn.dummyjson.com`, `i.dummyjson.com`, `placehold.co`

Add hosts here if you switch CDN or add more image domains.

---

## 18. Rebranding / fork checklist (quick)

- [ ] `NEXT_PUBLIC_*` in `.env.local` and `package.json` name
- [ ] `site.ts`, `contact-info.ts`, `layout.tsx` metadata, logo component / wordmark
- [ ] `categories.ts` + home/products copy + `build-product-context` + AI route intro text
- [ ] `content/legal/*.md` and any footer/header strings
- [ ] `data/users.json` (seed or empty for new env)
- [ ] Rename `api/bestbuy` → clearer name and update fetches
- [ ] `SESSION_SECRET` and `OPENAI_API_KEY` in production

---

## 19. Known limitations / intent

- **No real payment** - demo UX only.
- **Single-user JSON file** - not suitable for high concurrency; replace with a DB in production if needed.
- **DummyJSON** is demo data - not your real catalog unless you replace the data layer.
- **Route name `bestbuy`** - misleading; safe to rename in a clean fork.

This file should be enough to **rebuild the same architecture** in a clean repo: swap **DummyJSON categories** and **branding** to match any vertical the DummyJSON API supports, then adjust copy and env vars.

---

## 20. Portable blueprint: what any e-commerce web app should cover

Use this as a **checklist for other projects** (any stack), not only this repo. Tick items for scope; skip what you do not need.

| Area | What to include (typical) |
|------|----------------------------|
| **Catalog** | List + detail, stable product ids in URLs, search and/or categories, clear price and availability or disclaimers, product images with fallbacks, optional ratings/reviews from your API. |
| **Cart** | Add/update/remove lines, subtotal, shipping rules or estimate, tax messaging if required by region, guest vs signed-in strategy (this app: checkout requires login). |
| **Checkout** | Address and contact, order summary, payment (real gateway or clearly simulated for demos), confirmation or failure handling, no surprise charges in copy. |
| **Account** | Register, login, logout, session duration policy, profile/shipping, optional order history (not in this demo). |
| **Trust & legal** | Privacy policy, returns/refund policy, contact and business identity, link them in the footer. |
| **Support** | Contact form or email, optional chat (this app: AI + contact). |
| **Admin** | Not in this repo; production stores need catalog/order management (separate app or service). |
| **Operations** | Email receipts, real payment webhooks, inventory sync - plan when leaving demo data. |

**Security (always):** never expose API keys to the browser; use HTTPS in production; hash passwords; protect account and payment routes; rate-limit public APIs if abused.

**Stack-agnostic idea:** the **browser** is only a client; **secrets and business rules** stay on a server (here: Next **Route Handlers** and server runtimes), same pattern if you use Laravel, Rails, or a separate BFF.

---

## 21. Mobile responsiveness (reuse as project rules)

**What “mobile” means here (important):** **responsive website in a mobile web browser** - Safari on iPhone, Chrome on Android, etc. The user opens your **normal URL**; CSS/HTML/JS adapt the layout (breakpoints, touch targets). This is **not** a separate **native** iOS or Android app built with Swift, Kotlin, or React Native, unless you explicitly add one later. The testing and layout guidance below is for **mobile web**, not the app stores.

**Goal:** the store must be usable on **phones and tablets in the browser**, not only on desktop, without installing an app.

**How this app does it (Tailwind):**

- **Breakpoints** use Tailwind’s defaults: `sm:`, `md:`, `lg:` (e.g. `md:flex`, `sm:grid-cols-2`, `lg:grid-cols-4`, `md:hidden` for the hamburger area on the `Navbar`, `px-4 sm:px-6` for horizontal padding on the main column).
- **Layout:** single column on small screens, multi-column and side-by-side only from `sm` / `md` / `lg` up (home sections, product grids, cart + summary, checkout form + order summary).
- **Navigation:** main nav links are **hidden** on small viewports and exposed via a **menu button**; account actions adapt (`Navbar`).
- **Touch targets:** buttons and key links are padded (not tiny 1px text links only); the floating **Chat** control uses a comfortable tap size and sits **inset from edges** so it is not under notches (see `max-w` / `bottom-5` patterns).
- **Media:** `next/image` with `sizes` on cards where it matters; `remotePatterns` in `next.config.mjs` for your CDN.
- **Overflow:** long product titles use `line-clamp` or truncation where list rows would break layout.

**Reusable instruction block you can paste into another app’s spec:**

1. **Viewport:** set `<meta name="viewport" content="width=device-width, initial-scale=1">` (Next.js `metadata` / root `layout` handles this; do not let users zoom into a broken 980px fixed layout on mobile).
2. **Test real devices or browser dev tools** at 375px, 390px, 768px width at minimum before launch.
3. **Forms:** full-width inputs on narrow screens; labels above fields; `font-size` at least **16px** on inputs on iOS or Safari may zoom awkwardly (use `text-base` on mobile inputs if needed).
4. **Modals and drawers** (e.g. payment, chat): full-width or max-width, scroll inside the panel, do not trap focus without an escape path; `z-index` high enough to sit over the nav but keep **close** controls visible.
5. **Tables:** if you add order tables later, use horizontal scroll or card layout on small screens, not a wide unscrollable table.
6. **Performance on mobile:** lazy-load below-the-fold images, avoid huge hero assets, keep JS bundle in check; Next helps with code splitting, but **large carousels** and **AI panels** should still be measured.

**Optional later:** a **PWA** (manifest + service worker) is still a **web** experience (often “Add to home screen” that opens in a webview); it is not required for “mobile responsive” in the sense above.

---

## 22. SEO, accessibility, and quality bar (portable add-ons)

| Topic | Suggestion |
|-------|------------|
| **SEO** | Unique `title` / `description` per main route, semantic headings (`h1` once per page), clean URLs, `metadataBase` for absolute social preview URLs, optional Open Graph / Twitter image later. |
| **Accessibility** | Sufficient color contrast, visible focus states on interactive elements, `aria-label` on icon-only buttons, form errors associated with fields, `alt` on product images. |
| **i18n** | Not in this app; for multi-country, plan currency, locale formatting, and translated policies. |
| **Analytics** | Optional privacy-respecting analytics after you have a cookie/notice story aligned with the privacy page. |
| **Testing** | e2e on cart + login + checkout on a CI agent; or manual smoke on mobile and desktop before releases. |

---

## 23. How to use this file in “any other app”

- **Sections 1-19** - implementation details **specific to this Glantra / DummyJSON / Next 16** codebase.  
- **Sections 20-22** - **portable** - copy them into a new `BUILD.md` or product spec so every new e-commerce build gets the same baseline (catalog, trust, security, **mobile web**, SEO/a11y).  
- For a **non-Next** project, still apply **§20, §21, §22**; replace “Route Handlers” with your own API layer.  
- **“Mobile” throughout §20-22** = **phone/tablet web browsers** on your deployed site, not a native app from the app stores. If you later build **iOS/Android native** clients, use a different spec; they can still share the **same backend** APIs as the web app.
