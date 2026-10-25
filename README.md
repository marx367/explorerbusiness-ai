# AI Business X-Ray (ExplorerBusiness AI)

Analiza la URL de una empresa y genera un informe visual de oportunidades de IA y
automatización: Business Snapshot, AI Transformation Score, oportunidades, Automation
Map, competidores, recomendaciones, matriz impacto/dificultad, roadmap, calculadora de
ROI y top 3.

## Ejecutar en local

```bash
npm install
npm run dev
```

Abrí `http://localhost:3000`.

- **Analizar empresa:** pega una URL. El servidor extrae datos reales del HTML
  (título, meta, formularios, contactos, tecnología, CTAs) y genera el análisis con un
  motor determinístico. Cada dato muestra su procedencia: *Detectado* (real),
  *Inferido* (estimación) o *DEMO*.
- **Cargar ejemplo DEMO:** informe completo de una empresa ficticia, siempre disponible.

## Datos reales vs demo

- **Real (sin claves):** scraping del HTML (nombre, descripción, formularios, WhatsApp,
  teléfono/email, reservas, tecnología detectada, nivel de digitalización).
- **Inferido (sin claves):** sector, propuesta de valor, cliente objetivo, puntuaciones,
  oportunidades y recomendaciones. Se marcan como "Inferido".
- **IA real (opcional):** si configurás una clave en `.env`, un LLM enriquece el análisis.
- **Competidores:** solo con una API de búsqueda (`TAVILY_API_KEY`); si no, "no disponible".

## Conectar la IA real

1. Copiá `.env.example` a `.env` y completá las claves (nunca se suben al repo).
2. Reiniciá `npm run dev`.

Variables soportadas: `ANTHROPIC_API_KEY` (Claude), o `OPENAI_COMPAT_*` (OpenRouter,
OpenAI, DeepSeek, GLM, Qwen...), y `TAVILY_API_KEY` para competidores.
