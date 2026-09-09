"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  ChevronLeft, MapPin, Star, Moon, Eye, Clock, Ticket, Calendar,
  Cloud, Sun as SunIcon, Bookmark, Share2, ArrowUpRight,
  Camera, Compass, Globe2, Check, ThumbsUp, Plus,
} from "lucide-react";
import { StarField } from "@/components/common/StarField";
import { GlassCard } from "@/components/common/GlassCard";
import { RatingStars } from "@/components/common/RatingStars";
import { CATEGORY_META } from "@/components/common/CategoryMeta";
import { LocationCard } from "@/components/cards/LocationCard";
import { useAppStore } from "@/store/app-store";
import { getLocation } from "@/lib/data/locations";
import { locations } from "@/lib/data/locations";
import { reviewsByLocation, defaultReviews } from "@/lib/data/users";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export function LocationDetailView() {
  const { selectedLocationId, navigate, goBack, user, toggleSaved, toggleWishlist, markVisited } = useAppStore();
  const location = selectedLocationId ? getLocation(selectedLocationId) : null;
  const [showBooking, setShowBooking] = useState(false);

  if (!location) {
    return (
      <div className="pt-32 pb-12 container mx-auto px-6 text-center">
        <p className="text-muted-foreground">Location not found.</p>
        <button onClick={() => navigate("explore")} className="mt-4 text-primary">Back to Explore</button>
      </div>
    );
  }

  const meta = CATEGORY_META[location.category];
  const isSaved = user?.saved.includes(location.id);
  const isWishlisted = user?.wishlist.includes(location.id);
  const isVisited = user?.visited.includes(location.id);
  const reviews = reviewsByLocation[location.id] ?? defaultReviews;
  const related = locations
    .filter((l) => l.id !== location.id && (l.category === location.category || l.country === location.country))
    .slice(0, 3);

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({ title: location.name, text: location.description });
      } else {
        await navigator.clipboard.writeText(`${location.name} — ${location.description.slice(0, 100)}...`);
        toast.success("Link copied to clipboard");
      }
    } catch {
      // user cancelled
    }
  };

  return (
    <div className="pt-16 pb-12">
      {/* HERO with image */}
      <section className="relative h-[60vh] min-h-[420px] overflow-hidden">
        <div
          className="absolute inset-0"
          style={{ background: location.imageGradient }}
        />
        {/* Real photo */}
        {location.image && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={location.image}
            alt={location.name}
            className="absolute inset-0 w-full h-full object-cover"
          />
        )}
        <div className="absolute inset-0 nebula-overlay opacity-40" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
        <StarField count={100} withShootingStars className="opacity-80" />

        {/* Floating planet */}
        <div className="absolute top-1/4 right-1/4 w-32 h-32 rounded-full opacity-60 animate-float"
          style={{ background: `radial-gradient(circle at 30% 30%, ${meta.color}, transparent 70%)` }}
        />

        {/* Back button */}
        <div className="container mx-auto px-6 pt-6 relative">
          <button
            onClick={goBack}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg glass-strong text-sm hover:bg-white/10 transition-colors"
          >
            <ChevronLeft className="h-4 w-4" />
            Back
          </button>
        </div>

        {/* Title block */}
        <div className="absolute bottom-0 left-0 right-0 pb-10">
          <div className="container mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <div className="px-3 py-1 rounded-full glass-strong text-xs font-medium flex items-center gap-1.5">
                  <span className="text-sm">{meta.emoji}</span>
                  {meta.label}
                </div>
                {location.trending && (
                  <div className="px-3 py-1 rounded-full bg-amber-500/80 text-xs font-bold uppercase tracking-wider text-black">
                    ★ Trending
                  </div>
                )}
                {location.featured && (
                  <div className="px-3 py-1 rounded-full glass-strong text-xs font-medium">
                    Featured
                  </div>
                )}
              </div>
              <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-2">
                {location.name}
              </h1>
              <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-4">
                <div className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  {location.city}, {location.country}
                </div>
                <div className="flex items-center gap-1.5">
                  <RatingStars value={location.rating} size={12} showValue={false} />
                  <span>{location.rating} ({location.reviewsCount.toLocaleString()} reviews)</span>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => { navigate("booking", { locationId: location.id }); }}
                  className="px-5 py-2.5 rounded-xl bg-primary text-primary-foreground font-medium hover:glow-primary transition-all"
                >
                  Book Experience
                </button>
                <button
                  onClick={() => { markVisited(location.id); toast.success("Marked as visited"); }}
                  className="px-4 py-2.5 rounded-xl glass font-medium hover:bg-white/5 transition-all flex items-center gap-1.5"
                >
                  <Compass className="h-4 w-4" />
                  {isVisited ? "Visited ✓" : "Mark Visited"}
                </button>
                <button
                  onClick={() => { toggleSaved(location.id); toast.success(isSaved ? "Removed from saved" : "Saved to collection"); }}
                  className={isSaved ? "px-4 py-2.5 rounded-xl bg-primary/20 text-primary font-medium flex items-center gap-1.5" : "px-4 py-2.5 rounded-xl glass hover:bg-white/5 flex items-center gap-1.5"}
                >
                  <Bookmark className={isSaved ? "h-4 w-4 fill-primary" : "h-4 w-4"} />
                  {isSaved ? "Saved" : "Save"}
                </button>
                <button
                  onClick={() => { toggleWishlist(location.id); toast.success(isWishlisted ? "Removed from bucket list" : "Added to bucket list"); }}
                  className="px-4 py-2.5 rounded-xl glass hover:bg-white/5 flex items-center gap-1.5"
                >
                  <Plus className="h-4 w-4" />
                  Bucket List
                </button>
                <button
                  onClick={handleShare}
                  className="px-4 py-2.5 rounded-xl glass hover:bg-white/5 flex items-center gap-1.5"
                >
                  <Share2 className="h-4 w-4" />
                  Share
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="container mx-auto px-6 mt-10 grid lg:grid-cols-[1fr_320px] gap-8">
        {/* Main column */}
        <div className="space-y-8">
          {/* Why visit */}
          <GlassCard className="p-6">
            <div className="text-xs font-medium uppercase tracking-[0.18em] text-primary mb-2">
              Why Visit
            </div>
            <p className="text-base leading-relaxed">{location.whyVisit}</p>
          </GlassCard>

          {/* Description */}
          <div>
            <h2 className="text-2xl font-bold mb-3">About {location.name}</h2>
            <p className="text-base text-muted-foreground leading-relaxed">{location.description}</p>
          </div>

          {/* Info grid */}
          <div className="grid sm:grid-cols-2 gap-3">
            <InfoTile icon={<Clock className="h-4 w-4 text-primary" />} label="Opening Hours" value={location.openingHours} />
            <InfoTile icon={<Ticket className="h-4 w-4 text-accent" />} label="Tickets" value={location.ticketInfo} />
            <InfoTile icon={<Calendar className="h-4 w-4 text-primary" />} label="Best Time to Visit" value={location.bestViewingTime} />
            <InfoTile icon={<MapPin className="h-4 w-4 text-accent" />} label="Coordinates" value={`${location.coordinates.lat.toFixed(4)}°, ${location.coordinates.lng.toFixed(4)}°`} />
            <InfoTile icon={<Moon className="h-4 w-4 text-purple-300" />} label="Light Pollution" value={location.lightPollutionLevel} />
            <InfoTile icon={<Eye className="h-4 w-4 text-primary" />} label="Visibility Score" value={`${location.visibilityScore} / 100`} />
          </div>

          {/* Best months */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Best Months for Stargazing</h3>
            <div className="flex flex-wrap gap-2">
              {["January","February","March","April","May","June","July","August","September","October","November","December"].map((m) => {
                const active = location.bestMonths.includes(m);
                return (
                  <div
                    key={m}
                    className={cn(
                      "px-3 py-1.5 rounded-lg text-xs font-medium",
                      active ? "bg-primary/20 text-primary border border-primary/40" : "glass text-muted-foreground"
                    )}
                  >
                    {m.slice(0, 3)}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Weather widget */}
          <WeatherWidget locationName={location.name} />

          {/* Gallery */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Photo Gallery</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {[location.imageGradient, ...location.galleryGradients].map((g, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.06 }}
                  className="relative aspect-[4/3] rounded-xl overflow-hidden group cursor-pointer"
                  style={{ background: g }}
                  onClick={() => toast.info("Photo viewer coming soon")}
                >
                  <div className="absolute inset-0 nebula-overlay" />
                  <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors" />
                  <div className="absolute bottom-2 left-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="px-2 py-1 rounded glass-strong text-[10px] flex items-center gap-1">
                      <Camera className="h-2.5 w-2.5" />
                      View full size
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Things to bring */}
          <div className="grid md:grid-cols-2 gap-4">
            <GlassCard className="p-5">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <Compass className="h-4 w-4 text-primary" />
                Things to Bring
              </h3>
              <ul className="space-y-2">
                {location.thingsToBring.map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm">
                    <Check className="h-4 w-4 text-emerald-400 mt-0.5 shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </GlassCard>

            <GlassCard className="p-5">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <Camera className="h-4 w-4 text-accent" />
                Photography Tips
              </h3>
              <ul className="space-y-2">
                {location.photographyTips.map((tip, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm">
                    <span className="text-primary mt-0.5">›</span>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </GlassCard>
          </div>

          {/* Nearby attractions */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Nearby Attractions</h3>
            <div className="flex flex-wrap gap-2">
              {location.nearbyAttractions.map((attr, i) => (
                <div key={i} className="px-3 py-2 rounded-xl glass text-sm flex items-center gap-1.5">
                  <MapPin className="h-3.5 w-3.5 text-primary" />
                  {attr}
                </div>
              ))}
            </div>
          </div>

          {/* Mini map */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Location Map</h3>
            <MiniMap lat={location.coordinates.lat} lng={location.coordinates.lng} name={location.name} />
          </div>

          {/* Reviews */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-2xl font-bold">Reviews</h3>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <RatingStars value={location.rating} showValue={false} size={14} />
                  <span>{location.rating} from {location.reviewsCount.toLocaleString()} reviews</span>
                </div>
              </div>
              <button
                onClick={() => toast.success("Review form coming soon")}
                className="px-4 py-2 rounded-xl glass text-sm font-medium hover:bg-white/5"
              >
                Write a Review
              </button>
            </div>
            <div className="space-y-4">
              {reviews.map((r, i) => (
                <motion.div
                  key={r.id}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.05 }}
                >
                  <GlassCard className="p-5">
                    <div className="flex items-start gap-3">
                      <div
                        className="h-10 w-10 rounded-full shrink-0 flex items-center justify-center text-xs font-bold"
                        style={{ background: "linear-gradient(135deg, oklch(0.50 0.15 280), oklch(0.30 0.10 250))" }}
                      >
                        {r.avatar}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <div className="font-semibold">{r.author}</div>
                          <div className="text-xs text-muted-foreground">{r.date}</div>
                        </div>
                        <RatingStars value={r.rating} showValue={false} size={12} className="mt-1 mb-2" />
                        <p className="text-sm text-foreground/90 leading-relaxed">{r.text}</p>
                        <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
                          <button className="flex items-center gap-1 hover:text-foreground">
                            <ThumbsUp className="h-3 w-3" />
                            Helpful ({r.helpful})
                          </button>
                          {r.photos > 0 && (
                            <span className="flex items-center gap-1">
                              <Camera className="h-3 w-3" /> {r.photos} photos
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </GlassCard>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <aside className="space-y-4">
          <div className="sticky top-24 space-y-4">
            {/* Quick stats */}
            <GlassCard variant="strong" className="p-5">
              <h3 className="font-semibold mb-4">Quick Stats</h3>
              <div className="space-y-3">
                <StatRow icon={<Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />} label="Rating" value={location.rating.toFixed(1)} />
                <StatRow icon={<Moon className="h-4 w-4 text-purple-300" />} label="Dark Sky" value={`${location.darkSkyRating.toFixed(1)} / 10`} />
                <StatRow icon={<Eye className="h-4 w-4 text-primary" />} label="Visibility" value={`${location.visibilityScore}%`} />
                <StatRow icon={<Globe2 className="h-4 w-4 text-accent" />} label="Category" value={meta.label} />
              </div>
              <div className="mt-4 pt-4 border-t border-white/5">
                <div className="flex items-center justify-between text-xs text-muted-foreground mb-1.5">
                  <span>Stargazing Score</span>
                  <span className="font-semibold text-primary">{Math.round((location.darkSkyRating + location.visibilityScore/10) / 2 * 10)}%</span>
                </div>
                <div className="h-2 rounded-full bg-white/5 overflow-hidden">
                  <div className="h-full rounded-full bg-gradient-to-r from-primary to-accent"
                    style={{ width: `${Math.round((location.darkSkyRating + location.visibilityScore/10) / 2 * 10)}%` }}
                  />
                </div>
              </div>
            </GlassCard>

            {/* Experiences preview */}
            <GlassCard className="p-5">
              <h3 className="font-semibold mb-3">Book an Experience</h3>
              <div className="space-y-2">
                {location.experiences.slice(0, 3).map((exp) => (
                  <button
                    key={exp.id}
                    onClick={() => navigate("booking", { locationId: location.id })}
                    className="w-full text-left p-3 rounded-lg glass hover:bg-white/5 transition-colors group"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <div className="text-sm font-medium truncate group-hover:text-primary">{exp.title}</div>
                        <div className="text-xs text-muted-foreground mt-0.5">{exp.duration} · ★ {exp.rating}</div>
                      </div>
                      <div className="text-sm font-semibold text-primary shrink-0">${exp.price}</div>
                    </div>
                  </button>
                ))}
              </div>
              <button
                onClick={() => navigate("booking", { locationId: location.id })}
                className="w-full mt-3 py-2 rounded-lg bg-primary/15 text-primary text-sm font-medium hover:bg-primary/25 transition-colors flex items-center justify-center gap-1"
              >
                See all experiences <ArrowUpRight className="h-3.5 w-3.5" />
              </button>
            </GlassCard>

            {/* Get directions */}
            <button
              onClick={() => toast.success("Opening in maps app...")}
              className="w-full py-3 rounded-xl glass-strong hover:glow-primary font-medium flex items-center justify-center gap-2"
            >
              <MapPin className="h-4 w-4 text-primary" />
              Get Directions
            </button>
          </div>
        </aside>
      </section>

      {/* Related */}
      {related.length > 0 && (
        <section className="container mx-auto px-6 mt-16">
          <h3 className="text-2xl font-bold mb-5">Related Destinations</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {related.map((l, i) => (
              <LocationCard key={l.id} location={l} index={i} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

function InfoTile({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <GlassCard className="p-4">
      <div className="flex items-center gap-2 mb-1.5">
        {icon}
        <span className="text-xs uppercase tracking-wider text-muted-foreground">{label}</span>
      </div>
      <div className="text-sm font-medium">{value}</div>
    </GlassCard>
  );
}

function StatRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        {icon}
        {label}
      </div>
      <div className="text-sm font-semibold">{value}</div>
    </div>
  );
}

function WeatherWidget({ locationName }: { locationName: string }) {
  return (
    <div>
      <h3 className="text-lg font-semibold mb-3">Weather Forecast</h3>
      <GlassCard className="p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="text-xs text-muted-foreground">Next 5 nights · at {locationName}</div>
            <div className="text-lg font-semibold">Stargazing conditions: Excellent</div>
          </div>
          <div className="h-12 w-12 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
            <SunIcon className="h-6 w-6 text-white" />
          </div>
        </div>
        <div className="grid grid-cols-5 gap-2">
          {[
            { day: "Tonight", cloud: 8, temp: "12°", score: 92 },
            { day: "Tue", cloud: 15, temp: "11°", score: 88 },
            { day: "Wed", cloud: 40, temp: "13°", score: 65 },
            { day: "Thu", cloud: 5, temp: "10°", score: 95 },
            { day: "Fri", cloud: 20, temp: "11°", score: 82 },
          ].map((d, i) => (
            <div key={i} className="text-center p-2 rounded-lg glass">
              <div className="text-xs text-muted-foreground mb-1">{d.day}</div>
              <Cloud className="h-4 w-4 mx-auto mb-1" style={{ opacity: d.cloud < 20 ? 0.4 : 1 }} />
              <div className="text-xs font-semibold">{d.temp}</div>
              <div className="text-[10px] mt-1 text-primary">{d.score}% clear</div>
            </div>
          ))}
        </div>
      </GlassCard>
    </div>
  );
}

function MiniMap({ lat, lng, name }: { lat: number; lng: number; name: string }) {
  // Project lat/lng to x/y in a stylized world map container
  const x = ((lng + 180) / 360) * 100;
  const y = ((90 - lat) / 180) * 100;
  return (
    <GlassCard className="relative overflow-hidden p-0 h-72">
      <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, oklch(0.10 0.04 270), oklch(0.05 0.02 270))" }}>
        {/* World map grid */}
        <svg className="absolute inset-0 w-full h-full opacity-20" viewBox="0 0 100 50" preserveAspectRatio="none">
          {/* Stylized continents */}
          <path
            d="M 10 15 Q 15 10 25 12 L 35 18 L 40 25 L 35 35 L 25 38 L 15 32 Z"
            fill="oklch(0.30 0.05 250)"
            stroke="oklch(0.40 0.10 250)"
            strokeWidth="0.2"
          />
          <path
            d="M 50 12 L 65 15 L 75 25 L 80 35 L 70 40 L 60 32 L 55 22 Z"
            fill="oklch(0.30 0.05 250)"
            stroke="oklch(0.40 0.10 250)"
            strokeWidth="0.2"
          />
          <path
            d="M 80 30 L 90 32 L 92 40 L 85 42 Z"
            fill="oklch(0.30 0.05 250)"
            stroke="oklch(0.40 0.10 250)"
            strokeWidth="0.2"
          />
          {/* Lat/Lng lines */}
          {[10, 20, 30, 40].map((y) => (
            <line key={y} x1="0" y1={y} x2="100" y2={y} stroke="oklch(0.40 0.04 270)" strokeWidth="0.1" />
          ))}
          {[20, 40, 60, 80].map((x) => (
            <line key={x} x1={x} y1="0" x2={x} y2="50" stroke="oklch(0.40 0.04 270)" strokeWidth="0.1" />
          ))}
        </svg>
        {/* Star field overlay */}
        <StarField count={30} />
        {/* Pin */}
        <div
          className="absolute"
          style={{ left: `${x}%`, top: `${y * 2}%`, transform: "translate(-50%, -100%)" }}
        >
          <div className="relative">
            <div className="absolute -inset-2 rounded-full bg-primary/40 animate-ping" />
            <div className="h-3 w-3 rounded-full bg-primary ring-2 ring-white relative" />
            <div className="absolute top-4 left-1/2 -translate-x-1/2 whitespace-nowrap px-2 py-1 rounded glass-strong text-[10px] font-medium">
              {name}
            </div>
          </div>
        </div>
      </div>
      <div className="absolute bottom-3 right-3 px-2 py-1 rounded glass-strong text-[10px] text-muted-foreground">
        Map preview · for navigation use "Get Directions"
      </div>
    </GlassCard>
  );
}
