export interface FirestoreProject {
  id?: string;
  title: string;
  slug: string;
  subtitle: string;
  thumbnail: string;
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
  features: Array<{ title: string; description: string }>;
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
