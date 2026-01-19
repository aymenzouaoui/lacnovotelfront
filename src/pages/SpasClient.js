"use client"

import { useEffect, useState } from "react"
import API from "../services/api"
import { ArrowLeft, Facebook, Instagram, ChevronLeft, ChevronRight } from "lucide-react"

// Translation system
const translations = {
  fr: {
    // Header
    back: "Retour",
    // Welcome banner
    spa: "IN BALANCE ",
    wellness: "BY NOVOTEL",
    discoverSpa: "Détendez-vous et ressourcez-vous dans notre espace bien-être luxueux",
    // Loading & Empty states
    loadingCategories: "Chargement des catégories...",
    noCategoriesFound: "Aucune catégorie trouvée",
    comeBackSoon: "Revenez bientôt pour découvrir nos services bien-être",
    // Service details
    noDescription: "Pas de description disponible.",
    // Footer
    contact: "Contact",
    address: "Adresse",
    reservations: "Réservations",
    wifi: "Wi-Fi",
    followUs: "Suivez-nous",
    network: "Réseau",
    password: "Mot de passe",
    availableAtReception: "Disponible à la réception",
    addressLine1: "Rue de la Feuille d'Érable - Cité Les Pins - Les Berges du Lac 2",
    addressLine2: "1053 Tunis, TN",
    allRightsReserved: "Tous droits réservés",
    createdBy: "Créé par",
  },
  en: {
    // Header
    back: "Back",
    // Welcome banner
    spa: "IN BALANCE ",
    wellness: "BY NOVOTEL",
    discoverSpa: "Relax and rejuvenate in our luxurious wellness area",
    // Loading & Empty states
    loadingCategories: "Loading categories...",
    noCategoriesFound: "No categories found",
    comeBackSoon: "Come back soon to discover our wellness services",
    // Service details
    noDescription: "No description available.",
    // Footer
    contact: "Contact",
    address: "Address",
    reservations: "Reservations",
    wifi: "Wi-Fi",
    followUs: "Follow Us",
    network: "Network",
    password: "Password",
    availableAtReception: "Available at reception",
    addressLine1: "Rue de la Feuille d'Érable - Cité Les Pins - Les Berges du Lac 2",
    addressLine2: "1053 Tunis, TN",
    allRightsReserved: "All rights reserved",
    createdBy: "Created by",
  },
  ar: {
    // Header
    back: "رجوع",
    // Welcome banner
    spa: "سبا",
    wellness: "وعافية",
    discoverSpa: "استرخِ وجدد نشاطك في منطقة العافية الفاخرة لدينا",
    // Loading & Empty states
    loadingCategories: "جاري تحميل الفئات...",
    noCategoriesFound: "لم يتم العثور على فئات",
    comeBackSoon: "عد قريبًا لاكتشاف خدمات العافية لدينا",
    // Service details
    noDescription: "لا يوجد وصف متاح.",
    // Footer
    contact: "اتصل بنا",
    address: "العنوان",
    reservations: "الحجوزات",
    wifi: "واي فاي",
    followUs: "تابعونا",
    network: "الشبكة",
    password: "كلمة المرور",
    availableAtReception: "متوفرة في الاستقبال",
    addressLine1: "شارع ورقة القيقب - مدينة الصنوبر - ضفاف البحيرة 2",
    addressLine2: "1053 تونس، تونس",
    allRightsReserved: "جميع الحقوق محفوظة",
    createdBy: "تم إنشاؤه بواسطة",
  },
}

const languages = [
  { code: "fr", name: "Français", flag: "/images/fr-flag-v2.png" },
  { code: "en", name: "English", flag: "/images/en-flag-v2.png" },
  { code: "ar", name: "العربية", flag: "/images/ar-flag-v2.png" },
]

const SpasClient = () => {
  const [spaCategories, setSpaCategories] = useState([])
  const [isLoaded, setIsLoaded] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [currentLanguage, setCurrentLanguage] = useState("fr")
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false)
  const [currentSlide, setCurrentSlide] = useState(0)
  const [pageContent, setPageContent] = useState(null)

  const spaImages = [
    "/images/spa/spa1.png",
    "/images/spa/spa2.png",
    "/images/spa/spa3.png",
    "/images/spa/spa4.png",
    "/images/spa/spa5.png",
    "/images/spa/spa6.png",
    "/images/spa/spa7.png",
    "/images/spa/spa8.png",
    "/images/spa/spa9.png",
    "/images/spa/spa10.png",
  ]

  // Get translation function
  const t = (key) => translations[currentLanguage][key] || translations.fr[key] || key

  const fetchSpaCategories = async () => {
    try {
      setIsLoading(true)
      const res = await API.get("/spa-categories")
      setSpaCategories(res.data)
      setIsLoaded(true)
    } catch (error) {
      console.error("Error loading spa categories:", error)
    } finally {
      setIsLoading(false)
    }
  }

  // Fetch page content
  useEffect(() => {
    const fetchPageContent = async () => {
      try {
        const res = await API.get("/page-contents/page/Spa")
        setPageContent(res.data)
      } catch (err) {
        console.error("Error fetching spa page content:", err)
        setPageContent(null)
      }
    }
    fetchPageContent()
  }, [])

  useEffect(() => {
    fetchSpaCategories()
    const timer = setTimeout(() => {
      setIsLoaded(true)
    }, 100)

    return () => {
      clearTimeout(timer)
    }
  }, [])

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  // Language loading and saving
  useEffect(() => {
    const savedLanguage = localStorage.getItem("novotel-language")
    if (savedLanguage && translations[savedLanguage]) {
      setCurrentLanguage(savedLanguage)
      document.documentElement.dir = savedLanguage === "ar" ? "rtl" : "ltr"
      document.documentElement.lang = savedLanguage
    }
  }, [])

  // Language change handler
  const changeLanguage = (langCode) => {
    setCurrentLanguage(langCode)
    localStorage.setItem("novotel-language", langCode)
    setShowLanguageDropdown(false)
    document.documentElement.dir = langCode === "ar" ? "rtl" : "ltr"
    document.documentElement.lang = langCode
  }

  const getCurrentLanguage = () => languages.find((lang) => lang.code === currentLanguage)

  useEffect(() => {
    const slideInterval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % spaImages.length)
    }, 4000)

    return () => clearInterval(slideInterval)
  }, [spaImages.length])

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % spaImages.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + spaImages.length) % spaImages.length)
  }

  const goToSlide = (index) => {
    setCurrentSlide(index)
  }

  return (
    <div className={`hotel-app0 ${currentLanguage === "ar" ? "rtl" : "ltr"}`}>
      <style jsx>{`
      .service-description {
  color: #64748b;
  font-size: 14px;
  margin: 0;
  line-height: 1.5;
  white-space: normal !important; /* allow line breaks */
  overflow: visible !important; /* show full text */
  text-overflow: unset !important; /* remove ... truncation */
  word-break: break-word; /* handle long words gracefully */
}

        /* Language dropdown styles */
        .language-selector {
          position: absolute;
          top: 15px;
          left: 15px;
          z-index: 20;
        }

        .language-toggle {
          display: flex;
          align-items: center;
          gap: 8px;
          background: rgba(0, 0, 0, 0.7);
          color: white;
          border: none;
          border-radius: 20px;
          padding: 8px 12px;
          cursor: pointer;
          font-size: 14px;
          font-weight: 500;
          transition: all 0.3s ease;
          backdrop-filter: blur(10px);
        }

        .language-toggle:hover {
          background: rgba(0, 0, 0, 0.8);
          transform: scale(1.05);
        }

        .language-flag {
          width: 20px;
          height: 15px;
          object-fit: cover;
          border-radius: 2px;
        }

        .language-dropdown {
          position: absolute;
          top: 100%;
          left: 0;
          background: rgba(0, 0, 0, 0.9);
          border-radius: 8px;
          padding: 8px 0;
          min-width: 150px;
          z-index: 1000;
          backdrop-filter: blur(10px);
          margin-top: 5px;
        }

        .language-option {
          display: flex;
          align-items: center;
          padding: 8px 16px;
          cursor: pointer;
          transition: background-color 0.2s;
          gap: 8px;
          color: white;
          font-size: 14px;
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

        /* Main container - mobile-first design */
        .app-main {
          background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
          min-height: 100vh;
          padding: 16px 0;
        }

        .content-container {
          max-width: 800px;
          margin: 0 auto;
          padding: 0 12px;
        }

        /* Category container - optimized for mobile */
        .category-container {
          margin-bottom: 32px;
          background: white;
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
          border: 1px solid #e2e8f0;
          transition: all 0.3s ease;
        }

        .category-container:hover {
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
          transform: translateY(-2px);
        }

        /* Category image */
        .category-image {
          width: 100%;
          height: 200px;
          object-fit: cover;
          display: block;
        }

        /* Category content padding */
        .category-content {
          padding: 20px 16px;
        }

        /* Category title */
        .category-title {
          font-size: 22px;
          font-weight: 700;
          color: #1e40af;
          margin: 0 0 20px 0;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          position: relative;
          padding-bottom: 8px;
        }

        .category-title::after {
          content: "";
          position: absolute;
          bottom: 0;
          left: 0;
          width: 60px;
          height: 3px;
          background: linear-gradient(90deg, #3b82f6, #1e40af);
          border-radius: 2px;
        }

        /* Services list */
        .services-list {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        /* Updated service items for menu-style layout with prices on right */
        .service-item {
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          padding: 16px;
          transition: all 0.2s ease;
        }

        .service-item:active {
          background: #f1f5f9;
          border-color: #cbd5e1;
          transform: scale(0.98);
        }

        /* Service header now displays as a menu with name/duration on left, price on right */
        .service-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 12px;
          margin-bottom: 8px;
        }

        /* Wrapper for service name and duration */
        .service-name-wrapper {
          flex: 1;
          min-width: 0;
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        /* Service name with better mobile sizing */
        .service-name {
          font-size: 16px;
          font-weight: 600;
          color: #1e40af;
          margin: 0;
          line-height: 1.3;
          word-wrap: break-word;
        }

        /* Service prices now aligned to the right with better mobile styling */
        .service-prices {
          font-size: 15px;
          font-weight: 700;
          color: #1e40af;
          background: #dbeafe;
          padding: 6px 12px;
          border-radius: 16px;
          border: 1px solid #bfdbfe;
          white-space: nowrap;
          flex-shrink: 0;
          text-align: right;
        }

        /* Service details now only contains description */
        .service-details {
          display: flex;
          flex-direction: column;
        }

        /* Service description */
        .service-description {
          color: #64748b;
          font-size: 14px;
          margin: 0;
          line-height: 1.5;
        }

        /* Service duration moved under service name with updated styling */
        .service-duration {
          color: #475569;
          font-size: 13px;
          background: #e2e8f0;
          padding: 3px 8px;
          border-radius: 12px;
          font-weight: 500;
          display: inline-block;
          align-self: flex-start;
        }

        /* Price styling */
        .price-tnd {
          color: #1e40af;
          font-weight: 700;
        }

        .price-separator {
          color: #64748b;
          margin: 0 4px;
          font-weight: 400;
        }

        .price-eur {
          color: #1e40af;
          font-weight: 700;
        }

        /* Loading and empty states */
        .loading-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 200px;
          gap: 16px;
          color: #64748b;
          background: white;
          border-radius: 16px;
          padding: 40px 20px;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
          margin: 0 12px;
        }

        .loading-spinner {
          border: 4px solid #f1f5f9;
          border-top: 4px solid #3b82f6;
          border-radius: 50%;
          width: 40px;
          height: 40px;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }

        .empty-state {
          text-align: center;
          padding: 40px 20px;
          background: white;
          border-radius: 16px;
          margin: 0 12px;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        }

        .empty-icon {
          font-size: 48px;
          margin-bottom: 16px;
        }

        .empty-state h3 {
          color: #1e40af;
          font-size: 20px;
          margin-bottom: 8px;
        }

        .empty-state p {
          color: #64748b;
          font-size: 14px;
        }

        /* Slideshow styles - mobile optimized */
        .spa-slideshow {
          position: relative;
          max-width: 1000px;
          margin: 20px 12px;
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
        }

        .slideshow-container {
          position: relative;
          width: 100%;
          height: 250px;
          overflow: hidden;
        }

        .slide {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          opacity: 0;
          transition: opacity 0.8s ease-in-out;
        }

        .slide.active {
          opacity: 1;
        }

        .slide img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center;
        }

        .slideshow-nav {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          background: rgba(0, 0, 0, 0.5);
          color: white;
          border: none;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.3s ease;
          backdrop-filter: blur(10px);
          z-index: 10;
        }

        .slideshow-nav:active {
          background: rgba(0, 0, 0, 0.7);
          transform: translateY(-50%) scale(0.95);
        }

        .slideshow-nav.prev {
          left: 10px;
        }

        .slideshow-nav.next {
          right: 10px;
        }

        .slideshow-dots {
          position: absolute;
          bottom: 15px;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          gap: 8px;
          z-index: 10;
        }

        .dot {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.5);
          cursor: pointer;
          transition: all 0.3s ease;
          border: 2px solid transparent;
        }

        .dot.active {
          background: white;
          transform: scale(1.2);
          border-color: rgba(59, 130, 246, 0.5);
        }

        .dot:active {
          background: rgba(255, 255, 255, 0.8);
          transform: scale(1.1);
        }

        /* Page content styles */
        .page-content-spa {
          margin: 20px 12px;
          text-align: center;
          background: white;
          border-radius: 16px;
          padding: 20px;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        }

        .page-content-spa img.page-content-image {
          max-width: 100%;
          height: auto;
          border-radius: 12px;
          margin-bottom: 15px;
        }

        .page-content-spa p.page-content-description {
          font-size: 15px;
          color: #475569;
          line-height: 1.6;
        }

        /* Enhanced tablet and larger screens with better menu layout */
        @media (min-width: 640px) {
          .content-container {
            padding: 0 20px;
          }

          .category-container {
            margin-bottom: 40px;
          }

          .category-image {
            height: 280px;
          }

          .category-content {
            padding: 28px 24px;
          }

          .category-title {
            font-size: 26px;
            margin-bottom: 24px;
          }

          .services-list {
            gap: 20px;
          }

          .service-item {
            padding: 20px;
          }

          .service-header {
            gap: 16px;
          }

          .service-name {
            font-size: 17px;
          }

          .service-prices {
            font-size: 16px;
            padding: 8px 14px;
          }

          .service-description {
            font-size: 15px;
          }

          .service-duration {
            font-size: 14px;
            padding: 4px 10px;
          }

          .spa-slideshow {
            margin: 30px 20px;
            border-radius: 20px;
          }

          .slideshow-container {
            height: 350px;
          }

          .slideshow-nav {
            width: 50px;
            height: 50px;
          }

          .slideshow-nav.prev {
            left: 20px;
          }

          .slideshow-nav.next {
            right: 20px;
          }

          .slideshow-dots {
            bottom: 20px;
            gap: 12px;
          }

          .dot {
            width: 12px;
            height: 12px;
          }

          .page-content-spa {
            margin: 30px 20px;
            padding: 28px;
          }

          .page-content-spa p.page-content-description {
            font-size: 16px;
          }
        }

        /* Desktop screens */
        @media (min-width: 1024px) {
          .slideshow-container {
            height: 400px;
          }

          .service-name {
            font-size: 18px;
          }

          .service-prices {
            font-size: 17px;
          }
        }

        /* Enhanced RTL Support for menu layout */
        .rtl {
          direction: rtl;
        }
        .rtl .language-selector {
          left: auto;
          right: 15px;
        }
        .rtl .language-dropdown {
          left: auto;
          right: 0;
          text-align: right;
        }
        .rtl .header-back-link {
          flex-direction: row-reverse;
        }
        .rtl .header-back-link svg {
          margin-left: 8px;
          margin-right: 0;
        }
        .rtl .welcome-banner h1 {
          text-align: right;
        }
        .rtl .welcome-banner p {
          text-align: right;
        }
        .rtl .empty-state {
          text-align: right;
        }
        .rtl .category-title::after {
          left: auto;
          right: 0;
        }
        .rtl .service-header {
          flex-direction: row-reverse;
        }
        .rtl .service-prices {
          text-align: left;
        }
        .rtl .footer-section {
          text-align: right;
        }
        .rtl .copyright {
          text-align: right;
        }
        .rtl .copyright a {
          margin-left: 0;
          margin-right: 5px;
        }
        .rtl .slideshow-nav.prev {
          left: auto;
          right: 10px;
        }
        .rtl .slideshow-nav.next {
          right: auto;
          left: 10px;
        }

        @media (min-width: 640px) {
          .rtl .slideshow-nav.prev {
            left: auto;
            right: 20px;
          }
          .rtl .slideshow-nav.next {
            right: auto;
            left: 20px;
          }
        }
      `}</style>

      {/* Language Selector */}
      <div className="language-selector">
        <button className="language-toggle" onClick={() => setShowLanguageDropdown(!showLanguageDropdown)}>
          <img
            src={getCurrentLanguage()?.flag || "/placeholder.svg"}
            alt={getCurrentLanguage()?.name}
            className="language-flag"
          />
          <span>{getCurrentLanguage()?.code.toUpperCase()}</span>
        </button>
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

      <header className="app-header">
        <a href="/Home" className="header-back-link">
          <ArrowLeft className={currentLanguage === "ar" ? "transform scale-x-[-1]" : ""} width="24" height="24" />
          {t("back")}
        </a>
        <div className="logo-container">
          <img src="/images/logo2.png" alt="Novotel Logo" className="logo" />
        </div>
        <div></div>
      </header>

      <main className="app-main">
        <div className="welcome-banner">
          <h1>
            {t("spa")}
            {t("wellness")}
          </h1>
          <p>{t("discoverSpa")}</p>
        </div>

        {pageContent && (
          <div className="page-content-spa">
            {pageContent.image && (
              <img
                src={pageContent.image || "/placeholder.svg"}
                alt="Spa"
                className="page-content-image"
                onError={(e) => (e.target.src = "/placeholder.svg")}
              />
            )}
            {pageContent.description && <div
  className="page-content-description"
  dangerouslySetInnerHTML={{ __html: pageContent.description }}
/>
}
          </div>
        )}

   

        <div className="content-container">
          {isLoading ? (
            <div className="loading-container">
              <div className="loading-spinner"></div>
              <p>{t("loadingCategories")}</p>
            </div>
          ) : spaCategories.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">🔍</div>
              <h3>{t("noCategoriesFound")}</h3>
              <p>{t("comeBackSoon")}</p>
            </div>
          ) : (
            <div className="categories-list">
              {spaCategories.map((category) => (
                <div key={category._id} className="category-container">
                  {category.image && (
                    <img
                      src={category.image || "/placeholder.svg"}
                      alt={category.title}
                      className="category-image"
                      onError={(e) => (e.target.src = "/placeholder.svg?height=200&width=800")}
                    />
                  )}

                  <div className="category-content">
                    <h2 className="category-title">{category.title}</h2>

                    {category.services && category.services.length > 0 ? (
                      <div className="services-list">
                        {category.services.map((service, serviceIndex) => (
                          <div key={serviceIndex} className="service-item">
                            <div className="service-header">
                              <div className="service-name-wrapper">
                                <h3 className="service-name">{service.name}</h3>
                                {service.duration && <span className="service-duration">{service.duration}</span>}
                              </div>
                              {(service.prices?.TND || service.prices?.EUR) && (
                                <div className="service-prices">
                                  {service.prices?.TND && <span className="price-tnd">{service.prices.TND} TND</span>}
                                  {service.prices?.TND && service.prices?.EUR && (
                                    <span className="price-separator"> / </span>
                                  )}
                                  {service.prices?.EUR && <span className="price-eur">{service.prices.EUR} €</span>}
                                </div>
                              )}
                            </div>

                            {service.description && (
                              <div className="service-details">
                                <p className="service-description">{service.description}</p>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="service-description">{t("noDescription")}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      <footer className="app-footer">
        <div className="footer-content">
          <div className="footer-section">
            <h4>{t("contact")}</h4>
            <p>+216 31 329 329</p>
            <p>H6145@accor.com</p>
          </div>
          <div className="footer-section">
            <h4>{t("address")}</h4>
            <p>{t("addressLine1")}</p>
            <p>{t("addressLine2")}</p>
          </div>
          <div className="footer-section">
            <h4>{t("reservations")}</h4>
            <p>+216 31 329 329</p>
            <p>H6145@accor.com</p>
          </div>
          <div className="footer-section">
            <h4>{t("wifi")}</h4>
            <p>
              {t("password")}: {t("availableAtReception")}
            </p>
          </div>
          <div className="footer-section">
            <h4>{t("followUs")}</h4>
            <div className="social-links">
              <a href="https://www.facebook.com/Novoteltunislac/" aria-label="Facebook" target="_blank" rel="noopener noreferrer">
                <Facebook width="24" height="24" />
              </a>
              <a href="https://tn.linkedin.com/company/novotel-tunis-lac" aria-label="LinkedIn" target="_blank" rel="noopener noreferrer">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                  <rect x="2" y="9" width="4" height="12" />
                  <circle cx="4" cy="4" r="2" />
                </svg>
              </a>
              <a href="https://www.instagram.com/novotel_tunis_lac/" aria-label="Instagram" target="_blank" rel="noopener noreferrer">
                <Instagram width="24" height="24" />
              </a>
            </div>
          </div>
        </div>
        <div className="copyright">
          <p>
            © {new Date().getFullYear()} Novotel Tunis Lac. {t("allRightsReserved")}.
            <br />
            {t("createdBy")}{" "}
            <a href="https://www.itbafa.com" target="_blank" rel="noopener noreferrer">
              <img
                src="/images/itbafa_logo_white.png"
                alt="ITBAFA Logo"
                style={{ height: "20px", verticalAlign: "middle", marginLeft: "5px" }}
              />
            </a>
          </p>
        </div>
      </footer>
    </div>
  )
}

export default SpasClient
