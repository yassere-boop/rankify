import Link from "next/link";

const plans = [
  {
    name: "Starter",
    price: "$10",
    period: "/month",
    searches: "50 searches/month",
    features: [
      "Keyword Research",
      "Tag Generator",
      "Winning Products",
      "2-day free trial",
    ],
    cta: "Start Free Trial",
    highlight: false,
  },
  {
    name: "Pro",
    price: "$19",
    period: "/month",
    searches: "250 searches/month",
    features: [
      "Everything in Starter",
      "Product Analyzer",
      "Listing Optimizer",
      "Trend Graph",
      "2-day free trial",
    ],
    cta: "Start Free Trial",
    highlight: true,
  },
  {
    name: "Business",
    price: "$29",
    period: "/month",
    searches: "Unlimited searches",
    features: [
      "Everything in Pro",
      "Unlimited Winning Products",
      "Unlimited Refresh",
      "Priority Support",
      "2-day free trial",
    ],
    cta: "Start Free Trial",
    highlight: false,
  },
  {
    name: "Agency",
    price: "$49",
    period: "/month",
    searches: "Unlimited searches",
    features: [
      "Everything in Business",
      "Up to 10 Etsy stores",
      "Multi-store dashboard",
      "Consolidated analytics",
      "Priority Support",
      "2-day free trial",
    ],
    cta: "Start Free Trial",
    highlight: false,
  },
];

export default function Pricing() {
  return (
    <main className="min-h-screen bg-[#0a0812] text-white">
      <div className="fixed inset-0 z-0 pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(rgba(139,92,246,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(139,92,246,0.06) 1px, transparent 1px)`,
          backgroundSize: "60px 60px"
        }} />
      <div className="fixed top-0 right-0 w-[600px] h-[600px] rounded-full pointer-events-none z-0"
        style={{ background: "radial-gradient(circle, rgba(108,59,255,0.15) 0%, transparent 70%)" }} />

      {/* Navbar */}
      <nav className="relative z-10 flex items-center justify-between px-12 py-5 border-b border-purple-900/30">
        <Link href="/" className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-white to-purple-400 bg-clip-text text-transparent">
          Rankify
        </Link>
        <Link href="/sign-up"
          className="bg-purple-600 hover:bg-purple-500 text-white text-sm font-medium px-5 py-2.5 rounded-full transition-all">
          Get Started Free
        </Link>
      </nav>

      {/* Header */}
      <section className="relative z-10 text-center pt-20 pb-16 px-6">
        <div className="inline-flex items-center gap-2 bg-purple-500/10 border border-purple-500/30 rounded-full px-5 py-2 text-sm text-purple-300 mb-8">
          <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse" />
          2-day free trial on all plans
        </div>
        <h1 className="text-5xl font-extrabold tracking-tight mb-4">
          Simple, transparent pricing
        </h1>
        <p className="text-purple-200/50 text-lg max-w-xl mx-auto">
          Start free for 2 days. No credit card required. Cancel anytime.
        </p>
      </section>

      {/* Plans */}
      <section className="relative z-10 max-w-6xl mx-auto px-6 pb-24">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {plans.map((plan) => (
            <div key={plan.name}
              className={`relative rounded-2xl p-6 border transition-all hover:-translate-y-1 ${
                plan.highlight
                  ? "bg-gradient-to-b from-purple-600/20 to-purple-900/10 border-purple-500/50 shadow-[0_0_40px_rgba(108,59,255,0.2)]"
                  : "bg-white/03 border-purple-500/15"
              }`}>
              {plan.highlight && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-purple-600 text-white text-xs font-bold px-4 py-1 rounded-full">
                  Most Popular
                </div>
              )}

              <div className="mb-6">
                <p className="text-purple-300/60 text-sm font-medium mb-2">{plan.name}</p>
                <div className="flex items-end gap-1 mb-1">
                  <span className="text-4xl font-extrabold text-white">{plan.price}</span>
                  <span className="text-purple-300/50 text-sm mb-1">{plan.period}</span>
                </div>
                <p className="text-purple-300/40 text-xs">{plan.searches}</p>
              </div>

              <ul className="flex flex-col gap-2.5 mb-8">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm text-purple-200/70">
                    <span className="text-purple-400 mt-0.5 shrink-0">✓</span>
                    {f}
                  </li>
                ))}
              </ul>

              <Link href="/sign-up"
                className={`block text-center py-3 rounded-xl font-semibold text-sm transition-all ${
                  plan.highlight
                    ? "bg-purple-600 hover:bg-purple-500 text-white shadow-[0_0_20px_rgba(108,59,255,0.4)]"
                    : "bg-white/05 hover:bg-purple-600/20 text-white border border-purple-500/20"
                }`}>
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>

        {/* FAQ */}
        <div className="mt-20 text-center">
          <p className="text-purple-200/40 text-sm">
            Questions? Contact us at{" "}
            <a href="mailto:yasserelkachabi@gmail.com" className="text-purple-400 hover:text-white transition-colors">
              yasserelkachabi@gmail.com
            </a>
          </p>
        </div>
      </section>
    </main>
  );
}