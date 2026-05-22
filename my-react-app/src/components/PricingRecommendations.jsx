export default function PricingRecommendations({ recommendations }) {
  return (
    <div className="border rounded-xl p-4 bg-white/70 backdrop-blur">
      <h2 className="font-semibold mb-3">Pricing recommendations</h2>
      <div className="space-y-3">
        {(recommendations || []).map((r) => (
          <div key={r.productId}>
            <p className="font-medium">{r.name}</p>
            <p className="text-sm text-gray-600">Current: ${r.currentPrice} → Suggested: ${r.suggestedPrice}</p>
            <p className="text-xs text-gray-500">{r.rationale}</p>
          </div>
        ))}
        {!recommendations?.length && <p className="text-sm text-gray-600">No recommendations yet.</p>}
      </div>
    </div>
  );
}

