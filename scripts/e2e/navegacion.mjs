import { BASE, launchBrowser } from './lib.mjs'
const sleep = (ms) => new Promise((r) => setTimeout(r, ms))
const browser = await launchBrowser()
const page = await browser.newPage()
const errors = []; page.on('pageerror', (e) => errors.push(e.message))
await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true })
const state = () => page.evaluate(() => ({
  scrollY: Math.round(scrollY),
  hash: location.hash,
  gridTop: Math.round(document.querySelector('.catalog-layout')?.getBoundingClientRect().top ?? NaN),
  primerProductoVisible: (() => { const c = document.querySelector('.catalog-results .product-card'); if (!c) return null; const r = c.getBoundingClientRect(); return r.top < innerHeight && r.bottom > 0 })(),
  tarjetas: document.querySelectorAll('.catalog-results .product-card').length,
}))
const ok = (cond, msg) => console.log(`${cond ? 'OK   ' : 'FALLA'} ${msg}`)

await page.goto(BASE + '#/', { waitUntil: 'networkidle0' })
await page.evaluate(() => { localStorage.clear(); sessionStorage.clear() })
await page.reload({ waitUntil: 'networkidle0' })

// 1. Categoría desde el inicio
await page.evaluate(() => document.querySelector('#categorias').scrollIntoView())
await sleep(200)
await page.$$eval('.category-tile', (tiles) => tiles.find((t) => t.textContent.includes('Ropa deportiva')).click())
await sleep(600)
let s = await state()
ok(s.hash.includes('Ropa') && s.scrollY > 200 && s.primerProductoVisible, `Inicio → "Ropa deportiva" baja a los productos ${JSON.stringify(s)}`)

// 2. Cambiar de categoría dentro de la tienda no salta al inicio
const before = s.scrollY
await page.$$eval('.filter-link', (b) => b.find((x) => x.textContent === 'Hogar').click())
await sleep(700)
s = await state()
ok(s.hash.includes('Hogar') && s.scrollY > 200 && s.primerProductoVisible, `Chip "Hogar" mantiene la vista en los productos (antes ${before}) ${JSON.stringify(s)}`)
await page.$$eval('.filter-link', (b) => b.find((x) => x.textContent === 'Todas').click())
await sleep(700)
s = await state()
ok(s.scrollY > 200 && s.primerProductoVisible, `Chip "Todas" no salta al inicio ${JSON.stringify(s)}`)

// 3. Ver más x2, bajar, abrir un producto y volver atrás
await page.click('.load-more'); await sleep(200); await page.click('.load-more'); await sleep(300)
await page.evaluate(() => document.querySelectorAll('.catalog-results .product-card')[29].scrollIntoView({ block: 'center' }))
await sleep(400)
const deep = await state()
await page.evaluate(() => document.querySelectorAll('.catalog-results .product-card-link')[29].click())
await sleep(600)
const detail = await state()
ok(detail.hash.startsWith('#/producto/') && detail.scrollY === 0, `Abrir producto empieza arriba ${JSON.stringify(detail)}`)
await page.goBack(); await sleep(900)
s = await state()
ok(s.tarjetas === deep.tarjetas && Math.abs(s.scrollY - deep.scrollY) < 40, `Atrás recupera ${deep.tarjetas} productos y la posición ${deep.scrollY} → ${JSON.stringify(s)}`)

// 4. Menú Tienda desde un producto empieza arriba
await page.goto(BASE + '#/producto/parlante-s520'); await sleep(500)
await page.evaluate(() => scrollTo(0, 600)); await sleep(200)
await page.click('.tab-bar a[href="#/tienda"]'); await sleep(600)
s = await state()
ok(s.scrollY === 0, `Pestaña Tienda desde un producto empieza arriba ${JSON.stringify(s)}`)

// 5. Enlace directo con categoría (recarga)
await page.goto(BASE + '#/tienda?category=Audio'); await page.reload({ waitUntil: 'networkidle0' }); await sleep(600)
s = await state()
ok(s.primerProductoVisible, `Enlace directo /tienda?category=Audio muestra productos ${JSON.stringify(s)}`)
console.log(errors.length ? errors : 'sin errores')
await browser.close()
