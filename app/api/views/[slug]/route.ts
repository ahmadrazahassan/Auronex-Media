import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const resolvedParams = await params;
    const slug = resolvedParams.slug;
    const admin = createAdminClient();

    const { data, error: fetchError } = await admin
      .from("articles")
      .select("id, views")
      .eq("slug", slug)
      .single();

    const article = data as { id: string; views: number | null } | null;

    if (fetchError || !article) {
      return NextResponse.json({ error: "Article not found." }, { status: 404 });
    }

    const { error: updateError } = await (admin
      .from("articles") as any)
      .update({ views: (article.views ?? 0) + 1 })
      .eq("id", article.id);

    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Unable to increment view count." }, { status: 500 });
  }
}
