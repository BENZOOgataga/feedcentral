// FeedCentral TypeScript Types

export interface Article {
  id: string;
  title: string;
  description: string;
  content?: string;
  url: string;
  imageUrl?: string;
  author?: string;
  publishedAt: Date;
  source: Source;
  category: Category;
  tags?: string[];
  isRead?: boolean;
  isFavorite?: boolean;
}

export interface Source {
  id: string;
  name: string;
  url: string;
  feedUrl: string;
  category: Category;
  logoUrl?: string;
  isActive: boolean;
  lastFetchedAt?: Date;
  fetchInterval: number; // in minutes
  articleCount?: number;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  icon?: string;
  color?: string;
  order: number;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatar?: string;
  createdAt: Date;
  lastLoginAt?: Date;
}

export enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
}

export interface FeedJob {
  id: string;
  sourceId: string;
  source?: Source;
  status: JobStatus;
  startedAt: Date;
  completedAt?: Date;
  articlesFound: number;
  error?: string;
}

export enum JobStatus {
  PENDING = 'pending',
  RUNNING = 'running',
  COMPLETED = 'completed',
  FAILED = 'failed',
}

export interface DashboardStats {
  totalArticles: number;
  todayArticles: number;
  activeSources: number;
  categories: CategoryStats[];
  recentJobs: FeedJob[];
}

export interface CategoryStats {
  category: Category;
  articleCount: number;
  percentage: number;
}

// API Response Types
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
}

// Filter & Search Types
export interface ArticleFilters {
  category?: string;
  source?: string;
  search?: string;
  dateFrom?: Date;
  dateTo?: Date;
  isRead?: boolean;
  isFavorite?: boolean;
}

export interface SearchResult {
  articles: Article[];
  total: number;
  query: string;
}
