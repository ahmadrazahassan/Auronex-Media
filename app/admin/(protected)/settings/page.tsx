import { getDashboardStats } from "@/lib/queries";

export default async function AdminSettingsPage() {
  const stats = await getDashboardStats();
  const envChecks = [
    { label: "NEXT_PUBLIC_SUPABASE_URL", ok: Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL) },
    { label: "NEXT_PUBLIC_SUPABASE_ANON_KEY", ok: Boolean(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) },
    { label: "SUPABASE_SERVICE_ROLE_KEY", ok: Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY) },
    { label: "NEXT_PUBLIC_SITE_URL", ok: Boolean(process.env.NEXT_PUBLIC_SITE_URL) },
  ];

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="font-display font-bold text-3xl text-[#0d1619]">Settings</h1>
        <p className="text-[#5A6269] mt-1">Backend health, environment configuration, and editorial system status.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="rounded-[26px] border border-white/70 bg-white/50 backdrop-blur-xl p-6 shadow-[0_10px_24px_rgba(13,22,25,0.04),inset_0_1px_0_rgba(255,255,255,0.85)]">
          <h2 className="font-display font-bold text-xl text-[#0d1619] mb-5">Environment Status</h2>
          <div className="flex flex-col gap-3">
            {envChecks.map((item) => (
              <div
                key={item.label}
                className="flex items-center justify-between rounded-2xl border border-white/70 bg-white/50 backdrop-blur-xl px-4 py-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.85)]"
              >
                <span className="text-sm text-[#0d1619] font-medium">{item.label}</span>
                <span
                  className={`rounded-full px-2.5 py-1 text-xs font-medium whitespace-nowrap backdrop-blur-xl ${
                    item.ok
                      ? "border border-[#DDEAFE] bg-white/50 text-[#037aff]"
                      : "border border-red-200 bg-white/50 text-red-600"
                  }`}
                >
                  {item.ok ? "Configured" : "Missing"}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[26px] border border-white/70 bg-white/50 backdrop-blur-xl p-6 shadow-[0_10px_24px_rgba(13,22,25,0.04),inset_0_1px_0_rgba(255,255,255,0.85)]">
          <h2 className="font-display font-bold text-xl text-[#0d1619] mb-5">Editorial System</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-2xl border border-white/70 bg-white/50 backdrop-blur-xl p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.85)]">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#7A838B]">Published</p>
              <p className="mt-2 font-display text-3xl font-bold text-[#0d1619]">{stats.publishedCount}</p>
            </div>
            <div className="rounded-2xl border border-white/70 bg-white/50 backdrop-blur-xl p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.85)]">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#7A838B]">Drafts</p>
              <p className="mt-2 font-display text-3xl font-bold text-[#0d1619]">{stats.draftCount}</p>
            </div>
            <div className="rounded-2xl border border-white/70 bg-white/50 backdrop-blur-xl p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.85)]">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#7A838B]">Categories</p>
              <p className="mt-2 font-display text-3xl font-bold text-[#0d1619]">{stats.categoryCount}</p>
            </div>
            <div className="rounded-2xl border border-white/70 bg-white/50 backdrop-blur-xl p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.85)]">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#7A838B]">Subscribers</p>
              <p className="mt-2 font-display text-3xl font-bold text-[#0d1619]">{stats.subscriberCount}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}