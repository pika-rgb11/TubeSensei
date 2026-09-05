"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useAppStore } from "@/store/app-store";
import { TopNav } from "@/components/layout/TopNav";
import { BottomNav } from "@/components/layout/BottomNav";
import { Footer } from "@/components/layout/Footer";
import { HomeView } from "@/components/views/HomeView";
import { ExploreView } from "@/components/views/ExploreView";
import { LocationDetailView } from "@/components/views/LocationDetailView";
import { EventsView } from "@/components/views/EventsView";
import { CosmicMapView } from "@/components/views/CosmicMapView";
import { KnowledgeView } from "@/components/views/KnowledgeView";
import { AstroGuideView } from "@/components/views/AstroGuideView";
import { TonightsSkyView } from "@/components/views/TonightsSkyView";
import { ProfileView } from "@/components/views/ProfileView";
import { BookingView } from "@/components/views/BookingView";
import { AdminView } from "@/components/views/AdminView";

export default function Home() {
  const view = useAppStore((s) => s.currentView);

  return (
    <div className="min-h-screen flex flex-col">
      <TopNav />
      <main className="flex-1">
        <AnimatePresence mode="wait">
          <motion.div
            key={view}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3 }}
          >
            {view === "home" && <HomeView />}
            {view === "explore" && <ExploreView />}
            {view === "location-detail" && <LocationDetailView />}
            {view === "events" && <EventsView />}
            {view === "cosmic-map" && <CosmicMapView />}
            {view === "knowledge" && <KnowledgeView />}
            {view === "astro-guide" && <AstroGuideView />}
            {view === "tonights-sky" && <TonightsSkyView />}
            {view === "profile" && <ProfileView />}
            {view === "booking" && <BookingView />}
            {view === "admin" && <AdminView />}
          </motion.div>
        </AnimatePresence>
      </main>
      <Footer />
      <BottomNav />
    </div>
  );
}
