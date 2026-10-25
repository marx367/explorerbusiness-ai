"use client";

import { ExternalLink } from "lucide-react";
import type { AnalysisResult, Competidor } from "@/lib/types";
import { Card, SectionTitle } from "@/components/ui";

function Lista({ titulo, items }: { titulo: string; items: string[] }) {
  if (!items.length) return null;
  return (
    <div className="mt-3">
      <div className="text-[11px] font-semibold uppercase tracking-wider text-muted">{titulo}</div>
      <ul className="mt-1 space-y-1">
        {items.map((it) => (
          <li key={it} className="flex items-start gap-2 text-sm text-muted">
            <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-acento" />
            {it}
          </li>
        ))}
      </ul>
    </div>
  );
}

function CompetidorCard({ c }: { c: Competidor }) {
  return (
    <Card className="p-6">
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-lg font-semibold">{c.nombre}</h3>
        {c.web && (
          <span className="inline-flex items-center gap-1.5 font-mono text-xs text-acento">
            {c.web}
            <ExternalLink className="h-3 w-3" />
          </span>
        )}
      </div>
      <p className="mt-2 text-sm leading-relaxed text-muted">{c.propuesta}</p>
      <Lista titulo="Fortalezas detectadas" items={c.fortalezas} />
      <Lista titulo="Elementos interesantes" items={c.elementosInteresantes} />
      <Lista titulo="Oportunidades a adoptar" items={c.oportunidadesAdoptables} />
    </Card>
  );
}

export function Competitors({ resultado }: { resultado: AnalysisResult }) {
  const { competidores, competitiveGap } = resultado;
  return (
    <section>
      <SectionTitle
        kicker="Mercado"
        titulo="Competidores"
        sub="Solo se muestran competidores cuando hay una búsqueda real disponible; nunca se inventan."
      />

      {competidores.length === 0 ? (
        <Card className="p-8 text-center">
          <p className="text-sm text-muted">
            No disponible: para buscar competidores hace falta una API de búsqueda
            (<span className="font-mono">TAVILY_API_KEY</span> en <span className="font-mono">.env</span>).
          </p>
        </Card>
      ) : (
        <div className="grid gap-5 md:grid-cols-2">
          {competidores.map((c) => (
            <CompetidorCard key={c.web || c.nombre} c={c} />
          ))}
        </div>
      )}

      <div className="mt-10">
        <h3 className="mb-4 text-xl font-bold tracking-tight">Competitive Gap</h3>
        {competitiveGap.disponible && competitiveGap.puntos.length > 0 ? (
          <Card className="p-6">
            <ul className="space-y-2.5">
              {competitiveGap.puntos.map((p) => (
                <li key={p} className="flex items-start gap-3 text-sm text-texto">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-peligro" />
                  {p}
                </li>
              ))}
            </ul>
          </Card>
        ) : (
          <Card className="p-6 text-sm text-muted">
            {competidores.length === 0
              ? "Sin competidores, no se puede calcular la brecha competitiva."
              : "La brecha competitiva requiere un análisis profundo (IA) de los competidores encontrados."}
          </Card>
        )}
      </div>
    </section>
  );
}
