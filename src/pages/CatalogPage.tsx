import { Search } from 'lucide-react'
import { useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { ProductCard } from '../components/catalog/ProductCard'
import { catalogProducts } from '../data/products'
import { sanitizeInput } from '../utils/sanitizeInput'
import { parsePrice } from '../utils/price'

type SortOption = 'relevance' | 'price-asc' | 'price-desc' | 'rating'

export function CatalogPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [query, setQuery] = useState('')
  const [sort, setSort] = useState<SortOption>('relevance')
  const [maxPrice, setMaxPrice] = useState(150000)
  const [sanitizationNotice, setSanitizationNotice] = useState(false)
  const category = searchParams.get('category') ?? 'Todas'
  const safeQuery = sanitizeInput(query).toLowerCase()
  const products = useMemo(() => {
    const filtered = catalogProducts.filter((product) => {
      const matchesCategory = category === 'Todas' || product.category === category
      const matchesQuery = !safeQuery || `${product.name} ${product.category}`.toLowerCase().includes(safeQuery)
      return matchesCategory && matchesQuery && parsePrice(product.price) <= maxPrice
    })
    return [...filtered].sort((a, b) => sort === 'price-asc' ? parsePrice(a.price) - parsePrice(b.price) : sort === 'price-desc' ? parsePrice(b.price) - parsePrice(a.price) : sort === 'rating' ? Number(b.rating) - Number(a.rating) : 0)
  }, [category, maxPrice, safeQuery, sort])

  function selectCategory(nextCategory: string) {
    const nextParams = new URLSearchParams(searchParams)
    if (nextCategory === 'Todas') nextParams.delete('category')
    else nextParams.set('category', nextCategory)
    setSearchParams(nextParams)
  }

  function handleSearchChange(value: string) {
    const sanitized = sanitizeInput(value)
    setSanitizationNotice(sanitized !== value)
    setQuery(sanitized)
  }

  return <section className="page-section catalog-page"><div className="page-intro"><p className="eyebrow">CATÁLOGO / {catalogProducts.length.toString().padStart(2, '0')} PRODUCTOS</p><h1>Todo lo que<br /><em>te mueve.</em></h1><p>Una selección corta de tecnología, energía y gear para tu día.</p></div><div className="catalog-toolbar"><div><label className="search-field"><Search size={17} /><input aria-label="Buscar productos" value={query} onChange={(event) => handleSearchChange(event.target.value)} placeholder="Buscar productos" /></label>{sanitizationNotice && <span className="input-notice" role="status">Se eliminaron los caracteres &lt; y &gt;.</span>}</div><select aria-label="Ordenar productos" value={sort} onChange={(event) => setSort(event.target.value as SortOption)}><option value="relevance">Más relevantes</option><option value="price-asc">Menor precio</option><option value="price-desc">Mayor precio</option><option value="rating">Mejor rating</option></select></div><div className="catalog-layout"><aside><p className="eyebrow">FILTRAR</p><strong>Categorías</strong>{['Todas', 'Audio', 'Energía', 'Gear', 'Cables'].map((item) => <button className={`filter-link ${category === item ? 'is-selected' : ''}`} key={item} type="button" onClick={() => selectCategory(item)}>{item}</button>)}<label className="price-filter" htmlFor="max-price">Hasta ${maxPrice.toLocaleString('es-CO')}<input id="max-price" type="range" min="24000" max="150000" step="1000" value={maxPrice} onChange={(event) => setMaxPrice(Number(event.target.value))} /></label></aside><div className="catalog-results"><p className="result-count">{products.length} resultados</p>{products.length ? <div className="product-grid">{products.map((product) => <ProductCard key={product.id} product={product} />)}</div> : <div className="empty-results"><p className="eyebrow">SIN RESULTADOS</p><h2>No encontramos ese producto.</h2><p>Prueba con otra búsqueda o amplía el rango de precio.</p><Link className="text-link" to="/tienda">Limpiar filtros</Link></div>}</div></div></section>
}