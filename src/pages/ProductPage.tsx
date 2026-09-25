import { ArrowLeft, Heart, Plus, ShieldCheck } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'
import { catalogProducts } from '../data/products'

export function ProductPage() {
  const { slug } = useParams()
  const product = catalogProducts.find((item) => item.id === slug) ?? catalogProducts[0]
  return <section className="page-section product-page"><Link className="back-link" to="/tienda"><ArrowLeft size={15} /> Volver a tienda</Link><div className="product-detail"><div className={`detail-visual product-${product.state}`}><span className="state-badge">{product.label}</span><div className="product-mark">{product.mark}</div></div><div className="detail-copy"><p className="eyebrow">{product.category} / VOKTER</p><h1>{product.name}</h1><div className="detail-rating">{product.rating} / 5 <span>34 reseñas</span></div><strong className="detail-price">{product.price}</strong><p className="detail-description">Diseño pensado para acompañar tus recorridos, tus pausas y todo lo que ocurre entre un lugar y otro.</p><div className="variant-row"><span>Color</span><button type="button">Graphite</button><button type="button">Cyan</button></div><div className="detail-actions"><button className="primary-link" type="button">Agregar al carrito <Plus size={17} /></button><button className="icon-button detail-heart" type="button" aria-label="Guardar producto"><Heart size={19} /></button></div><div className="detail-benefit"><ShieldCheck size={19} /><span>Envío rápido · Compra protegida · Stock disponible</span></div></div></div></section>
}