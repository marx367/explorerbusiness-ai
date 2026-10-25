"use client";

import type { Cuadrante, ItemMatriz } from "@/lib/types";
import { SectionTitle } from "@/components/ui";

const CUADRANTES: { id: Cuadrante; titulo: string; sub: string; clase: string }[] = [
  {
    id: "quick-wins",
    titulo: "Quick Wins",
    sub: "Alto impacto + baja dificultad",
    clase: "border-exito/30 bg-exito/[0.05]",
  },
  {
    id: "strategic",
    titulo: "Strategic",
    sub: "Alto impacto + alta dificultad",
    clase: "border-acento-2/30 bg-acento-2/[0.05]",
  },
  {
    id: "nice-to-have",
    titulo: "Nice to Have",
    sub: "Bajo impacto + baja dificultad",
    clase: "border-alerta/30 bg-alerta/[0.05]",
  },
  {
    id: "avoid",
    titulo: "Avoid for Now",
    sub: "Bajo impacto + alta dificultad",
    clase: "border-peligro/30 bg-peligro/[0.05]",
  },
];

export function ImpactMatrix({ matriz }: { matriz: ItemMatriz[] }) {
  return (
    <section>
      <SectionTitle
        kicker="Priorización"
        titulo="Impacto vs dificultad"
        sub="Las soluciones se agrupan por impacto y dificultad de implementación."
      />
      <div className="mb-3 text-center text-xs uppercase tracking-wider text-muted">
        ← baja dificultad &nbsp;·&nbsp; alta dificultad →
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        {CUADRANTES.map((q) => {
          const items = matriz.filter((m) => m.cuadrante === q.id);
          return (
            <div key={q.id} className={`rounded-2xl border p-5 ${q.clase}`}>
              <div className="text-lg font-semibold">{q.titulo}</div>
              <div className="text-xs text-muted">{q.sub}</div>
              <div className="mt-3 flex flex-wrap gap-2">
                {items.length ? (
                  items.map((it) => (
                    <span
                      key={it.titulo}
                      className="rounded-md border border-line bg-surface px-2.5 py-1 text-xs text-texto"
                    >
                      {it.titulo}
                    </span>
                  ))
                ) : (
                  <span className="text-xs text-muted">Sin soluciones en este grupo.</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
