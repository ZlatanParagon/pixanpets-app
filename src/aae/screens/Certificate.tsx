import { Icon } from '../components/Icon'
import { BackHeader, Note, Primary, Row, SectionTitle } from '../components/ui'
import { TRACK } from '../data/track'
import { useApp } from '../store'
import { C } from '../theme'
import { pct, today } from '../utils'

/** Retícula que representa el QR verificable del certificado. */
function QrBlock() {
  const cells = Array.from({ length: 49 }, (_, i) => (i * 7 + (i % 5) * 3) % 11 > 4)
  return (
    <div className="qr" aria-label="Código QR de verificación">
      {cells.map((on, i) => (
        <span key={i} className={on ? 'qr__cell qr__cell--on' : 'qr__cell'} />
      ))}
    </div>
  )
}

export function Certificate() {
  const { state, back, go } = useApp()
  const attempt = state.attempts.filter((a) => a.mode === 'proctored').at(-1)
  const score = attempt ? pct(attempt.score, attempt.total) : 0
  const folio = `AAE-${TRACK.id.toUpperCase()}-${String(1000 + state.attempts.length)}`

  return (
    <section className="screen scroll certificate">
      <BackHeader title="Tu credencial" onBack={back} />

      <div className="diploma">
        <div className="diploma__head">
          <span className="brand__mark brand__mark--gold">AAE</span>
          <span className="diploma__issuer">Arseg Academy Express</span>
        </div>
        <p className="diploma__intro">Certifica que</p>
        <h1 className="diploma__name">{state.name}</h1>
        <p className="diploma__intro">acreditó la formación de</p>
        <h2 className="diploma__track">{TRACK.name}</h2>
        <div className="diploma__meta">
          <div>
            <span>Calificación</span>
            <strong>{score}%</strong>
          </div>
          <div>
            <span>Emitido</span>
            <strong>{today()}</strong>
          </div>
          <div>
            <span>Folio</span>
            <strong>{folio}</strong>
          </div>
        </div>
        <div className="diploma__qr">
          <QrBlock />
          <p>
            Verificable en aae.arseg.mx/v/{folio.toLowerCase()} — el sello queda anclado en cadena
            de bloques con la fecha de emisión.
          </p>
        </div>
      </div>

      <div className="card voucher">
        <div className="voucher__top">
          <span className="voucher__icon">
            <Icon name="star" size={18} color={C.gold} />
          </span>
          <div>
            <h3>Voucher de certificación</h3>
            <p>Canjeable con {TRACK.registrar}</p>
          </div>
        </div>
        <span className="voucher__code">{state.voucher ?? 'AAE-9001-XXXX'}</span>
        <p className="voucher__legal">
          Nominativo e intransferible · vigencia de 12 meses · la certificación externa la emite la
          entidad acreditada, no AAE.
        </p>
      </div>

      <SectionTitle>Compártelo</SectionTitle>
      <div className="card list">
        <Row icon="share" title="Añadir insignia a LinkedIn" sub="Publica la credencial en tu perfil" onClick={() => undefined} />
        <Row icon="download" title="Descargar certificado en PDF" sub="Firmado digitalmente" onClick={() => undefined} />
        <Row icon="qr" title="Copiar enlace de verificación" sub="Para tu CV o firma de correo" onClick={() => undefined} />
      </div>

      <SectionTitle>Lo que se abre ahora</SectionTitle>
      <div className="card list">
        <Row
          icon="users"
          title="Comunidad de graduados"
          sub="Mentorías grupales y networking"
          onClick={() => go('community')}
          color={C.l3}
          bg={C.l3Bg}
        />
        <Row
          icon="sparkle"
          title="30 % de descuento en cursos avanzados"
          sub="ISO 14001 y 45001, próximamente"
          color={C.gold}
          bg={C.goldBg}
        />
        <Row
          icon="mail"
          title="Programa de referidos"
          sub="Recomienda y gana un mes Premium por alta"
        />
      </div>

      <Note tone="gold" icon="info">
        Tu credencial AAE se actualiza cada año con los cambios de la norma. Te avisamos cuando
        toque revalidar.
      </Note>

      <Primary tone="gold" onClick={() => go('home')}>
        Volver al inicio
      </Primary>
    </section>
  )
}
