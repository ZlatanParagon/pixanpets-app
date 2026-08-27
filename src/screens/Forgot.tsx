import { useState } from 'react'
import { Icon } from '../components/Icon'
import { Field } from '../components/ui'
import { useApp } from '../store'

export function Forgot() {
  const { state, set } = useApp()
  const [email, setEmail] = useState('ana.robles@correo.com')

  const toAuth = () => set({ screen: 'auth', forgotSent: false })

  return (
    <section className="screen forgot">
      <button type="button" className="icon-btn" onClick={toAuth} aria-label="Volver">
        <Icon name="chevronLeft" size={18} color="#2A1FA0" />
      </button>

      {state.forgotSent ? (
        <>
          <div className="forgot__sent">
            <span className="forgot__seal">
              <Icon name="mail" size={42} color="#17B5AC" />
            </span>
            <h1 className="forgot__title">Revisa tu correo</h1>
            <p className="forgot__text">
              Enviamos un enlace para restablecer tu contraseña a {email}. Vence en 30 minutos.
            </p>
          </div>
          <button type="button" className="btn btn--pink" onClick={toAuth}>
            Volver a iniciar sesión
          </button>
        </>
      ) : (
        <>
          <form
            className="forgot__form"
            onSubmit={(e) => {
              e.preventDefault()
              set({ forgotSent: true })
            }}
            id="forgot-form"
          >
            <h1 className="forgot__title forgot__title--left">Recupera tu acceso</h1>
            <p className="forgot__text forgot__text--left">
              Escribe tu correo y te mandamos un enlace para crear una contraseña nueva.
            </p>
            <Field label="Correo" style={{ marginTop: 22 }}>
              <input
                className="input"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
              />
            </Field>
          </form>
          <button
            type="submit"
            form="forgot-form"
            className="btn btn--pink"
          >
            Enviar enlace
          </button>
        </>
      )}
    </section>
  )
}
