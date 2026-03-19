export const SITE_NAME = "Auronex Media";
export const SITE_TAGLINE = "The UK small business finance newsroom.";
export const SITE_DESCRIPTION = "In-depth articles on accounting, payroll, tax, invoicing, and compliance — built for UK business owners who need real answers, not jargon.";

export const CATEGORIES = [
  { name: "Bookkeeping & Accounting", slug: "bookkeeping-accounting", description: "Day-to-day bookkeeping, chart of accounts, reconciliation, and accounting best practices." },
  { name: "Cloud Software", slug: "cloud-software", description: "Reviews, guides, and updates on cloud accounting and business software." },
  { name: "Invoicing & Payments", slug: "invoicing-payments", description: "Invoicing workflows, credit control, payment terms, and cash flow management." },
  { name: "Tax & Compliance", slug: "tax-compliance", description: "Making Tax Digital, VAT, Corporation Tax, HMRC deadlines, and regulatory compliance." },
  { name: "Payroll", slug: "payroll", description: "Processing payroll, PAYE, pensions, National Insurance, and statutory payments." },
  { name: "HR & People", slug: "hr-people", description: "Employment law, holiday entitlement, sickness, hiring, and managing your team." },
  { name: "Comparison", slug: "comparison", description: "Side-by-side comparisons of accounting software, payroll tools, and business services." },
];

export const NAV_LINKS = [
  { name: "Home", href: "/" },
  ...CATEGORIES.map((cat) => ({ name: cat.name, href: `/${cat.slug}` })),
  { name: "About", href: "/about" },
];
