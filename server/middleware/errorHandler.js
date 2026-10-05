export const handleError = (error, _request, response, next) => {
  console.error(error)
  if (response.headersSent) {
    return next(error)
  }
  const status = error.status === 400 ? 400 : 500
  response.status(status).json({
    error: status === 400 ? 'Solicitud inválida' : 'Error interno del servidor',
  })
}
