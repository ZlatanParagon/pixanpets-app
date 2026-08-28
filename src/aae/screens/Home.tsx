import { Icon } from '../components/Icon'
import { Bar, LevelPill, Primary, Row, SectionTitle } from '../components/ui'
import { NOTIFICATIONS } from '../data/notifications'
import { TRACK } from '../data/track'
import { nextModule, useApp } from '../store'
import { C } from '../theme'
import { hours, pct } from '../utils'

export function Home() {
  const { state, go, open, levelProgress, readiness, weakest, totalXp, sims } = useApp()

  const l1 = levelProgress(1)
  const l2 = levelProgress(2)
  const activeLevel = state.ent.level2 && l1.pct === 100 ? 2 : 1
  const prog = activeLevel === 1 ? l1 : l2
  const next = nextModule(state.done)
  const nextLesson = next?.lessons.find((l) => !state.done.includes(l.id))
  const unread = NOTIFICATIONS.filter((n) => !state.notifsRead.includes(n.id)).length

  return (
    <section className="screen scroll scroll--tabbed home">
      <header className="home__hero">
        <div className="home__row">
          <div>
            <p className="home__hello">Hola, {state.name}</p>
            <p className="home__track">{TRACK.name}</p>
          </div>
          <button
            type="button"
            className="home__bell"
            onClick={() => open('notifs')}
            aria-label="Ver notificaciones"
          >
            <Icon name="bell" size={19} color="#fff" />
            {unread > 0 && <span className="home__dot" />}
          </button>
        </div>

        <div className="home__stats">
          <div className="home__stat">
            <Icon name="flame" size={16} color="#FFC46B" />
            <strong>{state.streak}</strong>
            <span>días de racha</span>
          </div>
          <div className="home__stat">
            <Icon name="sparkle" size={16} color="#FFC46B" />
            <strong>{totalXp}</strong>
            <span>XP</span>
          </div>
          <div className="home__stat">
            <Icon name="clock" size={16} color="#FFC46B" />
            <strong>{hours(state.minutes)}</strong>
            <span>de estudio</span>
          </div>
        </div>
      </header>

      <div className="home__body">
        <div className="card home__continue">
          <div className="home__continue-top">
            <LevelPill level={activeLevel} />
            <span className="home__pctlabel">{prog.pct}%</span>
          </div>
          <Bar
            value={prog.pct}
            color={activeLevel === 1 ? C.l1 : C.l2}
            label={`Avance del nivel ${activeLevel}`}
          />
          {next && nextLesson ? (
            <>
              <p className="home__continue-title">{next.title}</p>
              <p className="home__continue-sub">
                Sigue: {nextLesson.title} · {nextLesson.min} min
              </p>
              <Primary
                onClick={() =>
                  open('lesson', { moduleId: next.id, lessonId: nextLesson.id })
                }
              >
                Continuar
              </Primary>
            </>
          ) : (
            <>
              <p className="home__continue-title">Terminaste todo el contenido disponible</p>
              <p className="home__continue-sub">Ahora toca practicar hasta la zona de aprobación.</p>
              <Primary onClick={() => go('practice')}>Ir a práctica</Primary>
            </>
          )}
        </div>

        <div className="home__quick">
          <button type="button" className="quick" onClick={() => go('practice')}>
            <span className="quick__icon" style={{ background: C.l2Bg }}>
              <Icon name="target" size={20} color={C.l2} />
            </span>
            <span className="quick__title">Simulador</span>
            <span className="quick__sub">{sims} completos</span>
          </button>
          <button type="button" className="quick" onClick={() => open('coach')}>
            <span className="quick__icon" style={{ background: C.brandSoft }}>
              <Icon name="sparkle" size={20} color={C.brand} />
            </span>
            <span className="quick__title">AAE Coach</span>
            <span className="quick__sub">Resuelve tus dudas</span>
          </button>
        </div>

        {state.attempts.length > 0 && (
          <>
            <SectionTitle
              action={
                <button type="button" className="linkish" onClick={() => open('progress')}>
                  Ver dashboard
                </button>
              }
            >
              Tu desempeño
            </SectionTitle>
            <button type="button" className="card readiness" onClick={() => open('progress')}>
              <div className="readiness__top">
                <span className="readiness__pct" style={{ color: readiness >= TRACK.passMark ? C.ok : C.l2 }}>
                  {readiness}%
                </span>
                <span className="readiness__label">
                  acierto acumulado en {state.attempts.length}{' '}
                  {state.attempts.length === 1 ? 'intento' : 'intentos'}
                </span>
              </div>
              <Bar
                value={readiness}
                color={readiness >= TRACK.passMark ? C.ok : C.l2}
                label="Acierto acumulado"
              />
              <p className="readiness__hint">
                {weakest
                  ? `Tu tema más flojo es ${weakest.toLowerCase()}. Ahí está la mayor ganancia.`
                  : `Necesitas ${TRACK.passMark}% para aprobar el examen certificador.`}
              </p>
            </button>
          </>
        )}

        {l1.pct === 100 && !state.ent.level2 && (
          <button type="button" className="promo" onClick={() => open('paywall', { planId: 'level2' })}>
            <span className="promo__tag">Terminaste Fundamentos</span>
            <span className="promo__title">Desbloquea el Nivel 2</span>
            <span className="promo__body">
              Quienes completan el Nivel 2 aprueban el examen en 85 % de los casos. Incluye
              simulador adaptativo, casos reales y coach ilimitado.
            </span>
            <span className="promo__cta">
              Ver planes <Icon name="chevronRight" size={15} color="#fff" />
            </span>
          </button>
        )}

        <SectionTitle>Atajos</SectionTitle>
        <div className="card list">
          <Row
            icon="path"
            title="Ruta completa"
            sub={`Nivel 1 ${l1.pct}% · Nivel 2 ${state.ent.level2 ? `${l2.pct}%` : 'bloqueado'}`}
            onClick={() => go('path')}
          />
          <Row
            icon="award"
            title="Certificación"
            sub={
              state.certified
                ? 'Certificado emitido'
                : `${sims} de ${TRACK.requiredSims} simuladores requeridos`
            }
            onClick={() => open(state.certified ? 'certificate' : 'cert')}
            color={C.l3}
            bg={C.l3Bg}
          />
          <Row
            icon="trophy"
            title="Logros y ranking"
            sub={`${pct(totalXp, 2000)}% del camino a la cima`}
            onClick={() => open('achievements')}
            color={C.gold}
            bg={C.goldBg}
          />
        </div>
      </div>
    </section>
  )
}
