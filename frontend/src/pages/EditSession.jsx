import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import NavBar from '../components/NavBar'
import SessionForm from '../components/SessionForm'
import { getSession, updateSession } from '../api/api'

export default function EditSession() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [initial, setInitial] = useState(null)

  useEffect(() => {
    getSession(id).then(data => {
      // Convert numbers to strings for form inputs because html inputs always returm strings
      setInitial({
        date: data.date,
        warmup: data.warmup || '',
        mainSet: data.mainSet || '',
        recovery: data.recovery || '',
        totalDistance: String(data.totalDistance),
        difficultyRating: String(data.difficultyRating),
        effortRating: String(data.effortRating),
        preparationRating: String(data.preparationRating),
        notes: data.notes || '',
      })
    })
  }, [id])

  async function handleSubmit(form) {
    const result = await updateSession(id, form)
    if (result.id) {
      navigate(`/sessions/${id}`)
    }
  }

  // I found this one on the internet.
  // It is used to show a loading state while the data is being fetched so that the form doesn't flash with empty values before the data is loaded.
  if (!initial) return <><NavBar /><div className="container">Loading...</div></>

  return (
    <>
      <NavBar />
      <div className="container">
        <button className="btn btn-link p-0 text-muted mb-2" onClick={() => navigate(`/sessions/${id}`)}>← Back to Session</button>
        <h1 className="fw-bold mb-4">Edit Session</h1>
        <div className="card p-4">
          <SessionForm initial={initial} onSubmit={handleSubmit} submitLabel="Save Changes" />
        </div>
      </div>
    </>
  )
}