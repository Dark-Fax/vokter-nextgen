import { useEffect } from 'react'
import { HashRouter, Route, Routes, useLocation } from 'react-router-dom'
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
import './App.css'

function App() {
  return <HashRouter><ScrollToTop /><AccountProvider><WishlistProvider><CartProvider><div className="site-shell"><Navbar /><Routes><Route path="/" element={<HomePage />} /><Route path="/tienda" element={<CatalogPage />} /><Route path="/producto/:slug" element={<ProductPage />} /><Route path="/carrito" element={<CartPage />} /><Route path="/checkout" element={<CheckoutPage />} /><Route path="/wishlist" element={<WishlistPage />} /><Route path="/cuenta" element={<AccountPage />} /><Route path="/pedido/confirmado" element={<ConfirmationPage />} /></Routes><Footer /></div></CartProvider></WishlistProvider></AccountProvider></HashRouter>
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
