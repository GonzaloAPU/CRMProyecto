import { db } from '../config/firebase.js';

export const clientesService = {
  async obtenerTodos() {
    const snapshot = await db.collection('clientes').get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  },

  async crear(dataCliente) {
    const nuevoRef = await db.collection('clientes').add(dataCliente);
    return { id: nuevoRef.id, ...dataCliente };
  }
};