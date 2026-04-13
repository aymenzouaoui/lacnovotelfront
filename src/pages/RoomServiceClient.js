"use client"

import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import API from "../services/api"
import "./RoomServiceClientNew.css"
import { ChevronLeft, ChevronRight, ChevronUp, ChevronDown, X, LayoutGrid, BookOpen } from "lucide-react"
import { motion } from "framer-motion"
import "./client-image-fix-dark.css"

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
available24_7: "Disponible 24/7",
    // Language Selector
    switchToModern: "Passer à la vue moderne",
    switchToBook: "Passer à la vue livre",

    vegetarianFilter: "végétarien",
    showVegetarianOnly: "Afficher uniquement les plats végétariens",
    showAllItems: "Afficher tous les plats",
    noVegetarianItems: "Aucun plat végétarien disponible dans ce menu",

    // Welcome Banner
    roomService: "Restauration en chambre",
    discoverRoomServices: "Découvrez nos services disponibles en chambre",

    // Loading & Empty States
    loadingServices: "Chargement des services...",
    noServiceFound: "Aucun service trouvé",
    servicesWillBeDisplayed: "Les services de chambre seront affichés ici.",
    loadingMenus: "Chargement des menus...",
    noMenuAvailable: "Aucun menu disponible",
    comeBackSoonMenus: "Revenez bientôt pour découvrir nos menus",
    noDishAvailable: "Aucun plat disponible dans ce menu",

    // Service Card Buttons
    viewMenu: "Voir le menu",
    requestService: "Demander un service", // For cleaning service
    orderService: "Demander un service", // For menu items

    // Menu Navigation
    previousMenu: "Menu précédent",
    nextMenu: "Menu suivant",
    previousImage: "Image précédente",
    nextImage: "Image suivante",
    goToImage: "Aller à l'image",

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
    others: "Autres",

    // Modals
    requestServiceModal: "Demander un service",
    taskName: "Nom de la tâche",
    roomNumber: "Numéro de chambre",
    availableFrom: "Disponible de",
    availableTo: "Disponible à",
    create: "Créer",
    cancel: "Annuler",
    cleaningRequestSuccess: "Demande de nettoyage créée avec succès !",
    cleaningRequestError: "Erreur lors de la création de la demande de nettoyage",
    yourName: "Votre nom",
    desiredTime: "Heure souhaitée",
    order: "Commander",
    roomServiceOrderSuccess: "Commande de room service créée avec succès !",
    roomServiceOrderError: "Erreur lors de la création de la commande de room service",
    fillAllFields: "Veuillez remplir tous les champs",
    selectTime: "Veuillez sélectionner une heure",
    restauration: "restauration",
    laundryAndCleaning: "blanchisserie et nettoyage",

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
    dietaryInformation: "Informations alimentaires :",
vegetarian: "Végétarien",
organic: "Bio",
local: "Local",
glutenFree: "Sans gluten",
lactoseFree: "Sans lactose",
available24_7: "Disponible 24/7",
    allergenContains: "Contient :",
    noAllergensDeclared: "Aucun allergène déclaré",
  },
  en: {
    // Header
    back: "Back",
dietaryInformation: "Dietary Information:",
vegetarian: "Vegetarian",
organic: "Organic",
local: "Local",
glutenFree: "Gluten-Free",
lactoseFree: "Lactose-Free",
available24_7: "Available 24/7",
    // Language Selector
    switchToModern: "Switch to modern view",
    switchToBook: "Switch to book view",

    vegetarianFilter: "Vegetarian",
    showVegetarianOnly: "Show vegetarian items only",
    showAllItems: "Show all items",
    noVegetarianItems: "No vegetarian items available in this menu",

    // Welcome Banner
    roomService: "In-room catering",
    discoverRoomServices: "Discover our in-room services",

    // Loading & Empty States
    loadingServices: "Loading services...",
    noServiceFound: "No service found",
    servicesWillBeDisplayed: "Room services will be displayed here.",
    loadingMenus: "Loading menus...",
    noMenuAvailable: "No menu available",
    comeBackSoonMenus: "Come back soon to discover our menus",
    noDishAvailable: "No dish available in this menu",

    // Service Card Buttons
    viewMenu: "View Menu",
    requestService: "Request a Service", // For cleaning service
    orderService: "Request a Service", // For menu items

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
    others: "Others",

    // Modals
    requestServiceModal: "Request a Service",
    taskName: "Task Name",
    roomNumber: "Room Number",
    availableFrom: "Available From",
    availableTo: "Available To",
    create: "Create",
    cancel: "Cancel",
    cleaningRequestSuccess: "Cleaning request created successfully!",
    cleaningRequestError: "Error creating cleaning request.",
    yourName: "Your Name",
    desiredTime: "Desired Time",
    order: "Order",
    roomServiceOrderSuccess: "Room service order created successfully!",
    roomServiceOrderError: "Error creating room service order.",
    fillAllFields: "Please fill in all fields",
    selectTime: "Please select a time",
    restauration: "restauration",
    laundryAndCleaning: "laundry and cleaning",
dietaryInformation: "Dietary Information:",
vegetarian: "Vegetarian",
organic: "Organic",
local: "Local",
glutenFree: "Gluten-Free",
lactoseFree: "Lactose-Free",
available24_7: "Available 24/7",
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
    allergenContains: "Contains:",
    noAllergensDeclared: "No allergens declared",
  },
  ar: {
    // Header
    back: "رجوع",

    // Language Selector
    switchToModern: "التبديل إلى العرض الحديث",
    switchToBook: "التبديل إلى عرض الكتاب",
dietaryInformation: "معلومات غذائية:",
vegetarian: "نباتي",
organic: "عضوي",
local: "محلي",
glutenFree: "خالٍ من الغلوتين",
lactoseFree: "خالٍ من اللاكتوز",
available24_7: "متوفر 24/7",
    vegetarianFilter: "نباتي",
    showVegetarianOnly: "إظهار الأطباق النباتية فقط",
    showAllItems: "إظهار جميع الأطباق",
    noVegetarianItems: "لا توجد أطباق نباتية متاحة في هذه القائمة",

    // Welcome Banner
    roomService: "خدمة الغرف",
    discoverRoomServices: "اكتشف خدماتنا المتوفرة في الغرف",

    // Loading & Empty States
    loadingServices: "جاري تحميل الخدمات...",
    noServiceFound: "لم يتم العثور على خدمة",
    servicesWillBeDisplayed: "سيتم عرض خدمات الغرف هنا.",
    loadingMenus: "جاري تحميل القوائم...",
    noMenuAvailable: "لا توجد قائمة متاحة",
    comeBackSoonMenus: "عد قريبًا لاكتشاف قوائمنا",
    noDishAvailable: "لا يوجد طبق متاح في هذه القائمة",
dietaryInformation: "معلومات غذائية:",
vegetarian: "نباتي",
organic: "عضوي",
local: "محلي",
glutenFree: "خالٍ من الغلوتين",
lactoseFree: "خالٍ من اللاكتوز",
available24_7: "متوفر 24/7",
    // Service Card Buttons
    viewMenu: "عرض القائمة",
    requestService: "طلب خدمة", // For cleaning service
    orderService: "طلب خدمة", // For menu items

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
    others: "أخرى",

    // Modals
    requestServiceModal: "طلب خدمة",
    taskName: "اسم المهمة",
    roomNumber: "رقم الغرفة",
    availableFrom: "متاح من",
    availableTo: "متاح إلى",
    create: "إنشاء",
    cancel: "إلغاء",
    cleaningRequestSuccess: "تم إنشاء طلب التنظيف بنجاح!",
    cleaningRequestError: "حدث خطأ أثناء إنشاء طلب التنظيف.",
    yourName: "اسمك",
    desiredTime: "الوقت المطلوب",
    order: "طلب",
    roomServiceOrderSuccess: "تم إنشاء طلب خدمة الغرف بنجاح!",
    roomServiceOrderError: "حدث خطأ أثناء إنشاء طلب خدمة الغرف.",
    fillAllFields: "يرجى ملء جميع الحقول",
    selectTime: "يرجى تحديد وقت",
    restauration: "المطاعم",
    laundryAndCleaning: "الغسيل والتنظيف",

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
    allergenContains: "يحتوي على :",
    noAllergensDeclared: "لا مواد مثيرة للحساسية معلنة",
  },
}




const languages = [
  { code: "fr", name: "Français", flag: "/images/fr-flag-v2.png" },
  { code: "en", name: "English", flag: "/images/en-flag-v2.png" },
  { code: "ar", name: "العربية", flag: "/images/ar-flag-v2.png" },
]

const RoomServiceClient = () => {
  const navigate = useNavigate()
  const [services, setServices] = useState([])
  const [isLoaded, setIsLoaded] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [selectedService, setSelectedService] = useState(null)
  const [menus, setMenus] = useState([])
  const [currentMenuIndex, setCurrentMenuIndex] = useState(0)
  const [showMenus, setShowMenus] = useState(false)
  const [showNettoyageModal, setShowNettoyageModal] = useState(false)
  const [selectedNettoyageService, setSelectedNettoyageService] = useState(null)
  const [nettoyageData, setNettoyageData] = useState({
    name: "",
    room: "",
    disponibleDe: "",
    disponibleA: "",
  })
  const [showRoomServiceModal, setShowRoomServiceModal] = useState(false)
  const [selectedMenuItem, setSelectedMenuItem] = useState(null)
  const [roomServiceData, setRoomServiceData] = useState({
    name: "",
    room: "",
    service: "",
    serviceDetails: "",
    time: "", // Add this new field
    email:""
  })
  const [isMobile, setIsMobile] = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState(0) // For image carousel
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
      <span className="legend-item">{t("available24_7")}</span>
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



const [pageContent, setPageContent] = useState(null);

useEffect(() => {
  const fetchPageContent = async () => {
    try {
      const res = await API.get("/page-contents/page/Roomservice"); // 👈 endpoint from backend
      setPageContent(res.data);
    } catch (err) {
      console.error("Error fetching room service page content:", err);
    }
  };
  fetchPageContent();
}, []);


  // Auto-rotate header images in modern view
  useEffect(() => {
    if (viewMode !== "modern" || !selectedService || menus.length === 0) return
    const currentMenu = menus[currentMenuIndex]
    if (!currentMenu?.images || currentMenu.images.length <= 1) return
    const interval = setInterval(() => {
      setHeaderImageIndex((prev) => (prev + 1) % currentMenu.images.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [viewMode, selectedService, menus, currentMenuIndex])

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

  // Ordre canonique des catégories (entrées → suites/pâtes → plats → desserts)
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

  const getSortedCategoryEntries = (items, othersLabel = "Autres") => {
    const grouped = items.reduce((acc, item) => {
      const category = item.category || othersLabel
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

  const fetchServices = async () => {
    try {
      setIsLoading(true)
      const res = await API.get("/room-services")
      setServices(res.data)
      setIsLoaded(true)
    } catch (err) {
      console.error("Erreur chargement:", err)
    } finally {
      setIsLoading(false)
    }
  }

  const fetchMenus = async (serviceId) => {
    try {
      setIsLoading(true)
      const res = await API.get("/menus")
      const filteredMenus = res.data.filter(
        (menu) => menu.roomService?._id === serviceId || menu.roomService === serviceId,
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

  const handleServiceClick = async (service) => {
    setSelectedService(service)
    await fetchMenus(service._id)
    setShowMenus(true)
  }

  const handleNettoyageRequest = (service) => {
    setSelectedNettoyageService(service)
    setNettoyageData({
      name: `${t("requestService")} - ${service.name}`,
      room: "",
      disponibleDe: "",
      disponibleA: "",
    })
    setShowNettoyageModal(true)
  }

  const handleRoomServiceRequest = (menuItem) => {
    setSelectedMenuItem(menuItem)
    // Check if the selected service contains specific keywords
    if (selectedService && selectedService.name.toLowerCase().includes(t("restauration"))) {
      setRoomServiceData({
        name: "",
        room: "",
        service: t("restauration"),
        serviceDetails: menuItem.name,
        time: "", // Add this line
            email:""

      })
    } else if (
      selectedService &&
      (selectedService.name.toLowerCase().includes("blanchisserie") ||
        selectedService.name.toLowerCase().includes("nettoyage"))
    ) {
      setRoomServiceData({
        name: "",
        room: "",
        service: t("laundryAndCleaning"),
        serviceDetails: `${menuItem.name} - ${menuItem.description || `${menuItem.price} TND`}`,
        time: "", // Add this line
            email:""

      })
    } else {
      // Default behavior (unchanged)
      setRoomServiceData({
        name: "",
        room: "",
        service: menuItem.name,
        serviceDetails: menuItem.description || `${menuItem.name} - ${menuItem.price} TND`,
        time: "", // Add this line
            email:""

      })
    }
    setShowRoomServiceModal(true)
  }

  const submitNettoyageRequest = async () => {
    try {
      if (!nettoyageData.name || !nettoyageData.room || !nettoyageData.disponibleDe || !nettoyageData.disponibleA) {
        alert(t("fillAllFields"))
        return
      }
      await API.post("/nettoyages", {
        name: nettoyageData.name,
        room: nettoyageData.room,
        disponibleDe: new Date(nettoyageData.disponibleDe).toISOString(),
        disponibleA: new Date(nettoyageData.disponibleA).toISOString(),
      })
      alert(t("cleaningRequestSuccess"))
      setShowNettoyageModal(false)
      setSelectedNettoyageService(null)
      setNettoyageData({
        name: "",
        room: "",
        disponibleDe: "",
        disponibleA: "",
      })
    } catch (error) {
      console.error("Erreur lors de la création de la demande:", error)
      alert(t("cleaningRequestError"))
    }
  }

  const submitRoomServiceRequest = async () => {
    try {
      if (
        !roomServiceData.name ||
        !roomServiceData.room ||
        !roomServiceData.service ||
        !roomServiceData.email ||

        !roomServiceData.serviceDetails
      ) {
        alert(t("fillAllFields"))
        return
      }
      // Check if time is required for specific services
      const requiresTime =
        roomServiceData.service === t("restauration") || roomServiceData.service === t("laundryAndCleaning")
      if (requiresTime && !roomServiceData.time) {
        alert(t("selectTime"))
        return
      }
      const orderData = {
        name: roomServiceData.name,
        room: roomServiceData.room,
        service: roomServiceData.service,
        serviceDetails: roomServiceData.serviceDetails,
        email: roomServiceData.email,

        status: "pending",
      }
      // Add time field if it exists
      if (roomServiceData.time) {
        orderData.time = roomServiceData.time
      }
      await API.post("/roomservice-orders", orderData)
      alert(t("roomServiceOrderSuccess"))
      setShowRoomServiceModal(false)
      setSelectedMenuItem(null)
      setRoomServiceData({
        name: "",
        room: "",
        service: "",
        serviceDetails: "",
        time: "", // Reset time field
            email:""

      })
    } catch (error) {
      console.error("Erreur lors de la création de la commande:", error)
      alert(t("roomServiceOrderError"))
    }
  }

  const isCleaningService = (serviceName) => {
    return serviceName.toLowerCase().includes("ménage")
  }

  const nextMenu = () => {
    if (currentMenuIndex < menus.length - 1) {
      const menuContainer = document.querySelector(".menu-spread-room-service")
      if (menuContainer) {
        menuContainer.classList.add("slide-out-left-room-service")
        setTimeout(() => {
          setCurrentMenuIndex(currentMenuIndex + 1)
          setCurrentImageIndex(0) // Reset image index when changing menu
          menuContainer.classList.remove("slide-out-left-room-service")
          menuContainer.classList.add("slide-in-right-room-service")
          setTimeout(() => {
            menuContainer.classList.remove("slide-in-right-room-service")
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
      const menuContainer = document.querySelector(".menu-spread-room-service")
      if (menuContainer) {
        menuContainer.classList.add("slide-out-right-room-service")
        setTimeout(() => {
          setCurrentMenuIndex(currentMenuIndex - 1)
          setCurrentImageIndex(0) // Reset image index when changing menu
          menuContainer.classList.remove("slide-out-right-room-service")
          menuContainer.classList.add("slide-in-left-room-service")
          setTimeout(() => {
            menuContainer.classList.remove("slide-in-left-room-service")
          }, 300)
        }, 300)
      } else {
        setCurrentMenuIndex(currentMenuIndex - 1)
        setCurrentImageIndex(0)
      }
    }
  }

  useEffect(() => {
    fetchServices()
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

  // Service card variants for animation
  const serviceVariants = {
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
      item.isVegetarian    && { key: "veg",     label: t("vegetarian"),    emoji: "🥦" },
      item.isOrganic       && { key: "bio",     label: t("organic"),       emoji: "🌿" },
      item.isLocal         && { key: "local",   label: t("local"),         emoji: "📍" },
      item.isGlutenFree    && { key: "gluten",  label: t("glutenFree"),    emoji: "🌾" },
      item.isLactoseFree   && { key: "lactose", label: t("lactoseFree"),   emoji: "🥛" },
      item.isAvailable24_7 && { key: "24_7",    label: t("available24_7"), emoji: "🕐" },
    ].filter(Boolean)

    const allergens = ITEM_ALLERGENS_MAP.filter(({ field, invert }) =>
      invert ? item[field] === false : !!item[field]
    )

    if (dietary.length === 0 && allergens.length === 0) return null

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
            <span className="item-allergens-warn" aria-hidden="true">⚠</span>
            {allergens.map(({ key }) => (
              <span key={key} className="item-allergen-chip" role="listitem" title={t(key)}>
                <span className="item-allergen-icon" aria-hidden="true">{allergenIcons[key]}</span>
                <span>{t(key)}</span>
              </span>
            ))}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className={`hotel-app-room-service ${currentLanguage === "ar" ? "rtl" : "ltr"}`}>
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

        .rtl .view-toggle-button {
          right: 15px;
          left: auto;
        }

        .rtl .header-back-link-room-service {
          flex-direction: row-reverse;
        }

        .rtl .header-back-link-room-service svg {
          margin-left: 8px;
          margin-right: 0;
        }

        .rtl .welcome-banner-room-service h1,
        .rtl .welcome-banner-room-service p {
          text-align: right;
        }

        .rtl .loading-container-room-service p,
        .rtl .empty-state-room-service h3,
        .rtl .empty-state-room-service p {
          text-align: right;
        }

        .rtl .service-card-content-room-service {
          text-align: right;
        }

        .rtl .service-card-actions {
          flex-direction: row-reverse;
        }

        .rtl .view-menu-button-room-service,
        .rtl .nettoyage-button-room-service {
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

        .rtl .menu-items-side-room-service {
          text-align: right;
        }

        .rtl .menu-navigation-room-service .nav-button-room-service.prev svg {
          transform: scaleX(-1);
        }

        .rtl .menu-navigation-room-service .nav-button-room-service.next svg {
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
        .modern-item-actions {
          margin-top: 10px;
        }
        .modern-order-button {
          background: var(--primary);
          color: white;
          border: none;
          border-radius: 20px;
          padding: 8px 16px;
          font-size: 14px;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .modern-order-button:hover {
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
        }

        .page-content-room-service {
  margin: 20px 0;
  text-align: center;
}

.page-content-room-service img.page-content-image {
  max-width: 100%;
  height: auto;
  border-radius: 8px;
  margin-bottom: 15px;
}

.page-content-room-service p.page-content-description {
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

      <header className="app-header-room-service">
        <button
          className="header-back-link header-back-link-room-service"
          onClick={() => {
            if (showMenus) {
              setShowMenus(false)
              setSelectedService(null)
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
        <div className="logo-container-room-service">
          <img src="/images/logo2.png" alt="Novotel Logo" className="logo-room-service" />
        </div>
        <div></div> {/* Empty div for flex spacing */}
      </header>
      <main className="app-main-room-service">
        {!showMenus ? (
          <>
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="welcome-banner-room-service"
            >
              <h1>
                <span>{t("roomService")}</span>
              </h1>
              <p>{t("discoverRoomServices")}</p>
            </motion.div>
              {pageContent && (
    <div className="page-content-room-service">
      {pageContent.image && (
        <img
          src={pageContent.image}
          alt="Room Service"
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
              <div className="loading-container-room-service">
                <div className="loading-spinner-room-service"></div>
                <p>{t("loadingServices")}</p>
              </div>
            ) : services.length === 0 ? (
              <div className="empty-state-room-service">
                <div className="empty-icon-room-service" aria-hidden />
                <h3>{t("noServiceFound")}</h3>
                <p>{t("servicesWillBeDisplayed")}</p>
              </div>
            ) : (
              <div className="services-grid-room-service">
                {services.map((service, index) => (
                  <motion.div
                    key={service._id}
                    className="service-card-room-service"
                    custom={index}
                    variants={serviceVariants}
                    initial="hidden"
                    animate="visible"
                    whileHover={{
                      y: -10,
                      boxShadow: "0 15px 30px rgba(0, 71, 171, 0.2)",
                      borderColor: "var(--primary)",
                    }}
                  >
                    <div className="service-card-content-room-service">
                      <h3 className="service-card-title-room-service">{service.name}</h3>
                      <p className="service-card-description-room-service">{service.description}</p>
                      <div className="service-card-actions">
                        {service.menus?.length > 0 && (
                          <button
                            className="view-menu-button-room-service"
                            onClick={() => handleServiceClick(service)}
                          >
                            {t("viewMenu")}
                          </button>
                        )}
                        {isCleaningService(service.name) && (
                          <button
                            className="nettoyage-button-room-service"
                            onClick={() => handleNettoyageRequest(service)}
                          >
                            {t("requestService")}
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
              <div className="loading-container-room-service">
                <div className="loading-spinner-room-service"></div>
                <p>{t("loadingMenus")}</p>
              </div>
            ) : menus.length === 0 ? (
              <div className="empty-state-room-service">
                <div className="empty-icon-room-service" aria-hidden />
                <h3>{t("noMenuAvailable")}</h3>
                <p>{t("comeBackSoonMenus")}</p>
              </div>
            ) : (
              <div className="menu-display-container-room-service" style={{ position: "relative" }}>
                {showMenus && selectedService && (
                  <>
                    {selectedService && (
                      <div className="menu-section-room-service">
                        {selectedService.name && selectedService.name.toLowerCase().includes("restauration") && (
                          <>
                            <button
                              type="button"
                              className="view-toggle-button view-toggle-with-icon"
                              onClick={toggleViewMode}
                              aria-label={viewMode === "book" ? t("switchToModern") : t("switchToBook")}
                              title={viewMode === "book" ? t("switchToModern") : t("switchToBook")}
                            >
                              {viewMode === "book" ? <LayoutGrid size={22} strokeWidth={2} /> : <BookOpen size={22} strokeWidth={2} />}
                            </button>

                           
                          </>
                        )}
                        {viewMode === "book" ? (
                          // Original Book View
                          <>
                            {currentMenuIndex >= 0 && currentMenuIndex < menus.length && (
                              <div className="menu-spread-room-service">
                                <div className="menu-content-room-service">
                                  {/* Left side - Menu Images with Carousel */}
                                  <div
                                    className={`menu-image-side-room-service ${
                                      isMobile ? "menu-image-side-fixed" : ""
                                    }`}
                                  >
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
                                                src={
                                                  menus[currentMenuIndex].images[currentImageIndex] ||
                                                  "/placeholder.svg" ||
                                                  "/placeholder.svg" ||
                                                  "/placeholder.svg"
                                                }
                                                alt={`${menus[currentMenuIndex].title} - Image ${
                                                  currentImageIndex + 1
                                                }`}
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
                                                    disabled={
                                                      currentImageIndex === menus[currentMenuIndex].images.length - 1
                                                    }
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
                                 {getCurrentMenuItems().length > 0 ? (
  getCurrentMenuItems().map((item, idx) => (
    <div key={idx} className="menu-item-room-service">
      <div className="menu-item-header-room-service">
        <h3 className="menu-item-name-room-service">
          {item.name}
        </h3>
        <div className="menu-item-price-room-service">{item.price} TND</div>
      </div>
      <p className="menu-item-description-room-service">{item.description}</p>
      {renderItemInfo(item)}

      {/* Only show order button if commandable */}
      {item.commandable && (
        <button
          className="room-service-order-button"
          onClick={() => handleRoomServiceRequest(item)}
          style={{
            background: "#0047ab",
            color: "white",
            border: "none",
            padding: "0.5rem 1rem",
            borderRadius: "6px",
            fontWeight: "600",
            cursor: "pointer",
            transition: "all 0.3s ease",
            fontSize: "0.85rem",
            marginTop: "0.5rem",
          }}
          onMouseEnter={(e) => {
            e.target.style.background = "#003d96";
            e.target.style.transform = "translateY(-1px)";
            e.target.style.boxShadow = "0 2px 8px rgba(0, 71, 171, 0.3)";
          }}
          onMouseLeave={(e) => {
            e.target.style.background = "#0047ab";
            e.target.style.transform = "translateY(0)";
            e.target.style.boxShadow = "none";
          }}
        >
          {t("orderService")}
        </button>
      )}
    </div>
  ))
) : (
  <div className="empty-menu-room-service">
    <p>{showVegetarianOnly ? t("noVegetarianItems") : t("noDishAvailable")}</p>
  </div>
)}

                                </div>
                              </div>
                            )}
                            <div className="menu-navigation-room-service">
                              <button
                                className="nav-button-room-service prev"
                                onClick={prevMenu}
                                disabled={currentMenuIndex === 0}
                                aria-label={t("previousMenu")}
                              >
                                <ChevronLeft className="h-6 w-6" />
                              </button>
                              <button
                                className="nav-button-room-service next"
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
                                  {/* Group items by category, ordered: Entrées → Suites/Pâtes → Plats → Desserts */}
                                  {getSortedCategoryEntries(getCurrentMenuItems(), t("others")).map(([category, items]) => (
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
          <h4 className="modern-item-title">
            {item.name}
          </h4>
          <div className="modern-item-price">{item.price} TND</div>
        </div>
        <p className="modern-item-description">{item.description}</p>
        {item.weight && <div className="modern-item-weight">{item.weight} gr</div>}
        {renderItemInfo(item)}
        <div className="modern-item-actions">
          {/* Only show order button if commandable */}
          {item.commandable && (
            <button
              className="modern-order-button"
              onClick={() => handleRoomServiceRequest(item)}
            >
              {t("orderService")}
            </button>
          )}
        </div>
      </div>
    </div>
  ))}
</div>

                                  ))}
                                </>
                              ) : (
                                <div className="empty-menu-room-service">
                                  <p>{showVegetarianOnly ? t("noVegetarianItems") : t("noDishAvailable")}</p>
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </>
                )}
              </div>
            )}
          </>
        )}
      </main>
      {/* Nettoyage Modal */}
      {showNettoyageModal && (
        <div className="modal-backdrop" onClick={() => setShowNettoyageModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{t("requestServiceModal")}</h2>
              <button type="button" className="modal-close" onClick={() => setShowNettoyageModal(false)} aria-label={t("cancel")}>
                <X size={20} />
              </button>
            </div>
            <div className="modal-body">
              <div className="modal-form-group">
                <input
                  type="text"
                  placeholder={t("taskName")}
                  onChange={(e) => setNettoyageData({ ...nettoyageData, name: e.target.value })}
                  required
                />
              </div>
              <div className="modal-form-group">
                <input
                  type="text"
                  placeholder={t("roomNumber")}
                  value={nettoyageData.room}
                  onChange={(e) => setNettoyageData({ ...nettoyageData, room: e.target.value })}
                  required
                />
              </div>
              <div className="modal-form-group">
                <label>{t("availableFrom")}</label>
                <input
                  type="datetime-local"
                  value={nettoyageData.disponibleDe}
                  onChange={(e) => setNettoyageData({ ...nettoyageData, disponibleDe: e.target.value })}
                  required
                />
              </div>
              <div className="modal-form-group">
                <label>{t("availableTo")}</label>
                <input
                  type="datetime-local"
                  value={nettoyageData.disponibleA}
                  onChange={(e) => setNettoyageData({ ...nettoyageData, disponibleA: e.target.value })}
                  required
                />
              </div>
              <div className="modal-actions">
                <button type="button" onClick={submitNettoyageRequest}>{t("create")}</button>
                <button type="button" onClick={() => setShowNettoyageModal(false)}>{t("cancel")}</button>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Room Service Order Modal */}
      {showRoomServiceModal && (
        <div className="modal-backdrop" onClick={() => setShowRoomServiceModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{t("requestServiceModal")}</h2>
              <button type="button" className="modal-close" onClick={() => setShowRoomServiceModal(false)} aria-label={t("cancel")}>
                <X size={20} />
              </button>
            </div>
            <div className="modal-body">
              <div className="modal-form-group">
                <input
                  type="text"
                  placeholder={t("yourName")}
                  value={roomServiceData.name}
                  onChange={(e) =>
                    setRoomServiceData({ ...roomServiceData, name: e.target.value })
                  }
                  required
                />
              </div>
              <div className="modal-form-group">
                <input
                  type="email"
                  placeholder={t("yourEmail")}
                  value={roomServiceData.email}
                  onChange={(e) =>
                    setRoomServiceData({ ...roomServiceData, email: e.target.value })
                  }
                  required
                />
              </div>
              <div className="modal-form-group">
                <input
                  type="text"
                  placeholder={t("roomNumber")}
                  value={roomServiceData.room}
                  onChange={(e) =>
                    setRoomServiceData({ ...roomServiceData, room: e.target.value })
                  }
                  required
                />
              </div>
              {(roomServiceData.service === t("restauration") ||
                roomServiceData.service === t("laundryAndCleaning")) && (
                <div className="modal-form-group">
                  <label>{t("desiredTime")}</label>
                  <input
                    type="time"
                    value={roomServiceData.time}
                    onChange={(e) =>
                      setRoomServiceData({ ...roomServiceData, time: e.target.value })
                    }
                    required
                  />
                </div>
              )}
              <div className="modal-actions">
                <button type="button" onClick={submitRoomServiceRequest}>{t("order")}</button>
                <button type="button" onClick={() => setShowRoomServiceModal(false)}>{t("cancel")}</button>
              </div>
            </div>
          </div>
        </div>
      )}

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
    </div>
  )
}

export default RoomServiceClient
