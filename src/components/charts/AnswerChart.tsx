import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import type { AnswerStats } from '../../types'

interface AnswerChartProps {
  stats: AnswerStats
  correctAnswer?: string | null
}

const COLORS = { O: '#06d6a0', X: '#ef476f' }

const renderCustomLabel = ({ cx = 0, cy = 0, midAngle = 0, innerRadius = 0, outerRadius = 0, percent = 0 }: {
  cx?: number; cy?: number; midAngle?: number; innerRadius?: number; outerRadius?: number; percent?: number
}) => {
  const RADIAN = Math.PI / 180
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5
  const x = cx + radius * Math.cos(-midAngle * RADIAN)
  const y = cy + radius * Math.sin(-midAngle * RADIAN)
  if (percent < 0.05) return null
  return (
    <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central"
      style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '18px', fontWeight: 600 }}>
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  )
}

export default function AnswerChart({ stats, correctAnswer }: AnswerChartProps) {
  const data = [
    { name: '○', value: stats.O },
    { name: '✕', value: stats.X },
  ].filter(d => d.value > 0)

  if (stats.total === 0) {
    return (
      <div className="flex items-center justify-center h-40" style={{ color: 'rgba(230,237,243,0.4)' }}>
        <p style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '14px' }}>尚無作答資料</p>
      </div>
    )
  }

  return (
    <div className="w-full">
      <div className="flex justify-center gap-8 mb-4">
        {[{ key: 'O', label: '○', count: stats.O }, { key: 'X', label: '✕', count: stats.X }].map(({ key, label, count }) => (
          <div key={key} className="flex flex-col items-center gap-1">
            <span style={{
              fontSize: '32px', fontFamily: 'Syne, sans-serif', fontWeight: 800,
              color: COLORS[key as 'O' | 'X'],
              textShadow: `0 0 20px ${COLORS[key as 'O' | 'X']}60`
            }}>
              {count}
            </span>
            <span style={{ fontSize: '20px', color: COLORS[key as 'O' | 'X'] }}>{label}</span>
            {correctAnswer === key && (
              <span style={{ fontSize: '10px', color: COLORS[key as 'O' | 'X'], fontFamily: 'IBM Plex Mono, monospace' }}>
                ✓ 正確答案
              </span>
            )}
          </div>
        ))}
      </div>

      <ResponsiveContainer width="100%" height={200}>
        <PieChart>
          <Pie
            data={data}
            cx="50%" cy="50%"
            outerRadius={80}
            dataKey="value"
            labelLine={false}
            label={renderCustomLabel}
            isAnimationActive
            animationBegin={0}
            animationDuration={800}
          >
            {data.map((entry) => (
              <Cell key={entry.name} fill={entry.name === '○' ? COLORS.O : COLORS.X} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              background: '#1a1f2e', border: '1px solid rgba(0,245,212,0.2)',
              borderRadius: '8px', color: '#e6edf3',
              fontFamily: 'IBM Plex Mono, monospace', fontSize: '12px'
            }}
            formatter={(value) => [`${value} 人`, '']}
          />
          <Legend
            formatter={(value) => <span style={{ color: '#e6edf3', fontFamily: 'IBM Plex Mono, monospace', fontSize: '12px' }}>{value}</span>}
          />
        </PieChart>
      </ResponsiveContainer>

      <p style={{ textAlign: 'center', fontFamily: 'IBM Plex Mono, monospace', fontSize: '12px', color: 'rgba(230,237,243,0.5)', marginTop: '8px' }}>
        共 {stats.total} 人作答
      </p>
    </div>
  )
}
