# VOKTER

Tienda web (React + Vite + Tailwind) empaquetada como app Android con Capacitor.

## Seguridad

VOKTER no tiene servidor: el catálogo viene dentro de la app y el carrito, los favoritos, los puntos y los pedidos se guardan en el propio dispositivo (en el `localStorage` del navegador o del WebView del APK). Por eso las pruebas se centraron en tres preguntas: ¿se puede ejecutar código metiendo HTML en los formularios?, ¿se puede hacer trampa editando lo que la app guarda?, y ¿qué pasa si se escribe una dirección a mano?

### Cómo se hicieron las pruebas

- Se automatizaron con un navegador Chrome controlado por script (Puppeteer), emulando un teléfono de 390 px de ancho, contra el mismo código compilado que se empaqueta en el APK (`dist/`).
- Cada ataque se ejecutó dos veces: antes de corregir (para registrar el fallo) y después (para confirmar la corrección). En total fueron 45 ataques, más 2 pruebas de control que confirman que una compra normal (con canje de puntos) y el límite de 99 unidades siguen funcionando después de las correcciones.
- En cada caso se comprobó: si el código inyectado llegó a ejecutarse (el script intenta escribir `window.__pwned`), si aparecieron elementos HTML inyectados en la página, si la pantalla quedó en blanco y si hubo errores en la consola.
- **APK:** las pruebas no se ejecutaron en un teléfono ni en un emulador. El APK carga exactamente el mismo código web, así que los resultados aplican igual; la diferencia está en *cómo* llega un atacante a los datos guardados (ver "Particularidades del APK").

### 1. Inyección de HTML/JavaScript en campos de texto

Cargas probadas en cada campo: `<img src=x onerror="...">`, `"><svg onload="...">`, `<script>...</script>` y `javascript:...`.

| Dónde | Resultado | ¿Se corrigió algo? |
|---|---|---|
| Buscador del catálogo | No se ejecutó nada. Los caracteres `<` y `>` se eliminan al escribir y aparece el aviso "Se eliminaron los caracteres < y >". El texto `javascript:...` queda como búsqueda sin resultados. | No hacía falta. |
| Checkout: nombre, ciudad y dirección | No se ejecutó nada. El pedido se crea con el texto sin `<` ni `>` (por ejemplo `Alex img src=x onerror=...`) y se muestra como texto plano en la confirmación y en "Cuenta". | No hacía falta. |
| Checkout: correo y teléfono | El formulario rechaza el envío: "Escribe un correo válido." y "Usa entre 7 y 12 dígitos." | No hacía falta. |
| HTML escrito directamente en un pedido guardado (saltándose el formulario) | No se ejecutó nada: React muestra todo como texto, nunca como HTML. | Sí, indirectamente: ahora ese pedido se descarta por no cuadrar con el catálogo (ver punto 2). |
| HTML en la dirección: `/tienda?category=<img...>`, `/pedido/confirmado?pedido=<script>...`, `/producto/<img...>` | No se ejecutó nada. Los parámetros solo se usan para buscar coincidencias, nunca se insertan como HTML. | Sí para `/producto/...`: antes mostraba otro producto (ver punto 3). |

Revisión del código: no se usa `dangerouslySetInnerHTML`, `innerHTML`, `eval`, `new Function` ni `document.write`, y ningún enlace (`href`) se construye con datos escritos por el usuario.

### 2. Manipulación de los datos guardados (`localStorage`)

Claves que usa la app: `vokter-cart` (carrito), `vokter-wishlist` (favoritos) y `vokter-account` (puntos e historial de pedidos). Se editaron desde la consola del navegador, por ejemplo:

```js
localStorage.setItem('vokter-account', JSON.stringify({ points: 99999999, orders: [] }))
localStorage.setItem('vokter-cart', '[{"product":{"id":"parlante-s520"},"quantity":1e999}]')
```

| Ataque | Antes de corregir | Después |
|---|---|---|
| Saldo de puntos cambiado a 99.999.999 | **Fallo.** La app mostraba "99999999 pts" y dejaba canjearlos: un parlante de $85.000 quedaba en **$0**. | El saldo ya no se lee de ese número: se recalcula desde el historial y vuelve a 240 pts. El mismo carrito cuesta $61.000 (canjeando los 240 pts reales). |
| Saldo `1e308` | **Fallo.** Se mostraba "1e+308 pts". | 240 pts. |
| Saldo negativo, como texto (`"999"`) o decimal (`12.7`) | Negativo y texto volvían a 240; el decimal se redondeaba a 12. | 240 pts en todos los casos. |
| Producto inexistente en el carrito (`id: "no-existe"`) | Se descartaba. | Igual. |
| Precio falsificado (`price: "$1"` para el parlante de $85.000) | Se ignoraba: se usa el precio del catálogo. | Igual. |
| Cantidad 0,5 | **Fallo.** Se aceptaba media unidad: total $42.500. | Se descarta la línea. |
| Cantidad 1.000.000.000 | **Fallo.** Total de $85.000.000.000.000. | Se limita a 99 unidades ($8.415.000). |
| Cantidad infinita (`1e999` en el JSON) | **Fallo.** El carrito mostraba "Infinity" unidades y total "$∞". | Se descarta la línea. |
| Cantidad negativa o como texto (`"5"`) | Se descartaba. | Igual. |
| JSON roto o que no es una lista | Carrito vacío, sin errores. | Igual. |
| Pedido con total negativo (cantidad `-1`, precio `-$999.999` y 99.999.999 puntos) | El total nunca bajó de $0, pero el pedido salía **gratis** gracias a los puntos falsos. | Sin puntos falsos, el descuento se limita a los puntos reales. Un total negativo sigue siendo imposible. |
| Pedido falso en el historial con total `-500000` y `pointsEarned: 999999` | **Fallo grave.** La app entera quedaba **en blanco** (sin menú ni forma de salir) en "Cuenta" y en la confirmación. Error: `Cannot read properties of undefined (reading 'replace')`. | El pedido se descarta porque sus cifras no cuadran con el catálogo. La cuenta se muestra normal y la confirmación dice "No encontramos ese pedido". |
| Pedido sin cliente ni productos | **Fallo.** Pantalla en blanco al abrir su confirmación. | Se descarta. |
| Pedido con un producto sin precio | **Fallo.** Pantalla en blanco en "Cuenta" y en la confirmación. | Se descarta. |
| Pedido con `total: "gratis"` | Se mostraba y descuadraba las estadísticas de la cuenta. | Se descarta. |
| 5.000 favoritos falsos y duplicados | Se conservaban los 5.002 valores guardados. | Solo queda 1 favorito (el único producto real, sin duplicar). |

**Qué se corrigió** (en [src/utils/storedData.ts](src/utils/storedData.ts)):

- **Puntos:** ya no se guarda ni se lee un saldo. Se calcula recorriendo el historial desde el pedido más antiguo: 240 iniciales, menos los puntos usados, más los ganados en cada pedido. Si un pedido usa más puntos de los que había en ese momento, se descarta.
- **Pedidos:** solo se acepta un pedido guardado si todo cuadra con el catálogo: el subtotal es la suma de sus productos a precio real, el descuento son los puntos usados × $100, el total es el subtotal menos el descuento, y los puntos ganados son 1 por cada $1.000. Además debe tener un código válido (`VK-...`), fecha, datos del cliente y productos que existan.
- **Carrito:** cada línea se reconstruye con el producto del catálogo (nunca con el precio o la imagen guardados), y solo se aceptan cantidades enteras de 1 a 99. En la pantalla del carrito, el botón "+" se desactiva al llegar a 99.
- **Favoritos:** solo se guardan ids de productos existentes, sin duplicados.
- **Red de seguridad:** si alguna pantalla fallara al dibujarse, en lugar de quedar en blanco se muestra "No pudimos mostrar esta pantalla" con un botón **Restablecer datos**. Esto importa sobre todo en el APK, donde no hay barra de direcciones para recargar. ([src/components/layout/ErrorBoundary.tsx](src/components/layout/ErrorBoundary.tsx))

**Límite que no se puede cerrar sin servidor:** alguien con acceso a la consola todavía podría inventar pedidos *con cifras correctas* (productos reales, precios exactos) para sumar puntos. Hacerlo exige fabricar compras completas y coherentes en lugar de cambiar un número, pero la única protección real sería validar pedidos y puntos en un servidor. En esta demo nada de eso tiene efecto fuera del propio dispositivo: no hay pagos reales ni otra persona afectada.

### 3. Rutas y parámetros manipulados en la URL

La app no tiene rutas protegidas (no hay inicio de sesión), así que se probó qué pasa al escribir direcciones a mano.

| Dirección | Antes | Después |
|---|---|---|
| `/producto/no-existe` y `/producto/%00` | **Fallo.** Mostraba el primer producto del catálogo ("Manos libres Music Colores") como si fuera el producto buscado. | "Este producto no existe." con un enlace al catálogo. |
| `/producto/` (sin id), `/admin`, `/cuenta/../../etc/passwd` | **Fallo.** Pantalla vacía entre el menú y el pie de página, sin ningún mensaje. | Página "Esta página no existe." con un enlace al inicio. |
| `/pedido/confirmado?pedido=VK-NOEXISTE` | "No encontramos ese pedido." | Igual. |
| `/pedido/confirmado` sin parámetro | Muestra el último pedido guardado **en ese mismo dispositivo** o "No encontramos ese pedido". No expone datos de otras personas porque no hay datos fuera del dispositivo. | Igual, pero ya solo con pedidos válidos. |
| `/tienda?category=Inexistente` y una categoría de 5.000 caracteres | "0 resultados" con opción de limpiar filtros, sin errores. | Igual. |
| `/checkout` con el carrito vacío | "No hay nada que pagar." | Igual. |

### 4. Claves, tokens y credenciales en el código

- Se buscaron patrones de claves (`api_key`, `secret`, `token`, `password`, `bearer`, claves de Google `AIza...`, OpenAI `sk-...`, GitHub `ghp_...`, bloques `-----BEGIN ... KEY-----`) en todos los archivos versionados, en todo el historial de git (`git log --all -p`), en el código compilado `dist/` y en los archivos que van dentro del APK.
- **Resultado: no hay ninguna credencial.** Las únicas coincidencias fueron falsos positivos: el texto `sk-t` dentro del dibujo de dos iconos SVG (`public/favicon.svg`, `src/assets/vite.svg`), y la palabra `password` en una lista interna de React con tipos de campos de formulario.
- Tampoco hay archivos sensibles versionados (`.env`, `keystore`/`.jks`, `google-services.json`, `.pem`). El archivo `android/local.properties`, que contiene una ruta de la máquina de desarrollo, está en el `.gitignore`.
- La app no llama a ninguna API. Su única conexión externa es la descarga de las fuentes tipográficas desde Google Fonts.

### Particularidades del APK

- **Copias de seguridad:** el manifiesto de Android tenía `android:allowBackup="true"`, así que el nombre, correo, teléfono y dirección guardados en los pedidos podían terminar en las copias de seguridad del teléfono. Se cambió a `false`.
- **APK de depuración:** en un APK *debug* se puede inspeccionar la app desde `chrome://inspect` con el teléfono conectado por USB y editar `localStorage`, igual que en el navegador. Es la forma de reproducir en el teléfono las pruebas del punto 2, y las protecciones descritas funcionan igual ahí. Un APK de *release* no permite esta inspección.
- **Permisos:** la app solo pide `INTERNET` (para Google Fonts).

---

## Plantilla base (Vite)

This template provides a minimal setup to get React working in Vite with HMR and some Oxlint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the Oxlint configuration

If you are developing a production application, we recommend enabling type-aware lint rules by installing `oxlint-tsgolint` and editing `.oxlintrc.json`:

```json
{
  "$schema": "./node_modules/oxlint/configuration_schema.json",
  "plugins": ["react", "typescript", "oxc"],
  "options": {
    "typeAware": true
  },
  "rules": {
    "react/rules-of-hooks": "error",
    "react/only-export-components": ["warn", { "allowConstantExport": true }]
  }
}
```

See the [Oxlint rules documentation](https://oxc.rs/docs/guide/usage/linter/rules) for the full list of rules and categories.
