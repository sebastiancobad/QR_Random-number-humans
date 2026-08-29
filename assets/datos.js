// ---------------------------------------------------------------------------
//  Capa de datos sobre Firestore. Un documento por sesión con diez contadores.
//  Documento:  sesiones/{sesion}  ->  { n1..n10: entero, total: entero }
//  Las escrituras usan increment(), así que dos celulares que voten en el
//  mismo instante no se pisan.
// ---------------------------------------------------------------------------

import { initializeApp }
  from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore, doc, setDoc, onSnapshot, increment }
  from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { firebaseConfig, SESION } from "./config.js";

export const sesionActiva = (() => {
  const p = new URLSearchParams(location.search).get("s");
  return (p && p.trim()) ? p.trim() : SESION;
})();

export const configurado = !String(firebaseConfig.projectId).includes("PEGUE");

let ref = null;
if (configurado) {
  const app = initializeApp(firebaseConfig);
  ref = doc(getFirestore(app), "sesiones", sesionActiva);
}

// Convierte el documento en un arreglo de diez enteros, posición 0 = número 1.
export function aConteos(datos) {
  const c = new Array(10).fill(0);
  if (!datos) return c;
  for (let i = 1; i <= 10; i++) c[i - 1] = Number(datos["n" + i]) || 0;
  return c;
}

// Registra un voto. Si el estudiante ya había votado, mueve el conteo.
export async function votar(numero, anterior = null) {
  if (!ref) throw new Error("Firebase sin configurar");
  const cambio = { ["n" + numero]: increment(1) };
  if (anterior && anterior !== numero) {
    cambio["n" + anterior] = increment(-1);
  } else if (!anterior) {
    cambio.total = increment(1);
  }
  await setDoc(ref, cambio, { merge: true });
}

// Suscripción en vivo. Devuelve la función para cancelarla.
export function escuchar(callback) {
  if (!ref) return () => {};
  return onSnapshot(ref, snap => callback(aConteos(snap.data())),
                    err => console.error("Firestore:", err));
}

// Deja la sesión en cero sin borrar el documento.
export async function reiniciar() {
  if (!ref) throw new Error("Firebase sin configurar");
  const cero = { total: 0 };
  for (let i = 1; i <= 10; i++) cero["n" + i] = 0;
  await setDoc(ref, cero, { merge: true });
}
