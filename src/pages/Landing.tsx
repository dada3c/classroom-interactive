import { useNavigate } from 'react-router-dom'

export default function Landing() {
  const navigate = useNavigate()

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '24px', position: 'relative', zIndex: 1 }}>
      {/* Title */}
      <div style={{ textAlign: 'center', marginBottom: '64px', animation: 'fadeUp 0.6s ease forwards' }}>
        <p style={{ fontSize: '11px', fontFamily: 'IBM Plex Mono, monospace', color: 'rgba(0,245,212,0.7)', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '12px' }}>
          Interactive Classroom
        </p>
        <h1 style={{ fontSize: '56px', fontFamily: 'Syne, sans-serif', fontWeight: 800, lineHeight: 1.1, letterSpacing: '-1px' }}>
          互動教學
          <br />
          <span style={{ color: '#00f5d4', textShadow: '0 0 40px rgba(0,245,212,0.4)' }}>即時系統</span>
        </h1>
      </div>

      {/* Role cards */}
      <div style={{ display: 'flex', gap: '24px', width: '100%', maxWidth: '680px', flexWrap: 'wrap', justifyContent: 'center' }}>
        <RoleCard
          role="instructor"
          title="講師"
          subtitle="Instructor"
          desc="建立課程，控制教學進度，即時查看答題統計"
          icon="🎓"
          accentColor="#ffd166"
          borderColor="rgba(255,209,102,0.2)"
          glowColor="rgba(255,209,102,0.15)"
          delay="0.2s"
          onClick={() => navigate('/instructor')}
        />
        <RoleCard
          role="student"
          title="學員"
          subtitle="Student"
          desc="掃描 QR Code 加入課程，即時作答互動"
          icon="📱"
          accentColor="#00f5d4"
          borderColor="rgba(0,245,212,0.2)"
          glowColor="rgba(0,245,212,0.1)"
          delay="0.35s"
          onClick={() => navigate('/join/000000')}
        />
      </div>
    </div>
  )
}

interface RoleCardProps {
  role: string
  title: string
  subtitle: string
  desc: string
  icon: string
  accentColor: string
  borderColor: string
  glowColor: string
  delay: string
  onClick: () => void
}

function RoleCard({ title, subtitle, desc, icon, accentColor, borderColor, glowColor, delay, onClick }: RoleCardProps) {
  return (
    <button
      onClick={onClick}
      style={{
        flex: '1 1 260px', minHeight: '280px', borderRadius: '24px', padding: '36px 28px',
        background: 'rgba(255,255,255,0.04)', backdropFilter: 'blur(12px)',
        border: `1px solid ${borderColor}`,
        cursor: 'pointer', textAlign: 'left',
        animation: `fadeUp 0.6s ease ${delay} forwards`, opacity: 0,
        transition: 'transform 0.2s, box-shadow 0.2s, background 0.2s',
        display: 'flex', flexDirection: 'column', gap: '12px',
      }}
      onMouseEnter={e => {
        const el = e.currentTarget
        el.style.transform = 'translateY(-4px)'
        el.style.boxShadow = `0 20px 60px ${glowColor}, 0 0 0 1px ${borderColor}`
        el.style.background = glowColor
      }}
      onMouseLeave={e => {
        const el = e.currentTarget
        el.style.transform = 'translateY(0)'
        el.style.boxShadow = 'none'
        el.style.background = 'rgba(255,255,255,0.04)'
      }}
    >
      <span style={{ fontSize: '11px', fontFamily: 'IBM Plex Mono, monospace', color: accentColor, letterSpacing: '0.15em', textTransform: 'uppercase' }}>
        {subtitle}
      </span>
      <div style={{ fontSize: '48px' }}>{icon}</div>
      <h2 style={{ fontSize: '32px', fontFamily: 'Syne, sans-serif', fontWeight: 800, color: accentColor }}>
        {title}
      </h2>
      <p style={{ fontSize: '14px', fontFamily: 'Syne, sans-serif', color: 'rgba(230,237,243,0.6)', lineHeight: 1.6 }}>
        {desc}
      </p>
      <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', gap: '8px', color: accentColor }}>
        <span style={{ fontSize: '14px', fontFamily: 'IBM Plex Mono, monospace' }}>進入 →</span>
      </div>
    </button>
  )
}
