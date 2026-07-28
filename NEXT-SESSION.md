# Next Session Guide

**Last updated:** 2026-07-28
**Status:** NOT complete. Section F (F1–F4) — **fully done** as of Section H (2026-07-28). Section G (rebrand + logo + CSS variable refactor) — done, verified. Bulk Add — New Arrivals verified end-to-end; Products wired, not yet browser-tested. Products price removal + Shop CTA built, not yet browser-tested.

This file is the "what to do next" companion — for the full verified history of what's actually been done and confirmed, read `PROGRESS.md` first. Don't trust a prior session's "done" claim without re-checking; see the ground rules at the bottom.

---

## Before anything else: check `git status` on the frontend repo

Not checked/committed as part of the 2026-07-28 session — this session's changes (401 handling, mobile nav logo, Cloudinary helper: `api.ts`, `AuthContext.tsx`, `admin/login/page.tsx`, `Navbar.tsx`, new `src/lib/image.ts`, plus ~15 files wiring the image helper into public pages) are sitting in the working tree. Verify whether they got committed before doing anything else.

---

## Section H — done this session (2026-07-28), full detail in `PROGRESS.md`

1. **F4 — 401 handling.** Added a response interceptor in `api.ts` that detects a 401 on any admin route (excluding the login page itself, so a failed-login 401 isn't mistaken for a session expiry), dispatches a `swan:unauthorized` window event, and sets a `sessionStorage` flag. `AuthContext.tsx` listens for that event and calls the existing `logoutFn()`. `AdminLayoutClient.tsx`'s existing route guard then redirects to `/admin/login` for free — no changes needed there. `admin/login/page.tsx` shows "Your session has expired. Please sign in again." when the flag is set. Verified via `tsc`/build, and the backend was confirmed via `curl` to actually return HTTP 401 (not some other code) for a bad JWT on a protected route. **Not** verified by actually letting a token expire and watching the redirect happen in a browser — no browser tool in this environment.
2. **Mobile nav overlay logo** — `Navbar.tsx`'s hamburger menu header now shows the same mark+chip as the collapsed desktop bar/footer, replacing the old text-only wordmark.
3. **F4 — Cloudinary `f_auto`/`q_auto` delivery helper** — new `src/lib/image.ts` (`optimizeImage(url, { width? })`), passes non-Cloudinary URLs through untouched. Wired into every dynamic image on the public site (home sections + all listing/detail pages). Deliberately **not** wired into admin table thumbnails or `ImageUpload.tsx`'s preview `<img>` — out of scope, internal-tool traffic, not the public/mobile page-weight problem this was meant to fix.

All three: `npx tsc --noEmit` clean, `npm run build` 24/24 routes zero errors. None of the three were clicked through in an actual browser — this environment has no browser/screenshot tool, so browser verification is still owed on all three next session.

---

## Immediate next step: browser verification

Nothing in this session was visually confirmed. Worth doing together next session, in rough priority order:
1. **401 flow** — log in as admin, manually corrupt/expire `swan_token` in devtools (or wait out the backend's token TTL), trigger any admin data call, confirm: redirected to `/admin/login`, "session expired" message shown, no console errors.
2. **Mobile nav logo** — open the hamburger menu at a mobile viewport, confirm the mark renders correctly (not clipped, not stretched) next to "Swan / International".
3. **Cloudinary helper** — open devtools network tab on the home page and a listing page, confirm image request URLs now contain `f_auto,q_auto` in the path, and confirm images still render correctly (no broken images from a malformed transform insertion).
4. Bulk Add for Products (drop a batch, confirm records land correctly, confirm a deliberately-bad row shows a real error).
5. Products price removal + Shop CTA (both pages) — confirm no layout gap, CTA opens `swan-intl.com` in a new tab.

---

## Tier 2 polish backlog (lower priority, unchanged from before — full detail in `PROGRESS.md` → "Known issues")

- Admin tables clipped on narrow viewports — no `overflow-x-auto` wrapper on any table, combined with `overflow-x-hidden` on `<main>`, means columns become physically unreachable, not just squeezed.
- Contact page buries the form under 5 store cards on mobile.
- Product detail page has no hero image, unlike Brand/Offer/Event detail.
- Home Stores section (text-only) doesn't match `/stores` (photo-led).
- New Arrivals card alignment / six-across cramping.
- Micro-text contrast (`text-[8px]`–`text-[10px]`) passes WCAG math for normal text but may need more headroom at that size.
- `Navbar.tsx` Logout button hover — same inline-style-vs-Tailwind-hover specificity bug as the (already-fixed) Dashboard button, lower severity.
- Admin sidebar logo still lacks the mark (mobile nav's version of this was fixed in Section H).
- From the original Section C audit: Event detail's fetch-the-whole-list pattern instead of a by-ID fetch; filter-pill layout shift on 4 listing pages; a few typographic scale inconsistencies between detail pages.
- `/admin/dashboard` loading/error states — no loading state (tiles flash "0"), no error state (failed fetch also shows "0"). No decision made on whether it's worth building out.

---

## Ground rules for this project (full list in `CLAUDE.md`)

- **Verify before recording as done.** Read the file or test at runtime — don't record a "done" report as fact without checking it yourself. This file was wrong for months because past-session claims weren't verified.
- **No browser tool in this environment.** Anything about actual rendered/visual/responsive behavior needs a human (or a future session with browser access) to confirm — `tsc`/`npm run build` passing is necessary but not sufficient evidence of "done" for UI work.
- **Check free RAM before diagnosing a network failure as connectivity/firewall on this machine.** A 5-second HTTPS POST timeout that looked like a network problem turned out to be memory pressure on this 8GB laptop, not a network issue at all.
