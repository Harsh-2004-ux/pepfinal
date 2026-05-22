import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend);

export default function RevenueChart({ data }) {
  if (!data?.labels?.length) {
    return (
      <div className="border rounded-xl p-4 bg-white/70 backdrop-blur">
        <h2 className="font-semibold mb-2">Revenue</h2>
        <p className="text-sm text-gray-600">No revenue yet. Record a sale from Top Products.</p>
      </div>
    );
  }

  const chartData = {
    labels: data.labels,
    datasets: [
      {
        label: 'Revenue',
        data: data.values,
        borderColor: '#7c3aed',
        backgroundColor: 'rgba(124,58,237,0.2)',
        tension: 0.3,
      },
    ],
  };

  return (
    <div className="border rounded-xl p-4 bg-white/70 backdrop-blur">
      <div className="flex items-end justify-between mb-3">
        <div>
          <h2 className="font-semibold">Revenue analytics</h2>
          <p className="text-sm text-gray-600">Total: ${data.totalRevenue || 0}</p>
        </div>
      </div>
      <Line data={chartData} />
    </div>
  );
}

