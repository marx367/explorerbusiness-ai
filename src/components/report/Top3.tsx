"use client";

import { Card, SectionTitle } from "@/components/ui";

const MEDALLAS = ["🥇", "🥈", "🥉"];

export function Top3({ top3 }: { top3: { titulo: string; motivo: string }[] }) {
  return (
    <section>
      <SectionTitle
        kicker="Por dónde empezar"
        titulo="If I owned this business, I would start here"
        sub="Las tres implementaciones con mejor combinación de impacto, dificultad y velocidad."
      />
      <div className="grid gap-5 md:grid-cols-3">
        {top3.map((t, i) => (
          <Card
            key={t.titulo}
            className={`p-6 ${i === 0 ? "border-acento/40 bg-acento/[0.06]" : ""}`}
          >
            <div className="text-3xl">{MEDALLAS[i]}</div>
            <h3 className="mt-3 text-lg font-semibold">{t.titulo}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted">{t.motivo}</p>
          </Card>
        ))}
      </div>
    </section>
  );
}
