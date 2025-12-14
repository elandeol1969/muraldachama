import MessageCard from './MessageCard'
import './Mural.css'

const Mural = ({ messages, onEdit, onDelete }) => {
  if (messages.length === 0) {
    return (
      <div className="mural-empty">
        <div className="empty-state">
          <span className="empty-icon">📝</span>
          <h3>Nenhuma mensagem ainda</h3>
          <p>Seja o primeiro a deixar sua marca no Mural da Chama!</p>
        </div>
      </div>
    )
  }

  return (
    <div className="mural-section">
      <h2 className="mural-title">🔥 Mural de Mensagens 🔥</h2>
      <div className="mural-grid">
        {messages.map((message, index) => (
          <MessageCard
            key={message.id}
            message={message}
            onEdit={onEdit}
            onDelete={onDelete}
            index={index}
          />
        ))}
      </div>
    </div>
  )
}

export default Mural
