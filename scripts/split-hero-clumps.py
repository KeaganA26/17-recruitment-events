"""Split the large confetti clumps in the hero atlas into individual pieces."""

from __future__ import annotations

import json
from collections import deque
from pathlib import Path

import numpy as np
from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
ATLAS_PATH = ROOT / "public" / "hero-pieces.webp"
DATA_PATH = ROOT / "public" / "hero-pieces.json"

SPLIT_SIZE = 28
BRIGHT = (70, 95, 120, 145)
MIN_SEED = 6
MIN_PIECE = 14
PAD = 1
SHEET_W = 2048

NEIGHBORS = ((1, 0), (-1, 0), (0, 1), (0, -1))


def components(mask: np.ndarray) -> list[list[tuple[int, int]]]:
    height, width = mask.shape
    seen = np.zeros_like(mask, dtype=bool)
    found = []
    for y, x in zip(*np.nonzero(mask)):
        if seen[y, x]:
            continue
        stack = [(y, x)]
        seen[y, x] = True
        pixels = []
        while stack:
            cy, cx = stack.pop()
            pixels.append((cy, cx))
            for dy, dx in NEIGHBORS:
                ny, nx = cy + dy, cx + dx
                if 0 <= ny < height and 0 <= nx < width and mask[ny, nx] and not seen[ny, nx]:
                    seen[ny, nx] = True
                    stack.append((ny, nx))
        found.append(pixels)
    return found


def split_sprite(sprite: np.ndarray) -> list[np.ndarray]:
    """Return one boolean mask per piece found inside the sprite."""
    alpha = sprite[:, :, 3] > 0
    rgb = sprite[:, :, :3].astype(np.float32)
    luminance = 0.2126 * rgb[:, :, 0] + 0.7152 * rgb[:, :, 1] + 0.0722 * rgb[:, :, 2]
    seeds: list[list[tuple[int, int]]] = []
    for threshold in BRIGHT:
        seeds = [c for c in components(alpha & (luminance > threshold)) if len(c) >= MIN_SEED]
        if len(seeds) >= 2:
            break
    if len(seeds) < 2:
        return [alpha]

    # Grow every bright seed across the clump so the dark edge pixels go to the nearest piece.
    labels = np.full(alpha.shape, -1, dtype=np.int32)
    queue: deque[tuple[int, int]] = deque()
    for index, seed in enumerate(seeds):
        for y, x in seed:
            labels[y, x] = index
            queue.append((y, x))
    height, width = alpha.shape
    while queue:
        y, x = queue.popleft()
        for dy, dx in NEIGHBORS:
            ny, nx = y + dy, x + dx
            if 0 <= ny < height and 0 <= nx < width and alpha[ny, nx] and labels[ny, nx] < 0:
                labels[ny, nx] = labels[y, x]
                queue.append((ny, nx))
    return [labels == index for index in range(len(seeds))]


def main() -> None:
    atlas = np.array(Image.open(ATLAS_PATH).convert("RGBA"))
    data = json.loads(DATA_PATH.read_text(encoding="utf-8"))

    sprites = [
        (
            piece["x"],
            piece["y"],
            atlas[piece["ay"] : piece["ay"] + piece["h"], piece["ax"] : piece["ax"] + piece["w"]].copy(),
        )
        for piece in data["pieces"]
    ]

    for _ in range(4):
        split = []
        for sx, sy, sprite in sprites:
            if max(sprite.shape[:2]) <= SPLIT_SIZE:
                split.append((sx, sy, sprite))
                continue
            for mask in split_sprite(sprite):
                ys, xs = np.nonzero(mask)
                if len(ys) < MIN_PIECE:
                    continue
                y0, y1, x0, x1 = ys.min(), ys.max() + 1, xs.min(), xs.max() + 1
                part = np.zeros((y1 - y0 + PAD * 2, x1 - x0 + PAD * 2, 4), dtype=np.uint8)
                crop = sprite[y0:y1, x0:x1].copy()
                crop[~mask[y0:y1, x0:x1]] = 0
                part[PAD:-PAD, PAD:-PAD] = crop
                split.append((sx + x0 - PAD, sy + y0 - PAD, part))
        if len(split) == len(sprites):
            break
        sprites = split

    sprites.sort(key=lambda item: item[2].shape[0] * item[2].shape[1], reverse=True)

    x = y = row_h = 0
    placed = []
    for sx, sy, sprite in sprites:
        ph, pw = sprite.shape[:2]
        if x + pw > SHEET_W:
            y += row_h
            x = row_h = 0
        placed.append((sx, sy, sprite, x, y))
        x += pw
        row_h = max(row_h, ph)
    sheet_h = y + row_h

    sheet = np.zeros((sheet_h, SHEET_W, 4), dtype=np.uint8)
    records = []
    for index, (sx, sy, sprite, ax, ay) in enumerate(placed):
        ph, pw = sprite.shape[:2]
        sheet[ay : ay + ph, ax : ax + pw] = sprite
        size = max(pw, ph)
        records.append(
            {
                "x": int(sx),
                "y": int(sy),
                "w": int(pw),
                "h": int(ph),
                "ax": int(ax),
                "ay": int(ay),
                "speed": round(42 + (size % 17) * 3.2, 2),
                "drift": round(((index * 17) % 11) - 5, 2),
                "phase": round((index % 23) / 23, 3),
            }
        )

    before = len(data["pieces"])
    Image.fromarray(sheet).save(ATLAS_PATH, quality=82, method=6)
    data.update({"atlasWidth": SHEET_W, "atlasHeight": sheet_h, "pieces": records})
    DATA_PATH.write_text(json.dumps(data), encoding="utf-8")

    sizes = sorted(max(r["w"], r["h"]) for r in records)
    print(f"pieces {before} -> {len(records)} atlas {SHEET_W}x{sheet_h}")
    print(f"largest {sizes[-5:]} median {sizes[len(sizes) // 2]}")


if __name__ == "__main__":
    main()
