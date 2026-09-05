#!/usr/bin/env python3
"""Search and download images for events, planets/objects, and hero."""
import subprocess
import json
import re
import time
from pathlib import Path

# Events
EVENTS = [
    ("evt-perseids", "Perseid meteor shower night sky shooting stars astrophotography"),
    ("evt-eclipse", "total solar eclipse corona sun moon sky"),
    ("evt-spacex", "Falcon Heavy rocket launch Florida SpaceX"),
    ("evt-aurora", "aurora borealis northern lights green sky Norway Iceland"),
    ("evt-lunar", "total lunar eclipse blood moon red sky"),
    ("evt-conjunct", "Jupiter Venus conjunction night sky crescent moon"),
    ("evt-fest", "astronomy festival stargazing party telescopes dark sky park"),
    ("evt-iss", "International Space Station ISS pass night sky star trail"),
    ("evt-geminids", "Geminid meteor shower night sky multiple shooting stars"),
]

# Cosmic objects
COSMIC = [
    ("andromeda", "Andromeda galaxy M31 spiral deep space Hubble"),
    ("orion-nebula", "Orion Nebula M42 deep space colorful gas clouds"),
    ("sagittarius-a", "supermassive black hole galaxy center visualization"),
    ("proxima-b", "exoplanet alien planet red dwarf star Proxima Centauri artist"),
    ("sirius", "Sirius brightest star night sky Dog Star constellation"),
    ("orion-const", "Orion constellation night sky Betelgeuse Rigel stars"),
    ("jwst", "James Webb Space Telescope gold mirror sunshield in space"),
    ("artemis", "Artemis NASA moon mission Space Launch System rocket"),
    ("armstrong", "Neil Armstrong astronaut moon Apollo 11 footprint"),
]

OUT_DIR_EVENTS = Path("/home/z/my-project/public/images/events")
OUT_DIR_COSMIC = Path("/home/z/my-project/public/images/cosmic")
OUT_DIR_EVENTS.mkdir(parents=True, exist_ok=True)
OUT_DIR_COSMIC.mkdir(parents=True, exist_ok=True)

def search_image(query: str) -> dict | None:
    try:
        result = subprocess.run(
            ["z-ai", "image-search", "-q", query, "--count", "3", "--gl", "us", "--no-rank"],
            capture_output=True, text=True, timeout=180,
        )
        output = result.stdout + result.stderr
        json_match = re.search(r'\{\s*"success"\s*:\s*true[\s\S]*?\n\}', output)
        if json_match:
            data = json.loads(json_match.group(0))
            if data.get("results"):
                return data["results"][0]
    except Exception as e:
        print(f"  Error: {e}")
    return None

def download_image(url: str, dest: Path) -> bool:
    try:
        subprocess.run(["curl", "-sSL", "-o", str(dest), url], timeout=60)
        return dest.exists() and dest.stat().st_size > 1000
    except Exception as e:
        print(f"  Download error: {e}")
    return False

def process(items, out_dir, mapping_key):
    results = {}
    for loc_id, query in items:
        print(f"\n→ {loc_id}: {query}")
        result = search_image(query)
        if not result:
            print(f"  No results")
            continue
        url = result["original_url"]
        ext = ".jpg"
        if ".jpeg" in url: ext = ".jpeg"
        elif ".png" in url: ext = ".png"
        dest = out_dir / f"{loc_id}{ext}"
        if download_image(url, dest):
            print(f"  ✓ {dest.name} ({result.get('original_width','?')}x{result.get('original_height','?')})")
            results[loc_id] = f"/images/{mapping_key}/{dest.name}"
        time.sleep(2)
    return results

if __name__ == "__main__":
    event_results = process(EVENTS, OUT_DIR_EVENTS, "events")
    cosmic_results = process(COSMIC, OUT_DIR_COSMIC, "cosmic")
    
    all_results = {**event_results, **cosmic_results}
    out_path = Path("/home/z/my-project/src/lib/data/all-images.json")
    out_path.write_text(json.dumps({
        "events": event_results,
        "cosmic": cosmic_results,
    }, indent=2))
    print(f"\n✓ Saved mapping. Total: {len(all_results)} images.")
