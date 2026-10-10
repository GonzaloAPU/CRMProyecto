import '../css/login.css'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { loginUsuario } from '../services/clienteService'

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [cargando, setCargando] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setCargando(true)
    try {
      const response = await loginUsuario({ email, password })
      if (response.data) {
        localStorage.setItem('usuarioCRM', JSON.stringify(response.data))
        navigate('/')
      }
    } catch (err) {
      setError(err.message || 'Error al iniciar sesión')
    } finally {
      setCargando(false)
    }
  }

  return (
    <div className="login-container">
      <form onSubmit={handleSubmit}>
        <h1>Iniciar Sesión</h1>

        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          required
          placeholder="ej: gerencia@neverloss.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <label htmlFor="password">Contraseña</label>
        <input
          id="password"
          type="password"
          required
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {error && <p>{error}</p>}

        <button type="submit" disabled={cargando}>
          {cargando ? 'Ingresando...' : 'Ingresar'}
        </button>
      </form>
    </div>
  )
}

export default Login
