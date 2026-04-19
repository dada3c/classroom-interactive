import type { AnswerStats, AnswerType } from '../../types'
import { getOptionsForType, findOption } from '../../types'

interface ResultScreenProps {
  myAnswer: string | null
  correctAnswer: string | null
  stats: AnswerStats
  answerType: AnswerType
}

export default function ResultScreen({ myAnswer, correctAnswer, stats, answerType }: ResultScreenProps) {
  if (answerType === 'survey') {
    return (
      <div style={{ textAlign: 'center', padding: '40px 24px', animation: 'fadeUp 0.4s ease forwards' }}>
        <p style={{ fontSize: '48px', marginBottom: '12px' }}>💬</p>
        <h2 style={{ fontSize: '22px', fontFamily: 'Syne, sans-serif', fontWeight: 800, marginBottom: '8px' }}>
          感謝你的回應！
        </h2>
        {myAnswer && (
          <p style={{ fontSize: '15px', color: 'rgba(230,237,243,0.6)', fontFamily: 'Syne, sans-serif', marginBottom: '20px' }}>
            你的回應：<span style={{ color: '#00f5d4', fontWeight: 700 }}>{myAnswer}</span>
          </p>
        )}
        <p style={{ fontSize: '12px', fontFamily: 'IBM Plex Mono, monospace', color: 'rgba(230,237,243,0.35)' }}>
          共 {stats.total} 人回應
        </p>
      </div>
    )
  }

  const isCorrect = myAnswer && correctAnswer && myAnswer === correctAnswer
  const didAnswer = !!myAnswer
  const options = getOptionsForType(answerType)

  const myOpt = myAnswer ? findOption(answerType, myAnswer) : null
  const correctOpt = correctAnswer ? findOption(answerType, correctAnswer) : null

  return (
    <div style={{ textAlign: 'center', padding: '32px 24px', animation: 'fadeUp 0.4s ease forwards' }}>
      {/* Personal result */}
      {didAnswer && (
        <div style={{
          padding: '24px', borderRadius: '16px', marginBottom: '28px',
          background: isCorrect ? 'rgba(6,214,160,0.1)' : 'rgba(239,71,111,0.1)',
          border: `2px solid ${isCorrect ? 'rgba(6,214,160,0.3)' : 'rgba(239,71,111,0.3)'}`,
        }}>
          <p style={{ fontSize: '40px', marginBottom: '8px' }}>
            {isCorrect ? '🎉' : '😔'}
          </p>
          <p style={{ fontSize: '22px', fontFamily: 'Syne, sans-serif', fontWeight: 800,
            color: isCorrect ? '#06d6a0' : '#ef476f', marginBottom: '4px' }}>
            {isCorrect ? '答對了！' : '答錯了'}
          </p>
          <p style={{ fontSize: '13px', fontFamily: 'IBM Plex Mono, monospace', color: 'rgba(230,237,243,0.5)' }}>
            你的答案：<span style={{ color: myOpt?.color }}>{myOpt?.label}</span>　正確答案：<span style={{ color: correctOpt?.color }}>{correctOpt?.label}</span>
          </p>
        </div>
      )}

      {/* Class stats */}
      <div style={{ marginBottom: '16px' }}>
        <p style={{ fontSize: '11px', fontFamily: 'IBM Plex Mono, monospace', color: 'rgba(230,237,243,0.4)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '16px' }}>
          全班統計
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: `repeat(${options.length}, 1fr)`, gap: '8px' }}>
          {options.map(opt => {
            const count = stats.counts[opt.key] || 0
            const percent = stats.total > 0 ? (count / stats.total) * 100 : 0
            return (
              <div key={opt.key} style={{
                padding: '16px 8px', borderRadius: '12px',
                background: `${opt.color}10`, border: `1px solid ${opt.color}30`,
                position: 'relative', overflow: 'hidden',
              }}>
                <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: `${percent}%`, background: `${opt.color}15`, transition: 'height 0.8s ease' }} />
                <p style={{ fontSize: '28px', color: opt.color, fontFamily: 'Syne, sans-serif', fontWeight: 800, position: 'relative', zIndex: 1 }}>
                  {count}
                </p>
                <p style={{ fontSize: '20px', color: opt.color, position: 'relative', zIndex: 1 }}>{opt.label}</p>
                <p style={{ fontSize: '12px', fontFamily: 'IBM Plex Mono, monospace', color: 'rgba(230,237,243,0.5)', position: 'relative', zIndex: 1 }}>
                  {percent.toFixed(0)}%
                  {correctAnswer === opt.key && <span style={{ display: 'block', color: opt.color, fontSize: '10px', marginTop: '2px' }}>✓ 正解</span>}
                </p>
              </div>
            )
          })}
        </div>
      </div>

      <p style={{ fontSize: '12px', fontFamily: 'IBM Plex Mono, monospace', color: 'rgba(230,237,243,0.3)' }}>
        共 {stats.total} 人作答
      </p>
    </div>
  )
}
