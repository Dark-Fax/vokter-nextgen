import { Search } from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { ProductCard } from '../components/catalog/ProductCard'
import { catalogProducts, productCategories } from '../data/products'
import { sanitizeInput } from '../utils/sanitizeInput'
import { parsePrice } from '../utils/price'

type SortOption = 'relevance' | 'price-asc' | 'price-desc' | 'rating'

const pageSize = 12
const visibleKey = 'vokter-catalog-visible'

// Cuántos productos había cargados para estos filtros: al volver desde una ficha se recupera
// la misma lista y la misma posición en lugar de empezar de nuevo con 12.
function readVisibleCount(search: string) {
  try {
    const saved = JSON.parse(window.sessionStorage.getItem(visibleKey) ?? 'null') as { search?: unknown; count?: unknown } | null
    return saved && saved.search === search && typeof saved.count === 'number' && Number.isInteger(saved.count) && saved.count >= pageSize ? saved.count : pageSize
  } catch {
    return pageSize
  }
}
const priceStep = 5000
const priceCeiling = Math.ceil(Math.max(...catalogProducts.map((product) => parsePrice(product.price))) / priceStep) * priceStep

export function CatalogPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [query, setQuery] = useState('')
  const [sort, setSort] = useState<SortOption>('relevance')
  const [maxPrice, setMaxPrice] = useState(priceCeiling)
  const [visibleCount, setVisibleCount] = useState(() => readVisibleCount(searchParams.toString()))
  const layoutRef = useRef<HTMLDivElement>(null)
  const arrivedWithCategory = useRef(searchParams.has('category'))
  const [sanitizationNotice, setSanitizationNotice] = useState(false)
  const category = searchParams.get('category') ?? 'Todas'
  const safeQuery = sanitizeInput(query).toLowerCase()
  const products = useMemo(() => {
    const filtered = catalogProducts.filter((product) => {
      const matchesCategory = category === 'Todas' || product.category === category
      const matchesQuery = !safeQuery || `${product.name} ${product.model} ${product.category}`.toLowerCase().includes(safeQuery)
      return matchesCategory && matchesQuery && parsePrice(product.price) <= maxPrice
    })
    return [...filtered].sort((a, b) => sort === 'price-asc' ? parsePrice(a.price) - parsePrice(b.price) : sort === 'price-desc' ? parsePrice(b.price) - parsePrice(a.price) : sort === 'rating' ? Number(b.rating) - Number(a.rating) : 0)
  }, [category, maxPrice, safeQuery, sort])
  const visibleProducts = products.slice(0, visibleCount)
  const remaining = products.length - visibleProducts.length

  // Al llegar con una categoría elegida (desde el inicio o el menú) se baja directo a los productos.
  // Con "atrás", ScrollToTop restaura después la posición guardada y prevalece sobre esto.
  useEffect(() => {
    if (arrivedWithCategory.current) layoutRef.current?.scrollIntoView({ block: 'start' })
  }, [])

  useEffect(() => {
    try {
      window.sessionStorage.setItem(visibleKey, JSON.stringify({ search: searchParams.toString(), count: visibleCount }))
    } catch {
      // Sin almacenamiento de sesión solo se pierde la paginación al volver.
    }
  }, [searchParams, visibleCount])

  // Si al filtrar la lista queda por encima de la pantalla, se muestra su comienzo; si no, la página no se mueve.
  function revealResults() {
    requestAnimationFrame(() => {
      const top = layoutRef.current?.getBoundingClientRect().top ?? 0
      if (top < 0) layoutRef.current?.scrollIntoView({ block: 'start', behavior: 'smooth' })
    })
  }

  function selectCategory(nextCategory: string) {
    const nextParams = new URLSearchParams(searchParams)
    if (nextCategory === 'Todas') nextParams.delete('category')
    else nextParams.set('category', nextCategory)
    setSearchParams(nextParams)
    setVisibleCount(pageSize)
    revealResults()
  }

  function handleSearchChange(value: string) {
    const sanitized = sanitizeInput(value)
    setSanitizationNotice(sanitized !== value)
    setQuery(sanitized)
    setVisibleCount(pageSize)
  }

  function clearFilters() {
    setSearchParams(new URLSearchParams())
    setQuery('')
    setSanitizationNotice(false)
    setMaxPrice(priceCeiling)
    setVisibleCount(pageSize)
  }

  function handlePriceChange(value: number) {
    setMaxPrice(value)
    setVisibleCount(pageSize)
  }

  return <section className="page-section catalog-page"><div className="page-intro"><p className="eyebrow">CATÁLOGO / {catalogProducts.length.toString().padStart(2, '0')} PRODUCTOS</p><h1>Todo lo que<br /><em>te mueve.</em></h1><p>Audio, energía, tecnología, accesorios, ropa deportiva y hogar en un solo lugar.</p></div><div className="catalog-toolbar"><div><label className="search-field"><Search size={17} /><input type="search" aria-label="Buscar productos" value={query} onChange={(event) => handleSearchChange(event.target.value)} placeholder="Buscar por nombre o referencia" /></label>{sanitizationNotice && <span className="input-notice" role="status">Se eliminaron los caracteres &lt; y &gt;.</span>}</div><select aria-label="Ordenar productos" value={sort} onChange={(event) => setSort(event.target.value as SortOption)}><option value="relevance">Más relevantes</option><option value="price-asc">Menor precio</option><option value="price-desc">Mayor precio</option><option value="rating">Mejor rating</option></select></div><div className="catalog-layout" ref={layoutRef}><aside><p className="eyebrow">FILTRAR</p><strong>Categorías</strong><div className="filter-list" role="group" aria-label="Categorías">{['Todas', ...productCategories].map((item) => <button className={`filter-link ${category === item ? 'is-selected' : ''}`} key={item} type="button" aria-pressed={category === item} onClick={() => selectCategory(item)}>{item}</button>)}</div><label className="price-filter" htmlFor="max-price">Hasta ${maxPrice.toLocaleString('es-CO')}<input id="max-price" type="range" min={priceStep} max={priceCeiling} step={priceStep} value={maxPrice} onChange={(event) => handlePriceChange(Number(event.target.value))} /></label></aside><div className="catalog-results"><h2 className="sr-only">Productos</h2><p className="result-count">{products.length} resultados</p>{products.length ? <><div className="product-grid">{visibleProducts.map((product) => <ProductCard key={product.id} product={product} />)}</div>{remaining > 0 ? <button className="load-more" type="button" onClick={() => setVisibleCount((count) => count + pageSize)}>Ver más productos <span>{remaining} restantes</span></button> : null}</> : <div className="empty-results"><p className="eyebrow">SIN RESULTADOS</p><h2>No encontramos ese producto.</h2><p>Prueba con otra búsqueda o amplía el rango de precio.</p><button className="text-link" type="button" onClick={clearFilters}>Limpiar filtros</button></div>}</div></div></section>
}
