#!/usr/bin/env python3
"""Search and download images for all locations via z-ai image-search."""
import subprocess
import json
import re
import os
import time
from pathlib import Path

LOCATIONS = [
    ("atacama", "Milky Way galaxy over Atacama Desert Chile night sky astrophotography"),
    ("mauna-kea", "Mauna Kea observatory telescopes Hawaii sunset stars"),
    ("jodrell-bank", "Jodrell Bank Lovell radio telescope observatory UK"),
    ("cherry-springs", "Cherry Springs state park Pennsylvania dark sky Milky Way stargazing"),
    ("tteide", "Teide National Park Tenerife Milky Way above clouds observatory"),
    ("kagura", "winter night sky stars Japan snow mountains stargazing"),
    ("herschel", "Georgian house museum Bath England historic astronomy telescope"),
    ("kennedy", "Kennedy Space Center rocket launch NASA Florida"),
    ("hayden", "Hayden Planetarium American Museum Natural History New York sphere"),
    ("namib", "Namib desert Namibia dunes Milky Way stars night sky"),
    ("alma", "ALMA observatory radio telescopes Atacama Chile antennas"),
    ("kiruna", "Northern Lights aurora borealis Sweden Kiruna snow"),
    ("hakos", "Namibia night sky stars telescope astrophotography observatory"),
    ("kopernik", "Planetarium observatory dome building USA science center"),
]

OUT_DIR = Path("/home/z/my-project/public/images/locations")
OUT_DIR.mkdir(parents=True, exist_ok=True)

def search_image(query: str) -> dict | None:
    """Run z-ai image-search and parse output."""
    try:
        result = subprocess.run(
            ["z-ai", "image-search", "-q", query, "--count", "3", "--gl", "us", "--no-rank"],
            capture_output=True, text=True, timeout=180,
        )
        output = result.stdout + result.stderr
        # Find the JSON block
        json_match = re.search(r'\{\s*"success"\s*:\s*true[\s\S]*?\n\}', output)
        if json_match:
            data = json.loads(json_match.group(0))
            if data.get("results"):
                return data["results"][0]
        return None
    except Exception as e:
        print(f"  Error: {e}")
        return None

def download_image(url: str, dest: Path) -> bool:
    """Download an image with curl."""
    try:
        result = subprocess.run(
            ["curl", "-sSL", "-o", str(dest), url],
            timeout=60,
        )
        return dest.exists() and dest.stat().st_size > 1000
    except Exception as e:
        print(f"  Download error: {e}")
        return False

def main():
    results = {}
    for loc_id, query in LOCATIONS:
        print(f"\n→ {loc_id}: {query}")
        result = search_image(query)
        if not result:
            print(f"  No results")
            continue
        url = result["original_url"]
        ext = ".jpg"
        if ".jpeg" in url: ext = ".jpeg"
        elif ".png" in url: ext = ".png"
        dest = OUT_DIR / f"{loc_id}{ext}"
        if download_image(url, dest):
            print(f"  ✓ Saved {dest.name} ({result.get('original_width','?')}x{result.get('original_height','?')})")
            results[loc_id] = f"/images/locations/{dest.name}"
        else:
            print(f"  ✗ Download failed")
        time.sleep(2)  # be polite with API
    
    # Save mapping
    mapping_path = Path("/home/z/my-project/src/lib/data/location-images.json")
    mapping_path.write_text(json.dumps(results, indent=2))
    print(f"\n✓ Mapping saved to {mapping_path}")
    print(f"Total images downloaded: {len(results)}")

if __name__ == "__main__":
    main()
