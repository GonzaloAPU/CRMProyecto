import { Router } from 'express'
import { getHealth } from '../controllers/healthController.js'

export const handleRoutes = Router()
handleRoutes.get('/api/health', getHealth)
