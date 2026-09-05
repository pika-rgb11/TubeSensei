"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, X, Star, Moon, ArrowUpRight, ChevronLeft, Layers, Eye, Globe2 } from "lucide-react";
import { StarField } from "@/components/common/StarField";
import { GlassCard } from "@/components/common/GlassCard";
import { CATEGORY_META } from "@/components/common/CategoryMeta";
import { useAppStore } from "@/store/app-store";
import { locations } from "@/lib/data/locations";
import { events } from "@/lib/data/events";
import type { Category } from "@/lib/types";
import { cn } from "@/lib/utils";

type LayerType = "all" | "stargazing" | "observatory" | "planetarium" | "space-center" | "space-museum" | "dark-sky" | "events";

const LAYERS: { id: LayerType; label: string; emoji: string; color: string }[] = [
  { id: "all", label: "All Layers", emoji: "✨", color: "oklch(0.72 0.18 245)" },
  { id: "stargazing", label: "Stargazing", emoji: "🌌", color: "oklch(0.72 0.18 245)" },
  { id: "observatory", label: "Observatories", emoji: "🔭", color: "oklch(0.78 0.20 320)" },
  { id: "planetarium", label: "Planetariums", emoji: "🪐", color: "oklch(0.65 0.20 290)" },
  { id: "space-center", label: "Space Centers", emoji: "🚀", color: "oklch(0.78 0.18 30)" },
  { id: "space-museum", label: "Museums", emoji: "🏛️", color: "oklch(0.72 0.14 60)" },
  { id: "dark-sky", label: "Dark Sky Areas", emoji: "🌙", color: "oklch(0.70 0.16 250)" },
  { id: "events", label: "Upcoming Events", emoji: "☄️", color: "oklch(0.78 0.18 280)" },
];

// Project lat/lng to x/y in container
function project(lat: number, lng: number) {
  // Equirectangular projection with some adjustment for visual style
  const x = ((lng + 180) / 360) * 100;
  const y = ((90 - lat) / 180) * 100;
  return { x, y };
}

export function CosmicMapView() {
  const { navigate } = useAppStore();
  const [activeLayer, setActiveLayer] = useState<LayerType>("all");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const markers = useMemo(() => {
    const list = [];
    if (activeLayer === "all" || activeLayer === "events") {
      events.forEach((e) => list.push({
        id: e.id, lat: 30 + Math.random() * 20, lng: -50 + Math.random() * 100,
        type: "event" as const, name: e.name, meta: e,
      }));
    }
    locations.forEach((l) => {
      if (activeLayer === "all" || l.category === activeLayer) {
        list.push({
          id: l.id, lat: l.coordinates.lat, lng: l.coordinates.lng,
          type: "location" as const, name: l.name, meta: l,
        });
      }
    });
    return list;
  }, [activeLayer]);

  const selected = markers.find((m) => m.id === selectedId);

  return (
    <div className="pt-16 pb-12">
      {/* Header */}
      <section className="container mx-auto px-6 py-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="text-xs font-medium uppercase tracking-[0.18em] text-primary/80 mb-1 flex items-center gap-2">
              <Globe2 className="h-3.5 w-3.5" />
              Full-Screen World View
            </div>
            <h1 className="text-2xl md:text-4xl font-bold tracking-tight">
              Cosmic <span className="text-gradient-cosmic">Map</span>
            </h1>
          </div>
          <div className="text-sm text-muted-foreground">
            <span className="font-semibold text-foreground">{markers.length}</span> markers visible
          </div>
        </div>

        {/* Layer chips */}
        <div className="flex flex-wrap gap-2 mt-4">
          {LAYERS.map((l) => (
            <button
              key={l.id}
              onClick={() => setActiveLayer(l.id)}
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all",
                activeLayer === l.id ? "text-primary-foreground" : "glass hover:bg-white/5"
              )}
              style={activeLayer === l.id ? { background: l.color } : {}}
            >
              <span className="text-sm">{l.emoji}</span>
              {l.label}
            </button>
          ))}
        </div>
      </section>

      {/* Map */}
      <section className="container mx-auto px-6">
        <GlassCard variant="strong" className="relative overflow-hidden">
          {/* World map background */}
          <div className="relative h-[70vh] min-h-[480px]" style={{ background: "linear-gradient(135deg, oklch(0.10 0.04 270), oklch(0.05 0.02 270))" }}>
            <StarField count={120} />

            {/* World map SVG */}
            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 50" preserveAspectRatio="none">
              {/* Latitude/longitude grid */}
              {[5, 10, 15, 20, 25, 30, 35, 40, 45].map((y) => (
                <line key={`h${y}`} x1="0" y1={y} x2="100" y2={y} stroke="oklch(0.40 0.04 270 / 0.3)" strokeWidth="0.05" />
              ))}
              {[10, 20, 30, 40, 50, 60, 70, 80, 90].map((x) => (
                <line key={`v${x}`} x1={x} y1="0" x2={x} y2="50" stroke="oklch(0.40 0.04 270 / 0.3)" strokeWidth="0.05" />
              ))}
              {/* Stylized continents (simplified shapes) */}
              <g fill="oklch(0.20 0.05 270)" stroke="oklch(0.30 0.10 250)" strokeWidth="0.15" opacity="0.7">
                {/* North America */}
                <path d="M 8 12 Q 12 8 18 9 L 25 11 L 28 18 L 25 25 L 22 28 L 15 30 L 10 26 L 6 18 Z" />
                {/* South America */}
                <path d="M 22 30 L 28 30 L 32 35 L 30 45 L 25 48 L 22 44 L 20 38 Z" />
                {/* Europe */}
                <path d="M 45 12 L 52 11 L 55 16 L 53 20 L 48 21 L 44 18 Z" />
                {/* Africa */}
                <path d="M 46 22 L 54 22 L 56 28 L 54 38 L 50 42 L 46 38 L 44 30 Z" />
                {/* Asia */}
                <path d="M 55 10 L 75 11 L 82 14 L 85 20 L 80 25 L 70 28 L 60 24 L 55 18 Z" />
                {/* Australia */}
                <path d="M 78 35 L 88 35 L 90 40 L 86 43 L 80 41 Z" />
                {/* Antarctica strip */}
                <path d="M 0 48 L 100 48 L 100 50 L 0 50 Z" opacity="0.3" />
              </g>
            </svg>

            {/* Markers */}
            {markers.map((m) => {
              const p = project(m.lat, m.lng);
              const color = m.type === "event"
                ? "oklch(0.78 0.18 280)"
                : CATEGORY_META[(m.meta as any).category as Category]?.color || "oklch(0.72 0.18 245)";
              const isSelected = selectedId === m.id;
              return (
                <button
                  key={m.id}
                  onClick={() => setSelectedId(isSelected ? null : m.id)}
                  className="absolute group"
                  style={{
                    left: `${p.x}%`,
                    top: `${p.y * 2}%`,
                    transform: "translate(-50%, -50%)",
                  }}
                >
                  <div className="relative">
                    {isSelected && (
                      <div className="absolute -inset-3 rounded-full animate-ping" style={{ background: color, opacity: 0.3 }} />
                    )}
                    <div
                      className="h-3 w-3 rounded-full ring-2 ring-white/50 transition-all hover:scale-150 group-hover:scale-150"
                      style={{ background: color, boxShadow: `0 0 12px ${color}` }}
                    />
                    {!isSelected && (
                      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                        <div className="px-2 py-0.5 rounded glass-strong text-[10px] whitespace-nowrap mt-3">
                          {m.name}
                        </div>
                      </div>
                    )}
                  </div>
                </button>
              );
            })}

            {/* Top-left info */}
            <div className="absolute top-4 left-4 px-3 py-2 rounded-lg glass-strong text-xs">
              <div className="text-muted-foreground text-[10px] uppercase tracking-wider mb-1">Active Layer</div>
              <div className="font-medium">{LAYERS.find((l) => l.id === activeLayer)?.label}</div>
            </div>

            {/* Bottom-right legend */}
            <div className="absolute bottom-4 right-4 px-3 py-2 rounded-lg glass-strong text-xs space-y-1.5">
              <div className="text-muted-foreground text-[10px] uppercase tracking-wider mb-1">Legend</div>
              <div className="flex items-center gap-1.5"><div className="h-2 w-2 rounded-full" style={{ background: "oklch(0.72 0.18 245)" }} /> Dark Sky</div>
              <div className="flex items-center gap-1.5"><div className="h-2 w-2 rounded-full" style={{ background: "oklch(0.78 0.20 320)" }} /> Observatory</div>
              <div className="flex items-center gap-1.5"><div className="h-2 w-2 rounded-full" style={{ background: "oklch(0.78 0.18 30)" }} /> Space Center</div>
              <div className="flex items-center gap-1.5"><div className="h-2 w-2 rounded-full" style={{ background: "oklch(0.78 0.18 280)" }} /> Event</div>
            </div>

            {/* Selected card overlay */}
            <AnimatePresence>
              {selected && (
                <motion.div
                  initial={{ opacity: 0, x: 20, scale: 0.95 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  exit={{ opacity: 0, x: 20, scale: 0.95 }}
                  transition={{ type: "spring", damping: 24 }}
                  className="absolute top-4 right-4 bottom-16 w-72 glass-strong rounded-2xl p-4 overflow-y-auto custom-scroll"
                >
                  {selected.type === "location" ? (
                    <SelectedLocationCard
                      location={selected.meta as any}
                      onClose={() => setSelectedId(null)}
                      onViewDetails={() => navigate("location-detail", { locationId: selected.id })}
                    />
                  ) : (
                    <SelectedEventCard
                      event={selected.meta as any}
                      onClose={() => setSelectedId(null)}
                      onViewDetails={() => navigate("events")}
                    />
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Bottom controls */}
            <div className="absolute bottom-4 left-4 flex flex-col gap-1">
              <button className="h-9 w-9 rounded-lg glass-strong flex items-center justify-center text-lg hover:bg-white/5">+</button>
              <button className="h-9 w-9 rounded-lg glass-strong flex items-center justify-center text-lg hover:bg-white/5">−</button>
              <button className="h-9 w-9 rounded-lg glass-strong flex items-center justify-center hover:bg-white/5"><Layers className="h-4 w-4" /></button>
            </div>

            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-3 py-1.5 rounded-lg glass-strong text-[10px] text-muted-foreground">
              Cosmic Map v2.6 · Stylized projection
            </div>
          </div>
        </GlassCard>
      </section>
    </div>
  );
}

function SelectedLocationCard({ location, onClose, onViewDetails }: { location: any; onClose: () => void; onViewDetails: () => void }) {
  const meta = CATEGORY_META[location.category as Category];
  return (
    <div>
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="px-2 py-0.5 rounded-full text-[10px] font-medium flex items-center gap-1"
          style={{ background: `${meta.color}30`, color: meta.color }}>
          <span>{meta.emoji}</span>
          {meta.label}
        </div>
        <button onClick={onClose} className="p-1 rounded hover:bg-white/10">
          <X className="h-3.5 w-3.5" />
        </button>
      </div>
      <h3 className="font-bold text-base leading-tight">{location.name}</h3>
      <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
        <MapPin className="h-3 w-3" />
        {location.city}, {location.country}
      </div>
      <div
        className="h-24 mt-3 rounded-lg overflow-hidden relative"
        style={{ background: location.imageGradient }}
      >
        <div className="absolute inset-0 nebula-overlay" />
      </div>
      <p className="text-xs text-muted-foreground mt-3 line-clamp-3 leading-relaxed">{location.description}</p>
      <div className="grid grid-cols-2 gap-2 mt-3 text-[11px]">
        <div className="flex items-center gap-1">
          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
          <span className="font-medium">{location.rating}</span>
        </div>
        <div className="flex items-center gap-1">
          <Moon className="h-3 w-3 text-purple-300" />
          <span className="font-medium">{location.darkSkyRating.toFixed(1)}/10</span>
        </div>
      </div>
      <button
        onClick={onViewDetails}
        className="w-full mt-3 py-2 rounded-lg bg-primary text-primary-foreground text-xs font-medium flex items-center justify-center gap-1 hover:glow-primary transition-all"
      >
        View Details <ArrowUpRight className="h-3 w-3" />
      </button>
    </div>
  );
}

function SelectedEventCard({ event, onClose, onViewDetails }: { event: any; onClose: () => void; onViewDetails: () => void }) {
  return (
    <div>
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-accent/20 text-accent-foreground">
          ☄️ Event
        </div>
        <button onClick={onClose} className="p-1 rounded hover:bg-white/10">
          <X className="h-3.5 w-3.5" />
        </button>
      </div>
      <h3 className="font-bold text-base leading-tight">{event.name}</h3>
      <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
        <MapPin className="h-3 w-3" />
        {event.bestLocation}
      </div>
      <div className="h-24 mt-3 rounded-lg overflow-hidden relative" style={{ background: event.imageGradient }}>
        <div className="absolute inset-0 nebula-overlay" />
      </div>
      <p className="text-xs text-muted-foreground mt-3 line-clamp-3 leading-relaxed">{event.description}</p>
      <button
        onClick={onViewDetails}
        className="w-full mt-3 py-2 rounded-lg bg-primary text-primary-foreground text-xs font-medium flex items-center justify-center gap-1 hover:glow-primary transition-all"
      >
        View Event <ArrowUpRight className="h-3 w-3" />
      </button>
    </div>
  );
}
