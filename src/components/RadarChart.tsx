import { useMemo } from 'react';

interface RadarChartProps {
  scores: Array<{
    category: string;
    score: number;
    max: number;
  }>;
}

const RadarChart = ({ scores }: RadarChartProps) => {
  const chartData = useMemo(() => {
    const centerX = 120;
    const centerY = 120;
    const maxRadius = 100;
    const numCategories = scores.length;

    // Calculate points for the chart
    const angleStep = (2 * Math.PI) / numCategories;
    
    // Create the background grid circles
    const gridCircles = [0.2, 0.4, 0.6, 0.8, 1.0].map(ratio => ({
      cx: centerX,
      cy: centerY,
      r: maxRadius * ratio,
    }));

    // Calculate axis lines and labels
    const axes = scores.map((_, index) => {
      const angle = index * angleStep - Math.PI / 2; // Start from top
      const x2 = centerX + Math.cos(angle) * maxRadius;
      const y2 = centerY + Math.sin(angle) * maxRadius;
      const labelX = centerX + Math.cos(angle) * (maxRadius + 20);
      const labelY = centerY + Math.sin(angle) * (maxRadius + 20);
      
      return {
        x1: centerX,
        y1: centerY,
        x2,
        y2,
        labelX,
        labelY,
        label: scores[index].category,
      };
    });

    // Calculate data polygon points
    const dataPoints = scores.map((score, index) => {
      const angle = index * angleStep - Math.PI / 2;
      const radius = (score.score / score.max) * maxRadius;
      const x = centerX + Math.cos(angle) * radius;
      const y = centerY + Math.sin(angle) * radius;
      return { x, y, score: score.score };
    });

    // Create path string for the data polygon
    const pathString = dataPoints.reduce((path, point, index) => {
      const command = index === 0 ? 'M' : 'L';
      return `${path} ${command} ${point.x} ${point.y}`;
    }, '') + ' Z';

    return {
      gridCircles,
      axes,
      dataPoints,
      pathString,
    };
  }, [scores]);

  return (
    <div className="w-full h-full flex items-center justify-center">
      <svg width="240" height="240" className="overflow-visible">
        {/* Background grid */}
        {chartData.gridCircles.map((circle, index) => (
          <circle
            key={index}
            cx={circle.cx}
            cy={circle.cy}
            r={circle.r}
            fill="none"
            stroke="hsl(var(--border))"
            strokeWidth="1"
            opacity={0.3}
          />
        ))}

        {/* Axes */}
        {chartData.axes.map((axis, index) => (
          <g key={index}>
            <line
              x1={axis.x1}
              y1={axis.y1}
              x2={axis.x2}
              y2={axis.y2}
              stroke="hsl(var(--border))"
              strokeWidth="1"
              opacity={0.5}
            />
            <text
              x={axis.labelX}
              y={axis.labelY}
              textAnchor="middle"
              dominantBaseline="central"
              className="text-xs font-medium fill-current text-muted-foreground"
            >
              {axis.label}
            </text>
          </g>
        ))}

        {/* Data polygon */}
        <path
          d={chartData.pathString}
          fill="hsl(var(--vc-secondary) / 0.2)"
          stroke="hsl(var(--vc-secondary))"
          strokeWidth="2"
        />

        {/* Data points */}
        {chartData.dataPoints.map((point, index) => (
          <g key={index}>
            <circle
              cx={point.x}
              cy={point.y}
              r="4"
              fill="hsl(var(--vc-secondary))"
              stroke="white"
              strokeWidth="2"
            />
            <text
              x={point.x}
              y={point.y - 12}
              textAnchor="middle"
              className="text-xs font-semibold fill-current text-vc-secondary"
            >
              {point.score}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
};

export default RadarChart;