import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { getUsuarioLogado, logoutUsuario } from '../services/authService'
import './Header.css'

const Header = () => {
  const [user, setUser] = useState(null)
  const [showDropdown, setShowDropdown] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    setUser(getUsuarioLogado())
    
    // Listener para atualizações de usuário
    const handleUserUpdate = () => {
      setUser(getUsuarioLogado())
    }
    
    window.addEventListener('userUpdated', handleUserUpdate)
    
    return () => {
      window.removeEventListener('userUpdated', handleUserUpdate)
    }
  }, [])

  const handleLogout = () => {
    logoutUsuario()
    setUser(null)
    setShowDropdown(false)
    navigate('/', { replace: true })
  }

  return (
    <header className="header">
      <div className="header-container">
        <Link to="/" className="header-title">
          <span className="flame-icon">🔥</span>
          <h1>Mural da Chama</h1>
        </Link>

        <div className="header-actions">
          {user ? (
            <div className="user-menu">
              <div className="user-profile">
                <button 
                  className="user-avatar"
                  onClick={() => setShowDropdown(!showDropdown)}
                >
                  {user.imagem_usuario ? (
                    <img src={user.imagem_usuario} alt={user.nome_usuario} />
                  ) : (
                    <div className="avatar-placeholder">
                      {user.nome_usuario?.charAt(0).toUpperCase()}
                    </div>
                  )}
                </button>
                <span className="user-name-display">{user.nome_usuario}</span>
              </div>
              
              {showDropdown && (
                <div className="dropdown-menu">
                  <Link 
                    to="/perfil" 
                    className="dropdown-item"
                    onClick={() => setShowDropdown(false)}
                  >
                    Meus Dados
                  </Link>
                  <Link 
                    to="/mensagem" 
                    className="dropdown-item"
                    onClick={() => setShowDropdown(false)}
                  >
                    Minha Mensagem
                  </Link>
                  <button 
                    className="dropdown-item logout"
                    onClick={handleLogout}
                  >
                    Sair
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button 
              className="btn-primary"
              onClick={() => navigate('/mensagem')}
            >
              Registre sua Mensagem
            </button>
          )}
        </div>
      </div>
    </header>
  )
}

export default Header
