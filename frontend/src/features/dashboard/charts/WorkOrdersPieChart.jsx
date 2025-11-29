export default function WorkOrdersPieChart({ data }) {
  const total = (data.assigned || 0) + (data.inProgress || 0) + (data.completed || 0);
  
  if (total === 0) {
    return (
      <div className="chart-container">
        <h3 className="chart-title">Distribución de Órdenes</h3>
        <div className="text-center py-8 text-muted">
          No hay órdenes de trabajo registradas
        </div>
      </div>
    );
  }

  const items = [
    { label: 'Pendientes', value: data.assigned || 0, color: '#0066CC' },
    { label: 'En Progreso', value: data.inProgress || 0, color: '#3B82F6' },
    { label: 'Completadas', value: data.completed || 0, color: '#39A935' }
  ].filter(item => item.value > 0);

  return (
    <div className="chart-container">
      <h3 className="chart-title">Distribución de Órdenes</h3>
      <div className="css-pie-chart">
        {items.map((item, index) => {
          const percentage = ((item.value / total) * 100).toFixed(1);
          return (
            <div key={index} className="css-pie-item">
              <div 
                className="css-pie-color" 
                style={{ backgroundColor: item.color }}
              ></div>
              <div className="css-pie-label">
                <span className="font-bold">{item.label}</span>
                <span className="text-muted text-sm"> - {item.value} ({percentage}%)</span>
              </div>
            </div>
          );
        })}
      </div>
      
      {/* Visual representation */}
      <div className="css-pie-visual">
        {items.map((item, index) => {
          const percentage = (item.value / total) * 100;
          return (
            <div 
              key={index}
              className="css-pie-segment"
              style={{ 
                width: `${percentage}%`,
                backgroundColor: item.color
              }}
              title={`${item.label}: ${item.value}`}
            ></div>
          );
        })}
      </div>
    </div>
  );
}
