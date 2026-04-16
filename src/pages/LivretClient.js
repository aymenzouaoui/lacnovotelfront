"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { ChevronLeft, ChevronRight } from "lucide-react"
import ThemeToggle from "../components/ThemeToggle"
import "./LivretClient.css"

const LivretClient = () => {
  const navigate = useNavigate()
  const [currentLanguage, setCurrentLanguage] = useState("fr")
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false)

  const languages = [
    { code: "fr", name: "Français", flag: "/images/fr-flag-v2.png" },
    { code: "en", name: "English", flag: "/images/en-flag-v2.png" },
    { code: "ar", name: "العربية", flag: "/images/ar-flag-v2.png" },
  ]

  const translations = {
    fr: {
      back: "Retour",
      title: "À propos de l'hôtel",
      subtitle: "Novotel Tunis Lac — Votre séjour au bord du lac.",
      intro:
        "Le Novotel Tunis Lac vous accueille dans un cadre moderne et convivial, idéalement situé aux Berges du Lac. Découvrez un hôtel où confort, gastronomie et espaces de travail se conjuguent pour un séjour réussi.",
      ourHotelTitle: "Notre hôtel",
      ourHotelText:
        "Le Novotel Tunis Lac fait partie du groupe Accor et propose des chambres confortables, un restaurant, un bar, une terrasse piscine, des salles de séminaire et un espace bien-être. Que vous voyagiez pour le travail ou les loisirs, notre équipe est à votre disposition pour rendre votre séjour agréable.",
      locationTitle: "Situation",
      locationText:
        "L'hôtel est situé à la Cité Les Pins, aux Berges du Lac 2, à quelques minutes du centre d'affaires et de l'aéroport de Tunis-Carthage. Un emplacement pratique pour les déplacements professionnels et les visites de la capitale.",
      servicesTitle: "Équipements & services",
      servicesIntro: "Pour votre confort et votre productivité :",
      service1: "Chambres climatisées avec Wi-Fi",
      service2: "Restaurant et bar",
      service3: "Terrasse piscine et Sky Lounge",
      service4: "Salles de réunion et séminaires",
      service5: "In Balance by Novotel (fitness / bien-être)",
      service6: "Restauration en chambre",
      service7: "Parking et accès facile",
      contact: "Contact",
      address: "Adresse",
      reservations: "Réservations",
      wifi: "Wi-Fi",
      network: "Réseau",
      password: "Mot de passe",
      availableAtReception: "Disponible à la réception",
      followUs: "Suivez-nous",
      allRightsReserved: "Tous droits réservés",
      createdBy: "Créé par",
      addressLine1: "Rue de la Feuille d'Érable - Cité Les Pins - Les Berges du Lac 2",
      addressLine2: "1053 Tunis, TN",
    },
    en: {
      back: "Back",
      title: "About the hotel",
      subtitle: "Novotel Tunis Lac — Your stay by the lake.",
      intro:
        "Novotel Tunis Lac welcomes you in a modern and friendly setting, ideally located at Les Berges du Lac. Discover a hotel where comfort, dining and workspaces combine for a successful stay.",
      ourHotelTitle: "Our hotel",
      ourHotelText:
        "Novotel Tunis Lac is part of the Accor group and offers comfortable rooms, a restaurant, bar, pool terrace, meeting rooms and a wellness area. Whether you are travelling for business or leisure, our team is at your service to make your stay enjoyable.",
      locationTitle: "Location",
      locationText:
        "The hotel is located in Cité Les Pins, Les Berges du Lac 2, a few minutes from the business district and Tunis-Carthage airport. A convenient location for business trips and visits to the capital.",
      servicesTitle: "Facilities & services",
      servicesIntro: "For your comfort and productivity:",
      service1: "Air-conditioned rooms with Wi-Fi",
      service2: "Restaurant and bar",
      service3: "Pool terrace and Sky Lounge",
      service4: "Meeting and seminar rooms",
      service5: "In Balance by Novotel (fitness / wellness)",
      service6: "Room service",
      service7: "Parking and easy access",
      contact: "Contact",
      address: "Address",
      reservations: "Reservations",
      wifi: "Wi-Fi",
      network: "Network",
      password: "Password",
      availableAtReception: "Available at reception",
      followUs: "Follow us",
      allRightsReserved: "All rights reserved",
      createdBy: "Created by",
      addressLine1: "Rue de la Feuille d'Érable - Cité Les Pins - Les Berges du Lac 2",
      addressLine2: "1053 Tunis, TN",
    },
    ar: {
      back: "رجوع",
      title: "نبذة عن الفندق",
      subtitle: "نوفوتيل تونس لاك — إقامتك على ضفاف البحيرة.",
      intro:
        "يرحب بك نوفوتيل تونس لاك في إطار حديث وودود، يقع في موقع مثالي بضفاف البحيرة. اكتشف فندقاً يجمع بين الراحة والمأكولات ومساحات العمل لإقامة ناجحة.",
      ourHotelTitle: "فندقنا",
      ourHotelText:
        "ينتمي نوفوتيل تونس لاك إلى مجموعة أيكور ويوفر غرفاً مريحة ومطعماً وباراً وتراس مسبح وقاعات ندوات ومساحة للعافية. سواء كنت مسافراً للعمل أو للترفيه، فريقنا في خدمتك لجعل إقامتك ممتعة.",
      locationTitle: "الموقع",
      locationText:
        "يقع الفندق في سيتي الصنوبر، ضفاف البحيرة 2، على بعد دقائق من الحي التجاري ومطار تونس قرطاج. موقع عملي للرحلات العملية وزيارات العاصمة.",
      servicesTitle: "المرافق والخدمات",
      servicesIntro: "لراحتك وإنتاجيتك:",
      service1: "غرف مكيفة مع واي فاي",
      service2: "مطعم وبار",
      service3: "تراس مسبح وسكاي لاونج",
      service4: "قاعات اجتماعات وندوات",
      service5: "إن بالانس باي نوفوتيل (لياقة وعافية)",
      service6: "خدمة الغرف",
      service7: "موقف سيارات ووصول سهل",
      contact: "اتصال",
      address: "العنوان",
      reservations: "الحجوزات",
      wifi: "واي فاي",
      network: "الشبكة",
      password: "كلمة المرور",
      availableAtReception: "متوفرة في الاستقبال",
      followUs: "تابعونا",
      allRightsReserved: "جميع الحقوق محفوظة",
      createdBy: "تم إنشاؤه بواسطة",
      addressLine1: "شارع ورقة القيقب - مدينة الصنوبر - ضفاف البحيرة 2",
      addressLine2: "1053 تونس، تونس",
    },
  }

  const t = (key) => translations[currentLanguage][key] || key

  useEffect(() => {
    const savedLanguage = localStorage.getItem("novotel-language")
    if (savedLanguage && translations[savedLanguage]) {
      setCurrentLanguage(savedLanguage)
      document.documentElement.dir = savedLanguage === "ar" ? "rtl" : "ltr"
      document.documentElement.lang = savedLanguage
    }
  }, [])

  const changeLanguage = (langCode) => {
    setCurrentLanguage(langCode)
    localStorage.setItem("novotel-language", langCode)
    setShowLanguageDropdown(false)
    document.documentElement.dir = langCode === "ar" ? "rtl" : "ltr"
    document.documentElement.lang = langCode
  }

  const getCurrentLanguage = () => languages.find((lang) => lang.code === currentLanguage)

  return (
    <div className={`livret-app ${currentLanguage === "ar" ? "rtl" : "ltr"}`}>
      <header className="app-header">
        <button
          type="button"
          className="header-back-link"
          onClick={() => navigate("/home")}
        >
          {currentLanguage === "ar" ? (
            <ChevronRight size={20} strokeWidth={2} aria-hidden />
          ) : (
            <ChevronLeft size={20} strokeWidth={2} aria-hidden />
          )}
          <span>{t("back")}</span>
        </button>
        <div className="logo-container">
          <img src="/images/logo2.png" alt="Novotel Logo" className="logo" />
        </div>
        <div className="header-right-actions">
          <div className="language-selector">
            <button type="button" className="language-toggle" onClick={() => setShowLanguageDropdown(!showLanguageDropdown)}>
              <img src={getCurrentLanguage()?.flag || "/placeholder.svg"} alt={getCurrentLanguage()?.name} className="language-flag" />
              <span>{getCurrentLanguage()?.code.toUpperCase()}</span>
            </button>
            {showLanguageDropdown && (
              <div className="language-dropdown">
                {languages.map((lang) => (
                  <div key={lang.code} role="button" tabIndex={0}
                    className={`language-option ${currentLanguage === lang.code ? "active" : ""}`}
                    onClick={(e) => { e.stopPropagation(); changeLanguage(lang.code) }}
                    onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); changeLanguage(lang.code) } }}>
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

      <main className="livret-content">
        <div className="livret-hero">
          <img
            src="/images/apropos.jpg"
            alt={t("title")}
            onError={(e) => {
              e.target.onerror = null
              e.target.src = "/placeholder.svg?height=300&width=800&text=Novotel+Tunis+Lac"
            }}
          />
        </div>

        <h1 className="page-title">{t("title")}</h1>
        <p className="page-subtitle">{t("subtitle")}</p>
        <p className="intro-text">{t("intro")}</p>

        <section className="livret-section">
          <h2 className="section-title">{t("ourHotelTitle")}</h2>
          <p className="section-text">{t("ourHotelText")}</p>
        </section>

        <section className="livret-section">
          <h2 className="section-title">{t("locationTitle")}</h2>
          <p className="section-text">{t("locationText")}</p>
        </section>

        <section className="livret-section">
          <h2 className="section-title">{t("servicesTitle")}</h2>
          <p className="section-text">{t("servicesIntro")}</p>
          <ul className="section-list">
            <li>{t("service1")}</li>
            <li>{t("service2")}</li>
            <li>{t("service3")}</li>
            <li>{t("service4")}</li>
            <li>{t("service5")}</li>
            <li>{t("service6")}</li>
            <li>{t("service7")}</li>
          </ul>
        </section>
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
              <a
                href="https://www.facebook.com/Novoteltunislac/"
                aria-label="Facebook"
                target="_blank"
                rel="noopener noreferrer"
              >
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
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                </svg>
              </a>
              <a
                href="https://tn.linkedin.com/company/novotel-tunis-lac"
                aria-label="LinkedIn"
                target="_blank"
                rel="noopener noreferrer"
              >
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
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                  <rect x="2" y="9" width="4" height="12" />
                  <circle cx="4" cy="4" r="2" />
                </svg>
              </a>
              <a
                href="https://www.instagram.com/novotel_tunis_lac/"
                aria-label="Instagram"
                target="_blank"
                rel="noopener noreferrer"
              >
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
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
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

export default LivretClient
