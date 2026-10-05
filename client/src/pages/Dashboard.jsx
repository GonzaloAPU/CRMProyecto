import '../css/dashboard.css'

const Dashboard = () => (
  <div className="dashboard">
    <h1>Panel de Control de Clientes</h1>
    <p>El sistema está pendiente de conexión a un nuevo backend.</p>
    <div className="dashboard-cards">
      {['Clientes', 'Gerencia', 'Soporte'].map((titulo) => (
        <div className="dashboard-card" key={titulo}>
          <h3>{titulo}</h3>
          <p>Sin datos disponibles</p>
        </div>
      ))}
    </div>
  </div>
)

export default Dashboard
