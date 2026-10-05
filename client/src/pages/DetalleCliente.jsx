import '../css/detallecliente.css'
import { Link } from 'react-router-dom'

const DetalleCliente = () => (
  <div className="detalle-cliente">
    <h1>Ficha del Cliente</h1>
    <p>Los datos del cliente no están disponibles hasta conectar un nuevo backend.</p>
    <Link to="/clientes">Volver a clientes</Link>
  </div>
)

export default DetalleCliente
