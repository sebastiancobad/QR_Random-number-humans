# Junta de inversión

Actividad de la sesión de evaluación económica de Diseño de Plantas Químicas.
Los grupos son firmas de ingeniería que asesoran a la junta de un ingenio sobre
la columna de mosto de una destilería de etanol. En siete rondas estiman,
calculan y deciden, y el tablero del salón muestra la clasificación en vivo.

Celulares: https://sebastiancobad.github.io/QR_Random-number-humans/junta/

Tablero: https://sebastiancobad.github.io/QR_Random-number-humans/junta/tablero.html

Para ensayar sin red, agregue `?demo` a las dos direcciones. Con el tablero en modo de
ensayo, el enlace "Simular respuestas de ejemplo" crea seis grupos y llena la
ronda abierta.

## Rondas

| Ronda | Tipo | Contenido |
|---|---|---|
| 1 | Estimación | Costo de compra de la bomba P-101, puntaje por error logarítmico |
| 2 | Orden | Cuatro equipos por costo de módulo desnudo |
| 3 | Cálculo | Actualización de una cotización de 2018 con el CEPCI |
| 4 | Cálculo | Regla de los seis décimos |
| 5 | Selección y justificación | Cambio que más encarece la columna |
| 6 | Selección | Rubro dominante del OPEX |
| 7 | Decisión y justificación | Cuatro alternativas de inversión y sorteo del precio de la flema |

Las rondas 1 a 6 dan de 0 a 100 puntos. La ronda 7 da 50 + 3 × VPN en M USD
del escenario sorteado, redondeado y acotado entre 0 y 100 puntos.

## Datos

Usa el mismo proyecto de Firebase (`azar-tadeo`) y la colección `sesiones`,
abierta por las reglas actuales. El documento de la sesión guarda solo el
nombre que cada grupo escoge, sus respuestas y sus justificaciones. No guarda
datos personales.

La sesión por defecto es `junta-s14-2026-2s`. Para otra clase use `?s=nombre`
en el tablero; el QR lleva la misma sesión a los celulares.

El botón "Exportar a Excel" del tablero descarga un libro con las hojas
Resumen, Respuestas y Justificaciones. "Reiniciar la junta" pide la clave del
tablero de `assets/config.js`.

## El día de la clase

1. Proyecte `tablero.html`. Los grupos escanean el QR y escriben su nombre.
2. "Abrir la ronda" publica la pregunta en los celulares.
3. "Revelar la respuesta" muestra el valor correcto, la distribución de
   respuestas, la explicación y la clasificación.
4. En la ronda 7, "Sortear el mercado" elige el precio de la flema con las
   probabilidades del enunciado y asigna los puntos.
5. "Volver a abrir" reabre la ronda si algún grupo no alcanzó a responder.
