import { useParams, useNavigate } from 'react-router-dom'
import { useRoom } from '../../hooks/useRoom'
import { useMembers } from '../../hooks/useMembers'
import { useAnswers } from '../../hooks/useAnswers'
import { useRounds } from '../../hooks/useRounds'
import GlassCard from '../../components/ui/GlassCard'
import RoomHeader from '../../components/instructor/RoomHeader'
import MemberList from '../../components/instructor/MemberList'
import ControlPanel from '../../components/instructor/ControlPanel'
import QRDisplay from '../../components/qr/QRDisplay'
import AnswerChart from '../../components/charts/AnswerChart'
import NicknameCloud from '../../components/ui/NicknameCloud'
import SessionReport from '../../components/charts/SessionReport'

export default function InstructorRoom() {
  const { roomId } = useParams<{ roomId: string }>()
  const navigate   = useNavigate()
  const { room, loading, error } = useRoom(roomId)
  const { members }              = useMembers(roomId)
  const { stats }                = useAnswers(roomId)
  const { rounds }               = useRounds(roomId)

  if (loading) return <LoadingScreen />

  if (error || !room) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1, position: 'relative' }}>
        <GlassCard variant="coral" className="p-8 text-center max-w-sm">
          <p style={{ fontSize: '48px', marginBottom: '16px' }}>404</p>
          <p style={{ fontFamily: 'Syne, sans-serif', fontSize: '18px', marginBottom: '24px' }}>找不到此房間</p>
          <button onClick={() => navigate('/instructor')} style={{ fontFamily: 'Syne, sans-serif', color: '#ef476f', background: 'none', border: 'none', cursor: 'pointer', fontSize: '14px' }}>
            ← 返回講師後台
          </button>
        </GlassCard>
      </div>
    )
  }

  // Finished state: show full session report
  if (room.status === 'finished') {
    return (
      <div style={{ minHeight: '100vh', padding: '24px', position: 'relative', zIndex: 1 }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <button onClick={() => navigate('/instructor')} style={{ fontSize: '13px', fontFamily: 'IBM Plex Mono, monospace', color: 'rgba(230,237,243,0.4)', background: 'none', border: 'none', cursor: 'pointer', marginBottom: '24px', display: 'block' }}>
            ← 返回講師後台
          </button>

          <GlassCard className="p-6 mb-6">
            <RoomHeader roomId={room.id} status={room.status} />
          </GlassCard>

          <SessionReport rounds={rounds} members={members} />
        </div>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', padding: '24px', position: 'relative', zIndex: 1 }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Back button */}
        <button onClick={() => navigate('/instructor')} style={{ fontSize: '13px', fontFamily: 'IBM Plex Mono, monospace', color: 'rgba(230,237,243,0.4)', background: 'none', border: 'none', cursor: 'pointer', marginBottom: '24px', display: 'block' }}>
          ← 返回
        </button>

        {/* Room header */}
        <GlassCard className="p-6 mb-6">
          <RoomHeader roomId={room.id} status={room.status} />
        </GlassCard>

        {/* Nickname word cloud when waiting */}
        {room.status === 'waiting' && members.length > 0 && (
          <GlassCard className="p-6 mb-6">
            <h3 style={{ fontSize: '13px', color: 'rgba(230,237,243,0.5)', fontFamily: 'IBM Plex Mono, monospace', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '8px', textAlign: 'center' }}>
              已加入的學員
            </h3>
            <NicknameCloud members={members} size="lg" />
          </GlassCard>
        )}

        {/* Main grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 items-start">
          {/* QR Code */}
          <GlassCard className="p-6">
            <div style={{ marginBottom: '24px' }}>
              <QRDisplay roomId={room.id} />
            </div>
          </GlassCard>

          {/* Member list */}
          <GlassCard className="p-6">
            <MemberList members={members} />
          </GlassCard>

          {/* Control panel + chart */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <GlassCard variant="amber" className="p-6">
              <h3 style={{ fontSize: '13px', color: 'rgba(230,237,243,0.5)', fontFamily: 'IBM Plex Mono, monospace', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '20px' }}>
                控制台
              </h3>
              <ControlPanel
                roomId={room.id}
                status={room.status}
                answerType={room.answerType}
                answeredCount={stats.total}
                totalMembers={members.length}
                currentRound={room.currentRound ?? 0}
              />
            </GlassCard>

            {room.status === 'ended' && (
              <GlassCard className="p-6">
                <h3 style={{ fontSize: '13px', color: 'rgba(230,237,243,0.5)', fontFamily: 'IBM Plex Mono, monospace', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '16px' }}>
                  答題統計
                </h3>
                <AnswerChart stats={stats} correctAnswer={room.correctAnswer} answerType={room.answerType} />
              </GlassCard>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function LoadingScreen() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1, position: 'relative' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ width: '48px', height: '48px', border: '2px solid rgba(0,245,212,0.2)', borderTopColor: '#00f5d4', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 16px' }} />
        <p style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '13px', color: 'rgba(230,237,243,0.4)' }}>載入中...</p>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}
