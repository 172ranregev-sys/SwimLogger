import { useState } from 'react'

// A form component for adding or editing swim sessions
const REQUIRED = ['date', 'totalDistance', 'difficultyRating', 'effortRating', 'preparationRating']

const EMPTY = {
  date: new Date().toISOString().slice(0, 10),
  warmup: '', mainSet: '', recovery: '',
  totalDistance: '', difficultyRating: '', effortRating: '',
  preparationRating: '', notes: ''
}

export default function SessionForm({ initial = EMPTY, onSubmit, submitLabel = 'Save Session' }) {
  const [form, setForm] = useState(initial)
  const [error, setError] = useState('')

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  function handleSubmit(e) {
    e.preventDefault()
    // Validate required fields
    const missing = REQUIRED.filter(k => form[k] === '' || form[k] === undefined)
    if (missing.length > 0) {
      setError(`Please fill in all required fields: ${missing.join(', ')}`)
      return
    }
    setError('')
    onSubmit(form)
  }

  // Render the form with Bootstrap styling
  return (
    <form onSubmit={handleSubmit}>
      {error && <div className="alert alert-danger">{error}</div>}

      <div className="row g-3">
        <div className="col-md-6">
          <label className="form-label">Date *</label>
          <input type="date" className="form-control" name="date" value={form.date} onChange={handleChange} />
        </div>
        <div className="col-md-6">
          <label className="form-label">Total Distance (m) *</label>
          <input type="number" className="form-control" name="totalDistance" value={form.totalDistance} onChange={handleChange} min="0" />
        </div>
        <div className="col-12">
          <label className="form-label">Warm Up</label>
          <textarea className="form-control" name="warmup" value={form.warmup} onChange={handleChange} rows={2} />
        </div>
        <div className="col-12">
          <label className="form-label">Main Set</label>
          <textarea className="form-control" name="mainSet" value={form.mainSet} onChange={handleChange} rows={2} />
        </div>
        <div className="col-12">
          <label className="form-label">Recovery</label>
          <textarea className="form-control" name="recovery" value={form.recovery} onChange={handleChange} rows={2} />
        </div>
        <div className="col-md-4">
          <label className="form-label">Difficulty Rating (1-10) *</label>
          <input type="number" className="form-control" name="difficultyRating" value={form.difficultyRating} onChange={handleChange} min="1" max="10" />
        </div>
        <div className="col-md-4">
          <label className="form-label">Effort Rating (1-10) *</label>
          <input type="number" className="form-control" name="effortRating" value={form.effortRating} onChange={handleChange} min="1" max="10" />
        </div>
        <div className="col-md-4">
          <label className="form-label">Preparation Rating (1-10) *</label>
          <input type="number" className="form-control" name="preparationRating" value={form.preparationRating} onChange={handleChange} min="1" max="10" />
        </div>
        <div className="col-12">
          <label className="form-label">Notes</label>
          <textarea className="form-control" name="notes" value={form.notes} onChange={handleChange} rows={2} />
        </div>
        <div className="col-12">
          <button type="submit" className="btn btn-primary">{submitLabel}</button>
        </div>
      </div>
    </form>
  )
}