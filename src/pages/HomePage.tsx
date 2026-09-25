import { ArrowUpRight, Sparkles } from 'lucide-react'
import { Link } from 'react-router-dom'
import { ProductCard } from '../components/catalog/ProductCard'
import { featuredProducts } from '../data/products'

export function HomePage() {
  return <>
    <section className="hero-section"><div className="hero-copy"><p className="eyebrow"><Sparkles size={14} /> EQUIPO PARA EL RITMO DIARIO</p><h1>Muévete con lo que <em>sí</em> necesitas.</h1><p className="hero-description">Tecnología, audio y gear elegido para acompañarte sin llenar tu espacio de cosas.</p><Link className="primary-link" to="/tienda">Explorar tienda <ArrowUpRight size={17} /></Link></div><div className="hero-object"><span className="object-label">DROP / 01</span><div className="object-shape"><span>VOKTER</span></div><p>Audio abierto<br /><strong>para seguir conectado</strong></p></div></section>
    <section className="section-block" id="categorias"><div className="section-heading"><p className="eyebrow">01 / RECORRER</p><h2>Encuentra tu siguiente esencial.</h2></div><div className="category-grid"><Link className="category-tile category-audio" to="/tienda?category=Audio"><span>Audio</span><small>Sonido en movimiento</small></Link><Link className="category-tile category-power" to="/tienda?category=Energía"><span>Energía</span><small>Carga que no estorba</small></Link><Link className="category-tile category-gear" to="/tienda?category=Gear"><span>Gear</span><small>Listo para salir</small></Link></div></section>
    <section className="section-block" id="catalogo"><div className="section-heading inline-heading"><div><p className="eyebrow">02 / SELECCIÓN</p><h2>Productos destacados.</h2></div><Link className="text-link" to="/tienda">Ver catálogo <ArrowUpRight size={15} /></Link></div><div className="product-grid">{featuredProducts.map((product) => <ProductCard key={product.id} product={product} />)}</div></section>
    <section className="points-banner" id="puntos"><div><p className="eyebrow">03 / PUNTOS VOKTER</p><h2>Cada compra deja algo para la próxima.</h2></div><p>Acumula 1 punto por cada $1.000 y úsalo en futuras compras. Tu saldo siempre está visible.</p></section>
  </>
}