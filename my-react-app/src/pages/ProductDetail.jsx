import { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext.jsx';
import { createProduct, generateAIForProduct, getProductById, updateProduct } from '../api/products.api.js';

export default function ProductDetail() {
  const { token } = useContext(AuthContext);
  const { id } = useParams();
  const nav = useNavigate();

  const [product, setProduct] = useState(null);
  const [form, setForm] = useState({
    name: '',
    description: '',
    features: [],
    seoTags: [],
    marketingCaption: '',
    price: 0,
    category: '',
    stock: 0,
    lowStockThreshold: 5,
  });

  useEffect(() => {
    if (!token) return;
    if (!id) return;
    (async () => {
      const p = await getProductById(token, id);
      setProduct(p);
      setForm({
        name: p.name || '',
        description: p.description || '',
        features: p.features || [],
        seoTags: p.seoTags || [],
        marketingCaption: p.marketingCaption || '',
        price: p.price ?? 0,
        category: p.category || '',
        stock: p.inventory?.stock ?? 0,
        lowStockThreshold: p.inventory?.lowStockThreshold ?? 5,
      });
    })();
  }, [token, id]);

  async function onSave() {
    const payload = {
      name: form.name,
      description: form.description,
      features: form.features,
      seoTags: form.seoTags,
      marketingCaption: form.marketingCaption,
      price: Number(form.price),
      category: form.category,
      stock: Number(form.stock),
      lowStockThreshold: Number(form.lowStockThreshold),
    };

    if (!id) {
      await createProduct(token, payload);
    } else {
      await updateProduct(token, id, payload);
    }
    nav('/products');
  }

  async function onGenerateAI() {
    if (!token) return;
    const data = await generateAIForProduct(token, { productId: id, product: { name: form.name, category: form.category, price: form.price } });
    const gen = data.generated || data;
    setForm((f) => ({ ...f, description: gen.description, seoTags: gen.seoTags || [], marketingCaption: gen.marketingCaption }));
  }

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-3xl font-semibold">{id ? 'Edit Product' : 'New Product'}</h1>
      <p className="text-sm text-gray-600 mb-6">Generate descriptions, SEO tags and marketing captions with SmartStore AI.</p>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-3">
          <label className="block text-left text-sm font-medium">Name</label>
          <input className="w-full border rounded px-3 py-2" value={form.name} onChange={(e) => setForm((s) => ({ ...s, name: e.target.value }))} />

          <label className="block text-left text-sm font-medium">Category</label>
          <input className="w-full border rounded px-3 py-2" value={form.category} onChange={(e) => setForm((s) => ({ ...s, category: e.target.value }))} />

          <label className="block text-left text-sm font-medium">Price</label>
          <input type="number" className="w-full border rounded px-3 py-2" value={form.price} onChange={(e) => setForm((s) => ({ ...s, price: e.target.value }))} />

          <label className="block text-left text-sm font-medium">Stock</label>
          <input type="number" className="w-full border rounded px-3 py-2" value={form.stock} onChange={(e) => setForm((s) => ({ ...s, stock: e.target.value }))} />

          <label className="block text-left text-sm font-medium">Low stock threshold</label>
          <input
            type="number"
            className="w-full border rounded px-3 py-2"
            value={form.lowStockThreshold}
            onChange={(e) => setForm((s) => ({ ...s, lowStockThreshold: e.target.value }))}
          />
        </div>

        <div className="space-y-3">
          <label className="block text-left text-sm font-medium">Description</label>
          <textarea className="w-full border rounded px-3 py-2 min-h-32" value={form.description} onChange={(e) => setForm((s) => ({ ...s, description: e.target.value }))} />

          <label className="block text-left text-sm font-medium">Marketing caption</label>
          <textarea className="w-full border rounded px-3 py-2 min-h-24" value={form.marketingCaption} onChange={(e) => setForm((s) => ({ ...s, marketingCaption: e.target.value }))} />

          <label className="block text-left text-sm font-medium">SEO tags (comma separated)</label>
          <input
            className="w-full border rounded px-3 py-2"
            value={form.seoTags.join(', ')}
            onChange={(e) => setForm((s) => ({ ...s, seoTags: e.target.value.split(',').map((x) => x.trim()).filter(Boolean) }))}
          />

          <div className="flex gap-2">
            <button className="bg-brand-600 text-white rounded px-4 py-2 font-medium" onClick={onGenerateAI} type="button">Generate AI</button>
            <button className="border rounded px-4 py-2 font-medium" onClick={onSave} type="button">Save</button>
          </div>
        </div>
      </div>
    </div>
  );
}

