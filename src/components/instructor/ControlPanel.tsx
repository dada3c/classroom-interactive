import { useState } from 'react'
import { doc, updateDoc, serverTimestamp } from 'firebase/firestore'
import { db } from '../../lib/firebase'
import type { RoomStatus } from '../../types'
import AnimatedCounter from '../ui/AnimatedCounter'

interface ControlPanelProps {
  roomId: string
  status: RoomStatus
  answeredCount: number
  totalMembers: number
  onEnd?: () => void
}

export default function ControlPanel({ roomId, status, answeredCount, totalMembers }: ControlPanelProps) {
  const [correctAnswer, setCorrectAnswer] = useState<'O' | 'X' | null>(null)
  const [loading, setLoading] = useState(false)

  const roomRef = doc(db, 'rooms', roomId)

  const startAnswering = async () => {
    setLoading(true)
    setCorrectAnswer(null)
    await updateDoc(roomRef, { status: 'answering' })
    setLoading(false)
  }

  const endQuestion = async () => {
    if (!correctAnswer) return
    setLoading(true)
    await updateDoc(roomRef, { status: 'ended', correctAnswer, endedAt: serverTimestamp() })
    setLoading(false)
  }

  const resetRoom = async () => {
    setLoading(true)
    setCorrectAnswer(null)
    await updateDoc(roomRef, { status: 'waiting', correctAnswer: null })
    setLoading(false)
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Answer count display */}
      {(status === 'answering' || status === 'ended') && (
        <div className="flex items-center justify-center gap-2">
          <AnimatedCounter value={answeredCount} className="text-5xl font-bold" />
          <span style={{ fontSize: '20px', color: 'rgba(230,237,243,0.5)', fontFamily: 'IBM Plex Mono, monospace' }}>
            / {totalMembers} 人已作答
          </span>
        </div>
      )}

      {/* Controls by status */}
      {status === 'waiting' && (
        <button
          onClick={startAnswering}
          disabled={loading || totalMembers === 0}
          style={{
            padding: '16px 32px', borderRadius: '12px', fontSize: '18px',
            fontFamily: 'Syne, sans-serif', fontWeight: 700,
            background: totalMembers === 0 ? 'rgba(255,255,255,0.05)' : 'linear-gradient(135deg, #00f5d4, #06d6a0)',
            color: totalMembers === 0 ? 'rgba(230,237,243,0.3)' : '#0d1117',
            border: 'none', cursor: totalMembers === 0 ? 'not-allowed' : 'pointer',
            transition: 'transform 0.15s, box-shadow 0.15s',
            boxShadow: totalMembers > 0 ? '0 0 30px rgba(0, 245, 212, 0.3)' : 'none',
          }}
          onMouseEnter={e => { if (totalMembers > 0) (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1.03)' }}
          onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1)' }}
        >
          {totalMembers === 0 ? '等待學員加入...' : '▶ 開始作答'}
        </button>
      )}

      {status === 'answering' && (
        <div className="flex flex-col gap-4">
          <p style={{ fontSize: '13px', color: 'rgba(230,237,243,0.5)', textAlign: 'center', fontFamily: 'IBM Plex Mono, monospace' }}>
            選擇正確答案後結束
          </p>
          <div className="flex gap-3">
            {(['O', 'X'] as const).map(ans => (
              <button
                key={ans}
                onClick={() => setCorrectAnswer(ans)}
                style={{
                  flex: 1, padding: '20px', borderRadius: '12px', fontSize: '36px',
                  fontFamily: 'Syne, sans-serif', fontWeight: 800,
                  background: correctAnswer === ans
                    ? (ans === 'O' ? 'rgba(6,214,160,0.2)' : 'rgba(239,71,111,0.2)')
                    : 'rgba(255,255,255,0.04)',
                  color: ans === 'O' ? '#06d6a0' : '#ef476f',
                  border: `2px solid ${correctAnswer === ans ? (ans === 'O' ? '#06d6a0' : '#ef476f') : 'rgba(255,255,255,0.1)'}`,
                  cursor: 'pointer', transition: 'all 0.2s',
                  boxShadow: correctAnswer === ans ? `0 0 20px ${ans === 'O' ? 'rgba(6,214,160,0.3)' : 'rgba(239,71,111,0.3)'}` : 'none',
                }}
              >
                {ans === 'O' ? '○' : '✕'}
              </button>
            ))}
          </div>
          <button
            onClick={endQuestion}
            disabled={!correctAnswer || loading}
            style={{
              padding: '14px 24px', borderRadius: '12px', fontSize: '16px',
              fontFamily: 'Syne, sans-serif', fontWeight: 700,
              background: correctAnswer ? 'linear-gradient(135deg, #ef476f, #c0392b)' : 'rgba(255,255,255,0.05)',
              color: correctAnswer ? 'white' : 'rgba(230,237,243,0.3)',
              border: 'none', cursor: correctAnswer ? 'pointer' : 'not-allowed',
              transition: 'all 0.2s',
              boxShadow: correctAnswer ? '0 0 20px rgba(239,71,111,0.3)' : 'none',
            }}
          >
            ■ 結束問題
          </button>
        </div>
      )}

      {status === 'ended' && (
        <button
          onClick={resetRoom}
          disabled={loading}
          style={{
            padding: '14px 24px', borderRadius: '12px', fontSize: '16px',
            fontFamily: 'Syne, sans-serif', fontWeight: 700,
            background: 'rgba(255,209,102,0.15)', color: '#ffd166',
            border: '1px solid rgba(255,209,102,0.3)', cursor: 'pointer',
            transition: 'all 0.2s',
          }}
        >
          ↺ 出下一題
        </button>
      )}
    </div>
  )
}
