import { Heart } from 'lucide-react'
import { Link } from 'react-router-dom'
import type { FeaturedProduct } from '../../data/products'

export function ProductCard({ product }: { product: FeaturedProduct }) {
  return (
    <article className={`product-card product-${product.state}`}>
      <div className="product-visual"><span className="state-badge">{product.label}</span><button className="card-heart" type="button" aria-label={`Guardar ${product.name}`}><Heart size={17} /></button><div className="product-mark">{product.mark}</div></div>
      <div className="product-meta"><span>{product.category}</span><span>{product.rating} / 5</span></div>
      <h3><Link to={`/producto/${product.id}`}>{product.name}</Link></h3>
      <strong className="product-price">{product.price}</strong>
    </article>
  )
}