import { Article } from "@/types";
import { formatDistanceToNow } from "date-fns";

interface ArticleCardProps {
  article: Article;
  index: number;
}

export default function ArticleCard({ article, index }: ArticleCardProps) {
  const categoryColors: Record<string, string> = {
    Technology: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    Cybersecurity: "bg-red-500/10 text-red-400 border-red-500/20",
    "World News": "bg-purple-500/10 text-purple-400 border-purple-500/20",
    "Business and Finance": "bg-green-500/10 text-green-400 border-green-500/20",
    Science: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
    Programming: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
    "Infrastructure and DevOps": "bg-orange-500/10 text-orange-400 border-orange-500/20",
    "AI and Machine Learning": "bg-pink-500/10 text-pink-400 border-pink-500/20",
  };

  const colorClass = categoryColors[article.category] || "bg-gray-500/10 text-gray-400";

  return (
    <article
      className="group relative bg-gray-900/50 border border-gray-800 rounded-xl p-5 hover:bg-gray-900 hover:border-gray-700 transition-all duration-300"
      style={{
        animation: `fadeIn 0.4s ease-out ${index * 0.05}s both`,
      }}
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <span
          className={`text-xs px-2.5 py-1 rounded-full border font-medium ${colorClass}`}
        >
          {article.category}
        </span>
        <time className="text-xs text-gray-500">
          {formatDistanceToNow(new Date(article.pub_date), { addSuffix: true })}
        </time>
      </div>

      <h3 className="text-lg font-semibold text-white mb-2 line-clamp-2 group-hover:text-blue-400 transition-colors">
        {article.title}
      </h3>

      {article.description && (
        <p
          className="text-sm text-gray-400 line-clamp-3 mb-3"
          dangerouslySetInnerHTML={{ __html: article.description }}
        />
      )}

      <div className="flex items-center justify-between">
        <span className="text-xs text-gray-500">{article.source_name}</span>
        <a
          href={article.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-blue-400 hover:text-blue-300 flex items-center gap-1 group/link"
        >
          Read more
          <svg
            className="w-4 h-4 transition-transform group-hover/link:translate-x-0.5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </a>
      </div>
    </article>
  );
}
