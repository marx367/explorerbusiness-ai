// Motor determinístico: convierte señales scrapeadas en snapshot, puntuaciones y
// clasificación. Todo lo que no es texto literal del sitio se marca como "inferred".

import type { BusinessSnapshot, Fact, Scores } from "./types";
import type { ScrapedData } from "./scraper";

const SECTORES: [RegExp, string][] = [
  [/dental|dentist|odontolog|clínica dental|brackets|ortodoncia/i, "Salud dental"],
  [/clínica|clinica|salud|medical|doctor|medicina|fisioterapia|psicolog/i, "Salud y bienestar"],
  [/inmobiliaria|real estate|propiedades|alquiler|venta de pisos|realtor/i, "Inmobiliaria"],
  [/restaurante|restaurant|gastronom|catering|comida|food|delivery/i, "Gastronomía"],
  [/abogad|legal|law|bufete|jurídic|despacho/i, "Servicios legales"],
  [/tienda|shop|store|ecommerce|e-commerce|productos|online store/i, "E-commerce"],
  [/software|saas|app|plataforma|cloud|tech|startup|api/i, "Software / SaaS"],
  [/agencia|marketing|publicidad|diseño|design|seo|ads/i, "Agencia / Marketing"],
  [/educaci|academia|cursos|formación|training|colegio|escuela/i, "Educación"],
  [/gimnasio|fitness|entrenam|crossfit|yoga|personal trainer/i, "Fitness"],
  [/belleza|estética|estetica|peluquer|salón|spa|barber/i, "Belleza y estética"],
  [/construc|reformas|arquitect|obras|ingenier/i, "Construcción"],
  [/finanz|seguros|contab|asesoría|asesoria|inversi|banca/i, "Finanzas y asesoría"],
  [/automotriz|taller|coche|auto|mecánica|concesionar/i, "Automotriz"],
  [/hotel|alojamiento|hostal|airbnb|turismo|viajes|travel/i, "Turismo y hotelería"],
  [/logística|logistica|transporte|mudanza|envíos|paqueter/i, "Logística y transporte"],
];

export function clasificarSector(s: ScrapedData): string {
  const corpus = [s.titulo, s.metaDescription, s.ogDescripcion, ...s.encabezados, ...s.navegacion]
    .join(" ")
    .toLowerCase();
  for (const [patron, sector] of SECTORES) {
    if (patron.test(corpus)) return sector;
  }
  return "No identificado con seguridad";
}

function fact(texto: string, fuente: Fact["fuente"]): Fact {
  return { texto, fuente };
}

export function construirSnapshot(s: ScrapedData, sector: string): BusinessSnapshot {
  const empresa =
    s.ogSitio || s.ogTitulo || s.titulo.replace(/\s*[|—–-].*$/, "").trim() || "Empresa no identificada";

  const queVende =
    s.metaDescription ||
    s.ogDescripcion ||
    s.encabezados.slice(0, 3).join(". ") ||
    "Sin descripción disponible.";

  const clienteFuente: Fact["fuente"] = sector.startsWith("No identific") ? "inferred" : "inferred";
  const cliente = `Cliente objetivo típico del sector ${sector}.`;

  const modelo = [
    s.formularios.length > 0 ? "formulario de contacto" : null,
    s.whatsapp ? "WhatsApp" : null,
    s.reserva.detectada ? "reserva online" : null,
    s.ctas.length > 0 ? "llamadas a la acción" : null,
    s.telefonos.length || s.emails.length ? "teléfono/email" : null,
  ]
    .filter(Boolean)
    .join(" + ");
  const modeloCaptacion = modelo || "Sin canal de captación claro detectado.";

  const ctaPrincipal =
    s.ctas[0] ||
    (s.reserva.detectada ? "Reservar / agendar cita" : "No se detectó un CTA claro.");

  const nivelDigital =
    s.tecnologias.length >= 4 || (s.formularios.length > 0 && s.whatsapp && s.reserva.detectada)
      ? "Alto"
      : s.tecnologias.length >= 2 || s.formularios.length > 0 || s.whatsapp
        ? "Medio"
        : "Bajo";

  return {
    empresa: fact(empresa, "scraped"),
    sector: fact(sector, sector.startsWith("No identific") ? "inferred" : "inferred"),
    queVende: fact(queVende, "scraped"),
    clienteObjetivo: fact(cliente, clienteFuente),
    modeloCaptacion: fact(modeloCaptacion, "inferred"),
    ctaPrincipal: fact(ctaPrincipal, "scraped"),
    digitalizacion: fact(nivelDigital, "inferred"),
  };
}

function clamp(n: number, min = 3, max = 96): number {
  return Math.max(min, Math.min(max, Math.round(n)));
}

export function calcularScores(s: ScrapedData): Scores {
  const form = s.formularios.length > 0;
  const tel = s.telefonos.length > 0;
  const email = s.emails.length > 0;
  const reserva = s.reserva.detectada;
  const chat = s.tecnologias.some((t) => t === "Chat en vivo");
  const analytics = s.tecnologias.some((t) => t === "Google Analytics");
  const pixel = s.tecnologias.some((t) => t === "Meta Pixel");
  const cms = s.tecnologias.some((t) =>
    ["Shopify", "WooCommerce", "WordPress", "Wix", "Squarespace", "Webflow"].includes(t),
  );

  const captacion = clamp(
    (form ? 30 : 0) + (s.whatsapp ? 18 : 0) + (s.ctas.length >= 3 ? 14 : s.ctas.length ? 7 : 0) +
      (pixel || analytics ? 14 : 0) + (s.blog ? 8 : 0) + (reserva ? 10 : 0),
  );
  const ventas = clamp(
    (s.preciosVisibles ? 28 : 0) + (reserva ? 24 : 0) + (form ? 18 : 0) +
      (tel || email ? 14 : 0) + (chat ? 8 : 0),
  );
  const atencion = clamp(
    (chat ? 32 : 0) + (s.whatsapp ? 26 : 0) + (tel ? 18 : 0) + (email ? 14 : 0) +
      (s.redes.length >= 2 ? 6 : 0),
  );
  const automatizacion = clamp(
    (cms ? 22 : 0) + (reserva ? 22 : 0) + (chat ? 12 : 0) + (analytics ? 12 : 0) +
      (s.tecnologias.length >= 3 ? 10 : 4),
  );
  const ia = clamp(
    (chat ? 12 : 0) + (analytics ? 6 : 0) + 3,
    3,
    40,
  );
  const seguimiento = clamp(
    (form ? 20 : 0) + (analytics ? 22 : 0) + (pixel ? 20 : 0) + (s.whatsapp ? 16 : 0) +
      (chat ? 10 : 0),
  );
  const datos = clamp(
    (analytics ? 28 : 0) + (pixel ? 22 : 0) + (form ? 18 : 0) + (cms ? 14 : 0) +
      (s.tecnologias.length >= 3 ? 8 : 4),
  );

  const global = Math.round(
    captacion * 0.2 + ventas * 0.18 + atencion * 0.14 + automatizacion * 0.14 +
      ia * 0.1 + seguimiento * 0.14 + datos * 0.1,
  );

  return {
    global: clamp(global, 3, 96),
    captacion,
    ventas,
    atencion,
    automatizacion,
    ia,
    seguimiento,
    datos,
  };
}

export function construirResumen(s: ScrapedData, sector: string): string {
  const partes = [
    `Se analizó ${s.urlFinal}.`,
    s.titulo ? `Título detectado: "${s.titulo}".` : null,
    `Sector estimado: ${sector}.`,
    s.formularios.length > 0 ? `Tiene ${s.formularios.length} formulario(s) de captura.` : "No se detectó formulario de captura.",
    s.whatsapp ? "Usa WhatsApp como canal." : "No se detectó WhatsApp.",
    s.reserva.detectada ? "Ofrece reserva online." : "No se detectó sistema de reservas.",
  ];
  return partes.filter(Boolean).join(" ");
}
