import type { ReactNode } from 'react'
import { questionsByAnchor } from '../content'
import type { AnchorLevel } from '../content/types'
import { useReader } from '../state/reader'

interface AnchorProps {
  id: string
  level?: AnchorLevel
  children: ReactNode
}

export function Anchor({ id, level = 2, children }: AnchorProps) {
  const { target, openAnchor } = useReader()
  const count = questionsByAnchor[id]?.length ?? 0

  if (!count) {
    if (import.meta.env.DEV) console.warn(`[content] 锚点 ${id} 下没有问题`)
    return <>{children}</>
  }

  const active = target?.anchorId === id
  const open = () => openAnchor(id)

  return (
    <span
      className={`anchor level-${level}${active ? ' is-active' : ''}`}
      data-anchor={id}
      role="button"
      tabIndex={0}
      aria-label={`${count} 个问题`}
      onClick={open}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          open()
        }
      }}
    >
      {children}
      <span className="anchor-badge" aria-hidden="true">
        {count}
        <span className="anchor-badge-unit"> 问</span>
      </span>
    </span>
  )
}
