"use client"

import { useEffect, useState } from "react"
import API from "../services/api"
import "./client-image-fix-dark.css"

// Helper functions for multilingual fields
const getTranslatedText = (obj, field, lang = "fr", fallbackLang = "fr") => {
  if (!obj || !obj[field]) return ""
  
  let fieldValue = obj[field]
  
  // If it's a JSON string, parse it
  if (typeof fieldValue === "string") {
    // Check if it's a JSON string (starts with { and ends with })
    if (fieldValue.trim().startsWith("{") && fieldValue.trim().endsWith("}")) {
      try {
        fieldValue = JSON.parse(fieldValue)
      } catch (e) {
        // If parsing fails, return the string as is (backward compatibility)
        return fieldValue
      }
    } else {
      // Regular string (backward compatibility)
      return fieldValue
    }
  }
  
  // Now fieldValue should be an object
  if (typeof fieldValue === "object" && fieldValue !== null) {
    return fieldValue[lang] || fieldValue[fallbackLang] || fieldValue.fr || ""
  }
  
  return ""
}

const getName = (chambre, lang = "fr") => getTranslatedText(chambre, "name", lang)
const getDescriptionCourte = (chambre, lang = "fr") => getTranslatedText(chambre, "descriptionCourte", lang)
const getDescriptionDetaillee = (chambre, lang = "fr") => getTranslatedText(chambre, "descriptionDetaillee", lang) || getTranslatedText(chambre, "description", lang)
const getType = (chambre, lang = "fr") => getTranslatedText(chambre, "type", lang)

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
    capacity: "Capacité",
    price: "Prix",
    perNight: "par nuit",
    type: "Type",
    roomNumber: "Numéro",
    reservable: "Réservable",
    notReservable: "Non réservable",
    close: "Fermer",
    previous: "Précédent",
    next: "Suivant",
    images: "Images",
    amenities: "Équipements",
    person: "personne",
    people: "personnes",
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
    capacity: "Capacity",
    price: "Price",
    perNight: "per night",
    type: "Type",
    roomNumber: "Number",
    reservable: "Reservable",
    notReservable: "Not reservable",
    close: "Close",
    previous: "Previous",
    next: "Next",
    images: "Images",
    amenities: "Amenities",
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
    capacity: "السعة",
    price: "السعر",
    perNight: "لليلة",
    type: "النوع",
    roomNumber: "الرقم",
    reservable: "قابل للحجز",
    notReservable: "غير قابل للحجز",
    close: "إغلاق",
    previous: "السابق",
    next: "التالي",
    images: "الصور",
    amenities: "المرافق",
    person: "شخص",
    people: "أشخاص",
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
  const [selectedRoom, setSelectedRoom] = useState(null)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  // Get translation function
  const t = (key) => translations[currentLanguage][key] || translations.fr[key] || key

  const fetchRooms = async () => {
    try {
      setIsLoading(true)
      const res = await API.get("/chambres").catch(() => ({ data: [] }))
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
        if (res.data) {
          setPageContent(res.data)
        }
      } catch (err) {
        // 404 is expected if page content doesn't exist yet - silently handle it
        if (err.response?.status !== 404) {
          console.error("Error fetching rooms page content:", err)
        }
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

  // Keyboard navigation for modal
  useEffect(() => {
    if (!selectedRoom) return

    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setSelectedRoom(null)
      } else if (e.key === "ArrowLeft") {
        const allImages = selectedRoom.imagePrincipale
          ? [selectedRoom.imagePrincipale, ...(selectedRoom.images || [])]
          : selectedRoom.images || []
        if (allImages.length > 1) {
          setCurrentImageIndex((prev) => (prev - 1 + allImages.length) % allImages.length)
        }
      } else if (e.key === "ArrowRight") {
        const allImages = selectedRoom.imagePrincipale
          ? [selectedRoom.imagePrincipale, ...(selectedRoom.images || [])]
          : selectedRoom.images || []
        if (allImages.length > 1) {
          setCurrentImageIndex((prev) => (prev + 1) % allImages.length)
        }
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [selectedRoom, currentImageIndex])

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
          margin: 30px 0;
          text-align: center;
          padding: 20px;
          background: rgba(255, 255, 255, 0.95);
          border-radius: 16px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
        }
        .page-content-rooms img.page-content-image {
          max-width: 100%;
          height: auto;
          border-radius: 12px;
          margin-bottom: 20px;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
        }
        .page-content-rooms p.page-content-description {
          font-size: 17px;
          color: #555;
          line-height: 1.8;
        }
        .welcome-banner {
          text-align: center;
          margin: 40px 0 50px;
          padding: 40px 20px;
          background: linear-gradient(135deg, rgba(0, 41, 132, 0.05) 0%, rgba(0, 102, 204, 0.05) 100%);
          border-radius: 20px;
          border: 2px solid rgba(0, 41, 132, 0.1);
        }
        .welcome-banner h1 {
          font-size: 3rem;
          font-weight: 300;
          margin-bottom: 12px;
          letter-spacing: -1px;
        }
        .welcome-banner h1 span {
          font-weight: 800;
          background: linear-gradient(135deg, #002984 0%, #0066cc 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .welcome-banner p {
          font-size: 1.3rem;
          color: #666;
          font-weight: 400;
        }
        .content-container {
          padding: 20px;
          min-height: 400px;
        }
        .content-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
          gap: 30px;
          opacity: 0;
          transform: translateY(20px);
          transition: opacity 0.6s ease, transform 0.6s ease;
        }
        .content-grid.loaded {
          opacity: 1;
          transform: translateY(0);
        }
        .content-grid.loaded .room-card {
          animation: fadeInUp 0.6s ease forwards;
        }
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .room-card {
          cursor: pointer;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          background: white;
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 4px 20px rgba(0, 41, 132, 0.1);
          border: 2px solid rgba(0, 41, 132, 0.08);
          position: relative;
        }
        .room-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 4px;
          background: linear-gradient(90deg, #002984, #0066cc);
          opacity: 0;
          transition: opacity 0.3s ease;
        }
        .room-card:hover {
          transform: translateY(-12px) scale(1.03);
          box-shadow: 0 20px 50px rgba(0, 41, 132, 0.25);
          border-color: rgba(0, 41, 132, 0.3);
        }
        .room-card:hover::before {
          opacity: 1;
        }
        .room-card-meta {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin: 12px 0;
          align-items: center;
        }
        .content-item-image {
          width: 100%;
          height: 240px;
          min-height: 240px;
          max-height: 240px;
          overflow: hidden;
          position: relative;
          background: linear-gradient(135deg, #f5f7fa 0%, #e8ecf1 100%);
        }
        .content-item-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center;
          transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
          display: block;
        }
        .room-card:hover .content-item-image img {
          transform: scale(1.15);
        }
        .content-item-overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(135deg, rgba(0, 41, 132, 0.85) 0%, rgba(0, 102, 204, 0.85) 100%);
          display: flex;
          justify-content: center;
          align-items: center;
          opacity: 0;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          backdrop-filter: blur(4px);
        }
        .room-card:hover .content-item-overlay {
          opacity: 1;
        }
        .view-details {
          background: white;
          color: #002984;
          padding: 12px 24px;
          border-radius: 30px;
          font-weight: 700;
          font-size: 15px;
          transform: translateY(15px) scale(0.9);
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3);
          letter-spacing: 0.5px;
        }
        .room-card:hover .view-details {
          transform: translateY(0) scale(1);
        }
        .view-details:hover {
          background: #002984;
          color: white;
          transform: scale(1.05);
        }
        .image-count-badge {
          position: absolute;
          top: 16px;
          right: 16px;
          background: rgba(255, 255, 255, 0.98);
          color: #002984;
          padding: 8px 14px;
          border-radius: 25px;
          font-size: 13px;
          font-weight: 800;
          z-index: 3;
          box-shadow: 0 4px 15px rgba(0, 41, 132, 0.25);
          display: flex;
          align-items: center;
          gap: 6px;
          backdrop-filter: blur(15px);
          border: 1px solid rgba(255, 255, 255, 0.5);
          transition: all 0.3s ease;
        }
        .room-card:hover .image-count-badge {
          transform: scale(1.1);
          box-shadow: 0 6px 20px rgba(0, 41, 132, 0.35);
        }
        .room-type-badge {
          display: inline-flex;
          align-items: center;
          background: linear-gradient(135deg, rgba(0, 41, 132, 0.12) 0%, rgba(0, 102, 204, 0.12) 100%);
          color: #002984;
          padding: 8px 16px;
          border-radius: 25px;
          font-size: 13px;
          font-weight: 700;
          border: 2px solid rgba(0, 41, 132, 0.2);
          transition: all 0.3s ease;
          box-shadow: 0 2px 8px rgba(0, 41, 132, 0.1);
        }
        .room-type-badge:hover {
          background: linear-gradient(135deg, rgba(0, 41, 132, 0.2) 0%, rgba(0, 102, 204, 0.2) 100%);
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 41, 132, 0.2);
        }
        .room-capacity-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: linear-gradient(135deg, rgba(255, 152, 0, 0.12) 0%, rgba(255, 193, 7, 0.12) 100%);
          color: #f57c00;
          padding: 8px 16px;
          border-radius: 25px;
          font-size: 13px;
          font-weight: 700;
          border: 2px solid rgba(255, 152, 0, 0.25);
          box-shadow: 0 2px 8px rgba(255, 152, 0, 0.15);
          transition: all 0.3s ease;
        }
        .room-capacity-badge:hover {
          background: linear-gradient(135deg, rgba(255, 152, 0, 0.2) 0%, rgba(255, 193, 7, 0.2) 100%);
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(255, 152, 0, 0.25);
        }
        .room-capacity-badge svg {
          stroke: #f57c00;
        }
        .room-info-row {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          margin: 10px 0;
          font-size: 13px;
          color: #666;
        }
        .room-info-item {
          display: flex;
          align-items: center;
          gap: 4px;
        }
        .room-description-preview {
          font-size: 15px;
          color: #555;
          line-height: 1.7;
          margin-top: 16px;
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
          padding: 12px;
          background: rgba(0, 41, 132, 0.03);
          border-radius: 10px;
          border-left: 3px solid rgba(0, 41, 132, 0.2);
        }
        .content-item-content {
          padding: 24px;
          display: flex;
          flex-direction: column;
        }
        .content-item-content h3 {
          font-size: 22px;
          font-weight: 800;
          background: linear-gradient(135deg, #002984 0%, #0066cc 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin-bottom: 12px;
          line-height: 1.3;
          letter-spacing: -0.3px;
        }
        .not-reservable-badge {
          display: inline-block;
          background: rgba(255, 0, 0, 0.1);
          color: #d32f2f;
          padding: 4px 10px;
          border-radius: 12px;
          font-size: 11px;
          font-weight: 600;
          margin-top: 8px;
        }
        .room-modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.92);
          z-index: 1000;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
          animation: fadeIn 0.3s ease;
          backdrop-filter: blur(8px);
        }
        .room-modal {
          background: white;
          border-radius: 28px;
          max-width: 1100px;
          width: 100%;
          max-height: 92vh;
          overflow-y: auto;
          position: relative;
          animation: slideUp 0.5s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 0 25px 70px rgba(0, 0, 0, 0.4);
          border: 1px solid rgba(255, 255, 255, 0.1);
        }
        .room-modal::-webkit-scrollbar {
          width: 8px;
        }
        .room-modal::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 4px;
        }
        .room-modal::-webkit-scrollbar-thumb {
          background: #002984;
          border-radius: 4px;
        }
        .room-modal::-webkit-scrollbar-thumb:hover {
          background: #0066cc;
        }
        .room-modal-header {
          position: sticky;
          top: 0;
          background: linear-gradient(135deg, #ffffff 0%, #f8f9ff 100%);
          padding: 24px 28px;
          border-bottom: 2px solid rgba(0, 41, 132, 0.1);
          display: flex;
          justify-content: space-between;
          align-items: center;
          z-index: 10;
          backdrop-filter: blur(10px);
        }
        .room-modal-close {
          background: rgba(239, 68, 68, 0.1);
          border: 2px solid rgba(239, 68, 68, 0.3);
          font-size: 24px;
          cursor: pointer;
          color: #ef4444;
          width: 44px;
          height: 44px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          transition: all 0.3s ease;
          font-weight: 700;
        }
        .room-modal-close:hover {
          background: rgba(239, 68, 68, 0.2);
          border-color: rgba(239, 68, 68, 0.5);
          color: #dc2626;
          transform: scale(1.1) rotate(90deg);
        }
        .room-modal-content {
          padding: 28px;
        }
        .room-gallery {
          position: relative;
          margin-bottom: 20px;
          border-radius: 12px;
          overflow: hidden;
        }
        .room-gallery-main {
          width: 100%;
          height: 500px;
          min-height: 500px;
          object-fit: cover;
          object-position: center;
          display: block;
          transition: transform 0.5s cubic-bezier(0.4, 0, 0.2, 1);
          cursor: zoom-in;
          border-radius: 16px;
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
        }
        .room-gallery-main:hover {
          transform: scale(1.05);
          box-shadow: 0 12px 32px rgba(0, 0, 0, 0.2);
        }
        .room-gallery-nav {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          background: rgba(255, 255, 255, 0.95);
          border: 2px solid rgba(0, 41, 132, 0.2);
          width: 48px;
          height: 48px;
          border-radius: 50%;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 24px;
          font-weight: 700;
          color: #002984;
          transition: all 0.3s ease;
          z-index: 5;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        }
        .room-gallery-nav:hover {
          background: white;
          border-color: #002984;
          transform: translateY(-50%) scale(1.15);
          box-shadow: 0 6px 20px rgba(0, 41, 132, 0.3);
        }
        .room-gallery-nav.prev {
          left: 15px;
        }
        .room-gallery-nav.next {
          right: 15px;
        }
        .room-gallery-nav:disabled {
          opacity: 0.3;
          cursor: not-allowed;
        }
        .room-gallery-thumbnails {
          display: flex;
          gap: 8px;
          margin-top: 10px;
          overflow-x: auto;
          padding: 10px 0;
        }
        .room-gallery-thumbnail {
          width: 80px;
          height: 80px;
          object-fit: cover;
          border-radius: 8px;
          cursor: pointer;
          border: 3px solid transparent;
          transition: all 0.3s ease;
        }
        .room-gallery-thumbnail.active {
          border-color: #002984;
        }
        .room-gallery-thumbnail:hover {
          transform: scale(1.05);
        }
        .room-details-header {
          margin-bottom: 20px;
        }
        .room-details-title {
          font-size: 32px;
          font-weight: 800;
          color: #002984;
          margin-bottom: 16px;
          line-height: 1.2;
          letter-spacing: -0.5px;
        }
        .room-details-meta {
          display: flex;
          flex-wrap: wrap;
          gap: 16px;
          margin-bottom: 20px;
        }
        .room-meta-item {
          display: flex;
          align-items: center;
          gap: 12px;
          background: linear-gradient(135deg, rgba(0, 41, 132, 0.05) 0%, rgba(0, 102, 204, 0.05) 100%);
          padding: 12px 16px;
          border-radius: 12px;
          border: 1px solid rgba(0, 41, 132, 0.1);
          transition: all 0.3s ease;
          min-width: 150px;
        }
        .room-meta-item:hover {
          background: linear-gradient(135deg, rgba(0, 41, 132, 0.08) 0%, rgba(0, 102, 204, 0.08) 100%);
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 41, 132, 0.1);
        }
        .meta-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 40px;
          height: 40px;
          background: linear-gradient(135deg, #002984 0%, #0066cc 100%);
          border-radius: 10px;
          color: white;
          flex-shrink: 0;
        }
        .meta-icon svg {
          stroke: white;
        }
        .meta-content {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }
        .meta-label {
          font-size: 11px;
          color: #888;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          font-weight: 600;
        }
        .meta-value {
          font-size: 15px;
          color: #002984;
          font-weight: 700;
        }
        .room-details-description {
          font-size: 16px;
          line-height: 1.8;
          color: #444;
          margin-bottom: 24px;
          padding: 20px;
          background: linear-gradient(135deg, rgba(0, 41, 132, 0.02) 0%, rgba(0, 102, 204, 0.02) 100%);
          border-radius: 12px;
          border-left: 4px solid #002984;
        }
        .room-details-description p {
          margin-bottom: 12px;
        }
        .room-details-description p:last-child {
          margin-bottom: 0;
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from {
            transform: translateY(30px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
        .room-gallery-thumbnails::-webkit-scrollbar {
          height: 6px;
        }
        .room-gallery-thumbnails::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 3px;
        }
        .room-gallery-thumbnails::-webkit-scrollbar-thumb {
          background: #002984;
          border-radius: 3px;
        }
        .room-gallery-thumbnails::-webkit-scrollbar-thumb:hover {
          background: #0066cc;
        }
        @media (max-width: 768px) {
          .room-modal {
            max-width: 100%;
            max-height: 100vh;
            border-radius: 0;
          }
          .room-gallery-main {
            height: 280px;
          }
          .room-details-title {
            font-size: 24px;
          }
          .room-details-meta {
            flex-direction: column;
            gap: 12px;
          }
          .room-meta-item {
            min-width: 100%;
          }
          .room-card {
            margin-bottom: 20px;
          }
          .content-item-image {
            height: 180px;
          }
          .room-card-meta {
            flex-direction: column;
            align-items: flex-start;
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
              {rooms.map((room, index) => {
                const roomImages = room.imagePrincipale
                  ? [room.imagePrincipale, ...(room.images || [])]
                  : room.images || []
                const mainImage = room.imagePrincipale || room.images?.[0] || "/placeholder.svg"

                return (
                  <div
                    key={room._id || index}
                    className="content-item room-card"
                    style={{ animationDelay: `${index * 0.05}s` }}
                    onClick={() => {
                      setSelectedRoom(room)
                      setCurrentImageIndex(0)
                    }}
                  >
                    <div className="content-item-image">
                      <img
                        src={mainImage}
                        alt={getName(room, currentLanguage)}
                        onError={(e) => {
                          e.target.src = `/placeholder.svg?height=120&width=300&text=${getName(room, currentLanguage)}`
                        }}
                      />
                      {roomImages.length > 1 && (
                        <div className="image-count-badge">
                          📷 {roomImages.length}
                        </div>
                      )}
                      <div className="content-item-overlay">
                        <span className="view-details">{t("viewDetails")}</span>
                      </div>
                    </div>
                    <div className="content-item-content">
                      <h3>{getName(room, currentLanguage) || t("noRoomsFound")}</h3>
                      <div className="room-card-meta">
                        {getType(room, currentLanguage) && (
                          <div className="room-type-badge">{getType(room, currentLanguage)}</div>
                        )}
                        {room.capacite && (
                          <div className="room-capacity-badge">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                              <circle cx="9" cy="7" r="4"></circle>
                              <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                              <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                            </svg>
                            {room.capacite} {room.capacite === 1 ? t("person") : t("people")}
                          </div>
                        )}
                      </div>
                      {(getDescriptionCourte(room, currentLanguage) || getDescriptionDetaillee(room, currentLanguage)) && (
                        <p className="room-description-preview">
                          {(getDescriptionCourte(room, currentLanguage) || getDescriptionDetaillee(room, currentLanguage)).replace(/<[^>]*>/g, "").substring(0, 120)}
                          {(getDescriptionCourte(room, currentLanguage) || getDescriptionDetaillee(room, currentLanguage)).replace(/<[^>]*>/g, "").length > 120 ? "..." : ""}
                        </p>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </main>

      {/* Room Detail Modal */}
      {selectedRoom && (
        <div className="room-modal-overlay" onClick={() => setSelectedRoom(null)}>
          <div className="room-modal" onClick={(e) => e.stopPropagation()}>
            <div className="room-modal-header">
              <h2 style={{ margin: 0, color: "#002984" }}>{getName(selectedRoom, currentLanguage) || t("noRoomsFound")}</h2>
              <button className="room-modal-close" onClick={() => setSelectedRoom(null)}>
                ×
              </button>
            </div>
            <div className="room-modal-content">
              {/* Image Gallery */}
              {(() => {
                const allImages = selectedRoom.imagePrincipale
                  ? [selectedRoom.imagePrincipale, ...(selectedRoom.images || [])]
                  : selectedRoom.images || []
                const currentImage = allImages[currentImageIndex] || "/placeholder.svg"
                const roomName = getName(selectedRoom, currentLanguage)

                return allImages.length > 0 ? (
                  <div className="room-gallery">
                    <img
                      src={currentImage}
                      alt={roomName}
                      className="room-gallery-main"
                      onError={(e) => (e.target.src = "/placeholder.svg")}
                    />
                    {allImages.length > 1 && (
                      <>
                        <button
                          className="room-gallery-nav prev"
                          onClick={(e) => {
                            e.stopPropagation()
                            setCurrentImageIndex((prev) => (prev - 1 + allImages.length) % allImages.length)
                          }}
                          disabled={allImages.length <= 1}
                        >
                          ‹
                        </button>
                        <button
                          className="room-gallery-nav next"
                          onClick={(e) => {
                            e.stopPropagation()
                            setCurrentImageIndex((prev) => (prev + 1) % allImages.length)
                          }}
                          disabled={allImages.length <= 1}
                        >
                          ›
                        </button>
                        <div className="room-gallery-thumbnails">
                          {allImages.map((img, idx) => (
                            <img
                              key={idx}
                              src={img}
                              alt={`${roomName} ${idx + 1}`}
                              className={`room-gallery-thumbnail ${currentImageIndex === idx ? "active" : ""}`}
                              onClick={(e) => {
                                e.stopPropagation()
                                setCurrentImageIndex(idx)
                              }}
                              onError={(e) => (e.target.src = "/placeholder.svg")}
                            />
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                ) : null
              })()}

              {/* Room Details */}
              <div className="room-details-header">
                <h2 className="room-details-title">{getName(selectedRoom, currentLanguage) || t("noRoomsFound")}</h2>
                <div className="room-details-meta">
                  {getType(selectedRoom, currentLanguage) && (
                    <div className="room-meta-item">
                      <div className="meta-icon">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                          <line x1="3" y1="9" x2="21" y2="9"></line>
                          <line x1="9" y1="21" x2="9" y2="9"></line>
                        </svg>
                      </div>
                      <div className="meta-content">
                        <span className="meta-label">{t("type")}</span>
                        <span className="meta-value">{getType(selectedRoom, currentLanguage)}</span>
                      </div>
                    </div>
                  )}
                  {selectedRoom.capacite && (
                    <div className="room-meta-item">
                      <div className="meta-icon">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                          <circle cx="9" cy="7" r="4"></circle>
                          <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                          <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                        </svg>
                      </div>
                      <div className="meta-content">
                        <span className="meta-label">{t("capacity")}</span>
                        <span className="meta-value">{selectedRoom.capacite} {selectedRoom.capacite === 1 ? t("person") : t("people")}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {(getDescriptionCourte(selectedRoom, currentLanguage) || getDescriptionDetaillee(selectedRoom, currentLanguage)) && (
                <div
                  className="room-details-description"
                  dangerouslySetInnerHTML={{ __html: getDescriptionDetaillee(selectedRoom, currentLanguage) || getDescriptionCourte(selectedRoom, currentLanguage) }}
                />
              )}
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
