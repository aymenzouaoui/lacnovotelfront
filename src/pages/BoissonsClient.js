"use client"

import { useEffect, useState } from "react"
import API from "../services/api"
import "./BoissonsClientNew.css"
import { ChevronLeft, ChevronRight, LayoutGrid, Book } from "lucide-react"

// Translation system
const translations = {
  fr: {
    // Header
    back: "Retour",

    // Loading
    loadingDrinks: "Chargement des boissons...",

    // View modes
    switchToModern: "Passer à la vue moderne",
    switchToBook: "Passer à la vue livre",

    // Navigation
    previousCategory: "Catégorie précédente",
    nextCategory: "Catégorie suivante",

    // Menu
    noDrinksAvailable: "Aucune boisson disponible dans cette catégorie",
    drinks: "Boissons",

    // Allergens
    alcohol: "Alcool",
    caffeine: "Caféine",
    sugar: "Sucre",
    dairy: "Produits laitiers",
    artificialSweeteners: "Édulcorants artificiels",

    // Footer
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

    // Loading
    loadingDrinks: "Loading drinks...",

    // View modes
    switchToModern: "Switch to modern view",
    switchToBook: "Switch to book view",

    // Navigation
    previousCategory: "Previous category",
    nextCategory: "Next category",

    // Menu
    noDrinksAvailable: "No drinks available in this category",
    drinks: "Drinks",

    // Allergens
    alcohol: "Alcohol",
    caffeine: "Caffeine",
    sugar: "Sugar",
    dairy: "Dairy Products",
    artificialSweeteners: "Artificial Sweeteners",

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

    // Loading
    loadingDrinks: "جاري تحميل المشروبات...",

    // View modes
    switchToModern: "التبديل إلى العرض الحديث",
    switchToBook: "التبديل إلى عرض الكتاب",

    // Navigation
    previousCategory: "الفئة السابقة",
    nextCategory: "الفئة التالية",

    // Menu
    noDrinksAvailable: "لا توجد مشروبات متاحة في هذه الفئة",
    drinks: "المشروبات",

    // Allergens
    alcohol: "كحول",
    caffeine: "كافيين",
    sugar: "سكر",
    dairy: "منتجات الألبان",
    artificialSweeteners: "محليات صناعية",

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

const BoissonsClient = () => {
  const [boissons, setBoissons] = useState({})
  const [categories, setCategories] = useState([])
  const [currentCategoryIndex, setCurrentCategoryIndex] = useState(0)
  const [isLoaded, setIsLoaded] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [viewMode, setViewMode] = useState("modern") // "book" or "modern"
  const [headerImageIndex, setHeaderImageIndex] = useState(0)
  const [isMobile, setIsMobile] = useState(false)
  const [currentLanguage, setCurrentLanguage] = useState("fr")
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false)

  // Get translation function
  const t = (key) => translations[currentLanguage][key] || translations.fr[key] || key

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768)
    }
    handleResize() // Check initial size
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  useEffect(() => {
    // Load saved language from localStorage
    const savedLanguage = localStorage.getItem("novotel-language")
    if (savedLanguage && translations[savedLanguage]) {
      setCurrentLanguage(savedLanguage)
      // Update document direction for Arabic
      document.documentElement.dir = savedLanguage === "ar" ? "rtl" : "ltr"
      document.documentElement.lang = savedLanguage
    }
    window.scrollTo(0, 0) // Add this line to scroll to the top
  }, [])



const [pageContent, setPageContent] = useState(null);

useEffect(() => {
  const fetchPageContent = async () => {
    try {
      const res = await API.get("/page-contents/page/Boissons"); // 👈 pageName = boisson
      setPageContent(res.data);
    } catch (err) {
      console.error("Error fetching boisson page content:", err);
      setPageContent(null);
    }
  };
  fetchPageContent();
}, []);


  // Language change handler
  const changeLanguage = (langCode) => {
    setCurrentLanguage(langCode)
    localStorage.setItem("novotel-language", langCode)
    setShowLanguageDropdown(false)

    // Update document direction for Arabic
    document.documentElement.dir = langCode === "ar" ? "rtl" : "ltr"
    document.documentElement.lang = langCode
  }

  // Auto-rotate header images in modern view
  useEffect(() => {
    if (viewMode !== "modern" || categories.length === 0) return
    const currentCategory = categories[currentCategoryIndex]
    if (!currentCategory?.image) return
    const interval = setInterval(() => {
      setHeaderImageIndex((prev) => (prev + 1) % 3) // Cycle through 3 placeholder variations
    }, 5000)
    return () => clearInterval(interval)
  }, [viewMode, categories, currentCategoryIndex])

  const fetchAll = async () => {
    try {
      setIsLoading(true)
      const catRes = await API.get("/categories-boisson")
      setCategories(catRes.data)
      // Fetch all boissons
      const res = await API.get("/boissons")
      // Group boissons by category
      const groupedBoissons = {}
      catRes.data.forEach((cat) => {
        groupedBoissons[cat._id] = res.data.filter((b) => b.category?._id === cat._id || b.category === cat._id)
      })
      setBoissons(groupedBoissons)
      setIsLoaded(true)
    } catch (error) {
      console.error("Error fetching data:", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchAll()
  }, [])

  const nextMenu = () => {
    if (currentCategoryIndex < categories.length - 1) {
      const menuContainer = document.querySelector(".menu-spread-drinks")
      if (menuContainer) {
        menuContainer.classList.add("slide-out-left-drinks")
        setTimeout(() => {
          setCurrentCategoryIndex(currentCategoryIndex + 1)
          menuContainer.classList.remove("slide-out-left-drinks")
          menuContainer.classList.add("slide-in-right-drinks")
          setTimeout(() => {
            menuContainer.classList.remove("slide-in-right-drinks")
          }, 300)
        }, 300)
      } else {
        setCurrentCategoryIndex(currentCategoryIndex + 1)
      }
    }
  }

  const prevMenu = () => {
    if (currentCategoryIndex > 0) {
      const menuContainer = document.querySelector(".menu-spread-drinks")
      if (menuContainer) {
        menuContainer.classList.add("slide-out-right-drinks")
        setTimeout(() => {
          setCurrentCategoryIndex(currentCategoryIndex - 1)
          menuContainer.classList.remove("slide-out-right-drinks")
          menuContainer.classList.add("slide-in-left-drinks")
          setTimeout(() => {
            menuContainer.classList.remove("slide-in-left-drinks")
          }, 300)
        }, 300)
      } else {
        setCurrentCategoryIndex(currentCategoryIndex - 1)
      }
    }
  }

  // Change to a specific category by index
  const goToCategory = (index) => {
    if (index !== currentCategoryIndex) {
      setCurrentCategoryIndex(index)
      setHeaderImageIndex(0)
    }
  }

  // Get current category drinks
  const getCurrentCategoryDrinks = () => {
    if (!categories.length) return []
    const currentCategory = categories[currentCategoryIndex]
    return boissons[currentCategory._id] || []
  }

  // Toggle between view modes
  const toggleViewMode = () => {
    setViewMode(viewMode === "book" ? "modern" : "book")
    setHeaderImageIndex(0)
  }

  const getCurrentLanguage = () => languages.find((lang) => lang.code === currentLanguage)

  // Allergen icons mapping for drinks
  const allergenIcons = {
    alcohol: (
      <svg width="24" height="24" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M20 8v8l8 32h8l8-32V8H20zm16 8H28v-4h8v4zm-4 32c-2 0-4-2-4-4s2-4 4-4 4 2 4 4-2 4-4 4z"
          fill="#ffffff"
          stroke="#007BFF"
          strokeWidth="2"
        />
      </svg>
    ),
    caffeine: (
      <svg width="24" height="24" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M16 16v32c0 4 4 8 8 8h16c4 0 8-4 8-8V24h4c2 0 4-2 4-4s-2-4-4-4h-4v-8c0-2-2-4-4-4H20c-2 0-4 2-4 4z"
          fill="#ffffff"
          stroke="#007BFF"
          strokeWidth="2"
        />
        <circle cx="28" cy="28" r="2" fill="#007BFF" />
        <circle cx="36" cy="36" r="2" fill="#007BFF" />
      </svg>
    ),
    sugar: (
      <svg width="24" height="24" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M32 8L24 16v32l8 8 8-8V16l-8-8zm0 8l4 4v24l-4 4-4-4V20l4-4z"
          fill="#ffffff"
          stroke="#007BFF"
          strokeWidth="2"
        />
      </svg>
    ),
    dairy: (
      <svg width="24" height="24" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M24 4v12l-6 10v34h28V26l-6-10V4H24zm12 12h-8V6h8v10zm4 38H24V28l4-6h8l4 6v26z"
          fill="#ffffff"
          stroke="#007BFF"
          strokeWidth="2"
        />
      </svg>
    ),
    artificial: (
      <svg width="24" height="24" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
        <circle cx="32" cy="32" r="28" fill="#ffffff" stroke="#007BFF" strokeWidth="2" />
        <path d="M24 24h16v16H24z" fill="#007BFF" />
        <circle cx="32" cy="32" r="4" fill="#ffffff" />
      </svg>
    ),
  }

  return (
    <div className={`hotel-app-drinks ${currentLanguage === "ar" ? "rtl" : "ltr"}`}>
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
        }

        .rtl .view-toggle-button {
          right: 15px;
          left: auto;
        }

        .rtl .header-back-link-drinks {
          flex-direction: row-reverse;
        }

        .rtl .header-back-link-drinks svg {
          margin-left: 8px;
          margin-right: 0;
        }

        .rtl .nav-button-drinks.prev svg {
          transform: scaleX(-1);
        }

        .rtl .nav-button-drinks.next svg {
          transform: scaleX(-1);
        }

        .rtl .modern-allergen svg {
          margin-right: 0;
          margin-left: 5px;
        }

        .rtl .modern-drink-card {
          flex-direction: row-reverse;
        }

        .rtl .modern-drink-content {
          text-align: right;
        }

        .rtl .modern-drink-price {
          align-self: flex-start;
        }

        /* Modern view styles */
        .view-toggle-button {
          position: absolute;
          top: 15px;
          left: 15px;
          background: var(--primary);
          color: white;
          border: none;
          border-radius: 50%;
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
          z-index: 10;
          transition: all 0.3s ease;
        }
        .view-toggle-button:hover {
          transform: scale(1.1);
          background: var(--primary-dark);
        }
        .modern-menu-container {
          width: 100%;
          max-width: 800px;
          margin: 0 auto;
          padding: 0;
          background: #fff;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }
        .modern-header-image {
          width: 100%;
          height: 200px;
          position: relative;
          overflow: hidden;
        }
        .modern-header-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: opacity 0.5s ease;
        }
        .modern-header-title {
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
          padding: 20px;
          background: linear-gradient(transparent, rgba(0, 0, 0, 0.7));
          color: white;
        }
        .modern-header-title h2 {
          margin: 0;
          font-size: 28px;
          font-weight: 600;
        }
        .modern-category-tabs {
          display: flex;
          overflow-x: auto;
          padding: 0;
          background: #f8f9fa;
          border-bottom: 1px solid #e9ecef;
          scrollbar-width: none;
        }
        .modern-category-tabs::-webkit-scrollbar {
          display: none;
        }
        .category-tab {
          padding: 15px 20px;
          background: white;
          border: none;
          white-space: nowrap;
          cursor: pointer;
          transition: all 0.2s ease;
          font-weight: 500;
          color: #495057;
          border-right: 1px solid #e9ecef;
        }
        .category-tab.active {
          background: var(--primary);
          color: white;
        }
        .modern-allergens {
          display: flex;
          flex-wrap: wrap;
          gap: 15px;
          padding: 15px;
          background: #f8f9fa;
          border-bottom: 1px solid #e9ecef;
        }
        .modern-allergen {
          display: flex;
          align-items: center;
          font-size: 13px;
          color: #495057;
          background: white;
          padding: 5px 10px;
          border-radius: 4px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }
        .modern-allergen svg {
          margin-right: 5px;
        }
        .rtl .modern-allergen svg {
          margin-right: 0;
          margin-left: 5px;
        }
        .modern-drinks-items {
          padding: 20px;
          max-height: 60vh;
          overflow-y: auto;
        }
        .modern-drinks-grid {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        /* Updated drink card styles to support restaurant menu layout for items without images */
        .modern-drink-card {
          display: flex;
          background: white;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          transition: all 0.3s ease;
          border: 1px solid #e9ecef;
        }
        .modern-drink-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
        }

        /* Restaurant menu style for drinks without images */
        .modern-drink-card.no-image {
          padding: 16px 20px;
          margin-bottom: 20px;
          border-bottom: 1px solid #e9ecef;
        }
        .modern-drink-card.no-image .modern-drink-content {
          padding: 0;
          width: 100%;
        }
        .modern-drink-card.no-image .modern-drink-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          width: 100%;
          margin-bottom: 8px;
        }
        .modern-drink-card.no-image .modern-drink-title {
          flex: 1;
          font-size: 18px;
          font-weight: 500;
          margin: 0;
          line-height: 1.4;
          margin-right: 16px;
          white-space: normal;
          overflow: visible;
          text-overflow: unset;
        }
        .modern-drink-card.no-image .modern-drink-price {
          flex-shrink: 0;
          display: inline-flex;
          align-items: center;
          gap: 4px;
          white-space: nowrap;
          font-weight: 600;
          color: var(--primary);
          font-size: 18px;
          background: none;
          padding: 0;
          border-radius: 0;
          box-shadow: none;
          min-width: auto;
        }

        /* Original card styles for drinks with images */
        .modern-drink-image {
          width: 140px;
          height: 120px;
          flex-shrink: 0;
          background: #f8f9fa;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
        }
        .modern-drink-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .drink-placeholder {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
        }
        .modern-drink-content {
          flex: 1;
          padding: 16px 20px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          position: relative;
        }
        .modern-drink-title {
          font-size: 18px;
          font-weight: 600;
          margin: 0 0 8px 0;
          color: #2c3e50;
          line-height: 1.3;
        }
        .modern-drink-description {
          color: #6c757d;
          font-size: 14px;
          margin: 0 0 12px 0;
          line-height: 1.4;
          flex-grow: 1;
        }
        .modern-drink-volume {
          font-size: 12px;
          color: #adb5bd;
          margin-bottom: 12px;
          font-weight: 500;
        }
        .modern-drink-price {
          background: var(--primary);
          color: white;
          padding: 8px 16px;
          border-radius: 20px;
          font-weight: 600;
          font-size: 16px;
          text-align: center;
          align-self: flex-end;
          min-width: 80px;
          box-shadow: 0 2px 8px rgba(0, 71, 171, 0.3);
        }
        @media (max-width: 768px) {
          .modern-drink-card {
            flex-direction: column;
          }
          .modern-drink-image {
            width: 100%;
            height: 160px;
          }
          .modern-drink-content {
            padding: 16px;
          }
          .modern-drink-price {
            align-self: stretch;
            margin-top: 12px;
          }
        }
        @media (max-width: 480px) {
          .modern-drinks-items {
            padding: 15px;
          }
          .modern-drinks-grid {
            gap: 12px;
          }
          .modern-drink-image {
            height: 140px;
          }
        }
          .page-content-boisson {
  margin: 20px 0;
  text-align: center;
}

.page-content-boisson img.page-content-image {
  max-width: 100%;
  height: auto;
  border-radius: 8px;
  margin-bottom: 15px;
}

.page-content-boisson p.page-content-description {
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

      <header className="app-header-drinks">
        <a href="/Home" className="header-back-link-drinks">
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
        </a>
        <div className="logo-container-drinks">
          <img src="/images/logo2.png" alt="Novotel Logo" className="logo-drinks" />
        </div>
        <div></div>
      </header>

      <main className="app-main-drinks">
{pageContent && (
  <div className="page-content-boisson">
    {pageContent.image && (
      <img
        src={pageContent.image}
        alt="Boisson"
        className="page-content-image"
        onError={(e) => (e.target.src = "/placeholder.svg")}
      />
    )}
    {pageContent.description && (
      <div
  className="page-content-description"
  dangerouslySetInnerHTML={{ __html: pageContent.description }}
/>

    )}
  </div>
)}
        {isLoading ? (
          <div className="loading-container-drinks">
            <div className="loading-spinner-drinks"></div>
            <p>{t("loadingDrinks")}</p>
          </div>
        ) : (
          <div className="menu-display-container-drinks" style={{ position: "relative" }}>
            {/* View Toggle Button */}
            <button
              className="view-toggle-button"
              onClick={toggleViewMode}
              aria-label={viewMode === "book" ? t("switchToModern") : t("switchToBook")}
            >
              {viewMode === "book" ? <LayoutGrid size={20} /> : <Book size={20} />}
            </button>
            {viewMode === "book" ? (
              // Original Book View
              <>
                {currentCategoryIndex >= 0 && currentCategoryIndex < categories.length && (
                  <div className="menu-spread-drinks">
                    <div className="menu-content-drinks">
                      {/* Left side - Category Image */}
                      <div className="menu-image-side-drinks">
                        {categories[currentCategoryIndex].image ? (
                          <img
                            src={categories[currentCategoryIndex].image || "/placeholder.svg"}
                            alt={categories[currentCategoryIndex].name}
                            className="menu-image-drinks"
                          />
                        ) : (
                          <div className="menu-image-placeholder-drinks">
                            <span>{categories[currentCategoryIndex].name}</span>
                          </div>
                        )}
                      </div>
                      {/* Right side - Drinks Items */}
                      <div className="menu-items-side-drinks">
                        <h2 className="menu-title-drinks">{categories[currentCategoryIndex].name}</h2>
                        {boissons[categories[currentCategoryIndex]._id]?.length > 0 ? (
                          <div className="menu-items-list-drinks">
                            {boissons[categories[currentCategoryIndex]._id].map((boisson, idx) => (
                              <div key={idx} className="menu-item-drinks">
                                <div className="menu-item-header-drinks">
                                  <h3 className="menu-item-name-drinks">{boisson.title}</h3>
                                  <div className="menu-item-price-drinks">{boisson.price} TND</div>
                                </div>
                                <p className="menu-item-description-drinks">{boisson.description}</p>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="empty-menu-drinks">
                            <p>{t("noDrinksAvailable")}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
                <div className="menu-navigation-drinks">
                  <button
                    className="nav-button-drinks prev"
                    onClick={prevMenu}
                    disabled={currentCategoryIndex === 0}
                    aria-label={t("previousCategory")}
                  >
                    <ChevronLeft className="h-6 w-6" />
                  </button>
                  <button
                    className="nav-button-drinks next"
                    onClick={nextMenu}
                    disabled={currentCategoryIndex === categories.length - 1}
                    aria-label={t("nextCategory")}
                  >
                    <ChevronRight className="h-6 w-6" />
                  </button>
                </div>
              </>
            ) : (
              // Modern View
              <div className="modern-menu-container">
                {/* Header Image */}
                <div className="modern-header-image">
                  <img
                    src={categories[currentCategoryIndex]?.image || "/placeholder.svg"}
                    alt={categories[currentCategoryIndex]?.name}
                    onError={(e) => (e.target.src = "/placeholder.svg")}
                  />
                  <div className="modern-header-title">
                    <h2>{categories[currentCategoryIndex]?.name || t("drinks")}</h2>
                  </div>
                </div>

                {/* Category Tabs - Showing all categories */}
                <div className="modern-category-tabs">
                  {categories.map((category, index) => (
                    <button
                      key={index}
                      className={`category-tab ${currentCategoryIndex === index ? "active" : ""}`}
                      onClick={() => goToCategory(index)}
                    >
                      {category.name}
                    </button>
                  ))}
                </div>

                {/* Drinks Items - Updated Layout */}
                <div className="modern-drinks-items">
                  {getCurrentCategoryDrinks().length > 0 ? (
                    <div className="modern-drinks-grid">
                      {getCurrentCategoryDrinks().map((drink, idx) => (
                        <div key={idx} className={`modern-drink-card ${!drink.image ? "no-image" : ""}`}>
                          {drink.image && (
                            <div className="modern-drink-image">
                              <img
                                src={drink.image || "/placeholder.svg"}
                                alt={drink.title}
                                onError={(e) => (e.target.src = "/placeholder.svg")}
                              />
                            </div>
                          )}
                          <div className="modern-drink-content">
                            {!drink.image ? (
                              // Restaurant menu style layout for drinks without images
                              <>
                                <div className="modern-drink-header">
                                  <div className="modern-drink-title">{drink.title}</div>
                                  <span className="modern-drink-price">
                                    {drink.price} <span className="currency">TND</span>
                                  </span>
                                </div>
                                <p className="modern-drink-description">{drink.description}</p>
                                {drink.volume && <div className="modern-drink-volume">{drink.volume} ml</div>}
                              </>
                            ) : (
                              // Original card layout for drinks with images
                              <>
                                <h4 className="modern-drink-title">{drink.title}</h4>
                                <p className="modern-drink-description">{drink.description}</p>
                                {drink.volume && <div className="modern-drink-volume">{drink.volume} ml</div>}
                                <div className="modern-drink-price">{drink.price} TND</div>
                              </>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="empty-menu-drinks">
                      <p>{t("noDrinksAvailable")}</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
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

export default BoissonsClient
