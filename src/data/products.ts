import type { Product } from '../types'

export const SHOP_CATS = ['Todo', 'Alimento', 'Higiene', 'Accesorios', 'Medicamentos']

/** A product is flagged as low stock — "ÚLTIMAS n" — at or below this count. */
export const LOW_STOCK = 4

/** Free shipping kicks in at this subtotal; below it, home delivery costs $79. */
export const FREE_SHIPPING_FROM = 899
export const SHIPPING_FEE = 79

export const PRODUCTS: Product[] = [
  {
    id: 1,
    mono: 'C',
    brand: 'NUTRIPET',
    name: 'Croquetas adulto pollo',
    size: '8 kg',
    sizeAlt: '15 kg',
    price: 449,
    tint: '#DFF9F7',
    ink: '#0F8F88',
    stock: 12,
    cat: 'Alimento',
    desc: 'Alimento completo para perro adulto de raza mediana. Proteína de pollo como primer ingrediente, con omega 3 y 6 para piel y pelo sanos.',
  },
  {
    id: 2,
    mono: 'A',
    brand: 'DERMAVET',
    name: 'Antipulgas spot-on',
    size: '3 pipetas',
    sizeAlt: '6 pipetas',
    price: 389,
    tint: '#F0E6FF',
    ink: '#7A22C4',
    stock: 4,
    cat: 'Higiene',
    desc: 'Protección mensual contra pulgas y garrapatas. Aplicación tópica, apto desde 8 semanas de edad.',
  },
  {
    id: 3,
    mono: 'S',
    brand: 'PIXANPETS',
    name: 'Shampoo hipoalergénico',
    size: '500 ml',
    sizeAlt: '1 L',
    price: 219,
    tint: '#FFE6F1',
    ink: '#E9207F',
    stock: 20,
    cat: 'Higiene',
    desc: 'Fórmula suave con avena para pieles sensibles. pH balanceado para perros y gatos.',
  },
  {
    id: 4,
    mono: 'J',
    brand: 'PLAYPAW',
    name: 'Juguete mordedera resistente',
    size: 'Talla M',
    sizeAlt: 'Talla L',
    price: 189,
    tint: '#FFF3D9',
    ink: '#B0840E',
    stock: 15,
    cat: 'Accesorios',
    desc: 'Caucho natural resistente para masticadores intensos. Ayuda a la salud dental y reduce la ansiedad.',
  },
  {
    id: 5,
    mono: 'A',
    brand: 'FELINOVA',
    name: 'Arena aglutinante sin polvo',
    size: '10 kg',
    sizeAlt: '20 kg',
    price: 279,
    tint: '#E6F0FF',
    ink: '#2A55A0',
    stock: 3,
    cat: 'Higiene',
    desc: 'Control de olores por 21 días. Aglutina en bloques firmes y no genera polvo.',
  },
  {
    id: 6,
    mono: 'V',
    brand: 'VITAVET',
    name: 'Multivitamínico masticable',
    size: '60 tabs',
    sizeAlt: '120 tabs',
    price: 329,
    tint: '#DFF9F7',
    ink: '#0F8F88',
    stock: 9,
    cat: 'Medicamentos',
    desc: 'Suplemento de vitaminas y minerales para perros adultos. Sabor hígado, una tableta al día.',
  },
]
