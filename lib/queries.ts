import "server-only";

import { cache } from "react";
import { createClient as createServerClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import type { ArticleWithCategory, Category, DashboardStats, Subscriber } from "@/types";

const articleSelect = `
  id,
  title,
  slug,
  excerpt,
  content,
  thumbnail_url,
  category_id,
  author_name,
  author_avatar,
  status,
  featured,
  read_time,
  views,
  meta_title,
  meta_description,
  published_at,
  created_at,
  updated_at,
  category:categories(id,name,slug,description)
`;

export const getCategories = cache(async (): Promise<Category[]> => {
  const supabase = await createServerClient();
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .order("sort_order", { ascending: true })
    .order("name", { ascending: true });

  if (error) throw error;
  return data ?? [];
});

export const getFeaturedArticles = cache(async (): Promise<ArticleWithCategory[]> => {
  const supabase = await createServerClient();
  const { data, error } = await supabase
    .from("articles")
    .select(articleSelect)
    .eq("status", "published")
    .eq("featured", true)
    .not("published_at", "is", null)
    .order("published_at", { ascending: false })
    .limit(2);

  if (error) throw error;

  if ((data ?? []).length >= 2) {
    return (data ?? []) as ArticleWithCategory[];
  }

  const fallback = await getLatestArticles(2);
  return fallback;
});

export const getLatestArticles = cache(async (limit = 10, excludeIds: string[] = []): Promise<ArticleWithCategory[]> => {
  const supabase = await createServerClient();
  let query = supabase
    .from("articles")
    .select(articleSelect)
    .eq("status", "published")
    .not("published_at", "is", null)
    .order("published_at", { ascending: false })
    .limit(limit);

  if (excludeIds.length > 0) {
    query = query.not("id", "in", `(${excludeIds.join(",")})`);
  }

  const { data, error } = await query;
  if (error) throw error;
  return (data ?? []) as ArticleWithCategory[];
});

export async function getHomepageCategorySections() {
  const categories = await getCategories();
  const supabase = await createServerClient();

  const sections = await Promise.all(
    categories.map(async (category) => {
      const { data, error } = await supabase
        .from("articles")
        .select(articleSelect)
        .eq("status", "published")
        .eq("category_id", category.id)
        .not("published_at", "is", null)
        .order("published_at", { ascending: false })
        .limit(4);

      if (error) throw error;

      return {
        category,
        articles: (data ?? []) as ArticleWithCategory[],
      };
    }),
  );

  return sections.filter((section) => section.articles.length > 0);
}

export async function getCategoryBySlug(slug: string) {
  const categories = await getCategories();
  return categories.find((category) => category.slug === slug) ?? null;
}

export async function getArticlesByCategorySlug(slug: string, limit = 50) {
  const supabase = await createServerClient();
  const category = await getCategoryBySlug(slug);
  if (!category) return { category: null, articles: [] as ArticleWithCategory[] };

  const { data, error } = await supabase
    .from("articles")
    .select(articleSelect)
    .eq("status", "published")
    .eq("category_id", category.id)
    .not("published_at", "is", null)
    .order("published_at", { ascending: false })
    .limit(limit);

  if (error) throw error;
  return { category, articles: (data ?? []) as ArticleWithCategory[] };
}

export async function getArticleByCategoryAndSlug(categorySlug: string, slug: string) {
  const supabase = await createServerClient();
  const { data, error } = await supabase
    .from("articles")
    .select(articleSelect)
    .eq("slug", slug)
    .eq("status", "published")
    .not("published_at", "is", null)
    .maybeSingle();

  if (error || !data) return null;
  const article = data as ArticleWithCategory;
  if (!article.category || article.category.slug !== categorySlug) return null;
  return article;
}

export async function getRelatedArticles(categoryId: string, articleId: string, limit = 3) {
  const supabase = await createServerClient();
  const { data, error } = await supabase
    .from("articles")
    .select(articleSelect)
    .eq("status", "published")
    .eq("category_id", categoryId)
    .neq("id", articleId)
    .not("published_at", "is", null)
    .order("published_at", { ascending: false })
    .limit(limit);

  if (error) throw error;
  return (data ?? []) as ArticleWithCategory[];
}

export async function getDashboardStats(): Promise<DashboardStats> {
  const admin = createAdminClient();
  const [published, drafts, categories, subscribers, views] = await Promise.all([
    admin.from("articles").select("id", { count: "exact", head: true }).eq("status", "published"),
    admin.from("articles").select("id", { count: "exact", head: true }).eq("status", "draft"),
    admin.from("categories").select("id", { count: "exact", head: true }),
    admin.from("subscribers").select("id", { count: "exact", head: true }),
    admin.from("articles").select("views"),
  ]);

  if (published.error) throw published.error;
  if (drafts.error) throw drafts.error;
  if (categories.error) throw categories.error;
  if (subscribers.error) throw subscribers.error;
  if (views.error) throw views.error;

  const viewRows = (views.data ?? []) as Array<{ views: number | null }>;

  return {
    publishedCount: published.count ?? 0,
    draftCount: drafts.count ?? 0,
    categoryCount: categories.count ?? 0,
    subscriberCount: subscribers.count ?? 0,
    totalViews: viewRows.reduce((sum, item) => sum + (item.views ?? 0), 0),
  };
}

export async function getAdminArticles(limit = 100) {
  const admin = createAdminClient();
  const { data, error } = await admin
    .from("articles")
    .select(articleSelect)
    .order("updated_at", { ascending: false })
    .limit(limit);

  if (error) throw error;
  return (data ?? []) as ArticleWithCategory[];
}

export async function getAdminArticleById(id: string) {
  const admin = createAdminClient();
  const { data, error } = await admin
    .from("articles")
    .select(articleSelect)
    .eq("id", id)
    .single();

  if (error) return null;

  const article = data as ArticleWithCategory;
  const { data: tagRows } = await admin
    .from("article_tags")
    .select("tag:tags(id,name,slug)")
    .eq("article_id", id);

  article.tags = (tagRows ?? [])
    .map((row: any) => row.tag)
    .filter(Boolean);

  return article;
}

export async function getAdminCategories(): Promise<Category[]> {
  const admin = createAdminClient();
  const { data, error } = await admin
    .from("categories")
    .select("*")
    .order("sort_order", { ascending: true })
    .order("name", { ascending: true });

  if (error) throw error;
  return data ?? [];
}

export async function getRecentSubscribers(limit = 10): Promise<Subscriber[]> {
  const admin = createAdminClient();
  const { data, error } = await admin
    .from("subscribers")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) throw error;
  return data ?? [];
}

export async function getAdminSubscribers(limit = 100): Promise<Subscriber[]> {
  return getRecentSubscribers(limit);
}
