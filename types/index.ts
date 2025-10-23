export interface Article {
  id: string;
  title: string;
  description: string;
  url: string;
  source_name: string;
  source_id: string;
  category: string;
  pub_date: Date;
  created_at: Date;
  image_url: string | null;
}

export interface Source {
  id: string;
  name: string;
  url: string;
  category: string;
  active: boolean;
  created_at: Date;
}

export interface User {
  id: string;
  username: string;
  password_hash: string;
  created_at: Date;
  updated_at: Date;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  total_pages: number;
}

export interface ApiError {
  error: string;
  details?: string;
}

export interface FeedRefreshResult {
  source_id: string;
  source_name: string;
  success: boolean;
  new_articles: number;
  error?: string;
  elapsed_ms: number;
}

export interface RefreshSummary {
  total_sources: number;
  successful: number;
  failed: number;
  total_new_articles: number;
  total_elapsed_ms: number;
  results: FeedRefreshResult[];
  articles_deleted: number;
}

export interface Stats {
  total_articles: number;
  total_sources: number;
  last_refresh?: Date;
}

export type Category =
  | "Technology"
  | "Cybersecurity"
  | "World News"
  | "Business and Finance"
  | "Science"
  | "Programming"
  | "Infrastructure and DevOps"
  | "AI and Machine Learning";

export interface RSSSourceConfig {
  name: string;
  url: string;
  category: Category;
}
