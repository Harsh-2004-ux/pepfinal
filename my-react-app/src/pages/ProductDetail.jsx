import { useContext, useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext.jsx';
import { createProduct, generateAIForProduct, getProductById, updateProduct } from '../api/products.api.js';
import AppShell from '../components/AppShell.jsx';

function Field({ label, children }) {
  return (
    <label className="block space-y-2">
      <span className="font-mono text-sm text-[#ccc3d8]">{label}</span>
      {children}
    </label>
  );
}

export default function ProductDetail() {
  const { token } = useContext(AuthContext);
  const { id } = useParams();
  const isNew = !id;
  const nav = useNavigate();
  const [generating, setGenerating] = useState(false);
  const [saving, setSaving] = useState(false);
  const [aiError, setAiError] = useState('');
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
    if (!token || isNew) return;
    (async () => {
      const product = await getProductById(token, id);
      setForm({
        name: product.name || '',
        description: product.description || '',
        features: product.features || [],
        seoTags: product.seoTags || [],
        marketingCaption: product.marketingCaption || '',
        price: product.price ?? 0,
        category: product.category || '',
        stock: product.inventory?.stock ?? 0,
        lowStockThreshold: product.inventory?.lowStockThreshold ?? 5,
      });
    })();
  }, [token, id, isNew]);

  function update(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  async function onSave() {
    setSaving(true);
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

    if (isNew) await createProduct(token, payload);
    else await updateProduct(token, id, payload);
    setSaving(false);
    nav('/products');
  }

  async function onGenerateAI() {
    if (!token) return;
    setGenerating(true);
    setAiError('');
    try {
      const data = await generateAIForProduct(token, { productId: id, product: { name: form.name, category: form.category, price: form.price } });
      const gen = data.generated || data;
      setForm((current) => ({
        ...current,
        description: gen.description || current.description,
        seoTags: gen.seoTags || current.seoTags,
        marketingCaption: gen.marketingCaption || current.marketingCaption,
      }));
    } catch (err) {
      setAiError(err?.response?.data?.message || err.message || 'AI generation failed. Please try again.');
    } finally {
      setGenerating(false);
    }
  }

  const inputClass = 'w-full rounded-xl border border-[#4a4455]/30 bg-[#222a3d] px-4 py-3 text-[#dae2fd] outline-none transition focus:border-[#d2bbff]';

  return (
    <AppShell title={isNew ? 'Add New Product' : 'Edit Product'} subtitle="Create product details, stock controls, SEO tags, and AI-ready marketing copy.">
      <section className="overflow-hidden rounded-3xl glass-card">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#4a4455]/20 p-6 md:p-8">
          <div>
            <h3 className="text-2xl font-semibold text-[#dae2fd]">Product Details</h3>
            <p className="mt-1 text-sm text-[#ccc3d8]">AI can generate polished descriptions and captions after you add the basics.</p>
          </div>
          <Link to="/products" className="rounded-xl border border-[#4a4455]/30 px-4 py-2 text-[#ccc3d8] hover:bg-[#2d3449]/40">Back to Inventory</Link>
        </div>

        <div className="grid gap-8 p-6 md:grid-cols-[1fr_1.1fr] md:p-8">
          <div className="space-y-6">
            <div className="rounded-2xl border-2 border-dashed border-[#4a4455]/40 p-10 text-center transition hover:border-[#d2bbff]/50">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#d2bbff]/10 text-[#d2bbff]">
                <span className="material-symbols-outlined text-3xl">upload_file</span>
              </div>
              <p className="font-semibold text-[#dae2fd]">Product image placeholder</p>
              <p className="mt-2 text-xs text-[#ccc3d8]">Image upload can be connected to storage when the backend is ready.</p>
            </div>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <Field label="Product Name">
                <input className={inputClass} value={form.name} onChange={(e) => update('name', e.target.value)} placeholder="NeoPods Ultra" />
              </Field>
              <Field label="Category">
                <input className={inputClass} value={form.category} onChange={(e) => update('category', e.target.value)} placeholder="Electronics" />
              </Field>
              <Field label="Base Price ($)">
                <input className={inputClass} value={form.price} onChange={(e) => update('price', e.target.value)} type="number" />
              </Field>
              <Field label="Stock Quantity">
                <input className={inputClass} value={form.stock} onChange={(e) => update('stock', e.target.value)} type="number" />
              </Field>
              <Field label="Low Stock Threshold">
                <input className={inputClass} value={form.lowStockThreshold} onChange={(e) => update('lowStockThreshold', e.target.value)} type="number" />
              </Field>
            </div>
          </div>

          <div className="space-y-5">
            <Field label="Product Description">
              <textarea className={`${inputClass} min-h-36 resize-none`} value={form.description} onChange={(e) => update('description', e.target.value)} placeholder="Describe the product features and customer value..." />
            </Field>

            <Field label="Marketing Caption">
              <textarea className={`${inputClass} min-h-28 resize-none`} value={form.marketingCaption} onChange={(e) => update('marketingCaption', e.target.value)} placeholder="Campaign-ready caption..." />
            </Field>

            <Field label="SEO Tags">
              <input
                className={inputClass}
                value={form.seoTags.join(', ')}
                onChange={(e) => update('seoTags', e.target.value.split(',').map((tag) => tag.trim()).filter(Boolean))}
                placeholder="wireless, premium, smart audio"
              />
            </Field>

            <div className="rounded-2xl p-5 ai-border">
              <div className="flex items-start gap-3">
                <span className="material-symbols-outlined text-[#d2bbff] [font-variation-settings:'FILL'_1]">colors_spark</span>
                <div>
                  <p className="font-semibold text-[#dae2fd]">AI content generator</p>
                  <p className="mt-1 text-sm text-[#ccc3d8]">Generate descriptions, SEO tags, and captions from your product name, category, and price.</p>
                </div>
              </div>
            </div>

            {aiError && (
              <p className="rounded-xl border border-[#ffb4ab]/20 bg-[#ffb4ab]/10 px-4 py-3 text-sm text-[#ffb4ab]">
                {aiError}
              </p>
            )}

            <div className="flex flex-wrap justify-end gap-3">
              <button className="flex items-center gap-2 rounded-xl border border-[#4a4455]/30 px-5 py-3 font-semibold text-[#d2bbff] hover:bg-[#d2bbff]/10" onClick={onGenerateAI} type="button" disabled={generating}>
                <span className={`material-symbols-outlined ${generating ? 'animate-spin' : ''}`}>{generating ? 'refresh' : 'auto_fix'}</span>
                {generating ? 'Generating...' : 'Generate AI'}
              </button>
              <button className="flex items-center gap-2 rounded-xl bg-[#d2bbff] px-6 py-3 font-bold text-[#25005a] hover:brightness-105" onClick={onSave} type="button" disabled={saving}>
                <span className={`material-symbols-outlined ${saving ? 'animate-spin' : ''}`}>{saving ? 'refresh' : 'publish'}</span>
                {saving ? 'Saving...' : 'Publish Product'}
              </button>
            </div>
          </div>
        </div>
      </section>
    </AppShell>
  );
}
