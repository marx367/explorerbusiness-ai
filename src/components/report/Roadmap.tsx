"use client";

import { Check } from "lucide-react";
import type { FaseRoadmap } from "@/lib/types";
import { Card, SectionTitle } from "@/components/ui";

export function Roadmap({ roadmap }: { roadmap: FaseRoadmap[] }) {
  return (
    <section>
      <SectionTitle
        kicker="Plan de acción"
        titulo="AI Transformation Roadmap"
        sub="Un plan en tres fases, de lo más rápido a lo más avanzado."
      />
      <div className="grid gap-5 md:grid-cols-3">
        {roadmap.map((f) => (
          <Card key={f.nombre} className="flex flex-col p-6">
            <h3 className="text-lg font-semibold">{f.nombre}</h3>
            <p className="mt-1 text-sm text-muted">{f.rango}</p>
            <ul className="mt-4 space-y-2.5">
              {f.items.map((it) => (
                <li key={it} className="flex items-start gap-2 text-sm text-muted">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-exito" />
                  {it}
                </li>
              ))}
            </ul>
          </Card>
        ))}
      </div>
    </section>
  );
}
