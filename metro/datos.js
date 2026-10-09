// ---------------------------------------------------------------------------
//  Capa de datos de la actividad del metro.
//  Un documento por sesión en la colección "sesiones" del proyecto azar-tadeo:
//    sesiones/{sesion} -> {
//      ronda: 0 espera, 1 elección y razones, 2 orden de factores,
//      e, s: votos por metro elevado y por metro subterráneo,
//      n1: respuestas de la actividad 1, razones: [{ id, k, f, c }],
//      n2: respuestas de la actividad 2, p_<factor>: puntos, r_<factor>: suma de posiciones,
//      rev: número de reinicios
//    }
//  Las escrituras usan increment() y arrayUnion(), así que dos celulares que
//  respondan en el mismo instante no se pisan.
//  Con ?demo en la dirección todo corre en el navegador, sin red, y las
//  pestañas del mismo equipo se sincronizan entre sí.
// ---------------------------------------------------------------------------
import { firebaseConfig, CLAVE_PANEL } from "../assets/config.js";

export { CLAVE_PANEL };

export const FACTORES = [
  { id: "costo", nombre: "Costo de la obra", icono: "coins" },
  { id: "tiempo", nombre: "Tiempo de obra", icono: "hourglass" },
  { id: "ruido", nombre: "Ruido y paisaje", icono: "volume-2" },
  { id: "trancones", nombre: "Trancones durante la obra", icono: "traffic-cone" },
  { id: "riesgo", nombre: "Riesgo al construir", icono: "hard-hat" },
  { id: "predios", nombre: "Predios y comercios afectados", icono: "store" },
];

export const SESION_POR_DEFECTO = "metro-s08-2026-2s";
const q = new URLSearchParams(location.search);
export const sesion = (q.get("s") || "").trim() || SESION_POR_DEFECTO;
export const modoDemo = q.has("demo");

const nuevoId = () =>
  (crypto.randomUUID ? crypto.randomUUID() : String(Date.now()) + Math.random().toString(16).slice(2));

function estadoCero(rev = 0) {
  const e = { ronda: 0, e: 0, s: 0, n1: 0, n2: 0, razones: [], rev };
  for (const f of FACTORES) { e["p_" + f.id] = 0; e["r_" + f.id] = 0; }
  return e;
}

// ----------------------------------------------------------------- Firestore
async function crearFirestore() {
  const { initializeApp } = await import("https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js");
  const fs = await import("https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js");
  const app = initializeApp(firebaseConfig, "metro");
  const ref = fs.doc(fs.getFirestore(app), "sesiones", sesion);
  return {
    escuchar(cb, alFallar) {
      return fs.onSnapshot(ref, snap => cb(snap.data() || estadoCero()),
        err => { console.error("Firestore:", err); alFallar && alFallar(err); });
    },
    fijarRonda: r => fs.setDoc(ref, { ronda: r }, { merge: true }),
    enviarRazones(k, f, c) {
      return fs.setDoc(ref, {
        [k]: fs.increment(1), n1: fs.increment(1),
        razones: fs.arrayUnion({ id: nuevoId(), k, f, c }),
      }, { merge: true });
    },
    enviarOrden(orden) {
      const cambio = { n2: fs.increment(1) };
      orden.forEach((id, i) => {
        cambio["p_" + id] = fs.increment(orden.length - i);
        cambio["r_" + id] = fs.increment(i + 1);
      });
      return fs.setDoc(ref, cambio, { merge: true });
    },
    ocultarRazon: obj => fs.updateDoc(ref, { razones: fs.arrayRemove(obj) }),
    async reiniciar(revActual = 0) {
      await fs.setDoc(ref, estadoCero(revActual + 1));
    },
  };
}

// ------------------------------------------------------- modo demostración
function crearDemo() {
  const clave = "metro-demo:" + sesion;
  const canal = "BroadcastChannel" in window ? new BroadcastChannel(clave) : null;
  const leer = () => {
    try { return JSON.parse(localStorage.getItem(clave)) || estadoCero(); } catch { return estadoCero(); }
  };
  let oyentes = [];
  const avisar = () => { const d = leer(); oyentes.forEach(cb => cb(d)); };
  const escribir = (fn) => {
    const d = leer(); fn(d);
    try { localStorage.setItem(clave, JSON.stringify(d)); } catch { /* sin almacenamiento */ }
    canal && canal.postMessage("cambio");
    avisar();
    return Promise.resolve();
  };
  canal && (canal.onmessage = avisar);
  window.addEventListener("storage", e => { if (e.key === clave) avisar(); });
  return {
    escuchar(cb) { oyentes.push(cb); setTimeout(() => cb(leer()), 0); return () => { oyentes = oyentes.filter(x => x !== cb); }; },
    fijarRonda: r => escribir(d => { d.ronda = r; }),
    enviarRazones: (k, f, c) => escribir(d => { d[k] = (d[k] || 0) + 1; d.n1 = (d.n1 || 0) + 1; d.razones.push({ id: nuevoId(), k, f, c }); }),
    enviarOrden: orden => escribir(d => {
      d.n2 = (d.n2 || 0) + 1;
      orden.forEach((id, i) => { d["p_" + id] = (d["p_" + id] || 0) + orden.length - i; d["r_" + id] = (d["r_" + id] || 0) + i + 1; });
    }),
    ocultarRazon: obj => escribir(d => { d.razones = d.razones.filter(r => r.id !== obj.id); }),
    reiniciar: (revActual = 0) => escribir(d => { Object.assign(d, estadoCero(revActual + 1)); }),
  };
}

const api = modoDemo ? crearDemo() : await crearFirestore();
export const { escuchar, fijarRonda, enviarRazones, enviarOrden, ocultarRazon, reiniciar } = api;

// Respuestas de ejemplo para ensayar el tablero sin red.
export const EJEMPLO = (() => {
  const d = estadoCero();
  const rs = [
    ["e", "Cuesta menos y se construye más rápido", "Tapa la vista y da sombra a la avenida"],
    ["e", "No hay que excavar en el suelo blando de Bogotá", "El ruido del tren llega a los apartamentos"],
    ["s", "No cambia el paisaje de la ciudad", "La obra cuesta mucho más"],
    ["e", "La plata alcanza para más kilómetros", "Las columnas ocupan la mitad de la avenida"],
    ["s", "Aguanta mejor el clima y no hace ruido afuera", "Hay que sacar millones de metros cúbicos de tierra"],
    ["e", "Se ve la ciudad desde el tren", "Los vecinos pierden privacidad"],
    ["s", "Las estaciones quedan bajo tierra y liberan espacio", "Una inundación del túnel sería grave"],
  ];
  for (const [k, f, c] of rs) { d[k]++; d.n1++; d.razones.push({ id: nuevoId(), k, f, c }); }
  const ordenes = [["costo", "tiempo", "trancones", "riesgo", "ruido", "predios"],
                   ["ruido", "predios", "costo", "trancones", "tiempo", "riesgo"],
                   ["costo", "trancones", "tiempo", "predios", "ruido", "riesgo"],
                   ["tiempo", "costo", "riesgo", "trancones", "predios", "ruido"]];
  for (const o of ordenes) { d.n2++; o.forEach((id, i) => { d["p_" + id] += 6 - i; d["r_" + id] += i + 1; }); }
  return d;
})();
