import type { AnswerStats } from '../../types'

interface ResultScreenProps {
  myAnswer: string | null
  correctAnswer: string | null
  stats: AnswerStats
}

export default function ResultScreen({ myAnswer, correctAnswer, stats }: ResultScreenProps) {
  const isCorrect = myAnswer && correctAnswer && myAnswer === correctAnswer
  const didAnswer = !!myAnswer

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
            你的答案：{myAnswer === 'O' ? '○' : '✕'}　正確答案：{correctAnswer === 'O' ? '○' : '✕'}
          </p>
        </div>
      )}

      {/* Class stats */}
      <div style={{ marginBottom: '16px' }}>
        <p style={{ fontSize: '11px', fontFamily: 'IBM Plex Mono, monospace', color: 'rgba(230,237,243,0.4)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '16px' }}>
          全班統計
        </p>
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
          {[
            { key: 'O', label: '○', count: stats.O, percent: stats.oPercent, color: '#06d6a0' },
            { key: 'X', label: '✕', count: stats.X, percent: stats.xPercent, color: '#ef476f' },
          ].map(({ key, label, count, percent, color }) => (
            <div key={key} style={{
              flex: 1, padding: '20px 12px', borderRadius: '12px',
              background: `${color}10`, border: `1px solid ${color}30`,
              position: 'relative', overflow: 'hidden',
            }}>
              <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: `${percent}%`, background: `${color}15`, transition: 'height 0.8s ease' }} />
              <p style={{ fontSize: '32px', color, fontFamily: 'Syne, sans-serif', fontWeight: 800, position: 'relative', zIndex: 1 }}>
                {count}
              </p>
              <p style={{ fontSize: '24px', color, position: 'relative', zIndex: 1 }}>{label}</p>
              <p style={{ fontSize: '13px', fontFamily: 'IBM Plex Mono, monospace', color: 'rgba(230,237,243,0.5)', position: 'relative', zIndex: 1 }}>
                {percent.toFixed(0)}%
                {correctAnswer === key && <span style={{ display: 'block', color, fontSize: '10px', marginTop: '2px' }}>✓ 正解</span>}
              </p>
            </div>
          ))}
        </div>
      </div>

      <p style={{ fontSize: '12px', fontFamily: 'IBM Plex Mono, monospace', color: 'rgba(230,237,243,0.3)' }}>
        共 {stats.total} 人作答
      </p>
    </div>
  )
}
