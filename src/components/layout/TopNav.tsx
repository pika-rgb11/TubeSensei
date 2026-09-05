"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Telescope, Map, Calendar, Sparkles, User, Menu, X, Search, ChevronLeft
} from "lucide-react";
import { useAppStore } from "@/store/app-store";
import type { ViewId } from "@/lib/types";
import { cn } from "@/lib/utils";

const NAV_ITEMS: { id: ViewId; label: string; icon: typeof Telescope }[] = [
  { id: "home", label: "Home", icon: Telescope },
  { id: "explore", label: "Explore", icon: Search },
  { id: "cosmic-map", label: "Cosmic Map", icon: Map },
  { id: "events", label: "Events", icon: Calendar },
  { id: "knowledge", label: "Universe", icon: Sparkles },
  { id: "astro-guide", label: "AstroGuide", icon: Sparkles },
  { id: "profile", label: "Profile", icon: User },
];

export function TopNav() {
  const { currentView, navigate, goBack, viewStack, user } = useAppStore();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isDetail = currentView === "location-detail";

  return (
    <>
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
          scrolled ? "py-2" : "py-3"
        )}
      >
        <div className="container mx-auto px-3 md:px-6">
          <div
            className={cn(
              "flex items-center justify-between gap-4 rounded-2xl px-4 md:px-6 py-3 transition-all duration-300",
              scrolled ? "glass-strong shadow-xl" : "glass"
            )}
          >
            {/* Logo */}
            <button
              onClick={() => navigate("home")}
              className="flex items-center gap-2.5 group"
            >
              <div className="relative h-8 w-8">
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary to-accent animate-pulse-glow" />
                <div className="absolute inset-1 rounded-full bg-background flex items-center justify-center">
                  <Telescope className="h-4 w-4 text-primary" />
                </div>
                {/* Orbital ring */}
                <div className="absolute -inset-1.5 rounded-full border border-primary/30 animate-spin-slow" />
              </div>
              <div className="hidden sm:block">
                <div className="text-sm font-bold leading-none tracking-tight">
                  Cosmos<span className="text-gradient-cosmic">Voyages</span>
                </div>
                <div className="text-[9px] uppercase tracking-[0.18em] text-muted-foreground mt-0.5">
                  Travel the Universe
                </div>
              </div>
            </button>

            {/* Back button for detail views */}
            {isDetail && (
              <button
                onClick={goBack}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg glass text-sm hover:bg-white/5 transition-colors"
              >
                <ChevronLeft className="h-4 w-4" />
                <span className="hidden sm:inline">Back</span>
              </button>
            )}

            {/* Desktop nav */}
            <nav className="hidden lg:flex items-center gap-1">
              {NAV_ITEMS.slice(0, 6).map((item) => {
                const Icon = item.icon;
                const active = currentView === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => navigate(item.id)}
                    className={cn(
                      "relative flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200",
                      active
                        ? "text-primary-foreground bg-primary/90"
                        : "text-foreground/80 hover:text-foreground hover:bg-white/5"
                    )}
                  >
                    <Icon className="h-3.5 w-3.5" />
                    {item.label}
                    {active && (
                      <motion.div
                        layoutId="nav-active"
                        className="absolute inset-0 rounded-lg bg-primary/20 -z-10"
                        transition={{ type: "spring", duration: 0.5 }}
                      />
                    )}
                  </button>
                );
              })}
            </nav>

            <div className="flex items-center gap-2">
              {/* Profile button */}
              <button
                onClick={() => navigate("profile")}
                className={cn(
                  "flex items-center gap-2 pl-1 pr-3 py-1 rounded-full glass hover:bg-white/10 transition-colors",
                  currentView === "profile" && "ring-2 ring-primary/40"
                )}
              >
                <div
                  className="h-7 w-7 rounded-full"
                  style={{ background: user?.avatarGradient }}
                />
                <span className="hidden md:block text-xs font-medium">
                  {user?.name.split(" ")[0]}
                </span>
              </button>

              {/* Mobile menu trigger */}
              <button
                onClick={() => setMobileOpen(true)}
                className="lg:hidden p-2 rounded-lg glass hover:bg-white/5 transition-colors"
                aria-label="Open menu"
              >
                <Menu className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] lg:hidden"
          >
            <div
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setMobileOpen(false)}
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 280 }}
              className="absolute right-0 top-0 bottom-0 w-72 glass-strong p-5"
            >
              <div className="flex items-center justify-between mb-8">
                <span className="font-bold text-gradient-cosmic text-lg">Menu</span>
                <button
                  onClick={() => setMobileOpen(false)}
                  className="p-2 rounded-lg hover:bg-white/5"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              <nav className="space-y-1">
                {NAV_ITEMS.map((item) => {
                  const Icon = item.icon;
                  const active = currentView === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        navigate(item.id);
                        setMobileOpen(false);
                      }}
                      className={cn(
                        "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors",
                        active
                          ? "bg-primary/20 text-primary"
                          : "hover:bg-white/5 text-foreground/80"
                      )}
                    >
                      <Icon className="h-4 w-4" />
                      {item.label}
                    </button>
                  );
                })}
              </nav>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
