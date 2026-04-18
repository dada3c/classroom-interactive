import { useState, type FormEvent } from 'react'

interface NicknameFormProps {
  roomId: string
  onSubmit: (nickname: string) => Promise<void>
}

export default function NicknameForm({ roomId, onSubmit }: NicknameFormProps) {
  const [nickname, setNickname] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    const trimmed = nickname.trim()
    if (!trimmed) { setError('請輸入暱稱'); return }
    if (trimmed.length > 12) { setError('暱稱最多 12 個字'); return }
    setError('')
    setSubmitting(true)
    try {
      await onSubmit(trimmed)
    } catch (e) {
      console.error(e)
      setError('加入失敗，請重試')
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div>
        <p style={{ fontSize: '11px', fontFamily: 'IBM Plex Mono, monospace', color: 'rgba(0,245,212,0.7)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '4px' }}>
          Room {roomId}
        </p>
        <h2 style={{ fontSize: '28px', fontFamily: 'Syne, sans-serif', fontWeight: 800, marginBottom: '4px' }}>
          輸入你的暱稱
        </h2>
        <p style={{ fontSize: '13px', color: 'rgba(230,237,243,0.5)', fontFamily: 'Syne, sans-serif' }}>
          暱稱將顯示在講師的學員名單上
        </p>
      </div>

      <input
        type="text"
        value={nickname}
        onChange={e => setNickname(e.target.value)}
        placeholder="你的名字"
        maxLength={12}
        autoFocus
        style={{
          padding: '16px 20px', borderRadius: '12px', fontSize: '22px',
          fontFamily: 'Syne, sans-serif', fontWeight: 600,
          background: 'rgba(255,255,255,0.06)', color: '#e6edf3',
          border: error ? '2px solid #ef476f' : '2px solid rgba(0,245,212,0.2)',
          outline: 'none', transition: 'border-color 0.2s',
          width: '100%',
        }}
        onFocus={e => { e.target.style.borderColor = '#00f5d4' }}
        onBlur={e => { e.target.style.borderColor = error ? '#ef476f' : 'rgba(0,245,212,0.2)' }}
      />

      {error && (
        <p style={{ fontSize: '13px', fontFamily: 'IBM Plex Mono, monospace', color: '#ef476f' }}>{error}</p>
      )}

      <button
        type="submit"
        disabled={submitting || !nickname.trim()}
        style={{
          padding: '16px', borderRadius: '12px', fontSize: '18px',
          fontFamily: 'Syne, sans-serif', fontWeight: 700,
          background: submitting || !nickname.trim()
            ? 'rgba(255,255,255,0.05)'
            : 'linear-gradient(135deg, #00f5d4, #06d6a0)',
          color: submitting || !nickname.trim() ? 'rgba(230,237,243,0.3)' : '#0d1117',
          border: 'none', cursor: submitting || !nickname.trim() ? 'not-allowed' : 'pointer',
          transition: 'all 0.2s',
          boxShadow: submitting || !nickname.trim() ? 'none' : '0 0 30px rgba(0,245,212,0.3)',
        }}
      >
        {submitting ? '加入中...' : '加入課程 →'}
      </button>
    </form>
  )
}
