import { Heart, ShoppingBag, UserRound } from 'lucide-react'
import { NavLink, Link } from 'react-router-dom'
import { useCart } from '../../hooks/useCart'

const navItems = [
  { label: 'Tienda', to: '/tienda' },
  { label: 'Categorías', to: '/tienda?category=Audio' },
  { label: 'Puntos', to: '/cuenta?section=points' },
]

export function Navbar() {
  const { itemCount } = useCart()
  return (
    <header className="topbar">
      <Link className="wordmark" to="/" aria-label="VOKTER inicio">VOKTER<span>/</span></Link>
      <nav className="desktop-nav" aria-label="Navegación principal">
        {navItems.map((item) => <NavLink key={item.to} to={item.to}>{item.label}</NavLink>)}
      </nav>
      <div className="nav-actions">
        <Link className="points-pill" to="/cuenta">240 pts</Link>
        <Link className="icon-button" to="/wishlist" aria-label="Ver favoritos"><Heart size={18} /></Link>
        <Link className="icon-button" to="/cuenta" aria-label="Ver cuenta"><UserRound size={18} /></Link>
        <Link className="icon-button cart-button" to="/carrito" aria-label="Ver carrito"><ShoppingBag size={18} /><span>{itemCount}</span></Link>
      </div>
    </header>
  )
}