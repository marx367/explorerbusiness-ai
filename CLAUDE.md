# ExplorerBusiness AI — AI Business X-Ray

Analiza la URL de una empresa y genera un informe visual de oportunidades de IA y
automatización: Business Snapshot, AI Transformation Score, oportunidades, Automation
Map, competidores, recomendaciones de IA, matriz impacto/dificultad, roadmap,
calculadora de ROI y top 3. App para demo en vídeo, ejecutable en local.

## Stack (definitivo)

- **Next.js** (App Router) + **TypeScript** + **Tailwind CSS v4**. Sin base de datos.
- **Razón de Next.js:** para extraer datos reales de una URL hay que scrapear del lado
  servidor (el navegador lo bloquea por CORS). `src/app/api/analyze/route.ts` hace el fetch.
- **Librerías:** `cheerio` (parseo del HTML), `recharts` (gráficos), `@xyflow/react`
  (Automation Map), `lucide-react` (iconos).
- **IA (opcional):** capa multi-LLM sin SDK, con `fetch` a Anthropic y compatibles
  OpenAI. Sin clave, la app funciona igual con motor determinístico + modo demo. Las
  claves van en `.env` del servidor, nunca en el navegador.

**Señales para reevaluar:** si se pasa a producción con cuentas o claves compartidas,
hace falta auth y un límite de requests en la ruta de análisis.

## Estructura

```
src/app/            layout, página principal y api/analyze/route.ts
src/lib/            types, scraper, signal-engine, llm, prompt, demo
src/components/     ui/ (reutilizables), analyzer/, report/ (secciones), charts/
scripts/            verificar.ps1
```

## Convenciones

- Español, nombres de archivos y carpetas en minúsculas con guiones. Un archivo = una
  responsabilidad (~300 líneas).
- La respuesta de la IA se trata como dato sin confiar: se valida, se recorta y se le
  dan valores por defecto.
- Honestidad de datos: cada dato lleva procedencia `scraped` (detectado) / `inferred`
  (inferido) / `demo`. Nunca se inventa info presentándola como real. Los competidores
  solo aparecen si hay API de búsqueda; sin ella, "no disponible".
- Sin claves en el código: `.env` / `TU_CLAVE_ACA`. Claude no crea ni lee `.env`.
