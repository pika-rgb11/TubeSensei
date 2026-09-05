"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Users, MapPin, Calendar, MessageSquare, BookOpen, Image,
  TrendingUp, TrendingDown, ChevronLeft, MoreVertical, Plus,
  Search, Filter, Download,
} from "lucide-react";
import { StarField } from "@/components/common/StarField";
import { GlassCard } from "@/components/common/GlassCard";
import { useAppStore } from "@/store/app-store";
import { locations } from "@/lib/data/locations";
import { events } from "@/lib/data/events";
import { reviewsByLocation } from "@/lib/data/users";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

type Tab = "overview" | "locations" | "events" | "users" | "reviews" | "articles" | "photos" | "categories";

export function AdminView() {
  const navigate = useAppStore((s) => s.navigate);
  const [tab, setTab] = useState<Tab>("overview");

  const tabs: { id: Tab; label: string; icon: typeof Users }[] = [
    { id: "overview", label: "Overview", icon: TrendingUp },
    { id: "locations", label: "Locations", icon: MapPin },
    { id: "events", label: "Events", icon: Calendar },
    { id: "users", label: "Users", icon: Users },
    { id: "reviews", label: "Reviews", icon: MessageSquare },
    { id: "articles", label: "Articles", icon: BookOpen },
    { id: "photos", label: "Photos", icon: Image },
    { id: "categories", label: "Categories", icon: Filter },
  ];

  const totalReviews = Object.values(reviewsByLocation).flat().length;

  return (
    <div className="pt-16 pb-12">
      {/* Header */}
      <section className="container mx-auto px-6 py-6">
        <button onClick={() => navigate("home")} className="flex items-center gap-1.5 text-sm mb-3 text-muted-foreground hover:text-foreground">
          <ChevronLeft className="h-4 w-4" /> Back to site
        </button>
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <div className="text-xs font-medium uppercase tracking-[0.18em] text-primary/80 mb-1">
              Operations
            </div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
              Admin <span className="text-gradient-cosmic">Dashboard</span>
            </h1>
            <p className="text-sm text-muted-foreground mt-1">Manage your cosmic platform</p>
          </div>
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-1.5 px-3 py-2 rounded-lg glass text-sm hover:bg-white/5">
              <Download className="h-3.5 w-3.5" /> Export
            </button>
            <button className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-primary text-primary-foreground text-sm">
              <Plus className="h-3.5 w-3.5" /> Add New
            </button>
          </div>
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
              </button>
            );
          })}
        </div>
      </section>

      {/* Content */}
      <section className="container mx-auto px-6">
        {tab === "overview" && <OverviewPanel />}
        {tab === "locations" && <LocationsPanel />}
        {tab === "events" && <EventsPanel />}
        {tab === "users" && <UsersPanel />}
        {tab === "reviews" && <ReviewsPanel />}
        {tab === "articles" && <SimplePanel title="Articles" message="Manage news articles and guides." />}
        {tab === "photos" && <SimplePanel title="Photos" message="Moderate community-uploaded astrophotography." />}
        {tab === "categories" && <SimplePanel title="Categories" message="Manage location and event categories." />}
      </section>
    </div>
  );
}

function OverviewPanel() {
  const totalReviews = Object.values(reviewsByLocation).flat().length;
  const stats = [
    { label: "Total Users", value: "85,432", delta: "+8.4%", trend: "up", icon: Users, color: "text-primary" },
    { label: "Active Locations", value: locations.length.toString(), delta: "+3 this week", trend: "up", icon: MapPin, color: "text-accent" },
    { label: "Upcoming Events", value: events.length.toString(), delta: "Next 90 days", trend: "neutral", icon: Calendar, color: "text-amber-300" },
    { label: "Reviews", value: totalReviews.toString(), delta: "+47 this week", trend: "up", icon: MessageSquare, color: "text-emerald-300" },
    { label: "Bookings", value: "1,247", delta: "+12.3%", trend: "up", icon: TrendingUp, color: "text-primary" },
    { label: "Photo Uploads", value: "892", delta: "-3.1%", trend: "down", icon: Image, color: "text-rose-300" },
  ];

  const popular = [...locations].sort((a, b) => b.reviewsCount - a.reviewsCount).slice(0, 5);
  const topSearches = ["Atacama Desert", "Mauna Kea", "Northern Lights", "Solar Eclipse", "Meteor shower"];

  return (
    <div className="space-y-6">
      {/* Stats grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {stats.map((s, i) => {
          const Icon = s.icon;
          return (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: i * 0.04 }}
            >
              <GlassCard className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <Icon className={cn("h-4 w-4", s.color)} />
                  {s.trend !== "neutral" && (
                    <span className={cn("text-[10px] font-medium flex items-center gap-0.5",
                      s.trend === "up" ? "text-emerald-400" : "text-rose-400")}>
                      {s.trend === "up" ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                      {s.delta}
                    </span>
                  )}
                </div>
                <div className="text-2xl font-bold">{s.value}</div>
                <div className="text-[10px] uppercase tracking-wider text-muted-foreground mt-1">{s.label}</div>
              </GlassCard>
            </motion.div>
          );
        })}
      </div>

      {/* Charts row */}
      <div className="grid lg:grid-cols-2 gap-4">
        <GlassCard className="p-5">
          <h3 className="font-semibold mb-4">User Growth (Last 6 Months)</h3>
          <BarChartMock />
        </GlassCard>

        <GlassCard className="p-5">
          <h3 className="font-semibold mb-4">Most Searched Locations</h3>
          <div className="space-y-2">
            {popular.map((l, i) => (
              <div key={l.id} className="flex items-center gap-3">
                <div className="text-xs text-muted-foreground w-4">{i + 1}.</div>
                <div className="h-7 w-7 rounded-lg shrink-0" style={{ background: l.imageGradient }} />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium truncate">{l.name}</div>
                  <div className="text-xs text-muted-foreground">{l.city}, {l.country}</div>
                </div>
                <div className="text-xs font-semibold text-primary">{(l.reviewsCount / 10).toFixed(0)}k</div>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>

      {/* Engagement by category */}
      <GlassCard className="p-5">
        <h3 className="font-semibold mb-4">Event Engagement by Type</h3>
        <div className="grid md:grid-cols-2 gap-3">
          {[
            { name: "Meteor Showers", count: "12.4k", pct: 92, color: "oklch(0.78 0.18 280)" },
            { name: "Solar Eclipses", count: "8.7k", pct: 81, color: "oklch(0.85 0.20 60)" },
            { name: "Aurora Alerts", count: "6.2k", pct: 67, color: "oklch(0.72 0.16 150)" },
            { name: "Rocket Launches", count: "5.8k", pct: 62, color: "oklch(0.78 0.18 30)" },
            { name: "Lunar Eclipses", count: "3.4k", pct: 41, color: "oklch(0.40 0.06 280)" },
            { name: "Conjunctions", count: "2.1k", pct: 28, color: "oklch(0.70 0.18 250)" },
          ].map((e) => (
            <div key={e.name}>
              <div className="flex items-center justify-between text-sm mb-1">
                <span>{e.name}</span>
                <span className="text-muted-foreground">{e.count}</span>
              </div>
              <div className="h-2 rounded-full bg-white/5 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${e.pct}%` }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  className="h-full rounded-full"
                  style={{ background: e.color }}
                />
              </div>
            </div>
          ))}
        </div>
      </GlassCard>

      {/* Top searches */}
      <GlassCard className="p-5">
        <h3 className="font-semibold mb-3">Top Searches This Week</h3>
        <div className="flex flex-wrap gap-2">
          {topSearches.map((s, i) => (
            <div key={s} className="px-3 py-1.5 rounded-lg glass text-sm flex items-center gap-2">
              <span className="text-muted-foreground text-xs">#{i + 1}</span>
              {s}
            </div>
          ))}
        </div>
      </GlassCard>
    </div>
  );
}

function LocationsPanel() {
  return (
    <GlassCard className="overflow-hidden">
      <div className="p-4 border-b border-white/5 flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-2">
          <Search className="h-4 w-4 text-muted-foreground" />
          <input placeholder="Search locations..." className="bg-transparent border-0 outline-none text-sm w-48" />
        </div>
        <button className="text-xs px-3 py-1.5 rounded-lg bg-primary text-primary-foreground flex items-center gap-1.5">
          <Plus className="h-3 w-3" /> Add Location
        </button>
      </div>
      <div className="overflow-x-auto custom-scroll">
        <table className="w-full text-sm">
          <thead className="text-xs uppercase tracking-wider text-muted-foreground">
            <tr className="border-b border-white/5">
              <th className="text-left p-3">Name</th>
              <th className="text-left p-3 hidden md:table-cell">Category</th>
              <th className="text-left p-3 hidden md:table-cell">Country</th>
              <th className="text-left p-3">Rating</th>
              <th className="text-left p-3 hidden sm:table-cell">Reviews</th>
              <th className="text-left p-3 hidden lg:table-cell">Dark Sky</th>
              <th className="p-3"></th>
            </tr>
          </thead>
          <tbody>
            {locations.map((l) => (
              <tr key={l.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                <td className="p-3">
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-lg shrink-0" style={{ background: l.imageGradient }} />
                    <div>
                      <div className="font-medium">{l.name}</div>
                      <div className="text-xs text-muted-foreground">{l.city}</div>
                    </div>
                  </div>
                </td>
                <td className="p-3 hidden md:table-cell text-muted-foreground">{l.category}</td>
                <td className="p-3 hidden md:table-cell">{l.country}</td>
                <td className="p-3">★ {l.rating}</td>
                <td className="p-3 hidden sm:table-cell text-muted-foreground">{l.reviewsCount}</td>
                <td className="p-3 hidden lg:table-cell">{l.darkSkyRating.toFixed(1)}/10</td>
                <td className="p-3">
                  <button onClick={() => toast.info("Edit modal coming soon")} className="p-1.5 rounded hover:bg-white/10">
                    <MoreVertical className="h-3.5 w-3.5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </GlassCard>
  );
}

function EventsPanel() {
  return (
    <GlassCard className="overflow-hidden">
      <div className="p-4 border-b border-white/5 flex items-center justify-between">
        <h3 className="font-semibold">All Events ({events.length})</h3>
        <button className="text-xs px-3 py-1.5 rounded-lg bg-primary text-primary-foreground flex items-center gap-1.5">
          <Plus className="h-3 w-3" /> Add Event
        </button>
      </div>
      <div className="divide-y divide-white/5">
        {events.map((e) => (
          <div key={e.id} className="p-4 flex items-center justify-between hover:bg-white/[0.02] transition-colors">
            <div className="flex items-center gap-3 min-w-0">
              <div className="h-10 w-10 rounded-lg shrink-0" style={{ background: e.imageGradient }} />
              <div className="min-w-0">
                <div className="font-medium truncate">{e.name}</div>
                <div className="text-xs text-muted-foreground">
                  {new Date(e.date).toLocaleDateString()} · {e.visibilityRegion}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-xs text-muted-foreground hidden md:block">{e.visibilityPercent}% vis</div>
              <button onClick={() => toast.info("Edit coming soon")} className="p-1.5 rounded hover:bg-white/10">
                <MoreVertical className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </GlassCard>
  );
}

function UsersPanel() {
  const users = [
    { name: "Nova Stellar", email: "nova@cosmos.io", joined: "Mar 2024", visits: 3, photos: 5, status: "Active" },
    { name: "Maya Rodriguez", email: "maya@example.com", joined: "Jan 2024", visits: 7, photos: 12, status: "Active" },
    { name: "James Carter", email: "james@example.com", joined: "Aug 2023", visits: 14, photos: 28, status: "VIP" },
    { name: "Hiro Tanaka", email: "hiro@example.com", joined: "Feb 2024", visits: 4, photos: 6, status: "Active" },
    { name: "Aisha Mohammed", email: "aisha@example.com", joined: "Dec 2023", visits: 2, photos: 0, status: "Active" },
  ];
  return (
    <GlassCard className="overflow-hidden">
      <table className="w-full text-sm">
        <thead className="text-xs uppercase tracking-wider text-muted-foreground">
          <tr className="border-b border-white/5">
            <th className="text-left p-3">User</th>
            <th className="text-left p-3 hidden md:table-cell">Joined</th>
            <th className="text-left p-3">Visits</th>
            <th className="text-left p-3 hidden sm:table-cell">Photos</th>
            <th className="text-left p-3">Status</th>
            <th className="p-3"></th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.email} className="border-b border-white/5 hover:bg-white/[0.02]">
              <td className="p-3">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-full bg-gradient-to-br from-primary/40 to-accent/40 flex items-center justify-center text-xs font-bold">
                    {u.name.charAt(0)}
                  </div>
                  <div>
                    <div className="font-medium">{u.name}</div>
                    <div className="text-xs text-muted-foreground">{u.email}</div>
                  </div>
                </div>
              </td>
              <td className="p-3 hidden md:table-cell text-muted-foreground">{u.joined}</td>
              <td className="p-3">{u.visits}</td>
              <td className="p-3 hidden sm:table-cell">{u.photos}</td>
              <td className="p-3">
                <span className={cn("px-2 py-0.5 rounded-full text-[10px] font-medium",
                  u.status === "VIP" ? "bg-amber-500/20 text-amber-300" : "bg-emerald-500/20 text-emerald-300")}>
                  {u.status}
                </span>
              </td>
              <td className="p-3">
                <button className="p-1.5 rounded hover:bg-white/10"><MoreVertical className="h-3.5 w-3.5" /></button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </GlassCard>
  );
}

function ReviewsPanel() {
  const allReviews = Object.entries(reviewsByLocation)
    .flatMap(([locId, reviews]) => reviews.map((r) => ({ ...r, locId })));
  return (
    <GlassCard className="p-5">
      <h3 className="font-semibold mb-4">Recent Reviews ({allReviews.length})</h3>
      <div className="space-y-3">
        {allReviews.slice(0, 8).map((r) => (
          <div key={r.id} className="p-3 rounded-lg glass">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3 min-w-0">
                <div className="h-8 w-8 rounded-full bg-gradient-to-br from-primary/40 to-accent/40 flex items-center justify-center text-xs font-bold shrink-0">
                  {r.avatar}
                </div>
                <div className="min-w-0">
                  <div className="text-sm font-medium">{r.author}</div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span>★ {r.rating}</span>
                    <span>·</span>
                    <span>{r.date}</span>
                    <span>·</span>
                    <span className="text-primary">{locations.find((l) => l.id === r.locId)?.name ?? "—"}</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1 line-clamp-1">{r.text}</p>
                </div>
              </div>
              <div className="flex gap-1 shrink-0">
                <button onClick={() => toast.success("Approved")} className="px-2 py-1 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-medium">Approve</button>
                <button onClick={() => toast.success("Flagged")} className="px-2 py-1 rounded bg-rose-500/20 text-rose-300 text-[10px] font-medium">Flag</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </GlassCard>
  );
}

function SimplePanel({ title, message }: { title: string; message: string }) {
  return (
    <GlassCard className="p-12 text-center">
      <div className="text-3xl mb-3">🛰️</div>
      <h3 className="font-semibold mb-2">{title} management</h3>
      <p className="text-sm text-muted-foreground max-w-md mx-auto">{message}</p>
      <button className="mt-4 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium">
        Coming Soon
      </button>
    </GlassCard>
  );
}

function BarChartMock() {
  const data = [
    { m: "Apr", v: 45 }, { m: "May", v: 52 }, { m: "Jun", v: 58 },
    { m: "Jul", v: 64 }, { m: "Aug", v: 72 }, { m: "Sep", v: 85 },
  ];
  return (
    <div className="flex items-end justify-between gap-2 h-32">
      {data.map((d, i) => (
        <div key={d.m} className="flex-1 flex flex-col items-center gap-1.5">
          <motion.div
            initial={{ height: 0 }}
            whileInView={{ height: `${(d.v / 100) * 100}%` }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: i * 0.08, ease: "easeOut" }}
            className="w-full rounded-t-md bg-gradient-to-t from-primary/40 to-accent/80"
            style={{ minHeight: "8px" }}
          />
          <div className="text-[10px] text-muted-foreground">{d.m}</div>
        </div>
      ))}
    </div>
  );
}
