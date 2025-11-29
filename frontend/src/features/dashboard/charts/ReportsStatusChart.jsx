export default function ReportsStatusChart({ data }) {
  const total = data.open + data.inProgress + data.resolved + data.closed;
  
  const getPercentage = (value) => {
    return total > 0 ? (value / total) * 100 : 0;
  };

  const bars = [
    { label: 'Abiertos', value: data.open, color: '#0066CC', percentage: getPercentage(data.open) },
    { label: 'En Progreso', value: data.inProgress, color: '#2D98DC', percentage: getPercentage(data.inProgress) },
    { label: 'Resueltos', value: data.resolved, color: '#39A935', percentage: getPercentage(data.resolved) },
    { label: 'Cerrados', value: data.closed, color: '#10B981', percentage: getPercentage(data.closed) }
  ];

  return (
    <div className="chart-container">
      <h3 className="chart-title">Estado de Reportes</h3>
      <div className="css-chart">
        {bars.map((bar, index) => (
          <div key={index} className="css-chart-row">
            <div className="css-chart-label">{bar.label}</div>
            <div className="css-chart-bar-container">
              <div 
                className="css-chart-bar" 
                style={{ 
                  width: `${bar.percentage}%`, 
                  backgroundColor: bar.color 
                }}
              >
                <span className="css-chart-value">{bar.value}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
