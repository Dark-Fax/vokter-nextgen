import { ArrowLeft, ArrowUpRight, Heart, PackagePlus, Plus, SearchX, ShieldCheck, Star } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useCart } from '../hooks/useCart'
import { useWishlist } from '../hooks/useWishlist'
import { EmptyState } from '../components/layout/EmptyState'
import { findProduct, type ProductCategory } from '../data/products'
import { bundleProducts, bundles } from '../utils/pricing'

const categoryCopy: Record<ProductCategory, string> = {
  Audio: 'Sonido para el trayecto, el entreno o la casa. Revisa la referencia para confirmar compatibilidad antes de comprar.',
  Energía: 'Carga para tus equipos en casa, en el carro o en movimiento. Verifica el conector y la potencia que necesitas.',
  Tecnología: 'Periféricos y equipos para trabajar, jugar o ver contenido sin complicarte con la instalación.',
  Accesorios: 'Protección y soporte para tus dispositivos del día a día, listos para usar.',
  'Ropa deportiva': 'Conjunto de chaqueta y pantalón para entrenar o salir. Consulta tallas y colores disponibles al confirmar el pedido.',
  Hogar: 'Juego de sábana 100% algodón estampado, tamaño sencillo de 160 x 230 cm.',
}

export function ProductPage() {
  const { slug } = useParams()
  const { addToCart, addBundle } = useCart()
  const { wishlistIds, toggleWishlist } = useWishlist()
  const [isAdded, setIsAdded] = useState(false)
  const product = slug ? findProduct(slug) : undefined
  useEffect(() => { if (!isAdded) return; const timer = window.setTimeout(() => setIsAdded(false), 1800); return () => window.clearTimeout(timer) }, [isAdded])
  // Un id inexistente en la URL muestra un aviso en lugar de otro producto cualquiera.
  if (!product) return <EmptyState icon={<SearchX />} eyebrow="PRODUCTO / NO ENCONTRADO" title="Este producto no existe." description="Puede que el enlace esté mal escrito o que el producto ya no esté en el catálogo." action="Ver catálogo" to="/tienda" />
  const isWishlisted = wishlistIds.includes(product.id)
  const bundle = bundles.find((item) => item.productIds.includes(product.id))
  function handleAddToCart() { if (product) { addToCart(product); setIsAdded(true) } }
  return <section className="page-section product-page"><Link className="back-link" to="/tienda"><ArrowLeft size={15} /> Volver a tienda</Link><div className="product-detail"><div className="detail-visual"><img src={product.image} alt={product.name} width={640} height={800} decoding="async" />{product.label ? <span className="state-badge">{product.label}</span> : null}</div><div className="detail-copy"><p className="eyebrow">{product.category} / VOKTER</p><h1>{product.name}</h1><div className="detail-rating"><Star size={13} fill="currentColor" /> {product.rating} / 5</div><strong className="detail-price">{product.price}</strong><p className="detail-description">{categoryCopy[product.category]}</p><dl className="detail-specs"><div><dt>Referencia</dt><dd>{product.model}</dd></div><div><dt>Categoría</dt><dd>{product.category}</dd></div></dl><div className="detail-actions"><button className={`primary-link ${isAdded ? 'is-added' : ''}`} type="button" onClick={handleAddToCart}>{isAdded ? 'Agregado al carrito' : 'Agregar al carrito'} <Plus size={17} /></button><button className={`icon-button detail-heart ${isWishlisted ? 'is-active' : ''}`} type="button" aria-label="Guardar producto" aria-pressed={isWishlisted} onClick={() => toggleWishlist(product.id)}><Heart size={19} fill={isWishlisted ? 'currentColor' : 'none'} /></button></div>{isAdded && <p className="cart-confirmation" role="status">Producto agregado. Revisa tu carrito cuando quieras.</p>}{bundle ? <div className="detail-bundle"><PackagePlus size={18} /><div><strong>Parte del {bundle.name}</strong><span>Llévalo con {bundleProducts(bundle).filter((item) => item.id !== product.id).map((item) => item.name).join(' y ')} y ahorra {Math.round(bundle.discountRate * 100)}%.</span><button className="text-link" type="button" onClick={() => addBundle(bundle.name, bundleProducts(bundle))}>Agregar combo completo <ArrowUpRight size={14} /></button></div></div> : null}<div className="detail-benefit"><ShieldCheck size={19} /><span>Envío gratis desde $50.000 · Compra protegida · Stock disponible</span></div></div></div></section>
}