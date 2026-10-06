import { db } from '../config/firebase.js'

const COLLECTION_NAME = 'users'

export const UserModel = {
  // Buscar un usuario por email para el Login
  async findByEmail(email) {
    const snapshot = await db.collection(COLLECTION_NAME).where('email', '==', email).get()
    if (snapshot.empty) return null
    const doc = snapshot.docs[0]
    return { id: doc.id, ...doc.data() }
  },

  // Crear un nuevo usuario (Soporte o Gerencia)
  async create(userData) {
    const docRef = await db.collection(COLLECTION_NAME).add({
      ...userData,
      createdAt: new Date().toISOString()
    })
    return { id: docRef.id, ...userData }
  }
}