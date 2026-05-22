export default function TrendingInsights({ insights }) {
  if (!insights) return null;
  return (
    <div className="border rounded-xl p-4 bg-white/70 backdrop-blur">
      <h2 className="font-semibold mb-2">Trending insights</h2>
      <p className="text-sm text-gray-700">{insights.summary}</p>
      <div className="mt-3 text-xs text-gray-500 flex flex-wrap gap-4">
        <span>Prev revenue: ${insights.prevRevenue}</span>
        <span>Curr revenue: ${insights.currRevenue}</span>
        <span>Growth: {insights.growthPercent}</span>
      </div>
    </div>
  );
}

