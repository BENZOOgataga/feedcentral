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
    <div style={{ minHeight: "100vh", position: "relative", overflow: "hidden" }}>
      {/* Background grid */}
      <div className="bg-grid" style={{ position: "fixed", inset: 0, opacity: 0.3, pointerEvents: "none" }} />
      
      {/* Gradient orbs */}
      <div style={{
        position: "fixed",
        top: "-20%",
        right: "-10%",
        width: "50%",
        height: "50%",
        background: "radial-gradient(circle, rgba(59, 130, 246, 0.15), transparent 70%)",
        filter: "blur(60px)",
        pointerEvents: "none"
      }} />
      <div style={{
        position: "fixed",
        bottom: "-20%",
        left: "-10%",
        width: "50%",
        height: "50%",
        background: "radial-gradient(circle, rgba(168, 85, 247, 0.15), transparent 70%)",
        filter: "blur(60px)",
        pointerEvents: "none"
      }} />

      {/* Header */}
      <header
        className="glass"
        style={{
          position: "sticky",
          top: 0,
          zIndex: 50,
          borderBottom: "1px solid var(--border-primary)",
        }}
      >
        <div style={{ maxWidth: "1400px", margin: "0 auto", padding: "1rem 1.5rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
            <a href="/" style={{ textDecoration: "none" }}>
              <div className="gradient-text" style={{ fontSize: "1.5rem", fontWeight: "bold" }}>
                FeedCentral
              </div>
            </a>
            <nav style={{ display: "flex", gap: "2rem", alignItems: "center" }}>
              <div style={{ fontSize: "0.875rem", color: "var(--text-tertiary)" }}>
                {total.toLocaleString()} articles
              </div>
              <a href="/" style={{ color: "var(--text-secondary)", textDecoration: "none", transition: "color 0.2s" }}
                 onMouseEnter={(e) => e.currentTarget.style.color = "var(--text-primary)"}
                 onMouseLeave={(e) => e.currentTarget.style.color = "var(--text-secondary)"}>
                Home
              </a>
              <a href="/admin/login" style={{
                padding: "0.625rem 1.25rem",
                background: "linear-gradient(135deg, var(--accent-blue), var(--accent-purple))",
                color: "white",
                borderRadius: "0.5rem",
                textDecoration: "none",
                fontWeight: 500,
                fontSize: "0.875rem",
                transition: "transform 0.2s, box-shadow 0.2s"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow = "0 10px 30px rgba(59, 130, 246, 0.3)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "none";
              }}>
                Admin
              </a>
            </nav>
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
              {articles.map((article, index) => {
                const categoryColor = categoryColors[article.category] || "#6b7280";
                return (
                  <article
                    key={article.id}
                    className="card-elevated fade-in"
                    style={{
                      padding: "1.5rem",
                      animationDelay: `${index * 50}ms`,
                      cursor: "pointer"
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = categoryColor;
                      e.currentTarget.style.boxShadow = `0 8px 24px rgba(0, 0, 0, 0.5), 0 16px 48px rgba(0, 0, 0, 0.3)`;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = "var(--border-elevated)";
                      e.currentTarget.style.boxShadow = "0 4px 16px rgba(0, 0, 0, 0.4), 0 8px 32px rgba(0, 0, 0, 0.2)";
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
                      <div style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "0.5rem"
                      }}>
                        <div style={{
                          display: "inline-flex",
                          alignItems: "center",
                          justifyContent: "center",
                          width: "32px",
                          height: "32px",
                          borderRadius: "8px",
                          background: categoryColor,
                          fontSize: "0.875rem",
                          fontWeight: 700,
                          color: "white",
                          boxShadow: `0 2px 8px ${categoryColor}40`,
                          flexShrink: 0
                        }}>
                          {article.category.charAt(0)}
                        </div>
                        <span style={{
                          fontSize: "0.75rem",
                          fontWeight: 600,
                          color: "var(--text-secondary)"
                        }}>
                          {article.category}
                        </span>
                      </div>
                      <time style={{ fontSize: "0.75rem", color: "var(--text-tertiary)", fontWeight: 500 }}>
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
                );
              })}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "1rem", marginTop: "3rem" }}>
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  style={{
                    padding: "0.75rem 1.5rem",
                    background: page === 1 ? "var(--bg-tertiary)" : "var(--bg-elevated)",
                    border: "1px solid var(--border-elevated)",
                    borderRadius: "50px",
                    color: "var(--text-primary)",
                    cursor: page === 1 ? "not-allowed" : "pointer",
                    opacity: page === 1 ? 0.5 : 1,
                    fontWeight: 600,
                    fontSize: "0.875rem",
                    transition: "all 0.2s",
                    boxShadow: page === 1 ? "none" : "0 4px 12px rgba(0, 0, 0, 0.3)"
                  }}
                  onMouseEnter={(e) => {
                    if (page !== 1) {
                      e.currentTarget.style.transform = "translateY(-2px)";
                      e.currentTarget.style.boxShadow = "0 6px 16px rgba(0, 0, 0, 0.4)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = page === 1 ? "none" : "0 4px 12px rgba(0, 0, 0, 0.3)";
                  }}
                >
                  Previous
                </button>
                <span style={{ color: "var(--text-secondary)", fontWeight: 600, fontSize: "0.875rem" }}>
                  Page {page} of {totalPages}
                </span>
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  style={{
                    padding: "0.75rem 1.5rem",
                    background: page === totalPages ? "var(--bg-tertiary)" : "linear-gradient(135deg, var(--accent-blue), var(--accent-purple))",
                    border: "1px solid " + (page === totalPages ? "var(--border-elevated)" : "transparent"),
                    borderRadius: "50px",
                    color: "white",
                    cursor: page === totalPages ? "not-allowed" : "pointer",
                    opacity: page === totalPages ? 0.5 : 1,
                    fontWeight: 600,
                    fontSize: "0.875rem",
                    transition: "all 0.2s",
                    boxShadow: page === totalPages ? "none" : "0 4px 12px rgba(91, 141, 239, 0.3)"
                  }}
                  onMouseEnter={(e) => {
                    if (page !== totalPages) {
                      e.currentTarget.style.transform = "translateY(-2px)";
                      e.currentTarget.style.boxShadow = "0 6px 16px rgba(91, 141, 239, 0.4)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = page === totalPages ? "none" : "0 4px 12px rgba(91, 141, 239, 0.3)";
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
