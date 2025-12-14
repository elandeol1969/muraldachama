import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { getUsuarioLogado } from '../services/authService'
import { salvarMensagem, uploadImagemMensagem } from '../services/messageService'
import AuthModal from '../components/AuthModal'
import './MessageForm.css'

const MessageForm = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const editingMessage = location.state?.editingMessage

  const [user, setUser] = useState(null)
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [formData, setFormData] = useState({
    nome: '',
    mensagem: '',
    imagem: null
  })
  const [imagePreview, setImagePreview] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const currentUser = getUsuarioLogado()
    setUser(currentUser)

    if (!currentUser) {
      setShowAuthModal(true)
    } else {
      setFormData({
        nome: currentUser.nome_usuario || '',
        mensagem: editingMessage?.mensagem || '',
        imagem: null
      })

      if (editingMessage?.imagem_message) {
        setImagePreview(editingMessage.imagem_message)
      }
    }
  }, [editingMessage])

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError('A imagem deve ter no máximo 5MB')
        return
      }

      setFormData({ ...formData, imagem: file })
      
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result)
      }
      reader.readAsDataURL(file)
      setError('')
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!formData.mensagem.trim()) {
      setError('Por favor, digite sua mensagem')
      return
    }
    
    if (!formData.imagem && !imagePreview) {
      setError('Por favor, selecione uma imagem para sua mensagem')
      return
    }

    setLoading(true)
    setError('')

    try {
      let imageUrl = imagePreview

      if (formData.imagem) {
        const { data: uploadedUrl, error: uploadError } = await uploadImagemMensagem(formData.imagem)
        if (uploadError) {
          setError('Erro ao fazer upload da imagem')
          setLoading(false)
          return
        }
        imageUrl = uploadedUrl
      }

      const { error: saveError } = await salvarMensagem(user.id, {
        nome: formData.nome,
        mensagem: formData.mensagem,
        imagem: imageUrl
      })

      if (saveError) {
        setError('Erro ao salvar mensagem. Tente novamente.')
      } else {
        navigate('/')
        window.location.reload()
      }
    } catch (err) {
      setError('Ocorreu um erro. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  const handleAuthSuccess = (userData) => {
    setUser(userData)
    setShowAuthModal(false)
    setFormData({
      nome: userData.nome_usuario || '',
      mensagem: '',
      imagem: null
    })
  }

  if (showAuthModal) {
    return (
      <AuthModal
        onClose={() => navigate('/')}
        onSuccess={handleAuthSuccess}
      />
    )
  }

  return (
    <div className="message-form-page">
      <div className="form-container">
        <h2>✨ {editingMessage ? 'Editar' : 'Nova'} Mensagem ✨</h2>
        
        <form onSubmit={handleSubmit} className="message-form">
          <div className="form-group">
            <label>Nome/Apelido</label>
            <input
              type="text"
              value={formData.nome}
              onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
              maxLength={32}
              required
              placeholder="Como quer ser chamado?"
            />
            <span className="char-count">{formData.nome.length}/32</span>
          </div>

          <div className="form-group">
            <label>Mensagem</label>
            <textarea
              value={formData.mensagem}
              onChange={(e) => setFormData({ ...formData, mensagem: e.target.value })}
              maxLength={256}
              required
              placeholder="Digite sua mensagem motivacional..."
              className={formData.mensagem.length >= 256 ? 'char-limit' : ''}
            />
            <span className={`char-count ${formData.mensagem.length >= 256 ? 'char-limit' : ''}`}>
              {formData.mensagem.length}/256
            </span>
          </div>

          <div className="form-group">
            <label>Imagem da Mensagem</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="file-input"
            />
            {imagePreview && (
              <div className="image-preview">
                <img src={imagePreview} alt="Preview" />
                <button
                  type="button"
                  className="remove-image"
                  onClick={() => {
                    setImagePreview(null)
                    setFormData({ ...formData, imagem: null })
                  }}
                >
                  ×
                </button>
              </div>
            )}
          </div>

          <div className="form-info">
            <p>📅 Data/Hora: {new Date().toLocaleString('pt-BR')}</p>
          </div>

          {error && <div className="error-message">{error}</div>}

          <div className="form-actions">
            <button
              type="button"
              className="btn-cancel"
              onClick={() => navigate('/')}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="btn-submit"
              disabled={loading}
            >
              {loading ? 'Enviando...' : '🔥 Colar no Mural'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default MessageForm
