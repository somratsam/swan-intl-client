import { useMutation, useQuery } from '@tanstack/react-query';
import {
  getBanners,
  getBrandById,
  getBrands,
  getEvents,
  getJobs,
  getNewArrivals,
  getOfferById,
  getOffers,
  getProductById,
  getProducts,
  getStores,
  uploadImages,
} from '@/services/api';

export const useBanners = () =>
  useQuery({ queryKey: ['banners'], queryFn: getBanners });

export const useBrands = () =>
  useQuery({ queryKey: ['brands'], queryFn: getBrands });

export const useBrandById = (id: string) =>
  useQuery({ queryKey: ['brand', id], queryFn: () => getBrandById(id), enabled: !!id });

export const useOffers = () =>
  useQuery({ queryKey: ['offers'], queryFn: getOffers });

export const useOfferById = (id: string) =>
  useQuery({ queryKey: ['offer', id], queryFn: () => getOfferById(id), enabled: !!id });

export const useEvents = () =>
  useQuery({ queryKey: ['events'], queryFn: getEvents });

export const useNewArrivals = () =>
  useQuery({ queryKey: ['newArrivals'], queryFn: getNewArrivals });

export const useStores = () =>
  useQuery({ queryKey: ['stores'], queryFn: getStores });

export const useProducts = () =>
  useQuery({ queryKey: ['products'], queryFn: getProducts });

export const useProductById = (id: string) =>
  useQuery({ queryKey: ['product', id], queryFn: () => getProductById(id), enabled: !!id });

export const useJobs = () =>
  useQuery({ queryKey: ['jobs'], queryFn: getJobs });

export const useUploadImages = () =>
  useMutation({ mutationFn: uploadImages });
