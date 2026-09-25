import { ArrowUpRight, Minus, Plus, ShoppingBag, Trash2 } from 'lucide-react'
import { useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { ProductCard } from '../components/catalog/ProductCard'
import { EmptyState } from '../components/layout/EmptyState'
import { useAccount } from '../hooks/useAccount'
import { pointValue } from '../utils/points'
import { useCart } from '../hooks/useCart'
import { useWishlist } from '../hooks/useWishlist'
import { catalogProducts } from '../data/products'

export function CartPage() {
  const { lines, subtotal, updateQuantity, removeFromCart } = useCart()
  if (!lines.length) return <EmptyState icon={<ShoppingBag />} eyebrow="CARRITO / 00" title="Tu carrito todavía está vacío." description="Guarda algo para continuar cuando estés listo." action="Explorar tienda" to="/tienda" />
  return <section className="page-section cart-page"><p className="eyebrow">CARRITO / {lines.length.toString().padStart(2, '0')} PRODUCTOS</p><h1>Lo que elegiste<br /><em>va aquí.</em></h1><div className="cart-layout"><div className="cart-lines">{lines.map((line) => <article className="cart-line" key={line.product.id}><div className={`cart-line-visual product-${line.product.state}`}><span>{line.product.mark}</span></div><div className="cart-line-copy"><p className="eyebrow">{line.product.category}</p><h3>{line.product.name}</h3><strong>{line.product.price}</strong><div className="quantity-control"><button type="button" onClick={() => updateQuantity(line.product.id, line.quantity - 1)} aria-label="Reducir cantidad"><Minus size={14} /></button><span>{line.quantity}</span><button type="button" onClick={() => updateQuantity(line.product.id, line.quantity + 1)} aria-label="Aumentar cantidad"><Plus size={14} /></button></div></div><button className="remove-button" type="button" onClick={() => removeFromCart(line.product.id)} aria-label={`Eliminar ${line.product.name}`}><Trash2 size={16} /></button></article>)}</div><aside className="cart-summary"><p className="eyebrow">RESUMEN</p><div><span>Subtotal</span><strong>${subtotal.toLocaleString('es-CO')}</strong></div><div><span>Envío</span><strong>Gratis</strong></div><div className="summary-total"><span>Total</span><strong>${subtotal.toLocaleString('es-CO')}</strong></div><Link className="primary-link" to="/checkout">Continuar al checkout <ArrowUpRight size={17} /></Link></aside></div></section>
}

export function WishlistPage() {
  const { wishlistIds } = useWishlist()
  const products = catalogProducts.filter((product) => wishlistIds.includes(product.id))
  if (!products.length) return <EmptyState icon={<span>♡</span>} eyebrow="WISHLIST / 00" title="Tu wishlist está esperando." description="Marca productos para volver a ellos después." action="Ver productos" to="/tienda" />
  return <section className="page-section"><p className="eyebrow">WISHLIST / {products.length.toString().padStart(2, '0')} GUARDADOS</p><h1>Tus próximos<br /><em>favoritos.</em></h1><div className="product-grid wishlist-grid">{products.map((product) => <ProductCard key={product.id} product={product} />)}</div></section>
}

export function AccountPage() {
  const [searchParams] = useSearchParams()
  const { points, orders } = useAccount()
  const lastOrder = orders[0]
  useEffect(() => { if (searchParams.get('section') === 'points') document.getElementById('points-section')?.scrollIntoView({ behavior: 'smooth', block: 'center' }) }, [searchParams])
  return <section className="page-section account-page"><p className="eyebrow">CUENTA / DEMO</p><h1>Tu espacio<br /><em>VOKTER.</em></h1><div className="account-grid"><div><p className="eyebrow">PERFIL</p><h2>Hola, {lastOrder ? lastOrder.customer.name.split(' ')[0] : 'Alex'}.</h2>{lastOrder ? <p>Tu último pedido <strong>{lastOrder.id}</strong> quedó por ${lastOrder.total.toLocaleString('es-CO')}. Llevas {orders.length} {orders.length === 1 ? 'pedido' : 'pedidos'} en esta demo.</p> : <p>Tu cuenta simulada está lista para conectar pedidos y preferencias.</p>}{lastOrder ? <Link className="text-link" to={`/pedido/confirmado?pedido=${lastOrder.id}`}>Ver último pedido <ArrowUpRight size={15} /></Link> : null}</div><div className="points-card" id="points-section"><p className="eyebrow">PUNTOS VOKTER</p><strong>{points}</strong><span>puntos disponibles</span><p>Acumula 1 punto por cada $1.000 de compra y canjéalos en el checkout: cada punto vale ${pointValue}.</p></div></div></section>
}
