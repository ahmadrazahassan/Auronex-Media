import type { Category } from "@/types";

export function AdminCategoriesTable({ categories }: { categories: Category[] }) {
  return (
    <div className="bg-white/50 backdrop-blur-xl rounded-2xl border border-white/70 overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-white/60 border-b border-white/70">
              <th className="font-semibold text-sm text-[#0d1619] px-6 py-4">Name</th>
              <th className="font-semibold text-sm text-[#0d1619] px-6 py-4">Slug</th>
              <th className="font-semibold text-sm text-[#0d1619] px-6 py-4">Description</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/70">
            {categories.map((category) => (
              <tr key={category.id} className="hover:bg-white/60 transition-colors">
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
