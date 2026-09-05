"use client";

import { useMemo } from "react";
import type { PlanetTexture } from "@/lib/types";

interface PlanetVisualProps {
  texture: PlanetTexture;
  size?: number; // diameter in px
  animate?: boolean; // slow rotation
  className?: string;
  showRing?: boolean;
  showStars?: boolean;
}

/**
 * Realistic planet visualization with directional lighting,
 * limb darkening, surface texture per planet kind, and atmosphere.
 * Pure CSS + SVG (no external textures needed).
 */
export function PlanetVisual({
  texture,
  size = 200,
  animate = true,
  className = "",
  showRing = true,
  showStars = true,
}: PlanetVisualProps) {
  const id = useMemo(() => `p-${Math.random().toString(36).slice(2, 9)}`, []);

  return (
    <div
      className={`relative ${className}`}
      style={{ width: size, height: size }}
    >
      {/* Background stars (decorative) */}
      {showStars && (
        <div className="absolute inset-0 pointer-events-none overflow-visible">
          {Array.from({ length: 12 }).map((_, i) => {
            const top = Math.random() * 100;
            const left = Math.random() * 100;
            const sz = Math.random() * 1.4 + 0.3;
            return (
              <div
                key={i}
                className="absolute rounded-full bg-white animate-twinkle"
                style={{
                  top: `${top}%`,
                  left: `${left}%`,
                  width: `${sz}px`,
                  height: `${sz}px`,
                  opacity: 0.6,
                  animationDelay: `${Math.random() * 5}s`,
                  boxShadow: sz > 1 ? "0 0 4px rgba(255,255,255,0.8)" : undefined,
                }}
              />
            );
          })}
        </div>
      )}

      {/* Atmospheric halo (outside the planet sphere) */}
      {texture.atmosphereColor && (
        <div
          className="absolute rounded-full pointer-events-none"
          style={{
            inset: `-${size * 0.06}px`,
            background: `radial-gradient(circle, ${texture.atmosphereColor} 35%, transparent 70%)`,
            filter: "blur(8px)",
          }}
        />
      )}

      {/* Planet sphere with SVG texture */}
      <svg
        viewBox="0 0 200 200"
        className="absolute inset-0 w-full h-full"
        style={{ filter: `drop-shadow(0 0 ${size * 0.12}px ${texture.baseColor})` }}
      >
        <defs>
          {/* Directional lighting — light comes from upper-left */}
          <radialGradient id={`${id}-light`} cx="28%" cy="25%" r="65%">
            <stop offset="0%" stopColor={texture.accentColor} stopOpacity="1" />
            <stop offset="20%" stopColor={texture.baseColor} stopOpacity="1" />
            <stop offset="55%" stopColor={texture.baseColor} stopOpacity="1" />
            <stop offset="85%" stopColor={texture.secondaryColor} stopOpacity="1" />
            <stop offset="100%" stopColor={texture.secondaryColor} stopOpacity="0.7" />
          </radialGradient>

          {/* Limb darkening overlay (sharp day/night terminator on the dark side) */}
          <radialGradient id={`${id}-limb`} cx="72%" cy="70%" r="70%">
            <stop offset="0%" stopColor="oklch(0.02 0.01 270)" stopOpacity="0" />
            <stop offset="40%" stopColor="oklch(0.02 0.01 270)" stopOpacity="0" />
            <stop offset="55%" stopColor="oklch(0.04 0.02 270)" stopOpacity="0.15" />
            <stop offset="70%" stopColor="oklch(0.03 0.02 270)" stopOpacity="0.4" />
            <stop offset="85%" stopColor="oklch(0.02 0.01 270)" stopOpacity="0.75" />
            <stop offset="100%" stopColor="oklch(0.01 0.01 270)" stopOpacity="0.92" />
          </radialGradient>

          {/* Specular highlight (top-left bright spot) */}
          <radialGradient id={`${id}-spec`} cx="24%" cy="20%" r="28%">
            <stop offset="0%" stopColor="white" stopOpacity="0.7" />
            <stop offset="35%" stopColor="white" stopOpacity="0.18" />
            <stop offset="100%" stopColor="white" stopOpacity="0" />
          </radialGradient>

          {/* Terminator soft gradient (smooth transition on the lit side) */}
          <linearGradient id={`${id}-term`} x1="20%" y1="0%" x2="80%" y2="100%">
            <stop offset="0%" stopColor="white" stopOpacity="0.05" />
            <stop offset="50%" stopColor="white" stopOpacity="0" />
            <stop offset="100%" stopColor="oklch(0.02 0.01 270)" stopOpacity="0.1" />
          </linearGradient>

          {/* Clip path so texture stays within the sphere */}
          <clipPath id={`${id}-clip`}>
            <circle cx="100" cy="100" r="98" />
          </clipPath>
        </defs>

        {/* Base sphere with lighting */}
        <circle cx="100" cy="100" r="98" fill={`url(#${id}-light)`} />

        {/* Surface texture (clipped) */}
        <g clipPath={`url(#${id}-clip)`}>
          <PlanetSurface texture={texture} id={id} />
        </g>

        {/* Subtle terminator tint */}
        <circle cx="100" cy="100" r="98" fill={`url(#${id}-term)`} />

        {/* Limb darkening overlay (strong terminator) */}
        <circle cx="100" cy="100" r="98" fill={`url(#${id}-limb)`} />

        {/* Specular highlight */}
        <circle cx="100" cy="100" r="98" fill={`url(#${id}-spec)`} />

        {/* Atmospheric rim glow (inside the sphere, edge only) */}
        {texture.atmosphereColor && (
          <circle
            cx="100" cy="100" r="96"
            fill="none"
            stroke={texture.atmosphereColor}
            strokeWidth="2"
            opacity="0.5"
            style={{ filter: "blur(1.5px)" }}
          />
        )}
      </svg>

      {/* Saturn-style rings */}
      {showRing && texture.hasRing && texture.ringColor && (
        <div
          className="absolute left-1/2 top-1/2 pointer-events-none animate-spin-slow"
          style={{
            width: size * 1.8,
            height: size * 1.8,
            marginLeft: -size * 0.9,
            marginTop: -size * 0.9,
            transform: "rotateX(72deg) rotateZ(15deg)",
            transformStyle: "preserve-3d",
          }}
        >
          <div
            className="absolute inset-0 rounded-full"
            style={{
              border: `${Math.max(2, size * 0.04)}px solid ${texture.ringColor}`,
              boxShadow: `0 0 ${size * 0.08}px ${texture.ringColor}, inset 0 0 ${size * 0.04}px ${texture.ringColor}`,
              opacity: 0.85,
            }}
          />
          <div
            className="absolute rounded-full"
            style={{
              inset: `${size * 0.06}px`,
              border: `${Math.max(1, size * 0.02)}px solid ${texture.ringColor}`,
              opacity: 0.6,
            }}
          />
          <div
            className="absolute rounded-full"
            style={{
              inset: `${size * 0.12}px`,
              border: `${Math.max(1, size * 0.015)}px solid ${texture.ringColor}`,
              opacity: 0.45,
            }}
          />
        </div>
      )}

      {/* Subtle floating animation */}
      {animate && (
        <style>{`
          @keyframes ${id}-float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-${Math.max(3, size * 0.025)}px); }
          }
        `}</style>
      )}
    </div>
  );
}

/* Surface texture renderer per planet kind */
function PlanetSurface({ texture, id }: { texture: PlanetTexture; id: string }) {
  switch (texture.kind) {
    case "star":
      return <SunSurface texture={texture} id={id} />;
    case "rocky-cratered":
      return <RockyCratered texture={texture} id={id} />;
    case "clouded-venus":
      return <CloudedVenus texture={texture} id={id} />;
    case "earth-like":
      return <EarthLike texture={texture} id={id} />;
    case "mars-like":
      return <MarsLike texture={texture} id={id} />;
    case "gas-banded-jupiter":
      return <GasBandedJupiter texture={texture} id={id} />;
    case "gas-banded-saturn":
      return <GasBandedSaturn texture={texture} id={id} />;
    case "ice-giant-uranus":
      return <IceGiantUranus texture={texture} id={id} />;
    case "ice-giant-neptune":
      return <IceGiantNeptune texture={texture} id={id} />;
    default:
      return null;
  }
}

/* SUN — glowing, with surface granulation and solar flares */
function SunSurface({ texture, id }: { texture: PlanetTexture; id: string }) {
  return (
    <>
      <defs>
        <radialGradient id={`${id}-granule`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={texture.accentColor} stopOpacity="0.8" />
          <stop offset="100%" stopColor={texture.accentColor} stopOpacity="0" />
        </radialGradient>
      </defs>
      {/* Granulation pattern */}
      {Array.from({ length: 40 }).map((_, i) => {
        const x = Math.random() * 200;
        const y = Math.random() * 200;
        const r = Math.random() * 18 + 6;
        return (
          <circle
            key={i}
            cx={x}
            cy={y}
            r={r}
            fill={`url(#${id}-granule)`}
            opacity={Math.random() * 0.4 + 0.2}
          />
        );
      })}
      {/* Solar flares (brighter arcs) */}
      <g stroke={texture.accentColor} strokeWidth="1" fill="none" opacity="0.6">
        <path d="M 30 80 Q 50 70 70 75" />
        <path d="M 120 30 Q 140 25 165 35" />
        <path d="M 150 150 Q 170 145 180 130" />
      </g>
    </>
  );
}

/* MERCURY — cratered surface like the Moon */
function RockyCratered({ texture, id }: { texture: PlanetTexture; id: string }) {
  return (
    <>
      {/* Surface noise (darker patches) */}
      {Array.from({ length: 18 }).map((_, i) => {
        const x = Math.random() * 200;
        const y = Math.random() * 200;
        const r = Math.random() * 25 + 8;
        return (
          <ellipse
            key={`patch-${i}`}
            cx={x}
            cy={y}
            rx={r}
            ry={r * 0.7}
            fill={texture.secondaryColor}
            opacity={Math.random() * 0.35 + 0.15}
            transform={`rotate(${Math.random() * 360} ${x} ${y})`}
          />
        );
      })}
      {/* Craters (dark rings) */}
      {Array.from({ length: 22 }).map((_, i) => {
        const x = Math.random() * 200;
        const y = Math.random() * 200;
        const r = Math.random() * 14 + 4;
        return (
          <g key={`crater-${i}`}>
            <circle cx={x} cy={y} r={r} fill="oklch(0.20 0.02 40)" opacity="0.5" />
            <circle
              cx={x - r * 0.2}
              cy={y - r * 0.2}
              r={r * 0.85}
              fill="none"
              stroke={texture.accentColor}
              strokeWidth="0.8"
              opacity="0.4"
            />
          </g>
        );
      })}
    </>
  );
}

/* VENUS — thick swirling cloud cover (smooth, not striped) */
function CloudedVenus({ texture, id }: { texture: PlanetTexture; id: string }) {
  return (
    <>
      {/* Soft global cloud swirls (no horizontal stripes) */}
      {Array.from({ length: 14 }).map((_, i) => {
        const x = Math.random() * 200;
        const y = Math.random() * 200;
        const rx = Math.random() * 50 + 30;
        const ry = Math.random() * 12 + 6;
        return (
          <ellipse
            key={`cloud-${i}`}
            cx={x}
            cy={y}
            rx={rx}
            ry={ry}
            fill={i % 2 === 0 ? texture.baseColor : texture.secondaryColor}
            opacity={Math.random() * 0.3 + 0.2}
            transform={`rotate(${Math.random() * 30 - 15} ${x} ${y})`}
          />
        );
      })}
      {/* Brighter cream-colored highlights (sulfuric clouds) */}
      {Array.from({ length: 8 }).map((_, i) => {
        const x = Math.random() * 200;
        const y = Math.random() * 200;
        return (
          <ellipse
            key={`hi-${i}`}
            cx={x}
            cy={y}
            rx={Math.random() * 35 + 18}
            ry={Math.random() * 8 + 4}
            fill={texture.accentColor}
            opacity={Math.random() * 0.3 + 0.25}
            transform={`rotate(${Math.random() * 20 - 10} ${x} ${y})`}
          />
        );
      })}
      {/* Subtle large-scale wave pattern */}
      <path
        d="M -10 60 Q 50 50 100 65 Q 150 80 210 60"
        fill="none"
        stroke={texture.accentColor}
        strokeWidth="3"
        opacity="0.3"
        strokeLinecap="round"
      />
      <path
        d="M -10 130 Q 50 145 100 130 Q 150 115 210 140"
        fill="none"
        stroke={texture.secondaryColor}
        strokeWidth="3"
        opacity="0.35"
        strokeLinecap="round"
      />
    </>
  );
}

/* EARTH — continents, oceans, polar ice, cloud cover */
function EarthLike({ texture, id }: { texture: PlanetTexture; id: string }) {
  // Stylized continent shapes (random blobs in earth tones)
  const continents = [
    { cx: 50, cy: 80, points: "40,75 60,70 70,85 65,95 50,100 38,90" },
    { cx: 100, cy: 70, points: "85,65 115,60 125,75 120,90 100,95 85,80" },
    { cx: 150, cy: 110, points: "135,100 165,95 175,115 165,135 145,140 130,125" },
    { cx: 60, cy: 130, points: "50,125 75,120 80,140 70,150 55,145" },
    { cx: 165, cy: 75, points: "155,70 175,68 180,80 170,85" },
  ];
  return (
    <>
      {/* Polar ice caps */}
      <ellipse cx="100" cy="0" rx="80" ry="22" fill={texture.accentColor} opacity="0.9" />
      <ellipse cx="100" cy="200" rx="80" ry="22" fill={texture.accentColor} opacity="0.9" />
      {/* Continents (green landmasses) */}
      {continents.map((c, i) => (
        <polygon
          key={i}
          points={c.points}
          fill={texture.secondaryColor}
          opacity="0.9"
        />
      ))}
      {/* Cloud cover (white wispy patches) */}
      {Array.from({ length: 8 }).map((_, i) => {
        const x = Math.random() * 200;
        const y = Math.random() * 200;
        return (
          <ellipse
            key={`cloud-${i}`}
            cx={x}
            cy={y}
            rx={Math.random() * 25 + 12}
            ry={Math.random() * 6 + 4}
            fill={texture.accentColor}
            opacity={Math.random() * 0.3 + 0.2}
            transform={`rotate(${Math.random() * 30 - 15} ${x} ${y})`}
          />
        );
      })}
    </>
  );
}

/* MARS — rust-colored surface with polar caps and dark valleys */
function MarsLike({ texture, id }: { texture: PlanetTexture; id: string }) {
  return (
    <>
      {/* Surface color variation */}
      {Array.from({ length: 14 }).map((_, i) => {
        const x = Math.random() * 200;
        const y = Math.random() * 200;
        return (
          <ellipse
            key={`patch-${i}`}
            cx={x}
            cy={y}
            rx={Math.random() * 30 + 15}
            ry={Math.random() * 20 + 10}
            fill={texture.secondaryColor}
            opacity={Math.random() * 0.4 + 0.2}
            transform={`rotate(${Math.random() * 360} ${x} ${y})`}
          />
        );
      })}
      {/* Valles Marineris-style dark valley */}
      <path
        d="M 40 110 Q 80 100 120 105 Q 160 110 180 100"
        fill="none"
        stroke="oklch(0.25 0.04 25)"
        strokeWidth="4"
        opacity="0.7"
        strokeLinecap="round"
      />
      {/* Polar ice caps (white) */}
      <ellipse cx="100" cy="0" rx="50" ry="15" fill={texture.accentColor} opacity="0.95" />
      <ellipse cx="100" cy="200" rx="50" ry="15" fill={texture.accentColor} opacity="0.95" />
      {/* Craters */}
      {Array.from({ length: 8 }).map((_, i) => {
        const x = Math.random() * 200;
        const y = Math.random() * 200;
        const r = Math.random() * 8 + 3;
        return (
          <circle key={`crater-${i}`} cx={x} cy={y} r={r} fill="oklch(0.25 0.03 25)" opacity="0.5" />
        );
      })}
    </>
  );
}

/* JUPITER — dramatic horizontal bands + Great Red Spot */
function GasBandedJupiter({ texture, id }: { texture: PlanetTexture; id: string }) {
  return (
    <>
      {/* Horizontal bands (alternating colors) */}
      {Array.from({ length: 11 }).map((_, i) => {
        const y = (i / 11) * 200;
        const h = 200 / 11 + 1;
        const isDark = i % 2 === 0;
        return (
          <rect
            key={i}
            x="-5"
            y={y}
            width="210"
            height={h}
            fill={isDark ? texture.secondaryColor : texture.baseColor}
            opacity={isDark ? 0.85 : 0.95}
          />
        );
      })}
      {/* Turbulent swirls between bands */}
      {Array.from({ length: 18 }).map((_, i) => {
        const x = Math.random() * 200;
        const y = Math.random() * 200;
        return (
          <ellipse
            key={`swirl-${i}`}
            cx={x}
            cy={y}
            rx={Math.random() * 20 + 8}
            ry={Math.random() * 4 + 2}
            fill={i % 3 === 0 ? texture.accentColor : texture.secondaryColor}
            opacity={Math.random() * 0.4 + 0.2}
            transform={`rotate(${Math.random() * 10 - 5} ${x} ${y})`}
          />
        );
      })}
      {/* Great Red Spot (iconic storm) */}
      <g transform="rotate(-8 140 120)">
        <ellipse cx="140" cy="120" rx="24" ry="12" fill={texture.accentColor} opacity="0.95" />
        <ellipse cx="140" cy="120" rx="20" ry="9" fill="oklch(0.55 0.22 20)" opacity="0.85" />
        <ellipse cx="138" cy="118" rx="14" ry="6" fill="oklch(0.45 0.24 18)" opacity="0.8" />
        <ellipse cx="138" cy="118" rx="9" ry="4" fill="oklch(0.35 0.22 18)" opacity="0.7" />
        {/* Storm ring swirl */}
        <ellipse cx="140" cy="120" rx="24" ry="12" fill="none" stroke="oklch(0.60 0.22 25)" strokeWidth="0.8" opacity="0.5" />
      </g>
    </>
  );
}

/* SATURN — softer bands, no big storm */
function GasBandedSaturn({ texture, id }: { texture: PlanetTexture; id: string }) {
  return (
    <>
      {/* Soft horizontal bands */}
      {Array.from({ length: 9 }).map((_, i) => {
        const y = (i / 9) * 200;
        const h = 200 / 9 + 1;
        const isDark = i % 2 === 0;
        return (
          <rect
            key={i}
            x="-5"
            y={y}
            width="210"
            height={h}
            fill={isDark ? texture.secondaryColor : texture.baseColor}
            opacity={isDark ? 0.7 : 0.9}
          />
        );
      })}
      {/* Subtle swirls */}
      {Array.from({ length: 10 }).map((_, i) => {
        const x = Math.random() * 200;
        const y = Math.random() * 200;
        return (
          <ellipse
            key={`swirl-${i}`}
            cx={x}
            cy={y}
            rx={Math.random() * 18 + 8}
            ry={Math.random() * 3 + 2}
            fill={texture.accentColor}
            opacity={Math.random() * 0.25 + 0.15}
            transform={`rotate(${Math.random() * 6 - 3} ${x} ${y})`}
          />
        );
      })}
    </>
  );
}

/* URANUS — pale cyan, very smooth, faint banding */
function IceGiantUranus({ texture, id }: { texture: PlanetTexture; id: string }) {
  return (
    <>
      {/* Very subtle bands (vertical because Uranus rotates on its side) */}
      {Array.from({ length: 6 }).map((_, i) => {
        const x = (i / 6) * 200;
        const w = 200 / 6 + 1;
        const isAccent = i % 2 === 0;
        return (
          <rect
            key={i}
            x={x}
            y="-5"
            width={w}
            height="210"
            fill={isAccent ? texture.accentColor : texture.secondaryColor}
            opacity={isAccent ? 0.15 : 0.2}
          />
        );
      })}
      {/* Subtle cloud spots */}
      {Array.from({ length: 5 }).map((_, i) => {
        const x = Math.random() * 200;
        const y = Math.random() * 200;
        const r = Math.random() * 14 + 6;
        return (
          <circle key={`spot-${i}`} cx={x} cy={y} r={r} fill={texture.accentColor} opacity="0.18" />
        );
      })}
    </>
  );
}

/* NEPTUNE — deep blue with dark storm spot and visible bands */
function IceGiantNeptune({ texture, id }: { texture: PlanetTexture; id: string }) {
  return (
    <>
      {/* Bands */}
      {Array.from({ length: 7 }).map((_, i) => {
        const y = (i / 7) * 200;
        const h = 200 / 7 + 1;
        const isDark = i % 2 === 0;
        return (
          <rect
            key={i}
            x="-5"
            y={y}
            width="210"
            height={h}
            fill={isDark ? texture.secondaryColor : texture.baseColor}
            opacity={isDark ? 0.7 : 0.85}
          />
        );
      })}
      {/* Great Dark Spot */}
      <ellipse
        cx="65"
        cy="80"
        rx="18"
        ry="9"
        fill="oklch(0.20 0.10 250)"
        opacity="0.7"
        transform="rotate(-12 65 80)"
      />
      {/* White cloud streaks */}
      {Array.from({ length: 6 }).map((_, i) => {
        const x = Math.random() * 200;
        const y = Math.random() * 200;
        return (
          <ellipse
            key={`streak-${i}`}
            cx={x}
            cy={y}
            rx={Math.random() * 15 + 8}
            ry={Math.random() * 2 + 1}
            fill={texture.accentColor}
            opacity="0.4"
            transform={`rotate(${Math.random() * 8 - 4} ${x} ${y})`}
          />
        );
      })}
    </>
  );
}
