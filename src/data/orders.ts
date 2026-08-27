import type { Order } from '../types'

const IN_TRANSIT = { tagBg: '#FFF0E6', tagFg: '#C05A12' }
const DELIVERED = { tagBg: '#EAFBFA', tagFg: '#0F8F88' }

export const ORDERS: Order[] = [
  {
    id: '#PX-2841',
    status: 'EN CAMINO',
    meta: '2 productos · Envío a domicilio · 24 ago',
    total: '$848.00',
    ...IN_TRANSIT,
  },
  {
    id: '#PX-2790',
    status: 'ENTREGADO',
    meta: '1 producto · Recolección en tienda · 2 ago',
    total: '$449.00',
    ...DELIVERED,
  },
  {
    id: '#PX-2712',
    status: 'ENTREGADO',
    meta: '3 productos · Envío a domicilio · 14 jul',
    total: '$1,067.00',
    ...DELIVERED,
  },
]

/** The four fulfilment stages shown as the progress bar on the home card. */
export const ORDER_STAGES = ['PAGADO', 'PREPARANDO', 'EN CAMINO', 'ENTREGADO']

/** How many of ORDER_STAGES an order has completed, from its status tag. */
export function stagesDone(status: string): number {
  const i = ORDER_STAGES.indexOf(status)
  return i >= 0 ? i + 1 : 1
}

/** Tag palette per order status, used when a new order is placed in-session. */
export const STATUS_TAGS: Record<string, { tagBg: string; tagFg: string }> = {
  PAGADO: { tagBg: '#EAFBFA', tagFg: '#0F8F88' },
  PREPARANDO: { tagBg: '#FFF9E8', tagFg: '#8A6A17' },
  'EN CAMINO': { tagBg: '#FFF0E6', tagFg: '#C05A12' },
  ENTREGADO: { tagBg: '#EAFBFA', tagFg: '#0F8F88' },
}
