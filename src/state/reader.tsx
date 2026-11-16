import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { questions } from '../content'

export interface DrawerTarget {
  anchorId: string
  questionId?: string
}

interface ReaderState {
  target: DrawerTarget | null
  history: DrawerTarget[]
  openAnchor: (anchorId: string) => void
  goToQuestion: (questionId: string) => void
  back: () => void
  close: () => void
}

const ReaderContext = createContext<ReaderState | null>(null)

function readHash(): DrawerTarget | null {
  const m = location.hash.match(/^#q=([\w-]+)/)
  const q = m && questions[m[1]]
  return q ? { anchorId: q.anchor, questionId: q.id } : null
}

function writeHash(target: DrawerTarget | null) {
  const url = target?.questionId ? `#q=${target.questionId}` : location.pathname + location.search
  history.replaceState(null, '', url)
}

export function ReaderProvider({ children }: { children: ReactNode }) {
  const [target, setTarget] = useState<DrawerTarget | null>(readHash)
  const [stack, setStack] = useState<DrawerTarget[]>([])

  useEffect(() => writeHash(target), [target])

  const openAnchor = useCallback((anchorId: string) => {
    setStack([])
    setTarget({ anchorId })
  }, [])

  const goToQuestion = useCallback(
    (questionId: string) => {
      const q = questions[questionId]
      if (!q) return
      if (target) setStack((s) => [...s, target])
      setTarget({ anchorId: q.anchor, questionId })
    },
    [target],
  )

  const back = useCallback(() => {
    if (!stack.length) return
    setTarget(stack[stack.length - 1])
    setStack(stack.slice(0, -1))
  }, [stack])

  const close = useCallback(() => {
    setStack([])
    setTarget(null)
  }, [])

  const value = useMemo(
    () => ({ target, history: stack, openAnchor, goToQuestion, back, close }),
    [target, stack, openAnchor, goToQuestion, back, close],
  )

  return <ReaderContext.Provider value={value}>{children}</ReaderContext.Provider>
}

export function useReader() {
  const ctx = useContext(ReaderContext)
  if (!ctx) throw new Error('useReader must be used inside ReaderProvider')
  return ctx
}
