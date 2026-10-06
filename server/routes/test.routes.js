import { Router } from 'express'
import { getTest, getFirestoreTest } from '../controllers/test.controller.js'

const router = Router()
router.get('/', getTest)
router.get('/firestore', getFirestoreTest)

export default router
