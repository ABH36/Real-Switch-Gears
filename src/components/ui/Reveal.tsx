"use client";

import { useEffect, useRef, useState, type ElementType, type ReactNode } from "react";

// Fades + slides (+ a touch of scale) a block into place the first time it
// scrolls into view. One-shot — doesn't re-trigger on scroll back up, so it
// reads as a page reveal rather than a distracting repeat animation.
//
// IntersectionObserver is the primary trigger, but it's backed by a manual
// scroll/resize check too: some mobile browsers (iOS Safari's address bar
// resizing the viewport mid-scroll in particular) can make an observer's
// internal root rect go stale, which would otherwise leave content stuck at
// opacity:0 forever. The manual check recomputes against the *current*
// viewport on every scroll, so it self-corrects regardless of what the
// observer thinks.
export default function Reveal({
  children,
  className = "",
  delay = 0,
  y = 40,
  as: Tag = "div",
}: {
  children: ReactNode;
  className?: string;
  /** stagger delay in ms, applied only once the element is visible */
  delay?: number;
  /** starting vertical offset in px — use a smaller value (e.g. 16-24) for
   *  small card-sized items so the motion doesn't look floaty */
  y?: number;
  /** wrapper element — defaults to a plain div; pass "section" etc. to
   *  preserve semantic/landmark structure where the wrapped content used
   *  to be a top-level <section> */
  as?: ElementType;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let done = false;
    const reveal = () => {
      if (done) return;
      done = true;
      setVisible(true);
      cleanup();
    };

    const manualCheck = () => {
      if (done) return;
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight || document.documentElement.clientHeight;
      if (rect.top < vh * 0.92 && rect.bottom > 0) reveal();
    };

    let observer: IntersectionObserver | null = null;
    if (typeof IntersectionObserver !== "undefined") {
      observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) reveal();
        },
        { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
      );
      observer.observe(el);
    }

    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(manualCheck);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    function cleanup() {
      observer?.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(raf);
    }

    // catch the case where it's already in view (or observers are
    // unsupported) before any scroll/resize event ever fires
    manualCheck();
    if (typeof IntersectionObserver === "undefined") reveal();

    return cleanup;
  }, []);

  return (
    <Tag
      ref={ref}
      className={`transition-[opacity,transform] duration-[900ms] ${className}`}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0) scale(1)" : `translateY(${y}px) scale(0.98)`,
        transitionTimingFunction: "cubic-bezier(0.22, 1, 0.36, 1)",
        transitionDelay: visible ? `${delay}ms` : "0ms",
      }}
    >
      {children}
    </Tag>
  );
}
