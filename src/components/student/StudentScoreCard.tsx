import type { RoundResult } from '../../types'

interface StudentScoreCardProps {
  memberId: string
  nickname: string
  rounds: RoundResult[]
}

export default function StudentScoreCard({ memberId, nickname, rounds }: StudentScoreCardProps) {
  if (rounds.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '48px 24px' }}>
        <p style={{ fontSize: '14px', fontFamily: 'IBM Plex Mono, monospace', color: 'rgba(230,237,243,0.4)' }}>沒有答題紀錄</p>
      </div>
    )
  }

  let correct = 0
  let total = 0
  const details: { round: number; myAnswer: string; correctAnswer: string; isCorrect: boolean }[] = []

  rounds.forEach(r => {
    const mine = r.answers[memberId]
    if (mine) {
      total++
      if (mine.correct) correct++
      details.push({
        round: r.roundNumber,
        myAnswer: mine.answer,
        correctAnswer: r.correctAnswer,
        isCorrect: mine.correct,
      })
    }
  })

  const percent = total > 0 ? Math.round((correct / total) * 100) : 0

  const getColor = (p: number) => {
    if (p >= 80) return '#06d6a0'
    if (p >= 60) return '#ffd166'
    if (p >= 40) return '#f4a261'
    return '#ef476f'
  }
  const color = getColor(percent)

  const getEmoji = (p: number) => {
    if (p === 100) return '🏆'
    if (p >= 80) return '🎉'
    if (p >= 60) return '👍'
    if (p >= 40) return '💪'
    return '📚'
  }

  return (
    <div style={{ textAlign: 'center', padding: '32px 24px', animation: 'fadeUp 0.5s ease forwards' }}>
      <p style={{ fontSize: '48px', marginBottom: '8px' }}>{getEmoji(percent)}</p>
      <h2 style={{ fontSize: '24px', fontFamily: 'Syne, sans-serif', fontWeight: 800, marginBottom: '4px' }}>
        考題結束！
      </h2>
      <p style={{ fontSize: '14px', color: 'rgba(230,237,243,0.5)', fontFamily: 'Syne, sans-serif', marginBottom: '24px' }}>
        {nickname} 的答題成績
      </p>

      {/* Score circle */}
      <div style={{
        width: '140px', height: '140px', borderRadius: '50%', margin: '0 auto 24px',
        background: `${color}12`, border: `4px solid ${color}`,
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        boxShadow: `0 0 40px ${color}30`,
      }}>
        <span style={{ fontSize: '44px', fontFamily: 'Syne, sans-serif', fontWeight: 800, color, lineHeight: 1 }}>
          {percent}%
        </span>
        <span style={{ fontSize: '12px', fontFamily: 'IBM Plex Mono, monospace', color: 'rgba(230,237,243,0.5)' }}>
          {correct}/{total}
        </span>
      </div>

      {/* Per-question result */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', justifyContent: 'center' }}>
        {details.map(d => (
          <div key={d.round} style={{
            width: '40px', height: '40px', borderRadius: '10px',
            background: d.isCorrect ? 'rgba(6,214,160,0.15)' : 'rgba(239,71,111,0.15)',
            border: `2px solid ${d.isCorrect ? 'rgba(6,214,160,0.4)' : 'rgba(239,71,111,0.4)'}`,
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          }}>
            <span style={{ fontSize: '9px', fontFamily: 'IBM Plex Mono, monospace', color: 'rgba(230,237,243,0.4)' }}>
              Q{d.round}
            </span>
            <span style={{ fontSize: '14px', color: d.isCorrect ? '#06d6a0' : '#ef476f' }}>
              {d.isCorrect ? '✓' : '✗'}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
