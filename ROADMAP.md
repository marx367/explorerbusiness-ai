# ROADMAP — ExplorerBusiness AI (AI Business X-Ray)

> Última actualización: 2026-10-25 · Stack y estructura: ver `CLAUDE.md`

## Resumen

App que analiza la URL de una empresa y muestra oportunidades de IA y automatización en un informe visual.

## Estados

`⬜ pendiente` · `🔄 en curso` · `✅ hecho` · `⏸️ en pausa` · `❌ descartado`

## Ahora

- **Fase en curso:** Fase 1 — Aplicación funcional (🔄)
- **Siguiente prioridad:** terminar las 10 secciones del informe y verificar build + responsive.
- **Bloqueos / dudas:** ninguno.

## Fases

### 🔄 Fase 1: Aplicación funcional _(fecha objetivo: 2026-10-25)_
**Listo cuando:** arranca en local, analiza una URL real (scrape) y el botón DEMO muestra el informe completo.
- [ ] Scaffold Next.js + dependencias
- [ ] Motor de análisis (scrape + scoring + demo)
- [ ] Overlay de 8 fases
- [ ] Secciones del informe (snapshot, score, oportunidades, automation map, competidores, AI, matriz, roadmap, ROI, top 3)
- [ ] Verificar build + lint + responsive

### ⬜ Fase 2: IA real opcional
**Listo cuando:** con clave en `.env`, el análisis se enriquece con un LLM.
- [ ] Capa multi-LLM y prompt validado
- [ ] Búsqueda de competidores con clave de búsqueda

## Fuera de alcance / ideas para después

- Cuentas de usuario y guardado de informes.
- Exportar informe a PDF.
- Cola / rate-limit en la ruta de análisis.

## Completados

- [x] Scaffold Next.js + git init — 2026-10-25

## Cómo se mantiene

1. Al cerrar una tarea: marcarla `[x]`, moverla a "Completados" con fecha y actualizar "Ahora".
2. Al cerrar una fase: pasarla a ✅ y marcar la siguiente con 🔄.
3. Una idea nueva entra en "Fuera de alcance"; pasa a una fase solo si la persona lo decide.
4. Cambios en este archivo: solo con el OK de la persona.
