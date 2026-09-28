// Configuración común de las pruebas en navegador.
// BASE_URL: sitio a probar (por defecto el servidor de `npm run preview`).
// CHROME_PATH: ejecutable de Chrome o Edge; si no se indica, se buscan las rutas habituales.
import { existsSync } from 'node:fs'
import puppeteer from 'puppeteer-core'

export const BASE = (process.env.BASE_URL ?? 'http://localhost:4173/').replace(/\/?$/, '/')
export const ROOT = new URL('../../', import.meta.url).pathname.replace(/^\/(\w:)/, '$1')

const candidates = [
  process.env.CHROME_PATH,
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/usr/bin/google-chrome',
  '/usr/bin/chromium',
].filter(Boolean)

export function launchBrowser() {
  const executablePath = candidates.find((path) => existsSync(path))
  if (!executablePath) throw new Error('No se encontró Chrome. Indica la ruta con la variable CHROME_PATH.')
  return puppeteer.launch({ executablePath, headless: true })
}
