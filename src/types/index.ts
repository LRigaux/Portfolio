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
  technologies?: string[];
  categories?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Pagination {
  total: number;
  pages: number;
  page: number;
  limit: number;
} 