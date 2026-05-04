import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import NavBar from '../components/NavBar'
import RatingBadge from '../components/RatingBadge'
import { getSession, deleteSession } from '../api/api'

// Displays details of a single session, with options to edit or delete it.
export default function SessionDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [session, setSession] = useState(null)

  function formatDate(dateStr) {
    const [year, month, day] = dateStr.split('-');
    const date = new Date(year, month - 1, day);
    const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
    return `${dayName} ${Number(day)}.${Number(month)}.${year}`;
  }

  useEffect(() => {
    getSession(id).then(setSession)
  }, [id])

  // Confirmation prompt before deleting a session, then redirects to history page.
  async function handleDelete() {
    if (!window.confirm('Are you sure you want to delete this session?')) return
    await deleteSession(id)
    navigate('/history')
  }

  // Show loading state while fetching session data so user doesn't see a blank page.
  // NavBar is included for consistent layout.
  if (!session) return <><NavBar /><div className="container">Loading...</div></>

  return (
    <>
      <NavBar />
      <div className="container">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <button className="btn btn-link p-0 text-muted mb-1" onClick={() => navigate('/history')}>← Back to History</button>
            <h1 className="fw-bold mb-0">Session - {formatDate(session.date)}</h1>
          </div>
          <div className="d-flex gap-2">
            <button className="btn btn-outline-primary" onClick={() => navigate(`/sessions/${id}/edit`)}>Edit</button>
            <button className="btn btn-outline-danger" onClick={handleDelete}>Delete</button>
          </div>
        </div>

        <div className="row g-4">
          <div className="col-md-8">
            <div className="card p-4">
              <h5 className="mb-3">Session Details</h5>
              {session.warmup && (
                <div className="mb-3">
                  <div style={{ textDecoration: 'underline' }} className="text-muted small text-uppercase mb-1">Warm Up</div>
                  <div style={{ whiteSpace: 'pre-wrap' }}>{session.warmup}</div>
                </div>
              )}
              {session.mainSet && (
                <div className="mb-3">
                  <div style={{ textDecoration: 'underline' }} className="text-muted small text-uppercase mb-1">Main Set</div>
                  <div style={{ whiteSpace: 'pre-wrap' }}>{session.mainSet}</div>
                </div>
              )}
              {session.recovery && (
                <div className="mb-3">
                  <div style={{ textDecoration: 'underline' }} className="text-muted small text-uppercase mb-1">Recovery</div>
                  <div style={{ whiteSpace: 'pre-wrap' }}>{session.recovery}</div>
                </div>
              )}
              {session.notes && (
                <div className="mb-3">
                  <div style={{ textDecoration: 'underline' }} className="text-muted small text-uppercase mb-1">Notes</div>
                  <div style={{ whiteSpace: 'pre-wrap' }}>{session.notes}</div>
                </div>
              )}
              {!session.warmup && !session.mainSet && !session.recovery && !session.notes && (
                <p className="text-muted">No details recorded.</p>
              )}
            </div>
          </div>

          <div className="col-md-4">
            <div className="card p-4 mb-3">
              <div className="text-muted small text-uppercase mb-1">Total Distance</div>
              <div className="fs-3 fw-bold text-primary">{session.totalDistance} m</div>
            </div>
            <div className="card p-4">
              <h6 className="mb-3">Ratings</h6>
              <div className="d-flex justify-content-between align-items-center mb-2">
                <span className="text-muted small">Difficulty</span>
                <RatingBadge value={session.difficultyRating} />
              </div>
              <div className="d-flex justify-content-between align-items-center mb-2">
                <span className="text-muted small">Effort</span>
                <RatingBadge value={session.effortRating} />
              </div>
              <div className="d-flex justify-content-between align-items-center">
                <span className="text-muted small">Preparation</span>
                <RatingBadge value={session.preparationRating} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}