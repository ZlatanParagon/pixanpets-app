import { Icon, type IconName } from '../components/Icon'
import { Avatar, BackHeader, SectionTitle } from '../components/ui'
import { LEADERBOARD } from '../data/achievements'
import { useApp } from '../store'
import { C } from '../theme'

export function Achievements() {
  const { state, back, achievements, totalXp } = useApp()

  const board = [
    ...LEADERBOARD,
    { name: `${state.name} (tú)`, initials: state.name.slice(0, 2).toUpperCase(), place: 'Tu zona', xp: totalXp },
  ].sort((a, b) => b.xp - a.xp)

  return (
    <section className="screen scroll achievements">
      <BackHeader title="Logros y ranking" onBack={back} sub={`${totalXp} XP acumulados`} />

      <div className="badges">
        {achievements.map(({ badge, on }) => (
          <div key={badge.id} className={on ? 'badge badge--on' : 'badge'}>
            <span className="badge__icon">
              <Icon
                name={badge.icon as IconName}
                size={22}
                color={on ? C.gold : C.idle}
              />
            </span>
            <span className="badge__title">{badge.title}</span>
            <span className="badge__detail">{badge.detail}</span>
            <span className="badge__xp" style={{ color: on ? C.gold : C.idle }}>
              +{badge.xp} XP
            </span>
          </div>
        ))}
      </div>

      <SectionTitle>Tabla de posiciones</SectionTitle>
      <div className="card list">
        {board.map((row, i) => {
          const me = row.name.includes('(tú)')
          return (
            <div key={row.name} className={me ? 'lb lb--me' : 'lb'}>
              <span className="lb__place">{i + 1}</span>
              <Avatar
                label={row.initials}
                size={34}
                bg={me ? C.brand : C.brandSoft}
                fg={me ? '#fff' : C.brand}
              />
              <span className="lb__text">
                <span className="lb__name">{row.name}</span>
                <span className="lb__where">{row.place}</span>
              </span>
              <span className="lb__xp">{row.xp} XP</span>
            </div>
          )
        })}
      </div>

      <p className="achievements__note">
        El ranking es por región y profesión, y se reinicia cada temporada de 90 días.
      </p>
    </section>
  )
}
