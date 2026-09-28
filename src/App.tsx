import { useEffect } from 'react'
import { HashRouter, Route, Routes, useLocation } from 'react-router-dom'
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

function ScrollToTop() {
  const { pathname, search } = useLocation()
  useEffect(() => {
    if (pathname === '/cuenta' && new URLSearchParams(search).get('section') === 'points') return
    window.scrollTo({ top: 0, behavior: 'auto' })
  }, [pathname, search])
  return null
}

export default App
