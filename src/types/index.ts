// ==========================================
// Service Types for Provider App
// ==========================================

export interface ServiceAvailability {
  day: string;
  startTime: string;
  endTime: string;
}

export interface ServiceFeature {
  icon?: string;
  title: string;
  description?: string;
}

export interface ServiceFAQ {
  question: string;
  answer: string;
}

export interface ServicePricingTier {
  name: string;
  price: number;
  duration: string;
  description?: string;
  isPopular?: boolean;
}

export interface ServiceAddress {
  street?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
  landmark?: string;
}

export interface GeoLocation {
  type: string;
  coordinates: [number, number]; // [longitude, latitude]
}

export interface ServiceArea {
  radius: number;
  cities?: string[];
}

export interface SocialLinks {
  website?: string;
  facebook?: string;
  instagram?: string;
  youtube?: string;
}

export interface Service {
  _id: string;
  name: string;
  description: string;
  shortDescription?: string;
  category: string;
  subCategory?: string;
  basePrice: number;
  estimatedDuration: string;
  organization: string;
  serviceProvider?: string;
  availability: ServiceAvailability[];
  location?: GeoLocation;
  address?: ServiceAddress;
  rating: number;
  reviewCount: number;
  tags: string[];
  images: string[];
  coverImage?: string;
  videoUrl?: string;
  isActive: boolean;
  isFeatured: boolean;
  
  // Enhanced Fields
  features: ServiceFeature[];
  faqs: ServiceFAQ[];
  pricingTiers: ServicePricingTier[];
  requirements?: string[];
  cancellationPolicy?: string;
  warrantyInfo?: string;
  serviceArea?: ServiceArea;
  minBookingNotice?: number;
  maxBookingsPerDay?: number;
  completedBookings: number;
  viewCount: number;
  contactPhone?: string;
  contactEmail?: string;
  socialLinks?: SocialLinks;
  assignedAgents: string[];
  
  createdAt: string;
  updatedAt: string;
}

export interface CreateServiceData {
  name: string;
  description: string;
  shortDescription?: string;
  category: string;
  subCategory?: string;
  basePrice: number;
  estimatedDuration: string;
  availability?: ServiceAvailability[];
  location?: {
    type: string;
    coordinates: [number, number];
  };
  address?: ServiceAddress;
  tags?: string[];
  images?: string[];
  coverImage?: string;
  videoUrl?: string;
  features?: ServiceFeature[];
  faqs?: ServiceFAQ[];
  pricingTiers?: ServicePricingTier[];
  requirements?: string[];
  cancellationPolicy?: string;
  warrantyInfo?: string;
  serviceArea?: ServiceArea;
  minBookingNotice?: number;
  maxBookingsPerDay?: number;
  contactPhone?: string;
  contactEmail?: string;
  socialLinks?: SocialLinks;
}

export interface UpdateServiceData extends Partial<CreateServiceData> {
  isActive?: boolean;
  isFeatured?: boolean;
}
