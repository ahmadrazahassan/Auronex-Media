import { ArticleForm } from "@/components/admin/ArticleForm";
import { getAdminArticleById } from "@/lib/queries";
import { notFound } from "next/navigation";

export default async function EditArticlePage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const article = await getAdminArticleById(resolvedParams.id);
  
  if (!article) {
    notFound();
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-2 text-sm text-[#5A6269] mb-2">
        <a href="/admin/articles" className="hover:text-[#0d1619]">Articles</a>
        <span>/</span>
        <span className="text-[#0d1619] font-medium">Edit Article</span>
      </div>
      <ArticleForm initialData={article} />
    </div>
  );
}
