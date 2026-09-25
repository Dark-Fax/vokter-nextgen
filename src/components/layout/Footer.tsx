import { ArrowUpRight } from 'lucide-react'
import { Link } from 'react-router-dom'

export function Footer() {
  return (
    <footer className="site-footer">
      <div><Link className="wordmark" to="/">VOKTER<span>/</span></Link><p>Gear esencial para el ritmo diario.</p></div>
      <div className="footer-links"><div><small>EXPLORAR</small><Link to="/tienda">Tienda</Link><Link to="/wishlist">Wishlist</Link><Link to="/cuenta">Mi cuenta</Link></div><div><small>SOPORTE</small><Link to="/checkout">Checkout</Link><Link to="/cuenta">Puntos VOKTER</Link><Link to="/">Descargar app <ArrowUpRight size={13} /></Link></div></div>
      <p className="footer-legal">© 2026 VOKTER. Todos los derechos reservados.</p>
    </footer>
  )
}