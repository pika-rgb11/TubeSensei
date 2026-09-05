"use client";

import { motion } from "framer-motion";
import {
  Search, ArrowRight, Sparkles, Telescope, MapPin, Globe2,
  Star, Moon, Calendar, TrendingUp, ArrowUpRight, Clock,
} from "lucide-react";
import { StarField } from "@/components/common/StarField";
import { GlassCard } from "@/components/common/GlassCard";
import { SectionHeader } from "@/components/common/SectionHeader";
import { LocationCard } from "@/components/cards/LocationCard";
import { EventCard } from "@/components/cards/EventCard";
import { useAppStore } from "@/store/app-store";
import { locations } from "@/lib/data/locations";
import { events } from "@/lib/data/events";
import { news, guides } from "@/lib/data/cosmos";
import { useState } from "react";
import { toast } from "sonner";

const SEARCH_OPTIONS = [
  { label: "Stargazing", emoji: "🌌", category: "stargazing" },
  { label: "Observatory", emoji: "🔭", category: "observatory" },
  { label: "Planetarium", emoji: "🪐", category: "planetarium" },
  { label: "Space Museum", emoji: "🏛️", category: "space-museum" },
  { label: "Dark Sky", emoji: "🌙", category: "dark-sky" },
  { label: "Space Event", emoji: "☄️", category: "meteor-shower" },
];

export function HomeView() {
  const navigate = useAppStore((s) => s.navigate);
  const setExploreCategory = useAppStore((s) => s.setExploreCategory);
  const setSearchQuery = useAppStore((s) => s.setSearchQuery);
  const [searchValue, setSearchValue] = useState("");

  const trending = locations.filter((l) => l.trending).slice(0, 6);
  const bestStargazing = locations.filter((l) => ["dark-sky", "stargazing"].includes(l.category)).slice(0, 3);
  const featuredObservatories = locations.filter((l) => l.observatory || l.category === "observatory").slice(0, 3).length
    ? locations.filter((l) => l.category === "observatory").slice(0, 3)
    : locations.filter((l) => l.featured && l.category === "observatory").slice(0, 3);
  const upcomingEvents = events.slice(0, 3);

  const handleSearch = () => {
    setSearchQuery(searchValue);
    setExploreCategory("all");
    navigate("explore");
    toast.success(`Searching for "${searchValue || "all locations"}"`);
  };

  const handleCategoryClick = (category: string) => {
    setExploreCategory(category);
    navigate("explore");
  };

  return (
    <div className="space-y-20 pb-12">
      {/* HERO */}
      <section className="relative min-h-[88vh] flex items-center pt-20 pb-12 overflow-hidden">
        {/* Background layers */}
        <div className="absolute inset-0 pointer-events-none">
          <StarField count={120} withShootingStars />
          {/* Nebula blobs */}
          <div className="absolute top-1/4 left-1/4 w-[40vw] h-[40vw] rounded-full opacity-40 blur-3xl animate-drift"
            style={{ background: "radial-gradient(circle, oklch(0.45 0.20 290), transparent 70%)" }}
          />
          <div className="absolute bottom-1/4 right-1/4 w-[35vw] h-[35vw] rounded-full opacity-30 blur-3xl animate-float"
            style={{ background: "radial-gradient(circle, oklch(0.50 0.18 220), transparent 70%)" }}
          />
        </div>

        <div className="container mx-auto px-6 relative">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto text-center"
          >
            {/* Floating planet decoration */}
            <div className="flex justify-center mb-8">
              <div className="relative h-24 w-24">
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary via-accent to-primary animate-pulse-glow" />
                <div className="absolute inset-2 rounded-full bg-background/80 backdrop-blur flex items-center justify-center">
                  <Telescope className="h-8 w-8 text-primary" />
                </div>
                {/* Orbital rings */}
                <div className="absolute -inset-3 rounded-full border border-primary/20 animate-spin-slow" />
                <div className="absolute -inset-6 rounded-full border border-accent/15 animate-spin-slow" style={{ animationDirection: "reverse" }} />
                {/* Orbiting planet */}
                <div className="absolute -inset-3 animate-spin-slow">
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 h-3 w-3 rounded-full bg-accent shadow-[0_0_12px_oklch(0.78_0.20_320)]" />
                </div>
              </div>
            </div>

            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass text-xs text-muted-foreground mb-6">
              <Sparkles className="h-3 w-3 text-primary" />
              <span>Discover 1,200+ cosmic destinations worldwide</span>
            </div>

            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight leading-[0.95] mb-6">
              Explore the{" "}
              <span className="text-gradient-cosmic">Universe</span>.
              <br />
              From <span className="text-gradient-aurora">Earth</span>.
            </h1>

            <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
              Discover the world's best places to see the stars, explore space,
              and experience the cosmos — from the darkest deserts to the
              highest mountain observatories on the planet.
            </p>

            {/* Search bar */}
            <div className="max-w-2xl mx-auto mb-6">
              <GlassCard variant="strong" className="p-2">
                <div className="flex items-center gap-2">
                  <div className="pl-3">
                    <Search className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <input
                    type="text"
                    placeholder="Where do you want to explore?"
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                    className="flex-1 bg-transparent border-0 outline-none text-sm placeholder:text-muted-foreground px-2"
                  />
                  <button
                    onClick={handleSearch}
                    className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-all hover:glow-primary"
                  >
                    <span className="hidden sm:inline">Search</span>
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </GlassCard>
            </div>

            {/* Search options */}
            <div className="flex flex-wrap justify-center gap-2 mb-8">
              {SEARCH_OPTIONS.map((opt) => (
                <button
                  key={opt.label}
                  onClick={() => handleCategoryClick(opt.category)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full glass text-xs hover:bg-white/10 hover:border-primary/40 transition-all"
                >
                  <span className="text-sm">{opt.emoji}</span>
                  {opt.label}
                </button>
              ))}
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap items-center justify-center gap-3">
              <button
                onClick={() => navigate("explore")}
                className="group flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-medium hover:glow-primary transition-all"
              >
                <MapPin className="h-4 w-4" />
                Explore Locations
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </button>
              <button
                onClick={() => navigate("events")}
                className="group flex items-center gap-2 px-6 py-3 rounded-xl glass-strong hover:glow-accent transition-all font-medium"
              >
                <Calendar className="h-4 w-4" />
                Upcoming Events
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-3 gap-4 max-w-xl mx-auto mt-12">
              {[
                { value: "1,200+", label: "Destinations" },
                { value: "240+", label: "Upcoming Events" },
                { value: "85K", label: "Stargazers" },
              ].map((s) => (
                <div key={s.label} className="text-center">
                  <div className="text-2xl md:text-3xl font-bold text-gradient-cosmic">{s.value}</div>
                  <div className="text-xs text-muted-foreground uppercase tracking-wider mt-1">{s.label}</div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* TRENDING DESTINATIONS */}
      <section className="container mx-auto px-6">
        <SectionHeader
          eyebrow="Most Popular"
          title="Trending Space Destinations"
          subtitle="The cosmic hotspots everyone's talking about this season — from desert dark skies to mountaintop observatories."
          icon={<TrendingUp className="h-3.5 w-3.5" />}
          action={
            <button
              onClick={() => navigate("explore")}
              className="flex items-center gap-1.5 text-sm text-primary hover:gap-2.5 transition-all"
            >
              See all <ArrowUpRight className="h-4 w-4" />
            </button>
          }
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {trending.map((l, i) => (
            <LocationCard key={l.id} location={l} index={i} />
          ))}
        </div>
      </section>

      {/* BEST STARGAZING */}
      <section className="container mx-auto px-6">
        <SectionHeader
          eyebrow="Top Rated"
          title="Best Stargazing Places"
          subtitle="The darkest skies on Earth — verified Bortle class 1-3 destinations where the Milky Way casts shadows on moonless nights."
          icon={<Star className="h-3.5 w-3.5" />}
          action={
            <button
              onClick={() => navigate("explore", { category: "dark-sky" })}
              className="flex items-center gap-1.5 text-sm text-primary hover:gap-2.5 transition-all"
            >
              See all <ArrowUpRight className="h-4 w-4" />
            </button>
          }
        />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {bestStargazing.map((l, i) => (
            <LocationCard key={l.id} location={l} index={i} />
          ))}
        </div>
      </section>

      {/* UPCOMING EVENTS */}
      <section className="container mx-auto px-6">
        <SectionHeader
          eyebrow="Don't Miss"
          title="Upcoming Astronomical Events"
          subtitle="Eclipses, meteor showers, aurora windows, and rocket launches — with live countdowns and best viewing locations."
          icon={<Calendar className="h-3.5 w-3.5" />}
          action={
            <button
              onClick={() => navigate("events")}
              className="flex items-center gap-1.5 text-sm text-primary hover:gap-2.5 transition-all"
            >
              See all <ArrowUpRight className="h-4 w-4" />
            </button>
          }
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {upcomingEvents.map((e, i) => (
            <EventCard key={e.id} event={e} index={i} variant="default" />
          ))}
        </div>
      </section>

      {/* NEARBY EXPERIENCES — banner */}
      <section className="container mx-auto px-6">
        <GlassCard variant="strong" className="relative overflow-hidden p-8 md:p-12">
          <div className="absolute inset-0 pointer-events-none">
            <StarField count={40} />
            <div className="absolute top-0 right-0 w-72 h-72 rounded-full opacity-40 blur-3xl"
              style={{ background: "radial-gradient(circle, oklch(0.50 0.18 200), transparent 70%)" }}
            />
          </div>
          <div className="relative grid md:grid-cols-2 gap-8 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass text-xs mb-4">
                <Globe2 className="h-3 w-3 text-primary" />
                <span>Nearby Experiences</span>
              </div>
              <h3 className="text-3xl md:text-4xl font-bold mb-4 tracking-tight">
                Cosmic experiences, <span className="text-gradient-aurora">within reach</span>
              </h3>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                Open Tonight's Sky and we'll instantly show you what's visible
                from your location — planets, constellations, ISS passes, and
                a stargazing score calculated from real-time light pollution
                and weather data.
              </p>
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => navigate("tonights-sky")}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground font-medium hover:glow-primary transition-all"
                >
                  <Moon className="h-4 w-4" />
                  Open Tonight's Sky
                </button>
                <button
                  onClick={() => navigate("cosmic-map")}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl glass font-medium hover:bg-white/10 transition-all"
                >
                  <MapPin className="h-4 w-4" />
                  Cosmic Map
                </button>
              </div>
            </div>
            <div className="relative h-64">
              {/* Tonight's sky preview visual */}
              <div className="absolute inset-0 rounded-2xl overflow-hidden glass-card">
                <StarField count={50} />
                {/* Moon */}
                <div className="absolute top-8 right-8 h-16 w-16 rounded-full"
                  style={{
                    background: "radial-gradient(circle at 30% 30%, oklch(0.95 0.02 80), oklch(0.70 0.04 60) 70%, oklch(0.40 0.04 50))",
                    boxShadow: "0 0 30px oklch(0.90 0.05 70 / 0.4)",
                  }}
                />
                {/* Constellations (line art) */}
                <svg className="absolute inset-0 w-full h-full" style={{ opacity: 0.6 }}>
                  <g stroke="oklch(0.72 0.18 245)" strokeWidth="1" fill="none">
                    <line x1="20%" y1="40%" x2="30%" y2="55%" />
                    <line x1="30%" y1="55%" x2="45%" y2="50%" />
                    <line x1="45%" y1="50%" x2="55%" y2="65%" />
                  </g>
                  <g fill="oklch(0.95 0.02 250)">
                    <circle cx="20%" cy="40%" r="2" />
                    <circle cx="30%" cy="55%" r="2.5" />
                    <circle cx="45%" cy="50%" r="2" />
                    <circle cx="55%" cy="65%" r="2.5" />
                    <circle cx="35%" cy="25%" r="1.5" />
                    <circle cx="65%" cy="35%" r="2" />
                  </g>
                </svg>
                {/* Live badge */}
                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between gap-2">
                  <div className="px-3 py-1.5 rounded-lg glass-strong text-xs flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                    Live stargazing score: 92/100
                  </div>
                  <div className="px-3 py-1.5 rounded-lg glass-strong text-xs flex items-center gap-1.5">
                    <Clock className="h-3 w-3" />
                    Updated just now
                  </div>
                </div>
              </div>
            </div>
          </div>
        </GlassCard>
      </section>

      {/* FEATURED OBSERVATORIES */}
      <section className="container mx-auto px-6">
        <SectionHeader
          eyebrow="World Class"
          title="Featured Observatories"
          subtitle="From UNESCO World Heritage Sites to the largest radio arrays on the planet — these are the temples of modern astronomy."
          icon={<Telescope className="h-3.5 w-3.5" />}
          action={
            <button
              onClick={() => navigate("explore", { category: "observatory" })}
              className="flex items-center gap-1.5 text-sm text-primary hover:gap-2.5 transition-all"
            >
              See all <ArrowUpRight className="h-4 w-4" />
            </button>
          }
        />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {featuredObservatories.map((l, i) => (
            <LocationCard key={l.id} location={l} index={i} />
          ))}
        </div>
      </section>

      {/* SPACE NEWS */}
      <section className="container mx-auto px-6">
        <SectionHeader
          eyebrow="Latest Discoveries"
          title="Space News"
          subtitle="What's happening across the cosmos — from the James Webb Space Telescope to the latest Mars rover findings."
          icon={<Sparkles className="h-3.5 w-3.5" />}
        />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {news.map((n, i) => (
            <motion.button
              key={n.id}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.45, delay: i * 0.06 }}
              whileHover={{ y: -4 }}
              onClick={() => toast.info("Full article coming soon", { description: n.title })}
              className="group text-left rounded-2xl overflow-hidden glass-card hover:glow-primary transition-all"
            >
              <div className="relative h-32 overflow-hidden" style={{ background: n.gradient }}>
                <div className="absolute inset-0 nebula-overlay" />
                <div className="absolute top-2 left-2 px-2 py-0.5 rounded-full glass-strong text-[10px] font-medium uppercase tracking-wider">
                  {n.category}
                </div>
              </div>
              <div className="p-4 space-y-2">
                <h3 className="font-semibold text-sm leading-snug group-hover:text-primary transition-colors line-clamp-2">
                  {n.title}
                </h3>
                <p className="text-xs text-muted-foreground line-clamp-2">{n.excerpt}</p>
                <div className="flex items-center justify-between text-[10px] text-muted-foreground pt-2 border-t border-white/5">
                  <span>{n.date}</span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-2.5 w-2.5" />
                    {n.readTime}
                  </span>
                </div>
              </div>
            </motion.button>
          ))}
        </div>
      </section>

      {/* POPULAR GUIDES */}
      <section className="container mx-auto px-6">
        <SectionHeader
          eyebrow="Learn"
          title="Popular Astronomy Guides"
          subtitle="From buying your first telescope to hunting the aurora — practical, in-depth guides for every level of stargazer."
          icon={<Telescope className="h-3.5 w-3.5" />}
        />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {guides.slice(0, 6).map((g, i) => (
            <motion.button
              key={g.id}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.45, delay: i * 0.06 }}
              whileHover={{ y: -4 }}
              onClick={() => navigate("knowledge")}
              className="group text-left rounded-2xl overflow-hidden glass-card hover:glow-accent transition-all"
            >
              <div className="flex">
                <div className="w-24 shrink-0" style={{ background: g.gradient }} />
                <div className="p-4 flex-1">
                  <div className="flex items-center gap-2 text-[10px] uppercase tracking-wider text-muted-foreground mb-1.5">
                    <span className="px-1.5 py-0.5 rounded glass text-primary font-medium">{g.difficulty}</span>
                    <span>{g.category}</span>
                  </div>
                  <h3 className="font-semibold text-sm leading-snug group-hover:text-primary transition-colors mb-2">
                    {g.title}
                  </h3>
                  <p className="text-xs text-muted-foreground line-clamp-2">{g.excerpt}</p>
                  <div className="flex items-center gap-2 mt-3 text-[10px] text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    <span>{g.readTime}</span>
                  </div>
                </div>
              </div>
            </motion.button>
          ))}
        </div>
      </section>

      {/* CTA banner */}
      <section className="container mx-auto px-6">
        <GlassCard variant="strong" className="relative overflow-hidden p-8 md:p-12 text-center">
          <div className="absolute inset-0 pointer-events-none">
            <StarField count={60} withShootingStars />
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full opacity-40 blur-3xl"
              style={{ background: "radial-gradient(circle, oklch(0.55 0.20 320), transparent 70%)" }}
            />
          </div>
          <div className="relative max-w-2xl mx-auto">
            <div className="flex justify-center mb-6">
              <div className="h-16 w-16 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center animate-pulse-glow">
                <Sparkles className="h-7 w-7 text-white" />
              </div>
            </div>
            <h3 className="text-3xl md:text-4xl font-bold mb-3 tracking-tight">
              Meet your <span className="text-gradient-cosmic">AstroGuide</span>
            </h3>
            <p className="text-muted-foreground mb-6 leading-relaxed">
              Ask anything about the cosmos. AstroGuide is your AI companion
              for stargazing plans, telescope advice, eclipse chasing, and
              personal recommendations based on your location and the live sky.
            </p>
            <button
              onClick={() => navigate("astro-guide")}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-medium hover:glow-primary transition-all"
            >
              <Sparkles className="h-4 w-4" />
              Ask AstroGuide
            </button>
          </div>
        </GlassCard>
      </section>
    </div>
  );
}
