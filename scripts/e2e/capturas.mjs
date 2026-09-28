import { BASE, ROOT, launchBrowser } from './lib.mjs'
import { mkdirSync } from 'node:fs'
const out = `${ROOT}docs/screenshots/`
mkdirSync(out, { recursive: true })
const sleep = (ms) => new Promise((r) => setTimeout(r, ms))
const browser = await launchBrowser()
const page = await browser.newPage()
const cart = [{ product: { id: 'conduccion-osea-f805' }, quantity: 1 }, { product: { id: 'conjunto-sport-aguamarina' }, quantity: 1 }, { product: { id: 'power-bank-2300' }, quantity: 1 }, { product: { id: 'parlante-s520' }, quantity: 1 }]
async function view(width) { await page.setViewport({ width, height: width < 768 ? 844 : 900, deviceScaleFactor: width < 768 ? 2 : 1, isMobile: width < 768, hasTouch: width < 768 }) }
async function go(route, { scrollTo, wait = 500 } = {}) {
  await page.goto(BASE + '#' + route, { waitUntil: 'networkidle0' })
  await page.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 700) { scrollTo(0, y); await new Promise((r) => setTimeout(r, 40)) } scrollTo(0, 0) })
  if (scrollTo) await page.evaluate((s) => document.querySelector(s).scrollIntoView({ block: 'start' }), scrollTo)
  await sleep(wait)
}
async function shot(name) { await page.screenshot({ path: `${out}${name}.jpg`, type: 'jpeg', quality: 82 }); console.log(name) }

await view(390)
await page.goto(BASE + '#/', { waitUntil: 'networkidle0' })
await page.evaluate((c) => { localStorage.clear(); localStorage.setItem('vokter-cart', JSON.stringify(c)); localStorage.setItem('vokter-wishlist', JSON.stringify(['parlante-s520'])) }, cart)
await page.reload({ waitUntil: 'networkidle0' })
await go('/'); await shot('movil-inicio')
await go('/', { scrollTo: '#combos' }); await shot('movil-combos')
await go('/tienda', { scrollTo: '.catalog-toolbar' }); await shot('movil-tienda')
await go('/producto/teclado-inalambrico', { scrollTo: '.detail-copy' }); await shot('movil-producto')
await go('/carrito', { scrollTo: '.cart-summary' }); await shot('movil-carrito')
await go('/checkout')
for (const [name, value] of Object.entries({ name: 'Alex Rivera', email: 'alex@correo.com', phone: '3001234567', city: 'Bogotá', address: 'Calle 100 # 15-20' })) await page.type(`input[name=${name}]`, value)
await page.click('.checkout-submit'); await sleep(1100); await shot('movil-procesando')
await page.waitForFunction(() => location.hash.startsWith('#/pedido/confirmado')); await sleep(500); await shot('movil-confirmacion')
await go('/app'); await shot('movil-descarga')

await view(1440)
await go('/'); await shot('escritorio-inicio')
await go('/tienda', { scrollTo: '.catalog-toolbar' }); await shot('escritorio-tienda')
await go('/', { scrollTo: '#combos' }); await shot('escritorio-combos')
await go('/app'); await shot('escritorio-descarga')
await go('/cuenta', { scrollTo: '.account-grid' }); await shot('escritorio-cuenta')
await browser.close()
