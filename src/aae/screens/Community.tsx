import { Icon } from '../components/Icon'
import { Avatar, Chip, SectionTitle, Tag } from '../components/ui'
import { THREADS, THREAD_TOPICS } from '../data/community'
import { useApp } from '../store'
import { C } from '../theme'

export function Community() {
  const { state, set, open } = useApp()

  const list = THREADS.filter(
    (t) => state.communityTopic === 'Todos' || t.topic === state.communityTopic,
  )

  return (
    <section className="screen scroll scroll--tabbed community">
      <header className="community__head">
        <h1>Comunidad</h1>
        <p>Auditores en formación y graduados de la ruta ISO 9001</p>
      </header>

      <div className="card live">
        <span className="live__badge">EN VIVO · jue 19:00</span>
        <h2>Q&amp;A con Julián O., auditor líder IRCA</h2>
        <p>Redacción de hallazgos: trae los tuyos y los revisamos en sala.</p>
        <button type="button" className="ghost ghost--wide">
          <Icon name="users" size={16} color={C.brand} />
          Reservar lugar
        </button>
      </div>

      <div className="chips chips--scroll">
        {THREAD_TOPICS.map((t) => (
          <Chip
            key={t}
            label={t}
            on={state.communityTopic === t}
            onClick={() => set({ communityTopic: t })}
          />
        ))}
      </div>

      <SectionTitle>Hilos recientes</SectionTitle>
      <div className="threads">
        {list.map((t) => {
          const locked = t.level === 3 && !state.certified
          const extra = state.replies[t.id]?.length ?? 0
          return (
            <button
              key={t.id}
              type="button"
              className={locked ? 'thread thread--locked' : 'thread'}
              onClick={() => (locked ? open('paywall', { planId: 'level3' }) : open('thread', { threadId: t.id }))}
            >
              <div className="thread__top">
                <Avatar label={t.initials} size={34} />
                <div className="thread__who">
                  <span className="thread__author">{t.author}</span>
                  <span className="thread__when">{t.when}</span>
                </div>
                {locked ? (
                  <Icon name="lock" size={15} color={C.l3} />
                ) : (
                  <Tag bg="#F1F5FA" fg={C.label} wide>
                    {t.topic}
                  </Tag>
                )}
              </div>
              <h3 className="thread__title">{t.title}</h3>
              <p className="thread__body">
                {locked ? 'Hilo exclusivo de la comunidad de graduados.' : t.body}
              </p>
              <span className="thread__meta">
                <Icon name="users" size={14} color={C.idle} />
                {t.replies.length + extra}{' '}
                {t.replies.length + extra === 1 ? 'respuesta' : 'respuestas'}
              </span>
            </button>
          )
        })}
      </div>

      {!state.certified && (
        <div className="card gradnote">
          <span className="gradnote__icon">
            <Icon name="award" size={18} color={C.l3} />
          </span>
          <div>
            <h3>Comunidad de graduados</h3>
            <p>Se abre al aprobar el Nivel 3: mentorías grupales, bolsa de trabajo y networking.</p>
          </div>
        </div>
      )}
    </section>
  )
}
