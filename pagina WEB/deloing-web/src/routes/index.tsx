import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
  useSpring,
  type Variants,
} from "framer-motion";
import { toast } from "sonner";
import {
  Truck,
  Plane,
  ShieldCheck,
  Warehouse,
  ArrowUpRight,
  X,
  Globe2,
  Sparkles,
} from "lucide-react";

import logo from "@/assets/deloing-logo.svg";
import heroShip from "@/assets/hero-ship.jpg";
import truckImg from "@/assets/truck.jpg";
import intlImg from "@/assets/international.jpg";
import customsImg from "@/assets/customs.jpg";
import warehouseImg from "@/assets/warehouse.jpg";
import worldNet from "@/assets/world-network.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "DELOING SAS — Logística global premium" },
      { name: "description", content: "Transporte terrestre, flete internacional, aduanas y almacenamiento de clase mundial." },
    ],
  }),
  component: Landing,
});

/* ---------- shared motion ---------- */
const spring = { type: "spring" as const, stiffness: 120, damping: 18, mass: 0.6 };
const revealUp: Variants = {
  hidden: { opacity: 0, y: 28, filter: "blur(12px)", scale: 0.98 },
  show: { opacity: 1, y: 0, filter: "blur(0px)", scale: 1, transition: { ...spring, duration: 0.9 } },
};
const stagger: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
};

function Reveal({ children, className, delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-80px" }}
      variants={{
        hidden: { opacity: 0, y: 30, filter: "blur(10px)" },
        show: { opacity: 1, y: 0, filter: "blur(0px)", transition: { ...spring, delay } },
      }}
    >
      {children}
    </motion.div>
  );
}

/* ---------- services data ---------- */
type Service = {
  id: string;
  title: string;
  short: string;
  desc: string;
  bullets: string[];
  icon: React.ElementType;
  image: string;
};
const services: Service[] = [
  {
    id: "terrestre",
    title: "Transporte Terrestre",
    short: "Flotas dedicadas, rutas optimizadas en tiempo real.",
    desc: "Cobertura nacional con flota propia y aliados certificados. Trazabilidad GPS y entregas just-in-time para carga seca, refrigerada y sobredimensionada.",
    bullets: ["Cobertura 24/7 en todo el territorio", "Monitoreo GPS y telemetría", "Carga seca, refrigerada y especial", "SLA con penalidades garantizadas"],
    icon: Truck,
    image: truckImg,
  },
  {
    id: "internacional",
    title: "Flete Internacional",
    short: "Aéreo, marítimo y multimodal a más de 120 países.",
    desc: "Acuerdos directos con navieras y aerolíneas Tier 1. Consolidados LCL, FCL, charter aéreo y soluciones puerta a puerta con tarifas competitivas.",
    bullets: ["FCL · LCL · Aéreo · Multimodal", "Network en 120+ países", "Tarifas negociadas directamente", "Seguimiento end-to-end"],
    icon: Plane,
    image: intlImg,
  },
  {
    id: "aduana",
    title: "Aduanas",
    short: "Agencia certificada, nacionalización sin fricciones.",
    desc: "Agencia de aduanas con licencia OEA. Asesoría arancelaria, regímenes especiales, ZF, Plan Vallejo y representación frente a la DIAN.",
    bullets: ["Agencia OEA certificada", "Clasificación arancelaria", "Regímenes especiales y ZF", "Representación legal DIAN"],
    icon: ShieldCheck,
    image: customsImg,
  },
  {
    id: "almacen",
    title: "Almacenamiento",
    short: "Centros de distribución inteligentes con WMS en vivo.",
    desc: "Bodegas en Zona Franca, picking, WMS conectado por API integrada, Cross-docking y fulfillment e-commerce.",
    bullets: ["WMS conectado por API", "Cross-docking y fulfillment", "Control de temperatura", "Inventario en tiempo real"],
    icon: Warehouse,
    image: warehouseImg,
  },
];

/* ---------- Landing ---------- */
function Landing() {
  const [activeId, setActiveId] = useState<string | null>(null);
  const active = services.find((s) => s.id === activeId);

  useEffect(() => {
    const t = setTimeout(() => {
      toast("Bienvenido a DELOING SAS", {
        description: "Solicita una cotización en menos de 2 minutos.",
        icon: <Sparkles className="h-4 w-4 text-[oklch(0.88_0.2_195)]" />,
      });
    }, 1400);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="relative min-h-screen overflow-x-clip bg-background text-foreground">
      <AmbientGradients />
      <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 grid-bg opacity-60" />
      <ScrollSpotlight />
      <Nav />
      <main className="relative">
        <Hero />
        <Marquee />
        <SectionDivider label="01 — Indicadores" />
        <Metrics />
        <SectionDivider label="02 — Servicios" />
        <Services onOpen={(id) => setActiveId(id)} />
        <SectionDivider label="03 — Historia visual" />
        <ScrollStory />
        <SectionDivider label="04 — Red Global" />
        <GlobalNetwork />
        <SectionDivider label="05 — Contacto" />
        <CTA />
      </main>

      <Footer />

      <AnimatePresence>
        {active && <ServiceModal service={active} onClose={() => setActiveId(null)} />}
      </AnimatePresence>
    </div>
  );
}

/* ---------- section divider ---------- */
function SectionDivider({ label }: { label: string }) {
  return (
    <div className="relative mx-auto flex max-w-6xl items-center gap-4 px-6">
      <div className="section-divider flex-1" />
      <span className="font-mono text-[10px] uppercase tracking-[0.35em] text-muted-foreground">{label}</span>
      <div className="section-divider flex-1" />
    </div>
  );
}

/* ---------- scroll spotlight ---------- */
function ScrollSpotlight() {
  const { scrollYProgress } = useScroll();
  const y = useSpring(useTransform(scrollYProgress, [0, 1], ["10%", "90%"]), { stiffness: 40, damping: 20 });
  return (
    <motion.div
      aria-hidden
      style={{ top: y }}
      className="pointer-events-none fixed left-1/2 -z-10 h-[60vh] w-[60vh] -translate-x-1/2 rounded-full"
    >
      <div className="h-full w-full rounded-full bg-[radial-gradient(circle,oklch(0.88_0.2_195/0.10),transparent_70%)] blur-3xl" />
    </motion.div>
  );
}

/* ---------- ambient gradients ---------- */
function AmbientGradients() {
  const { scrollYProgress } = useScroll();
  const hue = useTransform(scrollYProgress, [0, 0.5, 1], [240, 200, 260]);
  return (
    <motion.div
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-20"
      style={{
        background: useTransform(
          hue,
          (h) =>
            `radial-gradient(1200px 800px at 80% -10%, oklch(0.35 0.18 ${h} / 0.35), transparent 60%),` +
            `radial-gradient(900px 700px at -10% 30%, oklch(0.45 0.18 195 / 0.18), transparent 60%),` +
            `radial-gradient(1000px 800px at 50% 110%, oklch(0.4 0.18 ${Number(h) + 20} / 0.25), transparent 60%)`
        ),
      }}
    />
  );
}

/* ---------- nav ---------- */
function Nav() {
  return (
    <motion.header
      initial={{ y: -40, opacity: 0, filter: "blur(8px)" }}
      animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
      transition={{ ...spring, delay: 0.2 }}
      className="fixed inset-x-0 top-0 z-40 flex justify-center px-4 pt-4"
    >
      <div className="glass flex w-full max-w-6xl items-center justify-between rounded-2xl px-4 py-2.5">
        <a href="#top" className="flex items-center gap-2.5">
          <img src={logo} alt="DELOING SAS" className="h-9 w-9 rounded-lg ring-1 ring-white/10" />
          <div className="leading-tight">
            <div className="font-display text-sm font-semibold tracking-wide">DELOING <span className="text-[oklch(0.88_0.2_195)]">SAS</span></div>
            <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">Global Logistics</div>
          </div>
        </a>
        <nav className="hidden gap-8 text-sm text-muted-foreground md:flex">
          {[["Servicios","#services"],["Red Global","#network"],["Métricas","#metrics"],["Contacto","#contact"]].map(([l,h])=>(
            <a key={h} href={h} className="transition-colors hover:text-foreground">{l}</a>
          ))}
        </nav>
        <a
          href="#contact"
          className="group relative inline-flex items-center gap-1.5 rounded-xl bg-[oklch(0.88_0.2_195)] px-4 py-2 text-xs font-semibold text-[oklch(0.12_0.05_265)] transition-transform hover:scale-[1.03]"
        >
          Cotizar <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </a>
      </div>
    </motion.header>
  );
}

/* ---------- hero ---------- */
function Hero() {
  return (
    <section id="top" className="relative flex h-[100svh] items-end overflow-hidden">
      <motion.div
        className="absolute inset-0 will-change-transform"
        initial={{ scale: 1.5, opacity: 0, filter: "blur(28px)" }}
        animate={{ scale: 1.15, opacity: 1, filter: "blur(0px)" }}
        transition={{ duration: 2.4, ease: [0.16, 1, 0.3, 1] }}
      >
        <motion.div
          className="h-full w-full"
          animate={{ y: [0, -16, 0] }}
          transition={{ duration: 10, ease: "easeInOut", repeat: Infinity }}
        >
          <img src={heroShip} alt="Buque portacontenedores DELOING" className="h-full w-full object-cover" />
        </motion.div>
      </motion.div>

      <div aria-hidden className="pointer-events-none absolute inset-0 z-[1] bg-gradient-to-b from-background/30 via-background/20 to-background" />
      <div aria-hidden className="pointer-events-none absolute inset-0 z-[1] bg-gradient-to-r from-background/40 via-transparent to-background/20" />

      <div aria-hidden className="pointer-events-none absolute inset-0 z-[2]">
        <div className="absolute inset-x-0 bottom-0 h-2/3 bg-[radial-gradient(ellipse_at_bottom,oklch(0.13_0.045_265/0.9),transparent_70%)]" />
        <div className="absolute -left-20 top-1/3 h-72 w-72 rounded-full bg-[oklch(0.88_0.2_195/0.18)] blur-3xl animate-float" />
        <div className="absolute right-0 top-1/4 h-96 w-96 rounded-full bg-[oklch(0.55_0.2_260/0.22)] blur-3xl animate-float" style={{ animationDelay: "-3s" }} />
      </div>

      <div className="relative z-10 mx-auto flex w-full max-w-6xl flex-col justify-end px-6 pb-24 pt-40">
        <motion.div initial="hidden" animate="show" variants={stagger} className="max-w-4xl">
          <motion.div variants={revealUp} className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-muted-foreground backdrop-blur">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[oklch(0.88_0.2_195)]" />
            Operando 24/7 · 120+ países conectados
          </motion.div>
          <motion.h1 variants={revealUp} className="text-balance text-5xl font-semibold leading-[1.02] tracking-tight md:text-7xl lg:text-[88px]">
            La columna vertebral<br />
            de su <span className="text-gradient">cadena de suministro</span> global.
          </motion.h1>
          <motion.p variants={revealUp} className="mt-6 max-w-xl text-pretty text-base text-muted-foreground md:text-lg">
            Conectamos mercados, optimizamos su logística, garantizamos su futuro.
          </motion.p>
          <motion.div variants={revealUp} className="mt-8 flex flex-wrap items-center gap-3">
            <a href="#services" className="group inline-flex items-center gap-2 rounded-xl bg-[oklch(0.88_0.2_195)] px-6 py-3.5 text-sm font-semibold text-[oklch(0.1_0.05_265)] shadow-[0_8px_40px_-8px_oklch(0.88_0.2_195/0.55)] transition-transform hover:scale-[1.02]">
              Explorar servicios
              <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>
            <a href="#contact" className="glass inline-flex items-center gap-2 rounded-xl px-6 py-3.5 text-sm font-medium transition-colors hover:bg-white/10">
              Hablar con un experto
            </a>
          </motion.div>
        </motion.div>
      </div>

      <motion.div
        aria-hidden
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.6, duration: 1 }}
        className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2 text-[10px] uppercase tracking-[0.3em] text-muted-foreground"
      >
        <motion.span animate={{ y: [0, 4, 0] }} transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }} className="inline-block">
          Scroll para descubrir ↓
        </motion.span>
      </motion.div>
    </section>
  );
}

/* ---------- metrics bento ---------- */
const metrics = [
  { k: "+18", l: "Años de experiencia", d: "Operando en mercados latinoamericanos y globales desde 2007.", span: "md:col-span-2 md:row-span-2", featured: true },
  { k: "120+", l: "Países en la red", d: "Network global con socios Tier 1." },
  { k: "2.4M", l: "Toneladas movilizadas / año", d: "Carga marítima, aérea y terrestre." },
  { k: "99.6%", l: "On-time delivery", d: "SLA garantizado con penalidades." },
  { k: "24/7", l: "Operación", d: "Torre de control siempre activa." },
];

function Metrics() {
  return (
    <section id="metrics" className="relative px-6 py-32">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <p className="font-mono text-xs uppercase tracking-[0.25em] text-[oklch(0.88_0.2_195)]">Indicadores</p>
          <h2 className="mt-3 max-w-3xl text-balance text-4xl font-semibold md:text-5xl">
            Una operación medida en <span className="text-gradient">precisión, no en promesas.</span>
          </h2>
        </Reveal>

        <motion.div
          initial="hidden" whileInView="show" viewport={{ once: true, margin: "-60px" }} variants={stagger}
          className="mt-12 grid auto-rows-[180px] grid-cols-1 gap-4 md:grid-cols-4"
        >
          {metrics.map((m, i) => (
            <motion.div
              key={i}
              variants={revealUp}
              whileHover={{ y: -4, scale: 1.01 }}
              transition={spring}
              className={`group relative overflow-hidden rounded-2xl border border-white/10 bg-card/60 p-6 backdrop-blur ${m.span ?? ""}`}
            >
              <div className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                style={{ background: "radial-gradient(400px circle at var(--mx,50%) var(--my,50%), oklch(0.88_0.2_195 / 0.18), transparent 60%)" }}
                onMouseMove={(e) => {
                  const r = (e.currentTarget as HTMLDivElement).getBoundingClientRect();
                  (e.currentTarget as HTMLDivElement).style.setProperty("--mx", `${e.clientX - r.left}px`);
                  (e.currentTarget as HTMLDivElement).style.setProperty("--my", `${e.clientY - r.top}px`);
                }}
              />
              <div className="relative flex h-full flex-col justify-between">
                <div className={`font-display font-semibold tracking-tight ${m.featured ? "text-7xl md:text-8xl" : "text-4xl md:text-5xl"} text-gradient`}>
                  {m.k}
                </div>
                <div>
                  <div className="text-sm font-medium text-foreground">{m.l}</div>
                  <p className="mt-1 text-xs text-muted-foreground">{m.d}</p>
                </div>
              </div>
              <div className="pointer-events-none absolute right-3 top-3 h-1.5 w-1.5 rounded-full bg-[oklch(0.88_0.2_195)] opacity-50 group-hover:animate-pulse-glow" />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

/* ---------- services ---------- */
function Services({ onOpen }: { onOpen: (id: string) => void }) {
  return (
    <section id="services" className="relative px-6 py-32">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <p className="font-mono text-xs uppercase tracking-[0.25em] text-[oklch(0.88_0.2_195)]">Servicios</p>
          <h2 className="mt-3 max-w-3xl text-balance text-4xl font-semibold md:text-5xl">
            Cuatro pilares. <span className="text-gradient">Una sola plataforma logística.</span>
          </h2>
          <p className="mt-4 max-w-2xl text-muted-foreground">
            Haz clic en cualquier servicio para abrir el panel de cotización detallada.
          </p>
        </Reveal>

        <motion.div
          initial="hidden" whileInView="show" viewport={{ once: true, margin: "-60px" }} variants={stagger}
          className="mt-12 grid grid-cols-1 gap-5 md:grid-cols-2"
        >
          {services.map((s) => (
            <ServiceCard key={s.id} service={s} onOpen={onOpen} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}

/* ---------- service card ---------- */
function ServiceCard({ service: s, onOpen }: { service: Service; onOpen: (id: string) => void }) {
  const ref = useRef<HTMLButtonElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const imgY = useSpring(useTransform(scrollYProgress, [0, 1], ["-12%", "12%"]), { stiffness: 60, damping: 22 });
  const imgScale = useTransform(scrollYProgress, [0, 0.5, 1], [1.15, 1.05, 1.15]);
  const overlayOpacity = useTransform(scrollYProgress, [0, 0.4, 0.6, 1], [0.85, 0.35, 0.35, 0.85]);

  return (
    <motion.button
      ref={ref}
      layoutId={`card-${s.id}`}
      onClick={() => onOpen(s.id)}
      variants={revealUp}
      whileHover={{ y: -6 }}
      transition={spring}
      className="group relative overflow-hidden rounded-3xl border border-white/10 bg-card/60 text-left backdrop-blur"
    >
      <motion.div layoutId={`media-${s.id}`} className="relative aspect-[16/10] overflow-hidden">
        <motion.img
          src={s.image}
          alt={s.title}
          loading="lazy"
          style={{ y: imgY, scale: imgScale }}
          className="absolute inset-0 h-[120%] w-full object-cover transition-transform duration-[1.2s] will-change-transform group-hover:scale-110"
        />
        <motion.div style={{ opacity: overlayOpacity }} className="absolute inset-0 bg-gradient-to-t from-card via-card/40 to-transparent" />
      </motion.div>
      <div className="relative p-6">
        <motion.div layoutId={`icon-${s.id}`} className="absolute -top-7 right-6 flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-[oklch(0.17_0.05_265)] text-[oklch(0.88_0.2_195)] shadow-xl">
          <s.icon className="h-6 w-6" />
        </motion.div>
        <motion.h3 layoutId={`title-${s.id}`} className="font-display text-2xl font-semibold">{s.title}</motion.h3>
        <motion.p layoutId={`short-${s.id}`} className="mt-2 text-sm text-muted-foreground">{s.short}</motion.p>
        <div className="mt-5 inline-flex items-center gap-1.5 text-xs font-medium text-[oklch(0.88_0.2_195)]">
          Ver cotización <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </div>
      </div>
      <div className="pointer-events-none absolute inset-0 rounded-3xl ring-0 ring-[oklch(0.88_0.2_195)] transition-all duration-500 group-hover:ring-1 group-hover:shadow-[0_0_60px_-10px_oklch(0.88_0.2_195/0.45)]" />
    </motion.button>
  );
}

/* ---------- marquee ---------- */
function Marquee() {
  const items = ["Transporte Terrestre", "Flete Internacional", "Aduanas OEA", "Almacenamiento WMS", "Cross-docking", "Zona Franca", "Multimodal", "Door-to-Door"];
  const row = [...items, ...items];
  return (
    <section aria-hidden className="relative overflow-hidden border-y border-white/5 bg-[oklch(0.11_0.04_265)]/60 py-6 backdrop-blur">
      <div className="flex animate-[marquee_38s_linear_infinite] gap-12 whitespace-nowrap will-change-transform">
        {row.map((t, i) => (
          <span key={i} className="font-display text-sm uppercase tracking-[0.35em] text-muted-foreground">
            {t} <span className="ml-12 text-[oklch(0.88_0.2_195)]">◆</span>
          </span>
        ))}
      </div>
    </section>
  );
}

/* ---------- scroll story (section 03) ---------- */
const storyFrames = [
  { img: truckImg,     kicker: "Terrestre",     title: "Cada kilómetro, monitoreado.",  copy: "Flota propia con telemetría en vivo y SLA garantizado." },
  { img: intlImg,      kicker: "Internacional", title: "Aéreo, marítimo, multimodal.",  copy: "Tarifas Tier 1 y consolidados FCL/LCL a 120+ países." },
  { img: customsImg,   kicker: "Aduanas",       title: "Sin fricción regulatoria.",     copy: "Agencia OEA con representación legal frente a la DIAN." },
  { img: warehouseImg, kicker: "Almacén",       title: "WMS en tiempo real.",           copy: "Zona Franca, cross-docking y fulfillment e-commerce." },
];

function ScrollStory() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const progress = useSpring(scrollYProgress, { stiffness: 80, damping: 24 });
  const n = storyFrames.length;

  return (
    <section ref={ref} className="relative" style={{ height: `${n * 100}vh` }}>
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        {/* image stack */}
        <div className="absolute inset-0">
          {storyFrames.map((f, i) => {
            const start = i / n;
            const end = (i + 1) / n;
            const mid = (start + end) / 2;
            const clampedRange = [
              Math.max(0, Math.min(1, start - 0.05)),
              Math.max(0, Math.min(1, mid)),
              Math.max(0, Math.min(1, end - 0.05)),
            ];
            const opacity = useTransform(
              progress,
              clampedRange,
              i === 0 ? [1, 1, 0] : i === n - 1 ? [0, 1, 1] : [0, 1, 0]
            );
            const scale = useTransform(progress, [start, end], [1.15, 1.0]);
            return (
              <motion.div key={i} style={{ opacity }} className="absolute inset-0">
                <motion.img src={f.img} alt={f.title} style={{ scale }} className="h-full w-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/55 to-background/30" />
                <div className="absolute inset-0 bg-gradient-to-r from-background/85 via-transparent to-background/40" />
              </motion.div>
            );
          })}
        </div>

        {/* text stack */}
        <div className="relative z-10 mx-auto flex h-full max-w-6xl items-center px-6">
          <div className="relative w-full max-w-2xl">
            {storyFrames.map((f, i) => {
              const start = i / n;
              const end = (i + 1) / n;
              const mid = (start + end) / 2;
              const opacity = useTransform(
                progress,
                [Math.max(0, start), mid, Math.min(1, end)],
                [0, 1, 0]
              );
              const y = useTransform(progress, [start, end], [40, -40]);
              return (
                <motion.div key={i} style={{ opacity, y }} className="absolute inset-0 flex flex-col justify-center">
                  <div className="font-mono inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[10px] uppercase tracking-[0.3em] text-[oklch(0.88_0.2_195)] backdrop-blur w-fit">
                    0{i + 1} — {f.kicker}
                  </div>
                  <h3 className="mt-5 text-balance font-display text-5xl font-semibold leading-[1.05] md:text-7xl">
                    {f.title.split(" ").slice(0, -1).join(" ")}{" "}
                    <span className="text-gradient">{f.title.split(" ").slice(-1)}</span>
                  </h3>
                  <p className="mt-5 max-w-md text-base text-muted-foreground md:text-lg">{f.copy}</p>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* progress rail */}
        <div className="pointer-events-none absolute right-6 top-1/2 z-10 hidden -translate-y-1/2 flex-col gap-3 md:flex">
          {storyFrames.map((_, i) => {
            const start = i / n;
            const end = (i + 1) / n;
            const scaleY = useTransform(progress, [start, (start + end) / 2, end], [0.5, 1, 0.5]);
            const opacity = useTransform(progress, [start, (start + end) / 2, end], [0.3, 1, 0.3]);
            return (
              <motion.div key={i} style={{ scaleY, opacity }} className="h-8 w-[2px] rounded-full bg-[oklch(0.88_0.2_195)]" />
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ---------- service modal ---------- */
function ServiceModal({ service, onClose }: { service: Service; onClose: () => void }) {
  const [sent, setSent] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => { window.removeEventListener("keydown", onKey); document.body.style.overflow = ""; };
  }, [onClose]);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    setSent(true);
    toast.success("Cotización enviada", { description: `Te contactaremos en menos de 4 horas sobre ${service.title}.` });
    setTimeout(onClose, 900);
  }

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
    >
      <motion.div
        className="absolute inset-0 bg-background/70 backdrop-blur-xl"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        onClick={onClose}
      />
      <motion.div
        layoutId={`card-${service.id}`}
        transition={spring}
        className="relative z-10 grid w-full max-w-5xl grid-cols-1 overflow-hidden rounded-3xl border border-white/10 bg-card shadow-2xl md:grid-cols-2"
      >
        <motion.div layoutId={`media-${service.id}`} className="relative aspect-[4/3] md:aspect-auto">
          <img src={service.image} alt={service.title} className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-card/80 via-transparent to-transparent md:bg-gradient-to-r" />
        </motion.div>

        <div className="relative p-7 md:p-10">
          <motion.div layoutId={`icon-${service.id}`} className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-xl border border-white/10 bg-[oklch(0.17_0.05_265)] text-[oklch(0.88_0.2_195)]">
            <service.icon className="h-5 w-5" />
          </motion.div>
          <motion.h3 layoutId={`title-${service.id}`} className="font-display text-3xl font-semibold">{service.title}</motion.h3>
          <motion.p layoutId={`short-${service.id}`} className="mt-2 text-sm text-muted-foreground">{service.short}</motion.p>

          <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="mt-4 text-sm text-foreground/90">
            {service.desc}
          </motion.p>

          <motion.ul initial="hidden" animate="show" variants={stagger} className="mt-5 grid grid-cols-1 gap-2 text-sm sm:grid-cols-2">
            {service.bullets.map((b) => (
              <motion.li key={b} variants={revealUp} className="flex items-start gap-2 text-muted-foreground">
                <span className="mt-1.5 h-1 w-1 flex-shrink-0 rounded-full bg-[oklch(0.88_0.2_195)]" /> {b}
              </motion.li>
            ))}
          </motion.ul>

          <motion.form
            onSubmit={submit}
            initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35, ...spring }}
            className="mt-6 grid grid-cols-1 gap-2.5 sm:grid-cols-2"
          >
            <input required placeholder="Nombre" className="rounded-xl border border-white/10 bg-white/5 px-3.5 py-2.5 text-sm outline-none ring-0 transition focus:border-[oklch(0.88_0.2_195)]" />
            <input required type="email" placeholder="Correo corporativo" className="rounded-xl border border-white/10 bg-white/5 px-3.5 py-2.5 text-sm outline-none transition focus:border-[oklch(0.88_0.2_195)]" />
            <input placeholder="Origen → Destino" className="rounded-xl border border-white/10 bg-white/5 px-3.5 py-2.5 text-sm outline-none transition focus:border-[oklch(0.88_0.2_195)] sm:col-span-2" />
            <button
              disabled={sent}
              className="sm:col-span-2 mt-1 inline-flex items-center justify-center gap-2 rounded-xl bg-[oklch(0.88_0.2_195)] px-4 py-3 text-sm font-semibold text-[oklch(0.1_0.05_265)] transition-transform hover:scale-[1.01] disabled:opacity-60"
            >
              {sent ? "Enviando…" : "Solicitar cotización"}
              <ArrowUpRight className="h-4 w-4" />
            </button>
          </motion.form>

          <button
            onClick={onClose}
            aria-label="Cerrar"
            className="absolute right-4 top-4 inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/5 text-muted-foreground transition hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ---------- live route map (signature element) ---------- */
type MapNode = { id: string; x: number; y: number; label: string; hub?: boolean };
const mapNodes: MapNode[] = [
  { id: "bog", x: 250, y: 272, label: "Bogotá", hub: true },
  { id: "mia", x: 268, y: 196, label: "Miami" },
  { id: "sao", x: 332, y: 356, label: "São Paulo" },
  { id: "mad", x: 488, y: 198, label: "Madrid" },
  { id: "rot", x: 524, y: 158, label: "Rotterdam" },
  { id: "dxb", x: 648, y: 240, label: "Dubái" },
  { id: "sin", x: 800, y: 308, label: "Singapur" },
  { id: "sha", x: 836, y: 212, label: "Shanghái" },
];
const mapRoutes: [string, string][] = [
  ["bog", "mia"], ["bog", "rot"], ["bog", "sao"], ["bog", "sha"],
  ["mia", "mad"], ["rot", "dxb"], ["dxb", "sin"], ["sha", "sin"], ["mad", "dxb"],
];
const byId = (id: string) => mapNodes.find((n) => n.id === id)!;
function arcPath(a: MapNode, b: MapNode) {
  const mx = (a.x + b.x) / 2;
  const lift = Math.hypot(b.x - a.x, b.y - a.y) * 0.26;
  const cy = Math.min(a.y, b.y) - lift;
  return `M ${a.x} ${a.y} Q ${mx} ${cy} ${b.x} ${b.y}`;
}

function RouteMap() {
  return (
    <svg viewBox="0 0 1000 460" className="h-auto w-full" role="img" aria-label="Mapa animado de rutas logísticas globales">
      <defs>
        <linearGradient id="routeGrad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="oklch(0.88 0.2 195)" stopOpacity="0.15" />
          <stop offset="0.5" stopColor="oklch(0.88 0.2 195)" stopOpacity="0.7" />
          <stop offset="1" stopColor="oklch(0.7 0.18 250)" stopOpacity="0.15" />
        </linearGradient>
        <radialGradient id="nodeGlow">
          <stop offset="0" stopColor="oklch(0.88 0.2 195)" stopOpacity="0.5" />
          <stop offset="1" stopColor="oklch(0.88 0.2 195)" stopOpacity="0" />
        </radialGradient>
        <filter id="soft"><feGaussianBlur stdDeviation="2.2" /></filter>
      </defs>

      {/* faint dotted grid backdrop */}
      <g opacity="0.10" fill="oklch(0.88 0.2 195)">
        {Array.from({ length: 13 }).map((_, r) =>
          Array.from({ length: 27 }).map((__, c) => (
            <circle key={`${r}-${c}`} cx={20 + c * 36} cy={28 + r * 33} r="1.3" />
          ))
        )}
      </g>

      {/* arcs */}
      {mapRoutes.map(([aId, bId], i) => {
        const d = arcPath(byId(aId), byId(bId));
        const len = Math.hypot(byId(bId).x - byId(aId).x, byId(bId).y - byId(aId).y);
        const dur = 2.6 + len / 180;
        return (
          <g key={i}>
            <path id={`route-${i}`} d={d} fill="none" stroke="url(#routeGrad)" strokeWidth="1.6" strokeLinecap="round" />
            {/* traveling cargo pulse */}
            <circle r="3.4" fill="oklch(0.92 0.18 195)" filter="url(#soft)">
              <animateMotion dur={`${dur}s`} repeatCount="indefinite" begin={`${i * 0.5}s`} rotate="auto">
                <mpath href={`#route-${i}`} />
              </animateMotion>
            </circle>
          </g>
        );
      })}

      {/* nodes */}
      {mapNodes.map((n) => (
        <g key={n.id}>
          <circle cx={n.x} cy={n.y} r={n.hub ? 26 : 18} fill="url(#nodeGlow)" />
          <circle cx={n.x} cy={n.y} r={n.hub ? 5.5 : 3.6} fill={n.hub ? "oklch(0.92 0.18 195)" : "oklch(0.86 0.12 230)"} />
          {n.hub && (
            <circle cx={n.x} cy={n.y} r="5.5" fill="none" stroke="oklch(0.88 0.2 195)" strokeWidth="1.4">
              <animate attributeName="r" values="5.5;20;5.5" dur="3s" repeatCount="indefinite" />
              <animate attributeName="opacity" values="0.9;0;0.9" dur="3s" repeatCount="indefinite" />
            </circle>
          )}
          <text
            x={n.x} y={n.y - (n.hub ? 14 : 10)} textAnchor="middle"
            fill="oklch(0.78 0.03 230)" fontFamily="'Space Mono', monospace"
            fontSize={n.hub ? 13 : 11} letterSpacing="0.5"
          >
            {n.label}
          </text>
        </g>
      ))}
    </svg>
  );
}

/* ---------- global network ---------- */
function GlobalNetwork() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useSpring(useTransform(scrollYProgress, [0, 1], [-60, 60]), { stiffness: 50, damping: 20 });

  return (
    <section id="network" ref={ref} className="relative overflow-hidden px-6 py-32">
      <motion.div style={{ y }} className="absolute inset-0 -z-0">
        <img src={worldNet} alt="" loading="lazy" className="h-full w-full object-cover opacity-20" />
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background/70 to-background" />
      </motion.div>

      <div className="relative mx-auto max-w-6xl">
        <Reveal>
          <div className="font-mono inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs uppercase tracking-[0.2em] text-muted-foreground">
            <Globe2 className="h-3.5 w-3.5 text-[oklch(0.88_0.2_195)]" /> Red global
          </div>
          <h2 className="mt-4 max-w-3xl text-balance text-4xl font-semibold md:text-5xl">
            Una red que <span className="text-gradient">nunca duerme.</span>
          </h2>
          <p className="mt-4 max-w-xl text-muted-foreground">
            Nodos operativos en los principales puertos, aeropuertos y corredores terrestres del mundo. Visibilidad total, decisiones en tiempo real.
          </p>
        </Reveal>

        {/* signature: live animated route map */}
        <Reveal delay={0.1}>
          <div className="mt-12 overflow-hidden rounded-3xl border border-white/10 bg-[oklch(0.12_0.04_265)]/70 p-3 backdrop-blur md:p-6">
            <RouteMap />
          </div>
        </Reveal>

        <motion.div
          initial="hidden" whileInView="show" viewport={{ once: true }} variants={stagger}
          className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-4"
        >
          {[
            ["120+", "Países"],
            ["480", "Rutas activas"],
            ["35", "Puertos clave"],
            ["8", "Hubs propios"],
          ].map(([k, l]) => (
            <motion.div key={l} variants={revealUp} className="glass rounded-2xl p-5">
              <div className="font-display text-3xl font-semibold text-gradient">{k}</div>
              <div className="font-mono mt-1 text-xs uppercase tracking-wider text-muted-foreground">{l}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

/* ---------- CTA ---------- */
function CTA() {
  return (
    <section id="contact" className="relative px-6 py-32">
      <div className="mx-auto max-w-5xl">
        <Reveal>
          <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-[oklch(0.18_0.07_260)] via-[oklch(0.15_0.05_265)] to-[oklch(0.2_0.1_220)] p-10 md:p-16">
            <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-[oklch(0.88_0.2_195)]/20 blur-3xl animate-pulse-glow" />
            <div className="absolute -bottom-24 -left-10 h-72 w-72 rounded-full bg-[oklch(0.55_0.2_260)]/30 blur-3xl animate-pulse-glow" />
            <div className="relative">
              <p className="font-mono text-xs uppercase tracking-[0.25em] text-[oklch(0.88_0.2_195)]">Empieza hoy</p>
              <h2 className="mt-3 max-w-2xl text-balance text-4xl font-semibold md:text-5xl">
                Lleve su cadena de suministro al <span className="text-gradient">siguiente nivel.</span>
              </h2>
              <p className="mt-4 max-w-xl text-muted-foreground">
                Un experto DELOING SAS revisará su operación y entregará un diagnóstico con ahorros estimados en menos de 48 horas.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <button
                  onClick={() => toast.success("Solicitud recibida", { description: "Un asesor te contactará pronto." })}
                  className="inline-flex items-center gap-2 rounded-xl bg-[oklch(0.88_0.2_195)] px-6 py-3.5 text-sm font-semibold text-[oklch(0.1_0.05_265)] transition-transform hover:scale-[1.02]"
                >
                  Agendar diagnóstico <ArrowUpRight className="h-4 w-4" />
                </button>
                <a href="mailto:contacto@deloing.com" className="glass inline-flex items-center gap-2 rounded-xl px-6 py-3.5 text-sm font-medium hover:bg-white/10">
                  contacto@deloing.com
                </a>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ---------- Footer ---------- */
function Footer() {
  return (
    <footer className="border-t border-white/5 px-6 py-12">
      <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-6 md:flex-row md:items-center">
        <div className="flex items-center gap-3">
          <img src={logo} alt="DELOING SAS" className="h-10 w-10 rounded-lg ring-1 ring-white/10" />
          <div>
            <div className="font-display text-sm font-semibold">DELOING SAS</div>
            <div className="text-xs text-muted-foreground">© {new Date().getFullYear()} · Logística global</div>
          </div>
        </div>
        <div className="flex flex-wrap gap-6 text-xs text-muted-foreground">
          <a href="#services" className="hover:text-foreground">Servicios</a>
          <a href="#network" className="hover:text-foreground">Red global</a>
          <a href="#metrics" className="hover:text-foreground">Métricas</a>
          <a href="#contact" className="hover:text-foreground">Contacto</a>
        </div>
      </div>
    </footer>
  );
}
