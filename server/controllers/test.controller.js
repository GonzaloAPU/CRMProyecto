import { getBackendStatus, checkFirestoreConnection } from '../services/test.service.js'

export const getTest = (_request, response) => {
  response.json(getBackendStatus())
}

export const getFirestoreTest = async (_request, response) => {
  try {
    response.json(await checkFirestoreConnection())
  } catch {
    response.status(503).json({
      ok: false,
      message: 'No se pudo conectar a Firestore. Revise las credenciales, los permisos y la conexión.',
    })
  }
}
