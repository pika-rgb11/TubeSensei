"use client";

import { Telescope, Mail, Globe, Github, Twitter } from "lucide-react";
import { useAppStore } from "@/store/app-store";

export function Footer() {
  const navigate = useAppStore((s) => s.navigate);

  return (
    <footer className="mt-auto relative overflow-hidden border-t border-white/5 pt-12 pb-8 lg:pb-8">
      {/* Subtle nebula glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-[60%] h-40 rounded-full"
          style={{
            background: "radial-gradient(ellipse, oklch(0.40 0.15 290 / 0.18), transparent 70%)",
          }}
        />
      </div>

      <div className="container mx-auto px-6 relative">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-2">
            <div className="flex items-center gap-2.5 mb-3">
              <div className="relative h-8 w-8">
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary to-accent animate-pulse-glow" />
                <div className="absolute inset-1 rounded-full bg-background flex items-center justify-center">
                  <Telescope className="h-4 w-4 text-primary" />
                </div>
              </div>
              <div className="text-lg font-bold tracking-tight">
                Cosmos<span className="text-gradient-cosmic">Voyages</span>
              </div>
            </div>
            <p className="text-sm text-muted-foreground max-w-xs leading-relaxed">
              Travel isn't only across Earth. It's an experience of the universe.
            </p>
            <div className="flex items-center gap-3 mt-4">
              {[Twitter, Github, Mail, Globe].map((Icon, i) => (
                <button key={i} className="h-9 w-9 rounded-full glass flex items-center justify-center hover:glow-primary transition-all">
                  <Icon className="h-4 w-4" />
                </button>
              ))}
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider mb-3">Explore</h4>
            <ul className="space-y-2 text-sm">
              {[
                { label: "Stargazing", v: "explore" as const, c: "stargazing" },
                { label: "Observatories", v: "explore" as const, c: "observatory" },
                { label: "Dark Sky Parks", v: "explore" as const, c: "dark-sky" },
                { label: "Cosmic Map", v: "cosmic-map" as const },
              ].map((l) => (
                <li key={l.label}>
                  <button
                    onClick={() => navigate(l.v, "c" in l ? { category: l.c } : undefined)}
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    {l.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider mb-3">Discover</h4>
            <ul className="space-y-2 text-sm">
              {[
                { label: "Upcoming Events", v: "events" as const },
                { label: "Tonight's Sky", v: "tonights-sky" as const },
                { label: "Universe Guide", v: "knowledge" as const },
                { label: "AstroGuide AI", v: "astro-guide" as const },
              ].map((l) => (
                <li key={l.label}>
                  <button onClick={() => navigate(l.v)} className="text-muted-foreground hover:text-primary transition-colors">
                    {l.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider mb-3">Account</h4>
            <ul className="space-y-2 text-sm">
              {[
                { label: "Cosmic Journey", v: "profile" as const },
                { label: "Bucket List", v: "profile" as const },
                { label: "Saved", v: "profile" as const },
                { label: "Admin", v: "admin" as const },
              ].map((l) => (
                <li key={l.label}>
                  <button onClick={() => navigate(l.v)} className="text-muted-foreground hover:text-primary transition-colors">
                    {l.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="pt-6 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-muted-foreground">
          <p>© 2026 Cosmos Voyages · Made under the stars</p>
          <p className="flex items-center gap-4">
            <button className="hover:text-foreground transition-colors">Privacy</button>
            <button className="hover:text-foreground transition-colors">Terms</button>
            <span>·</span>
            <span>v2.6</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
