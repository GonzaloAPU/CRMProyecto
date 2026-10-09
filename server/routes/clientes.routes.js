import { Router } from 'express';
import { clientesController } from '../controllers/clientes.controller.js';

const router = Router();

router.get('/', clientesController.listar);
router.post('/', clientesController.crear);

export default router;