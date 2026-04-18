import { useState, useEffect } from 'react'
import { doc, onSnapshot } from 'firebase/firestore'
import { db } from '../lib/firebase'
import type { Room } from '../types'

export function useRoom(roomId: string | undefined) {
  const [room, setRoom]       = useState<Room | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState<Error | null>(null)

  useEffect(() => {
    if (!roomId) { setLoading(false); return }

    const unsub = onSnapshot(
      doc(db, 'rooms', roomId),
      (snap) => {
        setRoom(snap.exists() ? ({ id: snap.id, ...snap.data() } as Room) : null)
        setLoading(false)
      },
      (err) => { setError(err); setLoading(false) }
    )
    return unsub
  }, [roomId])

  return { room, loading, error }
}
