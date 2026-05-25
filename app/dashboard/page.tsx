"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import DashLayout from "../components/DashLayout";

function getDynamicChips(): string[] {
  const month = new Date().getMonth() + 1;
  const seasonal: Record<number, string[]> = {
    1: ["valentines day", "winter cozy", "new year goals"],
    2: ["valentines gift", "galentines", "spring prep"],
    3: ["st patricks day", "spring vibes", "easter mom"],
    4: ["mothers day mug", "spring break", "easter hunt"],
    5: ["mothers day gift", "graduation 2026", "teacher gift"],
    6: ["fathers day", "summer vibes", "pride month"],
    7: ["4th of july", "summer beach", "patriotic"],
    8: ["back to school", "teacher gift", "halloween prep"],
    9: ["fall vibes", "pumpkin spice", "halloween"],
    10: ["halloween shirt", "spooky season", "fall aesthetic"],
    11: ["thanksgiving", "black friday", "cozy season"],
    12: ["christmas gift", "holiday mug", "stocking stuffer"],
  };
  const trending = ["matcha lover", "stay at home dad", "boy mom era", "plant mom", "gen z humor"];
  const week = Math.floor(new Date().getDate() / 7);
  return [...(seasonal[month] || []), trending[week % 5], trending[(week + 1) % 5]].slice(0, 8);
}

function parseVolume(volume: string): number {
  if (!volume) return 0;
  const clean = volume.replace(/[~,\s]/g, "").toUpperCase();
  const num = parseFloat(clean.replace(/[^0-9.]/g, "")) || 0;
  if (clean.includes("M")) return num * 1_000_000;
  if (clean.includes("K")) return num * 1_000;
  return num;
}

function calculateScore(volume: string, competition: string, trend: string): number {
  const vol = parseVolume(volume);
  let score = 50;
  if (vol > 10000) score += 20;
  else if (vol > 5000) score += 15;
  else if (vol > 1000) score += 10;
  else if (vol > 500) score += 5;
  else score -= 10;
  if (competition === "Low") score += 25;
  else if (competition === "Medium") score += 5;
  else score -= 25;
  if (trend?.startsWith("↑")) score += 10;
  else if (trend?.startsWith("↓")) score -= 15;
  return Math.max(5, Math.min(95, score));
}

function generateAlternatives(niche: string) {
  const base = niche.toLowerCase().split(" ")[0];
  return [
    { name: `${niche} for nurses`, reason: "Profession-specific = 70% less comp" },
    { name: `vintage ${base}`, reason: "Vintage twist = different buyer pool" },
    { name: `${base} aesthetic 2026`, reason: "Trendy keyword + low comp" },
    { name: `personalized ${base}`, reason: "Custom = 30% higher prices" },
  ];
}

function getPODVerdict(score: number, keyword: string, isEstimated: boolean) {
  if (score >= 65) {
    return {
      verdict: "Great POD Opportunity", emoji: "✅", color: "#34d399",
      bg: "rgba(52,211,153,0.06)", border: "rgba(52,211,153,0.2)", warning: null,
      reasons: ["Solid demand — active buyers in this niche", "Competition is manageable with the right angle", "Personalizable and differentiable niche"],
      design: [`${keyword} with humorous or motivational quote`, `${keyword} + event (birthday, Christmas, Mother's Day)`, `Premium minimalist designs with ${keyword}`, `${keyword} + secondary profession or hobby`],
      avoid: ["Too generic designs", "Copying bestsellers without a unique angle"],
      showAlternatives: false,
    };
  }
  if (score >= 40) {
    return {
      verdict: "Possible — only if you niche down.", emoji: "⚠️", color: "#fbbf24",
      bg: "rgba(251,191,36,0.06)", border: "rgba(251,191,36,0.2)", warning: "We recommend this ONLY if you niche down.",
      reasons: ["Moderate demand — works best as a targeted micro-niche", "Profitable only with a specific angle or personalization", "Differentiation is your main weapon here"],
      design: [`Micro-niche: ${keyword} + profession / breed / region`, `${keyword} with humor or a unique quote`, `Personalized with name or date`],
      avoid: ["Generic designs on this keyword", "No personalization", "Pricing too low against big sellers"],
      showAlternatives: true,
    };
  }
  return {
    verdict: "Avoid for POD", emoji: "🚫", color: "#f87171",
    bg: "rgba(248,113,113,0.06)", border: "rgba(248,113,113,0.2)", warning: null,
    reasons: ["Low demand and/or extreme saturation", "Very hard to differentiate or rank", "Margins likely crushed by competition"],
    design: [],
    avoid: ["Designs without a specific angle", "Generic text without humor or niche", "Copying existing bestsellers"],
    showAlternatives: true,
  };
}

function generateDesignBrief(niche: string, verdictType: string) {
  const n = niche.toLowerCase();
  const isMom = /\b(mom|moms|mother|mothers|mama|mamas|mum|mummy|mommy)\b/.test(n);
  const isDad = /\b(dad|dads|father|fathers|papa|daddy)\b/.test(n);
  const isNurse = /\b(nurse|nurses|medical|rn|cna|icu|nursing)\b/.test(n);
  const isTeacher = /\b(teacher|teachers|professor|educator|kindergarten|preschool)\b/.test(n);
  const isDog = /\b(dog|dogs|puppy|puppies|pup|doggo|retriever|labrador|poodle)\b/.test(n);
  const isCat = /\b(cat|cats|kitten|kittens|kitty|feline)\b/.test(n);
  const isHalloween = /\b(halloween|spooky|witch|witches|ghost|pumpkin|haunted)\b/.test(n);
  const isChristmas = /\b(christmas|xmas|holiday|holidays|santa|noel|elf)\b/.test(n);
  const isMatcha = /\b(matcha|green tea|tea lover)\b/.test(n);
  const isCoffee = /\b(coffee|caffeine|espresso|latte|barista)\b/.test(n);
  const isGym = /\b(gym|fitness|workout|lift|squat|crossfit|yoga|pilates)\b/.test(n);
  const isBook = /\b(book|books|reading|reader|library|bookworm|bibliophile)\b/.test(n);
  const isPlant = /\b(plant|plants|floral|garden|botanical|succulent)\b/.test(n);
  const isVintage = /\b(vintage|retro|aesthetic|y2k|cottagecore|dark academia)\b/.test(n);
  const isFunny = /\b(funny|humor|sarcastic|joke|sassy|witty)\b/.test(n);

  const pick = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

  let concept = "Typography-based design with relatable quote";
  let suggestedText = `"Best ${niche.replace(/\b\w/g, (l: string) => l.toUpperCase())} Ever"`;
  let style = "Minimalist, clean sans-serif, centered composition";
  let colors = ["Sage Green", "Terracotta", "Dusty Blue", "Warm Cream", "Charcoal"];
  let tip = "Focus on readability — buyers scan quickly on mobile. Use high contrast.";

  if (isMom) { concept = "Heartwarming personalized design for moms"; suggestedText = pick([`"Boy Mom Era Est. 2026"`, `"Dog Mom | Certified Chaos Coordinator"`, `"Mama Bear"`]); style = "Soft script + bold sans-serif combo, subtle floral or paw accents"; colors = ["Sage Green", "Terracotta", "Cream", "Dusty Pink", "Charcoal"]; tip = "Add a year or name placeholder for personalization upsell — this doubles conversion."; }
  else if (isDad) { concept = "Humorous dad-centric design with vintage badge feel"; suggestedText = pick([`"Dad Jokes Are How Eye Roll"`, `"Grill Master"`, `"World's Okayest Dad"`]); style = "Retro badge style, distressed texture, bold collegiate typography"; colors = ["Forest Green", "Burnt Orange", "Cream", "Navy", "Charcoal"]; tip = "Dads love self-deprecating humor — lean into dad jokes and grilling references."; }
  else if (isNurse) { concept = "Medical-themed pride design with humor or gratitude"; suggestedText = pick([`"Nurse Life | Caffeine & Care"`, `"ICU Nurse | Off Duty"`, `"Heart of Healthcare"`]); style = "Clean medical aesthetic, heartbeat line accents, bold text"; colors = ["Navy", "Teal", "Cream", "Coral", "Charcoal"]; tip = "Use medical symbols subtly. Nurse Week (May) is peak."; }
  else if (isTeacher) { concept = "Appreciation design for educators with playful energy"; suggestedText = pick([`"Teaching Is My Superpower"`, `"Chaos Coordinator | Teacher"`, `"Teach Love Inspire"`]); style = "Chalkboard texture, playful hand-drawn typography, apple accent"; colors = ["Forest Green", "Mustard", "Cream", "Burnt Orange", "Charcoal"]; tip = "Teacher gifts peak in May and December — bundle with 'Thank You' cards for 2x sales."; }
  else if (isDog) { concept = "Breed-specific or dog parent pride design"; suggestedText = pick([`"Golden Retriever Mom | Hair Everywhere"`, `"Dog Dad | Official Treat Dispenser"`, `"My Dog Is My Therapist"`]); style = "Playful illustration with paw prints, dog silhouettes"; colors = ["Sage Green", "Terracotta", "Cream", "Mustard", "Charcoal"]; tip = "Mention the specific breed in text — 3x more searches."; }
  else if (isCat) { concept = "Cat lover humor with cozy aesthetic"; suggestedText = pick([`"Cat Mom | My House, Their Rules"`, `"Introvert With A Cat Problem"`, `"Crazy Cat Lady In Training"`]); style = "Cute minimalist line art, soft pastel or dark academia palette"; colors = ["Sage Green", "Dusty Pink", "Cream", "Charcoal", "Burnt Orange"]; tip = "Cat + book/coffee combos are trending hard."; }
  else if (isHalloween) { concept = "Spooky seasonal design with humor or aesthetic vibe"; suggestedText = pick([`"Resting Witch Face"`, `"Spooky Season Is My Personality"`, `"Pumpkin Spice & Everything Nice"`]); style = "Gothic typography, vintage horror poster feel, distressed textures"; colors = ["Burnt Orange", "Black", "Sage Green", "Cream", "Deep Purple"]; tip = "Upload by August 1st latest."; }
  else if (isChristmas) { concept = "Holiday gift design with personalization angle"; suggestedText = pick([`"First Christmas As Mom 2026"`, `"Naughty But Nice"`, `"Merry & Bright"`]); style = "Modern sage/mustard palette, cozy typography, subtle snowflakes"; colors = ["Sage Green", "Burgundy", "Cream", "Gold", "Forest Green"]; tip = "Personalized 'First Christmas as...' designs sell 3x more."; }
  else if (isMatcha) { concept = "Matcha lover aesthetic with green tea vibes"; suggestedText = pick([`"Matcha Lover | Leaf Me Alone"`, `"Powered By Matcha"`, `"Green Tea Energy"`]); style = "Soft green palette, hand-drawn matcha bowl illustration, zen aesthetic"; colors = ["Sage Green", "Cream", "Charcoal", "Dusty Pink", "Mustard"]; tip = "Matcha is the FASTEST growing beverage niche on Etsy."; }
  else if (isCoffee) { concept = "Caffeine-themed humor for coffee addicts"; suggestedText = pick([`"Powered By Coffee & Sarcasm"`, `"But First, Coffee"`, `"Don't Talk To Me Yet"`]); style = "Warm earthy tones, handwritten script, coffee stain textures"; colors = ["Brown", "Cream", "Burnt Orange", "Sage Green", "Charcoal"]; tip = "Coffee + profession combos are absolute goldmines."; }
  else if (isGym) { concept = "Motivational fitness design with attitude"; suggestedText = pick([`"Gym Hair Don't Care"`, `"Lifting Spirits & Weights"`, `"Strong Like Mama"`]); style = "Bold athletic typography, dynamic angled text, high contrast"; colors = ["Black", "Neon Green", "Cream", "Charcoal", "Hot Pink"]; tip = "Gym + humor outperforms pure motivation by 40%."; }
  else if (isBook) { concept = "Book lover aesthetic with literary humor"; suggestedText = pick([`"My Weekend Is All Booked"`, `"Fictional Boyfriends > Real Ones"`, `"One More Chapter"`]); style = "Dark academia aesthetic, vintage library feel, serif fonts"; colors = ["Burgundy", "Forest Green", "Cream", "Gold", "Charcoal"]; tip = "Book + fantasy/romance genre references perform best."; }
  else if (isPlant) { concept = "Plant parent pride with boho aesthetic"; suggestedText = pick([`"Plant Mom | Watering My Problems Away"`, `"Crazy Plant Lady"`, `"Plant Hoarder | Proud"`]); style = "Boho botanical illustrations, hand-drawn leaves"; colors = ["Sage Green", "Terracotta", "Cream", "Mustard", "Forest Green"]; tip = "Plant + vintage combos are rising fast."; }
  else if (isVintage) { concept = "Retro aesthetic design with nostalgic typography"; suggestedText = pick([`"Vintage Soul | Modern Heart"`, `"Born In The Wrong Era"`, `"Retro Vibes Only"`]); style = "70s/80s retro palette, distressed textures, groovy typography"; colors = ["Burnt Orange", "Mustard", "Cream", "Avocado Green", "Brown"]; tip = "Vintage + profession or vintage + pet are underserved micro-niches."; }
  else if (isFunny) { concept = "Humor-first design with bold readable typography"; suggestedText = pick([`"Sarcasm Loading... Please Wait"`, `"I'm Not Arguing, I'm Just Explaining"`, `"My People Skills Are Rusty"`]); style = "Bold sans-serif, high contrast, simple background"; colors = ["Black", "Cream", "Burnt Orange", "Charcoal", "Mustard"]; tip = "Funny designs live or die by font choice."; }

  const cleanText = suggestedText.replace(/"/g, "").split(" or ")[0].trim();
  const prompt = `minimalist typography design for white ceramic mug, ${cleanText}, ${style.toLowerCase().split(",")[0]}, ${colors.slice(0, 3).join(" and ")} accents, clean mockup, centered composition, etsy bestselling style, high resolution --ar 1:1`;

  return { concept, suggestedText, style, colors, prompt, tip };
}

export default function Dashboard() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [noResult, setNoResult] = useState(false);
  const [searched, setSearched] = useState("");
  const [limitError, setLimitError] = useState("");
  const [showData, setShowData] = useState(false);
  const [copied, setCopied] = useState(false);

  async function handleAnalyze(kw?: string) {
    const q = (kw || query).trim();
    if (!q) return;
    setQuery(q);
    setLoading(true); setNoResult(false); setResult(null); setLimitError(""); setShowData(false);
    try {
      const res = await fetch("/api/keywords", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ keyword: q.toLowerCase() }),
      });
      const data = await res.json();
      if (data.error === "trial_expired") setLimitError("Your trial has expired. Upgrade to continue.");
      else if (data.error === "limit_reached") setLimitError(data.message);
      else if (data.error || !data.related?.length) setNoResult(true);
      else { setResult(data); setSearched(q); }
    } catch { setNoResult(true); }
    setLoading(false);
  }

  const chips = getDynamicChips();
  const score = result ? calculateScore(result.volume, result.competition, result.trend) : 0;
  const verdict = result ? getPODVerdict(score, searched, result.isEstimated || false) : null;
  const alternatives = verdict?.showAlternatives ? generateAlternatives(searched) : [];
  const isPro = result?.isPro || false;
  const designBrief = result && verdict && verdict.verdict !== "Avoid for POD" ? generateDesignBrief(searched, verdict.verdict) : null;

  return (
    <DashLayout topbarLabel="Markearn · Real-time POD decisions">
      <style jsx global>{`
        .dash-verdict { border-radius: 20px; padding: 28px 32px; margin-bottom: 20px; display: flex; gap: 28px; align-items: stretch; backdrop-filter: blur(12px); }
        .dash-verdict-left { flex: 1; min-width: 0; }
        .dash-verdict-header { display: flex; align-items: center; gap: 14px; margin-bottom: 18px; }
        .dash-verdict-emoji { font-size: 28px; }
        .dash-verdict-tag { font-size: 10px; font-weight: 700; letter-spacing: 0.15em; text-transform: uppercase; margin-bottom: 4px; opacity: 0.8; }
        .dash-verdict-title { font-size: 22px; font-weight: 600; letter-spacing: -0.02em; }
        .dash-verdict-reasons { display: flex; flex-direction: column; gap: 10px; margin-bottom: 14px; }
        .dash-verdict-reason { display: flex; align-items: flex-start; gap: 12px; font-size: 13px; color: rgba(255, 255, 255, 0.75); line-height: 1.55; }
        .dash-verdict-bullet { width: 5px; height: 5px; border-radius: 50%; flex-shrink: 0; margin-top: 7px; }
        .dash-verdict-proof { font-size: 11px; color: rgba(255, 255, 255, 0.25); font-style: italic; margin-bottom: 16px; }
        .dash-verdict-warning { font-size: 12px; font-weight: 600; color: #fbbf24; margin-bottom: 16px; padding: 10px 14px; background: rgba(251, 191, 36, 0.06); border-radius: 10px; border: 1px solid rgba(251, 191, 36, 0.15); }
        .dash-verdict-score { display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 16px 28px; border-left: 1px solid rgba(255, 255, 255, 0.06); min-width: 160px; }
        .dash-verdict-score-num { font-family: "Instrument Serif", serif; font-style: italic; font-size: 72px; font-weight: 400; letter-spacing: -0.04em; line-height: 1; }
        .dash-verdict-score-label { font-size: 10px; font-weight: 600; letter-spacing: 0.15em; text-transform: uppercase; margin-top: 8px; opacity: 0.6; }
        .dash-design-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 12px; }
        .dash-design-card { background: rgba(255, 255, 255, 0.02); border-radius: 12px; padding: 14px 16px; font-size: 12px; color: rgba(255, 255, 255, 0.7); line-height: 1.5; border: 1px solid rgba(255, 255, 255, 0.04); }
        .dash-design-label { font-size: 10px; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase; margin-bottom: 8px; }
        .dash-paywall { position: relative; overflow: hidden; border-radius: 14px; min-height: 140px; }
        .dash-paywall-blur { filter: blur(5px); pointer-events: none; user-select: none; }
        .dash-paywall-overlay { position: absolute; inset: 0; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 6px; background: rgba(8, 9, 13, 0.85); border-radius: 14px; backdrop-filter: blur(4px); padding: 16px; border: 1px solid rgba(255, 255, 255, 0.06); }
        .dash-alts { background: rgba(167, 139, 250, 0.04); border: 1px solid rgba(167, 139, 250, 0.15); border-radius: 18px; padding: 24px 28px; margin-bottom: 20px; backdrop-filter: blur(12px); }
        .dash-alts-title { font-size: 11px; font-weight: 700; letter-spacing: 0.15em; text-transform: uppercase; margin-bottom: 4px; background: linear-gradient(135deg, #a78bfa 0%, #f472b6 100%); -webkit-background-clip: text; background-clip: text; -webkit-text-fill-color: transparent; }
        .dash-alts-sub { font-size: 13px; color: rgba(255, 255, 255, 0.5); margin-bottom: 16px; }
        .dash-alts-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; }
        .dash-alt-item { background: rgba(8, 9, 13, 0.6); border: 1px solid rgba(255, 255, 255, 0.04); border-radius: 12px; padding: 14px 16px; cursor: pointer; transition: all 0.2s; }
        .dash-alt-item:hover { background: rgba(167, 139, 250, 0.06); border-color: rgba(167, 139, 250, 0.25); transform: translateY(-1px); }
        .dash-alt-name { font-size: 13px; font-weight: 600; color: white; margin-bottom: 3px; }
        .dash-alt-reason { font-size: 11px; color: rgba(255, 255, 255, 0.4); }
        .dash-data-toggle { display: flex; align-items: center; gap: 8px; cursor: pointer; font-size: 13px; color: rgba(255, 255, 255, 0.4); background: none; border: none; font-family: inherit; padding: 0; margin-bottom: 20px; transition: color 0.15s; }
        .dash-data-toggle:hover { color: rgba(255, 255, 255, 0.7); }
        .dash-stats { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 14px; margin-bottom: 20px; }
        .dash-stat { background: rgba(255, 255, 255, 0.02); border: 1px solid rgba(255, 255, 255, 0.05); border-radius: 16px; padding: 22px 24px; backdrop-filter: blur(12px); }
        .dash-stat-label { font-size: 10px; font-weight: 600; color: rgba(255, 255, 255, 0.35); letter-spacing: 0.12em; text-transform: uppercase; margin-bottom: 14px; }
        .dash-stat-val { font-family: "Instrument Serif", serif; font-style: italic; font-size: 32px; font-weight: 400; letter-spacing: -0.025em; margin-bottom: 4px; line-height: 1; }
        .dash-stat-sub { font-size: 12px; font-weight: 500; margin-top: 6px; }
        .dash-table-card { background: rgba(255, 255, 255, 0.02); border: 1px solid rgba(255, 255, 255, 0.05); border-radius: 16px; overflow: hidden; backdrop-filter: blur(12px); }
        .dash-table-head { display: flex; align-items: center; justify-content: space-between; padding: 16px 24px; border-bottom: 1px solid rgba(255, 255, 255, 0.04); }
        .dash-table-title { font-size: 11px; font-weight: 600; color: rgba(255, 255, 255, 0.4); letter-spacing: 0.1em; text-transform: uppercase; }
        table.dt { width: 100%; border-collapse: collapse; }
        table.dt th { text-align: left; padding: 11px 24px; font-size: 10px; font-weight: 600; color: rgba(255, 255, 255, 0.3); letter-spacing: 0.12em; text-transform: uppercase; border-bottom: 1px solid rgba(255, 255, 255, 0.03); }
        table.dt td { padding: 13px 24px; font-size: 13px; border-bottom: 1px solid rgba(255, 255, 255, 0.03); }
        table.dt tr:last-child td { border-bottom: none; }
        table.dt tr:hover td { background: rgba(255, 255, 255, 0.02); }
        .dash-result-bar { display: flex; align-items: center; justify-content: space-between; margin-bottom: 24px; padding-bottom: 16px; border-bottom: 1px solid rgba(255, 255, 255, 0.04); flex-wrap: wrap; gap: 10px; }
        @media (max-width: 900px) {
          .dash-verdict { flex-direction: column; }
          .dash-verdict-score { border-left: none; border-top: 1px solid rgba(255, 255, 255, 0.06); padding-top: 18px; }
          .dash-alts-grid, .dash-stats, .dash-design-grid { grid-template-columns: 1fr; }
        }
      `}</style>

      <div className="dash-hero-title">Stop designing <em>blind.</em></div>
      <div className="dash-hero-sub">One verdict. Zero noise. Get a clear POD decision in under 10 seconds.</div>

      <div className="dash-search-row">
        <input className="dash-input" value={query} onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleAnalyze()}
          placeholder='Enter a niche — "matcha lover", "halloween cat", "boy mom era"...' />
        <button className="dash-btn" onClick={() => handleAnalyze()} disabled={loading}>
          {loading ? "Analyzing..." : (<>Analyze<svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M3 8h10m-4-4l4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg></>)}
        </button>
      </div>

      {!result && !limitError && (
        <div className="dash-chips">
          {chips.map((c) => (<button key={c} className="dash-chip" onClick={() => handleAnalyze(c)}>{c}</button>))}
        </div>
      )}

      {limitError && (
        <div className="dash-error-box">
          <span style={{ fontSize: 13, color: "#fca5a5" }}>{limitError}</span>
          <button onClick={() => router.push("/pricing")} style={{ background: "white", color: "black", border: "none", padding: "9px 18px", borderRadius: 10, fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>Upgrade →</button>
        </div>
      )}

      {loading && (
        <div className="dash-loading">
          <div className="dash-spinner" />
          <span style={{ fontSize: 13, color: "rgba(255,255,255,0.4)" }}>Analyzing POD market...</span>
        </div>
      )}

      {noResult && !loading && (
        <div style={{ textAlign: "center", padding: "32px", color: "rgba(255,255,255,0.3)", fontSize: 13 }}>
          No data for "{query}" — try a different keyword
        </div>
      )}

      {result && !loading && verdict && (
        <div className="fade-up">
          <div className="dash-result-bar">
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div className="dash-dot verdict-pulse" />
              <span style={{ fontSize: 12, fontWeight: 600, color: "#34d399", letterSpacing: "0.05em" }}>{result.isEstimated ? "ESTIMATED" : "LIVE"}</span>
              <span style={{ fontSize: 12, color: "rgba(255,255,255,0.35)" }}>· "{searched}"</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              {result.searchesLeft !== undefined && (
                <span style={{ fontSize: 11, padding: "5px 12px", borderRadius: 999, background: "rgba(167,139,250,0.08)", color: "#c4b5fd", fontWeight: 600, border: "1px solid rgba(167,139,250,0.15)" }}>
                  {result.searchesLeft} analyses left
                </span>
              )}
              <button onClick={() => { setResult(null); setQuery(""); setSearched(""); setShowData(false); }}
                style={{ fontSize: 12, color: "rgba(255,255,255,0.3)", cursor: "pointer", background: "none", border: "none", fontFamily: "inherit" }}>✕ Clear</button>
            </div>
          </div>

          <div className="dash-verdict" style={{ background: verdict.bg, border: `1px solid ${verdict.border}` }}>
            <div className="dash-verdict-left">
              <div className="dash-verdict-header">
                <span className="dash-verdict-emoji">{verdict.emoji}</span>
                <div>
                  <div className="dash-verdict-tag" style={{ color: verdict.color }}>POD Verdict</div>
                  <div className="dash-verdict-title" style={{ color: verdict.color }}>{verdict.verdict}</div>
                </div>
              </div>
              <div className="dash-verdict-reasons">
                {verdict.reasons.map((r: string, i: number) => (
                  <div key={i} className="dash-verdict-reason">
                    <div className="dash-verdict-bullet" style={{ background: verdict.color }} />{r}
                  </div>
                ))}
              </div>
              <div className="dash-verdict-proof">
                {result.isEstimated ? "Estimated — limited search data for this niche." : "Verdict based on real market demand & competition data."}
              </div>
              {verdict.warning && <div className="dash-verdict-warning">⚠️ {verdict.warning}</div>}

              {verdict.design.length > 0 && (isPro ? (
                <div className="dash-design-grid">
                  <div>
                    <div className="dash-design-label" style={{ color: verdict.color }}>✏️ What to design</div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                      {verdict.design.map((d: string, i: number) => (<div key={i} className="dash-design-card">→ {d}</div>))}
                    </div>
                  </div>
                  <div>
                    <div className="dash-design-label" style={{ color: "#f87171" }}>🚫 What to avoid</div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                      {verdict.avoid.map((d: string, i: number) => (<div key={i} className="dash-design-card">✕ {d}</div>))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="dash-paywall">
                  <div className="dash-paywall-blur">
                    <div className="dash-design-grid">
                      <div>
                        <div className="dash-design-label" style={{ color: verdict.color }}>✏️ What to design</div>
                        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                          {["dog mom + breed specific", "Funny quotes + personalized", "dog mom + holiday event"].map((d, i) => (<div key={i} className="dash-design-card">→ {d}</div>))}
                        </div>
                      </div>
                      <div>
                        <div className="dash-design-label" style={{ color: "#f87171" }}>🚫 What to avoid</div>
                        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                          {["Generic designs", "No personalization", "Copying bestsellers"].map((d, i) => (<div key={i} className="dash-design-card">✕ {d}</div>))}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="dash-paywall-overlay">
                    <div style={{ fontSize: 13, fontWeight: 700, color: "white" }}>🔒 Pro Feature</div>
                    <div style={{ fontSize: 11, color: "rgba(255,255,255,0.5)", textAlign: "center", maxWidth: 280 }}>Unlock "What to design" & "What to avoid"</div>
                    <button onClick={() => router.push("/pricing")} style={{ background: "white", color: "black", border: "none", padding: "9px 22px", borderRadius: 10, fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "inherit", marginTop: 6 }}>Upgrade to Pro — $39/mo →</button>
                  </div>
                </div>
              ))}
            </div>
            <div className="dash-verdict-score">
              <div className="dash-verdict-score-num" style={{ color: verdict.color }}>{score}</div>
              <div className="dash-verdict-score-label" style={{ color: verdict.color }}>POD Score / 100</div>
            </div>
          </div>

          {designBrief && (
            <div className="fade-up" style={{ marginBottom: 20 }}>
              <div style={{ background: "rgba(167,139,250,0.04)", border: "1px solid rgba(167,139,250,0.15)", borderRadius: 18, padding: "26px 30px", backdropFilter: "blur(12px)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
                  <span style={{ fontSize: 22 }}>🎨</span>
                  <div>
                    <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", background: "linear-gradient(135deg, #a78bfa 0%, #f472b6 100%)", WebkitBackgroundClip: "text", backgroundClip: "text", WebkitTextFillColor: "transparent" }}>Smart Design Brief</div>
                    <div style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", marginTop: 3 }}>Ready-to-use creative direction for "{searched}"</div>
                  </div>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 12, marginBottom: 16 }}>
                  {[
                    { label: "Concept", val: designBrief.concept },
                    { label: "Suggested Text", val: designBrief.suggestedText, italic: true },
                    { label: "Style", val: designBrief.style },
                  ].map((card, i) => (
                    <div key={i} style={{ background: "rgba(255,255,255,0.02)", borderRadius: 12, padding: "16px 18px", border: "1px solid rgba(255,255,255,0.04)" }}>
                      <div style={{ fontSize: 10, fontWeight: 700, color: "rgba(255,255,255,0.3)", textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 8 }}>{card.label}</div>
                      <div style={{ fontSize: 13, color: "rgba(255,255,255,0.85)", lineHeight: 1.55, fontStyle: card.italic ? "italic" : "normal", fontFamily: card.italic ? "Instrument Serif, serif" : "inherit" }}>{card.val}</div>
                    </div>
                  ))}
                  <div style={{ background: "rgba(255,255,255,0.02)", borderRadius: 12, padding: "16px 18px", border: "1px solid rgba(255,255,255,0.04)" }}>
                    <div style={{ fontSize: 10, fontWeight: 700, color: "rgba(255,255,255,0.3)", textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 10 }}>Trending Colors</div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                      {designBrief.colors.map((c: string, i: number) => (
                        <span key={i} style={{ padding: "4px 10px", borderRadius: 999, background: "rgba(52,211,153,0.08)", border: "1px solid rgba(52,211,153,0.15)", color: "#34d399", fontSize: 11, fontWeight: 500 }}>{c}</span>
                      ))}
                    </div>
                  </div>
                </div>
                <div style={{ background: "rgba(8,9,13,0.6)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 12, padding: "16px 18px", marginBottom: 12, position: "relative" }}>
                  <div style={{ fontSize: 10, fontWeight: 700, color: "rgba(255,255,255,0.3)", textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 10 }}>🤖 Midjourney Prompt</div>
                  <div style={{ fontSize: 12, color: "rgba(255,255,255,0.6)", lineHeight: 1.6, fontFamily: "JetBrains Mono, monospace", wordBreak: "break-all", paddingRight: 70 }}>{designBrief.prompt}</div>
                  <button onClick={() => { navigator.clipboard.writeText(designBrief.prompt); setCopied(true); setTimeout(() => setCopied(false), 1500); }}
                    style={{ position: "absolute", top: 14, right: 14, background: copied ? "rgba(52,211,153,0.15)" : "rgba(167,139,250,0.1)", color: copied ? "#34d399" : "#c4b5fd", border: `1px solid ${copied ? "rgba(52,211,153,0.25)" : "rgba(167,139,250,0.2)"}`, padding: "5px 12px", borderRadius: 8, fontSize: 11, fontWeight: 600, cursor: "pointer", fontFamily: "inherit", transition: "all 0.2s" }}>
                    {copied ? "✓ Copied" : "Copy"}
                  </button>
                </div>
                <div style={{ display: "flex", alignItems: "flex-start", gap: 10, padding: "12px 16px", background: "rgba(251,191,36,0.04)", borderRadius: 10, border: "1px solid rgba(251,191,36,0.12)" }}>
                  <span style={{ fontSize: 14 }}>💡</span>
                  <span style={{ fontSize: 12, color: "rgba(255,255,255,0.7)", lineHeight: 1.55 }}>{designBrief.tip}</span>
                </div>
              </div>
            </div>
          )}

          {alternatives.length > 0 && (
            <div className="dash-alts">
              <div className="dash-alts-title">🎯 Better Alternatives</div>
              <div className="dash-alts-sub">This niche is saturated — try these less competitive variants:</div>
              <div className="dash-alts-grid">
                {alternatives.map((alt, i) => (
                  <div key={i} className="dash-alt-item" onClick={() => handleAnalyze(alt.name)}>
                    <div className="dash-alt-name">→ {alt.name}</div>
                    <div className="dash-alt-reason">{alt.reason}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <button className="dash-data-toggle" onClick={() => setShowData(!showData)}>
            <span style={{ fontSize: 14 }}>{showData ? "▾" : "▸"}</span>
            {showData ? "Hide data" : "View data (proof)"}
          </button>

          {showData && (
            <div className="fade-up">
              <div className="dash-stats">
                {[
                  { label: "Monthly Searches", value: result.volume, sub: result.trend, color: result.trend?.startsWith("↑") ? "#34d399" : result.trend?.startsWith("↓") ? "#f87171" : "#fbbf24" },
                  { label: "Competition", value: result.competition, sub: result.compScore ? `Score ${result.compScore}/100` : "Upgrade for exact score", color: result.competition === "Low" ? "#34d399" : result.competition === "Medium" ? "#fbbf24" : "#f87171" },
                  { label: "Opportunity", value: result.opportunity, sub: result.isEstimated ? "Estimated" : "Real-time analysis", color: "#c4b5fd" },
                ].map((s, i) => (
                  <div key={i} className="dash-stat">
                    <div className="dash-stat-label">{s.label}</div>
                    <div className="dash-stat-val" style={{ color: s.color }}>{s.value}</div>
                    <div className="dash-stat-sub" style={{ color: s.color, opacity: 0.65 }}>{s.sub}</div>
                  </div>
                ))}
              </div>
              <div className="dash-table-card">
                <div className="dash-table-head">
                  <span className="dash-table-title">Related Keywords — {result.related.length} results{!isPro && " (3 free · Pro unlocks all 10)"}</span>
                  <div className="dash-dot verdict-pulse" />
                </div>
                <table className="dt">
                  <thead>
                    <tr><th>Keyword</th><th>Searches/mo</th><th>Competition</th><th>Trend</th></tr>
                  </thead>
                  <tbody>
                    {result.related.map((row: any, i: number) => {
                      const compMap: Record<string, { bg: string; text: string; border: string }> = {
                        Low: { bg: "rgba(52,211,153,0.08)", text: "#34d399", border: "rgba(52,211,153,0.2)" },
                        Medium: { bg: "rgba(251,191,36,0.08)", text: "#fbbf24", border: "rgba(251,191,36,0.2)" },
                        High: { bg: "rgba(248,113,113,0.08)", text: "#f87171", border: "rgba(248,113,113,0.2)" },
                      };
                      const cc = compMap[row.comp] || compMap.High;
                      const tc = row.trend?.startsWith("↑") ? "#34d399" : row.trend?.startsWith("↓") ? "#f87171" : "#fbbf24";
                      return (
                        <tr key={i}>
                          <td style={{ color: "white", fontWeight: 500 }}>{row.kw}</td>
                          <td style={{ color: "rgba(255,255,255,0.5)" }}>{row.vol}</td>
                          <td><span style={{ display: "inline-flex", alignItems: "center", padding: "3px 10px", borderRadius: 999, fontSize: 11, fontWeight: 600, background: cc.bg, color: cc.text, border: `1px solid ${cc.border}` }}>{row.comp}</span></td>
                          <td style={{ color: tc, fontWeight: 500 }}>{row.trend}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
                {!isPro && (
                  <div style={{ padding: "16px 24px", borderTop: "1px solid rgba(255,255,255,0.04)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <span style={{ fontSize: 12, color: "rgba(255,255,255,0.4)" }}>7 more keywords hidden</span>
                    <button onClick={() => router.push("/pricing")} style={{ background: "rgba(167,139,250,0.08)", color: "#c4b5fd", border: "1px solid rgba(167,139,250,0.2)", padding: "7px 16px", borderRadius: 10, fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>Unlock with Pro →</button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {!result && !noResult && !loading && !limitError && (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: 280, textAlign: "center" }}>
          <div style={{ fontSize: 44, marginBottom: 16, opacity: 0.15 }}>◎</div>
          <div style={{ fontSize: 16, fontWeight: 500, color: "rgba(255,255,255,0.5)", marginBottom: 8 }}>Ready to analyze</div>
          <div style={{ fontSize: 13, color: "rgba(255,255,255,0.3)", maxWidth: 320, lineHeight: 1.6 }}>Enter a POD niche to get a clear decision — what to design, what to avoid.</div>
        </div>
      )}
    </DashLayout>
  );
}