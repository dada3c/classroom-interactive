import { useState } from 'react'
import StatusBadge from '../ui/StatusBadge'
import type { RoomStatus } from '../../types'

interface RoomHeaderProps {
  roomId: string
  status: RoomStatus
}

export default function RoomHeader({ roomId, status }: RoomHeaderProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(roomId)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="flex items-center justify-between flex-wrap gap-4">
      <div className="flex items-center gap-4">
        <div>
          <p style={{ fontSize: '11px', color: 'rgba(230,237,243,0.4)', fontFamily: 'IBM Plex Mono, monospace', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '4px' }}>
            Room ID
          </p>
          <button onClick={handleCopy} className="flex items-center gap-3 group">
            <span style={{
              fontSize: '48px', fontFamily: 'IBM Plex Mono, monospace', fontWeight: 600,
              color: '#00f5d4', letterSpacing: '0.15em',
              textShadow: '0 0 30px rgba(0, 245, 212, 0.4)'
            }}>
              {roomId}
            </span>
            <span style={{
              fontSize: '12px', fontFamily: 'IBM Plex Mono, monospace',
              color: copied ? '#06d6a0' : 'rgba(230,237,243,0.4)',
              transition: 'color 0.2s'
            }}>
              {copied ? '✓ 已複製' : '複製'}
            </span>
          </button>
        </div>
      </div>
      <StatusBadge status={status} />
    </div>
  )
}
