import React, { useMemo } from "react";

interface HeartProps {
  /** Tint color for hearts: 'pink' | 'rose' | 'lavender' */
  tint?: "pink" | "rose" | "lavender";
  count?: number;
}

/**
 * FloatingHearts — renders softly floating heart emojis that drift upward.
 * Each heart has randomised size, position, speed and delay.
 */
export default function FloatingHearts({
  tint = "pink",
  count = 18,
}: HeartProps) {
  const hearts = useMemo(() => {
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      size: `${0.7 + Math.random() * 1.5}rem`,
      duration: `${10 + Math.random() * 14}s`,
      delay: `${Math.random() * 12}s`,
      opacity: 0.15 + Math.random() * 0.25,
    }));
  }, [count]);

  const heartChar = tint === "lavender" ? "💜" : tint === "rose" ? "🩷" : "💗";

  return (
    <div
      className="pointer-events-none fixed inset-0 overflow-hidden z-0"
      aria-hidden="true"
    >
      {hearts.map((h) => (
        <span
          key={h.id}
          className="absolute select-none animate-float-up"
          style={{
            left: h.left,
            bottom: "-60px",
            fontSize: h.size,
            opacity: h.opacity,
            animationDuration: h.duration,
            animationDelay: h.delay,
          }}
        >
          {heartChar}
        </span>
      ))}
    </div>
  );
}
