import { useNavigate } from "@tanstack/react-router";
import type React from "react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import FloatingHearts from "../components/FloatingHearts";
import GlassCard from "../components/GlassCard";
import PlaceholderImage from "../components/PlaceholderImage";
import ScrollFadeIn from "../components/ScrollFadeIn";

// ──────────────────────────────────────────
// ConfettiRain (mini, inline)
// ──────────────────────────────────────────
function ConfettiRain({ count = 20 }: { count?: number }) {
  const pieces = useMemo(() => {
    const colors = [
      "#f472b6",
      "#c084fc",
      "#facc15",
      "#22d3ee",
      "#4ade80",
      "#fb923c",
    ];
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      w: 4 + Math.floor(Math.random() * 7),
      h: 4 + Math.floor(Math.random() * 7),
      color: colors[Math.floor(Math.random() * colors.length)],
      duration: `${3 + Math.random() * 5}s`,
      delay: `${Math.random() * 5}s`,
    }));
  }, [count]);
  return (
    <div
      className="pointer-events-none absolute inset-0 overflow-hidden z-0"
      aria-hidden="true"
    >
      {pieces.map((p) => (
        <div
          key={p.id}
          className="absolute animate-confetti-fall"
          style={{
            left: p.left,
            top: "-20px",
            width: p.w,
            height: p.h,
            backgroundColor: p.color,
            borderRadius: p.id % 3 === 0 ? "50%" : "2px",
            animationDuration: p.duration,
            animationDelay: p.delay,
            opacity: 0.85,
          }}
        />
      ))}
    </div>
  );
}

// ──────────────────────────────────────────
// Food Catching Mini-Game
// ──────────────────────────────────────────
const FOOD_EMOJIS = ["🍕", "🍔", "🍟", "🍩", "🍦", "🌮", "🍰", "🧁"];
const GAME_W = 400;
const GAME_H = 300;
const BASKET_W = 70;
const BASKET_H = 40;
const TOTAL_FOOD = 20;

interface FoodItem {
  id: number;
  x: number;
  y: number;
  emoji: string;
  speed: number;
}

function FoodGame() {
  const [foods, setFoods] = useState<FoodItem[]>([]);
  const [basketX, setBasketX] = useState(GAME_W / 2 - BASKET_W / 2);
  const [score, setScore] = useState(0);
  const [missed, setMissed] = useState(0);
  const [running, setRunning] = useState(false);
  const [showWin, setShowWin] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const nextIdRef = useRef(0);
  const spawnedRef = useRef(0);
  const scoreRef = useRef(0);

  const startGame = useCallback(() => {
    setFoods([]);
    setBasketX(GAME_W / 2 - BASKET_W / 2);
    setScore(0);
    setMissed(0);
    setShowWin(false);
    setRunning(true);
    nextIdRef.current = 0;
    spawnedRef.current = 0;
    scoreRef.current = 0;
  }, []);

  // Spawn foods
  useEffect(() => {
    if (!running) return;
    const interval = setInterval(() => {
      if (spawnedRef.current >= TOTAL_FOOD) return;
      const newFood: FoodItem = {
        id: nextIdRef.current++,
        x: 10 + Math.floor(Math.random() * (GAME_W - 50)),
        y: -30,
        emoji: FOOD_EMOJIS[Math.floor(Math.random() * FOOD_EMOJIS.length)],
        speed: 2 + Math.random() * 3,
      };
      spawnedRef.current += 1;
      setFoods((prev) => [...prev, newFood]);
    }, 1500);
    return () => clearInterval(interval);
  }, [running]);

  // Move foods down and detect catch/miss
  useEffect(() => {
    if (!running) return;
    const interval = setInterval(() => {
      setFoods((prev) => {
        const basketTop = GAME_H - BASKET_H - 10;
        const next: FoodItem[] = [];
        let caught = 0;
        let miss = 0;
        for (const food of prev) {
          const newY = food.y + food.speed * 1.5;
          if (newY >= basketTop && newY <= basketTop + BASKET_H) {
            // Check horizontal overlap
            const bx = basketXRef.current;
            if (food.x >= bx - 20 && food.x <= bx + BASKET_W + 10) {
              caught++;
              continue; // caught, remove from array
            }
          }
          if (newY > GAME_H + 20) {
            miss++;
            continue; // missed, remove
          }
          next.push({ ...food, y: newY });
        }
        if (caught > 0) {
          scoreRef.current += caught;
          setScore(scoreRef.current);
          if (scoreRef.current >= TOTAL_FOOD) {
            setShowWin(true);
            setRunning(false);
          }
        }
        if (miss > 0) setMissed((m) => m + miss);
        return next;
      });
    }, 50);
    return () => clearInterval(interval);
  }, [running]);

  const basketXRef = useRef(basketX);
  useEffect(() => {
    basketXRef.current = basketX;
  }, [basketX]);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const relX = e.clientX - rect.left - BASKET_W / 2;
    setBasketX(Math.max(0, Math.min(relX, GAME_W - BASKET_W)));
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent<HTMLDivElement>) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect || !e.touches[0]) return;
    const relX = e.touches[0].clientX - rect.left - BASKET_W / 2;
    setBasketX(Math.max(0, Math.min(relX, GAME_W - BASKET_W)));
  }, []);

  const progress = Math.min((score / TOTAL_FOOD) * 100, 100);

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="w-full max-w-md bg-white/10 rounded-full h-4 overflow-hidden border border-pink-400/30">
        <div
          className="h-full rounded-full transition-all duration-300"
          style={{
            width: `${progress}%`,
            background: "linear-gradient(90deg, #f472b6, #c084fc)",
          }}
        />
      </div>
      <div className="flex gap-6 text-sm font-semibold text-pink-300">
        <span>🍽️ Caught: {score}</span>
        <span>💨 Missed: {missed}</span>
      </div>

      {!running && !showWin && (
        <button
          type="button"
          data-ocid="foodgame.primary_button"
          onClick={startGame}
          className="px-6 py-3 rounded-full font-bold text-white text-lg shadow-lg transition-all hover:scale-105"
          style={{ background: "linear-gradient(135deg, #f472b6, #c084fc)" }}
        >
          🍕 Start Catching!
        </button>
      )}

      {running && (
        <div
          ref={containerRef}
          onMouseMove={handleMouseMove}
          onTouchMove={handleTouchMove}
          className="relative rounded-2xl overflow-hidden border-2 border-pink-400/30 cursor-none select-none"
          style={{
            width: GAME_W,
            height: GAME_H,
            background:
              "linear-gradient(180deg, rgba(249,168,212,0.1), rgba(192,132,252,0.1))",
            maxWidth: "100%",
          }}
        >
          {/* Foods */}
          {foods.map((f) => (
            <div
              key={f.id}
              className="absolute text-2xl pointer-events-none select-none"
              style={{ left: f.x, top: f.y }}
            >
              {f.emoji}
            </div>
          ))}
          {/* Basket */}
          <div
            className="absolute bottom-2 flex items-center justify-center text-2xl rounded-xl border-2 border-pink-400"
            style={{
              left: basketX,
              width: BASKET_W,
              height: BASKET_H,
              background: "rgba(249,168,212,0.3)",
            }}
          >
            🧵
          </div>
        </div>
      )}

      {showWin && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{ background: "rgba(0,0,0,0.7)" }}
        >
          <div
            className="glass-dark rounded-3xl p-8 text-center max-w-sm mx-4 animate-modal-in"
            style={{
              background:
                "linear-gradient(135deg, rgba(249,168,212,0.9), rgba(192,132,252,0.9))",
            }}
          >
            <div className="text-6xl mb-4">😴🐕</div>
            <h3 className="text-2xl font-bold text-pink-900 mb-3">
              Bht khaa liya!
            </h3>
            <p className="text-pink-800 font-medium mb-6">
              Jaake sojao Casper k saath 😴💕
            </p>
            <button
              type="button"
              data-ocid="foodgame.close_button"
              onClick={startGame}
              className="px-6 py-2 rounded-full font-bold text-white"
              style={{
                background: "linear-gradient(135deg, #f472b6, #c084fc)",
              }}
            >
              Play Again 🍕
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ──────────────────────────────────────────
// OmiiPage
// ──────────────────────────────────────────
export default function OmiiPage() {
  const navigate = useNavigate();
  const audioRef = useRef<HTMLAudioElement>(null);
  const [musicPlaying, setMusicPlaying] = useState(false);

  const toggleMusic = () => {
    if (!audioRef.current) return;
    if (musicPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(() => {});
    }
    setMusicPlaying(!musicPlaying);
  };

  const aboutCards = [
    {
      emoji: "🗣️",
      title: "Yapping",
      desc: "Can talk for 3 hours straight about literally anything. A gift, honestly.",
    },
    {
      emoji: "💥",
      title: "Chaotic",
      desc: "Plans? Schedules? Never heard of them. Vibes only.",
    },
    {
      emoji: "🍑",
      title: "Chubby (I like)",
      desc: "Soft, squishy, and absolutely adorable. 10/10.",
    },
    {
      emoji: "🤸",
      title: "Clumsy",
      desc: "Trips over flat surfaces. Endearing every single time.",
    },
    {
      emoji: "🌪️",
      title: "Messy",
      desc: "Her bag is a black hole. Nobody knows what's in there.",
    },
    {
      emoji: "🎉",
      title: "Fun-loving",
      desc: "Turns every moment into a memory. Main character, always.",
    },
  ];

  const moments = [
    {
      emoji: "🥊",
      title: "Fighting",
      desc: "Our arguments last 10 mins and then we're back to normal. Classic.",
    },
    {
      emoji: "🍕",
      title: "Eating",
      desc: "Food is our love language. Always hunting for the best spots.",
    },
    {
      emoji: "🚶",
      title: "Ghoomna",
      desc: "Random walks, random places, always an adventure.",
    },
    {
      emoji: "📖",
      title: "Her Stories",
      desc: "Once she starts, there's no stopping. 45-minute episode minimum.",
    },
    {
      emoji: "🎓",
      title: "College Chaos",
      desc: "Deadlines, drama, and somehow surviving together.",
    },
    {
      emoji: "😂",
      title: "Just Vibing",
      desc: "Doing absolutely nothing but it somehow becomes the best memory.",
    },
  ];

  return (
    <div
      className="relative min-h-screen overflow-x-hidden"
      style={{
        background:
          "linear-gradient(160deg, #0f0a2e, #1e1040, #0a1528, #0f0a2e)",
        backgroundSize: "400% 400%",
        animation: "gradientShift 12s ease infinite",
      }}
    >
      <FloatingHearts tint="pink" count={14} />
      <audio ref={audioRef} loop>
        <track kind="captions" />
      </audio>

      {/* Back button */}
      <button
        type="button"
        data-ocid="omii.link"
        onClick={() => navigate({ to: "/" })}
        className="fixed top-4 left-4 z-40 glass-dark px-4 py-2 rounded-full text-sm font-semibold text-pink-300 hover:scale-105 transition-transform"
      >
        ← Home
      </button>

      {/* Music toggle */}
      <button
        type="button"
        data-ocid="omii.toggle"
        onClick={toggleMusic}
        className="fixed bottom-6 right-6 z-40 w-14 h-14 rounded-full text-2xl flex items-center justify-center shadow-lg animate-music-pulse"
        style={{ background: "linear-gradient(135deg, #f472b6, #c084fc)" }}
      >
        {musicPlaying ? "⏸" : "🎵"}
      </button>

      {/* ── HERO ── */}
      <section className="relative flex flex-col items-center justify-center pt-24 pb-16 px-4 text-center overflow-hidden">
        <ConfettiRain count={20} />
        <div className="relative z-10 flex flex-col items-center">
          <PlaceholderImage
            src="/omiii/cover.jpg"
            alt="Omii"
            size="lg"
            gradient="from-pink-300 via-rose-300 to-purple-300"
            glow="0 0 60px 20px rgba(236,72,153,0.5), 0 0 120px 40px rgba(192,132,252,0.3)"
          />
          <h1
            className="text-5xl md:text-7xl font-extrabold mt-6 mb-3"
            style={{
              background: "linear-gradient(135deg, #f472b6, #a78bfa)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              filter: "drop-shadow(0 0 20px rgba(244,114,182,0.6))",
            }}
          >
            Omii 🌸
          </h1>
          <p className="text-lg md:text-xl font-semibold text-pink-300/80 max-w-md">
            Yapper Supreme & Professional Chaos Agent 💕
          </p>
        </div>
      </section>

      {/* ── ABOUT YOU ── */}
      <section className="max-w-4xl mx-auto px-4 pb-16">
        <ScrollFadeIn>
          <h2 className="text-3xl font-bold text-center text-pink-300 mb-8">
            About You 💕
          </h2>
        </ScrollFadeIn>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {aboutCards.map((card, i) => (
            <ScrollFadeIn key={card.title} delay={i * 80}>
              <GlassCard
                dark
                className="p-5 shimmer-card hover:scale-105 transition-transform"
              >
                <div className="text-3xl mb-2">{card.emoji}</div>
                <h3 className="font-bold text-pink-300 mb-1">{card.title}</h3>
                <p className="text-sm text-pink-200/70">{card.desc}</p>
              </GlassCard>
            </ScrollFadeIn>
          ))}
        </div>
      </section>

      {/* ── OUR MOMENTS ── */}
      <section className="max-w-4xl mx-auto px-4 pb-16">
        <ScrollFadeIn>
          <h2 className="text-3xl font-bold text-center text-purple-300 mb-8">
            Our Moments 🌈
          </h2>
        </ScrollFadeIn>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {moments.map((m, i) => (
            <ScrollFadeIn key={m.title} delay={i * 80}>
              <GlassCard
                dark
                className="p-5 shimmer-card hover:scale-105 transition-transform"
              >
                <div className="text-3xl mb-2">{m.emoji}</div>
                <h3 className="font-bold text-purple-300 mb-1">{m.title}</h3>
                <p className="text-sm text-purple-200/70">{m.desc}</p>
              </GlassCard>
            </ScrollFadeIn>
          ))}
        </div>
      </section>

      {/* ── LIKES & FUN THINGS ── */}
      <section className="max-w-4xl mx-auto px-4 pb-16">
        <ScrollFadeIn>
          <h2 className="text-3xl font-bold text-center text-pink-300 mb-8">
            Likes & Fun Things 🐾
          </h2>
        </ScrollFadeIn>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
          <ScrollFadeIn>
            <GlassCard dark className="p-6 shimmer-card">
              <div className="text-5xl mb-3">🐕</div>
              <h3 className="font-bold text-xl text-pink-300 mb-1">Casper</h3>
              <span
                className="inline-block px-3 py-1 rounded-full text-xs font-bold text-white mb-3"
                style={{
                  background: "linear-gradient(135deg, #f472b6, #c084fc)",
                }}
              >
                Void's soulEnemy 😐
              </span>
              <p className="text-sm text-pink-200/70">
                This menace of a dog named Casper. She loves him, I... tolerate
                him.
              </p>
            </GlassCard>
          </ScrollFadeIn>
          <ScrollFadeIn delay={100}>
            <GlassCard dark className="p-6 shimmer-card">
              <div className="text-5xl mb-3">📦</div>
              <h3 className="font-bold text-xl text-pink-300 mb-1">
                Irritating & Ordering Things
              </h3>
              <p className="text-sm text-pink-200/70">
                Her Amazon cart is a cry for help. Always ordering, always
                irritating, never stopping.
              </p>
            </GlassCard>
          </ScrollFadeIn>
        </div>
      </section>

      {/* ── FOOD GAME ── */}
      <section className="max-w-4xl mx-auto px-4 pb-20">
        <ScrollFadeIn>
          <h2 className="text-3xl font-bold text-center text-pink-300 mb-3">
            Food Catching Game 🍕
          </h2>
          <p className="text-center text-pink-200/70 text-sm mb-8">
            Catch {TOTAL_FOOD} foods to win... or face the consequences 😏
          </p>
        </ScrollFadeIn>
        <ScrollFadeIn delay={100}>
          <GlassCard dark className="p-6">
            <FoodGame />
          </GlassCard>
        </ScrollFadeIn>
      </section>

      {/* Footer */}
      <footer className="text-center pb-8 px-4">
        <p className="text-pink-200/80 font-semibold mb-1">
          Made with love by Voiddd & Caffeine AI 💕
        </p>
        <p className="text-xs text-pink-300/50">
          © {new Date().getFullYear()}. Built with 💗 using{" "}
          <a
            href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-pink-300"
          >
            caffeine.ai
          </a>
        </p>
      </footer>
    </div>
  );
}
