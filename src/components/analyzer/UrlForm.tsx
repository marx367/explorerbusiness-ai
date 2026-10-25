"use client";

import { useState } from "react";
import { ArrowRight, FlaskConical, Globe, ScanLine, Sparkles, Zap } from "lucide-react";

export function UrlForm({
  onAnalizar,
  onDemo,
  error,
}: {
  onAnalizar: (url: string) => void;
  onDemo: () => void;
  error?: string;
}) {
  const [url, setUrl] = useState("");
  const [vacio, setVacio] = useState(false);

  function enviar(e: React.FormEvent) {
    e.preventDefault();
    const u = url.trim();
    if (!u) {
      setVacio(true);
      return;
    }
    setVacio(false);
    onAnalizar(u);
  }

  return (
    <div className="relative min-h-screen overflow-hidden">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-acento/60 to-transparent" />

      <div className="mx-auto flex min-h-screen max-w-3xl flex-col items-center justify-center px-6 py-16">
        <div className="anim-fade-up mb-8 inline-flex items-center gap-2 rounded-full border border-line bg-surface px-3 py-1.5 text-xs text-muted">
          <Sparkles className="h-3.5 w-3.5 text-acento" />
          Análisis de negocio con IA
        </div>

        <h1
          className="anim-fade-up text-center text-5xl font-bold tracking-tight sm:text-7xl"
          style={{ animationDelay: "80ms" }}
        >
          AI Business <span className="texto-degradado">X-Ray</span>
        </h1>

        <p
          className="anim-fade-up mt-6 max-w-xl text-center text-lg leading-relaxed text-muted"
          style={{ animationDelay: "160ms" }}
        >
          Descubre en segundos cómo una empresa puede utilizar IA y automatización para
          vender más, ahorrar tiempo y mejorar sus procesos.
        </p>

        <form
          onSubmit={enviar}
          className="anim-fade-up mt-10 w-full max-w-xl"
          style={{ animationDelay: "240ms" }}
          noValidate
        >
          <div
            className={`glass flex items-center gap-3 rounded-2xl p-2 transition-colors ${
              vacio ? "border-peligro/50" : "focus-within:border-acento/60"
            }`}
          >
            <Globe className="ml-2 h-5 w-5 shrink-0 text-muted" />
            <input
              type="text"
              inputMode="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://empresa.com"
              aria-label="URL de la empresa"
              className="h-12 w-full bg-transparent text-base text-texto outline-none placeholder:text-muted/70"
            />
            <button
              type="submit"
              className="flex h-12 shrink-0 items-center gap-2 rounded-xl bg-acento px-5 text-sm font-semibold text-bg transition-transform hover:scale-[1.03] active:scale-95"
            >
              ANALIZAR EMPRESA
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
          {vacio && <p className="mt-2 px-2 text-sm text-peligro">Ingresá una URL.</p>}
          {error && !vacio && <p className="mt-2 px-2 text-sm text-peligro">{error}</p>}
        </form>

        <button
          onClick={onDemo}
          className="anim-fade-up mt-4 inline-flex items-center gap-2 text-sm text-muted transition-colors hover:text-texto"
          style={{ animationDelay: "320ms" }}
        >
          <FlaskConical className="h-4 w-4 text-acento-2" />
          Cargar ejemplo DEMO
        </button>

        <div
          className="anim-fade-up mt-14 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-xs text-muted"
          style={{ animationDelay: "400ms" }}
        >
          <span className="inline-flex items-center gap-2">
            <ScanLine className="h-4 w-4 text-acento" /> Extrae datos reales de la web
          </span>
          <span className="inline-flex items-center gap-2">
            <Zap className="h-4 w-4 text-acento-2" /> 8 fases de análisis
          </span>
          <span className="inline-flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-acento-3" /> Informe visual completo
          </span>
        </div>
      </div>
    </div>
  );
}
