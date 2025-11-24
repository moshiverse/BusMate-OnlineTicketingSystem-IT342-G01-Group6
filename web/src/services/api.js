const API_BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:8080/api'

async function handleResponse(response) {
  if (!response.ok) {
    const message = await response.text()
    throw new Error(message || 'Request failed')
  }
  if (response.status === 204) return null
  return response.json()
}

export const api = {
  login(payload) {
    return fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    }).then(handleResponse)
  },
  register(payload) {
    return fetch(`${API_BASE}/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    }).then(handleResponse)
  },
  fetchDashboard() {
    return fetch(`${API_BASE}/dashboard`).then(handleResponse)
  },
  fetchRoutes() {
    return fetch(`${API_BASE}/routes`).then(handleResponse)
  },
  fetchTrips(params = {}) {
    const query = new URLSearchParams(params).toString()
    const suffix = query ? `?${query}` : ''
    return fetch(`${API_BASE}/trips${suffix}`).then(handleResponse)
  },
}