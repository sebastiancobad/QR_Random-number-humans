import { DATOS } from "./datos_juego.js";

// ---------------------------------------------------------------------------
//  Rondas de la Junta de inversión. Caso de la columna de recuperación de
//  acetona de una empresa de servicios ambientales. Las cifras salen de las
//  correlaciones del apéndice A de Turton et al. (2018) con CEPCI 2023 = 797.9.
// ---------------------------------------------------------------------------
const D = DATOS;
const NB = "\u00A0";   // espacio no separable entre número y unidad
const NH = "\u2011";   // guion no separable en los rótulos de equipos

export const fmt = (x, dec = 0) => {
  if (x === null || x === undefined || Number.isNaN(x)) return "sin dato";
  const s = Math.abs(x).toFixed(dec).split(".");
  s[0] = s[0].length > 4 ? s[0].replace(/\B(?=(\d{3})+(?!\d))/g, "\u00A0") : s[0];
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
    titulo: "¿Cuánto vale la acetona que se pierde con el agua de fondos?",
    contexto: ["La columna T‑401 separa la acetona del agua de lavado. El destilado, corriente 7, es la acetona recuperada que se vende.", "Los fondos salen por las corrientes 5 y 6 hacia el tratamiento. La acetona que sale con los fondos es acetona comprada que no se vende."],
    figura: "pfd.png", figuraTablero: true,
    datos: [["droplets", `6000${NB}kg/h`, `agua de lavado, corriente 1, 12${NB}% en masa de acetona`], ["flame", `${fmt(D.rec, 2)}${NB}%`, "recuperación r, fracción de la acetona que sale en el destilado, corriente 7"],
            ["coins", `0.68${NB}USD/kg`, "acetona contenida en el agua de lavado"], ["clock", `8000${NB}h/año`, "operación"]],
    formula: "Pérdida = ṁ₁ · w₁ · (1 − r) · horas · precio",
    pregunta: "Calcule el costo anual de la acetona que sale con el agua de fondos por la corriente 6 y escríbalo en USD/año.",
    unidad: "USD/año", correcta: D.r1, dec: 0,
    cadena: [`720${NB}kg/h × ${fmt(1 - D.rec / 100, 4)} = ${fmt(D.ace_fondos, 1)}${NB}kg/h`, `× 8000${NB}h/año × 0.68${NB}USD/kg`, `${fmt(D.r1)}${NB}USD/año`],
    explicacion: `El agua de fondos arrastra ${fmt(D.ace_fondos, 1)}${NB}kg/h de acetona que la empresa compra y no vende.`,
  },
  {
    n: 2, tipo: "calcular", corto: "Costo base", icono: "gauge",
    titulo: "Costo base de la carcasa de T‑401",
    contexto: ["Turton y colaboradores (2018) ajustaron costos de fabricantes de 2001 con una parábola en el logaritmo del tamaño.", "La correlación da el costo de compra base Cp⁰ en acero al carbono y a presión ambiente. El tamaño de un recipiente vertical es su volumen V."],
    datos: [["layers", `0.762${NB}m`, "diámetro D calculado en Aspen Process Economic Analyzer (APEA)"], ["layers", `18.90${NB}m`, "altura H calculada en APEA"], ["coins", "3.4974", "K₁"], ["coins", "0.4485", "K₂"], ["coins", "0.1074", "K₃"]],
    formula: "V = π/4 · D² · H   y   log₁₀ Cp⁰ = K₁ + K₂ log₁₀ V + K₃ (log₁₀ V)²",
    pregunta: "Calcule el costo de compra base de la carcasa y escríbalo en USD de 2001.",
    unidad: "USD de 2001", correcta: D.r2, dec: 0,
    cadena: [`V = ${fmt(D.V_T, 2)}${NB}m³`, "log₁₀ Cp⁰ = 4.0109", `${fmt(D.r2)}${NB}USD de 2001`],
    explicacion: "La correlación de Turton da el costo de un recipiente vertical de acero al carbono a presión ambiente.",
  },
  {
    n: 3, tipo: "calcular", corto: "CEPCI", icono: "clock",
    titulo: "Actualice la cotización",
    contexto: ["La revista Chemical Engineering publica el índice CEPCI (Chemical Engineering Plant Cost Index), que sigue el precio de los equipos de planta año a año.", "Una cotización vieja se lleva al año de la evaluación con la razón entre los índices de los dos años."],
    datos: [["coins", `9000${NB}USD`, "cotización del tambor en 2019"], ["chart-column", "607.5", "CEPCI 2019"], ["chart-column", "797.9", "CEPCI 2023"]],
    formula: "C₂ = C₁ · I₂ / I₁",
    pregunta: "Calcule el costo del tambor de reflujo en 2023 y escríbalo en USD.",
    unidad: "USD", correcta: D.r3, dec: 0,
    cadena: [`9000${NB}USD`, "× 797.9/607.5", `${fmt(D.r3)}${NB}USD`],
    explicacion: `El índice subió 31${NB}% entre 2019 y 2023.`,
  },
  {
    n: 4, tipo: "calcular", corto: "Seis décimos", icono: "layers",
    titulo: "Unidad del doble de capacidad",
    contexto: ["Williams (1947) observó que el costo de una unidad crece más despacio que su capacidad.", "El exponente típico vale 0.6 y refleja la economía de escala. La regla escala el costo de una unidad conocida de la misma tecnología."],
    datos: [["coins", `0.55${NB}M${NB}USD`, `unidad de 3000${NB}kg/h`], ["layers", `6000${NB}kg/h`, "unidad nueva"]],
    formula: "C₂ = C₁ · (S₂ / S₁)⁰·⁶",
    pregunta: `Calcule el costo de la unidad de 6000${NB}kg/h y escríbalo en M${NB}USD.`,
    unidad: "M USD", correcta: D.r4, dec: 3,
    cadena: [`0.55${NB}M${NB}USD`, "× 2⁰·⁶ = 1.516", `${fmt(D.r4, 3)}${NB}M${NB}USD`],
    explicacion: `El doble de capacidad cuesta 52${NB}% más.`,
  },
  {
    n: 5, tipo: "opcion", corto: "Material", icono: "flame", justificar: true,
    titulo: "¿Qué encarece más la columna?",
    contexto: ["Guthrie (1969) y Ulrich (1984) suman la instalación al costo base con el factor de módulo desnudo FBM = B₁ + B₂ · FM · FP.", "FM corrige por material y FP por presión. Ambos multiplican solo el término B₂. El costo de módulo desnudo CBM incluye equipo, tubería, instrumentos y montaje."],
    datos: [["coins", `${fmt(D.r5shell, 3)}${NB}M${NB}USD`, "módulo desnudo de la carcasa de acero al carbono"], ["gauge", `2.43${NB}barg`, `presión de diseño, FP${NB}=${NB}1`],
            ["layers", "3.11", "FM del acero inoxidable"], ["coins", "2.25 y 1.82", "B₁ y B₂ del recipiente"]],
    formula: `CBM${NB}=${NB}Cp⁰${NB}·${NB}(B₁${NB}+${NB}B₂${NB}·${NB}FM${NB}·${NB}FP)`,
    pregunta: "Elija el cambio que más encarece la columna y justifique la elección.",
    opciones: [
      { id: "material", txt: "Acero inoxidable" },
      { id: "volumen", txt: "Doble de volumen" },
      { id: "presion", txt: `Diseño a 10${NB}barg` },
      { id: "platos", txt: "30 platos" },
    ],
    correcta: "material",
    valores: D.r5, unidadValores: "M USD más", decValores: 3,
    explicacion: "El factor de material multiplica el término B₂ del módulo desnudo de la carcasa y de los platos.",
  },
  {
    n: 6, tipo: "opcion", corto: "OPEX", icono: "droplets",
    titulo: "¿Qué pesa más en el costo de operación?",
    contexto: ["El OPEX es el costo anual de operación. Suma la materia prima CRM, los servicios CUT como vapor, agua de enfriamiento y electricidad, y los costos fijos CF.", `El CAPEX es la inversión de capital. En este caso los costos fijos valen 5${NB}% del CAPEX por año y el vapor de baja presión alimenta el rehervidor E‑402.`],
    datos: [["droplets", `720${NB}kg/h`, `acetona comprada a 0.68${NB}USD/kg`], ["flame", `0.78${NB}t/h`, `vapor a 9.45${NB}USD/t`],
            ["coins", `0.82${NB}M${NB}USD`, `CAPEX, costos fijos de 5${NB}%`], ["clock", `8000${NB}h/año`, "operación"]],
    formula: "OPEX = acetona comprada + servicios + costos fijos",
    pregunta: "Elija el rubro mayor del OPEX.",
    opciones: [
      { id: "mosto", txt: "Acetona comprada" },
      { id: "vapor", txt: "Vapor" },
      { id: "fijos", txt: "Costos fijos" },
      { id: "agua", txt: "Agua de enfriamiento" },
    ],
    correcta: "mosto",
    valores: D.r6, unidadValores: "%", decValores: 2,
    explicacion: "La materia prima define el costo de operación de esta unidad.",
  },
  {
    n: 7, tipo: "calcular", corto: "Ambiente", icono: "droplets",
    titulo: "¿Cuánta DQO teórica lleva el agua de fondos?",
    contexto: ["El agua de fondos va a tratamiento con la acetona que no se recuperó. La demanda química de oxígeno (DQO) mide el oxígeno que consume la oxidación de la materia orgánica. La DQO teórica supone la oxidación completa.", "Cada gramo de acetona consume 2.204 g de O₂ según C₃H₆O + 4 O₂ → 3 CO₂ + 3 H₂O."],
    figura: "pfd.png", figuraTablero: true,
    datos: [["droplets", `${fmt(D.ace_fondos, 1)}${NB}kg/h`, "acetona en los fondos, corriente 5"], ["droplets", `${fmt(D.hse.q_fondos, 3)}${NB}m³/h`, `caudal de líquido de los fondos a 25${NB}°C en Aspen HYSYS`],
            ["flame", `${fmt(D.hse.dqo_esp, 3)}`, "g de O₂ por g de acetona"]],
    formula: "DQO = (ṁA / Q) · 2.204 · 1000",
    nota: "Con ṁA en kg/h y Q en m³/h la razón ṁA / Q queda en kg/m³, que es igual a g/L. El factor 1000 pasa de g/L a mg/L.",
    pregunta: "Calcule la DQO teórica del agua de fondos y escríbala en mg/L de O₂.",
    unidad: "mg/L de O₂", correcta: D.hse.dqo, dec: 0,
    cadena: [`${fmt(D.ace_fondos, 1)} / ${fmt(D.hse.q_fondos, 3)} = ${fmt(D.ace_fondos / D.hse.q_fondos, 3)}${NB}kg/m³`, `× 2.204 × 1000`, `${fmt(D.hse.dqo)}${NB}mg/L`],
    explicacion: `La DQO teórica de los fondos supera casi nueve veces el límite de 800${NB}mg/L de O₂ que el artículo 13 de la Resolución 631 de 2015 fija para vertimientos a cuerpos de agua superficiales de la fabricación de sustancias y productos químicos. Por eso la corriente 6 va a tratamiento y no a vertimiento directo.`,
  },
  {
    n: 8, tipo: "opcion", corto: "Alivio", icono: "gauge", justificar: true,
    titulo: "¿Qué escenario fija la válvula de alivio de T‑401?",
    contexto: ["La válvula de seguridad PSV‑401 (pressure safety valve) protege a T‑401 de la sobrepresión. El diseño evalúa cada escenario creíble y el de mayor carga fija el tamaño de la válvula.", "Con falla del agua de enfriamiento todo el vapor del tope sale por la válvula. Con fuego externo el calor del incendio hierve el líquido de la columna según la norma API 521 del American Petroleum Institute.", "Este cálculo usa las condiciones de operación como estimación preliminar."],
    figura: "pfd.png", figuraTablero: true,
    datos: [["layers", "0.738", "relación de reflujo R"], ["droplets", `12.74${NB}kmol/h`, "destilado D"], ["droplets", `${fmt(D.hse.mbar, 2)}${NB}kg/kmol`, "masa molar M del vapor del tope"],
            ["flame", `18${NB}m²`, `área mojada A hasta 7.6${NB}m sobre el piso`], ["flame", "1", "factor ambiental F, columna sin aislamiento"], ["flame", `2244${NB}kJ/kg`, `calor latente λ del agua de fondos a 121.3${NB}kPa`]],
    formula: "Falla del enfriamiento   W = (R + 1) · D · M\nFuego externo   Q = 43.2 · F · A⁰·⁸² en kW   y   W = 3600 · Q / λ",
    pregunta: "Elija el escenario que fija el tamaño de PSV‑401 y justifique la elección.",
    opciones: [
      { id: "agua", txt: "Falla del agua de enfriamiento" },
      { id: "fuego", txt: "Fuego externo" },
      { id: "vapor", txt: "Falla del vapor del rehervidor" },
      { id: "alim", txt: "Falla de la bomba de alimentación" },
    ],
    correcta: "agua",
    valores: { agua: D.hse.w_agua, fuego: D.hse.w_fuego, vapor: 0, alim: 0 }, unidadValores: "kg/h", decValores: 0,
    explicacion: `Sin agua en E‑403 el rehervidor sigue hirviendo y ${fmt(D.hse.w_agua)}${NB}kg/h de vapor salen por la válvula. El fuego externo da ${fmt(D.hse.q_fuego)}${NB}kW y ${fmt(D.hse.w_fuego)}${NB}kg/h. Sin vapor en el rehervidor no se genera vapor y la presión de la columna baja. Sin alimentación el condensador sigue retirando todo el vapor del tope y la presión no sube.`,
  },
  {
    n: 9, tipo: "calcular", corto: "Seguridad", icono: "flame",
    titulo: "¿Cuánto VPN cuesta la seguridad?",
    contexto: ["El estudio de peligros y operabilidad HAZOP (Hazard and Operability Study) de la unidad pide la válvula PSV‑401, detectores de vapores de acetona junto a V‑401 y motores a prueba de explosión en las bombas.", `La acetona tiene punto de inflamación de −20${NB}°C y forma mezclas inflamables con aire entre 2.5${NB}% y 12.8${NB}% en volumen.`],
    datos: [["wallet", `60${NB}000${NB}USD`, "ΔCAPEX de las medidas"], ["clock", `6000${NB}USD/año`, "ΔOPEX de mantenimiento y costos fijos"],
            ["chart-column", `${fmt(D.hse.af, 4)}`, `factor de valor presente de una serie uniforme P/A a 12${NB}% y 10 años`], ["coins", `${fmt(D.hse.vpn1, 3)}${NB}M${NB}USD`, "VPN de la columna sin las medidas"]],
    formula: "ΔVPN = ΔCAPEX + ΔOPEX · (P/A)",
    pregunta: "Calcule la reducción del VPN que causan las medidas del HAZOP y escríbala en USD.",
    unidad: "USD", correcta: 60000 + 6000 * D.hse.af, dec: 0,
    cadena: [`6000 × ${fmt(D.hse.af, 4)} = ${fmt(6000 * D.hse.af)}${NB}USD`, `+ 60${NB}000${NB}USD`, `${fmt(60000 + 6000 * D.hse.af)}${NB}USD`],
    explicacion: `El VPN baja de ${fmt(D.hse.vpn1, 3)} a ${fmt(D.hse.vpn_hse, 3)}${NB}M${NB}USD, cerca de 5${NB}%, y la columna sigue siendo rentable. El costo de la seguridad entra al CAPEX y al OPEX desde la evaluación preliminar.`,
  },
  {
    n: 10, tipo: "junta", corto: "La junta", icono: "landmark", justificar: true,
    titulo: "La junta decide",
    contexto: ["El VPN esperado pondera el VPN de cada escenario de mercado con su probabilidad.", "La junta sortea el precio de la acetona recuperada después de que todos eligen. El puntaje combina por mitades el VPN esperado y el VPN del escenario sorteado."],
    datos: [["wallet", `1.5${NB}M${NB}USD`, "presupuesto"], ["chart-column", `12${NB}%`, "tasa a 10 años"], ["factory", `12${NB}000${NB}kg/h`, "agua de lavado disponible"]],
    nota: `Dos farmacéuticas entregan agua de lavado para la columna grande. En el escenario bajo el mercado compra solo 703${NB}kg/h de acetona y la columna grande procesa solo 6000${NB}kg/h.`,
    pregunta: "Elija una alternativa y justifique con el VPN y el riesgo",
    proyectos: D.proy, escenarios: D.esc, vpn: D.vpn, ev: D.ev,
    explicacion: `La columna de 12${NB}000${NB}kg/h tiene el VPN esperado más alto, ${fmt(D.ev.C, 2)}${NB}M${NB}USD, y en el escenario bajo pierde ${fmt(-D.vpn.bajo.C, 2)}${NB}M${NB}USD.`,
  },
];
export const N_RONDAS = RONDAS.length - 1;
export const FIN = N_RONDAS + 1;   // estado.ronda del resultado final

// Contexto teórico y figura de la ronda, para el celular y el tablero.
export function contextoHTML(R, conFigura = true) {
  const t = (R.contexto || []).map(p => `<p>${p}</p>`).join("");
  const f = conFigura && R.figura ? `<a class="figura" href="${R.figura}" target="_blank" rel="noopener"><img src="${R.figura}" alt="Diagrama de flujo de proceso de la columna de recuperación de acetona"></a>` : "";
  return t || f ? `<div class="contexto${f ? " config" : ""}"><div>${t}</div>${f}</div>` : "";
}

// Caso que el tablero presenta antes de la ronda 1.
export const CASO = {
  titulo: "Recuperación de acetona del agua de lavado",
  parrafos: [
    "Una empresa de servicios ambientales recibe el agua de lavado de dos farmacéuticas y recupera la acetona en la columna T‑401.",
    `El agua de lavado entra a 6000${NB}kg/h con 12${NB}% en masa de acetona. El destilado sale con 95${NB}% molar de acetona y los fondos con 0.1${NB}% molar.`,
    `La acetona comprada en el agua de lavado cuesta 0.68${NB}USD/kg y la acetona recuperada vale 0.80${NB}USD/kg. La unidad opera 8000${NB}h al año.`,
    `La junta evalúa el proyecto con el valor presente neto (VPN) a 10 años y una tasa de descuento de 12${NB}%. Las temperaturas y presiones del diagrama salen de Aspen HYSYS.`,
  ],
  figura: "pfd.png",
};

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
    return e <= 0.02 ? 100 : e <= 0.05 ? 70 : e <= 0.15 ? 30 : 0;
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
    return Math.max(0, Math.min(100, Math.round(50 + 12 * (0.5 * R.ev[v] + 0.5 * vpn))));
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
  filas.forEach(f => { f.puesto = 1 + filas.filter(x => x.total > f.total).length; });
  return filas;
}

// Ronda que ya cuenta en el puntaje acumulado.
export function rondaContable(estado) {
  if (estado.ronda >= FIN) return N_RONDAS;
  return estado.fase === "revelada" ? estado.ronda : estado.ronda - 1;
}

// Sorteo del mercado con las probabilidades del enunciado.
export function sortearMercado() {
  const u = Math.random(); let acc = 0;
  for (const e of D.esc) { acc += e.prob; if (u <= acc) return e.id; }
  return D.esc[D.esc.length - 1].id;
}
