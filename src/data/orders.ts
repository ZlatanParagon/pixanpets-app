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

/** The order summarised on the home screen. */
export const LATEST_ORDER = {
  id: '#PX-2841',
  status: 'EN CAMINO',
  meta: '2 productos · $848.00 · Envío a domicilio',
  /** How many of ORDER_STAGES are complete. */
  stagesDone: 3,
}
