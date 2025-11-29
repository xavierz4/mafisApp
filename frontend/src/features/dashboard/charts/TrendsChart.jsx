export default function TrendsChart({ data }) {
  const maxValue = Math.max(
    ...data.map(d => Math.max(d.reports, d.orders))
  );

  return (
    <div className="chart-container">
      <h3 className="chart-title">Tendencias Mensuales</h3>
      <div className="css-line-chart">
        <div className="css-line-legend">
          <div className="css-line-legend-item">
            <div className="css-line-legend-color" style={{ backgroundColor: '#0066CC' }}></div>
            <span>Reportes</span>
          </div>
          <div className="css-line-legend-item">
            <div className="css-line-legend-color" style={{ backgroundColor: '#39A935' }}></div>
            <span>Órdenes</span>
          </div>
        </div>
        
        <div className="css-line-grid">
          {data.map((item, index) => {
            const reportsHeight = (item.reports / maxValue) * 100;
            const ordersHeight = (item.orders / maxValue) * 100;
            
            return (
              <div key={index} className="css-line-column">
                <div className="css-line-bars">
                  <div 
                    className="css-line-bar css-line-bar-reports"
                    style={{ height: `${reportsHeight}%` }}
                    title={`Reportes: ${item.reports}`}
                  ></div>
                  <div 
                    className="css-line-bar css-line-bar-orders"
                    style={{ height: `${ordersHeight}%` }}
                    title={`Órdenes: ${item.orders}`}
                  ></div>
                </div>
                <div className="css-line-label">{item.month}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
