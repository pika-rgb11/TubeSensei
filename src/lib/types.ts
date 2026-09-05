// Core types for Cosmos Voyages platform

export type Category =
  | "stargazing"
  | "observatory"
  | "planetarium"
  | "space-center"
  | "space-museum"
  | "astro-camping"
  | "astrophotography"
  | "eclipse"
  | "meteor-shower"
  | "dark-sky";

export interface Location {
  id: string;
  name: string;
  country: string;
  city: string;
  category: Category;
  rating: number; // 0-5
  reviewsCount: number;
  bestViewingTime: string; // "Year-round" | "June - August" etc.
  darkSkyRating: number; // 0-10 (Bortle scale inverted)
  lightPollutionLevel: string; // "Excellent" | "Good" | "Moderate"
  visibilityScore: number; // 0-100
  description: string;
  whyVisit: string;
  bestMonths: string[];
  thingsToBring: string[];
  photographyTips: string[];
  openingHours: string;
  ticketInfo: string;
  coordinates: { lat: number; lng: number };
  image: string; // URL to real photo
  imageGradient: string; // CSS gradient for hero (fallback)
  galleryGradients: string[];
  nearbyAttractions: string[];
  experiences: Experience[];
  trending?: boolean;
  featured?: boolean;
  priceLevel: 1 | 2 | 3;
  distanceFromUser?: number; // km, computed dynamically
}

export type ExperienceType =
  | "stargazing-tour"
  | "telescope-experience"
  | "astronomy-camp"
  | "night-sky-tour"
  | "observatory-ticket"
  | "museum-ticket"
  | "photography-workshop";

export interface Experience {
  id: string;
  type: ExperienceType;
  title: string;
  description: string;
  price: number;
  currency: string;
  duration: string;
  rating: number;
  reviews: number;
  availability: string;
  inclusions: string[];
}

export type EventType =
  | "solar-eclipse"
  | "lunar-eclipse"
  | "meteor-shower"
  | "conjunction"
  | "rocket-launch"
  | "iss-visibility"
  | "aurora"
  | "astronomy-festival"
  | "space-exhibition";

export interface SpaceEvent {
  id: string;
  type: EventType;
  name: string;
  date: string; // ISO date
  time: string;
  visibilityRegion: string;
  visibilityPercent: number;
  bestLocation: string;
  description: string;
  details: string;
  peakTime?: string;
  duration?: string;
  image: string; // URL to real photo
  imageGradient: string;
}

export interface Review {
  id: string;
  author: string;
  avatar: string; // initials
  rating: number;
  date: string;
  text: string;
  helpful: number;
  photos?: number;
}

export type PlanetId =
  | "sun" | "mercury" | "venus" | "earth" | "mars"
  | "jupiter" | "saturn" | "uranus" | "neptune";

export type PlanetTextureKind =
  | "star"
  | "rocky-cratered"
  | "clouded-venus"
  | "earth-like"
  | "mars-like"
  | "gas-banded-jupiter"
  | "gas-banded-saturn"
  | "ice-giant-uranus"
  | "ice-giant-neptune";

export interface PlanetTexture {
  kind: PlanetTextureKind;
  baseColor: string;       // primary surface color (oklch)
  secondaryColor: string;  // accent color (bands, ice caps, craters)
  accentColor: string;     // highlight / storm / glow
  atmosphereColor?: string; // atmospheric halo color (earth/venus)
  ringColor?: string;       // saturn-style ring
  hasRing?: boolean;
}

export interface Planet {
  id: PlanetId;
  name: string;
  type: string;
  diameter: string;
  distanceFromSun: string;
  orbitalPeriod: string;
  rotationPeriod: string;
  moons: number;
  temperature: string;
  gravity: string;
  color: string;
  gradient: string;
  texture: PlanetTexture;
  description: string;
  interestingFacts: string[];
  scientificData: { label: string; value: string }[];
  relatedDestinations: string[];
}

export interface CosmicObject {
  id: string;
  name: string;
  category: "galaxy" | "nebula" | "black-hole" | "exoplanet" | "star" | "constellation" | "telescope" | "mission" | "astronaut";
  image: string; // URL to real photo
  gradient: string;
  description: string;
  interestingFacts: string[];
  scientificData: { label: string; value: string }[];
  relatedDestinations?: string[];
  relatedEvents?: string[];
}

export interface SpaceNews {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  date: string;
  readTime: string;
  gradient: string;
}

export interface Guide {
  id: string;
  title: string;
  category: string;
  readTime: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  excerpt: string;
  gradient: string;
}

export type ViewId =
  | "home"
  | "explore"
  | "cosmic-map"
  | "events"
  | "tonights-sky"
  | "knowledge"
  | "astro-guide"
  | "profile"
  | "admin"
  | "booking"
  | "location-detail";

export interface UserState {
  id: string;
  name: string;
  email: string;
  avatarGradient: string;
  joinedAt: string;
  visited: string[]; // location ids
  saved: string[];
  wishlist: string[];
  attendedEvents: string[];
  photos: { id: string; title: string; gradient: string; date: string; location: string }[];
  bucketList: string[];
  reviewsCount: number;
  journeyProgress: number; // 0-100
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}
