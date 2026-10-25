"use client";

import { ArrowRight } from "lucide-react";
import type { Oportunidad } from "@/lib/types";
import { Card, NivelBadge, ProcedenciaBadge, SectionTitle, Tag } from "@/components/ui";

function OportunidadCard({ o }: { o: Oportunidad }) {
  return (
    <Card className="flex flex-col p-6">
      <div className="mb-4 flex items-center justify-between">
        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-acento/15 text-sm font-bold text-acento">
          {o.prioridad}
        </span>
        <div className="flex items-center gap-2">
          <Tag>{o.categoria}</Tag>
          <ProcedenciaBadge fuente={o.fuente} />
        </div>
      </div>

      <h3 className="text-lg font-semibold">{o.titulo}</h3>

      <div className="mt-4 space-y-3 text-sm">
        <div>
          <div className="text-[11px] font-semibold uppercase tracking-wider text-peligro/80">
            Problema detectado
          </div>
          <p className="mt-1 leading-relaxed text-muted">{o.problema}</p>
        </div>
        <div>
          <div className="text-[11px] font-semibold uppercase tracking-wider text-acento/80">
            Solución
          </div>
          <p className="mt-1 leading-relaxed text-muted">{o.solucion}</p>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-1.5 text-xs">
        {o.flujo.map((paso, i) => (
          <span key={i} className="flex items-center gap-1.5">
            {i > 0 && <ArrowRight className="h-3 w-3 text-muted/50" />}
            <span className="rounded-md border border-line bg-surface-2 px-2 py-1 text-texto">{paso}</span>
          </span>
        ))}
      </div>

      <div className="mt-5 flex items-center gap-3 border-t border-line pt-4">
        <NivelBadge nivel={o.impacto} etiqueta="Impacto" />
        <NivelBadge nivel={o.complejidad} etiqueta="Complejidad" />
      </div>
    </Card>
  );
}

export function Opportunities({ oportunidades }: { oportunidades: Oportunidad[] }) {
  return (
    <section>
      <SectionTitle
        kicker="Oportunidades detectadas"
        titulo="Oportunidades de automatización"
        sub="Procesos que pueden automatizarse para ahorrar tiempo y vender más, ordenados por prioridad."
      />
      <div className="grid gap-5 md:grid-cols-2">
        {oportunidades.map((o) => (
          <OportunidadCard key={o.id} o={o} />
        ))}
      </div>
    </section>
  );
}
