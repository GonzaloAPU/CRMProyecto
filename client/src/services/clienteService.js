const API_URL = 'http://localhost:3001/api/clientes'

export const getClientes = async () => {
  const response = await fetch(API_URL)
  if (!response.ok) {
    throw new Error('Error al obtener los clientes del servidor')
  }
  return await response.json()
}

export const crearCliente = async (clienteData) => {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(clienteData)
  })
  if (!response.ok) {
    throw new Error('Error al registrar el cliente en el servidor')
  }
  return await response.json()
}

export const getClientePorId = async (id) => {
  const response = await fetch(`${API_URL}/${id}`)
  if (!response.ok) {
    throw new Error('Error al obtener el cliente del servidor')
  }
  return await response.json()
}

export const buscarClientes = async (termino) => {
  const response = await fetch(`${API_URL}/buscar?q=${encodeURIComponent(termino)}`)
  if (!response.ok) {
    throw new Error('Error al buscar clientes en el servidor')
  }
  return await response.json()
}

export const eliminarCliente = async (id) => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: 'DELETE'
  })
  if (!response.ok) {
    throw new Error('Error al eliminar el cliente del servidor')
  }
  return await response.json()
}

export const getEstadisticasDashboard = async () => {
  const response = await fetch('http://localhost:3001/api/usuarios/estadisticas')
  if (!response.ok) {
    throw new Error('Error al obtener estadísticas del servidor')
  }
  return await response.json()
}