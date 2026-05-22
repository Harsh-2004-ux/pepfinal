export default function InventoryAlerts({ alerts }) {
  return (
    <div className="border rounded-xl p-4 bg-white/70 backdrop-blur">
      <h2 className="font-semibold mb-3">Inventory alerts</h2>
      <div className="space-y-2">
        {(alerts || []).length ? (
          alerts.map((a) => (
            <div key={a.productId} className="text-sm">
              <p className="font-medium">{a.name}</p>
              <p className="text-gray-600">Stock: {a.stock} (threshold: {a.threshold})</p>
            </div>
          ))
        ) : (
          <p className="text-sm text-gray-600">No low stock products.</p>
        )}
      </div>
    </div>
  );
}

