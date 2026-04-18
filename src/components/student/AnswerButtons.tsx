import type { AnswerType } from '../../types'
import { getOptionsForType } from '../../types'

interface AnswerButtonsProps {
  answerType: AnswerType
  onAnswer: (answer: string) => void
  submitting: boolean
}

export default function AnswerButtons({ answerType, onAnswer, submitting }: AnswerButtonsProps) {
  const options = getOptionsForType(answerType)

  return (
    <div style={{ textAlign: 'center', animation: 'fadeUp 0.4s ease forwards' }}>
      <p style={{ fontSize: '14px', fontFamily: 'IBM Plex Mono, monospace', color: 'rgba(0,245,212,0.7)', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '32px' }}>
        ▶ 作答中
      </p>
      <p style={{ fontSize: '18px', fontFamily: 'Syne, sans-serif', fontWeight: 600, marginBottom: '40px', color: 'rgba(230,237,243,0.8)' }}>
        請選擇你的答案
      </p>

      <div style={{
        display: 'grid',
        gridTemplateColumns: options.length === 2 ? 'repeat(2, 140px)' : 'repeat(2, 1fr)',
        gap: '16px',
        justifyContent: 'center',
      }}>
        {options.map(({ key, label, name, color, shadow, bg }) => (
          <button
            key={key}
            onClick={() => !submitting && onAnswer(key)}
            disabled={submitting}
            style={{
              aspectRatio: '1',
              borderRadius: '24px',
              fontSize: options.length === 2 ? '64px' : '40px',
              fontFamily: 'Syne, sans-serif', fontWeight: 800,
              background: bg, color: color,
              border: `3px solid ${color}40`,
              cursor: submitting ? 'not-allowed' : 'pointer',
              transition: 'all 0.15s',
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
              gap: '4px',
            }}
            onMouseEnter={e => {
              if (!submitting) {
                const el = e.currentTarget
                el.style.transform = 'scale(1.06)'
                el.style.boxShadow = `0 0 50px ${shadow}`
                el.style.borderColor = color
              }
            }}
            onMouseLeave={e => {
              const el = e.currentTarget
              el.style.transform = 'scale(1)'
              el.style.boxShadow = 'none'
              el.style.borderColor = `${color}40`
            }}
            onMouseDown={e => { if (!submitting) (e.currentTarget).style.transform = 'scale(0.96)' }}
            onMouseUp={e => { if (!submitting) (e.currentTarget).style.transform = 'scale(1.06)' }}
          >
            <span>{label}</span>
            {options.length > 2 && (
              <span style={{ fontSize: '12px', fontWeight: 600, opacity: 0.8 }}>{name}</span>
            )}
          </button>
        ))}
      </div>
    </div>
  )
}
