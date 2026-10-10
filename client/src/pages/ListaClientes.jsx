import '../css/listaclientes.css'
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import FormCliente from '../components/FormCliente'
import { getClientes, eliminarCliente } from '../services/clienteService'

const ListaClientes = () => {
  const [clientes, setClientes] = useState([])
  const [busqueda, setBusqueda] = useState('')
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState(null)

  const cargarClientes = async () => {
    setCargando(true)
    setError(null)
    try {
      const response = await getClientes()
      const lista = Array.isArray(response) 
        ? response 
        : (Array.isArray(response?.data) ? response.data : [])
      setClientes(lista)
    } catch (err) {
      console.error('Error al cargar clientes:', err)
      setError(err.message || 'Error al conectar con el servidor')
    } finally {
      setCargando(false)
    }
  }

  useEffect(() => {
    let ignore = false

    const inicializar = async () => {
      try {
        const response = await getClientes()
        if (!ignore) {
          const lista = Array.isArray(response) 
            ? response 
            : (Array.isArray(response?.data) ? response.data : [])
          setClientes(lista)
        }
      } catch (err) {
        if (!ignore) {
          console.error('Error al cargar clientes:', err)
          setError(err.message || 'Error al conectar con el servidor')
        }
      } finally {
        if (!ignore) {
          setCargando(false)
        }
      }
    }

    inicializar()

    return () => {
      ignore = true
    }
  }, [])

  const handleEliminar = async (id, nombre) => {
    const confirmar = window.confirm(`¿Está seguro de que desea eliminar al cliente "${nombre || id}"?`)
    if (!confirmar) return

    try {
      await eliminarCliente(id)
      await cargarClientes()
    } catch (err) {
      alert(err.message || 'Error al eliminar el cliente')
    }
  }

  const clientesFiltrados = clientes.filter((cliente) => {
    const nombre = (cliente.nombre || '').toLowerCase()
    const email = (cliente.email || '').toLowerCase()
    const estado = (cliente.estado || '').toLowerCase()
    const termino = busqueda.toLowerCase()
    return nombre.includes(termino) || email.includes(termino) || estado.includes(termino)
  })

  return (
    <div className="clientes-container">
      <FormCliente onClienteCreado={cargarClientes} />

      <hr />

      <div className="contenedor-buscador">
        <h2 className="titulo-buscador">Buscar Clientes</h2>
        <input
          className="buscador"
          type="text"
          placeholder="Buscar por nombre, email o estado"
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
        />
        <p className="cantidad-clientes">
          Clientes encontrados: {clientesFiltrados.length}
        </p>
      </div>

      {error && (
        <div style={{ color: 'red', textAlign: 'center', margin: '15px 0' }}>
          {error}
        </div>
      )}

      <table className="tabla-clientes">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Email</th>
            <th>Teléfono</th>
            <th>Estado</th>
            <th>Presupuesto</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {cargando ? (
            <tr>
              <td colSpan={7} style={{ textAlign: 'center', padding: '20px' }}>
                Cargando clientes desde el servidor...
              </td>
            </tr>
          ) : clientesFiltrados.length === 0 ? (
            <tr>
              <td colSpan={7} style={{ textAlign: 'center', padding: '20px' }}>
                No se encontraron clientes registrados.
              </td>
            </tr>
          ) : (
            clientesFiltrados.map((cliente) => (
              <tr key={cliente.id}>
                <td>{cliente.id ? cliente.id.slice(0, 8) + '...' : '-'}</td>
                <td>{cliente.nombre || '-'}</td>
                <td>{cliente.email || '-'}</td>
                <td>{cliente.telefono || '-'}</td>
                <td>
                  <span className={`badge-estado estado-${(cliente.estado || 'pendiente').toLowerCase().replace(' ', '-')}`}>
                    {cliente.estado || 'pendiente'}
                  </span>
                </td>
                <td>${Number(cliente.montoPresupuesto || 0).toLocaleString('es-AR')}</td>
                <td>
                  <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', alignItems: 'center' }}>
                    <Link className="btn-ficha" to={`/clientes/${cliente.id}`}>
                      Ver Ficha
                    </Link>
                    <button
                      className="btn-eliminar-item"
                      onClick={() => handleEliminar(cliente.id, cliente.nombre)}
                      title="Eliminar cliente"
                    >
                      Eliminar
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}

export default ListaClientes