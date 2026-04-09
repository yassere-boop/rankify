"use client";
import { useState } from "react";

const mockData: Record<string, {
  volume: string; competition: string; compScore: number; opportunity: string; trend: string;
  related: { kw: string; vol: string; comp: string; trend: string }[];
}> = {
  candle: {
    volume: "41K", competition: "High", compScore: 78, opportunity: "Medium", trend: "↑ +5%",
    related: [
      { kw: "handmade soy candle", vol: "24,100", comp: "Medium", trend: "↑ +12%" },
      { kw: "soy wax candle gift", vol: "18,400", comp: "Low", trend: "↑ +8%" },
      { kw: "scented candle set", vol: "41,200", comp: "High", trend: "→ Stable" },
      { kw: "personalised candle", vol: "12,800", comp: "Low", trend: "↑ +31%" },
      { kw: "luxury candle box", vol: "9,300", comp: "Low", trend: "↑ +19%" },
      { kw: "beeswax candle", vol: "7,200", comp: "Low", trend: "↑ +24%" },
      { kw: "candle gift set women", vol: "15,600", comp: "Medium", trend: "↑ +9%" },
      { kw: "aromatherapy candle", vol: "22,400", comp: "Medium", trend: "↑ +14%" },
      { kw: "wedding candle favour", vol: "8,900", comp: "Low", trend: "↑ +37%" },
      { kw: "crystal candle", vol: "11,300", comp: "Low", trend: "↑ +52%" },
    ],
  },
  jewelry: {
    volume: "67K", competition: "High", compScore: 85, opportunity: "Low", trend: "→ Stable",
    related: [
      { kw: "handmade gold necklace", vol: "32,000", comp: "Medium", trend: "↑ +9%" },
      { kw: "personalised bracelet", vol: "28,500", comp: "Low", trend: "↑ +22%" },
      { kw: "silver earrings gift", vol: "19,200", comp: "Medium", trend: "↑ +7%" },
      { kw: "custom name necklace", vol: "44,100", comp: "High", trend: "→ Stable" },
      { kw: "minimalist ring set", vol: "11,300", comp: "Low", trend: "↑ +41%" },
      { kw: "birthstone necklace", vol: "17,800", comp: "Medium", trend: "↑ +18%" },
      { kw: "gold hoop earrings", vol: "29,400", comp: "High", trend: "→ Stable" },
      { kw: "charm bracelet custom", vol: "14,200", comp: "Low", trend: "↑ +29%" },
      { kw: "moon pendant necklace", vol: "9,800", comp: "Low", trend: "↑ +44%" },
      { kw: "stackable rings set", vol: "21,600", comp: "Medium", trend: "↑ +11%" },
    ],
  },
  "digital print": {
    volume: "29K", competition: "Low", compScore: 32, opportunity: "High", trend: "↑ +28%",
    related: [
      { kw: "printable wall art", vol: "38,000", comp: "Medium", trend: "↑ +15%" },
      { kw: "digital download art", vol: "22,400", comp: "Low", trend: "↑ +33%" },
      { kw: "boho print set", vol: "14,800", comp: "Low", trend: "↑ +47%" },
      { kw: "kids room printable", vol: "9,600", comp: "Low", trend: "↑ +19%" },
      { kw: "motivational poster", vol: "17,200", comp: "Medium", trend: "→ Stable" },
      { kw: "watercolour print art", vol: "11,400", comp: "Low", trend: "↑ +38%" },
      { kw: "minimalist line art", vol: "16,800", comp: "Low", trend: "↑ +55%" },
      { kw: "bathroom printable set", vol: "8,200", comp: "Low", trend: "↑ +21%" },
      { kw: "nursery wall art print", vol: "13,600", comp: "Medium", trend: "↑ +17%" },
      { kw: "vintage botanical print", vol: "19,100", comp: "Low", trend: "↑ +42%" },
    ],
  },
  sticker: {
    volume: "38K", competition: "Medium", compScore: 55, opportunity: "High", trend: "↑ +21%",
    related: [
      { kw: "custom vinyl sticker", vol: "31,200", comp: "Medium", trend: "↑ +18%" },
      { kw: "holographic sticker pack", vol: "14,800", comp: "Low", trend: "↑ +63%" },
      { kw: "laptop sticker set", vol: "22,400", comp: "Medium", trend: "↑ +12%" },
      { kw: "cute animal stickers", vol: "18,600", comp: "Low", trend: "↑ +29%" },
      { kw: "planner sticker sheet", vol: "27,300", comp: "Medium", trend: "↑ +9%" },
      { kw: "waterproof sticker pack", vol: "12,900", comp: "Low", trend: "↑ +34%" },
      { kw: "aesthetic sticker bundle", vol: "9,400", comp: "Low", trend: "↑ +71%" },
      { kw: "name label sticker kids", vol: "8,100", comp: "Low", trend: "↑ +15%" },
      { kw: "floral sticker set", vol: "11,700", comp: "Low", trend: "↑ +27%" },
      { kw: "retro sticker pack", vol: "7,800", comp: "Low", trend: "↑ +48%" },
    ],
  },
  tshirt: {
    volume: "54K", competition: "High", compScore: 82, opportunity: "Low", trend: "→ Stable",
    related: [
      { kw: "custom name tshirt", vol: "41,300", comp: "High", trend: "→ Stable" },
      { kw: "funny graphic tee", vol: "33,800", comp: "High", trend: "↑ +6%" },
      { kw: "vintage band tshirt", vol: "27,600", comp: "Medium", trend: "↑ +14%" },
      { kw: "personalised family tshirt", vol: "18,400", comp: "Medium", trend: "↑ +22%" },
      { kw: "oversized aesthetic tee", vol: "14,200", comp: "Low", trend: "↑ +49%" },
      { kw: "matching couple tshirt", vol: "12,800", comp: "Low", trend: "↑ +31%" },
      { kw: "dog mom shirt", vol: "9,600", comp: "Low", trend: "↑ +18%" },
      { kw: "birthday queen tshirt", vol: "11,200", comp: "Medium", trend: "↑ +8%" },
      { kw: "minimalist tshirt design", vol: "8,400", comp: "Low", trend: "↑ +37%" },
      { kw: "embroidered tshirt", vol: "16,900", comp: "Medium", trend: "↑ +26%" },
    ],
  },
  mug: {
    volume: "47K", competition: "High", compScore: 80, opportunity: "Medium", trend: "↑ +7%",
    related: [
      { kw: "personalised coffee mug", vol: "38,400", comp: "High", trend: "↑ +8%" },
      { kw: "funny quote mug", vol: "29,700", comp: "High", trend: "→ Stable" },
      { kw: "custom photo mug", vol: "22,100", comp: "Medium", trend: "↑ +11%" },
      { kw: "teacher gift mug", vol: "16,800", comp: "Medium", trend: "↑ +19%" },
      { kw: "colour changing mug", vol: "12,300", comp: "Low", trend: "↑ +33%" },
      { kw: "travel coffee mug", vol: "19,600", comp: "Medium", trend: "↑ +14%" },
      { kw: "birth month flower mug", vol: "8,900", comp: "Low", trend: "↑ +58%" },
      { kw: "matching couple mugs", vol: "11,400", comp: "Low", trend: "↑ +27%" },
      { kw: "large capacity mug", vol: "7,200", comp: "Low", trend: "↑ +21%" },
      { kw: "cat lover mug gift", vol: "9,800", comp: "Low", trend: "↑ +44%" },
    ],
  },
  wedding: {
    volume: "72K", competition: "High", compScore: 88, opportunity: "Medium", trend: "↑ +11%",
    related: [
      { kw: "personalised wedding gift", vol: "48,200", comp: "High", trend: "↑ +13%" },
      { kw: "wedding table card", vol: "31,600", comp: "Medium", trend: "↑ +9%" },
      { kw: "bride to be sash", vol: "19,400", comp: "Low", trend: "↑ +24%" },
      { kw: "custom wedding sign", vol: "27,800", comp: "Medium", trend: "↑ +16%" },
      { kw: "wedding favour box", vol: "22,300", comp: "Medium", trend: "↑ +18%" },
      { kw: "bridesmaid proposal box", vol: "14,700", comp: "Low", trend: "↑ +41%" },
      { kw: "wedding guest book", vol: "18,900", comp: "Medium", trend: "↑ +7%" },
      { kw: "mrs to be gift bag", vol: "9,600", comp: "Low", trend: "↑ +33%" },
      { kw: "personalised flower girl", vol: "8,100", comp: "Low", trend: "↑ +28%" },
      { kw: "wedding cake topper", vol: "16,400", comp: "Medium", trend: "↑ +12%" },
    ],
  },
  baby: {
    volume: "58K", competition: "High", compScore: 76, opportunity: "Medium", trend: "↑ +16%",
    related: [
      { kw: "personalised baby gift", vol: "44,100", comp: "High", trend: "↑ +14%" },
      { kw: "newborn photo props", vol: "21,800", comp: "Medium", trend: "↑ +22%" },
      { kw: "custom baby blanket", vol: "18,600", comp: "Medium", trend: "↑ +19%" },
      { kw: "baby shower gift set", vol: "32,400", comp: "High", trend: "↑ +11%" },
      { kw: "nursery name sign", vol: "14,200", comp: "Low", trend: "↑ +38%" },
      { kw: "baby milestone cards", vol: "11,900", comp: "Low", trend: "↑ +27%" },
      { kw: "personalised baby mug", vol: "7,800", comp: "Low", trend: "↑ +31%" },
      { kw: "baby memory book", vol: "9,400", comp: "Low", trend: "↑ +24%" },
      { kw: "boho nursery decor", vol: "12,700", comp: "Low", trend: "↑ +47%" },
      { kw: "custom baby onesie", vol: "16,300", comp: "Medium", trend: "↑ +18%" },
    ],
  },
  hoodie: {
    volume: "49K", competition: "High", compScore: 81, opportunity: "Medium", trend: "↑ +13%",
    related: [
      { kw: "custom printed hoodie", vol: "37,200", comp: "High", trend: "↑ +11%" },
      { kw: "oversized hoodie aesthetic", vol: "28,400", comp: "Medium", trend: "↑ +34%" },
      { kw: "matching couple hoodie", vol: "19,600", comp: "Low", trend: "↑ +28%" },
      { kw: "funny quote hoodie", vol: "14,800", comp: "Medium", trend: "↑ +9%" },
      { kw: "vintage graphic hoodie", vol: "22,100", comp: "Medium", trend: "↑ +17%" },
      { kw: "personalised name hoodie", vol: "16,300", comp: "Low", trend: "↑ +22%" },
      { kw: "cat mom hoodie", vol: "8,400", comp: "Low", trend: "↑ +41%" },
      { kw: "anime hoodie custom", vol: "11,700", comp: "Low", trend: "↑ +58%" },
      { kw: "birthday hoodie gift", vol: "9,200", comp: "Low", trend: "↑ +19%" },
      { kw: "zip up hoodie print", vol: "13,600", comp: "Medium", trend: "↑ +14%" },
    ],
  },
  "phone case": {
    volume: "44K", competition: "High", compScore: 79, opportunity: "Medium", trend: "↑ +18%",
    related: [
      { kw: "custom photo phone case", vol: "33,800", comp: "High", trend: "↑ +16%" },
      { kw: "personalised iphone case", vol: "28,200", comp: "High", trend: "↑ +12%" },
      { kw: "aesthetic flower phone case", vol: "17,400", comp: "Low", trend: "↑ +44%" },
      { kw: "name initial phone case", vol: "14,900", comp: "Low", trend: "↑ +31%" },
      { kw: "magsafe wallet case", vol: "21,600", comp: "Medium", trend: "↑ +67%" },
      { kw: "funny quote phone case", vol: "11,300", comp: "Low", trend: "↑ +23%" },
      { kw: "butterfly phone case", vol: "9,800", comp: "Low", trend: "↑ +52%" },
      { kw: "clear glitter phone case", vol: "12,400", comp: "Low", trend: "↑ +29%" },
      { kw: "couple matching phone case", vol: "7,600", comp: "Low", trend: "↑ +38%" },
      { kw: "samsung custom case", vol: "16,200", comp: "Medium", trend: "↑ +14%" },
    ],
  },
  "tote bag": {
    volume: "33K", competition: "Medium", compScore: 58, opportunity: "High", trend: "↑ +32%",
    related: [
      { kw: "personalised canvas tote bag", vol: "24,600", comp: "Medium", trend: "↑ +28%" },
      { kw: "aesthetic tote bag print", vol: "18,200", comp: "Low", trend: "↑ +47%" },
      { kw: "funny quote tote bag", vol: "13,400", comp: "Low", trend: "↑ +33%" },
      { kw: "book lover tote bag", vol: "11,800", comp: "Low", trend: "↑ +41%" },
      { kw: "custom name tote bag", vol: "16,900", comp: "Low", trend: "↑ +24%" },
      { kw: "floral canvas bag", vol: "9,700", comp: "Low", trend: "↑ +38%" },
      { kw: "eco friendly tote bag", vol: "22,300", comp: "Medium", trend: "↑ +19%" },
      { kw: "beach tote bag print", vol: "8,400", comp: "Low", trend: "↑ +29%" },
      { kw: "yoga bag tote", vol: "7,200", comp: "Low", trend: "↑ +22%" },
      { kw: "teacher tote bag gift", vol: "10,600", comp: "Low", trend: "↑ +31%" },
    ],
  },
  poster: {
    volume: "36K", competition: "Medium", compScore: 61, opportunity: "High", trend: "↑ +24%",
    related: [
      { kw: "custom city map poster", vol: "27,400", comp: "Medium", trend: "↑ +21%" },
      { kw: "personalised star map print", vol: "22,800", comp: "Medium", trend: "↑ +33%" },
      { kw: "motivational quote poster", vol: "18,600", comp: "Low", trend: "↑ +16%" },
      { kw: "vintage travel poster", vol: "14,200", comp: "Low", trend: "↑ +28%" },
      { kw: "music lyrics poster", vol: "11,900", comp: "Low", trend: "↑ +44%" },
      { kw: "football stadium poster", vol: "9,400", comp: "Low", trend: "↑ +19%" },
      { kw: "anime art poster", vol: "16,800", comp: "Low", trend: "↑ +57%" },
      { kw: "boho room poster set", vol: "13,600", comp: "Low", trend: "↑ +38%" },
      { kw: "birth poster custom", vol: "8,200", comp: "Low", trend: "↑ +29%" },
      { kw: "retro movie poster print", vol: "12,400", comp: "Low", trend: "↑ +41%" },
    ],
  },
  pillow: {
    volume: "28K", competition: "Medium", compScore: 52, opportunity: "High", trend: "↑ +19%",
    related: [
      { kw: "custom photo pillow", vol: "21,400", comp: "Medium", trend: "↑ +17%" },
      { kw: "personalised name pillow", vol: "16,800", comp: "Low", trend: "↑ +24%" },
      { kw: "funny face pillow", vol: "12,300", comp: "Low", trend: "↑ +38%" },
      { kw: "pet portrait pillow", vol: "9,600", comp: "Low", trend: "↑ +52%" },
      { kw: "boho throw pillow cover", vol: "14,200", comp: "Low", trend: "↑ +29%" },
      { kw: "embroidered pillow custom", vol: "7,800", comp: "Low", trend: "↑ +33%" },
      { kw: "couple pillow set", vol: "8,400", comp: "Low", trend: "↑ +21%" },
      { kw: "velvet cushion cover", vol: "11,900", comp: "Medium", trend: "↑ +14%" },
      { kw: "kids name pillow", vol: "6,700", comp: "Low", trend: "↑ +27%" },
      { kw: "christmas pillow custom", vol: "9,200", comp: "Low", trend: "↑ +44%" },
    ],
  },
  socks: {
    volume: "22K", competition: "Low", compScore: 38, opportunity: "High", trend: "↑ +41%",
    related: [
      { kw: "custom face socks", vol: "17,800", comp: "Low", trend: "↑ +48%" },
      { kw: "personalised photo socks", vol: "13,400", comp: "Low", trend: "↑ +39%" },
      { kw: "funny novelty socks", vol: "19,600", comp: "Medium", trend: "↑ +22%" },
      { kw: "pet portrait socks", vol: "8,900", comp: "Low", trend: "↑ +61%" },
      { kw: "christmas socks custom", vol: "11,200", comp: "Low", trend: "↑ +33%" },
      { kw: "couple matching socks", vol: "7,400", comp: "Low", trend: "↑ +29%" },
      { kw: "food pattern socks", vol: "6,800", comp: "Low", trend: "↑ +44%" },
      { kw: "graduation gift socks", vol: "5,600", comp: "Low", trend: "↑ +18%" },
      { kw: "sports team socks", vol: "9,100", comp: "Low", trend: "↑ +14%" },
      { kw: "groomsmen socks custom", vol: "4,800", comp: "Low", trend: "↑ +37%" },
    ],
  },
  "art print": {
    volume: "31K", competition: "Medium", compScore: 56, opportunity: "High", trend: "↑ +26%",
    related: [
      { kw: "watercolour botanical print", vol: "22,400", comp: "Low", trend: "↑ +34%" },
      { kw: "abstract wall art print", vol: "18,800", comp: "Medium", trend: "↑ +21%" },
      { kw: "line art female portrait", vol: "14,600", comp: "Low", trend: "↑ +48%" },
      { kw: "celestial moon art print", vol: "11,200", comp: "Low", trend: "↑ +57%" },
      { kw: "vintage botanical illustration", vol: "16,900", comp: "Low", trend: "↑ +39%" },
      { kw: "minimalist mountain print", vol: "9,400", comp: "Low", trend: "↑ +31%" },
      { kw: "retro sunset art print", vol: "12,800", comp: "Low", trend: "↑ +44%" },
      { kw: "city skyline print", vol: "8,600", comp: "Low", trend: "↑ +22%" },
      { kw: "japanese wave art print", vol: "7,900", comp: "Low", trend: "↑ +63%" },
      { kw: "pet portrait art print", vol: "13,400", comp: "Low", trend: "↑ +52%" },
    ],
  },
  redbubble: {
    volume: "18K", competition: "Low", compScore: 29, opportunity: "High", trend: "↑ +36%",
    related: [
      { kw: "redbubble sticker pack", vol: "14,200", comp: "Low", trend: "↑ +41%" },
      { kw: "redbubble anime design", vol: "11,800", comp: "Low", trend: "↑ +58%" },
      { kw: "redbubble aesthetic art", vol: "9,600", comp: "Low", trend: "↑ +47%" },
      { kw: "redbubble vintage poster", vol: "7,400", comp: "Low", trend: "↑ +33%" },
      { kw: "redbubble phone case art", vol: "8,900", comp: "Low", trend: "↑ +29%" },
      { kw: "redbubble tshirt design", vol: "12,300", comp: "Low", trend: "↑ +22%" },
      { kw: "redbubble cottagecore", vol: "6,200", comp: "Low", trend: "↑ +71%" },
      { kw: "redbubble dark academia", vol: "5,800", comp: "Low", trend: "↑ +84%" },
      { kw: "redbubble cat art", vol: "8,100", comp: "Low", trend: "↑ +38%" },
      { kw: "redbubble nature print", vol: "7,600", comp: "Low", trend: "↑ +27%" },
    ],
  },
  merch: {
    volume: "24K", competition: "Medium", compScore: 61, opportunity: "High", trend: "↑ +29%",
    related: [
      { kw: "merch by amazon tshirt", vol: "19,400", comp: "Medium", trend: "↑ +24%" },
      { kw: "amazon merch funny quote", vol: "14,800", comp: "Low", trend: "↑ +33%" },
      { kw: "merch hoodie design", vol: "11,200", comp: "Low", trend: "↑ +41%" },
      { kw: "merch on demand print", vol: "8,600", comp: "Low", trend: "↑ +28%" },
      { kw: "amazon merch pop culture", vol: "12,400", comp: "Medium", trend: "↑ +19%" },
      { kw: "merch sweatshirt custom", vol: "9,800", comp: "Low", trend: "↑ +37%" },
      { kw: "merch tank top design", vol: "7,200", comp: "Low", trend: "↑ +22%" },
      { kw: "merch gift idea niche", vol: "6,400", comp: "Low", trend: "↑ +44%" },
      { kw: "amazon merch long sleeve", vol: "8,100", comp: "Low", trend: "↑ +17%" },
      { kw: "merch pop socket design", vol: "5,900", comp: "Low", trend: "↑ +52%" },
    ],
  },
  teepublic: {
    volume: "16K", competition: "Low", compScore: 31, opportunity: "High", trend: "↑ +44%",
    related: [
      { kw: "teepublic funny tshirt", vol: "12,800", comp: "Low", trend: "↑ +38%" },
      { kw: "teepublic anime shirt", vol: "10,400", comp: "Low", trend: "↑ +62%" },
      { kw: "teepublic vintage design", vol: "8,200", comp: "Low", trend: "↑ +47%" },
      { kw: "teepublic cat lover shirt", vol: "6,900", comp: "Low", trend: "↑ +53%" },
      { kw: "teepublic gaming tshirt", vol: "9,600", comp: "Low", trend: "↑ +41%" },
      { kw: "teepublic sticker sheet", vol: "7,100", comp: "Low", trend: "↑ +58%" },
      { kw: "teepublic cottagecore", vol: "5,400", comp: "Low", trend: "↑ +79%" },
      { kw: "teepublic phone case", vol: "6,300", comp: "Low", trend: "↑ +34%" },
      { kw: "teepublic hoodie print", vol: "8,800", comp: "Low", trend: "↑ +29%" },
      { kw: "teepublic nature art", vol: "5,100", comp: "Low", trend: "↑ +44%" },
    ],
  },
  bubble: {
    volume: "12K", competition: "Low", compScore: 24, opportunity: "High", trend: "↑ +67%",
    related: [
      { kw: "bubble marketplace design", vol: "8,400", comp: "Low", trend: "↑ +72%" },
      { kw: "bubble app tshirt seller", vol: "6,200", comp: "Low", trend: "↑ +58%" },
      { kw: "bubble POD shop", vol: "4,800", comp: "Low", trend: "↑ +84%" },
      { kw: "bubble print on demand", vol: "7,100", comp: "Low", trend: "↑ +63%" },
      { kw: "bubble sticker shop", vol: "5,600", comp: "Low", trend: "↑ +71%" },
      { kw: "bubble art marketplace", vol: "4,200", comp: "Low", trend: "↑ +91%" },
      { kw: "bubble seller tips", vol: "3,900", comp: "Low", trend: "↑ +55%" },
      { kw: "bubble custom hoodie", vol: "5,100", comp: "Low", trend: "↑ +68%" },
      { kw: "bubble independent seller", vol: "3,400", comp: "Low", trend: "↑ +77%" },
      { kw: "bubble niche design", vol: "4,700", comp: "Low", trend: "↑ +82%" },
    ],
  },
};

function getCompColor(comp: string) {
  if (comp === "Low") return "text-green-400";
  if (comp === "Medium") return "text-yellow-400";
  return "text-red-400";
}

function getTrendColor(trend: string) {
  if (trend.startsWith("↑")) return "text-green-400";
  if (trend.startsWith("↓")) return "text-red-400";
  return "text-yellow-400";
}

function findData(query: string) {
  const q = query.toLowerCase();
  for (const key of Object.keys(mockData)) {
    if (q.includes(key)) return mockData[key];
  }
  return null;
}

export default function Dashboard() {
  const [query, setQuery] = useState("");
  const [result, setResult] = useState<typeof mockData.candle | null>(null);
  const [loading, setLoading] = useState(false);
  const [noResult, setNoResult] = useState(false);
  const [searched, setSearched] = useState("");

  function handleAnalyze() {
    if (!query.trim()) return;
    setLoading(true);
    setNoResult(false);
    setTimeout(() => {
      const data = findData(query);
      if (data) {
        setResult(data);
        setSearched(query);
        setNoResult(false);
      } else {
        setResult(null);
        setNoResult(true);
      }
      setLoading(false);
    }, 800);
  }

  const menuItems = [
    { icon: "🔍", label: "Keyword Research" },
    { icon: "📊", label: "Competition" },
    { icon: "📈", label: "Trends" },
    { icon: "🏷️", label: "Tag Generator" },
    { icon: "⭐", label: "Listing Optimizer" },
    { icon: "📋", label: "Sales Estimator" },
  ];

  const suggestions = [
    "candle", "jewelry", "sticker", "mug", "tshirt", "wedding", "baby",
    "digital print", "hoodie", "phone case", "tote bag", "poster",
    "pillow", "socks", "art print", "redbubble", "merch", "teepublic", "bubble"
  ];

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex">
      <aside className="w-52 border-r border-white/10 p-4 flex flex-col gap-1 shrink-0">
        <div className="text-xl font-black text-white mb-6">
          Rank<span className="text-purple-400">ify</span>
        </div>
        {menuItems.map((item, i) => (
          <button key={i} className={`flex items-center gap-3 px-3 py-2 rounded-xl text-sm transition text-left
            ${i === 0 ? "bg-purple-600/30 text-purple-300" : "text-white/50 hover:text-white hover:bg-white/5"}`}>
            <span>{item.icon}</span> {item.label}
          </button>
        ))}
      </aside>

      <div className="flex-1 p-8 overflow-auto">
        <div className="flex gap-3 mb-4">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAnalyze()}
            placeholder='Search a keyword, e.g. "candle", "mug", "redbubble"'
            className="flex-1 bg-white/5 border border-white/10 rounded-full px-5 py-3 text-white placeholder-white/30 text-sm outline-none focus:border-purple-500"
          />
          <button
            onClick={handleAnalyze}
            className="bg-purple-600 hover:bg-purple-500 text-white px-6 py-3 rounded-full font-bold text-sm transition min-w-[100px]"
          >
            {loading ? "Analyzing..." : "Analyze"}
          </button>
        </div>

        {!result && !noResult && (
          <div className="flex flex-wrap gap-2 mb-8">
            {suggestions.map((s) => (
              <button key={s} onClick={() => setQuery(s)}
                className="bg-white/5 hover:bg-purple-600/30 border border-white/10 text-white/50 hover:text-purple-300 px-4 py-1.5 rounded-full text-xs transition">
                {s}
              </button>
            ))}
          </div>
        )}

        {noResult && (
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 text-center text-white/50 text-sm mb-6">
            No data for "<span className="text-white">{query}</span>" — try one of the suggestions above.
          </div>
        )}

        {result && (
          <>
            <div className="flex items-center justify-between mb-6">
              <p className="text-white/40 text-sm">Results for <span className="text-white font-semibold">"{searched}"</span></p>
              <button onClick={() => { setResult(null); setQuery(""); setSearched(""); }}
                className="text-white/30 hover:text-white text-xs transition">✕ Clear</button>
            </div>

            <div className="grid grid-cols-3 gap-4 mb-8">
              {[
                { label: "Monthly searches", value: result.volume, sub: result.trend, color: getTrendColor(result.trend) },
                { label: "Competition", value: result.competition, sub: `Score ${result.compScore}/100`, color: getCompColor(result.competition) },
                { label: "Opportunity", value: result.opportunity, sub: "Based on search & competition", color: "text-purple-300" },
              ].map((s, i) => (
                <div key={i} className="bg-white/5 border border-white/10 rounded-2xl p-5">
                  <p className="text-white/40 text-xs mb-1">{s.label}</p>
                  <p className="text-white text-2xl font-black">{s.value}</p>
                  <p className={`text-xs mt-1 ${s.color}`}>{s.sub}</p>
                </div>
              ))}
            </div>

            <p className="text-white/50 text-xs font-bold mb-3 uppercase tracking-widest">
              Related keywords ({result.related.length})
            </p>
            <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left px-5 py-3 text-white/30 text-xs font-semibold">Keyword</th>
                    <th className="text-left px-5 py-3 text-white/30 text-xs font-semibold">Searches/mo</th>
                    <th className="text-left px-5 py-3 text-white/30 text-xs font-semibold">Competition</th>
                    <th className="text-left px-5 py-3 text-white/30 text-xs font-semibold">Trend</th>
                  </tr>
                </thead>
                <tbody>
                  {result.related.map((row, i) => (
                    <tr key={i} className="border-b border-white/5 hover:bg-white/5 transition cursor-pointer">
                      <td className="px-5 py-3 text-purple-300 font-semibold">{row.kw}</td>
                      <td className="px-5 py-3 text-white/70">{row.vol}</td>
                      <td className={`px-5 py-3 font-semibold ${getCompColor(row.comp)}`}>{row.comp}</td>
                      <td className={`px-5 py-3 font-semibold ${getTrendColor(row.trend)}`}>{row.trend}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        {!result && !noResult && (
          <div className="flex flex-col items-center justify-center h-48 text-center">
            <div className="text-4xl mb-4">🔍</div>
            <p className="text-white/50 text-sm">Enter a keyword or click a suggestion above</p>
            <p className="text-white/30 text-xs mt-1">190+ keywords across 19 categories</p>
          </div>
        )}
      </div>
    </main>
  );
}