import type { SpaceEvent } from "@/lib/types";

const grad = (a: string, b: string, c: string) =>
  `linear-gradient(135deg, ${a} 0%, ${b} 50%, ${c} 100%)`;

// Dates are computed relative to today so countdowns always look live
const today = new Date();
const dayMs = 24 * 60 * 60 * 1000;
const dateFromNow = (days: number, hour = 21) => {
  const d = new Date(today.getTime() + days * dayMs);
  d.setHours(hour, 0, 0, 0);
  return d.toISOString();
};

export const events: SpaceEvent[] = [
  {
    id: "evt-perseids",
    type: "meteor-shower",
    name: "Perseid Meteor Shower Peak",
    date: dateFromNow(14, 22),
    time: "22:00 – 04:00 local",
    visibilityRegion: "Northern Hemisphere",
    visibilityPercent: 95,
    bestLocation: "Cherry Springs State Park",
    description:
      "The most beloved meteor shower of the year. Up to 100 meteors per hour at peak, with bright fireballs that frequently leave persistent trains. The Perseids originate from comet Swift-Tuttle and radiate from the constellation Perseus.",
    details:
      "Best viewed after midnight when the radiant is high. 2026 is an exceptional year — moonless skies during peak mean no lunar interference. Lie back, look up, and let your eyes adapt for 20 minutes before counting.",
    peakTime: "02:00 UTC",
    duration: "Peak lasts ~12 hours",
    imageGradient: grad("oklch(0.28 0.16 280)", "oklch(0.10 0.08 240)", "oklch(0.05 0.02 270)"),
  },
  {
    id: "evt-eclipse",
    type: "solar-eclipse",
    name: "Total Solar Eclipse",
    date: dateFromNow(48, 18),
    time: "18:17 UTC",
    visibilityRegion: "Parts of North America, Atlantic, Europe",
    visibilityPercent: 100,
    bestLocation: "Teide National Park",
    description:
      "The Moon completely covers the Sun, revealing the Sun's ethereal corona — visible only during totality. Day turns to twilight, birds fall silent, and the temperature drops several degrees. A life-list experience for any observer.",
    details:
      "Totality lasts up to 4 minutes 30 seconds depending on location. Use ISO-certified eclipse glasses for partial phases; totality is safe to view naked-eye. Photographing totality requires solar filter removed only during full coverage.",
    peakTime: "Totality: 4 min 23 sec",
    duration: "Partial: 2.5 hours; Total: minutes",
    imageGradient: grad("oklch(0.28 0.12 30)", "oklch(0.12 0.08 280)", "oklch(0.05 0.02 270)"),
  },
  {
    id: "evt-spacex",
    type: "rocket-launch",
    name: "Falcon Heavy — Europa Clipper",
    date: dateFromNow(7, 13),
    time: "13:30 EST",
    visibilityRegion: "Florida, USA",
    visibilityPercent: 100,
    bestLocation: "Kennedy Space Center Causeway",
    description:
      "NASA's flagship mission to Jupiter's icy moon Europa launches on a Falcon Heavy. The $5 billion spacecraft will reach Europa in 2030 and conduct 49 close flybys to determine if its subsurface ocean could host life.",
    details:
      "Launch window opens 13:30 EST from Pad 39A. Watch from Kennedy Space Center Visitor Complex for included admission, or the causeway for $50 add-on viewing ticket. Sonic booms expected; bring ear protection for kids.",
    peakTime: "T-0 ignition",
    duration: "~45 min window",
    imageGradient: grad("oklch(0.34 0.18 40)", "oklch(0.12 0.10 280)", "oklch(0.05 0.02 270)"),
  },
  {
    id: "evt-geminids",
    type: "meteor-shower",
    name: "Geminid Meteor Shower",
    date: dateFromNow(95, 2),
    time: "02:00 local",
    visibilityRegion: "Worldwide",
    visibilityPercent: 90,
    bestLocation: "Atacama Desert",
    description:
      "Often the strongest meteor shower of the year, with up to 150 multicolored meteors per hour. The Geminids are unusual in that they originate from asteroid 3200 Phaethon, not a comet.",
    details:
      "Reliable from any latitude. Peak is sharp — best viewing within 2 hours of 02:00 local time. Unlike most showers, Geminids are visible all night since the radiant rises at sunset.",
    peakTime: "02:00 local",
    duration: "Peak: 6 hours",
    imageGradient: grad("oklch(0.28 0.16 280)", "oklch(0.10 0.06 270)", "oklch(0.05 0.02 270)"),
  },
  {
    id: "evt-aurora",
    type: "aurora",
    name: "Aurora Borealis Window",
    date: dateFromNow(3, 22),
    time: "22:00 – 02:00 local",
    visibilityRegion: "Northern Scandinavia, Iceland, Canada",
    visibilityPercent: 88,
    bestLocation: "Kiruna Aurora Village",
    description:
      "A geomagnetic storm (Kp 6-7) is forecast to push the auroral oval southward over the next 3 nights. Active auroras with green curtains, pink bases, and possible red rays are expected at high latitudes.",
    details:
      "Best viewing 22:00 – 02:00 local time. Check the OVATION model for real-time forecasts. Photograph with fast wide lens (f/1.4-f/2.8), ISO 1600-3200, 5-15 second exposures.",
    peakTime: "23:30 local",
    duration: "3-4 hours nightly",
    imageGradient: grad("oklch(0.30 0.18 150)", "oklch(0.12 0.10 250)", "oklch(0.05 0.02 270)"),
  },
  {
    id: "evt-iss",
    type: "iss-visibility",
    name: "ISS — Bright Evening Pass",
    date: dateFromNow(1, 19),
    time: "19:24 local",
    visibilityRegion: "Continental US",
    visibilityPercent: 100,
    bestLocation: "Anywhere with clear horizon",
    description:
      "The International Space Station makes a brilliant 6-minute pass overhead, reaching magnitude -3.8 — brighter than Jupiter. It will rise in the southwest and set in the northeast, crossing nearly overhead.",
    details:
      "No equipment needed — visible to the naked eye as a fast-moving 'star' that doesn't twinkle. The ISS completes 16 orbits per day. Sign up for NASA's Spot the Station alerts for your location.",
    peakTime: "19:27 local (max elevation 76°)",
    duration: "6 minutes 12 seconds",
    imageGradient: grad("oklch(0.28 0.14 240)", "oklch(0.10 0.06 280)", "oklch(0.05 0.02 270)"),
  },
  {
    id: "evt-lunar",
    type: "lunar-eclipse",
    name: "Total Lunar Eclipse (Blood Moon)",
    date: dateFromNow(32, 3),
    time: "03:00 – 06:00 UTC",
    visibilityRegion: "Pacific, Americas, Asia",
    visibilityPercent: 100,
    bestLocation: "Mauna Kea Summit",
    description:
      "The Moon glows a deep copper-red as it passes through Earth's umbral shadow. The color comes from sunlight refracted through Earth's atmosphere — the sum of all the world's sunrises and sunsets projected onto the lunar surface.",
    details:
      "Total phase lasts 84 minutes. No eye protection needed — entirely safe to view naked-eye. A small telescope reveals the color shift dramatically. Photograph with 200mm+ lens, ISO 800-1600 during totality.",
    peakTime: "04:18 UTC (totality)",
    duration: "5 hours total, 84 min totality",
    imageGradient: grad("oklch(0.32 0.18 20)", "oklch(0.12 0.10 280)", "oklch(0.05 0.02 270)"),
  },
  {
    id: "evt-conjunct",
    type: "conjunction",
    name: "Jupiter–Venus Conjunction",
    date: dateFromNow(20, 18),
    time: "18:45 local",
    visibilityRegion: "Western sky worldwide",
    visibilityPercent: 95,
    bestLocation: "Teide National Park",
    description:
      "The two brightest planets appear within 0.3° of each other — close enough to fit in a single low-power telescope field. A spectacular naked-eye event, especially with thin crescent Moon nearby forming a triple conjunction.",
    details:
      "Look west 30-45 minutes after sunset. Venus is brighter and lower; Jupiter slightly higher and fainter. Binoculars reveal Jupiter's four Galilean moons.",
    peakTime: "18:52 local",
    duration: "Closest approach 1-2 hours",
    imageGradient: grad("oklch(0.30 0.16 60)", "oklch(0.12 0.08 280)", "oklch(0.05 0.02 270)"),
  },
  {
    id: "evt-fest",
    type: "astronomy-festival",
    name: "Cosmos Fest 2026",
    date: dateFromNow(56, 10),
    time: "10:00 – 23:00",
    visibilityRegion: "Dark Sky Park, Spain",
    visibilityPercent: 100,
    bestLocation: "Teide National Park",
    description:
      "Three-day astronomy festival bringing together 5,000 amateur astronomers. Talks by ESA astronauts, telescope clinics, kids workshops, and three consecutive nights of group stargazing with 200+ telescopes set up on the festival field.",
    details:
      "Day tickets €25, weekend €65, family €120. Camping €15/night. Bring warm clothes, telescope if you have one, and red flashlight. Food trucks and showers on site.",
    peakTime: "Saturday 21:00 (group observing)",
    duration: "3 days",
    imageGradient: grad("oklch(0.30 0.18 320)", "oklch(0.12 0.10 280)", "oklch(0.05 0.02 270)"),
  },
];
