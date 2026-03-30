import { useNavigate } from "@tanstack/react-router";
import type React from "react";
import { useMemo, useState } from "react";
import BackgroundParticles from "../components/BackgroundParticles";
import FloatingHearts from "../components/FloatingHearts";

interface ConfettiPiece {
  id: number;
  left: string;
  width: number;
  height: number;
  color: string;
  duration: string;
  delay: string;
  rotation: number;
}

function ConfettiRain({ count = 40 }: { count?: number }) {
  const pieces: ConfettiPiece[] = useMemo(() => {
    const colors = [
      "#f472b6",
      "#c084fc",
      "#facc15",
      "#22d3ee",
      "#4ade80",
      "#fb923c",
      "#f9a8d4",
    ];
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      width: 4 + Math.floor(Math.random() * 8),
      height: 4 + Math.floor(Math.random() * 8),
      color: colors[Math.floor(Math.random() * colors.length)],
      duration: `${3 + Math.random() * 5}s`,
      delay: `${Math.random() * 6}s`,
      rotation: Math.floor(Math.random() * 360),
    }));
  }, [count]);

  return (
    <div
      className="pointer-events-none fixed inset-0 overflow-hidden z-0"
      aria-hidden="true"
    >
      {pieces.map((p) => (
        <div
          key={p.id}
          className="absolute animate-confetti-fall"
          style={{
            left: p.left,
            top: "-20px",
            width: p.width,
            height: p.height,
            backgroundColor: p.color,
            borderRadius: p.id % 3 === 0 ? "50%" : "2px",
            animationDuration: p.duration,
            animationDelay: p.delay,
            opacity: 0.85,
            transform: `rotate(${p.rotation}deg)`,
          }}
        />
      ))}
    </div>
  );
}

function Balloon({
  emoji,
  style,
}: { emoji: string; style: React.CSSProperties }) {
  return (
    <div
      className="absolute select-none pointer-events-none text-4xl animate-balloon-float"
      style={style}
      aria-hidden="true"
    >
      {emoji}
    </div>
  );
}

function CardPhoto({
  src,
  fallbackEmoji,
  alt,
  ringColor,
}: {
  src: string;
  fallbackEmoji: string;
  alt: string;
  ringColor: string;
}) {
  const [errored, setErrored] = useState(false);
  if (!errored) {
    return (
      <div
        className="w-24 h-24 rounded-full overflow-hidden mx-auto mb-4 ring-4"
        style={{ "--tw-ring-color": ringColor } as React.CSSProperties}
      >
        <img
          src={src}
          alt={alt}
          onError={() => setErrored(true)}
          className="w-full h-full object-cover"
        />
      </div>
    );
  }
  return (
    <div className="text-6xl mb-4 group-hover:animate-heartbeat">
      {fallbackEmoji}
    </div>
  );
}

export default function LandingPage() {
  const navigate = useNavigate();

  const balloons = useMemo(
    () => [
      {
        emoji: "🎈",
        style: {
          left: "5%",
          bottom: "-80px",
          animationDuration: "12s",
          animationDelay: "0s",
        },
      },
      {
        emoji: "🎈",
        style: {
          left: "20%",
          bottom: "-80px",
          animationDuration: "15s",
          animationDelay: "2s",
        },
      },
      {
        emoji: "🎀",
        style: {
          left: "40%",
          bottom: "-80px",
          animationDuration: "10s",
          animationDelay: "1s",
        },
      },
      {
        emoji: "🎈",
        style: {
          left: "65%",
          bottom: "-80px",
          animationDuration: "13s",
          animationDelay: "3s",
        },
      },
      {
        emoji: "🌸",
        style: {
          left: "80%",
          bottom: "-80px",
          animationDuration: "11s",
          animationDelay: "0.5s",
        },
      },
      {
        emoji: "🌺",
        style: {
          left: "92%",
          bottom: "-80px",
          animationDuration: "14s",
          animationDelay: "4s",
        },
      },
    ],
    [],
  );

  return (
    <div
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden"
      style={{
        background:
          "linear-gradient(135deg, #fce7f3, #e9d5ff, #ddd6fe, #fce7f3, #fbcfe8)",
        backgroundSize: "400% 400%",
        animation: "gradientShift 10s ease infinite",
      }}
    >
      <ConfettiRain count={40} />
      <FloatingHearts tint="lavender" count={18} />
      <BackgroundParticles />

      {balloons.map((b, i) => (
        <Balloon key={`${b.emoji}-${i}`} emoji={b.emoji} style={b.style} />
      ))}

      {/* Ambient glows */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-pink-300/30 rounded-full blur-3xl -translate-y-1/2" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-400/30 rounded-full blur-3xl translate-y-1/2" />

      <div className="relative z-10 flex flex-col items-center px-4 text-center">
        {/* Birthday hero */}
        <div className="mb-2 text-5xl md:text-6xl animate-heartbeat">🎂</div>
        <h1
          className="text-5xl md:text-7xl font-extrabold mb-3"
          style={{
            background: "linear-gradient(135deg, #be185d, #7c3aed, #db2777)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            textShadow: "none",
            filter: "drop-shadow(0 0 20px rgba(236,72,153,0.5))",
          }}
        >
          Happy Birthday! 🎉
        </h1>
        <p className="text-xl md:text-2xl font-semibold text-purple-700/80 mb-10">
          Choose Your World ✨
        </p>

        {/* Cards */}
        <div className="flex flex-col sm:flex-row gap-6 mb-8">
          {/* Omii Card */}
          <button
            data-ocid="omii.primary_button"
            type="button"
            onClick={() => navigate({ to: "/omii" })}
            className="group shimmer-card glass rounded-3xl p-8 w-64 cursor-pointer transition-all duration-300 hover:scale-105 border-0"
            style={{
              background:
                "linear-gradient(135deg, rgba(249,168,212,0.6), rgba(192,132,252,0.5))",
              boxShadow: "0 0 0 0 rgba(236,72,153,0.3)",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.boxShadow =
                "0 0 40px 8px rgba(236,72,153,0.45), 0 8px 32px rgba(192,132,252,0.4)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.boxShadow =
                "0 0 0 0 rgba(236,72,153,0.3)";
            }}
          >
            <CardPhoto
              src="/omiii/cover.jpg"
              fallbackEmoji="🌸"
              alt="Omii"
              ringColor="#f472b6"
            />
            <h2 className="text-3xl font-bold text-pink-700 mb-2">Omii</h2>
            <p className="text-sm font-medium text-pink-600/80">
              Cute • Chaotic • Playful 💕
            </p>
            <div className="mt-4 text-xs text-pink-500/70 font-medium">
              Enter her world →
            </div>
          </button>

          {/* Romii Card */}
          <button
            data-ocid="romii.primary_button"
            type="button"
            onClick={() => navigate({ to: "/romii" })}
            className="group shimmer-card glass rounded-3xl p-8 w-64 cursor-pointer transition-all duration-300 hover:scale-105 border-0"
            style={{
              background:
                "linear-gradient(135deg, rgba(251,113,133,0.55), rgba(167,139,250,0.55))",
              boxShadow: "0 0 0 0 rgba(251,113,133,0.3)",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.boxShadow =
                "0 0 40px 8px rgba(251,113,133,0.45), 0 8px 32px rgba(167,139,250,0.4)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.boxShadow =
                "0 0 0 0 rgba(251,113,133,0.3)";
            }}
          >
            <CardPhoto
              src="/romiii/cover.jpg"
              fallbackEmoji="🌹"
              alt="Romii"
              ringColor="#fb7185"
            />
            <h2 className="text-3xl font-bold text-rose-700 mb-2">Romii</h2>
            <p className="text-sm font-medium text-rose-600/80">
              Romantic • Emotional • Stunning 🌹
            </p>
            <div className="mt-4 text-xs text-rose-500/70 font-medium">
              Enter her world →
            </div>
          </button>
        </div>

        <p className="text-lg font-medium text-purple-600/70">
          Wishing you the most beautiful day! 🎁✨
        </p>
      </div>

      {/* Footer */}
      <footer className="absolute bottom-4 text-center text-xs text-purple-500/60">
        © {new Date().getFullYear()}. Built with 💗 using{" "}
        <a
          href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="underline hover:text-purple-600"
        >
          caffeine.ai
        </a>
      </footer>
    </div>
  );
}
