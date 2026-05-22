import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

function authHeaders(token) {
  return { Authorization: `Bearer ${token}` };
}

export async function getProducts(token, q) {
  const res = await axios.get(`${API_BASE_URL}/api/products`, {
    headers: authHeaders(token),
    params: q ? { q } : {},
  });
  return res.data.products;
}

export async function createProduct(token, payload) {
  const res = await axios.post(`${API_BASE_URL}/api/products`, payload, {
    headers: authHeaders(token),
  });
  return res.data.product;
}

export async function updateProduct(token, id, payload) {
  const res = await axios.put(`${API_BASE_URL}/api/products/${id}`, payload, {
    headers: authHeaders(token),
  });
  return res.data.product;
}

export async function deleteProduct(token, id) {
  const res = await axios.delete(`${API_BASE_URL}/api/products/${id}`, {
    headers: authHeaders(token),
  });
  return res.data;
}

export async function getProductById(token, id) {
  const res = await axios.get(`${API_BASE_URL}/api/products/${id}`, {
    headers: authHeaders(token),
  });
  return res.data.product;
}

export async function generateAIForProduct(token, { productId, product }) {
  const res = await axios.post(
    `${API_BASE_URL}/api/ai/generate`,
    { productId, product },
    { headers: authHeaders(token) }
  );
  return res.data;
}

