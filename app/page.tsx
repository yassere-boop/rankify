import Link from "next/link";

export default function Home() {
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
          🚀 The #1 Product Research Tool for Online Sellers
        </div>
        <h1 className="text-5xl md:text-6xl font-black text-white leading-tight max-w-4xl">
          Find Winning Products.<br />
          <span className="text-purple-400">Sell Anywhere.</span>
        </h1>
        <p className="text-white/60 text-lg mt-6 max-w-2xl">
          Discover high-demand, low-competition products for Etsy, Redbubble, Amazon, Bubble and more — with real data, not guesswork.
        </p>
        <div className="flex gap-4 mt-10 flex-wrap justify-center">
          <Link href="/login">
            <button className="bg-purple-600 hover:bg-purple-500 text-white px-8 py-3.5 rounded-full font-bold text-base transition shadow-lg shadow-purple-500/30">
              Start for Free
            </button>
          </Link>
          <a href="#features">
            <button className="border border-white/20 text-white px-8 py-3.5 rounded-full font-bold text-base hover:bg-white/10 transition">
              See How It Works
            </button>
          </a>
        </div>

        {/* Platform badges */}
        <div className="flex flex-wrap gap-3 mt-10 justify-center">
          {["Etsy", "Redbubble", "Amazon", "Bubble", "Teepublic", "Shopify", "eBay", "Merch"].map((p) => (
            <span key={p} className="bg-white/5 border border-white/10 text-white/50 text-xs px-4 py-1.5 rounded-full">
              {p}
            </span>
          ))}
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="px-8 py-20 max-w-6xl mx-auto">
        <h2 className="text-3xl font-black text-white text-center mb-4">
          Everything you need to find winning products
        </h2>
        <p className="text-white/40 text-center text-sm mb-14 max-w-xl mx-auto">
          Stop guessing. Use real search data to find products that actually sell — on any platform.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              icon: "🏆",
              title: "Product Analyzer",
              desc: "Get a winning score for any product. Know instantly if it's worth selling before you invest time and money."
            },
            {
              icon: "🔍",
              title: "Keyword Research",
              desc: "Find high-volume, low-competition keywords that buyers are actually searching for across all platforms."
            },
            {
              icon: "📊",
              title: "Competition Analysis",
              desc: "See exactly how saturated a market is and find gaps you can exploit to stand out."
            },
            {
              icon: "📈",
              title: "Trend Tracking",
              desc: "Spot trending products before they peak and get ahead of the market on Etsy, Redbubble and more."
            },
            {
              icon: "🏷️",
              title: "Tag Generator",
              desc: "Generate perfect tags for your listings in seconds using real search data — for any platform."
            },
            {
              icon: "💰",
              title: "Sales Estimator",
              desc: "Estimate monthly revenue potential for any product niche before you start creating."
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

      {/* HOW IT WORKS */}
      <section className="px-8 py-20 max-w-4xl mx-auto">
        <h2 className="text-3xl font-black text-white text-center mb-14">
          How it works
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { step: "01", title: "Enter a product", desc: "Type any product name or paste a listing URL from Etsy, Redbubble, Amazon or any marketplace." },
            { step: "02", title: "Get your score", desc: "Rankify analyzes real search volume, competition level and trends to give you a winning score." },
            { step: "03", title: "Start selling", desc: "Use the keywords, tags and insights to create listings that rank and sell on any platform." },
          ].map((s, i) => (
            <div key={i} className="text-center">
              <div className="text-5xl font-black text-purple-400/30 mb-4">{s.step}</div>
              <h3 className="text-white font-bold text-lg mb-2">{s.title}</h3>
              <p className="text-white/40 text-sm leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* PRICING */}
      <section id="pricing" className="px-8 py-20 max-w-5xl mx-auto">
        <h2 className="text-3xl font-black text-white text-center mb-4">
          Simple, transparent pricing
        </h2>
        <p className="text-white/40 text-center text-sm mb-14">
          Start free. Upgrade when you're ready to scale.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              name: "Starter",
              price: "$9",
              desc: "Perfect for new sellers",
              features: ["50 product analyses/month", "Keyword research", "Tag generator", "Email support"],
              highlighted: false
            },
            {
              name: "Pro",
              price: "$19",
              desc: "Most popular for growing sellers",
              features: ["Unlimited analyses", "Full competition data", "Trend tracking", "Sales estimator", "Priority support"],
              highlighted: true
            },
            {
              name: "Agency",
              price: "$49",
              desc: "For power sellers & agencies",
              features: ["Everything in Pro", "Up to 10 shops", "API access", "Bulk analysis", "Dedicated support"],
              highlighted: false
            }
          ].map((plan, i) => (
            <div key={i} className={`rounded-2xl p-8 border ${plan.highlighted
              ? 'bg-purple-600 border-purple-400 shadow-xl shadow-purple-500/30 scale-105'
              : 'bg-white/5 border-white/10'}`}>
              {plan.highlighted && (
                <div className="text-xs font-bold text-purple-200 mb-3 uppercase tracking-widest">Most Popular</div>
              )}
              <h3 className="text-xl font-black text-white mb-1">{plan.name}</h3>
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
              <Link href="/login" className={`w-full py-3 rounded-full font-bold text-sm transition block text-center ${plan.highlighted
                ? 'bg-white text-purple-600 hover:bg-purple-50'
                : 'bg-purple-600 text-white hover:bg-purple-500'}`}>
                Get Started
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-white/10 px-8 py-8 text-center text-white/30 text-sm">
        © 2025 Rankify. All rights reserved. · 
        <span className="ml-2">Built for Etsy, Redbubble, Amazon, Bubble & more</span>
      </footer>

    </main>
  );
}