import { Icon } from '../components/Icon'
import { Avatar, Bar, Row, SectionTitle, Stat, Tag } from '../components/ui'
import { PLANS, TRACK } from '../data/track'
import { useApp } from '../store'
import { C } from '../theme'
import { hours, usd } from '../utils'

export function Profile() {
  const { state, open, go, reset, totalXp, achievements, levelProgress, sims } = useApp()
  const unlockedCount = achievements.filter((a) => a.on).length
  const l1 = levelProgress(1)
  const nextPlan = !state.ent.level2
    ? PLANS[0]
    : !state.ent.level3
      ? PLANS[1]
      : undefined

  return (
    <section className="screen scroll scroll--tabbed profile">
      <header className="profile__head">
        <Avatar label={state.name.slice(0, 2).toUpperCase()} size={64} bg="#FFFFFF" fg={C.brand} />
        <h1>{state.name}</h1>
        <p>{state.email || 'ana@empresa.com'}</p>
        <div className="profile__tags">
          <Tag bg="rgba(255,255,255,.18)" fg="#fff" wide>
            {TRACK.short}
          </Tag>
          <Tag bg="rgba(255,255,255,.18)" fg="#fff" wide>
            {state.certified ? 'Certificado' : state.ent.level2 ? 'Nivel 2' : 'Nivel 1'}
          </Tag>
        </div>
      </header>

      <div className="profile__body">
        <div className="statgrid">
          <Stat value={totalXp} label="XP" color={C.gold} />
          <Stat value={state.streak} label="Racha" color={C.l2} />
          <Stat value={hours(state.minutes)} label="Estudio" />
          <Stat value={sims} label="Simuladores" />
        </div>

        <button type="button" className="card xpcard" onClick={() => open('achievements')}>
          <div className="xpcard__top">
            <span>
              <Icon name="trophy" size={16} color={C.gold} /> {unlockedCount} de{' '}
              {achievements.length} logros
            </span>
            <Icon name="chevronRight" size={16} color={C.idle} />
          </div>
          <Bar value={(unlockedCount / achievements.length) * 100} color={C.gold} label="Logros" />
        </button>

        {nextPlan && (
          <button
            type="button"
            className="promo promo--slim"
            onClick={() => open('paywall', { planId: nextPlan.id })}
          >
            <span className="promo__title">{nextPlan.name}</span>
            <span className="promo__body">{nextPlan.tagline}</span>
            <span className="promo__cta">
              {usd(nextPlan.price)} <Icon name="chevronRight" size={15} color="#fff" />
            </span>
          </button>
        )}

        <SectionTitle>Aprendizaje</SectionTitle>
        <div className="card list">
          <Row
            icon="path"
            title="Mi ruta"
            sub={`Nivel 1 ${l1.pct}% · ${TRACK.name}`}
            onClick={() => go('path')}
          />
          <Row
            icon="chart"
            title="Dashboard de progreso"
            sub="Desempeño por tema y fecha estimada"
            onClick={() => open('progress')}
          />
          <Row
            icon="bookmark"
            title="Marcadores y apuntes"
            sub={`${state.bookmarks.length} marcadores · ${Object.keys(state.notes).length} apuntes`}
          />
          <Row icon="download" title="Descargas offline" sub="Gestiona el contenido guardado" />
        </div>

        <SectionTitle>Cuenta</SectionTitle>
        <div className="card list">
          <Row
            icon="award"
            title="Certificación"
            sub={state.certified ? 'Credencial emitida' : 'Requisitos y agenda'}
            onClick={() => open(state.certified ? 'certificate' : 'cert')}
            color={C.l3}
            bg={C.l3Bg}
          />
          <Row icon="card" title="Plan y facturación" sub={state.ent.level3 ? 'Nivel 3 · pago único' : state.ent.level2 ? 'Nivel 2 · pago único' : 'Gratis'} />
          <Row
            icon="bell"
            title="Notificaciones"
            sub="Recordatorios de estudio y avisos"
            onClick={() => open('notifs')}
          />
          <Row icon="users" title="Programa de referidos" sub="Recomienda y gana un mes Premium" />
          <Row icon="shield" title="Privacidad y datos" sub="Qué guardamos y por cuánto tiempo" />
        </div>

        <button type="button" className="logout" onClick={reset}>
          <Icon name="logout" size={16} color={C.bad} />
          Cerrar sesión
        </button>
        <p className="profile__version">AAE · prototipo de producto · ruta {TRACK.short}</p>
      </div>
    </section>
  )
}
