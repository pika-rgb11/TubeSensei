"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Moon, Eye, Star, Cloud, Wind, Compass, Zap, Sparkles, MapPin,
  Radio, ArrowUpRight, Clock, Sun,
} from "lucide-react";
import { StarField } from "@/components/common/StarField";
import { GlassCard } from "@/components/common/GlassCard";
import { useAppStore } from "@/store/app-store";
import { planets } from "@/lib/data/cosmos";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const VISIBLE_PLANETS = [
  { name: "Venus", direction: "West", altitude: "18°", magnitude: "-4.2", visible: "until 21:30", color: "oklch(0.82 0.16 70)" },
  { name: "Jupiter", direction: "South", altitude: "62°", magnitude: "-2.8", visible: "all night", color: "oklch(0.80 0.16 50)" },
  { name: "Mars", direction: "East", altitude: "31°", magnitude: "+0.4", visible: "from 23:00", color: "oklch(0.70 0.18 30)" },
  { name: "Saturn", direction: "South-West", altitude: "45°", magnitude: "+0.6", visible: "until 02:00", color: "oklch(0.82 0.14 70)" },
];

const VISIBLE_CONSTELLATIONS = [
  { name: "Orion", bestTime: "21:00 – 02:00", direction: "South", visible: true },
  { name: "Ursa Major (Big Dipper)", bestTime: "All night", direction: "North", visible: true },
  { name: "Cassiopeia", bestTime: "All night", direction: "North", visible: true },
  { name: "Cygnus", bestTime: "20:00 – 24:00", direction: "Overhead", visible: true },
  { name: "Scorpius", bestTime: "22:00 – 01:00", direction: "South", visible: false },
];

export function TonightsSkyView() {
  const { navigate } = useAppStore();
  const [pointMode, setPointMode] = useState(false);
  const stargazingScore = 92;

  return (
    <div className="pt-16 pb-12">
      {/* Hero */}
      <section className="relative py-12 overflow-hidden">
        <StarField count={100} withShootingStars />
        <div className="container mx-auto px-6 relative">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl"
          >
            <div className="text-xs font-medium uppercase tracking-[0.18em] text-primary/80 mb-2 flex items-center gap-2">
              <Moon className="h-3.5 w-3.5" />
              Live Sky Conditions
            </div>
            <h1 className="text-3xl md:text-5xl font-bold tracking-tight mb-3">
              Tonight's <span className="text-gradient-cosmic">Sky</span>
            </h1>
            <p className="text-muted-foreground max-w-2xl">
              Real-time stargazing conditions for your location. Tap "Point at Sky" to use your phone like a planetarium — point it anywhere and we'll show you what's there.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Stargazing score banner */}
      <section className="container mx-auto px-6">
        <GlassCard variant="strong" className="relative overflow-hidden p-6 md:p-8 mb-8">
          <div className="absolute inset-0 pointer-events-none">
            <StarField count={40} />
            <div className="absolute top-0 right-1/4 w-72 h-72 rounded-full opacity-30 blur-3xl"
              style={{ background: "radial-gradient(circle, oklch(0.45 0.18 200), transparent 70%)" }}
            />
          </div>
          <div className="relative grid md:grid-cols-[auto_1fr_auto] gap-6 items-center">
            {/* Score gauge */}
            <div className="relative h-32 w-32 mx-auto">
              <svg className="w-full h-full -rotate-90">
                <circle cx="64" cy="64" r="56" fill="none" stroke="oklch(0.20 0.05 280 / 0.5)" strokeWidth="10" />
                <circle
                  cx="64" cy="64" r="56" fill="none" stroke="url(#scoreGrad)" strokeWidth="10"
                  strokeDasharray={`${(stargazingScore / 100) * 2 * Math.PI * 56} ${2 * Math.PI * 56}`}
                  strokeLinecap="round"
                />
                <defs>
                  <linearGradient id="scoreGrad" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="oklch(0.72 0.18 245)" />
                    <stop offset="100%" stopColor="oklch(0.78 0.20 320)" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <div className="text-3xl font-bold">{stargazingScore}</div>
                <div className="text-[10px] uppercase tracking-wider text-muted-foreground">out of 100</div>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-2">Excellent stargazing tonight</h2>
              <p className="text-sm text-muted-foreground mb-3">
                Conditions are nearly perfect — minimal cloud cover, low humidity, and new moon means dark skies. Get outside within the next 4 hours for the best views.
              </p>
              <div className="flex flex-wrap gap-2 text-xs">
                <span className="px-2.5 py-1 rounded-full glass flex items-center gap-1"><Moon className="h-3 w-3 text-purple-300" /> New Moon (1%)</span>
                <span className="px-2.5 py-1 rounded-full glass flex items-center gap-1"><Cloud className="h-3 w-3 text-primary" /> 8% cloud cover</span>
                <span className="px-2.5 py-1 rounded-full glass flex items-center gap-1"><Zap className="h-3 w-3 text-accent" /> Kp 2.3 (calm)</span>
                <span className="px-2.5 py-1 rounded-full glass flex items-center gap-1"><Wind className="h-3 w-3 text-primary" /> 5 km/h NW wind</span>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <button
                onClick={() => { setPointMode(!pointMode); toast.success(pointMode ? "Exited sky mode" : "Sky mode activated — point your phone!"); }}
                className={cn(
                  "px-4 py-2.5 rounded-xl font-medium transition-all flex items-center gap-2 justify-center",
                  pointMode ? "bg-primary text-primary-foreground glow-primary" : "glass hover:bg-white/5"
                )}
              >
                <Compass className="h-4 w-4" />
                {pointMode ? "Exit Sky Mode" : "Point at Sky"}
              </button>
              <button
                onClick={() => toast.success("Dark sky alert scheduled")}
                className="px-4 py-2.5 rounded-xl glass hover:bg-white/5 transition-all flex items-center gap-2 justify-center text-sm"
              >
                <Moon className="h-4 w-4 text-purple-300" />
                Dark-Sky Alert
              </button>
            </div>
          </div>
        </GlassCard>
      </section>

      {/* Interactive sky map */}
      <section className="container mx-auto px-6 mb-8">
        <SkyMap pointMode={pointMode} />
      </section>

      {/* Detailed cards */}
      <section className="container mx-auto px-6 grid lg:grid-cols-2 gap-5">
        {/* Visible planets */}
        <GlassCard className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold flex items-center gap-2">
              <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
              Visible Planets
            </h3>
            <span className="text-xs text-muted-foreground">{VISIBLE_PLANETS.length} tonight</span>
          </div>
          <div className="space-y-3">
            {VISIBLE_PLANETS.map((p) => (
              <div key={p.name} className="flex items-center gap-3 p-3 rounded-lg glass hover:bg-white/5 transition-colors">
                <div
                  className="h-8 w-8 rounded-full shrink-0"
                  style={{ background: `radial-gradient(circle at 30% 30%, ${p.color}, oklch(0.10 0.04 270))` }}
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <div className="font-medium text-sm">{p.name}</div>
                    <div className="text-xs text-primary font-mono">mag {p.magnitude}</div>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
                    <span className="flex items-center gap-1"><Compass className="h-3 w-3" />{p.direction} {p.altitude}</span>
                    <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{p.visible}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>

        {/* Constellations */}
        <GlassCard className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-accent" />
              Constellations Tonight
            </h3>
            <span className="text-xs text-muted-foreground">{VISIBLE_CONSTELLATIONS.filter((c) => c.visible).length} visible</span>
          </div>
          <div className="space-y-2">
            {VISIBLE_CONSTELLATIONS.map((c) => (
              <div key={c.name} className="flex items-center justify-between p-3 rounded-lg glass">
                <div>
                  <div className="text-sm font-medium">{c.name}</div>
                  <div className="text-xs text-muted-foreground mt-0.5">
                    {c.bestTime} · {c.direction}
                  </div>
                </div>
                {c.visible ? (
                  <div className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-medium">VISIBLE</div>
                ) : (
                  <div className="px-2 py-0.5 rounded-full bg-red-500/20 text-red-300 text-[10px] font-medium">LOW</div>
                )}
              </div>
            ))}
          </div>
        </GlassCard>

        {/* Moon phase */}
        <GlassCard className="p-6">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <Moon className="h-4 w-4 text-purple-300" />
            Moon Phase
          </h3>
          <div className="flex items-center gap-4">
            <div className="relative h-20 w-20 shrink-0">
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-yellow-100 via-yellow-200 to-yellow-300"
                style={{ boxShadow: "0 0 30px oklch(0.90 0.05 70 / 0.3)" }}
              />
              <div className="absolute inset-0 rounded-full bg-background" style={{ clipPath: "inset(0 0 0 50%)" }} />
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-yellow-100/80 to-transparent" style={{ clipPath: "inset(0 50% 0 0)", opacity: 0.05 }} />
            </div>
            <div>
              <div className="font-semibold">New Moon</div>
              <div className="text-sm text-muted-foreground mt-1">1% illuminated</div>
              <div className="text-xs text-muted-foreground mt-1">Next full moon: in 13 days</div>
              <div className="text-xs text-emerald-400 mt-2 flex items-center gap-1">
                <Star className="h-3 w-3 fill-emerald-400" />
                Best dark-sky conditions
              </div>
            </div>
          </div>
        </GlassCard>

        {/* Meteor & ISS */}
        <GlassCard className="p-6">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <Radio className="h-4 w-4 text-primary" />
            Special Activity
          </h3>
          <div className="space-y-3">
            <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/20">
              <div className="flex items-center gap-2 text-sm font-medium">
                <span className="text-amber-400">☄️</span>
                Perseid Meteor Shower
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Up to 80 meteors/hr expected tonight. Best viewing 02:00–04:00.
              </p>
            </div>
            <div className="p-3 rounded-lg bg-primary/10 border border-primary/20">
              <div className="flex items-center gap-2 text-sm font-medium">
                <span className="text-primary">🛰️</span>
                ISS Bright Pass
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Tomorrow 19:24 — 6 min visible pass, mag -3.8.
              </p>
            </div>
            <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
              <div className="flex items-center gap-2 text-sm font-medium">
                <span className="text-emerald-400">🌌</span>
                Milky Way Core
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Visible to south from 21:00–01:00, near Sagittarius.
              </p>
            </div>
          </div>
        </GlassCard>
      </section>

      {/* Best viewing direction compass */}
      <section className="container mx-auto px-6 mt-8">
        <GlassCard className="p-6">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <Compass className="h-4 w-4 text-primary" />
            Best Viewing Direction Tonight
          </h3>
          <div className="grid grid-cols-4 gap-2 max-w-md">
            {[
              { dir: "N", label: "North", quality: "Good", color: "oklch(0.72 0.18 245)" },
              { dir: "E", label: "East", quality: "Excellent", color: "oklch(0.78 0.20 320)" },
              { dir: "S", label: "South", quality: "Excellent", color: "oklch(0.82 0.18 60)" },
              { dir: "W", label: "West", quality: "Good (Venus)", color: "oklch(0.65 0.16 200)" },
            ].map((d) => (
              <div key={d.dir} className="text-center p-3 rounded-lg glass">
                <div className="text-2xl font-bold mb-1" style={{ color: d.color }}>{d.dir}</div>
                <div className="text-xs text-muted-foreground">{d.label}</div>
                <div className="text-[10px] mt-1 text-primary">{d.quality}</div>
              </div>
            ))}
          </div>
        </GlassCard>
      </section>
    </div>
  );
}

function SkyMap({ pointMode }: { pointMode: boolean }) {
  return (
    <GlassCard variant="strong" className="relative overflow-hidden">
      <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, oklch(0.10 0.04 270), oklch(0.05 0.02 270))" }}>
        <StarField count={150} />

        {/* Horizon line */}
        <div className="absolute left-0 right-0 bottom-12 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
        <div className="absolute left-0 right-0 bottom-12 h-16 bg-gradient-to-t from-emerald-500/5 to-transparent" />

        {/* Compass directions */}
        {["N", "NE", "E", "SE", "S", "SW", "W", "NW"].map((d, i) => {
          const angle = i * 45;
          return (
            <div
              key={d}
              className="absolute bottom-2 text-[10px] text-muted-foreground font-mono"
              style={{ left: `${10 + i * 11}%` }}
            >
              {d}
            </div>
          );
        })}

        {/* Constellation outlines */}
        <svg className="absolute inset-0 w-full h-3/4" style={{ opacity: 0.5 }}>
          {/* Orion */}
          <g stroke="oklch(0.72 0.18 245)" strokeWidth="1" fill="none">
            <line x1="30%" y1="20%" x2="35%" y2="30%" />
            <line x1="35%" y1="30%" x2="40%" y2="28%" />
            <line x1="40%" y1="28%" x2="45%" y2="35%" />
            <line x1="30%" y1="20%" x2="20%" y2="45%" />
            <line x1="45%" y1="35%" x2="55%" y2="55%" />
          </g>
          <g fill="oklch(0.95 0.02 250)">
            <circle cx="30%" cy="20%" r="2.5" />
            <circle cx="35%" cy="30%" r="3" />
            <circle cx="40%" cy="28%" r="2.5" />
            <circle cx="45%" cy="35%" r="3.5" />
            <circle cx="20%" cy="45%" r="2.5" />
            <circle cx="55%" cy="55%" r="2" />
          </g>
          {/* Big Dipper */}
          <g stroke="oklch(0.78 0.20 320)" strokeWidth="1" fill="none">
            <line x1="70%" y1="15%" x2="75%" y2="20%" />
            <line x1="75%" y1="20%" x2="80%" y2="22%" />
            <line x1="80%" y1="22%" x2="83%" y2="28%" />
            <line x1="83%" y1="28%" x2="78%" y2="32%" />
            <line x1="78%" y1="32%" x2="73%" y2="28%" />
            <line x1="73%" y1="28%" x2="70%" y2="15%" />
          </g>
          <g fill="oklch(0.95 0.02 250)">
            <circle cx="70%" cy="15%" r="2" />
            <circle cx="75%" cy="20%" r="2.5" />
            <circle cx="80%" cy="22%" r="2" />
            <circle cx="83%" cy="28%" r="2.5" />
            <circle cx="78%" cy="32%" r="2" />
            <circle cx="73%" cy="28%" r="2" />
          </g>
        </svg>

        {/* Venus marker */}
        <div className="absolute" style={{ left: "85%", top: "60%" }}>
          <div className="h-3 w-3 rounded-full bg-yellow-200"
            style={{ boxShadow: "0 0 12px oklch(0.95 0.10 70 / 0.8)" }}
          />
          <div className="absolute top-4 left-1/2 -translate-x-1/2 whitespace-nowrap text-[10px] font-medium px-1.5 py-0.5 rounded glass-strong">Venus</div>
        </div>

        {/* Jupiter marker */}
        <div className="absolute" style={{ left: "55%", top: "30%" }}>
          <div className="h-3.5 w-3.5 rounded-full" style={{ background: "oklch(0.80 0.16 50)", boxShadow: "0 0 12px oklch(0.80 0.16 50 / 0.8)" }} />
          <div className="absolute top-4 left-1/2 -translate-x-1/2 whitespace-nowrap text-[10px] font-medium px-1.5 py-0.5 rounded glass-strong">Jupiter</div>
        </div>

        {/* Mars marker */}
        <div className="absolute" style={{ left: "20%", top: "45%" }}>
          <div className="h-2.5 w-2.5 rounded-full" style={{ background: "oklch(0.70 0.18 30)", boxShadow: "0 0 10px oklch(0.70 0.18 30 / 0.8)" }} />
          <div className="absolute top-3 left-1/2 -translate-x-1/2 whitespace-nowrap text-[10px] font-medium px-1.5 py-0.5 rounded glass-strong">Mars</div>
        </div>
      </div>

      {/* Point mode overlay */}
      {pointMode && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="relative">
            <div className="absolute -inset-8 rounded-full border-2 border-primary animate-pulse-glow" />
            <div className="absolute -inset-4 rounded-full border border-primary/40" />
            <div className="h-1 w-12 bg-primary absolute top-1/2 -translate-y-1/2 left-1/2 translate-x-2" />
            <div className="h-1 w-12 bg-primary absolute top-1/2 -translate-y-1/2 right-1/2 -translate-x-2" />
            <div className="w-1 h-12 bg-primary absolute left-1/2 -translate-x-1/2 top-1/2 translate-y-2" />
            <div className="w-1 h-12 bg-primary absolute left-1/2 -translate-x-1/2 bottom-1/2 -translate-y-2" />
            <div className="h-3 w-3 rounded-full bg-primary" />
          </div>
        </div>
      )}

      {/* Header */}
      <div className="absolute top-4 left-4 right-4 flex items-start justify-between">
        <div className="px-3 py-1.5 rounded-lg glass-strong text-xs">
          <div className="text-muted-foreground text-[10px] uppercase tracking-wider">Live Sky Map</div>
          <div className="font-medium">{new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} · 40.71°N 74.00°W</div>
        </div>
        {pointMode && (
          <div className="px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-medium animate-pulse">
            ● Sky Mode Active
          </div>
        )}
      </div>
      <div className="h-80 md:h-[28rem] w-full" />
    </GlassCard>
  );
}
