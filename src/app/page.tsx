// ✏️ 修改这里：APP 主页入口
// 体重一键记录(成就版) / 就算轻了一两，也是辉煌的一跃 / A lightweight tool for 体重一键记录(成就版). / hsl(220, 90%, 62%) 会被 create-app.ps1 自动替换

export default function Home() {
  return (
    <main style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      {/* ── 导航栏 ── */}
      <nav style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "var(--space-4) var(--space-8)",
        borderBottom: "1px solid var(--color-border)",
        background: "var(--color-surface)",
      }}>
        <span style={{ fontWeight: 700, fontSize: "1.125rem", color: "var(--color-primary)" }}>
          体重一键记录(成就版)
        </span>
        <div style={{ display: "flex", gap: "var(--space-4)" }}>
          <button className="btn btn-ghost" id="nav-features">功能</button>
          <button className="btn btn-primary" id="nav-cta">立即使用</button>
        </div>
      </nav>

      {/* ── Hero 区域 ── */}
      <section className="animate-in" style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        padding: "var(--space-16) var(--space-6)",
        gap: "var(--space-6)",
      }}>
        <div className="badge badge-primary">✨ 轻量 · 专注 · 高效</div>

        <h1 style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)", fontWeight: 700, lineHeight: 1.15 }}>
          <span className="gradient-text">就算轻了一两，也是辉煌的一跃</span>
        </h1>

        <p style={{
          fontSize: "1.125rem",
          color: "var(--color-text-muted)",
          maxWidth: "540px",
          lineHeight: 1.7,
        }}>
          A lightweight tool for 体重一键记录(成就版).
        </p>

        <div style={{ display: "flex", gap: "var(--space-4)", flexWrap: "wrap", justifyContent: "center" }}>
          <button className="btn btn-primary" id="hero-cta-primary" style={{ fontSize: "1rem", padding: "var(--space-4) var(--space-8)" }}>
            免费开始使用 →
          </button>
          <button className="btn btn-secondary" id="hero-cta-secondary">
            了解更多
          </button>
        </div>
      </section>

      {/* ── 功能亮点区 ── */}
      <section style={{ padding: "var(--space-16) var(--space-6)", background: "var(--color-surface)" }}>
        <div className="container">
          <h2 style={{ textAlign: "center", marginBottom: "var(--space-10)", fontSize: "1.75rem", fontWeight: 700 }}>
            核心功能
          </h2>
          <div className="grid-3">
            {[
              { icon: "⚡", title: "快速上手", desc: "无需注册，打开即用，30 秒解决你的问题。" },
              { icon: "🎯", title: "专注核心", desc: "只做一件事，做到极致，不添加多余功能。" },
              { icon: "🔒", title: "数据安全", desc: "本地优先处理，不上传任何敏感信息。" },
            ].map((item, i) => (
              <div key={i} className="card" id={`feature-card-${i + 1}`}>
                <div style={{ fontSize: "2rem", marginBottom: "var(--space-4)" }}>{item.icon}</div>
                <h3 style={{ fontWeight: 600, marginBottom: "var(--space-2)" }}>{item.title}</h3>
                <p style={{ color: "var(--color-text-muted)", lineHeight: 1.6 }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer style={{
        textAlign: "center",
        padding: "var(--space-8)",
        color: "var(--color-text-faint)",
        fontSize: "0.875rem",
        borderTop: "1px solid var(--color-border)",
      }}>
        © {new Date().getFullYear()} 体重一键记录(成就版) · 专注解决一个问题
      </footer>
    </main>
  );
}
