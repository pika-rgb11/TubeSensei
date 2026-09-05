import type { Review, UserState } from "@/lib/types";

const grad = (a: string, b: string, c: string) =>
  `linear-gradient(135deg, ${a} 0%, ${b} 50%, ${c} 100%)`;

export const reviewsByLocation: Record<string, Review[]> = {
  atacama: [
    {
      id: "r1", author: "Maya Rodriguez", avatar: "MR", rating: 5,
      date: "2 weeks ago",
      text: "Hands down the most spectacular night sky I've ever seen. The Milky Way was so bright I could read by it. Our guide from Space Tours Chile knew exactly where to take us for the best Milky Way core shots. Cannot recommend this enough.",
      helpful: 47, photos: 12,
    },
    {
      id: "r2", author: "Hiro Tanaka", avatar: "HT", rating: 5,
      date: "1 month ago",
      text: "The ALMA tour was a once-in-a-lifetime experience. The altitude took some getting used to but the staff are incredibly well-prepared. Seeing the antennas up close gave me a real sense of how humans study the cosmos.",
      helpful: 31, photos: 5,
    },
    {
      id: "r3", author: "Sophie Laurent", avatar: "SL", rating: 4,
      date: "2 months ago",
      text: "Incredible destination but the cold at altitude is no joke — bring way more layers than you think you need. We did the sunset tour and the colors on the mountains were otherworldly. Lost one star only because of the long drive from San Pedro.",
      helpful: 19, photos: 8,
    },
  ],
  "mauna-kea": [
    {
      id: "r4", author: "James Carter", avatar: "JC", rating: 5,
      date: "3 weeks ago",
      text: "We did the summit sunset followed by stargazing at the visitor station. The drive up in our 4WD was nerve-wracking but worth every second. Watching the sun set above the clouds with telescopes silhouetted against the sky is something I'll never forget.",
      helpful: 62, photos: 14,
    },
    {
      id: "r5", author: "Aisha Mohammed", avatar: "AM", rating: 5,
      date: "1 month ago",
      text: "Free stargazing program at the visitor station was incredible. Volunteer astronomers set up multiple telescopes and we saw Saturn's rings, Jupiter's moons, and a globular cluster. My kids (8 and 11) were completely transfixed.",
      helpful: 41, photos: 0,
    },
  ],
  "cherry-springs": [
    {
      id: "r6", author: "Dmitri Volkov", avatar: "DV", rating: 5,
      date: "5 days ago",
      text: "Bortle 2 skies on the East Coast — this is the gold standard. We brought our 8\" SCT and were blown away by what we could see. The astronomy field has power outlets at each pad, which is a thoughtful touch.",
      helpful: 28, photos: 9,
    },
    {
      id: "r7", author: "Laura Bennett", avatar: "LB", rating: 4,
      date: "1 month ago",
      text: "Stunning skies but come prepared — the bugs in summer are intense. The star party weekend in June is one of the friendliest astronomy events I've been to. So many people willing to share views through their telescopes.",
      helpful: 16, photos: 3,
    },
  ],
  "kiruna": [
    {
      id: "r8", author: "Ingrid Larsson", avatar: "IL", rating: 5,
      date: "1 week ago",
      text: "Saw the aurora every single night for 4 nights. Our guide knew exactly which forecast models to trust and drove us to clear patches even when Abisko was cloudy. The glass-roof cabin was worth every krona.",
      helpful: 53, photos: 22,
    },
    {
      id: "r9", author: "Carlos Mendez", avatar: "CM", rating: 5,
      date: "3 weeks ago",
      text: "The combination of dog-sledding by day and aurora hunting by night made this the most magical trip we've ever done. Bring real arctic gear — phone cameras shut down in the cold even with hand warmers.",
      helpful: 34, photos: 18,
    },
  ],
  "kennedy": [
    {
      id: "r10", author: "Priya Patel", avatar: "PP", rating: 5,
      date: "1 week ago",
      text: "We timed our visit with a SpaceX Starlink launch and watched from the causeway. Feeling the shockwaves from the rocket as it cleared the tower was overwhelming. The Saturn V building is staggering in person.",
      helpful: 88, photos: 25,
    },
    {
      id: "r11", author: "Marcus Lee", avatar: "ML", rating: 4,
      date: "1 month ago",
      text: "An incredible place for any space enthusiast, but it can get very crowded. Get there early and plan your day with the app. The Atlantis exhibit is a masterclass in storytelling — the reveal genuinely made me tear up.",
      helpful: 41, photos: 12,
    },
  ],
};

export const defaultReviews: Review[] = [
  {
    id: "dr1", author: "Alex Nguyen", avatar: "AN", rating: 5,
    date: "2 weeks ago",
    text: "A truly transformative experience. The location is beautifully maintained and the staff are passionate about sharing the cosmos with visitors. Will definitely return.",
    helpful: 14, photos: 4,
  },
  {
    id: "dr2", author: "Yuki Sato", avatar: "YS", rating: 4,
    date: "1 month ago",
    text: "Loved the experience but wished the tour was a bit longer. The views were incredible and our guide was very knowledgeable.",
    helpful: 8, photos: 0,
  },
];

export const defaultUser: UserState = {
  id: "u1",
  name: "Nova Stellar",
  email: "nova@cosmosvoyages.io",
  avatarGradient: grad("oklch(0.70 0.18 250)", "oklch(0.40 0.14 320)", "oklch(0.20 0.06 270)"),
  joinedAt: "March 2024",
  visited: ["atacama", "kennedy", "tteide"],
  saved: ["mauna-kea", "namib", "kiruna"],
  wishlist: ["cherry-springs", "alma", "hakos"],
  attendedEvents: ["evt-spacex", "evt-perseids"],
  photos: [
    { id: "p1", title: "Milky Way over Atacama", gradient: grad("oklch(0.30 0.15 280)", "oklch(0.10 0.04 250)", "oklch(0.05 0.02 270)"), date: "Aug 2025", location: "Atacama Desert" },
    { id: "p2", title: "Saturn V at KSC", gradient: grad("oklch(0.34 0.18 40)", "oklch(0.12 0.08 270)", "oklch(0.05 0.02 270)"), date: "Jun 2025", location: "Kennedy Space Center" },
    { id: "p3", title: "Teide sea of clouds", gradient: grad("oklch(0.28 0.12 260)", "oklch(0.10 0.04 270)", "oklch(0.05 0.02 270)"), date: "Sep 2024", location: "Teide NP" },
    { id: "p4", title: "Perseid fireball", gradient: grad("oklch(0.28 0.16 280)", "oklch(0.10 0.06 270)", "oklch(0.05 0.02 270)"), date: "Aug 2024", location: "Cherry Springs" },
    { id: "p5", title: "Magellanic Clouds", gradient: grad("oklch(0.30 0.14 60)", "oklch(0.12 0.06 280)", "oklch(0.05 0.02 270)"), date: "Apr 2024", location: "NamibRand" },
  ],
  bucketList: ["atacama", "namib", "kiruna", "alma", "hakos"],
  reviewsCount: 14,
  journeyProgress: 42,
};
