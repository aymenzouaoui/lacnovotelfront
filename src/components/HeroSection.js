import { useState, useEffect, memo } from "react"
import "./HeroSection.css"

const HeroSection = memo(({ 
  heroImages, 
  welcomeText, 
  scrollDownText, 
  currentLanguage, 
  onLanguageChange, 
  languages, 
  currentTime, 
  weatherData, 
  formatDate, 
  formatTime,
  isDarkMode,
  onToggleDarkMode
}) => {
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
          <div className="novotel-v2-hero-actions">
            <button 
              className="novotel-v2-theme-toggle" 
              onClick={onToggleDarkMode}
              aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
            >
              {isDarkMode ? (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
                </svg>
              ) : (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
                </svg>
              )}
            </button>
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
