export type ServiceVisualType =
  | 'web'
  | 'software'
  | 'marketing'
  | 'meta'
  | 'google'
  | 'branding';

export interface ServiceItem {
  id: string;
  number: string;
  title: string;
  description: string;
  deliverables: string[];
  visualType: ServiceVisualType;
  highlights: string;
}

export interface ProjectItem {
  id: string;
  title: string;
  category: string;
  shortDescription: string;
  fullSummary: string;
  technologies: string[];
  imageUrl: string;
  projectUrl: string;
  isDemo: boolean;
}

export interface TestimonialItem {
  id: string;
  quote: string;
  authorName: string;
  authorRole: string;
  companyName: string;
  isPlaceholder: boolean;
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

export interface InquiryItem {
  id: string;
  fullName: string;
  businessEmail: string;
  companyName: string;
  country: string;
  serviceRequired: string;
  projectBudget: string;
  projectDetails: string;
  status: 'new' | 'reviewed' | 'archived';
  createdAt: string;
}

export interface SocialLinks {
  linkedin: string;
  twitter: string;
  instagram: string;
  facebook: string;
  github: string;
}

export interface SiteContent {
  heroHeadline: string;
  heroSupportingText: string;
  heroPrimaryCta: string;
  heroSecondaryCta: string;
  trustHeading: string;
  trustDescription: string;
  aboutHeading: string;
  aboutDescription: string;
  aboutMission: string;
  aboutVision: string;
  aboutApproach: string;
  marketingHeadline: string;
  marketingDescription: string;
  marketingCta: string;
  contactHeadline: string;
  contactDescription: string;
  contactEmail: string;
  phoneNumber: string;
  footerTagline: string;
  footerDescription: string;
  socialLinks: SocialLinks;
}

export interface AgencyDatabase {
  siteContent: SiteContent;
  services: ServiceItem[];
  projects: ProjectItem[];
  testimonials: TestimonialItem[];
  faqs: FaqItem[];
  inquiries: InquiryItem[];
}
