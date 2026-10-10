import '../css/formcliente.css'
import { useState } from 'react'
import { Form, Button, Alert } from 'react-bootstrap'
import { crearCliente } from '../services/clienteService'

const FormCliente = ({ onClienteCreado }) => {
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    telefono: '',
    estado: 'pendiente',
    montoPresupuesto: ''
  })
  const [cargando, setCargando] = useState(false)
  const [mensaje, setMensaje] = useState(null)
  const [error, setError] = useState(null)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setCargando(true)
    setError(null)
    setMensaje(null)

    try {
      const payload = {
        ...formData,
        montoPresupuesto: formData.montoPresupuesto === '' ? 0 : Number(formData.montoPresupuesto)
      }
      await crearCliente(payload)
      setMensaje('Cliente guardado exitosamente en la base de datos.')
      setFormData({
        nombre: '',
        email: '',
        telefono: '',
        estado: 'pendiente',
        montoPresupuesto: ''
      })
      if (onClienteCreado) {
        onClienteCreado()
      }
    } catch (err) {
      setError(err.message || 'No se pudo guardar el cliente.')
    } finally {
      setCargando(false)
    }
  }

  return (
    <div className="formulario-cliente">
      <h3>Nuevo Cliente</h3>
      {mensaje && <Alert variant="success">{mensaje}</Alert>}
      {error && <Alert variant="danger">{error}</Alert>}

      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3" controlId="formNombre">
          <Form.Label>Nombre y Apellido / Razón Social</Form.Label>
          <Form.Control
            type="text"
            name="nombre"
            required
            value={formData.nombre}
            onChange={handleChange}
            placeholder="Ej: Distribuidora Jujuy SRL"
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formEmail">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            name="email"
            required
            value={formData.email}
            onChange={handleChange}
            placeholder="contacto@empresa.com"
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formTelefono">
          <Form.Label>Teléfono</Form.Label>
          <Form.Control
            type="text"
            name="telefono"
            required
            value={formData.telefono}
            onChange={handleChange}
            placeholder="388-1234567"
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formEstado">
          <Form.Label>Estado Inicial</Form.Label>
          <Form.Select
            name="estado"
            value={formData.estado}
            onChange={handleChange}
          >
            <option value="pendiente">Pendiente</option>
            <option value="en curso">En Curso</option>
            <option value="finalizado">Finalizado</option>
            <option value="descartado">Descartado</option>
          </Form.Select>
        </Form.Group>

        <Form.Group className="mb-3" controlId="formMonto">
          <Form.Label>Monto de Presupuesto (ARS)</Form.Label>
          <Form.Control
            type="number"
            name="montoPresupuesto"
            value={formData.montoPresupuesto}
            onChange={handleChange}
            placeholder="0"
            min="0"
          />
        </Form.Group>

        <Button variant="primary" type="submit" disabled={cargando}>
          {cargando ? 'Guardando en servidor...' : 'Guardar Cliente'}
        </Button>
      </Form>
    </div>
  )
}

export default FormCliente