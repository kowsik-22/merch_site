"use client";

import { useEffect, useRef } from "react";

export default function CursorGlow() {
  const dotRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const pos = useRef({ x: 0, y: 0 });
  const glowPos = useRef({ x: 0, y: 0 });

  useEffect(() => {
    // Skip on touch devices — there's no cursor to animate.
    const isTouch = window.matchMedia("(pointer: coarse)").matches;
    if (isTouch) return;

    function handleMove(e: MouseEvent) {
      pos.current = { x: e.clientX, y: e.clientY };
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
      }
    }

    let rafId: number;
    function animateGlow() {
      // Smoothly trail the glow behind the actual cursor position.
      glowPos.current.x += (pos.current.x - glowPos.current.x) * 0.12;
      glowPos.current.y += (pos.current.y - glowPos.current.y) * 0.12;
      if (glowRef.current) {
        glowRef.current.style.transform = `translate3d(${glowPos.current.x}px, ${glowPos.current.y}px, 0)`;
      }
      rafId = requestAnimationFrame(animateGlow);
    }

    window.addEventListener("mousemove", handleMove);
    rafId = requestAnimationFrame(animateGlow);

    return () => {
      window.removeEventListener("mousemove", handleMove);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 z-[999] hidden sm:block">
      {/* trailing soft glow */}
      <div
        ref={glowRef}
        className="absolute left-0 top-0 h-16 w-16 -translate-x-1/2 -translate-y-1/2 rounded-full opacity-40 mix-blend-screen"
        style={{
          background:
            "radial-gradient(circle, rgba(0,229,255,0.5) 0%, rgba(0,229,255,0) 70%)",
        }}
      />
      {/* sharp core dot */}
      <div
        ref={dotRef}
        className="absolute left-0 top-0 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-accent shadow-[0_0_8px_rgba(0,229,255,0.9)]"
      />
    </div>
  );
}
