"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import type { Category } from "@/types";

export function AdminCategoriesManager({ categories }: { categories: Category[] }) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [editName, setEditName] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [deletingCategoryId, setDeletingCategoryId] = useState<string | null>(null);

  async function handleCreate(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);

    const response = await fetch("/api/admin/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, description }),
    });

    const result = await response.json();
    if (!response.ok) {
      toast.error(result.error || "Unable to create category.");
      setLoading(false);
      return;
    }

    toast.success("Category created.");
    setName("");
    setDescription("");
    router.refresh();
    setLoading(false);
  }

  async function handleDelete(id: string) {
    const response = await fetch(`/api/admin/categories/${id}`, { method: "DELETE" });
    const result = await response.json();
    if (!response.ok) {
      toast.error(result.error || "Unable to delete category.");
      return;
    }

    toast.success("Category deleted.");
    setDeletingCategoryId(null);
    router.refresh();
  }

  async function handleEditSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!editingCategory) return;

    const response = await fetch(`/api/admin/categories/${editingCategory.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: editName, description: editDescription }),
    });

    const result = await response.json();
    if (!response.ok) {
      toast.error(result.error || "Unable to update category.");
      return;
    }

    toast.success("Category updated.");
    setEditingCategory(null);
    router.refresh();
  }

  return (
    <div className="flex flex-col gap-6">
      <form onSubmit={handleCreate} className="bg-white rounded-2xl border border-[#E2DFD8] p-6 shadow-sm grid grid-cols-1 md:grid-cols-[1fr_2fr_auto] gap-4 items-end">
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-[#0d1619]">Name</label>
          <input value={name} onChange={(e) => setName(e.target.value)} className="bg-white border border-[#E2DFD8] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#037aff]/20 focus:border-[#037aff]" required />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-[#0d1619]">Description</label>
          <input value={description} onChange={(e) => setDescription(e.target.value)} className="bg-white border border-[#E2DFD8] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#037aff]/20 focus:border-[#037aff]" />
        </div>
        <button type="submit" disabled={loading} className="inline-flex h-[42px] items-center justify-center gap-2 whitespace-nowrap rounded-[12px] bg-[#037aff] px-5 text-[14px] font-medium text-white shadow-[0_2px_10px_rgba(3,122,255,0.2),inset_0_1px_0_rgba(255,255,255,0.2)] transition-all hover:bg-[#0266D6] hover:shadow-[0_4px_16px_rgba(3,122,255,0.3),inset_0_1px_0_rgba(255,255,255,0.2)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#037aff]/20 disabled:opacity-50 active:translate-y-[1px]">
          {loading ? "Adding..." : "Add Category"}
        </button>
      </form>

      <div className="overflow-hidden rounded-[26px] border border-white/80 bg-[#F3EFE8] shadow-[0_10px_24px_rgba(13,22,25,0.04),inset_0_1px_0_rgba(255,255,255,0.82)]">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/80 bg-white/60">
                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-[0.14em] text-[#7A838B]">Name</th>
                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-[0.14em] text-[#7A838B]">Slug</th>
                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-[0.14em] text-[#7A838B]">Description</th>
                <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-[0.14em] text-[#7A838B]">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/70">
              {categories.map((category) => (
                <tr key={category.id} className="transition-colors hover:bg-white/45">
                  <td className="px-6 py-4 text-sm font-medium text-[#0d1619]">{category.name}</td>
                  <td className="px-6 py-4">
                    <span className="rounded-full border border-[#DDEAFE] bg-[#F6F9FF] px-2.5 py-1 text-xs font-medium whitespace-nowrap text-[#037aff]">
                      {category.slug}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-[#5A6269]">{category.description || "—"}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setEditingCategory(category);
                          setEditName(category.name);
                          setEditDescription(category.description || "");
                        }}
                        className="p-2 text-[#5A6269] hover:text-[#037aff] hover:bg-[#EBF4FF] rounded-lg transition-colors"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <Dialog open={deletingCategoryId === category.id} onOpenChange={(open) => setDeletingCategoryId(open ? category.id : null)}>
                        <DialogTrigger render={<button type="button" className="p-2 text-[#5A6269] hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" />}>
                          <Trash2 className="w-4 h-4" />
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Delete category</DialogTitle>
                            <DialogDescription>
                              You can only delete categories that do not have articles assigned.
                            </DialogDescription>
                          </DialogHeader>
                          <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => setDeletingCategoryId(null)}>
                              Cancel
                            </Button>
                            <Button type="button" onClick={() => handleDelete(category.id)} className="bg-red-600 hover:bg-red-700 text-white">
                              Delete
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Dialog open={Boolean(editingCategory)} onOpenChange={(open) => !open && setEditingCategory(null)}>
        <DialogContent>
          <form onSubmit={handleEditSubmit} className="flex flex-col gap-4">
            <DialogHeader>
              <DialogTitle>Edit category</DialogTitle>
              <DialogDescription>
                Update the category name and description. The slug will refresh automatically.
              </DialogDescription>
            </DialogHeader>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-[#0d1619]">Name</label>
              <input value={editName} onChange={(e) => setEditName(e.target.value)} className="bg-white border border-[#E2DFD8] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#037aff]/20 focus:border-[#037aff]" required />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-[#0d1619]">Description</label>
              <input value={editDescription} onChange={(e) => setEditDescription(e.target.value)} className="bg-white border border-[#E2DFD8] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#037aff]/20 focus:border-[#037aff]" />
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setEditingCategory(null)}>
                Cancel
              </Button>
              <Button type="submit" className="bg-[#037aff] hover:bg-[#0260CC] text-white">
                Save changes
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
