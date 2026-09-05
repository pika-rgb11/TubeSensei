#!/usr/bin/env python3
"""Add realistic texture data to each planet in cosmos.ts"""
import re
from pathlib import Path

# Each planet's texture parameters (realistic NASA-inspired)
TEXTURES = {
    "sun": {
        "kind": "star",
        "baseColor": "oklch(0.85 0.22 50)",
        "secondaryColor": "oklch(0.65 0.20 30)",
        "accentColor": "oklch(0.95 0.18 70)",
    },
    "mercury": {
        "kind": "rocky-cratered",
        "baseColor": "oklch(0.55 0.04 50)",
        "secondaryColor": "oklch(0.40 0.03 40)",
        "accentColor": "oklch(0.70 0.05 60)",
    },
    "venus": {
        "kind": "clouded-venus",
        "baseColor": "oklch(0.78 0.14 70)",
        "secondaryColor": "oklch(0.65 0.10 55)",
        "accentColor": "oklch(0.85 0.18 80)",
        "atmosphereColor": "oklch(0.85 0.14 70 / 0.6)",
    },
    "earth": {
        "kind": "earth-like",
        "baseColor": "oklch(0.55 0.16 220)",
        "secondaryColor": "oklch(0.45 0.18 145)",
        "accentColor": "oklch(0.95 0.04 250)",
        "atmosphereColor": "oklch(0.65 0.18 230 / 0.5)",
    },
    "mars": {
        "kind": "mars-like",
        "baseColor": "oklch(0.55 0.16 30)",
        "secondaryColor": "oklch(0.40 0.10 25)",
        "accentColor": "oklch(0.90 0.04 50)",
    },
    "jupiter": {
        "kind": "gas-banded-jupiter",
        "baseColor": "oklch(0.75 0.14 60)",
        "secondaryColor": "oklch(0.55 0.12 30)",
        "accentColor": "oklch(0.70 0.20 20)",
    },
    "saturn": {
        "kind": "gas-banded-saturn",
        "baseColor": "oklch(0.80 0.12 70)",
        "secondaryColor": "oklch(0.62 0.08 55)",
        "accentColor": "oklch(0.88 0.10 80)",
        "ringColor": "oklch(0.72 0.10 60 / 0.7)",
        "hasRing": True,
    },
    "uranus": {
        "kind": "ice-giant-uranus",
        "baseColor": "oklch(0.78 0.14 200)",
        "secondaryColor": "oklch(0.60 0.08 190)",
        "accentColor": "oklch(0.85 0.10 210)",
        "atmosphereColor": "oklch(0.78 0.14 200 / 0.4)",
    },
    "neptune": {
        "kind": "ice-giant-neptune",
        "baseColor": "oklch(0.55 0.16 250)",
        "secondaryColor": "oklch(0.40 0.14 260)",
        "accentColor": "oklch(0.65 0.18 240)",
        "atmosphereColor": "oklch(0.55 0.16 250 / 0.4)",
    },
}

def make_texture_string(planet_id):
    t = TEXTURES[planet_id]
    parts = [
        f'kind: "{t["kind"]}"',
        f'baseColor: "{t["baseColor"]}"',
        f'secondaryColor: "{t["secondaryColor"]}"',
        f'accentColor: "{t["accentColor"]}"',
    ]
    if "atmosphereColor" in t:
        parts.append(f'atmosphereColor: "{t["atmosphereColor"]}"')
    if "ringColor" in t:
        parts.append(f'ringColor: "{t["ringColor"]}"')
    if "hasRing" in t:
        parts.append(f'hasRing: {str(t["hasRing"]).lower()}')
    return "texture: { " + ", ".join(parts) + " },"

def main():
    p = Path("/home/z/my-project/src/lib/data/cosmos.ts")
    content = p.read_text()
    
    # For each planet, insert texture field right after the `gradient:` line
    for planet_id in TEXTURES:
        # Find the planet block by id
        pattern = rf'(id: "{planet_id}",[\s\S]*?gradient: [^\n]+\n)'
        match = re.search(pattern, content)
        if not match:
            print(f"WARNING: {planet_id} block not found")
            continue
        block = match.group(1)
        new_block = block + "    " + make_texture_string(planet_id) + "\n"
        content = content.replace(block, new_block)
    
    p.write_text(content)
    print("Done. Added texture to all 9 planets.")

if __name__ == "__main__":
    main()
