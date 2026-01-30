import "./SkeletonLoader.css"

/**
 * SkeletonLoader - Composant de chargement squelette
 * 
 * Améliore la perception de performance en montrant
 * un placeholder animé pendant le chargement du contenu
 */

// Skeleton de base
export const Skeleton = ({ 
  width = "100%", 
  height = "20px", 
  borderRadius = "4px",
  className = "",
  style = {}
}) => (
  <div 
    className={`skeleton ${className}`}
    style={{ width, height, borderRadius, ...style }}
  />
)

// Skeleton pour les cartes de services
export const ServiceCardSkeleton = () => (
  <div className="skeleton-service-card">
    <div className="skeleton-service-image" />
    <div className="skeleton-service-content">
      <Skeleton height="24px" width="80%" />
      <Skeleton height="16px" width="60%" style={{ marginTop: "8px" }} />
    </div>
  </div>
)

// Skeleton pour les feature cards (scroll horizontal)
export const FeatureCardSkeleton = () => (
  <div className="skeleton-feature-card">
    <div className="skeleton-feature-image" />
    <div className="skeleton-feature-title" />
  </div>
)

// Skeleton pour les bannières
export const BannerSkeleton = () => (
  <div className="skeleton-banner">
    <div className="skeleton-banner-content">
      <Skeleton height="32px" width="60%" />
      <Skeleton height="18px" width="40%" style={{ marginTop: "12px" }} />
    </div>
  </div>
)

// Skeleton pour la section Hero
export const HeroSkeleton = () => (
  <div className="skeleton-hero">
    <div className="skeleton-hero-overlay">
      <div className="skeleton-hero-header">
        <Skeleton width="150px" height="20px" borderRadius="10px" />
        <Skeleton width="60px" height="30px" borderRadius="15px" />
      </div>
      <div className="skeleton-hero-content">
        <Skeleton width="200px" height="48px" borderRadius="8px" />
        <Skeleton width="280px" height="24px" borderRadius="4px" style={{ marginTop: "16px" }} />
      </div>
      <div className="skeleton-hero-scroll">
        <Skeleton width="120px" height="16px" borderRadius="4px" />
        <Skeleton width="24px" height="24px" borderRadius="50%" style={{ marginTop: "8px" }} />
      </div>
    </div>
  </div>
)

// Skeleton pour les stats cards
export const StatCardSkeleton = () => (
  <div className="skeleton-stat-card">
    <Skeleton width="50px" height="50px" borderRadius="50%" />
    <div className="skeleton-stat-info">
      <Skeleton height="28px" width="60px" />
      <Skeleton height="14px" width="100px" style={{ marginTop: "8px" }} />
    </div>
  </div>
)

// Groupe de Feature Cards Skeleton
export const FeatureCardsGroupSkeleton = ({ count = 5 }) => (
  <div className="skeleton-feature-cards-group">
    {Array.from({ length: count }).map((_, i) => (
      <FeatureCardSkeleton key={i} />
    ))}
  </div>
)

// Home page skeleton complet
export const HomePageSkeleton = () => (
  <div className="skeleton-home-page">
    <HeroSkeleton />
    <div className="skeleton-home-content">
      <BannerSkeleton />
      <FeatureCardsGroupSkeleton count={5} />
      <BannerSkeleton />
    </div>
  </div>
)

export default {
  Skeleton,
  ServiceCardSkeleton,
  FeatureCardSkeleton,
  BannerSkeleton,
  HeroSkeleton,
  StatCardSkeleton,
  FeatureCardsGroupSkeleton,
  HomePageSkeleton
}
