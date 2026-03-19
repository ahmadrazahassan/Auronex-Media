import { MOCK_ARTICLES } from "@/lib/mock";

interface RecentActivityProps {
  title: string;
  type: "articles" | "subscribers";
}

export function RecentActivity({ title, type }: RecentActivityProps) {
  const articles = MOCK_ARTICLES.slice(0, 5);
  
  return (
    <div className="bg-white/50 backdrop-blur-xl rounded-2xl border border-white/70 p-6 shadow-sm">
      <h3 className="font-display font-bold text-lg text-[#0d1619] mb-4">{title}</h3>
      
      {type === "articles" ? (
        <div className="flex flex-col gap-4">
          {articles.map((article) => (
            <div key={article.id} className="flex justify-between items-start border-b border-white/70 last:border-0 pb-4 last:pb-0">
              <div>
                <p className="text-sm font-medium text-[#0d1619] line-clamp-1">{article.title}</p>
                <p className="text-xs text-[#5A6269] mt-1">Published by {article.author_name}</p>
              </div>
              <span className="text-xs bg-white/50 border border-white/70 text-[#037aff] px-2 py-1 rounded-md font-medium whitespace-nowrap backdrop-blur-xl">
                {article.category.name}
              </span>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex justify-between items-center border-b border-white/70 last:border-0 pb-4 last:pb-0">
              <p className="text-sm font-medium text-[#0d1619]">subscriber{i}@example.com</p>
              <span className="text-xs text-[#5A6269]">Today</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
