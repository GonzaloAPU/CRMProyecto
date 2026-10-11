import { Router } from 'express';
import { usuariosController } from '../controllers/usuarios.controller.js';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Usuarios
 *   description: Gestión de usuarios y autenticación del CRM
 */

/**
 * @swagger
 * /api/usuarios:
 *   get:
 *     summary: Listar todos los usuarios
 *     tags: [Usuarios]
 *     responses:
 *       200:
 *         description: Lista de usuarios obtenida correctamente (sin campo password)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 ok:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Usuario'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.get('/', usuariosController.listar);

/**
 * @swagger
 * /api/usuarios/estadisticas:
 *   get:
 *     summary: Obtener estadísticas generales del CRM
 *     description: Retorna el total de clientes, usuarios de Gerencia y usuarios de Soporte.
 *     tags: [Usuarios]
 *     responses:
 *       200:
 *         description: Estadísticas obtenidas correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 ok:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     clientes:
 *                       type: integer
 *                       description: Total de clientes registrados
 *                       example: 42
 *                     gerencia:
 *                       type: integer
 *                       description: Total de usuarios con sector Gerencia
 *                       example: 3
 *                     soporte:
 *                       type: integer
 *                       description: Total de usuarios con sector Soporte
 *                       example: 7
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.get('/estadisticas', usuariosController.estadisticas);

/**
 * @swagger
 * /api/usuarios/login:
 *   post:
 *     summary: Iniciar sesión de un usuario
 *     tags: [Usuarios]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: usuario@crm.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: secreto123
 *     responses:
 *       200:
 *         description: Login exitoso, retorna el usuario autenticado (sin password)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 ok:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Usuario'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.post('/login', usuariosController.login);

/**
 * @swagger
 * /api/usuarios:
 *   post:
 *     summary: Crear un nuevo usuario
 *     tags: [Usuarios]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UsuarioInput'
 *     responses:
 *       201:
 *         description: Usuario creado correctamente (sin campo password en respuesta)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 ok:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Usuario'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.post('/', usuariosController.crear);

export default router;
