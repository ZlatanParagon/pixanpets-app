import { useEffect } from 'react'
import { Icon, type IconName } from '../components/Icon'
import { BackHeader } from '../components/ui'
import { NOTIFICATIONS } from '../data/notifications'
import { useApp } from '../store'
import { C } from '../theme'

const TINT: Record<string, { fg: string; bg: string }> = {
  racha: { fg: C.l2, bg: C.l2Bg },
  contenido: { fg: C.brand, bg: C.brandSoft },
  examen: { fg: C.l3, bg: C.l3Bg },
  oferta: { fg: C.gold, bg: C.goldBg },
  comunidad: { fg: C.l1, bg: C.l1Bg },
}

export function Notifications() {
  const { state, back, open, markNotifsRead } = useApp()

  useEffect(() => {
    markNotifsRead()
  }, [markNotifsRead])

  return (
    <section className="screen scroll notifs">
      <BackHeader title="Notificaciones" onBack={back} />

      <div className="card list">
        {NOTIFICATIONS.map((n) => {
          const tint = TINT[n.kind] ?? TINT.contenido
          const unread = !state.notifsRead.includes(n.id)
          return (
            <button
              key={n.id}
              type="button"
              className={unread ? 'notif notif--new' : 'notif'}
              onClick={() =>
                n.kind === 'oferta'
                  ? open('paywall', { planId: 'level2' })
                  : n.kind === 'comunidad'
                    ? open('thread', { threadId: 't2' })
                    : open('progress')
              }
            >
              <span className="notif__icon" style={{ background: tint.bg }}>
                <Icon name={n.icon as IconName} size={17} color={tint.fg} />
              </span>
              <span className="notif__text">
                <span className="notif__title">{n.title}</span>
                <span className="notif__body">{n.body}</span>
                <span className="notif__when">{n.when}</span>
              </span>
            </button>
          )
        })}
      </div>

      <p className="notifs__note">
        Los recordatorios de racha llegan a la hora en que sueles estudiar, no a una hora fija.
      </p>
    </section>
  )
}
