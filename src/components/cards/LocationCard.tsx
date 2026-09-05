"use client";

import { motion } from "framer-motion";
import { MapPin, Star, Moon, Eye, ArrowUpRight } from "lucide-react";
import type { Location } from "@/lib/types";
import { CATEGORY_META } from "@/components/common/CategoryMeta";
import { useAppStore } from "@/store/app-store";
import { cn } from "@/lib/utils";

interface LocationCardProps {
  location: Location;
  index?: number;
  variant?: "default" | "compact" | "wide";
}

export function LocationCard({ location, index = 0, variant = "default" }: LocationCardProps) {
  const navigate = useAppStore((s) => s.navigate);
  const meta = CATEGORY_META[location.category];

  const handleClick = () => {
    navigate("location-detail", { locationId: location.id });
  };

  if (variant === "compact") {
    return (
      <motion.button
        onClick={handleClick}
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.4, delay: Math.min(index * 0.05, 0.3) }}
        className="group relative w-full text-left flex gap-3 p-3 rounded-xl glass-card hover:glow-primary transition-all duration-300"
        whileHover={{ y: -2 }}
      >
        <div
          className="h-16 w-16 shrink-0 rounded-lg overflow-hidden relative"
          style={{ background: location.imageGradient }}
        >
          <div className="absolute inset-0 bg-black/20" />
          <span className="absolute inset-0 flex items-center justify-center text-2xl">
            {meta.emoji}
          </span>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-1">
            <h4 className="font-semibold text-sm truncate">{location.name}</h4>
            <ArrowUpRight className="h-3.5 w-3.5 text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
          </div>
          <div className="flex items-center gap-1 text-[11px] text-muted-foreground mt-0.5">
            <MapPin className="h-3 w-3" />
            <span className="truncate">{location.city}, {location.country}</span>
          </div>
          <div className="flex items-center gap-2 mt-1.5">
            <div className="flex items-center gap-0.5">
              <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
              <span className="text-[11px] font-medium">{location.rating}</span>
            </div>
            <span className="text-[11px] text-muted-foreground">·</span>
            <span className="text-[11px] text-muted-foreground truncate">{meta.label}</span>
          </div>
        </div>
      </motion.button>
    );
  }

  return (
    <motion.button
      onClick={handleClick}
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.45, delay: Math.min(index * 0.05, 0.3) }}
      whileHover={{ y: -4 }}
      className={cn(
        "group relative w-full text-left rounded-2xl overflow-hidden glass-card hover:glow-primary transition-all duration-300",
        variant === "wide" ? "flex" : ""
      )}
    >
      <div
        className={cn(
          "relative overflow-hidden",
          variant === "wide" ? "w-1/2" : "h-44"
        )}
        style={{ background: location.imageGradient }}
      >
        {/* Real photo with overlay */}
        {location.image && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={location.image}
            alt={location.name}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            loading="lazy"
          />
        )}
        <div className="absolute inset-0 nebula-overlay opacity-50" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

        {/* Floating planet decoration */}
        <div className="absolute -top-6 -right-6 w-20 h-20 rounded-full opacity-70 animate-float"
          style={{
            background: `radial-gradient(circle at 30% 30%, ${meta.color}, transparent 70%)`,
          }}
        />

        {/* Category badge */}
        <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full glass-strong text-xs font-medium flex items-center gap-1.5">
          <span className="text-sm">{meta.emoji}</span>
          <span>{meta.label}</span>
        </div>

        {/* Dark sky rating badge */}
        <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full glass-strong text-xs font-medium flex items-center gap-1.5">
          <Moon className="h-3 w-3 text-purple-300" />
          <span>{location.darkSkyRating.toFixed(1)}/10</span>
        </div>

        {/* Trending badge */}
        {location.trending && (
          <div className="absolute bottom-3 left-3 px-2 py-0.5 rounded-full bg-amber-500/80 text-[10px] font-bold uppercase tracking-wider text-black">
            ★ Trending
          </div>
        )}

        <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="px-2.5 py-1 rounded-full glass-strong text-[10px] font-medium flex items-center gap-1">
            <Eye className="h-3 w-3" />
            <span>{location.visibilityScore}% vis</span>
          </div>
        </div>
      </div>

      <div className={cn("p-4 space-y-2", variant === "wide" ? "flex-1" : "")}>
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <h3 className="font-bold text-base leading-tight truncate group-hover:text-primary transition-colors">
              {location.name}
            </h3>
            <div className="flex items-center gap-1 text-xs text-muted-foreground mt-0.5">
              <MapPin className="h-3 w-3" />
              <span className="truncate">{location.city}, {location.country}</span>
            </div>
          </div>
          <div className="flex items-center gap-0.5 shrink-0">
            <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
            <span className="text-xs font-semibold">{location.rating}</span>
          </div>
        </div>

        <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
          {location.description}
        </p>

        <div className="flex items-center justify-between pt-1.5 border-t border-white/5">
          <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
            <span className="flex items-center gap-1">
              <span className="text-primary">●</span>
              {location.bestViewingTime}
            </span>
          </div>
          <div className="flex items-center gap-1 text-[11px] font-medium text-primary group-hover:gap-2 transition-all">
            <span>View Details</span>
            <ArrowUpRight className="h-3 w-3" />
          </div>
        </div>
      </div>
    </motion.button>
  );
}
