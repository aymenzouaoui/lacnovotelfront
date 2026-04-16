"use client"

import { useEffect, useState, useRef } from "react"
import { useNavigate } from "react-router-dom"
import API from "../services/api"
import ThemeToggle from "../components/ThemeToggle"
import "./RestaurantsMenusNew.css"
import "./client-image-fix-dark.css"
import { motion } from "framer-motion"
import { ChevronLeft, ChevronRight, ChevronUp, ChevronDown, LayoutGrid, BookOpen, UtensilsCrossed, CalendarCheck } from "lucide-react"



// Translation system
const translations = {
  fr: {
    // Header
    back: "Retour",
dietaryInformation: "Informations alimentaires :",
vegetarian: "Végétarien",
organic: "Bio",
local: "Local",
glutenFree: "Sans gluten",
lactoseFree: "Sans lactose",
    // Language Selector
    switchToModern: "Passer à la vue moderne",
    switchToBook: "Passer à la vue livre",

    // Welcome Banner
    restaurantsAndMenus: "Restaurants & Menus",
    discoverRestaurants: "Découvrez nos restaurants et leurs spécialités culinaires",

    // Loading & Empty States
    loadingRestaurants: "Chargement des restaurants...",
    loadingMenus: "Chargement des menus...",
    noMenuAvailable: "Aucun menu disponible",
    noDishAvailable: "Aucun plat disponible dans ce menu",
    noRestaurantsFound: "Aucun restaurant trouvé",
    comeBackSoonRestaurants: "Revenez bientôt pour découvrir nos restaurants",
    comeBackSoonMenus: "Revenez bientôt pour découvrir nos menus",

    // Restaurant Card Buttons
    viewMenu: "Voir le menu",
    reserveTable: "Réserver une table",

    // Menu Navigation
    previousMenu: "Menu précédent",
    nextMenu: "Menu suivant",
    previousImage: "Image précédente",
    nextImage: "Image suivante",
    goToImage: "Aller à l'image", // For image dots aria-label

    // 14 allergènes réglementaires (UE)
    allergenLegendTitle: "Allergènes réglementaires",
    allergenLegendSubtitle: "14 allergènes à déclaration obligatoire (UE)",
    showAllergenList: "Afficher la liste des allergènes",
    hideAllergenList: "Masquer la liste des allergènes",
    allergieLabel: "ALLERGIE",
    arachide: "ARACHIDE",
    celeri: "CÉLERI",
    crustaces: "CRUSTACÉS",
    gluten: "GLUTEN (CÉRÉALES CONTENANT DU)",
    fruitsACoque: "FRUITS À COQUE",
    lait: "LAIT",
    lupin: "LUPIN",
    oeuf: "OEUF",
    poisson: "POISSON",
    mollusques: "MOLLUSQUES",
    moutarde: "MOUTARDE",
    sesame: "SÉSAME",
    soja: "SOJA",
    sulfites: "SULFITES",

    // Modal
    reserveTableModal: "Réserver une table",
    name: "Nom",
    email: "Email",
    phoneNumber: "Numéro de téléphone",
    numberOfPeople: "Nombre de personnes",
    reserve: "Réserver",
    cancel: "Annuler",
    reservationSuccess: "Réservation créée avec succès !",
    reservationError: "Erreur lors de la création de la réservation.",

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

    // Vegetarian Filter
    showingVegetarian: "Végétarien uniquement",
    showAll: "Tous les plats",
    noVegetarianDishes: "Aucun plat végétarien disponible",
    allergenContains: "Contient :",
    noAllergensDeclared: "Aucun allergène déclaré",
  },
  en: {
    // Header
    back: "Back",

    // Language Selector
    switchToModern: "Switch to modern view",
    switchToBook: "Switch to book view",
dietaryInformation: "Dietary Information:",
vegetarian: "Vegetarian",
organic: "Organic",
local: "Local",
glutenFree: "Gluten-Free",
lactoseFree: "Lactose-Free",
    // Welcome Banner
    restaurantsAndMenus: "Restaurants & Menus",
    discoverRestaurants: "Discover our restaurants and their culinary specialties",

    // Loading & Empty States
    loadingRestaurants: "Loading restaurants...",
    loadingMenus: "Loading menus...",
    noMenuAvailable: "No menu available",
    noDishAvailable: "No dish available in this menu",
    noRestaurantsFound: "No restaurants found",
    comeBackSoonRestaurants: "Come back soon to discover our restaurants",
    comeBackSoonMenus: "Come back soon to discover our menus",

    // Restaurant Card Buttons
    viewMenu: "View Menu",
    reserveTable: "Reserve a Table",

    // Menu Navigation
    previousMenu: "Previous Menu",
    nextMenu: "Next Menu",
    previousImage: "Previous image",
    nextImage: "Next image",
    goToImage: "Go to image",

    // 14 regulatory allergens (EU)
    allergenLegendTitle: "Regulatory allergens",
    allergenLegendSubtitle: "14 allergens requiring declaration (EU)",
    showAllergenList: "Show allergen list",
    hideAllergenList: "Hide allergen list",
    allergieLabel: "ALLERGY",
    arachide: "PEANUTS",
    celeri: "CELERY",
    crustaces: "CRUSTACEANS",
    gluten: "GLUTEN (CEREALS CONTAINING)",
    fruitsACoque: "TREE NUTS",
    lait: "MILK",
    lupin: "LUPIN",
    oeuf: "EGG",
    poisson: "FISH",
    mollusques: "MOLLUSCS",
    moutarde: "MUSTARD",
    sesame: "SESAME",
    soja: "SOYA",
    sulfites: "SULPHITES",

    // Modal
    reserveTableModal: "Reserve a Table",
    name: "Name",
    email: "Email",
    phoneNumber: "Phone Number",
    numberOfPeople: "Number of People",
    reserve: "Reserve",
    cancel: "Cancel",
    reservationSuccess: "Reservation created successfully!",
    reservationError: "Error creating reservation.",

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

    // Vegetarian Filter
    showingVegetarian: "Vegetarian only",
    showAll: "All dishes",
    noVegetarianDishes: "No vegetarian dishes available",
    allergenContains: "Contains:",
    noAllergensDeclared: "No allergens declared",
  },
  ar: {
    // Header
    back: "رجوع",

    // Language Selector
    switchToModern: "التبديل إلى العرض الحديث",
    switchToBook: "التبديل إلى عرض الكتاب",

    // Welcome Banner
    restaurantsAndMenus: "المطاعم والقوائم",
    discoverRestaurants: "اكتشف مطاعمنا وتخصصاتنا الطهوية",

    // Loading & Empty States
    loadingRestaurants: "جاري تحميل المطاعم...",
    loadingMenus: "جاري تحميل القوائم...",
    noMenuAvailable: "لا توجد قائمة متاحة",
    noDishAvailable: "لا يوجد طبق متاح في هذه القائمة",
    noRestaurantsFound: "لم يتم العثور على مطاعم",
    comeBackSoonRestaurants: "عد قريبًا لاكتشاف مطاعمنا",
    comeBackSoonMenus: "عد قريبًا لاكتشاف قوائمنا",
dietaryInformation: "معلومات غذائية:",
vegetarian: "نباتي",
organic: "عضوي",
local: "محلي",
glutenFree: "خالٍ من الغلوتين",
lactoseFree: "خالٍ من اللاكتوز",
    // Restaurant Card Buttons
    viewMenu: "عرض القائمة",
    reserveTable: "حجز طاولة",

    // Menu Navigation
    previousMenu: "القائمة السابقة",
    nextMenu: "القائمة التالية",
    previousImage: "الصورة السابقة",
    nextImage: "الصورة التالية",
    goToImage: "الانتقال إلى الصورة",

    // 14 مسببات الحساسية التنظيمية (الاتحاد الأوروبي)
    allergenLegendTitle: "مسببات الحساسية التنظيمية",
    allergenLegendSubtitle: "14 مسببات حساسية إلزامية الإعلان (الاتحاد الأوروبي)",
    showAllergenList: "إظهار قائمة مسببات الحساسية",
    hideAllergenList: "إخفاء قائمة مسببات الحساسية",
    allergieLabel: "حساسية",
    arachide: "فول سوداني",
    celeri: "كرفس",
    crustaces: "قشريات",
    gluten: "غلوتين (حبوب تحتوي على)",
    fruitsACoque: "فواكه ذات قشرة",
    lait: "حليب",
    lupin: "ترمس",
    oeuf: "بيض",
    poisson: "سمك",
    mollusques: "رخويات",
    moutarde: "خردل",
    sesame: "سمسم",
    soja: "صويا",
    sulfites: "كبريتات",

    // Modal
    reserveTableModal: "حجز طاولة",
    name: "الاسم",
    email: "البريد الإلكتروني",
    phoneNumber: "رقم الهاتف",
    numberOfPeople: "عدد الأشخاص",
    reserve: "حجز",
    cancel: "إلغاء",
    reservationSuccess: "تم إنشاء الحجز بنجاح!",
    reservationError: "حدث خطأ أثناء إنشاء الحجز.",

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

    // Vegetarian Filter
    showingVegetarian: "نباتي فقط",
    showAll: "جميع الأطباق",
    noVegetarianDishes: "لا يوجد أطباق نباتية متاحة",
    allergenContains: "يحتوي على :",
    noAllergensDeclared: "لا مواد مثيرة للحساسية معلنة",
  },
}

const languages = [
  { code: "fr", name: "Français", flag: "/images/fr-flag-v2.png" },
  { code: "en", name: "English", flag: "/images/en-flag-v2.png" },
  { code: "ar", name: "العربية", flag: "/images/ar-flag-v2.png" },
]




const RestaurantsMenusClient = () => {
  const navigate = useNavigate()
  const [restaurants, setRestaurants] = useState([])
  const [selectedRestaurant, setSelectedRestaurant] = useState(null)
  const [menus, setMenus] = useState([])
  const [currentMenuIndex, setCurrentMenuIndex] = useState(0)
  const [currentImageIndex, setCurrentImageIndex] = useState(0) // For image carousel
  const [isLoaded, setIsLoaded] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const bookRef = useRef(null)
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
  const [viewMode, setViewMode] = useState("modern") // "book" or "modern"
  const [headerImageIndex, setHeaderImageIndex] = useState(0)
  const [currentLanguage, setCurrentLanguage] = useState("fr")
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false)
  const [showVegetarianOnly, setShowVegetarianOnly] = useState(false)
  const [showAllergenLegend, setShowAllergenLegend] = useState(true)

  // Get translation function
  const t = (key) => translations[currentLanguage][key] || translations.fr[key] || key

    const DietaryLegend = () => (
  <div className="dietary-legend">
    <h4>{t("dietaryInformation")}</h4>
    <div className="legend-items">
      <span className="legend-item">{t("vegetarian")}</span>
      <span className="legend-item">{t("organic")}</span>
      <span className="legend-item">{t("local")}</span>
      <span className="legend-item">{t("glutenFree")}</span>
      <span className="legend-item">{t("lactoseFree")}</span>
    </div>
  </div>
)

  const fetchRestaurants = async () => {
    try {
      setIsLoading(true)
      const res = await API.get("/restaurants")
      setRestaurants(res.data)
      setIsLoaded(true)
    } catch (error) {
      console.error("Error fetching restaurants:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const fetchMenus = async (restaurantId) => {
    try {
      setIsLoading(true)
      const res = await API.get("/menus")
      const filteredMenus = res.data.filter(
        (menu) => menu.restaurant?._id === restaurantId || menu.restaurant === restaurantId,
      )
      setMenus(filteredMenus)
      setCurrentMenuIndex(0)
      setCurrentImageIndex(0) // Reset image index when switching menus
    } catch (error) {
      console.error("Error fetching menus:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleReservationSubmit = async () => {
    try {
      const payload = {
        ...reservationData,
        service: "restaurant",
        serviceDetails: selectedRestaurant?.name || "",
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

  const [pageContent, setPageContent] = useState(null);

useEffect(() => {
  const fetchPageContent = async () => {
    try {
      const res = await API.get("/page-contents/page/Restaurants"); // 👈 note: pageName = restaurant
      setPageContent(res.data);
    } catch (err) {
      console.error("Error fetching restaurant page content:", err);
      setPageContent(null); // safe fallback
    }
  };
  fetchPageContent();
}, []);


  useEffect(() => {
    fetchRestaurants()
    window.scrollTo(0, 0) // Scroll to the top of the page on mount
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

  useEffect(() => {
    if (!selectedRestaurant) return
    fetchMenus(selectedRestaurant._id)

  }, [selectedRestaurant])

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
    if (viewMode !== "modern" || !selectedRestaurant || menus.length === 0) return
    const currentMenu = menus[currentMenuIndex]
    if (!currentMenu?.images || currentMenu.images.length <= 1) return
    const interval = setInterval(() => {
      setHeaderImageIndex((prev) => (prev + 1) % currentMenu.images.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [viewMode, selectedRestaurant, menus, currentMenuIndex])

  const nextMenu = () => {
    if (currentMenuIndex < menus.length - 1) {
      const menuContainer = document.querySelector(".menu-spread-new")
      if (menuContainer) {
        menuContainer.classList.add("slide-out-left-new")
        setTimeout(() => {
          setCurrentMenuIndex(currentMenuIndex + 1)
          setCurrentImageIndex(0) // Reset image index when changing menu
          menuContainer.classList.remove("slide-out-left-new")
          menuContainer.classList.add("slide-in-right-new")
          setTimeout(() => {
            menuContainer.classList.remove("slide-in-right-new")
          }, 300)
        }, 300)
      } else {
        setCurrentMenuIndex(currentMenuIndex + 1)
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
          setCurrentMenuIndex(currentMenuIndex - 1)
          setCurrentImageIndex(0) // Reset image index when changing menu
          menuContainer.classList.remove("slide-out-right-new")
          menuContainer.classList.add("slide-in-left-new")
          setTimeout(() => {
            menuContainer.classList.remove("slide-in-left-new")
          }, 300)
        }, 300)
      } else {
        setCurrentMenuIndex(currentMenuIndex - 1)
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

    if (showVegetarianOnly) {
      return items.filter((item) => item.isVegetarian === true)
    }

    return items
  }

  // Ordre canonique des catégories (carte restaurant)
  const CATEGORY_ORDER = [
    "Entrées",
    "Suites / Pâtes",
    "Suites",
    "Pâtes",
    "Plats traditionnels",
    "Plats",
    "Desserts",
    "Autres",
    "Others",
    "أخرى",
  ]

  const getSortedCategoryEntries = (items) => {
    const grouped = items.reduce((acc, item) => {
      const category = item.category || "Autres"
      if (!acc[category]) acc[category] = []
      acc[category].push(item)
      return acc
    }, {})
    const orderLower = CATEGORY_ORDER.map((c) => c.toLowerCase().trim())
    return Object.entries(grouped).sort(([a], [b]) => {
      const aNorm = a.trim().toLowerCase()
      const bNorm = b.trim().toLowerCase()
      const ia = orderLower.indexOf(aNorm)
      const ib = orderLower.indexOf(bNorm)
      if (ia === -1 && ib === -1) return a.localeCompare(b)
      if (ia === -1) return 1
      if (ib === -1) return -1
      return ia - ib
    })
  }

  // Toggle between view modes
  const toggleViewMode = () => {
    setViewMode(viewMode === "book" ? "modern" : "book")
    setHeaderImageIndex(0)
  }

  // Restaurant card variants for animation
  const restaurantVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.5,
      },
    }),
  }

  // Ordre des 14 allergènes réglementaires (UE) — pictogrammes sans cercle d'interdiction
  const ALLERGENS_ORDER = [
    "arachide", "celeri", "crustaces", "gluten", "fruitsACoque", "lait", "lupin",
    "oeuf", "poisson", "mollusques", "moutarde", "sesame", "soja", "sulfites"
  ]
  const strokeAllergen = "#333333"
  const allergenIcons = {
    arachide: (
      <svg width="28" height="28" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
        <path d="M18 32c0-4 4-12 14-12s14 8 14 12c0 6-4 14-14 18-10-4-14-12-14-18z" fill="none" stroke={strokeAllergen} strokeWidth="2.5" />
        <path d="M32 20c-2 0-6 4-6 12s4 12 6 12 6-4 6-12-4-12-6-12z" fill="none" stroke={strokeAllergen} strokeWidth="2" />
      </svg>
    ),
    celeri: (
      <svg width="28" height="28" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
        <path d="M32 8v48M28 14h8M26 24h12M24 34h16M26 44h12" stroke={strokeAllergen} strokeWidth="2.5" fill="none" />
        <path d="M20 20l4-4 4 4M44 20l-4-4-4 4" stroke={strokeAllergen} strokeWidth="1.5" fill="none" />
      </svg>
    ),
    crustaces: (
      <svg width="28" height="28" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 36c4-6 12-10 20-8 8 2 16 8 20 14M14 32c2-4 10-8 18-6M50 38c-2-4-10-8-18-6" stroke={strokeAllergen} strokeWidth="2" fill="none" />
        <path d="M20 28v16M28 24v20M36 26v18M44 30v12" stroke={strokeAllergen} strokeWidth="2" fill="none" />
        <ellipse cx="32" cy="42" rx="18" ry="8" fill="none" stroke={strokeAllergen} strokeWidth="2" />
      </svg>
    ),
    gluten: (
      <svg width="28" height="28" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
        <path d="M32 8v48M32 8c-8 0-14 6-14 14v4c0 8 6 14 14 14M32 8c8 0 14 6 14 14v4c0 8-6 14-14 14" stroke={strokeAllergen} strokeWidth="2" fill="none" />
        <path d="M24 20h16M22 28h20M24 36h16M22 44h20" stroke={strokeAllergen} strokeWidth="1.5" fill="none" />
      </svg>
    ),
    fruitsACoque: (
      <svg width="28" height="28" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
        <path d="M32 12c-10 0-18 10-18 20s8 20 18 20 18-10 18-20-8-20-18-20z" fill="none" stroke={strokeAllergen} strokeWidth="2" />
        <path d="M28 24c0-4 2-8 4-8s4 4 4 8-2 8-4 8-4-4-4-8z" fill="none" stroke={strokeAllergen} strokeWidth="1.5" />
      </svg>
    ),
    lait: (
      <svg width="28" height="28" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
        <path d="M26 12h12v8l8 12v28H18V32l8-12v-8z" fill="none" stroke={strokeAllergen} strokeWidth="2" />
        <path d="M26 20h12M24 36h16" stroke={strokeAllergen} strokeWidth="1.5" fill="none" />
      </svg>
    ),
    lupin: (
      <svg width="28" height="28" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
        <ellipse cx="32" cy="36" rx="12" ry="14" fill="none" stroke={strokeAllergen} strokeWidth="2" />
        <path d="M32 22v14M26 28h12M28 34h8" stroke={strokeAllergen} strokeWidth="1.5" fill="none" />
      </svg>
    ),
    oeuf: (
      <svg width="28" height="28" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
        <path d="M32 10c-10 0-18 14-18 26 0 12 8 20 18 20s18-8 18-20c0-12-8-26-18-26z" fill="none" stroke={strokeAllergen} strokeWidth="2" />
      </svg>
    ),
    poisson: (
      <svg width="28" height="28" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 32c0 0 12-16 20-16s20 16 20 16-12 16-20 16-20-16-20-16z" fill="none" stroke={strokeAllergen} strokeWidth="2" />
        <path d="M52 28v8M48 24v16M44 22v20" stroke={strokeAllergen} strokeWidth="1.5" fill="none" />
        <circle cx="28" cy="32" r="2" fill={strokeAllergen} />
      </svg>
    ),
    mollusques: (
      <svg width="28" height="28" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
        <path d="M14 32c0-10 8-18 18-18s18 8 18 18c0 10-8 18-18 18-4 0-8-2-10-4" fill="none" stroke={strokeAllergen} strokeWidth="2" />
        <path d="M32 14v36M22 24c4 4 8 4 10 4s6 0 10-4" stroke={strokeAllergen} strokeWidth="1.5" fill="none" />
      </svg>
    ),
    moutarde: (
      <svg width="28" height="28" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
        <circle cx="32" cy="36" r="10" fill="none" stroke={strokeAllergen} strokeWidth="2" />
        <path d="M32 16v20M28 26h8M32 46v6" stroke={strokeAllergen} strokeWidth="2" fill="none" />
      </svg>
    ),
    sesame: (
      <svg width="28" height="28" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
        <ellipse cx="20" cy="28" rx="6" ry="8" fill="none" stroke={strokeAllergen} strokeWidth="1.5" />
        <ellipse cx="32" cy="32" rx="6" ry="8" fill="none" stroke={strokeAllergen} strokeWidth="1.5" />
        <ellipse cx="44" cy="28" rx="6" ry="8" fill="none" stroke={strokeAllergen} strokeWidth="1.5" />
        <ellipse cx="26" cy="42" rx="5" ry="7" fill="none" stroke={strokeAllergen} strokeWidth="1.5" />
        <ellipse cx="38" cy="42" rx="5" ry="7" fill="none" stroke={strokeAllergen} strokeWidth="1.5" />
      </svg>
    ),
    soja: (
      <svg width="28" height="28" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
        <ellipse cx="32" cy="38" rx="10" ry="12" fill="none" stroke={strokeAllergen} strokeWidth="2" />
        <path d="M28 26c2-2 4-2 8 0M32 20v6M26 32h12M28 40h8" stroke={strokeAllergen} strokeWidth="1.5" fill="none" />
      </svg>
    ),
    sulfites: (
      <svg width="28" height="28" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
        <path d="M32 12c-6 0-12 6-12 14 0 8 6 14 12 14s12-6 12-14c0-8-6-14-12-14z" fill="none" stroke={strokeAllergen} strokeWidth="2" />
        <path d="M24 26c4 2 8 2 16 0M26 32c3 2 6 2 12 0" stroke={strokeAllergen} strokeWidth="1" fill="none" />
        <path d="M28 44h8v8h-8z" fill="none" stroke={strokeAllergen} strokeWidth="2" />
      </svg>
    ),
  }

  const AllergenLegend = () => (
    <div className="allergen-legend-regulatory">
      <header className="allergen-legend-header">
        <h4 className="allergen-legend-title">{t("allergenLegendTitle")}</h4>
        <p className="allergen-legend-subtitle">{t("allergenLegendSubtitle")}</p>
      </header>
      <div className="modern-allergens" role="list">
        {ALLERGENS_ORDER.map((key) => (
          <div key={key} className="modern-allergen" role="listitem">
            <span className="allergen-icon-wrap" aria-hidden="true">
              {allergenIcons[key]}
            </span>
            <span className="allergen-label">
              <span className="allergen-name">{t(key)}</span>
              <span className="allergen-badge">{t("allergieLabel")}</span>
            </span>
          </div>
        ))}
      </div>
    </div>
  )

  // Mapping backend fields → legend keys (invert = field means "free of", so absence = contains)
  const ITEM_ALLERGENS_MAP = [
    { field: "arachideAllergy",    key: "arachide"    },
    { field: "celeriAllergy",      key: "celeri"      },
    { field: "crustacesAllergy",   key: "crustaces"   },
    { field: "fruitsANoqueAllergy",key: "fruitsACoque" },
    { field: "isGlutenFree",       key: "gluten",      invert: true },
    { field: "isLactoseFree",      key: "lait",        invert: true },
    { field: "lupinAllergy",       key: "lupin"       },
    { field: "oeufAllergy",        key: "oeuf"        },
    { field: "poissonAllergy",     key: "poisson"     },
    { field: "mollusquesAllergy",  key: "mollusques"  },
    { field: "moutardeAllergy",    key: "moutarde"    },
    { field: "sesameAllergy",      key: "sesame"      },
    { field: "sojaAllergy",        key: "soja"        },
    { field: "sulfitesAllergy",    key: "sulfites"    },
  ]

  // Unified dietary + allergen info section per item
  const renderItemInfo = (item) => {
    const dietary = [
      item.isVegetarian  && { key: "veg",     label: t("vegetarian"),  emoji: "🥦" },
      item.isOrganic     && { key: "bio",     label: t("organic"),     emoji: "🌿" },
      item.isLocal       && { key: "local",   label: t("local"),       emoji: "📍" },
      item.isGlutenFree  && { key: "gluten",  label: t("glutenFree"),  emoji: "🌾" },
      item.isLactoseFree && { key: "lactose", label: t("lactoseFree"), emoji: "🥛" },
    ].filter(Boolean)

    // Only count allergens when the field is explicitly set (not undefined)
    const hasAllergenData = ITEM_ALLERGENS_MAP.some(
      ({ field }) => item[field] !== undefined && item[field] !== null
    )
    const allergens = ITEM_ALLERGENS_MAP.filter(({ field, invert }) =>
      invert ? item[field] === false : item[field] === true
    )
    const allergenFree = hasAllergenData && allergens.length === 0

    if (dietary.length === 0 && allergens.length === 0 && !allergenFree) return null

    return (
      <div className="item-info-section">
        {dietary.length > 0 && (
          <div className="item-dietary-row" role="list" aria-label={t("dietaryInformation")}>
            {dietary.map(({ key, label, emoji }) => (
              <span key={key} className="item-dietary-chip" role="listitem">
                <span className="item-dietary-emoji" aria-hidden="true">{emoji}</span>
                <span>{label}</span>
              </span>
            ))}
          </div>
        )}
        {allergens.length > 0 && (
          <div className="item-allergens-row" role="list" aria-label={t("allergenLegendTitle")}>
            <span className="item-allergens-warn">⚠ {t("allergenContains")}</span>
            {allergens.map(({ key }) => (
              <span key={key} className="item-allergen-chip" role="listitem" title={t(key)}>
                <span className="item-allergen-icon" aria-hidden="true">{allergenIcons[key]}</span>
                <span>{t(key)}</span>
              </span>
            ))}
          </div>
        )}
        {allergenFree && (
          <div className="item-allergen-free" role="status">
            <span className="item-allergen-free-icon" aria-hidden="true">✓</span>
            <span>{t("noAllergensDeclared")}</span>
          </div>
        )}
      </div>
    )
  }

  const getCurrentLanguage = () => languages.find((lang) => lang.code === currentLanguage)

  return (
    <div className={`hotel-app-new ${currentLanguage === "ar" ? "rtl" : "ltr"}`}>
      <style jsx>
        {`
        /* Language dropdown styles */
        .language-selector {
          position: relative;
          z-index: 20;
        }

        .language-toggle {
          display: flex;
          align-items: center;
          gap: 8px;
          background: rgba(0, 71, 171, 0.08);
          color: var(--primary, #0047ab);
          border: 1px solid rgba(0, 71, 171, 0.2);
          border-radius: 20px;
          padding: 7px 14px;
          cursor: pointer;
          font-size: 13px;
          font-weight: 600;
          transition: all 0.2s ease;
          white-space: nowrap;
        }

        .language-toggle:hover {
          background: rgba(0, 71, 171, 0.15);
          border-color: rgba(0, 71, 171, 0.4);
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
          right: auto;
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

        .rtl .header-back-link-new {
          flex-direction: row-reverse;
        }

        .rtl .header-back-link-new svg {
          margin-left: 8px;
          margin-right: 0;
        }

        .rtl .welcome-banner-new h1 {
          text-align: right;
        }

        .rtl .welcome-banner-new p {
          text-align: right;
        }

        .rtl .loading-container-new p,
        .rtl .empty-state-new h3,
        .rtl .empty-state-new p {
          text-align: right;
        }

        .rtl .restaurant-card-content-new {
          text-align: right;
        }

        .rtl .restaurant-card-buttons-new {
          flex-direction: row-reverse;
        }

        .rtl .view-menu-button-new {
          margin-left: 10px;
          margin-right: 0;
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
          margin: 0;
        }
        .rtl .allergen-legend-header {
          text-align: right;
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
        .rtl .modal-actions-new {
          text-align: right;
        }

        .rtl .modal-actions-new button {
          margin-left: 10px;
          margin-right: 0;
        }

        .rtl .footer-section {
          text-align: right;
        }

        .rtl .copyright {
          text-align: center;
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
          top: 10px;
          left: 3px;
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
        .allergen-legend-wrapper {
          margin-bottom: 16px;
        }
        .allergen-legend-toggle {
          display: flex;
          align-items: center;
          justify-content: space-between;
          width: 100%;
          padding: 12px 16px;
          background: linear-gradient(180deg, #f8fafc 0%, #f1f5f9 100%);
          border: 1px solid #e2e8f0;
          border-radius: 10px;
          font-size: 0.9rem;
          font-weight: 600;
          color: #334155;
          cursor: pointer;
          transition: background 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease;
        }
        .allergen-legend-toggle:hover {
          background: #f1f5f9;
          border-color: rgba(0, 71, 171, 0.25);
          box-shadow: 0 2px 8px rgba(0, 71, 171, 0.06);
        }
        .allergen-legend-toggle-icon {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          margin-left: 8px;
          width: 28px;
          height: 28px;
          border-radius: 6px;
          background: rgba(0, 71, 171, 0.1);
          color: var(--primary, #0047ab);
          flex-shrink: 0;
          transition: background 0.2s ease, color 0.2s ease;
        }
        .allergen-legend-toggle:hover .allergen-legend-toggle-icon {
          background: rgba(0, 71, 171, 0.18);
          color: var(--pro-primary-hover, #003580);
        }
        .rtl .allergen-legend-toggle-icon {
          margin-left: 0;
          margin-right: 8px;
        }
        #allergen-legend-content {
          margin-top: 8px;
        }
        .allergen-legend-regulatory {
          background: linear-gradient(180deg, #f8fafc 0%, #f1f5f9 100%);
          border-radius: 12px;
          padding: 20px 18px;
          margin-bottom: 0;
          border: 1px solid #e2e8f0;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
        }
        .allergen-legend-header {
          margin-bottom: 16px;
          padding-bottom: 12px;
          border-bottom: 2px solid var(--primary, #0047ab);
        }
        .allergen-legend-title {
          margin: 0 0 4px 0;
          font-size: 1.1rem;
          font-weight: 700;
          color: #1e293b;
          letter-spacing: -0.02em;
        }
        .allergen-legend-subtitle {
          margin: 0;
          font-size: 0.8rem;
          color: #64748b;
          font-weight: 500;
        }
        .modern-allergens {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
          gap: 12px;
          list-style: none;
          padding: 0;
          margin: 0;
        }
        .modern-allergen {
          display: flex;
          align-items: center;
          gap: 12px;
          font-size: 13px;
          color: #334155;
          background: white;
          padding: 12px 14px;
          border-radius: 10px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
          border: 1px solid #e2e8f0;
          transition: box-shadow 0.2s ease, border-color 0.2s ease;
        }
        .modern-allergen:hover {
          box-shadow: 0 4px 12px rgba(0, 71, 171, 0.08);
          border-color: rgba(0, 71, 171, 0.2);
        }
        .allergen-icon-wrap {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 44px;
          height: 44px;
          min-width: 44px;
          min-height: 44px;
          background: #f1f5f9;
          border-radius: 10px;
          flex-shrink: 0;
        }
        .modern-allergen svg {
          display: block;
        }
        .allergen-legend-regulatory .allergen-label {
          display: flex;
          flex-direction: column;
          gap: 2px;
          line-height: 1.35;
          min-width: 0;
        }
        .allergen-legend-regulatory .allergen-name {
          font-weight: 600;
          font-size: 12px;
          color: #1e293b;
          word-break: break-word;
        }
        .allergen-legend-regulatory .allergen-badge {
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.04em;
          color: var(--primary, #0047ab);
          opacity: 0.95;
        }
        @media (max-width: 480px) {
          .modern-allergens {
            grid-template-columns: 1fr;
          }
          .allergen-legend-regulatory {
            padding: 16px 14px;
          }
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
          margin-top: 5px;
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

/* Removed conflicting vegetarian filter styles */
        .vegetarian-filter-header {
          display: flex;
          justify-content: center;
          padding: 15px 20px;
          background: rgba(0, 0, 0, 0.05);
          border-bottom: 1px solid rgba(0, 0, 0, 0.1);
          margin-bottom: 20px;
        }

        .vegetarian-toggle {
          display: flex;
          align-items: center;
          gap: 10px;
          background: var(--primary);
          color: white;
          padding: 10px 20px;
          border-radius: 25px;
          cursor: pointer;
          transition: all 0.3s ease;
          border: none;
          font-size: 14px;
          font-weight: 500;
        }

        .vegetarian-toggle:hover {
          background: var(--primary-dark);
          transform: translateY(-1px);
        }

        .vegetarian-toggle input[type="checkbox"] {
          position: relative;
          width: 40px;
          height: 20px;
          appearance: none;
          background: rgba(255, 255, 255, 0.3);
          border-radius: 20px;
          outline: none;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .vegetarian-toggle input[type="checkbox"]:checked {
          background: rgba(255, 255, 255, 0.8);
        }

        .vegetarian-toggle input[type="checkbox"]:before {
          content: '';
          position: absolute;
          top: 2px;
          left: 2px;
          width: 16px;
          height: 16px;
          background: white;
          border-radius: 50%;
          transition: all 0.3s ease;
        }

        .vegetarian-toggle input[type="checkbox"]:checked:before {
          transform: translateX(20px);
          background: var(--primary);
        }

        .vegetarian-toggle-label {
          color: white;
          font-size: 14px;
          font-weight: 500;
          white-space: nowrap;
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

        .legend-items {
          display: flex;
          flex-wrap: wrap;
          gap: 15px;
        }

        .legend-item {
          font-size: 14px;
          color: #666;
          display: flex;
          align-items: center;
          gap: 5px;
        }

        /* Updated dietary badge styles to be more generic */
        .dietary-badge {
          margin-left: 6px;
          font-size: 16px;
        }

        .vegetarian-badge {
          margin-left: 6px;
          font-size: 16px;
        }

        /* Mobile responsive for legend */
        @media (max-width: 768px) {
          .dietary-legend {
            padding: 12px;
          }
          
          .legend-items {
            gap: 10px;
          }
          
          .legend-item {
            font-size: 13px;
          }
          
          .dietary-badge {
            font-size: 14px;
            margin-left: 4px;
          }
        }

        /* Mobile responsive */
        @media (max-width: 768px) {
          .vegetarian-filter-header {
            padding: 10px 15px;
          }
          
          .vegetarian-toggle {
            padding: 8px 15px;
            font-size: 13px;
          }
        }
          .page-content-restaurant {
  margin: 20px 0;
  text-align: center;
}

.page-content-restaurant img.page-content-image {
  max-width: 100%;
  height: auto;
  border-radius: 8px;
  margin-bottom: 15px;
}

.page-content-restaurant p.page-content-description {
  font-size: 16px;
  color: #444;
  line-height: 1.6;
}

      `}
      </style>
      <header className="app-header-new">
        <button
          className="header-back-link-new"
          onClick={() => {
            if (selectedRestaurant) {
              setSelectedRestaurant(null)
              setMenus([])
              setCurrentMenuIndex(0)
              setCurrentImageIndex(0)
            } else {
              navigate("/home")
            }
          }}
        >
          {currentLanguage === "ar" ? (
            <ChevronRight size={20} strokeWidth={2} aria-hidden />
          ) : (
            <ChevronLeft size={20} strokeWidth={2} aria-hidden />
          )}
          <span>{t("back")}</span>
        </button>
        <div className="logo-container-new">
          <img src="/images/logo2.png" alt="Novotel Logo" className="logo-new" />
        </div>
        <div className="header-right-actions">
          <div className="language-selector">
            <button className="language-toggle" onClick={() => setShowLanguageDropdown(!showLanguageDropdown)}>
              <img src={getCurrentLanguage()?.flag || "/placeholder.svg"} alt={getCurrentLanguage()?.name} className="language-flag" />
              <span>{getCurrentLanguage()?.code.toUpperCase()}</span>
            </button>
            {showLanguageDropdown && (
              <div className="language-dropdown">
                {languages.map((lang) => (
                  <div key={lang.code} className={`language-option ${currentLanguage === lang.code ? "active" : ""}`}
                    onClick={(e) => { e.stopPropagation(); changeLanguage(lang.code) }}>
                    <img src={lang.flag || "/placeholder.svg"} alt={lang.name} className="flag-small" />
                    <span>{lang.name}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
          <ThemeToggle />
        </div>
      </header>
      <main className="app-main-new">
{pageContent && (
  <div className="page-content-restaurant">
    {pageContent.image && (
      <img
        src={pageContent.image}
        alt="Restaurant"
        className="page-content-image"
        onError={(e) => (e.target.src = "/placeholder.svg")}
      />
    )}
    {pageContent.video && (
      <div style={{
        margin: "0 auto 20px",
        maxWidth: "680px",
        borderRadius: "14px",
        overflow: "hidden",
        boxShadow: "0 6px 24px rgba(0,0,0,0.18)",
        background: "#000",
        position: "relative",
      }}>
        <span style={{
          position: "absolute", top: "10px", left: "12px",
          background: "rgba(0,0,0,0.55)", backdropFilter: "blur(4px)",
          color: "#fff", fontSize: "11px", fontWeight: "700",
          padding: "3px 10px", borderRadius: "20px",
          letterSpacing: "0.6px", zIndex: 2,
        }}>▶ Vidéo</span>
        <video
          src={pageContent.video}
          controls
          style={{ width: "100%", display: "block", aspectRatio: "16/9", objectFit: "cover" }}
        />
      </div>
    )}
    {pageContent.description && (
      <div
  className="page-content-description"
  dangerouslySetInnerHTML={{ __html: pageContent.description }}
/>

    )}
  </div>
)}
        {!selectedRestaurant ? (
          <>
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="welcome-banner-new"
            ></motion.div>
            {isLoading ? (
              <div className="loading-container-new">
                <div className="loading-spinner-new"></div>
                <p>{t("loadingRestaurants")}</p>
              </div>
            ) : restaurants.length === 0 ? (
              <div className="empty-state-new">
                <div className="empty-icon-new">
                  <UtensilsCrossed size={56} strokeWidth={1.5} className="empty-state-icon" />
                </div>
                <h3>{t("noRestaurantsFound")}</h3>
                <p>{t("comeBackSoonRestaurants")}</p>
              </div>
            ) : (
              <div className="restaurants-grid-new">
                {restaurants.map((restaurant, index) => (
                  <motion.div
                    key={restaurant._id}
                    className="restaurant-card-new"
                    custom={index}
                    variants={restaurantVariants}
                    initial="hidden"
                    animate="visible"
                    whileHover={{
                      y: -10,
                      boxShadow: "0 15px 30px rgba(0, 71, 171, 0.2)",
                      borderColor: "var(--primary)",
                    }}
                  >
                    <div className="restaurant-card-image-new">
                      <img
                        src={restaurant.image || "/placeholder.svg"}
                        alt={restaurant.name}
                        onError={(e) => (e.target.src = "/placeholder.svg")}
                      />
                    </div>
                    <div className="restaurant-card-content-new">
                      <h3 className="restaurant-card-title-new">{restaurant.name}</h3>
                      <div className="restaurant-card-buttons-new">
                        <button
                          className="view-menu-button-new btn-with-icon"
                          onClick={(e) => {
                            e.stopPropagation()
                            setSelectedRestaurant(restaurant)
                          }}
                        >
                          <UtensilsCrossed size={18} strokeWidth={2} />
                          <span>{t("viewMenu")}</span>
                        </button>
                        {restaurant.reservable && (
                          <button
                            className="reserve-button-new btn-with-icon"
                            onClick={(e) => {
                              e.stopPropagation()
                              setShowModal(true)
                            }}
                          >
                            <CalendarCheck size={18} strokeWidth={2} />
                            <span>{t("reserveTable")}</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </>
        ) : (
          <>
            {isLoading ? (
              <div className="loading-container-new">
                <div className="loading-spinner-new"></div>
                <p>{t("loadingMenus")}</p>
              </div>
            ) : menus.length === 0 ? (
              <div className="empty-state-new">
                <div className="empty-icon-new">
                  <UtensilsCrossed size={56} strokeWidth={1.5} className="empty-state-icon" />
                </div>
                <h3>{t("noMenuAvailable")}</h3>
                <p>{t("comeBackSoonMenus")}</p>
              </div>
            ) : (
              <div className="menu-display-container-new" style={{ position: "relative" }}>
                <button
                  type="button"
                  className="view-toggle-button view-toggle-with-icon"
                  onClick={toggleViewMode}
                  aria-label={viewMode === "book" ? t("switchToModern") : t("switchToBook")}
                  title={viewMode === "book" ? t("switchToModern") : t("switchToBook")}
                >
                  {viewMode === "book" ? <LayoutGrid size={22} strokeWidth={2} /> : <BookOpen size={22} strokeWidth={2} />}
                </button>

                {/* Removed DietaryLegend from here - it will only show in modern view now */}

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
                                className={`menu-image-carousel-new menu-image-carousel-new-dark ${
                                  isMobile ? "menu-image-carousel-fixed" : ""
                                }`}
                              >
                                {isMobile ? (
                                  // Small screens: Show all images vertically with fixed dimensions
                                  menus[currentMenuIndex].images.map((image, index) => (
                                    <div key={index} className="carousel-container-fixed">
                                      <img
                                        src={image || "/placeholder.svg"}
                                        alt={`${menus[currentMenuIndex].title} - Image ${index + 1}`}
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
                                        alt={`${menus[currentMenuIndex].title} - Image ${currentImageIndex + 1}`}
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
                                            className={`image-dot-new image-dot-new-dark ${
                                              index === currentImageIndex ? "active" : ""
                                            }`}
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
                            {getCurrentMenuItems().length > 0 ? (
                              <div className="menu-items-list-new">
                                {getCurrentMenuItems().map((item, idx) => (
                                  <div key={idx} className="menu-item-new">
                                    <div className="menu-item-header-new">
                                      <h3 className="menu-item-name-new">
                                        {item.name}
                                        {item.isVegetarian && <span className="vegetarian-badge">Vég.</span>}
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
                                    ? t("noVegetarianDishes") || "Aucun plat végétarien disponible"
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
                    <div className="allergen-legend-wrapper">
                      <button
                        type="button"
                        className="allergen-legend-toggle"
                        onClick={() => setShowAllergenLegend((v) => !v)}
                        aria-expanded={showAllergenLegend}
                        aria-controls="allergen-legend-content"
                      >
                        <span className="allergen-legend-toggle-text">
                          {showAllergenLegend ? t("hideAllergenList") : t("showAllergenList")}
                        </span>
                        <span className="allergen-legend-toggle-icon" aria-hidden="true">
                          {showAllergenLegend ? <ChevronUp size={20} strokeWidth={2.5} /> : <ChevronDown size={20} strokeWidth={2.5} />}
                        </span>
                      </button>
                      {showAllergenLegend && (
                        <div id="allergen-legend-content">
                          <AllergenLegend />
                        </div>
                      )}
                    </div>

                    {/* Menu Items */}
                    <div className="modern-menu-items">
                      {getCurrentMenuItems().length > 0 ? (
                        <>
                          {/* Group items by category, ordered: Entrées → Suites/Pâtes → Plats traditionnels → Desserts */}
                          {getSortedCategoryEntries(getCurrentMenuItems()).map(([category, items]) => (
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
                                      </div>
                                      <span className="modern-item-price">
                                        {item.price} <span className="currency">TND</span>
                                      </span>
                                    </div>
                                    <p className="modern-item-description">{item.description}</p>
                                    {item.weight && <div className="modern-item-weight">{item.weight} gr</div>}
                                    {renderItemInfo(item)}
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
                              ? t("noVegetarianDishes") || "Aucun plat végétarien disponible"
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
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
      {showModal && (
        <div className="modal-backdrop">
          <div className="modal">
            <h2>{t("reserveTableModal")}</h2>
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
            <input
              type="datetime-local"
              value={reservationData.from}
              onChange={(e) => setReservationData({ ...reservationData, from: e.target.value })}
              required
            />
            <input
              type="number"
              min="1"
              placeholder={t("numberOfPeople")}
              value={reservationData.people}
              onChange={(e) => setReservationData({ ...reservationData, people: e.target.value })}
              required
            />
            <div className="modal-actions-new">
              <button onClick={handleReservationSubmit}>✅ {t("reserve")}</button>
              <button onClick={() => setShowModal(false)}>❌ {t("cancel")}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default RestaurantsMenusClient
