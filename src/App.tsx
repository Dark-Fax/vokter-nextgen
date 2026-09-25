import { ArrowUpRight, Heart, ShoppingBag, Sparkles } from 'lucide-react'
import { featuredProducts } from './data/products'
import './App.css'

function App() {
  return (
    <main className="site-shell">
      <header className="topbar">
        <a className="wordmark" href="/" aria-label="VOKTER inicio">
          VOKTER<span>/</span>
        </a>
        <nav className="desktop-nav" aria-label="Navegación principal">
          <a href="#catalogo">Tienda</a>
          <a href="#categorias">Categorías</a>
          <a href="#puntos">Puntos</a>
        </nav>
        <div className="nav-actions">
          <span className="points-pill">240 pts</span>
          <button className="icon-button" type="button" aria-label="Ver favoritos">
            <Heart size={18} />
          </button>
          <button className="icon-button cart-button" type="button" aria-label="Ver carrito">
            <ShoppingBag size={18} />
            <span>0</span>
          </button>
        </div>
      </header>

      <section className="hero-section">
        <div className="hero-copy">
          <p className="eyebrow"><Sparkles size={14} /> EQUIPO PARA EL RITMO DIARIO</p>
          <h1>Muévete con lo que <em>sí</em> necesitas.</h1>
          <p className="hero-description">Tecnología, audio y gear elegido para acompañarte sin llenar tu espacio de cosas.</p>
          <a className="primary-link" href="#catalogo">Explorar tienda <ArrowUpRight size={17} /></a>
        </div>
        <div className="hero-object" aria-label="Producto destacado en preparación">
          <span className="object-label">DROP / 01</span>
          <div className="object-shape"><span>VOKTER</span></div>
          <p>Audio abierto<br /><strong>para seguir conectado</strong></p>
        </div>
      </section>

      <section className="section-block" id="categorias">
        <div className="section-heading">
          <p className="eyebrow">01 / RECORRER</p>
          <h2>Encuentra tu siguiente esencial.</h2>
        </div>
        <div className="category-grid">
          <a className="category-tile category-audio" href="#catalogo"><span>Audio</span><small>Sonido en movimiento</small></a>
          <a className="category-tile category-power" href="#catalogo"><span>Energía</span><small>Carga que no estorba</small></a>
          <a className="category-tile category-gear" href="#catalogo"><span>Gear</span><small>Listo para salir</small></a>
        </div>
      </section>

      <section className="section-block featured-block" id="catalogo">
        <div className="section-heading inline-heading">
          <div><p className="eyebrow">02 / SELECCIÓN</p><h2>Productos destacados.</h2></div>
          <a className="text-link" href="#catalogo">Ver catálogo <ArrowUpRight size={15} /></a>
        </div>
        <div className="product-grid">
          {featuredProducts.map((product) => (
            <article className={`product-card product-${product.state}`} key={product.id}>
              <div className="product-visual">
                <span className="state-badge">{product.label}</span>
                <button className="card-heart" type="button" aria-label={`Guardar ${product.name}`}><Heart size={17} /></button>
                <div className="product-mark">{product.mark}</div>
              </div>
              <div className="product-meta"><span>{product.category}</span><span>{product.rating} / 5</span></div>
              <h3>{product.name}</h3>
              <strong className="product-price">{product.price}</strong>
            </article>
          ))}
        </div>
      </section>

      <section className="points-banner" id="puntos">
        <div><p className="eyebrow">03 / PUNTOS VOKTER</p><h2>Cada compra deja algo para la próxima.</h2></div>
        <p>Acumula 1 punto por cada $1.000 y úsalo en futuras compras. Tu saldo siempre está visible.</p>
      </section>
    </main>
  )
}

export default App
