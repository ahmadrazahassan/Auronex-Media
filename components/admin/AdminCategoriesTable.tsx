import type { Category } from "@/types";

export function AdminCategoriesTable({ categories }: { categories: Category[] }) {
  return (
    <div className="bg-white rounded-2xl border border-[#E2DFD8] overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#F0EFEB] border-b border-[#E2DFD8]">
              <th className="font-semibold text-sm text-[#0d1619] px-6 py-4">Name</th>
              <th className="font-semibold text-sm text-[#0d1619] px-6 py-4">Slug</th>
              <th className="font-semibold text-sm text-[#0d1619] px-6 py-4">Description</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E2DFD8]">
            {categories.map((category) => (
              <tr key={category.id} className="hover:bg-[#FAF9F6] transition-colors">
                <td className="px-6 py-4 text-sm font-medium text-[#0d1619]">{category.name}</td>
                <td className="px-6 py-4 text-sm text-[#5A6269]">{category.slug}</td>
                <td className="px-6 py-4 text-sm text-[#5A6269]">{category.description || "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
