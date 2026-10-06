// Comprobación del backend sin operaciones de lectura o escritura en Firestore.
export const getBackendStatus = () => ({
  ok: true,
  message: 'Backend CRM operativo',
})

// Importación bajo demanda: las rutas básicas funcionan sin credenciales.
export const checkFirestoreConnection = async (database) => {
  const db = database ?? (await import('../config/firebase.js')).db
  const snapshot = await db.collection('clientes').limit(1).get()
  return {
    ok: true,
    message: 'Conexión a Firestore verificada',
    documentsRead: snapshot.size,
  }
}
