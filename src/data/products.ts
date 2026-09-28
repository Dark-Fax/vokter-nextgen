export type ProductState = 'new' | 'offer' | 'best-seller' | 'regular'

export const productCategories = ['Audio', 'Energía', 'Tecnología', 'Accesorios', 'Ropa deportiva', 'Hogar'] as const
export type ProductCategory = (typeof productCategories)[number]

export type FeaturedProduct = {
  id: string
  name: string
  category: ProductCategory
  model: string
  price: string
  rating: string
  state: ProductState
  label: string
  image: string
}

// Las imágenes salen de material-grafico/, recortadas y optimizadas en public/products/.
// Con base './' y HashRouter la ruta relativa funciona igual en la web y dentro del APK.
const imagePath = (id: string) => `${import.meta.env.BASE_URL}products/${id}.webp`

// Nombres, modelos y precios tomados de las fichas del catálogo GD Gold.
export const catalogProducts: FeaturedProduct[] = [
  // Audio
  { id: 'manos-libres-music-colores', name: 'Manos libres Music Colores', category: 'Audio', model: 'Music Colores', price: '$3.800', rating: '4.2', state: 'regular', label: '', image: imagePath('manos-libres-music-colores') },
  { id: 'manos-libres-w01', name: 'Manos libres W-01', category: 'Audio', model: 'W-01', price: '$3.800', rating: '4.4', state: 'regular', label: '', image: imagePath('manos-libres-w01') },
  { id: 'manos-libres-z1', name: 'Manos libres Z1', category: 'Audio', model: 'Z1', price: '$3.500', rating: '4.8', state: 'regular', label: '', image: imagePath('manos-libres-z1') },
  { id: 'manos-libres-samsung-akg', name: 'Manos libres Samsung AKG', category: 'Audio', model: 'AKG', price: '$3.600', rating: '4.5', state: 'regular', label: '', image: imagePath('manos-libres-samsung-akg') },
  { id: 'balaca-pro-air', name: 'Balaca Pro Air', category: 'Audio', model: 'Oreja abierta', price: '$35.000', rating: '4.7', state: 'new', label: 'Nuevo', image: imagePath('balaca-pro-air') },
  { id: 'balaca-air-max', name: 'Balaca Air Max imantada', category: 'Audio', model: 'Air Max', price: '$90.000', rating: '4.8', state: 'best-seller', label: 'Más vendido', image: imagePath('balaca-air-max') },
  { id: 'balaca-gamer', name: 'Balaca Gamer', category: 'Audio', model: 'Gamer RGB', price: '$63.000', rating: '4.4', state: 'regular', label: '', image: imagePath('balaca-gamer') },
  { id: 'diadema-sony-mdr-xb450', name: 'Diadema Sony MDR-XB450', category: 'Audio', model: 'MDR-XB450', price: '$14.500', rating: '4.4', state: 'regular', label: '', image: imagePath('diadema-sony-mdr-xb450') },
  { id: 'diadema-n65bt', name: 'Diadema N65BT', category: 'Audio', model: 'N65BT', price: '$32.000', rating: '4.5', state: 'regular', label: '', image: imagePath('diadema-n65bt') },
  { id: 'diadema-sony-450bt', name: 'Diadema Sony Bluetooth 450BT', category: 'Audio', model: '450BT', price: '$25.000', rating: '4.9', state: 'best-seller', label: 'Más vendido', image: imagePath('diadema-sony-450bt') },
  { id: 'diadema-p9', name: 'Diadema P9 tipo Apple', category: 'Audio', model: 'P9', price: '$52.000', rating: '4.8', state: 'regular', label: '', image: imagePath('diadema-p9') },
  { id: 'diadema-airpods-max', name: 'Diadema tipo AirPods Max', category: 'Audio', model: 'Max', price: '$52.000', rating: '4.2', state: 'regular', label: '', image: imagePath('diadema-airpods-max') },
  { id: 'cuellera-zon-35', name: 'Cuellera Bluetooth ZON-35', category: 'Audio', model: 'ZON-35', price: '$18.000', rating: '4.5', state: 'regular', label: '', image: imagePath('cuellera-zon-35') },
  { id: 'conduccion-osea-f20', name: 'Audífonos conducción ósea F-20', category: 'Audio', model: 'F-20', price: '$38.000', rating: '4.8', state: 'regular', label: '', image: imagePath('conduccion-osea-f20') },
  { id: 'conduccion-osea-f805', name: 'Audífonos conducción ósea F805', category: 'Audio', model: 'F805', price: '$40.000', rating: '4.9', state: 'regular', label: '', image: imagePath('conduccion-osea-f805') },
  { id: 'parlante-s410', name: 'Parlante S410', category: 'Audio', model: 'S410', price: '$38.000', rating: '4.9', state: 'regular', label: '', image: imagePath('parlante-s410') },
  { id: 'parlante-s430', name: 'Parlante S430', category: 'Audio', model: 'S430', price: '$75.000', rating: '4.7', state: 'regular', label: '', image: imagePath('parlante-s430') },
  { id: 'parlante-fl828', name: 'Parlante FL828', category: 'Audio', model: 'FL828', price: '$85.000', rating: '4.6', state: 'regular', label: '', image: imagePath('parlante-fl828') },
  { id: 'parlante-s640', name: 'Parlante S640', category: 'Audio', model: 'S640', price: '$13.000', rating: '4.6', state: 'regular', label: '', image: imagePath('parlante-s640') },
  { id: 'parlante-s520', name: 'Parlante S520 de 12 pulgadas', category: 'Audio', model: 'S520', price: '$85.000', rating: '4.5', state: 'best-seller', label: 'Más vendido', image: imagePath('parlante-s520') },
  // Energía
  { id: 'cable-px214-120w', name: 'Cable USB tipo C 120W', category: 'Energía', model: 'PX-214', price: '$8.500', rating: '4.3', state: 'regular', label: '', image: imagePath('cable-px214-120w') },
  { id: 'cable-2en1-px400', name: 'Cable 2 en 1 tipo C y Lightning', category: 'Energía', model: 'PX-400', price: '$13.800', rating: '4.6', state: 'regular', label: '', image: imagePath('cable-2en1-px400') },
  { id: 'cable-xiaomi-tipo-c', name: 'Cable Xiaomi tipo C 2A', category: 'Energía', model: 'Xiaomi', price: '$3.500', rating: '4.5', state: 'regular', label: '', image: imagePath('cable-xiaomi-tipo-c') },
  { id: 'cable-rca-2x1', name: 'Cable RCA 2x1', category: 'Energía', model: 'RCA', price: '$4.500', rating: '4.6', state: 'regular', label: '', image: imagePath('cable-rca-2x1') },
  { id: 'plugin-5a', name: 'Cargador para carro 5A', category: 'Energía', model: 'C209', price: '$7.500', rating: '4.8', state: 'regular', label: '', image: imagePath('plugin-5a') },
  { id: 'plugin-38w', name: 'Cargador para carro 38W', category: 'Energía', model: '38W', price: '$9.500', rating: '4.3', state: 'regular', label: '', image: imagePath('plugin-38w') },
  { id: 'plugin-67w', name: 'Cargador para carro 67W', category: 'Energía', model: 'R-01', price: '$13.000', rating: '4.7', state: 'regular', label: '', image: imagePath('plugin-67w') },
  { id: 'cargador-tipo-c-rapido', name: 'Cargador tipo C carga rápida', category: 'Energía', model: 'Technomaster', price: '$9.000', rating: '4.2', state: 'regular', label: '', image: imagePath('cargador-tipo-c-rapido') },
  { id: 'cargador-tipo-c-quick', name: 'Cargador Quick Charger 3.0', category: 'Energía', model: 'CG-16', price: '$5.800', rating: '4.9', state: 'regular', label: '', image: imagePath('cargador-tipo-c-quick') },
  { id: 'cargador-25w-tipo-c', name: 'Cargador 25W tipo C', category: 'Energía', model: '25W', price: '$16.000', rating: '4.8', state: 'regular', label: '', image: imagePath('cargador-25w-tipo-c') },
  { id: 'cargador-67w-xiaomi', name: 'Cargador 67W tipo C Xiaomi', category: 'Energía', model: 'Xiaomi 67W', price: '$20.000', rating: '4.2', state: 'best-seller', label: 'Más vendido', image: imagePath('cargador-67w-xiaomi') },
  { id: 'cargador-67w-tipo-c', name: 'Cargador 67W tipo C', category: 'Energía', model: '67W', price: '$22.000', rating: '4.4', state: 'regular', label: '', image: imagePath('cargador-67w-tipo-c') },
  { id: 'cargador-4a-20w', name: 'Cargador 4A 20W tipo C', category: 'Energía', model: 'CG-09', price: '$7.000', rating: '4.5', state: 'regular', label: '', image: imagePath('cargador-4a-20w') },
  { id: 'cabeza-iphone-25w', name: 'Cabeza tipo iPhone 25W', category: 'Energía', model: '25W', price: '$9.000', rating: '4.6', state: 'regular', label: '', image: imagePath('cabeza-iphone-25w') },
  { id: 'cargador-iphone-25w', name: 'Cargador 25W tipo C para iPhone', category: 'Energía', model: '25W + cable', price: '$15.000', rating: '4.4', state: 'regular', label: '', image: imagePath('cargador-iphone-25w') },
  { id: 'power-bank-2300', name: 'Power Bank 2.300 mAh', category: 'Energía', model: 'Llavero', price: '$13.000', rating: '4.7', state: 'regular', label: '', image: imagePath('power-bank-2300') },
  { id: 'power-bank-5000', name: 'Power Bank 5.000 mAh magnético', category: 'Energía', model: 'Battery Pack', price: '$45.000', rating: '4.7', state: 'regular', label: '', image: imagePath('power-bank-5000') },
  { id: 'power-bank-10000', name: 'Power Bank 10.000 mAh', category: 'Energía', model: '10.000 mAh', price: '$45.000', rating: '4.7', state: 'best-seller', label: 'Más vendido', image: imagePath('power-bank-10000') },
  { id: 'power-bank-20000', name: 'Power Bank 20.000 mAh', category: 'Energía', model: '20.000 mAh', price: '$55.000', rating: '4.7', state: 'regular', label: '', image: imagePath('power-bank-20000') },
  // Tecnología
  { id: 'microfono-k9', name: 'Micrófono inalámbrico K9', category: 'Tecnología', model: 'K9', price: '$25.000', rating: '4.7', state: 'regular', label: '', image: imagePath('microfono-k9') },
  { id: 'mouse-inalambrico', name: 'Mouse inalámbrico', category: 'Tecnología', model: '2.4 GHz', price: '$12.000', rating: '4.8', state: 'regular', label: '', image: imagePath('mouse-inalambrico') },
  { id: 'mouse-alambrico', name: 'Mouse alámbrico', category: 'Tecnología', model: 'USB', price: '$5.500', rating: '4.2', state: 'regular', label: '', image: imagePath('mouse-alambrico') },
  { id: 'combo-gamer-t25', name: 'Combo gamer T25', category: 'Tecnología', model: 'T25', price: '$45.000', rating: '4.7', state: 'best-seller', label: 'Más vendido', image: imagePath('combo-gamer-t25') },
  { id: 'teclado-cable', name: 'Teclado con cable', category: 'Tecnología', model: 'FC-530', price: '$13.000', rating: '4.6', state: 'regular', label: '', image: imagePath('teclado-cable') },
  { id: 'teclado-inalambrico', name: 'Teclado y mouse inalámbricos', category: 'Tecnología', model: 'MK220', price: '$55.000', rating: '4.7', state: 'regular', label: '', image: imagePath('teclado-inalambrico') },
  { id: 'consola-retro', name: 'Consola retro con dos controles', category: 'Tecnología', model: 'Retro', price: '$75.000', rating: '4.3', state: 'regular', label: '', image: imagePath('consola-retro') },
  { id: 'proyector-juegos', name: 'Proyector con juegos', category: 'Tecnología', model: 'Proyector + Game', price: '$185.000', rating: '4.6', state: 'new', label: 'Nuevo', image: imagePath('proyector-juegos') },
  { id: 'tv-stick', name: 'TV Stick Android TV', category: 'Tecnología', model: 'Android TV', price: '$55.000', rating: '4.7', state: 'regular', label: '', image: imagePath('tv-stick') },
  { id: 'watch-one', name: 'Watch One streaming', category: 'Tecnología', model: 'onn', price: '$80.000', rating: '4.9', state: 'new', label: 'Nuevo', image: imagePath('watch-one') },
  { id: 'multipuerto-usb', name: 'Multipuerto USB 3.0', category: 'Tecnología', model: '4 puertos', price: '$19.500', rating: '4.8', state: 'regular', label: '', image: imagePath('multipuerto-usb') },
  { id: 'antena-tdt', name: 'Antena TDT', category: 'Tecnología', model: '5M', price: '$15.000', rating: '4.2', state: 'regular', label: '', image: imagePath('antena-tdt') },
  { id: 'codificador-tdt', name: 'Codificador TDT', category: 'Tecnología', model: 'DVB-T2', price: '$48.000', rating: '4.3', state: 'regular', label: '', image: imagePath('codificador-tdt') },
  // Accesorios
  { id: 'holder-chupa-iman', name: 'Holder para carro con imán', category: 'Accesorios', model: 'Chupa imán', price: '$10.000', rating: '4.4', state: 'regular', label: '', image: imagePath('holder-chupa-iman') },
  { id: 'holder-carro', name: 'Holder para carro', category: 'Accesorios', model: 'Car Holder', price: '$9.500', rating: '4.6', state: 'regular', label: '', image: imagePath('holder-carro') },
  { id: 'soporte-moto-manubrio', name: 'Soporte para moto manubrio', category: 'Accesorios', model: 'XL+Z', price: '$13.000', rating: '4.2', state: 'regular', label: '', image: imagePath('soporte-moto-manubrio') },
  { id: 'soporte-moto-espejo', name: 'Soporte para moto espejo', category: 'Accesorios', model: 'XL+M3', price: '$13.000', rating: '4.5', state: 'regular', label: '', image: imagePath('soporte-moto-espejo') },
  { id: 'soporte-moto-360', name: 'Soporte para moto 360°', category: 'Accesorios', model: 'H-73', price: '$15.000', rating: '4.4', state: 'new', label: 'Nuevo', image: imagePath('soporte-moto-360') },
  { id: 'estuche-space', name: 'Estuche Space iPhone y Android', category: 'Accesorios', model: 'Space', price: '$3.000', rating: '4.6', state: 'regular', label: '', image: imagePath('estuche-space') },
  { id: 'silicon-iphone', name: 'Funda de silicona iPhone', category: 'Accesorios', model: 'Silicone Case', price: '$4.500', rating: '4.4', state: 'regular', label: '', image: imagePath('silicon-iphone') },
  { id: 'silicon-android', name: 'Funda de silicona Android', category: 'Accesorios', model: 'Silicone Case', price: '$5.000', rating: '4.3', state: 'regular', label: '', image: imagePath('silicon-android') },
  { id: 'funda-samsung-lujo', name: 'Funda Samsung lujo', category: 'Accesorios', model: 'Lujo', price: '$12.000', rating: '4.6', state: 'regular', label: '', image: imagePath('funda-samsung-lujo') },
  { id: 'protector-airpods', name: 'Protector para AirPods', category: 'Accesorios', model: 'Personajes', price: '$7.000', rating: '4.3', state: 'regular', label: '', image: imagePath('protector-airpods') },
  { id: 'protector-cargador', name: 'Protector de cargador', category: 'Accesorios', model: 'Personajes', price: '$7.000', rating: '4.9', state: 'regular', label: '', image: imagePath('protector-cargador') },
  // Ropa deportiva (sin precio en el material gráfico: precio estimado)
  { id: 'conjunto-classic', name: 'Conjunto Classic', category: 'Ropa deportiva', model: '3508', price: '$139.000', rating: '4.8', state: 'regular', label: '', image: imagePath('conjunto-classic') },
  { id: 'conjunto-bicolor', name: 'Conjunto Bicolor', category: 'Ropa deportiva', model: 'N8805', price: '$149.000', rating: '4.9', state: 'regular', label: '', image: imagePath('conjunto-bicolor') },
  { id: 'conjunto-urban-azul', name: 'Conjunto Urban azul', category: 'Ropa deportiva', model: '6976', price: '$145.000', rating: '4.5', state: 'regular', label: '', image: imagePath('conjunto-urban-azul') },
  { id: 'conjunto-urban-arena', name: 'Conjunto Urban arena', category: 'Ropa deportiva', model: '6976', price: '$145.000', rating: '4.3', state: 'regular', label: '', image: imagePath('conjunto-urban-arena') },
  { id: 'conjunto-tech-negro', name: 'Conjunto Tech negro', category: 'Ropa deportiva', model: '6976', price: '$145.000', rating: '4.4', state: 'regular', label: '', image: imagePath('conjunto-tech-negro') },
  { id: 'conjunto-retro', name: 'Conjunto Retro', category: 'Ropa deportiva', model: '2335', price: '$139.000', rating: '4.9', state: 'regular', label: '', image: imagePath('conjunto-retro') },
  { id: 'conjunto-sport-hielo', name: 'Conjunto Sport gris hielo', category: 'Ropa deportiva', model: 'Línea Sport', price: '$159.000', rating: '4.4', state: 'regular', label: '', image: imagePath('conjunto-sport-hielo') },
  { id: 'conjunto-sport-coral', name: 'Conjunto Sport coral', category: 'Ropa deportiva', model: 'Línea Sport', price: '$159.000', rating: '4.7', state: 'best-seller', label: 'Más vendido', image: imagePath('conjunto-sport-coral') },
  { id: 'conjunto-sport-aguamarina', name: 'Conjunto Sport aguamarina', category: 'Ropa deportiva', model: 'Línea Sport', price: '$159.000', rating: '4.7', state: 'regular', label: '', image: imagePath('conjunto-sport-aguamarina') },
  { id: 'conjunto-lila', name: 'Conjunto Lila tres rayas', category: 'Ropa deportiva', model: 'Línea mujer', price: '$155.000', rating: '4.6', state: 'new', label: 'Nuevo', image: imagePath('conjunto-lila') },
  { id: 'conjunto-verde-bosque', name: 'Conjunto Verde bosque', category: 'Ropa deportiva', model: 'Línea mujer', price: '$155.000', rating: '4.6', state: 'new', label: 'Nuevo', image: imagePath('conjunto-verde-bosque') },
  { id: 'conjunto-petroleo', name: 'Conjunto Petróleo', category: 'Ropa deportiva', model: 'Línea mujer', price: '$155.000', rating: '4.9', state: 'new', label: 'Nuevo', image: imagePath('conjunto-petroleo') },
  // Hogar (sin precio en el material gráfico: precio estimado)
  { id: 'sabana-triangulos', name: 'Sábana Star Home triángulos', category: 'Hogar', model: 'Sencilla 160x230', price: '$59.000', rating: '4.5', state: 'regular', label: '', image: imagePath('sabana-triangulos') },
  { id: 'sabana-geometrica-azul', name: 'Sábana Star Home geométrica azul', category: 'Hogar', model: 'Sencilla 160x230', price: '$59.000', rating: '4.8', state: 'regular', label: '', image: imagePath('sabana-geometrica-azul') },
  { id: 'sabana-lunares', name: 'Sábana Star Home lunares', category: 'Hogar', model: 'Sencilla 160x230', price: '$59.000', rating: '4.7', state: 'regular', label: '', image: imagePath('sabana-lunares') },
  { id: 'sabana-ondas-gris', name: 'Sábana Star Home ondas gris', category: 'Hogar', model: 'Sencilla 160x230', price: '$59.000', rating: '4.7', state: 'regular', label: '', image: imagePath('sabana-ondas-gris') },
  { id: 'sabana-ocre', name: 'Sábana Star Home ocre', category: 'Hogar', model: 'Sencilla 160x230', price: '$59.000', rating: '4.4', state: 'regular', label: '', image: imagePath('sabana-ocre') },
  { id: 'sabana-estrellas', name: 'Sábana Star Home estrellas', category: 'Hogar', model: 'Sencilla 160x230', price: '$59.000', rating: '4.6', state: 'regular', label: '', image: imagePath('sabana-estrellas') },
  { id: 'sabana-lineas', name: 'Sábana Star Home líneas', category: 'Hogar', model: 'Sencilla 160x230', price: '$59.000', rating: '4.3', state: 'regular', label: '', image: imagePath('sabana-lineas') },
  { id: 'sabana-hojas', name: 'Sábana Star Home hojas', category: 'Hogar', model: 'Sencilla 160x230', price: '$59.000', rating: '4.8', state: 'regular', label: '', image: imagePath('sabana-hojas') },
  { id: 'sabana-bloques', name: 'Sábana Star Home bloques', category: 'Hogar', model: 'Sencilla 160x230', price: '$59.000', rating: '4.3', state: 'regular', label: '', image: imagePath('sabana-bloques') },
  { id: 'sabana-flores-lila', name: 'Sábana Star Home flores lila', category: 'Hogar', model: 'Sencilla 160x230', price: '$59.000', rating: '4.7', state: 'new', label: 'Nuevo', image: imagePath('sabana-flores-lila') },
  { id: 'sabana-circulos', name: 'Sábana Star Home círculos', category: 'Hogar', model: 'Sencilla 160x230', price: '$59.000', rating: '4.8', state: 'regular', label: '', image: imagePath('sabana-circulos') },
]

const featuredIds = ['balaca-air-max', 'parlante-s520', 'power-bank-10000', 'conjunto-sport-coral']
export const featuredProducts = featuredIds.flatMap((id) => catalogProducts.filter((product) => product.id === id))

export function findProduct(id: string) {
  return catalogProducts.find((product) => product.id === id)
}
