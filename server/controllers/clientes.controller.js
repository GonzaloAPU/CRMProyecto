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

  async buscar(req, res, next) {
    try {
      const { q, termino } = req.query;
      const busqueda = q || termino || '';
      const clientes = await clientesService.buscar(busqueda);
      res.json({ ok: true, data: clientes });
    } catch (error) {
      next(error);
    }
  },

  async obtenerPorId(req, res, next) {
    try {
      const { id } = req.params;
      const cliente = await clientesService.obtenerPorId(id);
      if (!cliente) {
        return res.status(404).json({ ok: false, error: 'Cliente no encontrado' });
      }
      res.json({ ok: true, data: cliente });
    } catch (error) {
      next(error);
    }
  },

  async crear(req, res, next) {
    try {
      const { nombre, email } = req.body;
      if (!nombre || !email) {
        return res.status(400).json({
          ok: false,
          error: 'El nombre y el email son obligatorios para registrar un cliente'
        });
      }
      const nuevoCliente = await clientesService.crear(req.body);
      res.status(201).json({ ok: true, data: nuevoCliente });
    } catch (error) {
      next(error);
    }
  },

  async eliminar(req, res, next) {
    try {
      const sector = req.headers['x-user-sector'];
      if (!sector || !['Gerencia', 'Soporte'].includes(sector)) {
        return res.status(403).json({
          ok: false,
          error: 'Acceso denegado: solo usuarios con rol Soporte o Gerencia pueden eliminar clientes'
        });
      }
      const { id } = req.params;
      const eliminado = await clientesService.eliminar(id);
      if (!eliminado) {
        return res.status(404).json({ ok: false, error: 'Cliente no encontrado' });
      }
      res.json({ ok: true, message: 'Cliente eliminado correctamente', id });
    } catch (error) {
      next(error);
    }
  }
};