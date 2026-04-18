import { useState, useEffect } from 'react'
import { onSnapshot, query, orderBy } from 'firebase/firestore'
import { membersCol } from '../lib/firebase'
import type { Member } from '../types'

export function useMembers(roomId: string | undefined) {
  const [members, setMembers] = useState<Member[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!roomId) { setLoading(false); return }

    const q    = query(membersCol(roomId), orderBy('joinedAt', 'asc'))
    const unsub = onSnapshot(q, (snap) => {
      setMembers(snap.docs.map(d => ({ id: d.id, ...d.data() }) as Member))
      setLoading(false)
    })
    return unsub
  }, [roomId])

  return { members, loading }
}
