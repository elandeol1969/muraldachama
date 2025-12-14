import { useEffect, useState, memo, useCallback } from 'react'
import MessageCard from './MessageCard'
import './Carousel.css'

const Carousel = memo(({ messages, onEdit, onDelete }) => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const carouselMessages = messages.slice(0, 9) // Primeiras 9 para o carrossel

  const maxIndex = Math.max(0, carouselMessages.length - 1)

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

  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1))
  }, [maxIndex])

  const goToPrev = useCallback(() => {
    setCurrentIndex((prev) => (prev <= 0 ? maxIndex : prev - 1))
  }, [maxIndex])

  const handlePause = useCallback(() => setIsPaused(true), [])
  const handleResume = useCallback(() => setIsPaused(false), [])

  useEffect(() => {
    if (carouselMessages.length === 0 || isPaused) return

    const interval = setInterval(() => {
      goToNext()
    }, 5000)

    return () => clearInterval(interval)
  }, [carouselMessages.length, isPaused, goToNext])

  if (carouselMessages.length === 0) {
    return null
  }

  return (
    <div className="carousel-section">
      <h2 className="carousel-title">✨ Mensagens de Motivação em Destaque ✨</h2>
      <div className="carousel-wrapper">
        <div className="carousel-container">
          <div 
            className="carousel-track"
            style={{
              transform: isMobile 
                ? `translateX(-${currentIndex * 100}%)` 
                : `translateX(-${currentIndex * (256 + 26)}px)`
            }}
            onMouseEnter={handlePause}
            onMouseLeave={handleResume}
            onTouchStart={handlePause}
            onTouchEnd={handleResume}
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
        
        <div className="carousel-nav-container">
          <button 
            className="carousel-nav prev" 
            onClick={goToPrev}
            aria-label="Anterior"
          >
            ←
          </button>
          
          <button 
            className="carousel-nav next" 
            onClick={goToNext}
            aria-label="Próximo"
          >
            →
          </button>
        </div>
      </div>
      <div className="carousel-dots">
        {carouselMessages.map((_, index) => (
          <button
            key={index}
            className={`dot ${index === currentIndex ? 'active' : ''}`}
            onClick={() => setCurrentIndex(index)}
            aria-label={`Ir para slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  )
})

Carousel.displayName = 'Carousel'

export default Carousel
