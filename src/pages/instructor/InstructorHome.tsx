import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { doc, setDoc, serverTimestamp } from 'firebase/firestore'
import { db } from '../../lib/firebase'
import { generateRoomId } from '../../utils/generateRoomId'
import GlassCard from '../../components/ui/GlassCard'

const INSTRUCTOR_PIN = '0935'

export default function InstructorHome() {
  const navigate = useNavigate()
  const [creating, setCreating] = useState(false)
  const [error, setError] = useState('')

  // Password lock
  const [unlocked, setUnlocked] = useState(() => sessionStorage.getItem('instructor-unlocked') === 'true')
  const [pin, setPin] = useState('')
  const [pinError, setPinError] = useState(false)

  const handleUnlock = () => {
    if (pin === INSTRUCTOR_PIN) {
      sessionStorage.setItem('instructor-unlocked', 'true')
      setUnlocked(true)
    } else {
      setPinError(true)
      setPin('')
      setTimeout(() => setPinError(false), 1500)
    }
  }

  const createRoom = async () => {
    setCreating(true)
    setError('')
    try {
      const roomId = generateRoomId()
      await setDoc(doc(db, 'rooms', roomId), {
        createdAt: serverTimestamp(),
        status: 'waiting',
        answerType: 'OX',
        correctAnswer: null,
        question: '',
        currentRound: 0,
      })
      navigate(`/instructor/${roomId}`)
    } catch (e) {
      console.error(e)
      setError('建立失敗，請重試')
      setCreating(false)
    }
  }

  // PIN Screen
  if (!unlocked) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '24px', position: 'relative', zIndex: 1 }}>
        <div style={{ width: '100%', maxWidth: '400px', animation: 'fadeUp 0.5s ease forwards' }}>
          <div style={{ marginBottom: '40px', textAlign: 'center' }}>
            <button onClick={() => navigate('/')} style={{ fontSize: '13px', fontFamily: 'IBM Plex Mono, monospace', color: 'rgba(230,237,243,0.4)', background: 'none', border: 'none', cursor: 'pointer', marginBottom: '24px', display: 'block', margin: '0 auto 24px' }}>
              ← 返回
            </button>
            <p style={{ fontSize: '48px', marginBottom: '16px' }}>🔒</p>
            <h1 style={{ fontSize: '28px', fontFamily: 'Syne, sans-serif', fontWeight: 800 }}>
              講師驗證
            </h1>
          </div>

          <GlassCard variant="amber" className="p-8">
            <p style={{ fontSize: '14px', color: 'rgba(230,237,243,0.5)', fontFamily: 'Syne, sans-serif', textAlign: 'center', marginBottom: '24px' }}>
              請輸入講師密碼
            </p>
            <div style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
              <input
                type="password"
                inputMode="numeric"
                maxLength={4}
                value={pin}
                onChange={e => setPin(e.target.value.replace(/\D/g, '').slice(0, 4))}
                onKeyDown={e => { if (e.key === 'Enter') handleUnlock() }}
                placeholder="••••"
                autoFocus
                style={{
                  flex: 1, padding: '16px', borderRadius: '12px', fontSize: '28px',
                  fontFamily: 'IBM Plex Mono, monospace', fontWeight: 700,
                  textAlign: 'center', letterSpacing: '0.3em',
                  background: pinError ? 'rgba(239,71,111,0.1)' : 'rgba(255,255,255,0.06)',
                  color: '#e6edf3',
                  border: `2px solid ${pinError ? '#ef476f' : 'rgba(255,255,255,0.1)'}`,
                  outline: 'none',
                  transition: 'all 0.3s',
                }}
              />
            </div>
            {pinError && (
              <p style={{ fontSize: '13px', fontFamily: 'IBM Plex Mono, monospace', color: '#ef476f', textAlign: 'center', marginBottom: '12px', animation: 'fadeUp 0.3s ease' }}>
                密碼錯誤，請重新輸入
              </p>
            )}
            <button
              onClick={handleUnlock}
              disabled={pin.length !== 4}
              style={{
                width: '100%', padding: '14px', borderRadius: '12px', fontSize: '16px',
                fontFamily: 'Syne, sans-serif', fontWeight: 700,
                background: pin.length === 4 ? 'linear-gradient(135deg, #ffd166, #f4a261)' : 'rgba(255,255,255,0.05)',
                color: pin.length === 4 ? '#0d1117' : 'rgba(230,237,243,0.3)',
                border: 'none', cursor: pin.length === 4 ? 'pointer' : 'not-allowed',
                transition: 'all 0.2s',
              }}
            >
              解鎖
            </button>
          </GlassCard>
        </div>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '24px', position: 'relative', zIndex: 1 }}>
      <div style={{ width: '100%', maxWidth: '480px', animation: 'fadeUp 0.5s ease forwards' }}>
        <div style={{ marginBottom: '40px' }}>
          <button onClick={() => navigate('/')} style={{ fontSize: '13px', fontFamily: 'IBM Plex Mono, monospace', color: 'rgba(230,237,243,0.4)', background: 'none', border: 'none', cursor: 'pointer', marginBottom: '24px', display: 'block' }}>
            ← 返回
          </button>
          <p style={{ fontSize: '11px', fontFamily: 'IBM Plex Mono, monospace', color: 'rgba(255,209,102,0.7)', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '8px' }}>
            Instructor Console
          </p>
          <h1 style={{ fontSize: '40px', fontFamily: 'Syne, sans-serif', fontWeight: 800 }}>
            講師後台
          </h1>
        </div>

        <GlassCard variant="amber" className="p-8 flex flex-col gap-6">
          <div>
            <h2 style={{ fontSize: '20px', fontFamily: 'Syne, sans-serif', fontWeight: 700, marginBottom: '8px' }}>
              開始新課程
            </h2>
            <p style={{ fontSize: '14px', color: 'rgba(230,237,243,0.5)', fontFamily: 'Syne, sans-serif', lineHeight: 1.6 }}>
              系統會自動產生一組 6 位數房號，並生成 QR Code 供學員掃描加入。
            </p>
          </div>
          <button
            onClick={createRoom}
            disabled={creating}
            style={{
              padding: '16px', borderRadius: '12px', fontSize: '18px',
              fontFamily: 'Syne, sans-serif', fontWeight: 700,
              background: creating ? 'rgba(255,255,255,0.05)' : 'linear-gradient(135deg, #ffd166, #f4a261)',
              color: creating ? 'rgba(230,237,243,0.3)' : '#0d1117',
              border: 'none', cursor: creating ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s',
              boxShadow: creating ? 'none' : '0 0 30px rgba(255,209,102,0.3)',
            }}
          >
            {creating ? '建立中...' : '＋ 建立新房間'}
          </button>
          {error && (
            <p style={{ fontSize: '13px', fontFamily: 'IBM Plex Mono, monospace', color: '#ef476f', marginTop: '8px' }}>
              ⚠ {error}
            </p>
          )}
        </GlassCard>

        <div style={{ marginTop: '16px' }}>
          <button
            onClick={() => navigate('/instructor/history')}
            style={{
              width: '100%', padding: '14px', borderRadius: '12px',
              fontFamily: 'Syne, sans-serif', fontSize: '15px', fontWeight: 600,
              background: 'rgba(255,255,255,0.04)', color: 'rgba(230,237,243,0.6)',
              border: '1px solid rgba(255,255,255,0.1)', cursor: 'pointer',
              transition: 'all 0.2s',
            }}
            onMouseEnter={e => { (e.currentTarget).style.color = '#e6edf3'; (e.currentTarget).style.borderColor = 'rgba(255,255,255,0.2)' }}
            onMouseLeave={e => { (e.currentTarget).style.color = 'rgba(230,237,243,0.6)'; (e.currentTarget).style.borderColor = 'rgba(255,255,255,0.1)' }}
          >
            歷史課程紀錄 →
          </button>
        </div>
      </div>
    </div>
  )
}
