# Next Session Guide

**Last updated:** 2026-07-28
**Status:** NOT complete. Section F, G, H — done, verified. Section I (2026-07-28) — password reset flow (backend + email + frontend) and the auth-loading-flash bug — done, and unlike most prior sections, **fully verified by the user in their own browser**, not just build-verified. Bulk Add — New Arrivals verified end-to-end; Products wired, not yet browser-tested. Products price removal + Shop CTA built, not yet browser-tested. Contact form discovered to be a non-functional mockup — queued as the top priority for next session.

This file is the "what to do next" companion — for the full verified history of what's actually been done and confirmed, read `PROGRESS.md` first. Don't trust a prior session's "done" claim without re-checking; see the ground rules at the bottom.

---

## Top priority next session: the Contact form

Found this session while answering a direct question, not from a planned audit. `ContactPageContent.tsx:16-20`'s submit handler never sends anything — no `fetch`/`axios`/`api.*` call, just `e.preventDefault()` + local state flip to show "Message Sent" + clear the form. No backend `contact` module exists either. Every visitor who's used this form has had their message silently discarded while being told it sent.

**Needs a design decision before any code gets written** — options on the table, not yet decided:
- New backend endpoint that sends the submission via Resend to an internal inbox (reuses the email infrastructure built in Section I — `src/app/utils/email.ts`'s pattern, `undici` timeout handling, etc. — rather than building a second, separate mail path).
- Store submissions in the DB (new `contact` module, mirroring the existing module structure — interface/model/validator/service/controller/route) with an admin screen to review them, matching the CRUD pattern already used for every other admin resource.
- Some combination of both (store + notify).

Bring this up first next session — don't start building until the direction is picked.

---

## Section I — done this session (2026-07-28), full detail in `PROGRESS.md`

1. **Password reset flow**, end to end:
   - Backend: `User` model gets `resetPasswordToken`/`resetPasswordExpires` (both `select: false`); new `POST /api/auth/forgot-password` and `POST /api/auth/reset-password`; a dedicated per-email rate limiter (3/hour) layered on the existing IP-based `authLimiter`; `forgotPassword`'s controller always returns the same generic message even on a downstream failure, by design, to keep the anti-enumeration guarantee airtight.
   - Email: `src/app/utils/email.ts` (new), calling Resend's REST API directly via the standalone `undici` package's own `fetch` + a scoped `Agent({ connectTimeout: 30000 })` — this machine's real handshake latency to `api.resend.com` measured ~22.7s, well past Node's global-fetch hardcoded 10s timeout, and *not* fixable by freeing RAM (a different root cause than the earlier documented memory-pressure incident despite an identical first symptom — see `CLAUDE.md` rules 15–16 for the full diagnostic trail). The email send is fire-and-forget from `auth.service.ts` so a slow/failed send can never block the HTTP response. Template was redesigned (table-based, inline-styled, Outlook-safe, on-brand aubergine/mauve/cream) and reviewed as a rendered Artifact before being applied.
   - Frontend: `admin/forgot-password/page.tsx` and `admin/reset-password/page.tsx` (new), a "Forgot password?" link on `admin/login/page.tsx`, and `AdminLayoutClient.tsx`'s auth guard widened to a `PUBLIC_ADMIN_PATHS` allowlist so the new pre-auth pages are actually reachable.
   - **Verified in a real inbox by the user, twice** (original template, then the redesign) — this is the first fully browser-and-inbox-verified feature in a while, not just build-verified.
2. **Auth-loading-flash bug**, user-reported and fixed: reloading any admin page briefly flashed the login page first. Root cause was a real race — `AuthContext` had no `isLoading` state, so `user === null` was ambiguous between "not logged in" and "haven't checked localStorage yet," and `AdminLayoutClient`'s guard effect fired a real redirect to `/admin/login` on that stale `null` before `AuthContext`'s own effect (which runs *after*, due to React's bottom-up effect ordering) had a chance to populate it. Fixed with an explicit `isLoading` flag; also found and fixed the identical bug independently in `admin/page.tsx` (bare `/admin` route) by grepping every `useAuth()` consumer rather than stopping at the files originally mentioned. **Confirmed fixed by the user in the browser**, including the bare `/admin` case.

Both: `npx tsc --noEmit` clean, `npm run build` 26/26 routes zero errors (frontend); backend `tsc`/`build` clean throughout too.

---

## Ground rules for this project (full list in `CLAUDE.md`)

- **Verify before recording as done.** Read the file or test at runtime — don't record a "done" report as fact without checking it yourself.
- **No browser tool available to Claude in this environment.** Everything about actual rendered/visual/interactive behavior needs the user (or a future session with browser access) to confirm — `tsc`/`npm run build` passing is necessary but not sufficient evidence of "done" for UI work. Section I is the exception so far this project: the user actively tested every piece of it in their own browser and confirmed back, rather than it going untested.
- **A network-call failure isn't always the same root cause — verify empirically, don't pattern-match to the last incident.** Two different root causes have now produced an identical first symptom on this machine (memory pressure once; a too-tight client-side timeout another time). Check free RAM **and** cross-verify with an independent tool/path (PowerShell vs curl, a raw Node `fetch` test) before concluding which one it is. Full detail in `CLAUDE.md` rules 15–16, including a hard fact worth remembering: Node's built-in `fetch` has a hardcoded 10s connect timeout with no per-call override, and this backend's Resend email call now works around it via a scoped `undici` `Agent`.
