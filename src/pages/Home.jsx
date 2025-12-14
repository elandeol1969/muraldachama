import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { buscarMensagens, deletarMensagem } from '../services/messageService'
import Carousel from '../components/Carousel'
import Mural from '../components/Mural'
import './Home.css'

const Home = () => {
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    loadMessages()
  }, [])

  const loadMessages = async () => {
    setLoading(true)
    const { data, error } = await buscarMensagens()
    if (!error && data) {
      setMessages(data)
    }
    setLoading(false)
  }

  const handleEdit = (message) => {
    navigate('/mensagem', { state: { editingMessage: message } })
  }

  const handleDelete = async (messageId) => {
    if (window.confirm('Tem certeza que deseja remover sua mensagem do mural?')) {
      const { error } = await deletarMensagem(messageId)
      if (!error) {
        loadMessages()
      } else {
        alert('Erro ao deletar mensagem. Tente novamente.')
      }
    }
  }

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Carregando mensagens...</p>
      </div>
    )
  }

  const carouselMessages = messages.slice(0, 9)
  const muralMessages = messages.slice(9)

  return (
    <div className="home-page">
      {carouselMessages.length > 0 && (
        <Carousel 
          messages={carouselMessages}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}
      
      <Mural 
        messages={messages}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  )
}

export default Home
