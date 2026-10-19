# Junta de inversión

Actividad de la sesión de evaluación económica de Diseño de Plantas Químicas.
Es un concurso individual. Cada estudiante asesora a la junta de un ingenio sobre
la columna de mosto de una destilería de etanol. En siete rondas estiman,
calculan y deciden, y el tablero del salón muestra la clasificación en vivo.
El primer puesto gana la nota del concurso.

Celulares: https://sebastiancobad.github.io/QR_Random-number-humans/junta/

Tablero: https://sebastiancobad.github.io/QR_Random-number-humans/junta/tablero.html

Para ensayar sin red, agregue `?demo` a las dos direcciones. Con el tablero en modo de
ensayo, el enlace "Simular respuestas de ejemplo" crea seis participantes y llena la
ronda abierta.

## Rondas

Cada ronda se abre en el punto del deck que indica su lámina "Ronda N", después
de la teoría que necesita. El celular muestra los datos y la fórmula.

| Ronda | Tipo | Contenido |
|---|---|---|
| 1 | Cálculo | Balance de etanol del PFD y costo anual del etanol que se pierde en la vinaza |
| 2 | Cálculo | Costo base de la bomba P-101 con la correlación de Turton |
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
nombre y apellido de cada estudiante, sus respuestas y sus justificaciones.

La sesión por defecto es `junta-s14-2026-2s`. Para otra clase use `?s=nombre`
en el tablero; el QR lleva la misma sesión a los celulares.

El botón "Exportar a Excel" del tablero descarga un libro con las hojas
Resumen, Respuestas y Justificaciones. "Reiniciar la junta" pide la clave del
tablero de `assets/config.js`.

## El día de la clase

1. Proyecte `tablero.html`. Cada estudiante escanea el QR y escribe su nombre y apellido.
2. "Abrir la ronda" publica la pregunta en los celulares.
3. "Revelar la respuesta" muestra el valor correcto, la distribución de
   respuestas, la explicación y la clasificación.
4. En la ronda 7, "Sortear el mercado" elige el precio de la flema con las
   probabilidades del enunciado y asigna los puntos.
5. "Volver a abrir" reabre la ronda si algún estudiante no alcanzó a responder.
