export default function LandingPage() {
  return (
    <div style={{ minHeight: "100vh", position: "relative", overflow: "hidden" }}>
      {/* Background */}
      <div className="bg-grid" style={{ position: "fixed", inset: 0, opacity: 0.3 }} />
      
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
      <header className="glass" style={{
        position: "sticky",
        top: 0,
        zIndex: 50,
        borderBottom: "1px solid var(--border-primary)"
      }}>
        <div style={{
          maxWidth: "1400px",
          margin: "0 auto",
          padding: "1rem 1.5rem",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center"
        }}>
          <div className="gradient-text" style={{ fontSize: "1.5rem", fontWeight: "bold" }}>
            FeedCentral
          </div>
          <nav style={{ display: "flex", gap: "2rem", alignItems: "center" }}>
            <a href="/feed" style={{ color: "var(--text-secondary)", textDecoration: "none", transition: "color 0.2s" }}
               onMouseEnter={(e) => e.currentTarget.style.color = "var(--text-primary)"}
               onMouseLeave={(e) => e.currentTarget.style.color = "var(--text-secondary)"}>
              Browse Feed
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
      </header>

      {/* Hero Section */}
      <section style={{ position: "relative", padding: "6rem 1.5rem 4rem", textAlign: "center" }}>
        <div style={{ maxWidth: "900px", margin: "0 auto" }}>
          <h1 style={{
            fontSize: "clamp(2.5rem, 6vw, 4.5rem)",
            fontWeight: 900,
            lineHeight: 1.1,
            marginBottom: "1.5rem",
            letterSpacing: "-0.03em"
          }}>
            Your{" "}
            <span className="gradient-text">Central Hub</span>
            {" "}for RSS Feeds
          </h1>
          <p style={{
            fontSize: "1.25rem",
            color: "var(--text-secondary)",
            maxWidth: "600px",
            margin: "0 auto 2.5rem",
            lineHeight: 1.6
          }}>
            Aggregate, search, and discover content from over 30 trusted sources across 8 categories. All in one beautiful interface.
          </p>
          <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
            <a href="/feed" style={{
              padding: "1rem 2.5rem",
              background: "linear-gradient(135deg, var(--accent-blue), var(--accent-purple))",
              color: "white",
              borderRadius: "0.75rem",
              textDecoration: "none",
              fontWeight: 600,
              fontSize: "1.125rem",
              transition: "transform 0.2s, box-shadow 0.2s",
              display: "inline-block"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-3px)";
              e.currentTarget.style.boxShadow = "0 20px 40px rgba(59, 130, 246, 0.4)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "none";
            }}>
              Explore Feed →
            </a>
            <a href="https://github.com/BENZOOgataga/feedcentral" target="_blank" rel="noopener noreferrer" style={{
              padding: "1rem 2.5rem",
              background: "var(--bg-secondary)",
              border: "1px solid var(--border-primary)",
              color: "var(--text-primary)",
              borderRadius: "0.75rem",
              textDecoration: "none",
              fontWeight: 600,
              fontSize: "1.125rem",
              transition: "all 0.2s",
              display: "inline-block"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "var(--border-secondary)";
              e.currentTarget.style.transform = "translateY(-3px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "var(--border-primary)";
              e.currentTarget.style.transform = "translateY(0)";
            }}>
              View Source
            </a>
          </div>
        </div>

        {/* Stats */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "2rem",
          maxWidth: "900px",
          margin: "4rem auto 0",
        }}>
          {[
            { num: "532+", label: "Articles Indexed" },
            { num: "30+", label: "RSS Sources" },
            { num: "8", label: "Categories" },
            { num: "Live", label: "Real-time Updates" },
          ].map((stat, i) => (
            <div key={i} className="glass" style={{
              padding: "2rem",
              borderRadius: "1rem",
              textAlign: "center"
            }}>
              <div className="gradient-text" style={{ fontSize: "2.5rem", fontWeight: "bold", marginBottom: "0.5rem" }}>
                {stat.num}
              </div>
              <div style={{ color: "var(--text-tertiary)", fontSize: "0.875rem" }}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section style={{ position: "relative", padding: "4rem 1.5rem", maxWidth: "1200px", margin: "0 auto" }}>
        <h2 style={{ fontSize: "2.5rem", fontWeight: "bold", textAlign: "center", marginBottom: "3rem" }}>
          Everything you need
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "2rem" }}>
          {[
            {
              icon: "🔍",
              title: "Full-Text Search",
              desc: "Lightning-fast PostgreSQL full-text search across all articles"
            },
            {
              icon: "🎯",
              title: "Smart Categorization",
              desc: "8 curated categories from Tech to AI, Science to Finance"
            },
            {
              icon: "⚡",
              title: "Real-time Updates",
              desc: "Auto-refresh every 15 minutes with self-hosted cron"
            },
            {
              icon: "🎨",
              title: "Modern Interface",
              desc: "Beautiful dark theme with glassmorphism and smooth animations"
            },
            {
              icon: "🔒",
              title: "Privacy First",
              desc: "Self-hosted, no tracking, complete control over your data"
            },
            {
              icon: "🚀",
              title: "Production Ready",
              desc: "Built with Next.js, TypeScript, and PostgreSQL"
            },
          ].map((feature, i) => (
            <div key={i} className="glass card-glow" style={{
              padding: "2rem",
              borderRadius: "1rem",
              transition: "transform 0.3s, border-color 0.3s"
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = "translateY(-4px)"}
            onMouseLeave={(e) => e.currentTarget.style.transform = "translateY(0)"}>
              <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>{feature.icon}</div>
              <h3 style={{ fontSize: "1.25rem", fontWeight: "bold", marginBottom: "0.75rem" }}>
                {feature.title}
              </h3>
              <p style={{ color: "var(--text-secondary)", lineHeight: 1.6 }}>
                {feature.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={{ position: "relative", padding: "6rem 1.5rem", textAlign: "center" }}>
        <div className="glass" style={{
          maxWidth: "800px",
          margin: "0 auto",
          padding: "4rem 2rem",
          borderRadius: "1.5rem"
        }}>
          <h2 style={{ fontSize: "2.5rem", fontWeight: "bold", marginBottom: "1rem" }}>
            Start exploring now
          </h2>
          <p style={{ fontSize: "1.125rem", color: "var(--text-secondary)", marginBottom: "2rem" }}>
            No signup required. Just browse and discover.
          </p>
          <a href="/feed" style={{
            padding: "1.25rem 3rem",
            background: "linear-gradient(135deg, var(--accent-blue), var(--accent-purple))",
            color: "white",
            borderRadius: "0.75rem",
            textDecoration: "none",
            fontWeight: 600,
            fontSize: "1.125rem",
            transition: "transform 0.2s, box-shadow 0.2s",
            display: "inline-block"
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "translateY(-3px)";
            e.currentTarget.style.boxShadow = "0 20px 40px rgba(59, 130, 246, 0.4)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow = "none";
          }}>
            Browse Articles →
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer style={{
        position: "relative",
        borderTop: "1px solid var(--border-primary)",
        padding: "2rem 1.5rem",
        textAlign: "center",
        color: "var(--text-tertiary)",
        fontSize: "0.875rem"
      }}>
        <p>Built by BENZOO • Open Source • Self-Hosted</p>
      </footer>
    </div>
  );
}
