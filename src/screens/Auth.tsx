import { useState } from 'react'
import logo from '../assets/pixanpets-logo.png'
import { AppleLogo, GoogleLogo } from '../components/Icon'
import { Field, TickBox } from '../components/ui'
import { useApp } from '../store'

export function Auth() {
  const { state, set, openSetting } = useApp()
  const isLogin = state.authMode === 'login'

  const [name, setName] = useState('Ana Robles')
  const [phone, setPhone] = useState('55 4821 0093')
  const [email, setEmail] = useState('ana.robles@correo.com')
  const [password, setPassword] = useState('peluditos')
  const [showPassword, setShowPassword] = useState(false)
  const [accepted, setAccepted] = useState(true)

  // The prototype has no backend: either path just lands on the next screen.
  const enter = () => set({ screen: isLogin ? 'home' : 'petnew', settingFrom: 'home' })
  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    enter()
  }

  return (
    <section className="screen auth">
      <div className="auth__brand">
        <img className="auth__logo" src={logo} alt="" />
        <div>
          <div className="auth__wordmark">PIXANPETS</div>
          <div className="auth__tagline">SERVICIOS VETERINARIOS INTEGRALES</div>
        </div>
      </div>

      <h1 className="auth__title">{isLogin ? 'Bienvenida de vuelta' : 'Crea tu cuenta'}</h1>
      <p className="auth__sub">Tu cuenta guarda a tus peluditos, sus citas y tus pedidos.</p>

      <form className="auth__form" onSubmit={submit}>
        {!isLogin && (
          <>
            <Field label="Nombre">
              <input
                className="input"
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoComplete="name"
              />
            </Field>
            <Field label="Teléfono">
              <input
                className="input"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                autoComplete="tel"
              />
            </Field>
          </>
        )}

        <Field label="Correo">
          <input
            className="input"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
          />
        </Field>

        <Field label="Contraseña">
          <span className="input input--affix">
            <input
              className="input__bare"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete={isLogin ? 'current-password' : 'new-password'}
            />
            <button
              type="button"
              className="input__affix"
              onClick={() => setShowPassword((v) => !v)}
            >
              {showPassword ? 'Ocultar' : 'Ver'}
            </button>
          </span>
        </Field>

        {isLogin && (
          <button
            type="button"
            className="auth__forgot"
            onClick={() => set({ screen: 'forgot', forgotSent: false })}
          >
            ¿Olvidaste tu contraseña?
          </button>
        )}

        {!isLogin && (
          <label className="auth__consent">
            <input
              type="checkbox"
              className="visually-hidden"
              checked={accepted}
              onChange={(e) => setAccepted(e.target.checked)}
            />
            <TickBox>
              Acepto el{' '}
              <a
                href="#privacidad"
                onClick={(e) => {
                  e.preventDefault()
                  openSetting('privacidad')
                }}
              >
                aviso de privacidad
              </a>{' '}
              y el tratamiento de mis datos (LFPDPPP, derechos ARCO).
            </TickBox>
          </label>
        )}

        <button type="submit" className="btn btn--pink auth__cta">
          {isLogin ? 'Entrar' : 'Registrarme'}
        </button>
      </form>

      <div className="auth__divider">
        <span className="rule" />
        <span className="auth__divider-text">o continúa con</span>
        <span className="rule" />
      </div>

      <div className="auth__providers">
        <button type="button" className="provider" onClick={enter}>
          <GoogleLogo />
          Google
        </button>
        <button type="button" className="provider provider--apple" onClick={enter}>
          <AppleLogo />
          Apple
        </button>
      </div>

      <button
        type="button"
        className="auth__switch"
        onClick={() => set({ authMode: isLogin ? 'register' : 'login' })}
      >
        {isLogin ? '¿No tienes cuenta? Regístrate' : '¿Ya tienes cuenta? Inicia sesión'}
      </button>
    </section>
  )
}
