const API_URL = 'http://localhost:3000/api/clientes'

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