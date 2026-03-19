import { AdminCategoriesManager } from "@/components/admin/AdminCategoriesManager";
import { getAdminCategories } from "@/lib/queries";

export default async function AdminCategoriesPage() {
  const categories = await getAdminCategories();

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="font-display text-3xl font-bold tracking-tight text-[#0d1619]">Categories</h1>
        <p className="mt-2 text-sm text-[#5A6269]">Manage article categories and their ordering.</p>
      </div>
      <AdminCategoriesManager categories={categories} />
    </div>
  );
}