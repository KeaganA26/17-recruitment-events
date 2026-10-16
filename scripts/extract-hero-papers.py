"""Split the hero photo into a still background and the confetti pieces."""

from __future__ import annotations

import json
from pathlib import Path

import numpy as np
from PIL import Image, ImageFilter

ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "public" / "hero-source.jpg"
BG_PATH = ROOT / "public" / "hero-bg.jpg"
ATLAS_PATH = ROOT / "public" / "hero-pieces.webp"
DATA_PATH = ROOT / "public" / "hero-pieces.json"
PREVIEW_PATH = ROOT / "public" / "hero-preview.jpg"


def connected_pieces(mask: np.ndarray, min_area: int = 18, max_box: int = 90):
    height, width = mask.shape
    visited = np.zeros((height, width), dtype=np.uint8)
    ys, xs = np.nonzero(mask)
    pieces = []
    neighbors = ((1, 0), (-1, 0), (0, 1), (0, -1))

    for y, x in zip(ys.tolist(), xs.tolist()):
        if visited[y, x]:
            continue
        stack = [(y, x)]
        visited[y, x] = 1
        pixels: list[tuple[int, int]] = []
        minx = maxx = x
        miny = maxy = y
        while stack:
            cy, cx = stack.pop()
            pixels.append((cy, cx))
            if cx < minx:
                minx = cx
            if cx > maxx:
                maxx = cx
            if cy < miny:
                miny = cy
            if cy > maxy:
                maxy = cy
            for dy, dx in neighbors:
                ny, nx = cy + dy, cx + dx
                if (
                    0 <= ny < height
                    and 0 <= nx < width
                    and mask[ny, nx]
                    and not visited[ny, nx]
                ):
                    visited[ny, nx] = 1
                    stack.append((ny, nx))
        box_w = maxx - minx + 1
        box_h = maxy - miny + 1
        if len(pixels) < min_area or box_w > max_box or box_h > max_box:
            continue
        pieces.append(
            {
                "pixels": pixels,
                "x": minx,
                "y": miny,
                "w": box_w,
                "h": box_h,
            }
        )
    return pieces


def blur_array(values: np.ndarray, radius: int) -> np.ndarray:
    return np.asarray(
        Image.fromarray(np.clip(values, 0, 255).astype(np.uint8)).filter(
            ImageFilter.GaussianBlur(radius)
        ),
        dtype=np.float32,
    )


def fill_holes(image: np.ndarray, hole: np.ndarray) -> np.ndarray:
    rgb = image.copy()
    remaining = hole.copy()
    for shift in (19, -27, 41, -53, 67, -81):
        donor = np.roll(image, shift, axis=1)
        donor_hole = np.roll(hole, shift, axis=1)
        use = remaining & ~donor_hole
        rgb[use] = donor[use]
        remaining[use] = False
        if not remaining.any():
            break
    soft = rgb.astype(np.float32)
    blurred = np.stack(
        [blur_array(soft[:, :, channel], 2) for channel in range(3)],
        axis=-1,
    )
    # Soften only the patched pixels so the copied edges don't read as a cut-out.
    soft[hole] = soft[hole] * 0.35 + blurred[hole] * 0.65
    return np.clip(soft, 0, 255).astype(np.uint8)


def main() -> None:
    image = Image.open(SOURCE).convert("RGB")
    pixels = np.asarray(image)
    luminance = (
        0.2126 * pixels[:, :, 0] + 0.7152 * pixels[:, :, 1] + 0.0722 * pixels[:, :, 2]
    ).astype(np.float32)
    blur = np.asarray(
        Image.fromarray(luminance.astype(np.uint8)).filter(ImageFilter.GaussianBlur(6)),
        dtype=np.float32,
    )
    height, width = luminance.shape
    mask = (luminance - blur > 22) & (luminance > 75)
    mask[int(height * 0.66) :, :] = False
    mask[: int(height * 0.18), int(width * 0.78) :] = False
    dilated = np.asarray(
        Image.fromarray((mask.astype(np.uint8) * 255)).filter(ImageFilter.MaxFilter(5))
    )
    mask = dilated > 0

    pieces = connected_pieces(mask, min_area=20, max_box=140)
    pieces.sort(key=lambda piece: piece["h"] * piece["w"], reverse=True)
    print("candidates", len(pieces))
    pieces = pieces[:900]

    hole = np.zeros(mask.shape, dtype=bool)
    for piece in pieces:
        for y, x in piece["pixels"]:
            hole[y, x] = True
    background = fill_holes(pixels, hole)
    Image.fromarray(background).save(BG_PATH, quality=86, optimize=True)

    pad = 1
    sheet_w = 2048
    x = y = row_h = 0
    placed = []
    for piece in pieces:
        pw, ph = piece["w"] + pad * 2, piece["h"] + pad * 2
        if x + pw > sheet_w:
            y += row_h
            x = 0
            row_h = 0
        placed.append((piece, x, y, pw, ph))
        x += pw
        row_h = max(row_h, ph)
    sheet_h = y + row_h
    atlas = Image.new("RGBA", (sheet_w, sheet_h), (0, 0, 0, 0))
    atlas_px = np.array(atlas)
    records = []
    for index, (piece, ax, ay, pw, ph) in enumerate(placed):
        sprite = np.zeros((ph, pw, 4), dtype=np.uint8)
        for py, px in piece["pixels"]:
            sy = py - piece["y"] + pad
            sx = px - piece["x"] + pad
            sprite[sy, sx, :3] = pixels[py, px]
            sprite[sy, sx, 3] = 255
        atlas_px[ay : ay + ph, ax : ax + pw] = sprite
        size = max(piece["w"], piece["h"])
        records.append(
            {
                "x": piece["x"] - pad,
                "y": piece["y"] - pad,
                "w": pw,
                "h": ph,
                "ax": ax,
                "ay": ay,
                "speed": round(42 + (size % 17) * 3.2, 2),
                "drift": round(((index * 17) % 11) - 5, 2),
                "phase": round((index % 23) / 23, 3),
            }
        )
    Image.fromarray(atlas_px).save(ATLAS_PATH, quality=82, method=6)

    data = {
        "width": width,
        "height": height,
        "atlasWidth": sheet_w,
        "atlasHeight": sheet_h,
        "pieces": records,
    }
    DATA_PATH.write_text(json.dumps(data), encoding="utf-8")

    preview = background.copy()
    shift = 90
    for piece in pieces:
        for py, px in piece["pixels"]:
            ny = py + shift
            if 0 <= ny < height:
                preview[ny, px] = pixels[py, px]
    Image.fromarray(preview).save(PREVIEW_PATH, quality=82)
    Image.fromarray(background[80:520, 40:700]).save(ROOT / "public" / "hero-crop-bg.jpg", quality=85)
    Image.fromarray(pixels[80:520, 40:700]).save(ROOT / "public" / "hero-crop-src.jpg", quality=85)
    print(f"pieces {len(records)} atlas {sheet_w}x{sheet_h}")
    print(BG_PATH.stat().st_size, ATLAS_PATH.stat().st_size, DATA_PATH.stat().st_size)


if __name__ == "__main__":
    main()
