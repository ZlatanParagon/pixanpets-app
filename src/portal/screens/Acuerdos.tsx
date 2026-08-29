// Acuerdos y alcance (SPEC v0.3, 5.2): revisiones inmutables, índice de
// secciones, comentarios anclados a revisión+sección y constancia de
// formalización externa. Sin edición de documentos ni firma en el portal (MVP).

import { useState } from 'react'
import { useStore } from '../store'
import { comentarAcuerdo } from '../domain/comandos'
import { acuerdosVisibles } from '../domain/consultas'
import { Aviso, ChipClasificacion, Estado, Tarjeta, fechaCorta } from '../components/ui'

const TIPO: Record<string, string> = {
  confidencialidad: 'Acuerdo de confidencialidad',
  marco: 'Contrato marco',
  alcance_inicial: 'Acuerdo de alcance (SOW)',
  modificacion: 'Modificación de alcance',
}

export function Acuerdos() {
  const { estado, ctx, ejecutar } = useStore()
  const [comentario, setComentario] = useState('')
  const [seccionSel, setSeccionSel] = useState('')
  const [error, setError] = useState<string | null>(null)
  if (!ctx) return null

  const acuerdos = acuerdosVisibles(estado, ctx)

  return (
    <>
      <h1>Acuerdos y alcance</h1>
      {acuerdos.length === 0 && (
        <Tarjeta>
          <p className="texto-secundario">No hay acuerdos visibles con tus permisos.</p>
        </Tarjeta>
      )}
      {acuerdos.map(({ acuerdo, revisiones }) => (
        <Tarjeta key={acuerdo.id}>
          <h2>
            <span className="mono">{acuerdo.clave}</span> · {TIPO[acuerdo.tipo]}
          </h2>
          {revisiones.map((r) => {
            const secciones = estado.seccionesAcuerdo
              .filter((s) => s.acuerdo_revision_id === r.id)
              .sort((a, b) => a.orden - b.orden)
            const comentarios = estado.comentariosAcuerdo.filter((c) => c.acuerdo_revision_id === r.id)
            const formalizacion = estado.formalizaciones.find((f) => f.revision_instrumento_id === r.id)
            return (
              <div key={r.id} className="revision-acuerdo">
                <p className="fila-estados">
                  <strong>Revisión {r.numero_revision}</strong>
                  {r.estado_editorial === 'superada' ? (
                    <Estado tono="neutro">Revisión superada</Estado>
                  ) : (
                    <Estado tono="estable">Vigente</Estado>
                  )}
                  <ChipClasificacion valor={r.clasificacion} />
                </p>
                <p className="texto-secundario">
                  Publicada el {fechaCorta(r.publicado_en)} · <span className="mono">hash {r.hash_documento}</span>
                </p>
                <p className="texto-secundario">Resumen de cambios: {r.resumen_cambios}</p>
                {r.estado_editorial === 'superada' && (
                  <p className="texto-secundario">
                    «Revisión superada» describe una versión editorial; no declara que un compromiso formalizado
                    desapareció (5.2).
                  </p>
                )}
                {formalizacion && (
                  <Aviso>
                    Formalizado fuera del portal el {fechaCorta(formalizacion.fecha_acto)}. Firmante según instrumento:{' '}
                    {formalizacion.firmante_segun_instrumento}. Evidencia registrada por ARSEG y validada; el registro
                    distingue firmante, registrador y validador (PA-13).
                  </Aviso>
                )}
                {secciones.length > 0 && (
                  <>
                    <h3>Índice y comentarios</h3>
                    <ul className="lista-secciones">
                      {secciones.map((s) => (
                        <li key={s.id}>
                          <span className="mono">{s.clave_seccion}.</span> {s.titulo}
                          {comentarios
                            .filter((c) => c.seccion_id === s.id)
                            .map((c) => (
                              <blockquote key={c.id} className="respuesta">
                                <p>{c.texto}</p>
                                <footer className="texto-secundario">
                                  {fechaCorta(c.creado_en)} · {c.estado === 'abierto' ? 'Abierto' : c.estado === 'atendido' ? 'Atendido' : 'Trasladado a nueva revisión'}
                                </footer>
                              </blockquote>
                            ))}
                        </li>
                      ))}
                    </ul>
                    {r.estado_editorial === 'publicada' && ctx.membresia.rol !== 'consulta' && ctx.membresia.rol !== 'administracion' && (
                      <div className="acciones-compromiso">
                        <label>
                          Sección
                          <select value={seccionSel} onChange={(e) => setSeccionSel(e.target.value)}>
                            <option value="">Elegir sección…</option>
                            {secciones.map((s) => (
                              <option key={s.id} value={s.id}>
                                {s.clave_seccion}. {s.titulo}
                              </option>
                            ))}
                          </select>
                        </label>
                        <label>
                          Comentario
                          <textarea value={comentario} onChange={(e) => setComentario(e.target.value)} rows={2} />
                        </label>
                        <button
                          className="boton-primario"
                          disabled={!comentario.trim() || !seccionSel}
                          onClick={() => {
                            setError(
                              ejecutar((e, cx, g, ah) =>
                                comentarAcuerdo(e, cx, g, ah, { acuerdo_revision_id: r.id, seccion_id: seccionSel, texto: comentario }),
                              ),
                            )
                            setComentario('')
                            setSeccionSel('')
                          }}
                        >
                          Comentar
                        </button>
                      </div>
                    )}
                  </>
                )}
              </div>
            )
          })}
        </Tarjeta>
      ))}
      {error && <Aviso tono="error">{error}</Aviso>}
    </>
  )
}
