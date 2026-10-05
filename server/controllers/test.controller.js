import { getBackendStatus } from '../services/test.service.js'

export const getTest = (_request, response) => {
  response.json(getBackendStatus())
}
