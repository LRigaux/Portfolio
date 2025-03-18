export interface Project {
  id: string;
  title: string;
  slug: string;
  description: string;
  content?: string;
  imageUrl?: string;
  githubUrl?: string;
  liveUrl?: string;
  rank: string;
  featured: boolean;
  status: string;
  viewCount?: number;
  technologies: string[] | { id: string; name: string; slug: string }[];
  categories: string[] | { id: string; name: string; slug: string }[];
  createdAt: string | Date;
  updatedAt: string | Date;
}

export interface Technology {
  id: string;
  name: string;
  slug: string;
  description?: string;
  imageUrl?: string;
  category?: string;
  level?: number;
  rank?: string;
  relatedProjects?: {
    id: string;
    title: string;
    slug: string;
    rank: string;
  }[];
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface Pagination {
  total: number;
  pages: number;
  page: number;
  limit: number;
} 