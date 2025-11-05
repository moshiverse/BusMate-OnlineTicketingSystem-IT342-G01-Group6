const API = 'http://localhost:8080'; // change to your backend base URL if different

export async function loginUser(email, password) {
  const res = await fetch(`${API}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  if (res.ok) return (await res.json()).token;
  return null;
}
export async function signupUser(email, password) {
  const res = await fetch(`${API}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  return res.ok;
}
export async function fetchProfile(token) {
  const res = await fetch(`${API}/users/me`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  if (res.ok) return await res.json();
  return null;
}
export async function getBookings(token) {
  const res = await fetch(`${API}/bookings`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  if (res.ok) return await res.json();
  return [];
}
export async function getBuses(token) {
  const res = await fetch(`${API}/buses`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  if (res.ok) return await res.json();
  return [];
}
export async function getSchedules(token) {
  const res = await fetch(`${API}/schedules`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  if (res.ok) return await res.json();
  return [];
}
export async function getPayments(token) {
  const res = await fetch(`${API}/payments`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  if (res.ok) return await res.json();
  return [];
}
export async function getRoutes(token) {
  const res = await fetch(`${API}/routes`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  if (res.ok) return await res.json();
  return [];
}
export async function getSeats(token) {
  const res = await fetch(`${API}/seats`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  if (res.ok) return await res.json();
  return [];
}
