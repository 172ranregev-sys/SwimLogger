import { useEffect, useState } from 'react'
import NavBar from '../components/NavBar'
import { getUsers, createUser, deleteUser } from '../api/api'

export default function Users() {
  const [users, setUsers] = useState([])
  const [name, setName] = useState('')
  const [role, setRole] = useState('')
  const [error, setError] = useState('')

  function fetchUsers() {
    getUsers().then(setUsers)
  }

  useEffect(() => { fetchUsers() }, [])

  async function handleCreate(e) {
    e.preventDefault()
    if (!name || !role) {
      setError("Please fill in both name and role.")
      return
    }
    setError('')
    const result = await createUser({ name, role })
    if (result.error) {
      setError(result.error)
      return
    }
    setName('')
    setRole('')
    fetchUsers()
  }

  async function handleDelete(id) {
    if (!window.confirm("Are you sure you want to delete this user?")) return
    await deleteUser(id)
    fetchUsers()
  }

  return (
    <>
      <NavBar />
      <div className="container">
        <h1 className="fw-bold mb-4">Users</h1>

        <div className="row g-4">
          {/* User List */}
          <div className="col-md-8">
            <div className="card p-3">
              <h5 className="mb-3">All Users</h5>
              <table className="table table-hover align-middle mb-0">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Role</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {users.length === 0 ? (
                    <tr><td colSpan={4} className="text-center text-muted py-4">No users yet.</td></tr>
                  ) : (
                    users.map(u => (
                      <tr key={u.id}>
                        <td className="text-muted">#{u.id}</td>
                        <td className="fw-semibold">{u.name}</td>
                        <td>
                          <span className={`badge ${u.role === 'Swimmer' ? 'badge-swimmer' : 'badge-coach'}`}>
                            {u.role}
                          </span>
                        </td>
                        <td>
                          <button className="btn btn-outline-danger btn-sm" onClick={() => handleDelete(u.id)}>Delete</button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Create User Form */}
          <div className="col-md-4">
            <div className="card p-4">
              <h5 className="mb-3">Add New User</h5>
              {error && <div className="alert alert-danger py-2">{error}</div>}
              <form onSubmit={handleCreate}>
                <div className="mb-3">
                  <label className="form-label">Name</label>
                  <input type="text" className="form-control" value={name} onChange={e => setName(e.target.value)} placeholder="Full name" />
                </div>
                <div className="mb-3">
                  <label className="form-label">Role</label>
                  <select className="form-select" value={role} onChange={e => setRole(e.target.value)}>
                    <option value="">Select role...</option>
                    <option value="Swimmer">Swimmer</option>
                    <option value="Coach">Coach</option>
                  </select>
                </div>
                <button type="submit" className="btn btn-primary w-100">Add User</button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}