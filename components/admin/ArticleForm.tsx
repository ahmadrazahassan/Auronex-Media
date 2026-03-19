"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { CATEGORIES } from "@/lib/constants";
import { toast } from "sonner";
import { ArticleEditor } from "./ArticleEditor";

export function ArticleForm({ initialData = null }: { initialData?: any }) {
  const router = useRouter();
  const [title, setTitle] = useState(initialData?.title || "");
  const [excerpt, setExcerpt] = useState(initialData?.excerpt || "");
  const [content, setContent] = useState(initialData?.content || "");
  const [category, setCategory] = useState(initialData?.category?.slug || CATEGORIES[0].slug);
  const [featured, setFeatured] = useState(Boolean(initialData?.featured));
  const [authorName, setAuthorName] = useState(initialData?.author_name || "Editorial Team");
  const [thumbnailUrl, setThumbnailUrl] = useState(initialData?.thumbnail_url || "");
  const [tags, setTags] = useState(Array.isArray(initialData?.tags) ? initialData.tags.map((tag: { name: string }) => tag.name).join(", ") : "");
  const [metaTitle, setMetaTitle] = useState(initialData?.meta_title || "");
  const [metaDescription, setMetaDescription] = useState(initialData?.meta_description || "");
  const [publishedAt, setPublishedAt] = useState(initialData?.published_at ? new Date(initialData.published_at).toISOString().slice(0, 16) : new Date().toISOString().slice(0, 16));
  const [loading, setLoading] = useState<"draft" | "published" | null>(null);
  const [uploadingThumbnail, setUploadingThumbnail] = useState(false);

  async function handleThumbnailUpload(file: File) {
    setUploadingThumbnail(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("/api/admin/upload-thumbnail", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();
      if (!response.ok) {
        toast.error(result.error || "Unable to upload thumbnail.");
        setUploadingThumbnail(false);
        return;
      }

      setThumbnailUrl(result.url);
      toast.success("Thumbnail uploaded.");
    } catch {
      toast.error("Unable to upload thumbnail.");
    } finally {
      setUploadingThumbnail(false);
    }
  }

  const handleSubmit = async (e: React.FormEvent, status: "draft" | "published") => {
    e.preventDefault();
    setLoading(status);

    const payload = {
      title,
      excerpt,
      content,
      category,
      featured,
      author_name: authorName,
      thumbnail_url: thumbnailUrl || null,
      tags: tags.split(",").map((tag: string) => tag.trim()).filter(Boolean),
      meta_title: metaTitle,
      meta_description: metaDescription,
      published_at: publishedAt ? new Date(publishedAt).toISOString() : null,
      status,
    };

    const endpoint = initialData?.id ? `/api/admin/articles/${initialData.id}` : "/api/admin/articles";
    const method = initialData?.id ? "PUT" : "POST";

    try {
      const response = await fetch(endpoint, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!response.ok) {
        toast.error(result.error || "Unable to save article.");
        setLoading(null);
        return;
      }

      toast.success(status === "published" ? "Article published." : "Draft saved.");
      router.push("/admin/articles");
      router.refresh();
    } catch {
      toast.error("Unable to save article.");
      setLoading(null);
    }
  };

  return (
    <form onSubmit={(e) => handleSubmit(e, "published")} className="flex flex-col gap-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 rounded-[26px] border border-white/80 bg-[#F3EFE8] p-6 shadow-[0_10px_24px_rgba(13,22,25,0.04),inset_0_1px_0_rgba(255,255,255,0.82)]">
        <div>
          <h2 className="font-display font-bold text-xl text-[#0d1619]">
            {initialData ? "Edit Article" : "New Article"}
          </h2>
          <p className="mt-1 text-sm text-[#5A6269]">
            {initialData ? "Update the content and settings for this article." : "Create a new article for the newsroom."}
          </p>
        </div>
        <div className="flex gap-3">
          <button type="button" disabled={loading !== null} onClick={(e) => handleSubmit(e, "draft")} className="inline-flex h-10 items-center justify-center gap-2 whitespace-nowrap rounded-[14px] border border-[#D9D4CB] bg-white px-5 text-[15px] font-medium text-[#0d1619] shadow-[0_1px_2px_rgba(13,22,25,0.04),inset_0_1px_0_rgba(255,255,255,0.9)] transition-all hover:border-[#CFC8BD] hover:bg-[#FDFCFB] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#037aff]/20 disabled:opacity-50 active:translate-y-[1px]">
            Save Draft
          </button>
          <button type="submit" disabled={loading !== null} className="inline-flex h-10 items-center justify-center gap-2 whitespace-nowrap rounded-[14px] bg-[#037aff] px-5 text-[15px] font-medium text-white shadow-[0_4px_14px_rgba(3,122,255,0.25),inset_0_1px_0_rgba(255,255,255,0.25)] transition-all hover:bg-[#0266D6] hover:shadow-[0_6px_20px_rgba(3,122,255,0.35),inset_0_1px_0_rgba(255,255,255,0.25)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#037aff]/20 disabled:opacity-50 active:translate-y-[1px]">
            {loading === "published" ? "Publishing..." : "Publish"}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content Area */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <div className="flex flex-col gap-4 rounded-[26px] border border-white/80 bg-[#F3EFE8] p-6 shadow-[0_10px_24px_rgba(13,22,25,0.04),inset_0_1px_0_rgba(255,255,255,0.82)]">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-[#0d1619]">Title</label>
              <input 
                type="text" 
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full rounded-2xl border border-white/80 bg-white/75 px-4 py-3 text-lg font-display shadow-[inset_0_1px_0_rgba(255,255,255,0.85)] outline-none transition-all placeholder:text-[#A0A8B0] focus:border-[#037aff] focus:bg-white focus:ring-4 focus:ring-[#037aff]/10"
                placeholder="Enter article title..."
                required
              />
            </div>
            
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-[#0d1619]">Excerpt</label>
              <textarea 
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                rows={3}
                className="w-full rounded-2xl border border-white/80 bg-white/75 px-4 py-3 text-sm shadow-[inset_0_1px_0_rgba(255,255,255,0.85)] outline-none transition-all resize-none placeholder:text-[#A0A8B0] focus:border-[#037aff] focus:bg-white focus:ring-4 focus:ring-[#037aff]/10"
                placeholder="2-3 sentence summary..."
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-[#0d1619]">Author name</label>
              <input
                type="text"
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
                className="w-full rounded-2xl border border-white/80 bg-white/75 px-4 py-3 text-sm shadow-[inset_0_1px_0_rgba(255,255,255,0.85)] outline-none transition-all placeholder:text-[#A0A8B0] focus:border-[#037aff] focus:bg-white focus:ring-4 focus:ring-[#037aff]/10"
                placeholder="Editorial Team"
              />
            </div>
          </div>

          <div className="flex flex-col gap-4 rounded-[26px] border border-white/80 bg-[#F3EFE8] p-6 shadow-[0_10px_24px_rgba(13,22,25,0.04),inset_0_1px_0_rgba(255,255,255,0.82)] min-h-[500px]">
            <label className="text-sm font-medium text-[#0d1619]">Content</label>
            <div className="flex-grow rounded-2xl border border-white/80 bg-white/75 shadow-[inset_0_1px_0_rgba(255,255,255,0.85)] transition-all focus-within:border-[#037aff] focus-within:bg-white focus-within:ring-4 focus-within:ring-[#037aff]/10 overflow-hidden">
              <ArticleEditor content={content} onChange={setContent} />
            </div>
          </div>
        </div>

        {/* Sidebar Settings */}
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-4 rounded-[26px] border border-white/80 bg-[#F3EFE8] p-6 shadow-[0_10px_24px_rgba(13,22,25,0.04),inset_0_1px_0_rgba(255,255,255,0.82)]">
            <h3 className="font-display font-bold text-[#0d1619]">Settings</h3>
            
            <div className="flex items-center gap-3 pb-3 border-b border-white/80">
              <input type="checkbox" id="featured" checked={featured} onChange={(e) => setFeatured(e.target.checked)} className="h-5 w-5 rounded-md border-[#D9D4CB] text-[#037aff] focus:ring-[#037aff] focus:ring-offset-0" />
              <label htmlFor="featured" className="text-sm font-medium text-[#0d1619] cursor-pointer">Feature this article</label>
            </div>

            <div className="flex flex-col gap-1.5 mt-1">
              <label className="text-sm font-medium text-[#0d1619]">Publish Date</label>
              <input 
                type="datetime-local" 
                value={publishedAt}
                onChange={(e) => setPublishedAt(e.target.value)}
                className="w-full rounded-2xl border border-white/80 bg-white/75 px-4 py-3 text-sm shadow-[inset_0_1px_0_rgba(255,255,255,0.85)] outline-none transition-all focus:border-[#037aff] focus:bg-white focus:ring-4 focus:ring-[#037aff]/10"
              />
            </div>
            
            <div className="flex flex-col gap-1.5 mt-2">
              <label className="text-sm font-medium text-[#0d1619]">Category</label>
              <select 
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full rounded-2xl border border-white/80 bg-white/75 px-4 py-3 text-sm shadow-[inset_0_1px_0_rgba(255,255,255,0.85)] outline-none transition-all appearance-none focus:border-[#037aff] focus:bg-white focus:ring-4 focus:ring-[#037aff]/10"
              >
                {CATEGORIES.map(cat => (
                  <option key={cat.slug} value={cat.slug}>{cat.name}</option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-1.5 mt-2">
              <label className="text-sm font-medium text-[#0d1619]">Thumbnail URL</label>
              <div className="flex flex-col gap-3">
                <input
                  type="text"
                  value={thumbnailUrl}
                  onChange={(e) => setThumbnailUrl(e.target.value)}
                  className="w-full rounded-2xl border border-white/80 bg-white/75 px-4 py-3 text-sm shadow-[inset_0_1px_0_rgba(255,255,255,0.85)] outline-none transition-all placeholder:text-[#A0A8B0] focus:border-[#037aff] focus:bg-white focus:ring-4 focus:ring-[#037aff]/10"
                  placeholder="https://example.com/image.png"
                />
                
                <div className="text-center">
                  <span className="text-xs font-medium uppercase tracking-wider text-[#A0A8B0]">OR UPLOAD FILE</span>
                </div>

                <label className="flex cursor-pointer flex-col items-center gap-2 rounded-2xl border-2 border-dashed border-[#D9D4CB] bg-white/50 p-6 text-center transition-colors hover:bg-white">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#A0A8B0]">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="17 8 12 3 7 8" />
                    <line x1="12" x2="12" y1="3" y2="15" />
                  </svg>
                  <span className="text-sm font-medium text-[#5A6269] mt-2">{uploadingThumbnail ? "Uploading..." : "Click to upload"}</span>
                  <span className="text-xs text-[#A0A8B0]">SVG, PNG, JPG or GIF</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        void handleThumbnailUpload(file);
                      }
                    }}
                  />
                </label>
              </div>
              
              {thumbnailUrl ? (
                <div className="relative w-full aspect-video rounded-xl overflow-hidden border border-[#D9D4CB] mt-2 bg-[#F0EFEB]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img 
                    src={thumbnailUrl} 
                    alt="Thumbnail preview" 
                    className="object-cover w-full h-full"
                    onError={(e) => {
                      e.currentTarget.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%23A0A8B0' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Crect width='18' height='18' x='3' y='3' rx='2' ry='2'/%3E%3Ccircle cx='9' cy='9' r='2'/%3E%3Cpath d='m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21'/%3E%3C/svg%3E";
                      e.currentTarget.className = "object-none w-full h-full p-8 opacity-50";
                    }}
                  />
                </div>
              ) : null}
            </div>

            <div className="flex flex-col gap-1.5 mt-2">
              <label className="text-sm font-medium text-[#0d1619]">Tags</label>
              <input
                type="text"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                className="w-full rounded-2xl border border-white/80 bg-white/75 px-4 py-3 text-sm shadow-[inset_0_1px_0_rgba(255,255,255,0.85)] outline-none transition-all placeholder:text-[#A0A8B0] focus:border-[#037aff] focus:bg-white focus:ring-4 focus:ring-[#037aff]/10"
                placeholder="tax, payroll, software"
              />
              <span className="text-xs text-[#5A6269]">Separate tags with commas.</span>
            </div>

            <div className="flex flex-col gap-1.5 mt-2">
              <label className="text-sm font-medium text-[#0d1619]">Meta title</label>
              <input
                type="text"
                value={metaTitle}
                onChange={(e) => setMetaTitle(e.target.value)}
                className="w-full rounded-2xl border border-white/80 bg-white/75 px-4 py-3 text-sm shadow-[inset_0_1px_0_rgba(255,255,255,0.85)] outline-none transition-all placeholder:text-[#A0A8B0] focus:border-[#037aff] focus:bg-white focus:ring-4 focus:ring-[#037aff]/10"
                placeholder="SEO title override"
              />
            </div>

            <div className="flex flex-col gap-1.5 mt-2">
              <label className="text-sm font-medium text-[#0d1619]">Meta description</label>
              <textarea
                value={metaDescription}
                onChange={(e) => setMetaDescription(e.target.value)}
                rows={4}
                className="w-full rounded-2xl border border-white/80 bg-white/75 px-4 py-3 text-sm shadow-[inset_0_1px_0_rgba(255,255,255,0.85)] outline-none transition-all resize-none placeholder:text-[#A0A8B0] focus:border-[#037aff] focus:bg-white focus:ring-4 focus:ring-[#037aff]/10"
                placeholder="SEO description override"
              />
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
