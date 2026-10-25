// Modelo de datos compartido entre el servidor (análisis) y el cliente (informe).

export type Source = "scraped" | "inferred" | "demo";

/** Un dato con su procedencia: real (scraped), inferido o de ejemplo. */
export type Fact = { texto: string; fuente: Source };

export type Categoria =
  | "Captación"
  | "Ventas"
  | "Marketing"
  | "Atención al cliente"
  | "Operaciones"
  | "Administración"
  | "Datos"
  | "IA";

export type Nivel = "ALTO" | "MEDIO" | "BAJO";
export type Complejidad = "ALTA" | "MEDIA" | "BAJA";

export type Scores = {
  global: number;
  captacion: number;
  ventas: number;
  atencion: number;
  automatizacion: number;
  ia: number;
  seguimiento: number;
  datos: number;
};

export type BusinessSnapshot = {
  empresa: Fact;
  sector: Fact;
  queVende: Fact;
  clienteObjetivo: Fact;
  modeloCaptacion: Fact;
  ctaPrincipal: Fact;
  digitalizacion: Fact;
};

export type Oportunidad = {
  id: string;
  categoria: Categoria;
  titulo: string;
  problema: string;
  solucion: string;
  flujo: string[];
  impacto: Nivel;
  complejidad: Complejidad;
  prioridad: number;
  fuente: Source;
};

export type NodoFlujo = {
  id: string;
  etiqueta: string;
  tipo: "fuente" | "captura" | "dato" | "ia" | "canal" | "accion" | "equipo";
};

export type AutomationMap = {
  nodos: NodoFlujo[];
  conexiones: { de: string; a: string; etiqueta?: string }[];
};

export type Competidor = {
  nombre: string;
  web: string;
  propuesta: string;
  fortalezas: string[];
  elementosInteresantes: string[];
  oportunidadesAdoptables: string[];
};

export type CompetitiveGap = {
  disponible: boolean;
  puntos: string[];
};

export type AIOportunidad = {
  titulo: string;
  descripcion: string;
  categoria: Categoria;
  impacto: Nivel;
  dificultad: Complejidad;
};

export type Cuadrante = "quick-wins" | "strategic" | "nice-to-have" | "avoid";

export type ItemMatriz = {
  titulo: string;
  impacto: number; // 0-100
  dificultad: number; // 0-100
  cuadrante: Cuadrante;
};

export type FaseRoadmap = {
  nombre: string;
  rango: string;
  items: string[];
};

export type FaseAnalisis = {
  nombre: string;
  detalle: string;
};

export type AnalysisResult = {
  modo: "demo" | "real";
  url: string;
  empresa: string;
  sector: string;
  resumen: string;
  snapshot: BusinessSnapshot;
  scores: Scores;
  oportunidades: Oportunidad[];
  automationMap: AutomationMap;
  competidores: Competidor[];
  competitiveGap: CompetitiveGap;
  aiOportunidades: AIOportunidad[];
  matriz: ItemMatriz[];
  roadmap: FaseRoadmap[];
  top3: { titulo: string; motivo: string }[];
  fases: FaseAnalisis[];
  avisos: string[];
};
