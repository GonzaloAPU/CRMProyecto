import { usuariosService } from '../services/usuarios.service.js';

export const usuariosController = {
  async listar(req, res, next) {
    try {
      const usuarios = await usuariosService.obtenerTodos();
      res.json({ ok: true, data: usuarios });
    } catch (error) {
      next(error);
    }
  },

  async crear(req, res, next) {
    try {
      const nuevoUsuario = await usuariosService.crear(req.body);
      res.status(201).json({ ok: true, data: nuevoUsuario });
    } catch (error) {
      if (error.status === 400) {
        return res.status(400).json({ ok: false, error: error.message });
      }
      next(error);
    }
  },

  async login(req, res, next) {
    try {
      const usuario = await usuariosService.login(req.body);
      res.json({ ok: true, data: usuario });
    } catch (error) {
      if (error.status === 400 || error.status === 401) {
        return res.status(error.status).json({ ok: false, error: error.message });
      }
      next(error);
    }
  },

  async estadisticas(_req, res, next) {
    try {
      const estadisticas = await usuariosService.obtenerEstadisticas();
      res.json({ ok: true, data: estadisticas });
    } catch (error) {
      next(error);
    }
  }
};
