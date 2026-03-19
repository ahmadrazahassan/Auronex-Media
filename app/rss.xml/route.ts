import { SITE_NAME, SITE_DESCRIPTION } from "@/lib/constants";
import { getLatestArticles } from "@/lib/queries";

export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://smallbizdesk.co.uk";
  const articles = await getLatestArticles(50);
  
  const rssXml = `<?xml version="1.0" encoding="UTF-8" ?>
  <rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
    <channel>
      <title>${SITE_NAME}</title>
      <link>${baseUrl}</link>
      <description>${SITE_DESCRIPTION}</description>
      <atom:link href="${baseUrl}/rss.xml" rel="self" type="application/rss+xml" />
      <language>en</language>
      <pubDate>${new Date().toUTCString()}</pubDate>
      ${articles.map((article) => `
        <item>
          <title><![CDATA[${article.title}]]></title>
          <link>${baseUrl}/${article.category?.slug || "bookkeeping-accounting"}/${article.slug}</link>
          <guid>${baseUrl}/${article.category?.slug || "bookkeeping-accounting"}/${article.slug}</guid>
          <pubDate>${new Date(article.published_at || article.created_at).toUTCString()}</pubDate>
          <description><![CDATA[${article.excerpt || ""}]]></description>
        </item>
      `).join("")}
    </channel>
  </rss>`;

  return new Response(rssXml, {
    headers: {
      "Content-Type": "text/xml",
    },
  });
}
