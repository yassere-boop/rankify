"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const LIVE = ["2,847 sellers online now", "143 searches this minute", "89 listings optimized today", "1,204 tags generated today"];

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

function calculateScore(volume: string, competition: string, trend: string): number {
  const vol = parseInt(volume?.replace(/[^0-9]/g, "") || "0");
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

function getPODVerdict(volume: string, competition: string, trend: string, keyword: string) {
  const vol = parseInt(volume?.replace(/[^0-9]/g, "") || "0");
  const isGeneric = ["candle", "mug", "shirt", "hoodie", "tshirt", "poster"].includes(keyword.toLowerCase().trim());
  const isHighComp = competition === "High";
  const isRising = trend?.startsWith("↑");
  const hasVolume = vol > 1000;

  if (isGeneric && isHighComp) {
    return {
      verdict: "Avoid for POD", emoji: "🚫", color: "#f87171",
      bg: "rgba(248,113,113,0.06)", border: "rgba(248,113,113,0.2)", warning: null,
      reasons: ["Keyword too generic — impossible to differentiate", "Extreme saturation — thousands of similar designs already", "Margins crushed by competition"],
      design: [], avoid: ["Designs without a specific angle", "Generic text without humor or niche", "Copying existing bestsellers"],
      showAlternatives: true,
    };
  }
  if (!hasVolume) {
    return {
      verdict: "Possible — only if you niche down.", emoji: "⚠️", color: "#fbbf24",
      bg: "rgba(251,191,36,0.06)", border: "rgba(251,191,36,0.2)", warning: "We recommend this ONLY if you niche down.",
      reasons: ["Low demand — niche market only", "Little competition — easy to rank if well targeted", "Works well with strong personalization"],
      design: [`${keyword} with humor or unique quote`, `Personalized with name or date`, `Combined with another niche (e.g. ${keyword} + nurse)`],
      avoid: ["Designs without personalization", "Waiting for high volume that won't come"],
      showAlternatives: false,
    };
  }
  if (isHighComp && !isRising) {
    return {
      verdict: "Possible — only if you niche down.", emoji: "⚠️", color: "#fbbf24",
      bg: "rgba(251,191,36,0.06)", border: "rgba(251,191,36,0.2)", warning: "We recommend this ONLY if you niche down.",
      reasons: ["Good demand but high saturation", "Profitable only with a very specific angle", "Personalization is your only weapon here"],
      design: [`Micro-niche: ${keyword} + profession/breed/region`, `Humor specific to the community`, `Premium minimalist designs`],
      avoid: ["Generic designs on this keyword", "Pricing too low against big sellers", "No personalization"],
      showAlternatives: true,
    };
  }
  return {
    verdict: "Great POD Opportunity", emoji: "✅", color: "#34d399",
    bg: "rgba(52,211,153,0.06)", border: "rgba(52,211,153,0.2)", warning: null,
    reasons: [
      `Solid demand${isRising ? " and growing" : ""} — active buyers in this niche`,
      competition === "Low" ? "Low competition — easy to rank quickly" : "Manageable competition with the right angle",
      "Personalizable and differentiable niche",
    ],
    design: [
      `${keyword} with humorous or motivational quote`,
      `${keyword} + event (birthday, Christmas, Mother's Day)`,
      `Premium minimalist designs with ${keyword}`,
      `${keyword} + secondary profession or hobby`,
    ],
    avoid: ["Too generic designs", "Copying bestsellers without a unique angle"],
    showAlternatives: false,
  };
}

function generateDesignBrief(niche: string, verdictType: string) {
  const n = niche.toLowerCase();
  const isMom = /\b(mom|moms|mother|mothers|mama|mamas|mum|mummy|mommy)\b/.test(n);
  const isDad = /\b(dad|dads|father|fathers|papa|daddy)\b/.test(n);
  const isGrandma = /\b(grandma|grandmas|grandmother|nana|granny|nonna|abuela)\b/.test(n);
  const isGrandpa = /\b(grandpa|grandpas|grandfather|grandad|papaw|opa)\b/.test(n);
  const isSister = /\b(sister|sisters|sis)\b/.test(n);
  const isBrother = /\b(brother|brothers|bro)\b/.test(n);
  const isAunt = /\b(aunt|aunts|auntie|aunty)\b/.test(n);
  const isUncle = /\b(uncle|uncles|unc)\b/.test(n);
  const isNurse = /\b(nurse|nurses|medical|rn|cna|icu|nursing)\b/.test(n);
  const isDoctor = /\b(doctor|doctors|md|physician|surgeon)\b/.test(n);
  const isTeacher = /\b(teacher|teachers|professor|educator|kindergarten|preschool)\b/.test(n);
  const isLawyer = /\b(lawyer|lawyers|attorney|esquire|esq|legal)\b/.test(n);
  const isEngineer = /\b(engineer|engineers|developer|programmer|coder|software)\b/.test(n);
  const isAccountant = /\b(accountant|accountants|cpa|finance|bookkeeper)\b/.test(n);
  const isFirefighter = /\b(firefighter|firefighters|fireman|fire dept)\b/.test(n);
  const isPolice = /\b(police|cop|cops|officer|sheriff)\b/.test(n);
  const isChef = /\b(chef|chefs|cook|baker|culinary)\b/.test(n);
  const isPharmacist = /\b(pharmacist|pharmacists|pharmacy|pharm tech)\b/.test(n);
  const isGrad = /\b(grad|grads|graduation|class of|senior|graduate)\b/.test(n);
  const isWedding = /\b(wedding|weddings|bride|groom|bridesmaid|engagement)\b/.test(n);
  const isBirthday = /\b(birthday|birthdays|bday|birth)\b/.test(n);
  const isDog = /\b(dog|dogs|puppy|puppies|pup|doggo|retriever|labrador|poodle)\b/.test(n);
  const isCat = /\b(cat|cats|kitten|kittens|kitty|feline)\b/.test(n);
  const isHorse = /\b(horse|horses|equestrian|cowgirl|cowboy)\b/.test(n);
  const isHalloween = /\b(halloween|spooky|witch|witches|ghost|pumpkin|haunted)\b/.test(n);
  const isChristmas = /\b(christmas|xmas|holiday|holidays|santa|noel|elf)\b/.test(n);
  const isValentine = /\b(valentine|valentines|love day|romantic)\b/.test(n);
  const isThanksgiving = /\b(thanksgiving|turkey|grateful|harvest)\b/.test(n);
  const isStPatrick = /\b(st patrick|saint patrick|shamrock|irish)\b/.test(n);
  const isEaster = /\b(easter|bunny|egg hunt)\b/.test(n);
  const isPride = /\b(pride|lgbt|lgbtq|gay|lesbian|trans|ally|rainbow)\b/.test(n);
  const isFourthJuly = /\b(4th of july|fourth of july|patriotic|independence|america)\b/.test(n);
  const isCoffee = /\b(coffee|caffeine|espresso|latte|barista)\b/.test(n);
  const isMatcha = /\b(matcha|green tea|tea lover)\b/.test(n);
  const isWine = /\b(wine|wines|vino|sommelier|wino)\b/.test(n);
  const isGym = /\b(gym|fitness|workout|lift|squat|crossfit|yoga|pilates)\b/.test(n);
  const isRunner = /\b(runner|runners|running|marathon|5k|10k)\b/.test(n);
  const isBook = /\b(book|books|reading|reader|library|bookworm|bibliophile)\b/.test(n);
  const isPlant = /\b(plant|plants|floral|garden|botanical|succulent)\b/.test(n);
  const isCrochet = /\b(crochet|knit|knitting|yarn|crocheter)\b/.test(n);
  const isArt = /\b(artist|artists|art|painter|painting|drawing|illustration)\b/.test(n);
  const isPhoto = /\b(photographer|photographers|photography|camera|lens)\b/.test(n);
  const isMusic = /\b(music|musician|guitar|piano|drummer|singer|band)\b/.test(n);
  const isGamer = /\b(gamer|gamers|gaming|video game|xbox|playstation|nintendo|streamer)\b/.test(n);
  const isSwiftie = /\b(taylor swift|swiftie|swifties|eras tour)\b/.test(n);
  const isKpop = /\b(kpop|k-pop|bts|blackpink|stray kids)\b/.test(n);
  const isHarryPotter = /\b(harry potter|hogwarts|wizard|gryffindor|slytherin)\b/.test(n);
  const isMarvel = /\b(marvel|avenger|avengers|spiderman|iron man)\b/.test(n);
  const isAnime = /\b(anime|manga|otaku|naruto|dragon ball)\b/.test(n);
  const isDisney = /\b(disney|princess|mickey|minnie)\b/.test(n);
  const isBossbabe = /\b(boss babe|girl boss|hustle|entrepreneur|ceo|millionaire)\b/.test(n);
  const isMentalHealth = /\b(mental health|therapy|anxiety|self care|mindfulness|meditation)\b/.test(n);
  const isMinimalist = /\b(minimalist|minimal|simple|clean)\b/.test(n);
  const isVintage = /\b(vintage|retro|aesthetic|y2k|cottagecore|dark academia)\b/.test(n);
  const isFunny = /\b(funny|humor|sarcastic|joke|sassy|witty)\b/.test(n);

  const pick = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

  let concept = "Typography-based design with relatable quote";
  let suggestedText = `"Best ${niche.replace(/\b\w/g, (l: string) => l.toUpperCase())} Ever"`;
  let style = "Minimalist, clean sans-serif, centered composition";
  let colors = ["Sage Green", "Terracotta", "Dusty Blue", "Warm Cream", "Charcoal"];
  let tip = "Focus on readability — buyers scan quickly on mobile. Use high contrast.";

  if (isMom) { concept = "Heartwarming personalized design for moms"; suggestedText = pick([`"Boy Mom Era Est. 2026"`, `"Dog Mom | Certified Chaos Coordinator"`, `"Mama Bear | Don't Mess With My Cubs"`]); style = "Soft script + bold sans-serif combo, subtle floral or paw accents"; colors = ["Sage Green", "Terracotta", "Cream", "Dusty Pink", "Charcoal"]; tip = "Add a year or name placeholder for personalization upsell — this doubles conversion."; }
  else if (isDad) { concept = "Humorous dad-centric design with vintage badge feel"; suggestedText = pick([`"Dad Jokes Are How Eye Roll"`, `"Grill Master | Dad of The Year"`, `"World's Okayest Dad"`]); style = "Retro badge style, distressed texture, bold collegiate typography"; colors = ["Forest Green", "Burnt Orange", "Cream", "Navy", "Charcoal"]; tip = "Dads love self-deprecating humor — lean into dad jokes and grilling references."; }
  else if (isGrandma) { concept = "Sentimental grandmother design with elegance"; suggestedText = pick([`"Grandma | Because Mom Said No"`, `"World's Best Grandma | Est. 2024"`, `"Spoiling Grandkids Is My Cardio"`]); style = "Elegant script with floral border, soft pastels, vintage feel"; colors = ["Dusty Rose", "Sage Green", "Cream", "Lavender", "Gold"]; tip = "Grandma gifts peak at Mother's Day, Christmas + birthdays. Always offer name personalization."; }
  else if (isGrandpa) { concept = "Grandfather pride design with rugged charm"; suggestedText = pick([`"Grandpa | The Man, The Myth, The Legend"`, `"World's Best Grandpa | Est. 2024"`, `"Papa | I Have All The Snacks"`]); style = "Vintage badge, distressed leather feel, bold serif typography"; colors = ["Brown", "Forest Green", "Cream", "Navy", "Mustard"]; tip = "Grandpa designs are an underserved market — less than 1/4 the competition of grandma niches."; }
  else if (isSister) { concept = "Sisterhood bond design with humor or sentiment"; suggestedText = pick([`"Big Sister | Bossy & Proud"`, `"Sister | My Built-In Best Friend"`, `"Sisters Are Like Stars"`]); style = "Elegant script, soft pastel palette, floral accents"; colors = ["Dusty Pink", "Sage Green", "Cream", "Lavender", "Rose Gold"]; tip = "Sister designs sell most at Christmas + birthdays. Bundle with matching mug + tote for higher AOV."; }
  else if (isBrother) { concept = "Brotherhood bond design with humor and pride"; suggestedText = pick([`"Big Brother | The Original Bodyguard"`, `"Brother | Annoying Since Birth"`, `"Best Brother Ever"`]); style = "Bold sans-serif, distressed badge style, masculine palette"; colors = ["Navy", "Forest Green", "Charcoal", "Cream", "Burnt Orange"]; tip = "Brother designs are underserved — sister has 5x more listings. Big opportunity here."; }
  else if (isAunt) { concept = "Cool aunt design with sass and love"; suggestedText = pick([`"Auntie | Like A Mom But Way Cooler"`, `"World's Best Aunt"`, `"Aunt Mode: Activated"`]); style = "Trendy script + bold modern sans-serif, playful colors"; colors = ["Terracotta", "Sage Green", "Cream", "Mustard", "Dusty Pink"]; tip = "Aunt designs trend on TikTok — tap into 'cool aunt' aesthetic for Gen Z buyers."; }
  else if (isUncle) { concept = "Cool uncle design with humor and confidence"; suggestedText = pick([`"Uncle | The Fun One"`, `"World's Best Uncle | I Pay The Cool Tax"`, `"Uncle Vibes Only"`]); style = "Bold sans-serif, vintage badge style"; colors = ["Navy", "Forest Green", "Cream", "Mustard", "Charcoal"]; tip = "Uncle is one of the LEAST competitive family niches — easy ranking opportunity."; }
  else if (isNurse) { concept = "Medical-themed pride design with humor or gratitude"; suggestedText = pick([`"Nurse Life | Caffeine & Care"`, `"ICU Nurse | Off Duty"`, `"Nurses | Heart of Healthcare"`]); style = "Clean medical aesthetic, heartbeat line accents, stethoscope silhouette, bold text"; colors = ["Navy", "Teal", "Cream", "Coral", "Charcoal"]; tip = "Use medical symbols subtly. Nurse Week (May) is peak."; }
  else if (isDoctor) { concept = "Professional medical pride design"; suggestedText = pick([`"Doctor | Healing Hands, Caring Heart"`, `"MD Mode: Activated"`, `"Trust Me, I'm A Doctor"`]); style = "Clean professional aesthetic, stethoscope element, elegant serif"; colors = ["Navy", "White", "Charcoal", "Burgundy", "Gold"]; tip = "Match Day (March) and graduation season are peak. Add specialization for higher conversion."; }
  else if (isTeacher) { concept = "Appreciation design for educators with playful energy"; suggestedText = pick([`"Teaching Is My Superpower"`, `"Chaos Coordinator | Teacher"`, `"Teach Love Inspire | Repeat"`]); style = "Chalkboard texture background, playful hand-drawn typography, apple accent"; colors = ["Forest Green", "Mustard", "Cream", "Burnt Orange", "Charcoal"]; tip = "Teacher gifts peak in May and December — bundle with 'Thank You' cards for 2x sales."; }
  else if (isLawyer) { concept = "Lawyer pride design with sophistication"; suggestedText = pick([`"Lawyer | Objection Sustained"`, `"Esq. Mode: Activated"`, `"Trust Me, I'm A Lawyer"`]); style = "Classic serif typography, scales of justice element, premium feel"; colors = ["Navy", "Burgundy", "Cream", "Gold", "Charcoal"]; tip = "Bar exam passing season (May/Oct) and graduation are peak. Premium designs sell at $35+."; }
  else if (isEngineer) { concept = "Tech professional design with humor"; suggestedText = pick([`"Software Engineer | It Works On My Machine"`, `"Code. Coffee. Repeat."`, `"Engineer Mode: Debugging Life"`]); style = "Monospace typography, circuit board patterns, tech aesthetic"; colors = ["Charcoal", "Electric Blue", "Cream", "Mint Green", "Navy"]; tip = "Software engineer + coffee combos are GOLD."; }
  else if (isAccountant) { concept = "Accountant pride with witty financial humor"; suggestedText = pick([`"Accountant | I Make It Count"`, `"Tax Season Survivor"`, `"In Spreadsheets We Trust"`]); style = "Clean professional sans-serif, calculator/numbers accent"; colors = ["Navy", "Forest Green", "Cream", "Gold", "Charcoal"]; tip = "Tax season (Jan-April) is peak."; }
  else if (isFirefighter) { concept = "Firefighter pride with bold heroic feel"; suggestedText = pick([`"Firefighter | Run Toward The Fire"`, `"Firefighter Family | Brotherhood"`, `"Off Duty Firefighter"`]); style = "Bold distressed typography, fire/flame accents, masculine palette"; colors = ["Red", "Black", "Cream", "Charcoal", "Yellow"]; tip = "Firefighter family designs sell better than direct firefighter."; }
  else if (isPolice) { concept = "Law enforcement pride design"; suggestedText = pick([`"Police | Thin Blue Line"`, `"Off Duty Officer"`, `"Police Wife | Loving My Hero"`]); style = "Bold typography, badge-style design, navy/black palette"; colors = ["Navy", "Black", "Cream", "Charcoal", "Yellow"]; tip = "Police family designs outperform direct officer designs by 3x."; }
  else if (isChef) { concept = "Culinary professional design with humor"; suggestedText = pick([`"Chef | I Don't Trust Skinny Cooks"`, `"Master of The Kitchen"`, `"Salt Bae Vibes Only"`]); style = "Vintage restaurant feel, knife/whisk accents, bold typography"; colors = ["Burgundy", "Cream", "Forest Green", "Mustard", "Charcoal"]; tip = "Chef designs sell well on Father's Day + Mother's Day."; }
  else if (isPharmacist) { concept = "Pharmacy pride design with medical humor"; suggestedText = pick([`"Pharmacist | Drug Dealer With A License"`, `"Pharmacy Tech Life"`, `"Trust Me, I'm A Pharmacist"`]); style = "Clean medical aesthetic, pill/Rx accents, professional palette"; colors = ["Teal", "Navy", "Cream", "Coral", "Charcoal"]; tip = "Pharmacist niche has 1/10 the competition of nurse."; }
  else if (isGrad) { concept = "Celebration design for graduates with elegant typography"; suggestedText = pick([`"Class of 2026 | The Tassel Was Worth The Hassle"`, `"Graduate Mode: Activated"`, `"She Did It | Class of 2026"`]); style = "Elegant serif + script combo, gold foil accent effect, diploma scroll elements"; colors = ["Navy", "Gold", "Cream", "Burgundy", "Black"]; tip = "Always include the exact graduation year."; }
  else if (isWedding) { concept = "Wedding celebration design with elegant romance"; suggestedText = pick([`"Mrs. Est. 2026"`, `"Bride Squad | Wedding Crew"`, `"I Said Yes | Engaged 2026"`]); style = "Elegant calligraphy + thin sans-serif, gold/rose gold accents"; colors = ["Rose Gold", "Cream", "Sage Green", "Dusty Blue", "Champagne"]; tip = "Wedding party gifts sell as bundles."; }
  else if (isBirthday) { concept = "Birthday celebration design with personalized year"; suggestedText = pick([`"Birthday Queen Est. 2026"`, `"30 And Thriving"`, `"Birthday Vibes Only"`]); style = "Bold playful typography, confetti accents, fun palette"; colors = ["Hot Pink", "Gold", "Cream", "Lavender", "Mint Green"]; tip = "Milestone birthdays (30, 40, 50) sell 3x more."; }
  else if (isDog) { concept = "Breed-specific or dog parent pride design"; suggestedText = pick([`"Golden Retriever Mom | Hair Everywhere"`, `"Dog Dad | Official Treat Dispenser"`, `"My Dog Is My Therapist"`]); style = "Playful illustration style with paw prints, dog silhouettes, bone accents"; colors = ["Sage Green", "Terracotta", "Cream", "Mustard", "Charcoal"]; tip = "Mention the specific breed in text — 3x more searches."; }
  else if (isCat) { concept = "Cat lover humor with cozy aesthetic"; suggestedText = pick([`"Cat Mom | My House, Their Rules"`, `"Introvert With A Cat Problem"`, `"Crazy Cat Lady In Training"`]); style = "Cute minimalist line art, soft pastel or dark academia palette, whisker details"; colors = ["Sage Green", "Dusty Pink", "Cream", "Charcoal", "Burnt Orange"]; tip = "Cat + book/coffee combos are trending hard."; }
  else if (isHorse) { concept = "Horse lover design with cowgirl charm"; suggestedText = pick([`"Horse Girl | Forever And Always"`, `"Saved By A Horse"`, `"Cowgirl At Heart"`]); style = "Western/boho aesthetic, horse silhouette, vintage typography"; colors = ["Brown", "Cream", "Sage Green", "Burnt Orange", "Mustard"]; tip = "Horse lover designs underserved on Etsy."; }
  else if (isHalloween) { concept = "Spooky seasonal design with humor or aesthetic vibe"; suggestedText = pick([`"Resting Witch Face"`, `"Spooky Season Is My Personality"`, `"Pumpkin Spice & Everything Nice"`]); style = "Gothic typography, vintage horror poster feel, distressed textures"; colors = ["Burnt Orange", "Black", "Sage Green", "Cream", "Deep Purple"]; tip = "Upload by August 1st latest."; }
  else if (isChristmas) { concept = "Holiday gift design with personalization angle"; suggestedText = pick([`"First Christmas As Mom 2026"`, `"Merry Christmas | [Family Name]"`, `"Naughty But Nice"`]); style = "Modern sage/mustard palette, cozy typography, subtle snowflakes"; colors = ["Sage Green", "Burgundy", "Cream", "Gold", "Forest Green"]; tip = "Personalized 'First Christmas as...' designs sell 3x more."; }
  else if (isValentine) { concept = "Valentine's romantic or anti-valentine design"; suggestedText = pick([`"You're My Person"`, `"Anti-Valentine | Self Love Is Best Love"`, `"Galentine's Day | February 13th"`]); style = "Soft script + bold sans-serif, heart accents, romantic palette"; colors = ["Dusty Rose", "Burgundy", "Cream", "Gold", "Sage Green"]; tip = "Anti-valentine designs outsell romantic ones for single buyers."; }
  else if (isThanksgiving) { concept = "Thanksgiving gratitude design with cozy fall feel"; suggestedText = pick([`"Grateful Thankful Blessed"`, `"Eat Drink & Be Cozy"`, `"Family Thanksgiving 2026"`]); style = "Warm fall palette, hand-lettered typography, leaf accents"; colors = ["Burnt Orange", "Sage Green", "Cream", "Mustard", "Burgundy"]; tip = "Family Thanksgiving designs sell as multi-pack."; }
  else if (isStPatrick) { concept = "Irish pride design with humor and shamrocks"; suggestedText = pick([`"Lucky Mama | St. Paddy's"`, `"Irish I Was Drinking"`, `"Lucky Charm | Born March 17"`]); style = "Vintage Irish badge style, shamrock accents, bold typography"; colors = ["Forest Green", "Cream", "Gold", "Sage Green", "Charcoal"]; tip = "Upload by January for best ranking."; }
  else if (isEaster) { concept = "Easter celebration with cute pastel aesthetic"; suggestedText = pick([`"Hoppy Easter Mama"`, `"My First Easter 2026"`, `"Some Bunny Loves You"`]); style = "Soft pastel palette, bunny/egg illustrations, playful typography"; colors = ["Dusty Pink", "Sage Green", "Cream", "Lavender", "Mint Green"]; tip = "Baby's First Easter designs sell big."; }
  else if (isPride) { concept = "Pride celebration with bold inclusive design"; suggestedText = pick([`"Love Is Love"`, `"Pride Mom | Proud Ally"`, `"Proud To Be Me"`]); style = "Bold rainbow palette, modern sans-serif, inclusive imagery"; colors = ["Rainbow Spectrum", "Black", "Cream", "Hot Pink", "Sky Blue"]; tip = "Ally designs sell as well as direct community designs."; }
  else if (isFourthJuly) { concept = "Patriotic celebration with vintage Americana"; suggestedText = pick([`"USA Mama | Land of The Free"`, `"4th of July Vibes"`, `"Red White & Boozy"`]); style = "Vintage Americana, distressed textures, bold patriotic typography"; colors = ["Navy", "Red", "Cream", "Gold", "Charcoal"]; tip = "Vintage distressed style outsells clean modern by 2x."; }
  else if (isMatcha) { concept = "Matcha lover aesthetic with green tea vibes"; suggestedText = pick([`"Matcha Lover | Leaf Me Alone"`, `"Powered By Matcha"`, `"Matcha Mama | Green Tea Energy"`]); style = "Soft green palette, hand-drawn matcha bowl illustration, zen aesthetic"; colors = ["Sage Green", "Cream", "Charcoal", "Dusty Pink", "Mustard"]; tip = "Matcha is the FASTEST growing beverage niche on Etsy."; }
  else if (isCoffee) { concept = "Caffeine-themed humor for coffee addicts"; suggestedText = pick([`"Powered By Coffee & Sarcasm"`, `"But First, Coffee"`, `"Coffee Mama | Don't Talk To Me Yet"`]); style = "Warm earthy tones, handwritten script, coffee stain textures"; colors = ["Brown", "Cream", "Burnt Orange", "Sage Green", "Charcoal"]; tip = "Coffee + profession combos are absolute goldmines."; }
  else if (isWine) { concept = "Wine lover humor with elegant feel"; suggestedText = pick([`"Rosé All Day"`, `"Wine Mom Mode: Activated"`, `"Will Trade Husband For Wine"`]); style = "Elegant script, wine glass illustration, sophisticated palette"; colors = ["Burgundy", "Cream", "Sage Green", "Gold", "Dusty Pink"]; tip = "Wine mom designs are EVERGREEN."; }
  else if (isGym) { concept = "Motivational fitness design with attitude"; suggestedText = pick([`"Gym Hair Don't Care"`, `"Lifting Spirits & Weights"`, `"Strong Like Mama"`]); style = "Bold athletic typography, dynamic angled text, high contrast"; colors = ["Black", "Neon Green", "Cream", "Charcoal", "Hot Pink"]; tip = "Gym + humor outperforms pure motivation by 40%."; }
  else if (isRunner) { concept = "Runner pride design with motivational humor"; suggestedText = pick([`"Runner | I Run For Wine"`, `"Marathon Mama"`, `"Will Run For Tacos"`]); style = "Athletic typography, running silhouette, dynamic energy"; colors = ["Black", "Neon Yellow", "Cream", "Charcoal", "Coral"]; tip = "Marathon distance designs sell as accomplishment merch."; }
  else if (isBook) { concept = "Book lover aesthetic with literary humor"; suggestedText = pick([`"My Weekend Is All Booked"`, `"Fictional Boyfriends > Real Ones"`, `"One More Chapter | I Promise"`]); style = "Dark academia aesthetic, vintage library feel, serif fonts"; colors = ["Burgundy", "Forest Green", "Cream", "Gold", "Charcoal"]; tip = "Book + fantasy/romance genre references perform best."; }
  else if (isPlant) { concept = "Plant parent pride with boho aesthetic"; suggestedText = pick([`"Plant Mom | Watering My Problems Away"`, `"Crazy Plant Lady"`, `"Plant Hoarder | Proud"`]); style = "Boho botanical illustrations, hand-drawn leaves"; colors = ["Sage Green", "Terracotta", "Cream", "Mustard", "Forest Green"]; tip = "Plant + vintage combos are rising fast."; }
  else if (isCrochet) { concept = "Crochet/yarn lover with cozy crafting feel"; suggestedText = pick([`"Crochet Addict"`, `"Just Hooking Around"`, `"Crochet | My Yarn My Rules"`]); style = "Cozy hand-drawn illustration, yarn ball accents, warm palette"; colors = ["Cream", "Sage Green", "Dusty Pink", "Burnt Orange", "Charcoal"]; tip = "Crochet niche EXPLODED in 2024-2026 thanks to TikTok."; }
  else if (isArt) { concept = "Artist pride design with creative humor"; suggestedText = pick([`"Artist | Yes I'm Self-Employed"`, `"My Therapy Has Brushes"`, `"Art Is Not What You See"`]); style = "Hand-drawn artistic feel, paint splatter accents, creative typography"; colors = ["Cream", "Burnt Orange", "Sage Green", "Charcoal", "Mustard"]; tip = "Artist niche overlaps with mental health."; }
  else if (isPhoto) { concept = "Photographer pride with technical humor"; suggestedText = pick([`"Photographer | F-Stop & Smell The Roses"`, `"I Shoot People | Photographer"`, `"Camera Loves Me"`]); style = "Clean minimalist design, camera silhouette, modern typography"; colors = ["Charcoal", "Cream", "Burnt Orange", "Sage Green", "Black"]; tip = "Wedding photographer subniches sell premium ($35+)."; }
  else if (isMusic) { concept = "Musician pride with instrument-specific humor"; suggestedText = pick([`"Guitar Dad | Six Strings, One Heart"`, `"Drummer | The Heartbeat of The Band"`, `"Music Is My Therapy"`]); style = "Vintage music poster aesthetic, instrument accents, bold typography"; colors = ["Black", "Cream", "Burnt Orange", "Burgundy", "Gold"]; tip = "Specific instrument designs outsell generic 'musician' by 4x."; }
  else if (isGamer) { concept = "Gaming pride with nerd humor"; suggestedText = pick([`"Gamer Mama | Save Game, Save Sanity"`, `"I Pause My Game For You"`, `"Gaming Is My Cardio"`]); style = "Pixel art accents, retro gaming typography, neon palette"; colors = ["Black", "Neon Purple", "Neon Green", "Cream", "Hot Pink"]; tip = "Gamer mom/dad designs trend hard on TikTok."; }
  else if (isSwiftie) { concept = "Swiftie aesthetic with era references"; suggestedText = pick([`"In My Swiftie Era"`, `"Eras Tour Survivor 2024"`, `"It's Me, Hi, I'm The Problem"`]); style = "Glittery aesthetic, mixed era references, hand-lettered typography"; colors = ["Lavender", "Cream", "Hot Pink", "Sage Green", "Gold"]; tip = "Swiftie market is HUGE but watch for trademark issues."; }
  else if (isKpop) { concept = "K-pop fan design with stan culture humor"; suggestedText = pick([`"Stan Forever"`, `"K-Pop Stays In My Heart"`, `"Borahae"`]); style = "Modern Korean-inspired design, soft pastels, bold sans-serif"; colors = ["Lavender", "Hot Pink", "Cream", "Mint Green", "Black"]; tip = "Avoid using member names/group logos."; }
  else if (isHarryPotter) { concept = "Wizarding world inspired design (be careful with trademarks)"; suggestedText = pick([`"Bookwitch | Magic Reader"`, `"Wizard Mode: Activated"`, `"Mischief Managed"`]); style = "Vintage parchment feel, gold accents, gothic typography"; colors = ["Burgundy", "Gold", "Cream", "Forest Green", "Charcoal"]; tip = "AVOID: 'Hogwarts', 'Gryffindor', character names."; }
  else if (isMarvel) { concept = "Superhero inspired design (avoid direct trademarks)"; suggestedText = pick([`"Mom Mode | Superhero Status"`, `"Saving The Day Since 2024"`, `"Hero Without A Cape"`]); style = "Bold comic book aesthetic, action typography, vibrant palette"; colors = ["Red", "Navy", "Cream", "Yellow", "Black"]; tip = "AVOID character names/logos."; }
  else if (isAnime) { concept = "Anime aesthetic without direct character references"; suggestedText = pick([`"Otaku Mama"`, `"Anime Is My Personality"`, `"Sleep Eat Anime Repeat"`]); style = "Manga-inspired illustrations, kawaii aesthetic, bold sans-serif"; colors = ["Hot Pink", "Black", "Cream", "Sky Blue", "Lavender"]; tip = "Generic anime aesthetic sells safely."; }
  else if (isDisney) { concept = "Magic-inspired design (avoid Disney trademarks)"; suggestedText = pick([`"Magical Mama"`, `"Park Day Vibes"`, `"Make Magic Happen"`]); style = "Whimsical hand-drawn style, sparkle accents, soft pastels"; colors = ["Dusty Pink", "Lavender", "Cream", "Sky Blue", "Gold"]; tip = "DO NOT use Disney/Mickey/character names."; }
  else if (isBossbabe) { concept = "Entrepreneur pride with empowerment vibe"; suggestedText = pick([`"CEO Mode: Activated"`, `"Boss Babe | Built Different"`, `"Hustle Hard, Pray Harder"`]); style = "Modern minimalist, gold foil accents, bold elegant typography"; colors = ["Black", "Gold", "Cream", "Hot Pink", "Charcoal"]; tip = "Boss babe niche peaks in January."; }
  else if (isMentalHealth) { concept = "Mental health awareness with gentle support"; suggestedText = pick([`"Therapy Saved Me"`, `"It's OK To Not Be OK"`, `"My Brain Is My Cardio"`]); style = "Soft minimalist, gentle pastels, comforting typography"; colors = ["Sage Green", "Lavender", "Cream", "Dusty Blue", "Charcoal"]; tip = "Mental health is sensitive — keep messaging gentle."; }
  else if (isMinimalist) { concept = "Minimalist aesthetic with clean typography"; suggestedText = pick([`"Less Is More"`, `"Simple Things Matter"`, `"Minimalist Mode"`]); style = "Ultra-clean sans-serif, lots of white space, monochrome palette"; colors = ["Cream", "Charcoal", "Sage Green", "Beige", "Black"]; tip = "Minimalist designs sell premium ($30+)."; }
  else if (isVintage) { concept = "Retro aesthetic design with nostalgic typography"; suggestedText = pick([`"Vintage Soul | Modern Heart"`, `"Born In The Wrong Era"`, `"Retro Vibes Only"`]); style = "70s/80s retro palette, distressed textures, groovy typography, sunburst elements"; colors = ["Burnt Orange", "Mustard", "Cream", "Avocado Green", "Brown"]; tip = "Vintage + profession or vintage + pet are underserved micro-niches."; }
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
  const [liveIdx, setLiveIdx] = useState(0);
  const [showData, setShowData] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const t = setInterval(() => setLiveIdx((i) => (i + 1) % LIVE.length), 3500);
    return () => clearInterval(t);
  }, []);

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

  const nav = [
    { label: "POD Decision", path: "/dashboard", icon: "◎", active: true },
    { label: "Competition", path: "/competition", icon: "▦" },
    { label: "Trends", path: "/trends", icon: "↗" },
    { label: "Tag Generator", path: "/tags", icon: "✦" },
    { label: "Listing Optimizer", path: "/listing", icon: "★" },
    { label: "Sales Estimator", path: "/sales", icon: "$" },
    { label: "POD Research", path: "/pod", icon: "◈", badge: "NEW" },
  ];

  const chips = getDynamicChips();
  const verdict = result ? getPODVerdict(result.volume, result.competition, result.trend, searched) : null;
  const score = result ? calculateScore(result.volume, result.competition, result.trend) : 0;
  const alternatives = verdict?.showAlternatives ? generateAlternatives(searched) : [];
  const isPro = result?.isPro || false;
  const designBrief = result && verdict && verdict.verdict !== "Avoid for POD" ? generateDesignBrief(searched, verdict.verdict) : null;

  return (
    <>
      <style jsx global>{`
        @import url("https://fonts.googleapis.com/css2?family=Instrument+Serif&family=Inter:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap");
        body { font-family: "Inter", system-ui, sans-serif; background: #08090d; color: #e2e8f0; }
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
        .dash-side { width: 240px; background: rgba(8, 9, 13, 0.7); backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px); border-right: 1px solid rgba(255, 255, 255, 0.04); display: flex; flex-direction: column; flex-shrink: 0; padding: 24px 16px 20px; position: relative; z-index: 10; }
        .dash-logo { display: flex; align-items: center; gap: 8px; padding: 0 8px; margin-bottom: 4px; }
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
        .dash-topbar { height: 52px; border-bottom: 1px solid rgba(255, 255, 255, 0.04); display: flex; align-items: center; justify-content: space-between; padding: 0 40px; background: rgba(8, 9, 13, 0.5); backdrop-filter: blur(20px); flex-shrink: 0; }
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
        .dash-chips { display: flex; flex-wrap: wrap; gap: 7px; margin-bottom: 40px; }
        .dash-chip { padding: 7px 14px; border-radius: 999px; background: rgba(255, 255, 255, 0.02); border: 1px solid rgba(255, 255, 255, 0.06); color: rgba(255, 255, 255, 0.55); font-size: 12px; font-weight: 500; cursor: pointer; transition: all 0.15s; font-family: inherit; }
        .dash-chip:hover { background: rgba(167, 139, 250, 0.08); border-color: rgba(167, 139, 250, 0.25); color: #c4b5fd; }
        .dash-verdict { border-radius: 20px; padding: 28px 32px; margin-bottom: 20px; display: flex; gap: 28px; align-items: stretch; backdrop-filter: blur(12px); }
        .dash-verdict-left { flex: 1; }
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
        .dash-error-box { background: rgba(239, 68, 68, 0.06); border: 1px solid rgba(239, 68, 68, 0.15); border-radius: 14px; padding: 18px 22px; margin-bottom: 24px; display: flex; align-items: center; justify-content: space-between; gap: 12px; backdrop-filter: blur(12px); }
        .dash-loading { display: flex; flex-direction: column; align-items: center; justify-content: center; height: 220px; gap: 20px; }
        .dash-spinner { width: 36px; height: 36px; border: 2px solid rgba(167, 139, 250, 0.15); border-top-color: #a78bfa; border-radius: 50%; animation: spin 0.8s linear infinite; }
        .dash-result-bar { display: flex; align-items: center; justify-content: space-between; margin-bottom: 24px; padding-bottom: 16px; border-bottom: 1px solid rgba(255, 255, 255, 0.04); }
        @media (max-width: 900px) {
          .dash-side { display: none; }
          .dash-content { padding: 24px 20px; }
          .dash-verdict { flex-direction: column; }
          .dash-verdict-score { border-left: none; border-top: 1px solid rgba(255, 255, 255, 0.06); padding-top: 18px; }
          .dash-alts-grid, .dash-stats, .dash-design-grid { grid-template-columns: 1fr; }
        }
      `}</style>
      <div className="dash">
        <div className="dash-mesh">
          <div className="mesh-1 absolute -top-40 -left-40 w-[500px] h-[500px] rounded-full opacity-30"
            style={{ background: "radial-gradient(circle, rgba(167,139,250,0.4) 0%, rgba(167,139,250,0) 70%)", filter: "blur(80px)" }} />
          <div className="mesh-1 absolute top-1/2 -right-40 w-[400px] h-[400px] rounded-full opacity-20"
            style={{ background: "radial-gradient(circle, rgba(244,114,182,0.4) 0%, rgba(244,114,182,0) 70%)", filter: "blur(80px)", animationDelay: "8s" }} />
        </div>

        <aside className="dash-side">
          <Link href="/" className="dash-logo" style={{ textDecoration: "none" }}>
            <div className="dash-logo-icon">M</div>
            <span className="dash-logo-text">Mark<em>earn</em></span>
          </Link>
          <div className="dash-live-row">
            <div className="dash-dot verdict-pulse" />
            <span className="dash-live-label">Live data</span>
          </div>
          <div className="dash-section-label">Tools</div>
          <nav className="dash-nav">
            {nav.map((item) => (
              <button key={item.path} onClick={() => router.push(item.path)} className={`dash-navbtn ${item.active ? "dash-navbtn-active" : ""}`}>
                <span className="dash-nav-icon">{item.icon}</span>
                <span>{item.label}</span>
                {item.badge && <span className="dash-new-badge">{item.badge}</span>}
              </button>
            ))}
          </nav>
          <div className="dash-upgrade">
            <button className="dash-upgrade-btn" onClick={() => router.push("/pricing")}>
              <span>↑</span>Upgrade Plan
            </button>
          </div>
        </aside>

        <div className="dash-main">
          <div className="dash-topbar">
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div className="dash-dot verdict-pulse" style={{ background: "#fbbf24" }} />
              <span style={{ fontSize: 12, color: "rgba(255,255,255,0.45)" }}>{LIVE[liveIdx]}</span>
            </div>
            <span style={{ fontSize: 11, color: "rgba(255,255,255,0.25)", letterSpacing: "0.05em" }}>Markearn · Real-time POD decisions</span>
          </div>

          <div className="dash-content">
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
                    <span style={{ fontSize: 12, fontWeight: 600, color: "#34d399", letterSpacing: "0.05em" }}>LIVE</span>
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
                    <div className="dash-verdict-proof">Verdict based on real market demand & competition data.</div>
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
                        { label: "Opportunity", value: result.opportunity, sub: "Real-time analysis", color: "#c4b5fd" },
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
          </div>
        </div>
      </div>
    </>
  );
}