import { useState } from 'react'
import { Icon } from '../components/Icon'
import { Chip, SearchField, Tag } from '../components/ui'
import { LOW_STOCK, PRODUCTS, SHOP_CATS } from '../data/products'
import { useApp } from '../store'
import { money } from '../utils'

export function Shop() {
  const { state, set, go, addToCart, cartCount } = useApp()
  const [query, setQuery] = useState('')

  const q = query.trim().toLowerCase()
  const products = PRODUCTS.filter(
    (p) =>
      (state.shopCat === 'Todo' || p.cat === state.shopCat) &&
      (q === '' || `${p.name} ${p.brand} ${p.cat}`.toLowerCase().includes(q)),
  )

  const sectionTitle = q
    ? `Resultados para “${query.trim()}”`
    : state.shopCat === 'Todo'
      ? 'Más pedidos por aquí'
      : state.shopCat

  return (
    <section className="screen scroll scroll--tabbed">
      <header className="sheet-head">
        <div className="sheet-head__row">
          <h1 className="sheet-head__title">Tienda</h1>
          <button
            type="button"
            className="icon-btn icon-btn--lg"
            onClick={() => go('cart')}
            aria-label={`Carrito, ${cartCount} artículos`}
          >
            <Icon name="bag" size={21} color="#2A1FA0" />
            {cartCount > 0 && <span className="icon-btn__badge">{cartCount}</span>}
          </button>
        </div>

        <div className="sheet-head__search">
          <SearchField
            value={query}
            onChange={setQuery}
            placeholder="Croquetas, antipulgas, juguetes…"
          />
        </div>

        <div className="chips">
          {SHOP_CATS.map((c) => (
            <Chip
              key={c}
              label={c}
              on={state.shopCat === c}
              onClick={() => set({ shopCat: c })}
            />
          ))}
        </div>
      </header>

      <div className="shop__body">
        <button
          type="button"
          className="rebuy"
          onClick={() => {
            addToCart(1, 1)
            go('cart')
          }}
        >
          <span className="rebuy__icon">
            <Icon name="repeat" size={21} color="#46DED5" />
          </span>
          <span className="rebuy__main">
            <span className="rebuy__title">Volver a pedir</span>
            <span className="rebuy__sub">Croquetas de Frida · cada 6 semanas</span>
          </span>
          <span className="rebuy__cta">Añadir</span>
        </button>

        <h2 className="section-title shop__section">{sectionTitle}</h2>

        {products.length === 0 ? (
          <p className="shop__empty">Sin resultados. Prueba con otra palabra o categoría.</p>
        ) : (
          <div className="shop__grid">
            {products.map((p) => (
              <article key={p.id} className="card product">
                <button
                  type="button"
                  className="product__open"
                  aria-label={`Ver ${p.name}`}
                  onClick={() => set({ screen: 'product', productId: p.id, pdQty: 1 })}
                />
                <span className="product__plate" style={{ background: p.tint }}>
                  <span className="product__mono" style={{ color: p.ink }}>
                    {p.mono}
                  </span>
                  {p.stock <= LOW_STOCK && (
                    <span className="product__stock">
                      <Tag bg="#FFF0E6" fg="#C05A12">
                        ÚLTIMAS {p.stock}
                      </Tag>
                    </span>
                  )}
                </span>
                <span className="product__brand">{p.brand}</span>
                <h3 className="product__name">{p.name}</h3>
                <span className="product__size">{p.size}</span>
                <span className="product__foot">
                  <span className="product__price">{money(p.price)}</span>
                  <button
                    type="button"
                    className="product__add"
                    aria-label={`Agregar ${p.name} al carrito`}
                    onClick={() => addToCart(p.id, 1)}
                  >
                    <Icon name="plus" size={15} color="#fff" stroke={3} />
                  </button>
                </span>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
