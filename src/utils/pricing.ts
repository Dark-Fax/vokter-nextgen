import type { CartLine } from '../context/CartContext'
import { findProduct, type FeaturedProduct } from '../data/products'
import { maxRedeemablePoints, pointValue, pointsEarnedFor } from './points'
import { priceOf } from './price'

// Envío: gratis desde $50.000 en productos (después de combos), igual que la tienda de referencia.
export const freeShippingFrom = 50000
export const shippingCost = 8000

export type Bundle = { id: string; name: string; tagline: string; productIds: string[]; discountRate: number }

// Combos con descuento. Un producto no puede estar en dos combos, así el descuento nunca se duplica.
export const bundles: Bundle[] = [
  { id: 'running', name: 'Combo Running', tagline: 'Audífonos de conducción ósea, conjunto deportivo y batería de bolsillo.', productIds: ['conduccion-osea-f805', 'conjunto-sport-aguamarina', 'power-bank-2300'], discountRate: 0.15 },
  { id: 'tech', name: 'Combo Escritorio', tagline: 'Teclado y mouse inalámbricos, multipuerto USB y micrófono inalámbrico.', productIds: ['teclado-inalambrico', 'multipuerto-usb', 'microfono-k9'], discountRate: 0.2 },
  { id: 'hogar', name: 'Combo Descanso', tagline: 'Tres juegos de sábanas Star Home 100% algodón.', productIds: ['sabana-flores-lila', 'sabana-hojas', 'sabana-ondas-gris'], discountRate: 0.1 },
]

const roundToHundred = (value: number) => Math.round(value / 100) * 100

export function bundleProducts(bundle: Bundle): FeaturedProduct[] {
  return bundle.productIds.flatMap((id) => findProduct(id) ?? [])
}

export function bundleListPrice(bundle: Bundle) {
  return bundleProducts(bundle).reduce((total, product) => total + priceOf(product), 0)
}

export function bundleSaving(bundle: Bundle) {
  return roundToHundred(bundleListPrice(bundle) * bundle.discountRate)
}

// Cada combo completo en el carrito descuenta su porcentaje. Si hay 2 unidades de cada producto,
// el combo se aplica 2 veces; si falta un producto, no se aplica.
export function appliedBundles(lines: CartLine[]) {
  const quantities = new Map(lines.map((line) => [line.product.id, line.quantity]))
  return bundles.flatMap((bundle) => {
    const sets = Math.min(...bundle.productIds.map((id) => quantities.get(id) ?? 0))
    return sets > 0 ? [{ bundle, sets, amount: bundleSaving(bundle) * sets }] : []
  })
}

export type OrderTotals = { subtotal: number; bundleDiscount: number; shipping: number; pointsUsed: number; discount: number; total: number; pointsEarned: number }

// Única fuente de verdad para los montos: la usan el carrito, el checkout y la validación de pedidos guardados.
// Los puntos solo descuentan productos (no el envío) y se ganan sobre lo pagado en productos.
export function orderTotals(lines: CartLine[], pointsRequested: number, pointsAvailable: number): OrderTotals {
  const subtotal = lines.reduce((total, line) => total + priceOf(line.product) * line.quantity, 0)
  const bundleDiscount = appliedBundles(lines).reduce((total, applied) => total + applied.amount, 0)
  const merchandise = subtotal - bundleDiscount
  const shipping = merchandise === 0 || merchandise >= freeShippingFrom ? 0 : shippingCost
  const pointsUsed = maxRedeemablePoints(Math.min(Math.max(0, Math.floor(pointsRequested)), pointsAvailable), merchandise)
  const discount = pointsUsed * pointValue
  const paidForProducts = merchandise - discount
  return { subtotal, bundleDiscount, shipping, pointsUsed, discount, total: paidForProducts + shipping, pointsEarned: pointsEarnedFor(paidForProducts) }
}

export function missingForFreeShipping(lines: CartLine[]) {
  const { subtotal, bundleDiscount } = orderTotals(lines, 0, 0)
  const merchandise = subtotal - bundleDiscount
  return merchandise > 0 && merchandise < freeShippingFrom ? freeShippingFrom - merchandise : 0
}
