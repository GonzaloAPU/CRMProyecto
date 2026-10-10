import '../css/dashboard.css'
import { useState, useEffect } from 'react'
import { getEstadisticasDashboard } from '../services/clienteService'

const Dashboard = () => {
  const [stats, setStats] = useState({ clientes: null, gerencia: null, soporte: null })
  const [cargando, setCargando] = useState(true)

  useEffect(() => {
    let ignore = false

    const cargarStats = async () => {
      try {
        const response = await getEstadisticasDashboard()
        if (!ignore && response?.data) {
          setStats(response.data)
        }
      } catch (err) {
        console.error('Error al cargar métricas del dashboard:', err)
      } finally {
        if (!ignore) {
          setCargando(false)
        }
      }
    }

    cargarStats()

    return () => {
      ignore = true
    }
  }, [])

  const cards = [
    { titulo: 'Clientes', valor: stats.clientes },
    { titulo: 'Gerencia', valor: stats.gerencia },
    { titulo: 'Soporte', valor: stats.soporte }
  ]

  return (
    <div className="dashboard">
      <h1>Panel de Control de Clientes</h1>
      <p>
        {cargando
          ? 'Conectando con el servidor...'
          : 'Resumen en tiempo real de clientes y personal del CRM.'}
      </p>
      <div className="dashboard-cards">
        {cards.map(({ titulo, valor }) => (
          <div className="dashboard-card" key={titulo}>
            <h3>{titulo}</h3>
            <p>{cargando ? '...' : valor !== null ? valor : '0'}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Dashboard
