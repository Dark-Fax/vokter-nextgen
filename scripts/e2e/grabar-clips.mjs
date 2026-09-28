import { BASE, ROOT, launchBrowser } from './lib.mjs'
import ffmpegPath from 'ffmpeg-static'
import { execFileSync } from 'node:child_process'
import { mkdirSync, rmSync } from 'node:fs'
const out = `${ROOT}docs/video-promocional/clips/`
mkdirSync(out, { recursive: true })
const sleep = (ms) => new Promise((r) => setTimeout(r, ms))
const browser = await launchBrowser()
const page = await browser.newPage()
await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 2, isMobile: true, hasTouch: true })

async function smoothScroll(to, ms = 900) { await page.evaluate(async (target, duration) => { const from = scrollY; const start = performance.now(); await new Promise((done) => { const tick = (now) => { const t = Math.min(1, (now - start) / duration); scrollTo(0, from + (target - from) * (1 - (1 - t) ** 3)); if (t < 1) requestAnimationFrame(tick); else done() }; requestAnimationFrame(tick) }) }, to, ms) }
// Se graba al doble del tamaño de pantalla (780 × 1688) y se convierte a MP4 H.264,
// el formato que aceptan todos los editores de video.
async function record(name, fn) {
  const raw = `${out}${name}.webm`
  const recorder = await page.screencast({ path: raw, ffmpegPath, scale: 2 })
  await fn()
  await recorder.stop()
  execFileSync(ffmpegPath, ['-loglevel', 'error', '-y', '-i', raw, '-c:v', 'libx264', '-preset', 'slow', '-crf', '20', '-pix_fmt', 'yuv420p', '-r', '30', '-movflags', '+faststart', `${out}${name}.mp4`])
  rmSync(raw)
  console.log(name)
}
async function reset(route, storage = {}) {
  await page.goto(BASE + '#/', { waitUntil: 'networkidle0' })
  await page.evaluate((s) => { localStorage.clear(); sessionStorage.clear(); for (const [k, v] of Object.entries(s)) localStorage.setItem(k, JSON.stringify(v)) }, storage)
  await page.goto(BASE + '#' + route); await page.reload({ waitUntil: 'networkidle0' })
  await page.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 800) { scrollTo(0, y); await new Promise((r) => setTimeout(r, 30)) } scrollTo(0, 0) })
  await sleep(400)
}

await reset('/')
await record('01-inicio-categorias', async () => {
  await sleep(1200)
  const target = await page.$eval('#categorias', (n) => n.getBoundingClientRect().top + scrollY - 70)
  await smoothScroll(target, 1400); await sleep(700)
  await page.$$eval('.category-tile', (t) => t.find((x) => x.textContent.includes('Ropa deportiva')).click())
  await sleep(900)
  await smoothScroll(await page.evaluate(() => scrollY + 500), 1500); await sleep(900)
})

await reset('/')
await record('02-combo-carrito', async () => {
  const target = await page.$eval('#combos', (n) => n.getBoundingClientRect().top + scrollY - 70)
  await smoothScroll(target, 1400); await sleep(600)
  await page.click('.bundle-card .primary-link'); await sleep(1500)
  await page.click('.cart-toast a'); await sleep(900)
  const summary = await page.$eval('.cart-summary', (n) => n.getBoundingClientRect().top + scrollY - 90)
  await smoothScroll(summary, 1400); await sleep(1300)
})

await reset('/checkout', { 'vokter-cart': [{ product: { id: 'conduccion-osea-f805' }, quantity: 1 }, { product: { id: 'conjunto-sport-aguamarina' }, quantity: 1 }, { product: { id: 'power-bank-2300' }, quantity: 1 }] })
await record('03-checkout-puntos', async () => {
  await sleep(500)
  for (const [name, value] of Object.entries({ name: 'Ana Gómez', email: 'ana@correo.com', phone: '3001234567', city: 'Bogotá', address: 'Calle 10 # 20-30' })) await page.type(`input[name=${name}]`, value, { delay: 25 })
  const submit = await page.$eval('.checkout-summary', (n) => n.getBoundingClientRect().top + scrollY - 90)
  await smoothScroll(submit, 1000); await page.click('.points-toggle input'); await sleep(700)
  await page.click('.checkout-submit'); await sleep(2300)
  await sleep(1200)
  await smoothScroll(await page.$eval('.points-card', (n) => n.getBoundingClientRect().top + scrollY - 120), 1200); await sleep(1300)
})

await reset('/app')
await record('04-descarga-app', async () => {
  await sleep(1300)
  await smoothScroll(await page.$eval('.download-card', (n) => n.getBoundingClientRect().top + scrollY - 90), 1200); await sleep(1200)
  await smoothScroll(await page.$eval('.download-help', (n) => n.getBoundingClientRect().top + scrollY - 90), 1400)
  await page.click('.download-help details summary'); await sleep(1500)
})
await browser.close()
