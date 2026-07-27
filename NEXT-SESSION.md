# Next Session Guide

**Last updated:** 2026-07-26
**Status:** NOT complete. Section F (admin image uploads) is at F1 of 4.

This file is the "what to do next" companion — for the full verified history of what's actually been done and confirmed, read `PROGRESS.md` first. Don't trust a prior session's "done" claim without re-checking; see the ground rules at the bottom.

---

## Immediate next step: F2 — ImageUpload component

Build `src/components/admin/ImageUpload.tsx`. Agreed requirements, not yet built:

- Props to support both single-image and multi-image fields (Stores needs an array; most others need one)
- File picker + drag-and-drop
- Client-side validation mirroring the backend exactly: jpg/jpeg/png/webp, 5MB per file, max 10 files — use the backend's exact wording so the two never disagree:
  - "File too large — maximum 5MB per image"
  - "Too many files — maximum 10 per upload"
  - "Only jpg, png and webp images are allowed"
- Thumbnail previews with per-image remove
- Upload progress indication — **load-bearing, not decorative.** The upload call has a 60s timeout, which can still be tight for a full 10×5MB batch on a slow connection, so silence during upload will read as broken.
- Errors surfaced through the existing `Toast` component
- Shows the current value when editing an existing record, so an admin can see what's already set before replacing it
- Manual URL-paste fallback, in case Cloudinary is ever unreachable
- No cropping, rotation, or reordering — upload and remove only
- Uses the `useUploadImages()` mutation hook already added in F1 (`src/hooks/useApi.ts`)

## Then: F3 — wire ImageUpload into the 9 admin screens

One screen at a time — report back after each, don't do them in one silent pass. Order: banners → new-arrivals → offers → events → products → jobs → stores → brands, with **products last as its own step**, not folded in with the single-field screens — its `items[]` array has per-item `image`/`gallery` fields, needing a per-row uploader instance rather than one top-level field. If it turns out to be substantially more work than the others, say so before just doing it. Full field inventory is in `PROGRESS.md`.

## Then: F4 — delivery optimization + auth hardening

1. `src/lib/image.ts` — helper that inserts `f_auto,q_auto` + a width parameter into Cloudinary URLs at render time. Must pass non-Cloudinary URLs (picsum placeholders, manually-pasted URLs) through untouched.
2. Brand logo `filter: brightness(0) invert(1)` in `BrandsPageClient.tsx` / `brands/[id]/page.tsx` — only works for transparent-background silhouettes, will break on real uploaded logos. A fix needs to be **proposed and approved**, not decided unilaterally.
3. Report — don't just fix — what the axios interceptor currently does on a 401 response, before changing anything.

## Also pending / flagged, not yet scheduled into F1–F4

- **Backend, live security issue:** `POST /api/auth/register` still allows unauthenticated self-registration as admin (arbitrary `role` in the payload, no route guard). Confirmed unchanged on direct read this session. Recommend prioritizing this over further frontend polish — it's in the backend repo, not touched here.
- **Tier 2 visual polish** (full detail in `PROGRESS.md` → "Known issues"): New Arrivals card alignment/six-across cramping, Home Stores section (text-only) vs. `/stores` listing page (photo-led) mismatch, Product detail missing the hero every sibling detail page has, Contact page's mobile layout burying the form under 5 store cards. Plus lower-priority leftovers from the Section C audit: Event detail's fetch-the-whole-list pattern, filter-pill layout shift on 4 listing pages, and a few typographic scale inconsistencies between detail pages.
- `/admin/dashboard` loading/error states — reported as thin (no loading state, no error state), not fixed. No decision made yet on whether it's worth building out.

---

## Ground rules for this project (full list in `CLAUDE.md`)

- **Verify before recording as done.** Read the file or test at runtime — don't record a "done" report as fact without checking it yourself. This file was wrong for months because past-session claims weren't verified.
- **Check free RAM before diagnosing a network failure as connectivity/firewall on this machine.** A 5-second HTTPS POST timeout that looked like a network problem turned out to be memory pressure on this 8GB laptop, not a network issue at all.
