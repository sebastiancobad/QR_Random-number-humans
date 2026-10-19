# Junta de inversión

Actividad de la sesión de evaluación económica de Diseño de Plantas Químicas.
Es un concurso individual. Cada estudiante asesora a la junta de una empresa de
servicios ambientales sobre una columna que recupera acetona del agua de lavado de
plantas farmacéuticas. En siete rondas calculan
y deciden, y el tablero del salón muestra la clasificación en vivo.
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
| 1 | Cálculo | Costo anual de la acetona que se pierde con el agua de fondos |
| 2 | Cálculo | Costo base de la carcasa de T-401 con la correlación de Turton |
| 3 | Cálculo | Actualización de una cotización de 2019 con el CEPCI |
| 4 | Cálculo | Regla de los seis décimos |
| 5 | Selección y justificación | Cambio que más encarece la columna |
| 6 | Selección | Rubro dominante del OPEX |
| 7 | Decisión y justificación | Cuatro alternativas de inversión y sorteo del precio de la acetona recuperada |

Las rondas 1 a 6 dan de 0 a 100 puntos. La ronda 7 da 50 + 3 × (0.5 × VPN esperado + 0.5 × VPN del escenario sorteado),
en M USD, redondeado y acotado entre 0 y 100 puntos. Con empate en el primer
puesto, el profesor decide la nota con la justificación de la ronda 7.

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
4. En la ronda 7, "Sortear el mercado" elige el precio de la acetona recuperada con las
   probabilidades del enunciado y asigna los puntos.
5. "Volver a abrir" reabre la ronda si algún estudiante no alcanzó a responder.
