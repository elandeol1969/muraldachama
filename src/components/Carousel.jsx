import { useEffect, useState } from 'react'
import MessageCard from './MessageCard'
import './Carousel.css'

const Carousel = ({ messages, onEdit, onDelete }) => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const carouselMessages = messages.slice(0, 9) // Primeiras 9 para o carrossel

  const maxIndex = Math.max(0, carouselMessages.length - 1)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const goToNext = () => {
    setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1))
  }

  const goToPrev = () => {
    setCurrentIndex((prev) => (prev <= 0 ? maxIndex : prev - 1))
  }

  useEffect(() => {
    if (carouselMessages.length === 0 || isPaused) return

    const interval = setInterval(() => {
      goToNext()
    }, 5000)

    return () => clearInterval(interval)
  }, [carouselMessages.length, currentIndex, isPaused])

  if (carouselMessages.length === 0) {
    return null
  }

  return (
    <div className="carousel-section">
      <h2 className="carousel-title">✨ Mensagens de Motivação em Destaque ✨</h2>
      <div className="carousel-wrapper">
        <button 
          className="carousel-nav prev" 
          onClick={goToPrev}
          aria-label="Anterior"
        >
          ←
        </button>
        
        <div className="carousel-container">
          <div 
            className="carousel-track"
            style={{
              transform: isMobile 
                ? `translateX(-${currentIndex * 100}%)` 
                : `translateX(-${currentIndex * (320 + 24)}px)`
            }}
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            onTouchStart={() => setIsPaused(true)}
            onTouchEnd={() => setIsPaused(false)}
          >
            {carouselMessages.map((message, index) => (
              <div key={message.id} className="carousel-item">
                <MessageCard
                  message={message}
                  onEdit={onEdit}
                  onDelete={onDelete}
                  index={index}
                />
              </div>
            ))}
          </div>
        </div>
        
        <button 
          className="carousel-nav next" 
          onClick={goToNext}
          aria-label="Próximo"
        >
          →
        </button>
      </div>
      <div className="carousel-dots">
        {carouselMessages.map((_, index) => (
          <button
            key={index}
            className={`dot ${index === currentIndex ? 'active' : ''}`}
            onClick={() => setCurrentIndex(index)}
          />
        ))}
      </div>
    </div>
  )
}

export default Carousel
