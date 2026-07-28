# Next Session Guide

**Last updated:** 2026-07-28
**Status:** NOT complete. Section F, G, H, I — done, verified. Section J (2026-07-28) — the complete Contact system (public form save+notify, Resend domain verification, admin Messages/reply) — done, **fully verified by the user in the browser**, not just build-verified. Bulk Add — New Arrivals verified end-to-end; Products wired, not yet browser-tested. Products price removal + Shop CTA built, not yet browser-tested.

This file is the "what to do next" companion — for the full verified history of what's actually been done and confirmed, read `PROGRESS.md` first. Don't trust a prior session's "done" claim without re-checking; see the ground rules at the bottom.

---

## No open design decision pending next session

Unlike the last several sessions, there's no unresolved gap or undecided direction queued up right now — the Contact system that opened last session is fully closed out (public form, domain verification, admin reply). What's left is the Tier 2 polish backlog below, all of it already scoped, none of it needing a new decision before starting — pick whichever item matters most and go.

---

## Section J — done this session (2026-07-28), full detail in `PROGRESS.md`

Three pieces, built as three separate approved plans across the session:

1. **Public Contact form actually works.** New `contact` module (`swan-intl-m-server`, mirrors the `banners` module's file structure): `POST /api/contact` (public, rate-limited 5/hour/IP), `GET /api/contact` (admin-only). Saves to DB first (a save failure is a real surfaced error — hiding it would recreate the exact bug being fixed), then fires a notification email fire-and-forget (mirrors `forgotPassword`'s pattern). `email.ts` refactored to share Resend-call boilerplate between the password-reset and contact-notification templates. Frontend: `ContactPageContent.tsx` now calls the real endpoint, only clears the form on confirmed success (previously cleared unconditionally, which was harmless before real failure was possible). Hit the **same casing bug as Section I's password-reset work**, independently — `IT.Department@swan-intl.com` vs. Resend's lowercase-registered `it.department@swan-intl.com` — same fix.
2. **Resend domain verification confirmed working.** `updates.swan-intl.com` is verified; `RESEND_FROM_EMAIL` updated everywhere (`config/index.ts` fallback, `.env`, `.env.example`) to `Swan International <no-reply@updates.swan-intl.com>`. Proved this actually works — not just that the dashboard says "verified" — by sending directly to an address that was neither the Resend account's own inbox nor a DB-matched user, deliberately bypassing both product flows' fixed/derived recipients. This is what makes replying to real customers viable.
3. **Admin can view and reply to messages.** `contact` module extended with `replyText`/`repliedAt`, `PATCH /api/contact/:id/read`, `POST /api/contact/:id/reply`. The reply endpoint is the **one deliberate exception to this codebase's fire-and-forget email pattern** — sending the email is the entire point of the endpoint, so it's awaited and a failure surfaces as a real `502`, not hidden. New `admin/messages/page.tsx`: inbox-style expand-in-place list, mark-as-read automatic on first expand, failed replies leave typed text in place rather than clearing it.

All three: `npx tsc --noEmit` clean, `npm run build` 27/27 routes zero errors (frontend); backend `tsc`/`build` clean throughout. **Fully verified by the user in the browser** — form submission, notification email, domain-verified send to an arbitrary address, and the full Messages/reply loop including persistence after reload.

---

## Tier 2 polish backlog (full detail in `PROGRESS.md` → "Known issues", prioritized worst-first)

1. **Admin tables clipped on narrow viewports** — no `overflow-x-auto` wrapper on any table, combined with `overflow-x-hidden` on `<main>`, means columns become physically unreachable, not just squeezed. Worst item on the list, unchanged for several sessions now.
2. **Contact page mobile layout** — still stacks the form under 5 store cards on mobile (`grid-cols-1 lg:grid-cols-2`, no `order-*`). Note: this is a pure layout-ordering issue, separate from the submit-handler bug fixed in Section J — that part is done, this part isn't.
3. Product detail page has no hero image, unlike Brand/Offer/Event detail.
4. Home Stores section (text-only) doesn't match `/stores` (photo-led).
5. New Arrivals card alignment / six-across cramping.
6. Micro-text contrast (`text-[8px]`–`text-[10px]`) passes WCAG math for normal text but may need more headroom at that size.
7. `Navbar.tsx` Logout button hover — same inline-style-vs-Tailwind-hover specificity bug as the (already-fixed) Dashboard button, lower severity.
8. Admin sidebar logo still lacks the mark (mobile nav's version of this was fixed in Section H).
9. **New from Section J:** Contact reply has no thread/history — `TContact` stores one `replyText`/`repliedAt` pair, not an array, so a second reply silently overwrites the first with no record. Would need a schema change (`replies: []`) — not built, wasn't asked for, flagged for later.

Also still open from the original Section C audit: Event detail's fetch-the-whole-list pattern instead of a by-ID fetch; filter-pill layout shift on 4 listing pages; a few typographic scale inconsistencies between detail pages. `/admin/dashboard` loading/error states — no loading state (tiles flash "0"), no error state (failed fetch also shows "0"), no decision made on whether it's worth building out.

---

## Ground rules for this project (full list in `CLAUDE.md`)

- **Verify before recording as done.** Read the file or test at runtime — don't record a "done" report as fact without checking it yourself.
- **No browser tool available to Claude in this environment.** Everything about actual rendered/visual/interactive behavior needs the user to confirm — `tsc`/`npm run build` passing is necessary but not sufficient evidence of "done" for UI work. Sections I and J are the exceptions so far: the user actively tested every piece of both in their own browser and confirmed back.
- **A network-call failure isn't always the same root cause — verify empirically, don't pattern-match to the last incident.** Full detail in `CLAUDE.md` rules 15–16: Node's built-in `fetch` has a hardcoded 10s connect timeout with no per-call override, worked around via a scoped `undici` `Agent` for all Resend calls now (password reset, contact notification, contact reply all share this).
- **When testing an admin-only endpoint and you don't have real login credentials**, it's fine to generate a JWT directly (same secret/payload shape the real login flow signs) via a disposable script rather than asking for the password — this exercises the real `authMiddleware`/`adminOnly` guards without needing to bypass anything. Used successfully in Section J to test the Messages/reply endpoints.
