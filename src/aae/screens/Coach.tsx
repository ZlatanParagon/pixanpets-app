import { useState } from 'react'
import { Icon } from '../components/Icon'
import { BackHeader, Primary } from '../components/ui'
import { SUGGESTIONS } from '../data/coach'
import { useApp } from '../store'
import { C } from '../theme'

/** Cuántas preguntas puede hacer un usuario del Nivel 1 antes del muro de pago. */
const FREE_TURNS = 3

export function Coach() {
  const { state, back, open, askCoach, weakest } = useApp()
  const [text, setText] = useState('')
  const used = state.coach.filter((m) => m.from === 'user').length
  const capped = !state.ent.level2 && used >= FREE_TURNS

  function send(value: string) {
    const v = value.trim()
    if (!v || capped) return
    askCoach(v)
    setText('')
  }

  return (
    <section className="screen coach">
      <BackHeader
        title="AAE Coach"
        onBack={back}
        sub={weakest ? `Sabe que tu tema flojo es ${weakest.toLowerCase()}` : 'Tutor de la ruta ISO 9001'}
      />

      <div className="coach__log">
        {state.coach.map((m, i) => (
          <div key={i} className={m.from === 'coach' ? 'bubble bubble--coach' : 'bubble bubble--me'}>
            {m.from === 'coach' && (
              <span className="bubble__avatar">
                <Icon name="sparkle" size={14} color={C.brand} />
              </span>
            )}
            <p>{m.text}</p>
          </div>
        ))}
        {state.coachTyping && (
          <div className="bubble bubble--coach">
            <span className="bubble__avatar">
              <Icon name="sparkle" size={14} color={C.brand} />
            </span>
            <p className="bubble__typing">
              <span />
              <span />
              <span />
            </p>
          </div>
        )}
      </div>

      {capped ? (
        <div className="coach__wall">
          <p>
            Llegaste al límite de {FREE_TURNS} consultas del Nivel 1. Con el Nivel 2 el Coach es
            ilimitado y conoce tu desempeño por tema.
          </p>
          <Primary tone="l2" onClick={() => open('paywall', { planId: 'level2' })}>
            Desbloquear el Coach
          </Primary>
        </div>
      ) : (
        <div className="coach__composer">
          <div className="chips chips--scroll">
            {SUGGESTIONS.map((s) => (
              <button key={s} type="button" className="chip" onClick={() => send(s)}>
                {s}
              </button>
            ))}
          </div>
          <form
            className="composer"
            onSubmit={(e) => {
              e.preventDefault()
              send(text)
            }}
          >
            <input
              className="composer__input"
              value={text}
              placeholder="Pregunta lo que sea del temario…"
              onChange={(e) => setText(e.target.value)}
              aria-label="Mensaje para AAE Coach"
            />
            <button type="submit" className="composer__send" aria-label="Enviar" disabled={!text.trim()}>
              <Icon name="send" size={17} color="#fff" />
            </button>
          </form>
          {!state.ent.level2 && (
            <p className="coach__quota">
              {FREE_TURNS - used} {FREE_TURNS - used === 1 ? 'consulta' : 'consultas'} gratis
              restantes
            </p>
          )}
        </div>
      )}
    </section>
  )
}
