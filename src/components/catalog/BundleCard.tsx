import { PackagePlus } from 'lucide-react'
import { Link } from 'react-router-dom'
import { productSrcSet } from '../../data/products'
import { useCart } from '../../hooks/useCart'
import { bundleListPrice, bundleProducts, bundleSaving, type Bundle } from '../../utils/pricing'
import { formatPrice } from '../../utils/price'

export function BundleCard({ bundle }: { bundle: Bundle }) {
  const { addBundle } = useCart()
  const products = bundleProducts(bundle)
  const listPrice = bundleListPrice(bundle)
  return <article className="bundle-card"><div className="bundle-media">{products.map((product) => <Link key={product.id} to={`/producto/${product.id}`} aria-label={`Ver ${product.name}`}><img src={product.image} srcSet={productSrcSet(product)} sizes="(min-width: 768px) 130px, 33vw" alt={product.name} width={640} height={800} loading="lazy" decoding="async" /></Link>)}</div><div className="bundle-copy"><span className="bundle-rate">−{Math.round(bundle.discountRate * 100)}%</span><h3>{bundle.name}</h3><p>{bundle.tagline}</p><div className="bundle-price"><strong>{formatPrice(listPrice - bundleSaving(bundle))}</strong><s>{formatPrice(listPrice)}</s></div><button className="primary-link" type="button" onClick={() => addBundle(bundle.name, products)}>Agregar combo <PackagePlus size={17} /></button></div></article>
}
