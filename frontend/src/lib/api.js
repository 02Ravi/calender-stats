import axios from 'axios';

const isProd = typeof window !== 'undefined' && window.location.hostname.endsWith('vercel.app');
const API = axios.create({
  baseURL: isProd ? '' : (import.meta.env.VITE_BACKEND_URL || 'http://localhost:5001'),
  withCredentials: true,
});

export function getAuthUrl() {
  return `${API.defaults.baseURL}/auth/google`;
}

export async function fetchMe() {
  const { data } = await API.get('/api/me');
  return data;
}

export async function fetchStats(days = 30) {
  const { data } = await API.get('/api/stats', { params: { days } });
  return data;
}

export async function logout() {
  await API.post('/auth/logout');
}

export default API;

