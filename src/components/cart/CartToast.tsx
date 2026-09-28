import { Check, X } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'
import { useCart } from '../../hooks/useCart'

export function CartToast() {
  const { notice, dismissNotice } = useCart()
  const { pathname } = useLocation()
  if (!notice || pathname === '/carrito' || pathname === '/checkout') return null
  return <div className="cart-toast" role="status" key={notice.id}><span className="cart-toast-icon"><Check size={16} /></span><div><strong>{notice.title}</strong><span>{notice.detail}</span></div><Link to="/carrito" onClick={dismissNotice}>Ver carrito</Link><button type="button" aria-label="Cerrar aviso" onClick={dismissNotice}><X size={16} /></button></div>
}
