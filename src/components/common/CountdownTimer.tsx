"use client";

import { useState, useEffect } from "react";

export function CountdownTimer({ targetDate }: { targetDate: string }) {
  const target = new Date(targetDate).getTime();
  const [time, setTime] = useState({ d: 0, h: 0, m: 0, s: 0, done: false });

  useEffect(() => {
    const tick = () => {
      const diff = target - Date.now();
      if (diff <= 0) {
        setTime({ d: 0, h: 0, m: 0, s: 0, done: true });
        return;
      }
      const d = Math.floor(diff / (1000 * 60 * 60 * 24));
      const h = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const m = Math.floor((diff / 1000 / 60) % 60);
      const s = Math.floor((diff / 1000) % 60);
      setTime({ d, h, m, s, done: false });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [target]);

  if (time.done) {
    return (
      <div className="text-xs font-semibold text-emerald-400 tracking-wider">
        ● HAPPENING NOW
      </div>
    );
  }

  const units = [
    { label: "Days", value: time.d },
    { label: "Hours", value: time.h },
    { label: "Min", value: time.m },
    { label: "Sec", value: time.s },
  ];

  return (
    <div className="flex items-center gap-1.5">
      {units.map((u, i) => (
        <div key={u.label} className="flex items-center gap-1.5">
          <div className="flex flex-col items-center px-1.5 py-1 rounded-md glass min-w-[34px]">
            <span className="text-sm font-bold tabular-nums leading-none">
              {String(u.value).padStart(2, "0")}
            </span>
            <span className="text-[9px] uppercase tracking-wider text-muted-foreground mt-0.5">
              {u.label}
            </span>
          </div>
          {i < units.length - 1 && (
            <span className="text-muted-foreground/40 text-xs">:</span>
          )}
        </div>
      ))}
    </div>
  );
}
