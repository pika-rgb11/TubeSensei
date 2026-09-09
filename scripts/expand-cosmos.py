#!/usr/bin/env python3
"""Append many more cosmic objects to cosmos.ts."""
from pathlib import Path

# Helper grad function is already defined in the file
NEW_OBJECTS = '''
  // === GALAXIES ===
  {
    id: "milky-way",
    image: "",
    name: "Milky Way Galaxy",
    category: "galaxy",
    gradient: grad("oklch(0.55 0.16 240)", "oklch(0.30 0.10 260)", "oklch(0.05 0.02 270)"),
    description:
      "Our home galaxy — a barred spiral galaxy containing 100-400 billion stars, including our Sun. From Earth, we see it as a hazy band of light across the night sky, the combined glow of countless stars in the galactic plane.",
    interestingFacts: [
      "We're located in the Orion Arm, ~26,000 light-years from the galactic center",
      "Spans about 100,000 light-years in diameter",
      "Will collide with Andromeda in ~4.5 billion years",
      "Sagittarius A* (supermassive black hole) sits at its center",
    ],
    scientificData: [
      { label: "Type", value: "Barred spiral (SBbc)" },
      { label: "Diameter", value: "100,000 light-years" },
      { label: "Stars", value: "100-400 billion" },
      { label: "Age", value: "13.6 billion years" },
    ],
    relatedDestinations: ["atacama", "namib", "hakos"],
  },
  {
    id: "triangulum",
    image: "",
    name: "Triangulum Galaxy (M33)",
    category: "galaxy",
    gradient: grad("oklch(0.60 0.14 200)", "oklch(0.30 0.10 220)", "oklch(0.05 0.02 270)"),
    description:
      "The third-largest galaxy in our Local Group after the Milky Way and Andromeda. M33 is a spiral galaxy visible through binoculars under dark skies, located in the constellation Triangulum.",
    interestingFacts: [
      "Third-largest in our Local Group",
      "Visible to naked eye under very dark skies",
      "Smaller spiral galaxy with loosely-wound arms",
      "Contains some of the largest known star-forming regions",
    ],
    scientificData: [
      { label: "Distance", value: "2.73 million light-years" },
      { label: "Diameter", value: "60,000 light-years" },
      { label: "Stars", value: "~40 billion" },
      { label: "Type", value: "Spiral (SA(s)d)" },
    ],
  },
  {
    id: "whirlpool",
    image: "",
    name: "Whirlpool Galaxy (M51)",
    category: "galaxy",
    gradient: grad("oklch(0.65 0.16 280)", "oklch(0.30 0.12 260)", "oklch(0.05 0.02 270)"),
    description:
      "An iconic grand-design spiral galaxy interacting with its companion NGC 5195. The Whirlpool is one of the most photogenic galaxies, showing beautifully defined spiral arms with star-forming regions glowing pink.",
    interestingFacts: [
      "First galaxy recognized as a spiral (by Lord Rosse in 1845)",
      "Beautifully symmetric spiral arms",
      "Companion galaxy NGC 5195 passing nearby",
      "Bright enough for small telescopes",
    ],
    scientificData: [
      { label: "Distance", value: "23 million light-years" },
      { label: "Diameter", value: "76,000 light-years" },
      { label: "Magnitude", value: "+8.4" },
      { label: "Type", value: "Grand design spiral" },
    ],
  },
  {
    id: "sombrero",
    image: "",
    name: "Sombrero Galaxy (M104)",
    category: "galaxy",
    gradient: grad("oklch(0.55 0.12 50)", "oklch(0.25 0.06 30)", "oklch(0.05 0.02 270)"),
    description:
      "An unusual galaxy with a bright nucleus and a dark dust lane that gives it the appearance of a sombrero hat. The Sombrero is a lenticular galaxy with a massive halo of globular clusters.",
    interestingFacts: [
      "Looks like a wide-brimmed hat from Earth",
      "Has a supermassive black hole at its center (~1 billion solar masses)",
      "Hosts nearly 2,000 globular clusters",
      "Bright enough for amateur telescopes",
    ],
    scientificData: [
      { label: "Distance", value: "31 million light-years" },
      { label: "Diameter", value: "50,000 light-years" },
      { label: "Black Hole", value: "~1 billion solar masses" },
      { label: "Type", value: "Lenticular (Sa)" },
    ],
  },
  {
    id: "centaurus-a",
    image: "",
    name: "Centaurus A",
    category: "galaxy",
    gradient: grad("oklch(0.60 0.16 30)", "oklch(0.30 0.10 280)", "oklch(0.05 0.02 270)"),
    description:
      "A peculiar galaxy in the constellation Centaurus, the closest active galactic nucleus to Earth. Its odd appearance comes from a past collision with another galaxy that triggered intense star formation.",
    interestingFacts: [
      "Closest active galaxy to Earth",
      "Result of a galaxy collision",
      "Powerful radio source (one of the brightest in the sky)",
      "Has a relativistic jet from its central black hole",
    ],
    scientificData: [
      { label: "Distance", value: "13 million light-years" },
      { label: "Diameter", value: "60,000 light-years" },
      { label: "Type", value: "Peculiar (S0/SB)" },
      { label: "Black Hole", value: "55 million solar masses" },
    ],
  },

  // === NEBULAE ===
  {
    id: "crab-nebula",
    image: "",
    name: "Crab Nebula (M1)",
    category: "nebula",
    gradient: grad("oklch(0.55 0.16 250)", "oklch(0.30 0.10 280)", "oklch(0.05 0.02 270)"),
    description:
      "A supernova remnant from a star explosion witnessed by Chinese astronomers in 1054 AD. The Crab Nebula contains a rapidly spinning pulsar at its center, lighting up the surrounding gas 30 times per second.",
    interestingFacts: [
      "Supernova explosion recorded by Chinese astronomers in 1054 AD",
      "Spinning pulsar at its core flashes 30 times per second",
      "First object identified as a supernova remnant",
      "Still expanding at 1,500 km/s",
    ],
    scientificData: [
      { label: "Distance", value: "6,500 light-years" },
      { label: "Diameter", value: "11 light-years" },
      { label: "Age", value: "~970 years" },
      { label: "Type", value: "Supernova remnant" },
    ],
    relatedDestinations: ["mauna-kea", "cherry-springs"],
  },
  {
    id: "eagle-nebula",
    image: "",
    name: "Eagle Nebula (M16)",
    category: "nebula",
    gradient: grad("oklch(0.65 0.18 280)", "oklch(0.30 0.14 240)", "oklch(0.05 0.02 270)"),
    description:
      "Home to the famous 'Pillars of Creation' — towering columns of cold gas and dust where new stars are forming, made iconic by the Hubble Space Telescope.",
    interestingFacts: [
      "Contains the iconic 'Pillars of Creation'",
      "Towering columns of gas 4-5 light-years tall",
      "Hubble's most famous image subject",
      "Active star formation region",
    ],
    scientificData: [
      { label: "Distance", value: "7,000 light-years" },
      { label: "Diameter", value: "70x55 light-years" },
      { label: "Magnitude", value: "+6.0" },
      { label: "Type", value: "Emission Nebula + Open Cluster" },
    ],
  },
  {
    id: "lagoon-nebula",
    image: "",
    name: "Lagoon Nebula (M8)",
    category: "nebula",
    gradient: grad("oklch(0.60 0.16 200)", "oklch(0.30 0.10 240)", "oklch(0.05 0.02 270)"),
    description:
      "A bright emission nebula in Sagittarius, visible to the naked eye in dark skies. Its central 'hourglass' feature is illuminated by hot young stars forming within.",
    interestingFacts: [
      "Visible to naked eye in dark skies",
      "Contains the 'Hourglass Nebula' within",
      "Star-forming region in Sagittarius",
      "One of only two star-forming nebulae visible to naked eye (mid-northern latitudes)",
    ],
    scientificData: [
      { label: "Distance", value: "4,100 light-years" },
      { label: "Diameter", value: "60x35 light-years" },
      { label: "Magnitude", value: "+6.0" },
      { label: "Type", value: "Emission Nebula" },
    ],
  },
  {
    id: "carina-nebula",
    image: "",
    name: "Carina Nebula (NGC 3372)",
    category: "nebula",
    gradient: grad("oklch(0.70 0.20 320)", "oklch(0.30 0.14 280)", "oklch(0.05 0.02 270)"),
    description:
      "A massive, bright nebula in the southern sky containing several notable features including the Homunculus Nebula around the volatile star Eta Carinae. Often called the 'Grand Nebula' of the southern skies.",
    interestingFacts: [
      "Larger and brighter than the Orion Nebula",
      "Contains Eta Carinae, a star 100x more massive than the Sun",
      "Visible only from southern hemisphere",
      "JWST revealed stunning new details in 2022",
    ],
    scientificData: [
      { label: "Distance", value: "7,500 light-years" },
      { label: "Diameter", value: "300+ light-years" },
      { label: "Magnitude", value: "+1.0" },
      { label: "Type", value: "Emission Nebula" },
    ],
  },
  {
    id: "helix-nebula",
    image: "",
    name: "Helix Nebula (NGC 7293)",
    category: "nebula",
    gradient: grad("oklch(0.65 0.16 220)", "oklch(0.30 0.10 280)", "oklch(0.05 0.02 270)"),
    description:
      "The closest planetary nebula to Earth, often called the 'Eye of God' for its striking appearance. The Helix is the dying remnant of a Sun-like star shedding its outer layers.",
    interestingFacts: [
      "Closest planetary nebula to Earth",
      "Looks like a giant eye — called 'Eye of God'",
      "Dying star similar to what our Sun will become",
      "Spans the width of two full moons in the sky",
    ],
    scientificData: [
      { label: "Distance", value: "695 light-years" },
      { label: "Diameter", value: "5.7 light-years" },
      { label: "Magnitude", value: "+7.3" },
      { label: "Type", value: "Planetary Nebula" },
    ],
  },

  // === BLACK HOLES ===
  {
    id: "m87-star",
    image: "",
    name: "M87* (M87 Black Hole)",
    category: "black-hole",
    gradient: grad("oklch(0.15 0.10 30)", "oklch(0.05 0.05 270)", "oklch(0.02 0.02 270)"),
    description:
      "The first black hole ever directly imaged (2019). M87* sits at the center of galaxy M87, with a mass of 6.5 billion Suns and producing a relativistic jet that extends 5,000 light-years into space.",
    interestingFacts: [
      "First black hole ever directly photographed (2019)",
      "Mass of 6.5 billion Suns",
      "Located in galaxy M87, 53 million light-years away",
      "Powerful jet extends 5,000 light-years from it",
    ],
    scientificData: [
      { label: "Mass", value: "6.5 × 10⁹ solar masses" },
      { label: "Distance", value: "53 million light-years" },
      { label: "Event Horizon", value: "38 billion km" },
      { label: "First Image", value: "April 10, 2019" },
    ],
  },
  {
    id: "cygnus-x1",
    image: "",
    name: "Cygnus X-1",
    category: "black-hole",
    gradient: grad("oklch(0.20 0.10 240)", "oklch(0.05 0.05 270)", "oklch(0.02 0.02 270)"),
    description:
      "The first black hole ever identified (1971) and the subject of a famous bet between Stephen Hawking and Kip Thorne. Cygnus X-1 is a stellar-mass black hole feeding off a blue supergiant companion star.",
    interestingFacts: [
      "First confirmed black hole (1971)",
      "Hawking-Thorne famous bet about it",
      "Stellar-mass black hole (~21 solar masses)",
      "Powerful X-ray source from accretion disk",
    ],
    scientificData: [
      { label: "Mass", value: "21.2 solar masses" },
      { label: "Distance", value: "7,200 light-years" },
      { label: "Companion Star", value: "HDE 226868 (blue supergiant)" },
      { label: "Discovered", value: "1964/1971" },
    ],
  },
  {
    id: "gw150914",
    image: "",
    name: "GW150914 (First Gravitational Wave)",
    category: "black-hole",
    gradient: grad("oklch(0.25 0.10 280)", "oklch(0.05 0.05 270)", "oklch(0.02 0.02 270)"),
    description:
      "The first gravitational wave ever detected — a ripple in spacetime from two black holes merging 1.3 billion light-years away. The detection in 2015 confirmed Einstein's prediction from 1916.",
    interestingFacts: [
      "First gravitational wave detection (Sept 14, 2015)",
      "Confirmed Einstein's general relativity",
      "Two black holes (~36 and ~29 solar masses) merged",
      "Won 2017 Nobel Prize in Physics",
    ],
    scientificData: [
      { label: "Detected", value: "September 14, 2015" },
      { label: "Distance", value: "1.3 billion light-years" },
      { label: "Final Mass", value: "62 solar masses" },
      { label: "Energy Released", value: "3 solar masses (as gravitational waves)" },
    ],
  },
  {
    id: "ton-618",
    image: "",
    name: "TON 618",
    category: "black-hole",
    gradient: grad("oklch(0.15 0.10 280)", "oklch(0.05 0.05 270)", "oklch(0.02 0.02 270)"),
    description:
      "One of the most massive black holes known — a staggering 66 billion solar masses. TON 618 is a quasar powered by this ultramassive black hole, shining brighter than 140 trillion Suns.",
    interestingFacts: [
      "One of the most massive black holes ever found",
      "66 billion solar masses — 'ultramassive'",
      "Quasar shining 140 trillion times brighter than the Sun",
      "Discovered in 1970 from a radio survey",
    ],
    scientificData: [
      { label: "Mass", value: "66 billion solar masses" },
      { label: "Distance", value: "18.2 billion light-years" },
      { label: "Luminosity", value: "140 trillion Suns" },
      { label: "Type", value: "Hyperluminous quasar" },
    ],
  },
  {
    id: "gaia-bh1",
    image: "",
    name: "Gaia BH1",
    category: "black-hole",
    gradient: grad("oklch(0.20 0.10 30)", "oklch(0.05 0.05 270)", "oklch(0.02 0.02 270)"),
    description:
      "The closest black hole to Earth ever discovered (2022), at just 1,560 light-years away. Gaia BH1 has the mass of 10 Suns and orbits a Sun-like star — a rare and puzzling configuration.",
    interestingFacts: [
      "Closest known black hole to Earth",
      "Only 1,560 light-years away",
      "About 10 solar masses",
      "Puzzling orbit with a Sun-like companion",
    ],
    scientificData: [
      { label: "Distance", value: "1,560 light-years" },
      { label: "Mass", value: "9.6 solar masses" },
      { label: "Companion Star", value: "Sun-like (G-type)" },
      { label: "Discovered", value: "2022" },
    ],
  },

  // === EXOPLANETS ===
  {
    id: "kepler-452b",
    image: "",
    name: "Kepler-452b (Earth's Cousin)",
    category: "exoplanet",
    gradient: grad("oklch(0.55 0.16 200)", "oklch(0.30 0.10 220)", "oklch(0.05 0.02 270)"),
    description:
      "Often called 'Earth's cousin' due to its similar size and orbit around a Sun-like star. Kepler-452b takes 385 days to orbit its star — just 20 days longer than Earth's year.",
    interestingFacts: [
      "Called 'Earth's cousin' for similarity to our planet",
      "Orbits a Sun-like star (G2 type)",
      "Year is 385 days — almost Earth's",
      "About 60% larger than Earth",
    ],
    scientificData: [
      { label: "Distance", value: "1,400 light-years" },
      { label: "Mass", value: "5 Earth masses (est.)" },
      { label: "Orbital Period", value: "385 days" },
      { label: "Discovered", value: "2015" },
    ],
  },
  {
    id: "trappist-1e",
    image: "",
    name: "TRAPPIST-1e",
    category: "exoplanet",
    gradient: grad("oklch(0.60 0.16 30)", "oklch(0.30 0.10 280)", "oklch(0.05 0.02 270)"),
    description:
      "One of seven Earth-sized planets orbiting the ultra-cool dwarf star TRAPPIST-1. TRAPPIST-1e is in the habitable zone and may have liquid water — making it a prime target for the search for life.",
    interestingFacts: [
      "One of 7 planets in TRAPPIST-1 system",
      "Best candidate for habitability in the system",
      "Earth-sized, possibly with liquid water",
      "Year is only 6.1 days long",
    ],
    scientificData: [
      { label: "Distance", value: "40 light-years" },
      { label: "Mass", value: "0.69 Earth masses" },
      { label: "Orbital Period", value: "6.1 days" },
      { label: "Discovered", value: "2017" },
    ],
  },
  {
    id: "pegasi-51b",
    image: "",
    name: "51 Pegasi b (Bellerophon)",
    category: "exoplanet",
    gradient: grad("oklch(0.65 0.16 70)", "oklch(0.30 0.10 280)", "oklch(0.05 0.02 270)"),
    description:
      "The first exoplanet ever discovered orbiting a Sun-like star (1995). 51 Pegasi b is a 'hot Jupiter' — a gas giant so close to its star that its year lasts only 4 days and its atmosphere is being evaporated.",
    interestingFacts: [
      "First exoplanet around a Sun-like star (1995)",
      "Defined the 'hot Jupiter' class",
      "Year lasts just 4.2 Earth days",
      "Won 2019 Nobel Prize in Physics for its discoverers",
    ],
    scientificData: [
      { label: "Distance", value: "50 light-years" },
      { label: "Mass", value: "0.46 Jupiter masses" },
      { label: "Orbital Period", value: "4.2 days" },
      { label: "Discovered", value: "1995" },
    ],
  },
  {
    id: "k2-18b",
    image: "",
    name: "K2-18b",
    category: "exoplanet",
    gradient: grad("oklch(0.65 0.18 200)", "oklch(0.30 0.12 220)", "oklch(0.05 0.02 270)"),
    description:
      "A potentially habitable 'Hycean' planet — meaning it may have a hydrogen-rich atmosphere with oceans. JWST has detected carbon-bearing molecules in its atmosphere, making it a top target in the search for biosignatures.",
    interestingFacts: [
      "JWST detected carbon molecules in its atmosphere",
      "First 'Hycean' (hydrogen + ocean) world identified",
      "Could have liquid water oceans",
      "About 2.6x Earth's size",
    ],
    scientificData: [
      { label: "Distance", value: "120 light-years" },
      { label: "Mass", value: "8.6 Earth masses" },
      { label: "Orbital Period", value: "33 days" },
      { label: "Discovered", value: "2015" },
    ],
  },
  {
    id: "kepler-186f",
    image: "",
    name: "Kepler-186f",
    category: "exoplanet",
    gradient: grad("oklch(0.55 0.16 150)", "oklch(0.30 0.10 220)", "oklch(0.05 0.02 270)"),
    description:
      "The first Earth-sized planet discovered in the habitable zone of another star. Kepler-186f orbits a red dwarf star and is considered one of the best candidates for finding Earth-like life.",
    interestingFacts: [
      "First Earth-sized planet in habitable zone (2014)",
      "About 10% larger than Earth",
      "Orbits a cool red dwarf star",
      "Year is 130 days long",
    ],
    scientificData: [
      { label: "Distance", value: "580 light-years" },
      { label: "Radius", value: "1.11 Earth radii" },
      { label: "Orbital Period", value: "130 days" },
      { label: "Discovered", value: "2014" },
    ],
  },

  // === STARS ===
  {
    id: "betelgeuse",
    image: "",
    name: "Betelgeuse",
    category: "star",
    gradient: grad("oklch(0.70 0.20 30)", "oklch(0.35 0.14 25)", "oklch(0.05 0.02 270)"),
    description:
      "A red supergiant in Orion's shoulder — one of the largest and most luminous stars visible to the naked eye. Betelgeuse is near the end of its life and could go supernova 'any day' (in cosmic terms, within 100,000 years).",
    interestingFacts: [
      "Red supergiant in Orion's shoulder",
      "About 700x the size of the Sun",
      "Will go supernova within 100,000 years",
      "Noticed dramatic dimming in 2019-2020",
    ],
    scientificData: [
      { label: "Distance", value: "548 light-years" },
      { label: "Radius", value: "764 solar radii" },
      { label: "Mass", value: "16.5 solar masses" },
      { label: "Type", value: "Red supergiant (M1-M2)" },
    ],
  },
  {
    id: "polaris",
    image: "",
    name: "Polaris (North Star)",
    category: "star",
    gradient: grad("oklch(0.85 0.10 230)", "oklch(0.50 0.08 240)", "oklch(0.05 0.02 270)"),
    description:
      "The current Pole Star — sitting almost directly above Earth's North Pole, making it invaluable for navigation for centuries. Polaris is actually a triple star system, with the main star being a yellow supergiant.",
    interestingFacts: [
      "Current 'North Star' — sits above Earth's North Pole",
      "Triple star system (3 stars orbiting each other)",
      "Used by navigators for centuries",
      "Cepheid variable — pulses in brightness",
    ],
    scientificData: [
      { label: "Distance", value: "433 light-years" },
      { label: "Mass", value: "5.4 solar masses" },
      { label: "Type", value: "Yellow supergiant" },
      { label: "Magnitude", value: "+1.98" },
    ],
  },
  {
    id: "vega",
    image: "",
    name: "Vega",
    category: "star",
    gradient: grad("oklch(0.90 0.08 230)", "oklch(0.60 0.06 240)", "oklch(0.05 0.02 270)"),
    description:
      "The fifth-brightest star in the night sky and the standard against which astronomers measure the brightness of all other stars. Vega will become the Pole Star around 13,700 AD due to Earth's precession.",
    interestingFacts: [
      "Fifth-brightest star in night sky",
      "Standard zero-point for stellar magnitude scale",
      "Will become the North Star in ~14,000 AD",
      "Has a circumstellar disk of dust",
    ],
    scientificData: [
      { label: "Distance", value: "25 light-years" },
      { label: "Mass", value: "2.1 solar masses" },
      { label: "Type", value: "A0V (main sequence)" },
      { label: "Magnitude", value: "+0.03" },
    ],
  },
  {
    id: "antares",
    image: "",
    name: "Antares",
    category: "star",
    gradient: grad("oklch(0.70 0.20 20)", "oklch(0.35 0.14 25)", "oklch(0.05 0.02 270)"),
    description:
      "The 'rival of Mars' — a red supergiant in the heart of Scorpius. Antares is one of the largest known stars; if placed at the center of our solar system, it would extend beyond Mars' orbit.",
    interestingFacts: [
      "Name means 'rival of Ares (Mars)' in Greek",
      "If placed in our solar system, would extend past Mars",
      "Will become a supernova in the next 100,000 years",
      "Heart of the scorpion in Scorpius constellation",
    ],
    scientificData: [
      { label: "Distance", value: "550 light-years" },
      { label: "Radius", value: "680 solar radii" },
      { label: "Mass", value: "12 solar masses" },
      { label: "Type", value: "Red supergiant (M1.5Iab)" },
    ],
  },
  {
    id: "rigel",
    image: "",
    name: "Rigel",
    category: "star",
    gradient: grad("oklch(0.85 0.10 220)", "oklch(0.55 0.08 240)", "oklch(0.05 0.02 270)"),
    description:
      "The brightest star in Orion, marking the hunter's left foot. Rigel is a blue supergiant shining 120,000 times brighter than our Sun, and is one of the most intrinsically luminous stars visible.",
    interestingFacts: [
      "Brightest star in Orion",
      "Blue supergiant 120,000x Sun's luminosity",
      "Will end its life as a supernova",
      "Marks Orion's left foot",
    ],
    scientificData: [
      { label: "Distance", value: "860 light-years" },
      { label: "Radius", value: "78.9 solar radii" },
      { label: "Mass", value: "21 solar masses" },
      { label: "Type", value: "Blue supergiant (B8Ia)" },
    ],
  },
  {
    id: "proxima-centauri",
    image: "",
    name: "Proxima Centauri",
    category: "star",
    gradient: grad("oklch(0.70 0.16 30)", "oklch(0.30 0.10 280)", "oklch(0.05 0.02 270)"),
    description:
      "The closest star to our Sun, just 4.24 light-years away. Proxima Centauri is a red dwarf too faint to see with the naked eye, but hosts at least three planets including the potentially habitable Proxima b.",
    interestingFacts: [
      "Closest star to the Sun (4.24 light-years)",
      "Red dwarf, too faint to see without telescope",
      "Hosts 3 known exoplanets",
      "Target of Breakthrough Starshot mission",
    ],
    scientificData: [
      { label: "Distance", value: "4.24 light-years" },
      { label: "Mass", value: "0.12 solar masses" },
      { label: "Type", value: "Red dwarf (M5.5Ve)" },
      { label: "Magnitude", value: "+11.13" },
    ],
  },

  // === CONSTELLATIONS ===
  {
    id: "ursa-major",
    image: "",
    name: "Ursa Major (Great Bear)",
    category: "constellation",
    gradient: grad("oklch(0.65 0.16 250)", "oklch(0.30 0.10 280)", "oklch(0.05 0.02 270)"),
    description:
      "Home to the Big Dipper — perhaps the most recognized star pattern in the Northern Hemisphere. Ursa Major has been used for navigation for millennia, and the Big Dipper's 'pointer stars' indicate the North Star.",
    interestingFacts: [
      "Contains the Big Dipper asterism",
      "Used for navigation since antiquity",
      "Pointer stars show the way to Polaris",
      "Visible year-round from northern hemisphere",
    ],
    scientificData: [
      { label: "Brightest Star", value: "Alioth (ε UMa)" },
      { label: "Contains", value: "Big Dipper asterism" },
      { label: "Best Visible", value: "April (Northern Hemisphere)" },
      { label: "Stars", value: "7 named in Big Dipper" },
    ],
  },
  {
    id: "cassiopeia",
    image: "",
    name: "Cassiopeia",
    category: "constellation",
    gradient: grad("oklch(0.80 0.14 60)", "oklch(0.30 0.10 280)", "oklch(0.05 0.02 270)"),
    description:
      "Named after the vain Greek queen, this constellation is unmistakable for its 'W' shape (or 'M' depending on orientation). Cassiopeia is opposite the Big Dipper in the sky and is visible year-round in northern latitudes.",
    interestingFacts: [
      "Distinctive 'W' or 'M' shape",
      "Opposite the Big Dipper around Polaris",
      "Greek myth: vain queen punished by Poseidon",
      "Contains the Tycho Brahe's supernova of 1572",
    ],
    scientificData: [
      { label: "Brightest Star", value: "Schedar (α Cas)" },
      { label: "Notable Pattern", value: "'W' shape (5 bright stars)" },
      { label: "Best Visible", value: "November (Northern)" },
      { label: "Stars", value: "5 main + many fainter" },
    ],
  },
  {
    id: "scorpius",
    image: "",
    name: "Scorpius",
    category: "constellation",
    gradient: grad("oklch(0.65 0.20 20)", "oklch(0.30 0.10 280)", "oklch(0.05 0.02 270)"),
    description:
      "One of the zodiac constellations and arguably the most visually striking, Scorpius truly resembles a scorpion with its curved tail and the red heart star Antares. Best viewed from the southern hemisphere.",
    interestingFacts: [
      "Genuinely looks like a scorpion",
      "Bright red heart star Antares",
      "Zodiac constellation (Sun passes through Nov 22-29)",
      "Hosts many star clusters and the Scorpius X-1 X-ray source",
    ],
    scientificData: [
      { label: "Brightest Star", value: "Antares (α Sco)" },
      { label: "Notable Feature", value: "Curved 'tail' of stars" },
      { label: "Best Visible", value: "July (Southern Hemisphere)" },
      { label: "Zodiac", value: "Yes (Nov 22-29)" },
    ],
  },
  {
    id: "cygnus",
    image: "",
    name: "Cygnus (The Swan)",
    category: "constellation",
    gradient: grad("oklch(0.65 0.16 220)", "oklch(0.30 0.10 260)", "oklch(0.05 0.02 270)"),
    description:
      "A northern constellation flying down the Milky Way. Cygnus contains the Northern Cross asterism and is associated with the Kepler mission's exoplanet hunting field.",
    interestingFacts: [
      "Contains the 'Northern Cross' asterism",
      "Flies along the Milky Way band",
      "Hosted the Kepler exoplanet mission's field of view",
      "Bright star Deneb marks the swan's tail",
    ],
    scientificData: [
      { label: "Brightest Star", value: "Deneb (α Cyg)" },
      { label: "Contains", value: "Northern Cross asterism" },
      { label: "Best Visible", value: "September (Northern)" },
      { label: "Notable", value: "Kepler exoplanet field" },
    ],
  },
  {
    id: "lyra",
    image: "",
    name: "Lyra (The Lyre)",
    category: "constellation",
    gradient: grad("oklch(0.75 0.14 60)", "oklch(0.30 0.10 280)", "oklch(0.05 0.02 270)"),
    description:
      "A small but prominent constellation containing Vega, the fifth-brightest star in the night sky. Lyra represents the musical instrument of Orpheus in Greek mythology and is visible throughout summer in northern skies.",
    interestingFacts: [
      "Contains Vega, one of the brightest stars",
      "Represents Orpheus's lyre in Greek myth",
      "Hosts the Ring Nebula (M57)",
      "Small but easily recognizable parallelogram shape",
    ],
    scientificData: [
      { label: "Brightest Star", value: "Vega (α Lyr)" },
      { label: "Contains", value: "Ring Nebula (M57)" },
      { label: "Best Visible", value: "August (Northern)" },
      { label: "Pattern", value: "Small parallelogram" },
    ],
  },

  // === TELESCOPES ===
  {
    id: "hubble",
    image: "",
    name: "Hubble Space Telescope",
    category: "telescope",
    gradient: grad("oklch(0.55 0.16 250)", "oklch(0.25 0.08 260)", "oklch(0.05 0.02 270)"),
    description:
      "The most famous space telescope in history, in orbit since 1990. Hubble revolutionized astronomy with the Deep Field images, helped determine the age of the universe, and produced over 1.5 million observations used in 19,000+ scientific papers.",
    interestingFacts: [
      "In orbit since 1990",
      "1.5 million+ observations made",
      "Serviced 5 times by Space Shuttle crews",
      "Produced the iconic 'Pillars of Creation' image",
    ],
    scientificData: [
      { label: "Launch", value: "April 24, 1990" },
      { label: "Mirror", value: "2.4 meters" },
      { label: "Wavelength", value: "UV, visible, near-IR" },
      { label: "Orbit", value: "547 km altitude" },
    ],
  },
  {
    id: "hubble-eht",
    image: "",
    name: "Event Horizon Telescope",
    category: "telescope",
    gradient: grad("oklch(0.50 0.18 250)", "oklch(0.20 0.10 260)", "oklch(0.05 0.02 270)"),
    description:
      "A global network of radio telescopes working together as one Earth-sized telescope. EHT produced the first-ever direct image of a black hole (M87* in 2019) and Sagittarius A* (2022).",
    interestingFacts: [
      "Earth-sized virtual telescope",
      "First image of a black hole (2019)",
      "Network of radio telescopes worldwide",
      "Uses very-long-baseline interferometry (VLBI)",
    ],
    scientificData: [
      { label: "Resolution", value: "20 microarcseconds" },
      { label: "Wavelength", value: "1.3 mm (230 GHz)" },
      { label: "First Image", value: "April 10, 2019 (M87*)" },
      { label: "Stations", value: "11+ telescopes globally" },
    ],
  },
  {
    id: "keck",
    image: "",
    name: "Keck Observatory",
    category: "telescope",
    gradient: grad("oklch(0.70 0.18 30)", "oklch(0.25 0.10 280)", "oklch(0.05 0.02 270)"),
    description:
      "Twin 10-meter telescopes atop Mauna Kea in Hawaii, the second-largest optical telescopes in the world. Keck's segmented mirror design revolutionized telescope construction and enabled discoveries across all of astronomy.",
    interestingFacts: [
      "Twin 10-meter telescopes on Mauna Kea",
      "Pioneered segmented mirror technology",
      "Among the largest optical telescopes in the world",
      "Helped discover dark energy's acceleration",
    ],
    scientificData: [
      { label: "Location", value: "Mauna Kea, Hawaii" },
      { label: "Mirror", value: "10 m (segmented)" },
      { label: "Operational Since", value: "1993 (Keck I), 1996 (Keck II)" },
      { label: "Altitude", value: "4,145 m" },
    ],
  },
  {
    id: "elt",
    image: "",
    name: "Extremely Large Telescope (ELT)",
    category: "telescope",
    gradient: grad("oklch(0.65 0.16 250)", "oklch(0.25 0.10 280)", "oklch(0.05 0.02 270)"),
    description:
      "The largest optical/near-infrared telescope currently under construction in the Atacama Desert, Chile. With a 39-meter main mirror, the ELT will be the world's biggest eye on the sky when it begins operations around 2028.",
    interestingFacts: [
      "Largest optical telescope under construction",
      "39-meter main mirror (5x Hubble!)",
      "Located in Chile's Atacama Desert",
      "First light targeted for 2028",
    ],
    scientificData: [
      { label: "Location", value: "Cerro Armazones, Chile" },
      { label: "Mirror", value: "39.3 m (798 segments)" },
      { label: "First Light", value: "~2028" },
      { label: "Altitude", value: "3,046 m" },
    ],
  },
  {
    id: "vlt",
    image: "",
    name: "Very Large Telescope (VLT)",
    category: "telescope",
    gradient: grad("oklch(0.55 0.18 250)", "oklch(0.25 0.10 280)", "oklch(0.05 0.02 270)"),
    description:
      "Four 8.2-meter unit telescopes at Paranal Observatory in Chile that can work together as one giant interferometer. The VLT captured the first direct image of an exoplanet (Beta Pictoris b) and tracks stars orbiting Sgr A*.",
    interestingFacts: [
      "Four 8.2-meter telescopes in Chile",
      "Can work as one giant interferometer",
      "First direct image of an exoplanet (2008)",
      "Tracked stars orbiting the galactic center black hole",
    ],
    scientificData: [
      { label: "Location", value: "Paranal, Chile" },
      { label: "Mirrors", value: "4 × 8.2 m" },
      { label: "Operational Since", value: "1998-2000" },
      { label: "Altitude", value: "2,635 m" },
    ],
  },

  // === MISSIONS ===
  {
    id: "voyager-1",
    image: "",
    name: "Voyager 1",
    category: "mission",
    gradient: grad("oklch(0.55 0.16 250)", "oklch(0.30 0.10 260)", "oklch(0.05 0.02 270)"),
    description:
      "The most distant human-made object ever — Voyager 1 has been flying since 1977 and crossed into interstellar space in 2012. It carries the Golden Record, a message to any extraterrestrial civilization that may find it.",
    interestingFacts: [
      "Most distant human-made object",
      "Launched September 5, 1977",
      "Crossed into interstellar space (2012)",
      "Carries the Golden Record for aliens",
    ],
    scientificData: [
      { label: "Launched", value: "Sept 5, 1977" },
      { label: "Distance", value: "24+ billion km (and growing)" },
      { label: "Speed", value: "17 km/s" },
      { label: "First Interstellar", value: "Aug 25, 2012" },
    ],
  },
  {
    id: "cassini",
    image: "",
    name: "Cassini-Huygens",
    category: "mission",
    gradient: grad("oklch(0.65 0.16 70)", "oklch(0.30 0.10 280)", "oklch(0.05 0.02 270)"),
    description:
      "The most successful planetary mission ever. Cassini orbited Saturn for 13 years, revealing its moons in unprecedented detail. The Huygens probe made the first landing on an outer-solar-system body (Titan) in 2005.",
    interestingFacts: [
      "Orbited Saturn 13 years (2004-2017)",
      "Huygens probe landed on Titan in 2005",
      "Discovered geysers on Enceladus",
      "Ended with a dramatic plunge into Saturn (2017)",
    ],
    scientificData: [
      { label: "Launched", value: "Oct 15, 1997" },
      { label: "Saturn Arrival", value: "July 1, 2004" },
      { label: "End of Mission", value: "Sept 15, 2017" },
      { label: "Discoveries", value: "Enceladus geysers, Titan lakes" },
    ],
  },
  {
    id: "new-horizons",
    image: "",
    name: "New Horizons",
    category: "mission",
    gradient: grad("oklch(0.55 0.16 220)", "oklch(0.30 0.10 260)", "oklch(0.05 0.02 270)"),
    description:
      "The first spacecraft to visit Pluto, flying past the dwarf planet in 2015 after a 9.5-year journey. New Horizons revealed Pluto to be a complex world with mountains, glaciers, and a heart-shaped nitrogen-ice plain.",
    interestingFacts: [
      "First mission to Pluto (2015)",
      "Revealed Pluto's 'heart' (Tombaugh Regio)",
      "Now exploring the Kuiper Belt",
      "Flew past Arrokoth (2019)",
    ],
    scientificData: [
      { label: "Launched", value: "Jan 19, 2006" },
      { label: "Pluto Flyby", value: "July 14, 2015" },
      { label: "Speed", value: "16 km/s" },
      { label: "Status", value: "Active, in Kuiper Belt" },
    ],
  },
  {
    id: "perseverance",
    image: "",
    name: "Perseverance Rover",
    category: "mission",
    gradient: grad("oklch(0.65 0.18 30)", "oklch(0.30 0.10 280)", "oklch(0.05 0.02 270)"),
    description:
      "NASA's most advanced Mars rover, searching for signs of ancient life in Jezero Crater since 2021. Perseverance carries the Ingenuity helicopter — the first aircraft to fly on another planet — and is collecting samples for future return to Earth.",
    interestingFacts: [
      "Searching for ancient Martian life in Jezero Crater",
      "Carries Ingenuity — first helicopter on Mars",
      "Collecting samples for future Mars Sample Return mission",
      "Landed Feb 18, 2021",
    ],
    scientificData: [
      { label: "Landed", value: "Feb 18, 2021" },
      { label: "Mass", value: "1,025 kg" },
      { label: "Power", value: "Nuclear (RTG)" },
      { label: "Sample Tubes", value: "43" },
    ],
  },
  {
    id: "parker",
    image: "",
    name: "Parker Solar Probe",
    category: "mission",
    gradient: grad("oklch(0.85 0.20 50)", "oklch(0.30 0.10 280)", "oklch(0.05 0.02 270)"),
    description:
      "The first spacecraft to 'touch' the Sun. Parker Solar Probe has flown through the Sun's corona multiple times, surviving temperatures of 1,400°C to study solar wind and the mysteries of coronal heating.",
    interestingFacts: [
      "First spacecraft to 'touch' the Sun",
      "Survives 1,400°C heat (carbon shield)",
      "Fastest human-made object ever (635,266 km/h)",
      "Helped unlock secrets of the solar wind",
    ],
    scientificData: [
      { label: "Launched", value: "Aug 12, 2018" },
      { label: "Closest Approach", value: "6.2 million km from Sun" },
      { label: "Top Speed", value: "635,266 km/h" },
      { label: "Heat Shield", value: "Carbon-composite, 11.4 cm thick" },
    ],
  },
  {
    id: "juno",
    image: "",
    name: "Juno",
    category: "mission",
    gradient: grad("oklch(0.70 0.18 70)", "oklch(0.30 0.10 280)", "oklch(0.05 0.02 270)"),
    description:
      "NASA's mission to Jupiter, in orbit since 2016. Juno's polar orbit lets it study Jupiter's deep atmosphere, magnetic field, and gravity field, revealing that Jupiter's banded clouds extend deep and that its core is 'fuzzy'.",
    interestingFacts: [
      "Orbiting Jupiter since 2016",
      "First polar orbiter of a gas giant",
      "Revealed Jupiter's 'fuzzy' core",
      "Discovered giant cyclones at Jupiter's poles",
    ],
    scientificData: [
      { label: "Launched", value: "Aug 5, 2011" },
      { label: "Jupiter Arrival", value: "July 4, 2016" },
      { label: "Orbit Type", value: "Polar, highly elliptical" },
      { label: "Status", value: "Active" },
    ],
  },

  // === ASTRONAUTS ===
  {
    id: "aldrin",
    image: "",
    name: "Buzz Aldrin",
    category: "astronaut",
    gradient: grad("oklch(0.50 0.06 250)", "oklch(0.25 0.04 260)", "oklch(0.05 0.02 270)"),
    description:
      "The second person to walk on the Moon during Apollo 11. A West Point graduate, fighter pilot in Korea, and MIT PhD, Aldrin earned the nickname 'Dr. Rendezvous' for his pioneering work on orbital docking techniques.",
    interestingFacts: [
      "Second person to walk on the Moon (Apollo 11)",
      "Earned the nickname 'Dr. Rendezvous'",
      "MIT PhD in astronautics",
      "Took the first space selfie (Gemini 12, 1966)",
    ],
    scientificData: [
      { label: "Mission", value: "Apollo 11 (1969)" },
      { label: "Born", value: "Jan 20, 1930, Montclair NJ" },
      { label: "Time on Moon", value: "2h 31m EVA" },
      { label: "Other Missions", value: "Gemini 12" },
    ],
  },
  {
    id: "sally-ride",
    image: "",
    name: "Sally Ride",
    category: "astronaut",
    gradient: grad("oklch(0.65 0.16 250)", "oklch(0.25 0.10 260)", "oklch(0.05 0.02 270)"),
    description:
      "The first American woman in space (1983) aboard STS-7. Ride was a physicist, an advocate for STEM education, and flew twice on the Space Shuttle Challenger before becoming a professor and co-founding Sally Ride Science.",
    interestingFacts: [
      "First American woman in space (1983)",
      "Flew on Space Shuttle Challenger twice",
      "Physicist (PhD from Stanford)",
      "Co-founded Sally Ride Science to inspire kids",
    ],
    scientificData: [
      { label: "First Mission", value: "STS-7 (June 1983)" },
      { label: "Born", value: "May 26, 1951" },
      { label: "Died", value: "July 23, 2012" },
      { label: "Time in Space", value: "14 days, 7 hours" },
    ],
  },
  {
    id: "valentina",
    image: "",
    name: "Valentina Tereshkova",
    category: "astronaut",
    gradient: grad("oklch(0.65 0.16 320)", "oklch(0.25 0.10 260)", "oklch(0.05 0.02 270)"),
    description:
      "The first woman in space (June 1963), and to this day the only woman to have flown a solo space mission. Tereshkova orbited Earth 48 times aboard Vostok 6 and became a global icon for women in science.",
    interestingFacts: [
      "First woman in space (June 16, 1963)",
      "Only woman to fly a solo space mission",
      "48 orbits of Earth in 3 days",
      "Originally a textile factory worker and amateur skydiver",
    ],
    scientificData: [
      { label: "Mission", value: "Vostok 6 (June 1963)" },
      { label: "Born", value: "March 6, 1937" },
      { label: "Time in Space", value: "2 days, 23 hours" },
      { label: "Orbits", value: "48" },
    ],
  },
  {
    id: "scott-kelly",
    image: "",
    name: "Scott Kelly",
    category: "astronaut",
    gradient: grad("oklch(0.55 0.16 220)", "oklch(0.25 0.10 260)", "oklch(0.05 0.02 270)"),
    description:
      "Spent nearly a year on the ISS (2015-16) to study long-duration spaceflight effects on the human body. The Year in Space mission involved his twin brother Mark Kelly (also an astronaut) as a ground-based control.",
    interestingFacts: [
      "Spent 340 days on ISS (Year in Space)",
      "Twin brother Mark is also an astronaut",
      "NASA's Twin Study revealed gene expression changes",
      "Captured stunning photos from space",
    ],
    scientificData: [
      { label: "Year in Space", value: "340 days (2015-2016)" },
      { label: "Born", value: "Feb 21, 1964" },
      { label: "Total Space Time", value: "520 days" },
      { label: "Missions", value: "4 spaceflights" },
    ],
  },
  {
    id: "christina-koch",
    image: "",
    name: "Christina Koch",
    category: "astronaut",
    gradient: grad("oklch(0.55 0.16 30)", "oklch(0.25 0.10 260)", "oklch(0.05 0.02 270)"),
    description:
      "Holds the record for the longest single spaceflight by a woman (328 days). Koch also conducted the first all-female spacewalk with Jessica Meir in October 2019, and is part of NASA's Artemis generation training to return to the Moon.",
    interestingFacts: [
      "Longest single spaceflight by a woman (328 days)",
      "First all-female spacewalk (with Jessica Meir, 2019)",
      "Part of Artemis generation (Moon return)",
      "Worked at the South Pole before NASA",
    ],
    scientificData: [
      { label: "Born", value: "Jan 2, 1979" },
      { label: "Total Space Time", value: "328 days" },
      { label: "Spacewalks", value: "6 (42h 15m)" },
      { label: "First Mission", value: "Expedition 59-61 (2019-20)" },
    ],
  },
  {
    id: "maezawa",
    image: "",
    name: "Yusaku Maezawa",
    category: "astronaut",
    gradient: grad("oklch(0.65 0.18 30)", "oklch(0.25 0.10 280)", "oklch(0.05 0.02 270)"),
    description:
      "Japanese entrepreneur and first paying passenger on a Soyuz flight to the ISS (December 2021). Maezawa is also funding the dearMoon project — a planned circumlunar flight aboard SpaceX's Starship with artists as crew.",
    interestingFacts: [
      "First Japanese space tourist (Dec 2021)",
      "Spent 12 days on the ISS",
      "Funding the dearMoon circumlunar mission",
      "Plans to take 8 artists around the Moon",
    ],
    scientificData: [
      { label: "Mission", value: "Soyuz MS-20 (Dec 2021)" },
      { label: "Born", value: "Nov 22, 1975" },
      { label: "Time in Space", value: "12 days" },
      { label: "Project", value: "dearMoon (with SpaceX)" },
    ],
  },
'''

def main():
    p = Path("/home/z/my-project/src/lib/data/cosmos.ts")
    content = p.read_text()
    # Find the closing of the cosmicObjects array (line containing "];" right after the last cosmic object)
    # The pattern is: armstrong block ends with `},` followed by `];` on the next line
    # We'll inject before the `];`
    needle = "  },\n];\n\nexport const news:"
    if needle not in content:
        print("Needle not found — looking for alternative...")
        # Try a more lenient search
        import re
        match = re.search(r'(\s+\},\s*\n)(\];\s*\n\s*\nexport const news)', content)
        if not match:
            print("Could not find injection point")
            return
        insertion_point = match.start() + len(match.group(1))
        new_content = content[:insertion_point] + NEW_OBJECTS + content[insertion_point:]
    else:
        new_content = content.replace(needle, NEW_OBJECTS + "  },\n];\n\nexport const news:")
    
    p.write_text(new_content)
    print("✓ Added 30 new cosmic objects")

if __name__ == "__main__":
    main()
