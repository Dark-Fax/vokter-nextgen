export type ProductState = 'new' | 'offer' | 'best-seller'

export type FeaturedProduct = {
  id: string
  name: string
  category: string
  price: string
  rating: string
  state: ProductState
  label: string
  mark: string
}

export const featuredProducts: FeaturedProduct[] = [
  { id: 'open-air', name: 'Open Air Pro', category: 'Audio', price: '$70.000', rating: '4.8', state: 'new', label: 'Nuevo', mark: 'OPEN\nAIR' },
  { id: 'power-key', name: 'Power Key 10K', category: 'Energía', price: '$76.000', rating: '4.6', state: 'offer', label: '-15%', mark: '10K\nPOWER' },
  { id: 'move-pack', name: 'Move Pack', category: 'Gear', price: '$104.000', rating: '4.9', state: 'best-seller', label: 'Más vendido', mark: 'MOVE\nPACK' },
]