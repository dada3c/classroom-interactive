import type { Member } from '../../types'

interface NicknameCloudProps {
  members: Member[]
  size?: 'sm' | 'lg'
}

const CLOUD_COLORS = ['#00f5d4', '#06d6a0', '#ffd166', '#ef476f', '#118ab2', '#f4a261', '#e76f51', '#2a9d8f']

function hashStr(str: string): number {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash) + str.charCodeAt(i)
    hash |= 0
  }
  return Math.abs(hash)
}

export default function NicknameCloud({ members, size = 'sm' }: NicknameCloudProps) {
  if (members.length === 0) return null

  const baseSize = size === 'lg' ? 24 : 16
  const sizeRange = size === 'lg' ? 28 : 18

  return (
    <div style={{
      display: 'flex', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center',
      gap: '4px 12px', padding: '16px',
      minHeight: size === 'lg' ? '160px' : '100px',
    }}>
      {members.map((member, i) => {
        const h = hashStr(member.nickname + member.id)
        const fontSize = baseSize + (h % sizeRange)
        const color = CLOUD_COLORS[h % CLOUD_COLORS.length]
        const fadeDelay = i * 0.08
        const floatDelay = (h % 30) / 10

        return (
          <div
            key={member.id}
            style={{
              animation: `cloudFadeIn 0.5s ease ${fadeDelay}s forwards`,
              opacity: 0,
            }}
          >
            <span
              style={{
                fontSize: `${fontSize}px`,
                fontFamily: 'Syne, sans-serif',
                fontWeight: 600 + (h % 3) * 100,
                color,
                textShadow: `0 0 ${fontSize}px ${color}30`,
                display: 'inline-block',
                padding: '2px 6px',
                animation: `cloudFloat ${2.5 + (h % 15) / 10}s ease-in-out ${floatDelay}s infinite alternate`,
                cursor: 'default',
                transition: 'transform 0.2s',
              }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.3)'; e.currentTarget.style.textShadow = `0 0 ${fontSize * 2}px ${color}60` }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.textShadow = `0 0 ${fontSize}px ${color}30` }}
            >
              {member.nickname}
            </span>
          </div>
        )
      })}
      <style>{`
        @keyframes cloudFadeIn {
          from { opacity: 0; transform: scale(0.3); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes cloudFloat {
          from { transform: translateY(0); }
          to { transform: translateY(-8px); }
        }
      `}</style>
    </div>
  )
}
