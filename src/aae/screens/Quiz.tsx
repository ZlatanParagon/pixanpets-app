import { Icon } from '../components/Icon'
import { BackHeader, Bar, Primary, Ghost } from '../components/ui'
import { MODULES, moduleById } from '../data/modules'
import { BY_ID } from '../data/questions'
import { useApp } from '../store'
import { C } from '../theme'
import { pct } from '../utils'

export function Quiz() {
  const { state, back, go, set, answerQuiz, nextQuiz, startQuiz } = useApp()
  const mod = moduleById(state.moduleId)
  if (!mod) return null

  const finished = state.quizIdx >= mod.quiz.length

  if (finished) {
    const score = mod.quiz.reduce(
      (sum, id, i) => sum + (BY_ID[id].answer === state.quizAnswers[i] ? 1 : 0),
      0,
    )
    const p = pct(score, mod.quiz.length)
    const good = p >= 70
    const nextMod = MODULES[MODULES.findIndex((m) => m.id === mod.id) + 1]
    const nextOpen = nextMod && (nextMod.level === 1 || state.ent.level2)

    return (
      <section className="screen scroll quiz">
        <BackHeader
          title="Resultado del quiz"
          onBack={() => set({ screen: 'module', moduleId: mod.id, stack: ['path'] })}
        />

        <div className="quizresult">
          <span
            className="quizresult__ring"
            style={{ borderColor: good ? C.ok : C.l2, color: good ? C.ok : C.l2 }}
          >
            {score}/{mod.quiz.length}
          </span>
          <h1>{good ? '¡Bien!' : 'Falta afinar'}</h1>
          <p>
            {good
              ? 'Dominas el módulo. Lo que sigue construye sobre esto.'
              : 'Repasa las lecciones marcadas abajo antes de avanzar: este tema reaparece en el examen.'}
          </p>
        </div>

        <div className="card list">
          {mod.quiz.map((id, i) => {
            const q = BY_ID[id]
            const ok = q.answer === state.quizAnswers[i]
            return (
              <div key={id} className="review">
                <span
                  className="review__mark"
                  style={{ background: ok ? C.okBg : C.badBg, color: ok ? C.ok : C.bad }}
                >
                  <Icon name={ok ? 'check' : 'close'} size={13} color={ok ? C.ok : C.bad} />
                </span>
                <div className="review__text">
                  <p className="review__q">{q.text}</p>
                  {!ok && (
                    <>
                      <p className="review__right">Correcta: {q.options[q.answer]}</p>
                      <p className="review__why">{q.why}</p>
                    </>
                  )}
                </div>
              </div>
            )
          })}
        </div>

        <Primary
          onClick={() =>
            nextOpen
              ? set({ screen: 'module', moduleId: nextMod.id, stack: ['path'] })
              : go('path')
          }
        >
          {nextOpen ? `Siguiente: ${nextMod.title}` : 'Volver a la ruta'}
        </Primary>
        <Ghost onClick={() => startQuiz(mod.id)}>Repetir quiz</Ghost>
      </section>
    )
  }

  const q = BY_ID[mod.quiz[state.quizIdx]]
  const picked = state.quizAnswers[state.quizIdx]

  return (
    <section className="screen scroll quiz">
      <BackHeader
        title={`Pregunta ${state.quizIdx + 1} de ${mod.quiz.length}`}
        onBack={back}
        sub={mod.title}
        right={
          <button
            type="button"
            className="icon-btn"
            onClick={() => set({ screen: 'module' })}
            aria-label="Salir del quiz"
          >
            <Icon name="close" size={17} color={C.idle} />
          </button>
        }
      />

      <Bar
        value={((state.quizIdx + (state.quizRevealed ? 1 : 0)) / mod.quiz.length) * 100}
        label="Avance del quiz"
      />

      <h1 className="quiz__q">{q.text}</h1>

      <div className="options">
        {q.options.map((opt, i) => {
          const isPicked = picked === i
          const isRight = q.answer === i
          const cls = !state.quizRevealed
            ? isPicked
              ? 'option option--on'
              : 'option'
            : isRight
              ? 'option option--right'
              : isPicked
                ? 'option option--wrong'
                : 'option option--dim'
          return (
            <button
              key={opt}
              type="button"
              className={cls}
              onClick={() => answerQuiz(i)}
              disabled={state.quizRevealed}
            >
              <span className="option__radio">
                {state.quizRevealed && isRight && <Icon name="check" size={13} color="#fff" />}
                {state.quizRevealed && isPicked && !isRight && (
                  <Icon name="close" size={13} color="#fff" />
                )}
                {!state.quizRevealed && isPicked && <Icon name="check" size={13} color="#fff" />}
              </span>
              {opt}
            </button>
          )
        })}
      </div>

      {state.quizRevealed && (
        <div className="explain">
          <h2>
            <Icon name="info" size={15} color={C.brand} /> Por qué
          </h2>
          <p>{q.why}</p>
        </div>
      )}

      <Primary disabled={!state.quizRevealed} onClick={nextQuiz}>
        {state.quizIdx + 1 === mod.quiz.length ? 'Ver resultado' : 'Siguiente'}
      </Primary>
    </section>
  )
}
