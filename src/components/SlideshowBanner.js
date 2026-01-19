import { useState, useEffect } from "react"
import "./SlideshowBanner.css"

const SlideshowBanner = ({ slides, autoRotateInterval = 5000, className = "" }) => {
  const [currentSlide, setCurrentSlide] = useState(0)

  useEffect(() => {
    if (slides.length <= 1) return
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, autoRotateInterval)
    return () => clearInterval(interval)
  }, [slides.length, autoRotateInterval])

  const handleSlideClick = (index) => {
    setCurrentSlide(index)
  }

  const handleBannerClick = () => {
    const currentSlideData = slides[currentSlide]
    if (currentSlideData.external) {
      window.open(currentSlideData.link, "_blank")
    } else if (currentSlideData.link) {
      window.location.href = currentSlideData.link
    }
  }

  return (
    <div className={`novotel-v2-commitment-slideshow-container ${className}`}>
      <div className="novotel-v2-commitment-slideshow">
        {slides.map((slide, index) => (
          <div
            key={slide.id || index}
            className={`novotel-v2-commitment-banner ${currentSlide === index ? "active" : ""}`}
            onClick={handleBannerClick}
            style={{
              backgroundImage: `url("${slide.image}")`,
            }}
            role="button"
            tabIndex={0}
            aria-label={slide.title || "Banner"}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault()
                handleBannerClick()
              }
            }}
          >
            <div className="novotel-v2-commitment-content">
              {slide.title && <h2>{slide.title}</h2>}
              {slide.description && <p>{slide.description}</p>}
            </div>
          </div>
        ))}
      </div>
      {slides.length > 1 && (
        <div className="novotel-v2-commitment-dots">
          {slides.map((_, index) => (
            <div
              key={index}
              className={`novotel-v2-dot ${currentSlide === index ? "active" : ""}`}
              onClick={() => handleSlideClick(index)}
              role="button"
              tabIndex={0}
              aria-label={`Go to slide ${index + 1}`}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault()
                  handleSlideClick(index)
                }
              }}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default SlideshowBanner
