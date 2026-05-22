const MODEL = process.env.GEMINI_MODEL || 'gemini-1.5-flash';
const GEMINI_ENDPOINT = 'https://generativelanguage.googleapis.com/v1beta/models';

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

  const marketingCaption = `Upgrade your routine with ${name} - ${category} made simple. Order now for a standout deal!`;

  return {
    description,
    seoTags,
    marketingCaption,
  };
}

function extractJson(text) {
  const cleaned = text
    .replace(/^```json\s*/i, '')
    .replace(/^```\s*/i, '')
    .replace(/```$/i, '')
    .trim();

  const firstBrace = cleaned.indexOf('{');
  const lastBrace = cleaned.lastIndexOf('}');
  if (firstBrace === -1 || lastBrace === -1) return null;

  try {
    return JSON.parse(cleaned.slice(firstBrace, lastBrace + 1));
  } catch {
    return null;
  }
}

export async function generateProductContent({ product }) {
  const apiKey = process.env.GEMINI_API_KEY;
  const fallback = fallbackGenerate(product);

  if (!apiKey) {
    return fallback;
  }

  const prompt = `You are an expert e-commerce copywriter.

Generate:
1. A concise but persuasive product description (80-160 words)
2. 8-12 SEO tags (short phrases)
3. A marketing caption (1-2 sentences)

Product details may be partial:
- Name: ${product?.name || ''}
- Category: ${product?.category || ''}
- Price: ${product?.price ?? ''}
- Features: ${(product?.features || []).join(', ')}

Return only valid JSON with keys: description, seoTags, marketingCaption.
seoTags must be an array of strings.`;

  try {
    const response = await fetch(`${GEMINI_ENDPOINT}/${MODEL}:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            role: 'user',
            parts: [{ text: prompt }],
          },
        ],
        generationConfig: {
          temperature: 0.7,
          responseMimeType: 'application/json',
        },
      }),
    });

    if (!response.ok) {
      const message = await response.text();
      console.error(`Gemini request failed (${response.status}): ${message}`);
      return fallback;
    }

    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.map((part) => part.text || '').join('') || '{}';
    const parsed = extractJson(text) || fallback;

    return {
      description: parsed.description || fallback.description,
      seoTags: Array.isArray(parsed.seoTags) ? parsed.seoTags : fallback.seoTags,
      marketingCaption: parsed.marketingCaption || fallback.marketingCaption,
    };
  } catch (err) {
    console.error('Gemini request failed:', err.message);
    return fallback;
  }
}
