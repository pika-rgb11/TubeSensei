"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Home, Compass, Map, Calendar, User } from "lucide-react";
import { useAppStore } from "@/store/app-store";
import type { ViewId } from "@/lib/types";
import { cn } from "@/lib/utils";

const BOTTOM_ITEMS: { id: ViewId; label: string; icon: typeof Home }[] = [
  { id: "home", label: "Home", icon: Home },
  { id: "explore", label: "Explore", icon: Compass },
  { id: "cosmic-map", label: "Cosmos", icon: Map },
  { id: "events", label: "Events", icon: Calendar },
  { id: "profile", label: "Profile", icon: User },
];

export function BottomNav() {
  const { currentView, navigate } = useAppStore();

  return (
    <nav className="lg:hidden fixed bottom-3 left-3 right-3 z-40 pb-[env(safe-area-inset-bottom)]">
      <div className="glass-strong rounded-2xl px-2 py-2 shadow-2xl flex items-center justify-around">
        {BOTTOM_ITEMS.map((item) => {
          const Icon = item.icon;
          const active = currentView === item.id ||
            (item.id === "explore" && currentView === "location-detail");
          return (
            <button
              key={item.id}
              onClick={() => navigate(item.id)}
              className={cn(
                "relative flex flex-col items-center justify-center gap-0.5 px-3 py-1.5 rounded-xl transition-all",
                active ? "text-primary" : "text-muted-foreground"
              )}
            >
              <div className="relative">
                <Icon className={cn("h-5 w-5 transition-transform", active && "scale-110")} />
                {active && (
                  <motion.div
                    layoutId="bottom-active"
                    className="absolute -inset-2 rounded-full bg-primary/15 -z-10"
                    transition={{ type: "spring", duration: 0.4 }}
                  />
                )}
              </div>
              <span className="text-[10px] font-medium">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
