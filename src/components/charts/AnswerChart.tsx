import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import type { AnswerStats, AnswerType } from '../../types'
import { getOptionsForType } from '../../types'

interface AnswerChartProps {
  stats: AnswerStats
  correctAnswer?: string | null
  answerType: AnswerType
}

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

export default function AnswerChart({ stats, correctAnswer, answerType }: AnswerChartProps) {
  const options = getOptionsForType(answerType)

  const data = options
    .map(opt => ({ name: opt.label, key: opt.key, value: stats.counts[opt.key] || 0, color: opt.color }))
    .filter(d => d.value > 0)

  if (stats.total === 0) {
    return (
      <div className="flex items-center justify-center h-40" style={{ color: 'rgba(230,237,243,0.4)' }}>
        <p style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '14px' }}>尚無作答資料</p>
      </div>
    )
  }

  return (
    <div className="w-full">
      <div className="flex justify-center gap-6 mb-4 flex-wrap">
        {options.map(opt => {
          const count = stats.counts[opt.key] || 0
          return (
            <div key={opt.key} className="flex flex-col items-center gap-1">
              <span style={{
                fontSize: '28px', fontFamily: 'Syne, sans-serif', fontWeight: 800,
                color: opt.color,
                textShadow: `0 0 20px ${opt.color}60`
              }}>
                {count}
              </span>
              <span style={{ fontSize: '20px', color: opt.color }}>{opt.label}</span>
              {correctAnswer === opt.key && (
                <span style={{ fontSize: '10px', color: opt.color, fontFamily: 'IBM Plex Mono, monospace' }}>
                  ✓ 正確答案
                </span>
              )}
            </div>
          )
        })}
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
              <Cell key={entry.key} fill={entry.color} />
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
