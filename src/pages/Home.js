"use client"

import { useState, useEffect, useMemo, useRef, lazy, Suspense } from "react"
import "./home-client-v21.css"
import API from "../services/api"
import HeroSection from "../components/HeroSection"
import { useTheme } from "../context/ThemeContext"

// Lazy load components that are not critical for initial render
const OffersPopup = lazy(() => import("../components/OffersPopup"))
const FeatureCards = lazy(() => import("../components/FeatureCards"))
const SlideshowBanner = lazy(() => import("../components/SlideshowBanner"))
const SocialLinks = lazy(() => import("../components/SocialLinks"))
const FooterNavigation = lazy(() => import("../components/FooterNavigation"))
const Copyright = lazy(() => import("../components/Copyright"))

const translations = {
  fr: {
    // Hero section
    welcome: "Bienvenue au Novotel Tunis Lac",
    scrollDown: "DÉFILER VERS LE BAS",

    // Main banners
    coffeeCup: "UNE TASSE DE CAFÉ",
    forYourReview: "POUR VOTRE AVIS",
    clickImageReview: "Cliquez sur l'image et laissez votre avis",
    discoverOur: "DÉCOUVREZ NOS",
    restaurants: "RESTAURANTS",
    exploreSpecialties: "Explorez nos spécialités culinaires et notre gastronomie",
    relaxAt: "DÉTENDEZ-VOUS À",
    ourSkyLounge: "NOTRE TERRASSE PISCINE",
    panoramicView: "Profitez d'une vue panoramique avec des boissons premium",

    // Feature cards
    eat: "Restaurant",
    drink: "Bar",
    relax: "Terrasse Piscine",
    room: "Chambre",
    wellness: "IN BALANCE",
    events: "Événements",
    services: "S'informer",
    roomService: "Restauration en chambre",
    business: "Meeting",
    feedback: "Avis",

    environmentalPolicy: "Politique environnementale",
    sustainablePractices: "S'engage pour la protection des océans",
    accorLoyalty: "Programme de fidélité ALL",
    accorDescription: "Rejoignez ALL et profitez d'avantages exclusifs",
    ourCommitment: "Nos Engagements",
    commitmentDescription: "Notre Politique",

    // Navigation
    home: "Accueil",
    bar: "Bar",
    spa: "Spa",

    // Popup
    specialOffers: "Offres Spéciales",
    discoverPromotions:
      "Découvrez nos promotions exclusives et profitez de réductions exceptionnelles sur votre séjour. Réservez maintenant et économisez jusqu'à 30% !",
    discoverOffers: "Découvrir les offres",

    // Footer
    allRightsReserved: "Tous droits réservés",
    createdBy: "Créé par",

    // New translations for feedback slides
    giveUsFeedback: "Donnez nous votre avis",
    skipCleans: "Skip the clean",

    // À propos de l'hôtel
    aboutHotel: "À propos de l'hôtel",

    // Loading
    loadingInProgress: "Chargement en cours...",
    loading: "Chargement...",
  },

  en: {
    // Hero section
    welcome: "Welcome to Novotel Tunis Lac",
    scrollDown: "SCROLL DOWN",

    // Main banners
    coffeeCup: "A CUP OF COFFEE",
    forYourReview: "FOR YOUR REVIEW",
    clickImageReview: "Click on the image and leave your review",
    discoverOur: "DISCOVER OUR",
    restaurants: "RESTAURANTS",
    exploreSpecialties: "Explore our culinary specialties and gastronomy",
    relaxAt: "RELAX AT",
    ourSkyLounge: "OUR POOL TERRACE",
    panoramicView: "Enjoy panoramic views with premium drinks",

    // Feature cards
    eat: "Restaurant",
    drink: "Bar",
    relax: "Pool Terrace",
    room: "Room",
    wellness: "IN BALANCE",
    events: "Events",
    services: "Inform",
    roomService: "in-room catering",
    business: "Meeting ",
    feedback: "Feedback",

    environmentalPolicy: "Environmental Policy",
    sustainablePractices: "Engaged in Ocean Protection",
    accorLoyalty: "ALL Loyalty Program",
    accorDescription: "Join ALL and enjoy exclusive benefits",
    ourCommitment: "Our Commitments",
    commitmentDescription: "Our Policy",

    // Navigation
    home: "Home",
    bar: "Bar",
    spa: "Spa",

    // Popup
    specialOffers: "Special Offers",
    discoverPromotions:
      "Discover our exclusive promotions and enjoy exceptional discounts on your stay. Book now and save up to 30%!",
    discoverOffers: "Discover Offers",

    // Footer
    allRightsReserved: "All rights reserved",
    createdBy: "Created by",

    // New translations for feedback slides
    giveUsFeedback: "Give us your feedback",
    skipCleans: "Skip the clean",

    // About the hotel
    aboutHotel: "About the hotel",

    // Loading
    loadingInProgress: "Loading...",
    loading: "Loading...",
  },

  ar: {
    // Hero section 
    welcome: "مرحباً بكم في نوفوتيل تونس لاك",
    scrollDown: "انتقل للأسفل",

    // Main banners
    coffeeCup: "فنجان قهوة",
    forYourReview: "لرأيكم",
    clickImageReview: "انقر على الصورة واترك رأيك",
    discoverOur: "اكتشف",
    restaurants: "مطاعمنا",
    exploreSpecialities: "استكشف تخصصاتنا الطهوية وفن الطبخ لدينا",
    relaxAt: "استرخ في",
    ourSkyLounge: "تراس المسبح",
    panoramicView: "استمتع بإطلالة بانورامية مع المشروبات المميزة",

    // Feature cards
    eat: "مطاعم ",
    drink: "حانة",
    relax: "تراس المسبح",
    room: "غرفة",
    wellness: "منتجع",
    events: "فعاليات",
    services: "خدمات",
    roomService: "خدمة الغرف",
    business: "أعمال",
    feedback: "آراء",

    environmentalPolicy: "السياسة البيئية",
    sustainablePractices: "ممارسات مستدامة لمستقبل أفضل",
    accorLoyalty: "برنامج الولاء ALL",
    accorDescription: "انضم إلى ALL واستمتع بمزايا حصرية",
    ourCommitment: "التزامنا",
    commitmentDescription: "سياساتنا",

    // Navigation
    home: "الرئيسية",
    bar: "البار",
    spa: "السبا",

    // Popup
    specialOffers: "عروض نوفوتيل الخاصة",
    discoverPromotions: "اكتشف عروضنا الحصرية واستمتع بخصومات استثنائية على إقامتك. احجز الآن ووفر حتى 30%!",
    discoverOffers: "اكتشف العروض",

    // Footer
    allRightsReserved: "جميع الحقوق محفوظة",
    createdBy: "تم إنشاؤه بواسطة",

    // New translations for feedback slides
    giveUsFeedback: "أعطنا رأيك",
    skipCleans: "تخطي التنظيف",

    // À propos de l'hôtel
    aboutHotel: "نبذة عن الفندق",

    // Loading
    loadingInProgress: "جاري التحميل...",
    loading: "تحميل...",
  },
}

const languages = [
  { code: "fr", name: "Français", flag: "/images/fr-flag-v2.png" },
  { code: "en", name: "English", flag: "/images/en-flag-v2.png" },
  { code: "ar", name: "العربية", flag: "/images/ar-flag-v2.png" },
]

const HomeClient = () => {
  const [currentTime, setCurrentTime] = useState(new Date())
  const [showPopup, setShowPopup] = useState(false)
  const [popupOffers, setPopupOffers] = useState([])
  const [popupOfferIndex, setPopupOfferIndex] = useState(0)
  const [currentLanguage, setCurrentLanguage] = useState("fr")
  const [weatherData, setWeatherData] = useState({ temp: "18°C", loading: true })
  const [videoMuted, setVideoMuted] = useState(true)
  const [videoReady, setVideoReady] = useState(false)
  const videoRef = useRef(null)
  const { isDark: isDarkMode } = useTheme()

  // Get translation function
  const t = (key) => translations[currentLanguage][key] || translations.fr[key] || key

  // Images du diaporama principal
  const heroImages = ["/images/hotel-lobby4-v4.jpg"]

  // Critical images to preload
  const criticalImages = useMemo(() => [
    ...heroImages,
    "/images/restaurant.jpg",
    "/images/bar.jpg",
    "/images/terrasse-piscine.jpg",
    "/images/chambrehotel.jpg",
    "/images/seminaire.jpg",
    "/images/chambre.jpg",
    "/images/loisir.jpg",
    "/images/spa.jpg",
    "/images/feedback.webp"
  ], [])

  // Preload images in background (non-blocking - cache warming only)
  useEffect(() => {
    criticalImages.forEach((src) => {
      const img = new Image()
      img.src = src
    })
  }, [criticalImages])

  const commitmentSlides = useMemo(() => [
    {
      id: "environmental",
      title: t("environmentalPolicy"),
      description: t("sustainablePractices"),
      image: "/images/commitment.png",
      link: "/policy-client",
    },
    {
      id: "accor",
      title: "",
      description: "",
      image: "/images/accor.png",
      link: "https://all.accor.com/loyalty-program/reasonstojoin/index.en.shtml",
      external: true,
    },
    {
      id: "commitment",
      title: t("ourCommitment"),
      description: t("commitmentDescription"),
      image: "/images/commitment2.png",
      link: "/commitment",
    },
  ], [currentLanguage])

  // Function to fetch weather data for Tunis with timeout to avoid blocking
  const fetchWeatherData = async () => {
    try {
      // Use AbortController for timeout
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 3000) // 3 second timeout
      
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=Tunis,TN&appid=b56ce80f1e74973836f961ebb25d8704&units=metric`,
        { signal: controller.signal }
      )
      
      clearTimeout(timeoutId)
      
      if (response.ok) {
        const data = await response.json()
        setWeatherData({
          temp: `${Math.round(data.main.temp)}°C`,
          loading: false,
        })
      } else {
        setWeatherData({ temp: "22°C", loading: false })
      }
    } catch (error) {
      // Set default value immediately if fetch fails
      setWeatherData({ temp: "22°C", loading: false })
    }
  }

  useEffect(() => {
    // Load saved language from localStorage first (synchronous, fast)
    const savedLanguage = localStorage.getItem("novotel-language")
    if (savedLanguage && translations[savedLanguage]) {
      setCurrentLanguage(savedLanguage)
    }

    // Update time every minute
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 60000)

    // Fetch weather data with delay to not block initial render
    const weatherTimeout = setTimeout(() => {
      fetchWeatherData()
    }, 500) // Wait 500ms before fetching weather

    return () => {
      clearInterval(timer)
      clearTimeout(weatherTimeout)
    }
  }, [])

  useEffect(() => {
    let popupTimer
    // Delay offers fetch to not block initial render
    const fetchActiveOffers = async () => {
      try {
        const res = await API.get("/offres")
        const validOffers = (res.data || []).filter((offer) => offer.active === true || offer.active === undefined)
        if (validOffers.length > 0) {
          setPopupOffers(validOffers)
          setPopupOfferIndex(0)
          popupTimer = setTimeout(() => {
            setShowPopup(true)
          }, 3000)
        }
      } catch (error) {
        console.error("Erreur chargement des offres pour le popup:", error)
      }
    }
    
    // Fetch offers after initial render to improve perceived performance
    const offersTimeout = setTimeout(() => {
      fetchActiveOffers()
    }, 1000) // Wait 1 second before fetching offers
    
    return () => {
      if (popupTimer) {
        clearTimeout(popupTimer)
      }
      clearTimeout(offersTimeout)
    }
  }, [])

  useEffect(() => {
    if (!showPopup || popupOffers.length <= 1) return
    const interval = setInterval(() => {
      setPopupOfferIndex((prev) => (prev + 1) % popupOffers.length)
    }, 3000)
    return () => clearInterval(interval)
  }, [showPopup, popupOffers.length])


  // Language change handler
  const changeLanguage = (langCode) => {
    setCurrentLanguage(langCode)
    localStorage.setItem("novotel-language", langCode)

    // Update document direction for Arabic
    document.documentElement.dir = langCode === "ar" ? "rtl" : "ltr"
    document.documentElement.lang = langCode
  }

  const formatDate = (date) => {
    const locale = currentLanguage === "ar" ? "ar-TN" : currentLanguage === "en" ? "en-US" : "fr-FR"
    return date
      .toLocaleDateString(locale, {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      })
      .replace(/\//g, ".")
  }

  const formatTime = (date) => {
    const locale = currentLanguage === "ar" ? "ar-TN" : currentLanguage === "en" ? "en-US" : "fr-FR"
    return date.toLocaleTimeString(locale, {
      hour: "2-digit",
      minute: "2-digit",
    })
  }


  const handleNextPopupOffer = () => {
    if (popupOffers.length <= 1) return
    setPopupOfferIndex((prev) => (prev + 1) % popupOffers.length)
  }

  const handlePrevPopupOffer = () => {
    if (popupOffers.length <= 1) return
    setPopupOfferIndex((prev) => (prev - 1 + popupOffers.length) % popupOffers.length)
  }
  // Memoize feature cards to avoid recalculation on every render
  const getAllFeatureCards = useMemo(() => [
    // À propos – masqué pour le moment
    // {
    //   id: "apropos",
    //   title: t("aboutHotel"),
    //   image: "/images/apropos.webp",
    //   fallback: "/images/apropos.jpg",
    //   path: "/livret-client",
    // },
    {
      id: "restaurants",
      title: t("eat"),
      image: "/images/restaurant.jpg",
      fallback: "/placeholder.svg?height=300&width=200&text=Restaurant",
      path: "/RestaurantsMenus-client",
    },
    {
      id: "boisson",
      title: t("drink"),
      image: "/images/bar.jpg",
      fallback: "/placeholder.svg?height=300&width=200&text=Bar",
      path: "/boissons-client",
    },
    {
      id: "terrassepiscine",
      title: t("relax"),
      image: "/images/terrasse-piscine.jpg",
      fallback: "/placeholder.svg?height=300&width=200&text=Terrasse+Piscine",
      path: "/terrasse-piscine-client",
    },
    {
      id: "chambre",
      title: t("room"),
      image: "/images/chambrehotel.jpg",
      fallback: "/placeholder.svg?height=300&width=200&text=Chambre",
      path: "/chambres-client",
    },
    {
      id: "seminaire",
      title: t("business"),
      image: "/images/seminaire.jpg",
      fallback: "/placeholder.svg?height=300&width=200&text=Business",
      path: "/seminaires-client",
    },
    {
      id: "roomservice",
      title: t("roomService"),
      image: "/images/chambre.jpg",
      fallback: "/placeholder.svg?height=300&width=200&text=Room+Service",
      path: "/roomservices-client",
    },
    {
      id: "services",
      title: t("services"),
      image: "/images/loisir.jpg",
      fallback: "/placeholder.svg?height=300&width=200&text=Services",
      path: "/loisirs-client",
    },
    {
      id: "spa",
      title: t("wellness"),
      image: "/images/spa.jpg",
      fallback: "/placeholder.svg?height=300&width=200&text=Spa",
      path: "/spas-client",
    },
    {
      id: "feedback",
      title: t("feedback"),
      image: "/images/feedback.webp",
      fallback: "/placeholder.svg?height=300&width=200&text=Feedback",
      url: "https://tinyurl.com/ydpjnzt7",
    },
   
  ], [currentLanguage])

  return (
    <div className={`novotel-v2-app ${currentLanguage === "ar" ? "rtl" : "ltr"}`}>
      {/* Hero Section with Background Slideshow */}
      <HeroSection
        heroImages={heroImages}
        welcomeText={t("welcome")}
        scrollDownText={t("scrollDown")}
        currentLanguage={currentLanguage}
        onLanguageChange={changeLanguage}
        languages={languages}
        currentTime={currentTime}
        weatherData={weatherData}
        formatDate={formatDate}
        formatTime={formatTime}
      />

      <main className="novotel-v2-main">
        <div className="novotel-v2-main-content">
          {/* Hotel Video */}
          <div className={`novotel-v2-video-container${videoReady ? " ready" : ""}${videoMuted ? "" : " unmuted"}`}>
            <video
              ref={videoRef}
              src="https://novotel-tunis.com/uploads/events/Novotel%20Tunis%20lac.mp4"
              autoPlay
              muted={videoMuted}
              loop
              playsInline
              className="novotel-v2-video"
              onCanPlay={() => setVideoReady(true)}
            />
            <div className="novotel-v2-video-overlay">
              <div className="novotel-v2-video-info">
                <span className="novotel-v2-video-label">Novotel Tunis Lac</span>
              </div>
              <button
                className="novotel-v2-video-mute-btn"
                onClick={() => setVideoMuted((m) => !m)}
                aria-label={videoMuted ? "Activer le son" : "Couper le son"}
              >
                {videoMuted ? (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                    <line x1="23" y1="9" x2="17" y2="15" /><line x1="17" y1="9" x2="23" y2="15" />
                  </svg>
                ) : (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                    <path d="M19.07 4.93a10 10 0 0 1 0 14.14" /><path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* Feature Cards with Horizontal Scroll - Lazy loaded */}
          <Suspense fallback={<div style={{ minHeight: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{t("loading")}</div>}>
            <FeatureCards cards={getAllFeatureCards} />
          </Suspense>

          {/* Commitment Slideshow - Lazy loaded */}
          <Suspense fallback={<div style={{ minHeight: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{t("loading")}</div>}>
            <SlideshowBanner slides={commitmentSlides} autoRotateInterval={5000} />
          </Suspense>

          {/* Social Links - Lazy loaded */}
          <Suspense fallback={null}>
            <SocialLinks />
          </Suspense>

          {/* Copyright - Lazy loaded */}
          <Suspense fallback={null}>
            <Copyright translations={translations} currentLanguage={currentLanguage} isDarkMode={isDarkMode} />
          </Suspense>
          <br />
        </div>
      </main>

      <Suspense fallback={null}>
        <FooterNavigation translations={translations} currentLanguage={currentLanguage} />
      </Suspense>

      <Suspense fallback={null}>
        <OffersPopup
          show={showPopup}
          offers={popupOffers}
          currentIndex={popupOfferIndex}
          onClose={() => setShowPopup(false)}
          onNext={handleNextPopupOffer}
          onPrev={handlePrevPopupOffer}
          titleFallback={t("discoverOffers")}
          descriptionFallback={t("discoverPromotions")}
          currentLanguage={currentLanguage}
        />
      </Suspense>

    </div>
  )
}

export default HomeClient
