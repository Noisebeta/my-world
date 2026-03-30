import React, { useMemo } from "react";

/**
 * BackgroundParticles — subtle twinkling dots scattered across the viewport.
 */
export default function BackgroundParticles() {
  const particles = useMemo(() => {
    return Array.from({ length: 35 }, (_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      size: `${2 + Math.random() * 3}px`,
      duration: `${2 + Math.random() * 4}s`,
      delay: `${Math.random() * 4}s`,
    }));
  }, []);

  return (
    <div
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
      aria-hidden="true"
    >
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute rounded-full bg-white animate-twinkle"
          style={{
            left: p.left,
            top: p.top,
            width: p.size,
            height: p.size,
            animationDuration: p.duration,
            animationDelay: p.delay,
          }}
        />
      ))}
    </div>
  );
}
