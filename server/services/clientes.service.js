import { db } from '../config/firebase.js';
import { Cliente } from '../models/cliente.model.js';

export const clientesService = {
  async obtenerTodos() {
    const snapshot = await db.collection('clientes').get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  },

  async obtenerPorId(id) {
    const doc = await db.collection('clientes').doc(id).get();
    if (!doc.exists) {
      return null;
    }
    return { id: doc.id, ...doc.data() };
  },

  async buscar(termino) {
    const todos = await this.obtenerTodos();
    if (!termino || !termino.trim()) {
      return todos;
    }
    const term = termino.trim().toLowerCase();
    return todos.filter(c => {
      const nombre = (c.nombre || '').toLowerCase();
      const email = (c.email || '').toLowerCase();
      const estado = (c.estado || '').toLowerCase();
      const telefono = (c.telefono || '').toLowerCase();
      return nombre.includes(term) || email.includes(term) || estado.includes(term) || telefono.includes(term);
    });
  },

  async crear(dataCliente) {
    const nuevoCliente = new Cliente(dataCliente);
    const nuevoRef = await db.collection('clientes').add({ ...nuevoCliente });
    return { id: nuevoRef.id, ...nuevoCliente };
  },

  async eliminar(id) {
    const docRef = db.collection('clientes').doc(id);
    const doc = await docRef.get();
    if (!doc.exists) {
      return false;
    }
    await docRef.delete();
    return true;
  }
};