import type { FeaturedProduct } from '../data/products'

export function parsePrice(value: string) {
  return Number(value.replace(/[^0-9]/g, ''))
}

export function priceOf(product: FeaturedProduct) {
  return parsePrice(product.price)
}

export function formatPrice(value: number) {
  return `$${value.toLocaleString('es-CO')}`
}
