import { useEffect, useState } from "react"

const OffersPopup = ({
  show,
  offers,
  currentIndex,
  onClose,
  onNext,
  onPrev,
  titleFallback = "Découvrir nos offres",
  descriptionFallback = "Profitez de nos offres exclusives",
}) => {
  const hasOffers = !!offers && offers.length > 0
  const [resolvedImage, setResolvedImage] = useState("/images/offres_popup.jpg")
  const [touchStartX, setTouchStartX] = useState(null)
  const [progress, setProgress] = useState(0)
  const [slideDirection, setSlideDirection] = useState("right")

  useEffect(() => {
    const candidateOffer = hasOffers ? (offers[currentIndex] || offers[0]) : null
    const candidate = candidateOffer?.image
    if (!candidate) {
      setResolvedImage("/images/offres_popup.jpg")
      return
    }
    let cancelled = false
    const img = new Image()
    img.onload = () => {
      if (!cancelled) setResolvedImage(candidate)
    }
    img.onerror = () => {
      if (!cancelled) setResolvedImage("/images/offres_popup.jpg")
    }
    img.src = candidate
    return () => {
      cancelled = true
    }
  }, [hasOffers, offers, currentIndex])

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!show) return
      if (e.key === "ArrowRight") onNext && onNext()
      else if (e.key === "ArrowLeft") onPrev && onPrev()
      else if (e.key === "Escape") onClose && onClose()
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [show, onNext, onPrev, onClose])

  useEffect(() => {
    if (!show) {
      setProgress(0)
      return
    }
    setProgress(0)
    const rotationMs = 3000
    const stepMs = 100
    const step = (100 * stepMs) / rotationMs
    const id = setInterval(() => {
      setProgress((p) => {
        const np = p + step
        return np >= 100 ? 100 : np
      })
    }, stepMs)
    return () => clearInterval(id)
  }, [show, currentIndex])

  if (!hasOffers) return null

  const currentOffer = offers[currentIndex] || offers[0]
  const hasMultipleOffers = offers.length > 1
  const slideClass = slideDirection === "left" ? "slide-in-left" : "slide-in-right"
  const handleNext = () => {
    setSlideDirection("right")
    setProgress(0)
    onNext && onNext()
  }
  const handlePrev = () => {
    setSlideDirection("left")
    setProgress(0)
    onPrev && onPrev()
  }

  return (
    <div className={`novotel-v2-popup-overlay ${show ? "active" : ""} offers-popup-overlay ${show ? "" : "hidden"}`}>
      <div className={`novotel-v2-popup offers-popup-modal ${show ? "" : "hidden"}`}>
        <div className="offers-popup-progress">
          <div
            className="offers-popup-progress-bar"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div
          className="novotel-v2-popup-image offers-popup-image-wrapper"
          onTouchStart={(e) => setTouchStartX(e.touches[0]?.clientX ?? null)}
          onTouchEnd={(e) => {
            const endX = e.changedTouches[0]?.clientX ?? null
            if (touchStartX != null && endX != null) {
              const dx = endX - touchStartX
              if (dx > 40) handlePrev()
              else if (dx < -40) handleNext()
            }
            setTouchStartX(null)
          }}
        >
          <div
            className={`offers-popup-image ${slideClass}`}
            style={{ backgroundImage: `url("${resolvedImage}")` }}
          />
          {hasMultipleOffers && (
            <>
              <button
                className="offers-popup-nav-btn prev"
                aria-label="Offre précédente"
                onClick={handlePrev}
              >
                ‹
              </button>
              <button
                className="offers-popup-nav-btn next"
                aria-label="Offre suivante"
                onClick={handleNext}
              >
                ›
              </button>
            </>
          )}
          <button className="novotel-v2-popup-close offers-popup-close-btn" aria-label="Fermer le popup" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="novotel-v2-popup-content-wrapper offers-popup-content">
          <div className="novotel-v2-popup-title offers-popup-title">
            {currentOffer.title || titleFallback}
          </div>
          <div className="novotel-v2-popup-content offers-popup-description">
            {currentOffer.description || descriptionFallback}
          </div>
          <a href="/offres-client#" className="novotel-v2-popup-button offers-popup-cta">
            {titleFallback}
          </a>
          {hasMultipleOffers && (
            <div className="offers-popup-pagination">
              <div className="offers-popup-counter">
                {currentIndex + 1} / {offers.length}
              </div>
              <div className="offers-popup-dots" role="tablist" aria-label="Pagination des offres">
                {offers.map((_, idx) => (
                  <button
                    key={idx}
                    type="button"
                    className={`offers-popup-dot ${idx === currentIndex ? "active" : "inactive"}`}
                    role="tab"
                    aria-label={`Aller à l’offre ${idx + 1}`}
                    aria-selected={idx === currentIndex}
                    onClick={() => {
                      if (idx === currentIndex) return
                      if (idx > currentIndex) handleNext()
                      else handlePrev()
                    }}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default OffersPopup
