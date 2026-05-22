import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5050';

export async function getDashboardSummary(token) {
  const headers = { Authorization: `Bearer ${token}` };

  const [summaryRes, topRes, trendingRes, aiRes, pricingRes] = await Promise.all([
    axios.get(`${API_BASE_URL}/api/dashboard/summary`, { headers }),
    axios.get(`${API_BASE_URL}/api/dashboard/top-products`, { headers }),
    axios.get(`${API_BASE_URL}/api/dashboard/trending`, { headers }),
    axios.get(`${API_BASE_URL}/api/dashboard/ai-suggestions`, { headers }),
    axios.get(`${API_BASE_URL}/api/dashboard/pricing`, { headers }),
  ]);

  return {
    revenue: summaryRes.data.revenue,
    inventory: summaryRes.data.inventory,
    topProducts: topRes.data.top,
    trending: trendingRes.data.insights,
    aiSuggestions: aiRes.data.suggestions,
    pricing: pricingRes.data.recommendations,
  };
}

export async function recordSale(token, { productId, quantity }) {
  const headers = { Authorization: `Bearer ${token}` };
  await axios.post(
    `${API_BASE_URL}/api/dashboard/record-sale`,
    { productId, quantity },
    { headers }
  );
}

