import { useState } from 'react'
import { Icon } from '../components/Icon'
import { Chip, Note, SearchField } from '../components/ui'
import { FAQS, TIP_CATS } from '../data/content'
import { useApp } from '../store'

export function Tips() {
  const { state, set, go } = useApp()
  const [query, setQuery] = useState('')

  const q = query.trim().toLowerCase()
  const faqs = FAQS.filter((f) => q === '' || `${f.q} ${f.a}`.toLowerCase().includes(q))

  return (
    <section className="screen scroll scroll--tabbed">
      <header className="sheet-head">
        <h1 className="sheet-head__title">Consejos</h1>
        <p className="sheet-head__sub">Curado por el equipo de PIXANPETS</p>

        <div className="sheet-head__search">
          <SearchField
            value={query}
            onChange={setQuery}
            placeholder="Buscar en consejos y preguntas"
          />
        </div>

        <div className="chips">
          {TIP_CATS.map((c) => (
            <Chip key={c} label={c} on={state.tipCat === c} onClick={() => set({ tipCat: c })} />
          ))}
        </div>
      </header>

      <div className="tips__body">
        <button type="button" className="feature" onClick={() => go('article')}>
          <span className="feature__blob" aria-hidden="true" />
          <span className="feature__tag">DESTACADO · SALUD</span>
          <span className="feature__title">Calendario de vacunas: qué toca y cuándo</span>
          <span className="feature__text">
            Guía rápida por edad para cachorros, gatitos y adultos.
          </span>
          <span className="feature__cta">Leer · 4 min</span>
        </button>

        <h2 className="section-title tips__section">Preguntas frecuentes</h2>

        {faqs.length === 0 ? (
          <p className="shop__empty">Sin resultados. Prueba con otra palabra.</p>
        ) : (
          <div className="stack stack--10">
            {faqs.map((f) => {
              const i = FAQS.indexOf(f)
              const open = state.faqOpen === i
              return (
                <div key={f.q} className="faq">
                  <button
                    type="button"
                    className="faq__q"
                    aria-expanded={open}
                    onClick={() => set({ faqOpen: open ? null : i })}
                  >
                    <span className="faq__text">{f.q}</span>
                    <span className={open ? 'faq__caret faq__caret--open' : 'faq__caret'}>
                      <Icon name="chevronDown" size={14} color="#7A22C4" />
                    </span>
                  </button>
                  {open && <p className="faq__a">{f.a}</p>}
                </div>
              )
            })}
          </div>
        )}

        <Note decision>
          Recomendación: administrar este contenido desde un CMS ligero para no republicar la app en
          cada cambio.
        </Note>
      </div>
    </section>
  )
}
