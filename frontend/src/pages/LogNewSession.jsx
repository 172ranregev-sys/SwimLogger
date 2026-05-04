import { useNavigate } from 'react-router-dom'
import NavBar from '../components/NavBar'
import SessionForm from '../components/SessionForm'
import { createSession } from '../api/api'

export default function LogNewSession() {
  const navigate = useNavigate()

  async function handleSubmit(form) {
    const result = await createSession(form)
    if (result.id) {
      navigate(`/sessions/${result.id}`)
    }
  }

  return (
    <>
      <NavBar />
      <div className="container">
        <button className="btn btn-link p-0 text-muted mb-2" onClick={() => navigate('/')}>← Back to Home</button>
        <h1 className="fw-bold mb-4">Log New Session</h1>
        <div className="card p-4">
          <SessionForm onSubmit={handleSubmit} submitLabel="Save Session" />
        </div>
      </div>
    </>
  )
}