import { useEffect } from 'react'
import { Icon } from '../components/Icon'
import { BackHeader, Note, Primary, Tag } from '../components/ui'
import { caseById } from '../data/cases'
import { useApp } from '../store'
import { C } from '../theme'

export function Case() {
  const { state, back, open, readCase } = useApp()
  const c = caseById(state.caseId)
  const { caseId } = state

  useEffect(() => {
    readCase(caseId)
  }, [caseId, readCase])

  if (!c) return null

  return (
    <section className="screen scroll case">
      <BackHeader title="Caso de estudio" onBack={back} sub={c.sector} />

      <h1 className="case__title">{c.title}</h1>
      <div className="case__tags">
        <Tag bg={C.l2Bg} fg={C.l2} wide>
          Nivel 2
        </Tag>
        <Tag bg="#F1F5FA" fg={C.label} wide>
          {c.read}
        </Tag>
      </div>

      <div className="card case__context">
        <h2>Contexto</h2>
        <p>{c.context}</p>
      </div>

      <h2 className="case__h">Resolución paso a paso</h2>
      <ol className="steps">
        {c.steps.map((s, i) => (
          <li key={s.title} className="step">
            <span className="step__num">{i + 1}</span>
            <div>
              <h3>{s.title.replace(/^\d+\.\s*/, '')}</h3>
              <p>{s.body}</p>
            </div>
          </li>
        ))}
      </ol>

      <div className="card finding">
        <h2>
          <Icon name="flag" size={16} color={C.l3} />
          Hallazgo tal como se redactó
        </h2>
        <p>{c.finding}</p>
      </div>

      <Note tone="info" icon="info">
        Caso real anonimizado. Nombres, folios y fechas fueron alterados; la evidencia y la
        calificación del hallazgo se conservan.
      </Note>

      <Primary onClick={() => open('coach')}>Discutirlo con el Coach</Primary>
    </section>
  )
}
