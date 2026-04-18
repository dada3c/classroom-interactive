import type { Member } from '../../types'
import AnimatedCounter from '../ui/AnimatedCounter'

interface MemberListProps {
  members: Member[]
}

export default function MemberList({ members }: MemberListProps) {
  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-4">
        <h3 style={{ fontSize: '13px', color: 'rgba(230,237,243,0.5)', fontFamily: 'IBM Plex Mono, monospace', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
          學員名單
        </h3>
        <div className="flex items-center gap-2">
          <AnimatedCounter
            value={members.length}
            className="text-2xl font-bold"
          />
          <span style={{ fontSize: '12px', color: 'rgba(230,237,243,0.4)', fontFamily: 'IBM Plex Mono, monospace' }}>人</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto space-y-2 pr-1" style={{ maxHeight: '360px' }}>
        {members.length === 0 ? (
          <p style={{ fontSize: '13px', color: 'rgba(230,237,243,0.3)', fontFamily: 'IBM Plex Mono, monospace', textAlign: 'center', paddingTop: '24px' }}>
            等待學員加入...
          </p>
        ) : (
          members.map((member, i) => (
            <div
              key={member.id}
              className="flex items-center gap-3 px-3 py-2 rounded-xl"
              style={{
                background: 'rgba(0, 245, 212, 0.06)',
                border: '1px solid rgba(0, 245, 212, 0.1)',
                animation: 'fadeUp 0.4s ease forwards',
                animationDelay: `${i * 40}ms`,
                opacity: 0,
              }}
            >
              <span style={{
                width: '28px', height: '28px', borderRadius: '50%',
                background: `hsl(${(i * 67) % 360}, 60%, 50%)`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '12px', fontWeight: 700, color: 'white', flexShrink: 0
              }}>
                {member.nickname.charAt(0).toUpperCase()}
              </span>
              <span style={{ fontSize: '14px', fontFamily: 'Syne, sans-serif', fontWeight: 600 }}>
                {member.nickname}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
