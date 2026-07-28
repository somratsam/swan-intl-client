# Swan International — Frontend Progress

**Last updated:** 2026-07-28
**Build status:** verified — `npm run build` compiles all 24 routes with zero errors (last checked after Section H, 2026-07-28); `npx tsc --noEmit` clean after every edit this session
**Overall status:** NOT complete. Section F — F1/F2/F3 done, F4 now fully done (see Section H). Section G — aubergine/mauve rebrand, navbar/footer logo, CSS variable refactor — done and verified. Section H — 401 handling, mobile nav logo, Cloudinary delivery helper — done this session, see below. Bulk Add verified end-to-end for New Arrivals; wired for Products but not yet browser-tested. Products price removal + Shop CTA built, not yet browser-tested. See "Known issues" below for what's still open.

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
   - **Correction (2026-07-27, Section G session):** this file previously said the backend's register-role-escalation issue was still open. That was stale. Re-checked by directly reading the live current content of `swan-intl-m-server/src/app/modules/auth/auth.service.ts`, `auth.validator.ts`, and `auth.interface.ts` — the issue was already fixed, in backend commit `b33ec93` ("Close register role escalation, add seed script"), dated 2026-07-26, i.e. *before* this file's prior "still open" note was written on 2026-07-27. Current state, verified: `auth.interface.ts`'s `TRegisterPayload` has no `role` field; `auth.validator.ts`'s `RegisterValidator` (Zod) doesn't declare `role` either, and `.parse()` strips unrecognized keys by default, so a client-sent `role` never survives validation; `auth.service.ts`'s `register()` also hardcodes `role: 'user'` after spreading `...payload`, which would override it even if it somehow got through. Three independent layers all close it. Backend repo confirmed clean working tree, in sync with `origin/main`. Lesson: this file wasn't re-verified against the actual code before being carried forward as still-open in the previous update — don't repeat that.

### Section F — Admin image uploads (F1–F3 done, F4 pending)
- Removed the public "ADMIN" links from `Navbar.tsx` (desktop + mobile menu) and `Footer.tsx`. Already-authenticated admins still see Dashboard/Logout when browsing the public site; anonymous visitors see no entry point at all. Admin access is now `/admin/login` typed directly.
- **F1 — done.** `api.ts`: `uploadImages(files, onUploadProgress?)` posts `FormData` to `/api/upload`, 60s timeout, clears the axios instance's default `Content-Type` header so the browser sets the multipart boundary itself, forwards axios's `onUploadProgress` for F2's progress bar. `useApi.ts`: `useUploadImages()` mutation hook.
- **F2 — done.** `ImageUpload` component (`src/components/admin/ImageUpload.tsx`). Discriminated-union props (`multiple: true` → `string[]`/`(urls: string[]) => void`; single → `string`/`(url: string) => void`). Drag-and-drop (with a drag-counter ref to avoid the child-hover flicker bug) + click-to-browse via a real `<button>` (native keyboard support, no custom keydown code needed). Client-side validation mirrors the backend's wording exactly. Previews use plain `<img>`, not `next/image` — deliberate, since the manual-URL-paste fallback can hold a domain outside `next.config.ts`'s `remotePatterns`. Upload-in-flight disables the dropzone, file input, and manual-URL controls so a second batch can't race the first. Manual URL paste is sanity-checked via `new URL()` + http(s) protocol before being accepted. Object URLs are revoked on success, error, and component unmount.
- **F3 — done, all 9 screens wired.** Banners, New Arrivals, Offers, Events, Jobs, Products, Stores, Brands. Old plain URL text inputs and any standalone preview blocks removed everywhere `ImageUpload` was substituted in. Verified via `tsc --noEmit` after each screen and a full `npm run build` at the end (24/24 routes, zero errors).
  - **Banners was verified end-to-end by the user** (real file → real Cloudinary URL → saved → persisted through reload → renders on the public home page) before the remaining 8 were wired.
  - **Scope decision on Products:** main-image uploader only, **no product-level gallery** and **no per-item uploaders**. The idea of a product-level `gallery` field was raised but doesn't exist in the backend model (`product.model.ts`/`product.interface.ts` only have `items[].gallery`, not a top-level one) — user decided against adding a new schema field for it, so Products only got its existing `image` field wired. Per-item `items[]` fields (`image`, `gallery`) were left as their original plain-text inputs, since those fields are `required: true` on the backend and still need to be settable, just not via `ImageUpload` — this was a deliberate scope decision (see reasoning above: lookbook, no purchase path, no e-commerce use of `items[]` today), not an oversight.
  - Stores (`images[]`) and Brands' two array fields (`bannerImage`, `gallery`) confirmed the `multiple` mode works correctly — first real usage of that branch of the discriminated union.
- **F4 — done as of Section H (2026-07-28).**
  1. Cloudinary delivery helper (`src/lib/image.ts`) — **done**, see Section H below.
  2. Brand logo filter — **done**, see below.
  3. 401 handling — **done**, see Section H below.

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

### Section G — Aubergine/mauve rebrand, navbar/footer logo, CSS variable refactor (done, verified)

Color-only correction — no layout, typography, or structural changes anywhere in this section. Site was originally black/gold; didn't match the actual Swan logo (deep aubergine + dusty mauve swan mark).

**New palette** (`globals.css` `:root`):
| Variable | New value | Was |
|---|---|---|
| `--color-primary` | `#150B17` | `#000000` |
| `--color-secondary` / `--color-text` | `#F2ECE8` | `#ffffff` |
| `--color-accent` | `#8B6F8C` | `#C9A84C` (gold) |
| `--color-accent-deep` | `#4A2545` | (new — heavier elements: filled buttons, active states) |
| `--color-dark-bg` | `#1A0F1C` | `#0A0A0A` |
| `--color-card-bg` | `#241628` | `#111111` |
| `--color-subtle-bg` | `#150E17` | `#050505` |
| `--color-text-muted` | `#A296A3` | `#888888` |
| `--color-text-dim` | `#887988` | `#555555` |
| `--color-border` | `#2E1F32` | `#1A1A1A`/`#222`/`#2a2a2a`/`#1e1e1e` (folded together) |

**Batch 1–4 rollout** (shared/layout, `home/`, public listing+detail pages, `admin/` — 41 files total): every file diffed, `tsc --noEmit` after each batch, full `npm run build` at the end. Two real bugs found and fixed along the way, not just recolored:
- `Navbar.tsx`'s Dashboard link hover: `hover:bg-[#8B6F8C]` paired with `hover:text-black` — black text on the new (lighter) accent background, unreadable. Fixed to pair with `--color-text`.
- Same file, same link: a **second**, different bug found later — an inline `style={{ color: '#8B6F8C' }}` was pinning the text color even on hover, because inline styles always beat class-based `:hover` rules on specificity regardless of the class being correct. Background flipped to accent on hover but text stayed pinned to the *same* accent color as the background — invisible. Fixed by moving the base color into a Tailwind class (`text-[#8B6F8C]`) so default and hover state live in the same specificity tier.
- **Not fixed, still open:** the **Logout** button right next to Dashboard (`Navbar.tsx`, desktop admin controls) has the identical inline-style-vs-hover-class conflict (`style={{ color: ... }}` fighting `hover:text-white`) — not an invisibility bug since there's no hover background there, just a dead hover effect (text never actually changes color on hover). Flagged to the user, no decision made on fixing it.

**Footer text tint:** `--color-text-muted`/`--color-text-dim` were originally left as plain grays (not part of the gold→mauve mapping) but read flat against the new warmer background. Tinted toward mauve; both new values were run through a real WCAG contrast check against the darkest background in the palette (`--color-subtle-bg` #150E17, used for the footer) before landing on them — muted came out to 6.71:1 (comfortable), the first proposed dim value only hit 3.07:1 (fails the 4.5:1 text minimum), so `--color-text-dim` was brightened to `#887988` (4.64:1) instead of using the initially-proposed darker value.

**Logo mark** (`public/swan-logo.png`, PNG not SVG — no vector source exists): added to both `Navbar.tsx` and `Footer.tsx`, mark + wordmark pairing, `next/image` at 28×20 inside a 36px `rounded-full` chip. The chip is **required, not optional** — sampled the actual logo pixel colors via `sharp` and ran real contrast math: the deep-aubergine half of the mark is only 1.1–1.4:1 against both navbar/footer dark backgrounds (functionally invisible), while the light-mauve half is fine (5.2–5.3:1) unchipped. Chip color `#F2ECE8` (already `--color-text`, no new hex introduced) was itself checked against *both* halves of the logo, not just the dark backgrounds: aubergine hits 11.63:1 on the chip, but the mauve half only reaches 3.04:1 — confirmed via a full lightness-range scan that this is a hard ceiling set by the mauve tone's own luminance, not something a different chip color fixes; 3.04:1 clears WCAG's 3:1 graphical-object minimum (the correct threshold for a decorative mark, not the 4.5:1 text minimum), so it was accepted as the ceiling rather than chased further. Shape (circle) matches the existing icon-badge language already used everywhere else in the app (Toast status dot, ImageUpload's remove button, admin spinners) — buttons/cards/inputs in this codebase are all hard-cornered with zero `border-radius`, but every icon-scale accent is `rounded-full`, so the chip follows that existing pattern rather than introducing a new shape.
- **Not applied: the mobile nav overlay.** `Navbar.tsx`'s full-screen hamburger menu header (opens on mobile) still shows the old text-only wordmark with no chip/mark — inconsistent with the collapsed desktop bar and the footer, both of which now show it. Found during the Section G review below, not yet fixed.
- **Not applied: the admin sidebar.** `AdminLayoutClient.tsx`'s collapsed-sidebar logo (renders as a bare "S"/"wan" text split) also never got the mark. Lower priority — it's a persistent 64px icon rail, a legitimately different context from a marketing navbar, not clearly a bug the way the mobile overlay is.

**CSS variable refactor:** 711 of 717 hardcoded hex literals matching the palette above converted to `var(--color-*)` references across all 41 rebrand-touched files, so future palette changes are a one-line edit in `globals.css` instead of a repo-wide find/replace. `#F2ECE8` literals mapped to `var(--color-text)` specifically (not `--color-secondary`, which holds the identical value but is used for the global `body` default — a deliberate, user-confirmed choice given the ambiguity). **6 occurrences deliberately left as hex, not missed:** `#8B6F8C22`/`#8B6F8C44` (accent color with a baked-in alpha suffix, used for translucent status badges in `admin/banners`, `admin/events`, `admin/products`, `admin/stores`) — concatenating a `var()` reference with a trailing hex byte produces invalid CSS, and these encode color+transparency as one literal with no matching single CSS variable, so swapping them wasn't safe or in scope. `globals.css`'s own `:root` declarations also stay literal, obviously — they're the values the variables resolve to. Full-repo grep after the refactor confirms only these expected exceptions remain. Verified: `tsc --noEmit` after every batch, full `npm run build` clean (24/24 routes) at the end.

**Spot-checked visually by the user** — navbar logo and overall rebrand confirmed working in the browser.

---

### Section H — F4 completion: 401 handling, mobile nav logo, Cloudinary delivery helper (2026-07-28, done)

**1. 401 handling.** `api.ts` had a request interceptor but no response interceptor at all — confirmed broken per the 2026-07-27 report (an expired token left the admin UI rendering as if still logged in, with every subsequent call failing silently). Fixed:
- `api.ts`: added a response interceptor. On a `401` while on any `/admin/*` route other than `/admin/login`, it sets a `sessionStorage` flag (`swan_session_expired`) and dispatches a `window` event (`swan:unauthorized`) before rejecting the promise as normal. Gating on `pathname !== '/admin/login'` specifically excludes a failed login POST's own 401 (invalid credentials) from being treated as a session expiry — login attempts only happen from that one route.
- `AuthContext.tsx`: added a `useEffect` that listens for `swan:unauthorized` and calls the existing `logoutFn()` (clears `swan_token`/`swan_user`, resets state). No new logout path — reuses the one already wired to the manual Logout button.
- `AdminLayoutClient.tsx` — **untouched**. Its existing guard effect (`if (!user || !isAdmin) router.replace('/admin/login')`) already fires correctly once `AuthContext` clears `user`, so the redirect falls out of the existing code for free.
- `admin/login/page.tsx`: reads the `swan_session_expired` flag on mount, clears it, and shows "Your session has expired. Please sign in again." in the existing error banner — same UI the failed-login-attempt error already uses.
- Verified: `npx tsc --noEmit` clean, `npm run build` 24/24 routes. Backend confirmed to actually return HTTP `401` (not 403 or another code) for a protected route hit with a garbage JWT, via a direct `curl` against `swan-intl-m-server` — the interceptor's `status === 401` check is checked against real backend behavior, not assumed. **Not** clicked through in a real browser (this environment has no browser/screenshot tool) — the redirect-on-expiry path itself (as opposed to the 401-detection precondition) is unverified beyond code reading.

**2. Mobile nav overlay logo.** `Navbar.tsx`'s full-screen hamburger menu header still showed the old text-only "Swan / International" wordmark with no mark, inconsistent with the collapsed desktop bar and footer (both got the mark+chip in Section G). Fixed by copying the same mark+chip markup (`swan-logo.png` in a `rounded-full` chip, `--color-text` background) into the mobile menu header, replacing the bare wordmark.
   - **Follow-up bug, found and fixed the same day:** the user reported the mark+wordmark visibly overlapping/doubling once actually seen (not caught by `tsc`/build, since it's a pure stacking-context issue, invisible to a type checker). Root cause: the fixed top `<motion.nav>` (`z-50`) is never hidden or unmounted when the mobile overlay opens, and the overlay itself (`<motion.div>`) was only `z-40` — **lower** than the nav. Both are `position: fixed`, `top: 0`, same `h-16` height, covering the identical screen region — with the overlay's z-index lower, the top nav's own logo + its hamburger-turned-`X` toggle button drew on top of the overlay's own header underneath it, producing doubled/overlapping logo text and a second `X` icon at the same corner as the overlay's own close button. Not width- or breakpoint-dependent — reproducible at every viewport below `lg` (anywhere the overlay is reachable at all), since it's a z-index bug, not a responsive-layout one. Fixed: overlay's z-index raised from `z-40` to `z-[60]`, above the nav's `z-50`, so the overlay's opaque `var(--color-dark-bg)` background now fully covers the nav once open. Also restored a `-1px` marginTop on "International" that matched the desktop/footer version but had been dropped when the mark+chip markup was first added. Verified via `tsc`/build; not visually confirmed in a browser (no browser tool in this environment) — the original overlap bug shipped past the same limitation, so browser verification of this fix specifically should not be skipped next session.

**3. Cloudinary `f_auto`/`q_auto` delivery helper.** New `src/lib/image.ts`, `optimizeImage(url, { width? })`: parses the URL, and if the hostname is `res.cloudinary.com` and the path contains `/upload/`, inserts an `f_auto,q_auto[,w_<width>]` transformation segment right after `/upload/`. Any URL that isn't a real `res.cloudinary.com` upload URL (picsum placeholders, manually-pasted external URLs, malformed/relative strings) is returned unchanged — wrapped in try/catch around `new URL()` so a non-absolute string never throws.
- Wired into every dynamic (backend-sourced) image on the **public site**: all 5 home sections (`HeroBanner`, `BrandsSection`, `OffersSection`, `EventsSection`, `NewArrivalsSection`) and all public listing/detail pages (`stores`, `events` list + detail, `offers` list + detail, `products` list + detail incl. gallery thumbnails, `brands` list incl. logo badge + detail incl. hero banner and gallery, `new-arrivals`).
- **Deliberately not wired:** admin table thumbnails (8 screens, all small `48–64px` images, internal-tool traffic) and `ImageUpload.tsx`'s plain-`<img>` preview (transient editing-session preview, not a served page asset) — out of scope for this pass, matches the stated priority of public/mobile page-weight, not admin tooling. Flagged, not forgotten.
- Note for later: this doesn't replace or interact with Next's own built-in image optimizer (`next/image` resizes/re-encodes at request time by default since `images.unoptimized` is never set in `next.config.ts`) — it's a complementary fix at the Cloudinary-origin-fetch layer, and is the only optimization that applies at all if this app is ever deployed somewhere that disables Next's own image optimizer.
- Verified: `npx tsc --noEmit` clean, `npm run build` 24/24 routes zero errors. Not visually confirmed in a browser (no browser tool in this environment) — correctness of the URL transform itself was reasoned through directly (Cloudinary's documented `/upload/<transformations>/<rest-of-path>` URL shape), not tested against a live Cloudinary asset.

---

## Known issues — not yet fixed

Prioritized worst/most-impactful first, per the full post-rebrand review (2026-07-27), updated 2026-07-28 after Section H closed out items 1, 7, and 8 from the original list (renumbered below). Items marked "code-level only" were assessed by reading the source, not by rendering in a browser — this environment has no browser/screenshot tool, so anything about actual rendered/responsive behavior carries that caveat until someone drives it in devtools or a real device.

1. **Admin tables are unreachable, not just cramped, on narrow viewports (code-level only).** `AdminLayoutClient.tsx` sets `overflow-x-hidden` on `<main>`, and every admin table (`Products`, `Banners`, etc.) is a bare `<table className="w-full text-sm">` with no `overflow-x-auto` wrapper. Combined, a table wider than the viewport doesn't scroll — columns get silently clipped and become physically inaccessible, not just visually squeezed.
2. **Contact page: still buries the form under 5 store cards on mobile.** Confirmed unchanged (`ContactPageContent.tsx`, `grid-cols-1 lg:grid-cols-2`, no `order-*` classes) — the rebrand was color-only, so this Section C finding is untouched and still live for every mobile visitor.
3. **Product detail page still has no hero image/header**, unlike Brand/Offer/Event detail, which all open with one. Confirmed unchanged.
4. **Home Stores section (text-only cards) still doesn't match `/stores` (photo-led).** Not independently re-diagnosed this pass, but nothing this session touched layout, so this Section C finding stands.
5. **New Arrivals: card alignment / six-across cramping.** Same — untouched, still open.
6. **Micro-text contrast may be under the real bar despite passing the math (code-level only).** The Section G muted/dim tint work computed WCAG ratios correctly for normal-size text (`--color-text-dim` ≈ 4.64:1, clears the 4.5:1 normal-text minimum). But several usages of dim/muted text — admin table meta, card labels — are `text-[8px]`/`text-[9px]`/`text-[10px]`, well under what WCAG's size thresholds assume "normal" text to be; text that small arguably needs more headroom than the 4.5:1 floor, not the floor itself. Flagged as a gap in the contrast pass, not a new problem — the ratio was checked, not the render size.
7. **Not fixed: `Navbar.tsx`'s Logout button hover.** Same inline-style-vs-Tailwind-hover-class specificity bug as the Dashboard button (see Section G), but lower severity — no hover background, so the failure mode is just "hover text color never visibly changes," not invisible text. Flagged to the user during Section G, no decision made on fixing it.
8. **Admin sidebar logo also lacks the mark** — see Section G. Lower priority; a persistent icon rail is a different context from a marketing navbar. (The mobile nav overlay's equivalent gap was closed in Section H.)

**Resolved this session (Section H, 2026-07-28):** F4 401 handling, mobile nav overlay logo mark, F4 Cloudinary delivery helper — see Section H above for detail. Removed from this list rather than kept as struck-through, per house style — full history lives in Section H, not here.

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
