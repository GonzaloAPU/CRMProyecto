import { Routes, Route } from 'react-router-dom'
import Login from '../pages/Login'
import Dashboard from '../pages/Dashboard'
import ListaClientes from '../pages/ListaClientes'
import DetalleCliente from '../pages/DetalleCliente'
import ErrorPage from '../pages/ErrorPage'

const AppRoutes = () => (
  <Routes>
    <Route path="/login" element={<Login />} />
    <Route path="/" element={<Dashboard />} />
    <Route path="/clientes" element={<ListaClientes />} />
    <Route path="/clientes/:id" element={<DetalleCliente />} />
    <Route path="*" element={<ErrorPage />} />
  </Routes>
)

export default AppRoutes
