"use client"

import { useEffect, useState } from "react"
import API from "../services/api"
import "./RoomServiceClientNew.css"
import { ChevronLeft, ChevronRight, LayoutGrid, Book } from "lucide-react"
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
    orderService: "🍽️ Demander un service", // For menu items

    // Menu Navigation
    previousMenu: "Menu précédent",
    nextMenu: "Menu suivant",
    previousImage: "Image précédente",
    nextImage: "Image suivante",
    goToImage: "Aller à l'image",

    // Allergens (re-used from other components)
    mushrooms: "Champignons",
    gluten: "Gluten",
    nuts: "Noix",
    milk: "Lait",
    eggs: "Œufs",
    others: "Autres", // Default category if not specified

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
    addressLine1: "Avenue Mohamed V",
    addressLine2: "Tunis, Tunisie",
    allRightsReserved: "Tous droits réservés",
    createdBy: "Créé par",
    dietaryInformation: "Informations alimentaires :",
vegetarian: "Végétarien",
organic: "Bio",
local: "Local",
glutenFree: "Sans gluten",
lactoseFree: "Sans lactose",
available24_7: "Disponible 24/7",
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
    orderService: "🍽️ Request a Service", // For menu items

    // Menu Navigation
    previousMenu: "Previous Menu",
    nextMenu: "Next Menu",
    previousImage: "Previous image",
    nextImage: "Next image",
    goToImage: "Go to image",

    // Allergens
    mushrooms: "Mushrooms",
    gluten: "Gluten",
    nuts: "Nuts",
    milk: "Milk",
    eggs: "Eggs",
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
    addressLine1: "Avenue Mohamed V",
    addressLine2: "1002 Tunis, Tunisia",
    allRightsReserved: "All rights reserved",
    createdBy: "Created by",
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
    orderService: "🍽️ طلب خدمة", // For menu items

    // Menu Navigation
    previousMenu: "القائمة السابقة",
    nextMenu: "القائمة التالية",
    previousImage: "الصورة السابقة",
    nextImage: "الصورة التالية",
    goToImage: "الانتقال إلى الصورة",

    // Allergens
    mushrooms: "فطر",
    gluten: "جلوتين",
    nuts: "مكسرات",
    milk: "حليب",
    eggs: "بيض",
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
    addressLine1: "شارع الكورنيش",
    addressLine2: "تونس، تونس",
    allRightsReserved: "جميع الحقوق محفوظة",
    createdBy: "تم إنشاؤه بواسطة",
  },
}



const renderDietaryBadges = (item) => (
  <>
    {item.isVegetarian && <span className="dietary-badge"> 🌱</span>}
    {item.isOrganic && <span className="dietary-badge"> 🌿</span>}
    {item.isLocal && <span className="dietary-badge"> 🏠</span>}
    {item.isGlutenFree && <span className="dietary-badge"> 🚫🌾</span>}
    {item.isLactoseFree && <span className="dietary-badge"> 🚫🥛</span>}
    {item.isAvailable24_7 && <span className="dietary-badge"> 🕛</span>}

  </>
)

const languages = [
  { code: "fr", name: "Français", flag: "/images/fr-flag-v2.png" },
  { code: "en", name: "English", flag: "/images/en-flag-v2.png" },
  { code: "ar", name: "العربية", flag: "/images/ar-flag-v2.png" },
]

const RoomServiceClient = () => {
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

  // Get translation function
  const t = (key) => translations[currentLanguage][key] || translations.fr[key] || key
const DietaryLegend = () => (
  <div className="dietary-legend">
    <h4>{t("dietaryInformation")}</h4>
    <div className="legend-items">
      <span className="legend-item"> 🌱 {t("vegetarian")}</span>
      <span className="legend-item"> 🌿 {t("organic")}</span>
      <span className="legend-item"> 🏠 {t("local")}</span>
      <span className="legend-item"> 🚫🌾 {t("glutenFree")}</span>
      <span className="legend-item"> 🚫🥛 {t("lactoseFree")}</span>
      <span className="legend-item"> 🕛 {t("available24_7")}</span>
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

  // Allergen icons mapping
  const allergenIcons = {
    mushrooms: (
      <svg width="24" height="24" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M32 6C17 6 6 17 6 26s12 12 26 12 26-3 26-12S47 6 32 6zm0 30c-5.2 0-10.4-.9-14.7-2.4 1.5 6.6 5.5 13 9.7 13.8v5.6h10v-5.6c4.2-.8 8.2-7.2 9.7-13.8C42.4 35.1 37.2 36 32 36z"
          fill="#ffffff"
          stroke="#007BFF"
          strokeWidth="2"
        />
      </svg>
    ),
    gluten: (
      <svg width="24" height="24" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
        <circle cx="32" cy="32" r="28" fill="#ffffff" stroke="#007BFF" strokeWidth="2" />
        <line x1="16" y1="16" x2="48" y2="48" stroke="#007BFF" strokeWidth="3" />
      </svg>
    ),
    nuts: (
      <svg width="24" height="24" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M32 8C20 8 12 20 12 32s8 24 20 24 20-12 20-24S44 8 32 8zm0 40c-8 0-16-6-16-16s8-16 16-16 16 6 16 16-8 16-16 16z"
          fill="#ffffff"
          stroke="#007BFF"
          strokeWidth="2"
        />
        <circle cx="32" cy="32" r="4" fill="#007BFF" />
      </svg>
    ),
    milk: (
      <svg width="24" height="24" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M24 4v12l-6 10v34h28V26l-6-10V4H24zm12 12h-8V6h8v10zm4 38H24V28l4-6h8l4 6v26z"
          fill="#ffffff"
          stroke="#007BFF"
          strokeWidth="2"
        />
      </svg>
    ),
    eggs: (
      <svg width="24" height="24" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M32 6C22 6 10 24 10 36c0 10 10 20 22 20s22-10 22-20C54 24 42 6 32 6zm0 46c-8 0-16-6-16-16s8-22 16-22 16 12 16 22-8 16-16 16z"
          fill="#ffffff"
          stroke="#007BFF"
          strokeWidth="2"
        />
      </svg>
    ),
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
          className="header-back-link-room-service"
          onClick={() => {
            if (showMenus) {
              setShowMenus(false)
              setSelectedService(null)
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
                <div className="empty-icon-room-service">🔍</div>
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
                            style={{
                              background: "#0047ab",
                              color: "white",
                              border: "none",
                              padding: "0.75rem 1.5rem",
                              borderRadius: "8px",
                              fontWeight: "600",
                              cursor: "pointer",
                              transition: "all 0.3s ease",
                              fontSize: "0.95rem",
                              width: "100%",
                              marginBottom: "1rem",
                            }}
                            onMouseEnter={(e) => {
                              e.target.style.background = "#003d96"
                              e.target.style.transform = "translateY(-2px)"
                              e.target.style.boxShadow = "0 4px 12px rgba(0, 71, 171, 0.3)"
                            }}
                            onMouseLeave={(e) => {
                              e.target.style.background = "#0047ab"
                              e.target.style.transform = "translateY(0)"
                              e.target.style.boxShadow = "none"
                            }}
                          >
                            {t("viewMenu")}
                          </button>
                        )}
                        {isCleaningService(service.name) && (
                          <button
                            className="nettoyage-button-room-service"
                            onClick={() => handleNettoyageRequest(service)}
                            style={{
                              background: "#0047ab",
                              color: "white",
                              border: "none",
                              padding: "0.75rem 1.5rem",
                              borderRadius: "8px",
                              fontWeight: "600",
                              cursor: "pointer",
                              transition: "all 0.3s ease",
                              fontSize: "0.95rem",
                              width: "100%",
                              marginBottom: "1rem",
                            }}
                            onMouseEnter={(e) => {
                              e.target.style.background = "#003d96"
                              e.target.style.transform = "translateY(-2px)"
                              e.target.style.boxShadow = "0 4px 12px rgba(0, 71, 171, 0.3)"
                            }}
                            onMouseLeave={(e) => {
                              e.target.style.background = "#0047ab"
                              e.target.style.transform = "translateY(0)"
                              e.target.style.boxShadow = "none"
                            }}
                          >
                            🧹 {t("requestService")}
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
                <div className="empty-icon-room-service">🍽️</div>
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
                              className="view-toggle-button"
                              onClick={toggleViewMode}
                              aria-label={viewMode === "book" ? t("switchToModern") : t("switchToBook")}
                            >
                              {viewMode === "book" ? <LayoutGrid size={20} /> : <Book size={20} />}
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
          {renderDietaryBadges(item)}
        </h3>
        <div className="menu-item-price-room-service">{item.price} TND</div>
      </div>
      <p className="menu-item-description-room-service">{item.description}</p>

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

                            {/* Menu Items */}
                            <div className="modern-menu-items">
                              {getCurrentMenuItems().length > 0 ? (
                                <>
                                  {/* Group items by category if they have categories */}
                                  {Object.entries(
                                    getCurrentMenuItems().reduce((acc, item) => {
                                      const category = item.category || t("others") // Default category if not specified
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
          <h4 className="modern-item-title">
            {item.name}
            {renderDietaryBadges(item)}
          </h4>
          <div className="modern-item-price">{item.price} TND</div>
        </div>
        <p className="modern-item-description">{item.description}</p>
        {item.weight && <div className="modern-item-weight">{item.weight} gr</div>}
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
        <div className="modal-backdrop">
          <div className="modal">
            <h2>{t("requestServiceModal")}</h2>
            <input
              type="text"
              placeholder={t("taskName")}
              onChange={(e) => setNettoyageData({ ...nettoyageData, name: e.target.value })}
              required
            />
            <input
              type="text"
              placeholder={t("roomNumber")}
              value={nettoyageData.room}
              onChange={(e) => setNettoyageData({ ...nettoyageData, room: e.target.value })}
              required
            />
            <label>{t("availableFrom")}:</label>
            <input
              type="datetime-local"
              value={nettoyageData.disponibleDe}
              onChange={(e) => setNettoyageData({ ...nettoyageData, disponibleDe: e.target.value })}
              required
            />
            <label>{t("availableTo")}:</label>
            <input
              type="datetime-local"
              value={nettoyageData.disponibleA}
              onChange={(e) => setNettoyageData({ ...nettoyageData, disponibleA: e.target.value })}
              required
            />
            <div className="modal-actions">
              <button onClick={submitNettoyageRequest}>✅ {t("create")}</button>
              <button onClick={() => setShowNettoyageModal(false)}>❌ {t("cancel")}</button>
            </div>
          </div>
        </div>
      )}
      {/* Room Service Order Modal */}
     {showRoomServiceModal && (
  <div className="modal-backdrop">
    <div className="modal">
      <h2>{t("requestServiceModal")}</h2>

      <input
        type="text"
        placeholder={t("yourName")}
        value={roomServiceData.name}
        onChange={(e) =>
          setRoomServiceData({ ...roomServiceData, name: e.target.value })
        }
        required
      />

      <input
        type="email"
        placeholder={t("yourEmail")}
        value={roomServiceData.email}
        onChange={(e) =>
          setRoomServiceData({ ...roomServiceData, email: e.target.value })
        }
        required
      />

      <input
        type="text"
        placeholder={t("roomNumber")}
        value={roomServiceData.room}
        onChange={(e) =>
          setRoomServiceData({ ...roomServiceData, room: e.target.value })
        }
        required
      />

      {/* Add time field for specific services */}
      {(roomServiceData.service === t("restauration") ||
        roomServiceData.service === t("laundryAndCleaning")) && (
        <div style={{ marginBottom: "1rem" }}>
          <label
            style={{
              display: "block",
              marginBottom: "0.5rem",
              fontWeight: "600",
            }}
          >
            {t("desiredTime")}:
          </label>
          <input
            type="time"
            value={roomServiceData.time}
            onChange={(e) =>
              setRoomServiceData({ ...roomServiceData, time: e.target.value })
            }
            required
            style={{
              width: "100%",
              padding: "0.75rem",
              border: "1px solid #ddd",
              borderRadius: "6px",
              fontSize: "1rem",
            }}
          />
        </div>
      )}

      <div className="modal-actions">
        <button onClick={submitRoomServiceRequest}>✅ {t("order")}</button>
        <button onClick={() => setShowRoomServiceModal(false)}>
          ❌ {t("cancel")}
        </button>
      </div>
    </div>
  </div>
)}

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

export default RoomServiceClient
