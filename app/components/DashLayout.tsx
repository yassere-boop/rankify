"use client";
import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";

const NAV = [
  { label: "POD Decision", path: "/dashboard", icon: "◎" },
  { label: "Competition", path: "/competition", icon: "▦" },
  { label: "Trends", path: "/trends", icon: "↗" },
  { label: "Tag Generator", path: "/tags", icon: "✦" },
  { label: "Listing Optimizer", path: "/listing", icon: "★" },
  { label: "Sales Estimator", path: "/sales", icon: "$" },
  { label: "POD Research", path: "/pod", icon: "◈", badge: "NEW" },
];

export default function DashLayout({ children, topbarLabel }: { children: React.ReactNode; topbarLabel: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  const go = (path: string) => { setMenuOpen(false); router.push(path); };

  return (
    <>
      <style jsx global>{`
        @import url("https://fonts.googleapis.com/css2?family=Instrument+Serif&family=Inter:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap");
        body { font-family: "Inter", system-ui, sans-serif; background: #08090d; color: #e2e8f0; margin: 0; }
        .serif { font-family: "Instrument Serif", serif; font-style: italic; letter-spacing: -0.02em; }
        .mono { font-family: "JetBrains Mono", monospace; }
        .gradient-text { background: linear-gradient(135deg, #ffffff 0%, #ffffff 40%, #94a3b8 100%); -webkit-background-clip: text; background-clip: text; -webkit-text-fill-color: transparent; }
        .gradient-accent { background: linear-gradient(135deg, #a78bfa 0%, #f472b6 50%, #fb923c 100%); -webkit-background-clip: text; background-clip: text; -webkit-text-fill-color: transparent; }
        .glass { background: rgba(255, 255, 255, 0.02); backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px); border: 1px solid rgba(255, 255, 255, 0.06); }
        .glow-border { position: relative; }
        .glow-border::before { content: ""; position: absolute; inset: -1px; border-radius: inherit; padding: 1px; background: linear-gradient(135deg, rgba(167, 139, 250, 0.4), rgba(244, 114, 182, 0.2), rgba(251, 146, 60, 0.4)); -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0); mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0); -webkit-mask-composite: xor; mask-composite: exclude; pointer-events: none; }
        @keyframes meshFloat { 0%, 100% { transform: translate(0, 0) scale(1); } 33% { transform: translate(30px, -50px) scale(1.05); } 66% { transform: translate(-20px, 20px) scale(0.95); } }
        @keyframes pulseSoft { 0%, 100% { opacity: 0.6; } 50% { opacity: 1; } }
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        .mesh-1 { animation: meshFloat 25s ease-in-out infinite; }
        .verdict-pulse { animation: pulseSoft 2.5s ease-in-out infinite; }
        .fade-up { animation: fadeUp 0.4s cubic-bezier(0.16, 1, 0.3, 1); }
        .dash { min-height: 100vh; display: flex; position: relative; }
        .dash-mesh { position: fixed; inset: 0; z-index: 0; pointer-events: none; overflow: hidden; }
        .dash-side { width: 240px; background: rgba(8, 9, 13, 0.7); backdrop-filter: blur(20px); border-right: 1px solid rgba(255, 255, 255, 0.04); display: flex; flex-direction: column; flex-shrink: 0; padding: 24px 16px 20px; position: relative; z-index: 10; }
        .dash-logo { display: flex; align-items: center; gap: 8px; padding: 0 8px; margin-bottom: 4px; text-decoration: none; }
        .dash-logo-icon { width: 28px; height: 28px; border-radius: 8px; display: flex; align-items: center; justify-content: center; background: linear-gradient(135deg, #a78bfa 0%, #f472b6 100%); font-weight: 700; color: white; font-size: 14px; }
        .dash-logo-text { font-size: 16px; font-weight: 600; letter-spacing: -0.02em; color: white; }
        .dash-logo-text em { font-style: normal; color: rgba(255, 255, 255, 0.6); font-weight: 400; }
        .dash-live-row { display: flex; align-items: center; gap: 8px; padding: 0 8px; margin: 16px 0 24px; }
        .dash-dot { width: 6px; height: 6px; border-radius: 50%; background: #34d399; }
        .dash-live-label { font-size: 11px; font-weight: 500; color: rgba(52, 211, 153, 0.8); letter-spacing: 0.04em; }
        .dash-section-label { font-size: 10px; font-weight: 600; color: rgba(255, 255, 255, 0.25); letter-spacing: 0.15em; text-transform: uppercase; padding: 0 8px; margin-bottom: 8px; }
        .dash-nav { display: flex; flex-direction: column; gap: 2px; flex: 1; }
        .dash-navbtn { display: flex; align-items: center; gap: 12px; padding: 10px 12px; border-radius: 10px; cursor: pointer; border: 1px solid transparent; background: none; color: rgba(255, 255, 255, 0.5); font-size: 13px; font-weight: 500; width: 100%; text-align: left; transition: all 0.2s; font-family: inherit; }
        .dash-navbtn:hover { background: rgba(255, 255, 255, 0.04); color: rgba(255, 255, 255, 0.9); }
        .dash-navbtn-active { background: rgba(167, 139, 250, 0.08); border-color: rgba(167, 139, 250, 0.2); color: #ddd6fe !important; }
        .dash-nav-icon { font-size: 14px; width: 18px; text-align: center; opacity: 0.7; }
        .dash-new-badge { margin-left: auto; font-size: 9px; font-weight: 700; padding: 2px 7px; border-radius: 999px; background: linear-gradient(135deg, #a78bfa 0%, #f472b6 100%); color: white; letter-spacing: 0.05em; }
        .dash-upgrade { margin-top: auto; padding-top: 16px; border-top: 1px solid rgba(255, 255, 255, 0.04); }
        .dash-upgrade-btn { width: 100%; padding: 11px 16px; border-radius: 10px; background: white; color: black; font-size: 13px; font-weight: 600; border: none; cursor: pointer; font-family: inherit; transition: all 0.2s; display: flex; align-items: center; justify-content: center; gap: 6px; }
        .dash-upgrade-btn:hover { transform: translateY(-1px); box-shadow: 0 12px 24px -8px rgba(167, 139, 250, 0.3); }
        .dash-main { flex: 1; display: flex; flex-direction: column; min-width: 0; position: relative; z-index: 5; }
        .dash-topbar { height: 52px; border-bottom: 1px solid rgba(255, 255, 255, 0.04); display: flex; align-items: center; gap: 14px; padding: 0 40px; background: rgba(8, 9, 13, 0.5); backdrop-filter: blur(20px); flex-shrink: 0; }
        .dash-content { flex: 1; padding: 40px 48px; overflow-y: auto; max-width: 1100px; width: 100%; margin: 0 auto; }
        .dash-hero-title { font-size: 32px; font-weight: 600; color: white; letter-spacing: -0.025em; margin-bottom: 6px; line-height: 1.1; }
        .dash-hero-title em { font-family: "Instrument Serif", serif; font-style: italic; background: linear-gradient(135deg, #a78bfa 0%, #f472b6 50%, #fb923c 100%); -webkit-background-clip: text; background-clip: text; -webkit-text-fill-color: transparent; }
        .dash-hero-sub { font-size: 14px; color: rgba(255, 255, 255, 0.5); margin-bottom: 32px; font-weight: 300; }
        .dash-search-row { display: flex; gap: 10px; margin-bottom: 16px; }
        .dash-input { flex: 1; background: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 14px; padding: 15px 20px; color: white; font-size: 14px; outline: none; font-family: inherit; transition: all 0.2s; backdrop-filter: blur(12px); }
        .dash-input::placeholder { color: rgba(255, 255, 255, 0.25); }
        .dash-input:focus { border-color: rgba(167, 139, 250, 0.4); background: rgba(255, 255, 255, 0.05); box-shadow: 0 0 0 4px rgba(167, 139, 250, 0.06); }
        .dash-btn { background: white; color: black; border: none; border-radius: 14px; padding: 15px 28px; font-size: 14px; font-weight: 600; cursor: pointer; font-family: inherit; white-space: nowrap; transition: all 0.2s; display: flex; align-items: center; gap: 6px; }
        .dash-btn:hover:not(:disabled) { transform: translateY(-1px); box-shadow: 0 12px 24px -8px rgba(167, 139, 250, 0.4); }
        .dash-btn:disabled { opacity: 0.4; cursor: not-allowed; }
        .dash-chips { display: flex; flex-wrap: wrap; gap: 7px; margin-bottom: 32px; }
        .dash-chip { padding: 7px 14px; border-radius: 999px; background: rgba(255, 255, 255, 0.02); border: 1px solid rgba(255, 255, 255, 0.06); color: rgba(255, 255, 255, 0.55); font-size: 12px; font-weight: 500; cursor: pointer; transition: all 0.15s; font-family: inherit; }
        .dash-chip:hover { background: rgba(167, 139, 250, 0.08); border-color: rgba(167, 139, 250, 0.25); color: #c4b5fd; }
        .dash-card { background: rgba(255, 255, 255, 0.02); border: 1px solid rgba(255, 255, 255, 0.05); border-radius: 16px; padding: 22px 24px; margin-bottom: 16px; backdrop-filter: blur(12px); }
        .dash-loading { display: flex; flex-direction: column; align-items: center; justify-content: center; height: 220px; gap: 18px; }
        .dash-spinner { width: 36px; height: 36px; border: 2px solid rgba(167, 139, 250, 0.15); border-top-color: #a78bfa; border-radius: 50%; animation: spin 0.8s linear infinite; }
        .dash-error-box { background: rgba(239, 68, 68, 0.06); border: 1px solid rgba(239, 68, 68, 0.15); border-radius: 14px; padding: 18px 22px; margin-bottom: 24px; display: flex; align-items: center; justify-content: space-between; gap: 12px; backdrop-filter: blur(12px); }

        /* --- BURGER (caché sur desktop) --- */
        .dash-burger { display: none; align-items: center; justify-content: center; width: 38px; height: 38px; border-radius: 10px; border: 1px solid rgba(255,255,255,0.08); background: rgba(255,255,255,0.03); color: white; cursor: pointer; font-size: 18px; flex-shrink: 0; }
        .dash-overlay { display: none; position: fixed; inset: 0; background: rgba(0,0,0,0.5); z-index: 40; }

        /* --- MOBILE --- */
        @media (max-width: 900px) {
          .dash-content { padding: 24px 20px; }
          .dash-topbar { padding: 0 16px; }
          .dash-burger { display: flex; }
          .dash-side {
            position: fixed; top: 0; left: 0; height: 100vh;
            transform: translateX(-100%);
            transition: transform 0.25s ease;
            z-index: 50;
          }
          .dash-side.open { transform: translateX(0); }
          .dash-overlay.open { display: block; }
        }
      `}</style>

      <div className="dash">
        <div className="dash-mesh">
          <div className="mesh-1" style={{ position: "absolute", top: -160, left: -160, width: 500, height: 500, borderRadius: "50%", opacity: 0.3, background: "radial-gradient(circle, rgba(167,139,250,0.4) 0%, rgba(167,139,250,0) 70%)", filter: "blur(80px)" }} />
          <div className="mesh-1" style={{ position: "absolute", top: "50%", right: -160, width: 400, height: 400, borderRadius: "50%", opacity: 0.2, background: "radial-gradient(circle, rgba(244,114,182,0.4) 0%, rgba(244,114,182,0) 70%)", filter: "blur(80px)", animationDelay: "8s" }} />
        </div>

        <div className={`dash-overlay ${menuOpen ? "open" : ""}`} onClick={() => setMenuOpen(false)} />

        <aside className={`dash-side ${menuOpen ? "open" : ""}`}>
          <Link href="/" className="dash-logo" onClick={() => setMenuOpen(false)}>
            <div className="dash-logo-icon">M</div>
            <span className="dash-logo-text">Mark<em>earn</em></span>
          </Link>
          <div className="dash-live-row">
            <div className="dash-dot verdict-pulse" />
            <span className="dash-live-label">Live data</span>
          </div>
          <div className="dash-section-label">Tools</div>
          <nav className="dash-nav">
            {NAV.map((item) => (
              <button key={item.path} onClick={() => go(item.path)} className={`dash-navbtn ${pathname === item.path ? "dash-navbtn-active" : ""}`}>
                <span className="dash-nav-icon">{item.icon}</span>
                <span>{item.label}</span>
                {item.badge && <span className="dash-new-badge">{item.badge}</span>}
              </button>
            ))}
          </nav>
          <div className="dash-upgrade">
            <button className="dash-upgrade-btn" onClick={() => go("/pricing")}>
              <span>↑</span>Upgrade Plan
            </button>
          </div>
        </aside>

        <div className="dash-main">
          <div className="dash-topbar">
            <button className="dash-burger" onClick={() => setMenuOpen(true)} aria-label="Menu">☰</button>
            <span style={{ fontSize: 11, color: "rgba(255,255,255,0.35)", letterSpacing: "0.05em" }}>{topbarLabel}</span>
          </div>
          <div className="dash-content">{children}</div>
        </div>
      </div>
    </>
  );
}