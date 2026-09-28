# Video promocional VOKTER: guion en español

Video vertical de **35 segundos** (9:16, para redes y para mostrar en la presentación) con una versión horizontal (16:9) para el README. Combina **grabaciones reales de la app** (carpeta `clips/`) con **escenas generadas con IA** (latent-spaces u otra herramienta de texto a video) para el ambiente y las transiciones.

**Regla de honestidad:** los productos que aparecen deben ser los reales del catálogo. Las escenas generadas con IA solo se usan para ambiente (ciudad, entreno, escritorio, descanso) y **no deben mostrar marcas, logos ni productos inventados** que parezcan parte del catálogo.

## Identidad visual

| Elemento | Valor |
|---|---|
| Fondo | Azul petróleo casi negro `#071014` |
| Color principal | Aguamarina `#50e3d2` |
| Acentos | Verde lima `#c7f36b` (puntos y ahorro) · Coral `#ff8066` |
| Tipografía | Space Grotesk (títulos) y DM Sans (textos) |
| Marca | `VOKTER/` con la barra en aguamarina |
| Tono | Directo, urbano, cercano. Frases cortas. |
| Música | Electrónica suave, 100-110 BPM, con un golpe en cada cambio de escena |

## Escenas

| # | Tiempo | Imagen | Texto en pantalla | Locución |
|---|---|---|---|---|
| 1 | 0-4 s | **IA:** ciudad de noche, persona caminando con audífonos, luces aguamarina. | *Todo lo que te mueve.* | "Audio, energía, tecnología… todo lo que te mueve." |
| 2 | 4-10 s | **Clip real** `01-inicio-categorias`: la tienda en el teléfono, toque en una categoría y aparecen los productos. | *86 productos reales* | "Más de ochenta productos, en una tienda pensada para tu teléfono." |
| 3 | 10-16 s | **Clip real** `02-combo-carrito`: se agrega el Combo Running y aparece el aviso "agregado al carrito". | *Arma el set y ahorra hasta 20%* | "Arma tu combo y ahorra hasta un veinte por ciento." |
| 4 | 16-22 s | **Clip real** `03-checkout-puntos`: pago con el aviso "procesando pedido" y la confirmación con puntos ganados. | *Cada compra suma puntos* | "Y cada compra te deja puntos para la siguiente." |
| 5 | 22-30 s | **IA:** mano sosteniendo un teléfono frente a una pantalla con un código QR (sin marcas visibles) → **clip real** `04-descarga-app`. | *Descarga la app para Android* | "Llévala contigo: escanea el código y descarga la app." |
| 6 | 30-35 s | **Gráfico:** logo `VOKTER/` sobre fondo `#071014` y la dirección web. | *dark-fax.github.io/vokter-nextgen* | "VOKTER. Muévete con lo que sí necesitas." |

## Descripciones para las escenas generadas con IA

No conozco la interfaz exacta de latent-spaces. Estas son descripciones de texto a video estándar, listas para pegar; ajusta la duración y la proporción a las opciones de la herramienta.

**Escena 1 (4 s, 9:16):**
> Toma cinematográfica nocturna de una calle urbana mojada por la lluvia, una persona joven camina hacia la cámara con audífonos inalámbricos puestos, luces de neón en tonos aguamarina y verde lima reflejadas en el pavimento, cámara lenta, poca profundidad de campo, estética moderna y minimalista, sin logotipos ni texto visible.

**Escena 5, primera parte (3 s, 9:16):**
> Primer plano de una mano sosteniendo un teléfono Android frente a la pantalla de un portátil que muestra un código QR, ambiente de escritorio oscuro con luz aguamarina suave, movimiento de cámara lento hacia el teléfono, sin marcas ni logotipos visibles, estilo publicitario limpio.

**Transición opcional entre escenas (1 s):**
> Barrido diagonal de luz aguamarina sobre fondo casi negro, partículas finas, estilo motion graphics minimalista.

## Locución completa (≈ 30 s, voz joven y cercana)

> Audio, energía, tecnología… todo lo que te mueve.
> Más de ochenta productos, en una tienda pensada para tu teléfono.
> Arma tu combo y ahorra hasta un veinte por ciento.
> Y cada compra te deja puntos para la siguiente.
> Llévala contigo: escanea el código y descarga la app.
> VOKTER. Muévete con lo que sí necesitas.

## Clips reales disponibles

Grabados directamente de la tienda en un teléfono simulado (pantalla de 390 × 844 px, grabada al doble: **780 × 1688 px, MP4 H.264, 30 fps**). Están en la carpeta [`clips/`](clips/) y se pueden volver a grabar con `npm run clips` desde `scripts/e2e/`.

| Archivo | Duración | Contenido |
|---|---|---|
| `01-inicio-categorias.mp4` | 6,6 s | Inicio → toque en "Ropa deportiva" → productos |
| `02-combo-carrito.mp4` | 7,2 s | Combo Running → aviso "agregado" → carrito con descuento |
| `03-checkout-puntos.mp4` | 10 s | Datos de envío → "procesando pedido" → confirmación con puntos |
| `04-descarga-app.mp4` | 6,6 s | Página de descarga con botón y guía de instalación |
