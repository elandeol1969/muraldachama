import { useState } from 'react'
import { cadastrarUsuario, loginUsuario } from '../services/authService'
import './AuthModal.css'

const AuthModal = ({ onClose, onSuccess }) => {
  const [isLogin, setIsLogin] = useState(true)
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    senha: '',
    confirmarSenha: ''
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      if (isLogin) {
        const { data, error } = await loginUsuario(formData.email, formData.senha)
        if (error) {
          setError(error)
        } else {
          onSuccess(data)
        }
      } else {
        if (formData.senha !== formData.confirmarSenha) {
          setError('As senhas não coincidem')
          setLoading(false)
          return
        }

        if (formData.senha.length < 6) {
          setError('A senha deve ter pelo menos 6 caracteres')
          setLoading(false)
          return
        }

        const { data, error } = await cadastrarUsuario(
          formData.nome,
          formData.email,
          formData.senha
        )

        if (error) {
          setError(error)
        } else {
          // Faz login automático após cadastro
          const loginResult = await loginUsuario(formData.email, formData.senha)
          if (!loginResult.error) {
            onSuccess(loginResult.data)
          }
        }
      }
    } catch (err) {
      setError('Ocorreu um erro. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>×</button>
        
        <div className="modal-header">
          <h2>{isLogin ? 'Entrar' : 'Cadastrar'}</h2>
          <p>
            {isLogin ? 'Não tem conta? ' : 'Já tem conta? '}
            <button 
              className="toggle-btn"
              onClick={() => {
                setIsLogin(!isLogin)
                setError('')
                setFormData({ nome: '', email: '', senha: '', confirmarSenha: '' })
              }}
            >
              {isLogin ? 'Cadastre-se' : 'Entrar'}
            </button>
          </p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          {!isLogin && (
            <div className="form-group">
              <label>Nome</label>
              <input
                type="text"
                name="nome"
                value={formData.nome}
                onChange={handleChange}
                required
                maxLength={32}
                placeholder="Seu nome ou apelido"
              />
            </div>
          )}

          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="seu@email.com"
            />
          </div>

          <div className="form-group">
            <label>Senha</label>
            <input
              type="password"
              name="senha"
              value={formData.senha}
              onChange={handleChange}
              required
              minLength={6}
              placeholder="Mínimo 6 caracteres"
            />
          </div>

          {!isLogin && (
            <div className="form-group">
              <label>Confirmar Senha</label>
              <input
                type="password"
                name="confirmarSenha"
                value={formData.confirmarSenha}
                onChange={handleChange}
                required
                placeholder="Digite a senha novamente"
              />
            </div>
          )}

          {error && <div className="error-message">{error}</div>}

          <button 
            type="submit" 
            className="btn-submit"
            disabled={loading}
          >
            {loading ? 'Aguarde...' : (isLogin ? 'Entrar' : 'Cadastrar')}
          </button>
        </form>
      </div>
    </div>
  )
}

export default AuthModal
