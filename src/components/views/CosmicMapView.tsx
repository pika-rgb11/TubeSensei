"use client";

import { useState, useMemo, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, X, Star, Moon, ArrowUpRight, Layers, Globe2, Plus, Minus, Crosshair, Hand } from "lucide-react";
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
const CONTINENTS = [
  { name: "North America", path: "M 35 38 L 50 32 L 70 28 L 95 30 L 115 38 L 130 42 L 150 38 L 168 42 L 175 50 L 170 60 L 158 68 L 145 75 L 130 78 L 110 75 L 88 70 L 70 62 L 55 55 L 45 48 Z" },
  { name: "Central America", path: "M 110 78 L 122 80 L 128 88 L 120 92 L 112 88 Z" },
  { name: "South America", path: "M 130 88 L 150 86 L 158 96 L 162 110 L 158 128 L 148 145 L 138 155 L 128 158 L 122 148 L 120 130 L 124 110 L 128 96 Z" },
  { name: "Europe", path: "M 180 38 L 198 35 L 215 38 L 225 42 L 232 50 L 228 58 L 215 62 L 200 60 L 188 55 L 182 48 Z" },
  { name: "Africa", path: "M 195 65 L 215 62 L 235 65 L 245 75 L 250 90 L 252 110 L 245 128 L 232 140 L 218 142 L 205 132 L 198 115 L 193 95 L 192 80 Z" },
  { name: "Asia", path: "M 230 35 L 260 30 L 290 28 L 320 30 L 345 35 L 358 45 L 350 58 L 328 65 L 308 70 L 290 68 L 270 62 L 248 55 L 232 48 Z" },
  { name: "Middle East", path: "M 232 58 L 248 60 L 252 70 L 245 80 L 235 78 L 228 68 Z" },
  { name: "India", path: "M 280 68 L 295 70 L 300 82 L 296 95 L 288 100 L 280 92 L 278 78 Z" },
  { name: "Southeast Asia", path: "M 310 78 L 325 80 L 332 90 L 328 100 L 320 102 L 312 95 L 308 85 Z" },
  { name: "Australia", path: "M 305 130 L 325 128 L 345 132 L 355 142 L 350 152 L 332 156 L 312 152 L 302 142 Z" },
  { name: "Greenland", path: "M 145 18 L 165 16 L 178 22 L 175 32 L 160 35 L 148 30 Z" },
  { name: "Antarctica", path: "M 30 165 L 80 162 L 140 165 L 200 162 L 260 165 L 320 162 L 350 168 L 340 178 L 200 180 L 60 178 L 25 172 Z" },
  { name: "United Kingdom", path: "M 178 40 L 184 38 L 187 44 L 183 48 L 178 46 Z" },
  { name: "Japan", path: "M 330 50 L 336 48 L 340 56 L 336 62 L 332 60 L 330 54 Z" },
  { name: "Madagascar", path: "M 256 112 L 262 110 L 265 122 L 260 128 L 254 124 Z" },
  { name: "New Zealand", path: "M 355 152 L 358 150 L 356 158 L 352 156 Z" },
];

// Project lat/lng to x/y in container (percentage)
function project(lat: number, lng: number) {
  const x = ((lng + 180) / 360) * 100;
  const y = ((90 - lat) / 180) * 100;
  return { x, y };
}

// Convert lat/lng to SVG coordinates in 360x180 viewBox
function toSvg(lat: number, lng: number) {
  return { x: lng + 180, y: 90 - lat };
}

const ZOOM_LEVELS = [1, 2, 3, 5, 8];
const MIN_ZOOM_INDEX = 0;
const MAX_ZOOM_INDEX = ZOOM_LEVELS.length - 1;

export function CosmicMapView() {
  const { navigate } = useAppStore();
  const [activeLayer, setActiveLayer] = useState<LayerType>("all");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  // Zoom & pan state
  const [zoomIndex, setZoomIndex] = useState(0); // index into ZOOM_LEVELS
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 }); // in % of container
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0, panX: 0, panY: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  const zoom = ZOOM_LEVELS[zoomIndex];

  const markers = useMemo(() => {
    const list: { id: string; lat: number; lng: number; type: "location" | "event"; name: string; meta: any }[] = [];
    if (activeLayer === "all" || activeLayer === "events") {
      const eventCoords: Record<string, { lat: number; lng: number }> = {
        "evt-newmoon-sep26": { lat: 0, lng: 0 },
        "evt-saturn-opposition": { lat: 28.76, lng: -17.88 },
        "evt-orionids": { lat: 41.66, lng: -77.81 },
        "evt-leonids": { lat: 52.87, lng: -118.08 },
        "evt-jupiter-opposition": { lat: 19.82, lng: -155.47 },
        "evt-geminids": { lat: -23.66, lng: -67.01 },
        "evt-quadrantids": { lat: 55.08, lng: -4.18 },
        "evt-annular-eclipse": { lat: -34.60, lng: -58.38 },
        "evt-lunar-eclipse-mar": { lat: 19.82, lng: -155.47 },
        "evt-lyrids": { lat: 41.66, lng: -77.81 },
        "evt-eta-aquarids": { lat: -43.88, lng: 170.47 },
        "evt-total-eclipse-2027": { lat: 28.27, lng: -16.64 },
        "evt-perseids-2027": { lat: 41.66, lng: -77.81 },
        "evt-artemis-2": { lat: 28.57, lng: -80.65 },
        "evt-starship-ift": { lat: 25.99, lng: -97.16 },
        "evt-jasper-fest": { lat: 52.87, lng: -118.08 },
        "evt-aurora-forecast": { lat: 67.85, lng: 20.22 },
        "evt-iss-sept": { lat: 28.57, lng: -80.65 },
      };
      events.forEach((e) => {
        const c = eventCoords[e.id] ?? { lat: 30, lng: 0 };
        list.push({ id: e.id, lat: c.lat, lng: c.lng, type: "event" as const, name: e.name, meta: e });
      });
    }
    locations.forEach((l) => {
      if (activeLayer === "all" || l.category === activeLayer) {
        list.push({ id: l.id, lat: l.coordinates.lat, lng: l.coordinates.lng, type: "location" as const, name: l.name, meta: l });
      }
    });
    return list;
  }, [activeLayer]);

  const selected = markers.find((m) => m.id === selectedId);
  const activeLayerMeta = LAYERS.find((l) => l.id === activeLayer);

  // Zoom in/out
  const zoomIn = useCallback(() => {
    setZoomIndex((i) => Math.min(MAX_ZOOM_INDEX, i + 1));
  }, []);
  const zoomOut = useCallback(() => {
    setZoomIndex((i) => Math.max(MIN_ZOOM_INDEX, i - 1));
    // If we go back to 1x, reset pan
    setZoomIndex((i) => {
      if (i === 0) {
        setPanOffset({ x: 0, y: 0 });
      }
      return Math.max(MIN_ZOOM_INDEX, i - 1);
    });
  }, []);

  const resetView = useCallback(() => {
    setZoomIndex(0);
    setPanOffset({ x: 0, y: 0 });
    setSelectedId(null);
  }, []);

  // Wheel zoom — zoom around cursor
  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    const delta = -e.deltaY;
    if (delta > 0) {
      setZoomIndex((i) => Math.min(MAX_ZOOM_INDEX, i + 1));
    } else {
      setZoomIndex((i) => {
        const next = Math.max(MIN_ZOOM_INDEX, i - 1);
        if (next === 0) setPanOffset({ x: 0, y: 0 });
        return next;
      });
    }
  }, []);

  // Drag to pan (only when zoomed in)
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (zoom === 1) return;
    setIsDragging(true);
    setDragStart({ x: e.clientX, y: e.clientY, panX: panOffset.x, panY: panOffset.y });
  }, [zoom, panOffset]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const dx = ((e.clientX - dragStart.x) / rect.width) * 100;
    const dy = ((e.clientY - dragStart.y) / rect.height) * 100;
    // Clamp pan so map doesn't wander too far
    const maxX = (zoom - 1) * 50;
    const maxY = (zoom - 1) * 50;
    const newX = Math.max(-maxX, Math.min(maxX, dragStart.panX + dx));
    const newY = Math.max(-maxY, Math.min(maxY, dragStart.panY + dy));
    setPanOffset({ x: newX, y: newY });
  }, [isDragging, dragStart, zoom]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  // Cursor for zoom state
  const cursorClass = zoom === 1 ? "cursor-default" : isDragging ? "cursor-grabbing" : "cursor-grab";

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
            ref={containerRef}
            className={cn(
              "relative h-[75vh] min-h-[520px] overflow-hidden select-none",
              cursorClass
            )}
            style={{
              background:
                "radial-gradient(ellipse 80% 60% at 50% 50%, oklch(0.13 0.05 270) 0%, oklch(0.08 0.03 270) 60%, oklch(0.04 0.01 270) 100%)",
            }}
            onWheel={handleWheel}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          >
            {/* Nebula gradient layers (don't move with pan/zoom) */}
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

            {/* Atmospheric vignette (don't move with pan/zoom) */}
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute inset-0" style={{
                background: "radial-gradient(ellipse 90% 75% at 50% 50%, transparent 50%, oklch(0.04 0.01 270 / 0.7) 100%)",
              }} />
            </div>

            {/* Star field (don't move with pan/zoom — feels parallax-y) */}
            <MapStarField count={200} />

            {/* Map content wrapper — this gets transformed for zoom/pan */}
            <motion.div
              className="absolute inset-0"
              animate={{
                scale: zoom,
                x: `${panOffset.x}%`,
                y: `${panOffset.y}%`,
              }}
              transition={{ type: "spring", stiffness: 200, damping: 30 }}
              style={{ transformOrigin: "center" }}
            >
              {/* World map SVG */}
              <svg
                className="absolute inset-0 w-full h-full"
                viewBox="0 0 360 180"
                preserveAspectRatio="xMidYMid meet"
              >
                <defs>
                  <filter id="continent-glow" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="0.8" result="blur" />
                    <feMerge>
                      <feMergeNode in="blur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                  <filter id="marker-glow" x="-50%" y="-50%" width="200%" height="200%">
                    <feGaussianBlur stdDeviation="2" result="blur" />
                    <feMerge>
                      <feMergeNode in="blur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                  <linearGradient id="continent-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="oklch(0.30 0.10 250)" stopOpacity="0.85" />
                    <stop offset="50%" stopColor="oklch(0.22 0.08 280)" stopOpacity="0.9" />
                    <stop offset="100%" stopColor="oklch(0.18 0.06 240)" stopOpacity="0.85" />
                  </linearGradient>
                  <radialGradient id="ocean-pulse" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="oklch(0.30 0.10 250 / 0.15)" />
                    <stop offset="100%" stopColor="transparent" />
                  </radialGradient>
                </defs>

                {/* Subtle ocean pulse */}
                <ellipse cx="180" cy="90" rx="170" ry="80" fill="url(#ocean-pulse)" opacity="0.5">
                  <animate attributeName="opacity" values="0.3;0.5;0.3" dur="6s" repeatCount="indefinite" />
                </ellipse>

                {/* Graticule */}
                <g stroke="oklch(0.50 0.10 250 / 0.12)" strokeWidth="0.15" fill="none">
                  {[-60, -30, 0, 30, 60].map((lat) => {
                    const y = 90 - lat;
                    return <line key={`lat${lat}`} x1="0" y1={y} x2="360" y2={y} />;
                  })}
                  {[-150, -120, -90, -60, -30, 0, 30, 60, 90, 120, 150].map((lng) => {
                    const x = lng + 180;
                    return <line key={`lng${lng}`} x1={x} y1="0" x2={x} y2="180" />;
                  })}
                </g>

                {/* Equator */}
                <line x1="0" y1="90" x2="360" y2="90" stroke="oklch(0.60 0.15 250 / 0.25)" strokeWidth="0.25" strokeDasharray="2 1.5" />

                {/* Continents */}
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

                {/* Topo detail lines */}
                <g stroke="oklch(0.65 0.12 260 / 0.3)" strokeWidth="0.12" fill="none" strokeLinecap="round">
                  <path d="M 60 42 L 80 45 L 100 50 M 70 55 L 90 58 L 110 60 M 85 65 L 105 68" />
                  <path d="M 135 100 L 145 115 L 150 130 M 140 105 L 148 120" />
                  <path d="M 205 80 L 220 95 L 230 115 M 215 85 L 225 100 L 235 120" />
                  <path d="M 250 40 L 280 45 L 310 50 M 270 55 L 300 58 L 330 55" />
                  <path d="M 315 138 L 330 142 L 345 145" />
                </g>

                {/* Connection arcs */}
                <g stroke="oklch(0.72 0.18 245 / 0.25)" strokeWidth="0.15" fill="none" strokeDasharray="1 2">
                  <path d="M 113 114 Q 60 80 25 70" />
                  <path d="M 113 114 Q 160 130 196 113" />
                  <path d="M 25 70 Q 100 30 200 22" />
                  <path d="M 100 61 Q 140 45 178 42" />
                </g>

                {/* Markers (scaled inversely so they don't grow huge when zoomed) */}
                {markers.map((m) => {
                  const svg = toSvg(m.lat, m.lng);
                  const color =
                    m.type === "event"
                      ? "oklch(0.78 0.18 280)"
                      : CATEGORY_META[(m.meta as any).category as Category]?.color || "oklch(0.72 0.18 245)";
                  const isSelected = selectedId === m.id;
                  const isHovered = hoveredId === m.id;
                  // Inverse scale so markers stay readable size
                  const inverseScale = 1 / zoom;
                  return (
                    <g
                      key={m.id}
                      style={{ cursor: "pointer" }}
                      transform={`translate(${svg.x} ${svg.y}) scale(${inverseScale})`}
                    >
                      {/* Outer pulse ring (selected) */}
                      {isSelected && (
                        <circle cx="0" cy="0" r="6" fill="none" stroke={color} strokeWidth="0.5" opacity="0.6">
                          <animate attributeName="r" values="3;8;3" dur="2s" repeatCount="indefinite" />
                          <animate attributeName="opacity" values="0.7;0;0.7" dur="2s" repeatCount="indefinite" />
                        </circle>
                      )}
                      {/* Always-on subtle pulse */}
                      <circle cx="0" cy="0" r="2.5" fill="none" stroke={color} strokeWidth="0.3" opacity="0.3">
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
                        cx="0" cy="0"
                        r={isSelected || isHovered ? "3" : "2"}
                        fill={color}
                        opacity="0.25"
                        filter="url(#marker-glow)"
                      />
                      {/* Main marker dot */}
                      <circle
                        cx="0" cy="0"
                        r={isSelected ? "1.8" : isHovered ? "1.5" : "1.2"}
                        fill={color}
                        stroke="white"
                        strokeWidth={isSelected ? "0.4" : "0.25"}
                      />
                      {/* Inner bright dot */}
                      <circle cx="0" cy="0" r="0.5" fill="white" opacity="0.9" />
                    </g>
                  );
                })}
              </svg>

              {/* HTML overlay markers for hover labels */}
              {markers.map((m) => {
                const p = project(m.lat, m.lng);
                const color =
                  m.type === "event"
                    ? "oklch(0.78 0.18 280)"
                    : CATEGORY_META[(m.meta as any).category as Category]?.color || "oklch(0.72 0.18 245)";
                const isSelected = selectedId === m.id;
                const isHovered = hoveredId === m.id;
                // Marker hit area stays a constant clickable size — we scale the inner content down for zoomed view
                return (
                  <button
                    key={`btn-${m.id}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedId(isSelected ? null : m.id);
                    }}
                    onMouseEnter={(e) => { e.stopPropagation(); setHoveredId(m.id); }}
                    onMouseLeave={() => setHoveredId(null)}
                    className="absolute z-10"
                    style={{
                      left: `${p.x}%`,
                      top: `${p.y}%`,
                      transform: "translate(-50%, -50%)",
                      width: `${Math.max(16, 24 / zoom)}px`,
                      height: `${Math.max(16, 24 / zoom)}px`,
                      background: "transparent",
                      border: "none",
                      padding: 0,
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
            </motion.div>

            {/* Top-left info HUD */}
            <div className="absolute top-4 left-4 px-3 py-2.5 rounded-xl glass-strong text-xs z-20 pointer-events-none">
              <div className="text-muted-foreground text-[9px] uppercase tracking-wider mb-1">Active Layer</div>
              <div className="font-semibold flex items-center gap-1.5">
                <span className="text-sm">{activeLayerMeta?.emoji}</span>
                {activeLayerMeta?.label}
              </div>
              <div className="text-[10px] text-muted-foreground mt-1">
                {markers.length} markers · {zoom}x zoom
                {zoom > 1 && <span className="ml-1 text-primary">· drag to pan</span>}
              </div>
            </div>

            {/* Bottom-right legend */}
            <div className="absolute bottom-4 right-4 px-3.5 py-3 rounded-xl glass-strong text-xs space-y-1.5 z-20 pointer-events-none">
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
                  className="absolute top-4 right-4 bottom-16 w-72 glass-strong rounded-2xl p-4 overflow-y-auto custom-scroll z-30"
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

            {/* Bottom controls (zoom — working!) */}
            <div className="absolute bottom-4 left-4 flex flex-col gap-1.5 z-30">
              <button
                onClick={zoomIn}
                disabled={zoomIndex >= MAX_ZOOM_INDEX}
                className="h-10 w-10 rounded-xl glass-strong flex items-center justify-center hover:bg-white/10 transition-colors group disabled:opacity-40 disabled:cursor-not-allowed hover:glow-primary"
                aria-label="Zoom in"
              >
                <Plus className="h-4 w-4 group-hover:text-primary transition-colors" />
              </button>
              {/* Zoom level indicator */}
              <div className="h-10 w-10 rounded-xl glass-strong flex items-center justify-center text-[10px] font-bold text-primary tabular-nums">
                {zoom}x
              </div>
              <button
                onClick={zoomOut}
                disabled={zoomIndex <= MIN_ZOOM_INDEX}
                className="h-10 w-10 rounded-xl glass-strong flex items-center justify-center hover:bg-white/5 transition-colors group disabled:opacity-40 disabled:cursor-not-allowed hover:glow-primary"
                aria-label="Zoom out"
              >
                <Minus className="h-4 w-4 group-hover:text-primary transition-colors" />
              </button>
              <button
                onClick={resetView}
                className="h-10 w-10 rounded-xl glass-strong flex items-center justify-center hover:bg-white/5 transition-colors group"
                aria-label="Reset view"
                title="Reset view"
              >
                <Crosshair className="h-4 w-4 group-hover:text-primary transition-colors" />
              </button>
            </div>

            {/* Bottom center: instructions / projection info */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-3 py-1.5 rounded-lg glass-strong text-[10px] text-muted-foreground flex items-center gap-2 z-20 pointer-events-none">
              <Globe2 className="h-3 w-3 text-primary" />
              {zoom === 1 ? (
                <span>Scroll to zoom · Cosmic Map v3.1</span>
              ) : (
                <span className="text-primary">Drag to pan · scroll to zoom · reset to exit</span>
              )}
            </div>

            {/* Zoom indicator bar (only visible when zoomed) */}
            <AnimatePresence>
              {zoom > 1 && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="absolute top-4 left-1/2 -translate-x-1/2 px-3 py-1.5 rounded-lg glass-strong text-[10px] flex items-center gap-2 z-20 pointer-events-none"
                >
                  <Hand className="h-3 w-3 text-primary" />
                  <span>Drag to explore</span>
                  <div className="flex gap-1 ml-2">
                    {ZOOM_LEVELS.map((z, i) => (
                      <div
                        key={z}
                        className={cn(
                          "h-1 w-4 rounded-full transition-colors",
                          i === zoomIndex ? "bg-primary" : "bg-white/15"
                        )}
                      />
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
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
