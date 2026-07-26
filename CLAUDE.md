# Swan International — Frontend Project Context

> **READ THIS FIRST** at the start of every session before touching any code.
> Also read `PROGRESS.md` to see what is done and what is pending.

---

## Project Overview

This is the **public-facing website + admin dashboard** for Swan International, a luxury Italian fashion retailer based in Muscat, Oman. It is a Next.js 16 frontend that connects to an Express/MongoDB backend API.

---

## Company Information

| Field | Value |
|---|---|
| Company Name | Swan International |
| Business | Luxury Italian fashion retailer |
| Location | Muscat, Sultanate of Oman |
| CEO | H.H. Aliya Bint Thuwainy Al Said |

### Our 6 Brands
1. MAX&Co
2. Pennyblack
3. LIU.JO Woman
4. Furla
5. Marella
6. United Colors of Benetton

### Our 5 Stores in Muscat
1. City Centre Muscat
2. Al Araimi Boulevard (Swan Galleria)
3. Mall of Oman
4. Furla at City Centre
5. Ventisei at Mall of Oman

---

## Folder Paths

| | Path |
|---|---|
| **Frontend** | `C:\Users\Lenovo\Desktop\swan 2026\Swan Projects\swan-update-site\swan-intl-client` |
| **Backend** | `C:\Users\Lenovo\Desktop\swan 2026\Swan Projects\swan-update-site\swan-intl-m-server` |

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16.2.4 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| HTTP Client | Axios |
| Data Fetching | TanStack React Query v5 |
| Animations | Framer Motion |
| Auth State | React Context + localStorage |
| Backend | Express.js + MongoDB (Mongoose) |
| Validation (backend) | Zod |

---

## Backend Base URL

```
http://localhost:5000
```

The Axios instance in `src/services/api.ts` uses this base URL and automatically attaches the JWT token from `localStorage.getItem('swan_token')` to every request.

---

## All API Endpoints

### Auth
| Method | Path | Description |
|---|---|---|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login — returns `{ data: { accessToken, user } }` |
| POST | `/api/auth/logout` | Logout |

### Banners
| Method | Path | Auth Required |
|---|---|---|
| GET | `/api/banners` | No |
| GET | `/api/banners/:bannerId` | No |
| POST | `/api/banners/create-banner` | Yes (Admin) |
| PUT | `/api/banners/update-banner/:bannerId` | Yes (Admin) |
| DELETE | `/api/banners/delete-banner/:bannerId` | Yes (Admin) |

### Brands
| Method | Path | Auth Required |
|---|---|---|
| GET | `/api/brands` | No |
| GET | `/api/brands/brand/:brandId` | No |
| POST | `/api/brands/create-brand` | No |
| PUT | `/api/brands/update-brand/:brandId` | No |
| DELETE | `/api/brands/delete-brand/:brandId` | No |

### Offers
| Method | Path | Auth Required |
|---|---|---|
| GET | `/api/offers` | No |
| GET | `/api/offers/offer/:offerId` | No |
| POST | `/api/offers/create-offer` | No |
| PUT | `/api/offers/update-offer/:offerId` | No |
| DELETE | `/api/offers/delete-offer/:offerId` | No |

### Events
| Method | Path | Auth Required |
|---|---|---|
| GET | `/api/events` | No |
| POST | `/api/events/create-event` | No |
| PUT | `/api/events/update-event/:eventId` | No |
| DELETE | `/api/events/delete-event/:eventId` | No |

### New Arrivals
| Method | Path | Auth Required |
|---|---|---|
| GET | `/api/newArrivals` | No |
| POST | `/api/newArrivals/create-newArrival` | No |
| PUT | `/api/newArrivals/update-newArrival/:newArrivalId` | No |
| DELETE | `/api/newArrivals/delete-newArrival/:newArrivalId` | No |

### Stores
| Method | Path | Auth Required |
|---|---|---|
| GET | `/api/stores` | No |
| GET | `/api/stores/:storeId` | No |
| POST | `/api/stores/create-store` | Yes (Admin) |
| PUT | `/api/stores/update-store/:storeId` | Yes (Admin) |
| DELETE | `/api/stores/delete-store/:storeId` | Yes (Admin) |

### Products
| Method | Path | Auth Required |
|---|---|---|
| GET | `/api/products` | No |
| GET | `/api/products/:productId` | No |
| POST | `/api/products/create-product` | No |
| PUT | `/api/products/update-product/:productId` | No |
| DELETE | `/api/products/delete-product/:productId` | No |

### Jobs
| Method | Path | Auth Required |
|---|---|---|
| GET | `/api/jobs` | No |
| POST | `/api/jobs/create-job` | No |
| PUT | `/api/jobs/update-job/:jobId` | No |
| DELETE | `/api/jobs/delete-job/:jobId` | No |

---

## Design System

### Colors
| Name | Hex | Usage |
|---|---|---|
| Primary | `#000000` | Background base |
| Secondary | `#FFFFFF` | Text on dark |
| **Accent (Gold)** | `#C9A84C` | Brand color — borders, headings, CTAs |
| Dark BG | `#0A0A0A` | Page background |
| Card BG | `#111111` | Card/panel background |
| Subtle BG | `#050505` | Footer, deeper sections |
| Text Muted | `#888888` | Body text, descriptions |
| Border | `#1A1A1A` | Subtle borders |

### Typography
| Role | Font | Source |
|---|---|---|
| Headings / Brand | Playfair Display | Google Fonts (imported in globals.css) |
| Body / UI | Inter | Google Fonts (imported in globals.css) |

### Design Feel
- Luxury premium aesthetic — inspired by NET-A-PORTER
- Smooth Framer Motion animations throughout
- Fade-in on scroll (`whileInView` + `viewport={{ once: true }}`)
- Hover scale/zoom on all cards (`card-hover` CSS class)
- Loading skeletons while fetching (never show broken layouts)
- Fully mobile responsive
- Sticky navbar with blur effect on scroll

### CSS Utility Classes (defined in `globals.css`)
| Class | Effect |
|---|---|
| `.btn-luxury` | Gold border button, fills gold on hover |
| `.btn-luxury-filled` | Solid gold button |
| `.card-hover` | translateY(-4px) + gold glow shadow on hover |
| `.divider-gold` | Horizontal gradient gold line |
| `.skeleton` | Pulsing loading placeholder background |
| `.line-clamp-2` | Truncate text at 2 lines |
| `.line-clamp-3` | Truncate text at 3 lines |

---

## Authentication & Admin

| Key | Value |
|---|---|
| JWT localStorage key | `swan_token` |
| User localStorage key | `swan_user` |
| Admin login URL | `/admin/login` |
| Admin dashboard URL | `/admin/dashboard` |
| Auth context file | `src/context/AuthContext.tsx` |

- `AuthContext` exposes: `{ user, token, isAdmin, login, logout }`
- `AdminLayoutClient.tsx` redirects non-admins to `/admin/login`
- `Navbar` and `Footer` return `null` when `pathname.startsWith('/admin')`
- After login, always verify `user.role === 'admin'` before granting dashboard access

---

## Important Rules — Always Follow

1. **Never recreate existing files.** Check `PROGRESS.md` first, then verify a file doesn't exist before creating it.
2. **Read backend models** in `swan-intl-m-server/src/app/modules/*/` for exact field names — never guess.
3. **Keep black/gold luxury design** on every new page. No white backgrounds on public pages.
4. **All new public pages** use the same header: `pt-40`, gold eyebrow text, large Playfair Display `h1`, gold divider.
5. **All new admin CRUD pages** follow: table listing + `AnimatePresence` modal form + `ConfirmDialog` + `Toast`.
6. **Invalidate the correct React Query key** after every mutation so UI updates instantly.
7. **Run `npm run build`** after significant work — zero errors is the required standard.
8. **Update `PROGRESS.md`** whenever you complete something new.
9. **Navbar and Footer are hidden on `/admin/*`** — do not render them inside admin components.
10. **Backend handles all validation** (Zod). Show `err.response.data.message` from the error on the frontend.
11. **No unnecessary comments** in code — identifiers should be self-documenting.
12. **Admin role check:** After login API call, check `res.data.user.role === 'admin'` before calling `authLogin()`.
13. **localStorage token key is `swan_token`** (not `token`) — the Axios interceptor reads this key.

---

## Key File Locations

| File | Purpose |
|---|---|
| `src/types/index.ts` | All TypeScript types — mirrors backend Mongoose models |
| `src/services/api.ts` | All API calls — GET and mutations for every entity |
| `src/hooks/useApi.ts` | React Query hooks for all data fetching |
| `src/context/AuthContext.tsx` | Auth state: user, token, isAdmin, login, logout |
| `src/lib/queryClient.ts` | React Query client config |
| `src/lib/ReactQueryProvider.tsx` | Wraps app in QueryClientProvider |
| `src/app/layout.tsx` | Root layout — providers + Navbar + Footer |
| `src/app/admin/AdminLayoutClient.tsx` | Admin sidebar layout + auth protection |
| `src/components/admin/Toast.tsx` | Reusable toast (success/error/info) |
| `src/components/admin/ConfirmDialog.tsx` | Reusable delete confirmation dialog |
| `src/components/ui/LoadingSkeleton.tsx` | Skeleton loaders (Card, Grid, Hero, Detail) |
| `src/components/ui/SectionTitle.tsx` | Animated section header with gold divider |

---

## React Query Keys Reference

```
'banners'      → getBanners()
'brands'       → getBrands()
['brand', id]  → getBrandById(id)
'offers'       → getOffers()
['offer', id]  → getOfferById(id)
'events'       → getEvents()
'newArrivals'  → getNewArrivals()
'stores'       → getStores()
'products'     → getProducts()
['product', id]→ getProductById(id)
'jobs'         → getJobs()
```

---

## How to Run

```bash
# 1. Start backend first (required)
cd "C:\Users\Lenovo\Desktop\swan 2026\Swan Projects\swan-update-site\swan-intl-m-server"
npm run dev        # → http://localhost:5000

# 2. Start frontend
cd "C:\Users\Lenovo\Desktop\swan 2026\Swan Projects\swan-update-site\swan-intl-client"
npm run dev        # → http://localhost:3000

# Type check only (no build output)
npx tsc --noEmit

# Full production build check
npm run build
```
