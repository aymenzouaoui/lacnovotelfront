import { useState, useEffect, memo } from "react"
import "./HeroSection.css"

const HeroSection = memo(({ heroImages, welcomeText, scrollDownText, currentLanguage, onLanguageChange, languages, currentTime, weatherData, formatDate, formatTime }) => {
  const [heroSlide, setHeroSlide] = useState(0)
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false)
  const [imagesLoaded, setImagesLoaded] = useState({})

  // Preload hero images with priority
  useEffect(() => {
    heroImages.forEach((src, index) => {
      const img = new Image()
      img.onload = () => {
        setImagesLoaded(prev => ({ ...prev, [index]: true }))
      }
      // First image has highest priority
      if (index === 0) {
        img.fetchPriority = "high"
      }
      img.src = src
    })
  }, [heroImages])

  useEffect(() => {
    const heroSlideTimer = setInterval(() => {
      setHeroSlide((prev) => (prev + 1) % heroImages.length)
    }, 7000)
    return () => clearInterval(heroSlideTimer)
  }, [heroImages.length])

  const getCurrentLanguage = () => languages.find((lang) => lang.code === currentLanguage)

  const scrollToContent = () => {
    const mainContent = document.querySelector(".novotel-v2-main-content")
    if (mainContent) {
      mainContent.scrollIntoView({ behavior: "smooth" })
    }
  }

  return (
    <div className="novotel-v2-hero">
      <div className="novotel-v2-hero-slideshow">
        {heroImages.map((image, index) => (
          <div
            key={index}
            className={`novotel-v2-hero-slide ${heroSlide === index ? "active" : ""} ${imagesLoaded[index] ? "loaded" : ""}`}
            style={{ backgroundImage: `url("${image}")` }}
          />
        ))}
      </div>
      <div className="novotel-v2-hero-overlay">
        <div className="novotel-v2-hero-header">
          <div className="novotel-v2-hero-date-time">
            <div className="novotel-v2-hero-date">{formatDate(currentTime)}</div>
            <div className="novotel-v2-hero-separator">|</div>
            <div className="novotel-v2-hero-time">{formatTime(currentTime)}</div>
            <div className="novotel-v2-hero-separator">|</div>
            <div className="novotel-v2-hero-temp">{weatherData.temp}</div>
          </div>
          <div 
            className="novotel-v2-hero-lang" 
            onClick={() => setShowLanguageDropdown(!showLanguageDropdown)}
            onBlur={() => setTimeout(() => setShowLanguageDropdown(false), 200)}
            tabIndex={0}
          >
            <span>{getCurrentLanguage()?.code.toUpperCase()}</span>
            <img
              src={getCurrentLanguage()?.flag || "/placeholder.svg"}
              alt={getCurrentLanguage()?.name}
              className="novotel-v2-flag"
            />
            {showLanguageDropdown && (
              <div className="language-dropdown">
                {languages.map((lang) => (
                  <div
                    key={lang.code}
                    className={`language-option ${currentLanguage === lang.code ? "active" : ""}`}
                    onClick={(e) => {
                      e.stopPropagation()
                      onLanguageChange(lang.code)
                      setShowLanguageDropdown(false)
                    }}
                  >
                    <img src={lang.flag || "/placeholder.svg"} alt={lang.name} className="flag-small" />
                    <span>{lang.name}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        <div className="novotel-v2-hero-content">
          <div className="novotel-v2-hero-logo">NOVOTEL</div>
          <div className="novotel-v2-hero-text">{welcomeText}</div>
        </div>
        <div className="novotel-v2-hero-scroll" onClick={scrollToContent} role="button" tabIndex={0} aria-label={scrollDownText}>
          <div className="novotel-v2-scroll-text">{scrollDownText}</div>
          <div className="novotel-v2-scroll-arrow">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M12 5L12 19M12 19L19 12M12 19L5 12"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>
      </div>
    </div>
  )
})

HeroSection.displayName = "HeroSection"

export default HeroSection
