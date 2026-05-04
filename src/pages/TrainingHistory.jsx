import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import NavBar from '../components/NavBar'
import RatingBadge from '../components/RatingBadge'
import { getSessions } from '../api/api'

const emptyFilters = {
  dateFrom: '', dateTo: '', minDistance: '', maxDistance: '',
  minDifficulty: '', maxDifficulty: '', minEffort: '', maxEffort: ''
}

export default function TrainingHistory() {
  const [sessions, setSessions] = useState([])
  const [filters, setFilters] = useState(emptyFilters)
  const [applied, setApplied] = useState(emptyFilters)
  const navigate = useNavigate()

  useEffect(() => {
    getSessions(applied).then(setSessions)
  }, [applied])

  function handleChange(e) {
    setFilters({ ...filters, [e.target.name]: e.target.value })
  }

  function handleApply() {
    setApplied(filters)
  }

  function handleReset() {
    setFilters(emptyFilters)
    setApplied(emptyFilters)
  }

  function formatDate(dateStr) {
    const [year, month, day] = dateStr.split('-');
    const date = new Date(year, month - 1, day);
    const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
    return `${dayName} ${Number(day)}.${Number(month)}.${year}`;
  }

  return (
    <>
      <NavBar />
      <div className="container">
        <h1 className="fw-bold mb-4">Training History</h1>

        {/* Filter Panel */}
        <div className="card p-3 mb-4">
          <h6 className="mb-3 text-muted text-uppercase" style={{ letterSpacing: '0.5px' }}>Filters</h6>
          <div className="row g-2">
            <div className="col-md-3">
              <label className="form-label small">Date From</label>
              <input type="date" className="form-control form-control-sm" name="dateFrom" value={filters.dateFrom} onChange={handleChange} />
            </div>
            <div className="col-md-3">
              <label className="form-label small">Date To</label>
              <input type="date" className="form-control form-control-sm" name="dateTo" value={filters.dateTo} onChange={handleChange} />
            </div>
            <div className="col-md-3">
              <label className="form-label small">Min Distance (m)</label>
              <input type="number" className="form-control form-control-sm" name="minDistance" value={filters.minDistance} onChange={handleChange} />
            </div>
            <div className="col-md-3">
              <label className="form-label small">Max Distance (m)</label>
              <input type="number" className="form-control form-control-sm" name="maxDistance" value={filters.maxDistance} onChange={handleChange} />
            </div>
            <div className="col-md-3">
              <label className="form-label small">Min Difficulty</label>
              <input type="number" className="form-control form-control-sm" name="minDifficulty" value={filters.minDifficulty} onChange={handleChange} min="1" max="10" />
            </div>
            <div className="col-md-3">
              <label className="form-label small">Max Difficulty</label>
              <input type="number" className="form-control form-control-sm" name="maxDifficulty" value={filters.maxDifficulty} onChange={handleChange} min="1" max="10" />
            </div>
            <div className="col-md-3">
              <label className="form-label small">Min Effort</label>
              <input type="number" className="form-control form-control-sm" name="minEffort" value={filters.minEffort} onChange={handleChange} min="1" max="10" />
            </div>
            <div className="col-md-3">
              <label className="form-label small">Max Effort</label>
              <input type="number" className="form-control form-control-sm" name="maxEffort" value={filters.maxEffort} onChange={handleChange} min="1" max="10" />
            </div>
            <div className="col-12 d-flex gap-2 mt-1">
              <button className="btn btn-primary btn-sm" onClick={handleApply}>Apply Filters</button>
              <button className="btn btn-outline-secondary btn-sm" onClick={handleReset}>Reset</button>
            </div>
          </div>
        </div>

        {/* Session List */}
        <div className="card p-3">
          <table className="table table-hover align-middle mb-0">
            <thead>
              <tr>
                <th>Date</th>
                <th>Distance (m)</th>
                <th>Main Set</th>
                <th>Difficulty</th>
                <th>Effort</th>
                <th>Preparation</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {sessions.length === 0 ? (
                <tr><td colSpan={7} className="text-center text-muted py-4">No sessions found.</td></tr>
              ) : (
                sessions.map(s => (
                  <tr key={s.id} style={{ cursor: 'pointer' }} onClick={() => navigate(`/sessions/${s.id}`)}>
                    <td>{formatDate(s.date)}</td>
                    <td>{s.totalDistance}</td>
                    <td className="text-truncate" style={{ maxWidth: 200 }}>{s.mainSet || '-'}</td>
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