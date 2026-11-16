import type { ComponentType } from 'react'
import type { MDXComponents } from 'mdx/types'

export type QuestionType = 'fact' | 'principle' | 'tradeoff' | 'challenge' | 'soft'

export const QUESTION_TYPE_LABEL: Record<QuestionType, string> = {
  fact: '事实核验',
  principle: '原理深挖',
  tradeoff: '方案取舍',
  challenge: '挑战质疑',
  soft: '软性问题',
}

/** 1 = 偶尔被问，2 = 常被问，3 = 几乎必问 */
export type AnchorLevel = 1 | 2 | 3

export interface QuestionMeta {
  id: string
  anchor: string
  title: string
  type: QuestionType
  short: string
  followUps?: string[]
  order?: number
}

export interface Question extends QuestionMeta {
  Full: ComponentType<{ components?: MDXComponents }>
}
