import { Icon } from '../components/Icon'
import { Bar, LockedCard, Tag } from '../components/ui'
import { BY_LEVEL, levelMinutes } from '../data/modules'
import { PLANS, TRACK } from '../data/track'
import { useApp } from '../store'
import { C, levelColors } from '../theme'
import { hours, usd } from '../utils'
import type { Level } from '../types'

function ModuleRow({ id }: { id: string }) {
  const { state, open } = useApp()
  const mod = BY_LEVEL[1].concat(BY_LEVEL[2]).find((m) => m.id === id)
  if (!mod) return null
  const done = mod.lessons.filter((l) => state.done.includes(l.id)).length
  const complete = done === mod.lessons.length
  const quiz = state.quizzes[mod.id]
  const c = levelColors(mod.level)

  return (
    <button type="button" className="mod" onClick={() => open('module', { moduleId: mod.id })}>
      <span className="mod__mark" style={{ background: complete ? c.bg : '#F1F5FA' }}>
        {complete ? (
          <Icon name="check" size={15} color={c.fg} />
        ) : (
          <span className="mod__num">{done}/{mod.lessons.length}</span>
        )}
      </span>
      <span className="mod__text">
        <span className="mod__title">{mod.title}</span>
        <span className="mod__sub">{mod.summary}</span>
        {quiz && (
          <span className="mod__quiz" style={{ color: quiz.score === quiz.total ? C.ok : C.muted }}>
            Quiz {quiz.score}/{quiz.total}
          </span>
        )}
      </span>
      <Icon name="chevronRight" size={16} color={C.idle} />
    </button>
  )
}

function LevelBlock({ level }: { level: Level }) {
  const { state, levelProgress, unlocked, open, sims, canCertify } = useApp()
  const c = levelColors(level)
  const prog = levelProgress(level)
  const on = unlocked(level)
  const plan = PLANS.find((p) => p.id === (level === 2 ? 'level2' : 'level3'))

  return (
    <section className="levelblock">
      <header className="levelblock__head" style={{ background: c.bg }}>
        <div className="levelblock__title">
          <span className="levelblock__badge" style={{ background: c.fg }}>
            {level}
          </span>
          <div>
            <h2 style={{ color: c.fg }}>{c.name}</h2>
            <p>
              {level === 3
                ? `${TRACK.finalQuestions} preguntas · ${TRACK.finalMinutes} min · proctoreado`
                : `${BY_LEVEL[level].length} módulos · ${hours(levelMinutes(level))}`}
            </p>
          </div>
        </div>
        {level !== 3 &&
          (on ? (
            <Tag bg="#FFFFFF" fg={c.fg}>
              {prog.pct}%
            </Tag>
          ) : (
            <Tag bg="#FFFFFF" fg={c.fg}>
              {plan ? usd(plan.price) : ''}
            </Tag>
          ))}
      </header>

      {level !== 3 && on && (
        <div className="levelblock__bar">
          <Bar value={prog.pct} color={c.fg} label={`Avance nivel ${level}`} />
        </div>
      )}

      {level === 3 ? (
        state.certified ? (
          <div className="card list">
            <button type="button" className="mod" onClick={() => open('certificate')}>
              <span className="mod__mark" style={{ background: c.bg }}>
                <Icon name="award" size={16} color={c.fg} />
              </span>
              <span className="mod__text">
                <span className="mod__title">Certificado emitido</span>
                <span className="mod__sub">Credencial verificable, voucher e insignia</span>
              </span>
              <Icon name="chevronRight" size={16} color={C.idle} />
            </button>
          </div>
        ) : on ? (
          <div className="card list">
            <button type="button" className="mod" onClick={() => open('cert')}>
              <span className="mod__mark" style={{ background: c.bg }}>
                <Icon name={canCertify ? 'camera' : 'lock'} size={16} color={c.fg} />
              </span>
              <span className="mod__text">
                <span className="mod__title">
                  {canCertify ? 'Agenda tu examen proctoreado' : 'Requisitos de práctica'}
                </span>
                <span className="mod__sub">
                  {sims} de {TRACK.requiredSims} simuladores completos
                </span>
              </span>
              <Icon name="chevronRight" size={16} color={C.idle} />
            </button>
          </div>
        ) : (
          <LockedCard
            title="Certificación con voucher"
            body={`Examen supervisado, certificado con QR verificable y voucher canjeable con ${TRACK.registrar}.`}
            cta={`Ver Nivel 3 · ${plan ? usd(plan.price) : ''}`}
            onClick={() => open('paywall', { planId: 'level3' })}
          />
        )
      ) : on ? (
        <div className="card list">
          {BY_LEVEL[level].map((m) => (
            <ModuleRow key={m.id} id={m.id} />
          ))}
        </div>
      ) : (
        <LockedCard
          title="8 módulos avanzados y simulador adaptativo"
          body="Casos de estudio reales, banco de preguntas por tema, dashboard de desempeño y AAE Coach ilimitado."
          cta={`Desbloquear · ${plan ? usd(plan.price) : ''}`}
          onClick={() => open('paywall', { planId: 'level2' })}
        />
      )}
    </section>
  )
}

export function Path() {
  return (
    <section className="screen scroll scroll--tabbed path">
      <header className="path__head">
        <h1>Tu ruta</h1>
        <p>{TRACK.name}</p>
      </header>
      <LevelBlock level={1} />
      <LevelBlock level={2} />
      <LevelBlock level={3} />
    </section>
  )
}
