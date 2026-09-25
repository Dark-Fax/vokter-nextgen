import { Heart, ShoppingBag } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useCart } from '../../hooks/useCart'
import { useWishlist } from '../../hooks/useWishlist'
import type { FeaturedProduct } from '../../data/products'

export function ProductCard({ product }: { product: FeaturedProduct }) {
  const { addToCart } = useCart()
  const { wishlistIds, toggleWishlist } = useWishlist()
  const isWishlisted = wishlistIds.includes(product.id)
  return (
    <article className={`product-card product-${product.state}`}>
      <div className="product-visual"><span className="state-badge">{product.label}</span><button className={`card-heart ${isWishlisted ? 'is-active' : ''}`} type="button" aria-label={`Guardar ${product.name}`} onClick={() => toggleWishlist(product.id)}><Heart size={17} fill={isWishlisted ? 'currentColor' : 'none'} /></button><div className="product-mark">{product.mark}</div></div>
      <div className="product-meta"><span>{product.category}</span><span>{product.rating} / 5</span></div>
      <h3><Link to={`/producto/${product.id}`}>{product.name}</Link></h3>
      <div className="card-footer"><strong className="product-price">{product.price}</strong><button className="add-button" type="button" onClick={() => addToCart(product)} aria-label={`Agregar ${product.name} al carrito`}><ShoppingBag size={15} /></button></div>
    </article>
  )
}