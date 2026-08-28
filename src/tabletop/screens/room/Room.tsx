// Pantalla de sala (SPEC s.21). Vista pasiva.
// Regla no negociable: nunca exhibe individualmente a los participantes.

import { BarraFases, SeveridadChip, Chip } from '../../components/ui'
import { elapsedMsAt, fmtHMS, fmtNarrativo, narrativeSecAt } from '../../domain/clock'
import { inyeccionVisibleEnSala } from '../../domain/rules'
import { useStore } from '../../store'

export function Room() {
  const { config, events, estado, now } = useStore()
  const elapsed = elapsedMsAt(events, now) / 1000
  const narrativo = narrativeSecAt(events, now)
  const fase = config.fases.find((f) => f.id === estado.fase_actual_id)

  // Solo inyecciones públicas marcadas visible_en_sala; la más reciente activa.
  const activaPublica = config.inyecciones
    .filter((i) => inyeccionVisibleEnSala(i))
    .filter((i) => estado.inyecciones[i.id].estado === 'activa')
    .sort(
      (a, b) =>
        (estado.inyecciones[b.id].disparada_en ?? 0) - (estado.inyecciones[a.id].disparada_en ?? 0),
    )[0]

  const disparadas = config.inyecciones.filter((i) =>
    ['activa', 'cerrada'].includes(estado.inyecciones[i.id].estado),
  ).length

  return (
    <div className="tt-sala">
      <header className="tt-fila" style={{ justifyContent: 'space-between' }}>
        <div className="tt-brand">
          <strong style={{ color: '#fff' }}>ARSEG Tabletop</strong>
          <span style={{ color: '#aab3d6' }}>{config.nombre} · {config.cliente}</span>
        </div>
        {estado.estado === 'pausado' && <Chip tone="warn">Ejercicio en pausa</Chip>}
        {estado.estado === 'cerrado' && <Chip tone="ok">Ejercicio cerrado</Chip>}
      </header>

      <div className="tt-reloj">
        <span className="tt-reloj__real">{fmtHMS(elapsed)}</span>
        <span className="tt-reloj__narrativo">{fmtNarrativo(narrativo)}</span>
      </div>

      <BarraFases fases={config.fases} actualId={estado.fase_actual_id} />

      {activaPublica ? (
        <div className={'tt-sala__card tt-sala__inyeccion'}>
          <div className="tt-fila" style={{ marginBottom: 10 }}>
            <span className="tt-mono" style={{ color: '#aab3d6' }}>{activaPublica.clave}</span>
            <SeveridadChip severidad={activaPublica.severidad_disenada} />
          </div>
          <h2>{activaPublica.titulo}</h2>
          <p>{activaPublica.cuerpo}</p>
        </div>
      ) : (
        <div className="tt-sala__card" style={{ textAlign: 'center' }}>
          <h2 style={{ color: '#dfe4f7' }}>
            {estado.estado === 'preparado' ? 'El ejercicio comenzará en breve' : 'Esperando la siguiente inyección'}
          </h2>
          <p style={{ color: '#aab3d6', marginTop: 8 }}>{config.escenario}</p>
        </div>
      )}

      {/* Indicadores narrativos del incidente — nunca desempeño individual */}
      <footer className="tt-fila" style={{ gap: 24, color: '#aab3d6' }}>
        <span className="tt-small">
          Fase: <strong style={{ color: '#fff' }}>{fase?.nombre ?? '—'}</strong>
        </span>
        <span className="tt-small">
          Inyecciones presentadas al grupo:{' '}
          <strong className="tt-mono" style={{ color: '#fff' }}>{disparadas}</strong>
        </span>
        <span className="tt-small">Esto es una simulación: ninguna acción afecta sistemas reales.</span>
      </footer>
    </div>
  )
}
