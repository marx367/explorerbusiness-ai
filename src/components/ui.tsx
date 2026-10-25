// Átomos de UI compartidos: badges de procedencia, tarjetas, títulos de sección,
// badges de nivel y el anillo de puntuación.

import type { ReactNode } from "react";
import type { Complejidad, Nivel, Source } from "@/lib/types";

const FUENTE: Record<Source, { texto: string; clase: string; punto: string }> = {
  scraped: { texto: "Detectado", clase: "text-exito border-exito/30 bg-exito/10", punto: "bg-exito" },
  inferred: { texto: "Inferido", clase: "text-alerta border-alerta/30 bg-alerta/10", punto: "bg-alerta" },
  demo: { texto: "DEMO", clase: "text-acento-2 border-acento-2/30 bg-acento-2/10", punto: "bg-acento-2" },
};

export function ProcedenciaBadge({ fuente }: { fuente: Source }) {
  const f = FUENTE[fuente];
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-[11px] font-medium ${f.clase}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${f.punto}`} />
      {f.texto}
    </span>
  );
}

export function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`glass rounded-2xl ${className}`}>{children}</div>;
}

export function SectionTitle({
  kicker,
  titulo,
  sub,
}: {
  kicker?: string;
  titulo: string;
  sub?: string;
}) {
  return (
    <div className="mb-6">
      {kicker && (
        <div className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-acento">{kicker}</div>
      )}
      <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">{titulo}</h2>
      {sub && <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted">{sub}</p>}
    </div>
  );
}

const NIVEL_CLASE: Record<Nivel | Complejidad, string> = {
  ALTO: "text-peligro border-peligro/30 bg-peligro/10",
  MEDIO: "text-alerta border-alerta/30 bg-alerta/10",
  BAJO: "text-exito border-exito/30 bg-exito/10",
  ALTA: "text-peligro border-peligro/30 bg-peligro/10",
  MEDIA: "text-alerta border-alerta/30 bg-alerta/10",
  BAJA: "text-exito border-exito/30 bg-exito/10",
};

export function NivelBadge({
  nivel,
  etiqueta,
}: {
  nivel: Nivel | Complejidad;
  etiqueta?: string;
}) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-[11px] font-semibold ${NIVEL_CLASE[nivel]}`}
    >
      {etiqueta ? `${etiqueta}: ` : ""}
      {nivel}
    </span>
  );
}

export function Tag({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full border border-line bg-surface-2 px-2.5 py-1 text-xs font-medium text-muted">
      {children}
    </span>
  );
}

export function ScoreRing({
  valor,
  size = 208,
  id = "ring",
}: {
  valor: number;
  size?: number;
  id?: string;
}) {
  const stroke = 15;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const offset = c * (1 - valor / 100);
  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--color-line)" strokeWidth={stroke} />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={`url(#${id})`}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={offset}
        />
        <defs>
          <linearGradient id={id} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="var(--color-acento-3)" />
            <stop offset="55%" stopColor="var(--color-acento)" />
            <stop offset="100%" stopColor="var(--color-acento-2)" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-5xl font-bold tabular-nums">{valor}</span>
        <span className="text-xs text-muted">/ 100</span>
      </div>
    </div>
  );
}
