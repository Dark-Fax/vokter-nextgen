import { describe, expect, it } from 'vitest'
import { findProduct } from '../data/products'
import { orderTotals } from './pricing'
import { initialPoints, maxQuantity, parseAccount, parseCartLines, parseWishlist } from './storedData'

const customer = { name: 'Alex Rivera', email: 'alex@correo.com', phone: '3001234567', address: 'Calle 100 # 15-20', city: 'Bogotá' }

function validOrder(id: string, items: [string, number][], pointsUsed = 0, pointsAvailable = initialPoints) {
  const lines = items.map(([productId, quantity]) => ({ product: findProduct(productId)!, quantity }))
  return { id, createdAt: '2026-09-28T12:00:00.000Z', lines, customer, ...orderTotals(lines, pointsUsed, pointsAvailable) }
}

describe('carrito guardado', () => {
  it('descarta productos inexistentes y usa el precio del catálogo', () => {
    const lines = parseCartLines([{ product: { id: 'no-existe' }, quantity: 1 }, { product: { id: 'parlante-s520', price: '$1' }, quantity: 1 }])
    expect(lines).toHaveLength(1)
    expect(lines[0].product.price).toBe('$85.000')
  })

  it.each([['decimal', 0.5], ['negativa', -3], ['cero', 0], ['texto', '5'], ['infinita', Infinity], ['NaN', Number.NaN]])('descarta cantidad %s', (_, quantity) => {
    expect(parseCartLines([{ product: { id: 'parlante-s520' }, quantity }])).toEqual([])
  })

  it(`limita la cantidad a ${maxQuantity}`, () => {
    expect(parseCartLines([{ product: { id: 'parlante-s520' }, quantity: 1e9 }])[0].quantity).toBe(maxQuantity)
  })

  it('une líneas duplicadas del mismo producto', () => {
    expect(parseCartLines([{ product: { id: 'parlante-s520' }, quantity: 2 }, { product: { id: 'parlante-s520' }, quantity: 3 }])).toEqual([{ product: findProduct('parlante-s520'), quantity: 5 }])
  })

  it.each([null, 'texto', { hola: 1 }, [null, 1, 'x']])('ignora datos que no son un carrito: %j', (raw) => {
    expect(parseCartLines(raw)).toEqual([])
  })
})

describe('favoritos guardados', () => {
  it('solo conserva productos existentes y sin duplicados', () => {
    expect(parseWishlist(['parlante-s520', 'parlante-s520', 'falso', 42])).toEqual(['parlante-s520'])
  })
})

describe('cuenta guardada', () => {
  it('ignora un saldo de puntos escrito a mano', () => {
    expect(parseAccount({ points: 99999999, orders: [] }).points).toBe(initialPoints)
  })

  it('calcula el saldo desde el historial', () => {
    const first = validOrder('VK-AAA111', [['parlante-s520', 1]])
    const second = validOrder('VK-BBB222', [['cable-rca-2x1', 1]], 40, initialPoints + first.pointsEarned)
    const account = parseAccount({ orders: [second, first] })
    expect(account.orders.map((order) => order.id)).toEqual(['VK-BBB222', 'VK-AAA111'])
    expect(account.points).toBe(initialPoints + first.pointsEarned - 40 + second.pointsEarned)
  })

  it('descarta un pedido con el total modificado', () => {
    const order = validOrder('VK-AAA111', [['parlante-s520', 1]])
    expect(parseAccount({ orders: [{ ...order, total: -500000 }] }).orders).toEqual([])
    expect(parseAccount({ orders: [{ ...order, pointsEarned: 999999 }] }).orders).toEqual([])
  })

  it('descarta un pedido que usa más puntos de los que había', () => {
    const lines = [{ product: findProduct('parlante-s520')!, quantity: 1 }]
    const greedy = { id: 'VK-CCC333', createdAt: '2026-09-28T12:00:00.000Z', lines, customer, ...orderTotals(lines, 800, 800) }
    expect(parseAccount({ orders: [greedy] }).orders).toEqual([])
  })

  it('descarta pedidos incompletos sin romper la lectura', () => {
    expect(parseAccount({ orders: [{ id: 'VK-ROTO', total: 10 }, null, 'x', { id: '<script>' }] })).toEqual({ points: initialPoints, orders: [] })
  })

  it('acepta pedidos hechos antes de combos y envío (sin esos campos)', () => {
    const lines = [{ product: findProduct('parlante-s520')!, quantity: 1 }]
    const legacy = { id: 'VK-OLD111', createdAt: '2026-09-27T12:00:00.000Z', lines, customer, subtotal: 85000, pointsUsed: 100, discount: 10000, total: 75000, pointsEarned: 75 }
    const account = parseAccount({ orders: [legacy] })
    expect(account.orders).toHaveLength(1)
    expect(account.points).toBe(initialPoints - 100 + 75)
  })

  it('limpia los caracteres < y > de los datos del cliente', () => {
    const order = validOrder('VK-AAA111', [['parlante-s520', 1]])
    const parsed = parseAccount({ orders: [{ ...order, customer: { ...customer, name: '<img src=x onerror=alert(1)>Alex' } }] })
    expect(parsed.orders[0].customer.name).toBe('img src=x onerror=alert(1)Alex')
  })
})
