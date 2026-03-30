import React, { useEffect, useRef, type ReactNode } from "react";

interface ScrollFadeInProps {
  children: ReactNode;
  className?: string;
  delay?: number; // ms
}

/**
 * ScrollFadeIn — wraps children and applies a fade-in + slide-up animation
 * when the element scrolls into the viewport via IntersectionObserver.
 */
export default function ScrollFadeIn({
  children,
  className = "",
  delay = 0,
}: ScrollFadeInProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            el.classList.add("scroll-visible");
            el.classList.remove("scroll-hidden");
          }, delay);
          observer.unobserve(el);
        }
      },
      { threshold: 0.15 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [delay]);

  return (
    <div ref={ref} className={`scroll-hidden ${className}`}>
      {children}
    </div>
  );
}
