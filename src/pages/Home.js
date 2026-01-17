"use client"

import { useState, useEffect } from "react"
import "./home-client-v21.css"
import API from "../services/api"
import OffersPopup from "../components/OffersPopup"

const translations = {
  fr: {
    // Hero section
    welcome: "Bienvenue au Novotel Tunis",
    scrollDown: "DÉFILER VERS LE BAS",

    // Main banners
    coffeeCup: "UNE TASSE DE CAFÉ",
    forYourReview: "POUR VOTRE AVIS",
    clickImageReview: "Cliquez sur l'image et laissez votre avis",
    discoverOur: "DÉCOUVREZ NOS",
    restaurants: "RESTAURANTS",
    exploreSpecialties: "Explorez nos spécialités culinaires et notre gastronomie",
    relaxAt: "DÉTENDEZ-VOUS À",
    ourSkyLounge: "NOTRE SKY LOUNGE",
    panoramicView: "Profitez d'une vue panoramique avec des boissons premium",

    // Feature cards
    eat: "Restaurant Novotel",
    drink: "Bar",
    relax: "Sky Lounge",
    wellness: "IN BALANCE BY NOVOTEL",
    events: "Événements",
    services: "S'informer",
    roomService: "Restauration en chambre",
    business: "Meeting AT Novotel",
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
    specialOffers: "Offres Spéciales Novotel",
    discoverPromotions:
      "Découvrez nos promotions exclusives et profitez de réductions exceptionnelles sur votre séjour. Réservez maintenant et économisez jusqu'à 30% !",
    discoverOffers: "Découvrir les offres",

    // Footer
    allRightsReserved: "Tous droits réservés",
    createdBy: "Créé par",

    // New translations for feedback slides
    giveUsFeedback: "Donnez nous votre avis",
    skipCleans: "Skip the clean",
  },

  en: {
    // Hero section
    welcome: "Welcome to Novotel Tunis",
    scrollDown: "SCROLL DOWN",

    // Main banners
    coffeeCup: "A CUP OF COFFEE",
    forYourReview: "FOR YOUR REVIEW",
    clickImageReview: "Click on the image and leave your review",
    discoverOur: "DISCOVER OUR",
    restaurants: "RESTAURANTS",
    exploreSpecialties: "Explore our culinary specialties and gastronomy",
    relaxAt: "RELAX AT",
    ourSkyLounge: "OUR SKY LOUNGE",
    panoramicView: "Enjoy panoramic views with premium drinks",

    // Feature cards
    eat: "Novotel  Restaurant",
    drink: "Bar",
    relax: "Sky Lounge",
    wellness: "IN BALANCE BY NOVOTEL",
    events: "Events",
    services: "Inform",
    roomService: "in-room catering",
    business: "Meeting AT Novotel",
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
    specialOffers: "Novotel Special Offers",
    discoverPromotions:
      "Discover our exclusive promotions and enjoy exceptional discounts on your stay. Book now and save up to 30%!",
    discoverOffers: "Discover Offers",

    // Footer
    allRightsReserved: "All rights reserved",
    createdBy: "Created by",

    // New translations for feedback slides
    giveUsFeedback: "Give us your feedback",
    skipCleans: "Skip the clean",
  },

  ar: {
    // Hero section
    welcome: "مرحباً بكم في نوفوتيل تونس",
    scrollDown: "انتقل للأسفل",

    // Main banners
    coffeeCup: "فنجان قهوة",
    forYourReview: "لرأيكم",
    clickImageReview: "انقر على الصورة واترك رأيك",
    discoverOur: "اكتشف",
    restaurants: "مطاعمنا",
    exploreSpecialities: "استكشف تخصصاتنا الطهوية وفن الطبخ لدينا",
    relaxAt: "استرخ في",
    ourSkyLounge: "صالة السكاي لاونج",
    panoramicView: "استمتع بإطلالة بانورامية مع المشروبات المميزة",

    // Feature cards
    eat: "مطاعم نوفوتيل",
    drink: "حانة",
    relax: "صالة سكاي",
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
  },
}

const languages = [
  { code: "fr", name: "Français", flag: "/images/fr-flag-v2.png" },
  { code: "en", name: "English", flag: "/images/en-flag-v2.png" },
  { code: "ar", name: "العربية", flag: "/images/ar-flag-v2.png" },
]

const HomeClient = () => {
  const [currentTime, setCurrentTime] = useState(new Date())
  const [heroSlide, setHeroSlide] = useState(0)
  const [commitmentSlide, setCommitmentSlide] = useState(0)
  const [feedbackSlide, setFeedbackSlide] = useState(0)
  const [showPopup, setShowPopup] = useState(false)
  const [popupOffers, setPopupOffers] = useState([])
  const [popupOfferIndex, setPopupOfferIndex] = useState(0)
  const [currentLanguage, setCurrentLanguage] = useState("fr")
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false)
  const [weatherData, setWeatherData] = useState({ temp: "18°C", loading: true })

  // Get translation function
  const t = (key) => translations[currentLanguage][key] || translations.fr[key] || key

  // Images du diaporama principal
  const heroImages = ["/images/hotel-lobby-v2.png", "/images/hotel-lobby2-v2.png", "/images/hotel-lobby3-v2.png"]

  const feedbackSlides = [
    {
      id: "questionnaire",
      title: "",
      description: "",
  image: `/images/questionnaire_${currentLanguage}.png`,
      link: "/questionnaire-client",
    },
    {
      id: "skipcleans",
      title: t("skipCleans"),
      description: "",
      image: "/images/skipcleans.png",
      link: "/skipclean-client",
    },
  ]

  const commitmentSlides = [
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
  ]

  // Function to fetch weather data for Tunis
  const fetchWeatherData = async () => {
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=Tunis,TN&appid=b56ce80f1e74973836f961ebb25d8704&units=metric`,
      )
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
      setWeatherData({ temp: "22°C", loading: false })
    }
  }

  useEffect(() => {
    fetchWeatherData()

    // Load saved language from localStorage
    const savedLanguage = localStorage.getItem("novotel-language")
    if (savedLanguage && translations[savedLanguage]) {
      setCurrentLanguage(savedLanguage)
    }

    // Update time every minute
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 60000)

    // Auto-rotate hero images every 7 seconds
    const heroSlideTimer = setInterval(() => {
      setHeroSlide((prev) => (prev + 1) % 3)
    }, 7000)

    const feedbackSlideTimer = setInterval(() => {
      setFeedbackSlide((prev) => (prev + 1) % 2)
    }, 5000)

    const commitmentSlideTimer = setInterval(() => {
      setCommitmentSlide((prev) => (prev + 1) % 3)
    }, 5000)

    return () => {
      clearInterval(timer)
      clearInterval(heroSlideTimer)
      clearInterval(feedbackSlideTimer)
      clearInterval(commitmentSlideTimer)
    }
  }, [])

  useEffect(() => {
    let popupTimer
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
    fetchActiveOffers()
    return () => {
      if (popupTimer) {
        clearTimeout(popupTimer)
      }
    }
  }, [])

  useEffect(() => {
    if (!showPopup || popupOffers.length <= 1) return
    const interval = setInterval(() => {
      setPopupOfferIndex((prev) => (prev + 1) % popupOffers.length)
    }, 3000)
    return () => clearInterval(interval)
  }, [showPopup, popupOffers.length])

  useEffect(() => {
    const scrollContainer = document.querySelector(".novotel-v2-feature-cards")
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

  // Language change handler
  const changeLanguage = (langCode) => {
    setCurrentLanguage(langCode)
    localStorage.setItem("novotel-language", langCode)
    setShowLanguageDropdown(false)

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

  const scrollToContent = () => {
    const mainContent = document.querySelector(".novotel-v2-main-content")
    if (mainContent) {
      mainContent.scrollIntoView({ behavior: "smooth" })
    }
  }

  const handleCommitmentSlideClick = (index) => {
    setCommitmentSlide(index)
  }

  const handleCommitmentBannerClick = () => {
    const currentSlideData = commitmentSlides[commitmentSlide]
    if (currentSlideData.external) {
      window.open(currentSlideData.link, "_blank")
    } else {
      window.location.href = currentSlideData.link
    }
  }

  const handleFeedbackSlideClick = (index) => {
    setFeedbackSlide(index)
  }

  const handleFeedbackBannerClick = () => {
    const currentSlideData = feedbackSlides[feedbackSlide]
    window.location.href = currentSlideData.link
  }

  const handleNextPopupOffer = () => {
    if (popupOffers.length <= 1) return
    setPopupOfferIndex((prev) => (prev + 1) % popupOffers.length)
  }

  const handlePrevPopupOffer = () => {
    if (popupOffers.length <= 1) return
    setPopupOfferIndex((prev) => (prev - 1 + popupOffers.length) % popupOffers.length)
  }
  const getAllFeatureCards = () => [
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
      id: "skylounge",
      title: t("relax"),
      image: "/images/skylounge.jpg",
      fallback: "/placeholder.svg?height=300&width=200&text=Sky+Lounge",
      path: "/skylounge-client",
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
      image: "/images/roomservice.jpg",
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
      image: "/images/feedback.png",
      fallback: "/placeholder.svg?height=300&width=200&text=Feedback",
      url: "https://tinyurl.com/28npzs5f",
    },
  ]

  const getCurrentLanguage = () => languages.find((lang) => lang.code === currentLanguage)

  return (
    <div className={`novotel-v2-app ${currentLanguage === "ar" ? "rtl" : "ltr"}`}>
      {/* Hero Section with Background Slideshow */}
      <div className="novotel-v2-hero">
        <div className="novotel-v2-hero-slideshow">
          {heroImages.map((image, index) => (
            <div
              key={index}
              className={`novotel-v2-hero-slide ${heroSlide === index ? "active" : ""}`}
              style={{ backgroundImage: `url("${image}")` }}
            ></div>
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
            <div className="novotel-v2-hero-lang" onClick={() => setShowLanguageDropdown(!showLanguageDropdown)}>
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
                        changeLanguage(lang.code)
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
            <div className="novotel-v2-hero-text">{t("welcome")}</div>
          </div>
          <div className="novotel-v2-hero-scroll" onClick={scrollToContent}>
            <div className="novotel-v2-scroll-text">{t("scrollDown")}</div>
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

      <main className="novotel-v2-main">
        <div className="novotel-v2-main-content">
           <div className="novotel-v2-commitment-slideshow-container">
            <div className="novotel-v2-commitment-slideshow">
              {feedbackSlides.map((slide, index) => (
                <div
                  key={slide.id}
                  className={`novotel-v2-commitment-banner ${feedbackSlide === index ? "active" : ""}`}
                  onClick={handleFeedbackBannerClick}
                  style={{
                    backgroundImage: `url("${slide.image}")`,
                  }}
                >
                  <div className="novotel-v2-commitment-content">
                    <h2>{slide.title}</h2>
                    <p>{slide.description}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="novotel-v2-commitment-dots">
              {feedbackSlides.map((_, index) => (
                <div
                  key={index}
                  className={`novotel-v2-dot ${feedbackSlide === index ? "active" : ""}`}
                  onClick={() => handleFeedbackSlideClick(index)}
                />
              ))}
            </div>
          </div>
          {/* Feature Cards with Horizontal Scroll */}
          <div className="novotel-v2-feature-cards-container">
            <div className="novotel-v2-feature-cards">
              {getAllFeatureCards().map((card) => (
                <div
                  key={card.id}
                  className="novotel-v2-feature-card"
                  onClick={() => {
                    if (card.url) {
                      window.open(card.url, "_blank")
                    } else if (card.path) {
                      window.location.href = card.path
                    }
                  }}
                >
                  <div className="novotel-v2-feature-image">
                    <img
                      loading="lazy" // ✅ Lazy load images
                      decoding="async" // ✅ Render async
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
                </div>
              ))}
            </div>
          </div>

         

          {/* Existing commitment slideshow */}
          <div className="novotel-v2-commitment-slideshow-container">
            <div className="novotel-v2-commitment-slideshow">
              {commitmentSlides.map((slide, index) => (
                <div
                  key={slide.id}
                  className={`novotel-v2-commitment-banner ${commitmentSlide === index ? "active" : ""}`}
                  onClick={handleCommitmentBannerClick}
                  style={{
                    backgroundImage: `url("${slide.image}")`,
                  }}
                >
                  <div className="novotel-v2-commitment-content">
                    <h2>{slide.title}</h2>
                    <p>{slide.description}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="novotel-v2-commitment-dots">
              {commitmentSlides.map((_, index) => (
                <div
                  key={index}
                  className={`novotel-v2-dot ${commitmentSlide === index ? "active" : ""}`}
                  onClick={() => handleCommitmentSlideClick(index)}
                />
              ))}
            </div>
          </div>

          <div className="novotel-v2-social">
            <a href="https://www.facebook.com/NovotelTunis" className="novotel-v2-social-icon">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </a>
            <a href="https://www.instagram.com/novotel.tunis" className="novotel-v2-social-icon">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5" stroke="currentColor" strokeWidth="2" />
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" stroke="currentColor" strokeWidth="2" />
                <line
                  x1="17.5"
                  y1="6.5"
                  x2="17.51"
                  y2="6.5"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </a>
          </div>

          <div className="copyright">
            <p>
              © {new Date().getFullYear()} Novotel Tunis. {t("allRightsReserved")}.
              <br />
              {t("createdBy")}{" "}
              <a href="https://www.itbafa.com" target="_blank" rel="noopener noreferrer">
                <img
                  src="/images/itbafa_logo_dark.png"
                  alt="ITBAFA Logo"
                  style={{ height: "20px", verticalAlign: "middle", marginLeft: "5px" }}
                />
              </a>
            </p>
          </div>
          <br></br>
        </div>
      </main>

      <footer className="novotel-v2-footer">
        <a href="/" className="novotel-v2-nav-item active">
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <polyline
              points="9 22 9 12 15 12 15 22"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span>{t("home")}</span>
        </a>
        <a href="/RestaurantsMenus-client" className="novotel-v2-nav-item">
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2M7 2v20M21 15V2a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3z"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span>{t("restaurants")}</span>
        </a>
        <a href="/boissons-client" className="novotel-v2-nav-item">
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M5 12V7a1 1 0 0 1 1-1h4l2-3h2l2 3h4a1 1 0 0 1 1 1v5M5 12l1.5 6h11L19 12M5 12h14"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span>{t("bar")}</span>
        </a>
        <a href="/loisirs-client" className="novotel-v2-nav-item">
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M12 2L2 7l10 5 10-5M2 17l10 5 10-5M2 12l10 5 10-5"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span>{t("services")}</span>
        </a>
        <a href="/spas-client" className="novotel-v2-nav-item">
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M12 3a6.364 6.364 0 0 0 9 9 9 9 0 1 1-9-9Z"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span>{t("spa")}</span>
        </a>
        <button
          type="button"
          className="novotel-v2-nav-item"
          onClick={() => window.open("https://tinyurl.com/28npzs5f", "_blank")}
        >
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span>{t("feedback")}</span>
        </button>
      </footer>

      <OffersPopup
        show={showPopup}
        offers={popupOffers}
        currentIndex={popupOfferIndex}
        onClose={() => setShowPopup(false)}
        onNext={handleNextPopupOffer}
        onPrev={handlePrevPopupOffer}
        titleFallback={t("discoverOffers")}
        descriptionFallback={t("discoverPromotions")}
      />

      {/* Additional CSS for language dropdown */}
      <style jsx>{`
        .language-dropdown {
          position: absolute;
          top: 100%;
          right: 0;
          background: rgba(0, 0, 0, 0.9);
          border-radius: 8px;
          padding: 8px 0;
          min-width: 150px;
          z-index: 1000;
          backdrop-filter: blur(10px);
        }
        
        .language-option {
          display: flex;
          align-items: center;
          padding: 8px 16px;
          cursor: pointer;
          transition: background-color 0.2s;
          gap: 8px;
        }
        
        .language-option:hover {
          background: rgba(255, 255, 255, 0.1);
        }
        
        .language-option.active {
          background: rgba(255, 255, 255, 0.2);
        }
        
        .flag-small {
          width: 20px;
          height: 15px;
          object-fit: cover;
          border-radius: 2px;
        }
        
        .language-option span {
          color: white;
          font-size: 14px;
        }
        
        .novotel-v2-hero-lang {
          position: relative;
          cursor: pointer;
        }
        
        .rtl {
          direction: rtl;
        }

        .rtl .novotel-v2-hero-header {
          flex-direction: row-reverse;
          justify-content: space-between;
        }

        .rtl .novotel-v2-hero-date-time {
          order: 2;
        }

        .rtl .novotel-v2-hero-lang {
          order: 1;
        }

        .rtl .language-dropdown {
          left: 0;
          right: auto;
          text-align: right;
        }

        .rtl .novotel-v2-hero-content {
          text-align: right;
        }

        .rtl .novotel-v2-hero-scroll {
          text-align: right;
        }

        .rtl .novotel-v2-banner-content {
          text-align: right;
        }

        .rtl .novotel-v2-commitment-content {
          text-align: right;
        }

        .rtl .novotel-v2-feature-cards {
          direction: rtl;
        }

        .rtl .novotel-v2-footer {
          direction: rtl;
        }
      `}</style>
    </div>
  )
}

export default HomeClient
