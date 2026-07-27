# Swan International — Frontend Progress

**Last updated:** 2026-07-26
**Build status:** verified — `npm run build` compiles all 24 routes with zero errors (last checked after Section F1, 2026-07-26)
**Overall status:** NOT complete. Section F (admin image uploads) is at F1 of 4. See "Known issues" below for what's still open.

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

### Section F — Admin image uploads (IN PROGRESS)
- Removed the public "ADMIN" links from `Navbar.tsx` (desktop + mobile menu) and `Footer.tsx`. Already-authenticated admins still see Dashboard/Logout when browsing the public site; anonymous visitors see no entry point at all. Admin access is now `/admin/login` typed directly.
- **F1 — done.** `api.ts`: `uploadImages(files: File[])` posts `FormData` to `/api/upload`, 60s timeout, clears the axios instance's default `Content-Type` header so the browser sets the multipart boundary itself. `useApi.ts`: added `useUploadImages()` mutation hook. Verified via `tsc --noEmit` and a full `npm run build` (24/24 routes, zero errors).
- **F2 — pending.** `ImageUpload` component (`src/components/admin/ImageUpload.tsx`): file picker + drag-and-drop, client-side validation mirroring the backend exactly (jpg/jpeg/png/webp, 5MB/file, max 10 files, same error wording as the backend), thumbnail previews with per-image remove, upload progress, Toast-based errors, shows the existing value when editing, manual URL-paste fallback for when Cloudinary is unreachable. Not started.
- **F3 — pending.** Wire `ImageUpload` into the 9 admin screens' image fields (inventory below). Planned order: banners, new-arrivals, offers, events, products, jobs, stores, brands, with **products last as its own step** — deferred because of the nested per-item `image`/`gallery` fields inside `TProduct.items[]`, which need a per-row uploader rather than one top-level field.
- **F4 — pending.**
  1. Cloudinary delivery helper (`src/lib/image.ts`) inserting `f_auto,q_auto` + a width parameter into Cloudinary URLs at render time; must pass non-Cloudinary URLs (picsum placeholders, manually-pasted URLs) through untouched.
  2. Brand logo `filter: brightness(0) invert(1)` in `BrandsPageClient.tsx` / `brands/[id]/page.tsx` only works for transparent-background silhouettes — will misrender any photographic/multi-colour logo once uploads are live. A fix has been proposed but a decision is still needed before implementing; not to be decided unilaterally.
  3. 401 handling — current behaviour of the axios interceptor on an expired/invalid token has not yet been checked. Needs reporting before any fix.

#### Image field inventory (for F3)
| Model | Field(s) | Shape |
|---|---|---|
| Banner | `image` | single |
| Brand | `brandImage`, `brandLogo`, `mainBanner` | single ×3 |
| Brand | `bannerImage`, `gallery` | array ×2 |
| Offer | `image` | single |
| Event | `image` | single |
| NewArrival | `image` | single |
| Job | `companyLogo` | single |
| Store | `images` | array |
| Product | `image` (top-level) | single |
| Product.items[] | `image`, `gallery` per item | single + array, **nested/repeatable** |

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
