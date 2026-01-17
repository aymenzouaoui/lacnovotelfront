"use client"

import { useState } from "react"
import API from "../services/api"
import "./Questionnaire.css"

// Translation system
const translations = {
  fr: {
    // Header
    back: "Retour",

    // Welcome banner
    skipCleanTitle: "Demande de Skip Clean",
    skipCleanSubtitle: "Planifiez votre demande de skip the clean",
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
    // Form fields
    selectDate: "Sélectionner la date",
    room: "Numéro de chambre",
    name: "Nom",
    email: "Email",

    // Buttons
    submit: "Soumettre",
    submitting: "Envoi en cours...",

    // Messages
    successMessage: "Demande de Skip Clean soumise avec succès !",
    errorMessage: "Erreur lors de la soumission. Veuillez réessayer.",
  },
  en: {
    // Header
    back: "Back",
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
    // Welcome banner
    skipCleanTitle: "Skip Clean Request",
    skipCleanSubtitle: "Schedule your cleaning request",

    // Form fields
    selectDate: "Select Date",
    room: "Room Number",
    name: "Name",
    email: "Email",

    // Buttons
    submit: "Submit",
    submitting: "Submitting...",

    // Messages
    successMessage: "Skip Clean request submitted successfully!",
    errorMessage: "Error submitting. Please try again.",
  },
  ar: {
    // Header
    back: "رجوع",

    // Welcome banner
    skipCleanTitle: "طلب تخطي التنظيف",
    skipCleanSubtitle: "جدولة طلب التنظيف الخاص بك",

    // Form fields
    selectDate: "اختر التاريخ",
    room: "رقم الغرفة",
    name: "الاسم",
    email: "البريد الإلكتروني",

    // Buttons
    submit: "إرسال",
    submitting: "جاري الإرسال...",
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
    // Messages
    successMessage: "تم إرسال طلب تخطي التنظيف بنجاح!",
    errorMessage: "خطأ في الإرسال. يرجى المحاولة مرة أخرى.",
  },
}

const languages = [
  { code: "fr", name: "Français", flag: "/images/fr-flag-v2.png" },
  { code: "en", name: "English", flag: "/images/en-flag-v2.png" },
  { code: "ar", name: "العربية", flag: "/images/ar-flag-v2.png" },
]

const SkipCleanClient = () => {
  const [currentLanguage, setCurrentLanguage] = useState("fr")
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [alert, setAlert] = useState(null)

  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState(null)

  // Form state
  const [formData, setFormData] = useState({
    date: "",
    room: "",
    name: "",
    email: "",
  })

  // Get translation function
  const t = (key) => translations[currentLanguage][key] || translations.fr[key] || key

  // Language change handler
  const changeLanguage = (langCode) => {
    setCurrentLanguage(langCode)
    localStorage.setItem("novotel-language", langCode)
    setShowLanguageDropdown(false)
    document.documentElement.dir = langCode === "ar" ? "rtl" : "ltr"
    document.documentElement.lang = langCode
  }

  const getCurrentLanguage = () => languages.find((lang) => lang.code === currentLanguage)

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  // Show alert with auto-dismiss
  const showAlert = (type, message) => {
    setAlert({ type, message })
    setTimeout(() => setAlert(null), 5000)
  }

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      await API.post("/skipcleans", formData)
      showAlert("success", t("successMessage"))

      // Reset form
      setFormData({
        date: "",
        room: "",
        name: "",
        email: "",
      })
    } catch (error) {
      console.error("Error submitting skip clean request:", error)
      showAlert("error", t("errorMessage"))
    } finally {
      setIsSubmitting(false)
    }
  }

  const getDaysInMonth = (date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDayOfWeek = firstDay.getDay()

    return { daysInMonth, startingDayOfWeek }
  }

  const formatDate = (date) => {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, "0")
    const day = String(date.getDate()).padStart(2, "0")
    return `${year}-${month}-${day}`
  }

  const handleDateSelect = (day) => {
    const selected = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day)
    setSelectedDate(selected)
    setFormData((prev) => ({ ...prev, date: formatDate(selected) }))
  }

  const changeMonth = (direction) => {
    setCurrentMonth((prev) => {
      const newDate = new Date(prev)
      newDate.setMonth(prev.getMonth() + direction)
      return newDate
    })
  }

  const isToday = (day) => {
    const today = new Date()
    return (
      today.getDate() === day &&
      today.getMonth() === currentMonth.getMonth() &&
      today.getFullYear() === currentMonth.getFullYear()
    )
  }

  const isSelected = (day) => {
    if (!selectedDate) return false
    return (
      selectedDate.getDate() === day &&
      selectedDate.getMonth() === currentMonth.getMonth() &&
      selectedDate.getFullYear() === currentMonth.getFullYear()
    )
  }

  const monthNames = {
    fr: [
      "Janvier",
      "Février",
      "Mars",
      "Avril",
      "Mai",
      "Juin",
      "Juillet",
      "Août",
      "Septembre",
      "Octobre",
      "Novembre",
      "Décembre",
    ],
    en: [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ],
    ar: ["يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو", "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر"],
  }

  const dayNames = {
    fr: ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"],
    en: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
    ar: ["الأحد", "الإثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة", "السبت"],
  }

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
        .rtl .language-selector {
          left: auto;
          right: 15px;
        }

        .rtl .language-dropdown {
          left: auto;
          right: 0;
        }

        /* Skip Clean Image Styles */
        .skipclean-image-container {
          display: flex;
          justify-content: center;
          margin-bottom: 30px;
        }

        .skipclean-image {
          max-width: 100%;
          height: auto;
          max-height: 300px;
          object-fit: contain;
          border-radius: 15px;
        }

        /* Date Picker Styles */
        .date-picker-container {
          margin-bottom: 30px;
        }

        .date-picker-container label {
          display: block;
          font-size: 1.1rem;
          font-weight: 600;
          color: #333;
          margin-bottom: 12px;
          text-align: center;
        }

        .date-picker-container input[type="date"] {
          width: 100%;
          padding: 15px;
          border: 2px solid #e0e0e0;
          border-radius: 10px;
          font-size: 1.1rem;
          transition: all 0.3s ease;
          font-family: inherit;
          background: white;
          color: #333;
          cursor: pointer;
        }

        .date-picker-container input[type="date"]:focus {
          outline: none;
          border-color: #667eea;
          box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
        }

        /* Custom Calendar Styles */
        .custom-calendar {
          background: white;
          border-radius: 15px;
          padding: 20px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
          margin-bottom: 30px;
        }

        .calendar-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }

        .calendar-header h3 {
          font-size: 1.2rem;
          font-weight: 600;
          color: #333;
          margin: 0;
        }

        .calendar-nav {
          display: flex;
          gap: 10px;
        }

        .calendar-nav-btn {
          background: #667eea;
          color: white;
          border: none;
          border-radius: 8px;
          width: 35px;
          height: 35px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.3s ease;
          font-size: 1.2rem;
        }

        .calendar-nav-btn:hover {
          background: #5568d3;
          transform: scale(1.05);
        }

        .calendar-grid {
          display: grid;
          grid-template-columns: repeat(7, 1fr);
          gap: 8px;
        }

        .calendar-day-name {
          text-align: center;
          font-size: 0.85rem;
          font-weight: 600;
          color: #666;
          padding: 8px 0;
        }

        .calendar-day {
          aspect-ratio: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s ease;
          font-size: 0.95rem;
          font-weight: 500;
          color: #333;
          background: #f5f5f5;
        }

        .calendar-day:hover {
          background: #e8ebf9;
          transform: scale(1.05);
        }

        .calendar-day.empty {
          background: transparent;
          cursor: default;
        }

        .calendar-day.empty:hover {
          transform: none;
        }

        .calendar-day.today {
          background: #ffd700;
          color: #333;
          font-weight: 700;
        }

        .calendar-day.selected {
          background: #667eea;
          color: white;
          font-weight: 700;
        }

        .calendar-day.selected:hover {
          background: #5568d3;
        }

        @media (max-width: 768px) {
          .skipclean-image {
            max-height: 200px;
          }

          .custom-calendar {
            padding: 15px;
          }

          .calendar-day {
            font-size: 0.85rem;
          }

          .calendar-day-name {
            font-size: 0.75rem;
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
                onClick={() => changeLanguage(lang.code)}
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
        <div className="welcome-banner">
          <h1>
            <span>{t("skipCleanTitle")}</span>
          </h1>
          <p>{t("skipCleanSubtitle")}</p>
        </div>

        <div className="content-container">
          {alert && (
            <div className={`alert ${alert.type === "success" ? "alert-success" : "alert-error"}`}>
              {alert.type === "success" ? "✓" : "✗"} {alert.message}
            </div>
          )}

          {/* Skip Clean Image */}
          <div className="skipclean-image-container">
            <img src="/images/skipclean.png" alt="Skip Clean" className="skipclean-image" />
          </div>

          <form onSubmit={handleSubmit}>
            <div className="custom-calendar">
              <div className="calendar-header">
                <h3>
                  {monthNames[currentLanguage][currentMonth.getMonth()]} {currentMonth.getFullYear()}
                </h3>
                <div className="calendar-nav">
                  <button type="button" className="calendar-nav-btn" onClick={() => changeMonth(-1)}>
                    {currentLanguage === "ar" ? "›" : "‹"}
                  </button>
                  <button type="button" className="calendar-nav-btn" onClick={() => changeMonth(1)}>
                    {currentLanguage === "ar" ? "‹" : "›"}
                  </button>
                </div>
              </div>

              <div className="calendar-grid">
                {dayNames[currentLanguage].map((day, index) => (
                  <div key={index} className="calendar-day-name">
                    {day}
                  </div>
                ))}

                {(() => {
                  const { daysInMonth, startingDayOfWeek } = getDaysInMonth(currentMonth)
                  const days = []

                  // Empty cells before first day
                  for (let i = 0; i < startingDayOfWeek; i++) {
                    days.push(<div key={`empty-${i}`} className="calendar-day empty"></div>)
                  }

                  // Days of the month
                  for (let day = 1; day <= daysInMonth; day++) {
                    days.push(
                      <div
                        key={day}
                        className={`calendar-day ${isToday(day) ? "today" : ""} ${isSelected(day) ? "selected" : ""}`}
                        onClick={() => handleDateSelect(day)}
                      >
                        {day}
                      </div>,
                    )
                  }

                  return days
                })()}
              </div>
            </div>

            {/* Room Input */}
            <div className="form-group">
              <label>{t("room")}</label>
              <input type="text" name="room" value={formData.room} onChange={handleInputChange} />
            </div>

            {/* Name Input */}
            <div className="form-group">
              <label>{t("name")}</label>
              <input type="text" name="name" value={formData.name} onChange={handleInputChange} />
            </div>

            {/* Email Input */}
            <div className="form-group">
              <label>{t("email")}</label>
              <input type="email" name="email" value={formData.email} onChange={handleInputChange} />
            </div>

            <button type="submit" className="submit-btn" disabled={isSubmitting}>
              {isSubmitting ? t("submitting") : t("submit")}
            </button>
          </form>
        </div>
      </main>

      <footer className="app-footer">
        <div className="footer-content">
          <div className="footer-section">
            <h4>{t("contact") || "Contact"}</h4>
            <p>+216 71 142 900</p>
            <p>H6145@accor.com</p>
          </div>
          <div className="footer-section">
            <h4>{t("address") || "Adresse"}</h4>
            <p>{t("addressLine1") || "Avenue Mohamed V"}</p>
            <p>{t("addressLine2") || "Tunis, Tunisie"}</p>
          </div>
          <div className="footer-section">
            <h4>{t("reservations") || "Réservations"}</h4>
            <p>+216 71 142 900</p>
            <p>H6145@accor.com</p>
          </div>
          <div className="footer-section">
            <h4>{t("wifi") || "Wi-Fi"}</h4>
            <p>
              {t("password") || "Mot de passe"}: {t("availableAtReception") || "Disponible à la réception"}
            </p>
          </div>
          <div className="footer-section">
            <h4>{t("followUs") || "Suivez-nous"}</h4>
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
            © {new Date().getFullYear()} Novotel Tunis. {t("allRightsReserved") || "Tous droits réservés"}.
            <br />
            {t("createdBy") || "Créé par"}{" "}
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

export default SkipCleanClient; 