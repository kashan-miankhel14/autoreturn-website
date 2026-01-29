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

type DownloadPlatform = "linux" | "windows" | "macos";

function useOS(): DownloadPlatform {
  const [os, setOs] = useState<DownloadPlatform>("linux");

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
      mouse.x = e.clientX;
      mouse.y = e.clientY;
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

    const density = Math.max(800, Math.min(2200, Math.floor((window.innerWidth * window.innerHeight) / 520)));
    const pts = Array.from({ length: density }).map((_, i) => {
      const x = (i / density) * w;
      const y = (Math.random() * h) | 0;
      return {
        x,
        y,
        vx: 0,
        vy: 0,
        seed: Math.random() * 1000,
        size: 1 + Math.random() * 1.6,
      };
    });

    let t0 = performance.now();

    const tick = (t: number) => {
      const dt = Math.min(40, t - t0);
      t0 = t;

      ctx.clearRect(0, 0, w, h);

      const time = t * 0.00028;
      const swirl = (window.scrollY || 0) * 0.00006;
      const accel = boost ? 1.8 : 1;

      for (let i = 0; i < pts.length; i++) {
        const p = pts[i];

        const wave =
          Math.sin((p.x * 0.004) + time * 6 + p.seed) * 0.65 +
          Math.cos((p.y * 0.004) - time * 5 + p.seed) * 0.45;

        const targetY = (h * 0.5) + wave * (24 + 16 * Math.sin(time + p.seed)) + Math.sin(swirl + p.seed) * 18;

        const dy = targetY - p.y;
        p.vy += dy * 0.00055 * accel;

        p.vx += (Math.cos(time + p.seed) * 0.012 + Math.sin(swirl + p.seed) * 0.008) * accel;

        if (mouse.active) {
          const dxm = p.x - mouse.x;
          const dym = p.y - mouse.y;
          const dist2 = dxm * dxm + dym * dym;
          const r = 140;
          if (dist2 < r * r) {
            const dist = Math.sqrt(dist2) || 1;
            const f = (1 - dist / r) * 0.36 * accel;
            p.vx += (dxm / dist) * f;
            p.vy += (dym / dist) * f;
          }
        }

        p.vx *= 0.985;
        p.vy *= 0.985;
        p.x += p.vx * (dt * 0.06);
        p.y += p.vy * (dt * 0.06);

        if (p.x < -10) p.x = w + 10;
        if (p.x > w + 10) p.x = -10;
        if (p.y < -20) p.y = h + 20;
        if (p.y > h + 20) p.y = -20;

        const alpha = 0.22 + (0.18 * Math.sin(time * 3 + p.seed));
        ctx.fillStyle = `rgba(15, 164, 175, ${alpha})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.globalCompositeOperation = "source-over";
      ctx.fillStyle = "rgba(15, 164, 175, 0.12)";
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
      className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[12px] font-medium text-white/80 backdrop-blur"
    >
      <Sparkles className="h-3.5 w-3.5 text-[#0FA4AF]" strokeWidth={2.2} />
      {children}
    </span>
  );
}

function SectionTitle({ kicker, title, desc, testId }: { kicker: string; title: string; desc: string; testId: string }) {
  return (
    <div className="mx-auto max-w-2xl text-center">
      <div
        data-testid={`${testId}-kicker`}
        className="mx-auto inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[12px] font-medium text-white/70"
      >
        <span className="h-1.5 w-1.5 rounded-full bg-[#0FA4AF]" />
        {kicker}
      </div>
      <h2
        data-testid={`${testId}-title`}
        className="mt-4 font-[Outfit] text-3xl font-extrabold tracking-tight text-white sm:text-4xl"
      >
        {title}
      </h2>
      <p data-testid={`${testId}-desc`} className="mt-3 text-balance text-base text-white/70 sm:text-lg">
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
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-120px" }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="aur-card aur-noise group relative overflow-hidden rounded-2xl p-6"
      data-testid={testId}
    >
      <div className="absolute -right-12 -top-14 h-44 w-44 rounded-full bg-[#0FA4AF]/15 blur-2xl transition-transform duration-500 group-hover:translate-y-2 group-hover:translate-x-1" />
      <div className="flex items-start gap-4">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-[#0FA4AF] transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:scale-[1.03]">
          {icon}
        </div>
        <div>
          <h3 data-testid={`${testId}-title`} className="font-[Outfit] text-lg font-semibold text-white">
            {title}
          </h3>
          <p data-testid={`${testId}-desc`} className="mt-1 text-sm leading-relaxed text-white/70">
            {description}
          </p>
        </div>
      </div>
      <div className="mt-5 flex items-center gap-2 text-xs font-medium text-white/55">
        <span className="inline-flex h-5 items-center rounded-full border border-white/10 bg-white/5 px-2">Local AI</span>
        <span className="inline-flex h-5 items-center rounded-full border border-white/10 bg-white/5 px-2">Voice</span>
        <span className="inline-flex h-5 items-center rounded-full border border-white/10 bg-white/5 px-2">Privacy</span>
      </div>
    </motion.div>
  );
}

const FEATURES = [
  {
    icon: <Mail className="h-5 w-5" strokeWidth={2.2} />,
    title: "One Inbox for Everything",
    description:
      "Stop switching between Gmail and Slack. See all your important messages in a single, beautiful dashboard designed for focus.",
    testId: "card-feature-unified-inbox",
  },
  {
    icon: <Mic className="h-5 w-5" strokeWidth={2.2} />,
    title: "Hands-Free Operation",
    description:
      'Just say "Hey Auto" and start talking. Read emails, send Slack messages, and check your tasks—all without touching your keyboard.',
    testId: "card-feature-voice-control",
  },
  {
    icon: <Shield className="h-5 w-5" strokeWidth={2.2} />,
    title: "100% Private AI",
    description:
      "Unlike cloud-based assistants, AutoReturn's AI runs entirely on YOUR machine using Ollama. Your emails never leave your computer.",
    testId: "card-feature-local-ai",
  },
  {
    icon: <Check className="h-5 w-5" strokeWidth={2.2} />,
    title: "Automatic Task Detection",
    description:
      "AutoReturn reads your messages and finds action items for you. Never miss a deadline hidden in an email again.",
    testId: "card-feature-task-extraction",
  },
  {
    icon: <Terminal className="h-5 w-5" strokeWidth={2.2} />,
    title: "Instant Draft Replies",
    description:
      "Get AI-generated reply suggestions that match the tone of the conversation. Review, edit, and send in seconds.",
    testId: "card-feature-draft-replies",
  },
  {
    icon: <Moon className="h-5 w-5" strokeWidth={2.2} />,
    title: "Focus Mode & Quiet Hours",
    description:
      "Set your focus time. AutoReturn will hold all non-urgent notifications until you're ready—no interruptions.",
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

function DownloadButton({
  os,
  setBoost,
}: {
  os: DownloadPlatform;
  setBoost: (v: boolean) => void;
}) {
  const label = useMemo(() => {
    if (os === "windows") return "Download for Windows";
    if (os === "macos") return "Download for macOS";
    return "Download for Linux";
  }, [os]);

  return (
    <Button
      data-testid="button-download-primary"
      size="lg"
      className="group relative h-12 rounded-xl bg-[#0FA4AF] px-5 text-[15px] font-semibold text-white shadow-[0_0_22px_rgba(15,164,175,0.45)] transition-transform duration-200 hover:scale-[1.03] hover:shadow-[0_0_30px_rgba(15,164,175,0.55)] active:scale-[0.99]"
      onMouseEnter={() => setBoost(true)}
      onMouseLeave={() => setBoost(false)}
      onClick={() => {
        const el = document.querySelector("#download");
        el?.scrollIntoView({ behavior: "smooth", block: "start" });
      }}
    >
      {label}
      <ChevronRight className="ml-1 h-4 w-4 opacity-80 transition-transform duration-200 group-hover:translate-x-0.5" />
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
      <div className="mx-auto max-w-6xl px-4">
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
              data-testid="link-download"
              href="#download"
              className="text-sm font-medium text-white/70 transition-colors hover:text-white"
              onClick={(e) => {
                e.preventDefault();
                document.querySelector("#download")?.scrollIntoView({ behavior: "smooth" });
              }}
            >
              Download
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
              data-testid="button-nav-download"
              size="sm"
              className="hidden rounded-xl bg-[#0FA4AF] text-white shadow-[0_0_18px_rgba(15,164,175,0.4)] hover:bg-[#0FA4AF]/90 md:inline-flex"
              onClick={() => {
                document.querySelector("#download")?.scrollIntoView({ behavior: "smooth" });
              }}
            >
              Download
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

function DownloadCards({ os }: { os: DownloadPlatform }) {
  const items = [
    {
      key: "linux" as const,
      platform: "Linux",
      formats: ".AppImage, .deb, .rpm",
      button: "Download for Linux",
    },
    {
      key: "windows" as const,
      platform: "Windows",
      formats: ".exe, .zip",
      button: "Download for Windows",
    },
    {
      key: "macos" as const,
      platform: "macOS",
      formats: ".dmg",
      button: "Download for macOS",
    },
  ];

  return (
    <div className="mt-10 grid gap-4 md:grid-cols-3">
      {items.map((it) => {
        const isPrimary = it.key === os;
        return (
          <div
            key={it.key}
            data-testid={`card-download-${it.key}`}
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
                  Recommended
                </span>
              ) : null}
            </div>

            <Button
              data-testid={`button-download-${it.key}`}
              className={cn(
                "mt-5 w-full rounded-xl",
                isPrimary
                  ? "bg-[#0FA4AF] text-white shadow-[0_0_18px_rgba(15,164,175,0.45)] hover:bg-[#0FA4AF]/90"
                  : "border border-white/10 bg-white/5 text-white hover:bg-white/8",
              )}
              variant={isPrimary ? "default" : "secondary"}
              onClick={() => {
                // Mock download interaction for prototype
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

          <div className="relative mx-auto max-w-6xl px-4">
            <div className="grid items-center gap-10 lg:grid-cols-12">
              <div className="lg:col-span-6">
                <Badge testId="badge-hero" >Fast • Local • Private</Badge>

                <h1
                  data-testid="text-hero-headline"
                  className="mt-5 text-balance font-[Outfit] text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl"
                >
                  Your Voice. Your AI. Your Privacy.
                </h1>
                <p
                  data-testid="text-hero-subheadline"
                  className="mt-4 max-w-xl text-balance text-base leading-relaxed text-white/70 sm:text-lg"
                >
                  AutoReturn unifies Gmail and Slack into one powerful interface—powered by a local AI that never leaves your machine.
                </p>

                <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center">
                  <DownloadButton os={os} setBoost={setBoost} />
                  <SecondaryButton />
                </div>

                <div className="mt-7 grid max-w-xl grid-cols-3 gap-3">
                  <div
                    data-testid="stat-privacy"
                    className="aur-card rounded-2xl px-4 py-3 text-center"
                  >
                    <div className="font-[Outfit] text-sm font-semibold text-white">100% Local</div>
                    <div className="mt-0.5 text-xs text-white/60">AI runs on-device</div>
                  </div>
                  <div
                    data-testid="stat-offline"
                    className="aur-card rounded-2xl px-4 py-3 text-center"
                  >
                    <div className="font-[Outfit] text-sm font-semibold text-white">Works Offline</div>
                    <div className="mt-0.5 text-xs text-white/60">after sync</div>
                  </div>
                  <div
                    data-testid="stat-free"
                    className="aur-card rounded-2xl px-4 py-3 text-center"
                  >
                    <div className="font-[Outfit] text-sm font-semibold text-white">Free & Open</div>
                    <div className="mt-0.5 text-xs text-white/60">no subscriptions</div>
                  </div>
                </div>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 16, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.7, ease: "easeOut" }}
                className="lg:col-span-6"
              >
                <div
                  data-testid="card-hero-mockup"
                  className="aur-card aur-noise relative overflow-hidden rounded-3xl p-6 sm:p-7"
                >
                  <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-[#0FA4AF]/25 to-transparent" />

                  <div className="flex items-center justify-between">
                    <div className="font-[Outfit] text-sm font-semibold text-white">Unified Inbox</div>
                    <div className="flex items-center gap-2">
                      <span
                        data-testid="status-ai"
                        className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[12px] font-medium text-white/75"
                      >
                        <span className="h-2 w-2 rounded-full bg-[#0FA4AF] shadow-[0_0_12px_rgba(15,164,175,0.8)]" />
                        AI Summarizing…
                      </span>
                    </div>
                  </div>

                  <div className="mt-6 space-y-3">
                    <div
                      data-testid="row-gmail"
                      className="group flex items-center justify-between rounded-2xl border border-white/10 bg-black/15 px-4 py-3 backdrop-blur"
                    >
                      <div className="flex items-center gap-3">
                        <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 ring-1 ring-white/10">
                          <span className="text-sm font-semibold text-white">G</span>
                        </span>
                        <div>
                          <div className="text-sm font-semibold text-white">Gmail</div>
                          <div className="text-xs text-white/60">2 urgent threads • 5 updates</div>
                        </div>
                      </div>
                      <span className="inline-flex items-center rounded-full bg-[#964734]/35 px-2.5 py-1 text-[11px] font-medium text-white/90 ring-1 ring-white/10">
                        Urgent
                      </span>
                    </div>

                    <div
                      data-testid="row-slack"
                      className="group flex items-center justify-between rounded-2xl border border-white/10 bg-black/15 px-4 py-3 backdrop-blur"
                    >
                      <div className="flex items-center gap-3">
                        <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 ring-1 ring-white/10">
                          <span className="text-sm font-semibold text-white">#</span>
                        </span>
                        <div>
                          <div className="text-sm font-semibold text-white">Slack</div>
                          <div className="text-xs text-white/60">@mentions • project standup</div>
                        </div>
                      </div>
                      <span className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[11px] font-medium text-white/70">
                        Focus Mode
                      </span>
                    </div>

                    <div
                      data-testid="row-tasks"
                      className="rounded-2xl border border-white/10 bg-black/10 px-4 py-3"
                    >
                      <div className="flex items-center justify-between">
                        <div className="text-sm font-semibold text-white">Tasks</div>
                        <div className="text-xs text-white/55">Extracted automatically</div>
                      </div>
                      <div className="mt-3 space-y-2">
                        {[
                          "Reply to Sarah about the budget",
                          "Confirm standup agenda",
                          "Follow up on PR review",
                        ].map((t, idx) => (
                          <div
                            key={t}
                            data-testid={`row-task-${idx}`}
                            className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2"
                          >
                            <span className="h-2 w-2 rounded-full bg-[#0FA4AF]" />
                            <span className="text-xs text-white/75">{t}</span>
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

          <div className="mx-auto mt-14 max-w-6xl px-4">
            <div className="h-px w-full bg-gradient-to-r from-transparent via-white/15 to-transparent" />
          </div>
        </section>

        <section id="features" className="relative mx-auto max-w-6xl px-4 py-16 sm:py-20">
          <SectionTitle
            testId="section-features"
            kicker="Core features"
            title="Everything you need, in one interface"
            desc="Six focused capabilities designed to keep you fast, private, and hands-free."
          />

          <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((f) => (
              <FeatureCard
                key={f.testId}
                icon={f.icon}
                title={f.title}
                description={f.description}
                testId={f.testId}
              />
            ))}
          </div>
        </section>

        <section className="relative mx-auto max-w-6xl px-4 pb-16 sm:pb-20">
          <SectionTitle
            testId="section-comparison"
            kicker="Local vs Cloud"
            title="AutoReturn vs. Cloud AI"
            desc="A clear, honest comparison—privacy and offline capability included by design."
          />

          <div
            data-testid="table-comparison"
            className="aur-card aur-noise mx-auto mt-10 overflow-hidden rounded-2xl"
          >
            <div className="grid grid-cols-3 gap-0 border-b border-white/10 bg-black/10 px-4 py-4 text-xs font-semibold text-white/70 sm:px-6">
              <div data-testid="table-head-feature">Feature</div>
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
                        <span className="h-2 w-2 rounded-full bg-[#0FA4AF] shadow-[0_0_14px_rgba(15,164,175,0.75)]" />
                        Yes
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
                          className="text-white/55"
                        >
                          {cloud === "limited"
                            ? "Limited"
                            : cloud === "generic"
                              ? "Generic"
                              : "Often paid/limited"}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <section id="how" className="relative mx-auto max-w-6xl px-4 pb-16 sm:pb-20">
          <SectionTitle
            testId="section-how"
            kicker="How it works"
            title="From setup to action in minutes"
            desc="A simple three-step flow—built around local processing and hands-free control."
          />

          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {[
              {
                title: "Connect Your Accounts",
                desc: "Securely link your Gmail and Slack using OAuth. Your credentials are encrypted and stored locally.",
              },
              {
                title: "Talk to Your Inbox",
                desc: 'Say "Hey Auto, what\'s important today?" and let the local AI summarize your emails and messages.',
              },
              {
                title: "Take Action Instantly",
                desc: "Reply by voice, extract tasks automatically, and stay on top of your work—hands-free.",
              },
            ].map((s, idx) => (
              <div
                key={s.title}
                data-testid={`card-step-${idx}`}
                className="aur-card aur-noise relative overflow-hidden rounded-2xl p-6"
              >
                <div className="absolute -right-10 -top-10 h-36 w-36 rounded-full bg-[#0FA4AF]/10 blur-2xl" />
                <div className="text-xs font-semibold text-white/65">Step {idx + 1}</div>
                <div data-testid={`text-step-title-${idx}`} className="mt-2 font-[Outfit] text-lg font-semibold text-white">
                  {s.title}
                </div>
                <div data-testid={`text-step-desc-${idx}`} className="mt-2 text-sm leading-relaxed text-white/70">
                  {s.desc}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section id="download" className="relative mx-auto max-w-6xl px-4 pb-20 sm:pb-24">
          <SectionTitle
            testId="section-download"
            kicker="Download"
            title="Get AutoReturn Today"
            desc="Available for Linux, Windows, and macOS. Free, open-source, and built for privacy."
          />

          <DownloadCards os={os} />

          <div className="mx-auto mt-10 max-w-3xl">
            <div
              data-testid="card-release-notes"
              className="aur-card aur-noise rounded-2xl p-6"
            >
              <div className="flex items-center justify-between gap-4">
                <div>
                  <div className="font-[Outfit] text-base font-semibold text-white">Latest release</div>
                  <div data-testid="text-release-version" className="mt-1 text-sm text-white/70">
                    v1.0.0 • Initial public release
                  </div>
                </div>
                <Button
                  data-testid="button-release-notes"
                  variant="secondary"
                  className="rounded-xl border border-white/10 bg-white/5 text-white hover:bg-white/8"
                  onClick={() => window.alert("Release notes coming soon.")}
                >
                  View notes
                </Button>
              </div>
              <div className="mt-4 grid gap-2 text-sm text-white/70 sm:grid-cols-2">
                {["Unified inbox UI", "Voice-first controls", "Local AI via Ollama", "Task detection & drafts"].map(
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

        <footer className="border-t border-white/10 bg-black/10">
          <div className="mx-auto max-w-6xl px-4 py-12">
            <div className="flex flex-col items-start justify-between gap-8 md:flex-row md:items-center">
              <div>
                <div data-testid="text-footer-brand" className="font-[Outfit] text-lg font-semibold text-white">
                  AutoReturn
                </div>
                <div data-testid="text-footer-tagline" className="mt-1 text-sm text-white/65">
                  Built with Privacy in Mind.
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-4">
                {[
                  { label: "Home", id: "top", testId: "link-footer-home" },
                  { label: "Features", id: "features", testId: "link-footer-features" },
                  { label: "Download", id: "download", testId: "link-footer-download" },
                  { label: "Documentation", id: "how", testId: "link-footer-docs" },
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
                © 2026 AutoReturn. A Final Year Project by Kashan Saeed.
              </div>
              <div
                data-testid="text-footer-note"
                className="text-xs text-white/45"
              >
                Privacy-first local AI powered by Ollama.
              </div>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}
