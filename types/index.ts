export type ArticleStatus = "draft" | "published";

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  sort_order: number;
  created_at: string;
}

export interface Article {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  thumbnail_url: string | null;
  category_id: string | null;
  author_name: string | null;
  author_avatar: string | null;
  status: ArticleStatus;
  featured: boolean;
  read_time: number | null;
  views: number;
  meta_title: string | null;
  meta_description: string | null;
  published_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface Tag {
  id: string;
  name: string;
  slug: string;
}

export interface ArticleTag {
  article_id: string;
  tag_id: string;
}

export interface Subscriber {
  id: string;
  email: string;
  subscribed: boolean;
  created_at: string;
}

export interface ArticleWithCategory extends Article {
  category: Pick<Category, "id" | "name" | "slug" | "description"> | null;
  tags?: Tag[];
}

export interface DashboardStats {
  publishedCount: number;
  draftCount: number;
  categoryCount: number;
  subscriberCount: number;
  totalViews: number;
}

export interface Database {
  public: {
    Tables: {
      categories: {
        Row: Category;
        Insert: Partial<Omit<Category, "id" | "created_at">> & Pick<Category, "name" | "slug">;
        Update: Partial<Omit<Category, "id" | "created_at">>;
      };
      articles: {
        Row: Article;
        Insert: Partial<Omit<Article, "id" | "created_at" | "updated_at" | "views">> & Pick<Article, "title" | "slug" | "content">;
        Update: Partial<Omit<Article, "id" | "created_at" | "updated_at">>;
      };
      tags: {
        Row: Tag;
        Insert: Partial<Tag> & Pick<Tag, "name" | "slug">;
        Update: Partial<Omit<Tag, "id">>;
      };
      article_tags: {
        Row: ArticleTag;
        Insert: ArticleTag;
        Update: Partial<ArticleTag>;
      };
      subscribers: {
        Row: Subscriber;
        Insert: Partial<Omit<Subscriber, "id" | "created_at">> & Pick<Subscriber, "email">;
        Update: Partial<Omit<Subscriber, "id" | "created_at">>;
      };
    };
  };
}
