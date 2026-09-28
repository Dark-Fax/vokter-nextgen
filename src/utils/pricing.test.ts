import { describe, expect, it } from 'vitest'
import type { CartLine } from '../context/CartContext'
import { findProduct } from '../data/products'
import { appliedBundles, bundleProducts, bundles, bundleSaving, freeShippingFrom, missingForFreeShipping, orderTotals, shippingCost } from './pricing'

function line(id: string, quantity = 1): CartLine {
  const product = findProduct(id)
  if (!product) throw new Error(`Producto de prueba inexistente: ${id}`)
  return { product, quantity }
}

describe('combos', () => {
  it('todos los productos de los combos existen en el catálogo', () => {
    for (const bundle of bundles) expect(bundleProducts(bundle)).toHaveLength(bundle.productIds.length)
  })

  it('ningún producto pertenece a dos combos (el descuento no se duplica)', () => {
    const ids = bundles.flatMap((bundle) => bundle.productIds)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('solo se aplica con el combo completo', () => {
    const running = bundles[0]
    const partial = running.productIds.slice(0, 2).map((id) => line(id))
    expect(appliedBundles(partial)).toEqual([])
    expect(appliedBundles(running.productIds.map((id) => line(id)))).toHaveLength(1)
  })

  it('se aplica tantas veces como sets completos haya', () => {
    const running = bundles[0]
    const lines = running.productIds.map((id, index) => line(id, index === 0 ? 3 : 2))
    expect(appliedBundles(lines)[0].sets).toBe(2)
    expect(orderTotals(lines, 0, 0).bundleDiscount).toBe(bundleSaving(running) * 2)
  })

  it('el ahorro se redondea a cientos de pesos', () => {
    for (const bundle of bundles) expect(bundleSaving(bundle) % 100).toBe(0)
  })
})

describe('envío', () => {
  it(`cobra $${shippingCost} por debajo de $${freeShippingFrom} y es gratis desde ese monto`, () => {
    expect(orderTotals([line('cable-rca-2x1')], 0, 0).shipping).toBe(shippingCost)
    expect(orderTotals([line('parlante-s520')], 0, 0).shipping).toBe(0)
  })

  it('el envío se evalúa después del descuento por combo', () => {
    const hogar = bundles.find((bundle) => bundle.id === 'hogar')!
    const totals = orderTotals(hogar.productIds.map((id) => line(id)), 0, 0)
    expect(totals.subtotal - totals.bundleDiscount).toBeGreaterThanOrEqual(freeShippingFrom)
    expect(totals.shipping).toBe(0)
  })

  it('un carrito vacío no cobra envío', () => {
    expect(orderTotals([], 0, 0)).toMatchObject({ subtotal: 0, shipping: 0, total: 0 })
  })

  it('informa cuánto falta para el envío gratis', () => {
    expect(missingForFreeShipping([line('cable-rca-2x1')])).toBe(freeShippingFrom - 4500)
    expect(missingForFreeShipping([line('parlante-s520')])).toBe(0)
  })
})

describe('puntos', () => {
  it('no deja usar más puntos de los disponibles', () => {
    expect(orderTotals([line('parlante-s520')], 99999999, 240).pointsUsed).toBe(240)
  })

  it('los puntos no descuentan el envío: el total nunca baja del costo de envío', () => {
    const totals = orderTotals([line('cable-rca-2x1')], 99999999, 99999999)
    expect(totals.discount).toBe(4500)
    expect(totals.total).toBe(shippingCost)
  })

  it('el total nunca es negativo, ni con puntos pedidos negativos', () => {
    const totals = orderTotals([line('parlante-s520')], -5000, 240)
    expect(totals.pointsUsed).toBe(0)
    expect(totals.total).toBe(85000)
  })

  it('se gana 1 punto por cada $1.000 pagados en productos', () => {
    expect(orderTotals([line('parlante-s520')], 0, 0).pointsEarned).toBe(85)
    expect(orderTotals([line('parlante-s520')], 240, 240).pointsEarned).toBe(61)
  })
})
