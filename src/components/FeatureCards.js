import { useEffect, useRef } from "react"
import "./FeatureCards.css"

const FeatureCards = ({ cards }) => {
  const scrollContainerRef = useRef(null)

  useEffect(() => {
    const scrollContainer = scrollContainerRef.current
    if (!scrollContainer) return

    let isAutoScrolling = true
    const autoScroll = () => {
      if (!isAutoScrolling) return
      scrollContainer.scrollLeft += 0.5
      if (scrollContainer.scrollLeft >= scrollContainer.scrollWidth - scrollContainer.clientWidth) {
        setTimeout(() => {
          scrollContainer.scrollLeft = 0
        }, 2000)
      }
    }

    const scrollInterval = setInterval(autoScroll, 20)

    const handleMouseEnter = () => {
      isAutoScrolling = false
    }
    const handleMouseLeave = () => {
      isAutoScrolling = true
    }
    const handleScroll = () => {
      isAutoScrolling = false
      setTimeout(() => {
        isAutoScrolling = true
      }, 3000)
    }

    scrollContainer.addEventListener("mouseenter", handleMouseEnter)
    scrollContainer.addEventListener("mouseleave", handleMouseLeave)
    scrollContainer.addEventListener("scroll", handleScroll)

    return () => {
      clearInterval(scrollInterval)
      if (scrollContainer) {
        scrollContainer.removeEventListener("mouseenter", handleMouseEnter)
        scrollContainer.removeEventListener("mouseleave", handleMouseLeave)
        scrollContainer.removeEventListener("scroll", handleScroll)
      }
    }
  }, [])

  const handleCardClick = (card) => {
    if (card.url) {
      window.open(card.url, "_blank")
    } else if (card.path) {
      window.location.href = card.path
    }
  }

  return (
    <div className="novotel-v2-feature-cards-container">
      <div className="novotel-v2-feature-cards" ref={scrollContainerRef}>
        {cards.map((card) => (
          <div
            key={card.id}
            className="novotel-v2-feature-card"
            onClick={() => handleCardClick(card)}
            role="button"
            tabIndex={0}
            aria-label={card.title}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault()
                handleCardClick(card)
              }
            }}
          >
            <div className="novotel-v2-feature-image">
              <img
                loading="lazy"
                decoding="async"
                src={card.image || card.fallback}
                alt={card.title}
                onError={(e) => {
                  e.currentTarget.src =
                    card.fallback ||
                    `/placeholder.svg?height=300&width=200&text=${encodeURIComponent(card.title)}`
                }}
              />
            </div>
            <div className="novotel-v2-feature-title">{card.title}</div>
            <div className="novotel-v2-feature-overlay">
              <div className="novotel-v2-feature-hover-text">Cliquez pour découvrir</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default FeatureCards
