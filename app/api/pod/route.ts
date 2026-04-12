import { NextResponse } from "next/server";

const POD_DATA: Record<string, any> = {
  "dog mom": {
    listings: [
      { title: "Dog Mom Era Sweatshirt, Dog Lover Gift, Pet Mom Hoodie", price: "34.99", views: 28930, sales: 1240, tags: ["dog mom", "dog lover", "pet mom", "dog gift", "sweatshirt"] },
      { title: "Funny Dog Mom Shirt, Dog Mama Tee, Gift for Dog Owner", price: "24.99", views: 15600, sales: 890, tags: ["dog mom", "dog mama", "funny dog", "dog owner", "gift"] },
      { title: "Dog Mom Life Shirt, Rescue Dog Mom, Adopt Don't Shop Tee", price: "22.99", views: 9800, sales: 420, tags: ["dog mom life", "rescue dog", "adopt", "dog shirt", "animal lover"] },
      { title: "Golden Retriever Mom Shirt, Goldie Dog Mama Tee, Dog Breed Gift", price: "26.99", views: 8200, sales: 380, tags: ["golden retriever", "dog breed", "goldie mom", "dog gift", "breed shirt"] },
      { title: "Dog Mom Hoodie, Paw Print Sweatshirt, Dog Owner Winter Gift", price: "39.99", views: 7400, sales: 290, tags: ["dog hoodie", "paw print", "dog owner", "winter", "dog gift"] },
    ],
    analysis: { saturation: 72, trend: "Rising", avgPrice: 27.99, avgProfit: 13.99, sellers: 4800, opportunity: "Medium", recommendation: "Highly competitive but evergreen. Focus on specific breeds (Golden Retriever Mom, Dachshund Mom) to stand out. Bundle with matching mugs." }
  },
  "cat lover": {
    listings: [
      { title: "Funny Cat Mom Shirt, Cat Lover Gift, Cute Cat Tee", price: "24.99", views: 15420, sales: 780, tags: ["cat mom", "cat lover", "funny cat", "cat shirt", "gift"] },
      { title: "Cat Lady Sweatshirt, Crazy Cat Mom, Cat Owner Gift", price: "32.99", views: 12300, sales: 560, tags: ["cat lady", "crazy cat mom", "cat owner", "cat sweatshirt", "gift"] },
      { title: "Cat Dad Shirt, Cat Father Gift, Funny Cat Tee for Men", price: "21.99", views: 7800, sales: 310, tags: ["cat dad", "cat father", "funny cat", "men cat shirt", "gift"] },
      { title: "Siamese Cat Mom Shirt, Cat Breed Lover Tee, Kitty Gift", price: "23.99", views: 5600, sales: 210, tags: ["siamese cat", "cat breed", "cat lover", "kitty gift", "cat shirt"] },
      { title: "Black Cat Shirt, Halloween Cat Mom Tee, Spooky Cat Gift", price: "25.99", views: 9100, sales: 440, tags: ["black cat", "halloween cat", "cat mom", "spooky", "cat gift"] },
    ],
    analysis: { saturation: 65, trend: "Stable", avgPrice: 26.65, avgProfit: 12.65, sellers: 3200, opportunity: "Good", recommendation: "Less saturated than dog niche. Cat-specific humor and breed-specific designs (Siamese, Maine Coon) perform very well. Halloween cat designs spike in October." }
  },
  "funny t-shirt": {
    listings: [
      { title: "Funny Sarcastic Shirt, Humor Tee, Witty Quote T-Shirt Gift", price: "22.99", views: 45200, sales: 2100, tags: ["funny", "sarcastic", "humor", "witty", "quote shirt"] },
      { title: "Dad Joke Shirt, Funny Father Tee, Humor Gift for Dad", price: "19.99", views: 31000, sales: 1560, tags: ["dad joke", "funny dad", "father humor", "dad gift", "joke"] },
      { title: "Introvert Shirt, Antisocial Tee, Funny Introvert Gift", price: "23.99", views: 22400, sales: 980, tags: ["introvert", "antisocial", "funny", "introvert gift", "humor"] },
      { title: "Coffee Addict Shirt, Caffeine Lover Tee, Funny Coffee Gift", price: "21.99", views: 18700, sales: 870, tags: ["coffee addict", "caffeine", "coffee lover", "funny coffee", "gift"] },
      { title: "Monday Hater Shirt, Funny Work Tee, Office Humor Gift", price: "20.99", views: 14300, sales: 650, tags: ["monday hater", "work humor", "office funny", "work gift", "tee"] },
    ],
    analysis: { saturation: 95, trend: "Stable", avgPrice: 22.32, avgProfit: 8.32, sellers: 15000, opportunity: "Hard", recommendation: "Extremely saturated. Only viable with very specific viral humor or trending memes. Focus on micro-niches like 'Funny Nurse Humor' or 'IT Developer Jokes'." }
  },
  "birthday gift": {
    listings: [
      { title: "Birthday Queen Shirt, Birthday Girl Gift, Cute Birthday Tee", price: "19.99", views: 45200, sales: 2340, tags: ["birthday", "birthday queen", "birthday girl", "birthday gift", "cute"] },
      { title: "50th Birthday Shirt, Vintage 1974 Tee, 50 Years Old Gift", price: "24.99", views: 28700, sales: 1890, tags: ["50th birthday", "vintage 1974", "50 years", "birthday shirt", "milestone"] },
      { title: "Birthday Legend Shirt, Legend Since Birth, Custom Birthday Tee", price: "26.99", views: 18900, sales: 990, tags: ["birthday legend", "legend since", "custom birthday", "personalised", "gift"] },
      { title: "30th Birthday Sweatshirt, Dirty Thirty Gift, 30 Year Old Tee", price: "34.99", views: 16400, sales: 820, tags: ["30th birthday", "dirty thirty", "30 years", "birthday sweatshirt", "gift"] },
      { title: "It's My Birthday Shirt, Birthday Celebration Tee, Party Gift", price: "18.99", views: 12800, sales: 670, tags: ["its my birthday", "celebration", "party", "birthday shirt", "fun"] },
    ],
    analysis: { saturation: 80, trend: "Rising", avgPrice: 23.99, avgProfit: 10.99, sellers: 8900, opportunity: "Medium", recommendation: "Age-specific birthday shirts (30th, 40th, 50th) are the sweet spot. Personalization increases conversion by 3x. Year-based designs ('Vintage 1990') always sell." }
  },
  "nurse gift": {
    listings: [
      { title: "Funny Nurse Life Shirt, RN Gift, Nursing School Grad Tee", price: "22.99", views: 9870, sales: 540, tags: ["nurse", "rn gift", "nurse life", "nursing", "medical"] },
      { title: "ICU Nurse Shirt, Critical Care Nurse Gift, Hospital Tee", price: "24.99", views: 7200, sales: 380, tags: ["icu nurse", "critical care", "nurse gift", "hospital", "rn"] },
      { title: "Night Shift Nurse Shirt, Nocturnal Nurse Tee, Hospital Worker Gift", price: "21.99", views: 5400, sales: 290, tags: ["night shift", "nocturnal nurse", "hospital worker", "nurse gift", "rn"] },
      { title: "NICU Nurse Shirt, Newborn Care Nurse Gift, Baby Nurse Tee", price: "23.99", views: 4200, sales: 210, tags: ["nicu nurse", "newborn care", "baby nurse", "hospital", "gift"] },
      { title: "Travel Nurse Shirt, Nomad Nurse Life Tee, Adventure Nurse Gift", price: "25.99", views: 3800, sales: 180, tags: ["travel nurse", "nomad nurse", "adventure", "nurse life", "gift"] },
    ],
    analysis: { saturation: 45, trend: "Rising", avgPrice: 23.32, avgProfit: 11.32, sellers: 1800, opportunity: "Excellent", recommendation: "Lower competition with loyal buyer base. Nurses buy gifts for colleagues constantly. Specialty niches (NICU, ER, Travel Nurse) have almost no competition. Great for new POD sellers." }
  },
  "teacher gift": {
    listings: [
      { title: "Teacher Appreciation Shirt, Best Teacher Ever, School Tee", price: "21.99", views: 12300, sales: 670, tags: ["teacher", "teacher gift", "best teacher", "school", "appreciation"] },
      { title: "Kindergarten Teacher Shirt, PreK Teacher Gift, Cute Teacher Tee", price: "23.99", views: 8900, sales: 480, tags: ["kindergarten", "prek teacher", "cute teacher", "teacher gift", "school"] },
      { title: "Math Teacher Shirt, Subject Teacher Gift, Algebra Tee", price: "22.99", views: 6700, sales: 340, tags: ["math teacher", "subject teacher", "algebra", "teacher gift", "school"] },
      { title: "PE Teacher Shirt, Gym Teacher Gift, Physical Education Tee", price: "21.99", views: 4900, sales: 240, tags: ["pe teacher", "gym teacher", "physical education", "sport", "school"] },
      { title: "Teacher Retirement Shirt, Retired Teacher Gift, Teaching Legend Tee", price: "24.99", views: 5800, sales: 280, tags: ["teacher retirement", "retired teacher", "teaching legend", "farewell", "gift"] },
    ],
    analysis: { saturation: 55, trend: "Seasonal", avgPrice: 22.99, avgProfit: 10.99, sellers: 2400, opportunity: "Good", recommendation: "Strong seasonal spikes (September, December, May). Subject-specific teacher shirts (Science, PE, Art) have low competition. Grade-level targeting converts very well." }
  },
  "vintage": {
    listings: [
      { title: "Vintage 90s Aesthetic Shirt, Retro Tee, Nostalgic Gift", price: "28.99", views: 19400, sales: 920, tags: ["vintage", "90s", "retro", "aesthetic", "nostalgic"] },
      { title: "Vintage Band Style Shirt, Retro Music Tee, Classic Rock Gift", price: "26.99", views: 14200, sales: 680, tags: ["vintage band", "retro music", "classic rock", "music gift", "tee"] },
      { title: "Vintage 1985 Shirt, Classic Year Tee, Old School Birthday Gift", price: "24.99", views: 11800, sales: 540, tags: ["vintage 1985", "classic year", "old school", "birthday", "retro"] },
      { title: "Retro Sunset Shirt, 70s Aesthetic Tee, Boho Vintage Gift", price: "27.99", views: 9600, sales: 420, tags: ["retro sunset", "70s", "boho", "vintage aesthetic", "gift"] },
      { title: "Vintage Desert Scene Shirt, Western Retro Tee, Southwest Gift", price: "29.99", views: 7300, sales: 310, tags: ["desert scene", "western", "southwest", "retro", "vintage"] },
    ],
    analysis: { saturation: 60, trend: "Rising", avgPrice: 27.59, avgProfit: 13.59, sellers: 3600, opportunity: "Good", recommendation: "Vintage aesthetic is trending strongly on TikTok and Instagram. Year-specific vintage shirts (birth year) always sell. Combine vintage style with specific niches (Vintage Nurse, Vintage Teacher) for best results." }
  },
  "halloween": {
    listings: [
      { title: "Halloween Witch Shirt, Spooky Season Tee, Fall Halloween Gift", price: "23.99", views: 33100, sales: 1680, tags: ["halloween", "witch", "spooky", "fall", "halloween gift"] },
      { title: "Funny Halloween Shirt, Spooky Vibes Tee, Trick or Treat Gift", price: "21.99", views: 28400, sales: 1420, tags: ["funny halloween", "spooky vibes", "trick or treat", "halloween", "humor"] },
      { title: "Halloween Cat Mom Shirt, Black Cat Tee, Spooky Cat Gift", price: "24.99", views: 18900, sales: 940, tags: ["halloween cat", "black cat", "cat mom", "spooky", "halloween"] },
      { title: "Halloween Teacher Shirt, Spooky Teacher Tee, School Halloween Gift", price: "22.99", views: 12400, sales: 620, tags: ["halloween teacher", "spooky teacher", "school halloween", "teacher gift", "tee"] },
      { title: "Skeleton Halloween Shirt, Bones Tee, Spooky Skeleton Gift", price: "25.99", views: 9800, sales: 490, tags: ["skeleton", "bones", "spooky", "halloween", "gift"] },
    ],
    analysis: { saturation: 70, trend: "Seasonal", avgPrice: 23.99, avgProfit: 10.99, sellers: 5200, opportunity: "Good", recommendation: "Extremely high demand August-October. Start uploading designs in July to rank in time. Combine Halloween with other niches (Halloween Nurse, Halloween Teacher) for less competition. Sales drop to near zero after November 1st." }
  },
  "christmas": {
    listings: [
      { title: "Funny Christmas Shirt, Holiday Humor Tee, Xmas Party Gift", price: "24.99", views: 52300, sales: 2780, tags: ["christmas", "holiday humor", "xmas", "party", "funny christmas"] },
      { title: "Christmas Family Matching Shirt, Holiday Family Tee, Xmas Gift", price: "22.99", views: 38700, sales: 2100, tags: ["christmas family", "matching shirts", "holiday family", "xmas", "family gift"] },
      { title: "Ugly Christmas Sweater Shirt, Xmas Sweater Tee, Holiday Gift", price: "26.99", views: 29400, sales: 1560, tags: ["ugly christmas", "xmas sweater", "holiday", "christmas gift", "funny"] },
      { title: "Santa Claus Shirt, Ho Ho Ho Tee, Christmas Gift for Kids", price: "19.99", views: 21800, sales: 1180, tags: ["santa claus", "ho ho ho", "christmas kids", "holiday", "xmas"] },
      { title: "Christmas Dog Mom Shirt, Holiday Pet Lover Tee, Xmas Dog Gift", price: "25.99", views: 14600, sales: 760, tags: ["christmas dog", "holiday pet", "dog mom", "xmas", "pet gift"] },
    ],
    analysis: { saturation: 85, trend: "Seasonal", avgPrice: 24.19, avgProfit: 10.19, sellers: 12000, opportunity: "Medium", recommendation: "Massive demand October-December but very competitive. Niche combinations work best (Christmas Nurse, Christmas Dog Mom). Start uploading in August. Family matching sets are a top performer with higher average order value." }
  },
  "motivational": {
    listings: [
      { title: "Motivational Hustle Shirt, Entrepreneur Gift, Boss Babe Tee", price: "26.99", views: 8900, sales: 420, tags: ["motivational", "hustle", "entrepreneur", "boss babe", "success"] },
      { title: "Gym Motivation Shirt, Workout Tee, Fitness Motivational Gift", price: "24.99", views: 12400, sales: 580, tags: ["gym motivation", "workout", "fitness", "motivational", "gym gift"] },
      { title: "Rise and Grind Shirt, Morning Hustle Tee, Entrepreneur Gift", price: "22.99", views: 7600, sales: 340, tags: ["rise and grind", "morning hustle", "entrepreneur", "motivational", "tee"] },
      { title: "She Believed She Could Shirt, Inspirational Women Tee, Girl Boss Gift", price: "23.99", views: 15200, sales: 720, tags: ["she believed", "inspirational", "women", "girl boss", "motivational"] },
      { title: "Never Give Up Shirt, Perseverance Tee, Motivational Quote Gift", price: "21.99", views: 6800, sales: 290, tags: ["never give up", "perseverance", "motivational quote", "inspirational", "gift"] },
    ],
    analysis: { saturation: 75, trend: "Stable", avgPrice: 24.19, avgProfit: 11.19, sellers: 5600, opportunity: "Medium", recommendation: "Saturated with generic quotes. Niche-specific motivation works better (Gym Mom, Entrepreneur Mom, Nurse Hustle). Female-targeted motivational designs outperform male ones 3:1 on Etsy." }
  },
};

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const niche = searchParams.get("niche")?.toLowerCase() || "";
  const found = Object.keys(POD_DATA).find(key => niche.includes(key) || key.includes(niche));
  const data = found ? POD_DATA[found] : {
    listings: [
      { title: "Custom Niche Shirt, Personalized Gift, Unique Tee Design", price: "24.99", views: 8500, sales: 420, tags: ["custom", "personalized", "gift", "unique", "tee"] },
      { title: "Trending Niche Sweatshirt, Popular Design, Gift Idea", price: "34.99", views: 6200, sales: 280, tags: ["trending", "popular", "gift idea", "sweatshirt", "design"] },
      { title: "Niche Lover Gift Shirt, Hobby Tee, Personalized Gift Idea", price: "22.99", views: 4800, sales: 190, tags: ["hobby", "lover gift", "personalized", "niche", "tee"] },
      { title: "Custom Quote Shirt, Personalized Text Tee, Unique Gift", price: "21.99", views: 3900, sales: 150, tags: ["custom quote", "personalized text", "unique", "gift", "shirt"] },
      { title: "Trending Design Hoodie, Popular Niche Sweatshirt, Gift Idea", price: "39.99", views: 3200, sales: 120, tags: ["trending", "hoodie", "popular", "niche", "gift"] },
    ],
    analysis: { saturation: 50, trend: "Stable", avgPrice: 28.99, avgProfit: 12.99, sellers: 2000, opportunity: "Medium", recommendation: "Try more specific terms like 'funny cat mom shirt' or 'nurse graduation gift' for detailed analysis. The more specific your niche, the less competition you'll face." }
  };
  return NextResponse.json(data);
}