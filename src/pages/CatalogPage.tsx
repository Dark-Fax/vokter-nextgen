import { Search } from 'lucide-react'
import { useSearchParams } from 'react-router-dom'
import { ProductCard } from '../components/catalog/ProductCard'
import { catalogProducts } from '../data/products'

export function CatalogPage() {
  const [searchParams] = useSearchParams()
  const category = searchParams.get('category')
  const products = category ? catalogProducts.filter((product) => product.category === category) : catalogProducts
  return <section className="page-section catalog-page"><div className="page-intro"><p className="eyebrow">CATÁLOGO / 06 PRODUCTOS</p><h1>Todo lo que<br /><em>te mueve.</em></h1><p>Una selección corta de tecnología, energía y gear para tu día.</p></div><div className="catalog-toolbar"><label className="search-field"><Search size={17} /><input aria-label="Buscar productos" placeholder="Buscar productos" /></label><select aria-label="Ordenar productos" defaultValue="relevance"><option value="relevance">Más relevantes</option><option value="price">Menor precio</option><option value="rating">Mejor rating</option></select></div><div className="catalog-layout"><aside><p className="eyebrow">FILTRAR</p><strong>Categorías</strong><LinkList label="Todas" to="/tienda" /><LinkList label="Audio" to="/tienda?category=Audio" /><LinkList label="Energía" to="/tienda?category=Energía" /><LinkList label="Gear" to="/tienda?category=Gear" /></aside><div className="product-grid">{products.map((product) => <ProductCard key={product.id} product={product} />)}</div></div></section>
}

function LinkList({ label, to }: { label: string; to: string }) { return <a className="filter-link" href={to}>{label}</a> }