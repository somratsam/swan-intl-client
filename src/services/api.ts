import axios from 'axios';
import type {
  TApiResponse,
  TBanner,
  TBrand,
  TEvent,
  TJob,
  TNewArrival,
  TOffer,
  TProduct,
  TStore,
  TAuthResponse,
  TLoginPayload,
} from '@/types';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000',
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('swan_token') : null;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// ─── AUTH ────────────────────────────────────────────────────────
export const login = (data: TLoginPayload) =>
  api.post<TAuthResponse>('/api/auth/login', data).then((r) => r.data);

// ─── BANNERS ─────────────────────────────────────────────────────
export const getBanners = () =>
  api.get<TApiResponse<TBanner[]>>('/api/banners').then((r) => r.data.data);
export const getBannerById = (id: string) =>
  api.get<TApiResponse<TBanner>>(`/api/banners/${id}`).then((r) => r.data.data);
export const createBanner = (data: Partial<TBanner>) =>
  api.post<TApiResponse<TBanner>>('/api/banners/create-banner', data).then((r) => r.data.data);
export const updateBanner = (id: string, data: Partial<TBanner>) =>
  api.put<TApiResponse<TBanner>>(`/api/banners/update-banner/${id}`, data).then((r) => r.data.data);
export const deleteBanner = (id: string) =>
  api.delete<TApiResponse<null>>(`/api/banners/delete-banner/${id}`).then((r) => r.data);

// ─── BRANDS ──────────────────────────────────────────────────────
export const getBrands = () =>
  api.get<TApiResponse<TBrand[]>>('/api/brands').then((r) => r.data.data);
export const getBrandById = (id: string) =>
  api.get<TApiResponse<TBrand>>(`/api/brands/brand/${id}`).then((r) => r.data.data);
export const createBrand = (data: Partial<TBrand>) =>
  api.post<TApiResponse<TBrand>>('/api/brands/create-brand', data).then((r) => r.data.data);
export const updateBrand = (id: string, data: Partial<TBrand>) =>
  api.put<TApiResponse<TBrand>>(`/api/brands/update-brand/${id}`, data).then((r) => r.data.data);
export const deleteBrand = (id: string) =>
  api.delete<TApiResponse<null>>(`/api/brands/delete-brand/${id}`).then((r) => r.data);

// ─── OFFERS ──────────────────────────────────────────────────────
export const getOffers = () =>
  api.get<TApiResponse<TOffer[]>>('/api/offers').then((r) => r.data.data);
export const getOfferById = (id: string) =>
  api.get<TApiResponse<TOffer>>(`/api/offers/offer/${id}`).then((r) => r.data.data);
export const createOffer = (data: Partial<TOffer>) =>
  api.post<TApiResponse<TOffer>>('/api/offers/create-offer', data).then((r) => r.data.data);
export const updateOffer = (id: string, data: Partial<TOffer>) =>
  api.put<TApiResponse<TOffer>>(`/api/offers/update-offer/${id}`, data).then((r) => r.data.data);
export const deleteOffer = (id: string) =>
  api.delete<TApiResponse<null>>(`/api/offers/delete-offer/${id}`).then((r) => r.data);

// ─── EVENTS ──────────────────────────────────────────────────────
export const getEvents = () =>
  api.get<TApiResponse<TEvent[]>>('/api/events').then((r) => r.data.data);
export const createEvent = (data: Partial<TEvent>) =>
  api.post<TApiResponse<TEvent>>('/api/events/create-event', data).then((r) => r.data.data);
export const updateEvent = (id: string, data: Partial<TEvent>) =>
  api.put<TApiResponse<TEvent>>(`/api/events/update-event/${id}`, data).then((r) => r.data.data);
export const deleteEvent = (id: string) =>
  api.delete<TApiResponse<null>>(`/api/events/delete-event/${id}`).then((r) => r.data);

// ─── NEW ARRIVALS ─────────────────────────────────────────────────
export const getNewArrivals = () =>
  api.get<TApiResponse<TNewArrival[]>>('/api/newArrivals').then((r) => r.data.data);
export const createNewArrival = (data: Partial<TNewArrival>) =>
  api.post<TApiResponse<TNewArrival>>('/api/newArrivals/create-newArrival', data).then((r) => r.data.data);
export const updateNewArrival = (id: string, data: Partial<TNewArrival>) =>
  api.put<TApiResponse<TNewArrival>>(`/api/newArrivals/update-newArrival/${id}`, data).then((r) => r.data.data);
export const deleteNewArrival = (id: string) =>
  api.delete<TApiResponse<null>>(`/api/newArrivals/delete-newArrival/${id}`).then((r) => r.data);

// ─── STORES ──────────────────────────────────────────────────────
export const getStores = () =>
  api.get<TApiResponse<TStore[]>>('/api/stores').then((r) => r.data.data);
export const createStore = (data: Partial<TStore>) =>
  api.post<TApiResponse<TStore>>('/api/stores/create-store', data).then((r) => r.data.data);
export const updateStore = (id: string, data: Partial<TStore>) =>
  api.put<TApiResponse<TStore>>(`/api/stores/update-store/${id}`, data).then((r) => r.data.data);
export const deleteStore = (id: string) =>
  api.delete<TApiResponse<null>>(`/api/stores/delete-store/${id}`).then((r) => r.data);

// ─── PRODUCTS ────────────────────────────────────────────────────
export const getProducts = () =>
  api.get<TApiResponse<TProduct[]>>('/api/products').then((r) => r.data.data);
export const getProductById = (id: string) =>
  api.get<TApiResponse<TProduct>>(`/api/products/${id}`).then((r) => r.data.data);
export const createProduct = (data: Partial<TProduct>) =>
  api.post<TApiResponse<TProduct>>('/api/products/create-product', data).then((r) => r.data.data);
export const updateProduct = (id: string, data: Partial<TProduct>) =>
  api.put<TApiResponse<TProduct>>(`/api/products/update-product/${id}`, data).then((r) => r.data.data);
export const deleteProduct = (id: string) =>
  api.delete<TApiResponse<null>>(`/api/products/delete-product/${id}`).then((r) => r.data);

// ─── JOBS ─────────────────────────────────────────────────────────
export const getJobs = () =>
  api.get<TApiResponse<TJob[]>>('/api/jobs').then((r) => r.data.data);
export const createJob = (data: Partial<TJob>) =>
  api.post<TApiResponse<TJob>>('/api/jobs/create-job', data).then((r) => r.data.data);
export const updateJob = (id: string, data: Partial<TJob>) =>
  api.put<TApiResponse<TJob>>(`/api/jobs/update-job/${id}`, data).then((r) => r.data.data);
export const deleteJob = (id: string) =>
  api.delete<TApiResponse<null>>(`/api/jobs/delete-job/${id}`).then((r) => r.data);

export default api;
