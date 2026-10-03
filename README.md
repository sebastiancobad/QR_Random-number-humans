# Actividad de clase: escoja un número del 1 al 10

Módulo web para el curso Modelado y Simulación de Sistemas (Utadeo). Los
estudiantes escanean un QR, tocan un número, y la pantalla del salón muestra el
histograma contra la uniforme del 10 % junto con el contraste chi-cuadrado.

Dos páginas:

| Archivo | Para quién | Qué hace |
|---|---|---|
| `index.html` | estudiantes | diez botones, un toque, respuesta anónima |
| `panel.html` | profesor | QR, conteo en vivo, histograma y contraste |

El histograma queda **oculto** hasta que usted presiona "Mostrar resultados".
Los últimos en votar no alcanzan a ver la distribución, así que no se sesgan.

## Qué necesita

Un proyecto de Firebase (gratuito) y un repositorio de GitHub. Unos veinte
minutos la primera vez. En los semestres siguientes solo cambia una línea.

GitHub Pages sirve archivos estáticos y no puede recibir votos por sí solo.
Firestore es la pieza que guarda los conteos.

---

## Parte 1 · Firebase, unos ocho minutos

1. Entre a <https://console.firebase.google.com> con su cuenta de Google y
   presione **Agregar proyecto**. Nómbrelo `azar-tadeo`. Puede desactivar
   Google Analytics, no hace falta.

2. En el menú de la izquierda: **Compilación > Firestore Database >
   Crear base de datos**. Elija **Modo de prueba** y la ubicación
   `us-central` o `southamerica-east1`.

3. Pestaña **Reglas**. Borre lo que haya y pegue el contenido de
   `firestore.rules` de este repositorio. Presione **Publicar**.
   Esas reglas abren únicamente la colección `sesiones`, que solo contiene
   números enteros. No se guarda ningún dato personal.

4. Vuelva al inicio del proyecto y presione el ícono `</>` (**Web**) para
   registrar una aplicación. Nómbrela `panel`. No active Firebase Hosting.

5. Firebase le muestra un bloque `const firebaseConfig = { ... }`.
   Copie los seis valores y péguelos en `assets/config.js`.

En ese mismo archivo revise las otras tres constantes:

```js
export const SESION = "s04-2026-2s";   // cámbielo en cada clase
export const CLAVE_PANEL = "tadeo2026"; // la pide el botón de reiniciar
export const TITULO = "Escoja un número del 1 al 10";
```

## Parte 2 · Prueba local antes de publicar

Los archivos usan módulos de JavaScript, así que abrirlos con doble clic no
funciona. Levante un servidor de un solo comando dentro de la carpeta:

```bash
python -m http.server 8000
```

Abra <http://localhost:8000/index.html>, toque un número, y en otra pestaña
<http://localhost:8000/panel.html>. El contador debe subir en menos de un
segundo. Si sube, Firebase quedó bien conectado.

## Parte 3 · GitHub Pages, unos diez minutos

Por la interfaz web, sin instalar nada:

1. En <https://github.com/new> cree un repositorio **público** llamado
   `azar-tadeo`. No agregue README ni `.gitignore`.

2. En la pantalla que aparece presione **uploading an existing file** y
   arrastre todo el contenido de esta carpeta, incluida la subcarpeta
   `assets` y el archivo `.nojekyll`. Presione **Commit changes**.

3. Vaya a **Settings > Pages**. En *Source* elija **Deploy from a branch**,
   rama `main`, carpeta `/ (root)`. Guarde.

4. Espere entre uno y dos minutos. La dirección queda así:

   ```
   https://USUARIO.github.io/azar-tadeo/
   ```

Con `git` desde la terminal es equivalente:

```bash
git init
git add .
git commit -m "Actividad de azar"
git branch -M main
git remote add origin https://github.com/USUARIO/azar-tadeo.git
git push -u origin main
```

## Parte 4 · El QR de la lámina

Abra `panel.html` en el sitio publicado y presione **Descargar el QR**.
Queda un PNG de 640 px listo para la diapositiva.

Para una versión de mayor resolución:

```bash
pip install "qrcode[pil]"
python herramientas_qr.py https://USUARIO.github.io/azar-tadeo/?s=s04-2026-2s
```

---

## El día de la clase

1. Proyecte `panel.html`. El QR y el contador quedan a la vista.
2. Pida el número. Treinta segundos bastan.
3. Cuando el contador se estabilice, presione **Mostrar resultados**.
4. **Pantalla completa** agranda solo el gráfico para la discusión.

Si la red del salón falla, el enlace **Cargar distribución de ejemplo** del pie
carga la distribución típica del experimento y la clase continúa.

## Qué muestra el panel

El contraste de bondad de ajuste contra la uniforme discreta sobre `{1,…,10}`:

$$X^2=\sum_{i=1}^{10}\frac{(O_i-E_i)^2}{E_i},\qquad E_i=\frac{n}{10},\qquad \nu=9$$

con valor crítico $\chi^2_{0{,}05;9}=16{,}919$. Es el mismo contraste del
Ejemplo 6 del deck, ahora sobre los datos del salón.

Las cuatro métricas responden a las tres explicaciones de la lámina:

| Métrica | Valor bajo uniformidad |
|---|---|
| escogió el 7 | 10 % |
| escogió 1 o 10 | 20 % |
| escogió impar | 50 % |

## Reutilizar el módulo

Cada clase nueva solo necesita un identificador de sesión distinto. Dos formas:

- cambiar `SESION` en `assets/config.js` y volver a subir el archivo;
- agregar `?s=nombre-nuevo` a la dirección del panel, sin tocar el código.
  El QR que dibuja el panel ya incluye ese parámetro.

## Estructura

```
index.html            votación
panel.html            panel del profesor
firestore.rules       reglas de seguridad
herramientas_qr.py    QR en alta resolución para el deck
.nojekyll             evita que GitHub Pages procese la carpeta assets
assets/
  config.js           credenciales y rótulos
  datos.js            capa Firestore
  estadistica.js      chi-cuadrado y p-valor
  grafico.js          histograma SVG
  estilo.css          paleta del deck
  qrcode.js           generador de QR empaquetado, sin CDN
```

Modelo de datos en Firestore: un documento por sesión en la colección
`sesiones`, con los campos `n1` a `n10` y `total`. Las escrituras usan
`increment()`, así que dos celulares que voten en el mismo instante no se
pisan.

## Al terminar el semestre

En la pestaña **Reglas** de Firestore cambie las dos condiciones de
`sesiones` a `if false;`. El sitio queda publicado y deja de aceptar
escrituras. Para reabrirlo el semestre siguiente, vuelva a `if true;`.

---

## Simulador del embalse de Chingaza

`chingaza/index.html` es el simulador de la clase de formación de modelos. Los
estudiantes mueven la extracción hacia Bogotá y la lluvia del año y ven el nivel
del sistema Chingaza contra los 12 datos del Acueducto. No usa Firebase.
Dirección: <https://sebastiancobad.github.io/QR_Random-number-humans/chingaza/>
