import { useState, useEffect } from 'react'
import { onSnapshot } from 'firebase/firestore'
import { answersCol } from '../lib/firebase'
import type { Answer, AnswerStats } from '../types'

export function useAnswers(roomId: string | undefined) {
  const [answers, setAnswers] = useState<Answer[]>([])
  const [stats, setStats]     = useState<AnswerStats>({ counts: {}, total: 0 })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!roomId) { setLoading(false); return }

    const unsub = onSnapshot(answersCol(roomId), (snap) => {
      const data = snap.docs.map(d => ({ memberId: d.id, ...d.data() }) as Answer)
      setAnswers(data)
      const counts: Record<string, number> = {}
      data.forEach(a => { counts[a.answer] = (counts[a.answer] || 0) + 1 })
      setStats({ counts, total: data.length })
      setLoading(false)
    })
    return unsub
  }, [roomId])

  return { answers, stats, loading }
}
