import type { RoomStatus } from '../../types'

const STATUS_CONFIG: Record<RoomStatus, { label: string; color: string; ping: boolean }> = {
  waiting:   { label: '等待中',  color: 'text-amber-400 border-amber-400/30 bg-amber-400/10',   ping: false },
  answering: { label: '作答中',  color: 'text-cyan-400 border-cyan-400/30 bg-cyan-400/10',     ping: true  },
  ended:     { label: '已結束',  color: 'text-coral border-coral/30 bg-coral/10',              ping: false },
}

interface StatusBadgeProps {
  status: RoomStatus
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  const { label, color, ping } = STATUS_CONFIG[status]
  return (
    <span
      className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border text-xs font-mono font-semibold ${color}`}
      style={{ fontFamily: 'IBM Plex Mono, monospace' }}
    >
      {ping && (
        <span className="relative flex h-2 w-2">
          <span
            className="absolute inline-flex h-full w-full rounded-full opacity-75"
            style={{ background: '#00f5d4', animation: 'ping 1.5s cubic-bezier(0,0,0.2,1) infinite' }}
          />
          <span className="relative inline-flex rounded-full h-2 w-2" style={{ background: '#00f5d4' }} />
        </span>
      )}
      {!ping && <span className="h-2 w-2 rounded-full" style={{ background: status === 'ended' ? '#ef476f' : '#ffd166' }} />}
      {label}
    </span>
  )
}
