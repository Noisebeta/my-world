import { cn } from "@/lib/utils";
import React, { useState } from "react";

interface PlaceholderImageProps {
  src?: string;
  alt?: string;
  gradient?: string;
  className?: string;
  size?: "sm" | "md" | "lg";
  glow?: string;
}

/**
 * PlaceholderImage — shows a real image if `src` is provided,
 * otherwise falls back to a styled gradient placeholder.
 */
export default function PlaceholderImage({
  src,
  alt = "Photo",
  gradient = "from-pink-300 via-purple-300 to-indigo-300",
  className,
  size = "md",
  glow,
}: PlaceholderImageProps) {
  const [imgError, setImgError] = useState(false);

  const sizeClasses = {
    sm: "w-32 h-32",
    md: "w-48 h-48 md:w-56 md:h-56",
    lg: "w-64 h-64 md:w-80 md:h-80",
  };

  if (src && !imgError) {
    return (
      <div
        className={cn(
          "relative rounded-full overflow-hidden flex-shrink-0",
          sizeClasses[size],
          className,
        )}
        style={glow ? { boxShadow: glow } : undefined}
      >
        <img
          src={src}
          alt={alt}
          onError={() => setImgError(true)}
          className="w-full h-full object-cover"
        />
      </div>
    );
  }

  return (
    <div
      className={cn(
        "relative rounded-full bg-gradient-to-br flex items-center justify-center overflow-hidden",
        gradient,
        sizeClasses[size],
        className,
      )}
      style={glow ? { boxShadow: glow } : undefined}
    >
      <div className="absolute inset-0 bg-white/10 rounded-full" />
      <svg
        viewBox="0 0 24 24"
        className="w-1/2 h-1/2 text-white/60 relative z-10"
        fill="currentColor"
        role="img"
        aria-label="Profile placeholder"
      >
        <title>Profile placeholder</title>
        <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
      </svg>
    </div>
  );
}
