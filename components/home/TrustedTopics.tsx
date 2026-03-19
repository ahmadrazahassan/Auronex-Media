export function TrustedTopics() {
  const topics = [
    "Making Tax Digital", "Cloud Accounting", "HMRC Penalties",
    "VAT Filing", "Payment Delays", "SSP Reforms 2026",
    "Digital Records", "Pension Duties", "Cash Flow",
    "Statutory Leave", "Sage Software", "Payroll Compliance"
  ];

  return (
    <section className="w-full bg-[#FAF9F6] py-12">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-xs uppercase tracking-[0.15em] font-semibold text-[#5A6269] text-center">
          Topics We Cover
        </h2>
        
        <div className="flex flex-wrap justify-center gap-3 mt-6">
          {topics.map((topic) => (
            <span 
              key={topic} 
              className="rounded-xl border border-[#E2DFD8] bg-white px-4 py-2 text-sm font-medium text-[#0d1619] cursor-default"
            >
              {topic}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
