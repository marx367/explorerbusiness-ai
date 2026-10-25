"use client";

import { useState } from "react";
import { Card, SectionTitle } from "@/components/ui";

function Campo({
  label,
  value,
  onChange,
  suffix,
}: {
  label: string;
  value: number;
  onChange: (n: number) => void;
  suffix?: string;
}) {
  return (
    <label className="block">
      <span className="text-xs text-muted">{label}</span>
      <div className="mt-1.5 flex items-center gap-2">
        <input
          type="number"
          min={0}
          value={Number.isFinite(value) ? value : 0}
          onChange={(e) => onChange(Number(e.target.value) || 0)}
          className="h-11 w-full rounded-lg border border-line bg-surface-2 px-3 text-sm text-texto outline-none transition-colors focus:border-acento/60"
        />
        {suffix && <span className="shrink-0 text-sm text-muted">{suffix}</span>}
      </div>
    </label>
  );
}

function Stat({ label, valor, destacado }: { label: string; valor: string; destacado?: boolean }) {
  return (
    <div
      className={`rounded-xl border p-4 ${
        destacado ? "border-acento/40 bg-acento/10" : "border-line bg-surface-2"
      }`}
    >
      <div className="text-xs text-muted">{label}</div>
      <div className={`mt-1 text-2xl font-bold tabular-nums ${destacado ? "text-acento" : "text-texto"}`}>
        {valor}
      </div>
    </div>
  );
}

const euro = new Intl.NumberFormat("es-ES", { maximumFractionDigits: 0 });

export function ROICalculator() {
  const [leads, setLeads] = useState(200);
  const [conv, setConv] = useState(8);
  const [convIA, setConvIA] = useState(10);
  const [valor, setValor] = useState(1000);
  const [horas, setHoras] = useState(80);
  const [coste, setCoste] = useState(25);
  const [ahorro, setAhorro] = useState(40);

  const clientes = Math.round((leads * conv) / 100);
  const clientesIA = Math.round((leads * convIA) / 100);
  const extra = Math.max(0, clientesIA - clientes);
  const ingresoExtra = extra * valor;
  const horasAhorradas = Math.round((horas * ahorro) / 100);
  const ahorroEur = horasAhorradas * coste;
  const total = ingresoExtra + ahorroEur;

  return (
    <section>
      <SectionTitle
        kicker="Calculadora"
        titulo="ROI Calculator"
        sub="Estimá el impacto potencial con tus propios números."
      />
      <Card className="p-6 sm:p-8">
        <div className="grid gap-8 lg:grid-cols-2">
          <div className="grid grid-cols-2 gap-4">
            <Campo label="Leads mensuales" value={leads} onChange={setLeads} />
            <Campo label="Conversión actual" value={conv} onChange={setConv} suffix="%" />
            <Campo label="Conversión con IA" value={convIA} onChange={setConvIA} suffix="%" />
            <Campo label="Valor medio por cliente" value={valor} onChange={setValor} suffix="€" />
            <Campo label="Horas administrativas / mes" value={horas} onChange={setHoras} suffix="h" />
            <Campo label="Coste por hora" value={coste} onChange={setCoste} suffix="€" />
            <Campo label="Horas automatizables" value={ahorro} onChange={setAhorro} suffix="%" />
          </div>

          <div className="grid content-start gap-3">
            <Stat label="Clientes actuales" valor={String(clientes)} />
            <Stat label={`Clientes con IA (conversión ${convIA}%)`} valor={String(clientesIA)} />
            <Stat label="Clientes adicionales" valor={`+${extra}`} />
            <Stat label="Ingreso adicional" valor={`${euro.format(ingresoExtra)} €/mes`} />
            <Stat label="Ahorro en tiempo" valor={`${horasAhorradas} h/mes`} />
            <Stat label="Ahorro económico" valor={`${euro.format(ahorroEur)} €/mes`} />
            <Stat label="Potencial total" valor={`${euro.format(total)} €/mes`} destacado />
          </div>
        </div>
        <p className="mt-6 border-t border-line pt-4 text-xs leading-relaxed text-muted">
          Estimación basada en los datos introducidos por el usuario. No es una garantía
          de resultados: depende de cada negocio y de la ejecución.
        </p>
      </Card>
    </section>
  );
}
