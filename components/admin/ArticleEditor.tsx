"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import Youtube from "@tiptap/extension-youtube";
import { useState } from "react";
import type { EditorView } from "@tiptap/pm/view";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface ArticleEditorProps {
  content: string;
  onChange: (content: string) => void;
}

export function ArticleEditor({ content, onChange }: ArticleEditorProps) {
  const [isHtmlMode, setIsHtmlMode] = useState(false);

  const editor = useEditor({
    extensions: [
      // StarterKit already includes the Link extension by default; we disable it here
      // to avoid the TipTap warning about duplicate `link` extension names.
      StarterKit.configure({ link: false }),
      Link.configure({ 
        openOnClick: false,
        autolink: true,
        defaultProtocol: 'https'
      }),
      Image.configure({
        HTMLAttributes: {
          class: 'rounded-xl border border-[#E2DFD8] my-4 max-w-full h-auto bg-white',
        },
        allowBase64: true,
      }),
      Youtube.configure({
        HTMLAttributes: {
          class: 'w-full aspect-video rounded-xl border border-[#E2DFD8] my-4 bg-white',
        },
      }),
    ],
    content,
    immediatelyRender: false,
    editorProps: {
      handleDrop: function(view: EditorView, event: DragEvent) {
        if (!event.dataTransfer || !event.dataTransfer.files || !event.dataTransfer.files[0]) {
          return false;
        }

        const file = event.dataTransfer.files[0];
        
        if (file.type.startsWith('image/')) {
          event.preventDefault();
          uploadImage(file, view, event.clientX, event.clientY);
          return true;
        }

        return false;
      },
      handlePaste: function(view: EditorView, event: ClipboardEvent) {
        if (!event.clipboardData || !event.clipboardData.files || !event.clipboardData.files[0]) {
          return false;
        }

        const file = event.clipboardData.files[0];
        
        if (file.type.startsWith('image/')) {
          event.preventDefault();
          uploadImage(file, view);
          return true;
        }

        return false;
      }
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  async function uploadImage(file: File, view: EditorView, clientX?: number, clientY?: number) {
    const toastId = toast.loading("Processing image...");

    const insertImage = (src: string) => {
      // Insert the image at the cursor position or drop location
      if (clientX !== undefined && clientY !== undefined) {
        // Handle drop
        const pos = view.posAtCoords({ left: clientX, top: clientY });
        if (pos) {
          const node = view.state.schema.nodes.image.create({ src });
          const transaction = view.state.tr.insert(pos.pos, node);
          view.dispatch(transaction);
          return;
        }
      } else {
        // Handle paste (insert at cursor)
        const node = view.state.schema.nodes.image.create({ src });
        const transaction = view.state.tr.replaceSelectionWith(node);
        view.dispatch(transaction);
        return;
      }

      // Final fallback: insert at selection.
      const node = view.state.schema.nodes.image.create({ src });
      const transaction = view.state.tr.replaceSelectionWith(node);
      view.dispatch(transaction);
    };

    const fileToDataUrl = (f: File) => {
      const MAX_DATA_URL_CHARS = 1_600_000; // keep request payload small enough for `/api/admin/articles`

      // Best-effort: try to compress via canvas first, then fall back to raw base64.
      const fallbackToRaw = () =>
        new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(String(reader.result));
          reader.onerror = () => reject(new Error("Failed to read file"));
          reader.readAsDataURL(f);
        });

      // Canvas resizing doesn't work for SVG reliably.
      if (!f.type.startsWith("image/") || f.type === "image/svg+xml") {
        return fallbackToRaw();
      }

      return new Promise<string>((resolve, reject) => {
        try {
          const objectUrl = URL.createObjectURL(f);
          // Use the DOM Image constructor (avoid conflict with the imported Tiptap Image extension).
          const img = new globalThis.Image();
          img.onload = () => {
            try {
              // Strongly compress to keep the final `data:image/...` HTML small.
              const maxWidth = 1000;
              const maxHeight = 1000;
              const widthScale = img.width > maxWidth ? maxWidth / img.width : 1;
              const heightScale = img.height > maxHeight ? maxHeight / img.height : 1;
              const scale = Math.min(widthScale, heightScale, 1);

              const targetWidth = Math.max(1, Math.round(img.width * scale));
              const targetHeight = Math.max(1, Math.round(img.height * scale));

              const canvas = document.createElement("canvas");
              canvas.width = targetWidth;
              canvas.height = targetHeight;
              const ctx = canvas.getContext("2d");
              if (!ctx) throw new Error("Missing 2d context");

              ctx.drawImage(img, 0, 0, targetWidth, targetHeight);

              // Convert to WebP for smaller payloads. Then progressively lower quality
              // until we hit a rough string-size limit.
              const outType = "image/webp";
              const qualitySteps = [0.72, 0.6, 0.48, 0.36, 0.26, 0.2];
              let dataUrl = canvas.toDataURL(outType, qualitySteps[0]);

              for (const q of qualitySteps) {
                const candidate = canvas.toDataURL(outType, q);
                if (candidate.length <= MAX_DATA_URL_CHARS) {
                  dataUrl = candidate;
                  break;
                }
                dataUrl = candidate; // keep latest best-effort
              }

              URL.revokeObjectURL(objectUrl);
              resolve(dataUrl);
            } catch {
              URL.revokeObjectURL(objectUrl);
              fallbackToRaw().then(resolve).catch(reject);
            }
          };
          img.onerror = () => {
            URL.revokeObjectURL(objectUrl);
            fallbackToRaw().then(resolve).catch(reject);
          };
          img.src = objectUrl;
        } catch {
          fallbackToRaw().then(resolve).catch(reject);
        }
      });
    };

    try {
      // Insert immediately (no server upload) so clipboard paste always works.
      const dataUrl = await fileToDataUrl(file);
      insertImage(dataUrl);
      toast.success("Image inserted.", { id: toastId });
    } catch {
      try {
        // As a final fallback, still attempt base64 insertion.
        const dataUrl = await fileToDataUrl(file);
        insertImage(dataUrl);
        toast.success("Image inserted.", { id: toastId });
      } catch {
        toast.error("Failed to insert image", { id: toastId });
      }
    }
  }

  if (!editor) return null;

  return (
    <div className="flex flex-col border border-[#E2DFD8] rounded-xl overflow-hidden flex-grow bg-white">
      {/* Toolbar */}
      <div className="bg-[#FAF9F6] border-b border-[#E2DFD8] p-2 flex flex-wrap gap-2 items-center justify-between">
        <div className="flex gap-1">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={editor.isActive("bold") ? "bg-[#E2DFD8] text-black" : "text-[#5A6269]"}
            disabled={isHtmlMode}
          >
            <strong className="font-bold">B</strong>
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={editor.isActive("italic") ? "bg-[#E2DFD8] text-black" : "text-[#5A6269]"}
            disabled={isHtmlMode}
          >
            <em className="italic">I</em>
          </Button>
          <div className="w-px h-6 bg-[#E2DFD8] mx-1 my-auto" />
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            className={editor.isActive("heading", { level: 2 }) ? "bg-[#E2DFD8] text-black" : "text-[#5A6269]"}
            disabled={isHtmlMode}
          >
            H2
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
            className={editor.isActive("heading", { level: 3 }) ? "bg-[#E2DFD8] text-black" : "text-[#5A6269]"}
            disabled={isHtmlMode}
          >
            H3
          </Button>
          <div className="w-px h-6 bg-[#E2DFD8] mx-1 my-auto" />
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={editor.isActive("bulletList") ? "bg-[#E2DFD8] text-black" : "text-[#5A6269]"}
            disabled={isHtmlMode}
          >
            • List
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => {
              const url = window.prompt('URL');
              if (url) {
                editor.chain().focus().setLink({ href: url }).run();
              }
            }}
            className={editor.isActive("link") ? "bg-[#E2DFD8] text-black" : "text-[#5A6269]"}
            disabled={isHtmlMode}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
              <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
              <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
            </svg>
            Link
          </Button>
          <div className="w-px h-6 bg-[#E2DFD8] mx-1 my-auto" />
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => {
              const url = window.prompt('Image URL');
              if (url) {
                editor.chain().focus().setImage({ src: url }).run();
              }
            }}
            className="text-[#5A6269]"
            disabled={isHtmlMode}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
              <rect width="18" height="18" x="3" y="3" rx="2" ry="2"></rect>
              <circle cx="9" cy="9" r="2"></circle>
              <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"></path>
            </svg>
            Image
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => {
              const url = window.prompt('Youtube URL');
              if (url) {
                editor.chain().focus().setYoutubeVideo({ src: url }).run();
              }
            }}
            className="text-[#5A6269]"
            disabled={isHtmlMode}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
              <path d="M2.25 8.001c0-2.761 2.239-5 5-5h9.5c2.761 0 5 2.239 5 5v7.998c0 2.761-2.239 5-5 5h-9.5c-2.761 0-5-2.239-5-5V8.001Z"></path>
              <path d="m9.75 15.001 5.5-3-5.5-3v6Z"></path>
            </svg>
            Video
          </Button>
        </div>
        
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => setIsHtmlMode(!isHtmlMode)}
          className="text-xs h-8"
        >
          {isHtmlMode ? "Visual Editor" : "</> HTML"}
        </Button>
      </div>

      {/* Editor Area */}
      <div className="p-4 flex-grow min-h-[400px] cursor-text">
        {isHtmlMode ? (
          <textarea
            className="w-full h-full min-h-[400px] outline-none resize-none font-mono text-sm text-[#5A6269]"
            value={editor.getHTML()}
            onChange={(e) => {
              onChange(e.target.value);
              editor.commands.setContent(e.target.value);
            }}
          />
        ) : (
          <EditorContent editor={editor} className="prose prose-sm sm:prose-base max-w-none h-full outline-none article-content" />
        )}
      </div>
    </div>
  );
}
