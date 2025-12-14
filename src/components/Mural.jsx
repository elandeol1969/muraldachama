import { useState, useEffect, useRef, memo } from 'react'
import MessageCard from './MessageCard'
import './Mural.css'

const Mural = memo(({ messages, onEdit, onDelete }) => {
  const [currentPage, setCurrentPage] = useState(1)
  const [displayedMessages, setDisplayedMessages] = useState([])
  const [isMobile, setIsMobile] = useState(false)
  const [isInitialLoad, setIsInitialLoad] = useState(true)
  const observerTarget = useRef(null)
  const MESSAGES_PER_PAGE = 3

  // Detectar se é mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768)
    }
    
    let timeoutId
    const debouncedCheckMobile = () => {
      clearTimeout(timeoutId)
      timeoutId = setTimeout(checkMobile, 150)
    }
    
    checkMobile()
    window.addEventListener('resize', debouncedCheckMobile)
    
    return () => {
      clearTimeout(timeoutId)
      window.removeEventListener('resize', debouncedCheckMobile)
    }
  }, [])

  // Configurar mensagens iniciais
  useEffect(() => {
    if (isMobile) {
      // Mobile: carregar primeiras 3 mensagens
      setDisplayedMessages(messages.slice(0, MESSAGES_PER_PAGE))
      setCurrentPage(1)
    } else {
      // Desktop: carregar página atual
      const startIndex = (currentPage - 1) * MESSAGES_PER_PAGE
      const endIndex = startIndex + MESSAGES_PER_PAGE
      setDisplayedMessages(messages.slice(startIndex, endIndex))
    }
    
    // Marcar que o carregamento inicial foi concluído
    if (isInitialLoad && messages.length > 0) {
      setIsInitialLoad(false)
    }
  }, [messages, isMobile])

  // Atualizar mensagens quando a página muda (desktop)
  useEffect(() => {
    if (!isMobile && !isInitialLoad) {
      const startIndex = (currentPage - 1) * MESSAGES_PER_PAGE
      const endIndex = startIndex + MESSAGES_PER_PAGE
      setDisplayedMessages(messages.slice(startIndex, endIndex))
      
      // Scroll suave para o topo do mural apenas quando usuário muda de página
      document.querySelector('.mural-section')?.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start' 
      })
    }
  }, [currentPage])

  // Infinite scroll para mobile
  useEffect(() => {
    if (!isMobile) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadMoreMessages()
        }
      },
      { threshold: 0.1 }
    )

    if (observerTarget.current) {
      observer.observe(observerTarget.current)
    }

    return () => {
      if (observerTarget.current) {
        observer.unobserve(observerTarget.current)
      }
    }
  }, [isMobile, displayedMessages, messages])

  const loadMoreMessages = () => {
    const currentCount = displayedMessages.length
    if (currentCount < messages.length) {
      const nextMessages = messages.slice(0, currentCount + MESSAGES_PER_PAGE)
      setDisplayedMessages(nextMessages)
    }
  }

  const totalPages = Math.ceil(messages.length / MESSAGES_PER_PAGE)

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1)
    }
  }

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1)
    }
  }

  const handlePageClick = (pageNumber) => {
    setCurrentPage(pageNumber)
  }

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
        {displayedMessages.map((message, index) => (
          <MessageCard
            key={message.id}
            message={message}
            onEdit={onEdit}
            onDelete={onDelete}
            index={index}
          />
        ))}
      </div>

      {/* Paginação para Desktop */}
      {!isMobile && totalPages > 1 && (
        <div className="pagination-container">
          <button 
            className="pagination-btn pagination-prev"
            onClick={handlePrevPage}
            disabled={currentPage === 1}
            aria-label="Página anterior"
          >
            <span>←</span>
            <span className="pagination-btn-text">Anterior</span>
          </button>

          <div className="pagination-numbers">
            {[...Array(totalPages)].map((_, index) => {
              const pageNumber = index + 1
              return (
                <button
                  key={pageNumber}
                  className={`pagination-number ${currentPage === pageNumber ? 'active' : ''}`}
                  onClick={() => handlePageClick(pageNumber)}
                  aria-label={`Página ${pageNumber}`}
                  aria-current={currentPage === pageNumber ? 'page' : undefined}
                >
                  {pageNumber}
                </button>
              )
            })}
          </div>

          <button 
            className="pagination-btn pagination-next"
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
            aria-label="Próxima página"
          >
            <span className="pagination-btn-text">Próxima</span>
            <span>→</span>
          </button>
        </div>
      )}

      {/* Loading indicator para Mobile (infinite scroll) */}
      {isMobile && displayedMessages.length < messages.length && (
        <div ref={observerTarget} className="mobile-loader">
          <div className="spinner-small"></div>
          <p>Carregando mais mensagens...</p>
        </div>
      )}

      {/* Indicador de fim para Mobile */}
      {isMobile && displayedMessages.length >= messages.length && messages.length > MESSAGES_PER_PAGE && (
        <div className="mobile-end">
          <p>✨ Você viu todas as mensagens! ✨</p>
        </div>
      )}
    </div>
  )
})

Mural.displayName = 'Mural'

export default Mural

