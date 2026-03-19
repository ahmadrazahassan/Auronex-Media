import { NextResponse } from "next/server";
import { createClient as createServerClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { calculateReadTime, slugify } from "@/lib/utils";

interface BulkArticleInput {
  title: string;
  excerpt?: string;
  content: string;
  category: string;
  featured?: boolean;
  status?: "draft" | "published";
  author_name?: string;
}

async function requireUser() {
  const supabase = await createServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return user ?? null;
}

export async function POST(request: Request) {
  const user = await requireUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const articles = Array.isArray(body.articles) ? (body.articles as BulkArticleInput[]) : [];

    if (articles.length === 0) {
      return NextResponse.json({ error: "No articles provided." }, { status: 400 });
    }

    const admin = createAdminClient();
    const { data: categoryRows, error: categoryError } = await admin.from("categories").select("id, slug");
    if (categoryError) {
      return NextResponse.json({ error: categoryError.message }, { status: 500 });
    }

    const categoryMap = new Map((categoryRows ?? []).map((row: any) => [row.slug, row.id]));
    const payload: Record<string, unknown>[] = [];

    for (const article of articles) {
      const title = String(article.title || "").trim();
      const content = String(article.content || "").trim();
      const categorySlug = String(article.category || "").trim();
      const categoryId = categoryMap.get(categorySlug);

      if (!title || !content || !categoryId) {
        return NextResponse.json({ error: `Invalid article payload for \"${title || "Untitled"}\".` }, { status: 400 });
      }

      const baseSlug = slugify(title);
      let slug = baseSlug;
      let counter = 1;
      while (true) {
        const { data: existing } = await admin.from("articles").select("id").eq("slug", slug).maybeSingle();
        if (!existing) break;
        counter += 1;
        slug = `${baseSlug}-${counter}`;
      }

      const status = article.status === "published" ? "published" : "draft";
      payload.push({
        title,
        slug,
        excerpt: article.excerpt?.trim() || null,
        content,
        category_id: categoryId,
        featured: Boolean(article.featured),
        status,
        author_name: article.author_name?.trim() || "Editorial Team",
        read_time: calculateReadTime(content.replace(/<[^>]+>/g, " ")),
        published_at: status === "published" ? new Date().toISOString() : null,
      });
    }

    const { error } = await (admin.from("articles") as any).insert(payload);
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, inserted: payload.length });
  } catch {
    return NextResponse.json({ error: "Unable to import articles." }, { status: 500 });
  }
}
