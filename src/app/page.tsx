"use client";

import { useState } from "react";
import { UrlForm } from "@/components/analyzer/UrlForm";
import { AnalyzerOverlay } from "@/components/analyzer/AnalyzerOverlay";
import { Reporte } from "@/components/report/Reporte";
import type { AnalysisResult } from "@/lib/types";

type Estado = "inicial" | "analizando" | "resultado";

export default function Home() {
  const [estado, setEstado] = useState<Estado>("inicial");
  const [url, setUrl] = useState("");
  const [parcial, setParcial] = useState<AnalysisResult | null>(null);
  const [resultado, setResultado] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState("");

  async function ejecutar(payload: { url?: string; demo?: boolean }, urlMostrada: string) {
    setEstado("analizando");
    setUrl(urlMostrada);
    setParcial(null);
    setResultado(null);
    setError("");
    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (!res.ok) {
        setError(json?.error || "No se pudo analizar la URL.");
        setEstado("inicial");
        return;
      }
      setParcial(json as AnalysisResult);
    } catch {
      setError("No se pudo conectar con el servidor local.");
      setEstado("inicial");
    }
  }

  function onDone(r: AnalysisResult) {
    setResultado(r);
    setEstado("resultado");
  }

  function reiniciar() {
    setEstado("inicial");
    setResultado(null);
    setParcial(null);
    setError("");
    setUrl("");
  }

  if (estado === "analizando") {
    return <AnalyzerOverlay url={url} resultado={parcial} onDone={onDone} />;
  }
  if (estado === "resultado" && resultado) {
    return <Reporte resultado={resultado} onReiniciar={reiniciar} />;
  }
  return (
    <UrlForm
      onAnalizar={(u) => ejecutar({ url: u }, u)}
      onDemo={() => ejecutar({ demo: true }, "https://novadental.demo")}
      error={error}
    />
  );
}
