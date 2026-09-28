import { RotateCcw, TriangleAlert } from 'lucide-react'
import { Component, type ReactNode } from 'react'

const storageKeys = ['vokter-cart', 'vokter-wishlist', 'vokter-account']

// Última red de seguridad: si una vista falla al renderizar, se muestra un aviso con salida
// en lugar de dejar la app en blanco (en el APK no hay barra de direcciones para recargar).
export class ErrorBoundary extends Component<{ children: ReactNode }, { hasError: boolean }> {
  state = { hasError: false }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  resetStoredData = () => {
    try {
      storageKeys.forEach((key) => window.localStorage.removeItem(key))
    } catch {
      // Sin acceso al almacenamiento solo queda recargar.
    }
    window.location.hash = '#/'
    window.location.reload()
  }

  render() {
    if (!this.state.hasError) return this.props.children
    return <section className="empty-page" role="alert"><div className="empty-icon"><TriangleAlert /></div><p className="eyebrow">ALGO SALIÓ MAL</p><h1>No pudimos mostrar esta pantalla.</h1><p>Los datos guardados en este dispositivo parecen dañados. Puedes restablecerlos: se vaciarán el carrito, los favoritos y el historial de pedidos.</p><button className="primary-link" type="button" onClick={this.resetStoredData}>Restablecer datos <RotateCcw size={17} /></button></section>
  }
}
