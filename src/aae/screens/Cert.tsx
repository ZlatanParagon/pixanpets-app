import { Icon } from '../components/Icon'
import { BackHeader, Note, Primary, Tag } from '../components/ui'
import { TRACK } from '../data/track'
import { EXAM_CONFIG, useApp } from '../store'
import { C } from '../theme'

const SLOTS = [
  'Jue 9 oct · 09:00',
  'Jue 9 oct · 17:00',
  'Sáb 11 oct · 10:00',
  'Mar 14 oct · 19:00',
]

/** Requisito cumplido / pendiente, con su marca. */
function Req({ ok, title, sub }: { ok: boolean; title: string; sub: string }) {
  return (
    <div className="req">
      <span className="req__mark" style={{ background: ok ? C.okBg : '#F1F5FA' }}>
        <Icon name={ok ? 'check' : 'close'} size={13} color={ok ? C.ok : C.idle} />
      </span>
      <div className="req__text">
        <span className="req__title">{title}</span>
        <span className="req__sub">{sub}</span>
      </div>
    </div>
  )
}

export function Cert() {
  const { state, back, set, open, startExam, levelProgress, sims, readiness } = useApp()

  if (!state.ent.level3) {
    return (
      <section className="screen scroll cert">
        <BackHeader title="Certificación" onBack={back} />
        <Note tone="warn" icon="lock">
          El Nivel 3 incluye el examen proctoreado, el certificado verificable y el voucher.
        </Note>
        <Primary tone="l3" onClick={() => open('paywall', { planId: 'level3' })}>
          Ver el Nivel 3
        </Primary>
      </section>
    )
  }

  const l2 = levelProgress(2)
  const reqSims = sims >= TRACK.requiredSims
  const reqContent = l2.pct >= 80
  const reqScore = readiness >= TRACK.passMark
  const allReq = reqSims && reqContent && reqScore
  const ready = allReq && state.idVerified && state.certSlot

  return (
    <section className="screen scroll cert">
      <BackHeader
        title="Examen certificador"
        onBack={back}
        sub={`${TRACK.finalQuestions} preguntas · ${TRACK.finalMinutes} min · supervisado`}
      />

      <div className="card cert__req">
        <h2>Requisitos</h2>
        <Req
          ok={reqSims}
          title={`${TRACK.requiredSims} simuladores completos`}
          sub={`Llevas ${sims}`}
        />
        <Req
          ok={reqContent}
          title="80 % del Nivel 2"
          sub={`Llevas ${l2.pct}%`}
        />
        <Req
          ok={reqScore}
          title={`Acierto acumulado ≥ ${TRACK.passMark}%`}
          sub={`Llevas ${readiness}%`}
        />
      </div>

      <div className="card cert__step">
        <div className="cert__step-head">
          <h2>1. Verifica tu identidad</h2>
          {state.idVerified && (
            <Tag bg={C.okBg} fg={C.ok}>
              Listo
            </Tag>
          )}
        </div>
        <p>
          Una foto de tu identificación oficial y una selfie. El sistema compara ambas y guarda el
          resultado, no las imágenes.
        </p>
        <button
          type="button"
          className={state.idVerified ? 'ghost ghost--on ghost--wide' : 'ghost ghost--wide'}
          onClick={() => set({ idVerified: true })}
          disabled={!allReq}
        >
          <Icon name="camera" size={16} color={state.idVerified ? C.ok : C.brand} />
          {state.idVerified ? 'Identidad verificada' : 'Verificar identidad'}
        </button>
      </div>

      <div className="card cert__step">
        <div className="cert__step-head">
          <h2>2. Agenda tu sesión</h2>
          {state.certSlot && (
            <Tag bg={C.okBg} fg={C.ok}>
              {state.certSlot}
            </Tag>
          )}
        </div>
        <div className="slots">
          {SLOTS.map((s) => (
            <button
              key={s}
              type="button"
              className={state.certSlot === s ? 'slot slot--on' : 'slot'}
              onClick={() => set({ certSlot: s })}
              disabled={!state.idVerified}
              aria-pressed={state.certSlot === s}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <Note tone="warn" icon="camera">
        Durante el examen se graban cámara y pantalla, y un modelo marca comportamientos atípicos.
        Necesitas un espacio cerrado, sin material de apoyo y con conexión estable.
      </Note>

      <Primary tone="l3" disabled={!ready} onClick={() => startExam('proctored')}>
        {ready ? 'Iniciar examen proctoreado' : 'Completa los pasos anteriores'}
      </Primary>
      <p className="cert__note">
        {EXAM_CONFIG.proctored.n} preguntas, {EXAM_CONFIG.proctored.minutes} minutos, mínimo{' '}
        {TRACK.passMark}% para aprobar. Incluye un reintento.
      </p>
    </section>
  )
}
