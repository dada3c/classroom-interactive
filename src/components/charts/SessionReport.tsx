import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell, Tooltip, PieChart, Pie } from 'recharts'
import type { RoundResult, Member } from '../../types'
import GlassCard from '../ui/GlassCard'

interface SessionReportProps {
  rounds: RoundResult[]
  members: Member[]
}

export default function SessionReport({ rounds, members }: SessionReportProps) {
  if (rounds.length === 0) {
    return (
      <GlassCard className="p-8 text-center">
        <p style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '14px', color: 'rgba(230,237,243,0.4)' }}>
          沒有答題紀錄
        </p>
      </GlassCard>
    )
  }

  // Compute per-student stats (correct / wrong / unanswered)
  const studentStats: { nickname: string; correct: number; wrong: number; unanswered: number; total: number; percent: number }[] = []
  const studentMap = new Map<string, { nickname: string; correct: number; wrong: number; unanswered: number; total: number }>()

  rounds.forEach(round => {
    Object.entries(round.answers).forEach(([memberId, data]) => {
      const existing = studentMap.get(memberId) || { nickname: data.nickname, correct: 0, wrong: 0, unanswered: 0, total: 0 }
      existing.total++
      if (data.answer === null || data.answer === undefined) {
        existing.unanswered++
      } else if (data.correct) {
        existing.correct++
      } else {
        existing.wrong++
      }
      existing.nickname = data.nickname
      studentMap.set(memberId, existing)
    })
  })

  studentMap.forEach((val) => {
    const answered = val.correct + val.wrong
    studentStats.push({ ...val, percent: answered > 0 ? Math.round((val.correct / answered) * 100) : 0 })
  })
  studentStats.sort((a, b) => b.percent - a.percent)

  // Overall stats
  const totalCorrect = studentStats.reduce((s, v) => s + v.correct, 0)
  const totalWrong = studentStats.reduce((s, v) => s + v.wrong, 0)
  const totalUnanswered = studentStats.reduce((s, v) => s + v.unanswered, 0)
  const totalAnswered = totalCorrect + totalWrong
  const overallPercent = totalAnswered > 0 ? Math.round((totalCorrect / totalAnswered) * 100) : 0

  // Per-round accuracy
  const roundAccuracy = rounds.map(r => {
    const entries = Object.values(r.answers)
    const answered = entries.filter(a => a.answer !== null && a.answer !== undefined)
    const correct = answered.filter(a => a.correct).length
    const unanswered = entries.length - answered.length
    return {
      name: `Q${r.roundNumber}`,
      正確率: answered.length > 0 ? Math.round((correct / answered.length) * 100) : 0,
      未作答: unanswered,
    }
  })

  const getBarColor = (percent: number) => {
    if (percent >= 80) return '#06d6a0'
    if (percent >= 60) return '#ffd166'
    if (percent >= 40) return '#f4a261'
    return '#ef476f'
  }

  const pieData = [
    { name: '正確', value: totalCorrect, color: '#06d6a0' },
    { name: '錯誤', value: totalWrong, color: '#ef476f' },
    { name: '未作答', value: totalUnanswered, color: '#555e6e' },
  ].filter(d => d.value > 0)

  return (
    <div className="flex flex-col gap-6" style={{ animation: 'fadeUp 0.5s ease forwards' }}>
      {/* Overall accuracy card */}
      <GlassCard className="p-6">
        <h3 style={{ fontSize: '13px', color: 'rgba(230,237,243,0.5)', fontFamily: 'IBM Plex Mono, monospace', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '20px', textAlign: 'center' }}>
          全班總正確率
        </h3>
        <div className="flex items-center justify-center gap-8 flex-wrap">
          <div style={{ textAlign: 'center' }}>
            <p style={{
              fontSize: '72px', fontFamily: 'Syne, sans-serif', fontWeight: 800,
              color: getBarColor(overallPercent),
              textShadow: `0 0 40px ${getBarColor(overallPercent)}40`,
              lineHeight: 1,
            }}>
              {overallPercent}%
            </p>
            <p style={{ fontSize: '13px', fontFamily: 'IBM Plex Mono, monospace', color: 'rgba(230,237,243,0.5)', marginTop: '8px' }}>
              {rounds.length} 題 · {studentStats.length} 人
            </p>
            <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', marginTop: '8px' }}>
              <span style={{ fontSize: '12px', fontFamily: 'IBM Plex Mono, monospace', color: '#06d6a0' }}>✓ {totalCorrect}</span>
              <span style={{ fontSize: '12px', fontFamily: 'IBM Plex Mono, monospace', color: '#ef476f' }}>✗ {totalWrong}</span>
              {totalUnanswered > 0 && <span style={{ fontSize: '12px', fontFamily: 'IBM Plex Mono, monospace', color: '#555e6e' }}>— {totalUnanswered}</span>}
            </div>
          </div>
          <div style={{ width: '130px', height: '130px' }}>
            <ResponsiveContainer>
              <PieChart>
                <Pie data={pieData} dataKey="value" cx="50%" cy="50%" outerRadius={58} innerRadius={38} isAnimationActive animationDuration={800}>
                  {pieData.map(d => <Cell key={d.name} fill={d.color} />)}
                </Pie>
                <Tooltip
                  contentStyle={{ background: '#1a1f2e', border: '1px solid rgba(0,245,212,0.2)', borderRadius: '8px', color: '#e6edf3', fontFamily: 'IBM Plex Mono, monospace', fontSize: '12px' }}
                  formatter={(v) => [`${v} 次`, '']}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </GlassCard>

      {/* Per-round accuracy chart */}
      {rounds.length > 1 && (
        <GlassCard className="p-6">
          <h3 style={{ fontSize: '13px', color: 'rgba(230,237,243,0.5)', fontFamily: 'IBM Plex Mono, monospace', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '16px' }}>
            每題正確率
          </h3>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={roundAccuracy} margin={{ left: -20 }}>
              <XAxis dataKey="name" tick={{ fill: 'rgba(230,237,243,0.5)', fontSize: 12, fontFamily: 'IBM Plex Mono, monospace' }} axisLine={false} tickLine={false} />
              <YAxis domain={[0, 100]} tick={{ fill: 'rgba(230,237,243,0.3)', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: '#1a1f2e', border: '1px solid rgba(0,245,212,0.2)', borderRadius: '8px', color: '#e6edf3', fontFamily: 'IBM Plex Mono, monospace', fontSize: '12px' }} formatter={(v, name) => [name === '未作答' ? `${v} 人` : `${v}%`, name]} />
              <Bar dataKey="正確率" radius={[6, 6, 0, 0]} isAnimationActive animationDuration={800}>
                {roundAccuracy.map((entry, i) => <Cell key={i} fill={getBarColor(entry['正確率'])} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </GlassCard>
      )}

      {/* Per-student accuracy chart */}
      <GlassCard className="p-6">
        <h3 style={{ fontSize: '13px', color: 'rgba(230,237,243,0.5)', fontFamily: 'IBM Plex Mono, monospace', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '16px' }}>
          每位學員正確率
        </h3>
        <div className="flex flex-col gap-3">
          {studentStats.map((s, i) => (
            <div key={i} className="flex items-center gap-3">
              <span style={{
                width: '28px', height: '28px', borderRadius: '50%',
                background: `hsl(${(i * 67) % 360}, 60%, 50%)`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '12px', fontWeight: 700, color: 'white', flexShrink: 0,
              }}>
                {s.nickname.charAt(0).toUpperCase()}
              </span>
              <span style={{ fontSize: '14px', fontFamily: 'Syne, sans-serif', fontWeight: 600, minWidth: '60px' }}>
                {s.nickname}
              </span>
              <div style={{ flex: 1, height: '24px', borderRadius: '12px', background: 'rgba(255,255,255,0.06)', overflow: 'hidden', position: 'relative' }}>
                <div style={{
                  height: '100%', borderRadius: '12px',
                  width: `${s.percent}%`,
                  background: `linear-gradient(90deg, ${getBarColor(s.percent)}, ${getBarColor(s.percent)}cc)`,
                  transition: 'width 0.8s ease',
                  boxShadow: `0 0 12px ${getBarColor(s.percent)}40`,
                }} />
              </div>
              <span style={{
                fontSize: '14px', fontFamily: 'IBM Plex Mono, monospace', fontWeight: 700,
                color: getBarColor(s.percent), minWidth: '42px', textAlign: 'right',
              }}>
                {s.percent}%
              </span>
              <span style={{ fontSize: '11px', fontFamily: 'IBM Plex Mono, monospace', color: 'rgba(230,237,243,0.3)', minWidth: '65px', textAlign: 'right' }}>
                {s.correct}✓ {s.wrong}✗{s.unanswered > 0 ? ` ${s.unanswered}—` : ''}
              </span>
            </div>
          ))}
        </div>
      </GlassCard>
    </div>
  )
}
