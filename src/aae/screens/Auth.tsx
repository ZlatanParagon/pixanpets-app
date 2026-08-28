import { useState } from 'react'
import { Icon } from '../components/Icon'
import { Field, Primary } from '../components/ui'
import { useApp } from '../store'

export function Auth() {
  const { state, set } = useApp()
  const register = state.authMode === 'register'
  const [pass, setPass] = useState('')
  const ready = state.email.includes('@') && pass.length >= 6

  function submit() {
    if (!ready) return
    set({ screen: register ? 'diagnostic' : 'home' })
  }

  return (
    <section className="screen scroll auth">
      <div className="brand brand--stack">
        <span className="brand__mark brand__mark--lg">AAE</span>
        <span className="brand__name">Arseg Academy Express</span>
      </div>

      <div className="seg" role="tablist" aria-label="Registro o inicio de sesión">
        <button
          type="button"
          role="tab"
          aria-selected={register}
          className={register ? 'seg__item seg__item--on' : 'seg__item'}
          onClick={() => set({ authMode: 'register' })}
        >
          Crear cuenta
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={!register}
          className={!register ? 'seg__item seg__item--on' : 'seg__item'}
          onClick={() => set({ authMode: 'login' })}
        >
          Iniciar sesión
        </button>
      </div>

      <div className="auth__social">
        <button type="button" className="social" onClick={() => set({ screen: register ? 'diagnostic' : 'home' })}>
          <span className="social__badge social__badge--in">in</span>
          Continuar con LinkedIn
        </button>
        <button type="button" className="social" onClick={() => set({ screen: register ? 'diagnostic' : 'home' })}>
          <span className="social__badge social__badge--g">G</span>
          Continuar con Google
        </button>
      </div>

      <div className="auth__or">
        <span>o con tu correo</span>
      </div>

      <form
        className="auth__form"
        onSubmit={(e) => {
          e.preventDefault()
          submit()
        }}
      >
        {register && (
          <Field label="Nombre">
            <input
              className="input"
              value={state.name}
              onChange={(e) => set({ name: e.target.value })}
              placeholder="Tu nombre"
              autoComplete="given-name"
            />
          </Field>
        )}
        <Field label="Correo profesional">
          <input
            className="input"
            type="email"
            value={state.email}
            onChange={(e) => set({ email: e.target.value })}
            placeholder="nombre@empresa.com"
            autoComplete="email"
          />
        </Field>
        <Field label="Contraseña">
          <input
            className="input"
            type="password"
            value={pass}
            onChange={(e) => setPass(e.target.value)}
            placeholder="Mínimo 6 caracteres"
            autoComplete={register ? 'new-password' : 'current-password'}
          />
        </Field>

        <Primary type="submit" disabled={!ready}>
          {register ? 'Crear cuenta gratis' : 'Entrar'}
        </Primary>
      </form>

      <p className="auth__legal">
        <Icon name="shield" size={14} color="#6B7A90" />
        El Nivel 1 es gratuito. No pedimos tarjeta hasta que decidas avanzar.
      </p>
    </section>
  )
}
