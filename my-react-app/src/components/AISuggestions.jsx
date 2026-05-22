export default function AISuggestions({ suggestions }) {
  return (
    <div className="border rounded-xl p-4 bg-white/70 backdrop-blur">
      <h2 className="font-semibold mb-3">AI sales suggestions</h2>
      <ul className="list-disc pl-5 space-y-2">
        {(suggestions || []).map((s, idx) => (
          <li key={idx} className="text-sm text-gray-700">
            {s}
          </li>
        ))}
      </ul>
      {!suggestions?.length && <p className="text-sm text-gray-600">No suggestions yet.</p>}
    </div>
  );
}

