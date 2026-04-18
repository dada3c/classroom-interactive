interface AnswerButtonsProps {
  onAnswer: (answer: 'O' | 'X') => void
  submitting: boolean
}

export default function AnswerButtons({ onAnswer, submitting }: AnswerButtonsProps) {
  return (
    <div style={{ textAlign: 'center', animation: 'fadeUp 0.4s ease forwards' }}>
      <p style={{ fontSize: '14px', fontFamily: 'IBM Plex Mono, monospace', color: 'rgba(0,245,212,0.7)', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '32px' }}>
        ▶ 作答中
      </p>
      <p style={{ fontSize: '18px', fontFamily: 'Syne, sans-serif', fontWeight: 600, marginBottom: '40px', color: 'rgba(230,237,243,0.8)' }}>
        請選擇你的答案
      </p>

      <div style={{ display: 'flex', gap: '20px', justifyContent: 'center' }}>
        {([
          { ans: 'O' as const, label: '○', color: '#06d6a0', shadow: 'rgba(6,214,160,0.4)', bg: 'rgba(6,214,160,0.1)' },
          { ans: 'X' as const, label: '✕', color: '#ef476f', shadow: 'rgba(239,71,111,0.4)', bg: 'rgba(239,71,111,0.1)' },
        ]).map(({ ans, label, color, shadow, bg }) => (
          <button
            key={ans}
            onClick={() => !submitting && onAnswer(ans)}
            disabled={submitting}
            style={{
              width: '140px', height: '140px', borderRadius: '24px', fontSize: '64px',
              fontFamily: 'Syne, sans-serif', fontWeight: 800,
              background: bg, color: color,
              border: `3px solid ${color}40`,
              cursor: submitting ? 'not-allowed' : 'pointer',
              transition: 'all 0.15s',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
            onMouseEnter={e => {
              if (!submitting) {
                const el = e.currentTarget
                el.style.transform = 'scale(1.06)'
                el.style.boxShadow = `0 0 50px ${shadow}`
                el.style.borderColor = color
                el.style.background = `${bg.replace('0.1', '0.2')}`
              }
            }}
            onMouseLeave={e => {
              const el = e.currentTarget
              el.style.transform = 'scale(1)'
              el.style.boxShadow = 'none'
              el.style.borderColor = `${color}40`
              el.style.background = bg
            }}
            onMouseDown={e => { if (!submitting) (e.currentTarget).style.transform = 'scale(0.96)' }}
            onMouseUp={e => { if (!submitting) (e.currentTarget).style.transform = 'scale(1.06)' }}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  )
}
