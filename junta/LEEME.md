# Junta de inversión

Actividad de la sesión de evaluación económica de Diseño de Plantas Químicas.
Es un concurso individual. Cada estudiante asesora a la junta de una empresa de
servicios ambientales sobre una columna que recupera acetona del agua de lavado de
plantas farmacéuticas. En diez rondas de economía y de seguridad, salud y ambiente (HSE) calculan
y deciden, y el tablero del salón muestra la clasificación en vivo.
El primer puesto gana la nota del concurso.

Celulares: https://sebastiancobad.github.io/QR_Random-number-humans/junta/

Tablero: https://sebastiancobad.github.io/QR_Random-number-humans/junta/tablero.html

Para ensayar sin red, agregue `?demo` a las dos direcciones. Con el tablero en modo de
ensayo, el enlace "Simular respuestas de ejemplo" crea seis participantes y llena la
ronda abierta.

## Rondas

La sesión completa se dicta con el tablero. "Presentar el caso" muestra el enunciado y el
diagrama de flujo de proceso (PFD) antes de la ronda 1. Cada ronda muestra en el tablero y en
el celular la teoría mínima, los datos y la fórmula que necesita.

| Ronda | Tipo | Contenido |
|---|---|---|
| 1 | Cálculo | Costo anual de la acetona que se pierde con el agua de fondos |
| 2 | Cálculo | Costo base de la carcasa de T-401 con la correlación de Turton |
| 3 | Cálculo | Actualización de una cotización de 2019 con el CEPCI |
| 4 | Cálculo | Regla de los seis décimos |
| 5 | Selección y justificación | Cambio que más encarece la columna |
| 6 | Selección | Rubro dominante del OPEX |
| 7 | Cálculo | DQO del agua de fondos que va a tratamiento |
| 8 | Selección y justificación | Escenario que fija la válvula de alivio de T-401 |
| 9 | Cálculo | Reducción del VPN por las medidas de seguridad del HAZOP |
| 10 | Decisión y justificación | Cuatro alternativas de inversión y sorteo del precio de la acetona recuperada |

Las rondas 1 a 9 dan de 0 a 100 puntos. La ronda 10 da 50 + 12 × (0.5 × VPN esperado + 0.5 × VPN del escenario sorteado),
en M USD, redondeado y acotado entre 0 y 100 puntos. Con empate en el primer
puesto, el profesor decide la nota con la justificación de la ronda 10.

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
2. "Presentar el caso" muestra el enunciado y el PFD de la columna.
3. "Abrir la ronda" publica la pregunta en los celulares.
4. "Revelar la respuesta" muestra el valor correcto, la distribución de
   respuestas, la explicación y la clasificación.
5. En la ronda 10, "Sortear el mercado" elige el precio de la acetona recuperada con las
   probabilidades del enunciado y asigna los puntos.
6. "Volver a abrir" reabre la ronda si algún estudiante no alcanzó a responder.

Antes de la clase pulse "Reiniciar la junta" o use una sesión nueva con `?s=`, porque una sesión jugada con la versión de siete rondas guarda otra numeración.
