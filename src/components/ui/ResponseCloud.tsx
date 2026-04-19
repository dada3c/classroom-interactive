interface ResponseCloudProps {
  responses: { text: string; nickname: string }[]
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

export default function ResponseCloud({ responses }: ResponseCloudProps) {
  if (responses.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '48px 16px' }}>
        <p style={{ fontSize: '13px', fontFamily: 'IBM Plex Mono, monospace', color: 'rgba(230,237,243,0.3)' }}>
          等待學員回應...
        </p>
      </div>
    )
  }

  // Aggregate by text (case-insensitive trim)
  const freqMap = new Map<string, { text: string; count: number; nicknames: string[] }>()
  responses.forEach(r => {
    const key = r.text.trim().toLowerCase()
    if (!key) return
    const existing = freqMap.get(key) || { text: r.text.trim(), count: 0, nicknames: [] }
    existing.count++
    existing.nicknames.push(r.nickname)
    freqMap.set(key, existing)
  })

  const items = Array.from(freqMap.values()).sort((a, b) => b.count - a.count)
  const maxCount = items[0]?.count ?? 1

  return (
    <div style={{
      display: 'flex', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center',
      gap: '6px 14px', padding: '20px', minHeight: '180px',
    }}>
      {items.map((item, i) => {
        const h = hashStr(item.text)
        const weight = item.count / maxCount
        const fontSize = 18 + weight * 34
        const color = CLOUD_COLORS[h % CLOUD_COLORS.length]
        const fadeDelay = i * 0.06
        const floatDelay = (h % 30) / 10

        return (
          <div
            key={item.text}
            title={`${item.count} 人 · ${item.nicknames.slice(0, 5).join('、')}${item.nicknames.length > 5 ? '…' : ''}`}
            style={{ animation: `cloudFadeIn 0.5s ease ${fadeDelay}s forwards`, opacity: 0 }}
          >
            <span
              style={{
                fontSize: `${fontSize}px`,
                fontFamily: 'Syne, sans-serif',
                fontWeight: 600 + Math.round(weight * 2) * 100,
                color,
                textShadow: `0 0 ${fontSize * 0.8}px ${color}40`,
                display: 'inline-block',
                padding: '2px 6px',
                animation: `cloudFloat ${2.5 + (h % 15) / 10}s ease-in-out ${floatDelay}s infinite alternate`,
                position: 'relative',
                cursor: 'default',
                transition: 'transform 0.2s',
              }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.15)' }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)' }}
            >
              {item.text}
              {item.count > 1 && (
                <sup style={{ fontSize: '11px', fontFamily: 'IBM Plex Mono, monospace', color: 'rgba(230,237,243,0.5)', marginLeft: '2px' }}>
                  ×{item.count}
                </sup>
              )}
            </span>
          </div>
        )
      })}
      <style>{`
        @keyframes cloudFadeIn { from { opacity: 0; transform: scale(0.3); } to { opacity: 1; transform: scale(1); } }
        @keyframes cloudFloat { from { transform: translateY(0); } to { transform: translateY(-6px); } }
      `}</style>
    </div>
  )
}
