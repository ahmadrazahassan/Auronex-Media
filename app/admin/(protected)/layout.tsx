import { redirect } from "next/navigation";
import { AdminTopbar } from "@/components/layout/AdminTopbar";
import { createClient } from "@/lib/supabase/server";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/admin/login");
  }

  return (
    <div className="min-h-screen bg-white">
      <AdminTopbar />
      <main className="px-4 pb-10 pt-6 md:px-6 md:pb-12 md:pt-8">
        <div className="relative mx-auto max-w-7xl rounded-[30px] border border-white/70 bg-white/50 p-5 shadow-[0_10px_30px_rgba(13,22,25,0.06),inset_0_1px_0_rgba(255,255,255,0.85)] backdrop-blur-xl md:p-8 lg:p-10">
          {children}
        </div>
      </main>
    </div>
  );
}
