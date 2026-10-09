import '../css/listaclientes.css'
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import FormCliente from '../components/FormCliente'
import { getClientes } from '../services/clienteService'

const ListaClientes = () => {
  const [clientes, setClientes] = useState([])
  const [busqueda, setBusqueda] = useState('')
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState(null)

  const cargarClientes = async () => {
    setCargando(true)
    setError(null)
    try {
      const data = await getClientes()
      setClientes(Array.isArray(data) ? data : (data.clientes || []))
    } catch (err) {
      setError('No se pudo conectar con el servidor en localhost:3000.')
    } finally {
      setCargando(false)
    }
  }

  useEffect(() => {
    cargarClientes()
  }, [])

  const clientesFiltrados = clientes.filter((cliente) => {
    const nombre = (cliente.nombre || '').toLowerCase()
    const email = (cliente.email || '').toLowerCase()
    const estado = (cliente.estado || '').toLowerCase()
    const termino = busqueda.toLowerCase()
    return nombre.includes(termino) || email.includes(termino) || estado.includes(termino)
  })

  return (
    <div className="clientes-container">
      <h1>Gestión de Clientes</h1>
      <p>Administración y seguimiento sincronizado con base de datos en tiempo real.</p>

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

      {error && <div className="alert alert-warning">{error}</div>}

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
            <tr><td colSpan={7}>Cargando clientes desde el backend...</td></tr>
          ) : clientesFiltrados.length === 0 ? (
            <tr><td colSpan={7}>No se encontraron clientes registrados.</td></tr>
          ) : (
            clientesFiltrados.map((cliente) => (
              <tr key={cliente.id}>
                <td>{cliente.id ? cliente.id.slice(0, 8) + '...' : '-'}</td>
                <td>{cliente.nombre}</td>
                <td>{cliente.email}</td>
                <td>{cliente.telefono}</td>
                <td>
                  <span className={`badge-estado estado-${(cliente.estado || 'pendiente').replace(' ', '-')}`}>
                    {cliente.estado || 'pendiente'}
                  </span>
                </td>
                <td>\${Number(cliente.montoPresupuesto || 0).toLocaleString('es-AR')}</td>
                <td>
                  <Link className="btn-ficha" to={`/clientes/${cliente.id}`}>
                    Ver Ficha
                  </Link>
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