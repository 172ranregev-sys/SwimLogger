import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import TrainingHistory from './pages/TrainingHistory'
import SessionDetail from './pages/SessionDetail'
import LogNewSession from './pages/LogNewSession'
import EditSession from './pages/EditSession'
import Progress from './pages/Progress'
import Users from './pages/Users'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/history" element={<TrainingHistory />} />
      <Route path="/sessions/new" element={<LogNewSession />} />
      <Route path="/sessions/:id" element={<SessionDetail />} />
      <Route path="/sessions/:id/edit" element={<EditSession />} />
      <Route path="/progress" element={<Progress />} />
      <Route path="/users" element={<Users />} />
    </Routes>
  )
}