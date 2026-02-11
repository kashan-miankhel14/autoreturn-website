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

    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;

    const isMobile = window.matchMedia("(max-width: 768px)").matches;
    if (prefersReducedMotion || isMobile) return;

    let raf = 0;
    let w = 0;
    let h = 0;
    let dpr = 1;

    const cyan = "#0FA4AF";
    const bg = "#003135";

    const mouse = { x: -1000, y: -1000, active: false };
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
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    // Higher density for "sand" effect
    const density = Math.max(1200, Math.min(4000, Math.floor((window.innerWidth * window.innerHeight) / 250)));
    const pts = Array.from({ length: density }).map((_, i) => {
      return {
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.2,
        vy: (Math.random() - 0.5) * 0.2,
        seed: Math.random() * Math.PI * 2,
        size: 0.6 + Math.random() * 1.4,
        speedFactor: 0.5 + Math.random() * 0.5,
      };
    });

    let t0 = performance.now();

    const tick = (t: number) => {
      const dt = Math.min(32, t - t0);
      t0 = t;

      // Solid background for performance with {alpha: false}
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, w, h);

      const time = t * 0.0004;
      const scrollY = window.scrollY || 0;
      const accel = boost ? 2.5 : 1;

      ctx.beginPath();
      for (let i = 0; i < pts.length; i++) {
        const p = pts[i];

        // Fluid-like flow field
        const nx = p.x * 0.002;
        const ny = p.y * 0.002;
        const angle = (Math.sin(nx + time) + Math.cos(ny - time * 0.8)) * Math.PI;

        p.vx += Math.cos(angle) * 0.02 * p.speedFactor * accel;
        p.vy += Math.sin(angle) * 0.02 * p.speedFactor * accel;

        if (mouse.active) {
          const dxm = p.x - mouse.x;
          const dym = p.y - mouse.y;
          const dist2 = dxm * dxm + dym * dym;
          const r = 180;
          if (dist2 < r * r) {
            const dist = Math.sqrt(dist2) || 1;
            const f = (1 - dist / r) * 0.15 * accel;
            p.vx += (dxm / dist) * f;
            p.vy += (dym / dist) * f;
          }
        }

        p.vx *= 0.96;
        p.vy *= 0.96;
        p.x += p.vx * (dt * 0.1);
        p.y += p.vy * (dt * 0.1);

        // Responsive wrapping
        if (p.x < -20) p.x = w + 20;
        if (p.x > w + 20) p.x = -20;
        if (p.y < -20) p.y = h + 20;
        if (p.y > h + 20) p.y = -20;

        // Draw batching for performance
        // Only draw half the particles if performance is an issue, but we use batching here
        const alpha = 0.1 + (0.15 * Math.sin(time + p.seed));
        ctx.fillStyle = `rgba(15, 164, 175, ${alpha})`;
        ctx.fillRect(p.x, p.y, p.size, p.size);
      }

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
      style={{ filter: 'blur(0.5px)' }}
      aria-hidden="true"
    />
  );
}

function WaveDivider({ flip = false, className = "" }: { flip?: boolean; className?: string }) {
  return (
    <div className={cn("relative h-24 w-full overflow-hidden leading-[0]", flip && "rotate-180", className)}>
      <svg
        className="relative block h-full w-[200%] md:w-full"
        data-name="Layer 1"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1200 120"
        preserveAspectRatio="none"
      >
        <path
          d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V95.8C58.47,104.59,121.88,116,187.58,11.21c32.61-52,65.23-52,97.85-52C305.6,5.39,313.51,33,321.39,56.44Z"
          className="fill-[#003135] opacity-30"
        ></path>
        <path
          d="M985.66,92.83c-78.99-20.83-161.88-61.83-241.82-78.63-82.26-17.34-168.06-16.33-250.45.39-57.84,11.73-114,31.07-172,41.86-7.88-23.44-15.79-51.05-33.81-51.23-32.62,0-65.24,0-97.85,52C121.88,116,58.47,104.59,0,95.8V120H1200V95.8C1131.53,104.59,1055.71,97.22,985.66,92.83Z"
          className="fill-[#003135]"
        ></path>
      </svg>
    </div>
  );
}

function Badge({ children, testId }: { children: React.ReactNode; testId: string }) {
  return (
    <span
      data-testid={testId}
      className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/8 px-3 py-1 text-[12px] font-medium text-white/85 backdrop-blur"
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
        className="mx-auto inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/8 px-3 py-1 text-[12px] font-medium text-white/75"
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

function InboxVisual() {
  return (
    <div className="relative mt-4 h-24 w-full bg-white/5 rounded-xl border border-white/10 overflow-hidden">
      <div className="absolute inset-x-2 top-2 p-2 bg-white/10 rounded-lg flex gap-2">
        <div className="h-2 w-2 rounded-full bg-red-400" />
        <div className="h-2 w-2/3 bg-white/20 rounded" />
      </div>
      <div className="absolute inset-x-2 top-10 p-2 bg-[#0FA4AF]/10 rounded-lg flex gap-2">
        <div className="h-2 w-2 rounded-full bg-[#0FA4AF]" />
        <div className="h-2 w-1/2 bg-white/20 rounded" />
      </div>
      <div className="absolute inset-x-2 top-[72px] p-2 bg-white/5 rounded-lg flex gap-2 overflow-hidden opacity-50">
        <div className="h-2 w-2 rounded-full bg-purple-400" />
        <div className="h-2 w-3/4 bg-white/20 rounded" />
      </div>
    </div>
  );
}

function VoiceVisual() {
  return (
    <div className="relative mt-4 h-24 w-full bg-white/5 rounded-xl border border-white/10 flex items-center justify-center">
      <div className="flex items-center gap-1">
        {[0, 1, 2, 3, 2, 1, 0].map((h, i) => (
          <motion.div
            key={i}
            animate={{ height: [8, 16 + h * 8, 8] }}
            transition={{ duration: 1, repeat: Infinity, delay: i * 0.1 }}
            className="w-1 bg-[#0FA4AF] rounded-full"
          />
        ))}
      </div>
      <div className="absolute bottom-2 text-[8px] font-bold text-[#0FA4AF]/60 uppercase tracking-widest">Processing Voice Input</div>
    </div>
  );
}

function PrivacyVisual() {
  return (
    <div className="relative mt-4 h-24 w-full bg-white/5 rounded-xl border border-white/10 overflow-hidden">
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative">
          <Shield className="h-10 w-10 text-[#0FA4AF]/40" />
          <motion.div
            animate={{ opacity: [0, 1, 0], scale: [0.8, 1.2, 0.8] }}
            transition={{ duration: 3, repeat: Infinity }}
            className="absolute inset-0 bg-[#0FA4AF]/20 blur-xl rounded-full"
          />
        </div>
      </div>
      <div className="absolute inset-x-0 bottom-0 py-1 bg-[#0FA4AF]/20 text-[8px] text-center font-bold text-white uppercase">Data Stays On-Device</div>
    </div>
  );
}

function TaskVisual() {
  return (
    <div className="relative mt-4 h-24 w-full bg-white/5 rounded-xl border border-white/10 p-3">
      <div className="flex flex-col gap-2">
        <div className="h-1.5 w-full bg-white/10 rounded" />
        <div className="h-1.5 w-3/4 bg-white/10 rounded" />
        <div className="mt-1 flex items-center gap-2">
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="h-3 w-3 rounded-sm border border-[#0FA4AF] flex items-center justify-center"
          >
            <Check className="h-2 w-2 text-[#0FA4AF]" />
          </motion.div>
          <div className="h-1.5 w-1/2 bg-[#0FA4AF]/40 rounded" />
        </div>
      </div>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
  testId,
  visual,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  testId: string;
  visual?: React.ReactNode;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6, ease: "easeOut", delay: Math.random() * 0.2 }}
      className="aur-card aur-noise group relative flex h-full flex-col overflow-hidden rounded-2xl p-6 transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(15,164,175,0.15)]"
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

      <div className="mt-auto pt-6">
        {visual}
      </div>

      <div className="mt-6 flex items-center gap-2 text-xs font-medium text-white/50">
        <span className="inline-flex h-5 items-center rounded-full border border-white/10 bg-white/5 px-2">Local</span>
        <span className="inline-flex h-5 items-center rounded-full border border-white/10 bg-white/5 px-2">Voice</span>
        <span className="inline-flex h-5 items-center rounded-full border border-white/10 bg-white/5 px-2">Private</span>
      </div>
    </motion.div>
  );
}

function DraftVisual() {
  return (
    <div className="relative mt-4 h-24 w-full bg-white/5 rounded-xl border border-white/10 p-3 flex items-center justify-center">
      <div className="relative">
        <motion.div
          animate={{ x: [0, 50, 0], opacity: [0, 1, 0] }}
          transition={{ duration: 3, repeat: Infinity }}
          className="absolute -top-4 left-0 text-cyan-400"
        >
          <Terminal className="h-4 w-4" />
        </motion.div>
        <div className="space-y-2">
          <div className="h-1.5 w-24 bg-white/10 rounded" />
          <div className="h-1.5 w-20 bg-[#0FA4AF]/30 rounded" />
          <div className="h-1.5 w-28 bg-white/10 rounded" />
        </div>
      </div>
    </div>
  );
}

function FocusVisual() {
  return (
    <div className="relative mt-4 h-24 w-full bg-white/5 rounded-xl border border-white/10 flex items-center justify-center">
      <div className="relative">
        <motion.div
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0 rounded-full border border-dashed border-[#0FA4AF]/30"
        />
        <Moon className="h-8 w-8 text-[#0FA4AF]" />
      </div>
      <div className="absolute top-2 right-2 flex items-center gap-1">
        <div className="h-1.5 w-4 rounded-full bg-[#0FA4AF]" />
        <div className="h-1.5 w-1.5 rounded-full bg-white/20" />
      </div>
    </div>
  );
}

const FEATURES = [
  {
    icon: <Mail className="h-5 w-5" strokeWidth={2.2} />,
    title: "One Inbox for Everything",
    description: "Unify Gmail and Slack into a single stream. Stop switching apps and start focusing on what matters.",
    visual: <InboxVisual />,
    testId: "card-feature-unified-inbox",
  },
  {
    icon: <Mic className="h-5 w-5" strokeWidth={2.2} />,
    title: "Just Talk to It",
    description: "Read, reply, and manage your day using only your voice. Hands-free productivity, simplified.",
    visual: <VoiceVisual />,
    testId: "card-feature-voice-control",
  },
  {
    icon: <Shield className="h-5 w-5" strokeWidth={2.2} />,
    title: "Privacy by Design",
    description: "All processing happens 100% locally on your machine. Your data never leaves your hardware.",
    visual: <PrivacyVisual />,
    testId: "card-feature-local-ai",
  },
  {
    icon: <Check className="h-5 w-5" strokeWidth={2.2} />,
    title: "Automated Task Flow",
    description: "AutoReturn extracts action items from your messages automatically. Never lose a task again.",
    visual: <TaskVisual />,
    testId: "card-feature-task-extraction",
  },
  {
    icon: <Terminal className="h-5 w-5" strokeWidth={2.2} />,
    title: "AI Draft Replies",
    description: "Get context-aware reply suggestions that sound like you. Review, tweak, and send in seconds.",
    visual: <DraftVisual />,
    testId: "card-feature-draft-replies",
  },
  {
    icon: <Moon className="h-5 w-5" strokeWidth={2.2} />,
    title: "Intelligent Focus",
    description: "Silence the noise. AutoReturn filters non-urgent pings so you can stay in your deep work flow.",
    visual: <FocusVisual />,
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
              className="hidden rounded-xl bg-[#0FA4AF] font-semibold text-white shadow-[0_0_16px_hsl(var(--cyan)/0.35)] hover:bg-[#0FA4AF]/90 md:inline-flex"
              onClick={() => {
                document.querySelector("#get-started")?.scrollIntoView({ behavior: "smooth" });
              }}
            >
              Get AutoReturn
            </Button>
            <a
              data-testid="link-github"
              href="#"
              className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white/70 transition-all hover:bg-white/10 hover:text-white"
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
      button: "Get for Linux",
      note: "Works great on Ubuntu, Fedora, Arch..."
    },
    {
      key: "windows" as const,
      platform: "Windows",
      formats: ".exe, .zip",
      button: "Get for Windows",
      note: "Windows 10+ supported"
    },
    {
      key: "macos" as const,
      platform: "macOS",
      formats: ".dmg",
      button: "Get for macOS",
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

function FlowDiagram() {
  return (
    <div className="relative h-full w-full py-2 lg:py-4">
      <div className="flex flex-col items-center justify-center gap-8 lg:flex-row lg:gap-2">
        {/* Input Apps */}
        <div className="flex flex-col gap-4 lg:w-1/3">
          {[
            { label: "Gmail", icon: "📧", color: "#EA4335" },
            { label: "Slack", icon: "💬", color: "#4A154B" },
            { label: "Teams", icon: "💼", color: "#6264A7" }
          ].map((app, idx) => (
            <motion.div
              key={app.label}
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 + idx * 0.1 }}
              className="aur-card flex items-center gap-3 rounded-2xl p-4 shadow-lg lg:relative"
            >
              <span className="text-xl">{app.icon}</span>
              <span className="text-[12px] font-semibold text-white/90">{app.label}</span>
              {/* Animated bit stream indicator */}
              <motion.div
                animate={{ x: [0, 40], opacity: [0, 1, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, delay: idx * 0.5 }}
                className="absolute -right-8 h-1 w-1 rounded-full bg-cyan-400 lg:block hidden"
              />
            </motion.div>
          ))}
        </div>

        {/* Central Processor */}
        <div className="relative z-10 flex flex-col items-center lg:w-1/3">
          <motion.div
            animate={{
              scale: [1, 1.05, 1],
              rotate: [0, 2, -2, 0],
              boxShadow: ["0 0 20px rgba(15,164,175,0.2)", "0 0 40px rgba(15,164,175,0.4)", "0 0 20px rgba(15,164,175,0.2)"]
            }}
            transition={{ duration: 4, repeat: Infinity }}
            className="flex h-24 w-24 items-center justify-center rounded-2xl border-2 border-[#0FA4AF] bg-black/40 backdrop-blur-xl"
          >
            <div className="text-center">
              <Shield className="mx-auto h-10 w-10 text-[#0FA4AF]" strokeWidth={2.5} />
              <div className="mt-2 text-[10px] font-bold tracking-widest text-[#0FA4AF] uppercase">Local AI</div>
            </div>
          </motion.div>

          <div className="mt-4 text-center">
            <h4 className="font-[Outfit] text-base font-bold text-white">Core AI</h4>
            <p className="max-w-[120px] text-[10px] leading-relaxed text-white/50">Processing locally</p>
          </div>

          {/* Connection Lines (SVG) - simplified for manual rendering if needed, but using lines here */}
          <div className="absolute inset-0 -z-10 h-full w-full pointer-events-none lg:block hidden">
            {/* We can use CSS lines or an SVG here. Let's use a simple SVG. */}
            <svg className="h-full w-full" viewBox="0 0 400 400">
              <motion.path
                d="M 50 100 L 200 200"
                fill="none"
                stroke="#0FA4AF22"
                strokeWidth="1"
              />
              <motion.path
                d="M 50 200 L 200 200"
                fill="none"
                stroke="#0FA4AF22"
                strokeWidth="1"
              />
              <motion.path
                d="M 50 300 L 200 200"
                fill="none"
                stroke="#0FA4AF22"
                strokeWidth="1"
              />
            </svg>
          </div>
        </div>

        {/* Unified Output */}
        <div className="lg:w-1/3">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1 }}
            className="aur-card aur-glow overflow-hidden rounded-2xl p-4 border-2 border-[#0FA4AF]/30"
          >
            <div className="flex items-center gap-2 mb-3">
              <div className="h-1.5 w-1.5 rounded-full bg-[#0FA4AF] animate-pulse" />
              <span className="text-[10px] font-bold text-white/80 uppercase">Unified Inbox</span>
            </div>

            <div className="space-y-2">
              {[
                "Daily Brief",
                "Draft Suggestion",
                "Task Spotted"
              ].map((task, i) => (
                <div key={i} className="flex items-center gap-2 rounded-lg bg-black/30 p-2">
                  <Mic className="h-3 w-3 text-[#0FA4AF]" />
                  <span className="text-[10px] text-white/80">{task}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
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
                    Simplify Your
                  </motion.span>
                  <motion.span
                    initial={{ opacity: 0, x: -15 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.7, delay: 0.25, ease: "easeOut" }}
                    className="block text-[#0FA4AF]"
                  >
                    Communication.
                  </motion.span>
                  <motion.span
                    initial={{ opacity: 0, x: -15 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.7, delay: 0.4, ease: "easeOut" }}
                    className="block"
                  >
                    Mastered by Voice.
                  </motion.span>
                </h1>
                <p
                  data-testid="text-hero-subheadline"
                  className="mt-5 max-w-xl text-balance text-base leading-relaxed text-white/75 sm:text-lg"
                >
                  Stop jumping between Gmail and Slack. AutoReturn unifies your messages into a single voice-controlled stream. <strong>All AI processing happens 100% locally</strong> on your hardware—private by design, not just by promise.
                </p>

                <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center">
                  <GetStartedButton os={os} setBoost={setBoost} />
                  <SecondaryButton />
                </div>

                <div className="mt-8 grid max-w-2xl grid-cols-3 gap-6">
                  <div
                    data-testid="stat-privacy"
                    className="aur-card rounded-2xl px-4 py-3 text-center transition-all duration-300 hover:bg-white/5"
                  >
                    <div className="font-[Outfit] text-sm font-semibold text-white">100% Yours</div>
                    <div className="mt-0.5 text-xs text-white/65">stays on your machine</div>
                  </div>
                  <div
                    data-testid="stat-offline"
                    className="aur-card rounded-2xl px-4 py-3 text-center transition-all duration-300 hover:bg-white/5"
                  >
                    <div className="font-[Outfit] text-sm font-semibold text-white">Works Offline</div>
                    <div className="mt-0.5 text-xs text-white/65">internet? optional</div>
                  </div>
                  <div
                    data-testid="stat-free"
                    className="aur-card rounded-2xl px-4 py-3 text-center transition-all duration-300 hover:bg-white/5"
                  >
                    <div className="font-[Outfit] text-sm font-semibold text-white">Actually Free</div>
                    <div className="mt-0.5 text-xs text-white/65">no catch, promise</div>
                  </div>
                </div>
              </div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
                className="lg:col-span-7 xl:col-span-6"
              >
                <div className="mt-12 lg:mt-0">
                  <FlowDiagram />
                </div>
              </motion.div>
            </div>
          </div>

          <div className="mt-14 px-6 lg:px-12">
            <div className="h-px w-full bg-gradient-to-r from-transparent via-white/15 to-transparent" />
          </div>
        </section>

        <WaveDivider className="relative z-10 -mt-12" />

        <section id="features" className="relative px-6 lg:px-12 py-16 sm:py-20">
          <SectionTitle
            testId="section-features"
            kicker="What it actually does"
            title="Everything you need, nothing you don't"
            desc="Six things that matter. Built by someone who was tired of switching between 47 different apps."
          />

          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((f) => (
              <div key={f.testId}>
                <FeatureCard
                  icon={f.icon}
                  title={f.title}
                  description={f.description}
                  testId={f.testId}
                  visual={f.visual}
                />
              </div>
            ))}
          </div>
        </section>

        <section className="relative px-6 lg:px-12 pb-16 sm:pb-20">
          <WaveDivider className="mb-16 opacity-30" flip />
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
                className="aur-card aur-noise relative overflow-hidden rounded-2xl p-6 transition-all duration-300 hover:scale-105"
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
            kicker="Get it now"
            title="Pick your platform"
            desc="Works on Linux, Windows, and macOS. 100% free, no strings attached."
          />

          <InstallationCards os={os} />

          <div className="mx-auto mt-10 max-w-4xl">
            <div
              data-testid="card-release-notes"
              className="aur-card aur-noise rounded-2xl p-6 transition-all duration-300 hover:bg-white/5"
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
                q: "What platforms are supported?",
                a: "AutoReturn is available for Linux (primary), Windows, and macOS. We're working on making the experience seamless across all of them.",
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
          <WaveDivider className="mb-16 opacity-30" flip />
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
    </div >
  );
}
