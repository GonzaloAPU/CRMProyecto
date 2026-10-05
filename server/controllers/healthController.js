export const getHealth = (_request, response) => {
  response.json({ status: 'ok', service: 'crm-server' })
}
