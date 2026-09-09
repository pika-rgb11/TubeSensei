"use client";

import type { Category } from "@/lib/types";

export const CATEGORY_META: Record<
  Category,
  { label: string; emoji: string; color: string; gradient: string }
> = {
  stargazing: {
    label: "Stargazing",
    emoji: "🌌",
    color: "oklch(0.72 0.18 245)",
    gradient: "linear-gradient(135deg, oklch(0.40 0.15 250) 0%, oklch(0.20 0.08 270) 100%)",
  },
  observatory: {
    label: "Observatory",
    emoji: "🔭",
    color: "oklch(0.78 0.20 320)",
    gradient: "linear-gradient(135deg, oklch(0.45 0.18 320) 0%, oklch(0.20 0.08 280) 100%)",
  },
  planetarium: {
    label: "Planetarium",
    emoji: "🪐",
    color: "oklch(0.65 0.20 290)",
    gradient: "linear-gradient(135deg, oklch(0.40 0.16 290) 0%, oklch(0.20 0.08 270) 100%)",
  },
  "space-center": {
    label: "Space Center",
    emoji: "🚀",
    color: "oklch(0.78 0.18 30)",
    gradient: "linear-gradient(135deg, oklch(0.45 0.16 30) 0%, oklch(0.20 0.08 280) 100%)",
  },
  "space-museum": {
    label: "Space Museum",
    emoji: "🏛️",
    color: "oklch(0.72 0.14 60)",
    gradient: "linear-gradient(135deg, oklch(0.40 0.12 60) 0%, oklch(0.20 0.06 280) 100%)",
  },
  "astro-camping": {
    label: "Astro Camping",
    emoji: "🏕️",
    color: "oklch(0.72 0.16 150)",
    gradient: "linear-gradient(135deg, oklch(0.40 0.14 150) 0%, oklch(0.20 0.08 270) 100%)",
  },
  astrophotography: {
    label: "Astrophotography",
    emoji: "📸",
    color: "oklch(0.70 0.18 200)",
    gradient: "linear-gradient(135deg, oklch(0.40 0.14 200) 0%, oklch(0.20 0.08 260) 100%)",
  },
  eclipse: {
    label: "Eclipse",
    emoji: "🌑",
    color: "oklch(0.55 0.04 270)",
    gradient: "linear-gradient(135deg, oklch(0.30 0.04 270) 0%, oklch(0.10 0.02 270) 100%)",
  },
  "meteor-shower": {
    label: "Meteor Shower",
    emoji: "☄️",
    color: "oklch(0.78 0.18 280)",
    gradient: "linear-gradient(135deg, oklch(0.45 0.16 280) 0%, oklch(0.20 0.08 270) 100%)",
  },
  "dark-sky": {
    label: "Dark Sky",
    emoji: "🌙",
    color: "oklch(0.70 0.16 250)",
    gradient: "linear-gradient(135deg, oklch(0.40 0.14 250) 0%, oklch(0.20 0.08 270) 100%)",
  },
};

export const EVENT_TYPE_META: Record<string, { label: string; emoji: string; color: string }> = {
  "solar-eclipse": { label: "Solar Eclipse", emoji: "☀️", color: "oklch(0.85 0.20 60)" },
  "lunar-eclipse": { label: "Lunar Eclipse", emoji: "🌑", color: "oklch(0.40 0.06 280)" },
  "meteor-shower": { label: "Meteor Shower", emoji: "☄️", color: "oklch(0.78 0.18 280)" },
  conjunction: { label: "Conjunction", emoji: "🪐", color: "oklch(0.70 0.18 250)" },
  "rocket-launch": { label: "Rocket Launch", emoji: "🚀", color: "oklch(0.78 0.18 30)" },
  "iss-visibility": { label: "ISS Pass", emoji: "🛰️", color: "oklch(0.70 0.16 200)" },
  aurora: { label: "Aurora", emoji: "🌌", color: "oklch(0.72 0.16 150)" },
  "astronomy-festival": { label: "Astronomy Festival", emoji: "🎪", color: "oklch(0.78 0.20 320)" },
  "space-exhibition": { label: "Space Exhibition", emoji: "🛸", color: "oklch(0.65 0.20 290)" },
};
