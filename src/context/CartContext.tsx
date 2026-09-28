import { createContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import type { FeaturedProduct } from '../data/products'
import { maxQuantity, parseCartLines, readStored } from '../utils/storedData'

export type CartLine = { product: FeaturedProduct; quantity: number }
export type CartNotice = { id: number; title: string; detail: string }
type CartContextValue = { lines: CartLine[]; itemCount: number; notice: CartNotice | null; dismissNotice: () => void; addToCart: (product: FeaturedProduct) => void; addBundle: (name: string, products: FeaturedProduct[]) => void; updateQuantity: (productId: string, quantity: number) => void; removeFromCart: (productId: string) => void; clearCart: () => void }
const CartContext = createContext<CartContextValue | null>(null)
const storageKey = 'vokter-cart'
const noticeDuration = 2800

function readCart(): CartLine[] {
  return parseCartLines(readStored(storageKey))
}

function withProduct(current: CartLine[], product: FeaturedProduct) {
  const existing = current.find((line) => line.product.id === product.id)
  return existing ? current.map((line) => line.product.id === product.id ? { ...line, quantity: Math.min(maxQuantity, line.quantity + 1) } : line) : [...current, { product, quantity: 1 }]
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>(readCart)
  const [notice, setNotice] = useState<CartNotice | null>(null)
  const noticeTimer = useRef<number | undefined>(undefined)
  useEffect(() => {
    try {
      window.localStorage.setItem(storageKey, JSON.stringify(lines))
    } catch {
      // El WebView puede tener el almacenamiento bloqueado: la sesión sigue en memoria.
    }
  }, [lines])
  useEffect(() => () => window.clearTimeout(noticeTimer.current), [])
  const itemCount = useMemo(() => lines.reduce((total, line) => total + line.quantity, 0), [lines])

  // Aviso breve al agregar: en el teléfono el contador del carrito casi no se ve.
  function announce(title: string, detail: string) {
    window.clearTimeout(noticeTimer.current)
    setNotice({ id: Date.now(), title, detail })
    noticeTimer.current = window.setTimeout(() => setNotice(null), noticeDuration)
  }

  function addToCart(product: FeaturedProduct) {
    setLines((current) => withProduct(current, product))
    announce('Agregado al carrito', product.name)
  }
  function addBundle(name: string, products: FeaturedProduct[]) {
    setLines((current) => products.reduce(withProduct, current))
    announce(`${name} agregado`, `${products.length} productos con descuento aplicado`)
  }
  function updateQuantity(productId: string, quantity: number) { setLines((current) => quantity > 0 ? current.map((line) => line.product.id === productId ? { ...line, quantity: Math.min(maxQuantity, Math.floor(quantity)) } : line) : current.filter((line) => line.product.id !== productId)) }
  function removeFromCart(productId: string) { updateQuantity(productId, 0) }
  function clearCart() { setLines([]) }
  function dismissNotice() { window.clearTimeout(noticeTimer.current); setNotice(null) }
  return <CartContext.Provider value={{ lines, itemCount, notice, dismissNotice, addToCart, addBundle, updateQuantity, removeFromCart, clearCart }}>{children}</CartContext.Provider>
}

export { CartContext }
