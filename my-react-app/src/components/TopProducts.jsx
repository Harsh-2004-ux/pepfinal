export default function TopProducts({ top, onRecordSale }) {
  return (
    <div className="border rounded-xl p-4 bg-white/70 backdrop-blur">
      <h2 className="font-semibold mb-3">Top products</h2>
      <div className="space-y-3">
        {top?.length ? (
          top.map((row) => (
            <div key={row.productId} className="flex items-center justify-between gap-4">
              <div className="min-w-0">
                <p className="font-medium truncate">{row.name}</p>
                <p className="text-sm text-gray-600">Revenue: ${row.revenue}</p>
                <p className="text-xs text-gray-500">Units sold: {row.quantity}</p>
              </div>
              <button
                className="bg-brand-600 text-white rounded px-3 py-1 text-sm"
                onClick={() => onRecordSale(row.productId)}
                type="button"
              >
                Record sale
              </button>
            </div>
          ))
        ) : (
          <p className="text-sm text-gray-600">No top products yet. Create sales by recording test sales.</p>
        )}
      </div>
    </div>
  );
}

