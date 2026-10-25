// Recomendaciones determinísticas a partir de las señales detectadas. Cada una
// referencia el hallazgo real (o su ausencia) y se marca como "inferred".

import type {
  AIOportunidad,
  AutomationMap,
  Categoria,
  Complejidad,
  Cuadrante,
  FaseRoadmap,
  ItemMatriz,
  Nivel,
  Oportunidad,
} from "./types";
import type { ScrapedData } from "./scraper";

const nivelValor = (n: Nivel | Complejidad) =>
  n === "ALTO" || n === "ALTA" ? 80 : n === "MEDIO" || n === "MEDIA" ? 55 : 30;

export function generarOportunidades(s: ScrapedData): Oportunidad[] {
  const ops: Omit<Oportunidad, "id" | "fuente" | "prioridad">[] = [];
  const form = s.formularios.length > 0;
  const chat = s.tecnologias.includes("Chat en vivo");
  const analytics = s.tecnologias.includes("Google Analytics");

  if (form) {
    ops.push({
      categoria: "Captación",
      titulo: "Seguimiento automático de leads",
      problema: `Hay ${s.formularios.length} formulario(s) de contacto, pero no se detecta un sistema de seguimiento inmediato.`,
      solucion: "Automatizar la respuesta y el enrutado del lead por WhatsApp o email al instante.",
      flujo: ["Lead", "CRM", "IA", "WhatsApp", "Cualificación", "Comercial"],
      impacto: "ALTO",
      complejidad: "MEDIA",
    });
  } else {
    ops.push({
      categoria: "Captación",
      titulo: "Captación de leads sin formulario",
      problema: "No se detectó ningún formulario de contacto ni captura de leads en la web.",
      solucion: "Añadir formularios estratégicos conectados a un CRM.",
      flujo: ["Tráfico", "Landing", "Formulario", "CRM"],
      impacto: "ALTO",
      complejidad: "MEDIA",
    });
  }

  ops.push(
    s.whatsapp
      ? {
          categoria: "Atención al cliente" as Categoria,
          titulo: "Agente IA de WhatsApp",
          problema: "Hay WhatsApp, pero las respuestas probablemente dependen de una persona disponible.",
          solucion: "Agente IA que responde consultas frecuentes y deriva lo complejo a una persona.",
          flujo: ["Cliente", "WhatsApp", "Agente IA", "Humano"],
          impacto: "ALTO",
          complejidad: "MEDIA",
        }
      : {
          categoria: "Atención al cliente" as Categoria,
          titulo: "Canal de WhatsApp",
          problema: "No se detectó WhatsApp; se pierde un canal con alta tasa de respuesta.",
          solucion: "Activar WhatsApp Business con respuestas automáticas.",
          flujo: ["Cliente", "WhatsApp", "Agente IA", "Comercial"],
          impacto: "ALTO",
          complejidad: "BAJA",
        },
  );

  if (!s.reserva.detectada) {
    ops.push({
      categoria: "Ventas",
      titulo: "Reserva / cita online",
      problema: "No se detectó sistema de reserva online en la web.",
      solucion: "Implementar reserva online con recordatorios automáticos.",
      flujo: ["Cliente", "Calendario", "Reserva", "Recordatorio", "Comercial"],
      impacto: "ALTO",
      complejidad: "MEDIA",
    });
  }

  if (!chat) {
    ops.push({
      categoria: "Atención al cliente",
      titulo: "Atención 24/7 con agente IA",
      problema: "No hay chat en vivo ni atención automatizada fuera de horario.",
      solucion: "Agente de atención que responde preguntas frecuentes en cualquier momento.",
      flujo: ["Visita", "Chat", "Agente IA", "Resolución"],
      impacto: "MEDIO",
      complejidad: "MEDIA",
    });
  }

  if (!analytics) {
    ops.push({
      categoria: "Datos",
      titulo: "Medición y analítica",
      problema: "No se detectó analítica web (Google Analytics).",
      solucion: "Instalar medición para decidir con datos y no a ciegas.",
      flujo: ["Visita", "Evento", "Analítica", "Dashboard"],
      impacto: "MEDIO",
      complejidad: "BAJA",
    });
  }

  if (!s.blog) {
    ops.push({
      categoria: "Marketing",
      titulo: "Contenido y SEO",
      problema: "No se detectó blog ni sección de contenido.",
      solucion: "Generar contenido con IA para atraer tráfico orgánico.",
      flujo: ["IA", "Contenido", "Publicación", "SEO", "Tráfico"],
      impacto: "MEDIO",
      complejidad: "BAJA",
    });
  }

  if (!s.preciosVisibles) {
    ops.push({
      categoria: "Ventas",
      titulo: "Transparencia de precios",
      problema: "No se detectaron precios ni planes visibles.",
      solucion: "Mostrar precios/planes para calificar mejor al lead antes del contacto.",
      flujo: ["Landing", "Precios", "Lead calificado", "Comercial"],
      impacto: "MEDIO",
      complejidad: "BAJA",
    });
  }

  ops.push(
    {
      categoria: "Marketing",
      titulo: "Reseñas automáticas",
      problema: "La reputación depende de la memoria del cliente para dejar reseña.",
      solucion: "Solicitar reseñas automáticamente tras cada compra o servicio.",
      flujo: ["Venta", "Email/WhatsApp", "Reseña", "Reputación"],
      impacto: "MEDIO",
      complejidad: "BAJA",
    },
    {
      categoria: "Ventas",
      titulo: "Recuperación de leads",
      problema: "Los leads que no cierran en el primer contacto suelen perderse.",
      solucion: "Secuencias automáticas de recuperación por email o WhatsApp.",
      flujo: ["Lead frío", "Secuencia", "IA", "Re-engagement"],
      impacto: "MEDIO",
      complejidad: "BAJA",
    },
  );

  return ops
    .slice(0, 8)
    .map((o, i) => ({ ...o, id: `op-${i}`, fuente: "inferred" as const, prioridad: i + 1 }));
}

export function generarAIOportunidades(s: ScrapedData): AIOportunidad[] {
  const chat = s.tecnologias.includes("Chat en vivo");
  const catalogo: AIOportunidad[] = [
    {
      titulo: "Agente de atención al cliente",
      descripcion: chat
        ? "Mejorar el chat actual con un agente IA que resuelva sin esperas."
        : "Atender consultas 24/7 con un agente IA en el sitio.",
      categoria: "Atención al cliente",
      impacto: "ALTO",
      dificultad: "MEDIA",
    },
    {
      titulo: "Agente de WhatsApp",
      descripcion: s.whatsapp
        ? "Automatizar respuestas y cualificación por WhatsApp."
        : "Incorporar WhatsApp con un agente que responda al instante.",
      categoria: "Atención al cliente",
      impacto: "ALTO",
      dificultad: "MEDIA",
    },
    {
      titulo: "Clasificación automática de leads",
      descripcion: "Puntuar y priorizar leads según su probabilidad de compra.",
      categoria: "Ventas",
      impacto: "ALTO",
      dificultad: "MEDIA",
    },
    {
      titulo: "Seguimiento comercial",
      descripcion: "Secuencias automáticas que no dejen caer ningún lead.",
      categoria: "Ventas",
      impacto: "ALTO",
      dificultad: "MEDIA",
    },
    {
      titulo: "Generación de propuestas",
      descripcion: "Borradores de propuestas y presupuestos generados por IA.",
      categoria: "Ventas",
      impacto: "MEDIO",
      dificultad: "MEDIA",
    },
    {
      titulo: "Clasificación de emails",
      descripcion: "Etiquetar y priorizar la bandeja de entrada automáticamente.",
      categoria: "Administración",
      impacto: "MEDIO",
      dificultad: "BAJA",
    },
    {
      titulo: "Generación de contenido",
      descripcion: "Artículos y publicaciones para atraer tráfico orgánico.",
      categoria: "Marketing",
      impacto: "MEDIO",
      dificultad: "BAJA",
    },
    {
      titulo: "Análisis de llamadas",
      descripcion: "Transcribir y resumir llamadas para detectar objeciones.",
      categoria: "Datos",
      impacto: "MEDIO",
      dificultad: "ALTA",
    },
    {
      titulo: "Extracción automática de información",
      descripcion: "Convertir documentos y correos en datos estructurados.",
      categoria: "Operaciones",
      impacto: "MEDIO",
      dificultad: "MEDIA",
    },
    {
      titulo: "Dashboards de gestión",
      descripcion: "Métricas del negocio en un panel actualizado solo.",
      categoria: "Datos",
      impacto: "MEDIO",
      dificultad: "MEDIA",
    },
    {
      titulo: "Automatización administrativa",
      descripcion: "Tareas repetitivas (facturas, recordatorios, informes) en piloto automático.",
      categoria: "Administración",
      impacto: "MEDIO",
      dificultad: "BAJA",
    },
    {
      titulo: "Sistema de reservas",
      descripcion: s.reserva.detectada
        ? "Potenciar la reserva actual con confirmaciones automáticas."
        : "Reserva online con confirmación y recordatorio automáticos.",
      categoria: "Operaciones",
      impacto: "ALTO",
      dificultad: "MEDIA",
    },
    {
      titulo: "Recuperación de leads",
      descripcion: "Reactivar leads fríos con mensajes automáticos.",
      categoria: "Ventas",
      impacto: "MEDIO",
      dificultad: "BAJA",
    },
    {
      titulo: "Solicitud automática de reseñas",
      descripcion: "Pedir reseñas tras cada servicio y responder a ellas.",
      categoria: "Marketing",
      impacto: "MEDIO",
      dificultad: "BAJA",
    },
  ];
  return catalogo.slice(0, 12);
}

export function generarAutomationMap(): AutomationMap {
  return {
    nodos: [
      { id: "trafico", etiqueta: "Google Ads / SEO", tipo: "fuente" },
      { id: "landing", etiqueta: "Landing Page", tipo: "captura" },
      { id: "lead", etiqueta: "Lead", tipo: "dato" },
      { id: "crm", etiqueta: "CRM", tipo: "dato" },
      { id: "agente", etiqueta: "Agente IA", tipo: "ia" },
      { id: "canal", etiqueta: "WhatsApp / Email", tipo: "canal" },
      { id: "cualificacion", etiqueta: "Cualificación", tipo: "accion" },
      { id: "reserva", etiqueta: "Reserva / Cita", tipo: "accion" },
      { id: "comercial", etiqueta: "Comercial", tipo: "equipo" },
      { id: "seguimiento", etiqueta: "Seguimiento automático", tipo: "accion" },
    ],
    conexiones: [
      { de: "trafico", a: "landing" },
      { de: "landing", a: "lead" },
      { de: "lead", a: "crm" },
      { de: "crm", a: "agente" },
      { de: "agente", a: "canal" },
      { de: "canal", a: "cualificacion" },
      { de: "cualificacion", a: "reserva" },
      { de: "reserva", a: "comercial" },
      { de: "comercial", a: "seguimiento" },
    ],
  };
}

export function generarMatriz(
  oportunidades: Oportunidad[],
  ai: AIOportunidad[],
): ItemMatriz[] {
  const items = [
    ...oportunidades.map((o) => ({
      titulo: o.titulo,
      impacto: nivelValor(o.impacto),
      dificultad: nivelValor(o.complejidad),
    })),
    ...ai.map((a) => ({
      titulo: a.titulo,
      impacto: nivelValor(a.impacto),
      dificultad: nivelValor(a.dificultad),
    })),
  ];

  return items.map((i) => {
    const cuadrante: Cuadrante =
      i.impacto >= 55 && i.dificultad <= 55
        ? "quick-wins"
        : i.impacto >= 55
          ? "strategic"
          : i.dificultad <= 55
            ? "nice-to-have"
            : "avoid";
    return { ...i, cuadrante };
  });
}

export function generarRoadmap(matriz: ItemMatriz[]): FaseRoadmap[] {
  const titulos = (c: Cuadrante) => matriz.filter((m) => m.cuadrante === c).map((m) => m.titulo);
  const quick = titulos("quick-wins");
  const strategic = titulos("strategic");
  const nice = titulos("nice-to-have");

  return [
    {
      nombre: "Fase 1 — 0-30 días",
      rango: "Implementaciones rápidas",
      items: quick.slice(0, 4),
    },
    {
      nombre: "Fase 2 — 30-60 días",
      rango: "Automatizaciones intermedias",
      items: strategic.slice(0, 4),
    },
    {
      nombre: "Fase 3 — 60-90 días",
      rango: "Sistemas avanzados",
      items: nice.slice(0, 4),
    },
  ];
}

export function generarTop3(
  oportunidades: Oportunidad[],
  ai: AIOportunidad[],
): { titulo: string; motivo: string }[] {
  const todas = [
    ...oportunidades.map((o) => ({
      titulo: o.titulo,
      impacto: nivelValor(o.impacto),
      dificultad: nivelValor(o.complejidad),
    })),
    ...ai.map((a) => ({
      titulo: a.titulo,
      impacto: nivelValor(a.impacto),
      dificultad: nivelValor(a.dificultad),
    })),
  ];

  const ordenadas = [...todas].sort(
    (a, b) => b.impacto - b.dificultad - (a.impacto - a.dificultad),
  );

  return ordenadas.slice(0, 3).map((o) => ({
    titulo: o.titulo,
    motivo:
      o.dificultad <= 55
        ? "Mejor relación impacto/esfuerzo: rápido de implementar y con resultado visible."
        : "Alto impacto, aunque requiere más trabajo; vale la pena empezar acá.",
  }));
}
