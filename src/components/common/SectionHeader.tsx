"use client";

import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  icon?: ReactNode;
  action?: ReactNode;
  className?: string;
  eyebrow?: string;
}

export function SectionHeader({
  title,
  subtitle,
  icon,
  action,
  className,
  eyebrow,
}: SectionHeaderProps) {
  return (
    <div className={cn("flex items-end justify-between gap-4 mb-6", className)}>
      <div className="space-y-1">
        {eyebrow && (
          <div className="text-xs font-medium uppercase tracking-[0.18em] text-primary/80 flex items-center gap-2">
            {icon}
            {eyebrow}
          </div>
        )}
        <h2 className="text-2xl md:text-3xl font-bold tracking-tight">
          {title}
        </h2>
        {subtitle && (
          <p className="text-sm md:text-base text-muted-foreground max-w-2xl">
            {subtitle}
          </p>
        )}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}
