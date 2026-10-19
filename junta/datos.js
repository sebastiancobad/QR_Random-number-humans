// ---------------------------------------------------------------------------
//  Capa de datos de la Junta de inversión.
//  Un documento por sesión en la colección "sesiones" del proyecto azar-tadeo:
//    sesiones/{sesion} -> {
//      junta: true,
//      ronda: 0 sala de espera, 1 a 7 rondas, 8 resultado final,
//      fase: "abierta" | "revelada",
//      mercado: null | "bajo" | "base" | "alto"   (sorteo de la ronda 7),
//      rev: número de reinicios,
//      g: { <id del grupo>: { nombre, r: { <ronda>: { v, j, t } } } }
//    }
//  Cada grupo escribe solo dentro de g.<su id>, con setDoc y merge, así que dos
//  celulares que respondan en el mismo instante no se pisan.
//  No se guarda ningún dato personal: solo el nombre que el grupo escoge.
//  Con ?demo en la dirección todo corre en el navegador, sin red, y las
//  pestañas del mismo equipo se sincronizan entre sí.
// ---------------------------------------------------------------------------
import { firebaseConfig, CLAVE_PANEL } from "../assets/config.js";

export { CLAVE_PANEL };

export const SESION_POR_DEFECTO = "junta-s14-2026-2s";
const q = new URLSearchParams(location.search);
export const sesion = (q.get("s") || "").trim() || SESION_POR_DEFECTO;
export const modoDemo = q.has("demo");

export const nuevoId = () =>
  (crypto.randomUUID ? crypto.randomUUID().slice(0, 8) : Math.random().toString(16).slice(2, 10));

export function estadoCero(rev = 0) {
  return { junta: true, ronda: 0, fase: "abierta", mercado: null, reab: null, rev, g: {} };
}

// ----------------------------------------------------------------- Firestore
async function crearFirestore() {
  const { initializeApp } = await import("https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js");
  const fs = await import("https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js");
  const app = initializeApp(firebaseConfig, "junta");
  const ref = fs.doc(fs.getFirestore(app), "sesiones", sesion);
  return {
    escuchar(cb, alFallar) {
      return fs.onSnapshot(ref, { includeMetadataChanges: true }, snap => cb(Object.assign(estadoCero(), snap.data() || {}), snap.metadata.hasPendingWrites),
        err => { console.error("Firestore:", err); alFallar && alFallar(err); });
    },
    fijar: cambio => fs.setDoc(ref, cambio, { merge: true }),
    registrar: (gid, nombre) => fs.setDoc(ref, { g: { [gid]: { nombre } } }, { merge: true }),
    responder: (gid, ronda, v, j) =>
      fs.setDoc(ref, { g: { [gid]: { r: { [ronda]: { v, j: j || "", t: Date.now() } } } } }, { merge: true }),
    quitarGrupo: gid => fs.updateDoc(ref, { ["g." + gid]: fs.deleteField() }),
    reiniciar: (revActual = 0) => fs.setDoc(ref, estadoCero(revActual + 1)),
  };
}

// ------------------------------------------------------- modo demostración
function crearDemo() {
  const clave = "junta-demo:" + sesion;
  const canal = "BroadcastChannel" in window ? new BroadcastChannel(clave) : null;
  let memoria = null;
  const leer = () => {
    try { const t = localStorage.getItem(clave); if (t) return Object.assign(estadoCero(), JSON.parse(t)); } catch { /* sin almacenamiento */ }
    return memoria ? structuredClone(memoria) : estadoCero();
  };
  let oyentes = [];
  const avisar = () => { const d = leer(); oyentes.forEach(cb => cb(d, false)); };
  const escribir = fn => {
    const d = leer(); fn(d); memoria = d;
    try { localStorage.setItem(clave, JSON.stringify(d)); } catch { /* sin almacenamiento */ }
    canal && canal.postMessage("cambio");
    avisar();
    return Promise.resolve();
  };
  canal && (canal.onmessage = avisar);
  window.addEventListener("storage", e => { if (e.key === clave) avisar(); });
  return {
    escuchar(cb) { oyentes.push(cb); setTimeout(() => cb(leer(), false), 0); return () => { oyentes = oyentes.filter(x => x !== cb); }; },
    fijar: cambio => escribir(d => Object.assign(d, cambio)),
    registrar: (gid, nombre) => escribir(d => { d.g[gid] = Object.assign(d.g[gid] || { r: {} }, { nombre }); }),
    responder: (gid, ronda, v, j) => escribir(d => {
      d.g[gid] = d.g[gid] || { nombre: "Grupo", r: {} };
      d.g[gid].r = d.g[gid].r || {};
      d.g[gid].r[ronda] = { v, j: j || "", t: Date.now() };
    }),
    quitarGrupo: gid => escribir(d => { delete d.g[gid]; }),
    reiniciar: (revActual = 0) => escribir(d => { Object.keys(d).forEach(k => delete d[k]); Object.assign(d, estadoCero(revActual + 1)); }),
  };
}

const api = modoDemo ? crearDemo() : await crearFirestore();
export const { escuchar, fijar, registrar, responder, quitarGrupo, reiniciar } = api;
