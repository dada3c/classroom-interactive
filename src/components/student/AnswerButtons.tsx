import { useState } from 'react'
import type { AnswerType } from '../../types'
import { getOptionsForType } from '../../types'

interface AnswerButtonsProps {
  answerType: AnswerType
  onAnswer: (answer: string) => void
  submitting: boolean
}

const MAX_LEN = 60

export default function AnswerButtons({ answerType, onAnswer, submitting }: AnswerButtonsProps) {
  if (answerType === 'survey') {
    return <SurveyInput onAnswer={onAnswer} submitting={submitting} />
  }

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

function SurveyInput({ onAnswer, submitting }: { onAnswer: (answer: string) => void; submitting: boolean }) {
  const [text, setText] = useState('')
  const trimmed = text.trim()
  const canSubmit = trimmed.length > 0 && trimmed.length <= MAX_LEN && !submitting

  const submit = () => {
    if (!canSubmit) return
    onAnswer(trimmed)
  }

  return (
    <div style={{ textAlign: 'center', animation: 'fadeUp 0.4s ease forwards' }}>
      <p style={{ fontSize: '14px', fontFamily: 'IBM Plex Mono, monospace', color: 'rgba(0,245,212,0.7)', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '20px' }}>
        ▶ 開放問答
      </p>
      <p style={{ fontSize: '16px', fontFamily: 'Syne, sans-serif', fontWeight: 600, marginBottom: '24px', color: 'rgba(230,237,243,0.8)' }}>
        輸入你的回應
      </p>

      <textarea
        value={text}
        onChange={e => setText(e.target.value.slice(0, MAX_LEN))}
        onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); submit() } }}
        placeholder="輸入你的想法..."
        autoFocus
        rows={3}
        style={{
          width: '100%', padding: '16px', borderRadius: '14px',
          fontSize: '18px', fontFamily: 'Syne, sans-serif', fontWeight: 500,
          background: 'rgba(255,255,255,0.06)', color: '#e6edf3',
          border: '2px solid rgba(0,245,212,0.25)',
          outline: 'none', resize: 'none',
          textAlign: 'center', lineHeight: 1.5,
          transition: 'border-color 0.2s, box-shadow 0.2s',
        }}
        onFocus={e => { e.currentTarget.style.borderColor = 'rgba(0,245,212,0.6)'; e.currentTarget.style.boxShadow = '0 0 24px rgba(0,245,212,0.15)' }}
        onBlur={e => { e.currentTarget.style.borderColor = 'rgba(0,245,212,0.25)'; e.currentTarget.style.boxShadow = 'none' }}
      />
      <p style={{ fontSize: '11px', fontFamily: 'IBM Plex Mono, monospace', color: text.length >= MAX_LEN ? '#ef476f' : 'rgba(230,237,243,0.35)', textAlign: 'right', marginTop: '6px' }}>
        {text.length} / {MAX_LEN}
      </p>

      <button
        onClick={submit}
        disabled={!canSubmit}
        style={{
          width: '100%', marginTop: '20px', padding: '16px',
          borderRadius: '14px', fontSize: '17px',
          fontFamily: 'Syne, sans-serif', fontWeight: 700,
          background: canSubmit ? 'linear-gradient(135deg, #00f5d4, #06d6a0)' : 'rgba(255,255,255,0.05)',
          color: canSubmit ? '#0d1117' : 'rgba(230,237,243,0.3)',
          border: 'none', cursor: canSubmit ? 'pointer' : 'not-allowed',
          boxShadow: canSubmit ? '0 0 24px rgba(0,245,212,0.3)' : 'none',
          transition: 'all 0.2s',
        }}
      >
        {submitting ? '送出中...' : '送出回應'}
      </button>
    </div>
  )
}
