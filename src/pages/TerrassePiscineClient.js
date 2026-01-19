"use client"

import { useEffect, useState, useRef } from "react"
import API from "../services/api"
import "./TerrassePiscineClient.css"
import "./client-image-fix-dark.css"
import { ChevronLeft, ChevronRight, LayoutGrid, Book } from "lucide-react"

// Translation system
const translations = {
  fr: {
    // Header
    back: "Retour",

    // Language Selector
    switchToModern: "Passer à la vue moderne",
    switchToBook: "Passer à la vue livre",

    // Welcome Banner
    skyLounge: "Terrasse Piscine",
    panoramicLounge: "Détendez-vous sur notre terrasse piscine avec vue sur le lac et ambiance conviviale",

    // Loading & Empty States
    loadingLounges: "Chargement des espaces de la terrasse...",
    noSkyLoungeAvailable: "Aucune offre disponible pour la Terrasse Piscine pour le moment",
    comeBackSoonLounges: "Revenez bientôt pour découvrir nos nouvelles expériences en plein air",
    backToList: "Retour à la liste",
    noDescriptionAvailable: "Pas de description disponible.",
    viewDetails: "Voir détails",
    loadingMenus: "Chargement des menus...",
    noMenuAvailable: "Aucun menu disponible",
    comeBackSoonMenus: "Revenez bientôt pour découvrir nos menus",
    noDishAvailable: "Aucun plat disponible dans ce menu",

    // Lounge Details
    viewMenu: "Voir la carte",
    reserveTable: "Réserver un transat ou une table",
    panoramicView: "Vue sur la piscine et le lac",
    signatureCocktails: "Cocktails signature & rafraîchissements",
    relaxingAmbiance: "Ambiance détente au bord de la piscine",
    personalizedService: "Service attentionné en extérieur",

    // Modals
    reserveRoom: "Réserver une salle", // Re-used for table reservation
    name: "Nom",
    email: "Email",
    phoneNumber: "Numéro de téléphone",
    from: "De",
    to: "À",
    people: "personnes",
    reserve: "Réserver",
    cancel: "Annuler",
    reservationSuccess: "Réservation créée avec succès !",
    reservationError: "Erreur lors de la création de la réservation.",
    fillAllFields: "Veuillez remplir tous les champs",
    numberOfPeople: "Nombre de personnes",
    others: "Autres",

    // Footer (re-use from previous components if consistent)
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

    // Language Selector
    switchToModern: "Switch to modern view",
    switchToBook: "Switch to book view",

    // Welcome Banner
    skyLounge: "Pool Terrace",
    panoramicLounge: "Relax on our pool terrace with lake views and a warm, casual atmosphere",

    // Loading & Empty States
    loadingLounges: "Loading pool terrace areas...",
    noSkyLoungeAvailable: "No Pool Terrace offers available at the moment",
    comeBackSoonLounges: "Come back soon to discover new outdoor experiences",
    backToList: "Back to list",
    noDescriptionAvailable: "No description available.",
    viewDetails: "View details",
    loadingMenus: "Loading menus...",
    noMenuAvailable: "No menu available",
    comeBackSoonMenus: "Come back soon to discover our menus",
    noDishAvailable: "No dish available in this menu",

    // Lounge Details
    viewMenu: "View the menu",
    reserveTable: "Reserve a sunbed or table",
    panoramicView: "View of the pool and the lake",
    signatureCocktails: "Signature cocktails & refreshments",
    relaxingAmbiance: "Relaxed atmosphere by the pool",
    personalizedService: "Attentive outdoor service",

    // Modals
    reserveRoom: "Reserve a room", // Re-used for table reservation
    name: "Name",
    email: "Email",
    phoneNumber: "Phone Number",
    from: "From",
    to: "To",
    people: "people",
    reserve: "Reserve",
    cancel: "Cancel",
    reservationSuccess: "Reservation created successfully!",
    reservationError: "Error creating reservation.",
    fillAllFields: "Please fill in all fields",
    numberOfPeople: "Number of people",
    others: "Others",

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

    // Language Selector
    switchToModern: "التبديل إلى العرض الحديث",
    switchToBook: "التبديل إلى عرض الكتاب",

    // Welcome Banner
    skyLounge: "تراس المسبح",
    panoramicLounge: "استرخِ على تراس المسبح مع إطلالة على البحيرة وأجواء مريحة",

    // Loading & Empty States
    loadingLounges: "جاري تحميل مساحات تراس المسبح...",
    noSkyLoungeAvailable: "لا توجد عروض متاحة حالياً على تراس المسبح",
    comeBackSoonLounges: "عد قريبًا لاكتشاف تجاربنا الخارجية الجديدة",
    backToList: "العودة إلى القائمة",
    noDescriptionAvailable: "لا يوجد وصف متاح.",
    viewDetails: "عرض التفاصيل",
    loadingMenus: "جاري تحميل القوائم...",
    noMenuAvailable: "لا توجد قائمة متاحة",
    comeBackSoonMenus: "عد قريبًا لاكتشاف قوائمنا",
    noDishAvailable: "لا يوجد طبق متاح في هذه القائمة",

    // Lounge Details
    viewMenu: "عرض قائمة التراس",
    reserveTable: "حجز سرير استرخاء أو طاولة",
    panoramicView: "إطلالة على المسبح والبحيرة",
    signatureCocktails: "كوكتيلات مميزة ومنعشات",
    relaxingAmbiance: "أجواء هادئة بجانب المسبح",
    personalizedService: "خدمة خارجية مميزة",

    // Modals
    reserveRoom: "حجز غرفة", // Re-used for table reservation
    name: "الاسم",
    email: "البريد الإلكتروني",
    phoneNumber: "رقم الهاتف",
    from: "من",
    to: "إلى",
    people: "أشخاص",
    reserve: "حجز",
    cancel: "إلغاء",
    reservationSuccess: "تم إنشاء الحجز بنجاح!",
    reservationError: "حدث خطأ أثناء إنشاء الحجز.",
    fillAllFields: "يرجى ملء جميع الحقول",
    numberOfPeople: "عدد الأشخاص",
    others: "أخرى",

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


const renderDietaryBadges = (item) => (
  <>
    {item.isVegetarian && <span className="dietary-badge">🌱</span>}
    {item.isOrganic && <span className="dietary-badge">🌿</span>}
    {item.isLocal && <span className="dietary-badge">🏠</span>}
    {item.isGlutenFree && <span className="dietary-badge">🚫🌾</span>}
    {item.isLactoseFree && <span className="dietary-badge">🚫🥛</span>}
  </>
)

const TerrassePiscineClient = () => {
  const [lounges, setLounges] = useState([])
  const [selectedLounge, setSelectedLounge] = useState(null)
  const [isLoaded, setIsLoaded] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [reservationData, setReservationData] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    from: "",
    to: new Date().toISOString().split("T")[0],
    people: null,
  })
  const [isMobile, setIsMobile] = useState(false)
  const [showMenus, setShowMenus] = useState(false)
  const [menus, setMenus] = useState([])
  const [currentMenuIndex, setCurrentMenuIndex] = useState(0)
  const [currentImageIndex, setCurrentImageIndex] = useState(0) // For image carousel
  const [viewMode, setViewMode] = useState("modern") // "book" or "modern"
  const [headerImageIndex, setHeaderImageIndex] = useState(0)
  const bookRef = useRef(null)
  const [currentLanguage, setCurrentLanguage] = useState("fr")
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false)
  const [showVegetarianOnly] = useState(false)
  // React state and fetch
const [pageContent, setPageContent] = useState(null);

useEffect(() => {
  const fetchPageContent = async () => {
    try {
      const res = await API.get("/page-contents/page/TerrassePiscine"); // 👈 pageName = TerrassePiscine
      setPageContent(res.data);
    } catch (err) {
      console.error("Error fetching terrasse piscine page content:", err);
      setPageContent(null);
    }
  };
  fetchPageContent();
}, []);

  // Get translation function
  const t = (key) => translations[currentLanguage][key] || translations.fr[key] || key

  const DietaryLegend = () => (
  <div className="dietary-legend">
    <h4>{t("dietaryInformation")}</h4>
    <div className="legend-items">
      <span className="legend-item">🌱 {t("vegetarian")}</span>
      <span className="legend-item">🌿 {t("organic")}</span>
      <span className="legend-item">🏠 {t("local")}</span>
      <span className="legend-item">🚫🌾 {t("glutenFree")}</span>
      <span className="legend-item">🚫🥛 {t("lactoseFree")}</span>
    </div>
  </div>
)
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768)
    }
    handleResize() // Check initial size
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  // Auto-rotate header images in modern view
  useEffect(() => {
    if (viewMode !== "modern" || !selectedLounge || menus.length === 0) return
    const currentMenu = menus[currentMenuIndex]
    if (!currentMenu?.images || currentMenu.images.length <= 1) return
    const interval = setInterval(() => {
      setHeaderImageIndex((prev) => (prev + 1) % currentMenu.images.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [viewMode, selectedLounge, menus, currentMenuIndex])

  const fetchMenus = async (terrassePiscineId) => {
    try {
      setIsLoading(true)
      const res = await API.get("/menus")
      const filtered = res.data.filter((menu) => menu.terrassePiscine?._id === terrassePiscineId || menu.terrassePiscine === terrassePiscineId)
      setMenus(filtered)
      setCurrentMenuIndex(0)
      setCurrentImageIndex(0) // Reset image index when switching menus
    } catch (error) {
      console.error("Erreur chargement menus:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleReservationSubmit = async () => {
    try {
      if (
        !reservationData.name ||
        !reservationData.email ||
        !reservationData.phoneNumber ||
        !reservationData.from ||
        !reservationData.to ||
        !reservationData.people
      ) {
        alert(t("fillAllFields"))
        return
      }
      const payload = {
        ...reservationData,
        service: "terrassePiscine",
        serviceDetails: selectedLounge?.name || "",
        status: "pending",
      }
      await API.post("/reservations", payload)
      alert(t("reservationSuccess"))
      setShowModal(false)
      setReservationData({
        name: "",
        email: "",
        phoneNumber: "",
        from: "",
        to: new Date().toISOString().split("T")[0],
        people: null,
      })
    } catch (error) {
      console.error("Erreur de réservation:", error)
      alert(t("reservationError"))
    }
  }

  const nextMenu = () => {
    if (currentMenuIndex < menus.length - 1) {
      const menuContainer = document.querySelector(".menu-spread-new")
      if (menuContainer) {
        menuContainer.classList.add("slide-out-left-new")
        setTimeout(() => {
          setCurrentMenuIndex((prev) => prev + 1)
          setCurrentImageIndex(0) // Reset image index when changing menu
          menuContainer.classList.remove("slide-out-left-new")
          menuContainer.classList.add("slide-in-right-new")
          setTimeout(() => {
            menuContainer.classList.remove("slide-in-right-new")
          }, 300)
        }, 300)
      } else {
        setCurrentMenuIndex((prev) => prev + 1)
        setCurrentImageIndex(0)
      }
    }
  }

  const prevMenu = () => {
    if (currentMenuIndex > 0) {
      const menuContainer = document.querySelector(".menu-spread-new")
      if (menuContainer) {
        menuContainer.classList.add("slide-out-right-new")
        setTimeout(() => {
          setCurrentMenuIndex((prev) => prev - 1)
          setCurrentImageIndex(0) // Reset image index when changing menu
          menuContainer.classList.remove("slide-out-right-new")
          menuContainer.classList.add("slide-in-left-new")
          setTimeout(() => {
            menuContainer.classList.remove("slide-in-left-new")
          }, 300)
        }, 300)
      } else {
        setCurrentMenuIndex((prev) => prev - 1)
        setCurrentImageIndex(0)
      }
    }
  }

  // Image navigation functions
  const nextImage = () => {
    const currentMenu = menus[currentMenuIndex]
    if (currentMenu && currentMenu.images && currentImageIndex < currentMenu.images.length - 1) {
      setCurrentImageIndex(currentImageIndex + 1)
    }
  }
  const prevImage = () => {
    if (currentImageIndex > 0) {
      setCurrentImageIndex(currentImageIndex - 1)
    }
  }
  const goToImage = (index) => {
    setCurrentImageIndex(index)
  }

  // Change to a specific menu by index
  const goToMenu = (index) => {
    if (index !== currentMenuIndex) {
      setCurrentMenuIndex(index)
      setCurrentImageIndex(0)
      setHeaderImageIndex(0)
    }
  }

  // Get filtered items for the current menu
  const getCurrentMenuItems = () => {
    if (!menus.length) return []
    const currentMenu = menus[currentMenuIndex]
    const items = currentMenu?.items || []
    return showVegetarianOnly ? items.filter((item) => item.isVegetarian) : items
  }

  // Toggle between view modes
  const toggleViewMode = () => {
    setViewMode(viewMode === "book" ? "modern" : "book")
    setHeaderImageIndex(0)
  }

  const fetchLounges = async () => {
    try {
      setIsLoading(true)
      const res = await API.get("/terrasses-piscine")
      setLounges(res.data)
      setIsLoaded(true)
    } catch (err) {
      console.error("Erreur chargement:", err)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchLounges()
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

  // Allergen icons mapping (reserved for future use with legend)
  return (
    <div className={`hotel-app9 ${currentLanguage === "ar" ? "rtl" : "ltr"}`}>
      <style jsx>{`
        /* Language dropdown styles */
        .language-selector {
          position: absolute;
          top: 15px;
          left: 15px;
          z-index: 20;
        }

        /* Added vegetarian filter styles */
        .vegetarian-filter-header {
          background: rgba(0, 0, 0, 0.8);
          backdrop-filter: blur(10px);
          padding: 15px 20px;
          margin-bottom: 20px;
          border-radius: 12px;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .vegetarian-toggle-container {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .vegetarian-toggle-label {
          display: flex;
          align-items: center;
          gap: 12px;
          cursor: pointer;
          color: white;
          font-weight: 500;
          font-size: 16px;
        }

        .vegetarian-checkbox {
          display: none;
        }

        .vegetarian-toggle-slider {
          position: relative;
          width: 50px;
          height: 24px;
          background: rgba(255, 255, 255, 0.2);
          border-radius: 24px;
          transition: all 0.3s ease;
          border: 2px solid rgba(255, 255, 255, 0.3);
        }

         /* Added styles for dietary legend */
        .dietary-legend {
          background: #f8f9fa;
          border: 1px solid #e9ecef;
          border-radius: 8px;
          padding: 15px;
          margin-bottom: 20px;
        }

        .dietary-legend h4 {
          margin: 0 0 10px 0;
          font-size: 16px;
          font-weight: 600;
          color: #333;
        }
        .vegetarian-toggle-slider::before {
          content: '';
          position: absolute;
          top: 2px;
          left: 2px;
          width: 16px;
          height: 16px;
          background: white;
          border-radius: 50%;
          transition: all 0.3s ease;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }

        .vegetarian-checkbox:checked + .vegetarian-toggle-slider {
          background: linear-gradient(135deg, #4CAF50, #45a049);
          border-color: #4CAF50;
        }

        .vegetarian-checkbox:checked + .vegetarian-toggle-slider::before {
          transform: translateX(26px);
        }

        .vegetarian-toggle-text {
          user-select: none;
          font-size: 16px;
          font-weight: 500;
        }

        .vegetarian-badge {
          margin-left: 8px;
          font-size: 16px;
          opacity: 0.9;
        }

        /* Mobile responsiveness */
        @media (max-width: 768px) {
          .vegetarian-filter-header {
            padding: 12px 15px;
            margin-bottom: 15px;
          }
          
          .vegetarian-toggle-text {
            font-size: 14px;
          }
          
          .vegetarian-toggle-slider {
            width: 44px;
            height: 22px;
          }
          
          .vegetarian-toggle-slider::before {
            width: 14px;
            height: 14px;
          }
          
          .vegetarian-checkbox:checked + .vegetarian-toggle-slider::before {
            transform: translateX(22px);
          }
        }

        /* RTL support for vegetarian filter */
        .rtl .vegetarian-toggle-label {
          flex-direction: row-reverse;
        }

        .rtl .vegetarian-badge {
          margin-left: 0;
          margin-right: 8px;
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

        .rtl .view-toggle-button {
          right: 15px;
          left: auto;
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

        .rtl .spa-detail-view .back-to-list {
          flex-direction: row-reverse;
        }

        .rtl .spa-detail-view .back-to-list svg {
          margin-left: 8px;
          margin-right: 0;
        }

        .rtl .spa-detail-info {
          text-align: right;
        }

        .rtl .spa-features {
          align-items: flex-end;
        }

        .rtl .spa-feature-item {
          flex-direction: row-reverse;
        }

        .rtl .spa-feature-item .feature-icon {
          margin-left: 8px;
          margin-right: 0;
        }

        .rtl .spa-detail-cta {
          justify-content: flex-end;
        }

        .rtl .content-item-overlay .view-details {
          left: auto;
          right: 50%;
          transform: translateX(50%);
        }

        .rtl .content-item-content {
          text-align: right;
        }

        .rtl .content-item-arrow {
          transform: rotate(180deg);
        }

        .rtl .modern-header-title {
          text-align: right;
        }

        .rtl .modern-menu-tabs {
          direction: rtl; /* Ensure tabs scroll correctly */
        }

        .rtl .menu-tab {
          border-left: 1px solid #e9ecef;
          border-right: none;
        }

        .rtl .modern-allergen svg {
          margin-right: 0;
          margin-left: 5px;
        }

        .rtl .modern-item-image {
          margin-right: 0;
          margin-left: 15px;
        }

        .rtl .modern-item-header {
          flex-direction: row-reverse;
        }

        .rtl .modern-item-content {
          text-align: right;
        }

        .rtl .menu-items-side-new {
          text-align: right;
        }

        .rtl .menu-navigation-new .nav-button-new.prev svg {
          transform: scaleX(-1);
        }

        .rtl .menu-navigation-new .nav-button-new.next svg {
          transform: scaleX(-1);
        }

        .rtl .image-nav-btn-new.prev-image-new svg {
          transform: scaleX(-1);
        }

        .rtl .image-nav-btn-new.next-image-new svg {
          transform: scaleX(-1);
        }

        .rtl .image-counter-new {
          direction: ltr; /* Keep numbers LTR even in RTL context */
        }

        .rtl .image-dots-new {
          direction: ltr; /* Keep dots LTR even in RTL context */
        }

        .rtl .modal h2,
        .rtl .modal input,
        .rtl .modal-actions {
          text-align: right;
        }

        .rtl .modal-actions button {
          margin-left: 10px;
          margin-right: 0;
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

        /* Fixed image dimensions CSS - Smaller size to fit mobile containers */
        .menu-image-carousel-fixed {
          position: relative !important;
          width: 100% !important;
          height: 100% !important;
          display: flex !important;
          flex-direction: column !important;
          align-items: center !important;
          justify-content: center !important;
          gap: 12px !important;
          padding: 12px !important;
        }
        .carousel-container-fixed {
          position: relative !important;
          width: 180px !important;
          height: 140px !important;
          margin: 0 auto 12px auto !important;
          overflow: hidden !important;
          border-radius: 8px !important;
          flex-shrink: 0 !important;
          display: block !important;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1) !important;
        }
        .menu-image-fixed {
          width: 180px !important;
          height: 140px !important;
          min-width: 180px !important;
          min-height: 140px !important;
          max-width: 180px !important;
          max-height: 140px !important;
          object-fit: cover !important;
          object-position: center !important;
          display: block !important;
          border-radius: 8px !important;
          margin: 0 !important;
          padding: 0 !important;
        }
        .menu-image-side-fixed {
          flex: 1 !important;
          position: relative !important;
          background: #f8f9fa !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          padding: 12px !important;
          width: 100% !important;
          overflow: visible !important;
        }
        /* Mobile specific overrides */
        @media (max-width: 768px) {
          .menu-image-carousel-fixed {
            flex-direction: column !important;
            align-items: center !important;
            justify-content: center !important;
            gap: 12px !important;
            padding: 12px !important;
            width: 100% !important;
            min-height: 100% !important;
          }
          .carousel-container-fixed {
            width: 180px !important;
            height: 140px !important;
            margin: 0 auto 12px auto !important;
            flex-shrink: 0 !important;
            overflow: hidden !important;
            display: block !important;
          }
          .menu-image-fixed {
            width: 180px !important;
            height: 140px !important;
            min-width: 180px !important;
            min-height: 140px !important;
            max-width: 180px !important;
            max-height: 140px !important;
            object-fit: cover !important;
            object-position: center !important;
            display: block !important;
            margin: 0 !important;
            padding: 0 !important;
          }
          .menu-image-side-fixed {
            width: 100% !important;
            height: auto !important;
            min-height: auto !important;
            max-height: none !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            overflow: visible !important;
          }
        }
        /* Very small screens - even smaller images */
        @media (max-width: 480px) {
          .carousel-container-fixed {
            width: 160px !important;
            height: 120px !important;
            margin: 0 auto 10px auto !important;
          }
          .menu-image-fixed {
            width: 160px !important;
            height: 120px !important;
            min-width: 160px !important;
            min-height: 120px !important;
            max-width: 160px !important;
            max-height: 120px !important;
          }
        }
        /* Extra small screens */
        @media (max-width: 360px) {
          .carousel-container-fixed {
            width: 140px !important;
            height: 100px !important;
            margin: 0 auto 8px auto !important;
          }
          .menu-image-fixed {
            width: 140px !important;
            height: 100px !important;
            min-width: 140px !important;
            min-height: 100px !important;
            max-width: 140px !important;
            max-height: 100px !important;
          }
        }
        /* Modern view styles */
        .view-toggle-button {
          position: absolute;
          top: 5px;
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
        .modern-menu-tabs {
          display: flex;
          overflow-x: auto;
          padding: 0;
          background: #f8f9fa;
          border-bottom: 1px solid #e9ecef;
          scrollbar-width: none;
        }
        .modern-menu-tabs::-webkit-scrollbar {
          display: none;
        }
        .menu-tab {
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
        .menu-tab.active {
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
        .modern-menu-items {
          padding: 15px;
          max-height: 60vh;
          overflow-y: auto;
        }
        .modern-section {
          margin-bottom: 30px;
        }
        .modern-section-title {
          font-size: 22px;
          font-weight: 600;
          margin-bottom: 15px;
          padding-bottom: 5px;
          border-bottom: 2px solid var(--primary);
        }
        .modern-item {
          display: flex;
          margin-bottom: 20px;
          padding-bottom: 20px;
          border-bottom: 1px solid #e9ecef;
        }
        .modern-item-image {
          width: 80px;
          height: 80px;
          border-radius: 8px;
          overflow: hidden;
          margin-right: 15px;
          flex-shrink: 0;
        }
        .modern-item-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .modern-item-content {
          flex: 1;
        }
       .modern-item-header {
  display: flex;
  justify-content: space-between; /* name left, price right */
  align-items: flex-start;        /* top align when name wraps */
  width: 100%;
}

.modern-item-title {
  flex: 1;                        /* take remaining space */
  font-size: 18px;
  font-weight: 500;
  margin: 0;
  line-height: 1.4;
  margin-right: 16px;             /* ← fixed spacing before price */

  /* allow wrapping (remove ellipsis) */
  white-space: normal;
  overflow: visible;
  text-overflow: unset;
}

.modern-item-price {
  flex-shrink: 0;                 /* never shrink */
  display: inline-flex;
  align-items: center;
  gap: 4px;
  white-space: nowrap;            /* keep "45 TND" in one line */
  font-weight: 600;
  color: var(--primary);
  font-size: 18px;
}

        .modern-item-description {
          color: #6c757d;
          font-size: 14px;
          margin: 0;
        }
        .modern-item-weight {
          font-size: 12px;
          color: #adb5bd;
          margin-top: 5px;
        }
        .modern-grid-items {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
          gap: 20px;
          margin-top: 20px;
        }
        .modern-grid-item {
          background: white;
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }
        .modern-grid-image {
          width: 100%;
          height: 150px;
        }
        .modern-grid-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .modern-grid-content {
          padding: 15px;
        }
        .modern-grid-title {
          font-size: 16px;
          font-weight: 500;
          margin: 0 0 5px 0;
        }
        .modern-grid-price {
          font-weight: 600;
          color: var(--primary);
        }
        .modern-grid-description {
          font-size: 14px;
          color: #6c757d;
          margin: 10px 0;
        }
        .modern-grid-weight {
          font-size: 12px;
          color: #adb5bd;
        }
        .add-to-cart-button {
          background: var(--primary);
          color: white;
          border: none;
          border-radius: 20px;
          padding: 8px 16px;
          font-size: 14px;
          cursor: pointer;
          margin-top: 10px;
          transition: all 0.2s ease;
        }
        .add-to-cart-button:hover {
          background: var(--primary-dark);
        }
        @media (max-width: 768px) {
          .modern-item {
            flex-direction: column;
          }
          .modern-item-image {
            width: 100%;
            height: 150px;
            margin-right: 0;
            margin-bottom: 10px;
          }
          .modern-grid-items {
            grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
          }
        }
          /* CSS for Terrasse Piscine page content */
.page-content-terrassepiscine {
  margin: 20px 0;
  text-align: center;
}

.page-content-terrassepiscine img.page-content-image {
  max-width: 100%;
  height: auto;
  border-radius: 8px;
  margin-bottom: 15px;
}

.page-content-terrassepiscine p.page-content-description {
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
        <button
          className="header-back-link"
          onClick={() => {
            if (showMenus) {
              setShowMenus(false)
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
        <div></div> {/* Empty div for spacing */}
      </header>
      <main className="app-main">
        {/* JSX for Terrasse Piscine page content */}
{pageContent && (
  <div className="page-content-terrassepiscine">
    {pageContent.image && (
      <img
        src={pageContent.image}
        alt="Terrasse Piscine"
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

        {!showMenus ? (
          <>
            <div className="welcome-banner">
              <h1>
                <span>{t("skyLounge")}</span>
              </h1>
              <p>{t("panoramicLounge")}</p>
            </div>
            <div className="content-container">
              {isLoading ? (
                <div className="loading-container">
                  <div className="loading-spinner"></div>
                  <p>{t("loadingLounges")}</p>
                </div>
              ) : lounges.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-icon">🔍</div>
                  <h3>{t("noSkyLoungeAvailable")}</h3>
                  <p>{t("comeBackSoonLounges")}</p>
                </div>
              ) : selectedLounge ? (
                <div className="spa-detail-view">
                  <button className="back-to-list" onClick={() => setSelectedLounge(null)}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d={
                          currentLanguage === "ar" ? "M5 12H19M19 12L12 5M19 12L12 19" : "M19 12H5M5 12L12 19M5 12L12 5"
                        }
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    {t("backToList")}
                  </button>
                  <div className="spa-detail-content">
                    <div className="spa-detail-image-container">
                      <img
                        src={selectedLounge.image || "/placeholder.svg"}
                        alt={selectedLounge.name}
                        className="spa-detail-image"
                        onError={(e) => {
                          e.target.src = `/placeholder.svg?height=300&width=500&text=${selectedLounge.name}`
                        }}
                      />
                    </div>
                    <div className="spa-detail-info">
                      <h2 className="spa-detail-name">{selectedLounge.name}</h2>
                      <div className="spa-detail-description">
                        <p>{selectedLounge.description || t("noDescriptionAvailable")}</p>
                      </div>
                      <button
                        className="reserve-button"
                        onClick={async () => {
                          await fetchMenus(selectedLounge._id)
                          setShowMenus(true)
                        }}
                      >
                        {t("viewMenu")}
                      </button>
                      <div className="spa-features">
                        <div className="spa-feature-item">
                          <span className="feature-icon">✓</span>
                          <span>{t("panoramicView")}</span>
                        </div>
                        <div className="spa-feature-item">
                          <span className="feature-icon">✓</span>
                          <span>{t("signatureCocktails")}</span>
                        </div>
                        <div className="spa-feature-item">
                          <span className="feature-icon">✓</span>
                          <span>{t("relaxingAmbiance")}</span>
                        </div>
                        <div className="spa-feature-item">
                          <span className="feature-icon">✓</span>
                          <span>{t("personalizedService")}</span>
                        </div>
                      </div>
                      <div className="spa-detail-cta">
{selectedLounge.reservable && (
  <button
    className="reserve-button"
    onClick={() => setShowModal(true)}
  >
    {t("reserveTable")}
  </button>
)}

                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className={`content-grid ${isLoaded ? "loaded" : ""}`}>
                  {lounges.map((lounge, index) => (
                    <div
                      key={lounge._id}
                      className="content-item"
                      style={{ animationDelay: `${index * 0.05}s` }}
                      onClick={() => setSelectedLounge(lounge)}
                    >
                      <div className="content-item-image">
                        <img
                          src={lounge.image || "/placeholder.svg"}
                          alt={lounge.name}
                          onError={(e) => {
                            e.target.src = `/placeholder.svg?height=120&width=300&text=${lounge.name}`
                          }}
                        />
                        <div className="content-item-overlay">
                          <span className="view-details">{t("viewDetails")}</span>
                        </div>
                      </div>
                      <div className="content-item-content">
                        <h3>{lounge.name}</h3>
                        <p>{lounge.description}</p>
                        <div className="content-item-arrow">
                          <svg
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
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
          </>
        ) : (
          <>
            {isLoading ? (
              <div className="loading-container">
                <div className="loading-spinner"></div>
                <p>{t("loadingMenus")}</p>
              </div>
            ) : menus.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">🍽️</div>
                <h3>{t("noMenuAvailable")}</h3>
                <p>{t("comeBackSoonMenus")}</p>
              </div>
            ) : (
              <div className="menu-display-container-new" style={{ position: "relative" }}>
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
                    {currentMenuIndex >= 0 && currentMenuIndex < menus.length && (
                      <div className="menu-spread-new" ref={bookRef}>
                        <div className="menu-content-new">
                          {/* Left side - Menu Images with Carousel */}
                          <div className={`menu-image-side-new ${isMobile ? "menu-image-side-fixed" : ""}`}>
                            {menus[currentMenuIndex].images && menus[currentMenuIndex].images.length > 0 ? (
                              <div
                                className={`menu-image-carousel-new menu-image-carousel-new-dark ${isMobile ? "menu-image-carousel-fixed" : ""}`}
                              >
                                {isMobile ? (
                                  // Small screens: Show all images vertically with fixed dimensions
                                  menus[currentMenuIndex].images.map((image, index) => (
                                    <div key={index} className="carousel-container-fixed">
                                      <img
                                        src={image || "/placeholder.svg"}
                                        alt={`${menus[currentMenuIndex].title} ${index + 1}`}
                                        className="menu-image-fixed"
                                        onError={(e) => (e.target.src = "/placeholder.svg")}
                                      />
                                    </div>
                                  ))
                                ) : (
                                  // Large screens: Show carousel with navigation
                                  <>
                                    <div className="carousel-container-new carousel-container-new-dark">
                                      <img
                                        src={menus[currentMenuIndex].images[currentImageIndex] || "/placeholder.svg"}
                                        alt={`${menus[currentMenuIndex].title} ${currentImageIndex + 1}`}
                                        className="menu-image-new menu-image-new-dark"
                                        onError={(e) => (e.target.src = "/placeholder.svg")}
                                      />
                                      {/* Navigation arrows - only on large screens */}
                                      {menus[currentMenuIndex].images.length > 1 && (
                                        <>
                                          <button
                                            className="image-nav-btn-new image-nav-btn-new-dark prev-image-new prev-image-new-dark"
                                            onClick={prevImage}
                                            disabled={currentImageIndex === 0}
                                            aria-label={t("previousImage")}
                                          >
                                            <ChevronLeft className="h-4 w-4" />
                                          </button>
                                          <button
                                            className="image-nav-btn-new image-nav-btn-new-dark next-image-new next-image-new-dark"
                                            onClick={nextImage}
                                            disabled={currentImageIndex === menus[currentMenuIndex].images.length - 1}
                                            aria-label={t("nextImage")}
                                          >
                                            <ChevronRight className="h-4 w-4" />
                                          </button>
                                        </>
                                      )}
                                      {/* Image counter - only on large screens */}
                                      {menus[currentMenuIndex].images.length > 1 && (
                                        <div className="image-counter-new image-counter-new-dark">
                                          {currentImageIndex + 1} / {menus[currentMenuIndex].images.length}
                                        </div>
                                      )}
                                    </div>
                                    {/* Image dots indicator - only on large screens */}
                                    {menus[currentMenuIndex].images.length > 1 && (
                                      <div className="image-dots-new image-dots-new-dark">
                                        {menus[currentMenuIndex].images.map((_, index) => (
                                          <button
                                            key={index}
                                            className={`image-dot-new image-dot-new-dark ${index === currentImageIndex ? "active" : ""}`}
                                            onClick={() => goToImage(index)}
                                            aria-label={`${t("goToImage")} ${index + 1}`}
                                          />
                                        ))}
                                      </div>
                                    )}
                                  </>
                                )}
                              </div>
                            ) : (
                              <div className="menu-image-placeholder-new">
                                <span>{menus[currentMenuIndex].title}</span>
                              </div>
                            )}
                          </div>
                          {/* Right side - Menu Items */}
                          <div className="menu-items-side-new">
                            <h2 className="menu-title-new">{menus[currentMenuIndex].title}</h2>
                            {menus[currentMenuIndex].items?.length > 0 ? (
                              <div className="menu-items-list-new">
                                {getCurrentMenuItems().map((item, idx) => (
                                  <div key={idx} className="menu-item-new">
                                    <div className="menu-item-header-new">
                                      <h3 className="menu-item-name-new">
                                        {item.name}
                                         {renderDietaryBadges(item)}
                                      </h3>
                                      <div className="menu-item-price-new">{item.price} TND</div>
                                    </div>
                                    <p className="menu-item-description-new">{item.description}</p>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <div className="empty-menu-new">
                                <p>
                                  {showVegetarianOnly
                                    ? currentLanguage === "fr"
                                      ? "Aucun plat végétarien disponible"
                                      : currentLanguage === "ar"
                                        ? "لا توجد أطباق نباتية متاحة"
                                        : "No vegetarian dishes available"
                                    : t("noDishAvailable")}
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                    <div className="menu-navigation-new">
                      <button
                        className="nav-button-new prev"
                        onClick={prevMenu}
                        disabled={currentMenuIndex === 0}
                        aria-label={t("previousMenu")}
                      >
                        <ChevronLeft className="h-6 w-6" />
                      </button>
                      <button
                        className="nav-button-new next"
                        onClick={nextMenu}
                        disabled={currentMenuIndex === menus.length - 1}
                        aria-label={t("nextMenu")}
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
                      {menus[currentMenuIndex].images && menus[currentMenuIndex].images.length > 0 ? (
                        <img
                          src={menus[currentMenuIndex].images[headerImageIndex] || "/placeholder.svg"}
                          alt={menus[currentMenuIndex].title}
                          onError={(e) => (e.target.src = "/placeholder.svg")}
                        />
                      ) : (
                        <img src="/placeholder.svg" alt={t("noMenuAvailable")} />
                      )}
                      <div className="modern-header-title">
                        <h2>{menus[currentMenuIndex].title}</h2>
                      </div>
                    </div>
                    {/* Menu Tabs - Showing all menus */}
                    <div className="modern-menu-tabs">
                      {menus.map((menu, index) => (
                        <button
                          key={index}
                          className={`menu-tab ${currentMenuIndex === index ? "active" : ""}`}
                          onClick={() => goToMenu(index)}
                        >
                          {menu.title}
                        </button>
                      ))}
                    </div>
                    <DietaryLegend />

                    {/* Menu Items */}
                    <div className="modern-menu-items">
                      {getCurrentMenuItems().length > 0 ? (
                        <>
                          {/* Group items by category if they have categories */}
                          {Object.entries(
                            getCurrentMenuItems().reduce((acc, item) => {
                              const category = item.category || t("others")
                              if (!acc[category]) acc[category] = []
                              acc[category].push(item)
                              return acc
                            }, {}),
                          ).map(([category, items]) => (
                            <div key={category} className="modern-section">
                              {/* <h3 className="modern-section-title">{category}</h3> */}
                                  {items.map((item, idx) => (
    <div key={idx} className="modern-item">
      {item.image && (
        <div className="modern-item-image">
          <img
            src={item.image || "/placeholder.svg"}
            alt={item.name}
            onError={(e) => (e.target.src = "/placeholder.svg")}
          />
        </div>
      )}
      <div className="modern-item-content">
        <div className="modern-item-header">
          <div className="modern-item-title">
            {item.name}
 {renderDietaryBadges(item)}          </div>
          <span className="modern-item-price">
            {item.price} <span className="currency">TND</span>
          </span>
        </div>
        <p className="modern-item-description">{item.description}</p>
        {item.weight && <div className="modern-item-weight">{item.weight} gr</div>}
      </div>
    </div>
  ))}
                            </div>
                          ))}
                        </>
                      ) : (
                        <div className="empty-menu-new">
                          <p>
                            {showVegetarianOnly
                              ? currentLanguage === "fr"
                                ? "Aucun plat végétarien disponible"
                                : currentLanguage === "ar"
                                  ? "لا توجد أطباق نباتية متاحة"
                                  : "No vegetarian dishes available"
                              : t("noDishAvailable")}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
          </>
        )}
        {showModal && (
          <div className="modal-backdrop">
            <div className="modal">
              <h2>{t("reserveTable")}</h2>
              <input
                type="text"
                placeholder={t("name")}
                value={reservationData.name}
                onChange={(e) => setReservationData({ ...reservationData, name: e.target.value })}
                required
              />
              <input
                type="email"
                placeholder={t("email")}
                value={reservationData.email}
                onChange={(e) => setReservationData({ ...reservationData, email: e.target.value })}
                required
              />
              <input
                type="tel"
                placeholder={t("phoneNumber")}
                value={reservationData.phoneNumber}
                onChange={(e) => setReservationData({ ...reservationData, phoneNumber: e.target.value })}
                required
              />
              <label>{t("from")}:</label>
              <input
                type="datetime-local"
                value={reservationData.from}
                onChange={(e) => setReservationData({ ...reservationData, from: e.target.value })}
                required
              />
              <label>{t("to")}:</label>
              <input
                type="datetime-local"
                value={reservationData.to}
                onChange={(e) => setReservationData({ ...reservationData, to: e.target.value })}
                required
              />
              <label>{t("numberOfPeople")}:</label>
              <input
                type="number"
                min="1"
                placeholder={t("numberOfPeople")}
                value={reservationData.people}
                onChange={(e) =>
                  setReservationData({ ...reservationData, people: Number.parseInt(e.target.value) || 1 })
                }
                required
              />
              <div className="modal-actions">
                <button onClick={handleReservationSubmit}>✅ {t("reserve")}</button>
                <button onClick={() => setShowModal(false)}>❌ {t("cancel")}</button>
              </div>
            </div>
          </div>
        )}
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
              <a href="https://tn.linkedin.com/company/novotel-tunis-lac" aria-label="LinkedIn" target="_blank" rel="noopener noreferrer">
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
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                  <rect x="2" y="9" width="4" height="12"></rect>
                  <circle cx="4" cy="4" r="2"></circle>
                </svg>
              </a>
              <a href="https://www.instagram.com/novotel_tunis_lac/" aria-label="Instagram" target="_blank" rel="noopener noreferrer">
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

export default TerrassePiscineClient
