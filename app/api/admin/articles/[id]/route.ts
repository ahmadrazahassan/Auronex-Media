import { NextResponse } from "next/server";
import { createClient as createServerClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { calculateReadTime, slugify } from "@/lib/utils";

async function syncTags(admin: ReturnType<typeof createAdminClient>, articleId: string, rawTags: string[]) {
  const tags = Array.from(new Set(rawTags.map((tag) => tag.trim()).filter(Boolean)));

  await (admin.from("article_tags") as any).delete().eq("article_id", articleId);

  if (tags.length === 0) {
    return;
  }

  const tagIds: string[] = [];

  for (const tagName of tags) {
    const slug = slugify(tagName);
    const { data: existingRow } = await admin.from("tags").select("id").eq("slug", slug).maybeSingle();
    let existing = existingRow as { id: string } | null;

    if (!existing) {
      const { data: insertedRow } = await (admin.from("tags") as any)
        .insert({ name: tagName, slug })
        .select("id")
        .single();
      existing = insertedRow as { id: string } | null;
    }

    if (existing?.id) tagIds.push(existing.id);
  }

  if (tagIds.length > 0) {
    await (admin.from("article_tags") as any).insert(tagIds.map((tagId) => ({ article_id: articleId, tag_id: tagId })));
  }
}

async function requireUser() {
  const supabase = await createServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return user ?? null;
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await requireUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const body = await request.json();
    const title = String(body.title || "").trim();
    const excerpt = String(body.excerpt || "").trim();
    const content = String(body.content || "").trim();
    const categorySlug = String(body.category || "").trim();
    const featured = Boolean(body.featured);
    const status = body.status === "published" ? "published" : "draft";
    const thumbnailUrl = body.thumbnail_url ? String(body.thumbnail_url).trim() : null;
    const metaTitle = body.meta_title ? String(body.meta_title).trim() : null;
    const metaDescription = body.meta_description ? String(body.meta_description).trim() : null;
    const authorName = body.author_name ? String(body.author_name).trim() : "Editorial Team";
    const rawTags = Array.isArray(body.tags) ? body.tags.map((tag: unknown) => String(tag)) : [];

    if (!title || !content || !categorySlug) {
      return NextResponse.json({ error: "Title, content, and category are required." }, { status: 400 });
    }

    const admin = createAdminClient();
    const { data: categoryData, error: categoryError } = await admin
      .from("categories")
      .select("id")
      .eq("slug", categorySlug)
      .single();

    const category = categoryData as { id: string } | null;

    if (categoryError || !category) {
      return NextResponse.json({ error: "Invalid category." }, { status: 400 });
    }

    const slug = slugify(title);
    const payload = {
      title,
      slug,
      excerpt: excerpt || null,
      content,
      thumbnail_url: thumbnailUrl,
      category_id: category.id,
      author_name: authorName || "Editorial Team",
      featured,
      status,
      read_time: calculateReadTime(content.replace(/<[^>]+>/g, " ")),
      meta_title: metaTitle,
      meta_description: metaDescription,
      updated_at: new Date().toISOString(),
      published_at: status === "published" ? new Date().toISOString() : null,
    };

    const { error } = await (admin.from("articles") as any).update(payload).eq("id", id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    await syncTags(admin, id, rawTags);

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Unable to update article." }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await requireUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const admin = createAdminClient();
    const { error } = await (admin.from("articles") as any).delete().eq("id", id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Unable to delete article." }, { status: 500 });
  }
}
