import { Heart, ShoppingBag, Star } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useCart } from '../../hooks/useCart'
import { useWishlist } from '../../hooks/useWishlist'
import { productSrcSet, type FeaturedProduct } from '../../data/products'

export function ProductCard({ product }: { product: FeaturedProduct }) {
  const { addToCart } = useCart()
  const { wishlistIds, toggleWishlist } = useWishlist()
  const isWishlisted = wishlistIds.includes(product.id)
  return (
    <article className={`product-card product-${product.state}`}>
      <Link className="product-card-link" to={`/producto/${product.id}`}>
        <div className="product-visual">
          <img src={product.image} srcSet={productSrcSet(product)} sizes="(min-width: 1280px) 240px, (min-width: 768px) 30vw, 50vw" alt={product.name} width={640} height={800} loading="lazy" decoding="async" />
          {product.label ? <span className="state-badge">{product.label}</span> : null}
        </div>
        <div className="product-meta"><span>{product.category}</span><span><Star size={11} fill="currentColor" /> {product.rating}</span></div>
        <h3>{product.name}</h3>
        <strong className="product-price">{product.price}</strong>
      </Link>
      <button className={`card-heart ${isWishlisted ? 'is-active' : ''}`} type="button" aria-label={`Guardar ${product.name}`} aria-pressed={isWishlisted} onClick={() => toggleWishlist(product.id)}><Heart size={17} fill={isWishlisted ? 'currentColor' : 'none'} /></button>
      <button className="add-button" type="button" onClick={() => addToCart(product)} aria-label={`Agregar ${product.name} al carrito`}><ShoppingBag size={16} /></button>
    </article>
  )
}
