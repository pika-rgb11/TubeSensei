"use client";

import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import type { HTMLAttributes, ReactNode } from "react";

interface GlassCardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  variant?: "default" | "strong";
  glow?: "none" | "primary" | "accent";
}

export function GlassCard({
  children,
  className,
  variant = "default",
  glow = "none",
  ...props
}: GlassCardProps) {
  return (
    <div
      className={cn(
        variant === "strong" ? "glass-strong" : "glass-card",
        "rounded-2xl",
        glow === "primary" && "glow-primary",
        glow === "accent" && "glow-accent",
        "transition-all duration-300",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
