import { Capacitor } from '@capacitor/core'
import { ArrowUpRight, Download, Smartphone, Sparkles } from 'lucide-react'
import { Link } from 'react-router-dom'
import { BundleCard } from '../components/catalog/BundleCard'
import { ProductCard } from '../components/catalog/ProductCard'
import { bundles } from '../utils/pricing'
import { catalogProducts, featuredProducts, findProduct, productCategories, productSrcSet, type ProductCategory } from '../data/products'

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
      return <Link className="category-tile" key={category} to={`/tienda?category=${encodeURIComponent(category)}`}>{cover ? <img src={cover.image} srcSet={productSrcSet(cover)} sizes="(min-width: 768px) 33vw, 50vw" alt="" width={640} height={800} loading="lazy" decoding="async" /> : null}<span>{category}</span><small>{categoryCovers[category].tagline} · {count}</small></Link>
    })}</div></section>
    <section className="section-block" id="catalogo"><div className="section-heading inline-heading"><div><p className="eyebrow">02 / SELECCIÓN</p><h2>Productos destacados.</h2></div><Link className="text-link" to="/tienda">Ver catálogo <ArrowUpRight size={15} /></Link></div><div className="product-grid">{featuredProducts.map((product) => <ProductCard key={product.id} product={product} />)}</div></section>
    <section className="section-block" id="combos"><div className="section-heading"><p className="eyebrow">03 / COMBOS</p><h2>Arma el set y ahorra.</h2></div><div className="bundle-grid">{bundles.map((bundle) => <BundleCard key={bundle.id} bundle={bundle} />)}</div></section>
    {Capacitor.isNativePlatform() ? null : <section className="app-banner"><div><p className="eyebrow"><Smartphone size={14} /> 04 / APP ANDROID</p><h2>Lleva VOKTER en tu teléfono.</h2><p>Descarga la app para Android: la misma tienda, con navegación por pestañas y pantalla completa.</p><Link className="primary-link" to="/app">Descargar la app <Download size={17} /></Link></div><img src="app-qr.svg" alt="Código QR para descargar la app de VOKTER" width={296} height={296} loading="lazy" /></section>}
    <section className="points-banner" id="puntos"><div><p className="eyebrow">{Capacitor.isNativePlatform() ? '04' : '05'} / PUNTOS VOKTER</p><h2>Cada compra deja algo para la próxima.</h2></div><p>Acumula 1 punto por cada $1.000 y úsalo en futuras compras. Envío gratis desde $50.000.</p></section>
  </>
}
