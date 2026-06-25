import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState, type ReactNode, type ElementType, type FormEvent } from "react";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import { toast } from "sonner";
import {
  Boxes,
  PackageCheck,
  Pill,
  Sparkles,
  ShieldCheck,
  Thermometer,
  ScanLine,
  BadgeCheck,
  Clock,
  Check,
  ArrowRight,
  Phone,
  Mail,
  MapPin,
  X,
} from "lucide-react";

import logo from "@/assets/deloing-logo.svg";
import warehouseImg from "@/assets/warehouse.jpg";
import truckImg from "@/assets/truck.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "DELOING SAS — Logística de confianza en Zona Franca" },
      {
        name: "description",
        content:
          "Almacenamiento, picking, packing y manejo especializado de medicamentos y cosméticos. Tus productos, en las mejores manos.",
      },
    ],
  }),
  component: Landing,
});

/* ============================================================
   Motion — todo en cámara lenta, sensación de seda
   ============================================================ */
const EASE = [0.22, 1, 0.36, 1] as const;

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 26 },
  show: { opacity: 1, y: 0, transition: { duration: 0.85, ease: EASE } },
};

const stagger: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.05 } },
};

/** Aparición fluida al entrar en viewport (una sola vez). */
function Reveal({
  children,
  className,
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-90px" }}
      variants={{
        hidden: { opacity: 0, y: 28 },
        show: { opacity: 1, y: 0, transition: { duration: 0.85, ease: EASE, delay } },
      }}
    >
      {children}
    </motion.div>
  );
}

/* ============================================================
   Datos (separados de la UI)
   ============================================================ */
type Tint = "sage" | "sky" | "blush" | "sand";

type Service = {
  id: string;
  title: string;
  short: string;
  desc: string;
  bullets: string[];
  icon: ElementType;
  tint: Tint;
};

const services: Service[] = [
  {
    id: "almacenamiento",
    title: "Almacenamiento en Zona Franca",
    short: "Tu inventario seguro, con los beneficios de la Zona Franca.",
    desc: "Espacios certificados con control de acceso, inventario en tiempo real y los beneficios tributarios de operar dentro de Zona Franca. Tu mercancía, cuidada como si fuera nuestra.",
    bullets: [
      "Inventario en tiempo real",
      "Control de acceso y CCTV",
      "Beneficios tributarios de Zona Franca",
      "Zonas para carga sensible",
    ],
    icon: Boxes,
    tint: "sage",
  },
  {
    id: "picking",
    title: "Picking & Packing",
    short: "Cada pedido preparado con precisión y cariño.",
    desc: "Preparación de pedidos, kitting, etiquetado y empaque protector pensado para que tu producto llegue impecable. Precisión que se nota en la satisfacción de tus clientes.",
    bullets: [
      "Preparación precisa de pedidos",
      "Kitting y etiquetado",
      "Empaque protector",
      "Control de calidad por pedido",
    ],
    icon: PackageCheck,
    tint: "sky",
  },
  {
    id: "medicamentos",
    title: "Medicamentos & cadena de frío",
    short: "Manejo bajo buenas prácticas y temperatura controlada.",
    desc: "Almacenamiento y manejo de productos farmacéuticos con control de temperatura, trazabilidad por lote y buenas prácticas. Porque detrás de cada caja hay un paciente esperando.",
    bullets: [
      "Control de temperatura",
      "Trazabilidad por lote",
      "Buenas prácticas de almacenamiento",
      "Manejo de fechas de vencimiento",
    ],
    icon: Pill,
    tint: "blush",
  },
  {
    id: "cosmeticos",
    title: "Cosméticos & cuidado personal",
    short: "Tu marca, tratada con el cuidado que merece.",
    desc: "Manejo cuidadoso de cosméticos y productos de cuidado personal, protegiendo la presentación y la integridad de cada referencia para retail y e-commerce.",
    bullets: [
      "Manejo cuidadoso del producto",
      "Protección de empaques",
      "Control de calidad",
      "Listo para retail y e-commerce",
    ],
    icon: Sparkles,
    tint: "sand",
  },
];

const tintBubble: Record<Tint, string> = {
  sage: "bg-sage-soft text-primary",
  sky: "bg-sky-soft text-steel",
  blush: "bg-blush-soft text-[#b06a55]",
  sand: "bg-sand-soft text-[#a9824a]",
};

const trustBadges = [
  { icon: ShieldCheck, label: "Régimen Zona Franca" },
  { icon: Thermometer, label: "Cadena de frío" },
  { icon: ScanLine, label: "Trazabilidad 24/7" },
  { icon: BadgeCheck, label: "Buenas prácticas" },
  { icon: Clock, label: "+15 años de experiencia" },
];

const promises = [
  { title: "Trazabilidad total", text: "Sabes dónde está cada producto, en todo momento." },
  { title: "Temperatura bajo control", text: "Monitoreo continuo para tu carga sensible." },
  { title: "Un equipo que cuida tu marca", text: "Personas, no solo procesos, detrás de cada pedido." },
  { title: "Reportes claros", text: "Información simple y a tiempo, sin letra pequeña." },
];

const steps = [
  { n: "01", title: "Recepción", text: "Recibimos y verificamos cada unidad con cuidado." },
  { n: "02", title: "Almacenamiento", text: "La guardamos en condiciones óptimas y seguras." },
  { n: "03", title: "Picking & Packing", text: "Preparamos cada pedido con precisión." },
  { n: "04", title: "Despacho", text: "Sale a tiempo y con seguimiento total." },
];

const metrics = [
  { k: "+15", l: "años cuidando marcas" },
  { k: "99.8%", l: "precisión en pedidos" },
  { k: "24/7", l: "monitoreo de tu carga" },
  { k: "100%", l: "trazabilidad por lote" },
];

/* ============================================================
   Botones reutilizables
   ============================================================ */
function PrimaryButton({
  children,
  href,
  onClick,
  type = "button",
  className = "",
}: {
  children: ReactNode;
  href?: string;
  onClick?: () => void;
  type?: "button" | "submit";
  className?: string;
}) {
  const cls =
    "group inline-flex items-center justify-center gap-2 rounded-full bg-primary px-7 py-3.5 text-sm font-semibold text-cream shadow-soft transition-all duration-300 ease-out hover:-translate-y-0.5 hover:bg-primary-deep hover:shadow-float focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2 focus-visible:ring-offset-cream " +
    className;
  const inner = (
    <>
      {children}
      <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
    </>
  );
  if (href) {
    return (
      <a href={href} className={cls}>
        {inner}
      </a>
    );
  }
  return (
    <button type={type} onClick={onClick} className={cls}>
      {inner}
    </button>
  );
}

function GhostButton({ children, href }: { children: ReactNode; href: string }) {
  return (
    <a
      href={href}
      className="inline-flex items-center justify-center gap-2 rounded-full border border-line bg-surface px-7 py-3.5 text-sm font-semibold text-ink shadow-soft transition-all duration-300 ease-out hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-float focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
    >
      {children}
    </a>
  );
}

/* ============================================================
   Encabezado de sección
   ============================================================ */
function SectionHeading({
  eyebrow,
  title,
  sub,
  center = false,
}: {
  eyebrow: string;
  title: ReactNode;
  sub?: string;
  center?: boolean;
}) {
  return (
    <div className={center ? "mx-auto max-w-2xl text-center" : "max-w-2xl"}>
      <span className="inline-flex items-center gap-2 rounded-full bg-primary-soft px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">
        {eyebrow}
      </span>
      <h2 className="mt-5 text-balance text-3xl font-semibold leading-[1.12] md:text-[2.6rem]">
        {title}
      </h2>
      {sub && (
        <p className={`mt-4 text-pretty text-[1.05rem] leading-relaxed text-muted ${center ? "mx-auto" : ""}`}>
          {sub}
        </p>
      )}
    </div>
  );
}

/* ============================================================
   Página
   ============================================================ */
function Landing() {
  const [activeId, setActiveId] = useState<string | null>(null);
  const active = services.find((s) => s.id === activeId) ?? null;

  return (
    <div className="relative min-h-screen overflow-x-clip bg-cream text-ink">
      <Nav />
      <main>
        <Hero />
        <TrustStrip />
        <Services onOpen={setActiveId} />
        <WhyTrust />
        <Process />
        <Metrics />
        <CTA />
      </main>
      <Footer />

      <AnimatePresence>
        {active && <ServiceModal service={active} onClose={() => setActiveId(null)} />}
      </AnimatePresence>
    </div>
  );
}

/* ---------- Nav ---------- */
function Nav() {
  const links = [
    ["Servicios", "#servicios"],
    ["Confianza", "#confianza"],
    ["Proceso", "#proceso"],
    ["Contacto", "#contacto"],
  ];
  return (
    <motion.header
      initial={{ y: -28, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: EASE, delay: 0.1 }}
      className="fixed inset-x-0 top-0 z-40 flex justify-center px-4 pt-4"
    >
      <div className="flex w-full max-w-6xl items-center justify-between rounded-full border border-line bg-cream/80 px-3 py-2 shadow-soft backdrop-blur-xl">
        <a href="#top" className="flex items-center gap-2.5 pl-1">
          <img src={logo} alt="DELOING SAS" className="h-9 w-9 rounded-xl" />
          <div className="leading-tight">
            <div className="font-display text-sm font-bold tracking-wide text-ink">
              DELOING <span className="text-primary">SAS</span>
            </div>
            <div className="text-[10px] font-medium uppercase tracking-[0.16em] text-faint">
              Logística en Zona Franca
            </div>
          </div>
        </a>
        <nav aria-label="Principal" className="hidden gap-8 text-sm font-medium text-muted md:flex">
          {links.map(([l, h]) => (
            <a key={h} href={h} className="transition-colors duration-300 hover:text-primary">
              {l}
            </a>
          ))}
        </nav>
        <a
          href="#contacto"
          className="inline-flex items-center gap-1.5 rounded-full bg-primary px-5 py-2.5 text-xs font-semibold text-cream shadow-soft transition-all duration-300 ease-out hover:-translate-y-0.5 hover:bg-primary-deep hover:shadow-float"
        >
          Cotizar <ArrowRight className="h-3.5 w-3.5" />
        </a>
      </div>
    </motion.header>
  );
}

/* ---------- Hero ---------- */
function Hero() {
  return (
    <section id="top" className="relative overflow-hidden px-6 pb-24 pt-36 md:pt-44">
      {/* blobs orgánicos, muy difusos: el fondo "respira" */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -left-24 top-10 h-96 w-96 rounded-full bg-sage-soft blur-3xl" />
        <div className="absolute -right-20 top-40 h-[28rem] w-[28rem] rounded-full bg-sky-soft blur-3xl" />
        <div className="absolute bottom-0 left-1/3 h-80 w-80 rounded-full bg-sand-soft blur-3xl" />
      </div>

      <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-[1.05fr_0.95fr]">
        {/* texto */}
        <motion.div initial="hidden" animate="show" variants={stagger}>
          <motion.span
            variants={fadeUp}
            className="inline-flex items-center gap-2 rounded-full border border-line bg-surface/70 px-4 py-1.5 text-xs font-semibold text-primary shadow-soft"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-sage" />
            Operador logístico · Zona Franca
          </motion.span>

          <motion.h1
            variants={fadeUp}
            className="mt-6 text-balance text-4xl font-bold leading-[1.08] tracking-tight md:text-6xl"
          >
            Tus productos, en las <span className="text-gradient">mejores manos</span>.
          </motion.h1>

          <motion.p variants={fadeUp} className="mt-6 max-w-xl text-pretty text-lg leading-relaxed text-muted">
            Almacenamiento, picking, packing y manejo especializado de medicamentos y
            cosméticos. Cuidamos cada detalle para que tú respires tranquilo.
          </motion.p>

          <motion.div variants={fadeUp} className="mt-9 flex flex-wrap items-center gap-3">
            <PrimaryButton href="#contacto">Solicitar cotización</PrimaryButton>
            <GhostButton href="#servicios">Conocer servicios</GhostButton>
          </motion.div>

          <motion.p variants={fadeUp} className="mt-8 text-sm text-faint">
            Más de 15 años cuidando la cadena de suministro de marcas que confían en nosotros.
          </motion.p>
        </motion.div>

        {/* imagen flotante + tarjeta de confianza */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: EASE, delay: 0.25 }}
          className="relative"
        >
          <motion.div
            animate={{ y: [0, -14, 0] }}
            transition={{ duration: 7, ease: "easeInOut", repeat: Infinity }}
            className="relative overflow-hidden rounded-5xl border border-line bg-surface shadow-lift"
          >
            <img
              src={warehouseImg}
              alt="Centro de almacenamiento DELOING en Zona Franca"
              className="aspect-[4/5] w-full object-cover"
            />
            <div aria-hidden className="absolute inset-0 bg-gradient-to-tr from-primary/20 via-transparent to-sand/10" />
          </motion.div>

          {/* tarjeta flotante */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.7, ease: EASE, delay: 0.7 }}
            className="absolute -bottom-6 -left-4 flex items-center gap-3 rounded-3xl border border-line bg-surface/90 px-5 py-4 shadow-float backdrop-blur md:-left-10"
          >
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-sage-soft text-primary">
              <Check className="h-5 w-5" />
            </span>
            <div>
              <div className="font-display text-xl font-bold text-ink">99.8%</div>
              <div className="text-xs text-muted">precisión en pedidos</div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

/* ---------- Trust strip ---------- */
function TrustStrip() {
  return (
    <section className="px-6 py-10">
      <Reveal className="mx-auto max-w-6xl">
        <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-4 rounded-4xl border border-line bg-cream-soft/60 px-8 py-6">
          {trustBadges.map(({ icon: Icon, label }) => (
            <div key={label} className="flex items-center gap-2.5 text-sm font-medium text-muted">
              <Icon className="h-5 w-5 text-primary" />
              {label}
            </div>
          ))}
        </div>
      </Reveal>
    </section>
  );
}

/* ---------- Services ---------- */
function Services({ onOpen }: { onOpen: (id: string) => void }) {
  return (
    <section id="servicios" className="px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <SectionHeading
            eyebrow="Servicios"
            title={
              <>
                Todo bajo un mismo techo, <span className="text-gradient">cuidado al detalle.</span>
              </>
            }
            sub="Cuatro especialidades, una sola promesa: que tu producto esté siempre protegido. Toca cualquier servicio para pedir tu cotización."
          />
        </Reveal>

        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
          variants={stagger}
          className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-2"
        >
          {services.map((s) => (
            <motion.div key={s.id} variants={fadeUp}>
              <button
                onClick={() => onOpen(s.id)}
                className="group h-full w-full rounded-4xl border border-line bg-surface p-8 text-left shadow-soft transition-all duration-500 ease-out hover:-translate-y-2 hover:shadow-float focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
              >
                <span
                  className={`flex h-14 w-14 items-center justify-center rounded-2xl ${tintBubble[s.tint]} transition-transform duration-500 ease-out group-hover:scale-105`}
                >
                  <s.icon className="h-7 w-7" />
                </span>
                <h3 className="mt-6 text-2xl font-semibold">{s.title}</h3>
                <p className="mt-3 text-pretty leading-relaxed text-muted">{s.short}</p>
                <span className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-primary">
                  Solicitar cotización
                  <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </span>
              </button>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

/* ---------- Why trust ---------- */
function WhyTrust() {
  return (
    <section id="confianza" className="px-6 py-24">
      <div className="mx-auto grid max-w-6xl items-center gap-14 lg:grid-cols-2">
        {/* imagen */}
        <Reveal className="relative order-last lg:order-first">
          <div className="overflow-hidden rounded-5xl border border-line bg-surface shadow-lift">
            <img
              src={truckImg}
              alt="Distribución confiable y a tiempo de DELOING"
              className="aspect-[4/3] w-full object-cover"
            />
            <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-primary/15 to-transparent" />
          </div>
          <div className="absolute -right-4 -top-6 flex items-center gap-3 rounded-3xl border border-line bg-surface/90 px-5 py-4 shadow-float backdrop-blur md:-right-8">
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-sky-soft text-steel">
              <Clock className="h-5 w-5" />
            </span>
            <div>
              <div className="font-display text-xl font-bold text-ink">99.6%</div>
              <div className="text-xs text-muted">entregas a tiempo</div>
            </div>
          </div>
        </Reveal>

        {/* texto + promesas */}
        <div>
          <Reveal>
            <SectionHeading
              eyebrow="Por qué DELOING"
              title={
                <>
                  Diseñado para que <span className="text-gradient">duermas tranquilo.</span>
                </>
              }
              sub="Sabemos que detrás de cada caja hay una marca, un paciente o un cliente esperando. Por eso cuidamos tu operación como si fuera nuestra."
            />
          </Reveal>

          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-80px" }}
            variants={stagger}
            className="mt-10 grid gap-5 sm:grid-cols-2"
          >
            {promises.map((p) => (
              <motion.div key={p.title} variants={fadeUp} className="flex gap-4">
                <span className="mt-0.5 flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-sage-soft text-primary">
                  <Check className="h-5 w-5" />
                </span>
                <div>
                  <h4 className="text-base font-semibold">{p.title}</h4>
                  <p className="mt-1 text-sm leading-relaxed text-muted">{p.text}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/* ---------- Process ---------- */
function Process() {
  return (
    <section id="proceso" className="px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <SectionHeading
            center
            eyebrow="Cómo trabajamos"
            title={
              <>
                Tu mercancía, en buenas manos <span className="text-gradient">de principio a fin.</span>
              </>
            }
          />
        </Reveal>

        <motion.ol
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
          variants={stagger}
          className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4"
        >
          {steps.map((s) => (
            <motion.li
              key={s.n}
              variants={fadeUp}
              className="rounded-4xl border border-line bg-surface p-7 shadow-soft transition-all duration-500 ease-out hover:-translate-y-1.5 hover:shadow-float"
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-soft font-display text-lg font-bold text-primary">
                {s.n}
              </span>
              <h3 className="mt-5 text-lg font-semibold">{s.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{s.text}</p>
            </motion.li>
          ))}
        </motion.ol>
      </div>
    </section>
  );
}

/* ---------- Metrics ---------- */
function Metrics() {
  return (
    <section className="px-6 py-12">
      <Reveal className="mx-auto max-w-6xl">
        <div className="grid grid-cols-2 gap-4 rounded-5xl border border-line bg-cream-soft/70 p-8 md:grid-cols-4 md:p-10">
          {metrics.map((m) => (
            <div key={m.l} className="text-center">
              <div className="font-display text-4xl font-bold text-gradient md:text-5xl">{m.k}</div>
              <div className="mt-2 text-sm text-muted">{m.l}</div>
            </div>
          ))}
        </div>
      </Reveal>
    </section>
  );
}

/* ---------- CTA ---------- */
function CTA() {
  function submit(e: FormEvent) {
    e.preventDefault();
    toast.success("Solicitud recibida", {
      description: "Te contactaremos con una propuesta clara en menos de 24 horas.",
    });
    (e.currentTarget as HTMLFormElement).reset();
  }

  return (
    <section id="contacto" className="px-6 py-24">
      <Reveal className="mx-auto max-w-5xl">
        <div className="relative overflow-hidden rounded-5xl border border-line bg-gradient-to-br from-sage-soft via-cream to-sky-soft p-8 shadow-float md:p-14">
          <div aria-hidden className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-sage/30 blur-3xl" />
          <div aria-hidden className="pointer-events-none absolute -bottom-20 -left-10 h-64 w-64 rounded-full bg-sky/40 blur-3xl" />

          <div className="relative grid gap-10 lg:grid-cols-[1fr_1fr] lg:items-center">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full bg-surface/70 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-primary shadow-soft">
                Conversemos
              </span>
              <h2 className="mt-5 text-balance text-3xl font-semibold leading-[1.12] md:text-4xl">
                Cuéntanos qué necesitas guardar. <span className="text-gradient">Nosotros nos encargamos del resto.</span>
              </h2>
              <p className="mt-4 max-w-md text-pretty leading-relaxed text-muted">
                Te respondemos con una propuesta clara y sin compromiso.
              </p>
              <div className="mt-7 space-y-2 text-sm text-muted">
                <a href="mailto:contacto@deloing.com" className="flex items-center gap-2.5 transition-colors hover:text-primary">
                  <Mail className="h-4 w-4 text-primary" /> contacto@deloing.com
                </a>
                <a href="tel:+5710000000" className="flex items-center gap-2.5 transition-colors hover:text-primary">
                  <Phone className="h-4 w-4 text-primary" /> +57 (1) 000 0000
                </a>
                <div className="flex items-center gap-2.5">
                  <MapPin className="h-4 w-4 text-primary" /> Zona Franca · Colombia
                </div>
              </div>
            </div>

            <form
              onSubmit={submit}
              className="rounded-4xl border border-line bg-surface/80 p-6 shadow-soft backdrop-blur md:p-8"
            >
              <div className="grid gap-3.5 sm:grid-cols-2">
                <FormInput name="nombre" placeholder="Nombre" required />
                <FormInput name="empresa" placeholder="Empresa" />
                <FormInput name="email" type="email" placeholder="Correo corporativo" required className="sm:col-span-2" />
                <textarea
                  name="mensaje"
                  rows={3}
                  placeholder="¿Qué te gustaría almacenar o distribuir?"
                  className="sm:col-span-2 w-full resize-none rounded-2xl border border-line bg-cream/60 px-4 py-3 text-sm text-ink outline-none transition placeholder:text-faint focus:border-primary/50 focus:bg-surface"
                />
              </div>
              <PrimaryButton type="submit" className="mt-4 w-full">
                Solicitar cotización
              </PrimaryButton>
            </form>
          </div>
        </div>
      </Reveal>
    </section>
  );
}

function FormInput({
  className = "",
  ...props
}: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={`w-full rounded-2xl border border-line bg-cream/60 px-4 py-3 text-sm text-ink outline-none transition placeholder:text-faint focus:border-primary/50 focus:bg-surface ${className}`}
    />
  );
}

/* ---------- Service modal ---------- */
function ServiceModal({ service, onClose }: { service: Service; onClose: () => void }) {
  const [sent, setSent] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  function submit(e: FormEvent) {
    e.preventDefault();
    setSent(true);
    toast.success("Cotización enviada", {
      description: `Te contactaremos pronto sobre ${service.title}.`,
    });
    setTimeout(onClose, 900);
  }

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="absolute inset-0 bg-ink/40 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      />
      <motion.div
        role="dialog"
        aria-modal="true"
        aria-label={service.title}
        initial={{ opacity: 0, y: 24, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 16, scale: 0.98 }}
        transition={{ duration: 0.45, ease: EASE }}
        className="relative z-10 w-full max-w-lg overflow-hidden rounded-5xl border border-line bg-surface p-7 shadow-lift md:p-9"
      >
        <button
          onClick={onClose}
          aria-label="Cerrar"
          className="absolute right-5 top-5 inline-flex h-9 w-9 items-center justify-center rounded-full border border-line bg-cream text-muted transition hover:text-primary"
        >
          <X className="h-4 w-4" />
        </button>

        <span className={`flex h-14 w-14 items-center justify-center rounded-2xl ${tintBubble[service.tint]}`}>
          <service.icon className="h-7 w-7" />
        </span>
        <h3 className="mt-5 text-2xl font-semibold">{service.title}</h3>
        <p className="mt-3 text-pretty leading-relaxed text-muted">{service.desc}</p>

        <ul className="mt-5 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
          {service.bullets.map((b) => (
            <li key={b} className="flex items-start gap-2 text-sm text-muted">
              <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" /> {b}
            </li>
          ))}
        </ul>

        <form onSubmit={submit} className="mt-7 grid gap-3 sm:grid-cols-2">
          <FormInput name="nombre" placeholder="Nombre" required />
          <FormInput name="email" type="email" placeholder="Correo corporativo" required />
          <PrimaryButton type="submit" className="sm:col-span-2 w-full">
            {sent ? "Enviando…" : "Solicitar cotización"}
          </PrimaryButton>
        </form>
      </motion.div>
    </motion.div>
  );
}

/* ---------- Footer ---------- */
function Footer() {
  const cols = [
    ["Servicios", ["Almacenamiento", "Picking & Packing", "Medicamentos", "Cosméticos"]],
    ["Empresa", ["Sobre nosotros", "Zona Franca", "Confianza", "Proceso"]],
    ["Contacto", ["contacto@deloing.com", "+57 (1) 000 0000", "Colombia"]],
  ] as const;

  return (
    <footer className="border-t border-line bg-cream-soft/50 px-6 py-14">
      <div className="mx-auto grid max-w-6xl gap-10 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div>
          <div className="flex items-center gap-3">
            <img src={logo} alt="DELOING SAS" className="h-11 w-11 rounded-xl" />
            <div className="font-display text-lg font-bold text-ink">
              DELOING <span className="text-primary">SAS</span>
            </div>
          </div>
          <p className="mt-4 max-w-xs text-pretty text-sm leading-relaxed text-muted">
            Operador logístico en Zona Franca. Cuidamos lo que más importa: tu producto y tu
            tranquilidad.
          </p>
        </div>

        {cols.map(([title, items]) => (
          <div key={title}>
            <h4 className="text-sm font-semibold text-ink">{title}</h4>
            <ul className="mt-4 space-y-2.5 text-sm text-muted">
              {items.map((it) => (
                <li key={it}>
                  <a href="#contacto" className="transition-colors hover:text-primary">
                    {it}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="mx-auto mt-12 flex max-w-6xl flex-col items-center justify-between gap-3 border-t border-line pt-6 text-xs text-faint sm:flex-row">
        <span>© {new Date().getFullYear()} DELOING SAS · Todos los derechos reservados.</span>
        <span>Hecho con cuidado en Colombia.</span>
      </div>
    </footer>
  );
}
