import type { Faq, OnboardSlide } from '../types'

export const ONBOARDING: OnboardSlide[] = [
  {
    title: 'Todo tu peludito, en un lugar',
    body: 'Perfiles, cartilla de vacunas y su historial de visitas, siempre a la mano.',
  },
  {
    title: 'Agenda sin llamadas',
    body: 'Citas médicas y de estética con disponibilidad real, y recordatorios antes de cada visita.',
  },
  {
    title: 'Su alimento, a tu puerta',
    body: 'Compra en la tienda y elige envío a domicilio o recolección en la sucursal.',
  },
]

export const TIP_CATS = ['Todos', 'Alimentación', 'Salud', 'Higiene', 'Comportamiento']

export const FAQS: Faq[] = [
  {
    q: '¿Cuánto tiempo antes puedo cancelar una cita?',
    a: 'Puedes cancelar o reprogramar sin costo hasta 24 horas antes. Después de ese margen el espacio se libera y podría no haber disponibilidad el mismo día.',
  },
  {
    q: '¿Cada cuánto debo bañar a mi perro?',
    a: 'En general cada 3 o 4 semanas. Los baños muy frecuentes remueven la capa de grasa natural de la piel; si tu peludito tiene dermatitis, sigue la indicación del médico.',
  },
  {
    q: '¿Qué vacunas son obligatorias en CDMX?',
    a: 'La antirrábica es obligatoria por ley y se aplica anualmente. Las múltiples (parvovirus, moquillo, hepatitis) son altamente recomendadas y forman parte del esquema básico.',
  },
  {
    q: '¿Puedo pagar la cita en la app?',
    a: 'Por ahora la app solo aparta el espacio; el pago del servicio se realiza en la sucursal. Las compras de la tienda sí se pagan en línea.',
  },
  {
    q: '¿Mi gato necesita desparasitación si no sale de casa?',
    a: 'Sí. Los parásitos entran por calzado, alimento crudo y otros animales. Recomendamos desparasitar cada 3 a 6 meses según su estilo de vida.',
  },
]
