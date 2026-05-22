import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext.jsx';
import { getProducts, deleteProduct } from '../api/products.api.js';
import { Link } from 'react-router-dom';

export default function Products() {
  const { token } = useContext(AuthContext);
  const [products, setProducts] = useState([]);
  const [q, setQ] = useState('');

  useEffect(() => {
    if (!token) return;
    (async () => {
      const rows = await getProducts(token, q);
      setProducts(rows);
    })();
  }, [token]);

  async function onDelete(id) {
    await deleteProduct(token, id);
    setProducts((p) => p.filter((x) => String(x._id) !== String(id)));
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-3xl font-semibold">Products</h1>
          <p className="text-sm text-gray-600">Manage your catalog and AI content</p>
        </div>
      </div>

      <div className="mb-4 flex gap-2">
        <input className="border rounded px-3 py-2 flex-1" placeholder="Search" value={q} onChange={(e) => setQ(e.target.value)} />
        <button className="bg-brand-600 text-white rounded px-4 py-2">Search</button>
        <Link to="/products/new" className="bg-brand-600 text-white rounded px-4 py-2">+ Add</Link>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {products.map((p) => (
          <div key={p._id} className="border rounded-xl p-4 bg-white/70 backdrop-blur">
            <Link to={`/products/${p._id}`} className="font-semibold hover:underline">{p.name}</Link>
            <p className="text-sm text-gray-600 mt-1">${p.price}</p>
            <p className="text-xs text-gray-500 mt-2">Stock: {p.inventory?.stock ?? 0}</p>
            <div className="flex gap-2 mt-3">
              <Link className="text-brand-700 underline text-sm" to={`/products/${p._id}`}>Edit</Link>
              <button className="text-red-600 underline text-sm" onClick={() => onDelete(p._id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>

      {products.length === 0 && <p className="text-gray-600 mt-6">No products yet.</p>}
    </div>
  );
}

