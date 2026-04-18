import { useState, useEffect } from 'react'
import { onSnapshot, query, orderBy } from 'firebase/firestore'
import { roundsCol } from '../lib/firebase'
import type { RoundResult } from '../types'

export function useRounds(roomId: string | undefined) {
  const [rounds, setRounds] = useState<RoundResult[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!roomId) { setLoading(false); return }

    const q = query(roundsCol(roomId), orderBy('roundNumber', 'asc'))
    const unsub = onSnapshot(q, (snap) => {
      const data = snap.docs.map(d => d.data() as RoundResult)
      setRounds(data)
      setLoading(false)
    })
    return unsub
  }, [roomId])

  return { rounds, loading }
}
