// ---------------------------------------------------------------------------
//  Votación del proyecto favorito, Principios de Ingeniería 2026-2S.
//  Un documento en la colección "sesiones" del proyecto azar-tadeo:
//    sesiones/{sesion} -> { n: votos totales, v_<id>: votos por proyecto,
//                           abierta: true|false, rev: reinicios }
//  Los votos usan increment(), así que dos celulares a la vez no se pisan.
//  Con ?demo en la dirección todo corre en el navegador, sin red.
// ---------------------------------------------------------------------------
import { firebaseConfig, CLAVE_PANEL } from "../assets/config.js";

export { CLAVE_PANEL };

export const PROYECTOS = [
  { id: "calle", nombre: "Calle Segura", sub: "", color: "#E8613C" },
  { id: "umap", nombre: "U-MAP", sub: "", color: "#2F7BEA" },
  { id: "rplato", nombre: "RPLATO", sub: "", color: "#14A37F" },
  { id: "sglu", nombre: "SGLU", sub: "Sistema de Gestión de Limpieza Universitaria", color: "#8B5CF6" },
  { id: "bionova", nombre: "Bionova", sub: "", color: "#5FA132" },
  { id: "vinx", nombre: "Vinx", sub: "", color: "#E0A100" },
  { id: "pulpa", nombre: "Pulpa de Café", sub: "", color: "#A0522D" },
];

export const SESION_POR_DEFECTO = "voto-pi-2026-2s";
const q = new URLSearchParams(location.search);
export const sesion = (q.get("s") || "").trim() || SESION_POR_DEFECTO;
export const modoDemo = q.has("demo");

function estadoCero(rev = 0) {
  const e = { n: 0, abierta: true, rev };
  for (const p of PROYECTOS) e["v_" + p.id] = 0;
  return e;
}

async function crearFirestore() {
  const { initializeApp } = await import("https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js");
  const fs = await import("https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js");
  const app = initializeApp(firebaseConfig, "votacion");
  const ref = fs.doc(fs.getFirestore(app), "sesiones", sesion);
  return {
    escuchar(cb, alFallar) {
      return fs.onSnapshot(ref, s => cb({ ...estadoCero(), ...(s.data() || {}) }),
        err => { console.error("Firestore:", err); alFallar && alFallar(err); });
    },
    votar: id => fs.setDoc(ref, { ["v_" + id]: fs.increment(1), n: fs.increment(1) }, { merge: true }),
    abrir: v => fs.setDoc(ref, { abierta: v }, { merge: true }),
    reiniciar: rev => fs.setDoc(ref, estadoCero(rev + 1)),
  };
}

function crearDemo() {
  const clave = "voto-demo:" + sesion;
  const canal = "BroadcastChannel" in window ? new BroadcastChannel(clave) : null;
  const leer = () => { try { return { ...estadoCero(), ...JSON.parse(localStorage.getItem(clave) || "{}") }; } catch { return estadoCero(); } };
  const subs = new Set();
  const avisar = () => subs.forEach(cb => cb(leer()));
  const escribir = e => { try { localStorage.setItem(clave, JSON.stringify(e)); } catch {} canal && canal.postMessage(1); avisar(); };
  canal && (canal.onmessage = avisar);
  window.addEventListener("storage", ev => ev.key === clave && avisar());
  return {
    escuchar(cb) { subs.add(cb); cb(leer()); return () => subs.delete(cb); },
    async votar(id) { const e = leer(); e["v_" + id]++; e.n++; escribir(e); },
    async abrir(v) { const e = leer(); e.abierta = v; escribir(e); },
    async reiniciar(rev) { escribir(estadoCero(rev + 1)); },
  };
}

export const api = modoDemo ? crearDemo() : await crearFirestore();
