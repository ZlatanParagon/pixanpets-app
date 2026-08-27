import { useRef, useState } from 'react'
import { Icon } from '../components/Icon'
import { Field } from '../components/ui'
import { useApp } from '../store'
import type { Pet } from '../types'

const SPECIES = ['Perro', 'Gato', 'Otro']

/** Avatar colors handed to new pets, cycled so consecutive additions differ. */
const TINTS = [
  { tint: '#DFF9F7', ink: '#0F8F88' },
  { tint: '#F0E6FF', ink: '#7A22C4' },
  { tint: '#FFE6F1', ink: '#E9207F' },
  { tint: '#FFF3D9', ink: '#B0840E' },
  { tint: '#E6F0FF', ink: '#2A55A0' },
]

function ageLabel(birth: string): string {
  if (!birth) return 'Edad sin registrar'
  const then = new Date(birth)
  if (Number.isNaN(then.getTime())) return 'Edad sin registrar'
  const now = new Date()
  let years = now.getFullYear() - then.getFullYear()
  const beforeBirthday =
    now.getMonth() < then.getMonth() ||
    (now.getMonth() === then.getMonth() && now.getDate() < then.getDate())
  if (beforeBirthday) years -= 1
  if (years < 1) {
    const months = Math.max(
      0,
      (now.getFullYear() - then.getFullYear()) * 12 + now.getMonth() - then.getMonth(),
    )
    return `${months} ${months === 1 ? 'mes' : 'meses'}`
  }
  return `${years} ${years === 1 ? 'año' : 'años'}`
}

export function PetNew() {
  const { state, go, addPet } = useApp()
  const fileRef = useRef<HTMLInputElement>(null)

  const [species, setSpecies] = useState('Perro')
  const [name, setName] = useState('Frida')
  const [breed, setBreed] = useState('Criolla')
  const [sex, setSex] = useState('Hembra')
  const [birth, setBirth] = useState('2021-03-14')
  const [weight, setWeight] = useState('8.4')
  const [notes, setNotes] = useState('')
  const [photo, setPhoto] = useState<string | null>(null)

  const pickPhoto = (file: File | undefined) => {
    if (!file) return
    setPhoto((old) => {
      if (old) URL.revokeObjectURL(old)
      return URL.createObjectURL(file)
    })
  }

  const save = (e: React.FormEvent) => {
    e.preventDefault()
    const clean = name.trim() || 'Sin nombre'
    const { tint, ink } = TINTS[state.pets.length % TINTS.length]
    const pet: Pet = {
      name: clean,
      meta: [species, breed.trim() || 'Sin raza', ageLabel(birth)].join(' · '),
      initial: clean[0].toUpperCase(),
      tint,
      ink,
      badge: 'PERFIL NUEVO',
      badgeBg: '#F1EDFD',
      badgeFg: '#6F6AA0',
      weight: weight ? `${weight} kg` : 'Peso sin registrar',
      ...(photo ? { photo } : {}),
    }
    addPet(pet)
  }

  return (
    <section className="screen petnew">
      <header className="petnew__head">
        <button type="button" className="petnew__skip" onClick={() => go('home')}>
          Ahora no
        </button>
        <h1 className="petnew__title">¿A quién vamos a consentir?</h1>
        <p className="petnew__sub">Puedes agregar más peluditos después.</p>
      </header>

      <form className="petnew__form" onSubmit={save}>
        <div className="petnew__identity">
          <button
            type="button"
            className="photo-tile"
            onClick={() => fileRef.current?.click()}
            aria-label="Agregar foto"
          >
            {photo ? (
              <img className="photo-tile__img" src={photo} alt="" />
            ) : (
              <>
                <Icon name="plus" size={22} color="#7A22C4" />
                <span className="photo-tile__label">FOTO</span>
              </>
            )}
          </button>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="visually-hidden"
            onChange={(e) => pickPhoto(e.target.files?.[0])}
          />
          <Field label="Nombre" style={{ flex: 1 }}>
            <input
              className="input input--sm input--strong"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </Field>
        </div>

        <div className="petnew__group">
          <span className="field__label">Especie</span>
          <div className="segmented">
            {SPECIES.map((s) => (
              <button
                key={s}
                type="button"
                className={s === species ? 'segmented__item segmented__item--on' : 'segmented__item'}
                onClick={() => setSpecies(s)}
                aria-pressed={s === species}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        <div className="petnew__grid">
          <Field label="Raza">
            <input
              className="input input--sm"
              value={breed}
              onChange={(e) => setBreed(e.target.value)}
            />
          </Field>
          <Field label="Sexo">
            <select
              className="input input--sm"
              value={sex}
              onChange={(e) => setSex(e.target.value)}
            >
              <option>Hembra</option>
              <option>Macho</option>
            </select>
          </Field>
          <Field label="Nacimiento">
            <input
              className="input input--sm"
              type="date"
              value={birth}
              onChange={(e) => setBirth(e.target.value)}
            />
          </Field>
          <Field label="Peso (kg)">
            <input
              className="input input--sm"
              type="number"
              inputMode="decimal"
              step="0.1"
              min="0"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
            />
          </Field>
        </div>

        <Field label="Notas para el veterinario">
          <textarea
            className="input input--area"
            rows={3}
            value={notes}
            placeholder="Alergias, medicamentos, temperamento…"
            onChange={(e) => setNotes(e.target.value)}
          />
        </Field>

        <button type="submit" className="btn btn--pink">
          Guardar mascota
        </button>
      </form>
    </section>
  )
}
