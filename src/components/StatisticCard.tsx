"use client";

import { useEffect, useRef, useState } from "react";
import { useInView, useReducedMotion } from "framer-motion";

type StatisticCardProps = {
  value: number;
  suffix?: string;
  label: string;
};

export function StatisticCard({ value, suffix = "", label }: StatisticCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const reduceMotion = useReducedMotion();
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!inView) return;
    if (reduceMotion) {
      setDisplay(value);
      return;
    }

    const duration = 900;
    const start = performance.now();

    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      setDisplay(Math.round(value * progress));
      if (progress < 1) requestAnimationFrame(tick);
    };

    const frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [inView, reduceMotion, value]);

  return (
    <div ref={ref} className="text-center">
      <p className="font-heading text-4xl font-extrabold text-white md:text-5xl">
        {display.toLocaleString("en-GB")}
        {suffix}
      </p>
      <p className="mt-2 text-sm font-medium tracking-wide text-white/65 uppercase">
        {label}
      </p>
    </div>
  );
}
