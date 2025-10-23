"use client";

import { useState, useEffect } from "react";
import { Article, PaginatedResponse } from "@/types";
import { formatDistanceToNow } from "date-fns";

export default function FeedPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [localSearch, setLocalSearch] = useState("");
  const [category, setCategory] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => setSearch(localSearch), 400);
    return () => clearTimeout(timer);
  }, [localSearch]);

  useEffect(() => {
    fetchArticles();
  }, [search, category, page]);

  async function fetchArticles() {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: "20",
        ...(search && { search }),
        ...(category && { category }),
      });

      const res = await fetch(`/api/articles?${params}`);
      const data: PaginatedResponse<Article> = await res.json();

      setArticles(data.items);
      setTotalPages(data.total_pages);
      setTotal(data.total);
    } catch (error) {
      console.error("Failed to fetch articles:", error);
    } finally {
      setLoading(false);
    }
  }

  const categories = [
    "Technology",
    "Cybersecurity",
    "World News",
    "Business and Finance",
    "Science",
    "Programming",
    "Infrastructure and DevOps",
    "AI and Machine Learning",
  ];

  const categoryColors: Record<string, string> = {
    Technology: "#3b82f6",
    Cybersecurity: "#ef4444",
    "World News": "#a855f7",
    "Business and Finance": "#10b981",
    Science: "#06b6d4",
    Programming: "#f59e0b",
    "Infrastructure and DevOps": "#f97316",
    "AI and Machine Learning": "#ec4899",
  };

  return (
    <div style={{ minHeight: "100vh", position: "relative" }}>
      {/* Background grid */}
      <div className="bg-grid" style={{ position: "fixed", inset: 0, opacity: 0.4, pointerEvents: "none" }} />

      {/* Header */}
      <header
        className="glass"
        style={{
          position: "sticky",
          top: 0,
          zIndex: 40,
          borderBottom: "1px solid var(--border-primary)",
        }}
      >
        <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "1.5rem 1rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
            <div>
              <h1 className="gradient-text" style={{ fontSize: "2rem", fontWeight: "bold", marginBottom: "0.25rem" }}>
                FeedCentral
              </h1>
              <p style={{ fontSize: "0.875rem", color: "var(--text-tertiary)" }}>
                {total.toLocaleString()} articles • Live feed
              </p>
            </div>
            <a
              href="/admin/login"
              style={{
                padding: "0.5rem 1rem",
                fontSize: "0.875rem",
                color: "var(--text-secondary)",
                borderRadius: "0.5rem",
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "var(--bg-tertiary)";
                e.currentTarget.style.color = "var(--text-primary)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "transparent";
                e.currentTarget.style.color = "var(--text-secondary)";
              }}
            >
              Admin
            </a>
          </div>

          <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
            {/* Search */}
            <input
              type="text"
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              placeholder="Search articles..."
              style={{
                flex: 1,
                minWidth: "250px",
                padding: "0.75rem 1rem",
                background: "var(--bg-secondary)",
                border: "1px solid var(--border-primary)",
                borderRadius: "0.75rem",
                color: "var(--text-primary)",
                fontSize: "0.875rem",
                outline: "none",
                transition: "all 0.2s",
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = "var(--accent-blue)";
                e.currentTarget.style.boxShadow = "0 0 0 3px rgba(59, 130, 246, 0.1)";
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = "var(--border-primary)";
                e.currentTarget.style.boxShadow = "none";
              }}
            />

            {/* Category filter */}
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              style={{
                padding: "0.75rem 1rem",
                background: "var(--bg-secondary)",
                border: "1px solid var(--border-primary)",
                borderRadius: "0.75rem",
                color: "var(--text-primary)",
                fontSize: "0.875rem",
                outline: "none",
                minWidth: "200px",
                cursor: "pointer",
              }}
            >
              <option value="">All Categories</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main style={{ maxWidth: "1280px", margin: "0 auto", padding: "2rem 1rem", position: "relative" }}>
        {loading ? (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))", gap: "1.5rem" }}>
            {[...Array(6)].map((_, i) => (
              <div key={i} className="skeleton" style={{ height: "300px", borderRadius: "1rem" }} />
            ))}
          </div>
        ) : articles.length === 0 ? (
          <div style={{ textAlign: "center", padding: "4rem 0" }}>
            <p style={{ fontSize: "1.125rem", color: "var(--text-tertiary)" }}>No articles found</p>
          </div>
        ) : (
          <>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))", gap: "1.5rem" }}>
              {articles.map((article, index) => (
                <article
                  key={article.id}
                  className="card-glow fade-in"
                  style={{
                    background: "var(--bg-secondary)",
                    border: "1px solid var(--border-primary)",
                    borderRadius: "1rem",
                    padding: "1.5rem",
                    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                    animationDelay: `${index * 50}ms`,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-4px)";
                    e.currentTarget.style.borderColor = "var(--border-secondary)";
                    e.currentTarget.style.boxShadow = "0 20px 40px rgba(0, 0, 0, 0.3)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.borderColor = "var(--border-primary)";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "1rem", position: "relative" }}>
                    <span
                      style={{
                        fontSize: "0.75rem",
                        fontWeight: 600,
                        padding: "0.375rem 0.75rem",
                        borderRadius: "9999px",
                        background: `${categoryColors[article.category] || "#6b7280"}20`,
                        color: categoryColors[article.category] || "#9ca3af",
                        border: `1px solid ${categoryColors[article.category] || "#6b7280"}40`,
                      }}
                    >
                      {article.category}
                    </span>
                    <time style={{ fontSize: "0.75rem", color: "var(--text-tertiary)" }}>
                      {formatDistanceToNow(new Date(article.pub_date), { addSuffix: true })}
                    </time>
                  </div>

                  <h3 style={{ fontSize: "1.25rem", fontWeight: "bold", marginBottom: "0.75rem", lineHeight: 1.3, position: "relative" }}>
                    <a
                      href={article.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ color: "var(--text-primary)", textDecoration: "none", transition: "color 0.2s" }}
                      onMouseEnter={(e) => (e.currentTarget.style.color = "var(--accent-blue)")}
                      onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-primary)")}
                    >
                      {article.title}
                    </a>
                  </h3>

                  {article.description && (
                    <div
                      style={{
                        fontSize: "0.875rem",
                        color: "var(--text-secondary)",
                        marginBottom: "1rem",
                        display: "-webkit-box",
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                        position: "relative",
                      }}
                      dangerouslySetInnerHTML={{ __html: article.description }}
                    />
                  )}

                  <div style={{ display: "flex", justifyContent: "space-between", paddingTop: "1rem", borderTop: "1px solid var(--border-primary)", position: "relative" }}>
                    <span style={{ fontSize: "0.75rem", color: "var(--text-tertiary)" }}>{article.source_name}</span>
                    <a
                      href={article.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ fontSize: "0.875rem", color: "var(--accent-blue)", textDecoration: "none", fontWeight: 500 }}
                    >
                      Read more →
                    </a>
                  </div>
                </article>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "1rem", marginTop: "3rem" }}>
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  style={{
                    padding: "0.75rem 1.5rem",
                    background: "var(--bg-secondary)",
                    border: "1px solid var(--border-primary)",
                    borderRadius: "0.5rem",
                    color: "var(--text-primary)",
                    cursor: page === 1 ? "not-allowed" : "pointer",
                    opacity: page === 1 ? 0.5 : 1,
                  }}
                >
                  Previous
                </button>
                <span style={{ color: "var(--text-tertiary)" }}>
                  Page {page} of {totalPages}
                </span>
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  style={{
                    padding: "0.75rem 1.5rem",
                    background: "var(--bg-secondary)",
                    border: "1px solid var(--border-primary)",
                    borderRadius: "0.5rem",
                    color: "var(--text-primary)",
                    cursor: page === totalPages ? "not-allowed" : "pointer",
                    opacity: page === totalPages ? 0.5 : 1,
                  }}
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
