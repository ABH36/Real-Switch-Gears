"use client";

import { useEffect, useState } from "react";
import { ChevronUp } from "lucide-react";

const BUTTON_SIZE = 56; // matches h-14 w-14
const SIZE = 64; // ring sits just outside the button edge
const STROKE = 3;
const RADIUS = SIZE / 2 - STROKE / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export default function ScrollToTop() {
  const [visible, setVisible] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      setVisible(window.scrollY > 400);

      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      const pct = scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0;
      setProgress(Math.min(100, Math.max(0, pct)));
    };
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!visible) return null;

  const dashoffset = CIRCUMFERENCE * (1 - progress / 100);

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      aria-label="Scroll to top"
      style={{ width: SIZE, height: SIZE }}
      className="fixed bottom-[92px] right-5 z-50 flex items-center justify-center transition-transform hover:scale-110"
    >
      <svg
        width={SIZE}
        height={SIZE}
        viewBox={`0 0 ${SIZE} ${SIZE}`}
        className="absolute inset-0 -rotate-90"
        aria-hidden="true"
      >
        <circle cx={SIZE / 2} cy={SIZE / 2} r={RADIUS} fill="none" stroke="rgba(30,58,138,0.2)" strokeWidth={STROKE} />
        <circle
          cx={SIZE / 2}
          cy={SIZE / 2}
          r={RADIUS}
          fill="none"
          stroke="#1e3a8a"
          strokeWidth={STROKE}
          strokeLinecap="round"
          strokeDasharray={CIRCUMFERENCE}
          strokeDashoffset={dashoffset}
          style={{ transition: "stroke-dashoffset 100ms linear" }}
        />
      </svg>
      <span
        style={{ width: BUTTON_SIZE, height: BUTTON_SIZE }}
        className="relative flex items-center justify-center rounded-full bg-red-600 shadow-lg hover:bg-red-700"
      >
        <ChevronUp className="h-7 w-7 text-white" />
      </span>
    </button>
  );
}
