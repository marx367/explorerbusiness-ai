"use client";

import { Sparkles } from "lucide-react";
import type { AIOportunidad } from "@/lib/types";
import { Card, NivelBadge, SectionTitle, Tag } from "@/components/ui";

export function AIOpportunities({ ai }: { ai: AIOportunidad[] }) {
  return (
    <section>
      <SectionTitle
        kicker="Inteligencia artificial"
        titulo="AI Opportunities"
        sub="Aplicaciones de IA adaptadas al negocio analizado, no recomendaciones genéricas."
      />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {ai.map((a) => (
          <Card key={a.titulo} className="flex flex-col p-5">
            <div className="mb-3 flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-acento-2/15 text-acento-2">
                <Sparkles className="h-4 w-4" />
              </span>
              <Tag>{a.categoria}</Tag>
            </div>
            <h3 className="text-base font-semibold">{a.titulo}</h3>
            <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">{a.descripcion}</p>
            <div className="mt-4 flex items-center gap-2 border-t border-line pt-3">
              <NivelBadge nivel={a.impacto} etiqueta="Impacto" />
              <NivelBadge nivel={a.dificultad} etiqueta="Dificultad" />
            </div>
          </Card>
        ))}
      </div>
    </section>
  );
}
