import { useEffect, useRef, useState } from 'react'
import { questions } from '../content'
import { QUESTION_TYPE_LABEL, type Question } from '../content/types'
import { useReader } from '../state/reader'

type Depth = 0 | 1 | 2

interface Props {
  question: Question
  initialDepth: Depth
  focused: boolean
}

export function QuestionCard({ question, initialDepth, focused }: Props) {
  const { goToQuestion } = useReader()
  const [depth, setDepth] = useState<Depth>(initialDepth)
  const ref = useRef<HTMLElement>(null)
  const { Full } = question
  const followUps = (question.followUps ?? []).map((id) => questions[id]).filter(Boolean)

  useEffect(() => {
    if (!focused) return
    setDepth((d) => (d === 0 ? 1 : d))
    ref.current?.scrollIntoView({ block: 'start', behavior: 'smooth' })
  }, [focused])

  return (
    <article ref={ref} className={`qcard depth-${depth}${focused ? ' is-focused' : ''}`}>
      <button
        className="qcard-head"
        aria-expanded={depth > 0}
        onClick={() => setDepth(depth === 0 ? 1 : 0)}
      >
        <span className={`qtag qtag-${question.type}`}>{QUESTION_TYPE_LABEL[question.type]}</span>
        <span className="qcard-title">{question.title}</span>
        <span className="qcard-chevron" aria-hidden="true" />
      </button>

      <div className="qcard-body" hidden={depth === 0}>
        <section className="layer layer-short">
          <h4 className="layer-label">30 秒版</h4>
          <p>{question.short}</p>
        </section>

        {depth === 1 && (
          <button className="layer-more" onClick={() => setDepth(2)}>
            展开完整回答
          </button>
        )}

        {depth === 2 && (
          <>
            <section className="layer layer-full prose">
              <h4 className="layer-label">展开版</h4>
              <Full />
            </section>

            {followUps.length > 0 && (
              <section className="layer layer-follow">
                <h4 className="layer-label">面试官接下来可能问</h4>
                <ul>
                  {followUps.map((f) => (
                    <li key={f.id}>
                      <button onClick={() => goToQuestion(f.id)}>
                        <span className="follow-arrow" aria-hidden="true">↳</span>
                        {f.title}
                      </button>
                    </li>
                  ))}
                </ul>
              </section>
            )}
          </>
        )}
      </div>
    </article>
  )
}
