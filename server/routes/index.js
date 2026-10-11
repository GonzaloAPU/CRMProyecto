import { Router } from 'express'
import { getHealth } from '../controllers/healthController.js'

export const handleRoutes = Router()

/**
 * @swagger
 * tags:
 *   name: Health
 *   description: Estado del servicio
 */

/**
 * @swagger
 * /api/health:
 *   get:
 *     summary: Health check del servidor
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: Servicio funcionando correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: ok
 *                 service:
 *                   type: string
 *                   example: crm-server
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
handleRoutes.get('/api/health', getHealth)

// ─────────────────────────────────────────────────────────────────
// Schemas y Responses compartidos (reutilizados por todos los módulos)
// ─────────────────────────────────────────────────────────────────

/**
 * @swagger
 * components:
 *   schemas:
 *     Cliente:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: ID generado por Firestore
 *           example: aBcD1234
 *         nombre:
 *           type: string
 *           example: Juan Pérez
 *         email:
 *           type: string
 *           format: email
 *           example: juan@example.com
 *         telefono:
 *           type: string
 *           example: '+5491112345678'
 *         estado:
 *           type: string
 *           example: activo
 *
 *     ClienteInput:
 *       type: object
 *       required:
 *         - nombre
 *         - email
 *       properties:
 *         nombre:
 *           type: string
 *           example: Juan Pérez
 *         email:
 *           type: string
 *           format: email
 *           example: juan@example.com
 *         telefono:
 *           type: string
 *           example: '+5491112345678'
 *         estado:
 *           type: string
 *           example: activo
 *
 *     Usuario:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: ID generado por Firestore
 *           example: xYzW5678
 *         nombre:
 *           type: string
 *           example: María García
 *         email:
 *           type: string
 *           format: email
 *           example: maria@crm.com
 *         sector:
 *           type: string
 *           enum: [Soporte, Gerencia]
 *           example: Soporte
 *
 *     UsuarioInput:
 *       type: object
 *       required:
 *         - email
 *         - password
 *         - sector
 *       properties:
 *         nombre:
 *           type: string
 *           example: María García
 *         email:
 *           type: string
 *           format: email
 *           example: maria@crm.com
 *         password:
 *           type: string
 *           format: password
 *           example: secreto123
 *         sector:
 *           type: string
 *           enum: [Soporte, Gerencia]
 *           example: Soporte
 *
 *   responses:
 *     BadRequest:
 *       description: Datos de entrada inválidos o faltantes
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               ok:
 *                 type: boolean
 *                 example: false
 *               error:
 *                 type: string
 *                 example: El nombre y el email son obligatorios
 *
 *     Unauthorized:
 *       description: Credenciales inválidas o token de Firebase ausente/expirado
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               ok:
 *                 type: boolean
 *                 example: false
 *               error:
 *                 type: string
 *                 example: Credenciales inválidas
 *
 *     Forbidden:
 *       description: El usuario no tiene el rol requerido para realizar esta acción
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               ok:
 *                 type: boolean
 *                 example: false
 *               error:
 *                 type: string
 *                 example: 'Acceso denegado: solo usuarios con rol Soporte o Gerencia pueden eliminar clientes'
 *
 *     NotFound:
 *       description: El recurso solicitado no existe
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               ok:
 *                 type: boolean
 *                 example: false
 *               error:
 *                 type: string
 *                 example: Cliente no encontrado
 *
 *     InternalServerError:
 *       description: Error interno del servidor
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               ok:
 *                 type: boolean
 *                 example: false
 *               error:
 *                 type: string
 *                 example: Error interno del servidor
 */
