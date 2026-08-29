// ---------------------------------------------------------------------------
//  Histograma en SVG. Misma paleta y misma lectura que la lámina del deck:
//  barras por número, línea discontinua en el 10 % uniforme, favorito marcado.
// ---------------------------------------------------------------------------

const NAVY = "#00558F";
const THEME = "#1F497D";
const LIQ = "#7FB0D8";
const INK = "#243746";
const GREY = "#6B7280";
const AMBAR = "#B45309";

const W = 760, H = 430;
const M = { t: 48, r: 22, b: 52, l: 58 };

const esc = s => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;");

export function construirSVG(conteos, res, { revelado = true } = {}) {
  const iw = W - M.l - M.r;
  const ih = H - M.t - M.b;

  const maxPct = Math.max(12, ...res.pct);
  const yTop = Math.ceil(maxPct / 5) * 5 + 5;
  const y = v => M.t + ih - (v / yTop) * ih;

  const paso = iw / 10;
  const bw = paso * 0.6;

  const p = [];

  // rejilla horizontal y eje vertical
  for (let v = 0; v <= yTop; v += 5) {
    p.push(`<line x1="${M.l}" y1="${y(v)}" x2="${M.l + iw}" y2="${y(v)}"
      stroke="#E3EAF1" stroke-width="1"/>`);
    p.push(`<text x="${M.l - 10}" y="${y(v) + 4}" text-anchor="end"
      font-size="13" fill="${GREY}">${v}</text>`);
  }
  p.push(`<line x1="${M.l}" y1="${M.t}" x2="${M.l}" y2="${M.t + ih}"
    stroke="${INK}" stroke-width="1.2"/>`);
  p.push(`<line x1="${M.l}" y1="${M.t + ih}" x2="${M.l + iw}" y2="${M.t + ih}"
    stroke="${INK}" stroke-width="1.2"/>`);

  // barras
  for (let i = 0; i < 10; i++) {
    const cx = M.l + paso * (i + 0.5);
    const alto = revelado ? Math.max(0, M.t + ih - y(res.pct[i])) : 0;
    const destaca = revelado && res.favoritos.includes(i + 1);
    p.push(`<rect x="${(cx - bw / 2).toFixed(1)}" y="${(M.t + ih - alto).toFixed(1)}"
      width="${bw.toFixed(1)}" height="${alto.toFixed(1)}"
      fill="${destaca ? LIQ : NAVY}"/>`);
    if (revelado && conteos[i] > 0) {
      p.push(`<text x="${cx.toFixed(1)}" y="${(M.t + ih - alto - 7).toFixed(1)}"
        text-anchor="middle" font-size="13" fill="${GREY}" stroke="#FFFFFF"
        stroke-width="3.5" paint-order="stroke">${conteos[i]}</text>`);
    }
    p.push(`<text x="${cx.toFixed(1)}" y="${M.t + ih + 22}" text-anchor="middle"
      font-size="15" font-weight="600" fill="${INK}">${i + 1}</text>`);
  }

  // línea del 10 % uniforme
  p.push(`<line x1="${M.l}" y1="${y(10)}" x2="${M.l + iw}" y2="${y(10)}"
    stroke="${AMBAR}" stroke-width="2" stroke-dasharray="9 5"/>`);
  // leyenda de esa línea, colocada en el margen superior
  p.push(`<line x1="${M.l}" y1="20" x2="${M.l + 34}" y2="20"
    stroke="${AMBAR}" stroke-width="2" stroke-dasharray="9 5"/>`);
  p.push(`<text x="${M.l + 44}" y="25" font-size="13.5" font-weight="700"
    fill="${AMBAR}">esperado si fuera uniforme: 10 %</text>`);

  // rótulos de ejes
  p.push(`<text x="${M.l + iw / 2}" y="${H - 10}" text-anchor="middle"
    font-size="14" fill="${INK}">Número elegido</text>`);
  p.push(`<text x="16" y="${M.t + ih / 2}" text-anchor="middle" font-size="14"
    fill="${INK}" transform="rotate(-90 16 ${M.t + ih / 2})">Respuestas [%]</text>`);

  if (!revelado) {
    p.push(`<text x="${M.l + iw / 2}" y="${M.t + ih / 2}" text-anchor="middle"
      font-size="19" fill="${GREY}">${esc(res.n)} respuestas recibidas</text>`);
  }

  return `<svg viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg"
    font-family="Segoe UI, Helvetica, Arial, sans-serif" role="img"
    aria-label="Histograma de números elegidos">${p.join("")}</svg>`;
}
