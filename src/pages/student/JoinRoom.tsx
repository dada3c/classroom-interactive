import { useParams, useNavigate } from 'react-router-dom'
import { doc, setDoc, serverTimestamp } from 'firebase/firestore'
import { membersCol } from '../../lib/firebase'
import NicknameForm from '../../components/student/NicknameForm'
import GlassCard from '../../components/ui/GlassCard'

export default function JoinRoom() {
  const { roomId } = useParams<{ roomId: string }>()
  const navigate   = useNavigate()

  if (!roomId) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1, position: 'relative' }}>
        <p style={{ fontFamily: 'IBM Plex Mono, monospace', color: '#ef476f' }}>無效的房間連結</p>
      </div>
    )
  }

  const handleJoin = async (nickname: string) => {
    const memberId = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
      const r = (Math.random() * 16) | 0
      return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16)
    })
    try {
      await setDoc(doc(membersCol(roomId), memberId), {
        nickname,
        joinedAt: serverTimestamp(),
      })
      sessionStorage.setItem(`room-${roomId}-memberId`, memberId)
      sessionStorage.setItem(`room-${roomId}-nickname`, nickname)
      navigate(`/student/${roomId}`)
    } catch (e) {
      console.error('Join failed:', e)
      throw e
    }
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px', position: 'relative', zIndex: 1 }}>
      <div style={{ width: '100%', maxWidth: '400px', animation: 'fadeUp 0.5s ease forwards' }}>
        <GlassCard className="p-8">
          <NicknameForm roomId={roomId} onSubmit={handleJoin} />
        </GlassCard>
      </div>
    </div>
  )
}
