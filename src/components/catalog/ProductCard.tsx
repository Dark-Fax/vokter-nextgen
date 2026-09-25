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
      <Link className="product-card-link" to={`/producto/${product.id}`} aria-label={`Ver detalle de ${product.name}`}>
        <div className="product-visual"><span className="state-badge">{product.label}</span><div className="product-mark">{product.mark}</div></div>
        <div className="product-meta"><span>{product.category}</span><span>{product.rating} / 5</span></div>
        <h3>{product.name}</h3>
        <strong className="product-price">{product.price}</strong>
      </Link>
      <button className={`card-heart ${isWishlisted ? 'is-active' : ''}`} type="button" aria-label={`Guardar ${product.name}`} onClick={() => toggleWishlist(product.id)}><Heart size={17} fill={isWishlisted ? 'currentColor' : 'none'} /></button>
      <button className="add-button" type="button" onClick={() => addToCart(product)} aria-label={`Agregar ${product.name} al carrito`}><ShoppingBag size={15} /></button>
    </article>
  )
}