# Next Session Guide

**Last updated:** 2026-07-27
**Status:** NOT complete. Section F — F1/F2/F3 done, F4 partially done (brand logo filter fixed; Cloudinary delivery helper and 401 handling still pending). Section G (rebrand + logo + CSS variable refactor) — done, verified, spot-checked by the user in the browser. Bulk Add — New Arrivals verified end-to-end; Products wired, not yet browser-tested. Products price removal + Shop CTA built, not yet browser-tested.

This file is the "what to do next" companion — for the full verified history of what's actually been done and confirmed, read `PROGRESS.md` first. Don't trust a prior session's "done" claim without re-checking; see the ground rules at the bottom.

---

## Before anything else: check `git status` on the frontend repo

As of the end of the 2026-07-27 session, the entire Section G rebrand/logo/CSS-refactor work (42 files, all verified via `tsc`/`npm run build`) was sitting **uncommitted** in the working tree, plus a new untracked `public/swan-logo.png`. The user was asked whether to commit and push before ending the session — check whether that happened. If `git status` still shows all those files modified, that's a full day of verified, working changes at risk of being lost or clobbered; get it committed before doing anything else. The backend repo (`swan-intl-m-server`) was already clean and in sync with `origin/main` as of the same check.

---

## Punch list from the 2026-07-27 post-rebrand review, worst first

Full detail and reasoning for each in `PROGRESS.md` → "Known issues." Short version, in priority order:

1. **F4 — 401 handling.** No axios response interceptor exists at all; `AuthContext` never checks token expiry; `AdminLayoutClient`'s guard trusts stale localStorage and never fires once a token has actually expired server-side. An admin with an expired token sees a fully-rendered but silently broken admin UI — every request 401s, nothing recovers them to `/admin/login`. This was supposed to be *reported* before being fixed (per the original F4 plan) — the report is now done (above), so this is ready to be scoped into an actual fix next.
2. **Admin tables clip content on narrow viewports** — `overflow-x-hidden` on `<main>` + no `overflow-x-auto` wrapper on any `<table>`. Not just ugly — columns become unreachable.
3. **Contact page** still stacks 5 store cards above the message form on mobile (`grid-cols-1 lg:grid-cols-2`, no `order-*` classes) — still open from the original Section C audit.
4. **Product detail page** still has no hero image, unlike Brand/Offer/Event detail.
5. **Home Stores section vs. `/stores` listing** still mismatched (text-only vs. photo-led).
6. **New Arrivals card alignment / six-across cramping** — still open.
7. **Mobile nav overlay** doesn't show the new logo mark (navbar collapsed bar and footer both do) — easy, scoped fix, flagged during Section G.
8. **F4 — Cloudinary `f_auto`/`q_auto` delivery helper** (`src/lib/image.ts`) — still not built. Every image serves at full original upload resolution.
9. **Micro-text contrast** — `text-[8px]`–`text-[10px]` usages of `--color-text-muted`/`--color-text-dim` pass the WCAG math for normal-size text but are meaningfully smaller than what that math assumes; worth a second look at those specific sizes, not the tokens themselves.
10. **Navbar Logout button hover** — same inline-style-vs-Tailwind-hover specificity bug as the Dashboard button (which *was* fixed this session), just lower severity since there's no hover background to expose it. Flagged, not fixed, no decision made yet.
11. **Admin sidebar logo** also lacks the mark — lowest priority of the logo-consistency items, arguably fine as-is given it's a persistent icon rail, not a marketing surface.

**Not on this list because it's already resolved:** the backend `POST /api/auth/register` role-escalation issue this file previously flagged as an open security risk. Re-checked directly against the live backend code on 2026-07-27 — it was already closed in backend commit `b33ec93` (2026-07-26), a day before the prior "still open" note was written. `auth.validator.ts` doesn't declare `role` (Zod strips it), `auth.interface.ts`'s `TRegisterPayload` doesn't type it, and `auth.service.ts` hardcodes `role: 'user'` regardless. If this shows up as "open" anywhere else, that note is stale — verify against the live files, not against an old report.

---

## F1–F3 — done

- `uploadImages()`/`useUploadImages()` in place with progress-callback support.
- `ImageUpload` component built (`src/components/admin/ImageUpload.tsx`) — drag-and-drop, click-to-browse, client-side validation matching the backend's exact wording, progress bar, upload-in-flight lockout, sanity-checked manual URL paste, existing-value preview, per-image remove. Full detail in `PROGRESS.md`.
- All 9 admin screens wired: Banners, New Arrivals, Offers, Events, Jobs, Products, Stores, Brands. Banners was verified end-to-end in the browser (real file → real Cloudinary URL → saved → survives reload → renders on the public site) before the rest were done. `tsc --noEmit` after each screen, full `npm run build` at the end — 24/24 routes, zero errors.
- Products scope: main `image` field only. No product-level `gallery` (doesn't exist in the backend schema — raised, then explicitly declined rather than adding a new field mid-F3) and no per-item `items[]` uploaders (deliberate — lookbook, no purchase path, `items[]` unused today). Those per-item fields keep their original plain-text inputs since they're `required: true` on the backend.

## Also fixed this session, not part of F1–F4: the login token bug

`swan_token` was being saved as the literal string `"undefined"` — frontend read `res.data.accessToken`, backend actually returns `res.data.token`. Fixed in `types/index.ts` (`TAuthResponse`), `admin/login/page.tsx` (reads the right key now, plus a guard: falsy token → treated as failed login, not silently stored), and CLAUDE.md's Auth Endpoints table (was documented wrong, likely the original source of the bug). Verified by the user: `swan_token` now holds a real JWT.

## Bulk Add — done for both New Arrivals and Products

- **New Arrivals**: verified end-to-end by the user at 8–10 photos. Occasional first-image upload timeout, retry saves it, no data loss — working as designed at that scale.
- **Products**: wired (`brand`/`name`/`category`/`price` columns, one auto-generated `items[]` entry per row seeded from the row's own data — full reasoning in `PROGRESS.md`). Type-checks and builds clean but **not yet tested in the browser** — same checkpoint New Arrivals was at before you tested it. Also involved a backend fix: `product.controller.ts`'s `createProduct` was swallowing Zod validation errors behind a generic "Something went wrong" — now returns the real message. That fix is what makes a bulk row's failure text actually diagnosable, so it's worth confirming during testing that a deliberately-bad row (e.g. a price of `-5`) shows a real error, not the old generic one.

## Products price removal + Shop CTA — done

- `ProductsPageClient.tsx`: price line removed from listing cards; small text-link CTA added to the page header ("Shop the Collection at swan-intl.com").
- `products/[id]/page.tsx`: price replaced in-place with a `.btn-luxury-filled` CTA, same wording as the listing page.
- Both link to `https://swan-intl.com` only (site root) — no per-product deep link exists anywhere in this app. **Noted for later:** a `shopUrl` field per product would fix that, but it's a backend schema change, its own separate piece of work, not scheduled.
- `price` untouched everywhere else (types, database, admin form) — stays required there since the backend demands it (`z.number().min(0)`), even though it's now display-nowhere-public. Known, intentional, don't "fix" later.
- Verified via `tsc`/build (24/24 routes). **Not yet viewed in the browser.**

## Immediate next step: verify in the browser

Two things from this session haven't been looked at yet — worth doing together:
1. Bulk Add for Products (drop a batch, confirm records land correctly, confirm a deliberately-bad row now shows a real error instead of the old generic "Something went wrong").
2. The Products price removal + Shop CTA (both pages) — confirm no layout gap where price used to be, CTA reads/behaves as expected, opens `swan-intl.com` in a new tab from both the listing header and the detail page.

## Then: F4 remainder

1. `src/lib/image.ts` — Cloudinary `f_auto,q_auto` + width delivery helper. Must pass non-Cloudinary URLs (picsum placeholders, manually-pasted URLs) through untouched. See punch-list item 8 above.
2. ~~Brand logo filter~~ — done, see `PROGRESS.md`. One related loose end flagged but not fixed: `admin/brands/page.tsx`'s table thumbnail still has its own `filter: 'invert(1)'`, which would now turn a white logo black on a dark table row.
3. ~~Report what the axios interceptor does on a 401~~ — **done, 2026-07-27** (see punch-list item 1 above and `PROGRESS.md` → Known issues). Confirmed genuinely broken, not just unreported: no response interceptor, no client-side expiry check, route guard never fires on a stale-but-expired token. Ready to be scoped into an actual fix.

## Also pending / flagged, not yet scheduled

- **Tier 2 visual polish** (full detail in `PROGRESS.md` → "Known issues", punch-list items 2–7 and 9–11 above): admin table mobile overflow, Contact page mobile order, Product detail hero, Stores home/listing mismatch, New Arrivals card alignment, mobile nav + admin sidebar logo gaps, micro-text contrast, Logout hover bug. Plus lower-priority leftovers from the Section C audit: Event detail's fetch-the-whole-list pattern, filter-pill layout shift on 4 listing pages, and a few typographic scale inconsistencies between detail pages.
- `/admin/dashboard` loading/error states — reported as thin (no loading state, no error state), not fixed. No decision made yet on whether it's worth building out.

---

## Ground rules for this project (full list in `CLAUDE.md`)

- **Verify before recording as done.** Read the file or test at runtime — don't record a "done" report as fact without checking it yourself. This file was wrong for months because past-session claims weren't verified.
- **Check free RAM before diagnosing a network failure as connectivity/firewall on this machine.** A 5-second HTTPS POST timeout that looked like a network problem turned out to be memory pressure on this 8GB laptop, not a network issue at all.
