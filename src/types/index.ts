import { Timestamp } from 'firebase/firestore'

export type RoomStatus = 'waiting' | 'answering' | 'ended'
export type AnswerType = 'OX' | 'choice'

export interface Room {
  id: string
  createdAt: Timestamp
  status: RoomStatus
  answerType: AnswerType
  correctAnswer: string | null
  question: string
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
  O: number
  X: number
  total: number
  oPercent: number
  xPercent: number
}
