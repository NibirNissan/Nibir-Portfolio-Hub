export interface FirestoreProject {
  id?: string;
  title: string;
  slug: string;
  subtitle: string;
  thumbnail: string;
  mockupImage?: string;
  techStack: string[];
  liveLink: string;
  repoLink: string;
  status: string;
  year: string;
  role: string;
  accent: string;
  heroDescription: string;
  problem: string;
  solution: string;
  tags: string[];
  features: Array<{ title: string; description: string; imageUrl?: string }>;
  stats: Array<{ value: string; label: string }>;
  detailSections: Array<{ type: "text" | "image"; content: string }>;
  createdAt?: number;
  order?: number;
}

export interface FirestoreBlog {
  id?: string;
  title: string;
  slug: string;
  date: string;
  coverImage: string;
  content: string;
  excerpt: string;
  published: boolean;
  createdAt?: number;
}

export interface FirestoreProfile {
  heroTitle?: string;
  heroSubtitle?: string;
  bio?: string;
  profileImageUrl?: string;
  resumeLink?: string;
  availability?: string;
}

export interface FirestoreSocial {
  id?: string;
  name: string;
  icon: string;
  url: string;
  order?: number;
}

export interface FirestoreSkill {
  id?: string;
  name: string;
  category: string;
  order?: number;
}

export interface FirestoreTestimonial {
  id?: string;
  clientName: string;
  designation: string;
  imageUrl: string;
  review: string;
  rating?: number;
  order?: number;
  createdAt?: number;
}

export interface FirestoreService {
  id?: string;
  title: string;
  description: string;
  iconUrl: string;
  price?: string;
  badge?: string;
  color?: string;
  process?: Array<{ title: string; description: string }>;
  deliverables?: Array<{ title: string; description: string }>;
  packages?: Array<{ name: string; subtitle: string; price?: string; features: string[] }>;
  faqs?: Array<{ question: string; answer: string }>;
  order?: number;
  createdAt?: number;
}

export interface FirestoreInquiry {
  id?: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  read?: boolean;
  createdAt?: number;
}

export interface FirestoreTimeline {
  id?: string;
  year: string;
  title: string;
  description: string;
  icon: string;
  rgb: string;
  tag: string;
  imageUrl?: string;
  order?: number;
}
