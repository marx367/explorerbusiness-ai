"use client";

import { useEffect, useRef, useState } from "react";
import { Check, Loader2 } from "lucide-react";
import type { AnalysisResult } from "@/lib/types";

const FASES = [
  "Analizando página web",
  "Identificando modelo de negocio",
  "Analizando captación de clientes",
  "Investigando competidores",
  "Detectando procesos automatizables",
  "Buscando oportunidades de IA",
  "Calculando AI Transformation Score",
  "Generando recomendaciones",
];

const MIN_DURACION = 2600;

export function AnalyzerOverlay({
  url,
  resultado,
  onDone,
}: {
  url: string;
  resultado: AnalysisResult | null;
  onDone: (r: AnalysisResult) => void;
}) {
  const [fase, setFase] = useState(0);
  const [inicio] = useState(() => Date.now());
  const onDoneRef = useRef(onDone);
  useEffect(() => {
    onDoneRef.current = onDone;
  }, [onDone]);

  useEffect(() => {
    if (!resultado) {
      if (fase < FASES.length - 1) {
        const t = setTimeout(() => setFase((f) => f + 1), 620);
        return () => clearTimeout(t);
      }
      return;
    }
    if (fase < FASES.length) {
      const t = setTimeout(() => setFase((f) => f + 1), 180);
      return () => clearTimeout(t);
    }
    const restante = MIN_DURACION - (Date.now() - inicio);
    if (restante > 0) {
      const t = setTimeout(() => onDoneRef.current(resultado), restante);
      return () => clearTimeout(t);
    }
    onDoneRef.current(resultado);
  }, [fase, resultado, inicio]);

  const progreso = Math.min(100, Math.round((fase / FASES.length) * 100));

  return (
    <div className="flex min-h-screen items-center justify-center px-6 py-16">
      <div className="glass anim-fade-up w-full max-w-lg rounded-3xl p-8">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-sm font-semibold">Analizando empresa</span>
          <span className="font-mono text-xs text-muted">{progreso}%</span>
        </div>
        <div className="mb-6 h-1 overflow-hidden rounded-full bg-line">
          <div
            className="h-full rounded-full bg-gradient-to-r from-acento-3 to-acento transition-all duration-500"
            style={{ width: `${progreso}%` }}
          />
        </div>

        <div className="mb-6 overflow-hidden rounded-xl border border-line bg-surface-2 px-4 py-3">
          <div className="text-[11px] uppercase tracking-wider text-muted">Destino</div>
          <div className="truncate font-mono text-sm text-acento">{url}</div>
        </div>

        <ul className="space-y-1">
          {FASES.map((nombre, i) => {
            const hecho = i < fase;
            const activo = i === fase;
            const detalle = hecho && resultado ? resultado.fases[i]?.detalle : "";
            return (
              <li
                key={nombre}
                className={`flex items-start gap-3 rounded-xl px-3 py-2.5 transition-colors ${
                  activo ? "bg-surface-2" : "bg-transparent"
                }`}
              >
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center">
                  {hecho ? (
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-exito/15 text-exito">
                      <Check className="h-3.5 w-3.5" />
                    </span>
                  ) : activo ? (
                    <Loader2 className="h-5 w-5 animate-spin text-acento" />
                  ) : (
                    <span className="h-2 w-2 rounded-full bg-line" />
                  )}
                </span>
                <div className="min-w-0">
                  <div
                    className={`text-sm ${
                      hecho ? "text-texto" : activo ? "font-medium text-texto" : "text-muted/50"
                    }`}
                  >
                    {nombre}
                  </div>
                  {(hecho || activo) && (
                    <div className="mt-0.5 truncate text-xs text-muted">
                      {hecho ? detalle : "…"}
                    </div>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
