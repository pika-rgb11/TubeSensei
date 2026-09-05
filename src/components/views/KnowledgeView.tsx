"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Star, Orbit, Rocket, Globe2, Atom, Sparkles,
  ArrowUpRight, X, BookOpen, Eye,
} from "lucide-react";
import { StarField } from "@/components/common/StarField";
import { GlassCard } from "@/components/common/GlassCard";
import { PlanetVisual } from "@/components/common/PlanetVisual";
import { PlanetCard } from "@/components/cards/PlanetCard";
import { useAppStore } from "@/store/app-store";
import { planets, cosmicObjects } from "@/lib/data/cosmos";
import type { Planet as PlanetType, CosmicObject, Category } from "@/lib/types";
import { CATEGORY_META } from "@/components/common/CategoryMeta";
import { cn } from "@/lib/utils";

type Tab = "solar-system" | "galaxies" | "nebulae" | "black-holes" | "exoplanets" | "stars" | "constellations" | "telescopes" | "missions" | "astronauts";

const TABS: { id: Tab; label: string; icon: typeof Star }[] = [
  { id: "solar-system", label: "Solar System", icon: Globe2 },
  { id: "galaxies", label: "Galaxies", icon: Globe2 },
  { id: "nebulae", label: "Nebulae", icon: Sparkles },
  { id: "black-holes", label: "Black Holes", icon: Atom },
  { id: "exoplanets", label: "Exoplanets", icon: Orbit },
  { id: "stars", label: "Stars", icon: Star },
  { id: "constellations", label: "Constellations", icon: Star },
  { id: "telescopes", label: "Telescopes", icon: Eye },
  { id: "missions", label: "Missions", icon: Rocket },
  { id: "astronauts", label: "Astronauts", icon: Star },
];

export function KnowledgeView() {
  const [activeTab, setActiveTab] = useState<Tab>("solar-system");
  const [selectedPlanet, setSelectedPlanet] = useState<PlanetType | null>(null);
  const [selectedObject, setSelectedObject] = useState<CosmicObject | null>(null);
  const navigate = useAppStore((s) => s.navigate);

  const filteredObjects = cosmicObjects.filter((o) => {
    const map: Record<Tab, CosmicObject["category"]> = {
      "galaxies": "galaxy",
      "nebulae": "nebula",
      "black-holes": "black-hole",
      "exoplanets": "exoplanet",
      "stars": "star",
      "constellations": "constellation",
      "telescopes": "telescope",
      "missions": "mission",
      "astronauts": "astronaut",
      "solar-system": "planet",
    };
    return o.category === map[activeTab];
  });

  return (
    <div className="pt-16 pb-12">
      {/* Hero */}
      <section className="relative py-12 overflow-hidden">
        <StarField count={80} withShootingStars />
        <div className="container mx-auto px-6 relative">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="text-xs font-medium uppercase tracking-[0.18em] text-primary/80 mb-2 flex items-center gap-2">
              <BookOpen className="h-3.5 w-3.5" />
              Educational Atlas
            </div>
            <h1 className="text-3xl md:text-5xl font-bold tracking-tight mb-3">
              Explore the <span className="text-gradient-cosmic">Universe</span>
            </h1>
            <p className="text-muted-foreground max-w-2xl">
              From the planets of our solar system to the most distant galaxies ever observed. Visualize, learn, and discover the cosmos in depth.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Tabs */}
      <section className="container mx-auto px-6">
        <div className="flex flex-wrap gap-2 mb-6 hide-scrollbar overflow-x-auto pb-1">
          {TABS.map((t) => {
            const Icon = t.icon;
            const active = activeTab === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id)}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all whitespace-nowrap",
                  active ? "bg-primary text-primary-foreground glow-primary" : "glass hover:bg-white/5"
                )}
              >
                <Icon className="h-3.5 w-3.5" />
                {t.label}
              </button>
            );
          })}
        </div>
      </section>

      {/* Solar System special layout */}
      {activeTab === "solar-system" && !selectedPlanet && (
        <section className="container mx-auto px-6">
          {/* Orbital diagram */}
          <GlassCard variant="strong" className="relative overflow-hidden p-6 mb-8">
            <div className="absolute inset-0 pointer-events-none">
              <StarField count={80} />
            </div>
            <div className="relative">
              <div className="text-xs font-medium uppercase tracking-[0.18em] text-primary/80 mb-2">
                Interactive Solar System
              </div>
              <h2 className="text-xl font-bold mb-4">The Solar System at a Glance</h2>
              <SolarSystemDiagram onSelect={(p) => setSelectedPlanet(p)} />
            </div>
          </GlassCard>

          {/* Planet cards */}
          <h3 className="text-lg font-semibold mb-4">Planets</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {planets.slice(1).map((p, i) => (
              <div key={p.id} onClick={() => setSelectedPlanet(p)}>
                <PlanetCard planet={p} index={i} />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Other tabs */}
      {activeTab !== "solar-system" && !selectedObject && (
        <section className="container mx-auto px-6">
          {filteredObjects.length === 0 ? (
            <GlassCard className="p-12 text-center">
              <div className="text-4xl mb-3">🛸</div>
              <h3 className="font-semibold mb-1">No objects yet</h3>
              <p className="text-sm text-muted-foreground">
                This section is being expanded. Check back soon for more cosmic wonders.
              </p>
            </GlassCard>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredObjects.map((o, i) => (
                <CosmicObjectCard key={o.id} object={o} index={i} onClick={() => setSelectedObject(o)} />
              ))}
            </div>
          )}
        </section>
      )}

      {/* Planet detail modal */}
      <AnimatePresence>
        {selectedPlanet && (
          <PlanetDetailModal planet={selectedPlanet} onClose={() => setSelectedPlanet(null)} />
        )}
        {selectedObject && (
          <CosmicObjectModal object={selectedObject} onClose={() => setSelectedObject(null)} />
        )}
      </AnimatePresence>
    </div>
  );
}

function SolarSystemDiagram({ onSelect }: { onSelect: (p: PlanetType) => void }) {
  // Mini interactive solar system
  return (
    <div className="relative h-64 md:h-80 overflow-x-auto hide-scrollbar">
      <div className="relative min-w-[600px] h-full">
        {/* Sun (using PlanetVisual) */}
        <button
          onClick={() => onSelect(planets[0])}
          className="absolute top-1/2 left-2 -translate-y-1/2 z-10 group"
        >
          <PlanetVisual texture={planets[0].texture} size={48} showStars={false} />
          <div className="absolute top-full left-1/2 -translate-x-1/2 mt-1 text-[10px] font-medium group-hover:text-primary transition-colors whitespace-nowrap">
            Sun
          </div>
        </button>

        {/* Orbits */}
        {planets.slice(1).map((p, i) => {
          const orbitRadius = 60 + i * 35;
          return (
            <div
              key={p.id}
              className="absolute top-1/2 left-1/2 -translate-y-1/2 rounded-full border border-white/5"
              style={{
                width: `${orbitRadius * 2}px`,
                height: `${orbitRadius * 2}px`,
                marginLeft: `-${orbitRadius}px`,
                marginTop: `-${orbitRadius}px`,
              }}
            />
          );
        })}

        {/* Planets */}
        {planets.slice(1).map((p, i) => {
          const orbitRadius = 60 + i * 35;
          const angle = (i * 47) % 360;
          const x = Math.cos((angle * Math.PI) / 180) * orbitRadius;
          const y = Math.sin((angle * Math.PI) / 180) * orbitRadius;
          return (
            <button
              key={p.id}
              onClick={() => onSelect(p)}
              className="absolute top-1/2 left-2 group z-5"
              style={{
                transform: `translate(${x}px, ${y - 5}px)`,
              }}
            >
              <div className="transition-transform group-hover:scale-150">
                <PlanetVisual texture={p.texture} size={16} showStars={false} />
              </div>
              <div className="absolute top-full left-1/2 -translate-x-1/2 mt-1 text-[9px] font-medium opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                {p.name}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function CosmicObjectCard({ object, index, onClick }: { object: CosmicObject; index: number; onClick: () => void }) {
  return (
    <motion.button
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.4, delay: Math.min(index * 0.06, 0.4) }}
      whileHover={{ y: -4 }}
      onClick={onClick}
      className="group text-left rounded-2xl overflow-hidden glass-card hover:glow-primary transition-all"
    >
      <div className="relative h-44 overflow-hidden" style={{ background: object.gradient }}>
        <div className="absolute inset-0 nebula-overlay" />
        <StarField count={25} />
        <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full glass-strong text-xs font-medium uppercase tracking-wider">
          {object.category}
        </div>
      </div>
      <div className="p-5">
        <h3 className="font-bold text-lg group-hover:text-primary transition-colors">{object.name}</h3>
        <p className="text-sm text-muted-foreground mt-1 line-clamp-2 leading-relaxed">{object.description}</p>
        <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/5">
          <span className="text-xs text-muted-foreground">{object.scientificData.length} data points</span>
          <span className="text-xs text-primary flex items-center gap-1 group-hover:gap-1.5 transition-all">
            Explore <ArrowUpRight className="h-3 w-3" />
          </span>
        </div>
      </div>
    </motion.button>
  );
}

function PlanetDetailModal({ planet, onClose }: { planet: PlanetType; onClose: () => void }) {
  const navigate = useAppStore((s) => s.navigate);
  return (
    <Modal onClose={onClose}>
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          {/* Big planet visualization */}
          <div
            className="relative aspect-square rounded-2xl overflow-hidden flex items-center justify-center"
            style={{
              background:
                "radial-gradient(ellipse 70% 50% at 50% 50%, oklch(0.13 0.04 270) 0%, oklch(0.07 0.02 270) 70%, oklch(0.04 0.01 270) 100%)",
            }}
          >
            <StarField count={80} />
            {/* Nebula glow behind the planet */}
            <div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full opacity-25 blur-3xl pointer-events-none"
              style={{ background: `radial-gradient(circle, ${planet.texture.baseColor}, transparent 70%)` }}
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative">
                <div className="absolute -inset-8 rounded-full border border-white/5 animate-spin-slow" />
                <div
                  className="absolute -inset-16 rounded-full border border-white/5 animate-spin-slow"
                  style={{ animationDirection: "reverse", animationDuration: "90s" }}
                />
                <motion.div
                  initial={{ scale: 0.7, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.6 }}
                >
                  <PlanetVisual texture={planet.texture} size={280} />
                </motion.div>
              </div>
            </div>
          </div>
        </div>
        <div>
          <div className="text-xs font-medium uppercase tracking-[0.18em] text-primary mb-1">{planet.type}</div>
          <h2 className="text-3xl font-bold mb-3">{planet.name}</h2>
          <p className="text-sm text-muted-foreground leading-relaxed mb-4">{planet.description}</p>

          <div className="grid grid-cols-2 gap-2 mb-4">
            {planet.scientificData.map((d) => (
              <div key={d.label} className="p-2 rounded-lg glass">
                <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{d.label}</div>
                <div className="text-sm font-semibold mt-0.5">{d.value}</div>
              </div>
            ))}
          </div>

          <div className="mb-4">
            <div className="text-xs uppercase tracking-wider text-muted-foreground mb-2">Interesting Facts</div>
            <ul className="space-y-1.5">
              {planet.interestingFacts.map((f, i) => (
                <li key={i} className="flex items-start gap-2 text-sm">
                  <Star className="h-3 w-3 text-yellow-400 fill-yellow-400 mt-1 shrink-0" />
                  <span>{f}</span>
                </li>
              ))}
            </ul>
          </div>

          {planet.relatedDestinations.length > 0 && (
            <div className="mt-4 pt-4 border-t border-white/5">
              <div className="text-xs uppercase tracking-wider text-muted-foreground mb-2">Related Destinations</div>
              <button
                onClick={() => { onClose(); navigate("explore"); }}
                className="text-sm text-primary flex items-center gap-1 hover:gap-1.5 transition-all"
              >
                View related locations <ArrowUpRight className="h-3.5 w-3.5" />
              </button>
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
}

function CosmicObjectModal({ object, onClose }: { object: CosmicObject; onClose: () => void }) {
  return (
    <Modal onClose={onClose}>
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <div className="relative aspect-square rounded-2xl overflow-hidden" style={{ background: object.gradient }}>
            <div className="absolute inset-0 nebula-overlay" />
            <StarField count={60} />
          </div>
        </div>
        <div>
          <div className="text-xs font-medium uppercase tracking-[0.18em] text-primary mb-1">{object.category}</div>
          <h2 className="text-3xl font-bold mb-3">{object.name}</h2>
          <p className="text-sm text-muted-foreground leading-relaxed mb-4">{object.description}</p>

          <div className="grid grid-cols-2 gap-2 mb-4">
            {object.scientificData.map((d) => (
              <div key={d.label} className="p-2 rounded-lg glass">
                <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{d.label}</div>
                <div className="text-sm font-semibold mt-0.5">{d.value}</div>
              </div>
            ))}
          </div>

          <div>
            <div className="text-xs uppercase tracking-wider text-muted-foreground mb-2">Interesting Facts</div>
            <ul className="space-y-1.5">
              {object.interestingFacts.map((f, i) => (
                <li key={i} className="flex items-start gap-2 text-sm">
                  <Star className="h-3 w-3 text-yellow-400 fill-yellow-400 mt-1 shrink-0" />
                  <span>{f}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </Modal>
  );
}

function Modal({ children, onClose }: { children: React.ReactNode; onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[80] flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/70 backdrop-blur-md" />
      <motion.div
        initial={{ scale: 0.95, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.95, y: 20 }}
        transition={{ type: "spring", damping: 24 }}
        className="relative glass-strong rounded-2xl p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto custom-scroll"
        onClick={(e) => e.stopPropagation()}
      >
        <button onClick={onClose} className="absolute top-3 right-3 p-1.5 rounded-lg hover:bg-white/10 z-10">
          <X className="h-4 w-4" />
        </button>
        {children}
      </motion.div>
    </motion.div>
  );
}
