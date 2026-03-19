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

import { parse } from "node-html-parser";

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
    const htmlString = body.html;

    if (!htmlString || typeof htmlString !== "string") {
      return NextResponse.json({ error: "No HTML content provided." }, { status: 400 });
    }

    const admin = createAdminClient();
    const { data: categoryRows, error: categoryError } = await admin.from("categories").select("id, slug");
    if (categoryError) {
      return NextResponse.json({ error: categoryError.message }, { status: 500 });
    }
    const categoryMap = new Map((categoryRows ?? []).map((row: any) => [row.slug, row.id]));

    // Parse the HTML document
    const root = parse(htmlString);
    
    // Extract metadata from head or fallback to body content
    const title = root.querySelector("title")?.text?.trim() || root.querySelector("h1")?.text?.trim() || "Untitled Imported Article";
    
    const metaDescription = root.querySelector('meta[name="description"]')?.getAttribute("content")?.trim();
    let excerpt = metaDescription;
    if (!excerpt) {
      const firstParagraph = root.querySelector("p")?.text?.trim();
      excerpt = firstParagraph ? (firstParagraph.length > 150 ? firstParagraph.slice(0, 147) + "..." : firstParagraph) : "";
    }

    const metaCategory = root.querySelector('meta[name="category"]')?.getAttribute("content")?.trim() || "bookkeeping-accounting";
    const categoryId = categoryMap.get(metaCategory) || categoryMap.get("bookkeeping-accounting");

    const authorName = root.querySelector('meta[name="author"]')?.getAttribute("content")?.trim() || "Editorial Team";

    // Extract the main body content, preferring an <article> or <main> tag if present
    let contentElement = root.querySelector("article") || root.querySelector("main") || root.querySelector("body");
    
    // If we can't find specific tags, just use the whole HTML but stripped of head
    let content = "";
    if (contentElement) {
      content = contentElement.innerHTML.trim();
    } else {
      // Remove head if body isn't explicitly found
      const head = root.querySelector("head");
      if (head) {
        head.remove();
      }
      content = root.innerHTML.trim();
    }

    if (!title || !content || !categoryId) {
      return NextResponse.json({ error: `Invalid HTML structure. Could not extract necessary fields.` }, { status: 400 });
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

    const payload = [{
      title,
      slug,
      excerpt: excerpt || null,
      content,
      category_id: categoryId,
      featured: false,
      status: "draft",
      author_name: authorName,
      read_time: calculateReadTime(content.replace(/<[^>]+>/g, " ")),
      published_at: null,
    }];

    const { error } = await (admin.from("articles") as any).insert(payload);
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, inserted: payload.length });
  } catch {
    return NextResponse.json({ error: "Unable to import articles." }, { status: 500 });
  }
}
