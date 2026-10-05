// Comprobación del backend sin operaciones de lectura o escritura en Firestore.
export const getBackendStatus = () => ({
  ok: true,
  message: 'Backend CRM operativo',
})
