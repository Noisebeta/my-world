import { useNavigate } from "@tanstack/react-router";
import type React from "react";
import { useCallback, useMemo, useRef, useState } from "react";
import FloatingHearts from "../components/FloatingHearts";
import GlassCard from "../components/GlassCard";
import PlaceholderImage from "../components/PlaceholderImage";
import ScrollFadeIn from "../components/ScrollFadeIn";

// ── ConfettiRain ──
function ConfettiRain({ count = 25 }: { count?: number }) {
  const pieces = useMemo(() => {
    const colors = [
      "#f472b6",
      "#c084fc",
      "#facc15",
      "#22d3ee",
      "#fb7185",
      "#a78bfa",
    ];
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      w: 4 + Math.floor(Math.random() * 7),
      h: 4 + Math.floor(Math.random() * 7),
      color: colors[Math.floor(Math.random() * colors.length)],
      duration: `${3 + Math.random() * 5}s`,
      delay: `${Math.random() * 6}s`,
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
            opacity: 0.8,
          }}
        />
      ))}
    </div>
  );
}

// ── Secret Section ──
type SecretState = "locked" | "inputting" | "denied" | "unlocked";

function SecretSection({
  onModalOpen,
  onModalClose,
}: { onModalOpen: () => void; onModalClose: () => void }) {
  const [state, setState] = useState<SecretState>("locked");
  const [input, setInput] = useState("");
  const [showValentineMsg, setShowValentineMsg] = useState(false);
  const [noCount, setNoCount] = useState(0);
  const [noPos, setNoPos] = useState<{ top: string; left: string } | null>(
    null,
  );
  const [noText, setNoText] = useState("No 😤");

  const handleUnlock = () => {
    if (input.trim().toLowerCase() === "biwi") {
      setState("unlocked");
      onModalOpen();
    } else {
      setState("denied");
      setTimeout(() => setState("inputting"), 1000);
    }
    setInput("");
  };

  const handleClose = () => {
    setState("locked");
    onModalClose();
  };

  const handleNoClick = () => {
    const newCount = noCount + 1;
    setNoCount(newCount);
    if (newCount > 5) setNoText("This button doesn't work anymore 😂");
  };

  const handleNoHover = useCallback(() => {
    if (noCount >= 5) {
      setNoPos({
        top: `${20 + Math.random() * 60}%`,
        left: `${10 + Math.random() * 70}%`,
      });
    }
  }, [noCount]);

  const noFontSize = Math.min(14 + noCount * 4, 34);

  return (
    <div className="relative">
      {/* Locked state */}
      {state === "locked" && (
        <GlassCard dark className="p-8 text-center">
          <div className="text-6xl mb-4 animate-heartbeat">🔮</div>
          <h3 className="text-2xl font-bold text-rose-300 mb-2">
            Something Private 🔒
          </h3>
          <p className="text-rose-200/70 mb-6">Only for the one who knows...</p>
          <button
            type="button"
            data-ocid="secret.open_modal_button"
            onClick={() => setState("inputting")}
            className="px-6 py-3 rounded-full font-bold text-white shadow-lg hover:scale-105 transition-transform"
            style={{ background: "linear-gradient(135deg, #be185d, #7c3aed)" }}
          >
            🔑 Enter the key
          </button>
        </GlassCard>
      )}

      {/* Input state */}
      {state === "inputting" && (
        <GlassCard dark className="p-8 text-center">
          <div className="text-5xl mb-4">🔐</div>
          <h3 className="text-xl font-bold text-rose-300 mb-4">
            Enter the secret key...
          </h3>
          <input
            data-ocid="secret.input"
            type="password"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleUnlock()}
            placeholder="Your key here..."
            className="w-full px-4 py-3 rounded-xl text-center font-semibold text-rose-800 bg-white/80 border border-rose-300 outline-none focus:ring-2 focus:ring-rose-400 mb-4"
          />
          <div className="flex gap-3 justify-center">
            <button
              type="button"
              data-ocid="secret.submit_button"
              onClick={handleUnlock}
              className="px-6 py-2 rounded-full font-bold text-white"
              style={{
                background: "linear-gradient(135deg, #be185d, #7c3aed)",
              }}
            >
              Unlock 💝
            </button>
            <button
              type="button"
              data-ocid="secret.cancel_button"
              onClick={() => {
                setState("locked");
                setInput("");
              }}
              className="px-6 py-2 rounded-full font-bold text-rose-300 border border-rose-400/40 hover:bg-white/10 transition-colors"
            >
              Cancel
            </button>
          </div>
        </GlassCard>
      )}

      {/* Denied state */}
      {state === "denied" && (
        <GlassCard dark className="p-8 text-center animate-shake">
          <div className="text-5xl mb-4">🚫</div>
          <h3 className="text-xl font-bold text-red-400">Wrong key 🚫</h3>
          <p className="text-rose-300/70 text-sm mt-2">
            That's not quite right...
          </p>
        </GlassCard>
      )}

      {/* Unlocked modal — z-[60] so it's above everything */}
      {state === "unlocked" && (
        <div
          data-ocid="secret.modal"
          className="fixed inset-0 z-[60] flex items-center justify-center p-4"
          style={{
            background: "rgba(0,0,0,0.85)",
            backdropFilter: "blur(10px)",
          }}
        >
          <div
            className="relative w-full max-w-md rounded-3xl p-8 text-center animate-modal-in overflow-y-auto max-h-[90vh]"
            style={{
              background:
                "linear-gradient(135deg, rgba(190,24,93,0.95), rgba(124,58,237,0.95))",
            }}
          >
            <button
              type="button"
              data-ocid="secret.close_button"
              onClick={handleClose}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 text-white font-bold flex items-center justify-center transition-colors"
            >
              ✕
            </button>

            <PlaceholderImage
              src="/romiii/cover2.jpg"
              alt="Romii"
              size="lg"
              gradient="from-rose-300 via-pink-300 to-purple-300"
              glow="0 0 60px 20px rgba(251,113,133,0.5)"
              className="mx-auto mb-6 animate-heartbeat"
            />

            <h3 className="text-2xl font-bold text-white mb-3">
              Meri jaan... 💖
            </h3>
            <p className="text-white/90 text-sm leading-relaxed mb-6">
              You unlocked the most private part of my heart. ❤️ I really, really
              like you. You're special.
            </p>

            <button
              type="button"
              data-ocid="secret.primary_button"
              onClick={() => setShowValentineMsg(true)}
              className="px-6 py-3 rounded-full font-bold text-rose-700 bg-white mb-3 hover:scale-105 transition-transform block w-full"
            >
              Be My Valentine 💝
            </button>

            {showValentineMsg && (
              <div
                data-ocid="secret.success_state"
                className="glass rounded-2xl p-4 mb-4"
                style={{ background: "rgba(255,255,255,0.2)" }}
              >
                <p className="text-white font-semibold text-sm">
                  Please be my valentine 🥺 You're sweet, I like you so much 💕
                </p>
              </div>
            )}

            <div className="relative h-16 mt-2">
              <button
                type="button"
                data-ocid="secret.secondary_button"
                onClick={handleNoClick}
                onMouseEnter={handleNoHover}
                style={{
                  fontSize: noFontSize,
                  position: noPos ? "absolute" : "relative",
                  top: noPos?.top,
                  left: noPos?.left,
                  transition: noCount >= 5 ? "none" : "font-size 0.2s ease",
                }}
                className="px-4 py-2 rounded-full font-bold text-white/70 border border-white/30 hover:bg-white/10"
              >
                {noText}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ── RomiiPage ──
export default function RomiiPage() {
  const navigate = useNavigate();
  const audioRef = useRef<HTMLAudioElement>(null);
  const [musicPlaying, setMusicPlaying] = useState(false);
  const [secretModalOpen, setSecretModalOpen] = useState(false);

  const toggleMusic = () => {
    if (!audioRef.current) return;
    if (musicPlaying) audioRef.current.pause();
    else audioRef.current.play().catch(() => {});
    setMusicPlaying(!musicPlaying);
  };

  const storyEvents = [
    {
      emoji: "🔥",
      title: "Enemies",
      desc: "We started as... not friends. Let's just say the vibes were off.",
    },
    {
      emoji: "🌙",
      title: "Best Friends",
      desc: "Then late night coding sessions, gaming marathons, 3am conversations. We just clicked.",
    },
    {
      emoji: "✨",
      title: "Something More",
      desc: "And somewhere between the laughs and the late nights... you became everything.",
    },
  ];

  const loveCards = [
    {
      emoji: "👀",
      title: "Your Eyes",
      desc: "Dangerous. Beautiful. I get lost every time.",
    },
    {
      emoji: "🎶",
      title: "Your Voice",
      desc: "Literal therapy. I could listen forever.",
    },
    {
      emoji: "😊",
      title: "Your Smile",
      desc: "Stop it, you're making everything too bright.",
    },
    {
      emoji: "💅",
      title: "Your Attitude",
      desc: "Bold, sharp, unapologetically YOU.",
    },
    {
      emoji: "👑",
      title: "Your Nakhre",
      desc: "Demanding in the most adorable way possible.",
    },
    {
      emoji: "🎮",
      title: "Controlling",
      desc: "You always get what you want. Somehow I don't mind.",
    },
    {
      emoji: "🦁",
      title: "Scary yet Caring",
      desc: "Terrifying when angry. Softest person when it matters.",
    },
    {
      emoji: "💫",
      title: "Everything",
      desc: "Sunflowers 🌻, cheesecake 🍰, white chocolate 🍫, Valorant 🎮, KK songs 🎵 — you have the best taste.",
    },
  ];

  const abilities = [
    {
      emoji: "👑",
      title: "Hukum Chalana",
      desc: "Issues commands with royal authority. Must be obeyed immediately.",
    },
    {
      emoji: "😤",
      title: "Darana",
      desc: "One look and everyone freezes. A superpower, honestly.",
    },
    {
      emoji: "🤍",
      title: "Caring",
      desc: "Beneath the scary exterior: the warmest, most caring person ever. I love this most.",
    },
  ];

  const moments = [
    {
      emoji: "💻",
      title: "Late Night Coding",
      desc: "Side by side, screens glowing, building something together.",
    },
    {
      emoji: "🎮",
      title: "Gaming Together",
      desc: "Teammates in Valorant, teammates in life.",
    },
    {
      emoji: "🤫",
      title: "Silent Communication",
      desc: "We don't even need words anymore. A look says everything.",
    },
    {
      emoji: "🌙",
      title: "Special Moments",
      desc: "The ones I replay in my head when I miss you most.",
    },
  ];

  const heroDecorators = useMemo(
    () => [
      { emoji: "🌻", style: { top: "10%", left: "5%", animationDelay: "0s" } },
      {
        emoji: "🌻",
        style: { top: "60%", left: "3%", animationDelay: "1.5s" },
      },
      {
        emoji: "👋",
        style: { top: "20%", right: "8%", animationDelay: "0.7s" },
      },
      { emoji: "😬", style: { top: "70%", right: "5%", animationDelay: "2s" } },
      {
        emoji: "🌻",
        style: { top: "40%", right: "15%", animationDelay: "1s" },
      },
      { emoji: "💋", style: { top: "50%", left: "10%", animationDelay: "3s" } },
    ],
    [],
  );

  const bgStars = useMemo(
    () => [
      ...Array.from({ length: 12 }, (_, i) => ({
        id: i,
        emoji: i % 2 === 0 ? "⭐" : "❤️",
        top: `${Math.random() * 90}%`,
        left: `${Math.random() * 90}%`,
      })),
    ],
    [],
  );

  return (
    <div
      className="relative min-h-screen overflow-x-hidden"
      style={{
        background:
          "linear-gradient(160deg, #1a0a1a, #2d1040, #3b0a2f, #1a0a1a)",
        backgroundSize: "400% 400%",
        animation: "gradientShift 15s ease infinite",
      }}
    >
      <FloatingHearts tint="rose" count={16} />
      <audio ref={audioRef} loop>
        <track kind="captions" />
      </audio>

      {/* Back button — hidden when secret modal is open */}
      <button
        type="button"
        data-ocid="romii.link"
        onClick={() => navigate({ to: "/" })}
        className={`fixed top-4 left-4 glass-dark px-4 py-2 rounded-full text-sm font-semibold text-rose-300 hover:scale-105 transition-transform ${
          secretModalOpen ? "z-[1] pointer-events-none opacity-0" : "z-40"
        }`}
      >
        ← Home
      </button>

      {/* Music toggle — hidden when secret modal is open */}
      <button
        type="button"
        data-ocid="romii.toggle"
        onClick={toggleMusic}
        className={`fixed bottom-6 right-6 w-14 h-14 rounded-full text-2xl flex items-center justify-center shadow-lg animate-music-pulse transition-opacity ${
          secretModalOpen ? "z-[1] pointer-events-none opacity-0" : "z-40"
        }`}
        style={{ background: "linear-gradient(135deg, #be185d, #7c3aed)" }}
      >
        {musicPlaying ? "⏸" : "🎵"}
      </button>

      {/* ── HERO ── */}
      <section className="relative flex flex-col items-center justify-center pt-24 pb-16 px-4 text-center overflow-hidden">
        <ConfettiRain count={20} />
        {heroDecorators.map((d) => (
          <div
            key={d.emoji}
            className="absolute text-2xl pointer-events-none select-none animate-sway"
            style={{
              ...(d.style as React.CSSProperties),
              animationDuration: "4s",
              opacity: 0.7,
            }}
            aria-hidden="true"
          >
            {d.emoji}
          </div>
        ))}
        <div className="relative z-10 flex flex-col items-center">
          <PlaceholderImage
            src="/romiii/cover.jpg"
            alt="Romii"
            size="lg"
            gradient="from-rose-400 via-pink-400 to-purple-500"
            glow="0 0 60px 20px rgba(251,113,133,0.4), 0 0 120px 40px rgba(124,58,237,0.3)"
          />
          <h1
            className="text-5xl md:text-7xl font-extrabold mt-6 mb-3"
            style={{
              background: "linear-gradient(135deg, #fb7185, #a78bfa)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              filter: "drop-shadow(0 0 20px rgba(251,113,133,0.5))",
            }}
          >
            Romii 🌹
          </h1>
          <p className="text-lg md:text-xl font-semibold text-rose-300/80 max-w-md">
            My favorite person, my biggest weakness 💫
          </p>
        </div>
      </section>

      {/* ── OUR STORY TIMELINE ── */}
      <section className="max-w-2xl mx-auto px-4 pb-16">
        <ScrollFadeIn>
          <h2 className="text-3xl font-bold text-center text-rose-300 mb-10">
            Our Story 💫
          </h2>
        </ScrollFadeIn>
        <div className="relative">
          <div
            className="absolute left-6 top-0 bottom-0 w-0.5"
            style={{ background: "linear-gradient(180deg, #fb7185, #a78bfa)" }}
          />
          <div className="flex flex-col gap-6 pl-16">
            {storyEvents.map((ev, i) => (
              <ScrollFadeIn key={ev.title} delay={i * 120}>
                <GlassCard dark className="p-5 shimmer-card">
                  <div
                    className="absolute -left-10 w-5 h-5 rounded-full border-2 border-rose-400"
                    style={{
                      background: "linear-gradient(135deg, #fb7185, #a78bfa)",
                      marginTop: "4px",
                    }}
                  />
                  <div className="flex items-start gap-3">
                    <span className="text-3xl">{ev.emoji}</span>
                    <div>
                      <h3 className="font-bold text-lg text-rose-300">
                        {ev.title}
                      </h3>
                      <p className="text-sm text-rose-200/60 mt-1">{ev.desc}</p>
                    </div>
                  </div>
                </GlassCard>
              </ScrollFadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHAT I LOVE ABOUT YOU ── */}
      <section className="max-w-4xl mx-auto px-4 pb-16">
        <ScrollFadeIn>
          <h2 className="text-3xl font-bold text-center text-rose-300 mb-8">
            What I Love About You 💖
          </h2>
        </ScrollFadeIn>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-4">
          {loveCards.map((card, i) => (
            <ScrollFadeIn key={card.title} delay={i * 60}>
              <GlassCard
                dark
                className="p-5 shimmer-card hover:scale-105 transition-transform"
              >
                <div className="flex items-start gap-3">
                  <span className="text-3xl">{card.emoji}</span>
                  <div>
                    <h3 className="font-bold text-rose-300">{card.title}</h3>
                    <p className="text-sm text-rose-200/60 mt-1">{card.desc}</p>
                  </div>
                </div>
              </GlassCard>
            </ScrollFadeIn>
          ))}
        </div>
      </section>

      {/* ── ABILITIES ── */}
      <section className="max-w-4xl mx-auto px-4 pb-16 relative">
        <ScrollFadeIn>
          <h2 className="text-3xl font-bold text-center text-rose-300 mb-4">
            Abilities 🌟
          </h2>
          <p className="text-center text-rose-200/50 text-sm mb-8">
            Legendary skills. Unlockable by default.
          </p>
        </ScrollFadeIn>
        <div
          className="absolute -top-4 right-4 text-4xl animate-gift-bounce pointer-events-none select-none"
          aria-hidden="true"
        >
          🎁
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {abilities.map((ab, i) => (
            <ScrollFadeIn key={ab.title} delay={i * 100}>
              <GlassCard dark className="p-6 text-center shimmer-card">
                <div
                  className="inline-flex items-center justify-center w-14 h-14 rounded-full mb-3 text-2xl"
                  style={{
                    background:
                      "linear-gradient(135deg, rgba(251,113,133,0.3), rgba(124,58,237,0.3))",
                  }}
                >
                  {ab.emoji}
                </div>
                <div
                  className="text-xs font-bold tracking-widest uppercase mb-2"
                  style={{ color: "rgba(251,113,133,0.7)" }}
                >
                  Ability
                </div>
                <h3 className="font-bold text-rose-300 mb-2">{ab.title}</h3>
                <p className="text-sm text-rose-200/60">{ab.desc}</p>
              </GlassCard>
            </ScrollFadeIn>
          ))}
        </div>
      </section>

      {/* ── OUR MOMENTS ── */}
      <section className="max-w-4xl mx-auto px-4 pb-16 relative overflow-hidden">
        {bgStars.map((s) => (
          <div
            key={s.id}
            className="absolute pointer-events-none select-none text-sm animate-twinkle"
            style={{
              top: s.top,
              left: s.left,
              opacity: 0.2,
              animationDuration: `${2 + Math.random() * 3}s`,
              animationDelay: `${Math.random() * 3}s`,
            }}
            aria-hidden="true"
          >
            {s.emoji}
          </div>
        ))}
        <ScrollFadeIn>
          <h2 className="text-3xl font-bold text-center text-rose-300 mb-8 relative z-10">
            Our Moments 🌙
          </h2>
        </ScrollFadeIn>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 relative z-10">
          {moments.map((m, i) => (
            <ScrollFadeIn key={m.title} delay={i * 100}>
              <GlassCard
                dark
                className="p-6 shimmer-card hover:scale-105 transition-transform"
              >
                <div className="text-3xl mb-2">{m.emoji}</div>
                <h3 className="font-bold text-rose-300 mb-1">{m.title}</h3>
                <p className="text-sm text-rose-200/60">{m.desc}</p>
              </GlassCard>
            </ScrollFadeIn>
          ))}
        </div>
      </section>

      {/* ── SECRET SECTION ── */}
      <section className="max-w-lg mx-auto px-4 pb-20">
        <ScrollFadeIn>
          <h2 className="text-2xl font-bold text-center text-rose-300/60 mb-6">
            🔮 Private...
          </h2>
        </ScrollFadeIn>
        <ScrollFadeIn delay={100}>
          <SecretSection
            onModalOpen={() => setSecretModalOpen(true)}
            onModalClose={() => setSecretModalOpen(false)}
          />
        </ScrollFadeIn>
      </section>

      {/* Footer */}
      <footer className="text-center pb-8 px-4">
        <p className="text-rose-300/70 font-semibold mb-1">
          Made with love by Voiddd & Caffeine AI 💕
        </p>
        <p className="text-xs text-rose-400/40">
          © {new Date().getFullYear()}. Built with 💗 using{" "}
          <a
            href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-rose-300"
          >
            caffeine.ai
          </a>
        </p>
      </footer>
    </div>
  );
}
