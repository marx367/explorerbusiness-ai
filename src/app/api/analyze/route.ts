import { NextResponse } from "next/server";
import { scrapear } from "@/lib/scraper";
import {
  clasificarSector,
  construirResumen,
  construirSnapshot,
  calcularScores,
} from "@/lib/signal-engine";
import {
  generarAIOportunidades,
  generarAutomationMap,
  generarMatriz,
  generarOportunidades,
  generarRoadmap,
  generarTop3,
} from "@/lib/oportunidades";
import { buscarCompetidores, enriquecerConLLM } from "@/lib/llm";
import { crearDemo } from "@/lib/demo";
import type { AnalysisResult, FaseAnalisis, Oportunidad } from "@/lib/types";

function trunc(s: string, n: number): string {
  return s.length > n ? s.slice(0, n - 1) + "…" : s;
}

export async function POST(req: Request) {
  let body: { url?: string; demo?: boolean };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Cuerpo de la petición inválido." }, { status: 400 });
  }

  if (body.demo) {
    return NextResponse.json(crearDemo());
  }

  const url = (body.url ?? "").trim();
  if (!url) {
    return NextResponse.json({ error: "Ingresá una URL para analizar." }, { status: 422 });
  }

  const scraped = await scrapear(url);
  if (!scraped.ok) {
    return NextResponse.json({ error: scraped.error }, { status: 422 });
  }

  // Motor determinístico (funciona siempre).
  let sector = clasificarSector(scraped);
  const snapshot = construirSnapshot(scraped, sector);
  const scores = calcularScores(scraped);
  let resumen = construirResumen(scraped, sector);
  let oportunidades = generarOportunidades(scraped);
  let aiOportunidades = generarAIOportunidades(scraped);

  const avisos: string[] = [
    "Puntuaciones y recomendaciones son estimaciones basadas en señales detectadas en la web.",
  ];

  // Enriquecimiento con LLM (opcional; sin clave se salta).
  const llm = await enriquecerConLLM(scraped, sector);
  if (llm) {
    avisos.push("Análisis enriquecido con IA.");
    if (llm.sector) {
      sector = llm.sector;
      snapshot.sector = { texto: llm.sector, fuente: "inferred" };
    }
    if (llm.resumen) resumen = llm.resumen;
    if (llm.clienteObjetivo) {
      snapshot.clienteObjetivo = { texto: llm.clienteObjetivo, fuente: "inferred" };
    }
    if (llm.oportunidades?.length) {
      oportunidades = llm.oportunidades.map((o, i): Oportunidad => ({
        ...o,
        id: `op-${i}`,
        fuente: "inferred",
        prioridad: i + 1,
      }));
    }
    if (llm.aiOportunidades?.length) {
      aiOportunidades = llm.aiOportunidades;
    }
  } else {
    avisos.push("Sin clave de IA configurada: se usó el motor determinístico.");
  }

  // Competidores (solo si hay API de búsqueda; si no, no se inventan).
  const empresa = snapshot.empresa.texto;
  const comp = await buscarCompetidores(empresa, sector);
  let competidores: AnalysisResult["competidores"] = [];
  let competitiveGap: AnalysisResult["competitiveGap"] = { disponible: false, puntos: [] };
  if (comp) {
    competidores = comp.competidores;
    competitiveGap = comp.gap;
  } else {
    avisos.push("Competidores no disponibles: se necesita una clave de búsqueda (TAVILY_API_KEY).");
  }

  const matriz = generarMatriz(oportunidades, aiOportunidades);
  const automationMap = generarAutomationMap();

  const fases: FaseAnalisis[] = [
    {
      nombre: "Analizando página web",
      detalle: scraped.titulo
        ? `«${trunc(scraped.titulo, 42)}» · ${scraped.enlacesInternos} enlaces internos`
        : `${scraped.enlacesInternos} enlaces internos analizados`,
    },
    { nombre: "Identificando modelo de negocio", detalle: `Sector: ${sector}` },
    {
      nombre: "Analizando captación de clientes",
      detalle: `${scraped.formularios.length} formularios · ${scraped.whatsapp ? "WhatsApp" : "sin WhatsApp"} · ${scraped.ctas.length} CTAs`,
    },
    {
      nombre: "Investigando competidores",
      detalle: competidores.length
        ? `${competidores.length} competidores descubiertos`
        : "no disponible (sin clave de búsqueda)",
    },
    { nombre: "Detectando procesos automatizables", detalle: `${oportunidades.length} procesos detectados` },
    { nombre: "Buscando oportunidades de IA", detalle: `${aiOportunidades.length} aplicaciones de IA` },
    { nombre: "Calculando AI Transformation Score", detalle: `${scores.global}/100` },
    { nombre: "Generando recomendaciones", detalle: "Top 3 seleccionado" },
  ];

  const resultado: AnalysisResult = {
    modo: "real",
    url: scraped.urlFinal,
    empresa,
    sector,
    resumen,
    snapshot,
    scores,
    oportunidades,
    automationMap,
    competidores,
    competitiveGap,
    aiOportunidades,
    matriz,
    roadmap: generarRoadmap(matriz),
    top3: generarTop3(oportunidades, aiOportunidades),
    fases,
    avisos,
  };

  return NextResponse.json(resultado);
}
