import { db } from '../config/firebase.js';
import { Usuario } from '../models/usuario.model.js';

const ROLES_VALIDOS = ['Soporte', 'Gerencia'];

export const usuariosService = {
  async obtenerTodos() {
    const snapshot = await db.collection('users').get();
    return snapshot.docs.map(doc => {
      const usuarioSinPassword = { ...doc.data() };
      delete usuarioSinPassword.password;
      return { id: doc.id, ...usuarioSinPassword };
    });
  },

  async login({ email, password }) {
    if (!email || !password) {
      const error = new Error('Email y contraseña son obligatorios');
      error.status = 400;
      throw error;
    }

    const emailNormalizado = email.trim().toLowerCase();
    const snapshot = await db.collection('users').where('email', '==', emailNormalizado).get();

    if (snapshot.empty) {
      const error = new Error('Credenciales inválidas');
      error.status = 401;
      throw error;
    }

    const doc = snapshot.docs[0];
    const data = doc.data();

    if (data.password !== password) {
      const error = new Error('Credenciales inválidas');
      error.status = 401;
      throw error;
    }

    const usuarioSinPassword = { ...data };
    delete usuarioSinPassword.password;
    return { id: doc.id, ...usuarioSinPassword };
  },

  async crear(datosUsuario) {
    const { email, password, sector, nombre } = datosUsuario;

    if (!email || !password || !sector) {
      const error = new Error('Email, password y sector (Soporte o Gerencia) son obligatorios');
      error.status = 400;
      throw error;
    }

    // Normalizar sector / rol: 'soporte' -> 'Soporte', 'gerencia' -> 'Gerencia'
    const sectorNormalizado = sector.trim().charAt(0).toUpperCase() + sector.trim().slice(1).toLowerCase();

    if (!ROLES_VALIDOS.includes(sectorNormalizado)) {
      const error = new Error(`Sector inválido. Solo se permite: ${ROLES_VALIDOS.join(' o ')}`);
      error.status = 400;
      throw error;
    }

    const emailNormalizado = email.trim().toLowerCase();
    const snapshot = await db.collection('users').where('email', '==', emailNormalizado).get();
    if (!snapshot.empty) {
      const error = new Error('Ya existe un usuario registrado con este email');
      error.status = 400;
      throw error;
    }

    const nuevoUsuario = new Usuario({
      nombre: nombre || '',
      email: emailNormalizado,
      password,
      sector: sectorNormalizado
    });

    const docRef = await db.collection('users').add({ ...nuevoUsuario });
    const usuarioCreado = { ...nuevoUsuario };
    delete usuarioCreado.password;
    return { id: docRef.id, ...usuarioCreado };
  },

  async obtenerEstadisticas() {
    const clientesSnapshot = await db.collection('clientes').get();
    const totalClientes = clientesSnapshot.size;

    const usersSnapshot = await db.collection('users').get();
    let totalGerencia = 0;
    let totalSoporte = 0;

    usersSnapshot.forEach(doc => {
      const data = doc.data();
      const sector = (data.sector || '').toLowerCase();
      if (sector === 'gerencia') {
        totalGerencia += 1;
      } else if (sector === 'soporte') {
        totalSoporte += 1;
      }
    });

    return {
      clientes: totalClientes,
      gerencia: totalGerencia,
      soporte: totalSoporte
    };
  }
};
