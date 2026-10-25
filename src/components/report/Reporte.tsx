"use client";

import { AlertTriangle, RotateCcw, ScanLine } from "lucide-react";
import type { AnalysisResult } from "@/lib/types";
import { BusinessSnapshot } from "./BusinessSnapshot";
import { AITransformationScore } from "./AITransformationScore";
import { Opportunities } from "./Opportunities";
import { AutomationMap } from "./AutomationMap";
import { Competitors } from "./Competitors";
import { AIOpportunities } from "./AIOpportunities";
import { ImpactMatrix } from "./ImpactMatrix";
import { Roadmap } from "./Roadmap";
import { ROICalculator } from "./ROICalculator";
import { Top3 } from "./Top3";

export function Reporte({
  resultado,
  onReiniciar,
}: {
  resultado: AnalysisResult;
  onReiniciar: () => void;
}) {
  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-20 border-b border-line bg-bg/80 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-6">
          <div className="flex items-center gap-2.5">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-acento/15 text-acento">
              <ScanLine className="h-4.5 w-4.5" />
            </span>
            <span className="font-semibold tracking-tight">
              Explorer Business <span className="texto-degradado">AI</span>
            </span>
          </div>
          <button
            onClick={onReiniciar}
            className="inline-flex items-center gap-2 rounded-lg border border-line px-3 py-2 text-sm text-muted transition-colors hover:border-acento/40 hover:text-texto"
          >
            <RotateCcw className="h-4 w-4" />
            Nuevo análisis
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-5xl space-y-16 px-6 py-12">
        <div className="anim-fade-up">
          {resultado.modo === "demo" && (
            <div className="mb-6 flex items-start gap-3 rounded-2xl border border-acento-2/30 bg-acento-2/10 p-4">
              <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-acento-2" />
              <p className="text-sm text-texto">
                <span className="font-semibold">Modo DEMO:</span> este informe usa una empresa
                ficticia («{resultado.empresa}») para mostrar todas las secciones.
              </p>
            </div>
          )}

          {resultado.avisos.length > 0 && (
            <div className="mb-6 space-y-1 rounded-2xl border border-line bg-surface p-4">
              {resultado.avisos.map((a) => (
                <p key={a} className="flex items-start gap-2 text-xs text-muted">
                  <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-acento" />
                  {a}
                </p>
              ))}
            </div>
          )}

          <div className="rounded-2xl border border-line bg-surface/50 p-6">
            <div className="text-xs uppercase tracking-wider text-muted">Empresa analizada</div>
            <h1 className="mt-1 text-3xl font-bold tracking-tight sm:text-4xl">{resultado.empresa}</h1>
            <div className="mt-1 font-mono text-sm text-acento">{resultado.url}</div>
            <p className="mt-4 max-w-3xl text-sm leading-relaxed text-muted">{resultado.resumen}</p>
          </div>
        </div>

        <BusinessSnapshot snapshot={resultado.snapshot} />
        <AITransformationScore scores={resultado.scores} />
        <Opportunities oportunidades={resultado.oportunidades} />
        <AutomationMap mapa={resultado.automationMap} />
        <Competitors resultado={resultado} />
        <AIOpportunities ai={resultado.aiOportunidades} />
        <ImpactMatrix matriz={resultado.matriz} />
        <Roadmap roadmap={resultado.roadmap} />
        <ROICalculator />
        <Top3 top3={resultado.top3} />
      </main>

      <footer className="border-t border-line py-8 text-center text-xs text-muted">
        Explorer Business AI · Análisis con fines demostrativos. Las puntuaciones y
        recomendaciones son estimaciones.
      </footer>
    </div>
  );
}
