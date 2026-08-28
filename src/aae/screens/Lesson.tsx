import { useState } from 'react'
import { Icon } from '../components/Icon'
import { BackHeader, Note, Primary } from '../components/ui'
import { lessonById } from '../data/modules'
import { useApp } from '../store'
import { C } from '../theme'

/**
 * Reproductor de lección. El video real vendría de Cloudflare Stream; aquí el
 * lienzo simula la superficie de reproducción con sus controles: velocidad,
 * subtítulos y descarga offline.
 */
export function Lesson() {
  const { state, back, set, open, completeLesson, toggleBookmark, startQuiz } = useApp()
  const found = lessonById(state.lessonId)
  const [speed, setSpeed] = useState(1)
  const [captions, setCaptions] = useState(true)
  const [saved, setSaved] = useState(false)

  if (!found) return null
  const { module: mod, lesson } = found
  const idx = mod.lessons.findIndex((l) => l.id === lesson.id)
  const next = mod.lessons[idx + 1]
  const isDone = state.done.includes(lesson.id)
  const note = state.notes[lesson.id] ?? ''

  function finish() {
    completeLesson(lesson.id, lesson.min)
    if (next) {
      set({ lessonId: next.id })
    } else {
      startQuiz(mod.id)
    }
  }

  return (
    <section className="screen scroll lesson">
      <BackHeader
        title={`Lección ${idx + 1} de ${mod.lessons.length}`}
        onBack={back}
        sub={mod.title}
        right={
          <button
            type="button"
            className="icon-btn"
            onClick={() => toggleBookmark(lesson.id)}
            aria-label={state.bookmarks.includes(lesson.id) ? 'Quitar marcador' : 'Guardar marcador'}
            aria-pressed={state.bookmarks.includes(lesson.id)}
          >
            <Icon
              name="bookmark"
              size={17}
              color={state.bookmarks.includes(lesson.id) ? C.brand : C.idle}
            />
          </button>
        }
      />

      <div className="player">
        <div className="player__stage">
          <span className="player__play">
            <Icon name="play" size={26} color="#fff" />
          </span>
          <span className="player__kind">{lesson.kind}</span>
        </div>
        <div className="player__bar">
          <span className="player__progress" style={{ width: isDone ? '100%' : '38%' }} />
        </div>
        <div className="player__controls">
          <span className="player__time">
            {isDone ? `${lesson.min}:00` : '2:18'} / {lesson.min}:00
          </span>
          <div className="player__buttons">
            {[0.75, 1, 1.5, 2].map((s) => (
              <button
                key={s}
                type="button"
                className={speed === s ? 'speed speed--on' : 'speed'}
                onClick={() => setSpeed(s)}
              >
                {s}x
              </button>
            ))}
            <button
              type="button"
              className={captions ? 'speed speed--on' : 'speed'}
              onClick={() => setCaptions(!captions)}
              aria-pressed={captions}
            >
              CC
            </button>
          </div>
        </div>
      </div>

      <h1 className="lesson__title">{lesson.title}</h1>

      <div className="card lesson__points">
        <h2>Lo esencial</h2>
        <ul>
          {lesson.points.map((p) => (
            <li key={p}>
              <Icon name="check" size={14} color={C.brand} />
              <span>{p}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="card lesson__notes">
        <h2>Tus apuntes</h2>
        <textarea
          className="input input--area"
          value={note}
          placeholder="Se sincronizan con tu cuenta."
          onChange={(e) => set({ notes: { ...state.notes, [lesson.id]: e.target.value } })}
        />
      </div>

      <div className="lesson__offline">
        <button
          type="button"
          className={saved ? 'ghost ghost--on' : 'ghost'}
          onClick={() => setSaved(!saved)}
        >
          <Icon name="download" size={16} color={saved ? C.ok : C.brand} />
          {saved ? 'Disponible sin conexión' : 'Descargar para offline'}
        </button>
        <button type="button" className="ghost" onClick={() => open('coach')}>
          <Icon name="sparkle" size={16} color={C.brand} />
          Preguntar al Coach
        </button>
      </div>

      {isDone && !next && (
        <Note tone="ok" icon="checkCircle">
          Completaste el módulo. El quiz mide si el contenido se quedó.
        </Note>
      )}

      <Primary onClick={finish}>
        {next ? 'Marcar completada y seguir' : 'Completar módulo e ir al quiz'}
      </Primary>
    </section>
  )
}
