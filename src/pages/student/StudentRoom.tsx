import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore'
import { answersCol } from '../../lib/firebase'
import { useRoom } from '../../hooks/useRoom'
import { useAnswers } from '../../hooks/useAnswers'
import GlassCard from '../../components/ui/GlassCard'
import WaitingScreen from '../../components/student/WaitingScreen'
import AnswerButtons from '../../components/student/AnswerButtons'
import SubmittedScreen from '../../components/student/SubmittedScreen'
import ResultScreen from '../../components/student/ResultScreen'

export default function StudentRoom() {
  const { roomId }  = useParams<{ roomId: string }>()
  const navigate    = useNavigate()
  const { room, loading } = useRoom(roomId)
  const { stats }         = useAnswers(roomId)

  const [memberId, setMemberId]     = useState<string | null>(null)
  const [nickname, setNickname]     = useState<string>('')
  const [myAnswer, setMyAnswer]     = useState<string | null>(null)
  const [hasAnswered, setHasAnswered] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  // Restore session on mount
  useEffect(() => {
    if (!roomId) return
    const storedId   = sessionStorage.getItem(`room-${roomId}-memberId`)
    const storedName = sessionStorage.getItem(`room-${roomId}-nickname`)
    if (!storedId) {
      navigate(`/join/${roomId}`, { replace: true })
      return
    }
    setMemberId(storedId)
    setNickname(storedName ?? '')

    // Restore answered state
    getDoc(doc(answersCol(roomId), storedId)).then(snap => {
      if (snap.exists()) {
        setHasAnswered(true)
        setMyAnswer((snap.data() as { answer: string }).answer)
      }
    })
  }, [roomId, navigate])

  // Reset answered state when room goes back to waiting/answering (new question)
  useEffect(() => {
    if (room?.status === 'waiting') {
      setHasAnswered(false)
      setMyAnswer(null)
    }
  }, [room?.status])

  const submitAnswer = async (answer: 'O' | 'X') => {
    if (!roomId || !memberId) return
    setSubmitting(true)
    await setDoc(doc(answersCol(roomId), memberId), {
      answer,
      submittedAt: serverTimestamp(),
      nickname,
    })
    setMyAnswer(answer)
    setHasAnswered(true)
    setSubmitting(false)
  }

  if (loading || !memberId) return <LoadingScreen />

  if (!room) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1, position: 'relative' }}>
        <GlassCard variant="coral" className="p-8 text-center">
          <p style={{ fontFamily: 'Syne, sans-serif', fontSize: '18px', marginBottom: '16px' }}>找不到此房間</p>
          <button onClick={() => navigate('/')} style={{ fontFamily: 'Syne, sans-serif', color: '#ef476f', background: 'none', border: 'none', cursor: 'pointer' }}>
            返回首頁
          </button>
        </GlassCard>
      </div>
    )
  }

  const phase = hasAnswered && room.status !== 'ended' ? 'submitted' : room.status

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px', position: 'relative', zIndex: 1 }}>
      <div style={{ width: '100%', maxWidth: '400px' }}>
        <GlassCard className="overflow-hidden">
          {/* Top bar */}
          <div style={{ padding: '12px 20px', borderBottom: '1px solid rgba(0,245,212,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <p style={{ fontSize: '11px', fontFamily: 'IBM Plex Mono, monospace', color: '#00f5d4', letterSpacing: '0.1em' }}>
              Room {roomId}
            </p>
            <p style={{ fontSize: '11px', fontFamily: 'IBM Plex Mono, monospace', color: 'rgba(230,237,243,0.4)' }}>
              {nickname}
            </p>
          </div>

          <div className="p-6">
            {phase === 'waiting' && <WaitingScreen nickname={nickname} />}
            {phase === 'answering' && <AnswerButtons onAnswer={submitAnswer} submitting={submitting} />}
            {phase === 'submitted' && <SubmittedScreen answer={myAnswer!} />}
            {phase === 'ended' && (
              <ResultScreen
                myAnswer={myAnswer}
                correctAnswer={room.correctAnswer}
                stats={stats}
              />
            )}
          </div>
        </GlassCard>
      </div>
    </div>
  )
}

function LoadingScreen() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1, position: 'relative' }}>
      <div style={{ width: '40px', height: '40px', border: '2px solid rgba(0,245,212,0.2)', borderTopColor: '#00f5d4', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}
