"use client";

import { motion } from "framer-motion";
import { Calendar, Clock, Globe2, MapPin, Bell, CalendarPlus } from "lucide-react";
import type { SpaceEvent } from "@/lib/types";
import { EVENT_TYPE_META } from "@/components/common/CategoryMeta";
import { CountdownTimer } from "@/components/common/CountdownTimer";
import { useAppStore } from "@/store/app-store";
import { toast } from "sonner";

interface EventCardProps {
  event: SpaceEvent;
  index?: number;
  variant?: "default" | "compact";
}

export function EventCard({ event, index = 0, variant = "compact" }: EventCardProps) {
  const meta = EVENT_TYPE_META[event.type];
  const attendEvent = useAppStore((s) => s.attendEvent);
  const user = useAppStore((s) => s.user);
  const navigate = useAppStore((s) => s.navigate);

  const handleAddReminder = () => {
    attendEvent(event.id);
    toast.success(`Reminder set for ${event.name}`, {
      description: "We'll notify you 1 hour before it begins.",
    });
  };

  const handleAddToCalendar = () => {
    const start = new Date(event.date);
    const end = new Date(start.getTime() + 60 * 60 * 1000);
    const fmt = (d: Date) => d.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
    const ics = `BEGIN:VEVENT
URL:https://cosmosvoyages.io
DTSTART:${fmt(start)}
DTEND:${fmt(end)}
SUMMARY:${event.name}
DESCRIPTION:${event.description}
LOCATION:${event.bestLocation}
END:VEVENT`;
    const blob = new Blob([`BEGIN:VCALENDAR\nVERSION:2.0\n${ics}\nEND:VCALENDAR`], { type: "text/calendar" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${event.id}.ics`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Calendar event downloaded");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.45, delay: Math.min(index * 0.06, 0.4) }}
      whileHover={{ y: -4 }}
      className="group relative rounded-2xl overflow-hidden glass-card hover:glow-accent transition-all duration-300"
    >
      <div
        className="relative h-40 overflow-hidden"
        style={{ background: event.imageGradient }}
      >
        <div className="absolute inset-0 nebula-overlay" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

        {/* Floating celestial body */}
        <div className="absolute -bottom-4 -left-4 w-24 h-24 rounded-full opacity-60 animate-float"
          style={{ background: `radial-gradient(circle at 30% 30%, ${meta.color}, transparent 70%)` }}
        />

        <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full glass-strong text-xs font-medium flex items-center gap-1.5">
          <span className="text-sm">{meta.emoji}</span>
          <span>{meta.label}</span>
        </div>

        <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full glass-strong text-xs font-medium">
          {event.visibilityPercent}% visible
        </div>

        <div className="absolute bottom-3 left-3 right-3">
          <CountdownTimer targetDate={event.date} />
        </div>
      </div>

      <div className="p-4 space-y-3">
        <div>
          <h3 className="font-bold text-base leading-tight">{event.name}</h3>
          <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
            <Calendar className="h-3 w-3" />
            <span>
              {new Date(event.date).toLocaleDateString("en-US", {
                weekday: "short",
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </span>
            <Clock className="h-3 w-3 ml-2" />
            <span>{event.time}</span>
          </div>
        </div>

        {variant === "default" && (
          <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
            {event.description}
          </p>
        )}

        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="flex items-start gap-1.5">
            <Globe2 className="h-3.5 w-3.5 mt-0.5 text-primary shrink-0" />
            <div>
              <div className="text-muted-foreground text-[10px] uppercase tracking-wider">Region</div>
              <div className="font-medium">{event.visibilityRegion}</div>
            </div>
          </div>
          <div className="flex items-start gap-1.5">
            <MapPin className="h-3.5 w-3.5 mt-0.5 text-accent shrink-0" />
            <div>
              <div className="text-muted-foreground text-[10px] uppercase tracking-wider">Best From</div>
              <div className="font-medium truncate">{event.bestLocation}</div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 pt-2 border-t border-white/5">
          <button
            onClick={handleAddReminder}
            className="flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium glass hover:bg-primary/20 transition-colors"
          >
            <Bell className="h-3 w-3" />
            {user?.attendedEvents.includes(event.id) ? "Reminder Set" : "Remind Me"}
          </button>
          <button
            onClick={handleAddToCalendar}
            className="flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium glass hover:bg-accent/20 transition-colors"
          >
            <CalendarPlus className="h-3 w-3" />
            Calendar
          </button>
        </div>
      </div>
    </motion.div>
  );
}
