import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getUsuarioLogado, atualizarUsuario, uploadImagem } from '../services/authService'
import './Profile.css'

const Profile = () => {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    senhaAtual: '',
    novaSenha: '',
    confirmarSenha: ''
  })
  const [avatarFile, setAvatarFile] = useState(null)
  const [avatarPreview, setAvatarPreview] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    const currentUser = getUsuarioLogado()
    if (!currentUser) {
      navigate('/')
      return
    }
    
    setUser(currentUser)
    setFormData({
      nome: currentUser.nome_usuario || '',
      email: currentUser.email_usuario || '',
      senhaAtual: '',
      novaSenha: '',
      confirmarSenha: ''
    })
    setAvatarPreview(currentUser.imagem_usuario)
  }, [navigate])

  const handleAvatarChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError('A imagem deve ter no máximo 5MB')
        return
      }

      setAvatarFile(file)
      
      const reader = new FileReader()
      reader.onloadend = () => {
        setAvatarPreview(reader.result)
      }
      reader.readAsDataURL(file)
      setError('')
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setLoading(true)

    try {
      const updateData = {
        nome_usuario: formData.nome,
        email_usuario: formData.email
      }

      // Upload de avatar se houver
      if (avatarFile) {
        const { data: avatarUrl, error: uploadError } = await uploadImagem(avatarFile, 'usuario')
        if (uploadError) {
          setError('Erro ao fazer upload da imagem')
          setLoading(false)
          return
        }
        updateData.imagem_usuario = avatarUrl
      }

      // Atualizar senha se fornecida
      if (formData.novaSenha) {
        if (formData.senhaAtual !== user.senha_usuario) {
          setError('Senha atual incorreta')
          setLoading(false)
          return
        }

        if (formData.novaSenha !== formData.confirmarSenha) {
          setError('As senhas não coincidem')
          setLoading(false)
          return
        }

        if (formData.novaSenha.length < 6) {
          setError('A nova senha deve ter pelo menos 6 caracteres')
          setLoading(false)
          return
        }

        updateData.senha_usuario = formData.novaSenha
      }

      const { data, error: updateError } = await atualizarUsuario(user.id, updateData)

      if (updateError) {
        setError('Erro ao atualizar perfil')
      } else {
        // Atualizar usuário no localStorage
        const updatedUser = { ...user, ...data }
        localStorage.setItem('user', JSON.stringify(updatedUser))
        
        // Disparar evento para atualizar Header
        window.dispatchEvent(new Event('userUpdated'))
        
        setUser(updatedUser)
        setSuccess('Perfil atualizado com sucesso!')
        setFormData({
          ...formData,
          senhaAtual: '',
          novaSenha: '',
          confirmarSenha: ''
        })
        setAvatarFile(null)
        
        // Redirecionar para home após 1.5s
        setTimeout(() => {
          navigate('/', { replace: true })
        }, 1500)
      }
    } catch (err) {
      setError('Ocorreu um erro. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  if (!user) {
    return null
  }

  return (
    <div className="profile-page">
      <div className="profile-container">
        <h2>👤 Meus Dados</h2>

        <form onSubmit={handleSubmit} className="profile-form">
          <div className="avatar-section">
            <div className="avatar-display">
              {avatarPreview ? (
                <img src={avatarPreview} alt="Avatar" />
              ) : (
                <div className="avatar-placeholder-large">
                  {formData.nome.charAt(0).toUpperCase()}
                </div>
              )}
            </div>
            <label className="avatar-upload">
              <input
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                hidden
              />
              <span>Alterar Foto</span>
            </label>
          </div>

          <div className="form-group">
            <label>Nome/Apelido</label>
            <input
              type="text"
              value={formData.nome}
              onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
              maxLength={32}
              required
            />
          </div>

          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
          </div>

          <div className="divider">
            <span>Alterar Senha</span>
          </div>

          <div className="form-group">
            <label>Senha Atual</label>
            <input
              type="password"
              value={formData.senhaAtual}
              onChange={(e) => setFormData({ ...formData, senhaAtual: e.target.value })}
              placeholder="Digite sua senha atual"
            />
          </div>

          <div className="form-group">
            <label>Nova Senha</label>
            <input
              type="password"
              value={formData.novaSenha}
              onChange={(e) => setFormData({ ...formData, novaSenha: e.target.value })}
              placeholder="Mínimo 6 caracteres"
              minLength={6}
            />
          </div>

          <div className="form-group">
            <label>Confirmar Nova Senha</label>
            <input
              type="password"
              value={formData.confirmarSenha}
              onChange={(e) => setFormData({ ...formData, confirmarSenha: e.target.value })}
              placeholder="Digite a nova senha novamente"
            />
          </div>

          {error && <div className="error-message">{error}</div>}
          {success && <div className="success-message">{success}</div>}

          <div className="form-actions">
            <button
              type="button"
              className="btn-cancel"
              onClick={() => navigate('/')}
            >
              Voltar
            </button>
            <button
              type="submit"
              className="btn-submit"
              disabled={loading}
            >
              {loading ? 'Salvando...' : 'Salvar Alterações'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Profile
