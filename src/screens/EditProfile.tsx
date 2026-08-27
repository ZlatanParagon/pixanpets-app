import { useState } from 'react'
import { BackHeader, Field } from '../components/ui'
import { useApp } from '../store'

export function EditProfile() {
  const { go } = useApp()

  const [name, setName] = useState('Ana Robles')
  const [email, setEmail] = useState('ana.robles@correo.com')
  const [phone, setPhone] = useState('55 4821 0093')
  const [emergency, setEmergency] = useState('Luis Robles · 55 1122 9080')

  return (
    <section className="screen editprof">
      <header className="setting__head setting__head--plain">
        <BackHeader title="Editar perfil" onBack={() => go('profile')} />
      </header>

      <div className="scroll editprof__body">
        <div className="editprof__photo">
          <span className="editprof__avatar">AR</span>
          <button type="button" className="link">
            Cambiar foto
          </button>
        </div>

        <Field label="Nombre completo">
          <input
            className="input input--strong"
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoComplete="name"
          />
        </Field>
        <Field label="Correo">
          <input
            className="input"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
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
        <Field label="Contacto de emergencia">
          <input
            className="input"
            value={emergency}
            onChange={(e) => setEmergency(e.target.value)}
          />
        </Field>
      </div>

      <footer className="sticky-foot">
        <button type="button" className="btn btn--pink" onClick={() => go('profile')}>
          Guardar cambios
        </button>
      </footer>
    </section>
  )
}
