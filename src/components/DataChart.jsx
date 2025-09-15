import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement } from 'chart.js';
import { Typography } from "@mui/material";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement);

export default function DataChart({ balloons, externalData }) {
  if (!balloons || balloons.length === 0) return <Typography>Loading chart...</Typography>;

  const labels = balloons.map((_, i) => `T-${i}h`);
  // Use the first balloon altitude per snapshot
  const altitudes = balloons.map(b => {
    const p = Array.isArray(b.positions) && b.positions.length ? b.positions[0] : null;
    return typeof p?.alt === 'number' ? Math.round(p.alt * 100) / 100 : 0;
  });

  const data = {
    labels,
    datasets: [
      {
        label: 'Balloon Altitude (m)',
        data: altitudes,
        borderColor: 'rgb(143, 75, 192)',
        fill: false
      }
    ]
  };

  return <Line data={data} />;
}
