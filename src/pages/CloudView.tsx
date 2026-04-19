import { useParams } from 'react-router-dom'
import { useAnswers } from '../hooks/useAnswers'
import { useRoom } from '../hooks/useRoom'
import ResponseCloud from '../components/ui/ResponseCloud'

export default function CloudView() {
  const { roomId } = useParams<{ roomId: string }>()
  const { room } = useRoom(roomId)
  const { answers } = useAnswers(roomId)

  const responses = answers.map(a => ({ text: a.answer, nickname: a.nickname }))

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      padding: '48px 32px', position: 'relative', zIndex: 1,
    }}>
      {/* Room label */}
      <p style={{
        position: 'fixed', top: '20px', left: '24px',
        fontSize: '11px', fontFamily: 'IBM Plex Mono, monospace',
        color: 'rgba(0,245,212,0.4)', letterSpacing: '0.15em',
      }}>
        ROOM {roomId}
      </p>

      {/* Live count */}
      <p style={{
        position: 'fixed', top: '20px', right: '24px',
        fontSize: '11px', fontFamily: 'IBM Plex Mono, monospace',
        color: 'rgba(230,237,243,0.3)',
      }}>
        {responses.length} 則回應
      </p>

      {/* Main cloud */}
      <div style={{ width: '100%', maxWidth: '1200px' }}>
        {room?.status === 'waiting' ? (
          <p style={{
            textAlign: 'center', fontSize: '18px',
            fontFamily: 'Syne, sans-serif', color: 'rgba(230,237,243,0.3)',
          }}>
            等待開始...
          </p>
        ) : (
          <ResponseCloud responses={responses} />
        )}
      </div>
    </div>
  )
}
