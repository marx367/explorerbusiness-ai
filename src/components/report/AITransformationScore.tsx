"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  LabelList,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";
import type { Scores } from "@/lib/types";
import { Card, ScoreRing, SectionTitle } from "@/components/ui";

function datos(s: Scores) {
  return [
    { nombre: "Captación", valor: s.captacion },
    { nombre: "Ventas", valor: s.ventas },
    { nombre: "Atención al cliente", valor: s.atencion },
    { nombre: "Automatización", valor: s.automatizacion },
    { nombre: "Uso de IA", valor: s.ia },
    { nombre: "Seguimiento comercial", valor: s.seguimiento },
    { nombre: "Gestión de datos", valor: s.datos },
  ];
}

const color = (v: number) => (v >= 50 ? "var(--color-acento)" : "var(--color-alerta)");

export function AITransformationScore({ scores }: { scores: Scores }) {
  const data = datos(scores);
  return (
    <section>
      <SectionTitle
        kicker="Diagnóstico"
        titulo="AI Transformation Score"
        sub="Puntuación estimada a partir de las señales detectadas en la web. No es una medición oficial."
      />
      <Card className="p-6 sm:p-8">
        <div className="flex flex-col items-center gap-10 lg:flex-row">
          <div className="flex flex-col items-center gap-3">
            <ScoreRing valor={scores.global} />
            <span className="text-xs text-muted">Puntuación global</span>
          </div>
          <div className="h-72 min-w-0 flex-1">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data} layout="vertical" margin={{ left: 4, right: 44, top: 4, bottom: 4 }}>
                <CartesianGrid horizontal={false} stroke="var(--color-line)" />
                <XAxis type="number" domain={[0, 100]} hide />
                <YAxis
                  type="category"
                  dataKey="nombre"
                  width={138}
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "var(--color-muted)", fontSize: 12 }}
                />
                <Bar dataKey="valor" radius={[4, 4, 4, 4]} barSize={16} isAnimationActive>
                  <LabelList
                    dataKey="valor"
                    position="right"
                    fill="var(--color-texto)"
                    fontSize={12}
                    formatter={(v) => (v == null ? "" : `${v}/100`)}
                  />
                  {data.map((d, i) => (
                    <Cell key={i} fill={color(d.valor)} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </Card>
    </section>
  );
}
