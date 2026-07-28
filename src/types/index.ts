export type TUser = {
  _id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'admin' | 'user';
  needsPasswordChange: boolean;
  createdAt: string;
  updatedAt: string;
};

export type TRegisterPayload = {
  username: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role?: 'admin' | 'user';
};

export type TLoginPayload = {
  email: string;
  password: string;
};

export type TAuthResponse = {
  success: boolean;
  message: string;
  data: {
    token: string;
    user: TUser;
  };
};

export type TContactPayload = {
  name: string;
  email: string;
  subject: string;
  message: string;
};

export type TContact = {
  _id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  read: boolean;
  replyText?: string;
  repliedAt?: string;
  createdAt: string;
  updatedAt: string;
};

export type TContactListResponse = {
  contacts: TContact[];
  total: number;
  page: number;
  limit: number;
};

export type TBanner = {
  _id: string;
  title: string;
  subtitle: string;
  image: string;
  link: string;
  isActive: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
};

export type TBrand = {
  _id: string;
  brand: string;
  address: string;
  phone: string;
  email: string;
  brandImage: string;
  brandLogo: string;
  description: string;
  features: string[];
  bannerImage: string[];
  gallery: string[];
  products: string;
  history: string;
  mainBanner: string;
  createdAt: string;
  updatedAt: string;
};

export type TLocation = {
  address: string;
  city: string;
  country: string;
};

export type TTime = {
  start: string;
  end: string;
};

export type TOrganizer = {
  name: string;
  contact: string;
  phone: string;
};

export type TEvent = {
  _id: string;
  image: string;
  title: string;
  description: string;
  date: string;
  location: TLocation;
  time: TTime;
  category: string;
  organizer: TOrganizer;
  tags: string[];
  createdAt: string;
  updatedAt: string;
};

export type TJob = {
  _id: string;
  title: string;
  company: string;
  companyLogo: string;
  description: string;
  location: string;
  salary: number;
  jobType: 'full-time' | 'part-time' | 'contract' | 'freelance' | 'internship' | 'temporary';
  requirements: string[];
  responsibilities: string[];
  benefits?: string[];
  createdAt: string;
  updatedAt: string;
};

export type TNewArrival = {
  _id: string;
  brand: string;
  caption: string;
  image: string;
  createdAt: string;
  updatedAt: string;
};

export type TOffer = {
  _id: string;
  image: string;
  title: string;
  description: string;
  dateRange: {
    startDate: string;
    endDate: string;
  };
  location: {
    address: string;
    mapLink: string;
  };
  contact: {
    phone: string;
    email: string;
    storeHours: string;
  };
  social_media: {
    facebook: string;
    instagram: string;
    twitter: string;
  };
  exclusiveOfferDetails: {
    loyaltyRewards: string;
    giftVouchers: string;
    specialEvents: string;
  };
  tags: string[];
  createdAt: string;
  updatedAt: string;
};

export type TProductItem = {
  title: string;
  brand: string;
  image: string;
  description: string;
  gallery: string[];
};

export type TProduct = {
  _id: string;
  name: string;
  image: string;
  category: string;
  description: string;
  price: number;
  tags: string[];
  items: TProductItem[];
  createdAt: string;
  updatedAt: string;
};

export type TStoreLocation = {
  lat: number;
  lng: number;
};

export type TStore = {
  _id: string;
  name: string;
  address: string;
  mapLink: string;
  phone: string;
  email: string;
  openingHours: string;
  images: string[];
  location: TStoreLocation;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

export type TApiResponse<T> = {
  success: boolean;
  message: string;
  data: T;
};
