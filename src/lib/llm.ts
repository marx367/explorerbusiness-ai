// Capa multi-LLM (opcional) y búsqueda de competidores. Solo corre del lado servidor.
// Sin clave configurada, estas funciones devuelven null y el análisis usa el motor
// determinístico. Las claves se leen de process.env (nunca llegan al navegador).

import type { Competidor, CompetitiveGap } from "./types";
import type { ScrapedData } from "./scraper";
import { armarPrompt, parsearRespuestaLlm, type RespuestaLlm } from "./prompt";

const MAX_TOKENS = 1500;

function llmDisponible(): boolean {
  return Boolean(process.env.ANTHROPIC_API_KEY || process.env.OPENAI_COMPAT_API_KEY);
}

async function completar(system: string, user: string): Promise<string | null> {
  try {
    if (process.env.ANTHROPIC_API_KEY) {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "x-api-key": process.env.ANTHROPIC_API_KEY,
          "anthropic-version": "2023-06-01",
          "content-type": "application/json",
        },
        body: JSON.stringify({
          model: process.env.ANTHROPIC_MODEL || "claude-sonnet-5-5",
          max_tokens: MAX_TOKENS,
          system,
          messages: [{ role: "user", content: user }],
        }),
      });
      if (!res.ok) return null;
      const data = (await res.json()) as { content?: { type: string; text?: string }[] };
      return data.content?.find((c) => c.type === "text")?.text ?? null;
    }

    if (process.env.OPENAI_COMPAT_API_KEY) {
      const base = (process.env.OPENAI_COMPAT_BASE_URL || "https://openrouter.ai/api/v1").replace(/\/$/, "");
      const res = await fetch(`${base}/chat/completions`, {
        method: "POST",
        headers: {
          authorization: `Bearer ${process.env.OPENAI_COMPAT_API_KEY}`,
          "content-type": "application/json",
        },
        body: JSON.stringify({
          model: process.env.OPENAI_COMPAT_MODEL || "openrouter/auto",
          messages: [
            { role: "system", content: system },
            { role: "user", content: user },
          ],
        }),
      });
      if (!res.ok) return null;
      const data = (await res.json()) as { choices?: { message?: { content?: string } }[] };
      return data.choices?.[0]?.message?.content ?? null;
    }
    return null;
  } catch {
    return null;
  }
}

export async function enriquecerConLLM(
  scraped: ScrapedData,
  sectorDetectado: string,
): Promise<RespuestaLlm | null> {
  if (!llmDisponible()) return null;
  const user = armarPrompt(scraped, sectorDetectado);
  const system =
    "Sos un analista de negocio experto en IA y automatización. Respondé solo con el JSON pedido.";
  const raw = await completar(system, user);
  if (!raw) return null;
  return parsearRespuestaLlm(raw);
}

export async function buscarCompetidores(
  empresa: string,
  sector: string,
): Promise<{ competidores: Competidor[]; gap: CompetitiveGap } | null> {
  const key = process.env.TAVILY_API_KEY;
  if (!key) return null;
  try {
    const res = await fetch("https://api.tavily.com/search", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        api_key: key,
        query: `${empresa} ${sector} competidores`,
        max_results: 5,
        search_depth: "basic",
      }),
    });
    if (!res.ok) return null;
    const data = (await res.json()) as {
      results?: { title?: string; url?: string; content?: string }[];
    };
    const competidores: Competidor[] = (data.results ?? [])
      .slice(0, 5)
      .map((r) => ({
        nombre: r.title?.split("|")[0].trim().slice(0, 80) || "Competidor",
        web: r.url ?? "",
        propuesta: r.content?.slice(0, 240) ?? "",
        fortalezas: [],
        elementosInteresantes: [],
        oportunidadesAdoptables: [],
      }));

    return {
      competidores,
      gap: { disponible: true, puntos: [] },
    };
  } catch {
    return null;
  }
}
