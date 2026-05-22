import OpenAI from 'openai';

const MODEL = process.env.OPENAI_MODEL || 'gpt-4o-mini';

function fallbackGenerate(product) {
  const name = product?.name || 'Product';
  const category = product?.category || 'General';
  const price = typeof product?.price === 'number' ? product.price : 0;

  const description = `Discover ${name}: a ${category} essential designed for everyday performance. Crafted with thoughtful details, it delivers reliable results and a great experience.

Perfect for customers seeking quality, value, and standout style.`;

  const seoTags = Array.from(
    new Set([
      name,
      category,
      'best quality',
      'fast delivery',
      'premium',
      'limited offer',
      price ? `${price} price` : null,
    ].filter(Boolean))
  ).slice(0, 12);

  const marketingCaption = `Upgrade your routine with ${name} — ${category} made simple. Order now for a standout deal!`;

  return {
    description,
    seoTags,
    marketingCaption,
  };
}

export async function generateProductContent({ product }) {
  if (!process.env.OPENAI_API_KEY) {
    return fallbackGenerate(product);
  }

  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

  const prompt = `You are an expert e-commerce copywriter.

Generate:
1) A concise but persuasive product description (80-160 words)
2) 8-12 SEO tags (short phrases)
3) A marketing caption (1-2 sentences)

Product details (may be partial):
- Name: ${product?.name || ''}
- Category: ${product?.category || ''}
- Price: ${product?.price ?? ''}
- Features: ${(product?.features || []).join(', ')}

Return ONLY valid JSON with keys: description, seoTags, marketingCaption.

seoTags must be an array of strings.`;

  const resp = await openai.chat.completions.create({
    model: MODEL,
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.7,
  });

  const text = resp.choices?.[0]?.message?.content || '{}';
  let parsed;
  try {
    parsed = JSON.parse(text);
  } catch {
    parsed = fallbackGenerate(product);
  }

  return {
    description: parsed.description || fallbackGenerate(product).description,
    seoTags: parsed.seoTags || fallbackGenerate(product).seoTags,
    marketingCaption: parsed.marketingCaption || fallbackGenerate(product).marketingCaption,
  };
}

