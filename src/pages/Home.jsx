import { useState, useEffect, useCallback, useMemo } from 'react'
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

  const handleEdit = useCallback((message) => {
    navigate('/mensagem', { state: { editingMessage: message } })
  }, [navigate])

  const handleDelete = useCallback(async (messageId) => {
    if (window.confirm('Tem certeza que deseja remover sua mensagem do mural?')) {
      const { error } = await deletarMensagem(messageId)
      if (!error) {
        loadMessages()
      } else {
        alert('Erro ao deletar mensagem. Tente novamente.')
      }
    }
  }, [])

  const carouselMessages = useMemo(() => messages.slice(0, 9), [messages])

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Carregando mensagens...</p>
      </div>
    )
  }

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
