import '../css/nav.css'
import { NavLink, useNavigate } from 'react-router-dom'
import { useState } from 'react'

const Nav = () => {
  const [usuario, setUsuario] = useState(() => {
    try {
      const sesion = localStorage.getItem('usuarioCRM')
      return sesion ? JSON.parse(sesion) : null
    } catch {
      return null
    }
  })
  const navigate = useNavigate()

  const handleLogout = () => {
    localStorage.removeItem('usuarioCRM')
    setUsuario(null)
    navigate('/login')
  }

  return (
    <nav className="nav">
      <ul className="nav-lista">
        <li>
          <NavLink to="/">
            Dashboard
          </NavLink>
        </li>
        <li>
          <NavLink to="/clientes">
            Clientes
          </NavLink>
        </li>
        <li>
          {usuario ? (
            <button
              onClick={handleLogout}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#d63384',
                fontWeight: 600,
                padding: '12px 25px',
                borderRadius: '30px',
                cursor: 'pointer'
              }}
              title="Cerrar sesión"
            >
              Salir ({usuario.sector})
            </button>
          ) : (
            <NavLink to="/login">
              Login
            </NavLink>
          )}
        </li>
      </ul>
    </nav>
  )
}

export default Nav