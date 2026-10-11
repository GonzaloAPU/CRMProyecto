import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { fileURLToPath } from 'node:url';
import { join, dirname } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'CRM API',
      version: '1.0.0',
      description: 'Documentación de la API REST del sistema CRM. Gestión de clientes y usuarios con Firebase/Firestore.',
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Servidor de desarrollo',
      },
    ],
  },
  // Apunta a todos los archivos de rutas donde están los @swagger (en Windows los globs requieren '/')
  apis: [
    join(__dirname, '../routes/*.js').replace(/\\/g, '/'),
    './routes/*.js',
    './server/routes/*.js',
  ],
};

const swaggerSpec = swaggerJSDoc(options);

/**
 * Registra el middleware de Swagger UI en la app de Express.
 * Expone la documentación en GET /api/docs
 * @param {import('express').Application} app
 */
export const setupSwagger = (app) => {
  app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
    customSiteTitle: 'CRM API Docs',
    swaggerOptions: {
      persistAuthorization: true,
    },
  }));

  // Endpoint extra para obtener el JSON del spec (útil para testing / Postman)
  app.get('/api/docs.json', (_req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
  });

  console.log('📚 Swagger UI disponible en http://localhost:3000/api/docs');
};
