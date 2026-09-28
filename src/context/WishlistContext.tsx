import { createContext, useEffect, useState, type ReactNode } from 'react'
import { parseWishlist, readStored } from '../utils/storedData'

type WishlistContextValue = {
  wishlistIds: string[]
  toggleWishlist: (productId: string) => void
}

const WishlistContext = createContext<WishlistContextValue | null>(null)
const storageKey = 'vokter-wishlist'

function readWishlist() {
  return parseWishlist(readStored(storageKey))
}

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [wishlistIds, setWishlistIds] = useState<string[]>(readWishlist)

  useEffect(() => {
    try {
      window.localStorage.setItem(storageKey, JSON.stringify(wishlistIds))
    } catch {
      // El WebView puede tener el almacenamiento bloqueado: la sesión sigue en memoria.
    }
  }, [wishlistIds])

  useEffect(() => {
    function syncWishlist(event: StorageEvent) {
      if (event.key !== storageKey) return
      setWishlistIds(readWishlist())
    }
    window.addEventListener('storage', syncWishlist)
    return () => window.removeEventListener('storage', syncWishlist)
  }, [])

  function toggleWishlist(productId: string) {
    setWishlistIds((current) => current.includes(productId) ? current.filter((id) => id !== productId) : [...current, productId])
  }

  return <WishlistContext.Provider value={{ wishlistIds, toggleWishlist }}>{children}</WishlistContext.Provider>
}

export { WishlistContext }