"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  ChevronLeft, Star, Clock, Check, X, Calendar, Users, MapPin,
  Sparkles, ArrowRight, ShieldCheck,
} from "lucide-react";
import { StarField } from "@/components/common/StarField";
import { GlassCard } from "@/components/common/GlassCard";
import { RatingStars } from "@/components/common/RatingStars";
import { useAppStore } from "@/store/app-store";
import { getLocation } from "@/lib/data/locations";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export function BookingView() {
  const { selectedLocationId, goBack, navigate } = useAppStore();
  const [selectedExp, setSelectedExp] = useState<string | null>(null);
  const [guests, setGuests] = useState(2);
  const [date, setDate] = useState<string>(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]);
  const [bookingStep, setBookingStep] = useState<"browse" | "checkout" | "confirmed">("browse");

  const location = selectedLocationId ? getLocation(selectedLocationId) : null;

  if (!location) {
    return (
      <div className="pt-32 pb-12 container mx-auto px-6 text-center">
        <p>Please choose a destination first.</p>
        <button onClick={() => navigate("explore")} className="mt-4 text-primary">Browse destinations</button>
      </div>
    );
  }

  const handleConfirmBooking = () => {
    setBookingStep("confirmed");
    toast.success("Booking confirmed!", { description: "Confirmation sent to your email." });
  };

  if (bookingStep === "confirmed") {
    return (
      <div className="pt-20 pb-12 min-h-screen flex items-center">
        <div className="container mx-auto px-6 max-w-2xl">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
          >
            <GlassCard variant="strong" className="relative overflow-hidden p-8 text-center">
              <div className="absolute inset-0 pointer-events-none">
                <StarField count={50} withShootingStars />
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-72 h-72 rounded-full opacity-30 blur-3xl"
                  style={{ background: "radial-gradient(circle, oklch(0.45 0.20 150), transparent 70%)" }}
                />
              </div>
              <div className="relative">
                <div className="h-20 w-20 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 mx-auto flex items-center justify-center mb-4 animate-pulse-glow"
                  style={{ boxShadow: "0 0 40px oklch(0.72 0.18 150)" }}
                >
                  <Check className="h-10 w-10 text-white" strokeWidth={3} />
                </div>
                <h2 className="text-3xl font-bold mb-2">Booking Confirmed</h2>
                <p className="text-muted-foreground mb-6">Your cosmic adventure awaits at {location.name}.</p>
                <GlassCard className="p-4 text-left mb-6">
                  <div className="flex items-start gap-3">
                    <div className="h-14 w-14 rounded-lg shrink-0" style={{ background: location.imageGradient }} />
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold">{selectedExp ? location.experiences.find((e) => e.id === selectedExp)?.title : "Experience"}</div>
                      <div className="text-sm text-muted-foreground mt-0.5">{location.name} · {location.city}, {location.country}</div>
                      <div className="flex items-center gap-3 text-xs mt-2">
                        <span className="flex items-center gap-1"><Calendar className="h-3 w-3 text-primary" />{new Date(date).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}</span>
                        <span className="flex items-center gap-1"><Users className="h-3 w-3 text-primary" />{guests} guests</span>
                      </div>
                    </div>
                  </div>
                </GlassCard>
                <div className="flex flex-wrap gap-3 justify-center">
                  <button onClick={() => navigate("profile")} className="px-5 py-2.5 rounded-xl bg-primary text-primary-foreground font-medium">
                    View My Bookings
                  </button>
                  <button onClick={() => navigate("home")} className="px-5 py-2.5 rounded-xl glass font-medium">
                    Back to Home
                  </button>
                </div>
              </div>
            </GlassCard>
          </motion.div>
        </div>
      </div>
    );
  }

  const exp = selectedExp ? location.experiences.find((e) => e.id === selectedExp) : null;

  if (bookingStep === "checkout" && exp) {
    const total = exp.price * guests;
    return (
      <div className="pt-20 pb-12">
        <div className="container mx-auto px-6 max-w-4xl">
          <button onClick={() => setBookingStep("browse")} className="flex items-center gap-1.5 text-sm mb-4 hover:text-primary">
            <ChevronLeft className="h-4 w-4" /> Back to experiences
          </button>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="grid lg:grid-cols-[1fr_320px] gap-6"
          >
            <div className="space-y-5">
              <GlassCard className="p-6">
                <h2 className="text-xl font-bold mb-4">{exp.title}</h2>
                <div className="flex items-center gap-3 mb-4">
                  <RatingStars value={exp.rating} size={14} />
                  <span className="text-sm text-muted-foreground">· {exp.reviews} reviews · {exp.duration}</span>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed mb-4">{exp.description}</p>
                <div>
                  <h4 className="text-sm font-semibold mb-2">What's included</h4>
                  <ul className="grid grid-cols-2 gap-2">
                    {exp.inclusions.map((inc) => (
                      <li key={inc} className="flex items-start gap-1.5 text-sm">
                        <Check className="h-4 w-4 text-emerald-400 mt-0.5 shrink-0" /> {inc}
                      </li>
                    ))}
                  </ul>
                </div>
              </GlassCard>

              <GlassCard className="p-6 space-y-4">
                <h3 className="font-semibold">Booking Details</h3>
                <div>
                  <label className="text-xs uppercase tracking-wider text-muted-foreground mb-2 block">Date</label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full p-3 rounded-lg glass border-0 outline-none text-sm focus:ring-2 ring-primary/50"
                  />
                </div>
                <div>
                  <label className="text-xs uppercase tracking-wider text-muted-foreground mb-2 block">Guests</label>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setGuests(Math.max(1, guests - 1))}
                      className="h-10 w-10 rounded-lg glass flex items-center justify-center"
                    >
                      −
                    </button>
                    <input
                      type="number"
                      value={guests}
                      onChange={(e) => setGuests(Math.max(1, Math.min(10, Number(e.target.value))))}
                      className="flex-1 p-3 rounded-lg glass border-0 outline-none text-center text-sm focus:ring-2 ring-primary/50"
                    />
                    <button
                      onClick={() => setGuests(Math.min(10, guests + 1))}
                      className="h-10 w-10 rounded-lg glass flex items-center justify-center"
                    >
                      +
                    </button>
                  </div>
                </div>
                <div>
                  <label className="text-xs uppercase tracking-wider text-muted-foreground mb-2 block">Special requests</label>
                  <textarea
                    placeholder="Any dietary requirements, accessibility needs, or questions?"
                    className="w-full p-3 rounded-lg glass border-0 outline-none text-sm resize-none focus:ring-2 ring-primary/50"
                    rows={3}
                  />
                </div>
              </GlassCard>
            </div>

            <aside>
              <div className="sticky top-24 space-y-4">
                <GlassCard variant="strong" className="p-5">
                  <h3 className="font-semibold mb-4">Price Summary</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">${exp.price} × {guests} guests</span>
                      <span>${(exp.price * guests).toFixed(0)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Service fee</span>
                      <span>${(exp.price * guests * 0.08).toFixed(0)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Taxes</span>
                      <span>${(exp.price * guests * 0.05).toFixed(0)}</span>
                    </div>
                    <div className="pt-3 border-t border-white/5 flex justify-between font-bold text-base">
                      <span>Total</span>
                      <span className="text-gradient-cosmic">${(total * 1.13).toFixed(0)}</span>
                    </div>
                  </div>
                  <button
                    onClick={handleConfirmBooking}
                    className="w-full mt-4 py-3 rounded-xl bg-primary text-primary-foreground font-medium hover:glow-primary transition-all flex items-center justify-center gap-2"
                  >
                    Confirm Booking <ArrowRight className="h-4 w-4" />
                  </button>
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-3 justify-center">
                    <ShieldCheck className="h-3 w-3 text-emerald-400" />
                    Free cancellation up to 48 hours before
                  </div>
                </GlassCard>

                <GlassCard className="p-4 text-center">
                  <div className="text-xs text-muted-foreground">Need help booking?</div>
                  <button onClick={() => navigate("astro-guide")} className="text-sm text-primary mt-1">
                    Ask AstroGuide →
                  </button>
                </GlassCard>
              </div>
            </aside>
          </motion.div>
        </div>
      </div>
    );
  }

  // Browse step
  return (
    <div className="pt-16 pb-12">
      {/* Hero */}
      <section className="relative h-64 overflow-hidden">
        <div className="absolute inset-0" style={{ background: location.imageGradient }} />
        <div className="absolute inset-0 nebula-overlay" />
        <StarField count={60} />
        <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
        <div className="container mx-auto px-6 relative h-full flex flex-col justify-end pb-6">
          <button onClick={goBack} className="flex items-center gap-1.5 text-sm mb-2 hover:text-primary">
            <ChevronLeft className="h-4 w-4" /> Back to {location.name}
          </button>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
            Book an <span className="text-gradient-cosmic">Experience</span>
          </h1>
          <p className="text-muted-foreground mt-1">
            {location.name} · {location.city}, {location.country}
          </p>
        </div>
      </section>

      <section className="container mx-auto px-6 mt-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {location.experiences.map((exp, i) => (
            <motion.div
              key={exp.id}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.06 }}
            >
              <GlassCard
                className={cn(
                  "p-5 h-full flex flex-col cursor-pointer hover:glow-primary transition-all",
                  selectedExp === exp.id && "ring-2 ring-primary/50"
                )}
              >
                <div className="flex-1">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="px-2 py-0.5 rounded-full glass text-[10px] uppercase tracking-wider font-medium">
                      {exp.type.replace(/-/g, " ")}
                    </div>
                    <RatingStars value={exp.rating} size={12} count={exp.reviews} />
                  </div>
                  <h3 className="font-semibold mb-1">{exp.title}</h3>
                  <p className="text-xs text-muted-foreground line-clamp-2 mb-3 leading-relaxed">{exp.description}</p>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground mb-3">
                    <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{exp.duration}</span>
                    <span className="flex items-center gap-1"><Sparkles className="h-3 w-3 text-emerald-400" />{exp.availability}</span>
                  </div>
                  <div className="space-y-1">
                    {exp.inclusions.slice(0, 3).map((inc) => (
                      <div key={inc} className="flex items-center gap-1.5 text-xs">
                        <Check className="h-3 w-3 text-emerald-400 shrink-0" /> {inc}
                      </div>
                    ))}
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between">
                  <div>
                    <div className="text-[10px] text-muted-foreground uppercase tracking-wider">From</div>
                    <div className="text-lg font-bold">${exp.price} <span className="text-xs font-normal text-muted-foreground">/ person</span></div>
                  </div>
                  <button
                    onClick={() => { setSelectedExp(exp.id); setBookingStep("checkout"); }}
                    className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:glow-primary transition-all"
                  >
                    Book Now
                  </button>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
