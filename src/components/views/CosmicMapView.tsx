"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, X, Star, Moon, ArrowUpRight, Layers, Globe2, Plus, Minus, Crosshair } from "lucide-react";
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

// Realistic continent SVG paths (simplified but recognizable) using a 360×180 viewBox
// Maps longitude -180..180 to x 0..360, latitude 90..-90 to y 0..180
const CONTINENTS = [
  // North America
  { name: "North America", path: "M 35 38 L 50 32 L 70 28 L 95 30 L 115 38 L 130 42 L 150 38 L 168 42 L 175 50 L 170 60 L 158 68 L 145 75 L 130 78 L 110 75 L 88 70 L 70 62 L 55 55 L 45 48 Z" },
  // Central America strip
  { name: "Central America", path: "M 110 78 L 122 80 L 128 88 L 120 92 L 112 88 Z" },
  // South America
  { name: "South America", path: "M 130 88 L 150 86 L 158 96 L 162 110 L 158 128 L 148 145 L 138 155 L 128 158 L 122 148 L 120 130 L 124 110 L 128 96 Z" },
  // Europe
  { name: "Europe", path: "M 180 38 L 198 35 L 215 38 L 225 42 L 232 50 L 228 58 L 215 62 L 200 60 L 188 55 L 182 48 Z" },
  // Africa
  { name: "Africa", path: "M 195 65 L 215 62 L 235 65 L 245 75 L 250 90 L 252 110 L 245 128 L 232 140 L 218 142 L 205 132 L 198 115 L 193 95 L 192 80 Z" },
  // Asia (large)
  { name: "Asia", path: "M 230 35 L 260 30 L 290 28 L 320 30 L 345 35 L 358 45 L 350 58 L 328 65 L 308 70 L 290 68 L 270 62 L 248 55 L 232 48 Z" },
  // Middle East
  { name: "Middle East", path: "M 232 58 L 248 60 L 252 70 L 245 80 L 235 78 L 228 68 Z" },
  // India
  { name: "India", path: "M 280 68 L 295 70 L 300 82 L 296 95 L 288 100 L 280 92 L 278 78 Z" },
  // Southeast Asia
  { name: "Southeast Asia", path: "M 310 78 L 325 80 L 332 90 L 328 100 L 320 102 L 312 95 L 308 85 Z" },
  // Australia
  { name: "Australia", path: "M 305 130 L 325 128 L 345 132 L 355 142 L 350 152 L 332 156 L 312 152 L 302 142 Z" },
  // Greenland
  { name: "Greenland", path: "M 145 18 L 165 16 L 178 22 L 175 32 L 160 35 L 148 30 Z" },
  // Antarctica
  { name: "Antarctica", path: "M 30 165 L 80 162 L 140 165 L 200 162 L 260 165 L 320 162 L 350 168 L 340 178 L 200 180 L 60 178 L 25 172 Z" },
  // UK
  { name: "United Kingdom", path: "M 178 40 L 184 38 L 187 44 L 183 48 L 178 46 Z" },
  // Japan
  { name: "Japan", path: "M 330 50 L 336 48 L 340 56 L 336 62 L 332 60 L 330 54 Z" },
  // Madagascar
  { name: "Madagascar", path: "M 256 112 L 262 110 L 265 122 L 260 128 L 254 124 Z" },
  // New Zealand
  { name: "New Zealand", path: "M 355 152 L 358 150 L 356 158 L 352 156 Z" },
];

// Project lat/lng to x/y in container
function project(lat: number, lng: number) {
  const x = ((lng + 180) / 360) * 100;
  const y = ((90 - lat) / 180) * 100;
  return { x, y };
}

// Convert lat/lng to SVG coordinates in 360x180 viewBox
function toSvg(lat: number, lng: number) {
  return { x: lng + 180, y: 90 - lat };
}

export function CosmicMapView() {
  const { navigate } = useAppStore();
  const [activeLayer, setActiveLayer] = useState<LayerType>("all");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const markers = useMemo(() => {
    const list: { id: string; lat: number; lng: number; type: "location" | "event"; name: string; meta: any }[] = [];
    if (activeLayer === "all" || activeLayer === "events") {
      // Place events at sensible real-world coordinates
      const eventCoords: Record<string, { lat: number; lng: number }> = {
        "evt-perseids": { lat: 41.66, lng: -77.81 }, // Cherry Springs
        "evt-eclipse": { lat: 28.27, lng: -16.64 }, // Teide
        "evt-spacex": { lat: 28.57, lng: -80.65 }, // Kennedy
        "evt-geminids": { lat: -23.66, lng: -67.01 }, // Atacama
        "evt-aurora": { lat: 67.85, lng: 20.22 }, // Kiruna
        "evt-iss": { lat: 28.57, lng: -80.65 }, // Kennedy
        "evt-lunar": { lat: 19.82, lng: -155.47 }, // Mauna Kea
        "evt-conjunct": { lat: 28.27, lng: -16.64 }, // Teide
        "evt-fest": { lat: 28.27, lng: -16.64 }, // Teide
      };
      events.forEach((e) => {
        const c = eventCoords[e.id] ?? { lat: 30, lng: 0 };
        list.push({
          id: e.id, lat: c.lat, lng: c.lng,
          type: "event" as const, name: e.name, meta: e,
        });
      });
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
  const activeLayerMeta = LAYERS.find((l) => l.id === activeLayer);

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
          <div className="flex items-center gap-3">
            <div className="text-sm text-muted-foreground">
              <span className="font-semibold text-foreground">{markers.length}</span> markers
            </div>
            <div className="px-2.5 py-1 rounded-full glass text-[10px] flex items-center gap-1.5">
              <div className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Live
            </div>
          </div>
        </div>

        {/* Layer chips */}
        <div className="flex flex-wrap gap-2 mt-4">
          {LAYERS.map((l) => {
            const active = activeLayer === l.id;
            const count = active
              ? markers.length
              : l.id === "all"
              ? markers.length
              : l.id === "events"
              ? (activeLayer === "all" || activeLayer === "events" ? events.length : 0)
              : locations.filter((loc) => loc.category === l.id).length;
            return (
              <button
                key={l.id}
                onClick={() => setActiveLayer(l.id)}
                className={cn(
                  "group flex items-center gap-2 px-3.5 py-2 rounded-full text-xs font-medium transition-all relative overflow-hidden",
                  active ? "text-white shadow-lg" : "glass hover:bg-white/5"
                )}
                style={active ? { background: l.color, boxShadow: `0 0 20px ${l.color}` } : {}}
              >
                <span className="text-sm">{l.emoji}</span>
                {l.label}
                {active && (
                  <span className="ml-1 px-1.5 py-0.5 rounded-full bg-white/20 text-[9px] font-bold">
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </section>

      {/* Map */}
      <section className="container mx-auto px-6">
        <GlassCard variant="strong" className="relative overflow-hidden p-0">
          {/* Map container */}
          <div
            className="relative h-[75vh] min-h-[520px] overflow-hidden"
            style={{
              background:
                "radial-gradient(ellipse 80% 60% at 50% 50%, oklch(0.13 0.05 270) 0%, oklch(0.08 0.03 270) 60%, oklch(0.04 0.01 270) 100%)",
            }}
          >
            {/* Nebula gradient layers */}
            <div className="absolute inset-0 pointer-events-none">
              <div
                className="absolute -top-1/4 -left-1/4 w-[60%] h-[60%] rounded-full opacity-40 blur-3xl animate-drift"
                style={{ background: "radial-gradient(circle, oklch(0.40 0.18 290), transparent 70%)" }}
              />
              <div
                className="absolute -bottom-1/4 -right-1/4 w-[55%] h-[55%] rounded-full opacity-30 blur-3xl animate-float"
                style={{ background: "radial-gradient(circle, oklch(0.50 0.20 220), transparent 70%)" }}
              />
              <div
                className="absolute top-1/3 left-1/2 w-[40%] h-[40%] rounded-full opacity-20 blur-3xl animate-drift"
                style={{
                  background: "radial-gradient(circle, oklch(0.55 0.20 330), transparent 70%)",
                  animationDelay: "4s",
                }}
              />
            </div>

            {/* Atmospheric glow around the map edge (vignette) */}
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute inset-0" style={{
                background: "radial-gradient(ellipse 90% 75% at 50% 50%, transparent 50%, oklch(0.04 0.01 270 / 0.7) 100%)",
              }} />
            </div>

            {/* Star field */}
            <MapStarField count={200} />

            {/* World map SVG */}
            <svg
              className="absolute inset-0 w-full h-full"
              viewBox="0 0 360 180"
              preserveAspectRatio="xMidYMid meet"
            >
              <defs>
                {/* Glow filter for continents */}
                <filter id="continent-glow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="0.8" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
                {/* Stronger glow for selected markers */}
                <filter id="marker-glow" x="-50%" y="-50%" width="200%" height="200%">
                  <feGaussianBlur stdDeviation="2" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
                {/* Continent gradient */}
                <linearGradient id="continent-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="oklch(0.30 0.10 250)" stopOpacity="0.85" />
                  <stop offset="50%" stopColor="oklch(0.22 0.08 280)" stopOpacity="0.9" />
                  <stop offset="100%" stopColor="oklch(0.18 0.06 240)" stopOpacity="0.85" />
                </linearGradient>
                <linearGradient id="continent-grad-active" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="oklch(0.40 0.12 250)" stopOpacity="0.95" />
                  <stop offset="100%" stopColor="oklch(0.25 0.10 290)" stopOpacity="0.95" />
                </linearGradient>
                {/* Ocean pulse gradient */}
                <radialGradient id="ocean-pulse" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="oklch(0.30 0.10 250 / 0.15)" />
                  <stop offset="100%" stopColor="transparent" />
                </radialGradient>
              </defs>

              {/* Subtle ocean pulse */}
              <ellipse cx="180" cy="90" rx="170" ry="80" fill="url(#ocean-pulse)" opacity="0.5">
                <animate attributeName="opacity" values="0.3;0.5;0.3" dur="6s" repeatCount="indefinite" />
              </ellipse>

              {/* Graticule (lat/long grid) - subtle and elegant */}
              <g stroke="oklch(0.50 0.10 250 / 0.12)" strokeWidth="0.15" fill="none">
                {/* Latitude lines */}
                {[-60, -30, 0, 30, 60].map((lat) => {
                  const y = 90 - lat;
                  return <line key={`lat${lat}`} x1="0" y1={y} x2="360" y2={y} />;
                })}
                {/* Longitude lines */}
                {[-150, -120, -90, -60, -30, 0, 30, 60, 90, 120, 150].map((lng) => {
                  const x = lng + 180;
                  return <line key={`lng${lng}`} x1={x} y1="0" x2={x} y2="180" />;
                })}
              </g>

              {/* Equator highlighted */}
              <line x1="0" y1="90" x2="360" y2="90" stroke="oklch(0.60 0.15 250 / 0.25)" strokeWidth="0.25" strokeDasharray="2 1.5" />

              {/* Continents with glow */}
              <g filter="url(#continent-glow)">
                {CONTINENTS.map((c) => (
                  <path
                    key={c.name}
                    d={c.path}
                    fill="url(#continent-grad)"
                    stroke="oklch(0.55 0.15 250 / 0.6)"
                    strokeWidth="0.25"
                    strokeLinejoin="round"
                  />
                ))}
              </g>

              {/* Inner topo-style detail lines on continents (decorative) */}
              <g stroke="oklch(0.65 0.12 260 / 0.3)" strokeWidth="0.12" fill="none" strokeLinecap="round">
                {/* North America detail */}
                <path d="M 60 42 L 80 45 L 100 50 M 70 55 L 90 58 L 110 60 M 85 65 L 105 68" />
                {/* South America detail */}
                <path d="M 135 100 L 145 115 L 150 130 M 140 105 L 148 120" />
                {/* Africa detail */}
                <path d="M 205 80 L 220 95 L 230 115 M 215 85 L 225 100 L 235 120" />
                {/* Asia detail */}
                <path d="M 250 40 L 280 45 L 310 50 M 270 55 L 300 58 L 330 55" />
                {/* Australia detail */}
                <path d="M 315 138 L 330 142 L 345 145" />
              </g>

              {/* Connection lines between observatory clusters (decorative arc) */}
              <g stroke="oklch(0.72 0.18 245 / 0.25)" strokeWidth="0.15" fill="none" strokeDasharray="1 2">
                {/* Atacama <-> Mauna Kea */}
                <path d="M 113 114 Q 60 80 25 70" />
                {/* Atacama <-> NamibRand */}
                <path d="M 113 114 Q 160 130 196 113" />
                {/* Mauna Kea <-> Kiruna */}
                <path d="M 25 70 Q 100 30 200 22" />
                {/* Kennedy <-> Jodrell Bank */}
                <path d="M 100 61 Q 140 45 178 42" />
              </g>

              {/* Markers as SVG for crisp rendering + glow */}
              {markers.map((m) => {
                const svg = toSvg(m.lat, m.lng);
                const color =
                  m.type === "event"
                    ? "oklch(0.78 0.18 280)"
                    : CATEGORY_META[(m.meta as any).category as Category]?.color || "oklch(0.72 0.18 245)";
                const isSelected = selectedId === m.id;
                const isHovered = hoveredId === m.id;
                return (
                  <g key={m.id} style={{ cursor: "pointer" }}>
                    {/* Outer pulse ring (only for selected) */}
                    {isSelected && (
                      <circle cx={svg.x} cy={svg.y} r="6" fill="none" stroke={color} strokeWidth="0.5" opacity="0.6">
                        <animate attributeName="r" values="3;8;3" dur="2s" repeatCount="indefinite" />
                        <animate attributeName="opacity" values="0.7;0;0.7" dur="2s" repeatCount="indefinite" />
                      </circle>
                    )}
                    {/* Always-on subtle pulse for all markers */}
                    <circle cx={svg.x} cy={svg.y} r="2.5" fill="none" stroke={color} strokeWidth="0.3" opacity="0.3">
                      <animate
                        attributeName="r"
                        values="1.5;3.5;1.5"
                        dur={`${3 + (m.id.length % 3)}s`}
                        repeatCount="indefinite"
                      />
                      <animate
                        attributeName="opacity"
                        values="0.4;0;0.4"
                        dur={`${3 + (m.id.length % 3)}s`}
                        repeatCount="indefinite"
                      />
                    </circle>
                    {/* Glow halo */}
                    <circle
                      cx={svg.x}
                      cy={svg.y}
                      r={isSelected || isHovered ? "3" : "2"}
                      fill={color}
                      opacity="0.25"
                      filter="url(#marker-glow)"
                    />
                    {/* Main marker dot */}
                    <circle
                      cx={svg.x}
                      cy={svg.y}
                      r={isSelected ? "1.8" : isHovered ? "1.5" : "1.2"}
                      fill={color}
                      stroke="white"
                      strokeWidth={isSelected ? "0.4" : "0.25"}
                      style={{ transition: "r 0.2s" }}
                    />
                    {/* Inner bright dot */}
                    <circle cx={svg.x} cy={svg.y} r="0.5" fill="white" opacity="0.9" />
                  </g>
                );
              })}

              {/* Hover tooltip line from marker to label */}
              {markers
                .filter((m) => hoveredId === m.id && selectedId !== m.id)
                .map((m) => {
                  const svg = toSvg(m.lat, m.lng);
                  return (
                    <g key={`tip-${m.id}`} pointerEvents="none">
                      <line
                        x1={svg.x}
                        y1={svg.y}
                        x2={svg.x}
                        y2={svg.y - 5}
                        stroke="oklch(0.80 0.18 245 / 0.5)"
                        strokeWidth="0.2"
                      />
                    </g>
                  );
                })}
            </svg>

            {/* HTML overlay markers for hover labels (positioned on top of SVG) */}
            {markers.map((m) => {
              const p = project(m.lat, m.lng);
              const color =
                m.type === "event"
                  ? "oklch(0.78 0.18 280)"
                  : CATEGORY_META[(m.meta as any).category as Category]?.color || "oklch(0.72 0.18 245)";
              const isSelected = selectedId === m.id;
              const isHovered = hoveredId === m.id;
              return (
                <button
                  key={`btn-${m.id}`}
                  onClick={() => setSelectedId(isSelected ? null : m.id)}
                  onMouseEnter={() => setHoveredId(m.id)}
                  onMouseLeave={() => setHoveredId(null)}
                  className="absolute z-10"
                  style={{
                    left: `${p.x}%`,
                    top: `${p.y}%`,
                    transform: "translate(-50%, -50%)",
                    width: "24px",
                    height: "24px",
                  }}
                  aria-label={m.name}
                >
                  {/* Hover/selected label tooltip */}
                  {(isHovered || isSelected) && !isSelected && (
                    <div
                      className="absolute left-1/2 -translate-x-1/2 -top-7 whitespace-nowrap px-2 py-0.5 rounded-md glass-strong text-[10px] font-medium pointer-events-none"
                      style={{ color }}
                    >
                      {m.name}
                    </div>
                  )}
                </button>
              );
            })}

            {/* Top-left info HUD */}
            <div className="absolute top-4 left-4 px-3 py-2.5 rounded-xl glass-strong text-xs">
              <div className="text-muted-foreground text-[9px] uppercase tracking-wider mb-1">Active Layer</div>
              <div className="font-semibold flex items-center gap-1.5">
                <span className="text-sm">{activeLayerMeta?.emoji}</span>
                {activeLayerMeta?.label}
              </div>
              <div className="text-[10px] text-muted-foreground mt-1">{markers.length} markers · 360° view</div>
            </div>

            {/* Bottom-right legend */}
            <div className="absolute bottom-4 right-4 px-3.5 py-3 rounded-xl glass-strong text-xs space-y-1.5">
              <div className="text-muted-foreground text-[9px] uppercase tracking-wider mb-2 font-semibold">Legend</div>
              {[
                { color: "oklch(0.72 0.18 245)", label: "Stargazing" },
                { color: "oklch(0.78 0.20 320)", label: "Observatory" },
                { color: "oklch(0.78 0.18 30)", label: "Space Center" },
                { color: "oklch(0.70 0.16 250)", label: "Dark Sky" },
                { color: "oklch(0.78 0.18 280)", label: "Event" },
              ].map((l) => (
                <div key={l.label} className="flex items-center gap-2">
                  <div className="relative h-2.5 w-2.5">
                    <div className="absolute inset-0 rounded-full" style={{ background: l.color, boxShadow: `0 0 6px ${l.color}` }} />
                  </div>
                  <span className="text-[11px]">{l.label}</span>
                </div>
              ))}
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

            {/* Bottom controls (zoom) */}
            <div className="absolute bottom-4 left-4 flex flex-col gap-1.5">
              <button className="h-10 w-10 rounded-xl glass-strong flex items-center justify-center hover:bg-white/10 transition-colors group">
                <Plus className="h-4 w-4 group-hover:text-primary transition-colors" />
              </button>
              <button className="h-10 w-10 rounded-xl glass-strong flex items-center justify-center hover:bg-white/5 transition-colors group">
                <Minus className="h-4 w-4 group-hover:text-primary transition-colors" />
              </button>
              <button
                onClick={() => { setSelectedId(null); setActiveLayer("all"); }}
                className="h-10 w-10 rounded-xl glass-strong flex items-center justify-center hover:bg-white/5 transition-colors group"
                aria-label="Reset view"
              >
                <Crosshair className="h-4 w-4 group-hover:text-primary transition-colors" />
              </button>
              <button className="h-10 w-10 rounded-xl glass-strong flex items-center justify-center hover:bg-white/5 transition-colors group">
                <Layers className="h-4 w-4 group-hover:text-primary transition-colors" />
              </button>
            </div>

            {/* Bottom center: projection info */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-3 py-1.5 rounded-lg glass-strong text-[10px] text-muted-foreground flex items-center gap-2">
              <Globe2 className="h-3 w-3 text-primary" />
              Equirectangular projection · Cosmic Map v3.0
            </div>
          </div>
        </GlassCard>
      </section>
    </div>
  );
}

/* Star field specifically tuned for the map */
function MapStarField({ count }: { count: number }) {
  const stars = useMemo(
    () =>
      Array.from({ length: count }).map((_, i) => ({
        id: i,
        top: Math.random() * 100,
        left: Math.random() * 100,
        size: Math.random() * 1.8 + 0.3,
        delay: Math.random() * 6,
        duration: Math.random() * 4 + 3,
        opacity: Math.random() * 0.7 + 0.2,
      })),
    [count]
  );
  return (
    <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
      {stars.map((s) => (
        <div
          key={s.id}
          className="absolute rounded-full bg-white animate-twinkle"
          style={{
            top: `${s.top}%`,
            left: `${s.left}%`,
            width: `${s.size}px`,
            height: `${s.size}px`,
            opacity: s.opacity,
            animationDelay: `${s.delay}s`,
            animationDuration: `${s.duration}s`,
            boxShadow: s.size > 1.2 ? `0 0 4px rgba(255,255,255,0.8)` : undefined,
          }}
        />
      ))}
    </div>
  );
}

function SelectedLocationCard({
  location,
  onClose,
  onViewDetails,
}: {
  location: any;
  onClose: () => void;
  onViewDetails: () => void;
}) {
  const meta = CATEGORY_META[location.category as Category];
  return (
    <div>
      <div className="flex items-start justify-between gap-2 mb-2">
        <div
          className="px-2 py-0.5 rounded-full text-[10px] font-medium flex items-center gap-1"
          style={{ background: `${meta.color}30`, color: meta.color }}
        >
          <span>{meta.emoji}</span>
          {meta.label}
        </div>
        <button onClick={onClose} className="p-1 rounded hover:bg-white/10">
          <X className="h-3.5 w-3.5" />
        </button>
      </div>
      <h3 className="font-bold text-base leading-tight">{location.name}</h3>
      <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
        <MapPin className="h-3 w-3 text-primary" />
        {location.city}, {location.country}
      </div>
      <div
        className="h-28 mt-3 rounded-lg overflow-hidden relative"
        style={{ background: location.imageGradient }}
      >
        {location.image && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={location.image} alt={location.name} className="absolute inset-0 w-full h-full object-cover" />
        )}
        <div className="absolute inset-0 nebula-overlay opacity-50" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        {/* Mini starfield on the preview */}
        <div className="absolute inset-0">
          {Array.from({ length: 15 }).map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full bg-white animate-twinkle"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                width: `${Math.random() * 1.5 + 0.3}px`,
                height: `${Math.random() * 1.5 + 0.3}px`,
                opacity: 0.6,
                animationDelay: `${Math.random() * 4}s`,
              }}
            />
          ))}
        </div>
        {/* Mini planet visual */}
        <div
          className="absolute top-2 right-2 h-8 w-8 rounded-full animate-float"
          style={{
            background: `radial-gradient(circle at 30% 30%, ${meta.color}, oklch(0.10 0.04 270))`,
            boxShadow: `0 0 16px ${meta.color}`,
          }}
        />
      </div>
      <p className="text-xs text-muted-foreground mt-3 line-clamp-3 leading-relaxed">{location.description}</p>
      <div className="grid grid-cols-2 gap-2 mt-3 text-[11px]">
        <div className="flex items-center gap-1.5 px-2 py-1.5 rounded-lg glass">
          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
          <span className="font-medium">{location.rating}</span>
          <span className="text-muted-foreground">rating</span>
        </div>
        <div className="flex items-center gap-1.5 px-2 py-1.5 rounded-lg glass">
          <Moon className="h-3 w-3 text-purple-300" />
          <span className="font-medium">{location.darkSkyRating.toFixed(1)}</span>
          <span className="text-muted-foreground">/10</span>
        </div>
      </div>
      <button
        onClick={onViewDetails}
        className="w-full mt-3 py-2.5 rounded-lg bg-primary text-primary-foreground text-xs font-medium flex items-center justify-center gap-1.5 hover:glow-primary transition-all"
      >
        View Details <ArrowUpRight className="h-3 w-3" />
      </button>
    </div>
  );
}

function SelectedEventCard({
  event,
  onClose,
  onViewDetails,
}: {
  event: any;
  onClose: () => void;
  onViewDetails: () => void;
}) {
  return (
    <div>
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-accent/20 text-accent-foreground flex items-center gap-1">
          <span>☄️</span> Event
        </div>
        <button onClick={onClose} className="p-1 rounded hover:bg-white/10">
          <X className="h-3.5 w-3.5" />
        </button>
      </div>
      <h3 className="font-bold text-base leading-tight">{event.name}</h3>
      <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
        <MapPin className="h-3 w-3 text-accent" />
        {event.bestLocation}
      </div>
      <div className="h-28 mt-3 rounded-lg overflow-hidden relative" style={{ background: event.imageGradient }}>
        {event.image && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={event.image} alt={event.name} className="absolute inset-0 w-full h-full object-cover" />
        )}
        <div className="absolute inset-0 nebula-overlay opacity-50" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        {/* Animated comet trail */}
        <div className="absolute top-1/2 left-0 w-32 h-0.5 bg-gradient-to-r from-transparent via-accent to-transparent animate-shooting-star opacity-70" />
      </div>
      <p className="text-xs text-muted-foreground mt-3 line-clamp-3 leading-relaxed">{event.description}</p>
      <div className="mt-3 px-2 py-1.5 rounded-lg glass text-[11px] flex items-center justify-between">
        <span className="text-muted-foreground">Visibility</span>
        <span className="font-semibold text-accent">{event.visibilityPercent}%</span>
      </div>
      <button
        onClick={onViewDetails}
        className="w-full mt-3 py-2.5 rounded-lg bg-primary text-primary-foreground text-xs font-medium flex items-center justify-center gap-1.5 hover:glow-primary transition-all"
      >
        View Event <ArrowUpRight className="h-3 w-3" />
      </button>
    </div>
  );
}
