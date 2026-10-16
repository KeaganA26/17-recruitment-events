"use client";

import { useEffect, useRef } from "react";

type Piece = {
  x: number;
  y: number;
  w: number;
  h: number;
  ax: number;
  ay: number;
  speed: number;
  drift: number;
  phase: number;
};

type ConfettiData = {
  width: number;
  height: number;
  pieces: Piece[];
};

export function HeroConfetti() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext("2d");
    if (!context) return;

    let frame = 0;
    let stopped = false;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const atlas = new Image();
    atlas.src = "/hero-pieces.webp";

    const ready = Promise.all([
      fetch("/hero-pieces.json").then((response) => response.json() as Promise<ConfettiData>),
      new Promise<void>((resolve, reject) => {
        atlas.onload = () => resolve();
        atlas.onerror = () => reject(new Error("Could not load confetti"));
      }),
    ]);

    ready.then(([data]) => {
      if (stopped) return;
      const started = performance.now();

      const draw = (now: number) => {
        if (stopped) return;
        const parent = canvas.parentElement;
        if (!parent) return;
        const width = parent.clientWidth;
        const height = parent.clientHeight;
        const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
        const bitmapWidth = Math.round(width * pixelRatio);
        const bitmapHeight = Math.round(height * pixelRatio);
        if (canvas.width !== bitmapWidth || canvas.height !== bitmapHeight) {
          canvas.width = bitmapWidth;
          canvas.height = bitmapHeight;
        }

        context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
        context.clearRect(0, 0, width, height);

        const scale = Math.max(width / data.width, height / data.height);
        const offsetX = (width - data.width * scale) / 2;
        const offsetY = (height - data.height * scale) / 2;
        const elapsed = reduced ? 0 : (now - started) / 1000;
        const center = data.width / 2;

        for (const piece of data.pieces) {
          const size = Math.max(piece.w, piece.h);
          const fallSpeed = 14 + Math.min(size, 70) * 0.38;
          const span = data.height + piece.h + 80;
          const traveled = piece.y + elapsed * fallSpeed;
          const y = ((traveled + piece.h) % span + span) % span - piece.h;
          const outward = (piece.x - center) / center;
          const sway =
            Math.sin(elapsed * (0.55 + piece.phase * 0.7) + piece.phase * Math.PI * 2) *
            (14 + size * 0.22);
          const flowX = outward * elapsed * 10 + sway;
          const spinDirection = piece.phase > 0.5 ? 1 : -1;
          const spin =
            spinDirection *
            elapsed *
            (size > 80 ? 0.12 : 0.28 + (size % 9) * 0.06);
          const drawWidth = piece.w * scale;
          const drawHeight = piece.h * scale;
          const drawX = offsetX + (piece.x + piece.w / 2 + flowX) * scale;
          const drawY = offsetY + (y + piece.h / 2) * scale;

          context.save();
          context.translate(drawX, drawY);
          context.rotate(spin);
          context.drawImage(
            atlas,
            piece.ax,
            piece.ay,
            piece.w,
            piece.h,
            -drawWidth / 2,
            -drawHeight / 2,
            drawWidth,
            drawHeight
          );
          context.restore();
        }

        frame = window.requestAnimationFrame(draw);
      };

      frame = window.requestAnimationFrame(draw);
    }).catch(() => {
      // The still background remains if the pieces cannot load.
    });

    return () => {
      stopped = true;
      window.cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none absolute inset-0 h-full w-full"
      aria-hidden="true"
    />
  );
}
