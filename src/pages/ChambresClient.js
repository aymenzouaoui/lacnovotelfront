"use client"

import { useEffect, useState } from "react"
import API from "../services/api"
import "./client-image-fix-dark.css"

// Translation system
const translations = {
  fr: {
    // Header
    back: "Retour",
    // Welcome banner
    rooms: "Nos Chambres",
    discoverRooms: "Découvrez nos chambres confortables et élégantes",
    // Loading & Empty states
    loadingRooms: "Chargement des chambres...",
    noRoomsFound: "Aucune chambre trouvée",
    comeBackSoon: "Revenez bientôt pour découvrir nos chambres",
    // Room details
    noDescription: "Pas de description disponible.",
    viewDetails: "Voir détails",
    reserveRoom: "Réserver une chambre",
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
    rooms: "Our Rooms",
    discoverRooms: "Discover our comfortable and elegant rooms",
    // Loading & Empty states
    loadingRooms: "Loading rooms...",
    noRoomsFound: "No rooms found",
    comeBackSoon: "Come back soon to discover our rooms",
    // Room details
    noDescription: "No description available.",
    viewDetails: "View details",
    reserveRoom: "Reserve a room",
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
    rooms: "غرفنا",
    discoverRooms: "اكتشف غرفنا المريحة والأنيقة",
    // Loading & Empty states
    loadingRooms: "جاري تحميل الغرف...",
    noRoomsFound: "لم يتم العثور على غرف",
    comeBackSoon: "عد قريبًا لاكتشاف غرفنا",
    // Room details
    noDescription: "لا يوجد وصف متاح.",
    viewDetails: "عرض التفاصيل",
    reserveRoom: "حجز غرفة",
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

const ChambresClient = () => {
  const [rooms, setRooms] = useState([])
  const [isLoaded, setIsLoaded] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [currentLanguage, setCurrentLanguage] = useState("fr")
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false)
  const [pageContent, setPageContent] = useState(null)

  // Get translation function
  const t = (key) => translations[currentLanguage][key] || translations.fr[key] || key

  const fetchRooms = async () => {
    try {
      setIsLoading(true)
      // Note: This endpoint might need to be created on the backend
      // For now, we'll use a placeholder or empty array
      const res = await API.get("/rooms").catch(() => ({ data: [] }))
      setRooms(res.data || [])
      setIsLoaded(true)
    } catch (error) {
      console.error("Error loading rooms:", error)
      setRooms([])
    } finally {
      setIsLoading(false)
    }
  }

  // Fetch page content
  useEffect(() => {
    const fetchPageContent = async () => {
      try {
        const res = await API.get("/page-contents/page/Chambres")
        setPageContent(res.data)
      } catch (err) {
        console.error("Error fetching rooms page content:", err)
        setPageContent(null)
      }
    }
    fetchPageContent()
  }, [])

  useEffect(() => {
    fetchRooms()
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

  return (
    <div className={`hotel-app ${currentLanguage === "ar" ? "rtl" : "ltr"}`}>
      <style jsx>{`
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
        .page-content-rooms {
          margin: 20px 0;
          text-align: center;
        }
        .page-content-rooms img.page-content-image {
          max-width: 100%;
          height: auto;
          border-radius: 8px;
          margin-bottom: 15px;
        }
        .page-content-rooms p.page-content-description {
          font-size: 16px;
          color: #444;
          line-height: 1.6;
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
        <button className="header-back-link" onClick={() => (window.location.href = "/Home")}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d={currentLanguage === "ar" ? "M5 12H19M19 12L12 5M19 12L12 19" : "M19 12H5M5 12L12 19M5 12L12 5"}
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          {t("back")}
        </button>
        <div className="logo-container">
          <img src="/images/logo2.png" alt="Novotel Logo" className="logo" />
        </div>
        <div></div>
      </header>
      <main className="app-main">
        {/* Page content */}
        {pageContent && (
          <div className="page-content-rooms">
            {pageContent.image && (
              <img
                src={pageContent.image}
                alt="Chambres"
                className="page-content-image"
                onError={(e) => (e.target.src = "/placeholder.svg")}
              />
            )}
            {pageContent.description && (
              <div className="page-content-description" dangerouslySetInnerHTML={{ __html: pageContent.description }} />
            )}
          </div>
        )}

        <div className="welcome-banner">
          <h1>
            <span>{t("rooms")}</span>
          </h1>
          <p>{t("discoverRooms")}</p>
        </div>
        <div className="content-container">
          {isLoading ? (
            <div className="loading-container">
              <div className="loading-spinner"></div>
              <p>{t("loadingRooms")}</p>
            </div>
          ) : rooms.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">🏨</div>
              <h3>{t("noRoomsFound")}</h3>
              <p>{t("comeBackSoon")}</p>
            </div>
          ) : (
            <div className={`content-grid ${isLoaded ? "loaded" : ""}`}>
              {rooms.map((room, index) => (
                <div
                  key={room._id || index}
                  className="content-item"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <div className="content-item-image">
                    <img
                      src={room.image || "/placeholder.svg"}
                      alt={room.name}
                      onError={(e) => {
                        e.target.src = `/placeholder.svg?height=120&width=300&text=${room.name}`
                      }}
                    />
                    <div className="content-item-overlay">
                      <span className="view-details">{t("viewDetails")}</span>
                    </div>
                  </div>
                  <div className="content-item-content">
                    <h3>{room.name}</h3>
                    <p>{room.description || t("noDescription")}</p>
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
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                </svg>
              </a>
              <a href="https://tn.linkedin.com/company/novotel-tunis-lac" aria-label="LinkedIn" target="_blank" rel="noopener noreferrer">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                  <rect x="2" y="9" width="4" height="12"></rect>
                  <circle cx="4" cy="4" r="2"></circle>
                </svg>
              </a>
              <a href="https://www.instagram.com/novotel.tunis" aria-label="Instagram" target="_blank" rel="noopener noreferrer">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                </svg>
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

export default ChambresClient
