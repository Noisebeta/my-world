import { cn } from "@/lib/utils";
import type React from "react";

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  dark?: boolean;
}

/**
 * GlassCard — reusable frosted-glass card with backdrop blur,
 * semi-transparent white background, rounded corners and subtle border.
 */
export default function GlassCard({
  children,
  className,
  dark = false,
}: GlassCardProps) {
  return (
    <div
      className={cn(
        "rounded-3xl shadow-lg",
        dark ? "glass-dark" : "glass",
        className,
      )}
    >
      {children}
    </div>
  );
}
