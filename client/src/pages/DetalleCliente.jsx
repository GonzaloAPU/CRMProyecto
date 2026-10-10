import '../css/detallecliente.css'
import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { getClientePorId, eliminarCliente } from '../services/clienteService'

const DetalleCliente = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [cliente, setCliente] = useState(null)
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState(null)
  const [eliminando, setEliminando] = useState(false)
  const [mensajeEliminado, setMensajeEliminado] = useState(false)

  useEffect(() => {
    let ignore = false

    const cargarDetalle = async () => {
      try {
        const response = await getClientePorId(id)
        if (!ignore) {
          setCliente(response.data || response)
        }
      } catch (err) {
        if (!ignore) {
          setError(err.message || 'Error al obtener los datos del cliente')
        }
      } finally {
        if (!ignore) {
          setCargando(false)
        }
      }
    }

    cargarDetalle()

    return () => {
      ignore = true
    }
  }, [id])

  const handleEliminar = async () => {
    const confirmar = window.confirm(`¿Está seguro de que desea eliminar al cliente "${cliente?.nombre || id}"?`)
    if (!confirmar) return

    setEliminando(true)
    setError(null)
    try {
      await eliminarCliente(id)
      setMensajeEliminado(true)
      setTimeout(() => {
        navigate('/clientes')
      }, 1500)
    } catch (err) {
      setError(err.message || 'Error al eliminar el cliente')
      setEliminando(false)
    }
  }

  return (
    <div className="detalle-cliente">
      <h1>Ficha del Cliente</h1>

      {mensajeEliminado && (
        <div className="mensaje-eliminado">
          Cliente eliminado con éxito. Redirigiendo a la lista...
        </div>
      )}

      {error && (
        <div style={{ color: 'red', textAlign: 'center', marginBottom: '20px' }}>
          {error}
        </div>
      )}

      {cargando ? (
        <p style={{ textAlign: 'center' }}>Cargando datos del cliente...</p>
      ) : cliente ? (
        <>
          <h2>Información de Contacto</h2>
          <p><strong>ID:</strong> {cliente.id}</p>
          <p><strong>Nombre / Razón Social:</strong> {cliente.nombre || '-'}</p>
          <p><strong>Email:</strong> {cliente.email || '-'}</p>
          <p><strong>Teléfono:</strong> {cliente.telefono || '-'}</p>

          <h2>Estado y Presupuesto</h2>
          <p>
            <strong>Estado:</strong>{' '}
            <span style={{ textTransform: 'capitalize' }}>{cliente.estado || 'pendiente'}</span>
          </p>
          <p>
            <strong>Monto de Presupuesto:</strong> ${Number(cliente.montoPresupuesto || 0).toLocaleString('es-AR')}
          </p>
          {cliente.fechaCreacion && (
            <p>
              <strong>Fecha de Registro:</strong> {new Date(cliente.fechaCreacion).toLocaleString('es-AR')}
            </p>
          )}

          {!mensajeEliminado && (
            <button
              className="btn-eliminar"
              onClick={handleEliminar}
              disabled={eliminando}
            >
              {eliminando ? 'Eliminando cliente...' : 'Eliminar Cliente'}
            </button>
          )}
        </>
      ) : (
        !error && <p style={{ textAlign: 'center' }}>Cliente no encontrado.</p>
      )}

      <div style={{ textAlign: 'center', marginTop: '30px' }}>
        <Link to="/clientes">← Volver a clientes</Link>
      </div>
    </div>
  )
}

export default DetalleCliente
