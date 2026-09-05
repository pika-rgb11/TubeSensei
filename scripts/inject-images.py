#!/usr/bin/env python3
"""Inject image paths into the data files (idempotent)."""
import json
import re
from pathlib import Path

with open("/home/z/my-project/src/lib/data/location-images.json") as f:
    location_imgs = json.load(f)

with open("/home/z/my-project/src/lib/data/all-images.json") as f:
    all_imgs = json.load(f)

# Idempotent injection: only add `image:` if not already present right after the id line
def inject(content: str, key: str, img_path: str) -> str:
    # First, normalize any existing duplicate `image: "..."` after id lines
    pattern = rf'(id: "{re.escape(key)}",)\s*\n\s*image: "[^"]*",'
    if re.search(pattern, content):
        # Replace the existing image line with our canonical one
        return re.sub(
            pattern,
            f'\\1\n    image: "{img_path}",',
            content,
            count=1,
        )
    # Otherwise inject fresh
    pattern2 = rf'(id: "{re.escape(key)}",)'
    return re.sub(
        pattern2,
        f'\\1\n    image: "{img_path}",',
        content,
        count=1,
    )

# Locations
loc_file = Path("/home/z/my-project/src/lib/data/locations.ts")
content = loc_file.read_text()
for loc_id, img_path in location_imgs.items():
    content = inject(content, loc_id, img_path)
loc_file.write_text(content)
print(f"✓ Patched locations.ts")

# Events
events_file = Path("/home/z/my-project/src/lib/data/events.ts")
content = events_file.read_text()
for evt_id, img_path in all_imgs["events"].items():
    content = inject(content, evt_id, img_path)
events_file.write_text(content)
print(f"✓ Patched events.ts")

# Cosmos
cosmos_file = Path("/home/z/my-project/src/lib/data/cosmos.ts")
content = cosmos_file.read_text()
for obj_id, img_path in all_imgs["cosmic"].items():
    content = inject(content, obj_id, img_path)
cosmos_file.write_text(content)
print(f"✓ Patched cosmos.ts")

print("Done!")
