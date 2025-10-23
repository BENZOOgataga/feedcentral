import { Header } from "@/components/layout/header";
import { FeedItem } from "@/components/feed/feed-item";
import { EmptyState } from "@/components/feed/empty-state";

// Force dynamic rendering
export const dynamic = 'force-dynamic';
export const revalidate = 0;

interface Article {
  id: string;
  title: string;
  description: string;
  url: string;
  category: string;
  source_name: string;
  pub_date: string;
}

async function getArticles(): Promise<Article[]> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
    const res = await fetch(`${baseUrl}/api/articles?limit=20`, {
      cache: "no-store",
    });
    
    if (!res.ok) {
      return [];
    }
    
    const data = await res.json();
    return data.items || [];
  } catch (error) {
    console.error("Failed to fetch articles:", error);
    return [];
  }
}

export default async function DashboardPage() {
  const articles = await getArticles();

  return (
    <div className="flex flex-col min-h-screen">
      <Header 
        title="All Feeds" 
        description="Your curated RSS articles from trusted sources"
      />

      <div className="p-6">
        {articles.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 animate-in">
            {articles.map((article, index) => (
              <FeedItem
                key={article.id}
                id={article.id}
                title={article.title}
                description={article.description || ""}
                url={article.url}
                category={article.category}
                source={article.source_name}
                pubDate={article.pub_date}
                index={index}
              />
            ))}
          </div>
        ) : (
          <EmptyState
            title="No articles found"
            description="Check back later for new content from your RSS sources"
          />
        )}
      </div>
    </div>
  );
}
