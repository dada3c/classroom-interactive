import { QRCode } from 'react-qr-code'

interface QRDisplayProps {
  roomId: string
}

export default function QRDisplay({ roomId }: QRDisplayProps) {
  const baseUrl = window.location.href.split('#')[0].replace(/\/$/, '')
  const url = `${baseUrl}/#/join/${roomId}`

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="bg-white p-4 rounded-2xl shadow-lg">
        <QRCode value={url} size={200} bgColor="#ffffff" fgColor="#0d1117" level="H" />
      </div>
      <p className="text-xs font-mono text-center break-all" style={{ color: 'rgba(230,237,243,0.5)', fontFamily: 'IBM Plex Mono, monospace' }}>
        {url}
      </p>
    </div>
  )
}
