import '../css/dashboard.css'
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getEstadisticasDashboard } from '../services/clienteService'

const Dashboard = () => {
  const [stats, setStats] = useState({ clientes: null, gerencia: null, soporte: null })
  const [cargando, setCargando] = useState(true)
  const [usuario] = useState(() => {
    try {
      const sesion = localStorage.getItem('usuarioCRM')
      return sesion ? JSON.parse(sesion) : null
    } catch {
      return null
    }
  })

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

      {usuario ? (
        <div className="user-card">
          <h3>Sesión activa: {usuario.nombre || usuario.email}</h3>
          <p><strong>Sector:</strong> {usuario.sector}</p>
          <p><strong>Email:</strong> {usuario.email}</p>
          <p style={{ color: '#28a745', fontWeight: 600, fontSize: '14px', marginTop: '10px' }}>
            ✓ Habilitado para administrar y eliminar clientes ({usuario.sector})
          </p>
        </div>
      ) : (
        <div className="dashboard-login">
          <p style={{ fontSize: '15px', color: '#666' }}>
            Para gestionar o eliminar clientes, iniciá sesión como Gerente o Soporte.
          </p>
          <Link
            to="/login"
            style={{
              display: 'inline-block',
              background: '#d63384',
              color: 'white',
              padding: '10px 22px',
              borderRadius: '20px',
              textDecoration: 'none',
              fontWeight: 600,
              marginTop: '10px'
            }}
          >
            Iniciar Sesión
          </Link>
        </div>
      )}
    </div>
  )
}

export default Dashboard
