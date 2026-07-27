# Swan International — Frontend Progress

**Last updated:** 2026-07-27
**Build status:** verified — `npm run build` compiles all 24 routes with zero errors (last checked after Products price removal / Shop CTA, 2026-07-27); backend `tsc --noEmit` also verified clean after the `product.controller.ts` fix
**Overall status:** NOT complete. Section F — F1/F2/F3 done, F4 partially done. Bulk Add verified end-to-end for New Arrivals; wired for Products but not yet browser-tested. Products price removal + Shop CTA built, not yet browser-tested. See "Known issues" below for what's still open.

---

## Correction to the record

The previous version of this file (dated 2026-05-06) claimed "100% Complete." That was wrong, and was corrected this session after direct verification, not just a new report:

- The Tailwind v4 cascade bug — base CSS rules sitting outside any `@layer`, which in Tailwind v4 lose to layered utilities regardless of specificity — was killing `mx-auto`, `px-*`/`py-*`, image `h-*`, and link text colour across **all 24 routes**.
- The Contact page rendered fabricated store data: invented phone numbers, addresses, and hours that didn't match the real stores.
- Most empty states across listing pages and home sections were missing — an empty collection rendered a heading and dead space, not a message.
- "`npm run dev`" for the backend does not exist. The correct script is `npm run start:dev` (confirmed directly in `swan-intl-m-server/package.json`).

---

## What's actually done (verified this session)

### Foundation (pre-existing, re-verified — builds clean)
Next.js 16.2.4 App Router + TypeScript + Tailwind v4, `src/types/index.ts`, `src/services/api.ts`, `src/hooks/useApi.ts`, `AuthContext.tsx`, all 24 routes (public pages + admin CRUD screens) present and building.

### Section A — CSS cascade fix + image domains
- `globals.css`: base reset block wrapped in `@layer base`; `margin:0;padding:0` removed from the `*` rule (kept `box-sizing:border-box`).
- `next.config.ts`: added `images.remotePatterns` for `picsum.photos` and `res.cloudinary.com`.
- Verified visually by user: content centred, navbar logo no longer clipped, real section spacing restored.

### Section B — Database seeded
- `swan-intl-m-server/scripts/seed.ts` (idempotent upserts) + `npm run seed` script in the backend `package.json`.
- Verified run: 6 brands, 5 stores, 3 banners, 4 offers, 3 events, 6 new arrivals, 2 jobs, 8 products inserted.

### Section C — Read-only design/correctness audit
Full prioritized report delivered from direct code reading (not a rendered walkthrough). See "Known issues" below for what's still open from it — several items were fixed in Section D, several weren't.

### Section D — Correctness fixes and visual bugs
- **D1:** Contact page — replaced the fabricated `storeContacts` array with live `useStores()` data (real phone/email/hours, filtered to `isActive`).
- **D2:** Empty states added to every home section and listing page that was missing one; fixed New Arrivals' mislabeled empty message to distinguish "genuinely empty" from "filter matched nothing" (same fix applied to Events/Products/Jobs listing pages).
- **D3:** Fixed a white-flash-on-first-scroll navbar bug. Root cause: `background` was toggling between a `linear-gradient()` and a flat `rgba()` colour under one `transition-all`, which browsers can't smoothly interpolate (different `background-image`/`background-color` sub-properties). Normalized both states to structurally identical gradients.
- **D4:** Added a dark scrim behind the hero text (vertical fade, doesn't cover the full photo) for legibility over bright banner images. Hero eyebrow ("Swan International") changed to white in the photo-carousel branch; the fallback branch's eyebrow ("Muscat, Sultanate of Oman") correctly stayed gold since it sits on a solid gradient, not a photo. Navbar logo's "International" line changed from `#666` to white (was invisible over bright photos). Navbar's scrolled-state bottom edge softened to fade out instead of a hard line; the gold border there was removed.
- **D5:** Removed duplicate hardcoded brand/store lists — `Footer.tsx` and `AboutPageContent.tsx` now derive from `useBrands()`/`useStores()`. About page's per-store "descriptions" now show `store.address` (Store has no description field in the model, so this uses real data instead of hand-written copy). Removed hardcoded "six"/"5" counts from `BrandsSection`, `StoresSection`, `AboutSection` (copy reworded; stat tiles now show live counts with a loading skeleton / "–" on error), and `AboutPageContent`. Dropped the fabricated "OMR / Premium Pricing" stat tile (no real backing data anywhere); stat grid reflowed 2×2 → 3-across.

### Section E — Deployment prerequisites
1. `api.ts` `baseURL` now reads `NEXT_PUBLIC_API_URL`, falling back to `http://localhost:5000`. `.env.local` (gitignored) + `.env.example` (committed) created; `.gitignore` updated with a `!.env.example` exception since the blanket `.env*` rule would otherwise have swallowed it too. Verified via `git check-ignore` / `git status`.
2. Upload-specific 60s timeout — implemented as part of F1 (see below), not as a standalone Section E step.
3. Removed the `register` export and the now-unused `TRegisterPayload` import from `api.ts` (verified no other references anywhere in `src/`).
   - **Unresolved, backend repo, live security issue:** `POST /api/auth/register` still accepts an arbitrary `role` in the request payload with no auth guard on the route. Confirmed by directly reading `auth.validator.ts`, `auth.interface.ts`, and `auth.service.ts` — all three unchanged, still vulnerable. Anyone can currently self-register as an admin account. Not touched this session (backend repo) — recommend prioritizing this.

### Section F — Admin image uploads (F1–F3 done, F4 pending)
- Removed the public "ADMIN" links from `Navbar.tsx` (desktop + mobile menu) and `Footer.tsx`. Already-authenticated admins still see Dashboard/Logout when browsing the public site; anonymous visitors see no entry point at all. Admin access is now `/admin/login` typed directly.
- **F1 — done.** `api.ts`: `uploadImages(files, onUploadProgress?)` posts `FormData` to `/api/upload`, 60s timeout, clears the axios instance's default `Content-Type` header so the browser sets the multipart boundary itself, forwards axios's `onUploadProgress` for F2's progress bar. `useApi.ts`: `useUploadImages()` mutation hook.
- **F2 — done.** `ImageUpload` component (`src/components/admin/ImageUpload.tsx`). Discriminated-union props (`multiple: true` → `string[]`/`(urls: string[]) => void`; single → `string`/`(url: string) => void`). Drag-and-drop (with a drag-counter ref to avoid the child-hover flicker bug) + click-to-browse via a real `<button>` (native keyboard support, no custom keydown code needed). Client-side validation mirrors the backend's wording exactly. Previews use plain `<img>`, not `next/image` — deliberate, since the manual-URL-paste fallback can hold a domain outside `next.config.ts`'s `remotePatterns`. Upload-in-flight disables the dropzone, file input, and manual-URL controls so a second batch can't race the first. Manual URL paste is sanity-checked via `new URL()` + http(s) protocol before being accepted. Object URLs are revoked on success, error, and component unmount.
- **F3 — done, all 9 screens wired.** Banners, New Arrivals, Offers, Events, Jobs, Products, Stores, Brands. Old plain URL text inputs and any standalone preview blocks removed everywhere `ImageUpload` was substituted in. Verified via `tsc --noEmit` after each screen and a full `npm run build` at the end (24/24 routes, zero errors).
  - **Banners was verified end-to-end by the user** (real file → real Cloudinary URL → saved → persisted through reload → renders on the public home page) before the remaining 8 were wired.
  - **Scope decision on Products:** main-image uploader only, **no product-level gallery** and **no per-item uploaders**. The idea of a product-level `gallery` field was raised but doesn't exist in the backend model (`product.model.ts`/`product.interface.ts` only have `items[].gallery`, not a top-level one) — user decided against adding a new schema field for it, so Products only got its existing `image` field wired. Per-item `items[]` fields (`image`, `gallery`) were left as their original plain-text inputs, since those fields are `required: true` on the backend and still need to be settable, just not via `ImageUpload` — this was a deliberate scope decision (see reasoning above: lookbook, no purchase path, no e-commerce use of `items[]` today), not an oversight.
  - Stores (`images[]`) and Brands' two array fields (`bannerImage`, `gallery`) confirmed the `multiple` mode works correctly — first real usage of that branch of the discriminated union.
- **F4 — partially done.**
  1. Cloudinary delivery helper (`src/lib/image.ts`) — pending.
  2. Brand logo filter — **done**, see below.
  3. 401 handling — pending. Current behaviour of the axios interceptor on an expired/invalid token has not yet been checked. Needs reporting before any fix.

### Brand logo filter — found live and fixed
`filter: brightness(0) invert(1)` in `BrandsPageClient.tsx` and `brands/[id]/page.tsx` wasn't hypothetical — the user uploaded a real logo and it rendered as a solid white rectangle, exactly as predicted when this was flagged during F4 planning. Root cause was actually worse than "only works for transparent silhouettes": `brightness(0)` crushes every pixel to black regardless of source color, then `invert(1)` flips that to solid white — so it would blank out *any* image, including the seeded picsum placeholder "logos" that were never real logos to begin with.

Fixed:
- Filter removed from both files. Real logos are official brand assets (transparent PNGs, white variant chosen by the admin) — the input is predictable, not arbitrary, so no compensating background/chip was needed.
- Listing-card badge (`BrandsPageClient.tsx`) sits over unpredictable photo content, so it got a radial dark scrim behind it (same technique as the D4 hero text scrim) for legibility, and switched from fixed `width`/`height` to `fill` mode in a sized `relative` box — this also fixed a `next/image` aspect-ratio console warning, caused by the global `img { height: auto }` rule (from Section A) fighting the explicit `height` prop.
- Hero logo (`brands/[id]/page.tsx`) was **removed entirely**, not just defiltered — the brand name already renders large right below it, so the logo was redundant there. The whole conditional block was deleted (not hidden), so the `justify-end` flex hero packs directly to the name with no leftover gap.
- Listing badge and admin table thumbnail were explicitly kept as-is (out of scope for the hero removal).

**Not yet fixed, flagged but out of scope for this pass:** `admin/brands/page.tsx`'s table thumbnail has its own `filter: 'invert(1)'` (not `brightness(0) invert(1)`) — now that real logos are white, this would invert them to black on a dark (`#1a1a1a`) table row background, i.e. invisible. Same root problem, different spot, not yet addressed.

#### Image field inventory (for reference — F3 is complete against this)
| Model | Field(s) | Shape | Wired? |
|---|---|---|---|
| Banner | `image` | single | ✅ |
| Brand | `brandImage`, `brandLogo`, `mainBanner` | single ×3 | ✅ |
| Brand | `bannerImage`, `gallery` | array ×2 | ✅ |
| Offer | `image` | single | ✅ |
| Event | `image` | single | ✅ |
| NewArrival | `image` | single | ✅ |
| Job | `companyLogo` | single | ✅ |
| Store | `images` | array | ✅ |
| Product | `image` (top-level) | single | ✅ |
| Product.items[] | `image`, `gallery` per item | single + array | ❌ deliberately not wired — see scope decision above |

### Bulk Add (new feature — New Arrivals and Products both done)
New admin capability, separate from F1–F4: adding a whole delivery one record at a time was too slow. The existing single-record Add/Edit modal is untouched — Bulk Add is a second, create-only flow that sits alongside it.

- `src/lib/imageValidation.ts` — new shared module. Extracted the file-type/size constants and validators out of `ImageUpload.tsx` (which now imports from here) so bulk mode's validation can't drift from the single-upload component's — the login-token bug earlier this session was exactly this kind of "two places quietly disagree" problem, not worth repeating.
- `src/components/admin/BulkAddGrid.tsx` — new, generic, reusable component (not hardcoded to New Arrivals). Takes `columns: BulkColumn<T>[]` (each with `type: 'text'|'select'|'number'`, optional `required`) and a `createFn` injected by the caller — the upload mechanism itself (`useUploadImages`) is internal, not a prop, since there's only one upload path in this app.
  - Drop up to **25 images** (hard cap, enforced and stated in the dropzone text) — deliberately capped well below the backend's 10-per-request limit because 25 files × 5MB is real browser memory pressure on a machine that's already OOM-crashed twice this session; raise it later deliberately if 25 proves too low, rather than debugging a crash mid-delivery.
  - Uploads batch in groups of 10 (mirroring the backend's per-request cap). **On a batch failure, retries that batch file-by-file** rather than marking all ~10 rows failed — a single bad file failing a batch request would otherwise wrongly flag 9 good rows, and re-uploads across the whole batch would compound Cloudinary orphans (files that succeeded server-side before the batch request threw, now unlinked from any row). File-by-file retry only happens on the error path, so the happy path stays one request per chunk.
  - Row lifecycle tracks upload status and create status separately (`pending → uploading → uploaded → creating → success`, with `upload-failed`/`create-failed` branches) so a retry never repeats already-successful work — `success` rows are filtered out before anything else runs, structurally excluded from being re-created, not just skipped by convention.
  - Validates all required columns are filled *before* any network call — blocks the whole save and highlights incomplete rows rather than creating a partial batch from bad data.
  - Two-level progress: a phase banner ("Uploading images: X/Y" → "Creating records: X/Y") plus a per-row status badge.
  - `row.fields` is always `Record<keyof T, string>` at runtime regardless of a column's declared `type` (HTML inputs only return strings) — the grid now coerces `'number'` columns via a `buildPayload` step before calling `createFn`, so `createFn` always receives real numbers for numeric fields rather than every caller having to remember the conversion itself.
- **New Arrivals** (`admin/new-arrivals/page.tsx`): columns are `brand` (select, from `useBrands()`) and `caption` (text), both required. **Verified end-to-end by the user** at 8–10 photos — occasional first-image timeout on upload, retry saves it with no data loss, confirmed working at that scale.
- **Products** (`admin/products/page.tsx`): columns are `brand` (select), `name`, `category` (text), `price` (number), all required. Two gaps between the schema and those 4 columns, resolved by reading `product.validator.ts` directly rather than guessing:
  - `description` isn't a bulk column — auto-generated as `"${name} — details coming soon."`, since it's real public-facing body text but not worth slowing down rapid batch entry for; admin is expected to follow up via the single-record Edit modal.
  - `tags` (Zod requires `min(1)` — an empty array is rejected) defaults to `[brand]`.
  - `items[]` (Zod requires `min(1)` item; each item's `gallery` also requires `min(1)` — empty arrays rejected there too) gets one auto-generated item per row: `{ title: name, brand, image, description: <same placeholder>, gallery: [image] }`. The item's `gallery` is seeded with the main image rather than left empty specifically because the validator rejects `[]` — confirmed by reading the actual Zod schema, not assumed from the Mongoose model.
  - Not yet tested end-to-end in the browser (type-checks and builds clean, 24/24 routes).
- **Backend fix, `swan-intl-m-server`:** `product.controller.ts`'s `createProduct` caught every error (including Zod validation failures) and always returned a generic `"Something went wrong"` with no detail — made every bulk failure undiagnosable. Now catches `z.ZodError` specifically and returns the real field-level messages (joined into `message`, plus the raw `errors` array), keeping the generic fallback only for genuinely unexpected errors. Matches the pattern already used in `auth.controller.ts`. Scope note: the other 4 methods in this controller (`getAllProducts`, `getSingleProduct`, `updateProduct`, `deleteProduct`) still have the same generic-catch pattern, as do controllers in other modules almost certainly — not fixed here, flagged as a broader cleanup opportunity beyond what was asked.

### Product pages: price removed, Shop CTA added (done)
Lookbook, not a shop — a price with no way to buy was a dead end. Backend/database/admin form unchanged; this was display-only.
- `ProductsPageClient.tsx` — the `OMR {price}` line removed from each listing card (card now shows just the name; the `mb-1.5` that separated name from price was removed too, since there's nothing left to separate it from). A small text-link CTA added to the page header, after the gold divider: "Shop the Collection at swan-intl.com" with a lucide `ExternalLink` icon, opens in a new tab.
- `products/[id]/page.tsx` — the `OMR {price}` line replaced in-place (same slot, same spacing) with a `.btn-luxury-filled` CTA, same wording as the listing page: "Shop the Collection at swan-intl.com". Wording was deliberately made identical to the listing page's rather than the initially-proposed "Shop at swan-intl.com" — since neither CTA can deep-link to the specific product (see below), the more specific-sounding phrasing would have overpromised.
- Both CTAs point at `https://swan-intl.com` (site root only) — **known limitation:** nothing in this app stores a per-product URL/slug on the WooCommerce side, so there's no way to link to the specific product page. Noted for later, not scheduled: a `shopUrl` field per product (backend schema change) would let each product deep-link to its real WooCommerce page and make this CTA meaningfully more useful. Separate piece of work, not part of this pass.
- `price` itself is untouched everywhere else — still in `types/index.ts`, the database, and the admin form/table (the backend requires it on create: `price: z.number().min(0)`), so it remains a required field that appears nowhere public. That's intentional, not an oversight — don't "fix" it later by removing the admin field.
- Verified via `tsc --noEmit` and full `npm run build` (24/24 routes, zero errors). **Not yet viewed in the browser.**

### Login token bug (found and fixed this session)
`swan_token` in localStorage was the literal string `"undefined"` — login appeared to succeed (`swan_user` saved correctly) but every authenticated request then sent `Bearer undefined` and got a 401, which surfaced as a generic "invalid or expired token" error with nothing actually expired. Root cause, verified by reading both ends directly:
- Backend (`auth.service.ts` + `auth.controller.ts`): login response is `{ success, message, data: { token, user } }` — the field is `token`.
- Frontend: `types/index.ts`'s `TAuthResponse` declared `data.accessToken` (wrong key), and `admin/login/page.tsx` read `res.data.accessToken` (always `undefined`) before calling `localStorage.setItem`.
- CLAUDE.md's own Auth Endpoints table also documented the wrong shape (`accessToken`) — that's almost certainly what the frontend was originally written against instead of the real API.

Fixed: `TAuthResponse.data.token` (renamed to match backend), `admin/login/page.tsx` now reads `res.data.token`, and a guard was added — if `token` is falsy, login is treated as failed (shown as an error) rather than storing `"undefined"`. CLAUDE.md's documented shape corrected too. **Verified by the user in the browser**: `swan_token` now stores a proper JWT.

---

## Known issues — not yet fixed

### Flagged directly this session (browser-observed — not visible from reading code alone)
- New Arrivals: card alignment and six-across cramping.
- Home Stores section renders text-only cards, while the full `/stores` page is photo-led — the two don't match.
- Product detail page has no hero image/header, unlike Brand/Offer/Event detail, which all open with one.
- Contact page: on mobile, the 5 store cards render above the message form, pushing the actual contact form below the fold.

### From the Section C code audit, still open (lower priority — not independently re-confirmed this session)
- Event detail page (`events/[id]/page.tsx`) fetches the entire events list via `useEvents()` and finds the one it needs client-side, instead of a dedicated by-ID fetch the way Brand/Offer/Product detail pages have.
- Filter-pill rows (New Arrivals, Events, Products, Jobs listing pages) render only after `isLoading` resolves, causing a layout shift as they pop in above the grid.
- Typographic scale inconsistencies: About/Brand detail hero titles scale to `text-7xl`, Offer/Event detail heroes cap at `text-5xl`; Product detail's `h1` doesn't scale up on desktop the way the other three detail pages' titles do.

### `/admin/dashboard` (reported this session, not fixed)
Renders real content — 8 stat tiles with live counts + quick-add links, not a blank page. But: no loading state (all 8 tiles flash "0" before real counts arrive on every load) and no error state (a failed fetch shows "0", indistinguishable from "genuinely empty").

---

## How to run

```bash
# 1. Start the backend
cd "C:\Users\Lenovo\Desktop\swan 2026\Swan Projects\swan-update-site\swan-intl-m-server"
npm run start:dev    # → http://localhost:5000   (NOT "npm run dev" — that script doesn't exist)

# 2. Start the frontend
cd "C:\Users\Lenovo\Desktop\swan 2026\Swan Projects\swan-update-site\swan-intl-client"
npm run dev    # → http://localhost:3000

# Type check only (no build output)
npx tsc --noEmit

# Full production build check
npm run build
```

**Admin access:** `http://localhost:3000/admin/login` — there is no public link to it anymore; type the URL directly.
