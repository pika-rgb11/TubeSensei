"use client";

import { motion } from "framer-motion";
import type { Planet } from "@/lib/types";
import { useAppStore } from "@/store/app-store";

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
        className="relative h-48 flex items-center justify-center overflow-hidden"
        style={{ background: "linear-gradient(135deg, oklch(0.13 0.03 270) 0%, oklch(0.08 0.02 270) 100%)" }}
      >
        <StarFieldMini />
        <div
          className="h-24 w-24 rounded-full relative animate-float"
          style={{
            background: planet.gradient,
            boxShadow: `0 0 40px ${planet.color}, inset -10px -10px 30px rgba(0,0,0,0.4)`,
          }}
        >
          <div className="absolute inset-0 rounded-full opacity-30"
            style={{
              background: "radial-gradient(circle at 30% 30%, rgba(255,255,255,0.4), transparent 50%)",
            }}
          />
        </div>

        {/* Orbital ring */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-40 h-40 rounded-full border border-white/5 animate-spin-slow" />
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

function StarFieldMini() {
  return (
    <div className="absolute inset-0 pointer-events-none">
      {Array.from({ length: 25 }).map((_, i) => {
        const top = Math.random() * 100;
        const left = Math.random() * 100;
        const size = Math.random() * 1.5 + 0.3;
        return (
          <div
            key={i}
            className="absolute rounded-full bg-white animate-twinkle"
            style={{
              top: `${top}%`,
              left: `${left}%`,
              width: `${size}px`,
              height: `${size}px`,
              opacity: 0.5,
              animationDelay: `${Math.random() * 5}s`,
            }}
          />
        );
      })}
    </div>
  );
}
