import type { Order, OrderCustomer } from '../context/AccountContext'
import type { CartLine } from '../context/CartContext'
import { findProduct } from '../data/products'
import { pointValue, pointsEarnedFor } from './points'
import { priceOf } from './price'
import { sanitizeInput } from './sanitizeInput'

// Todo lo que viene de localStorage se trata como no confiable: cualquiera puede editarlo desde
// la consola del navegador (o del WebView en un APK de depuración). Aquí se valida y se recalcula
// antes de que llegue a la interfaz.

export const maxQuantity = 99
export const initialPoints = 240
const orderIdPattern = /^VK-[A-Z0-9]{1,12}$/

const isRecord = (value: unknown): value is Record<string, unknown> => typeof value === 'object' && value !== null && !Array.isArray(value)
const isQuantity = (value: unknown): value is number => typeof value === 'number' && Number.isInteger(value) && value > 0

// Las líneas se reconstruyen con el producto vigente del catálogo: el precio o la imagen guardados
// nunca se usan. Cantidades no enteras, negativas o infinitas se descartan y el máximo es 99.
export function parseCartLines(raw: unknown): CartLine[] {
  if (!Array.isArray(raw)) return []
  const lines = new Map<string, CartLine>()
  for (const line of raw) {
    if (!isRecord(line) || !isRecord(line.product) || typeof line.product.id !== 'string' || !isQuantity(line.quantity)) continue
    const product = findProduct(line.product.id)
    if (!product) continue
    const quantity = Math.min(maxQuantity, (lines.get(product.id)?.quantity ?? 0) + line.quantity)
    lines.set(product.id, { product, quantity })
  }
  return [...lines.values()]
}

export function parseWishlist(raw: unknown): string[] {
  if (!Array.isArray(raw)) return []
  return [...new Set(raw.filter((id): id is string => typeof id === 'string' && findProduct(id) !== undefined))]
}

function parseCustomer(raw: unknown): OrderCustomer | null {
  if (!isRecord(raw)) return null
  const fields = ['name', 'email', 'phone', 'address', 'city'] as const
  if (!fields.every((field) => typeof raw[field] === 'string')) return null
  const customer = Object.fromEntries(fields.map((field) => [field, sanitizeInput(raw[field] as string)])) as OrderCustomer
  return customer.name ? customer : null
}

// Un pedido guardado solo se acepta si sus cifras cuadran con los precios del catálogo:
// subtotal = suma de las líneas, descuento = puntos usados × valor del punto, total = subtotal − descuento
// y puntos ganados = 1 por cada $1.000 del total. Si alguien edita un total o inventa puntos, se descarta.
function parseOrder(raw: unknown): Order | null {
  if (!isRecord(raw) || typeof raw.id !== 'string' || !orderIdPattern.test(raw.id)) return null
  const createdAt = typeof raw.createdAt === 'string' && !Number.isNaN(Date.parse(raw.createdAt)) ? raw.createdAt : null
  const customer = parseCustomer(raw.customer)
  const lines = parseCartLines(raw.lines)
  if (!createdAt || !customer || !lines.length || !Array.isArray(raw.lines) || lines.length !== raw.lines.length) return null
  const subtotal = lines.reduce((total, line) => total + priceOf(line.product) * line.quantity, 0)
  const pointsUsed = raw.pointsUsed
  if (!(pointsUsed === 0 || isQuantity(pointsUsed)) || pointsUsed * pointValue > subtotal) return null
  const discount = pointsUsed * pointValue
  const total = subtotal - discount
  const pointsEarned = pointsEarnedFor(total)
  if (raw.subtotal !== subtotal || raw.discount !== discount || raw.total !== total || raw.pointsEarned !== pointsEarned) return null
  return { id: raw.id, createdAt, lines, subtotal, pointsUsed, discount, total, pointsEarned, customer }
}

// El saldo de puntos no se lee de un número guardado (sería trivial falsificarlo): se calcula
// recorriendo el historial desde el pedido más antiguo. Un pedido que usa más puntos de los que
// había en ese momento se descarta.
export function parseAccount(raw: unknown): { points: number; orders: Order[] } {
  const candidates = isRecord(raw) && Array.isArray(raw.orders) ? raw.orders : []
  const seen = new Set<string>()
  const chronological = candidates.map(parseOrder).filter((order): order is Order => order !== null && !seen.has(order.id) && Boolean(seen.add(order.id))).reverse()
  let points = initialPoints
  const orders: Order[] = []
  for (const order of chronological) {
    if (order.pointsUsed > points) continue
    points = points - order.pointsUsed + order.pointsEarned
    orders.unshift(order)
  }
  return { points, orders }
}

export function readStored(key: string): unknown {
  try {
    const stored = window.localStorage.getItem(key)
    return stored ? JSON.parse(stored) : null
  } catch {
    return null
  }
}
