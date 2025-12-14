import { useState, useEffect } from 'react'
import { getUsuarioLogado } from '../services/authService'
import './MessageCard.css'

const CARD_COLORS = ['#ffeb3b', '#ff80ab', '#ccff90', '#80d8ff', '#ffd180']

const MessageCard = ({ message, onEdit, onDelete, index }) => {
  const [user, setUser] = useState(null)
  const cardColor = CARD_COLORS[index % CARD_COLORS.length]
  const isOwner = user && user.id === message.id

  useEffect(() => {
    setUser(getUsuarioLogado())
  }, [])

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div 
      className="message-card"
      style={{ backgroundColor: cardColor }}
    >
      {isOwner && (
        <div className="card-actions">
          <button 
            className="action-btn edit-btn"
            onClick={() => onEdit(message)}
            title="Editar"
          >
            ✏️
          </button>
          <button 
            className="action-btn delete-btn"
            onClick={() => onDelete(message.id)}
            title="Deletar"
          >
            🗑️
          </button>
        </div>
      )}

      <div className="card-header">
        <div className="user-info">
          {message.imagem_usuario ? (
            <img 
              src={message.imagem_usuario} 
              alt={message.nome_usuario}
              className="user-avatar-small"
            />
          ) : (
            <div className="user-avatar-small placeholder">
              {message.nome_usuario?.charAt(0).toUpperCase()}
            </div>
          )}
          <span className="user-name">{message.nome_usuario}</span>
        </div>
        <span className="card-date">{formatDate(message.created_at)}</span>
      </div>

      {message.mensagem && (
        <div className="card-message">
          <p>{message.mensagem}</p>
        </div>
      )}

      {message.imagem_message && (
        <div className="card-image">
          <img src={message.imagem_message} alt="Mensagem" />
        </div>
      )}

      <div className="card-pin"></div>
    </div>
  )
}

export default MessageCard
