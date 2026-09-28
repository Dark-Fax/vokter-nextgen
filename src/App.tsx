import { useEffect, useLayoutEffect, useRef } from 'react'
import { HashRouter, Route, Routes, useLocation, useNavigationType } from 'react-router-dom'
import { Compass } from 'lucide-react'
import { EmptyState } from './components/layout/EmptyState'
import { ErrorBoundary } from './components/layout/ErrorBoundary'
import { Footer } from './components/layout/Footer'
import { Navbar } from './components/layout/Navbar'
import { AccountProvider } from './context/AccountContext'
import { CartProvider } from './context/CartContext'
import { WishlistProvider } from './context/WishlistContext'
import { CartPage, WishlistPage } from './pages/EmptyPage'
import { AccountPage } from './pages/AccountPage'
import { CheckoutPage } from './pages/CheckoutPage'
import { ConfirmationPage } from './pages/ConfirmationPage'
import { CatalogPage } from './pages/CatalogPage'
import { HomePage } from './pages/HomePage'
import { ProductPage } from './pages/ProductPage'
import { DownloadPage } from './pages/DownloadPage'
import { CartToast } from './components/cart/CartToast'
import './App.css'

function App() {
  return <HashRouter><ScrollToTop /><AccountProvider><WishlistProvider><CartProvider><div className="site-shell"><Navbar /><AppRoutes /><Footer /></div><CartToast /></CartProvider></WishlistProvider></AccountProvider></HashRouter>
}

// La red de seguridad se reinicia al cambiar de ruta: un fallo en una pantalla no bloquea las demás.
function AppRoutes() {
  const { pathname } = useLocation()
  return <ErrorBoundary key={pathname}><main className="route-view"><Routes><Route path="/" element={<HomePage />} /><Route path="/tienda" element={<CatalogPage />} /><Route path="/producto/:slug" element={<ProductPage />} /><Route path="/carrito" element={<CartPage />} /><Route path="/checkout" element={<CheckoutPage />} /><Route path="/wishlist" element={<WishlistPage />} /><Route path="/cuenta" element={<AccountPage />} /><Route path="/pedido/confirmado" element={<ConfirmationPage />} /><Route path="/app" element={<DownloadPage />} /><Route path="*" element={<EmptyState icon={<Compass />} eyebrow="404 / SIN RUTA" title="Esta página no existe." description="Revisa el enlace o vuelve al inicio para seguir comprando." action="Ir al inicio" to="/" />} /></Routes></main></ErrorBoundary>
}

// Control del desplazamiento entre pantallas:
// - al entrar a una pantalla nueva se empieza desde arriba;
// - con "atrás" se vuelve al punto exacto donde estaba la persona;
// - los cambios de filtro dentro de la tienda no mueven la página (los maneja CatalogPage).
function ScrollToTop() {
  const { pathname, search, key } = useLocation()
  const navigationType = useNavigationType()
  const positions = useRef(new Map<string, number>())
  const currentKey = useRef(key)
  const previousPathname = useRef<string | null>(null)

  useEffect(() => {
    const remember = () => positions.current.set(currentKey.current, window.scrollY)
    window.addEventListener('scroll', remember, { passive: true })
    return () => window.removeEventListener('scroll', remember)
  }, [])

  // Antes de pintar: así un recorte del scroll al cambiar de pantalla no se guarda en la pantalla anterior.
  useLayoutEffect(() => {
    currentKey.current = key
    const saved = positions.current.get(key)
    const changedScreen = previousPathname.current !== pathname
    previousPathname.current = pathname
    if (navigationType === 'POP' && saved !== undefined) {
      requestAnimationFrame(() => window.scrollTo({ top: saved, behavior: 'auto' }))
      return
    }
    if (!changedScreen) return
    if (pathname === '/cuenta' && new URLSearchParams(search).get('section') === 'points') return
    if (pathname === '/tienda' && new URLSearchParams(search).get('category')) return
    window.scrollTo({ top: 0, behavior: 'auto' })
  }, [key, pathname, search, navigationType])
  return null
}

export default App
