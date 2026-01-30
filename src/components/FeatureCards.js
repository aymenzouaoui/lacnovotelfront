import { useEffect, useRef, memo } from "react"
import "./FeatureCards.css"
import ProgressiveImage from "./ProgressiveImage"

// Memoize individual card to prevent unnecessary re-renders
const FeatureCard = memo(({ card, onClick }) => {
  return (
    <div
      className="novotel-v2-feature-card"
      onClick={() => onClick(card)}
      role="button"
      tabIndex={0}
      aria-label={card.title}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault()
          onClick(card)
        }
      }}
    >
      <div className="novotel-v2-feature-image">
        <ProgressiveImage
          src={card.image}
          alt={card.title}
          fallbackSrc={card.fallback || `/placeholder.svg?height=300&width=200&text=${encodeURIComponent(card.title)}`}
          placeholderColor="#1a1a2e"
        />
      </div>
      <div className="novotel-v2-feature-title">{card.title}</div>
      <div className="novotel-v2-feature-overlay">
        <div className="novotel-v2-feature-hover-text">Cliquez pour découvrir</div>
      </div>
    </div>
  )
})

FeatureCard.displayName = "FeatureCard"

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
          <FeatureCard
            key={card.id}
            card={card}
            onClick={handleCardClick}
          />
        ))}
      </div>
    </div>
  )
}

export default FeatureCards
