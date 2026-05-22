import { useContext, useEffect, useMemo, useState } from 'react';
import { AuthContext } from '../context/AuthContext.jsx';
import { getProducts } from '../api/products.api.js';
import { getDashboardSummary, recordSale } from '../hooks/useDashboard.js';
import AppShell from '../components/AppShell.jsx';

const fallbackProducts = [
  { name: 'AeroStrike V1 Sneakers', category: 'Footwear', price: 189, sales: 1204, stock: 82, growth: 24 },
  { name: 'NovaSmart Watch Pro', category: 'Wearables', price: 349, sales: 942, stock: 9, growth: 12 },
  { name: 'Zenith Wireless Audio', category: 'Audio', price: 299, sales: 855, stock: 44, growth: -5 },
];

function Icon({ children, className = '' }) {
  return <span className={`material-symbols-outlined ${className}`}>{children}</span>;
}

function KpiCard({ icon, label, value, trend, tone = '#d2bbff' }) {
  const isNegative = String(trend).startsWith('-');
  return (
    <div className="rounded-2xl p-6 transition hover:border-[#d2bbff]/45 glass-panel">
      <div className="mb-4 flex items-start justify-between">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl" style={{ backgroundColor: `${tone}18`, color: tone }}>
          <Icon>{icon}</Icon>
        </div>
        {trend && (
          <span className={`flex items-center gap-1 font-mono text-xs ${isNegative ? 'text-red-300' : 'text-green-300'}`}>
            {trend} <Icon className="text-sm">{isNegative ? 'trending_down' : 'trending_up'}</Icon>
          </span>
        )}
      </div>
      <p className="mb-1 font-mono text-xs uppercase tracking-wider text-[#ccc3d8]">{label}</p>
      <h3 className="text-2xl font-bold text-[#dae2fd]">{value}</h3>
    </div>
  );
}

export default function Dashboard() {
  const { token } = useContext(AuthContext);
  const [summary, setSummary] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) return;
    (async () => {
      try {
        const rows = await getProducts(token);
        setProducts(rows || []);
        const dash = await getDashboardSummary(token);
        setSummary(dash);
      } finally {
        setLoading(false);
      }
    })();
  }, [token]);

  const productRows = useMemo(() => {
    if (!products.length) return fallbackProducts;
    return products.slice(0, 5).map((product, index) => ({
      id: product._id,
      name: product.name,
      category: product.category || 'Catalog',
      price: product.price || 0,
      sales: summary?.topProducts?.[index]?.quantity || summary?.topProducts?.[index]?.sales || 0,
      stock: product.inventory?.stock ?? product.stock ?? 0,
      growth: index === 2 ? -5 : 8 + index * 4,
    }));
  }, [products, summary]);

  async function onRecordSale(productId) {
    if (!productId) return;
    await recordSale(token, { productId, quantity: 1 });
    const dash = await getDashboardSummary(token);
    setSummary(dash);
  }

  const totalRevenue = summary?.totalRevenue ?? summary?.revenue?.reduce?.((sum, row) => sum + (row.total || row.revenue || 0), 0) ?? 124592;
  const totalOrders = summary?.totalOrders ?? summary?.salesCount ?? 3842;
  const lowStock = products.filter((product) => (product.inventory?.stock ?? product.stock ?? 0) <= (product.inventory?.lowStockThreshold ?? 5)).length;

  if (loading) {
    return (
      <AppShell>
        <div className="rounded-2xl p-8 text-[#ccc3d8] glass-panel">Loading SmartStore dashboard...</div>
      </AppShell>
    );
  }

  return (
    <AppShell title="Dashboard Overview" subtitle="Revenue analytics, stock health, and AI recommendations in one operating view.">
      <section className="relative overflow-hidden rounded-2xl p-6 ai-border">
        <div className="relative z-10 flex flex-col items-center gap-6 md:flex-row">
          <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-2xl bg-[#d2bbff]/20 text-[#d2bbff]">
            <Icon className="text-4xl [font-variation-settings:'FILL'_1]">psychology</Icon>
          </div>
          <div className="flex-1 text-center md:text-left">
            <span className="inline-flex items-center gap-1 rounded-full bg-[#4cd7f6]/10 px-2 py-1 font-mono text-xs uppercase tracking-wider text-[#4cd7f6]">
              <Icon className="text-sm">auto_awesome</Icon> High Priority Insight
            </span>
            <h3 className="mt-3 text-2xl font-semibold text-[#d2bbff]">Inventory Optimization Opportunity</h3>
            <p className="mt-2 max-w-3xl text-[#ccc3d8]">
              AI analysis suggests shifting promotion budget toward products with strong sales velocity and low stock risk.
            </p>
          </div>
          <button className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#7c3aed] px-6 py-3 font-bold text-white transition hover:brightness-110 md:w-auto">
            Apply Strategy <Icon>arrow_forward</Icon>
          </button>
        </div>
      </section>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard icon="payments" label="Total Revenue" value={`$${Number(totalRevenue).toLocaleString()}`} trend="+12.5%" />
        <KpiCard icon="shopping_bag" label="Total Orders" value={Number(totalOrders).toLocaleString()} trend="+8.2%" tone="#4cd7f6" />
        <KpiCard icon="inventory" label="Total Products" value={products.length || 124} trend="Active SKU" tone="#adc6ff" />
        <KpiCard icon="warning" label="Low Stock Alerts" value={lowStock || 3} trend="-0.4%" tone="#ffb4ab" />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <section className="rounded-2xl p-6 lg:col-span-2 glass-panel">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h3 className="text-2xl font-semibold text-[#dae2fd]">Revenue Analytics</h3>
              <p className="text-sm text-[#ccc3d8]">Daily performance across all channels</p>
            </div>
            <div className="flex gap-2">
              <button className="rounded-full bg-[#d2bbff]/10 px-3 py-1 text-sm text-[#d2bbff]">Revenue</button>
              <button className="rounded-full px-3 py-1 text-sm text-[#ccc3d8]">Orders</button>
            </div>
          </div>
          <div className="relative flex h-[350px] items-end justify-between gap-2 pb-8">
            {[65, 45, 85, 75, 95, 60, 50, 80, 40, 70].map((height, index) => (
              <div key={height + index} className={`flex-1 rounded-t-lg ${index === 4 ? 'bg-gradient-to-t from-[#4cd7f6]/45 to-[#4cd7f6]/5 shadow-[0_-10px_20px_rgba(76,215,246,0.1)]' : 'bg-gradient-to-t from-[#d2bbff]/40 to-[#d2bbff]/5'}`} style={{ height: `${height}%` }} />
            ))}
            <div className="absolute bottom-0 left-0 right-0 flex justify-between font-mono text-[10px] text-[#ccc3d8]">
              <span>01 May</span><span>07 May</span><span>14 May</span><span>21 May</span><span>28 May</span>
            </div>
          </div>
        </section>

        <section className="flex h-[510px] flex-col rounded-2xl p-6 glass-panel">
          <div className="mb-6 flex items-center justify-between">
            <h3 className="text-2xl font-semibold text-[#dae2fd]">Recent Activity</h3>
            <button className="font-semibold text-[#d2bbff]">View All</button>
          </div>
          <div className="custom-scrollbar flex-1 space-y-6 overflow-y-auto pr-2">
            {[
              ['shopping_cart', 'New order placed', '2 minutes ago - $249.00', '#4cd7f6'],
              ['auto_awesome', 'AI prediction updated for Sneakers', '45 minutes ago', '#d2bbff'],
              ['warning', 'Low stock alert needs review', '1 hour ago', '#ffb4ab'],
              ['person_add', 'New customer registered', '3 hours ago', '#86efac'],
              ['refresh', 'System sync completed', '5 hours ago', '#ccc3d8'],
            ].map(([icon, text, time, color]) => (
              <div key={text} className="flex gap-4">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full" style={{ backgroundColor: `${color}18`, color }}>
                  <Icon className="text-sm">{icon}</Icon>
                </div>
                <div>
                  <p className="text-sm text-[#dae2fd]">{text}</p>
                  <p className="font-mono text-xs text-[#ccc3d8]">{time}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      <section className="overflow-hidden rounded-2xl glass-panel">
        <div className="flex items-center justify-between border-b border-[#4a4455]/20 p-6">
          <h3 className="text-2xl font-semibold text-[#dae2fd]">Top Selling Products</h3>
          <button className="flex h-9 w-9 items-center justify-center rounded-lg text-[#ccc3d8] hover:bg-[#2d3449]/50"><Icon>filter_list</Icon></button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-left">
            <thead className="bg-[#222a3d]/50 font-mono text-sm text-[#ccc3d8]">
              <tr>
                <th className="px-6 py-4">Product Details</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Price</th>
                <th className="px-6 py-4">Sales</th>
                <th className="px-6 py-4">Growth</th>
                <th className="px-6 py-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#4a4455]/20">
              {productRows.map((product) => (
                <tr key={product.id || product.name} className="transition hover:bg-[#2d3449]/20">
                  <td className="px-6 py-4">
                    <p className="font-semibold text-[#dae2fd]">{product.name}</p>
                    <p className="font-mono text-xs text-[#ccc3d8]">{product.category}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`rounded-full border px-2 py-1 font-mono text-[10px] ${product.stock <= 10 ? 'border-[#ffb4ab]/30 bg-[#ffb4ab]/10 text-[#ffb4ab]' : 'border-green-400/30 bg-green-400/10 text-green-300'}`}>
                      {product.stock <= 10 ? 'LOW STOCK' : 'IN STOCK'}
                    </span>
                  </td>
                  <td className="px-6 py-4">${Number(product.price).toLocaleString()}</td>
                  <td className="px-6 py-4">{Number(product.sales || 0).toLocaleString()}</td>
                  <td className={`px-6 py-4 ${product.growth < 0 ? 'text-red-300' : 'text-green-300'}`}>{product.growth}%</td>
                  <td className="px-6 py-4 text-right">
                    <button onClick={() => onRecordSale(product.id)} className="rounded-lg px-3 py-2 text-sm text-[#d2bbff] hover:bg-[#d2bbff]/10">Record sale</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </AppShell>
  );
}
