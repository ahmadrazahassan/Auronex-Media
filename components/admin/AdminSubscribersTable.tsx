import { formatDate } from "@/lib/utils";
import type { Subscriber } from "@/types";

export function AdminSubscribersTable({ subscribers }: { subscribers: Subscriber[] }) {
  return (
    <div className="overflow-hidden rounded-[26px] border border-white/80 bg-[#F3EFE8] shadow-[0_10px_24px_rgba(13,22,25,0.04),inset_0_1px_0_rgba(255,255,255,0.82)]">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-white/80 bg-white/60">
              <th className="px-6 py-4 text-xs font-semibold uppercase tracking-[0.14em] text-[#7A838B]">Email</th>
              <th className="px-6 py-4 text-xs font-semibold uppercase tracking-[0.14em] text-[#7A838B]">Status</th>
              <th className="px-6 py-4 text-xs font-semibold uppercase tracking-[0.14em] text-[#7A838B]">Date Joined</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/70">
            {subscribers.map((subscriber) => (
              <tr key={subscriber.id} className="transition-colors hover:bg-white/45">
                <td className="px-6 py-4 text-sm font-medium text-[#0d1619]">{subscriber.email}</td>
                <td className="px-6 py-4">
                  <span className={`rounded-full px-2.5 py-1 text-xs font-medium whitespace-nowrap ${subscriber.subscribed ? "border border-[#D7EEDA] bg-[#F4FBF5] text-[#2D7A39]" : "border border-[#F1E0BD] bg-[#FFF9EE] text-[#9A6B15]"}`}>
                    {subscriber.subscribed ? "Subscribed" : "Unsubscribed"}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-[#5A6269]">{formatDate(subscriber.created_at)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
