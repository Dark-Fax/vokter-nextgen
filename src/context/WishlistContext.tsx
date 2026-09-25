import { createContext, useEffect, useState, type ReactNode } from 'react'

type WishlistContextValue = {
  wishlistIds: string[]
  hasInWishlist: (productId: string) => boolean
  toggleWishlist: (productId: string) => void
}

const WishlistContext = createContext<WishlistContextValue | null>(null)
const storageKey = 'vokter-wishlist'

function readWishlist() {
  try {
    const stored = window.localStorage.getItem(storageKey)
    const parsed: unknown = stored ? JSON.parse(stored) : []
    return Array.isArray(parsed) && parsed.every((id) => typeof id === 'string') ? parsed : []
  } catch {
    return []
  }
}

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [wishlistIds, setWishlistIds] = useState<string[]>(readWishlist)

  useEffect(() => {
    window.localStorage.setItem(storageKey, JSON.stringify(wishlistIds))
  }, [wishlistIds])

  function toggleWishlist(productId: string) {
    setWishlistIds((current) => current.includes(productId) ? current.filter((id) => id !== productId) : [...current, productId])
  }

  return <WishlistContext.Provider value={{ wishlistIds, hasInWishlist: (id) => wishlistIds.includes(id), toggleWishlist }}>{children}</WishlistContext.Provider>
}

export { WishlistContext }