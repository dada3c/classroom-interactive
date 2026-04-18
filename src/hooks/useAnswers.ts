import { useState, useEffect } from 'react'
import { onSnapshot } from 'firebase/firestore'
import { answersCol } from '../lib/firebase'
import type { Answer, AnswerStats } from '../types'

export function useAnswers(roomId: string | undefined) {
  const [answers, setAnswers] = useState<Answer[]>([])
  const [stats, setStats]     = useState<AnswerStats>({ O: 0, X: 0, total: 0, oPercent: 0, xPercent: 0 })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!roomId) { setLoading(false); return }

    const unsub = onSnapshot(answersCol(roomId), (snap) => {
      const data = snap.docs.map(d => ({ memberId: d.id, ...d.data() }) as Answer)
      setAnswers(data)
      const O     = data.filter(a => a.answer === 'O').length
      const X     = data.filter(a => a.answer === 'X').length
      const total = O + X
      setStats({ O, X, total, oPercent: total ? (O / total) * 100 : 0, xPercent: total ? (X / total) * 100 : 0 })
      setLoading(false)
    })
    return unsub
  }, [roomId])

  return { answers, stats, loading }
}
