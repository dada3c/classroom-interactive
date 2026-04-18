import type { Member } from '../../types'
import NicknameCloud from '../ui/NicknameCloud'

interface WaitingScreenProps {
  nickname: string
  members: Member[]
}

export default function WaitingScreen({ nickname, members }: WaitingScreenProps) {
  return (
    <div style={{ textAlign: 'center', padding: '32px 24px', animation: 'fadeUp 0.5s ease forwards' }}>
      <div style={{ marginBottom: '24px' }}>
        <div style={{
          width: '80px', height: '80px', borderRadius: '50%',
          background: 'linear-gradient(135deg, rgba(0,245,212,0.2), rgba(6,214,160,0.1))',
          border: '2px solid rgba(0,245,212,0.3)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 20px', fontSize: '32px',
        }}>
          👋
        </div>
        <h2 style={{ fontSize: '28px', fontFamily: 'Syne, sans-serif', fontWeight: 800, marginBottom: '8px' }}>
          你好，{nickname}！
        </h2>
        <p style={{ fontSize: '15px', color: 'rgba(230,237,243,0.5)', fontFamily: 'Syne, sans-serif' }}>
          已成功加入課程
        </p>
      </div>

      {/* Nickname word cloud */}
      {members.length > 0 && (
        <div style={{
          padding: '16px', borderRadius: '16px', marginBottom: '20px',
          background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)',
        }}>
          <p style={{ fontSize: '11px', fontFamily: 'IBM Plex Mono, monospace', color: 'rgba(230,237,243,0.4)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '8px' }}>
            目前已加入 {members.length} 人
          </p>
          <NicknameCloud members={members} size="sm" />
        </div>
      )}

      <div style={{
        padding: '24px', borderRadius: '16px',
        background: 'rgba(255,209,102,0.08)', border: '1px solid rgba(255,209,102,0.2)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', marginBottom: '8px' }}>
          <div style={{ display: 'flex', gap: '6px' }}>
            {[0, 1, 2].map(i => (
              <span key={i} style={{
                width: '8px', height: '8px', borderRadius: '50%', background: '#ffd166',
                animation: `bounce 1.2s ease-in-out ${i * 0.2}s infinite`,
                display: 'inline-block',
              }} />
            ))}
          </div>
        </div>
        <p style={{ fontSize: '16px', fontFamily: 'Syne, sans-serif', fontWeight: 600, color: '#ffd166' }}>
          等待老師出題中...
        </p>
      </div>

      <style>{`
        @keyframes bounce {
          0%, 100% { transform: translateY(0); opacity: 0.4; }
          50% { transform: translateY(-8px); opacity: 1; }
        }
      `}</style>
    </div>
  )
}
