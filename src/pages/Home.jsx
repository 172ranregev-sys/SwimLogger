import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import NavBar from '../components/NavBar'
import RatingBadge from '../components/RatingBadge'
import { getSessions } from '../api/api'

export default function Home() {
  const [sessions, setSessions] = useState([])
  const navigate = useNavigate()

function formatDate(dateStr) {
  const [year, month, day] = dateStr.split('-');
  const date = new Date(year, month - 1, day);
  const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
  return `${dayName} ${Number(day)}.${Number(month)}.${year}`;
}

// Fetch recent sessions on component mount
  useEffect(() => {
    getSessions().then(data => setSessions(data.slice(0, 5)))
  }, [])

  return (
    <>
      <NavBar />
      <div className="container">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h1 className="fw-bold mb-0">Welcome back 🏊</h1>
            <p className="text-muted">Here are your most recent training sessions.</p>
          </div>
          <button className="btn btn-primary btn-lg" onClick={() => navigate('/sessions/new')}>
            + Log New Session
          </button>
        </div>

        <div className="card p-3">
          <h5 className="mb-3">Recent Sessions</h5>
          <table className="table table-hover align-middle mb-0">
            <thead>
              <tr>
                <th>Date</th>
                <th>Distance (m)</th>
                <th>Difficulty</th>
                <th>Effort</th>
                <th>Preparation</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {sessions.length === 0 ? (
                <tr><td colSpan={6} className="text-center text-muted py-4">No sessions yet. Log your first one!</td></tr>
              ) : (
                sessions.map(s => (
                  <tr key={s.id} style={{ cursor: 'pointer' }} onClick={() => navigate(`/sessions/${s.id}`)}>
                    <td>{formatDate(s.date)}</td>
                    <td>{s.totalDistance}</td>
                    <td><RatingBadge value={s.difficultyRating} /></td>
                    <td><RatingBadge value={s.effortRating} /></td>
                    <td><RatingBadge value={s.preparationRating} /></td>
                    <td><span className="text-primary">View →</span></td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  )
}