import { Router } from 'express';
import { usuariosController } from '../controllers/usuarios.controller.js';

const router = Router();

router.get('/', usuariosController.listar);
router.get('/estadisticas', usuariosController.estadisticas);
router.post('/login', usuariosController.login);
router.post('/', usuariosController.crear);

export default router;
