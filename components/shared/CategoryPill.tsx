import Link from "next/link";
import { cn } from "@/lib/utils";

interface CategoryPillProps {
  name: string;
  slug: string;
  className?: string;
}

export function CategoryPill({ name, slug, className }: CategoryPillProps) {
  return (
    <Link 
      href={`/${slug}`}
      className={cn(
        "inline-block rounded-xl bg-[#EBF4FF] text-[#037aff] text-xs font-semibold px-3 py-1 hover:bg-[#D6E8FF] transition-colors",
        className
      )}
    >
      {name}
    </Link>
  );
}
