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
//   ordenar  lista que el estudiante ordena tocando
//   opcion   selección única
//   junta    decisión de inversión con sorteo de mercado
export const RONDAS = [
  null,
  {
    n: 1, tipo: "calcular", corto: "Balance", icono: "droplets",
    titulo: "¿Cuánto vale el etanol que se pierde en la vinaza?",
    datos: [["droplets", `25${NB}000${NB}kg/h`, "mosto, corriente 1, 8 % en masa de etanol"], ["flame", `3483${NB}kg/h`, "flema, corriente 7, 57.16 % en masa de etanol"],
            ["coins", `0.60${NB}USD/kg`, "etanol en el mosto"], ["clock", `8000${NB}h/año`, "operación"]],
    formula: "Pérdida = (ṁ₁·w₁ − ṁ₇·w₇) · horas · precio",
    pregunta: "Costo del etanol que sale en la vinaza, corriente 6, en USD/año",
    unidad: "USD/año", correcta: D.perdida, dec: 0,
    cadena: [`2000 − 3483 × 0.5716 = ${fmt(D.etoh_vinaza, 1)}${NB}kg/h`, `× 8000${NB}h/año × 0.60${NB}USD/kg`, `${fmt(D.perdida)}${NB}USD/año`],
    explicacion: "El balance de etanol del PFD fija la recuperación de 99.5 % y el valor del producto que la columna deja ir con la vinaza.",
  },
  {
    n: 2, tipo: "calcular", corto: "Costo base", icono: "gauge",
    titulo: "Costo base de la bomba P-101",
    datos: [["gauge", `3.5${NB}kW`, "potencia al eje, A"], ["coins", "3.3892", "K₁"], ["coins", "0.0536", "K₂"], ["coins", "0.1538", "K₃"]],
    formula: "log₁₀ Cp⁰ = K₁ + K₂ log₁₀ A + K₃ (log₁₀ A)²",
    pregunta: "Costo de compra base de la bomba, en USD de 2001",
    unidad: "USD", correcta: D.cp01, dec: 0,
    cadena: ["log₁₀ 3.5 = 0.5441", "log₁₀ Cp⁰ = 3.4639", `${fmt(D.cp01)}${NB}USD de 2001`],
    explicacion: "La correlación de Turton da el costo de una bomba centrífuga de hierro fundido a presión ambiente.",
  },
  {
    n: 3, tipo: "calcular", corto: "CEPCI", icono: "clock",
    titulo: "Actualice la cotización",
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
    datos: [["coins", `${fmt(D.r5cs, 3)}${NB}M${NB}USD`, "columna de acero al carbono"], ["gauge", `1${NB}barg`, "presión de diseño, FP = 1"],
            ["layers", "3.11", "FM del acero inoxidable"], ["coins", "2.25 y 1.82", "B₁ y B₂ del recipiente"]],
    formula: "CBM = Cp⁰ · (B₁ + B₂ · FM · FP)",
    pregunta: "Elija un cambio y justifique",
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
    datos: [["droplets", `2000${NB}kg/h`, "etanol en el mosto a 0.60 USD/kg"], ["flame", `5.13${NB}t/h`, "vapor a 9.45 USD/t"],
            ["coins", `3.19${NB}M${NB}USD`, "CAPEX, costos fijos de 5 %"], ["clock", `8000${NB}h/año`, "operación"]],
    formula: "OPEX = C_RM + C_UT + C_F",
    pregunta: "Elija el rubro mayor del OPEX",
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
    pregunta: "Elija una alternativa y justifique con el VPN y el riesgo",
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

// Tabla de puntajes de todos los participantes hasta la ronda indicada (solo rondas reveladas cuentan).
export function tabla(estado, hasta) {
  const filas = Object.entries(estado.g || {}).filter(([, gr]) => gr && gr.nombre).map(([id, gr]) => {
    const pts = []; let total = 0;
    for (let n = 1; n <= N_RONDAS; n++) {
      const resp = gr.r && gr.r[n];
      const p = n <= hasta && resp ? puntaje(n, resp.v, estado.mercado) : null;
      pts[n] = p; total += p || 0;
    }
    return { id, nombre: gr.nombre || "Participante", pts, total };
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
