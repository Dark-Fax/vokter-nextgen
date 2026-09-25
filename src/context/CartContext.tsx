import { createContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import type { FeaturedProduct } from '../data/products'

export type CartLine = { product: FeaturedProduct; quantity: number }
type CartContextValue = { lines: CartLine[]; itemCount: number; subtotal: number; addToCart: (product: FeaturedProduct) => void; updateQuantity: (productId: string, quantity: number) => void; removeFromCart: (productId: string) => void; clearCart: () => void }
const CartContext = createContext<CartContextValue | null>(null)
const storageKey = 'vokter-cart'

function readCart(): CartLine[] {
  try {
    const stored = window.localStorage.getItem(storageKey)
    const parsed: unknown = stored ? JSON.parse(stored) : []
    if (!Array.isArray(parsed)) return []
    return parsed.filter((line): line is CartLine => typeof line === 'object' && line !== null && 'product' in line && 'quantity' in line && typeof line.quantity === 'number' && line.quantity > 0)
  } catch {
    return []
  }
}

function priceOf(product: FeaturedProduct) { return Number(product.price.replace(/[^0-9]/g, '')) }

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>(readCart)
  useEffect(() => { window.localStorage.setItem(storageKey, JSON.stringify(lines)) }, [lines])
  const itemCount = useMemo(() => lines.reduce((total, line) => total + line.quantity, 0), [lines])
  const subtotal = useMemo(() => lines.reduce((total, line) => total + priceOf(line.product) * line.quantity, 0), [lines])
  function addToCart(product: FeaturedProduct) { setLines((current) => { const existing = current.find((line) => line.product.id === product.id); return existing ? current.map((line) => line.product.id === product.id ? { ...line, quantity: line.quantity + 1 } : line) : [...current, { product, quantity: 1 }] }) }
  function updateQuantity(productId: string, quantity: number) { setLines((current) => quantity > 0 ? current.map((line) => line.product.id === productId ? { ...line, quantity } : line) : current.filter((line) => line.product.id !== productId)) }
  function removeFromCart(productId: string) { updateQuantity(productId, 0) }
  function clearCart() { setLines([]) }
  return <CartContext.Provider value={{ lines, itemCount, subtotal, addToCart, updateQuantity, removeFromCart, clearCart }}>{children}</CartContext.Provider>
}

export { CartContext }