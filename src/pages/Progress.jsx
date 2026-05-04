import { useEffect, useState } from 'react'
import NavBar from '../components/NavBar'
import { getStats } from '../api/api'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  LineChart, Line, CartesianGrid, Legend
} from 'recharts'

export default function Progress() {
  const [stats, setStats] = useState(null)
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')

  function fetchStats() {
    getStats({ dateFrom, dateTo }).then(setStats)
  }

  // Helper functions for formatting chart axes
  function getWeekNumber(dateStr) {
  const date = new Date(dateStr);
  const startOfYear = new Date(date.getFullYear(), 0, 1);
  const diff = date - startOfYear;
  const oneWeek = 1000 * 60 * 60 * 24 * 7;
  return `Week ${Math.ceil((diff / oneWeek) + 1)}`;
  }

  // Format date as "Mon 4.5.26"
  function formatDate(dateStr) {
  const [year, month, day] = dateStr.split('-');
  const date = new Date(year, month - 1, day);
  const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
  return `${dayName} ${Number(day)}.${Number(month)}.${year.slice(2)}`;
  }

  useEffect(() => { fetchStats() }, [])

  // Extract KPIs and chart data from stats
  const kpis = stats?.kpis
  const weeklyDistance = stats?.charts?.weeklyDistance || []
  const effortTrend = stats?.charts?.effortTrend || []

  return (
    <>
      <NavBar />
      <div className="container">
        <h1 className="fw-bold mb-4">Progress</h1>

        {/* Time Range Selector */}
        <div className="card p-3 mb-4">
          <h6 className="mb-3 text-muted text-uppercase" style={{ letterSpacing: '0.5px' }}>Time Range</h6>
          <div className="row g-2 align-items-end">
            <div className="col-md-3">
              <label className="form-label small">From</label>
              <input type="date" className="form-control form-control-sm" value={dateFrom} onChange={e => setDateFrom(e.target.value)} />
            </div>
            <div className="col-md-3">
              <label className="form-label small">To</label>
              <input type="date" className="form-control form-control-sm" value={dateTo} onChange={e => setDateTo(e.target.value)} />
            </div>
            <div className="col-md-2">
              <button className="btn btn-primary btn-sm w-100" onClick={fetchStats}>Apply</button>
            </div>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="row g-3 mb-4">
          <div className="col-md-3">
            <div className="card p-3 kpi-card">
              <div className="kpi-label">Total Distance</div>
              <div className="kpi-value">{kpis?.totalDistance ?? 0} m</div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card p-3 kpi-card" style={{ borderLeftColor: '#198754' }}>
              <div className="kpi-label">Sessions This Week</div>
              <div className="kpi-value" style={{ color: '#198754' }}>{kpis?.sessionsThisWeek ?? 0}</div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card p-3 kpi-card" style={{ borderLeftColor: '#fd7e14' }}>
              <div className="kpi-label">Avg Effort Rating</div>
              <div className="kpi-value" style={{ color: '#fd7e14' }}>{kpis?.avgEffortRating ?? '-'}</div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card p-3 kpi-card" style={{ borderLeftColor: '#6f42c1' }}>
              <div className="kpi-label">Avg Preparation Rating</div>
              <div className="kpi-value" style={{ color: '#6f42c1' }}>{kpis?.avgPreparationRating ?? '-'}</div>
            </div>
          </div>
        </div>

        {/* Charts */}
        <div className="row g-4">
          <div className="col-md-6">
            <div className="card p-4">
              <h6 className="mb-3">Weekly Distance (last 8 weeks)</h6>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={weeklyDistance}>
                  <XAxis dataKey="weekStart" tickFormatter={getWeekNumber} tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Bar dataKey="totalDistance" fill="#0d6efd" radius={[4,4,0,0]} name="Distance (m)" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="col-md-6">
            <div className="card p-4">
              <h6 className="mb-3">Effort Trend (last 30 sessions)</h6>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={effortTrend}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" tickFormatter={formatDate} tick={{ fontSize: 11 }} />
                  <YAxis domain={[1, 10]} tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Line type="linear" dataKey="effortRating" stroke="#fd7e14" strokeWidth={2} dot={{ r: 4 }} name="Effort" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}