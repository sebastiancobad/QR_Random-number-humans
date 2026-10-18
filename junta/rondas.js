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
    titulo: "¿Cuánto cuesta una bomba?",
    contexto: `La columna de mosto recibe 25 t/h de mosto con 8 % en masa de etanol. La bomba P${NH}101 es centrífuga, de acero inoxidable, con 3.5${NB}kW de potencia al eje.`,
    pregunta: `Estimen el costo de compra de una bomba P${NH}101 en dólares de 2023.`,
    unidad: "USD", correcta: D.r1, dec: 0,
    explicacion: `La correlación de Turton da un costo base de ${fmt(D.cp01)} USD de 2001 para una bomba de hierro fundido de 3.5 kW. Con el factor de material de 2.28 del acero inoxidable y la razón de índices CEPCI (índice de costos de plantas de ingeniería química) de 797.9/397, el costo de compra vale ${fmt(D.r1)} USD.`,
  },
  {
    n: 2, tipo: "ordenar", corto: "Orden", icono: "arrow-down-up",
    titulo: "¿Qué equipo cuesta más instalado?",
    contexto: "La unidad tiene cuatro equipos principales de acero inoxidable, salvo la carcasa del condensador.",
    pregunta: "Toquen los equipos en orden, del mayor al menor costo de módulo desnudo.",
    items: [
      { id: "E-101", nombre: `E${NH}101 · intercambiador mosto y vinaza`, det: "cabezal flotante, 48.7 m²" },
      { id: "T-101", nombre: `T${NH}101 · columna de mosto`, det: "1.3 m de diámetro, 17.4 m de altura y 24 platos" },
      { id: "E-102", nombre: `E${NH}102 · rehervidor de marmita`, det: "57.6 m², con vapor de baja presión" },
      { id: "E-103", nombre: `E${NH}103 · condensador`, det: "tubos fijos, 55.3 m²" },
    ],
    correcta: D.r2.orden, cbm: D.r2.cbm,
    explicacion: `El rehervidor de marmita vale ${fmt(D.r2.cbm["E-102"], 3)} M USD instalado y supera a la columna completa, de ${fmt(D.r2.cbm["T-101"], 3)} M USD. La marmita es la correlación más costosa por metro cuadrado entre los intercambiadores de carcasa y tubos de la tabla A.1, porque su carcasa sobredimensionada deja espacio para separar el vapor, y el acero inoxidable lleva su factor de módulo desnudo a 6.16.`,
  },
  {
    n: 3, tipo: "calcular", corto: "CEPCI", icono: "clock",
    titulo: "De una cotización vieja a hoy",
    contexto: `Un proveedor cotizó en 2018 un condensador igual a E${NH}103 en 31${NB}000 USD. El CEPCI (índice de costos de plantas de ingeniería química) de 2018 vale 603.1 y el de 2023 vale 797.9.`,
    formula: "C₂ = C₁ · I₂ / I₁",
    pregunta: "Calculen el costo del condensador en dólares de 2023.",
    unidad: "USD", correcta: D.r3, dec: 0,
    explicacion: `C₂ = 31 000 × 797.9 / 603.1 = ${fmt(D.r3)} USD. El índice subió 32 % entre 2018 y 2023.`,
  },
  {
    n: 4, tipo: "calcular", corto: "Seis décimos", icono: "layers",
    titulo: "Una destilería del doble de tamaño",
    contexto: `Una destilería construyó en 2023 una columna de mosto para 1.0${NB}t/h de etanol con un costo instalado de 1.2 millones de dólares (M${NB}USD).`,
    formula: "C₂ = C₁ · (S₂ / S₁)⁰·⁶",
    pregunta: `Calculen con la regla de los seis décimos el costo de una columna para 2.0${NB}t/h de etanol, en M${NB}USD.`,
    unidad: "M USD", correcta: D.r4, dec: 3,
    explicacion: `C₂ = 1.2 × 2^0.6 = ${fmt(D.r4, 3)} M USD. El doble de capacidad cuesta 52 % más, y esa economía de escala favorece las plantas grandes.`,
  },
  {
    n: 5, tipo: "opcion", corto: "Material", icono: "flame", justificar: true,
    titulo: "¿Qué encarece más la columna?",
    contexto: `La columna T${NH}101 en acero al carbono, con 24 platos perforados de acero inoxidable y presión de diseño de 1.0${NB}barg (bar manométricos), vale ${fmt(D.r5cs, 3)}${NB}M${NB}USD de módulo desnudo.`,
    pregunta: "Elijan el cambio que más aumenta ese costo y justifiquen la elección.",
    opciones: [
      { id: "material", txt: "Carcasa de acero inoxidable, con factor de material 3.11" },
      { id: "volumen", txt: "Carcasa con el doble de volumen" },
      { id: "presion", txt: `Presión de diseño de 5${NB}barg` },
      { id: "platos", txt: "30 platos y 25 % más de altura" },
    ],
    correcta: "material",
    valores: D.r5, unidadValores: "M USD adicionales",
    explicacion: `El acero inoxidable suma ${fmt(D.r5.material, 3)} M USD, el doble de volumen ${fmt(D.r5.volumen, 3)} M USD, los 30 platos ${fmt(D.r5.platos, 3)} M USD y los 5 barg ${fmt(D.r5.presion, 3)} M USD. El factor de material multiplica todo el término B₂ del módulo desnudo, y el costo crece con el volumen elevado a un exponente local cercano a 0.8.`,
  },
  {
    n: 6, tipo: "opcion", corto: "OPEX", icono: "droplets",
    titulo: "¿Qué pesa más en el costo de operación?",
    contexto: `La unidad opera 8000${NB}h al año. Compra el mosto a 0.60${NB}USD por kg de etanol contenido, usa 6.13${NB}t/h de vapor de baja presión y 214${NB}m³/h de agua de enfriamiento, y sus costos fijos valen 5 % del CAPEX (inversión de capital).`,
    pregunta: "Elijan el rubro que más pesa en el OPEX (costo anual de operación).",
    opciones: [
      { id: "mosto", txt: "Mosto" },
      { id: "vapor", txt: "Vapor de baja presión" },
      { id: "fijos", txt: "Costos fijos" },
      { id: "agua", txt: "Agua de enfriamiento" },
    ],
    correcta: "mosto",
    valores: D.r6, unidadValores: "% del OPEX",
    explicacion: `El mosto representa ${fmt(D.r6.mosto, 1)} % del OPEX, el vapor ${fmt(D.r6.vapor, 1)} %, los costos fijos ${fmt(D.r6.fijos, 1)} % y el agua de enfriamiento ${fmt(D.r6.agua, 1)} %, porque la unidad compra 16${NB}000 t/año de etanol contenido en el mosto a 0.60${NB}USD/kg.`,
  },
  {
    n: 7, tipo: "junta", corto: "La junta", icono: "landmark", justificar: true,
    titulo: "La junta decide",
    contexto: `La junta del ingenio tiene 6${NB}M${NB}USD para invertir y evalúa cuatro alternativas con el valor presente neto (VPN) a 10 años y 12 % de tasa de descuento. El ingenio tiene fermentación para 50${NB}t/h de mosto, hoy vende la mitad a otra destilería al mismo precio de transferencia, y la rectificadora recibe hasta 4${NB}t/h de etanol. FC es el flujo de caja anual y PBP el periodo de recuperación simple.`,
    pregunta: "Elijan una alternativa y justifiquen la decisión con el VPN y el riesgo.",
    proyectos: D.proy, escenarios: D.esc, vpn: D.vpn, ev: D.ev,
    explicacion: `El VPN esperado vale ${fmt(D.ev.A, 2)} M USD para A, ${fmt(D.ev.B, 2)} para B, ${fmt(D.ev.C, 2)} para C y ${fmt(D.ev.D, 2)} para D. La columna de 4${NB}t/h tiene el mayor VPN esperado y también la mayor pérdida posible, de ${fmt(D.vpn.bajo.C, 2)}${NB}M${NB}USD, porque a media carga sus costos fijos y su CAPEX pesan sobre la mitad de la producción.`,
  },
];
export const N_RONDAS = 7;

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
