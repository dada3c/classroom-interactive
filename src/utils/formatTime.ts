import { Timestamp } from 'firebase/firestore'

export function formatTimestamp(ts: Timestamp): string {
  return ts.toDate().toLocaleString('zh-TW', {
    year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit',
  })
}
