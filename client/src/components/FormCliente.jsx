import '../css/formcliente.css'
import { Form, Button, Alert } from 'react-bootstrap'

const FormCliente = () => (
  <div className="formulario-cliente">
    <h3>Nuevo Cliente</h3>
    <Alert variant="info">
      La creación de clientes no está disponible hasta conectar un nuevo backend.
    </Alert>
    <Form>
      <fieldset disabled>
        {[
          ['Nombre', 'text'],
          ['Email', 'email'],
          ['Teléfono', 'text'],
          ['Ciudad', 'text'],
        ].map(([etiqueta, tipo]) => (
          <Form.Group className="mb-3" controlId={etiqueta} key={etiqueta}>
            <Form.Label>{etiqueta}</Form.Label>
            <Form.Control type={tipo} />
          </Form.Group>
        ))}
        <Button variant="primary" type="button" disabled>Guardar Cliente</Button>
      </fieldset>
    </Form>
  </div>
)

export default FormCliente
