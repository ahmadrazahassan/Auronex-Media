import { NextResponse } from "next/server";
import { createClient as createServerClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { slugify } from "@/lib/utils";

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
    const name = String(body.name || "").trim();
    const description = String(body.description || "").trim();

    if (!name) {
      return NextResponse.json({ error: "Category name is required." }, { status: 400 });
    }

    const admin = createAdminClient();
    const slug = slugify(name);
    const { data: counts } = await admin.from("categories").select("id");
    const sortOrder = (counts ?? []).length + 1;

    const { data, error } = await (admin.from("categories") as any)
      .insert({ name, slug, description: description || null, sort_order: sortOrder })
      .select("id")
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, id: (data as { id: string } | null)?.id ?? null });
  } catch {
    return NextResponse.json({ error: "Unable to create category." }, { status: 500 });
  }
}
