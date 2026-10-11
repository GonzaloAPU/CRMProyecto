import { Router } from 'express'
import { getTest } from '../controllers/test.controller.js'

const router = Router()

/**
 * @swagger
 * tags:
 *   name: Test
 *   description: Endpoints de diagnóstico del backend
 */

/**
 * @swagger
 * /api/test:
 *   get:
 *     summary: Verificar estado del backend y conexión con Firebase
 *     tags: [Test]
 *     responses:
 *       200:
 *         description: Estado del backend obtenido correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: ok
 *                 firebase:
 *                   type: string
 *                   example: connected
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.get('/', getTest)

export default router
