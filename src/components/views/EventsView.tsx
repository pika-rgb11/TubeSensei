"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, Clock, Globe2, MapPin, Bell, CalendarPlus, Filter, ArrowUpRight } from "lucide-react";
import { StarField } from "@/components/common/StarField";
import { GlassCard } from "@/components/common/GlassCard";
import { EventCard } from "@/components/cards/EventCard";
import { CountdownTimer } from "@/components/common/CountdownTimer";
import { EVENT_TYPE_META } from "@/components/common/CategoryMeta";
import { useAppStore } from "@/store/app-store";
import { events } from "@/lib/data/events";
import type { EventType } from "@/lib/types";
import { cn } from "@/lib/utils";

const EVENT_CATEGORIES: { id: EventType | "all"; label: string; emoji: string }[] = [
  { id: "all", label: "All Events", emoji: "✨" },
  { id: "solar-eclipse", label: "Solar Eclipse", emoji: "☀️" },
  { id: "lunar-eclipse", label: "Lunar Eclipse", emoji: "🌑" },
  { id: "meteor-shower", label: "Meteor Shower", emoji: "☄️" },
  { id: "conjunction", label: "Conjunction", emoji: "🪐" },
  { id: "rocket-launch", label: "Rocket Launch", emoji: "🚀" },
  { id: "iss-visibility", label: "ISS Pass", emoji: "🛰️" },
  { id: "aurora", label: "Aurora", emoji: "🌌" },
  { id: "astronomy-festival", label: "Festival", emoji: "🎪" },
];

export function EventsView() {
  const { navigate } = useAppStore();
  const [activeCategory, setActiveCategory] = useState<EventType | "all">("all");
  const [viewMode, setViewMode] = useState<"grid" | "timeline">("grid");

  const filtered = useMemo(() => {
    if (activeCategory === "all") return events;
    return events.filter((e) => e.type === activeCategory);
  }, [activeCategory]);

  const nextEvent = events[0];
  const sortedByDate = [...filtered].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  return (
    <div className="pt-16 pb-12">
      {/* Hero */}
      <section className="relative py-12 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <StarField count={80} withShootingStars />
        </div>
        <div className="container mx-auto px-6 relative">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="text-xs font-medium uppercase tracking-[0.18em] text-primary/80 mb-2 flex items-center gap-2">
              <Calendar className="h-3.5 w-3.5" />
              Cosmic Calendar
            </div>
            <h1 className="text-3xl md:text-5xl font-bold tracking-tight mb-3">
              Upcoming <span className="text-gradient-cosmic">Space Events</span>
            </h1>
            <p className="text-muted-foreground max-w-2xl">
              Eclipses, meteor showers, aurora windows, rocket launches, and more — with live countdowns, best viewing locations, and one-tap calendar export.
            </p>
          </motion.div>

          {/* Featured next event */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mt-8"
          >
            <GlassCard variant="strong" className="relative overflow-hidden">
              <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-0 right-0 w-72 h-72 rounded-full opacity-30 blur-3xl"
                  style={{ background: `radial-gradient(circle, oklch(0.50 0.18 ${280}), transparent 70%)` }}
                />
                <StarField count={30} />
              </div>
              <div className="relative grid lg:grid-cols-[1fr_auto] gap-6 p-6 md:p-8">
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="px-2.5 py-1 rounded-full glass text-xs font-medium flex items-center gap-1.5">
                      <span className="text-sm">{EVENT_TYPE_META[nextEvent.type].emoji}</span>
                      {EVENT_TYPE_META[nextEvent.type].label}
                    </div>
                    <div className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-medium flex items-center gap-1.5">
                      <div className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      Next Event
                    </div>
                  </div>
                  <h2 className="text-2xl md:text-3xl font-bold mb-2">{nextEvent.name}</h2>
                  <p className="text-muted-foreground max-w-xl mb-4 leading-relaxed">{nextEvent.description}</p>
                  <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1.5"><Calendar className="h-3.5 w-3.5 text-primary" />
                      {new Date(nextEvent.date).toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })}
                    </span>
                    <span className="flex items-center gap-1.5"><Clock className="h-3.5 w-3.5 text-accent" />{nextEvent.time}</span>
                    <span className="flex items-center gap-1.5"><Globe2 className="h-3.5 w-3.5 text-primary" />{nextEvent.visibilityRegion}</span>
                    <span className="flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5 text-accent" />{nextEvent.bestLocation}</span>
                  </div>
                </div>
                <div className="flex lg:flex-col items-center lg:justify-center gap-3 lg:border-l border-white/5 lg:pl-8">
                  <div className="text-xs uppercase tracking-wider text-muted-foreground">Starts In</div>
                  <CountdownTimer targetDate={nextEvent.date} />
                  <div className="flex gap-2">
                    <button
                      onClick={() => useAppStore.getState().attendEvent(nextEvent.id)}
                      className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-xs font-medium flex items-center gap-1.5 hover:glow-primary transition-all"
                    >
                      <Bell className="h-3 w-3" />
                      Remind Me
                    </button>
                  </div>
                </div>
              </div>
            </GlassCard>
          </motion.div>
        </div>
      </section>

      {/* Category tabs */}
      <section className="container mx-auto px-6">
        <div className="flex items-center justify-between mb-4">
          <div className="text-sm text-muted-foreground">
            <span className="font-semibold text-foreground">{filtered.length}</span> events
          </div>
          <div className="flex items-center gap-1 glass rounded-lg p-1">
            <button
              onClick={() => setViewMode("grid")}
              className={cn("px-3 py-1.5 rounded-md text-xs font-medium transition-colors",
                viewMode === "grid" ? "bg-primary text-primary-foreground" : "text-muted-foreground")}
            >
              Grid
            </button>
            <button
              onClick={() => setViewMode("timeline")}
              className={cn("px-3 py-1.5 rounded-md text-xs font-medium transition-colors",
                viewMode === "timeline" ? "bg-primary text-primary-foreground" : "text-muted-foreground")}
            >
              Timeline
            </button>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-6">
          {EVENT_CATEGORIES.map((c) => (
            <button
              key={c.id}
              onClick={() => setActiveCategory(c.id)}
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all",
                activeCategory === c.id ? "bg-primary text-primary-foreground glow-primary" : "glass hover:bg-white/5"
              )}
            >
              <span className="text-sm">{c.emoji}</span>
              {c.label}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {viewMode === "grid" ? (
            <motion.div
              key="grid"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
            >
              {sortedByDate.map((e, i) => (
                <EventCard key={e.id} event={e} index={i} variant="default" />
              ))}
            </motion.div>
          ) : (
            <motion.div
              key="timeline"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="relative pl-4"
            >
              <div className="absolute left-0 top-2 bottom-2 w-0.5 bg-gradient-to-b from-primary via-accent to-transparent" />
              <div className="space-y-4">
                {sortedByDate.map((e, i) => {
                  const meta = EVENT_TYPE_META[e.type];
                  const date = new Date(e.date);
                  return (
                    <motion.div
                      key={e.id}
                      initial={{ opacity: 0, x: -16 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: i * 0.04 }}
                      className="relative pl-6"
                    >
                      <div className="absolute left-[-7px] top-4 h-3.5 w-3.5 rounded-full bg-primary ring-2 ring-background" />
                      <GlassCard className="p-4 hover:glow-primary transition-all">
                        <div className="flex flex-wrap items-start justify-between gap-3">
                          <div className="min-w-0">
                            <div className="flex items-center gap-2 mb-1.5">
                              <span className="text-base">{meta.emoji}</span>
                              <span className="text-xs text-muted-foreground uppercase tracking-wider">{meta.label}</span>
                              <span className="text-xs text-muted-foreground">·</span>
                              <span className="text-xs text-muted-foreground">
                                {date.toLocaleDateString("en-US", { month: "short", day: "numeric" })} at {e.time}
                              </span>
                            </div>
                            <h3 className="font-semibold">{e.name}</h3>
                            <p className="text-sm text-muted-foreground mt-1 line-clamp-1">{e.description}</p>
                          </div>
                          <div className="flex items-center gap-2 shrink-0">
                            <div className="text-right text-xs">
                              <div className="text-muted-foreground">Visibility</div>
                              <div className="font-semibold text-primary">{e.visibilityPercent}%</div>
                            </div>
                            <button
                              onClick={() => useAppStore.getState().attendEvent(e.id)}
                              className="px-3 py-1.5 rounded-lg glass text-xs hover:bg-primary/20 transition-colors flex items-center gap-1"
                            >
                              <Bell className="h-3 w-3" />
                              Remind
                            </button>
                          </div>
                        </div>
                      </GlassCard>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* Bottom CTA */}
      <section className="container mx-auto px-6 mt-16">
        <GlassCard className="p-6 text-center">
          <p className="text-sm text-muted-foreground">
            Want real-time alerts for your location?
          </p>
          <button
            onClick={() => navigate("tonights-sky")}
            className="mt-3 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium inline-flex items-center gap-2"
          >
            Open Tonight's Sky <ArrowUpRight className="h-3.5 w-3.5" />
          </button>
        </GlassCard>
      </section>
    </div>
  );
}
