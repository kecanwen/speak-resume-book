import { useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from 'react'
import { questionsByAnchor } from '../content'
import { MOBILE_QUERY, useMediaQuery } from '../hooks/useMediaQuery'
import { useReader, type DrawerTarget } from '../state/reader'
import { QuestionCard } from './QuestionCard'

const CLOSE_DISTANCE = 120
const CLOSE_VELOCITY = 0.6

function scrollAnchorIntoView(anchorId: string, mobile: boolean) {
  const el = document.querySelector<HTMLElement>(`[data-anchor="${anchorId}"]`)
  if (!el) return
  const rect = el.getBoundingClientRect()
  const visibleTop = mobile ? 64 : innerHeight * 0.2
  const visibleBottom = mobile ? innerHeight * 0.3 : innerHeight * 0.75
  if (rect.top >= visibleTop && rect.bottom <= visibleBottom) return
  const offset = mobile ? 72 : innerHeight * 0.32
  scrollTo({ top: rect.top + scrollY - offset, behavior: 'smooth' })
}

function anchorText(anchorId: string) {
  const el = document.querySelector(`[data-anchor="${anchorId}"]`)
  if (!el) return ''
  const clone = el.cloneNode(true) as HTMLElement
  clone.querySelector('.anchor-badge')?.remove()
  return clone.textContent?.trim() ?? ''
}

export function Drawer() {
  const { target, history, back, close } = useReader()
  const mobile = useMediaQuery(MOBILE_QUERY)
  const [shown, setShown] = useState<DrawerTarget | null>(target)
  const [drag, setDrag] = useState(0)
  const dragRef = useRef<{ y: number; t: number; dy: number } | null>(null)
  const bodyRef = useRef<HTMLDivElement>(null)
  const open = target !== null

  useEffect(() => {
    if (target) setShown(target)
  }, [target])

  useEffect(() => {
    if (!target) return
    scrollAnchorIntoView(target.anchorId, mobile)
    if (!target.questionId) bodyRef.current?.scrollTo({ top: 0 })
  }, [target, mobile])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && close()
    addEventListener('keydown', onKey)
    return () => removeEventListener('keydown', onKey)
  }, [open, close])

  useEffect(() => {
    document.documentElement.classList.toggle('drawer-open', open)
  }, [open])

  const onPointerDown = (e: ReactPointerEvent) => {
    if (!mobile || (e.target as Element).closest('button')) return
    dragRef.current = { y: e.clientY, t: e.timeStamp, dy: 0 }
    ;(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId)
  }
  const onPointerMove = (e: ReactPointerEvent) => {
    const d = dragRef.current
    if (!d) return
    const raw = e.clientY - d.y
    d.dy = raw
    setDrag(raw > 0 ? raw : raw * 0.2)
  }
  const onPointerUp = (e: ReactPointerEvent) => {
    const d = dragRef.current
    dragRef.current = null
    if (!d) return
    const velocity = d.dy / Math.max(1, e.timeStamp - d.t)
    setDrag(0)
    if (d.dy > CLOSE_DISTANCE || velocity > CLOSE_VELOCITY) close()
  }

  const anchorId = shown?.anchorId
  const list = anchorId ? (questionsByAnchor[anchorId] ?? []) : []
  const quote = anchorId ? anchorText(anchorId) : ''
  const focusedId = shown?.questionId ?? list[0]?.id

  const style = drag ? { transform: `translateY(${drag}px)`, transition: 'none' } : undefined

  return (
    <>
      <div className={`scrim${open ? ' is-open' : ''}`} onClick={close} aria-hidden="true" />
      <aside
        className={`drawer${open ? ' is-open' : ''}`}
        style={style}
        role="dialog"
        aria-modal="false"
        aria-label="追问"
        aria-hidden={!open}
      >
        <header
          className="drawer-head"
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
        >
          <div className="drawer-grip" aria-hidden="true" />
          <div className="drawer-bar">
            {history.length > 0 ? (
              <button className="icon-btn" onClick={back} aria-label="返回上一个问题">
                ← 返回
              </button>
            ) : (
              <span className="drawer-count">{list.length} 个问题</span>
            )}
            <button className="icon-btn" onClick={close} aria-label="关闭">
              ✕
            </button>
          </div>
          {quote && <blockquote className="drawer-quote">{quote}</blockquote>}
        </header>

        <div className="drawer-body" ref={bodyRef}>
          {list.map((q) => (
            <QuestionCard
              key={`${anchorId}:${q.id}`}
              question={q}
              initialDepth={q.id === focusedId ? 1 : 0}
              focused={!!shown?.questionId && q.id === shown.questionId}
            />
          ))}
        </div>
      </aside>
    </>
  )
}
