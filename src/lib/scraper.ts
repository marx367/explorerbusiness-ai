// Extrae señales reales del HTML de una URL. Solo corre del lado servidor.
// No usa datos de usuario peligrosos ni evalúa código: solo parsea texto y atributos.

import * as cheerio from "cheerio";

export type FormularioDetectado = { campos: string[]; action: string };

export type ScrapedData = {
  ok: boolean;
  urlFinal: string;
  error?: string;
  titulo: string;
  metaDescription: string;
  ogSitio: string;
  ogTitulo: string;
  ogDescripcion: string;
  encabezados: string[];
  navegacion: string[];
  ctas: string[];
  formularios: FormularioDetectado[];
  telefonos: string[];
  emails: string[];
  whatsapp: boolean;
  redes: string[];
  reserva: { detectada: boolean; pistas: string[] };
  tecnologias: string[];
  enlacesInternos: number;
  blog: boolean;
  preciosVisibles: boolean;
};

const MAX_LEN = 300;
const HOSTS_INTERNOS =
  /(^|\.)(localhost|local|internal|lan|home\.arpa)$|^127\.|^10\.|^192\.168\.|^172\.(1[6-9]|2\d|3[01])\.|^0\.|^169\.254\.|^::1$|^\d+\.\d+\.\d+\.\d+$/i;

function normalizarUrl(raw: string): URL | null {
  let conProtocolo = raw.trim();
  if (!/^https?:\/\//i.test(conProtocolo)) conProtocolo = `https://${conProtocolo}`;
  try {
    const u = new URL(conProtocolo);
    if (u.protocol !== "http:" && u.protocol !== "https:") return null;
    if (HOSTS_INTERNOS.test(u.hostname)) return null;
    return u;
  } catch {
    return null;
  }
}

function limpiar(texto: string | null | undefined): string {
  return (texto ?? "").replace(/\s+/g, " ").trim().slice(0, MAX_LEN);
}

function unicar(lista: string[], max: number): string[] {
  return [...new Set(lista.map((s) => s.trim()).filter(Boolean))].slice(0, max);
}

export async function scrapear(rawUrl: string): Promise<ScrapedData> {
  const url = normalizarUrl(rawUrl);
  const vacio: ScrapedData = {
    ok: false,
    urlFinal: rawUrl,
    error: "URL no válida o apunta a una dirección interna.",
    titulo: "",
    metaDescription: "",
    ogSitio: "",
    ogTitulo: "",
    ogDescripcion: "",
    encabezados: [],
    navegacion: [],
    ctas: [],
    formularios: [],
    telefonos: [],
    emails: [],
    whatsapp: false,
    redes: [],
    reserva: { detectada: false, pistas: [] },
    tecnologias: [],
    enlacesInternos: 0,
    blog: false,
    preciosVisibles: false,
  };
  if (!url) return vacio;

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 12000);
  try {
    const res = await fetch(url.toString(), {
      signal: controller.signal,
      redirect: "follow",
      headers: {
        "user-agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124 Safari/537.36",
        accept: "text/html,application/xhtml+xml",
        "accept-language": "es,en;q=0.8",
      },
    });
    clearTimeout(timer);

    if (!res.ok) {
      return { ...vacio, urlFinal: url.toString(), error: `El sitio respondió ${res.status}.` };
    }
    const contentType = res.headers.get("content-type") ?? "";
    if (!contentType.includes("text/html")) {
      return { ...vacio, urlFinal: url.toString(), error: "La URL no devuelve una página HTML." };
    }

    const html = (await res.text()).slice(0, 1_200_000);
    const $ = cheerio.load(html);
    const base = url.origin;

    const titulo = limpiar($("title").first().text());
    const metaDescription = limpiar($('meta[name="description"]').attr("content"));
    const ogSitio = limpiar($('meta[property="og:site_name"]').attr("content"));
    const ogTitulo = limpiar($('meta[property="og:title"]').attr("content"));
    const ogDescripcion = limpiar($('meta[property="og:description"]').attr("content"));

    const encabezados = unicar(
      $("h1, h2").map((_, el) => $(el).text()).get(),
      12,
    );

    const navegacion = unicar(
      $("nav a, header a").map((_, el) => $(el).text()).get(),
      20,
    );

    const patronCta =
      /comprar|reservar|contactar|contacto|cotizar|presupuesto|empezar|empeza|prueba|gratis|demo|registr|más info|saber más|solicita|solicitar|get started|book|contact|buy|pricing|free|trial|sign up/i;
    const ctas = unicar(
      $("a, button")
        .map((_, el) => $(el).text())
        .get()
        .filter((t) => patronCta.test(t) && t.length <= 60),
      15,
    );

    const formularios = $("form")
      .map((_, el) => {
        const campos = unicar(
          $(el)
            .find("input, select, textarea")
            .map((__, f) => $(f).attr("name") || $(f).attr("type") || $(f).attr("placeholder"))
            .get(),
          8,
        );
        return { campos, action: limpiar($(el).attr("action")) };
      })
      .get()
      .slice(0, 5);

    const telefonos = unicar(
      $('a[href^="tel:"]').map((_, el) => $(el).attr("href")).get(),
      5,
    );
    const emails = unicar(
      $('a[href^="mailto:"]').map((_, el) => $(el).attr("href")).get(),
      5,
    );

    const todoTexto = limpiar($("body").text());
    const whatsapp =
      $('a[href*="wa.me"], a[href*="whatsapp"]').length > 0 || /whatsapp/i.test(todoTexto);

    const redes = unicar(
      $("a[href]")
        .map((_, el) => $(el).attr("href"))
        .get()
        .map((h) => {
          if (!h) return "";
          if (/facebook|instagram|linkedin|twitter\.com|x\.com|youtube|tiktok|pinterest/i.test(h)) {
            const m = h.match(/(facebook|instagram|linkedin|twitter|x\.com|youtube|tiktok|pinterest)/i);
            return m ? m[1].toLowerCase() : "";
          }
          return "";
        })
        .filter(Boolean),
      6,
    );

    const patronReserva = /calendly|acuity|setmore|fresha|bookings|booking|reserva|reservar|agenda|agendar|cita|appointment|schedule|book-online|reserve/i;
    const pistasReserva = unicar(
      $("a[href]")
        .map((_, el) => $(el).attr("href"))
        .get()
        .filter((h) => h && patronReserva.test(h))
        .concat($("a, button").map((_, el) => $(el).text()).get().filter((t) => patronReserva.test(t))),
      5,
    );

    const tecnologias = detectarTecnologias($, html);

    let enlacesInternos = 0;
    $("a[href]").each((_, el) => {
      const h = $(el).attr("href") ?? "";
      if (h.startsWith("/") || h.startsWith("#") || h.startsWith(base)) enlacesInternos++;
    });

    const blog =
      $('a[href*="/blog"], a[href*="/noticias"], a[href*="/news"], article').length > 0;

    const preciosVisibles = /€|\$|precio|precios|tarifa|tarifas|planes|pricing|desde\s*\d/i.test(todoTexto);

    return {
      ok: true,
      urlFinal: url.toString(),
      titulo,
      metaDescription,
      ogSitio,
      ogTitulo,
      ogDescripcion,
      encabezados,
      navegacion,
      ctas,
      formularios,
      telefonos,
      emails,
      whatsapp,
      redes,
      reserva: { detectada: pistasReserva.length > 0, pistas: pistasReserva },
      tecnologias,
      enlacesInternos,
      blog,
      preciosVisibles,
    };
  } catch (err) {
    clearTimeout(timer);
    const mensaje = err instanceof Error && err.name === "AbortError"
      ? "Se agotó el tiempo de espera al conectar con el sitio."
      : "No se pudo acceder al sitio (puede estar caído, bloquear bots o el dominio no existe).";
    return { ...vacio, urlFinal: url.toString(), error: mensaje };
  }
}

function detectarTecnologias($: cheerio.CheerioAPI, html: string): string[] {
  const found: string[] = [];
  const add = (nombre: string) => found.push(nombre);

  const generator = $('meta[name="generator"]').attr("content") ?? "";
  const srcs = $("script[src], link[href]")
    .map((_, el) => ($(el).attr("src") || $(el).attr("href") || "").toLowerCase())
    .get()
    .join(" ");

  if (/shopify|cdn\.shopify/i.test(generator + srcs + html)) add("Shopify");
  if (/woocommerce|wp-content/i.test(generator + srcs + html)) add("WooCommerce");
  if (/wordpress/i.test(generator + srcs + html)) add("WordPress");
  if (/wix\.com|wixstatic/i.test(generator + srcs + html)) add("Wix");
  if (/squarespace/i.test(srcs + html)) add("Squarespace");
  if (/webflow/i.test(srcs + html) || $("[data-wf-site]").length > 0) add("Webflow");
  if (/__next|_next\/static|\/_next\//i.test(html) || /\/_next\//i.test(srcs)) add("Next.js");
  if (/data-reactroot|__react|react\./i.test(html + srcs)) add("React");
  if (/ng-version|angular/i.test(html)) add("Angular");
  if (/data-v-[a-f0-9]/i.test(html)) add("Vue");
  if (/jquery/i.test(srcs)) add("jQuery");
  if (/googletagmanager|gtag|analytics\.js|google-analytics/i.test(srcs + html)) add("Google Analytics");
  if (/connect\.facebook\.net|fbq\(/i.test(srcs + html)) add("Meta Pixel");
  if (/hotjar/i.test(srcs + html)) add("Hotjar");
  if (/tawk\.to|crisp\.chat|intercom|zendesk|drift/i.test(srcs + html)) add("Chat en vivo");
  return found.slice(0, 10);
}
