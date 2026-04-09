import Link from "next/link";export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* NAVBAR */}
      <nav className="flex items-center justify-between px-8 py-5 border-b border-white/10">
        <div className="text-2xl font-black text-white">
          Rank<span className="text-purple-400">ify</span>
        </div>
        <div className="flex items-center gap-4">
          <a href="#pricing" className="text-white/70 hover:text-white text-sm transition">Pricing</a>
         <Link href="/login">
  <button className="bg-purple-600 hover:bg-purple-500 text-white px-5 py-2 rounded-full text-sm font-semibold transition">
    Get Started
  </button>
</Link>
        </div>
      </nav>

      {/* HERO */}
      <section className="flex flex-col items-center justify-center text-center px-6 py-28">
        <div className="inline-block bg-purple-500/20 text-purple-300 text-xs font-semibold px-4 py-1.5 rounded-full mb-6 border border-purple-500/30">
          🚀 The #1 Etsy Keyword Research Tool
        </div>
        <h1 className="text-5xl md:text-6xl font-black text-white leading-tight max-w-3xl">
          Rank Higher on Etsy.<br />
          <span className="text-purple-400">Sell More.</span>
        </h1>
        <p className="text-white/60 text-lg mt-6 max-w-xl">
          Find the best keywords, analyze your competition, and grow your Etsy shop with real data — not guesswork.
        </p>
        <div className="flex gap-4 mt-10 flex-wrap justify-center">
          <button className="bg-purple-600 hover:bg-purple-500 text-white px-8 py-3.5 rounded-full font-bold text-base transition shadow-lg shadow-purple-500/30">
            Start for Free
          </button>
          <button className="border border-white/20 text-white px-8 py-3.5 rounded-full font-bold text-base hover:bg-white/10 transition">
            See How It Works
          </button>
        </div>
      </section>

      {/* FEATURES */}
      <section className="px-8 py-20 max-w-6xl mx-auto">
        <h2 className="text-3xl font-black text-white text-center mb-14">
          Everything you need to dominate Etsy SEO
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              icon: "🔍",
              title: "Keyword Research",
              desc: "Find high-volume, low-competition keywords that buyers are actually searching for."
            },
            {
              icon: "📊",
              title: "Competition Analysis",
              desc: "See exactly what your competitors are doing and find gaps you can exploit."
            },
            {
              icon: "📈",
              title: "Trend Tracking",
              desc: "Spot trending products before they peak and get ahead of the market."
            },
            {
              icon: "🏷️",
              title: "Tag Generator",
              desc: "Generate perfect tags for your listings in seconds using real search data."
            },
            {
              icon: "⭐",
              title: "Listing Optimizer",
              desc: "Get a score for your listing and actionable tips to improve it instantly."
            },
            {
              icon: "📋",
              title: "Sales Estimator",
              desc: "Estimate monthly sales volume for any product niche on Etsy."
            }
          ].map((f, i) => (
            <div key={i} className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition">
              <div className="text-3xl mb-4">{f.icon}</div>
              <h3 className="text-white font-bold text-lg mb-2">{f.title}</h3>
              <p className="text-white/50 text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* PRICING */}
      <section id="pricing" className="px-8 py-20 max-w-5xl mx-auto">
        <h2 className="text-3xl font-black text-white text-center mb-14">
          Simple, transparent pricing
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              name: "Starter",
              price: "$9",
              desc: "Perfect for new Etsy sellers",
              features: ["50 keyword searches/month", "Basic competition data", "Tag generator", "Email support"],
              highlighted: false
            },
            {
              name: "Pro",
              price: "$19",
              desc: "Most popular for growing shops",
              features: ["Unlimited keyword searches", "Full competition analysis", "Trend tracking", "Listing optimizer", "Priority support"],
              highlighted: true
            },
            {
              name: "Agency",
              price: "$49",
              desc: "For power sellers & agencies",
              features: ["Everything in Pro", "Up to 10 shops", "Sales estimator", "API access", "Dedicated support"],
              highlighted: false
            }
          ].map((plan, i) => (
            <div key={i} className={`rounded-2xl p-8 border ${plan.highlighted
              ? 'bg-purple-600 border-purple-400 shadow-xl shadow-purple-500/30 scale-105'
              : 'bg-white/5 border-white/10'}`}>
              {plan.highlighted && (
                <div className="text-xs font-bold text-purple-200 mb-3 uppercase tracking-widest">Most Popular</div>
              )}
              <h3 className={`text-xl font-black mb-1 ${plan.highlighted ? 'text-white' : 'text-white'}`}>{plan.name}</h3>
              <p className={`text-sm mb-4 ${plan.highlighted ? 'text-purple-200' : 'text-white/50'}`}>{plan.desc}</p>
              <div className={`text-4xl font-black mb-6 ${plan.highlighted ? 'text-white' : 'text-purple-400'}`}>
                {plan.price}<span className="text-base font-normal opacity-70">/mo</span>
              </div>
              <ul className="space-y-3 mb-8">
                {plan.features.map((f, j) => (
                  <li key={j} className={`text-sm flex items-center gap-2 ${plan.highlighted ? 'text-white' : 'text-white/60'}`}>
                    <span className="text-green-400">✓</span> {f}
                  </li>
                ))}
              </ul>
              <button className={`w-full py-3 rounded-full font-bold text-sm transition ${plan.highlighted
                ? 'bg-white text-purple-600 hover:bg-purple-50'
                : 'bg-purple-600 text-white hover:bg-purple-500'}`}>
               <Link href="/login" className={`w-full py-3 rounded-full font-bold text-sm transition block text-center ${plan.highlighted ? 'bg-white text-purple-600 hover:bg-purple-50' : 'bg-purple-600 text-white hover:bg-purple-500'}`}>
  Get Started
</Link>
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-white/10 px-8 py-8 text-center text-white/30 text-sm">
        © 2025 Rankify. All rights reserved.
      </footer>
    </main>
  );
}

