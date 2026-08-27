import { BackHeader } from '../components/ui'
import { NOTIFICATIONS } from '../data/notifications'
import { useApp } from '../store'

export function Notifications() {
  const { go } = useApp()

  return (
    <section className="screen scroll notifs">
      <BackHeader title="Notificaciones" onBack={() => go('home')} className="back-header--sheet" />

      <div className="notifs__list">
        {NOTIFICATIONS.map((n) => (
          <button
            key={n.title}
            type="button"
            className={n.unread ? 'notif notif--unread' : 'notif'}
            onClick={() => go(n.to)}
          >
            <span className="notif__mono" style={{ background: n.tint, color: n.ink }}>
              {n.mono}
            </span>
            <span className="notif__main">
              <span className="notif__title">{n.title}</span>
              <span className="notif__body">{n.body}</span>
              <span className="notif__when">{n.when}</span>
            </span>
            {n.unread && <span className="notif__dot" aria-label="No leída" />}
          </button>
        ))}
      </div>
    </section>
  )
}
