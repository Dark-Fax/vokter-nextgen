import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { Footer } from './components/layout/Footer'
import { Navbar } from './components/layout/Navbar'
import { CartPage, AccountPage, CheckoutPage, ConfirmationPage, WishlistPage } from './pages/EmptyPage'
import { CatalogPage } from './pages/CatalogPage'
import { HomePage } from './pages/HomePage'
import { ProductPage } from './pages/ProductPage'
import './App.css'

function App() {
  return <BrowserRouter><div className="site-shell"><Navbar /><Routes><Route path="/" element={<HomePage />} /><Route path="/tienda" element={<CatalogPage />} /><Route path="/producto/:slug" element={<ProductPage />} /><Route path="/carrito" element={<CartPage />} /><Route path="/checkout" element={<CheckoutPage />} /><Route path="/wishlist" element={<WishlistPage />} /><Route path="/cuenta" element={<AccountPage />} /><Route path="/pedido/confirmado" element={<ConfirmationPage />} /></Routes><Footer /></div></BrowserRouter>
}

export default App
