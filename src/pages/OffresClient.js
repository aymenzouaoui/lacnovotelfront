"use client"

import { useEffect, useState } from "react"
import API from "../services/api"
import "./OffresClient.css"

// Translation system
const translations = {
  fr: {
    // Header
    back: "Retour",

    // Welcome banner
    specialOffers: "Offres Spéciales",
    discoverOffersPromotions: "Découvrez nos offres et promotions exclusives",

    // Loading & Empty states
    loadingOffers: "Chargement des offres...",
    noOfferAvailable: "Aucune offre disponible",
    comeBackSoonOffers: "Revenez bientôt pour découvrir nos prochaines offres",

    // Detail view
    backToList: "Retour à la liste",
    noDescriptionAvailable: "Pas de description disponible.",
    discount: "Remise",
    validity: "Validité",
    status: "Statut",
    active: "Active",
    inactive: "Inactive",
    viewDetails: "Voir détails",

    // Footer (re-use from previous components if consistent)
    contact: "Contact",
    address: "Adresse",
    reservations: "Réservations",
    wifi: "Wi-Fi",
    followUs: "Suivez-nous",
    network: "Réseau",
    password: "Mot de passe",
    availableAtReception: "Disponible à la réception",
    addressLine1: "Avenue Mohamed V",
    addressLine2: "Tunis, Tunisie",
    allRightsReserved: "Tous droits réservés",
    createdBy: "Créé par",
  },
  en: {
    // Header
    back: "Back",

    // Welcome banner
    specialOffers: "Special Offers",
    discoverOffersPromotions: "Discover our exclusive offers and promotions",

    // Loading & Empty states
    loadingOffers: "Loading offers...",
    noOfferAvailable: "No offer available",
    comeBackSoonOffers: "Come back soon to discover our upcoming offers",

    // Detail view
    backToList: "Back to list",
    noDescriptionAvailable: "No description available.",
    discount: "Discount",
    validity: "Validity",
    status: "Status",
    active: "Active",
    inactive: "Inactive",
    viewDetails: "View details",

    // Footer
    contact: "Contact",
    address: "Address",
    reservations: "Reservations",
    wifi: "Wi-Fi",
    followUs: "Follow Us",
    network: "Network",
    password: "Password",
    availableAtReception: "Available at reception",
    addressLine1: "Avenue Mohamed V",
    addressLine2: "1002 Tunis, Tunisia",
    allRightsReserved: "All rights reserved",
    createdBy: "Created by",
  },
  ar: {
    // Header
    back: "رجوع",

    // Welcome banner
    specialOffers: "عروض خاصة",
    discoverOffersPromotions: "اكتشف عروضنا وترويجاتنا الحصرية",

    // Loading & Empty states
    loadingOffers: "جاري تحميل العروض...",
    noOfferAvailable: "لا توجد عروض متاحة",
    comeBackSoonOffers: "عد قريبًا لاكتشاف عروضنا القادمة",

    // Detail view
    backToList: "العودة إلى القائمة",
    noDescriptionAvailable: "لا يوجد وصف متاح.",
    discount: "خصم",
    validity: "الصلاحية",
    status: "الحالة",
    active: "نشط",
    inactive: "غير نشط",
    viewDetails: "عرض التفاصيل",

    // Footer
    contact: "اتصل بنا",
    address: "العنوان",
    reservations: "الحجوزات",
    wifi: "واي فاي",
    followUs: "تابعونا",
    network: "الشبكة",
    password: "كلمة المرور",
    availableAtReception: "متوفرة في الاستقبال",
    addressLine1: "شارع الكورنيش",
    addressLine2: "تونس، تونس",
    allRightsReserved: "جميع الحقوق محفوظة",
    createdBy: "تم إنشاؤه بواسطة",
  },
}

const languages = [
  { code: "fr", name: "Français", flag: "/images/fr-flag-v2.png" },
  { code: "en", name: "English", flag: "/images/en-flag-v2.png" },
  { code: "ar", name: "العربية", flag: "/images/ar-flag-v2.png" },
]

const OffresClient = () => {
  const [offres, setOffres] = useState([])
  const [selectedOffre, setSelectedOffre] = useState(null)
  const [isLoaded, setIsLoaded] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [currentLanguage, setCurrentLanguage] = useState("fr")
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false)

  // Get translation function
  const t = (key) => translations[currentLanguage][key] || translations.fr[key] || key

  const fetchOffres = async () => {
    try {
      setIsLoading(true)
      const res = await API.get("/offres")
      setOffres(res.data)
      setIsLoaded(true)
    } catch (error) {
      console.error("Erreur chargement des offres:", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchOffres()
    window.scrollTo(0, 0) // Scroll to the top of the page on mount

    // Load saved language from localStorage
    const savedLanguage = localStorage.getItem("novotel-language")
    if (savedLanguage && translations[savedLanguage]) {
      setCurrentLanguage(savedLanguage)
      // Update document direction for Arabic
      document.documentElement.dir = savedLanguage === "ar" ? "rtl" : "ltr"
      document.documentElement.lang = savedLanguage
    }

    // Force a re-render after a short delay to ensure visibility
    const timer = setTimeout(() => {
      setIsLoaded(true)
    }, 100)
    return () => clearTimeout(timer)
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

  const getCurrentLanguage = () => languages.find((lang) => lang.code === currentLanguage)

  return (
    <div className={`hotel-app5 ${currentLanguage === "ar" ? "rtl" : "ltr"}`}>
      <style jsx>{`
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

        /* RTL Support */
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

        .rtl .welcome-banner h1,
        .rtl .welcome-banner p {
          text-align: right;
        }

        .rtl .loading-container p,
        .rtl .empty-state h3,
        .rtl .empty-state p {
          text-align: right;
        }

        .rtl .offre-detail-view .back-to-list {
          flex-direction: row-reverse;
        }

        .rtl .offre-detail-view .back-to-list svg {
          margin-left: 8px;
          margin-right: 0;
        }

        .rtl .offre-detail-info {
          text-align: right;
        }

        .rtl .offre-details-full {
          text-align: right;
        }

        .rtl .offre-detail-item {
          flex-direction: row-reverse;
        }

        .rtl .detail-label {
          margin-left: 5px;
          margin-right: 0;
        }

        .rtl .content-item-content {
          text-align: right;
        }

        .rtl .content-item-arrow {
          transform: scaleX(-1); /* Flip arrow for RTL */
        }

        .rtl .content-item-overlay {
          direction: rtl; /* Ensure overlay text is correct */
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
        <button
          className="header-back-link"
          onClick={() => {
            if (selectedOffre) {
              setSelectedOffre(null)
            } else {
              window.location.href = "/Home"
            }
          }}
        >
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
        <div></div> {/* Empty div for flex spacing */}
      </header>
      <main className="app-main">
        <div className="welcome-banner">
          <h1>
            <span>{t("specialOffers")}</span>
          </h1>
          <p>{t("discoverOffersPromotions")}</p>
        </div>
        <div className="content-container">
          {isLoading ? (
            <div className="loading-container">
              <div className="loading-spinner"></div>
              <p>{t("loadingOffers")}</p>
            </div>
          ) : offres.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">🔍</div>
              <h3>{t("noOfferAvailable")}</h3>
              <p>{t("comeBackSoonOffers")}</p>
            </div>
          ) : selectedOffre ? (
            <div className="offre-detail-view">
              <button className="back-to-list" onClick={() => setSelectedOffre(null)}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d={currentLanguage === "ar" ? "M5 12H19M19 12L12 5M19 12L12 19" : "M19 12H5M5 12L12 19M5 12L12 5"}
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                {t("backToList")}
              </button>
              <div className="offre-detail-content">
                <div className="offre-detail-image-container">
                  <img
                    src={selectedOffre.image || "/placeholder.svg"}
                    alt={selectedOffre.title}
                    className="offre-detail-image"
                    onError={(e) => {
                      e.target.src = `/placeholder.svg?height=300&width=500&text=${selectedOffre.title}`
                    }}
                  />
                </div>
                <div className="offre-detail-info">
                  <h2 className="offre-detail-name">{selectedOffre.title}</h2>
                  <div className="offre-detail-description">
                    <p>{selectedOffre.description || t("noDescriptionAvailable")}</p>
                  </div>
                  <div className="offre-details-full">
                    <div className="offre-detail-item">
                      <span className="detail-label">{t("discount")}:</span>
                      <span className="detail-value">{selectedOffre.discountPercentage}%</span>
                    </div>
                    <div className="offre-detail-item">
                      <span className="detail-label">{t("validity")}:</span>
                      <span className="detail-value">
                        {new Date(selectedOffre.startDate).toLocaleDateString(
                          currentLanguage === "ar" ? "ar-TN" : currentLanguage === "en" ? "en-US" : "fr-FR",
                        )}{" "}
                        –{" "}
                        {new Date(selectedOffre.endDate).toLocaleDateString(
                          currentLanguage === "ar" ? "ar-TN" : currentLanguage === "en" ? "en-US" : "fr-FR",
                        )}
                      </span>
                    </div>
                    <div className="offre-detail-item">
                      <span className="detail-label">{t("status")}:</span>
                      <span className="detail-value">
                        {selectedOffre.active ? `✅ ${t("active")}` : `❌ ${t("inactive")}`}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className={`content-grid ${isLoaded ? "loaded" : ""}`}>
              {offres.map((offre, index) => (
                <div
                  key={offre._id}
                  className="content-item"
                  style={{ animationDelay: `${index * 0.05}s` }}
                  onClick={() => setSelectedOffre(offre)}
                >
                  <div className="content-item-image">
                    <img
                      src={offre.image || "/placeholder.svg"}
                      alt={offre.title}
                      onError={(e) => {
                        e.target.src = `/placeholder.svg?height=120&width=300&text=${offre.title}`
                      }}
                    />
                    <div className="content-item-overlay">
                      <span className="view-details">{t("viewDetails")}</span>
                    </div>
                  </div>
                  <div className="content-item-content">
                    <h3>{offre.title}</h3>
                    <div className="content-item-arrow">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                          d="M12 4L20 12L12 20M4 12H20"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
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
            <p>+216 71 142 900</p>
            <p>H6145@accor.com</p>
          </div>
          <div className="footer-section">
            <h4>{t("address")}</h4>
            <p>{t("addressLine1")}</p>
            <p>{t("addressLine2")}</p>
          </div>
          <div className="footer-section">
            <h4>{t("reservations")}</h4>
            <p>+216 71 142 900</p>
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
              <a href="https://www.facebook.com/NovotelTunis" aria-label="Facebook">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                </svg>
              </a>
              <a href="https://www.instagram.com/novotel.tunis" aria-label="Instagram">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
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
            © {new Date().getFullYear()} Novotel Tunis. {t("allRightsReserved")}.
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

export default OffresClient
