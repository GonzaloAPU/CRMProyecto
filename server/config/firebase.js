import dotenv from 'dotenv'
import { fileURLToPath } from 'node:url'
import { cert, getApps, initializeApp } from 'firebase-admin/app'
import { getFirestore } from 'firebase-admin/firestore'
import { getFirebaseConfig } from './env.js'

dotenv.config({ path: fileURLToPath(new URL('../.env', import.meta.url)) })

const existingApp = getApps().find((app) => app.name === '[DEFAULT]')
const config = existingApp ? null : getFirebaseConfig()
const firebaseApp = existingApp || initializeApp({
  credential: cert(config),
  projectId: config.projectId,
})

export const db = getFirestore(firebaseApp)
