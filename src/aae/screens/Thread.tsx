import { useState } from 'react'
import { Icon } from '../components/Icon'
import { Avatar, BackHeader, Tag } from '../components/ui'
import { threadById } from '../data/community'
import { useApp } from '../store'
import { C } from '../theme'

export function Thread() {
  const { state, back, reply } = useApp()
  const [text, setText] = useState('')
  const t = threadById(state.threadId)
  if (!t) return null

  const replies = [...t.replies, ...(state.replies[t.id] ?? [])]

  return (
    <section className="screen thread-screen">
      <BackHeader title={t.topic} onBack={back} sub={`${replies.length} respuestas`} />

      <div className="scroll thread-screen__log">
        <article className="card post">
          <div className="post__top">
            <Avatar label={t.initials} size={36} />
            <div className="post__who">
              <span className="post__author">{t.author}</span>
              <span className="post__when">{t.when}</span>
            </div>
          </div>
          <h1 className="post__title">{t.title}</h1>
          <p className="post__body">{t.body}</p>
        </article>

        {replies.map((r, i) => (
          <article key={i} className="card post post--reply">
            <div className="post__top">
              <Avatar
                label={r.initials}
                size={32}
                bg={r.staff ? C.goldBg : C.brandSoft}
                fg={r.staff ? C.gold : C.brand}
              />
              <div className="post__who">
                <span className="post__author">{r.author}</span>
                <span className="post__when">{r.when}</span>
              </div>
              {r.staff && (
                <Tag bg={C.goldBg} fg={C.gold} wide>
                  Instructor
                </Tag>
              )}
            </div>
            <p className="post__body">{r.body}</p>
          </article>
        ))}
      </div>

      <form
        className="composer composer--thread"
        onSubmit={(e) => {
          e.preventDefault()
          if (!text.trim()) return
          reply(t.id, text.trim())
          setText('')
        }}
      >
        <input
          className="composer__input"
          value={text}
          placeholder="Escribe una respuesta…"
          onChange={(e) => setText(e.target.value)}
          aria-label="Tu respuesta"
        />
        <button type="submit" className="composer__send" aria-label="Publicar" disabled={!text.trim()}>
          <Icon name="send" size={17} color="#fff" />
        </button>
      </form>
    </section>
  )
}
