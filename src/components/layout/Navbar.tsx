import { Heart, ShoppingBag, UserRound } from 'lucide-react'
import { NavLink, Link, useLocation } from 'react-router-dom'
import { useAccount } from '../../hooks/useAccount'
import { useCart } from '../../hooks/useCart'

const navItems = [
  { label: 'Tienda', to: '/tienda' },
  { label: 'Categorías', to: '/tienda?category=Audio' },
  { label: 'Puntos', to: '/cuenta?section=points' },
]

export function Navbar() {
  const { itemCount } = useCart()
  const { points } = useAccount()
  const location = useLocation()

  function handlePointsClick(event: React.MouseEvent<HTMLAnchorElement>) {
    if (location.pathname === '/cuenta') {
      event.preventDefault()
      document.getElementById('points-section')?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
  }
  return (
    <header className="topbar">
      <Link className="wordmark" to="/" aria-label="VOKTER inicio">VOKTER<span>/</span></Link>
      <nav className="desktop-nav" aria-label="Navegación principal">
        {navItems.map((item) => <NavLink key={item.to} to={item.to} onClick={item.label === 'Puntos' ? handlePointsClick : undefined}>{item.label}</NavLink>)}
      </nav>
      <div className="nav-actions">
        <Link className="points-pill" to="/cuenta?section=points" onClick={handlePointsClick}>{points} pts</Link>
        <Link className="icon-button" to="/wishlist" aria-label="Ver favoritos"><Heart size={18} /></Link>
        <Link className="icon-button" to="/cuenta" aria-label="Ver cuenta"><UserRound size={18} /></Link>
        <Link className="icon-button cart-button" to="/carrito" aria-label="Ver carrito"><ShoppingBag size={18} /><span>{itemCount}</span></Link>
      </div>
    </header>
  )
}