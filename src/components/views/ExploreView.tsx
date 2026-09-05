"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search, SlidersHorizontal, X, MapPin, Star, Moon, Eye, Filter,
  ChevronDown, RotateCcw,
} from "lucide-react";
import { GlassCard } from "@/components/common/GlassCard";
import { StarField } from "@/components/common/StarField";
import { LocationCard } from "@/components/cards/LocationCard";
import { CATEGORY_META } from "@/components/common/CategoryMeta";
import { useAppStore } from "@/store/app-store";
import { locations } from "@/lib/data/locations";
import type { Category } from "@/lib/types";
import { cn } from "@/lib/utils";

const CATEGORIES: { id: Category; label: string; emoji: string }[] = [
  { id: "stargazing", label: "Stargazing", emoji: "🌌" },
  { id: "observatory", label: "Observatory", emoji: "🔭" },
  { id: "planetarium", label: "Planetarium", emoji: "🪐" },
  { id: "space-center", label: "Space Center", emoji: "🚀" },
  { id: "space-museum", label: "Museum", emoji: "🏛️" },
  { id: "astro-camping", label: "Astro Camp", emoji: "🏕️" },
  { id: "astrophotography", label: "Astrophoto", emoji: "📸" },
  { id: "eclipse", label: "Eclipse", emoji: "🌑" },
  { id: "meteor-shower", label: "Meteor", emoji: "☄️" },
  { id: "dark-sky", label: "Dark Sky", emoji: "🌙" },
];

export function ExploreView() {
  const { exploreCategory, setExploreCategory, searchQuery, setSearchQuery, navigate } = useAppStore();
  const [showFilters, setShowFilters] = useState(false);
  const [minRating, setMinRating] = useState(0);
  const [maxPrice, setMaxPrice] = useState(3);
  const [minDarkSky, setMinDarkSky] = useState(0);
  const [maxDistance, setMaxDistance] = useState(20000);
  const [sortBy, setSortBy] = useState<"rating" | "dark-sky" | "popular">("rating");

  const filtered = useMemo(() => {
    let result = locations.filter((l) => {
      if (exploreCategory !== "all" && l.category !== exploreCategory) return false;
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        if (!l.name.toLowerCase().includes(q) &&
            !l.country.toLowerCase().includes(q) &&
            !l.city.toLowerCase().includes(q) &&
            !l.description.toLowerCase().includes(q)) return false;
      }
      if (l.rating < minRating) return false;
      if (l.priceLevel > maxPrice) return false;
      if (l.darkSkyRating < minDarkSky) return false;
      return true;
    });

    result = [...result].sort((a, b) => {
      if (sortBy === "rating") return b.rating - a.rating;
      if (sortBy === "dark-sky") return b.darkSkyRating - a.darkSkyRating;
      if (sortBy === "popular") return b.reviewsCount - a.reviewsCount;
      return 0;
    });

    return result;
  }, [exploreCategory, searchQuery, minRating, maxPrice, minDarkSky, sortBy]);

  const resetFilters = () => {
    setMinRating(0);
    setMaxPrice(3);
    setMinDarkSky(0);
    setMaxDistance(20000);
    setSortBy("rating");
  };

  return (
    <div className="pt-20 pb-12">
      {/* Page header */}
      <section className="relative py-10 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <StarField count={50} />
        </div>
        <div className="container mx-auto px-6 relative">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="text-xs font-medium uppercase tracking-[0.18em] text-primary/80 mb-2">
              Discover
            </div>
            <h1 className="text-3xl md:text-5xl font-bold tracking-tight mb-3">
              Explore <span className="text-gradient-cosmic">Cosmic Destinations</span>
            </h1>
            <p className="text-muted-foreground max-w-2xl">
              Browse 1,200+ curated stargazing locations, observatories, dark-sky parks, and space museums — filter by category, dark-sky quality, rating, and budget.
            </p>
          </motion.div>

          {/* Search + filter bar */}
          <div className="mt-6 flex flex-col md:flex-row gap-3">
            <GlassCard variant="strong" className="flex-1 p-2">
              <div className="flex items-center gap-2">
                <div className="pl-3">
                  <Search className="h-5 w-5 text-muted-foreground" />
                </div>
                <input
                  type="text"
                  placeholder="Search by name, city, or country..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 bg-transparent border-0 outline-none text-sm placeholder:text-muted-foreground px-2"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="p-1.5 rounded-lg hover:bg-white/5"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
            </GlassCard>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={cn(
                "flex items-center gap-2 px-4 py-3 rounded-2xl font-medium transition-all",
                showFilters ? "glass-strong glow-primary" : "glass hover:bg-white/5"
              )}
            >
              <SlidersHorizontal className="h-4 w-4" />
              Filters
              {(minRating > 0 || maxPrice < 3 || minDarkSky > 0) && (
                <span className="h-2 w-2 rounded-full bg-primary" />
              )}
            </button>
          </div>

          {/* Category chips */}
          <div className="mt-4 flex flex-wrap gap-2">
            <CategoryChip
              active={exploreCategory === "all"}
              onClick={() => setExploreCategory("all")}
              label="All"
              emoji="✨"
            />
            {CATEGORIES.map((c) => (
              <CategoryChip
                key={c.id}
                active={exploreCategory === c.id}
                onClick={() => setExploreCategory(c.id)}
                label={c.label}
                emoji={c.emoji}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Main content */}
      <section className="container mx-auto px-6">
        <div className="grid lg:grid-cols-[280px_1fr] gap-6">
          {/* Filter sidebar */}
          <AnimatePresence>
            {showFilters && (
              <motion.aside
                initial={{ opacity: 0, x: -20, height: 0 }}
                animate={{ opacity: 1, x: 0, height: "auto" }}
                exit={{ opacity: 0, x: -20, height: 0 }}
                className="lg:h-fit overflow-hidden"
              >
                <GlassCard className="p-5 space-y-5 sticky top-24">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Filter className="h-4 w-4 text-primary" />
                      <span className="font-semibold text-sm">Refine Results</span>
                    </div>
                    <button onClick={resetFilters} className="text-xs text-muted-foreground hover:text-primary flex items-center gap-1">
                      <RotateCcw className="h-3 w-3" /> Reset
                    </button>
                  </div>

                  {/* Sort */}
                  <div>
                    <label className="text-xs uppercase tracking-wider text-muted-foreground mb-2 block">Sort by</label>
                    <div className="grid grid-cols-3 gap-1">
                      {[
                        { id: "rating" as const, label: "Rating" },
                        { id: "dark-sky" as const, label: "Dark Sky" },
                        { id: "popular" as const, label: "Popular" },
                      ].map((s) => (
                        <button
                          key={s.id}
                          onClick={() => setSortBy(s.id)}
                          className={cn(
                            "py-1.5 rounded-lg text-xs font-medium transition-colors",
                            sortBy === s.id ? "bg-primary text-primary-foreground" : "glass hover:bg-white/5"
                          )}
                        >
                          {s.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Min Rating */}
                  <SliderFilter
                    label="Minimum Rating"
                    value={minRating}
                    min={0}
                    max={5}
                    step={0.5}
                    onChange={setMinRating}
                    display={`${minRating.toFixed(1)}+ stars`}
                    icon={<Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />}
                  />

                  {/* Min Dark Sky */}
                  <SliderFilter
                    label="Min Dark Sky Rating"
                    value={minDarkSky}
                    min={0}
                    max={10}
                    step={0.5}
                    onChange={setMinDarkSky}
                    display={`${minDarkSky.toFixed(1)} / 10`}
                    icon={<Moon className="h-3.5 w-3.5 text-purple-300" />}
                  />

                  {/* Max Price */}
                  <div>
                    <label className="text-xs uppercase tracking-wider text-muted-foreground mb-2 flex items-center gap-1.5">
                      Max Price Tier
                    </label>
                    <div className="grid grid-cols-3 gap-1">
                      {[
                        { tier: 1, label: "$" },
                        { tier: 2, label: "$$" },
                        { tier: 3, label: "$$$" },
                      ].map((p) => (
                        <button
                          key={p.tier}
                          onClick={() => setMaxPrice(p.tier)}
                          className={cn(
                            "py-2 rounded-lg text-sm font-bold transition-colors",
                            maxPrice >= p.tier ? "bg-primary/20 text-primary" : "glass text-muted-foreground"
                          )}
                        >
                          {p.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Max Distance */}
                  <SliderFilter
                    label="Max Distance"
                    value={maxDistance}
                    min={100}
                    max={20000}
                    step={100}
                    onChange={setMaxDistance}
                    display={`${(maxDistance / 1000).toFixed(0)}k km`}
                    icon={<MapPin className="h-3.5 w-3.5 text-accent" />}
                  />

                  {/* Quick filters */}
                  <div className="pt-3 border-t border-white/5 space-y-2">
                    <div className="text-xs uppercase tracking-wider text-muted-foreground">Quick Filters</div>
                    {[
                      { label: "Open tonight", icon: Eye },
                      { label: "Free entry", icon: MapPin },
                      { label: "Family friendly", icon: Star },
                      { label: "Guided tours available", icon: Search },
                    ].map((f) => (
                      <button
                        key={f.label}
                        className="w-full flex items-center gap-2 px-3 py-2 rounded-lg glass text-xs hover:bg-white/5 text-left"
                      >
                        <f.icon className="h-3 w-3 text-primary" />
                        {f.label}
                      </button>
                    ))}
                  </div>
                </GlassCard>
              </motion.aside>
            )}
          </AnimatePresence>

          {/* Results grid */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="text-sm text-muted-foreground">
                <span className="font-semibold text-foreground">{filtered.length}</span> destinations
                {exploreCategory !== "all" && (
                  <span> in <span className="text-primary">{CATEGORY_META[exploreCategory as Category]?.label}</span></span>
                )}
              </div>
              <button
                onClick={() => navigate("cosmic-map")}
                className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg glass hover:bg-white/5"
              >
                <MapPin className="h-3 w-3 text-primary" />
                View on Map
              </button>
            </div>

            {filtered.length === 0 ? (
              <GlassCard className="p-12 text-center">
                <div className="text-4xl mb-4">🌑</div>
                <h3 className="font-semibold mb-2">No destinations found</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Try adjusting your filters or search query.
                </p>
                <button
                  onClick={() => { resetFilters(); setSearchQuery(""); setExploreCategory("all"); }}
                  className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium"
                >
                  Reset all filters
                </button>
              </GlassCard>
            ) : (
              <div
                className={cn(
                  "grid gap-5",
                  showFilters
                    ? "grid-cols-1 sm:grid-cols-2 xl:grid-cols-3"
                    : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                )}
              >
                {filtered.map((l, i) => (
                  <LocationCard key={l.id} location={l} index={i} />
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

function CategoryChip({
  active, onClick, label, emoji,
}: { active: boolean; onClick: () => void; label: string; emoji: string }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all",
        active
          ? "bg-primary text-primary-foreground glow-primary"
          : "glass hover:bg-white/5"
      )}
    >
      <span className="text-sm">{emoji}</span>
      {label}
    </button>
  );
}

function SliderFilter({
  label, value, min, max, step, onChange, display, icon,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (v: number) => void;
  display: string;
  icon?: React.ReactNode;
}) {
  return (
    <div>
      <label className="text-xs uppercase tracking-wider text-muted-foreground mb-2 flex items-center gap-1.5">
        {icon}
        {label}
      </label>
      <div className="text-sm font-medium mb-2">{display}</div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-primary"
        style={{
          background: `linear-gradient(to right, oklch(0.72 0.18 245) ${(value - min) / (max - min) * 100}%, oklch(0.20 0.05 280 / 0.5) ${(value - min) / (max - min) * 100}%)`,
        }}
      />
    </div>
  );
}
