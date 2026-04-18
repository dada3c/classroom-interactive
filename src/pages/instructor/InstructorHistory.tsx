import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { query, where, orderBy, getDocs } from 'firebase/firestore'
import { roomsCol } from '../../lib/firebase'
import type { Room } from '../../types'
import { formatTimestamp } from '../../utils/formatTime'
import GlassCard from '../../components/ui/GlassCard'

export default function InstructorHistory() {
  const navigate = useNavigate()
  const [rooms, setRooms]     = useState<Room[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const q    = query(roomsCol(), where('status', '==', 'ended'), orderBy('createdAt', 'desc'))
        const snap = await getDocs(q)
        setRooms(snap.docs.map(d => ({ id: d.id, ...d.data() }) as Room))
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchRooms()
  }, [])

  return (
    <div style={{ minHeight: '100vh', padding: '24px', position: 'relative', zIndex: 1 }}>
      <div style={{ maxWidth: '720px', margin: '0 auto', animation: 'fadeUp 0.5s ease forwards' }}>
        <button onClick={() => navigate('/instructor')} style={{ fontSize: '13px', fontFamily: 'IBM Plex Mono, monospace', color: 'rgba(230,237,243,0.4)', background: 'none', border: 'none', cursor: 'pointer', marginBottom: '24px', display: 'block' }}>
          ← 返回
        </button>

        <div style={{ marginBottom: '32px' }}>
          <p style={{ fontSize: '11px', fontFamily: 'IBM Plex Mono, monospace', color: 'rgba(255,209,102,0.7)', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '8px' }}>
            Session History
          </p>
          <h1 style={{ fontSize: '36px', fontFamily: 'Syne, sans-serif', fontWeight: 800 }}>
            歷史課程紀錄
          </h1>
        </div>

        {loading ? (
          <p style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '13px', color: 'rgba(230,237,243,0.4)' }}>載入中...</p>
        ) : rooms.length === 0 ? (
          <GlassCard className="p-8 text-center">
            <p style={{ fontSize: '14px', color: 'rgba(230,237,243,0.4)', fontFamily: 'Syne, sans-serif' }}>
              目前沒有已結束的課程紀錄
            </p>
          </GlassCard>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {rooms.map((room, i) => (
              <button
                key={room.id}
                onClick={() => navigate(`/instructor/${room.id}`)}
                style={{
                  width: '100%', textAlign: 'left', borderRadius: '16px', padding: '20px 24px',
                  background: 'rgba(255,255,255,0.04)', backdropFilter: 'blur(12px)',
                  border: '1px solid rgba(0,245,212,0.12)', cursor: 'pointer',
                  animation: `fadeUp 0.4s ease ${i * 60}ms forwards`, opacity: 0,
                  transition: 'all 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                }}
                onMouseEnter={e => { (e.currentTarget).style.borderColor = 'rgba(0,245,212,0.3)'; (e.currentTarget).style.background = 'rgba(0,245,212,0.05)' }}
                onMouseLeave={e => { (e.currentTarget).style.borderColor = 'rgba(0,245,212,0.12)'; (e.currentTarget).style.background = 'rgba(255,255,255,0.04)' }}
              >
                <div>
                  <p style={{ fontSize: '24px', fontFamily: 'IBM Plex Mono, monospace', fontWeight: 600, color: '#00f5d4', letterSpacing: '0.1em', marginBottom: '4px' }}>
                    {room.id}
                  </p>
                  <p style={{ fontSize: '13px', fontFamily: 'IBM Plex Mono, monospace', color: 'rgba(230,237,243,0.4)' }}>
                    {room.createdAt ? formatTimestamp(room.createdAt) : '—'}
                  </p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <p style={{ fontSize: '12px', fontFamily: 'IBM Plex Mono, monospace', color: '#ef476f', letterSpacing: '0.1em' }}>
                    已結束
                  </p>
                  <p style={{ fontSize: '12px', fontFamily: 'IBM Plex Mono, monospace', color: 'rgba(230,237,243,0.4)' }}>
                    正解: {room.correctAnswer ?? '—'}
                  </p>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
