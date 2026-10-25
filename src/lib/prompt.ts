// Prompt y validación de la respuesta del LLM. La salida se trata como dato sin
// confiar: se valida, se recorta y se rellena con valores por defecto.

import type { AIOportunidad, Categoria, Complejidad, Nivel, Oportunidad } from "./types";
import type { ScrapedData } from "./scraper";

const CATEGORIAS: Categoria[] = [
  "Captación",
  "Ventas",
  "Marketing",
  "Atención al cliente",
  "Operaciones",
  "Administración",
  "Datos",
  "IA",
];
const NIVELES: Nivel[] = ["ALTO", "MEDIO", "BAJO"];
const COMPLEJIDADES: Complejidad[] = ["ALTA", "MEDIA", "BAJA"];

export function armarPrompt(scraped: ScrapedData, sectorDetectado: string): string {
  const datos = {
    url: scraped.urlFinal,
    titulo: scraped.titulo,
    descripcion: scraped.metaDescription,
    encabezados: scraped.encabezados,
    navegacion: scraped.navegacion,
    ctas: scraped.ctas,
    formularios: scraped.formularios.length,
    whatsapp: scraped.whatsapp,
    reserva: scraped.reserva.detectada,
    telefonos: scraped.telefonos.length,
    emails: scraped.emails.length,
    redes: scraped.redes,
    tecnologias: scraped.tecnologias,
    blog: scraped.blog,
    preciosVisibles: scraped.preciosVisibles,
  };

  return `Analizá la siguiente empresa a partir de estos datos extraídos de su web (solo contás con esto, no inventes datos que no estén):
${JSON.stringify(datos, null, 2)}

Sector detectado por heurística: ${sectorDetectado}.

Devolvé SOLO un JSON válido, sin texto alrededor, con esta forma exacta:
{
  "sector": "sector más probable",
  "resumen": "2-3 frases resumiendo el negocio",
  "clienteObjetivo": "a quién le vende",
  "oportunidades": [{"titulo":"...","problema":"...","solucion":"...","categoria":"...","impacto":"ALTO|MEDIO|BAJO","complejidad":"ALTA|MEDIA|BAJA"}],
  "aiOportunidades": [{"titulo":"...","descripcion":"...","categoria":"...","impacto":"ALTO|MEDIO|BAJO","dificultad":"ALTA|MEDIA|BAJA"}]
}
Máximo 7 oportunidades y 12 aiOportunidades. Categorías válidas: ${CATEGORIAS.join(", ")}. Sé específico, nada genérico.`;
}

export type RespuestaLlm = {
  sector?: string;
  resumen?: string;
  clienteObjetivo?: string;
  oportunidades?: Omit<Oportunidad, "id" | "fuente" | "prioridad">[];
  aiOportunidades?: AIOportunidad[];
};

function esCategoria(v: unknown): v is Categoria {
  return typeof v === "string" && CATEGORIAS.includes(v as Categoria);
}
function esNivel(v: unknown): v is Nivel {
  return typeof v === "string" && NIVELES.includes(v as Nivel);
}
function esComplejidad(v: unknown): v is Complejidad {
  return typeof v === "string" && COMPLEJIDADES.includes(v as Complejidad);
}
function txt(v: unknown, max = 400): string {
  return typeof v === "string" ? v.trim().slice(0, max) : "";
}

export function parsearRespuestaLlm(raw: string): RespuestaLlm | null {
  try {
    const json = raw.slice(raw.indexOf("{"), raw.lastIndexOf("}") + 1);
    const obj = JSON.parse(json) as Record<string, unknown>;
    if (!obj || typeof obj !== "object") return null;

    const oportunidades = Array.isArray(obj.oportunidades)
      ? obj.oportunidades
          .map((o) => {
            const x = o as Record<string, unknown>;
            const categoria = esCategoria(x.categoria) ? x.categoria : "Operaciones";
            const impacto = esNivel(x.impacto) ? x.impacto : "MEDIO";
            const complejidad = esComplejidad(x.complejidad) ? x.complejidad : "MEDIA";
            return {
              categoria,
              titulo: txt(x.titulo, 120),
              problema: txt(x.problema, 300),
              solucion: txt(x.solucion, 300),
              flujo: ["Lead", "IA", "Comercial"],
              impacto,
              complejidad,
            };
          })
          .filter((o) => o.titulo)
          .slice(0, 7)
      : undefined;

    const aiOportunidades = Array.isArray(obj.aiOportunidades)
      ? obj.aiOportunidades
          .map((a) => {
            const x = a as Record<string, unknown>;
            return {
              titulo: txt(x.titulo, 120),
              descripcion: txt(x.descripcion, 300),
              categoria: esCategoria(x.categoria) ? x.categoria : "IA",
              impacto: esNivel(x.impacto) ? x.impacto : "MEDIO",
              dificultad: esComplejidad(x.dificultad) ? x.dificultad : "MEDIA",
            };
          })
          .filter((a) => a.titulo)
          .slice(0, 12)
      : undefined;

    return {
      sector: txt(obj.sector, 80) || undefined,
      resumen: txt(obj.resumen, 600) || undefined,
      clienteObjetivo: txt(obj.clienteObjetivo, 200) || undefined,
      oportunidades,
      aiOportunidades,
    };
  } catch {
    return null;
  }
}
