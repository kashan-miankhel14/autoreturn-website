import { useEffect, useMemo, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  Check,
  ChevronRight,
  Github,
  Mail,
  MessageSquare,
  Mic,
  Moon,
  Shield,
  Sparkles,
  Terminal,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type OSPlatform = "linux" | "windows" | "macos";

function useOS(): OSPlatform {
  const [os, setOs] = useState<OSPlatform>("linux");

  useEffect(() => {
    const ua = navigator.userAgent.toLowerCase();
    if (ua.includes("win")) return setOs("windows");
    if (ua.includes("mac")) return setOs("macos");
    return setOs("linux");
  }, []);

  return os;
}

function ParticleField({ boost }: { boost: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const isMobile = window.matchMedia("(max-width: 768px)").matches;
    if (prefersReducedMotion || isMobile) return;

    let raf = 0;
    let w = 0;
    let h = 0;
    let dpr = 1;

    const cyan = "#0FA4AF";

    const mouse = { x: 0, y: 0, active: false };
    const onMove = (e: MouseEvent) => {
      mouse.x = e.clientX + (Math.random() - 0.5) * 10; // Add slight randomness
      mouse.y = e.clientY + (Math.random() - 0.5) * 10;
      mouse.active = true;
    };
    const onLeave = () => {
      mouse.active = false;
    };

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const density = Math.max(600, Math.min(1800, Math.floor((window.innerWidth * window.innerHeight) / 600)));
    const pts = Array.from({ length: density }).map((_, i) => {
      const x = (i / density) * w + (Math.random() - 0.5) * 50; // Less uniform distribution
      const y = (Math.random() * h) | 0;
      return {
        x,
        y,
        vx: (Math.random() - 0.5) * 0.5, // Initial random velocity
        vy: (Math.random() - 0.5) * 0.5,
        seed: Math.random() * 1000,
        size: 0.8 + Math.random() * 1.8, // More size variation
      };
    });

    let t0 = performance.now();

    const tick = (t: number) => {
      const dt = Math.min(40, t - t0);
      t0 = t;

      ctx.clearRect(0, 0, w, h);

      const time = t * 0.0003 + Math.sin(t * 0.0001) * 0.1; // Less predictable timing
      const swirl = (window.scrollY || 0) * 0.00008;
      const accel = boost ? 1.6 : 1;

      for (let i = 0; i < pts.length; i++) {
        const p = pts[i];

        // More organic wave pattern
        const wave =
          Math.sin((p.x * 0.0035) + time * 5.5 + p.seed) * 0.7 +
          Math.cos((p.y * 0.0045) - time * 4.8 + p.seed) * 0.5 +
          Math.sin(time * 2 + p.seed) * 0.2; // Extra layer of movement

        const targetY = (h * 0.5) + wave * (20 + 18 * Math.sin(time + p.seed)) + Math.sin(swirl + p.seed) * 15;

        const dy = targetY - p.y;
        p.vy += dy * (0.0004 + Math.random() * 0.0002) * accel; // Slight randomness in acceleration

        p.vx += (Math.cos(time + p.seed) * 0.015 + Math.sin(swirl + p.seed) * 0.01) * accel;

        if (mouse.active) {
          const dxm = p.x - mouse.x;
          const dym = p.y - mouse.y;
          const dist2 = dxm * dxm + dym * dym;
          const r = 120 + Math.random() * 40; // Variable repulsion radius
          if (dist2 < r * r) {
            const dist = Math.sqrt(dist2) || 1;
            const f = (1 - dist / r) * (0.3 + Math.random() * 0.1) * accel;
            p.vx += (dxm / dist) * f;
            p.vy += (dym / dist) * f;
          }
        }

        p.vx *= 0.98 + Math.random() * 0.01; // Slightly variable friction
        p.vy *= 0.98 + Math.random() * 0.01;
        p.x += p.vx * (dt * 0.07);
        p.y += p.vy * (dt * 0.07);

        // Wrap around with slight randomness
        if (p.x < -15) p.x = w + 15 + Math.random() * 10;
        if (p.x > w + 15) p.x = -15 - Math.random() * 10;
        if (p.y < -25) p.y = h + 25 + Math.random() * 10;
        if (p.y > h + 25) p.y = -25 - Math.random() * 10;

        const alpha = 0.18 + (0.15 * Math.sin(time * 2.8 + p.seed)) + Math.random() * 0.05;
        ctx.fillStyle = `rgba(15, 164, 175, ${Math.max(0.05, alpha)})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.globalCompositeOperation = "source-over";
      ctx.fillStyle = "rgba(15, 164, 175, 0.08)";
      ctx.fillRect(0, 0, w, 1);

      raf = requestAnimationFrame(tick);
    };

    resize();
    window.addEventListener("resize", resize);
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseleave", onLeave);

    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseleave", onLeave);
    };
  }, [boost, prefersReducedMotion]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 h-full w-full"
      aria-hidden="true"
    />
  );
}

function Badge({ children, testId }: { children: React.ReactNode; testId: string }) {
  return (
    <span
      data-testid={testId}
      className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/8 px-3 py-1 text-[12px] font-medium text-white/85 backdrop-blur transform rotate-0.5"
    >
      <Sparkles className="h-3.5 w-3.5 text-[#0FA4AF]" strokeWidth={2.2} />
      {children}
    </span>
  );
}

function SectionTitle({ kicker, title, desc, testId }: { kicker: string; title: string; desc: string; testId: string }) {
  return (
    <div className="text-center">
      <div
        data-testid={`${testId}-kicker`}
        className="mx-auto inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/8 px-3 py-1 text-[12px] font-medium text-white/75 transform rotate-0.5"
      >
        <span className="h-1.5 w-1.5 rounded-full bg-[#0FA4AF]" />
        {kicker}
      </div>
      <h2
        data-testid={`${testId}-title`}
        className="mt-5 font-[Outfit] text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl"
        style={{ lineHeight: '1.15', letterSpacing: '-0.015em' }}
      >
        {title}
      </h2>
      <p data-testid={`${testId}-desc`} className="mt-4 text-balance text-base text-white/75 sm:text-lg lg:text-xl leading-relaxed max-w-4xl mx-auto">
        {desc}
      </p>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
  testId,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  testId: string;
}) {
  const randomRotation = Math.random() * 2 - 1; // Random rotation between -1 and 1 degree
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6, ease: "easeOut", delay: Math.random() * 0.2 }}
      className="aur-card aur-noise group relative overflow-hidden rounded-2xl p-6 hover:scale-[1.02] transition-transform duration-300"
      style={{ transform: `rotate(${randomRotation}deg)` }}
      data-testid={testId}
    >
      <div className="absolute -right-8 -top-12 h-40 w-40 rounded-full bg-[#0FA4AF]/12 blur-2xl transition-all duration-700 group-hover:translate-y-1 group-hover:translate-x-2 group-hover:bg-[#0FA4AF]/18" />
      <div className="flex items-start gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-white/15 bg-white/8 text-[#0FA4AF] transition-all duration-400 group-hover:-translate-y-1 group-hover:scale-105 group-hover:rotate-3">
          {icon}
        </div>
        <div>
          <h3 data-testid={`${testId}-title`} className="font-[Outfit] text-lg font-semibold text-white">
            {title}
          </h3>
          <p data-testid={`${testId}-desc`} className="mt-2 text-sm leading-relaxed text-white/75">
            {description}
          </p>
        </div>
      </div>
      <div className="mt-6 flex items-center gap-2 text-xs font-medium text-white/50">
        <span className="inline-flex h-5 items-center rounded-full border border-white/10 bg-white/5 px-2">Local</span>
        <span className="inline-flex h-5 items-center rounded-full border border-white/10 bg-white/5 px-2">Voice</span>
        <span className="inline-flex h-5 items-center rounded-full border border-white/10 bg-white/5 px-2">Private</span>
      </div>
    </motion.div>
  );
}

const FEATURES = [
  {
    icon: <Mail className="h-5 w-5" strokeWidth={2.2} />,
    title: "One Inbox for Everything",
    description:
      "Stop the Gmail-Slack dance. Everything important in one place, designed for humans who actually need to get work done.",
    testId: "card-feature-unified-inbox",
  },
  {
    icon: <Mic className="h-5 w-5" strokeWidth={2.2} />,
    title: "Just Talk to It",
    description:
      'Say "Hey Auto" and tell it what you need. Read emails, send messages, check tasks—all while your hands stay free for coffee.',
    testId: "card-feature-voice-control",
  },
  {
    icon: <Shield className="h-5 w-5" strokeWidth={2.2} />,
    title: "Your Data Stays Put",
    description:
      "Unlike those cloud assistants, AutoReturn runs on YOUR computer. Your emails never leave your machine. Ever.",
    testId: "card-feature-local-ai",
  },
  {
    icon: <Check className="h-5 w-5" strokeWidth={2.2} />,
    title: "Finds Your TODOs",
    description:
      "Automatically spots action items buried in your messages. No more \"wait, what was I supposed to do?\" moments.",
    testId: "card-feature-task-extraction",
  },
  {
    icon: <Terminal className="h-5 w-5" strokeWidth={2.2} />,
    title: "Writes Like You",
    description:
      "AI-generated replies that actually sound like you wrote them. Review, tweak, send. Takes seconds, not minutes.",
    testId: "card-feature-draft-replies",
  },
  {
    icon: <Moon className="h-5 w-5" strokeWidth={2.2} />,
    title: "Respects Your Focus",
    description:
      "Set focus time and AutoReturn holds the non-urgent stuff. Because deep work shouldn't be interrupted by \"quick questions.\"",
    testId: "card-feature-quiet-hours",
  },
];

const COMPARISON = [
  { label: "Data Privacy", auto: true, cloud: false },
  { label: "Works Offline", auto: true, cloud: false },
  { label: "Voice Control", auto: true, cloud: "limited" as const },
  { label: "Learns Your Style", auto: true, cloud: "generic" as const },
  { label: "Custom LLM Models", auto: true, cloud: false },
  { label: "Cost", auto: true, cloud: "paid" as const },
];

function GetStartedButton({
  os,
  setBoost,
}: {
  os: OSPlatform;
  setBoost: (v: boolean) => void;
}) {
  const label = useMemo(() => {
    if (os === "windows") return "Get for Windows";
    if (os === "macos") return "Get for macOS";
    return "Get for Linux";
  }, [os]);

  return (
    <Button
      data-testid="button-get-started-primary"
      size="lg"
      className="group relative h-12 rounded-xl bg-[#0FA4AF] px-5 text-[15px] font-semibold text-white shadow-[0_0_20px_rgba(15,164,175,0.4)] transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_28px_rgba(15,164,175,0.5)] active:scale-[0.98] hover:rotate-1"
      onMouseEnter={() => setBoost(true)}
      onMouseLeave={() => setBoost(false)}
      onClick={() => {
        const el = document.querySelector("#get-started");
        el?.scrollIntoView({ behavior: "smooth", block: "start" });
      }}
    >
      {label}
      <ChevronRight className="ml-1 h-4 w-4 opacity-80 transition-transform duration-200 group-hover:translate-x-1" />
    </Button>
  );
}

function SecondaryButton() {
  return (
    <Button
      data-testid="button-see-how-it-works"
      variant="secondary"
      size="lg"
      className="h-12 rounded-xl border border-white/10 bg-white/5 px-5 text-[15px] font-semibold text-white/90 backdrop-blur hover:bg-white/8"
      onClick={() => {
        const el = document.querySelector("#how");
        el?.scrollIntoView({ behavior: "smooth", block: "start" });
      }}
    >
      See How It Works <span className="ml-1">→</span>
    </Button>
  );
}

function Nav() {
  return (
    <div className="fixed left-0 right-0 top-0 z-30">
      <div className="mx-auto px-6 lg:px-12">
        <div className="mt-4 flex items-center justify-between rounded-2xl border border-white/10 bg-black/20 px-4 py-3 backdrop-blur-xl">
          <a
            data-testid="link-home"
            href="#"
            className="flex items-center gap-2"
            onClick={(e) => {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
          >
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-[#0FA4AF]/15 text-[#0FA4AF] ring-1 ring-white/10">
              <MessageSquare className="h-5 w-5" strokeWidth={2.3} />
            </span>
            <span className="font-[Outfit] text-sm font-semibold tracking-wide text-white">AutoReturn</span>
          </a>

          <div className="hidden items-center gap-6 md:flex">
            <a
              data-testid="link-features"
              href="#features"
              className="text-sm font-medium text-white/70 transition-colors hover:text-white"
              onClick={(e) => {
                e.preventDefault();
                document.querySelector("#features")?.scrollIntoView({ behavior: "smooth" });
              }}
            >
              Features
            </a>
            <a
              data-testid="link-get-started"
              href="#get-started"
              className="text-sm font-medium text-white/70 transition-colors hover:text-white"
              onClick={(e) => {
                e.preventDefault();
                document.querySelector("#get-started")?.scrollIntoView({ behavior: "smooth" });
              }}
            >
              Get Started
            </a>
            <a
              data-testid="link-documentation"
              href="#"
              className="text-sm font-medium text-white/70 transition-colors hover:text-white"
              onClick={(e) => {
                e.preventDefault();
                document.querySelector("#how")?.scrollIntoView({ behavior: "smooth" });
              }}
            >
              Documentation
            </a>
          </div>

          <div className="flex items-center gap-2">
            <Button
              data-testid="button-nav-get-started"
              size="sm"
              className="hidden rounded-xl bg-[#0FA4AF] text-white shadow-[0_0_16px_rgba(15,164,175,0.35)] hover:bg-[#0FA4AF]/90 md:inline-flex"
              onClick={() => {
                document.querySelector("#get-started")?.scrollIntoView({ behavior: "smooth" });
              }}
            >
              Get Started
            </Button>
            <a
              data-testid="link-github"
              href="#"
              className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white/70 transition-colors hover:text-white"
              onClick={(e) => {
                e.preventDefault();
              }}
              aria-label="GitHub"
            >
              <Github className="h-4.5 w-4.5" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

function InstallationCards({ os }: { os: OSPlatform }) {
  const items = [
    {
      key: "linux" as const,
      platform: "Linux",
      formats: ".AppImage, .deb, .rpm",
      button: "Download for Linux",
      note: "Works great on Ubuntu, Fedora, Arch..."
    },
    {
      key: "windows" as const,
      platform: "Windows",
      formats: ".exe, .zip",
      button: "Download for Windows",
      note: "Windows 10+ supported"
    },
    {
      key: "macos" as const,
      platform: "macOS",
      formats: ".dmg",
      button: "Download for macOS",
      note: "Intel & Apple Silicon"
    },
  ];

  return (
    <div className="mt-10 grid gap-6 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 max-w-5xl mx-auto">
      {items.map((it) => {
        const isPrimary = it.key === os;
        return (
          <div
            key={it.key}
            data-testid={`card-install-${it.key}`}
            className={cn(
              "aur-card aur-noise relative overflow-hidden rounded-2xl p-6",
              isPrimary && "aur-glow",
            )}
          >
            <div className="absolute -right-10 -top-10 h-36 w-36 rounded-full bg-[#0FA4AF]/10 blur-2xl" />
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-semibold text-white">{it.platform}</div>
                <div className="mt-1 text-xs text-white/60">Formats: {it.formats}</div>
              </div>
              {isPrimary ? (
                <span
                  data-testid={`status-recommended-${it.key}`}
                  className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[11px] font-medium text-white/70"
                >
                  Your OS
                </span>
              ) : null}
            </div>

            <Button
              data-testid={`button-get-${it.key}`}
              className={cn(
                "mt-5 w-full rounded-xl",
                isPrimary
                  ? "bg-[#0FA4AF] text-white shadow-[0_0_18px_rgba(15,164,175,0.45)] hover:bg-[#0FA4AF]/90"
                  : "border border-white/10 bg-white/5 text-white hover:bg-white/8",
              )}
              variant={isPrimary ? "default" : "secondary"}
              onClick={() => {
                // Mock interaction for prototype
                window.alert(`Coming soon: ${it.button}`);
              }}
            >
              {it.button}
            </Button>
          </div>
        );
      })}
    </div>
  );
}

export default function Home() {
  const os = useOS();
  const [boost, setBoost] = useState(false);

  return (
    <div className="aur-grid min-h-screen">
      <Nav />

      <main>
        <section className="relative overflow-hidden pt-28 sm:pt-32">
          <div className="absolute inset-0 opacity-90">
            <ParticleField boost={boost} />
          </div>
          <div className="pointer-events-none absolute inset-0 aur-noise" />

          <div className="relative px-6 lg:px-12">
            <div className="grid items-center gap-10 lg:grid-cols-12 xl:grid-cols-12">
              <div className="lg:col-span-5 xl:col-span-6">
                <Badge testId="badge-hero" >Actually Private • No BS</Badge>

                <h1
                  data-testid="text-hero-headline"
                  className="mt-6 text-balance font-[Outfit] text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl"
                  style={{ lineHeight: '1.1', letterSpacing: '-0.02em' }}
                >
                  <motion.span
                    initial={{ opacity: 0, x: -15 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.7, delay: 0.1, ease: "easeOut" }}
                    className="block"
                  >
                    Your Voice.
                  </motion.span>
                  <motion.span
                    initial={{ opacity: 0, x: -15 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.7, delay: 0.25, ease: "easeOut" }}
                    className="block text-[#0FA4AF]"
                  >
                    Your AI.
                  </motion.span>
                  <motion.span
                    initial={{ opacity: 0, x: -15 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.7, delay: 0.4, ease: "easeOut" }}
                    className="block"
                  >
                    Your Privacy.
                  </motion.span>
                </h1>
                <p
                  data-testid="text-hero-subheadline"
                  className="mt-5 max-w-xl text-balance text-base leading-relaxed text-white/75 sm:text-lg"
                >
                  Tired of juggling Gmail and Slack? We built AutoReturn so your emails and messages stay on <em>your</em> computer. No cloud servers snooping around.
                </p>

                <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center">
                  <GetStartedButton os={os} setBoost={setBoost} />
                  <SecondaryButton />
                </div>

                <div className="mt-8 grid max-w-2xl grid-cols-3 gap-6">
                  <div
                    data-testid="stat-privacy"
                    className="aur-card rounded-2xl px-4 py-3 text-center transform rotate-1"
                  >
                    <div className="font-[Outfit] text-sm font-semibold text-white">100% Yours</div>
                    <div className="mt-0.5 text-xs text-white/65">stays on your machine</div>
                  </div>
                  <div
                    data-testid="stat-offline"
                    className="aur-card rounded-2xl px-4 py-3 text-center transform -rotate-1"
                  >
                    <div className="font-[Outfit] text-sm font-semibold text-white">Works Offline</div>
                    <div className="mt-0.5 text-xs text-white/65">internet? optional</div>
                  </div>
                  <div
                    data-testid="stat-free"
                    className="aur-card rounded-2xl px-4 py-3 text-center transform rotate-0.5"
                  >
                    <div className="font-[Outfit] text-sm font-semibold text-white">Actually Free</div>
                    <div className="mt-0.5 text-xs text-white/65">no catch, promise</div>
                  </div>
                </div>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.96, rotate: -1 }}
                animate={{ opacity: 1, y: 0, scale: 1, rotate: 0 }}
                transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
                className="lg:col-span-7 xl:col-span-6"
              >
                <div
                  data-testid="card-hero-mockup"
                  className="aur-card aur-noise relative overflow-hidden rounded-3xl p-6 sm:p-7 shadow-[0_0_40px_-10px_rgba(15,164,175,0.25)] transform rotate-1 hover:rotate-0 transition-transform duration-500"
                >
                  <motion.div
                    animate={{
                      opacity: [0.12, 0.25, 0.12],
                      scale: [1, 1.02, 1],
                    }}
                    transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-[#0FA4AF]/35 to-transparent"
                  />

                  <div className="flex items-center justify-between">
                    <div className="font-[Outfit] text-sm font-semibold text-white">Unified Inbox</div>
                    <div className="flex items-center gap-2">
                      <span
                        data-testid="status-ai"
                        className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/8 px-3 py-1 text-[12px] font-medium text-white/80"
                      >
                        <span className="h-2 w-2 rounded-full bg-[#0FA4AF] shadow-[0_0_10px_rgba(15,164,175,0.7)]" />
                        AI is thinking...
                      </span>
                    </div>
                  </div>

                  <div className="mt-6 space-y-3">
                    <div
                      data-testid="row-gmail"
                      className="group flex items-center justify-between rounded-2xl border border-white/15 bg-black/20 px-4 py-3 backdrop-blur hover:bg-black/25 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-white/8 ring-1 ring-white/15">
                          <span className="text-sm font-bold text-white">📧</span>
                        </span>
                        <div>
                          <div className="text-sm font-semibold text-white">Gmail</div>
                          <div className="text-xs text-white/65">3 things need your attention</div>
                        </div>
                      </div>
                      <span className="inline-flex items-center rounded-full bg-[#d97706]/25 px-2.5 py-1 text-[11px] font-medium text-orange-200 ring-1 ring-orange-400/20">
                        Needs reply
                      </span>
                    </div>

                    <div
                      data-testid="row-slack"
                      className="group flex items-center justify-between rounded-2xl border border-white/15 bg-black/20 px-4 py-3 backdrop-blur hover:bg-black/25 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-white/8 ring-1 ring-white/15">
                          <span className="text-sm font-bold text-white">💬</span>
                        </span>
                        <div>
                          <div className="text-sm font-semibold text-white">Slack</div>
                          <div className="text-xs text-white/65">@you in #general • team standup</div>
                        </div>
                      </div>
                      <span className="inline-flex items-center rounded-full border border-white/15 bg-white/8 px-2.5 py-1 text-[11px] font-medium text-white/75">
                        Quiet mode
                      </span>
                    </div>

                    <div
                      data-testid="row-tasks"
                      className="rounded-2xl border border-white/15 bg-black/15 px-4 py-3"
                    >
                      <div className="flex items-center justify-between">
                        <div className="text-sm font-semibold text-white">Tasks</div>
                        <div className="text-xs text-white/60">Found automatically</div>
                      </div>
                      <div className="mt-3 space-y-2">
                        {[
                          "Reply to Sarah about the budget (due today)",
                          "Confirm meeting with design team",
                          "Review Jake's PR before EOD",
                        ].map((t, idx) => (
                          <div
                            key={t}
                            data-testid={`row-task-${idx}`}
                            className="flex items-center gap-2 rounded-xl border border-white/15 bg-white/8 px-3 py-2 hover:bg-white/12 transition-colors"
                          >
                            <span className="h-2 w-2 rounded-full bg-[#0FA4AF]" />
                            <span className="text-xs text-white/80">{t}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                    <div className="flex items-center gap-3">
                      <Mic className="h-4.5 w-4.5 text-[#0FA4AF]" strokeWidth={2.2} />
                      <div>
                        <div className="text-xs font-semibold text-white/85">Say “Hey Auto”</div>
                        <div className="text-[11px] text-white/55">Then ask: “What’s important today?”</div>
                      </div>
                    </div>
                    <div className="text-[11px] font-medium text-white/60">⌘ + Space</div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>

          <div className="mt-14 px-6 lg:px-12">
            <div className="h-px w-full bg-gradient-to-r from-transparent via-white/15 to-transparent" />
          </div>
        </section>

        <section id="features" className="relative px-6 lg:px-12 py-16 sm:py-20">
          <SectionTitle
            testId="section-features"
            kicker="What it actually does"
            title="Everything you need, nothing you don't"
            desc="Six things that matter. Built by someone who was tired of switching between 47 different apps."
          />

          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6">
            {FEATURES.map((f, index) => (
              <div key={f.testId} className={
                index < 2 ? "lg:col-span-2 xl:col-span-2" : 
                index === 2 ? "md:col-span-2 lg:col-span-2 xl:col-span-2" : 
                "lg:col-span-2 xl:col-span-1"
              }>
                <FeatureCard
                  icon={f.icon}
                  title={f.title}
                  description={f.description}
                  testId={f.testId}
                />
              </div>
            ))}
          </div>
        </section>

        <section className="relative px-6 lg:px-12 pb-16 sm:pb-20">
          <SectionTitle
            testId="section-comparison"
            kicker="The honest truth"
            title="Why we built this (and why it matters)"
            desc="Cloud AI companies want your data. We want you to keep it. Here's the real difference."
          />

          <div
            data-testid="table-comparison"
            className="aur-card aur-noise mx-auto mt-10 overflow-hidden rounded-2xl max-w-5xl"
          >
            <div className="grid grid-cols-3 gap-0 border-b border-white/10 bg-black/10 px-4 py-4 text-xs font-semibold text-white/70 sm:px-6">
              <div data-testid="table-head-feature">What matters</div>
              <div data-testid="table-head-autoreturn" className="text-center text-white">AutoReturn</div>
              <div data-testid="table-head-cloud" className="text-center">Cloud AI</div>
            </div>

            <div className="divide-y divide-white/10">
              {COMPARISON.map((row, idx) => {
                const cloud = row.cloud;
                return (
                  <div
                    key={row.label}
                    data-testid={`row-comparison-${idx}`}
                    className={cn(
                      "grid grid-cols-3 items-center px-4 py-4 text-sm sm:px-6",
                      idx % 2 === 1 && "bg-white/[0.03]",
                    )}
                  >
                    <div data-testid={`text-comparison-feature-${idx}`} className="text-white/85">
                      {row.label}
                    </div>
                    <div className="flex items-center justify-center">
                      <span
                        data-testid={`status-comparison-auto-${idx}`}
                        className="inline-flex items-center gap-2 text-[#0FA4AF]"
                      >
                        <span className="h-2 w-2 rounded-full bg-[#0FA4AF] shadow-[0_0_12px_rgba(15,164,175,0.6)]" />
                        {row.label === "Cost" ? "Free forever" : "Yes"}
                      </span>
                    </div>
                    <div className="flex items-center justify-center">
                      {cloud === false ? (
                        <span data-testid={`status-comparison-cloud-${idx}`} className="text-white/45">
                          No
                        </span>
                      ) : (
                        <span
                          data-testid={`status-comparison-cloud-${idx}`}
                          className="text-white/50"
                        >
                          {cloud === "limited"
                            ? "Kinda"
                            : cloud === "generic"
                              ? "Generic responses"
                              : "Usually costs $$$"}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <section id="how" className="relative px-6 lg:px-12 pb-16 sm:pb-20">
          <SectionTitle
            testId="section-how"
            kicker="Getting started"
            title="Three steps, then you're done"
            desc="No PhD required. No 47-step setup process. Just connect, talk, and get back to work."
          />

          <div className="mt-12 grid gap-6 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3">
            {[
              {
                title: "Connect Your Stuff",
                desc: "Link Gmail and Slack securely. Your login stays on your computer, encrypted and safe.",
              },
              {
                title: "Start Talking",
                desc: 'Say "Hey Auto, what\'s important?" and watch the magic happen. No typing required.',
              },
              {
                title: "Actually Get Things Done",
                desc: "Reply by voice, catch tasks automatically, stay focused. Like having a really good assistant.",
              },
            ].map((s, idx) => (
              <div
                key={s.title}
                data-testid={`card-step-${idx}`}
                className="aur-card aur-noise relative overflow-hidden rounded-2xl p-6 transform hover:scale-105 transition-all duration-300"
                style={{ transform: `rotate(${(idx - 1) * 0.5}deg)` }}
              >
                <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-[#0FA4AF]/8 blur-xl" />
                <div className="text-xs font-semibold text-white/60">Step {idx + 1}</div>
                <div data-testid={`text-step-title-${idx}`} className="mt-3 font-[Outfit] text-lg font-semibold text-white">
                  {s.title}
                </div>
                <div data-testid={`text-step-desc-${idx}`} className="mt-3 text-sm leading-relaxed text-white/75">
                  {s.desc}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section id="get-started" className="relative px-6 lg:px-12 pb-20 sm:pb-24">
          <SectionTitle
            testId="section-get-started"
            kicker="Download it"
            title="Pick your poison"
            desc="Works on Linux, Windows, and macOS. Free download, no strings attached."
          />

          <InstallationCards os={os} />

          <div className="mx-auto mt-10 max-w-4xl">
            <div
              data-testid="card-release-notes"
              className="aur-card aur-noise rounded-2xl p-6 transform rotate-0.5"
            >
              <div className="flex items-center justify-between gap-4">
                <div>
                  <div className="font-[Outfit] text-base font-semibold text-white">What's new</div>
                  <div data-testid="text-release-version" className="mt-1 text-sm text-white/75">
                    v1.0.0 • Fresh out of the oven
                  </div>
                </div>
                <Button
                  data-testid="button-release-notes"
                  variant="secondary"
                  className="rounded-xl border border-white/15 bg-white/8 text-white hover:bg-white/12"
                  onClick={() => window.alert("Release notes coming soon.")}
                >
                  What's new?
                </Button>
              </div>
              <div className="mt-4 grid gap-2 text-sm text-white/75 sm:grid-cols-2">
                {["Unified inbox that actually works", "Voice controls (say goodbye to typing)", "Local AI (your data stays put)", "Smart task detection"].map(
                  (t, i) => (
                    <div key={t} data-testid={`text-release-item-${i}`} className="flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-[#0FA4AF]" />
                      {t}
                    </div>
                  ),
                )}
              </div>
            </div>
          </div>
        </section>

        <section id="faq" className="relative px-6 lg:px-12 pb-16 sm:pb-20">
          <SectionTitle
            testId="section-faq"
            kicker="Questions?"
            title="The stuff people actually ask"
            desc="Real questions from real people who tried AutoReturn."
          />
          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
            {[
              {
                q: "Is this actually free?",
                a: "Yep. No hidden costs, no premium tiers, no \"free trial then pay up.\" It's free because we believe privacy shouldn't cost extra.",
              },
              {
                q: "Where does my data go?",
                a: "Nowhere. It stays on your computer. The AI runs locally using Ollama. We literally can't see your emails even if we wanted to.",
              },
              {
                q: "What AI does it use?",
                a: "Whatever you want! Works with Llama, Qwen, Mistral, or any other model that runs on Ollama. Switch anytime.",
              },
              {
                q: "Does it work without internet?",
                a: "Once your emails sync, absolutely. Read, search, compose drafts—all offline. Perfect for flights or sketchy WiFi.",
              },
              {
                q: "Why should I trust you?",
                a: "Fair question. The code is open source, so you can see exactly what it does. Plus, since everything runs locally, there's nothing to hide.",
              },
            ].map((faq, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="aur-card aur-noise rounded-2xl p-6 transform hover:scale-[1.01] transition-all duration-200"
                style={{ transform: `rotate(${(idx % 2 === 0 ? 0.3 : -0.3)}deg)` }}
              >
                <h3 className="font-semibold text-white text-base">{faq.q}</h3>
                <p className="mt-3 text-sm text-white/75 leading-relaxed">{faq.a}</p>
              </motion.div>
            ))}
          </div>
        </section>

        <section id="roadmap" className="relative px-6 lg:px-12 pb-16 sm:pb-20">
          <SectionTitle
            testId="section-roadmap"
            kicker="What's next"
            title="Cool stuff we're building"
            desc="v2.0 ideas that got us excited. No promises on timelines—good software takes time."
          />
          <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4">
            {[
              {
                title: "Search Like a Human",
                desc: "Ask \"What did Sarah say about the budget?\" instead of hunting for keywords. Because that's how your brain actually works.",
              },
              {
                title: "Your Documents, Integrated",
                desc: "Let AutoReturn read your PDFs and notes so it can give smarter replies. Local files only, obviously.",
              },
              {
                title: "Phone as Remote",
                desc: "Use your phone as a wireless mic for your desktop. No internet needed—just local network magic.",
              },
              {
                title: "Actually Sound Like You",
                desc: "Train the AI on your own sent emails so replies match your writing style perfectly. Creepy? Maybe. Useful? Definitely.",
              },
            ].map((item, idx) => (
              <div 
                key={idx} 
                className="flex gap-5 p-3 rounded-xl hover:bg-white/5 transition-colors duration-200"
                style={{ transform: `rotate(${(idx % 2 === 0 ? 0.2 : -0.2)}deg)` }}
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#0FA4AF]/20 text-[#0FA4AF] text-sm font-bold border border-[#0FA4AF]/30">
                  {idx + 1}
                </div>
                <div>
                  <h4 className="font-semibold text-white text-base">{item.title}</h4>
                  <p className="mt-2 text-sm text-white/65 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <footer className="border-t border-white/10 bg-black/10">
          <div className="px-6 lg:px-12 py-12">
            <div className="flex flex-col items-start justify-between gap-8 md:flex-row md:items-center">
              <div>
                <div data-testid="text-footer-brand" className="font-[Outfit] text-lg font-semibold text-white">
                  AutoReturn
                </div>
                <div data-testid="text-footer-tagline" className="mt-1 text-sm text-white/65">
                  Built by someone who cares about privacy.
                </div>
                <div className="mt-2 text-xs text-white/50 italic">
                  PS: No venture capital, no data harvesting, just good software.
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-4">
                {[
                  { label: "Home", id: "top", testId: "link-footer-home" },
                  { label: "Features", id: "features", testId: "link-footer-features" },
                  { label: "FAQ", id: "faq", testId: "link-footer-faq" },
                  { label: "Roadmap", id: "roadmap", testId: "link-footer-roadmap" },
                  { label: "Get Started", id: "get-started", testId: "link-footer-get-started" },
                ].map((l) => (
                  <a
                    key={l.testId}
                    data-testid={l.testId}
                    href={l.id === "top" ? "#" : `#${l.id}`}
                    className="text-sm font-medium text-white/65 transition-colors hover:text-white"
                    onClick={(e) => {
                      e.preventDefault();
                      if (l.id === "top") window.scrollTo({ top: 0, behavior: "smooth" });
                      else document.querySelector(`#${l.id}`)?.scrollIntoView({ behavior: "smooth" });
                    }}
                  >
                    {l.label}
                  </a>
                ))}

                <a
                  data-testid="link-footer-github"
                  href="#"
                  className="inline-flex items-center gap-2 text-sm font-medium text-white/65 transition-colors hover:text-white"
                  onClick={(e) => {
                    e.preventDefault();
                  }}
                >
                  <Github className="h-4 w-4" /> GitHub
                </a>
              </div>
            </div>

            <div className="mt-10 flex flex-col items-start justify-between gap-3 border-t border-white/10 pt-6 sm:flex-row sm:items-center">
              <div data-testid="text-copyright" className="text-xs text-white/55">
                © 2026 AutoReturn. Made by Kashan Saeed during way too many late nights.
              </div>
              <div
                data-testid="text-footer-note"
                className="text-xs text-white/45"
              >
                Your data stays yours. Powered by Ollama.
              </div>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}
