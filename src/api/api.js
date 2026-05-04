const BASE = '/api'

// -- Sessions ----------------------------------
export async function getSessions(filters = {}) {
  const params = new URLSearchParams()
  Object.entries(filters).forEach(([k, v]) => { if (v !== '' && v !== undefined) params.append(k, v) })
  const res = await fetch(`${BASE}/sessions?${params}`)
  return res.json()
}

export async function getSession(id) {
  const res = await fetch(`${BASE}/sessions/${id}`)
  return res.json()
}

export async function createSession(data) {
  const res = await fetch(`${BASE}/sessions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  })
  return res.json()
}

export async function updateSession(id, data) {
  const res = await fetch(`${BASE}/sessions/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  })
  return res.json()
}

export async function deleteSession(id) {
  const res = await fetch(`${BASE}/sessions/${id}`, { method: 'DELETE' })
  return res.json()
}

export async function getStats(filters = {}) {
  const params = new URLSearchParams()
  Object.entries(filters).forEach(([k, v]) => { if (v !== '') params.append(k, v) })
  const res = await fetch(`${BASE}/sessions/stats?${params}`)
  return res.json()
}

// --- Users ----------------------------------
export async function getUsers() {
  const res = await fetch(`${BASE}/users`)
  return res.json()
}

export async function createUser(data) {
  const res = await fetch(`${BASE}/users`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  })
  return res.json()
}

export async function deleteUser(id) {
  const res = await fetch(`${BASE}/users/${id}`, { method: 'DELETE' })
  return res.json()
}