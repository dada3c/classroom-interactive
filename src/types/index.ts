import { Timestamp } from 'firebase/firestore'

export type RoomStatus = 'waiting' | 'answering' | 'ended' | 'finished'
export type AnswerType = 'OX' | 'choice' | 'survey'

export function isGradedType(type: AnswerType): boolean {
  return type === 'OX' || type === 'choice'
}

export interface AnswerOption {
  key: string
  label: string
  name: string
  color: string
  shadow: string
  bg: string
}

export const OX_OPTIONS: AnswerOption[] = [
  { key: 'O', label: '○', name: 'O', color: '#06d6a0', shadow: 'rgba(6,214,160,0.4)', bg: 'rgba(6,214,160,0.1)' },
  { key: 'X', label: '✕', name: 'X', color: '#ef476f', shadow: 'rgba(239,71,111,0.4)', bg: 'rgba(239,71,111,0.1)' },
]

export const CHOICE_OPTIONS: AnswerOption[] = [
  { key: 'triangle', label: '▲', name: '三角形', color: '#ffd166', shadow: 'rgba(255,209,102,0.4)', bg: 'rgba(255,209,102,0.1)' },
  { key: 'square',   label: '■', name: '正方形', color: '#118ab2', shadow: 'rgba(17,138,178,0.4)', bg: 'rgba(17,138,178,0.1)' },
  { key: 'star',     label: '★', name: '星形',   color: '#06d6a0', shadow: 'rgba(6,214,160,0.4)', bg: 'rgba(6,214,160,0.1)' },
  { key: 'heart',    label: '♥', name: '愛心',   color: '#ef476f', shadow: 'rgba(239,71,111,0.4)', bg: 'rgba(239,71,111,0.1)' },
]

export function getOptionsForType(type: AnswerType): AnswerOption[] {
  return type === 'choice' ? CHOICE_OPTIONS : OX_OPTIONS
}

export function findOption(answerType: AnswerType, key: string): AnswerOption | undefined {
  return getOptionsForType(answerType).find(o => o.key === key)
}

export interface Room {
  id: string
  createdAt: Timestamp
  status: RoomStatus
  answerType: AnswerType
  correctAnswer: string | null
  question: string
  currentRound?: number
}

export interface Member {
  id: string
  nickname: string
  joinedAt: Timestamp
}

export interface Answer {
  memberId: string
  answer: string
  submittedAt: Timestamp
  nickname: string
}

export interface AnswerStats {
  counts: Record<string, number>
  total: number
}

export interface RoundResult {
  roundNumber: number
  answerType: AnswerType
  correctAnswer: string
  answers: Record<string, { answer: string | null; nickname: string; correct: boolean }>
}
