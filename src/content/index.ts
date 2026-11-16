import type { ComponentType } from 'react'
import type { Question, QuestionMeta } from './types'

interface QuestionModule {
  default: ComponentType
  frontmatter: QuestionMeta
}

const modules = import.meta.glob<QuestionModule>('./questions/*.mdx', { eager: true })

export const questions: Record<string, Question> = {}
export const questionsByAnchor: Record<string, Question[]> = {}

for (const [path, mod] of Object.entries(modules)) {
  const meta = mod.frontmatter
  if (!meta?.id || !meta.anchor) {
    console.warn(`[content] ${path} 缺少 id 或 anchor`)
    continue
  }
  const q: Question = { ...meta, Full: mod.default }
  questions[q.id] = q
  ;(questionsByAnchor[q.anchor] ??= []).push(q)
}

for (const list of Object.values(questionsByAnchor)) {
  list.sort((a, b) => (a.order ?? 99) - (b.order ?? 99))
}

if (import.meta.env.DEV) {
  for (const q of Object.values(questions)) {
    for (const f of q.followUps ?? []) {
      if (!questions[f]) console.warn(`[content] ${q.id} 的追问 ${f} 不存在`)
    }
  }
  for (const [anchor, list] of Object.entries(questionsByAnchor)) {
    if (list.length > 4) console.warn(`[content] 锚点 ${anchor} 挂了 ${list.length} 个问题，建议不超过 4 个`)
  }
}
