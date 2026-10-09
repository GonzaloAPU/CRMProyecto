import { db } from '../config/firebase.js'

// Nombre de la colección en Firestore
const COLLECTION_NAME = 'clients'

export const ClientModel = {
  // Traer todos los clientes
  async getAll() {
    const snapshot = await db.collection(COLLECTION_NAME).get()
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
  },

  // Crear un cliente (la primera vez que se use esto, la colección 'clients' se genera sola en Firebase)
  async create(data) {
    const docRef = await db.collection(COLLECTION_NAME).add({
      ...data,
      createdAt: new Date().toISOString()
    })
    return { id: docRef.id, ...data }
  }
}