 import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { product } = await req.json();

  const login = process.env.DATAFORSEO_LOGIN;
  const password = process.env.DATAFORSEO_PASSWORD;
  const base64 = Buffer.from(`${login}:${password}`).toString("base64");

  const seeds = [
    product,
    `${product} handmade`,
    `${product} custom`,
    `${product} gift`,
    `${product} personalised`,
    `${product} etsy`,
    `${product} print`,
    `${product} shop`,
    `buy ${product}`,
    `${product} unique`,
    `${product} redbubble`,
    `${product} design`,
    `${product} art`,
    `${product} vintage`,
    `${product} aesthetic`,
  ];

  try {
    const response = await fetch(
      "https://api.dataforseo.com/v3/keywords_data/google_ads/search_volume/live",
      {
        method: "POST",
        headers: {
          Authorization: `Basic ${base64}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify([
          {
            keywords: seeds,
            language_name: "English",
            location_code: 2840,
          },
        ]),
      }
    );

    const data = await response.json();

    if (!data.tasks || data.tasks[0].status_code !== 20000) {
      return NextResponse.json({ error: "API error" }, { status: 500 });
    }

    const results = data.tasks[0].result || [];

    // Sort by search volume and filter out zero volume
    const sorted = results
      .filter((r: any) => r.search_volume > 0)
      .sort((a: any, b: any) => b.search_volume - a.search_volume);

    // Generate tags from keywords
    const tags = sorted.map((r: any) => ({
      tag: r.keyword,
      volume: r.search_volume,
      competition: r.competition_index < 33 ? "Low" : r.competition_index < 66 ? "Medium" : "High",
      score: Math.round(
        (r.search_volume / 1000) * (1 - r.competition_index / 100) * 100
      ),
    }));

    // Also generate short single-word tags
    const shortTags = product.split(" ").filter((w: string) => w.length > 2).map((w: string) => ({
      tag: w.toLowerCase(),
      volume: 0,
      competition: "Low",
      score: 50,
    }));

    const allTags = [...tags, ...shortTags].slice(0, 13);

    return NextResponse.json({ tags: allTags, product });
  } catch {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
