import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5050';

export async function signup({ name, email, password }) {
  const res = await axios.post(`${API_BASE_URL}/api/auth/signup`, { name, email, password });
  return res.data;
}

export async function login({ email, password }) {
  const res = await axios.post(`${API_BASE_URL}/api/auth/login`, { email, password });
  return res.data;
}

