import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { handleRoutes } from './routes/index.js'
import { handleError } from './middleware/errorHandler.js'
import testRoutes from './routes/test.routes.js'
import { validateEnvironment } from './config/env.js'

dotenv.config({ path: fileURLToPath(new URL('./.env', import.meta.url)) })

export const createApp = () => {
  const app = express()
  app.use(cors())
  app.use(express.json())
  app.get('/', (_request, response) => {
    response.json({ message: 'API CRM funcionando correctamente' })
  })
  app.use('/api/test', testRoutes)
  app.use(handleRoutes)
  app.use((_request, response) => {
    response.status(404).json({ error: 'Ruta no encontrada' })
  })
  app.use(handleError)
  return app
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  try {
    const { port, firebase } = validateEnvironment()
    if (!firebase) {
      console.log('Firebase sin configurar: las rutas básicas están disponibles; la prueba de Firestore requiere credenciales.')
    }
    const app = createApp()
    const server = app.listen(port, () => {
      console.log(`Servidor funcionando en http://localhost:${port}`)
    })
    server.on('error', (error) => {
      console.error('No se pudo iniciar el servidor:', error.message)
      process.exitCode = 1
    })
  } catch (error) {
    console.error('No se pudo iniciar el servidor:', error.message)
    process.exitCode = 1
  }
}
