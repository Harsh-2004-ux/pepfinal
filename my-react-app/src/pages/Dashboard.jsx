import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext.jsx';
import { getProducts } from '../api/products.api.js';
import { getDashboardSummary, recordSale } from '../hooks/useDashboard.js';
import RevenueChart from '../components/RevenueChart.jsx';
import TopProducts from '../components/TopProducts.jsx';
import AISuggestions from '../components/AISuggestions.jsx';
import PricingRecommendations from '../components/PricingRecommendations.jsx';
import TrendingInsights from '../components/TrendingInsights.jsx';
import InventoryAlerts from '../components/InventoryAlerts.jsx';
import Navbar from '../components/Navbar.jsx';

export default function Dashboard() {
  const { token } = useContext(AuthContext);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) return;
    (async () => {
      try {
        await getProducts(token);
      } catch {}
      const dash = await getDashboardSummary(token);
      setSummary(dash);
      setLoading(false);
    })();
  }, [token]);

  async function onRecordSale(productId) {
    await recordSale(token, { productId, quantity: 1 });
    const dash = await getDashboardSummary(token);
    setSummary(dash);
  }

  if (loading) return (
    <div>
      <Navbar />
      <div className="p-6">Loading...</div>
    </div>
  );

  return (
    <div>
      <Navbar />
      <div className="p-6 space-y-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-semibold">Dashboard</h1>
            <p className="text-sm text-gray-600">Revenue analytics + AI sales suggestions</p>
          </div>
          <div className="text-right text-sm text-gray-600">
            <p>Quick demo: record a sale to update charts</p>
          </div>
        </div>

        <RevenueChart data={summary?.revenue} />

        <div className="grid lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2">
            <TopProducts top={summary?.topProducts} onRecordSale={onRecordSale} />
          </div>
          <div>
            <InventoryAlerts alerts={summary?.inventory} />
          </div>
        </div>

        <TrendingInsights insights={summary?.trending} />

        <div className="grid lg:grid-cols-2 gap-4">
          <AISuggestions suggestions={summary?.aiSuggestions} />
          <PricingRecommendations recommendations={summary?.pricing} />
        </div>
      </div>
    </div>
  );
}

