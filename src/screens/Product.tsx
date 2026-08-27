import { Icon } from '../components/Icon'
import { Tag } from '../components/ui'
import { LOW_STOCK, PRODUCTS } from '../data/products'
import { useApp } from '../store'
import { money } from '../utils'

export function Product() {
  const { state, set, go, addToCart } = useApp()
  const product = PRODUCTS.find((p) => p.id === state.productId) ?? PRODUCTS[0]
  const low = product.stock <= LOW_STOCK
  const qty = state.pdQty

  return (
    <section className="screen product-detail">
      <div className="scroll">
        <div className="pd__hero" style={{ background: product.tint }}>
          <span className="pd__mono" style={{ color: product.ink }}>
            {product.mono}
          </span>
          <button
            type="button"
            className="pd__back"
            onClick={() => go('shop')}
            aria-label="Volver a la tienda"
          >
            <Icon name="chevronLeft" size={18} color="#2A1FA0" />
          </button>
          <div className="pd__pager" aria-hidden="true">
            <span className="pd__pip pd__pip--on" />
            <span className="pd__pip" />
            <span className="pd__pip" />
          </div>
        </div>

        <div className="pd__body">
          <div className="pd__brand">{product.brand}</div>
          <h1 className="pd__name">{product.name}</h1>

          <div className="pd__pricing">
            <span className="pd__price">{money(product.price)}</span>
            <Tag bg={low ? '#FFF0E6' : '#EAFBFA'} fg={low ? '#C05A12' : '#0F8F88'}>
              {low ? `Últimas ${product.stock}` : 'En stock'}
            </Tag>
          </div>

          <h2 className="pd__label">Presentación</h2>
          <div className="pd__sizes">
            <span className="size size--on">{product.size}</span>
            <span className="size">{product.sizeAlt}</span>
          </div>

          <h2 className="pd__label">Descripción</h2>
          <p className="pd__desc">{product.desc}</p>

          <div className="pd__shipping">
            <Icon name="truck" size={22} color="#7A22C4" />
            <p>Envío el mismo día en zona sur · o recoge en sucursal hoy después de las 14 h</p>
          </div>
        </div>
      </div>

      <footer className="sticky-foot sticky-foot--row">
        <div className="stepper">
          <button
            type="button"
            className="stepper__btn"
            onClick={() => set({ pdQty: Math.max(1, qty - 1) })}
            aria-label="Quitar uno"
          >
            −
          </button>
          <span className="stepper__value" aria-live="polite">
            {qty}
          </span>
          <button
            type="button"
            className="stepper__btn"
            onClick={() => set({ pdQty: qty + 1 })}
            aria-label="Agregar uno"
          >
            +
          </button>
        </div>
        <button
          type="button"
          className="btn btn--pink"
          onClick={() => {
            addToCart(product.id, qty)
            go('cart')
          }}
        >
          Agregar al carrito
        </button>
      </footer>
    </section>
  )
}
