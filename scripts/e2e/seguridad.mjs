// Pruebas ofensivas contra la tienda compilada (el mismo código que va en el APK). Sitio: variable BASE_URL.
import { BASE, launchBrowser } from './lib.mjs'

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))
const browser = await launchBrowser()
const page = await browser.newPage()
await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true })
let pageErrors = []
page.on('pageerror', (e) => pageErrors.push(e.message))
page.on('dialog', async (d) => { pageErrors.push(`DIALOG ABIERTO: ${d.message()}`); await d.dismiss() })

const results = []
function report(id, attack, outcome) { results.push({ id, attack, ...outcome }); console.log(`[${id}] ${attack}\n     -> ${JSON.stringify(outcome)}`) }

const PAYLOADS = ['<img src=x onerror="window.__pwned=1">', '"><svg onload="window.__pwned=1">', '<script>window.__pwned=1</script>', 'javascript:window.__pwned=1']
const product = { id: 'parlante-s520' }

async function fresh(storage = {}, route = '/') {
  pageErrors = []
  await page.goto(BASE + '#/', { waitUntil: 'networkidle0' })
  await page.evaluate((s) => { localStorage.clear(); for (const [k, v] of Object.entries(s)) localStorage.setItem(k, typeof v === 'string' ? v : JSON.stringify(v)) }, storage)
  await page.goto(BASE + '#' + route)
  await page.reload({ waitUntil: 'networkidle0' })
  await sleep(150)
}
const state = () => page.evaluate(() => ({
  pwned: window.__pwned ?? null,
  injectedNodes: document.querySelectorAll('main img[src="x"], img[src="x"], svg[onload], script:not([src])').length,
  blank: document.querySelector('.site-shell') === null || document.querySelector('.site-shell').innerText.trim().length < 40,
  heading: document.querySelector('h1')?.innerText.replace(/\s+/g, ' ') ?? null,
}))
const snap = async (extra = {}) => ({ ...(await state()), errors: [...pageErrors], ...extra })

// ---------- A. Inyección de HTML/JS en campos de texto ----------
for (const p of PAYLOADS) {
  await fresh({}, '/tienda')
  await page.type('.search-field input', p)
  await sleep(150)
  report('A1', `Buscador: ${p}`, await snap({ valorFinal: await page.$eval('.search-field input', (i) => i.value), aviso: !!(await page.$('.input-notice')) }))
}

for (const p of PAYLOADS) {
  await fresh({ 'vokter-cart': [{ product, quantity: 1 }] }, '/checkout')
  const values = { name: `Alex ${p}`, email: 'alex@correo.com', phone: '3001234567', city: `Bogotá ${p}`, address: `Calle 100 ${p}` }
  for (const [name, value] of Object.entries(values)) await page.type(`input[name=${name}]`, value)
  await page.click('.checkout-submit')
  await page.waitForFunction(() => location.hash.startsWith('#/pedido/confirmado'), { timeout: 6000 }).catch(() => {})
  const onConfirm = await snap({ url: page.url().split('#')[1] })
  await page.goto(BASE + '#/cuenta'); await sleep(200)
  const stored = await page.evaluate(() => JSON.parse(localStorage.getItem('vokter-account'))?.orders?.[0]?.customer ?? null)
  report('A2', `Checkout (nombre, ciudad, dirección): ${p}`, { confirmacion: onConfirm, cuenta: await snap(), guardado: stored })
}

// email con payload: debe rechazarse por formato
await fresh({ 'vokter-cart': [{ product, quantity: 1 }] }, '/checkout')
for (const [name, value] of Object.entries({ name: 'Alex Rivera', email: 'a@b.co"><img src=x onerror=alert(1)>', phone: '3001234567<script>', city: 'Bogotá', address: 'Calle 100 # 15-20' })) await page.type(`input[name=${name}]`, value)
await page.click('.checkout-submit'); await sleep(300)
report('A3', 'Checkout: payload en correo y teléfono', await snap({ erroresFormulario: await page.$$eval('.checkout-field .input-notice', (n) => n.map((x) => x.textContent)), url: page.url().split('#')[1] }))

// payload guardado directamente en localStorage (XSS almacenado)
const evilCustomer = { name: '<img src=x onerror="window.__pwned=1">', email: '"><svg onload=window.__pwned=1>', phone: '1', address: '<script>window.__pwned=1</script>', city: 'javascript:alert(1)' }
const evilOrder = { id: 'VK-EVIL1', createdAt: new Date().toISOString(), lines: [{ product: { id: 'x', name: '<img src=x onerror=window.__pwned=1>', price: '$1' }, quantity: 1 }], subtotal: 1, pointsUsed: 0, discount: 0, total: 1, pointsEarned: 0, customer: evilCustomer }
await fresh({ 'vokter-account': { points: 240, orders: [evilOrder] } }, '/cuenta')
report('A4', 'XSS almacenado: pedido con HTML en localStorage, vista /cuenta', await snap())
await page.goto(BASE + '#/pedido/confirmado?pedido=VK-EVIL1'); await sleep(200)
report('A4b', 'XSS almacenado: mismo pedido en /pedido/confirmado', await snap())

// payload en parámetros de URL
for (const route of ['/tienda?category=<img src=x onerror=window.__pwned=1>', '/pedido/confirmado?pedido=<script>window.__pwned=1</script>', '/producto/<img src=x onerror=window.__pwned=1>']) {
  await fresh({}, route)
  report('A5', `URL: ${route}`, await snap())
}

// ---------- B. Manipulación de localStorage ----------
await fresh({ 'vokter-account': { points: 99999999, orders: [] }, 'vokter-cart': [{ product, quantity: 1 }] }, '/checkout')
const bal = await page.$eval('.points-card strong, .nav-actions .points-pill', (n) => n.textContent).catch(() => null)
const hasToggle = !!(await page.$('.points-toggle input'))
if (hasToggle) await page.click('.points-toggle input')
report('B1', 'Saldo de puntos falsificado a 99.999.999', await snap({ saldoMostrado: await page.$eval('.points-pill', (n) => n.textContent), permiteCanjear: hasToggle, totalCheckout: await page.$eval('.summary-total strong', (n) => n.textContent) }))
void bal

for (const [label, points] of [['negativo', -5000], ['texto', '"999"'], ['decimal', 12.7], ['gigante', 1e308]]) {
  await fresh({ 'vokter-account': `{"points":${points},"orders":[]}` }, '/cuenta')
  report('B2', `Saldo ${label}: ${points}`, await snap({ saldoMostrado: await page.$eval('.points-pill', (n) => n.textContent) }))
}

const cartAttacks = {
  'producto inexistente': [{ product: { id: 'no-existe', name: 'Falso', price: '$1' }, quantity: 3 }],
  'precio falsificado': [{ product: { id: 'parlante-s520', price: '$1' }, quantity: 1 }],
  'cantidad negativa': [{ product, quantity: -3 }],
  'cantidad decimal': [{ product, quantity: 0.5 }],
  'cantidad gigante': [{ product, quantity: 1e9 }],
  'cantidad infinita (1e999)': '[{"product":{"id":"parlante-s520"},"quantity":1e999}]',
  'cantidad como texto': [{ product, quantity: '5' }],
  'JSON roto': '[{"product":',
  'no es lista': { hola: 1 },
}
for (const [label, cart] of Object.entries(cartAttacks)) {
  await fresh({ 'vokter-cart': cart }, '/carrito')
  report('B3', `Carrito: ${label}`, await snap({
    lineas: await page.$$eval('.cart-line', (n) => n.map((x) => x.innerText.replace(/\s+/g, ' ').slice(0, 80))),
    total: await page.$eval('.summary-total strong', (n) => n.textContent).catch(() => 'sin resumen'),
    badge: await page.$eval('.cart-button span', (n) => n.textContent),
  }))
}

// Intento de pedido con total negativo a través del checkout
await fresh({ 'vokter-account': { points: 99999999, orders: [] }, 'vokter-cart': `[{"product":{"id":"parlante-s520","price":"-$999.999"},"quantity":-1},{"product":{"id":"cable-rca-2x1"},"quantity":1}]` }, '/checkout')
if (await page.$('.points-toggle input')) await page.click('.points-toggle input')
for (const [name, value] of Object.entries({ name: 'Alex Rivera', email: 'alex@correo.com', phone: '3001234567', city: 'Bogotá', address: 'Calle 100 # 15-20' })) await page.type(`input[name=${name}]`, value)
await page.click('.checkout-submit')
await page.waitForFunction(() => location.hash.startsWith('#/pedido/confirmado'), { timeout: 6000 }).catch(() => {})
report('B4', 'Pedido con total negativo (cantidad y precio negativos + puntos inflados)', await snap({ pedido: await page.evaluate(() => { const o = JSON.parse(localStorage.getItem('vokter-account')).orders[0]; return o && { subtotal: o.subtotal, discount: o.discount, total: o.total, pointsUsed: o.pointsUsed, pointsEarned: o.pointsEarned } }) }))

// Pedidos falsos en el historial
const fakeOrders = {
  'total negativo': [{ ...evilOrder, id: 'VK-NEG', customer: { name: 'Ana', email: 'a@a.co', phone: '1', address: 'x', city: 'y' }, lines: [{ product: { id: 'parlante-s520' }, quantity: 1 }], subtotal: 85000, total: -500000, pointsEarned: 999999 }],
  'sin cliente ni líneas': [{ id: 'VK-ROTO', total: 10 }],
  'producto sin precio': [{ ...evilOrder, id: 'VK-SINPRECIO', lines: [{ product: { id: 'x', name: 'x' }, quantity: 1 }], customer: { name: 'Ana', email: 'a@a.co', phone: '1', address: 'x', city: 'y' } }],
  'total como texto': [{ ...evilOrder, id: 'VK-TXT', total: 'gratis', customer: { name: 'Ana', email: 'a@a.co', phone: '1', address: 'x', city: 'y' } }],
}
for (const [label, orders] of Object.entries(fakeOrders)) {
  await fresh({ 'vokter-account': { points: 240, orders } }, '/cuenta')
  const cuenta = await snap({ totalGastado: await page.$eval('.account-stats strong', (n) => n.textContent).catch(() => null), saldo: await page.$eval('.points-pill', (n) => n.textContent).catch(() => null) })
  await page.goto(BASE + `#/pedido/confirmado?pedido=${orders[0].id}`); await sleep(200)
  report('B5', `Historial con pedido falso: ${label}`, { cuenta, confirmacion: await snap() })
}

// Wishlist basura
await fresh({ 'vokter-wishlist': JSON.stringify([...Array(5000).keys()].map((i) => `falso-${i}`).concat(['parlante-s520', 'parlante-s520'])) }, '/wishlist')
report('B6', 'Wishlist con 5.000 ids falsos y duplicados', await snap({ tarjetas: await page.$$eval('.product-card', (n) => n.length), guardadoDespues: await page.evaluate(() => JSON.parse(localStorage.getItem('vokter-wishlist')).length) }))

// ---------- C. Rutas y parámetros manipulados ----------
const routes = ['/producto/no-existe', '/producto/', '/producto/%00', '/pedido/confirmado?pedido=VK-NOEXISTE', '/pedido/confirmado', '/admin', '/cuenta/../../etc/passwd', '/tienda?category=Inexistente', `/tienda?category=${'A'.repeat(5000)}`, '/checkout']
for (const route of routes) {
  await fresh({}, route)
  report('C1', `Ruta directa: ${route.slice(0, 60)}`, await snap())
}
await fresh({ 'vokter-account': { points: 240, orders: [{ ...evilOrder, id: 'VK-REAL', customer: { name: 'Ana Real', email: 'a@a.co', phone: '1', address: 'x', city: 'y' } }] } }, '/pedido/confirmado')
report('C2', 'Confirmación sin parámetro con un pedido guardado', await snap())

// ---------- R. Regresión: un pedido legítimo debe sobrevivir a la validación ----------
await fresh({ 'vokter-cart': [{ product, quantity: 2 }, { product: { id: 'cable-rca-2x1' }, quantity: 1 }] }, '/checkout')
await page.click('.points-toggle input').catch(() => {})
for (const [name, value] of Object.entries({ name: 'Alex Rivera', email: 'alex@correo.com', phone: '3001234567', city: 'Bogotá', address: 'Calle 100 # 15-20' })) await page.type(`input[name=${name}]`, value)
await page.click('.checkout-submit')
await page.waitForFunction(() => location.hash.startsWith('#/pedido/confirmado'), { timeout: 6000 }).catch(() => {})
const before = await page.evaluate(() => JSON.parse(localStorage.getItem('vokter-account')))
await page.reload({ waitUntil: 'networkidle0' }); await sleep(200)
report('R1', 'Pedido legítimo con puntos canjeados, luego recarga', await snap({ pedidosAntes: before.orders.length, pedidosDespues: await page.evaluate(() => JSON.parse(localStorage.getItem('vokter-account')).orders.length), saldo: await page.$eval('.points-pill', (n) => n.textContent), esperado: `${240 - before.orders[0].pointsUsed + before.orders[0].pointsEarned} pts` }))
await fresh({ 'vokter-cart': [{ product, quantity: 99 }] }, '/carrito')
report('R2', 'Botón + con 99 unidades', await snap({ botonMasDeshabilitado: await page.$eval('.quantity-control button[aria-label="Aumentar cantidad"]', (b) => b.disabled) }))

console.log('\nRESUMEN_JSON=' + JSON.stringify(results))
await browser.close()
