"use client";

import { motion } from "framer-motion";
import type { Planet } from "@/lib/types";
import { useAppStore } from "@/store/app-store";
import { PlanetVisual } from "@/components/common/PlanetVisual";

interface PlanetCardProps {
  planet: Planet;
  index?: number;
  detailed?: boolean;
}

export function PlanetCard({ planet, index = 0, detailed = false }: PlanetCardProps) {
  const navigate = useAppStore((s) => s.navigate);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 12 }}
      whileInView={{ opacity: 1, scale: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: Math.min(index * 0.08, 0.5) }}
      whileHover={{ y: -4 }}
      onClick={() => navigate("knowledge")}
      className="group relative rounded-2xl overflow-hidden glass-card cursor-pointer hover:glow-primary transition-all duration-300"
    >
      {/* Planet visualization */}
      <div
        className="relative h-56 flex items-center justify-center overflow-hidden"
        style={{
          background:
            "radial-gradient(ellipse 70% 50% at 50% 50%, oklch(0.13 0.04 270) 0%, oklch(0.07 0.02 270) 70%, oklch(0.04 0.01 270) 100%)",
        }}
      >
        {/* Subtle nebula glow behind planet */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 rounded-full opacity-30 blur-3xl pointer-events-none"
          style={{ background: `radial-gradient(circle, ${planet.texture.baseColor}, transparent 70%)` }}
        />

        {/* The realistic planet */}
        <div className="relative animate-float">
          <PlanetVisual texture={planet.texture} size={160} />
        </div>

        {/* Orbital ring decoration */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div
            className="rounded-full border border-white/[0.04] animate-spin-slow"
            style={{ width: 220, height: 220 }}
          />
        </div>

        {/* Hover overlay hint */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
          <div className="px-2.5 py-1 rounded-full glass-strong text-[10px] text-muted-foreground">
            Click to explore →
          </div>
        </div>
      </div>

      <div className="p-4 space-y-2">
        <div>
          <h3 className="font-bold text-base group-hover:text-primary transition-colors">
            {planet.name}
          </h3>
          <p className="text-xs text-muted-foreground">{planet.type}</p>
        </div>

        {detailed ? (
          <div className="grid grid-cols-2 gap-2 text-xs pt-1">
            {planet.scientificData.slice(0, 4).map((d) => (
              <div key={d.label} className="text-[11px]">
                <div className="text-muted-foreground uppercase tracking-wider text-[9px]">{d.label}</div>
                <div className="font-medium truncate">{d.value}</div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
            {planet.description}
          </p>
        )}
      </div>
    </motion.div>
  );
}
