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

type Particle = Piece & {
  depth: number;
  swayAmp: number;
  swayFreq: number;
  flipFreq: number;
  spinRate: number;
  cluster: boolean;
  px: number;
  py: number;
  age: number;
};

type Burst = { x: number; y: number; reach: number; strength: number; weight: number };

const CLUSTER_SIZE = 60;
const FADE_IN = 0.9;

// Burst centres in the 1600x1068 artboard, matching the confetti clouds in hero-bg.jpg.
const BURSTS: Burst[] = [
  { x: 690, y: 330, reach: 420, strength: 46, weight: 0.55 },
  { x: 1270, y: 545, reach: 300, strength: 30, weight: 0.25 },
  { x: 285, y: 175, reach: 260, strength: 26, weight: 0.2 },
];

function prepare(pieces: Piece[]): Particle[] {
  return pieces
    .map((piece) => {
      const size = Math.max(piece.w, piece.h);
      const depth = Math.min(size, 70) / 70;
      const cluster = size > CLUSTER_SIZE;
      const seed = piece.phase * 997;
      return {
        ...piece,
        depth,
        cluster,
        swayAmp: cluster ? 4 : 6 + depth * 14,
        swayFreq: 0.35 + (seed % 5) * 0.08,
        flipFreq: cluster ? 0 : 1.1 + (seed % 9) * 0.22,
        spinRate: cluster ? 0.03 : (piece.phase > 0.5 ? 1 : -1) * (0.25 + (seed % 6) * 0.09),
        px: piece.x + piece.w / 2,
        py: piece.y + piece.h / 2,
        age: FADE_IN,
      };
    })
    .sort((a, b) => a.depth - b.depth);
}

function pickBurst() {
  let roll = Math.random();
  for (const burst of BURSTS) {
    roll -= burst.weight;
    if (roll <= 0) return burst;
  }
  return BURSTS[0];
}

function respawn(p: Particle) {
  const burst = pickBurst();
  const angle = Math.random() * Math.PI * 2;
  const radius = Math.sqrt(Math.random()) * burst.reach * 0.35;
  p.px = burst.x + Math.cos(angle) * radius;
  p.py = burst.y + Math.sin(angle) * radius * 0.7;
  p.age = 0;
}

function flow(x: number, y: number, time: number, depth: number) {
  let vx = 0;
  let vy = 16 + depth * 30;
  for (const burst of BURSTS) {
    const dx = x - burst.x;
    const dy = y - burst.y;
    const distance = Math.hypot(dx, dy) + 1;
    const push = burst.strength * Math.exp(-distance / burst.reach);
    vx += (dx / distance) * push;
    vy += (dy / distance) * push * (dy < 0 ? 0.45 : 0.8);
  }
  vx += Math.sin(y * 0.004 + time * 0.3) * 7;
  vy += Math.cos(x * 0.003 + time * 0.22) * 4;
  const pace = 0.55 + depth * 0.7;
  return { vx: vx * pace, vy: vy * pace };
}

export function HeroConfetti() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext("2d");
    if (!context) return;

    let frame = 0;
    let stopped = false;
    let visible = true;
    let running = false;
    let last = 0;
    let time = 0;
    const pointer = { x: 0, y: 0, tx: 0, ty: 0 };
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const atlas = new Image();
    atlas.src = "/hero-pieces.webp";

    const onPointerMove = (event: PointerEvent) => {
      pointer.tx = event.clientX / window.innerWidth - 0.5;
      pointer.ty = event.clientY / window.innerHeight - 0.5;
    };

    const ready = Promise.all([
      fetch("/hero-pieces.json").then((response) => response.json() as Promise<ConfettiData>),
      new Promise<void>((resolve, reject) => {
        atlas.onload = () => resolve();
        atlas.onerror = () => reject(new Error("Could not load confetti"));
      }),
    ]);

    let start = () => {};

    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) start();
    });
    observer.observe(canvas);

    const onVisibility = () => {
      if (!document.hidden) start();
    };
    document.addEventListener("visibilitychange", onVisibility);

    ready.then(([data]) => {
      if (stopped) return;
      const particles = prepare(data.pieces);
      if (!reduced) window.addEventListener("pointermove", onPointerMove, { passive: true });

      const draw = (now: number) => {
        if (stopped || !visible || document.hidden) {
          running = false;
          return;
        }
        const parent = canvas.parentElement;
        if (!parent) return;

        const dt = reduced ? 0 : Math.min((now - last) / 1000, 0.05);
        last = now;
        time += dt;

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

        pointer.x += (pointer.tx - pointer.x) * Math.min(dt * 3, 1);
        pointer.y += (pointer.ty - pointer.y) * Math.min(dt * 3, 1);

        const scale = Math.max(width / data.width, height / data.height);
        const offsetX = (width - data.width * scale) / 2;
        const offsetY = (height - data.height * scale) / 2;
        const intro = reduced ? 1 : Math.min(time / 1.2, 1);
        const fadeBand = 110;

        for (const p of particles) {
          if (!p.cluster && dt > 0) {
            const { vx, vy } = flow(p.px, p.py, time, p.depth);
            p.px += vx * dt;
            p.py += vy * dt;
            p.age += dt;
            if (
              p.py > data.height + p.h ||
              p.py < -p.h - 120 ||
              p.px < -p.w - 80 ||
              p.px > data.width + p.w + 80
            ) {
              respawn(p);
            }
          }

          const sway =
            Math.sin(time * p.swayFreq + p.phase * Math.PI * 2) * p.swayAmp;
          const breathe = p.cluster ? Math.sin(time * 0.4 + p.phase * 6) * 3 : 0;
          const parallax = 6 + p.depth * 22;

          const drawX = offsetX + (p.px + sway + pointer.x * parallax) * scale;
          const drawY = offsetY + (p.py + breathe + pointer.y * parallax) * scale;

          const flip = p.flipFreq ? Math.cos(time * p.flipFreq + p.phase * 11) : 1;
          const tumble = 0.25 + 0.75 * Math.abs(flip);
          const shimmer = p.flipFreq ? 0.72 + 0.28 * Math.abs(flip) : 1;

          const edge = Math.min(
            (p.py + p.h) / fadeBand,
            (data.height - p.py) / fadeBand,
            (p.px + p.w) / fadeBand,
            (data.width - p.px) / fadeBand,
            1
          );
          const spawn = Math.min(p.age / FADE_IN, 1);
          const alpha = Math.max(edge, 0) * intro * shimmer * spawn;
          if (alpha <= 0.01) continue;

          const drawWidth = p.w * scale;
          const drawHeight = p.h * scale;

          context.globalAlpha = alpha;
          context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
          context.translate(drawX, drawY);
          context.rotate(time * p.spinRate + p.phase * 6);
          context.scale(1, tumble);
          context.drawImage(
            atlas,
            p.ax,
            p.ay,
            p.w,
            p.h,
            -drawWidth / 2,
            -drawHeight / 2,
            drawWidth,
            drawHeight
          );
        }
        context.globalAlpha = 1;

        frame = window.requestAnimationFrame(draw);
      };

      start = () => {
        if (running || stopped || !visible || document.hidden) return;
        running = true;
        last = performance.now();
        frame = window.requestAnimationFrame(draw);
      };
      start();
    }).catch(() => {
      // The still background remains if the pieces cannot load.
    });

    return () => {
      stopped = true;
      window.cancelAnimationFrame(frame);
      observer.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("pointermove", onPointerMove);
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
