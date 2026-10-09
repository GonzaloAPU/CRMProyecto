import dotenv from 'dotenv'
import { fileURLToPath } from 'node:url'
import { cert, getApps, initializeApp } from 'firebase-admin/app'
import { getFirestore } from 'firebase-admin/firestore'

dotenv.config({ path: fileURLToPath(new URL('../.env', import.meta.url)) })

const projectId = process.env.FIREBASE_PROJECT_ID
const clientEmail = process.env.FIREBASE_CLIENT_EMAIL

// Reconstrucción infalible de la clave para Node 24 + OpenSSL
function parsePrivateKey(key) {
  if (!key) return undefined
  
  // Si la clave ya tiene saltos de línea reales
  if (key.includes('\n')) {
    return key.replace(/^["']|["']$/g, '')
  }
  
  // Si viene escapada con \n como texto
  try {
    return JSON.parse(`"${key.replace(/^["']|["']$/g, '')}"`)
  } catch {
    return key.replace(/\\n/g, '\n').replace(/^["']|["']$/g, '')
  }
}

const privateKey = parsePrivateKey(process.env.FIREBASE_PRIVATE_KEY)

const existingApp = getApps().find((app) => app.name === '[DEFAULT]')

if (!existingApp && (!projectId || !clientEmail || !privateKey)) {
  throw new Error('Configure FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL y FIREBASE_PRIVATE_KEY para usar Firestore.')
}

const firebaseApp = existingApp || initializeApp({
  credential: cert({ projectId, clientEmail, privateKey }),
  projectId,
})

export const db = getFirestore(firebaseApp)