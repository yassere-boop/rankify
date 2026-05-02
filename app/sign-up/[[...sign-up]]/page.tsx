"use client";
import { SignUp } from "@clerk/nextjs";
import Link from "next/link";

export default function SignUpPage() {
  return (
    <>
      <style jsx global>{`
        @import url("https://fonts.googleapis.com/css2?family=Instrument+Serif&family=Inter:wght@300;400;500;600;700;800&display=swap");
        body { font-family: "Inter", system-ui, sans-serif; background: #08090d; color: #e2e8f0; margin: 0; }
        @keyframes meshFloat { 0%, 100% { transform: translate(0, 0) scale(1); } 33% { transform: translate(30px, -50px) scale(1.05); } 66% { transform: translate(-20px, 20px) scale(0.95); } }
        .mesh-anim { animation: meshFloat 25s ease-in-out infinite; }
      `}</style>

      <main style={{ minHeight: "100vh", background: "#08090d", display: "flex", alignItems: "center", justifyContent: "center", position: "relative", overflow: "hidden", padding: "20px" }}>
        <div className="mesh-anim" style={{ position: "absolute", top: -160, right: -160, width: 500, height: 500, borderRadius: "50%", opacity: 0.3, background: "radial-gradient(circle, rgba(244,114,182,0.4) 0%, rgba(244,114,182,0) 70%)", filter: "blur(80px)", pointerEvents: "none" }} />
        <div className="mesh-anim" style={{ position: "absolute", bottom: -160, left: -160, width: 400, height: 400, borderRadius: "50%", opacity: 0.25, background: "radial-gradient(circle, rgba(167,139,250,0.4) 0%, rgba(167,139,250,0) 70%)", filter: "blur(80px)", pointerEvents: "none", animationDelay: "8s" }} />

        <div style={{ position: "relative", zIndex: 10, display: "flex", flexDirection: "column", alignItems: "center", gap: 32 }}>
          <Link href="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", background: "linear-gradient(135deg, #a78bfa 0%, #f472b6 100%)", fontWeight: 700, color: "white", fontSize: 18 }}>M</div>
            <span style={{ fontSize: 20, fontWeight: 600, letterSpacing: "-0.02em", color: "white" }}>
              Mark<em style={{ fontStyle: "normal", color: "rgba(255,255,255,0.6)", fontWeight: 400 }}>earn</em>
            </span>
          </Link>

          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 32, fontWeight: 600, color: "white", letterSpacing: "-0.025em", lineHeight: 1.1, marginBottom: 8 }}>
              Stop designing <em style={{ fontFamily: "Instrument Serif, serif", fontStyle: "italic", background: "linear-gradient(135deg, #a78bfa 0%, #f472b6 50%, #fb923c 100%)", WebkitBackgroundClip: "text", backgroundClip: "text", WebkitTextFillColor: "transparent" }}>blind.</em>
            </div>
            <div style={{ fontSize: 14, color: "rgba(255,255,255,0.5)", fontWeight: 300 }}>Get your first verdict in 10 seconds — no credit card.</div>
          </div>

          <SignUp
            appearance={{
              variables: {
                colorPrimary: "#a78bfa",
                colorBackground: "rgba(255, 255, 255, 0.02)",
                colorText: "#ffffff",
                colorTextSecondary: "rgba(255, 255, 255, 0.5)",
                colorInputBackground: "rgba(255, 255, 255, 0.03)",
                colorInputText: "#ffffff",
                fontFamily: "Inter, system-ui, sans-serif",
                borderRadius: "12px",
              },
              elements: {
                rootBox: { width: "100%" },
                card: {
                  background: "rgba(255, 255, 255, 0.02)",
                  backdropFilter: "blur(12px)",
                  border: "1px solid rgba(255, 255, 255, 0.06)",
                  boxShadow: "0 24px 48px -12px rgba(0,0,0,0.5)",
                },
                headerTitle: { display: "none" },
                headerSubtitle: { display: "none" },
                socialButtonsBlockButton: {
                  background: "rgba(255, 255, 255, 0.04)",
                  border: "1px solid rgba(255, 255, 255, 0.08)",
                  color: "white",
                  "&:hover": { background: "rgba(255, 255, 255, 0.08)" },
                },
                dividerLine: { background: "rgba(255, 255, 255, 0.08)" },
                dividerText: { color: "rgba(255, 255, 255, 0.4)" },
                formFieldLabel: { color: "rgba(255, 255, 255, 0.7)", fontWeight: 500 },
                formFieldInput: {
                  background: "rgba(255, 255, 255, 0.03)",
                  border: "1px solid rgba(255, 255, 255, 0.08)",
                  color: "white",
                  "&:focus": { borderColor: "rgba(167, 139, 250, 0.4)", boxShadow: "0 0 0 4px rgba(167,139,250,0.06)" },
                },
                formButtonPrimary: {
                  background: "white",
                  color: "black",
                  fontWeight: 600,
                  textTransform: "none",
                  "&:hover": { background: "white", transform: "translateY(-1px)", boxShadow: "0 12px 24px -8px rgba(167,139,250,0.4)" },
                },
                footerActionLink: { color: "#c4b5fd", "&:hover": { color: "#ddd6fe" } },
                identityPreviewEditButton: { color: "#c4b5fd" },
                formResendCodeLink: { color: "#c4b5fd" },
              },
            }}
          />
        </div>
      </main>
    </>
  );
}