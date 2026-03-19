import { MetadataRoute } from 'next';
import { getCategories, getLatestArticles } from '@/lib/queries';

export default async function Sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://auronexmedia.com";
  const [categories, articles] = await Promise.all([getCategories(), getLatestArticles(500)]);

  // Base routes
  const routes = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
  ];

  // Category routes
  const categoryRoutes = categories.map((cat) => ({
    url: `${baseUrl}/${cat.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  // Article routes
  const articleRoutes = articles.map((article) => ({
    url: `${baseUrl}/${article.category?.slug || 'bookkeeping-accounting'}/${article.slug}`,
    lastModified: new Date(article.published_at || article.updated_at),
    changeFrequency: 'yearly' as const,
    priority: 0.6,
  }));

  return [...routes, ...categoryRoutes, ...articleRoutes];
}
