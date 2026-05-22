import { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext.jsx';
import { deleteProduct, getProducts } from '../api/products.api.js';
import AppShell from '../components/AppShell.jsx';

function Icon({ children, className = '' }) {
  return <span className={`material-symbols-outlined ${className}`}>{children}</span>;
}

export default function Products() {
  const { token } = useContext(AuthContext);
  const [products, setProducts] = useState([]);
  const [q, setQ] = useState('');
  const [loading, setLoading] = useState(true);

  async function loadProducts(search = q) {
    const rows = await getProducts(token, search);
    setProducts(rows || []);
    setLoading(false);
  }

  useEffect(() => {
    if (!token) return;
    loadProducts('');
  }, [token]);

  async function onDelete(id) {
    await deleteProduct(token, id);
    setProducts((current) => current.filter((product) => String(product._id) !== String(id)));
  }

  const lowStockCount = products.filter((product) => (product.inventory?.stock ?? product.stock ?? 0) <= (product.inventory?.lowStockThreshold ?? 5)).length;

  return (
    <AppShell title="Product Inventory" subtitle="Manage your catalog with AI-assisted stock monitoring and dynamic pricing insights.">
      <div className="flex justify-end">
        <Link to="/products/new" className="flex items-center gap-2 rounded-xl bg-[#d2bbff] px-6 py-3 font-bold text-[#25005a] shadow-lg shadow-[#7c3aed]/20 transition hover:brightness-105">
          <Icon>add</Icon>
          Add New Product
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
        {[
          ['inventory', 'Total SKUs', products.length],
          ['trending_up', 'Active Listings', products.length],
          ['warning', 'Low Stock', lowStockCount],
          ['auto_awesome', 'AI Suggestions', '8 New'],
        ].map(([icon, label, value], index) => (
          <div key={label} className={`rounded-2xl p-6 glass-card ${index === 3 ? 'ai-border' : ''}`}>
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#d2bbff]/10 text-[#d2bbff]">
                <Icon className={index === 3 ? "[font-variation-settings:'FILL'_1]" : ''}>{icon}</Icon>
              </div>
              <div>
                <p className="font-mono text-xs uppercase tracking-wider text-[#ccc3d8]">{label}</p>
                <h4 className="text-2xl font-bold text-[#dae2fd]">{value}</h4>
              </div>
            </div>
          </div>
        ))}
      </div>

      <section className="overflow-hidden rounded-2xl border border-[#4a4455]/20 glass-card">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#4a4455]/20 bg-[#131b2e]/50 p-4">
          <div className="flex min-w-0 flex-1 items-center gap-3">
            <div className="relative w-full max-w-xl">
              <Icon className="absolute left-3 top-1/2 -translate-y-1/2 text-[#958da1]">search</Icon>
              <input
                className="w-full rounded-full border border-[#4a4455]/20 bg-[#222a3d] py-2 pl-10 pr-4 text-[#dae2fd] outline-none focus:border-[#d2bbff]"
                placeholder="Search products..."
                value={q}
                onChange={(e) => setQ(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') loadProducts();
                }}
              />
            </div>
            <button onClick={() => loadProducts()} className="rounded-lg border border-[#4a4455]/30 px-4 py-2 text-[#dae2fd] hover:bg-[#2d3449]/40">Search</button>
          </div>
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-2 rounded-lg border border-[#4a4455]/30 px-4 py-2 text-[#ccc3d8] hover:text-[#dae2fd]"><Icon className="text-sm">filter_list</Icon>Filter</button>
            <button className="flex items-center gap-2 rounded-lg border border-[#4a4455]/30 px-4 py-2 text-[#ccc3d8] hover:text-[#dae2fd]"><Icon className="text-sm">download</Icon>Export</button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[780px] text-left">
            <thead className="bg-[#222a3d]/30 font-mono text-sm text-[#ccc3d8]">
              <tr>
                <th className="px-6 py-4">Product</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Inventory</th>
                <th className="px-6 py-4 text-right">Price</th>
                <th className="px-6 py-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#4a4455]/20">
              {loading && (
                <tr>
                  <td colSpan="6" className="px-6 py-10 text-center text-[#ccc3d8]">Loading products...</td>
                </tr>
              )}
              {!loading && products.map((product) => {
                const stock = product.inventory?.stock ?? product.stock ?? 0;
                const threshold = product.inventory?.lowStockThreshold ?? 5;
                const percent = Math.min(100, Math.round((stock / Math.max(threshold * 4, 1)) * 100));
                const low = stock <= threshold;
                return (
                  <tr key={product._id} className="group transition hover:bg-[#7c3aed]/5">
                    <td className="px-6 py-4">
                      <Link to={`/products/${product._id}`} className="font-bold text-[#dae2fd] transition group-hover:text-[#d2bbff]">{product.name}</Link>
                      <p className="font-mono text-xs text-[#ccc3d8]">SKU-{String(product._id).slice(-6).toUpperCase()}</p>
                    </td>
                    <td className="px-6 py-4"><span className="rounded-full bg-[#2d3449] px-3 py-1 font-mono text-xs text-[#ccc3d8]">{product.category || 'Catalog'}</span></td>
                    <td className="px-6 py-4">
                      <div className={`flex items-center gap-2 ${low ? 'text-[#ffb4ab]' : 'text-[#4cd7f6]'}`}>
                        <span className={`h-2 w-2 rounded-full ${low ? 'bg-[#ffb4ab]' : 'bg-[#4cd7f6]'}`} />
                        <span>{low ? 'Low Stock' : 'Active'}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="w-full max-w-[140px]">
                        <div className="mb-1 flex justify-between font-mono text-[10px] text-[#ccc3d8]">
                          <span>{stock} units</span><span>{percent}%</span>
                        </div>
                        <div className="h-1.5 overflow-hidden rounded-full bg-[#2d3449]">
                          <div className={`h-full ${low ? 'bg-[#ffb4ab]' : 'bg-[#4cd7f6]'}`} style={{ width: `${percent}%` }} />
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right font-mono text-[#dae2fd]">${Number(product.price || 0).toLocaleString()}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <Link className="rounded-lg px-3 py-2 text-sm text-[#d2bbff] hover:bg-[#d2bbff]/10" to={`/products/${product._id}`}>Edit</Link>
                        <button className="rounded-lg px-3 py-2 text-sm text-[#ffb4ab] hover:bg-[#ffb4ab]/10" onClick={() => onDelete(product._id)}>Delete</button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {!loading && products.length === 0 && (
                <tr>
                  <td colSpan="6" className="px-6 py-10 text-center text-[#ccc3d8]">No products yet. Add your first product to start the catalog.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </AppShell>
  );
}
