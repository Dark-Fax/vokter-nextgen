import { ArrowUpRight, Sparkles } from 'lucide-react'
import { Link } from 'react-router-dom'
import { ProductCard } from '../components/catalog/ProductCard'
import { catalogProducts, featuredProducts, findProduct, productCategories, type ProductCategory } from '../data/products'

const categoryCovers: Record<ProductCategory, { productId: string; tagline: string }> = {
  Audio: { productId: 'diadema-sony-450bt', tagline: 'Sonido en movimiento' },
  Energía: { productId: 'power-bank-10000', tagline: 'Carga que no estorba' },
  Tecnología: { productId: 'consola-retro', tagline: 'Juega, trabaja, conecta' },
  Accesorios: { productId: 'soporte-moto-360', tagline: 'Soporte y protección' },
  'Ropa deportiva': { productId: 'conjunto-verde-bosque', tagline: 'Listo para salir' },
  Hogar: { productId: 'sabana-flores-lila', tagline: 'Descanso en algodón' },
}

const heroProduct = findProduct('balaca-air-max')

export function HomePage() {
  return <>
    <section className="hero-section"><div className="hero-copy"><p className="eyebrow"><Sparkles size={14} /> EQUIPO PARA EL RITMO DIARIO</p><h1>Muévete con lo que <em>sí</em> necesitas.</h1><p className="hero-description">Tecnología, audio y gear elegido para acompañarte sin llenar tu espacio de cosas.</p><Link className="primary-link" to="/tienda">Explorar tienda <ArrowUpRight size={17} /></Link></div>{heroProduct ? <Link className="hero-object" to={`/producto/${heroProduct.id}`}><span className="object-label">DROP / 01</span><img src={heroProduct.image} alt={heroProduct.name} width={640} height={800} decoding="async" fetchPriority="high" /><p>{heroProduct.name}<br /><strong>{heroProduct.price}</strong></p></Link> : null}</section>
    <section className="section-block" id="categorias"><div className="section-heading"><p className="eyebrow">01 / RECORRER</p><h2>Encuentra tu siguiente esencial.</h2></div><div className="category-grid">{productCategories.map((category) => {
      const cover = findProduct(categoryCovers[category].productId)
      const count = catalogProducts.filter((product) => product.category === category).length
      return <Link className="category-tile" key={category} to={`/tienda?category=${encodeURIComponent(category)}`}>{cover ? <img src={cover.image} alt="" width={640} height={800} loading="lazy" decoding="async" /> : null}<span>{category}</span><small>{categoryCovers[category].tagline} · {count}</small></Link>
    })}</div></section>
    <section className="section-block" id="catalogo"><div className="section-heading inline-heading"><div><p className="eyebrow">02 / SELECCIÓN</p><h2>Productos destacados.</h2></div><Link className="text-link" to="/tienda">Ver catálogo <ArrowUpRight size={15} /></Link></div><div className="product-grid">{featuredProducts.map((product) => <ProductCard key={product.id} product={product} />)}</div></section>
    <section className="points-banner" id="puntos"><div><p className="eyebrow">03 / PUNTOS VOKTER</p><h2>Cada compra deja algo para la próxima.</h2></div><p>Acumula 1 punto por cada $1.000 y úsalo en futuras compras. Tu saldo siempre está visible.</p></section>
  </>
}
