// ---------------------------------------------------------------------------
//  Estadística de la votación. Funciones puras, sin dependencias.
//  Contraste chi-cuadrado de bondad de ajuste contra la uniforme discreta
//  sobre {1,...,10}:   X2 = sum (O_i - E_i)^2 / E_i    con  E_i = n/10
//  Grados de libertad: 9.  Valores críticos: 16,919 (5 %) y 21,666 (1 %).
// ---------------------------------------------------------------------------

export const K = 10;                 // categorías: 1..10
export const GL = K - 1;             // grados de libertad
export const CRIT_05 = 16.919;
export const CRIT_01 = 21.666;

// --- ln Gamma (Lanczos) ----------------------------------------------------
function lnGamma(z) {
  const g = [76.18009172947146, -86.50532032941677, 24.01409824083091,
             -1.231739572450155, 0.1208650973866179e-2, -0.5395239384953e-5];
  let x = z, y = z, tmp = x + 5.5;
  tmp -= (x + 0.5) * Math.log(tmp);
  let ser = 1.000000000190015;
  for (let j = 0; j < 6; j++) ser += g[j] / ++y;
  return -tmp + Math.log(2.5066282746310005 * ser / x);
}

// --- serie para la gamma incompleta regularizada P(a,x) --------------------
function gammaSerie(a, x) {
  let ap = a, sum = 1 / a, del = sum;
  for (let n = 0; n < 500; n++) {
    ap += 1;
    del *= x / ap;
    sum += del;
    if (Math.abs(del) < Math.abs(sum) * 1e-12) break;
  }
  return sum * Math.exp(-x + a * Math.log(x) - lnGamma(a));
}

// --- fracción continua para Q(a,x) ----------------------------------------
function gammaFraccion(a, x) {
  const FPMIN = 1e-300;
  let b = x + 1 - a, c = 1 / FPMIN, d = 1 / b, h = d;
  for (let i = 1; i <= 500; i++) {
    const an = -i * (i - a);
    b += 2;
    d = an * d + b; if (Math.abs(d) < FPMIN) d = FPMIN;
    c = b + an / c; if (Math.abs(c) < FPMIN) c = FPMIN;
    d = 1 / d;
    const del = d * c;
    h *= del;
    if (Math.abs(del - 1) < 1e-12) break;
  }
  return Math.exp(-x + a * Math.log(x) - lnGamma(a)) * h;
}

// Q(a,x) = 1 - P(a,x), la cola superior de la gamma regularizada.
function Q(a, x) {
  if (x <= 0) return 1;
  return x < a + 1 ? 1 - gammaSerie(a, x) : gammaFraccion(a, x);
}

// p-valor del contraste chi-cuadrado con gl grados de libertad.
export function pValor(x2, gl = GL) {
  if (!isFinite(x2) || x2 <= 0) return 1;
  return Q(gl / 2, x2 / 2);
}

// ---------------------------------------------------------------------------
//  Resumen completo de la votación.
//  conteos: arreglo de 10 enteros, posición 0 = número 1.
// ---------------------------------------------------------------------------
export function resumen(conteos) {
  const n = conteos.reduce((a, b) => a + b, 0);
  const esperado = n / K;
  const pct = conteos.map(c => (n > 0 ? (100 * c) / n : 0));

  let x2 = 0;
  if (n > 0) {
    for (const c of conteos) x2 += ((c - esperado) ** 2) / esperado;
  }

  const maxC = Math.max(...conteos);
  const favoritos = [];
  conteos.forEach((c, i) => { if (c === maxC && c > 0) favoritos.push(i + 1); });

  const extremos = conteos[0] + conteos[K - 1];          // números 1 y 10
  const impares = conteos.reduce((s, c, i) => s + ((i + 1) % 2 ? c : 0), 0);

  // Con las proporciones fijas, X2 crece proporcional a n. De ahi sale
  // cuantas respuestas harian falta para cruzar el valor critico.
  const porUnidad = n > 0 ? x2 / n : 0;
  const nParaRechazar = porUnidad > 0 ? Math.ceil(CRIT_05 / porUnidad) : null;

  return {
    n,
    esperado,
    nParaRechazar,
    pct,
    x2,
    gl: GL,
    p: n > 0 ? pValor(x2) : 1,
    rechaza05: n > 0 && x2 > CRIT_05,
    favoritos,
    pctSiete: n > 0 ? (100 * conteos[6]) / n : 0,
    pctExtremos: n > 0 ? (100 * extremos) / n : 0,
    pctImpares: n > 0 ? (100 * impares) / n : 0
  };
}

// Formato de número con coma decimal, como en el resto del curso.
export function fmt(x, d = 2) {
  return x.toFixed(d).replace(".", ",");
}
