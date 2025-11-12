import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth API
export const authAPI = {
  signup: (data) => api.post('/auth/signup', data),
  login: (data) => api.post('/auth/login', data),
  getMe: () => api.get('/auth/me'),
  getAllUsers: () => api.get('/auth/users'),
  createAdmin: (data) => api.post('/auth/create-admin', data),
  updateRole: (id, role) => api.patch(`/auth/update-role/${id}?role=${role}`),
  transferSuperAdmin: (toUserId) => api.post(`/auth/transfer-super-admin/${toUserId}`),
  updateProfile: (data) => api.patch('/auth/me', data),
  deleteAccount: () => api.delete('/auth/me'),
};

// Routes API
export const routesAPI = {
  getAll: () => api.get('/routes'),
  create: (data) => api.post('/routes', data)
};

// Bus API
export const busAPI = {
  getAll: () => api.get('/buses'),
  create: (data) => api.post('/buses', data)
};

// Bus Types API
export const busTypeAPI = {
  getAll: () => api.get('/bus-types'),
  create: (data) => api.post('/bus-types', data)
};

// Schedule API
export const scheduleAPI = {
  getAll: () => api.get('/schedules'),
  create: (data) => api.post('/schedules', data),
  getSeats: (id) => api.get(`/schedules/${id}/seats`)
};

// Seat API
export const seatAPI = {
  generate: (scheduleId, rows, cols) => 
    api.post(`/seats/generate/${scheduleId}?rows=${rows}&cols=${cols}`),
  getBySchedule: (scheduleId) => api.get(`/seats/schedule/${scheduleId}`)
};

// Booking API
export const bookingAPI = {
  create: (data) => api.post('/bookings', data),
  confirm: (id, data) => api.post(`/bookings/${id}/confirm`, data)
};

// Payment API
export const paymentAPI = {
  create: (data) => api.post('/payments', data)
};

export default api;
