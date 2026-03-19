export function StatsCards() {
  const stats = [
    { label: "Total Articles", value: "124", trend: "+3 this week" },
    { label: "Published", value: "118", trend: "95% completion" },
    { label: "Total Views", value: "45.2k", trend: "+12% this month" },
    { label: "Subscribers", value: "2,841", trend: "+54 this week" },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat) => (
        <div key={stat.label} className="bg-white rounded-2xl border border-[#E2DFD8] p-6 shadow-sm">
          <p className="text-sm font-medium text-[#5A6269]">{stat.label}</p>
          <p className="font-display font-bold text-3xl text-[#0d1619] mt-2">{stat.value}</p>
          <p className="text-xs text-[#037aff] mt-2 font-medium">{stat.trend}</p>
        </div>
      ))}
    </div>
  );
}
