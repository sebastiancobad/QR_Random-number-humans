import { DATOS } from "./datos_juego.js";

// ---------------------------------------------------------------------------
//  Rondas de la Junta de inversión. Caso de la columna de mosto de una
//  destilería de etanol del Valle del Cauca. Las cifras salen de las
//  correlaciones del apéndice A de Turton et al. (2018) con CEPCI 2023 = 797.9.
// ---------------------------------------------------------------------------
const D = DATOS;
const NB = "\u00A0";   // espacio no separable entre número y unidad
const NH = "\u2011";   // guion no separable en los rótulos de equipos

export const fmt = (x, dec = 0) => {
  if (x === null || x === undefined || Number.isNaN(x)) return "sin dato";
  const s = Math.abs(x).toFixed(dec).split(".");
  s[0] = s[0].length > 4 ? s[0].replace(/\B(?=(\d{3})+(?!\d))/g, " ") : s[0];
  return (x < 0 ? "−" : "") + s.join(".");
};

// Tipos de ronda
//   estimar  número libre, puntaje por error logarítmico
//   calcular número con fórmula dada, puntaje por error relativo
//   ordenar  lista que el grupo ordena tocando
//   opcion   selección única
//   junta    decisión de inversión con sorteo de mercado
export const RONDAS = [
  null,
  {
    n: 1, tipo: "estimar", corto: "Una bomba", icono: "gauge",
    titulo: "¿Cuánto cuesta esta bomba?",
    datos: [["gauge", `3.5${NB}kW`, "potencia al eje"], ["droplets", `25${NB}t/h`, "de mosto"], ["layers", "Inoxidable", "material"], ["clock", "2023", "año del costo"]],
    pregunta: `Costo de compra de una bomba, en USD`,
    unidad: "USD", correcta: D.r1, dec: 0,
    cadena: [`${fmt(D.cp01)} USD de 2001`, "× 2.28 acero inoxidable", "× 797.9/397 CEPCI", `${fmt(D.r1)} USD`],
    explicacion: "Turton da el costo base en hierro fundido. El material y el CEPCI lo llevan a 2023.",
  },
  {
    n: 2, tipo: "ordenar", corto: "Orden", icono: "arrow-down-up",
    titulo: "¿Qué equipo cuesta más instalado?",
    datos: [["layers", "Inoxidable", "material"], ["coins", "C_BM", "módulo desnudo"]],
    pregunta: "Toquen del más caro al más barato",
    items: [
      { id: "E-101", nombre: `E${NH}101 intercambiador`, det: "48.7 m²" },
      { id: "T-101", nombre: `T${NH}101 columna`, det: "1.3 m × 17.4 m, 24 platos" },
      { id: "E-102", nombre: `E${NH}102 rehervidor`, det: "marmita, 57.6 m²" },
      { id: "E-103", nombre: `E${NH}103 condensador`, det: "tubos fijos, 55.3 m²" },
    ],
    correcta: D.r2.orden, cbm: D.r2.cbm,
    explicacion: "El rehervidor de marmita cuesta más que la columna completa con sus platos.",
  },
  {
    n: 3, tipo: "calcular", corto: "CEPCI", icono: "clock",
    titulo: "Actualicen la cotización",
    datos: [["coins", `31${NB}000${NB}USD`, "cotización de 2018"], ["chart-column", "603.1", "CEPCI 2018"], ["chart-column", "797.9", "CEPCI 2023"]],
    formula: "C₂ = C₁ · I₂ / I₁",
    pregunta: "Costo del condensador en 2023, en USD",
    unidad: "USD", correcta: D.r3, dec: 0,
    cadena: [`31${NB}000 USD`, "× 797.9/603.1", `${fmt(D.r3)} USD`],
    explicacion: "El índice subió 32 % entre 2018 y 2023.",
  },
  {
    n: 4, tipo: "calcular", corto: "Seis décimos", icono: "layers",
    titulo: "Columna del doble de capacidad",
    datos: [["coins", `1.2${NB}M${NB}USD`, "columna de 1 t/h"], ["layers", `2${NB}t/h`, "columna nueva"]],
    formula: "C₂ = C₁ · (S₂ / S₁)⁰·⁶",
    pregunta: `Costo de la columna de 2${NB}t/h, en M${NB}USD`,
    unidad: "M USD", correcta: D.r4, dec: 3,
    cadena: [`1.2${NB}M${NB}USD`, "× 2⁰·⁶ = 1.516", `${fmt(D.r4, 3)}${NB}M${NB}USD`],
    explicacion: "El doble de capacidad cuesta 52 % más.",
  },
  {
    n: 5, tipo: "opcion", corto: "Material", icono: "flame", justificar: true,
    titulo: "¿Qué encarece más la columna?",
    datos: [["coins", `${fmt(D.r5cs, 3)}${NB}M${NB}USD`, "columna de acero al carbono"], ["gauge", `1${NB}barg`, "presión de diseño"]],
    pregunta: "Elijan un cambio y justifiquen",
    opciones: [
      { id: "material", txt: "Acero inoxidable" },
      { id: "volumen", txt: "Doble de volumen" },
      { id: "presion", txt: `Diseño a 5${NB}barg` },
      { id: "platos", txt: "30 platos" },
    ],
    correcta: "material",
    valores: D.r5, unidadValores: "M USD", decValores: 3,
    explicacion: "El factor de material multiplica el término B₂ del módulo desnudo.",
  },
  {
    n: 6, tipo: "opcion", corto: "OPEX", icono: "droplets",
    titulo: "¿Qué pesa más en el costo de operación?",
    datos: [["droplets", `16${NB}000${NB}t/año`, "etanol en el mosto"], ["flame", `5.13${NB}t/h`, "vapor"], ["coins", "5 %", "costos fijos del CAPEX"]],
    pregunta: "Elijan el rubro mayor del OPEX",
    opciones: [
      { id: "mosto", txt: "Mosto" },
      { id: "vapor", txt: "Vapor" },
      { id: "fijos", txt: "Costos fijos" },
      { id: "agua", txt: "Agua de enfriamiento" },
    ],
    correcta: "mosto",
    valores: D.r6, unidadValores: "%", decValores: 1,
    explicacion: "La materia prima define el costo de operación de esta unidad.",
  },
  {
    n: 7, tipo: "junta", corto: "La junta", icono: "landmark", justificar: true,
    titulo: "La junta decide",
    datos: [["wallet", `6${NB}M${NB}USD`, "presupuesto"], ["chart-column", "12 %", "tasa a 10 años"], ["factory", `4${NB}t/h`, "capacidad de la rectificadora"]],
    nota: "El ingenio tiene mosto para la columna grande. En el escenario bajo el mercado compra solo 2 t/h de etanol.",
    pregunta: "Elijan una alternativa y justifiquen con el VPN y el riesgo",
    proyectos: D.proy, escenarios: D.esc, vpn: D.vpn, ev: D.ev,
    explicacion: `La columna de 4 t/h tiene el VPN esperado más alto, ${fmt(D.ev.C, 2)}${NB}M${NB}USD, y en el escenario bajo pierde ${fmt(-D.vpn.bajo.C, 2)}${NB}M${NB}USD.`,
  },
];
export const N_RONDAS = 7;

// Tarjetas de datos con icono, para el celular y el tablero.
export function datosHTML(R, iconos) {
  return `<div class="datos">${(R.datos || []).map(([ico, v, et]) => `<div class="dato"><span class="ico">${iconos[ico] || ""}</span><span class="v">${v.replace("C_BM", "C<sub>BM</sub>")}</span><span class="et">${et}</span></div>`).join("")}</div>`;
}
export function cadenaHTML(R) {
  if (!R.cadena) return "";
  return `<div class="cadena">${R.cadena.map((c, k) => `<span class="esl ${k === R.cadena.length - 1 ? "fin" : ""}">${c}</span>`).join('<span class="fl">→</span>')}</div>`;
}

// ---------------------------------------------------------------- puntajes
export function puntaje(n, v, mercado) {
  const R = RONDAS[n];
  if (!R || v === undefined || v === null || v === "") return null;
  if (R.tipo === "estimar") {
    const x = Number(v); if (!(x > 0)) return 0;
    return Math.round(100 * Math.max(0, 1 - Math.abs(Math.log10(x / R.correcta))));
  }
  if (R.tipo === "calcular") {
    const x = Number(v); if (!Number.isFinite(x)) return 0;
    const e = Math.abs(x - R.correcta) / R.correcta;
    return e <= 0.02 ? 100 : e <= 0.10 ? 70 : e <= 0.25 ? 30 : 0;
  }
  if (R.tipo === "ordenar") {
    const o = String(v).split(","); if (o.length !== R.correcta.length) return 0;
    let dist = 0; R.correcta.forEach((id, i) => { dist += Math.abs(o.indexOf(id) - i); });
    return Math.round(100 * (1 - dist / 8));
  }
  if (R.tipo === "opcion") return v === R.correcta ? 100 : 0;
  if (R.tipo === "junta") {
    if (!mercado) return null;
    const vpn = R.vpn[mercado][v]; if (vpn === undefined) return 0;
    return Math.max(0, Math.min(100, Math.round(50 + 3 * vpn)));
  }
  return 0;
}

// Tabla de puntajes de todos los grupos hasta la ronda indicada (solo rondas reveladas cuentan).
export function tabla(estado, hasta) {
  const filas = Object.entries(estado.g || {}).filter(([, gr]) => gr && gr.nombre).map(([id, gr]) => {
    const pts = []; let total = 0;
    for (let n = 1; n <= N_RONDAS; n++) {
      const resp = gr.r && gr.r[n];
      const p = n <= hasta && resp ? puntaje(n, resp.v, estado.mercado) : null;
      pts[n] = p; total += p || 0;
    }
    return { id, nombre: gr.nombre || "Grupo", pts, total };
  });
  filas.sort((a, b) => b.total - a.total || a.nombre.localeCompare(b.nombre, "es", { numeric: true }));
  return filas;
}

// Ronda que ya cuenta en el puntaje acumulado.
export function rondaContable(estado) {
  if (estado.ronda >= 8) return N_RONDAS;
  return estado.fase === "revelada" ? estado.ronda : estado.ronda - 1;
}

// Sorteo del mercado con las probabilidades del enunciado.
export function sortearMercado() {
  const u = Math.random(); let acc = 0;
  for (const e of D.esc) { acc += e.prob; if (u <= acc) return e.id; }
  return D.esc[D.esc.length - 1].id;
}
