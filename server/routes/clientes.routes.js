import { Router } from 'express';
import { clientesController } from '../controllers/clientes.controller.js';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Clientes
 *   description: Gestión de clientes del CRM
 */

/**
 * @swagger
 * /api/clientes:
 *   get:
 *     summary: Listar todos los clientes
 *     tags: [Clientes]
 *     responses:
 *       200:
 *         description: Lista de clientes obtenida correctamente
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
 *                     $ref: '#/components/schemas/Cliente'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.get('/', clientesController.listar);

/**
 * @swagger
 * /api/clientes/buscar:
 *   get:
 *     summary: Buscar clientes por término
 *     tags: [Clientes]
 *     parameters:
 *       - in: query
 *         name: q
 *         schema:
 *           type: string
 *         description: Término de búsqueda (nombre, email, estado o teléfono)
 *       - in: query
 *         name: termino
 *         schema:
 *           type: string
 *         description: Alias del parámetro q (nombre, email, estado o teléfono)
 *     responses:
 *       200:
 *         description: Resultados de la búsqueda obtenidos correctamente
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
 *                     $ref: '#/components/schemas/Cliente'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.get('/buscar', clientesController.buscar);

/**
 * @swagger
 * /api/clientes/{id}:
 *   get:
 *     summary: Obtener un cliente por ID
 *     tags: [Clientes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del cliente en Firestore
 *     responses:
 *       200:
 *         description: Cliente encontrado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 ok:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Cliente'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.get('/:id', clientesController.obtenerPorId);

/**
 * @swagger
 * /api/clientes:
 *   post:
 *     summary: Crear un nuevo cliente
 *     tags: [Clientes]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ClienteInput'
 *     responses:
 *       201:
 *         description: Cliente creado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 ok:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Cliente'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.post('/', clientesController.crear);

/**
 * @swagger
 * /api/clientes/{id}:
 *   delete:
 *     summary: Eliminar un cliente por ID
 *     description: >
 *       Requiere que el header `x-user-sector` sea `Gerencia` o `Soporte`.
 *       Solo usuarios con esos roles tienen permiso para eliminar clientes.
 *     tags: [Clientes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del cliente en Firestore
 *       - in: header
 *         name: x-user-sector
 *         required: true
 *         schema:
 *           type: string
 *           enum: [Gerencia, Soporte]
 *         description: Sector/rol del usuario autenticado
 *     responses:
 *       200:
 *         description: Cliente eliminado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 ok:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Cliente eliminado correctamente
 *                 id:
 *                   type: string
 *                   example: abc123
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.delete('/:id', clientesController.eliminar);

export default router;