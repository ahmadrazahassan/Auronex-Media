import { AdminSubscribersTable } from "@/components/admin/AdminSubscribersTable";
import { ExportSubscribersButton } from "@/components/admin/ExportSubscribersButton";
import { getAdminSubscribers } from "@/lib/queries";

export default async function AdminSubscribersPage() {
  const subscribers = await getAdminSubscribers();

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <h1 className="font-display text-3xl font-bold tracking-tight text-[#0d1619]">Subscribers</h1>
          <p className="mt-2 text-sm text-[#5A6269]">View and export your newsletter subscribers.</p>
        </div>
        <ExportSubscribersButton subscribers={subscribers} />
      </div>
      <AdminSubscribersTable subscribers={subscribers} />
    </div>
  );
}