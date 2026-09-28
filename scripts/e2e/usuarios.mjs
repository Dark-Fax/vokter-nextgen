// Usuarios simulados: recorridos aleatorios (con semilla reproducible) que verifican la integridad de la tienda.
// Uso: BASE_URL=... node usuarios.mjs <usuarios> <concurrencia> <pasosPorUsuario>
import { BASE, launchBrowser } from './lib.mjs'

const USERS = Number(process.argv[2] ?? 40)
const CONCURRENCY = Number(process.argv[3] ?? 6)
const STEPS = Number(process.argv[4] ?? 18)
const origin = new URL(BASE).origin
const sleep = (ms) => new Promise((r) => setTimeout(r, ms))
const money = (text) => Number(String(text).replace(/[^0-9-]/g, '').replace(/(?!^)-/g, '')) || 0

function rng(seed) { let s = seed >>> 0; return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 2 ** 32) }

const browser = await launchBrowser()
const stats = { users: 0, steps: 0, checkouts: 0, invalidCheckouts: 0, cartChecks: 0, failures: [], origins: new Set(), requests: 0, timings: [] }
const fail = (user, step, msg) => stats.failures.push(`usuario ${user} · paso ${step}: ${msg}`)
// SOLO_USUARIOS=33,79 repite solo esos recorridos; CAPTURAS_FALLAS=carpeta guarda una captura de cada falla.
const onlyUsers = process.env.SOLO_USUARIOS ? process.env.SOLO_USUARIOS.split(',').map(Number) : null
const failShotsDir = process.env.CAPTURAS_FALLAS

async function runUser(id) {
  const rand = rng(id * 7919)
  const pick = (list) => list[Math.floor(rand() * list.length)]
  const context = await browser.createBrowserContext()
  const page = await context.newPage()
  const errors = []
  page.on('pageerror', (e) => errors.push(`error JS: ${e.message}`))
  page.on('requestfailed', (r) => errors.push(`solicitud fallida: ${r.url()}`))
  page.on('response', (r) => { stats.requests++; stats.origins.add(new URL(r.url()).origin); if (r.status() >= 400) errors.push(`HTTP ${r.status()} ${r.url()}`) })
  page.on('dialog', (d) => { errors.push(`diálogo inesperado: ${d.message()}`); d.dismiss() })
  const mobile = rand() < 0.7
  await page.setViewport(mobile ? { width: 390, height: 844, isMobile: true, hasTouch: true } : { width: 1440, height: 900 })
  const t0 = Date.now()
  await page.goto(BASE + '#/', { waitUntil: 'networkidle0' })
  stats.timings.push(Date.now() - t0)
  let expectedOrders = 0

  const clickFirst = async (selector) => { const el = await page.$(selector); if (!el) return false; await el.evaluate((n) => n.scrollIntoView({ block: 'center' })); await el.click(); return true }
  const clickRandom = async (selector) => { const els = await page.$$(selector); if (!els.length) return false; const el = pick(els); await el.evaluate((n) => n.scrollIntoView({ block: 'center' })); await el.click(); return true }
  const go = (route) => page.evaluate((r) => { location.hash = r }, route)

  const actions = {
    categoria: async () => { await go('/'); await sleep(250); await clickRandom('.category-tile') },
    chip: async () => { await go('/tienda'); await sleep(200); await clickRandom('.filter-link') },
    buscar: async () => { await go('/tienda'); await sleep(200); const input = await page.$('.search-field input'); await input.click({ clickCount: 3 }); await input.type(pick(['parlante', 'cable', 'sábana', 'zzzz', '<script>alert(1)</script>', 'S520', 'combo', '"><img src=x>', 'power bank', ''])) },
    ordenar: async () => { await go('/tienda'); await sleep(200); await page.select('.catalog-toolbar select', pick(['relevance', 'price-asc', 'price-desc', 'rating'])) },
    verMas: async () => { await go('/tienda'); await sleep(200); await clickFirst('.load-more') },
    abrirProducto: async () => { if (!(await page.$('.product-card-link'))) { await go('/tienda'); await sleep(250) } await clickRandom('.product-card-link') },
    agregarTarjeta: async () => { if (!(await page.$('.product-card .add-button'))) { await go('/tienda'); await sleep(250) } await clickRandom('.product-card .add-button') },
    agregarDetalle: async () => { if (!(await page.$('.detail-actions .primary-link'))) { await clickRandom('.product-card-link'); await sleep(250) } await clickFirst('.detail-actions .primary-link') },
    combo: async () => { await go('/'); await sleep(250); await clickRandom('.bundle-card .primary-link') },
    favorito: async () => { if (!(await page.$('.card-heart'))) { await go('/tienda'); await sleep(250) } await clickRandom('.card-heart') },
    atras: async () => { await page.goBack().catch(() => {}); if (!page.url().startsWith(origin)) await page.goto(BASE + '#/', { waitUntil: 'networkidle0' }) },
    cantidad: async () => { await go('/carrito'); await sleep(250); await clickRandom('.quantity-control button, .remove-button') },
    rutaInvalida: async () => { await go(pick(['/producto/no-existe', '/admin', '/pedido/confirmado?pedido=VK-FALSO', '/tienda?category=Nada'])) },
    cuenta: async () => { await go('/cuenta') },
    descarga: async () => { await go('/app') },
    checkout: async () => {
      await go('/checkout'); await sleep(300)
      if (!(await page.$('.checkout-form'))) return
      const valid = rand() < 0.8
      const data = valid
        ? { name: pick(['Ana Gómez', 'Luis Pérez', 'Alex Rivera']), email: pick(['ana@correo.com', 'luis@mail.co']), phone: pick(['3001234567', '3159876543']), city: pick(['Bogotá', 'Medellín', 'Cali']), address: 'Calle 10 # 20-30' }
        : { name: 'A', email: 'correo-malo', phone: '12', city: '', address: 'x' }
      for (const [name, value] of Object.entries(data)) { const input = await page.$(`input[name=${name}]`); await input.click({ clickCount: 3 }); await input.type(value) }
      if (rand() < 0.5 && (await page.$('.points-toggle input'))) await page.click('.points-toggle input')
      const shownTotal = money(await page.$eval('.checkout-summary .summary-total strong', (n) => n.textContent))
      await page.click('.checkout-submit')
      if (!valid) { await sleep(300); const errs = await page.$$('.checkout-field .input-notice'); if (!errs.length) throw new Error('checkout inválido sin mensajes de error'); stats.invalidCheckouts++; return }
      await page.waitForFunction(() => location.hash.startsWith('#/pedido/confirmado'), { timeout: 8000 })
      await sleep(250)
      const paid = money(await page.$eval('.confirmation-page .summary-total strong', (n) => n.textContent))
      if (paid !== shownTotal) throw new Error(`el total cobrado (${paid}) no coincide con el mostrado en el checkout (${shownTotal})`)
      expectedOrders++; stats.checkouts++
    },
  }
  const weighted = ['categoria', 'chip', 'buscar', 'ordenar', 'verMas', 'abrirProducto', 'abrirProducto', 'agregarTarjeta', 'agregarTarjeta', 'agregarDetalle', 'combo', 'favorito', 'atras', 'atras', 'cantidad', 'rutaInvalida', 'cuenta', 'descarga', 'checkout', 'checkout']

  for (let step = 1; step <= STEPS; step++) {
    const name = pick(weighted)
    try {
      await actions[name]()
      await sleep(350)
      const blank = await page.evaluate(() => !document.querySelector('main') || document.querySelector('main').innerText.trim().length < 20)
      if (blank) fail(id, step, `pantalla vacía tras "${name}" en ${await page.evaluate(() => location.hash)}`)
      if (await page.$('.cart-summary .summary-total') && (await page.evaluate(() => location.hash)).startsWith('#/carrito')) {
        const check = await page.evaluate(() => {
          const num = (t) => Number(String(t).replace(/[^0-9]/g, '')) || 0
          const lines = [...document.querySelectorAll('.cart-line')].map((l) => num(l.querySelector('.cart-line-copy > strong').textContent) * num(l.querySelector('.quantity-control span').textContent))
          const rows = Object.fromEntries([...document.querySelectorAll('.cart-summary > div')].map((d) => [d.children[0]?.textContent.trim(), d.children[1]?.textContent.trim()]))
          const combo = [...document.querySelectorAll('.cart-summary .summary-discount strong')].reduce((t, n) => t + num(n.textContent), 0)
          return { linesSum: lines.reduce((a, b) => a + b, 0), subtotal: num(rows.Subtotal), shipping: rows['Envío'] === 'Gratis' ? 0 : num(rows['Envío']), combo, total: num(rows.Total) }
        })
        stats.cartChecks++
        if (check.linesSum !== check.subtotal) fail(id, step, `subtotal ${check.subtotal} ≠ suma de líneas ${check.linesSum}`)
        if (check.subtotal - check.combo + check.shipping !== check.total) fail(id, step, `total ${check.total} ≠ subtotal − combos + envío (${JSON.stringify(check)})`)
        const merch = check.subtotal - check.combo
        if ((merch >= 50000 && check.shipping !== 0) || (merch > 0 && merch < 50000 && check.shipping !== 8000)) fail(id, step, `envío incorrecto para ${merch}: ${check.shipping}`)
      }
    } catch (error) {
      fail(id, step, `"${name}" falló: ${error.message.split('\n')[0]} (en ${await page.evaluate(() => location.hash).catch(() => '?')})`)
      if (failShotsDir) await page.screenshot({ path: `${failShotsDir}/usuario-${id}-paso-${step}.png` }).catch(() => {})
    }
    stats.steps++
  }
  // Integridad al recargar: los pedidos hechos siguen ahí y el saldo cuadra con el historial.
  await page.goto(BASE + '#/cuenta', { waitUntil: 'networkidle0' })
  await page.reload({ waitUntil: 'networkidle0' })
  const account = await page.evaluate(() => JSON.parse(localStorage.getItem('vokter-account') ?? '{"orders":[]}'))
  const shownPoints = await page.$eval('.points-pill', (n) => Number(n.textContent.replace(/[^0-9]/g, '')))
  const expectedPoints = account.orders.reduce((p, o) => p - o.pointsUsed + o.pointsEarned, 240)
  if (account.orders.length !== expectedOrders) fail(id, 'final', `pedidos guardados ${account.orders.length} ≠ pedidos hechos ${expectedOrders}`)
  if (shownPoints !== expectedPoints) fail(id, 'final', `saldo mostrado ${shownPoints} ≠ saldo según historial ${expectedPoints}`)
  for (const e of errors) fail(id, '-', e)
  stats.users++
  await context.close()
}

const started = Date.now()
const queue = onlyUsers ?? [...Array(USERS).keys()].map((i) => i + 1)
await Promise.all([...Array(CONCURRENCY)].map(async () => { while (queue.length) await runUser(queue.shift()) }))

// Rastreo: todas las fichas de producto y todos los enlaces internos.
const page = await browser.newPage()
await page.setViewport({ width: 390, height: 844, isMobile: true })
const crawlErrors = []
page.on('pageerror', (e) => crawlErrors.push(e.message))
await page.goto(BASE + '#/tienda', { waitUntil: 'networkidle0' })
while (await page.$('.load-more')) { await page.click('.load-more'); await sleep(100) }
const productLinks = await page.$$eval('.product-card-link', (as) => as.map((a) => a.getAttribute('href')))
let badProducts = 0
for (const href of productLinks) {
  await page.goto(BASE + href, { waitUntil: 'networkidle0' })
  // Cambiar solo el "#" no recarga la página: se espera a que la ficha nueva y su foto terminen de cargar.
  const expectedSrc = `products/${href.split('/').pop()}.webp`
  const ok = await page.waitForFunction((src) => { const img = document.querySelector('.detail-visual img'); return img && img.getAttribute('src').endsWith(src) && img.complete && img.naturalWidth > 0 && document.querySelector('h1')?.textContent !== 'Este producto no existe.' }, { timeout: 8000 }, expectedSrc).then(() => true).catch(() => false)
  if (!ok) { badProducts++; crawlErrors.push(`ficha rota: ${href}`) }
}
const internal = new Set()
for (const route of ['/', '/tienda', '/app', '/cuenta', '/carrito', '/wishlist']) {
  await page.goto(BASE + '#' + route, { waitUntil: 'networkidle0' })
  for (const href of await page.$$eval('a[href^="#/"]', (as) => as.map((a) => a.getAttribute('href')))) internal.add(href)
}
let bad404 = 0
for (const href of internal) {
  await page.goto(BASE + href, { waitUntil: 'networkidle0' })
  if (await page.evaluate(() => document.querySelector('h1')?.textContent.includes('no existe'))) { bad404++; crawlErrors.push(`enlace roto: ${href}`) }
}
await browser.close()

const t = [...stats.timings].sort((a, b) => a - b)
console.log(JSON.stringify({
  sitio: BASE, usuarios: stats.users, pasos: stats.steps, duracionSeg: Math.round((Date.now() - started) / 1000),
  compras: stats.checkouts, checkoutsInvalidosRechazados: stats.invalidCheckouts, verificacionesDeCarrito: stats.cartChecks,
  solicitudes: stats.requests, origenes: [...stats.origins],
  cargaInicialMs: { mediana: t[Math.floor(t.length / 2)], p95: t[Math.floor(t.length * 0.95)], max: t.at(-1) },
  fichasRevisadas: productLinks.length, fichasRotas: badProducts, enlacesInternos: internal.size, enlacesRotos: bad404,
  fallas: stats.failures.length, detalleFallas: stats.failures.slice(0, 25), erroresRastreo: crawlErrors.slice(0, 10),
}, null, 1))
