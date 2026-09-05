"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Compass, Bookmark, Calendar, Camera, Heart, Award, MapPin,
  Star, Sparkles, Share2, Settings, LogOut, Plus, Eye, Check,
} from "lucide-react";
import { StarField } from "@/components/common/StarField";
import { GlassCard } from "@/components/common/GlassCard";
import { SectionHeader } from "@/components/common/SectionHeader";
import { LocationCard } from "@/components/cards/LocationCard";
import { EventCard } from "@/components/cards/EventCard";
import { useAppStore } from "@/store/app-store";
import { getLocation } from "@/lib/data/locations";
import { events } from "@/lib/data/events";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

type Tab = "overview" | "visited" | "saved" | "wishlist" | "events" | "photos";

export function ProfileView() {
  const { user, navigate } = useAppStore();
  const [tab, setTab] = useState<Tab>("overview");

  if (!user) {
    return (
      <div className="pt-32 pb-12 container mx-auto px-6 text-center">
        <p>Please sign in.</p>
      </div>
    );
  }

  const tabs: { id: Tab; label: string; icon: typeof Compass; count: number }[] = [
    { id: "overview", label: "Overview", icon: Sparkles, count: 0 },
    { id: "visited", label: "Visited", icon: Compass, count: user.visited.length },
    { id: "saved", label: "Saved", icon: Bookmark, count: user.saved.length },
    { id: "wishlist", label: "Bucket List", icon: Heart, count: user.wishlist.length },
    { id: "events", label: "Events", icon: Calendar, count: user.attendedEvents.length },
    { id: "photos", label: "Photos", icon: Camera, count: user.photos.length },
  ];

  const visitedLocations = user.visited.map(getLocation).filter(Boolean);
  const savedLocations = user.saved.map(getLocation).filter(Boolean);
  const wishlistLocations = user.wishlist.map(getLocation).filter(Boolean);
  const attendedEvents = user.attendedEvents
    .map((id) => events.find((e) => e.id === id))
    .filter(Boolean);

  return (
    <div className="pt-16 pb-12">
      {/* Hero with user info */}
      <section className="relative py-8 overflow-hidden">
        <StarField count={60} />
        <div className="container mx-auto px-6 relative">
          <GlassCard variant="strong" className="relative overflow-hidden p-6 md:p-8">
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute -top-10 -right-10 w-72 h-72 rounded-full opacity-30 blur-3xl"
                style={{ background: "radial-gradient(circle, oklch(0.45 0.18 280), transparent 70%)" }}
              />
              <StarField count={40} />
            </div>
            <div className="relative flex flex-col md:flex-row items-start md:items-center gap-6">
              {/* Avatar with orbital ring */}
              <div className="relative h-24 w-24 shrink-0">
                <div className="absolute -inset-2 rounded-full border border-primary/20 animate-spin-slow" />
                <div className="absolute -inset-4 rounded-full border border-accent/15 animate-spin-slow" style={{ animationDirection: "reverse" }} />
                <div className="relative h-full w-full rounded-full flex items-center justify-center text-3xl font-bold"
                  style={{ background: user.avatarGradient }}
                >
                  {user.name.charAt(0)}
                </div>
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <h1 className="text-2xl md:text-3xl font-bold">{user.name}</h1>
                  <div className="px-2 py-0.5 rounded-full bg-primary/20 text-primary text-xs font-medium flex items-center gap-1">
                    <Award className="h-3 w-3" /> Cosmic Explorer
                  </div>
                </div>
                <div className="text-sm text-muted-foreground">{user.email}</div>
                <div className="text-xs text-muted-foreground mt-1">
                  Joined {user.joinedAt} · {user.reviewsCount} reviews · {user.photos.length} photos
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <button onClick={() => toast.success("Settings coming soon")} className="px-4 py-2 rounded-lg glass text-sm hover:bg-white/5 flex items-center gap-2 justify-center">
                  <Settings className="h-3.5 w-3.5" /> Settings
                </button>
                <button onClick={() => toast.success("Profile link copied")} className="px-4 py-2 rounded-lg glass text-sm hover:bg-white/5 flex items-center gap-2 justify-center">
                  <Share2 className="h-3.5 w-3.5" /> Share
                </button>
              </div>
            </div>

            {/* Journey progress bar */}
            <div className="relative mt-6 pt-6 border-t border-white/5">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-primary" />
                  <h2 className="font-semibold">Your Cosmic Journey</h2>
                </div>
                <div className="text-sm font-bold text-gradient-cosmic">{user.journeyProgress}% Complete</div>
              </div>
              <div className="h-3 rounded-full bg-white/5 overflow-hidden relative">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${user.journeyProgress}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  className="h-full rounded-full bg-gradient-to-r from-primary via-accent to-primary relative"
                >
                  <div className="absolute inset-0 rounded-full" style={{ boxShadow: "0 0 20px oklch(0.72 0.18 245)" }} />
                </motion.div>
              </div>
              <div className="text-xs text-muted-foreground mt-1.5">
                {100 - user.journeyProgress}% to unlock "Galactic Voyager" rank
              </div>
            </div>

            {/* Quick stats */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mt-6">
              {[
                { label: "Places Visited", value: user.visited.length, icon: Compass, color: "text-primary" },
                { label: "Saved", value: user.saved.length, icon: Bookmark, color: "text-accent" },
                { label: "Bucket List", value: user.wishlist.length, icon: Heart, color: "text-rose-300" },
                { label: "Events Attended", value: user.attendedEvents.length, icon: Calendar, color: "text-emerald-300" },
                { label: "Photos", value: user.photos.length, icon: Camera, color: "text-yellow-300" },
              ].map((s) => {
                const Icon = s.icon;
                return (
                  <div key={s.label} className="p-3 rounded-xl glass text-center">
                    <Icon className={cn("h-5 w-5 mx-auto mb-2", s.color)} />
                    <div className="text-2xl font-bold">{s.value}</div>
                    <div className="text-[10px] uppercase tracking-wider text-muted-foreground mt-0.5">{s.label}</div>
                  </div>
                );
              })}
            </div>
          </GlassCard>
        </div>
      </section>

      {/* Tabs */}
      <section className="container mx-auto px-6">
        <div className="flex flex-wrap gap-2 mb-6">
          {tabs.map((t) => {
            const Icon = t.icon;
            const active = tab === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all",
                  active ? "bg-primary text-primary-foreground glow-primary" : "glass hover:bg-white/5"
                )}
              >
                <Icon className="h-3.5 w-3.5" />
                {t.label}
                {t.count > 0 && (
                  <span className={cn("text-[10px] px-1.5 py-0.5 rounded-full", active ? "bg-white/20" : "bg-white/10")}>
                    {t.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Tab content */}
        <motion.div
          key={tab}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {tab === "overview" && (
            <div className="space-y-8">
              <div>
                <SectionHeader
                  eyebrow="Continue Exploring"
                  title="Bucket List"
                  subtitle="Cosmic destinations you're dreaming of visiting next."
                  icon={<Heart className="h-3.5 w-3.5" />}
                />
                {wishlistLocations.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {wishlistLocations.map((l, i) => (
                      <LocationCard key={l?.id} location={l!} index={i} />
                    ))}
                  </div>
                ) : (
                  <EmptyState icon={<Heart className="h-6 w-6" />} title="No bucket list yet" />
                )}
              </div>

              <div>
                <SectionHeader
                  eyebrow="Recent"
                  title="Photos Uploaded"
                  icon={<Camera className="h-3.5 w-3.5" />}
                />
                {user.photos.length > 0 && (
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                    {user.photos.map((p, i) => (
                      <motion.div
                        key={p.id}
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.3, delay: i * 0.05 }}
                        className="relative aspect-square rounded-xl overflow-hidden group cursor-pointer"
                        style={{ background: p.gradient }}
                        onClick={() => toast.info("Photo viewer coming soon")}
                      >
                        <div className="absolute inset-0 nebula-overlay" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                        <div className="absolute bottom-2 left-2 right-2 text-[10px]">
                          <div className="font-medium">{p.title}</div>
                          <div className="text-muted-foreground">{p.location} · {p.date}</div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <SectionHeader
                  eyebrow="Recent"
                  title="Events Attended"
                  icon={<Calendar className="h-3.5 w-3.5" />}
                />
                {attendedEvents.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {attendedEvents.map((e, i) => (
                      <EventCard key={e?.id} event={e!} index={i} variant="default" />
                    ))}
                  </div>
                ) : (
                  <EmptyState icon={<Calendar className="h-6 w-6" />} title="No events attended yet" />
                )}
              </div>
            </div>
          )}

          {tab === "visited" && (
            <div>
              {visitedLocations.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {visitedLocations.map((l, i) => (
                    <LocationCard key={l?.id} location={l!} index={i} />
                  ))}
                </div>
              ) : (
                <EmptyState icon={<Compass className="h-6 w-6" />} title="No visited places yet" subtitle="Mark a location as visited to start your journey." actionLabel="Browse destinations" onAction={() => navigate("explore")} />
              )}
            </div>
          )}

          {tab === "saved" && (
            <div>
              {savedLocations.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {savedLocations.map((l, i) => (
                    <LocationCard key={l?.id} location={l!} index={i} />
                  ))}
                </div>
              ) : (
                <EmptyState icon={<Bookmark className="h-6 w-6" />} title="No saved places yet" actionLabel="Find destinations" onAction={() => navigate("explore")} />
              )}
            </div>
          )}

          {tab === "wishlist" && (
            <div>
              {wishlistLocations.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {wishlistLocations.map((l, i) => (
                    <LocationCard key={l?.id} location={l!} index={i} />
                  ))}
                </div>
              ) : (
                <EmptyState icon={<Heart className="h-6 w-6" />} title="No bucket list yet" actionLabel="Build your list" onAction={() => navigate("explore")} />
              )}
            </div>
          )}

          {tab === "events" && (
            <div>
              {attendedEvents.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {attendedEvents.map((e, i) => (
                    <EventCard key={e?.id} event={e!} index={i} variant="default" />
                  ))}
                </div>
              ) : (
                <EmptyState icon={<Calendar className="h-6 w-6" />} title="No events attended yet" actionLabel="Browse events" onAction={() => navigate("events")} />
              )}
            </div>
          )}

          {tab === "photos" && (
            <div>
              {user.photos.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                  {user.photos.map((p, i) => (
                    <motion.div
                      key={p.id}
                      initial={{ opacity: 0, scale: 0.95 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.3, delay: i * 0.05 }}
                      className="relative aspect-square rounded-xl overflow-hidden group cursor-pointer"
                      style={{ background: p.gradient }}
                      onClick={() => toast.info("Photo viewer coming soon")}
                    >
                      <div className="absolute inset-0 nebula-overlay" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                      <div className="absolute bottom-2 left-2 right-2 text-[10px]">
                        <div className="font-medium">{p.title}</div>
                        <div className="text-muted-foreground">{p.location} · {p.date}</div>
                      </div>
                    </motion.div>
                  ))}
                  <button
                    onClick={() => toast.success("Photo upload coming soon")}
                    className="aspect-square rounded-xl glass border-2 border-dashed border-white/10 flex flex-col items-center justify-center hover:bg-white/5 transition-colors"
                  >
                    <Plus className="h-6 w-6 text-muted-foreground mb-1" />
                    <span className="text-xs text-muted-foreground">Upload</span>
                  </button>
                </div>
              ) : (
                <EmptyState icon={<Camera className="h-6 w-6" />} title="No photos yet" subtitle="Share your cosmic captures with the community." />
              )}
            </div>
          )}
        </motion.div>
      </section>
    </div>
  );
}

function EmptyState({
  icon, title, subtitle, actionLabel, onAction,
}: { icon: React.ReactNode; title: string; subtitle?: string; actionLabel?: string; onAction?: () => void }) {
  return (
    <GlassCard className="p-12 text-center">
      <div className="flex justify-center mb-3 text-muted-foreground">{icon}</div>
      <h3 className="font-semibold mb-1">{title}</h3>
      {subtitle && <p className="text-sm text-muted-foreground mb-4">{subtitle}</p>}
      {actionLabel && onAction && (
        <button onClick={onAction} className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium">
          {actionLabel}
        </button>
      )}
    </GlassCard>
  );
}
