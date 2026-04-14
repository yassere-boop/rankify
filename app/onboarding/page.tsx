"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

const PLATFORMS = [
  { id: "etsy-pod", emoji: "🛍️", title: "Print-on-Demand (Etsy)", desc: "T-shirts, mugs, posters on Etsy" },
  { id: "other-pod", emoji: "🎨", title: "Print-on-Demand (other)", desc: "Redbubble, Merch by Amazon, Teepublic" },
  { id: "dropshipping", emoji: "📦", title: "Dropshipping", desc: "Products shipped from suppliers" },
  { id: "amazon-fba", emoji: "🏭", title: "Amazon FBA", desc: "Private label on Amazon" },
];

export default function Onboarding() {
  const router = useRouter();
  const [selected, setSelected] = useState("");
  const [loading, setLoading] = useState(false);

  const handleContinue = async () => {
    if (!selected) return;
    setLoading(true);
    await new Promise(r => setTimeout(r, 600));
    router.push("/dashboard");
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        .ob { font-family: 'Plus Jakarta Sans', system-ui, sans-serif; background: #0f1623; min-height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 40px 20px; color: #cbd5e1; }
        .ob-card { width: 100%; max-width: 560px; }
        .ob-logo { font-size: 20px; font-weight: 700; color: #f8fafc; letter-spacing: -0.03em; text-align: center; margin-bottom: 40px; }
        .ob-logo em { font-style: normal; color: #818cf8; }
        .ob-title { font-size: 28px; font-weight: 800; color: #f1f5f9; letter-spacing: -0.025em; text-align: center; margin-bottom: 8px; }
        .ob-sub { font-size: 15px; color: #475569; text-align: center; margin-bottom: 32px; line-height: 1.6; }
        .ob-options { display: flex; flex-direction: column; gap: 10px; margin-bottom: 24px; }
        .ob-option { display: flex; align-items: center; gap: 16px; padding: 18px 20px; border-radius: 14px; border: 1.5px solid rgba(255,255,255,0.07); background: rgba(255,255,255,0.03); cursor: pointer; transition: all 0.15s; }
        .ob-option:hover { border-color: rgba(129,140,248,0.3); background: rgba(129,140,248,0.05); }
        .ob-option-active { border-color: rgba(129,140,248,0.5) !important; background: rgba(129,140,248,0.1) !important; }
        .ob-emoji { font-size: 28px; width: 48px; height: 48px; display: flex; align-items: center; justify-content: center; border-radius: 12px; background: rgba(255,255,255,0.05); flex-shrink: 0; }
        .ob-option-title { font-size: 15px; font-weight: 600; color: #f1f5f9; margin-bottom: 3px; }
        .ob-option-desc { font-size: 13px; color: #475569; }
        .ob-check { width: 22px; height: 22px; border-radius: 50%; border: 1.5px solid rgba(255,255,255,0.15); margin-left: auto; flex-shrink: 0; display: flex; align-items: center; justify-content: center; transition: all 0.15s; }
        .ob-check-active { background: #6366f1; border-color: #6366f1; }
        .ob-btn { width: 100%; padding: 14px; border-radius: 12px; background: #6366f1; color: #fff; font-size: 15px; font-weight: 700; border: none; cursor: pointer; font-family: inherit; transition: all 0.15s; letter-spacing: 0.01em; }
        .ob-btn:hover:not(:disabled) { background: #4f46e5; transform: translateY(-1px); box-shadow: 0 8px 24px rgba(99,102,241,0.35); }
        .ob-btn:disabled { opacity: 0.4; cursor: not-allowed; transform: none; }
        .ob-note { font-size: 12px; color: #334155; text-align: center; margin-top: 16px; line-height: 1.6; }
        .ob-note-highlight { font-size: 11px; color: #475569; text-align: center; margin-top: 8px; padding: 8px 16px; background: rgba(99,102,241,0.06); border: 1px solid rgba(99,102,241,0.12); border-radius: 8px; line-height: 1.6; }
      `}</style>

      <div className="ob">
        <div className="ob-card">
          <div className="ob-logo">Rank<em>ify</em></div>

          <div className="ob-title">What do you sell?</div>
          <div className="ob-sub">
            We'll personalize your experience based on your business model.
          </div>

          <div className="ob-options">
            {PLATFORMS.map(p => (
              <div key={p.id} onClick={() => setSelected(p.id)}
                className={`ob-option ${selected === p.id ? "ob-option-active" : ""}`}>
                <div className="ob-emoji">{p.emoji}</div>
                <div>
                  <div className="ob-option-title">{p.title}</div>
                  <div className="ob-option-desc">{p.desc}</div>
                </div>
                <div className={`ob-check ${selected === p.id ? "ob-check-active" : ""}`}>
                  {selected === p.id && <span style={{ color: "#fff", fontSize: 12, fontWeight: 700 }}>✓</span>}
                </div>
              </div>
            ))}
          </div>

          <button className="ob-btn" onClick={handleContinue} disabled={!selected || loading}>
            {loading ? "Setting up your workspace..." : "Continue →"}
          </button>

          <div className="ob-note">
            Market data is already complete. Automation depends on platform APIs.
          </div>
          <div className="ob-note-highlight">
            Your POD decision tool is ready to use immediately — no setup required.
          </div>
        </div>
      </div>
    </>
  );
}