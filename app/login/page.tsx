 "use client";
import { useState } from "react";
import Link from "next/link";

export default function Login() {
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  function handleSubmit() {
    if (!email || !password) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setDone(true);
    }, 1000);
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center px-4">
      <div className="w-full max-w-md">

        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="text-3xl font-black text-white">
            Rank<span className="text-purple-400">ify</span>
          </Link>
          <p className="text-white/40 text-sm mt-2">
            {mode === "login" ? "Welcome back 👋" : "Start your free trial 🚀"}
          </p>
        </div>

        {/* Card */}
        <div className="bg-white/5 border border-white/10 rounded-3xl p-8">

          {/* Toggle login / signup */}
          <div className="flex bg-white/5 rounded-full p-1 mb-8">
            <button
              onClick={() => { setMode("login"); setDone(false); }}
              className={`flex-1 py-2 rounded-full text-sm font-bold transition ${
                mode === "login" ? "bg-purple-600 text-white" : "text-white/40 hover:text-white"
              }`}>
              Login
            </button>
            <button
              onClick={() => { setMode("signup"); setDone(false); }}
              className={`flex-1 py-2 rounded-full text-sm font-bold transition ${
                mode === "signup" ? "bg-purple-600 text-white" : "text-white/40 hover:text-white"
              }`}>
              Sign up
            </button>
          </div>

          {done ? (
            <div className="text-center py-6">
              <div className="text-4xl mb-4">🎉</div>
              <p className="text-white font-bold text-lg mb-2">
                {mode === "login" ? "Logged in!" : "Account created!"}
              </p>
              <p className="text-white/50 text-sm mb-6">
                {mode === "login" ? "Redirecting to your dashboard..." : "Welcome to Rankify!"}
              </p>
              <Link href="/dashboard"
                className="bg-purple-600 hover:bg-purple-500 text-white px-8 py-3 rounded-full font-bold text-sm transition inline-block">
                Go to Dashboard →
              </Link>
            </div>
          ) : (
            <>
              {/* Name (signup only) */}
              {mode === "signup" && (
                <div className="mb-4">
                  <label className="text-white/50 text-xs font-semibold mb-2 block uppercase tracking-widest">
                    Full name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="John Doe"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/20 text-sm outline-none focus:border-purple-500 transition"
                  />
                </div>
              )}

              {/* Email */}
              <div className="mb-4">
                <label className="text-white/50 text-xs font-semibold mb-2 block uppercase tracking-widest">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                  placeholder="you@example.com"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/20 text-sm outline-none focus:border-purple-500 transition"
                />
              </div>

              {/* Password */}
              <div className="mb-6">
                <label className="text-white/50 text-xs font-semibold mb-2 block uppercase tracking-widest">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                  placeholder="••••••••"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/20 text-sm outline-none focus:border-purple-500 transition"
                />
              </div>

              {/* Submit */}
              <button
                onClick={handleSubmit}
                className="w-full bg-purple-600 hover:bg-purple-500 text-white py-3.5 rounded-full font-bold text-sm transition shadow-lg shadow-purple-500/20"
              >
                {loading ? "Loading..." : mode === "login" ? "Login to Rankify" : "Create my account"}
              </button>

              {/* Forgot password */}
              {mode === "login" && (
                <p className="text-center text-white/30 text-xs mt-4 hover:text-white/50 cursor-pointer transition">
                  Forgot your password?
                </p>
              )}

              {/* Terms (signup) */}
              {mode === "signup" && (
                <p className="text-center text-white/20 text-xs mt-4 leading-relaxed">
                  By signing up you agree to our{" "}
                  <span className="text-purple-400 cursor-pointer">Terms of Service</span>{" "}
                  and{" "}
                  <span className="text-purple-400 cursor-pointer">Privacy Policy</span>
                </p>
              )}
            </>
          )}
        </div>

        {/* Back to home */}
        <p className="text-center text-white/20 text-xs mt-6">
          <Link href="/" className="hover:text-white/50 transition">← Back to homepage</Link>
        </p>

      </div>
    </main>
  );
}
