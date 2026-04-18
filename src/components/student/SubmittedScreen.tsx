interface SubmittedScreenProps {
  answer: string
}

export default function SubmittedScreen({ answer }: SubmittedScreenProps) {
  const isO = answer === 'O'
  const color = isO ? '#06d6a0' : '#ef476f'

  return (
    <div style={{ textAlign: 'center', padding: '48px 24px', animation: 'fadeUp 0.4s ease forwards' }}>
      <div style={{
        width: '100px', height: '100px', borderRadius: '50%',
        background: `${color}18`, border: `3px solid ${color}60`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        margin: '0 auto 24px', fontSize: '48px',
        boxShadow: `0 0 40px ${color}30`,
      }}>
        {isO ? '○' : '✕'}
      </div>

      <h2 style={{ fontSize: '24px', fontFamily: 'Syne, sans-serif', fontWeight: 800, marginBottom: '8px' }}>
        已送出答案！
      </h2>
      <p style={{ fontSize: '15px', color: 'rgba(230,237,243,0.5)', fontFamily: 'Syne, sans-serif', marginBottom: '32px' }}>
        你選擇了 <span style={{ color, fontWeight: 700 }}>{isO ? '○' : '✕'}</span>
      </p>

      <div style={{
        padding: '20px', borderRadius: '12px',
        background: 'rgba(255,209,102,0.08)', border: '1px solid rgba(255,209,102,0.2)',
      }}>
        <p style={{ fontSize: '14px', fontFamily: 'Syne, sans-serif', color: '#ffd166' }}>
          等待老師公佈答案...
        </p>
      </div>
    </div>
  )
}
