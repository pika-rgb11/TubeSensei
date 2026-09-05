"use client";

import { useMemo } from "react";

interface StarFieldProps {
  count?: number;
  className?: string;
  withShootingStars?: boolean;
}

interface Star {
  id: number;
  top: number;
  left: number;
  size: number;
  delay: number;
  duration: number;
  opacity: number;
}

export function StarField({ count = 80, className = "", withShootingStars = false }: StarFieldProps) {
  const stars = useMemo<Star[]>(() => {
    return Array.from({ length: count }).map((_, i) => ({
      id: i,
      top: Math.random() * 100,
      left: Math.random() * 100,
      size: Math.random() * 2 + 0.5,
      delay: Math.random() * 5,
      duration: Math.random() * 4 + 2,
      opacity: Math.random() * 0.6 + 0.3,
    }));
  }, [count]);

  return (
    <div className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`} aria-hidden="true">
      {stars.map((s) => (
        <div
          key={s.id}
          className="absolute rounded-full bg-white animate-twinkle"
          style={{
            top: `${s.top}%`,
            left: `${s.left}%`,
            width: `${s.size}px`,
            height: `${s.size}px`,
            opacity: s.opacity,
            animationDelay: `${s.delay}s`,
            animationDuration: `${s.duration}s`,
            boxShadow: s.size > 1.5 ? "0 0 4px rgba(255,255,255,0.8)" : undefined,
          }}
        />
      ))}
      {withShootingStars && (
        <>
          <div
            className="absolute h-0.5 w-20 animate-shooting-star"
            style={{
              top: "10%",
              left: "5%",
              background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.9), transparent)",
              animationDelay: "0s",
            }}
          />
          <div
            className="absolute h-0.5 w-16 animate-shooting-star"
            style={{
              top: "30%",
              left: "20%",
              background: "linear-gradient(90deg, transparent, rgba(180,200,255,0.9), transparent)",
              animationDelay: "3s",
            }}
          />
        </>
      )}
    </div>
  );
}
