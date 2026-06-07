/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// Roles for access control
export type AdminRole = 'Super Admin' | 'Content Manager' | 'Staff';

export interface UserSession {
  id: string;
  email: string;
  name: string;
  role: AdminRole;
  token: string;
}

// Public website dynamic contents
export interface HeroContent {
  title: string;
  subtitle: string;
  primaryCtaText: string;
  secondaryCtaText: string;
}

export interface AboutContent {
  description: string;
  mission: string;
  story: string;
}

export interface ServiceItem {
  id: string;
  name: string;
  category: 'Photography' | 'Videography' | 'Graphic Design';
  description: string;
  price?: string;
  imageUrl: string;
  featured: boolean;
  status: 'Active' | 'Inactive';
}

export interface PortfolioItem {
  id: string;
  title: string;
  category: 'Portraits' | 'Graduation' | 'Family' | 'Couples' | 'Events' | 'Branding';
  imageUrl: string;
  description?: string;
  order: number;
}

export interface TestimonialItem {
  id: string;
  name: string;
  position: string;
  testimonial: string;
  rating: number; // 1 to 5
  imageUrl: string;
}

export interface Booking {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  serviceRequested: string;
  preferredDate: string;
  notes?: string;
  status: 'New' | 'Pending' | 'Confirmed' | 'Completed' | 'Cancelled';
  createdAt: string;
}

export interface Enquiry {
  id: string;
  name: string;
  email: string;
  phone: string;
  serviceRequested: string;
  message: string;
  status: 'New' | 'In Progress' | 'Replied' | 'Archived';
  assignedStaff?: string;
  replies?: Array<{
    id: string;
    sender: string;
    message: string;
    date: string;
  }>;
  createdAt: string;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  category: string;
  tags: string[];
  status: 'Draft' | 'Published';
  publishedDate?: string;
  createdAt: string;
  metaTitle?: string;
  metaDescription?: string;
  keywords?: string;
  bannerUrl: string;
}

export interface Promotion {
  id: string;
  title: string;
  description: string;
  bannerUrl: string;
  startDate: string;
  endDate: string;
  status: 'Active' | 'Inactive';
}

export interface BusinessInfo {
  companyName: string;
  phone: string;
  email: string;
  address: string;
  socials: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
    youtube?: string;
  };
}

export interface SeoSettings {
  metaTitle: string;
  metaDescription: string;
  keywords: string;
  ogImage: string;
}

export interface BrandingSettings {
  logoText: string;
  accentColor: string; // e.g., 'gold', 'emerald', 'sky', 'rose'
}

export interface SiteSettings {
  business: BusinessInfo;
  seo: SeoSettings;
  branding: BrandingSettings;
}

export interface EmailLog {
  id: string;
  recipient: string;
  subject: string;
  body: string;
  timestamp: string;
  type: 'Admin Alerts' | 'Customer Updates';
}

// Overall structure of our JSON database
export interface AppDatabase {
  users: Array<{ id: string; email: string; name: string; passwordHash: string; role: AdminRole }>;
  hero: HeroContent;
  about: AboutContent;
  services: ServiceItem[];
  portfolio: PortfolioItem[];
  testimonials: TestimonialItem[];
  bookings: Booking[];
  enquiries: Enquiry[];
  blog: BlogPost[];
  promotions: Promotion[];
  settings: SiteSettings;
  emailLogs: EmailLog[];
  visitorStats: {
    totalViews: number;
    viewsHistory: Array<{ date: string; views: number; bookings: number }>;
    sources: Array<{ name: string; count: number }>;
  };
}
