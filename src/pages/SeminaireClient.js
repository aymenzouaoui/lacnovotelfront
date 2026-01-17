"use client"

import { useEffect, useState } from "react"
import API from "../services/api"
import "./SeminaireClient.css" // Keep the original CSS import
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Users,
  Maximize,
  Facebook,
  Instagram,

  Play,
  Pause,
  Wifi,
  Thermometer,
  Coffee,
  Volume2,
  ArrowUp,
} from "lucide-react"

// Translation system
const translations = {
  fr: {
    // Header
    back: "Retour",
    // Welcome banner
    seminarSpaces: "Espaces",
    seminars: "Séminaires",
    discoverSpaces: "Découvrez nos espaces professionnels pour vos événements d'entreprise",
    // Seminar details
    capacity: "Capacité",
    people: "personnes",
    area: "Superficie",
    height: "Hauteur sous plafond",
    meters: "m",
    defaultDescription:
      "Cet espace de séminaire est parfaitement équipé pour accueillir vos événements professionnels dans un cadre élégant et fonctionnel.",
    audiovisualEquipment: "Équipement audiovisuel",
    highSpeedWifi: "Wi-Fi haut débit",
    airConditioning: "Climatisation",
    cateringService: "Service de restauration",
    reserveRoom: "RÉSERVER UNE SALLE",
    technicalSheet: "FICHE TECHNIQUE",
    // Loading & Empty states
    loadingSeminars: "Chargement des séminaires...",
    noSeminarSpaces: "Aucun espace de séminaire disponible",
    comeBackSoonSpaces: "Revenez bientôt pour découvrir nos espaces",
    // Reservation Modal
    bookRoom: "Réserver une salle",
    name: "Nom",
    email: "Email",
    phoneNumber: "Numéro de téléphone",
    from: "De",
    to: "À",
    numberOfPeople: "Nombre de personnes",
    reserve: "Réserver",
    cancel: "Annuler",
    reservationSuccess: "Réservation créée avec succès !",
    reservationError: "Erreur lors de la création de la réservation.",
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
    seminarRooms: "Salles de Séminaire",
    roomName: "Nom de la Salle",
    description: "Description",
    amenities: "Équipements et Services",
  },
  en: {
    // Header
    back: "Back",
    // Welcome banner
    seminarSpaces: "Seminar",
    seminars: "Spaces",
    discoverSpaces: "Discover our professional spaces for your corporate events",
    // Seminar details
    capacity: "Capacity",
    people: "people",
    area: "Area",
    height: "Ceiling Height",
    meters: "m",
    defaultDescription:
      "This seminar space is perfectly equipped to host your professional events in an elegant and functional setting.",
    audiovisualEquipment: "Audiovisual equipment",
    highSpeedWifi: "High-speed Wi-Fi",
    airConditioning: "Air conditioning",
    cateringService: "Catering service",
    reserveRoom: "BOOK A ROOM",
    technicalSheet: "TECHNICAL SHEET",
    // Loading & Empty states
    loadingSeminars: "Loading seminars...",
    noSeminarSpaces: "No seminar spaces available",
    comeBackSoonSpaces: "Come back soon to discover our spaces",
    // Reservation Modal
    bookRoom: "Book a room",
    name: "Name",
    email: "Email",
    phoneNumber: "Phone Number",
    from: "From",
    to: "To",
    numberOfPeople: "Number of people",
    reserve: "Book",
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
    addressLine1: "Avenue Mohamed V",
    addressLine2: "1002 Tunis, Tunisia",
    allRightsReserved: "All rights reserved",
    createdBy: "Created by",
    seminarRooms: "Seminar Rooms",
    roomName: "Room Name",
    description: "Description",
    amenities: "Amenities and Services",
  },
  ar: {
    // Header
    back: "رجوع",
    // Welcome banner
    seminarSpaces: "مساحات",
    seminars: "الندوات",
    discoverSpaces: "اكتشف مساحاتنا الاحترافية لفعاليات شركتك",
    // Seminar details
    capacity: "السعة",
    people: "شخص",
    area: "المساحة",
    height: "ارتفاع السقف",
    meters: "م",
    defaultDescription: "تم تجهيز مساحة الندوات هذه بشكل مثالي لاستضافة فعالياتك المهنية في بيئة أنيقة وعملية.",
    audiovisualEquipment: "معدات سمعية بصرية",
    highSpeedWifi: "واي فاي عالي السرعة",
    airConditioning: "تكييف",
    cateringService: "خدمة تقديم الطعام",
    reserveRoom: "احجز قاعة",
    technicalSheet: "الورقة الفنية",
    // Loading & Empty states
    loadingSeminars: "جاري تحميل الندوات...",
    noSeminarSpaces: "لا توجد مساحات ندوات متاحة",
    comeBackSoonSpaces: "عد قريبًا لاكتشاف مساحاتنا",
    // Reservation Modal
    bookRoom: "احجز قاعة",
    name: "الاسم",
    email: "البريد الإلكتروني",
    phoneNumber: "رقم الهاتف",
    from: "من",
    to: "إلى",
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
    addressLine1: "شارع الكورنيش",
    addressLine2: "تونس، تونس",
    allRightsReserved: "جميع الحقوق محفوظة",
    createdBy: "تم إنشاؤه بواسطة",
    seminarRooms: "المساحات للندوات",
    roomName: "اسم المساحة",
    description: "الوصف",
    amenities: "المرافق والخدمات",
  },
}

const languages = [
  { code: "fr", name: "Français", flag: "/images/fr-flag-v2.png" },
  { code: "en", name: "English", flag: "/images/en-flag-v2.png" },
  { code: "ar", name: "العربية", flag: "/images/ar-flag-v2.png" },
]

const SeminairesClient = () => {
  const [seminaires, setSeminaires] = useState([])
  const [isLoaded, setIsLoaded] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [currentLanguage, setCurrentLanguage] = useState("fr")
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false)

  const [currentSlideIndex, setCurrentSlideIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(true)

  // Get translation function
  const t = (key) => translations[currentLanguage][key] || translations.fr[key] || key

  const fetchSeminaires = async () => {
    try {
      setIsLoading(true)
      const res = await API.get("/seminaires")
      setSeminaires(res.data)
      setIsLoaded(true)
    } catch (error) {
      console.error("Erreur chargement des séminaires:", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (isPlaying && seminaires.length > 0) {
      const interval = setInterval(() => {
        setCurrentSlideIndex((prev) => (prev + 1) % seminaires.length)
      }, 4000)
      return () => clearInterval(interval)
    }
  }, [isPlaying, seminaires.length])

  // React state and fetch
const [pageContent, setPageContent] = useState(null);

useEffect(() => {
  const fetchPageContent = async () => {
    try {
      const res = await API.get("/page-contents/page/Seminaire"); // 👈 pageName = seminaire
      setPageContent(res.data);
    } catch (err) {
      console.error("Error fetching seminaire page content:", err);
      setPageContent(null);
    }
  };
  fetchPageContent();
}, []);


  useEffect(() => {
    fetchSeminaires()
    const timer = setTimeout(() => {
      setIsLoaded(true)
    }, 100)
    return () => clearTimeout(timer)
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

  const nextSlide = () => {
    setCurrentSlideIndex((prev) => (prev + 1) % seminaires.length)
  }

  const prevSlide = () => {
    setCurrentSlideIndex((prev) => (prev - 1 + seminaires.length) % seminaires.length)
  }

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying)
  }

  return (
    <div className={`hotel-app8 ${currentLanguage === "ar" ? "rtl" : "ltr"}`}>
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

        /* Loading Spinner */
        .loading-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 200px;
          gap: 16px;
          color: #555;
        }

        .loading-spinner {
          border: 4px solid #f3f3f3;
          border-top: 4px solid #3498db;
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
        .rtl .welcome-banner h1 {
          text-align: right;
        }
        .rtl .welcome-banner p {
          text-align: right;
        }
        .rtl .empty-state {
          text-align: right;
        }
        .rtl .seminaire-detail-content {
          text-align: right;
        }
        .rtl .seminaire-navigation {
          flex-direction: row-reverse;
        }
        .rtl .seminaire-navigation .prev-button {
          order: 3; /* Move prev button to the right */
        }
        .rtl .seminaire-navigation .next-button {
          order: 1; /* Move next button to the left */
        }
        .rtl .seminaire-counter {
          order: 2;
        }
        .rtl .seminaire-info {
          text-align: right;
        }
        .rtl .seminaire-specs {
          flex-direction: column; /* Stack specs vertically for RTL */
          align-items: flex-end; /* Align items to the right */
        }
        .rtl .spec-item {
          flex-direction: row-reverse; /* Flip icon and text */
          text-align: right;
        }
        .rtl .spec-icon {
          margin-left: 8px;
          margin-right: 0;
        }
        .rtl .seminaire-features {
          align-items: flex-end; /* Align features to the right */
        }
        .rtl .feature-item {
          flex-direction: row-reverse; /* Flip checkmark and text */
          text-align: right;
        }
        .rtl .feature-icon {
          margin-left: 8px;
          margin-right: 0;
        }
        .rtl .seminaire-actions {
          flex-direction: row-reverse; /* Flip button order */
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
        .rtl .modal h2,
        .rtl .modal input,
        .rtl .modal-actions {
          text-align: right;
        }
        .rtl .modal-actions {
          flex-direction: row-reverse;
        }
        .rtl .seminaire-navigation .nav-button svg {
          transform: scaleX(-1);
        }

        /* Added slideshow styles */
        .slideshow-container {
          position: relative;
          width: 100%;
          height: 400px;
          margin: 2rem 0;
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
        }

        .slideshow-wrapper {
          position: relative;
          width: 100%;
          height: 100%;
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
        }

        .slide-overlay {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          background: linear-gradient(transparent, rgba(0, 0, 0, 0.7));
          color: white;
          padding: 2rem;
        }

        .slide-title {
          font-size: 1.5rem;
          font-weight: 600;
          margin-bottom: 0.5rem;
        }

        .slide-specs {
          display: flex;
          gap: 1rem;
          font-size: 0.9rem;
          opacity: 0.9;
        }

        .slideshow-controls {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          background: rgba(0, 0, 0, 0.5);
          color: white;
          border: none;
          border-radius: 50%;
          width: 50px;
          height: 50px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.3s ease;
          backdrop-filter: blur(10px);
        }

        .slideshow-controls:hover {
          background: rgba(0, 0, 0, 0.7);
          transform: translateY(-50%) scale(1.1);
        }

        .prev-slide {
          left: 1rem;
        }

        .next-slide {
          right: 1rem;
        }

        .slideshow-indicators {
          position: absolute;
          bottom: 1rem;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          gap: 0.5rem;
          align-items: center;
        }

        .indicator {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.5);
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .indicator.active {
          background: white;
          transform: scale(1.2);
        }

        .play-pause-btn {
          background: rgba(0, 0, 0, 0.5);
          color: white;
          border: none;
          border-radius: 50%;
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          margin-left: 1rem;
          backdrop-filter: blur(10px);
        }

        /* Added new content layout styles */
        .seminaires-showcase {
          max-width: 1200px;
          margin: 0 auto;
          padding: 2rem;
        }

        .seminaire-card {
          margin-bottom: 4rem;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 3rem;
          align-items: center;
          padding: 2rem 0;
        }

        .seminaire-card:nth-child(even) {
          direction: rtl;
        }

        .seminaire-card:nth-child(even) .seminaire-content {
          direction: ltr;
        }

        .seminaire-image-wrapper {
          position: relative;
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1);
          transition: transform 0.3s ease;
        }

        .seminaire-image-wrapper:hover {
          transform: translateY(-5px);
        }

        .seminaire-image-wrapper img {
          width: 100%;
          height: 300px;
          object-fit: cover;
        }

        .seminaire-content {
          padding: 1rem;
        }

        .seminaire-title {
          font-size: 2rem;
          font-weight: 700;
          color: #2c3e50;
          margin-bottom: 1rem;
          line-height: 1.2;
        }

        .seminaire-description {
          font-size: 1.1rem;
          color: #555;
          line-height: 1.6;
          margin-bottom: 2rem;
        }

        .seminaire-specs-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          gap: 1rem;
          margin-bottom: 2rem;
        }

        .spec-card {
          background: #f8f9fa;
          padding: 1rem;
          border-radius: 12px;
          text-align: center;
          border: 2px solid transparent;
          transition: all 0.3s ease;
        }

        .spec-card:hover {
          border-color: #3498db;
          transform: translateY(-2px);
        }

        .spec-icon {
          color: #3498db;
          margin-bottom: 0.5rem;
        }

        .spec-label {
          font-size: 0.9rem;
          color: #666;
          margin-bottom: 0.25rem;
        }

        .spec-value {
          font-size: 1.1rem;
          font-weight: 600;
          color: #2c3e50;
        }

        .features-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 0.75rem;
        }

        .feature-item {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.95rem;
          color: #555;
        }

        .feature-icon {
          color: #27ae60;
          flex-shrink: 0;
        }

        .section-divider {
          height: 2px;
          background: linear-gradient(90deg, transparent, #3498db, transparent);
          margin: 3rem 0;
          border-radius: 1px;
        }

        .seminaires-table {
          background: white;
          border-radius: 16px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
          overflow: hidden;
          margin: 2rem 0;
        }

        .table-header {
          background: linear-gradient(135deg, #1e3a8a, #1e40af);
          color: white;
          padding: 1.5rem;
          text-align: center;
        }

        .table-title {
          font-size: 1.5rem;
          font-weight: 600;
          margin: 0;
        }

        .table-content {
          overflow-x: auto;
          -webkit-overflow-scrolling: touch;
        }

        .seminaires-data-table {
          width: 100%;
          border-collapse: collapse;
        }

        .seminaires-data-table th,
        .seminaires-data-table td {
          padding: 1rem;
          border-bottom: 2px solid #e9ecef;
          color: #555;
        }

        .seminaires-data-table th {
          background: #f8f9fa;
          font-weight: 600;
          color: #2c3e50;
        }

        .seminaires-data-table tr:hover {
          background: #f8f9fa;
        }

        .seminaire-name-cell {
          font-weight: 600;
          color: #2c3e50;
        }

.capacity-cell {
  display: flex;
  flex-direction: column;  /* ✅ stack vertically */
  align-items: flex-start; /* align everything to the left */
  gap: 0.25rem;            /* small spacing between rows */
}

.capacity-info,
.area-info,
.height-info {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}


        @media (max-width: 768px) {
          .seminaires-data-table {
            font-size: 0.875rem;
          }
          
          .seminaires-data-table th,
          .seminaires-data-table td {
            padding: 0.75rem 0.5rem;
          }
          
          .table-content {
            overflow-x: auto;
            -webkit-overflow-scrolling: touch;
          }
        }

        .amenities-section {
          margin: 3rem 0;
          padding: 2rem;
          background: white;
          border-radius: 16px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
        }

        .amenities-title {
          font-size: 1.5rem;
          font-weight: 600;
          color: #2c3e50;
          text-align: center;
          margin-bottom: 2rem;
        }

        .amenities-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 1.5rem;
        }

        .amenity-card {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1.5rem;
          background: linear-gradient(135deg, #1e3a8a, #1e40af);
          color: white;
          border-radius: 12px;
          transition: transform 0.2s ease;
        }

        .amenity-card:hover {
          transform: translateY(-2px);
        }

        .amenity-icon {
          background: rgba(255, 255, 255, 0.2);
          padding: 0.75rem;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .amenity-text {
          font-weight: 500;
          color: white;
        }

        @media (max-width: 768px) {
          .slideshow-container {
            height: 250px;
            margin: 1rem 0;
          }

          .seminaire-card {
            grid-template-columns: 1fr;
            gap: 1.5rem;
            margin-bottom: 2rem;
          }

          .seminaire-card:nth-child(even) {
            direction: ltr;
          }

          .seminaire-title {
            font-size: 1.5rem;
          }

          .seminaires-showcase {
            padding: 1rem;
          }
        }

        /* CSS for Seminaire page content */
.page-content-seminaire {
  margin: 20px 0;
  text-align: center;
}

.page-content-seminaire img.page-content-image {
  max-width: 100%;
  height: auto;
  border-radius: 8px;
  margin-bottom: 15px;
}

.page-content-seminaire p.page-content-description {
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
            <span>{t("seminarSpaces")}</span> {t("seminars")}
          </h1>
          <p>{t("discoverSpaces")}</p>
        </div>

        {!isLoading && seminaires.length > 0 && (
          <div className="slideshow-container">
            <div className="slideshow-wrapper">
              {seminaires.map((seminaire, index) => (
                <div key={seminaire._id} className={`slide ${index === currentSlideIndex ? "active" : ""}`}>
                  <img
                    src={seminaire.image || "/placeholder.svg"}
                    alt={seminaire.nom}
                    onError={(e) => {
                      e.target.src = `/placeholder.svg?height=400&width=800&text=${seminaire.nom}`
                    }}
                  />
                  <div className="slide-overlay">
                    <div className="slide-title">{seminaire.nom}</div>
                    <div className="slide-specs">
                      <span>
                        {seminaire.capacite} {t("people")}
                      </span>
                      <span>•</span>
                      <span>
                        {seminaire.superficie} {t("meters")}²
                      </span>
                      <span>•</span>
                      <span>
                        {seminaire.hauteur} {t("meters")} {t("height")}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <button className="slideshow-controls prev-slide" onClick={prevSlide}>
              <ChevronLeft width="24" height="24" />
            </button>
            <button className="slideshow-controls next-slide" onClick={nextSlide}>
              <ChevronRight width="24" height="24" />
            </button>

            <div className="slideshow-indicators">
              {seminaires.map((_, index) => (
                <div
                  key={index}
                  className={`indicator ${index === currentSlideIndex ? "active" : ""}`}
                  onClick={() => setCurrentSlideIndex(index)}
                />
              ))}

            </div>
          </div>
        )}
        {/* JSX for Seminaire page content */}
{pageContent && (
  <div className="page-content-seminaire">
    {pageContent.image && (
      <img
        src={pageContent.image}
        alt="Seminaire"
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
        <div className="content-container">
          {isLoading ? (
            <div className="loading-container">
              <div className="loading-spinner"></div>
              <p>{t("loadingSeminars")}</p>
            </div>
          ) : seminaires.length > 0 ? (
            <>

              <div className="amenities-section">
                <h3 className="amenities-title">{t("amenities") || "Équipements et Services"}</h3>
                <div className="amenities-grid">
                  <div className="amenity-card">
                    <div className="amenity-icon">
                      <Volume2 width="24" height="24" color="white" />
                    </div>
                    <span className="amenity-text">{t("audiovisualEquipment") || "Équipement audiovisuel"}</span>
                  </div>
                  <div className="amenity-card">
                    <div className="amenity-icon">
                      <Wifi width="24" height="24" color="white" />
                    </div>
                    <span className="amenity-text">{t("highSpeedWifi") || "Wi-Fi haut débit"}</span>
                  </div>
                  <div className="amenity-card">
                    <div className="amenity-icon">
                      <Thermometer width="24" height="24" color="white" />
                    </div>
                    <span className="amenity-text">{t("airConditioning") || "Climatisation"}</span>
                  </div>
                  <div className="amenity-card">
                    <div className="amenity-icon">
                      <Coffee width="24" height="24" color="white" />
                    </div>
                    <span className="amenity-text">{t("cateringService") || "Service de restauration"}</span>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="empty-state">
              <div className="empty-icon">🔍</div>
              <h3>{t("noSeminarSpaces")}</h3>
              <p>{t("comeBackSoonSpaces")}</p>
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
                <Facebook width="24" height="24" />
              </a>
              <a href="https://www.instagram.com/novotel.tunis" aria-label="Instagram">
                <Instagram width="24" height="24" />
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

export default SeminairesClient
