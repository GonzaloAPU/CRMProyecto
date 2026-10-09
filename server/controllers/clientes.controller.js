import { clientesService } from '../services/clientes.service.js';

export const clientesController = {
  async listar(req, res, next) {
    try {
      const clientes = await clientesService.obtenerTodos();
      res.json({ ok: true, data: clientes });
    } catch (error) {
      next(error);
    }
  },

  async crear(req, res, next) {
    try {
      const nuevoCliente = await clientesService.crear(req.body);
      res.status(201).json({ ok: true, data: nuevoCliente });
    } catch (error) {
      next(error);
    }
  }
};