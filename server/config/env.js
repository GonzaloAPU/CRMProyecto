import { createPrivateKey } from 'node:crypto'

const firebaseNames = ['FIREBASE_PROJECT_ID', 'FIREBASE_CLIENT_EMAIL', 'FIREBASE_PRIVATE_KEY']

export const getPort = (env = process.env) => {
  if (env.PORT === undefined) return 3000
  const value = env.PORT.trim()
  const port = Number(value)
  if (!/^\d+$/.test(value) || !Number.isInteger(port) || port < 1 || port > 65535) {
    throw new Error('PORT debe ser un número entero entre 1 y 65535.')
  }
  return port
}

export const getFirebaseConfig = (env = process.env, { required = true } = {}) => {
  const missing = firebaseNames.filter((name) => !env[name]?.trim())
  if (missing.length === firebaseNames.length && !required) return null
  if (missing.length) {
    throw new Error(`Configuración Firebase incompleta. Faltan: ${missing.join(', ')}.`)
  }

  const projectId = env.FIREBASE_PROJECT_ID.trim()
  const clientEmail = env.FIREBASE_CLIENT_EMAIL.trim()
  const privateKey = env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n').trim()
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(clientEmail)) {
    throw new Error('FIREBASE_CLIENT_EMAIL debe ser un correo válido de la cuenta de servicio.')
  }
  try {
    const key = createPrivateKey(privateKey)
    if (key.asymmetricKeyType !== 'rsa') throw new Error('Tipo de clave inválido')
  } catch {
    throw new Error('FIREBASE_PRIVATE_KEY debe contener una clave privada RSA válida en formato PEM.')
  }
  return { projectId, clientEmail, privateKey }
}

export const validateEnvironment = (env = process.env) => ({
  port: getPort(env),
  firebase: getFirebaseConfig(env, { required: false }),
})
