import { Router } from 'express';
import { clientesController } from '../controllers/clientes.controller.js';

const router = Router();

router.get('/', clientesController.listar);
router.get('/buscar', clientesController.buscar);
router.get('/:id', clientesController.obtenerPorId);
router.post('/', clientesController.crear);
router.delete('/:id', clientesController.eliminar);

export default router;