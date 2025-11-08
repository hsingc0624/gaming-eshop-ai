export default function CampaignChart({
  data = [3, 4, 3.6, 4.1, 3.9, 4.6, 4.2, 4.9],
}) {
  const w = 640,
    h = 80;
  const max = Math.max(...data);
  const min = Math.min(...data);
  const pts = data
    .map((v, i) => {
      const x = (i / (data.length - 1)) * w;
      const y = h - ((v - min) / (max - min || 1)) * h;
      return `${x},${y}`;
    })
    .join(" ");
  return (
    <svg width="100%" height={h} viewBox={`0 0 ${w} ${h}`}>
      <polyline
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        points={pts}
      />
    </svg>
  );
}
