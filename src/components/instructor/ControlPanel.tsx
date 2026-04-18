import { useState, useEffect } from 'react'
import { doc, setDoc, updateDoc, getDocs, serverTimestamp } from 'firebase/firestore'
import { db, answersCol, roundsCol } from '../../lib/firebase'
import type { RoomStatus, AnswerType } from '../../types'
import { getOptionsForType } from '../../types'
import AnimatedCounter from '../ui/AnimatedCounter'

interface ControlPanelProps {
  roomId: string
  status: RoomStatus
  answerType: AnswerType
  answeredCount: number
  totalMembers: number
  currentRound: number
}

export default function ControlPanel({ roomId, status, answerType, answeredCount, totalMembers, currentRound }: ControlPanelProps) {
  const [selectedType, setSelectedType] = useState<AnswerType>(answerType)
  const [correctAnswer, setCorrectAnswer] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const roomRef = doc(db, 'rooms', roomId)
  const options = getOptionsForType(status === 'waiting' ? selectedType : answerType)

  useEffect(() => { setSelectedType(answerType) }, [answerType])

  const startAnswering = async () => {
    setLoading(true)
    setCorrectAnswer(null)
    await updateDoc(roomRef, { status: 'answering', answerType: selectedType })
    setLoading(false)
  }

  const endQuestion = async () => {
    if (!correctAnswer) return
    setLoading(true)

    // Save round result to history
    const answersSnap = await getDocs(answersCol(roomId))
    const answers: Record<string, { answer: string; nickname: string; correct: boolean }> = {}
    answersSnap.docs.forEach(d => {
      const data = d.data() as { answer: string; nickname: string }
      answers[d.id] = {
        answer: data.answer,
        nickname: data.nickname,
        correct: data.answer === correctAnswer,
      }
    })

    const nextRound = currentRound + 1
    await setDoc(doc(roundsCol(roomId), String(nextRound)), {
      roundNumber: nextRound,
      answerType: answerType,
      correctAnswer,
      answers,
    })

    await updateDoc(roomRef, {
      status: 'ended',
      correctAnswer,
      currentRound: nextRound,
      endedAt: serverTimestamp(),
    })
    setLoading(false)
  }

  const resetRoom = async () => {
    setLoading(true)
    setCorrectAnswer(null)
    await updateDoc(roomRef, { status: 'waiting', correctAnswer: null })
    setLoading(false)
  }

  const finishSession = async () => {
    setLoading(true)
    await updateDoc(roomRef, { status: 'finished' })
    setLoading(false)
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Answer count display */}
      {(status === 'answering' || status === 'ended') && (
        <div className="flex items-center justify-center gap-2 flex-wrap">
          <AnimatedCounter value={answeredCount} className="text-4xl lg:text-5xl font-bold" />
          <span style={{ fontSize: '16px', color: 'rgba(230,237,243,0.5)', fontFamily: 'IBM Plex Mono, monospace' }}>
            / {totalMembers} 人已作答
          </span>
        </div>
      )}

      {/* Controls by status */}
      {status === 'waiting' && (
        <div className="flex flex-col gap-4">
          {/* Answer type selector */}
          <div>
            <p style={{ fontSize: '11px', color: 'rgba(230,237,243,0.4)', fontFamily: 'IBM Plex Mono, monospace', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '8px' }}>
              題型選擇 {currentRound > 0 && `（已完成 ${currentRound} 題）`}
            </p>
            <div className="grid grid-cols-2 gap-2">
              {([
                { type: 'OX' as AnswerType, label: '○✕ 是非題' },
                { type: 'choice' as AnswerType, label: '▲■★♥ 選擇題' },
              ]).map(({ type, label }) => (
                <button
                  key={type}
                  onClick={() => setSelectedType(type)}
                  style={{
                    padding: '10px 12px', borderRadius: '10px', fontSize: '14px',
                    fontFamily: 'Syne, sans-serif', fontWeight: 600,
                    background: selectedType === type ? 'rgba(0,245,212,0.12)' : 'rgba(255,255,255,0.04)',
                    color: selectedType === type ? '#00f5d4' : 'rgba(230,237,243,0.5)',
                    border: `1px solid ${selectedType === type ? 'rgba(0,245,212,0.3)' : 'rgba(255,255,255,0.1)'}`,
                    cursor: 'pointer', transition: 'all 0.2s',
                  }}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

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

          {/* Finish session button - only show if at least 1 round done */}
          {currentRound > 0 && (
            <button
              onClick={finishSession}
              disabled={loading}
              style={{
                padding: '12px 24px', borderRadius: '12px', fontSize: '14px',
                fontFamily: 'Syne, sans-serif', fontWeight: 600,
                background: 'rgba(239,71,111,0.1)', color: '#ef476f',
                border: '1px solid rgba(239,71,111,0.3)', cursor: 'pointer',
                transition: 'all 0.2s',
              }}
            >
              🏁 結束考題（查看總報表）
            </button>
          )}
        </div>
      )}

      {status === 'answering' && (
        <div className="flex flex-col gap-4">
          <p style={{ fontSize: '13px', color: 'rgba(230,237,243,0.5)', textAlign: 'center', fontFamily: 'IBM Plex Mono, monospace' }}>
            選擇正確答案後結束
          </p>
          <div className="grid grid-cols-2 gap-3">
            {options.map(opt => (
              <button
                key={opt.key}
                onClick={() => setCorrectAnswer(opt.key)}
                style={{
                  padding: options.length === 2 ? '20px' : '14px', borderRadius: '12px',
                  fontSize: options.length === 2 ? '36px' : '28px',
                  fontFamily: 'Syne, sans-serif', fontWeight: 800,
                  background: correctAnswer === opt.key ? `${opt.color}20` : 'rgba(255,255,255,0.04)',
                  color: opt.color,
                  border: `2px solid ${correctAnswer === opt.key ? opt.color : 'rgba(255,255,255,0.1)'}`,
                  cursor: 'pointer', transition: 'all 0.2s',
                  boxShadow: correctAnswer === opt.key ? `0 0 20px ${opt.shadow}` : 'none',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                }}
              >
                {opt.label}
                {options.length > 2 && <span style={{ fontSize: '12px', fontWeight: 600 }}>{opt.name}</span>}
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
            ■ 結束本題
          </button>
        </div>
      )}

      {status === 'ended' && (
        <div className="flex flex-col gap-3">
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
          <button
            onClick={finishSession}
            disabled={loading}
            style={{
              padding: '12px 24px', borderRadius: '12px', fontSize: '14px',
              fontFamily: 'Syne, sans-serif', fontWeight: 600,
              background: 'rgba(239,71,111,0.1)', color: '#ef476f',
              border: '1px solid rgba(239,71,111,0.3)', cursor: 'pointer',
              transition: 'all 0.2s',
            }}
          >
            🏁 結束考題（查看總報表）
          </button>
        </div>
      )}
    </div>
  )
}
