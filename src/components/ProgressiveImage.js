import { useState, useEffect, useRef } from "react"
import "./ProgressiveImage.css"

/**
 * ProgressiveImage - Composant d'image avec chargement progressif
 * 
 * Features:
 * - Placeholder avec couleur ou blur pendant le chargement
 * - Transition fluide quand l'image est chargée
 * - Lazy loading avec Intersection Observer
 * - Gestion des erreurs avec fallback
 */
const ProgressiveImage = ({
  src,
  alt,
  className = "",
  placeholderColor = "#e0e0e0",
  fallbackSrc = "/placeholder.svg",
  style = {},
  onClick,
  ...props
}) => {
  const [isLoaded, setIsLoaded] = useState(false)
  const [isInView, setIsInView] = useState(false)
  const [hasError, setHasError] = useState(false)
  const imgRef = useRef(null)

  // Intersection Observer for lazy loading
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true)
          observer.disconnect()
        }
      },
      {
        rootMargin: "100px", // Start loading 100px before entering viewport
        threshold: 0.01
      }
    )

    if (imgRef.current) {
      observer.observe(imgRef.current)
    }

    return () => observer.disconnect()
  }, [])

  const handleLoad = () => {
    setIsLoaded(true)
  }

  const handleError = () => {
    setHasError(true)
    setIsLoaded(true)
  }

  const imageSrc = hasError ? fallbackSrc : src

  return (
    <div
      ref={imgRef}
      className={`progressive-image-container ${className}`}
      style={{ backgroundColor: placeholderColor, ...style }}
      onClick={onClick}
    >
      {/* Skeleton placeholder */}
      {!isLoaded && (
        <div className="progressive-image-skeleton">
          <div className="skeleton-shimmer"></div>
        </div>
      )}

      {/* Actual image - only load when in view */}
      {isInView && (
        <img
          src={imageSrc}
          alt={alt}
          className={`progressive-image ${isLoaded ? "loaded" : ""}`}
          onLoad={handleLoad}
          onError={handleError}
          loading="lazy"
          decoding="async"
          {...props}
        />
      )}
    </div>
  )
}

export default ProgressiveImage
