// Cifras generadas desde caso.py y gen_rondas.py. No se editan a mano.
export const DATOS = {
 "r1": 13335.0,
 "cp01": 2910.0,
 "r2": {
  "orden": [
   "E-102",
   "T-101",
   "E-101",
   "E-103"
  ],
  "cbm": {
   "E-102": 0.715,
   "T-101": 0.424,
   "E-101": 0.248,
   "E-103": 0.183
  }
 },
 "r3": 41013.0,
 "r4": 1.819,
 "r5": {
  "material": 0.157,
  "volumen": 0.118,
  "presion": 0.017,
  "platos": 0.056
 },
 "r5cs": 0.267,
 "r6": {
  "mosto": 93.6,
  "vapor": 4.5,
  "fijos": 1.6,
  "agua": 0.3,
  "elec": 0.0
 },
 "esc": [
  {
   "id": "bajo",
   "pf": 0.66,
   "prob": 0.3,
   "txt": "La flema baja a 0.66 USD/kg de etanol y el mercado absorbe solo 2 t/h de etanol"
  },
  {
   "id": "base",
   "pf": 0.75,
   "prob": 0.5,
   "txt": "La flema se mantiene en 0.75 USD/kg de etanol"
  },
  {
   "id": "alto",
   "pf": 0.8,
   "prob": 0.2,
   "txt": "La flema sube a 0.80 USD/kg de etanol"
  }
 ],
 "vpn": {
  "bajo": {
   "A": -1.75,
   "B": 0.64,
   "C": -3.86,
   "D": -1.11
  },
  "base": {
   "A": 6.34,
   "B": 0.64,
   "C": 14.67,
   "D": 6.99
  },
  "alto": {
   "A": 10.84,
   "B": 0.64,
   "C": 23.66,
   "D": 11.48
  }
 },
 "ev": {
  "A": 4.81,
  "B": 0.64,
  "C": 10.91,
  "D": 5.46
 },
 "proy": [
  {
   "id": "A",
   "nombre": "Columna de mosto de 2 t/h de etanol",
   "capex": 3.19,
   "fc": 1.69,
   "pbp": 1.89
  },
  {
   "id": "B",
   "nombre": "Integración energética de la destilería actual",
   "capex": 0.6,
   "fc": 0.22,
   "pbp": 2.73
  },
  {
   "id": "C",
   "nombre": "Columna de mosto de 4 t/h de etanol",
   "capex": 4.84,
   "fc": 3.45,
   "pbp": 1.4
  },
  {
   "id": "D",
   "nombre": "Proyectos A y B juntos",
   "capex": 3.79,
   "fc": 1.91,
   "pbp": 1.99
  }
 ]
};
