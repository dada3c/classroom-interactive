import { Component, ReactNode } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import GridBackground from './components/ui/GridBackground'
import Landing from './pages/Landing'
import InstructorHome from './pages/instructor/InstructorHome'
import InstructorRoom from './pages/instructor/InstructorRoom'
import InstructorHistory from './pages/instructor/InstructorHistory'
import JoinRoom from './pages/student/JoinRoom'
import StudentRoom from './pages/student/StudentRoom'

class ErrorBoundary extends Component<{ children: ReactNode }, { error: string | null }> {
  state = { error: null }
  static getDerivedStateFromError(e: Error) { return { error: e.message + '\n' + e.stack } }
  componentDidCatch(e: Error) { console.error('React render error:', e) }
  render() {
    if (this.state.error) {
      return (
        <div style={{ padding: '32px', fontFamily: 'IBM Plex Mono, monospace', fontSize: '13px', color: '#ef476f', whiteSpace: 'pre-wrap', background: '#0d1117', minHeight: '100vh' }}>
          <strong>Render Error:</strong>{'\n'}{this.state.error}
        </div>
      )
    }
    return this.props.children
  }
}

export default function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <GridBackground />
        <div style={{ position: 'relative', zIndex: 1, minHeight: '100vh' }}>
          <Routes>
            <Route path="/"                       element={<Landing />} />
            <Route path="/instructor"             element={<InstructorHome />} />
            <Route path="/instructor/history"     element={<InstructorHistory />} />
            <Route path="/instructor/:roomId"     element={<InstructorRoom />} />
            <Route path="/join/:roomId"           element={<JoinRoom />} />
            <Route path="/student/:roomId"        element={<StudentRoom />} />
            <Route path="*"                       element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </BrowserRouter>
    </ErrorBoundary>
  )
}
