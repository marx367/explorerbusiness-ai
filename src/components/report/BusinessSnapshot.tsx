"use client";

import type { BusinessSnapshot as Snapshot, Fact } from "@/lib/types";
import { Card, ProcedenciaBadge, SectionTitle } from "@/components/ui";

function Fila({ label, f, ancho }: { label: string; f: Fact; ancho?: boolean }) {
  return (
    <div className={ancho ? "sm:col-span-2" : ""}>
      <div className="text-[11px] font-semibold uppercase tracking-wider text-muted">{label}</div>
      <div className="mt-1.5 text-sm leading-relaxed text-texto">{f.texto}</div>
      <div className="mt-2">
        <ProcedenciaBadge fuente={f.fuente} />
      </div>
    </div>
  );
}

export function BusinessSnapshot({ snapshot }: { snapshot: Snapshot }) {
  return (
    <section>
      <SectionTitle
        kicker="Resumen del negocio"
        titulo="Business Snapshot"
        sub="Datos extraídos de la web y conclusiones inferidas a partir de las señales detectadas."
      />
      <Card className="p-6 sm:p-8">
        <div className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
          <Fila label="Empresa" f={snapshot.empresa} ancho />
          <Fila label="Sector" f={snapshot.sector} />
          <Fila label="Nivel de digitalización" f={snapshot.digitalizacion} />
          <Fila label="Qué vende" f={snapshot.queVende} ancho />
          <Fila label="Cliente objetivo" f={snapshot.clienteObjetivo} />
          <Fila label="Modelo de captación" f={snapshot.modeloCaptacion} />
          <Fila label="Principal CTA" f={snapshot.ctaPrincipal} />
        </div>
      </Card>
    </section>
  );
}
