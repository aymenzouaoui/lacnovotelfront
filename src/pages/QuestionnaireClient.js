"use client"

import { useState, useEffect } from "react"
import API from "../services/api"
import "./QuestionnaireClient.css"

// Translation system
const translations = {
  fr: {
    // Header
    back: "Retour",
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
    // Welcome banner
    questionnaireTitle: "Questionnaire Client",
    questionnaireSubtitle: "Aidez-nous à améliorer votre expérience",
    // Form sections
    clientIdentity: "Identité Client",
    questions: "Questions",
    // Form fields
    numeroChambre: "Numéro de Chambre",
    nomFamille: "Nom de Famille",
    numeroTelephone: "Numéro de Téléphone",
    demandeSpeciale: "Demande Spéciale",
    // Options
    yes: "Oui",
    no: "Non",
    // Buttons
    submit: "Soumettre",
    submitting: "Envoi en cours...",
    // Messages
    successMessage: "Questionnaire soumis avec succès !",
    errorMessage: "Erreur lors de la soumission. Veuillez réessayer.",
    loadingQuestionnaire: "Chargement du questionnaire...",
    noQuestionnaire: "Aucun questionnaire disponible pour le moment.",
  },
  en: {
    // Header
    back: "Back",
    // Welcome banner
    questionnaireTitle: "Client Questionnaire",
    questionnaireSubtitle: "Help us improve your experience",
    // Form sections
    clientIdentity: "Client Identity",
    questions: "Questions",
    // Form fields
    numeroChambre: "Room Number",
    nomFamille: "Family Name",
    numeroTelephone: "Phone Number",
    demandeSpeciale: "Special Request",
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
    // Options
    yes: "Yes",
    no: "No",
    // Buttons
    submit: "Submit",
    submitting: "Submitting...",
    // Messages
    successMessage: "Questionnaire submitted successfully!",
    errorMessage: "Error submitting. Please try again.",
    loadingQuestionnaire: "Loading questionnaire...",
    noQuestionnaire: "No questionnaire available at the moment.",
  },
  ar: {
    // Header
    back: "رجوع",
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
    // Welcome banner
    questionnaireTitle: "استبيان العميل",
    questionnaireSubtitle: "ساعدنا في تحسين تجربتك",
    // Form sections
    clientIdentity: "هوية العميل",
    questions: "أسئلة",
    // Form fields
    numeroChambre: "رقم الغرفة",
    nomFamille: "اسم العائلة",
    numeroTelephone: "رقم الهاتف",
    demandeSpeciale: "طلب خاص",
    // Options
    yes: "نعم",
    no: "لا",
    // Buttons
    submit: "إرسال",
    submitting: "جاري الإرسال...",
    // Messages
    successMessage: "تم إرسال الاستبيان بنجاح!",
    errorMessage: "خطأ في الإرسال. يرجى المحاولة مرة أخرى.",
    loadingQuestionnaire: "جاري تحميل الاستبيان...",
    noQuestionnaire: "لا يوجد استبيان متاح في الوقت الحالي.",
  },
}

const languages = [
  { code: "fr", name: "Français", flag: "/images/fr-flag-v2.png" },
  { code: "en", name: "English", flag: "/images/en-flag-v2.png" },
  { code: "ar", name: "العربية", flag: "/images/ar-flag-v2.png" },
]

const QuestionnaireClient = () => {
  const [currentLanguage, setCurrentLanguage] = useState("fr")
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [alert, setAlert] = useState(null)

  const [questionnaire, setQuestionnaire] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  const [formData, setFormData] = useState({
    responses: {}, // Dynamic responses keyed by questionId
  })

  // Get translation function
  const t = (key) => translations[currentLanguage][key] || translations.fr[key] || key

  const showAlert = (type, message) => {
    setAlert({ type, message })
    setTimeout(() => setAlert(null), 5000)
  }

  useEffect(() => {
    fetchQuestionnaire()
  }, [])

  const fetchQuestionnaire = async () => {
    try {
      setIsLoading(true)
      const res = await API.get("/questionnaires")
      setQuestionnaire(res.data)

      // Initialize responses object with empty values
      const initialResponses = {}
      if (res.data?.questions) {
        res.data.questions.forEach((q) => {
          initialResponses[q.questionId] = q.responseType === "boolean" ? null : q.responseType === "rating" ? 0 : ""
        })
      }
      setFormData({ responses: initialResponses })
    } catch (error) {
      console.error("Error fetching questionnaire:", error)
      showAlert("error", t("errorMessage"))
    } finally {
      setIsLoading(false)
    }
  }

  // Language change handler
  const changeLanguage = (langCode) => {
    setCurrentLanguage(langCode)
    localStorage.setItem("novotel-language", langCode)
    setShowLanguageDropdown(false)
    document.documentElement.dir = langCode === "ar" ? "rtl" : "ltr"
    document.documentElement.lang = langCode
  }

  const getCurrentLanguage = () => languages.find((lang) => lang.code === currentLanguage)

  const handleQuestionChange = (questionId, value) => {
    setFormData((prev) => ({
      ...prev,
      responses: {
        ...prev.responses,
        [questionId]: value,
      },
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const responsesArray = Object.entries(formData.responses).map(([questionId, response]) => ({
        questionId,
        response,
      }))

      const payload = {
        questionnaireId: questionnaire._id,
        responses: responsesArray,
      }

      await API.post("/questionnaire-responses", payload)
      showAlert("success", t("successMessage"))

      // Reset form
      const initialResponses = {}
      if (questionnaire?.questions) {
        questionnaire.questions.forEach((q) => {
          initialResponses[q.questionId] = q.responseType === "boolean" ? null : q.responseType === "rating" ? 0 : ""
        })
      }
      setFormData({ responses: initialResponses })
    } catch (error) {
      console.error("Error submitting questionnaire:", error)
      showAlert("error", t("errorMessage"))
    } finally {
      setIsSubmitting(false)
    }
  }

  const renderQuestion = (question) => {
    const value = formData.responses[question.questionId]

    switch (question.responseType) {
      case "text":
        return (
          <div key={question.questionId} className="form-group">
            <label>
              {question.questionText}
              {question.required && <span style={{ color: "red" }}> *</span>}
            </label>
    <input
  type="text"
  className="custom-input"
  value={value || ""}
  onChange={(e) => handleQuestionChange(question.questionId, e.target.value)}
  required={question.required}
/>
          </div>
        )

      case "textarea":
        return (
          <div key={question.questionId} className="form-group">
            <label>
              {question.questionText}
              {question.required && <span style={{ color: "red" }}> *</span>}
            </label>
            <textarea
              value={value || ""}
              onChange={(e) => handleQuestionChange(question.questionId, e.target.value)}
              required={question.required}
            />
          </div>
        )

      case "boolean":
        return (
          <div key={question.questionId} className="boolean-question">
            <label>
              {question.questionText}
              {question.required && <span style={{ color: "red" }}> *</span>}
            </label>
            <div className="boolean-buttons">
              <button
                type="button"
                className={`boolean-btn ${value === true ? "active" : ""}`}
                onClick={() => handleQuestionChange(question.questionId, true)}
              >
                {t("yes")}
              </button>
              <button
                type="button"
                className={`boolean-btn ${value === false ? "active" : ""}`}
                onClick={() => handleQuestionChange(question.questionId, false)}
              >
                {t("no")}
              </button>
            </div>
          </div>
        )

      case "multiple_choice":
        return (
          <div key={question.questionId} className="form-group">
            <label>
              {question.questionText}
              {question.required && <span style={{ color: "red" }}> *</span>}
            </label>
            <select
              value={value || ""}
              onChange={(e) => handleQuestionChange(question.questionId, e.target.value)}
              required={question.required}
            >
              <option value="">--</option>
              {question.options?.map((option, idx) => (
                <option key={idx} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
        )

      case "number":
        return (
          <div key={question.questionId} className="form-group">
            <label>
              {question.questionText}
              {question.required && <span style={{ color: "red" }}> *</span>}
            </label>
<input
  type="number"
  className="custom-input"
  value={value || ""}
  onChange={(e) => handleQuestionChange(question.questionId, e.target.value)}
  required={question.required}
/>
          </div>
        )

      case "rating":
        return (
          <div key={question.questionId} className="form-group">
            <label>
              {question.questionText}
              {question.required && <span style={{ color: "red" }}> *</span>}
            </label>
            <div className="rating-stars">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  className={`star-btn ${value >= star ? "active" : ""}`}
                  onClick={() => handleQuestionChange(question.questionId, star)}
                >
                  ★
                </button>
              ))}
            </div>
          </div>
        )

      default:
        return null
    }
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
        
        /* Loading state */
        .loading-container {
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 400px;
          font-size: 18px;
          color: #666;
        }
        
        /* Rating stars styles */
        .rating-stars {
          display: flex;
          gap: 8px;
          margin-top: 8px;
        }
        
        .star-btn {
          background: none;
          border: none;
          font-size: 32px;
          color: #ddd;
          cursor: pointer;
          transition: all 0.2s ease;
          padding: 0;
        }
        
        .star-btn:hover {
          transform: scale(1.1);
        }
        
        .star-btn.active {
          color: #ffc107;
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
            <span>{questionnaire?.title || t("questionnaireTitle")}</span>
          </h1>
          <p>{questionnaire?.description || t("questionnaireSubtitle")}</p>
        </div>

        <div className="content-container">
          {alert && (
            <div className={`alert ${alert.type === "success" ? "alert-success" : "alert-error"}`}>
              {alert.type === "success" ? "✓" : "✗"} {alert.message}
            </div>
          )}

          {isLoading ? (
            <div className="loading-container">{t("loadingQuestionnaire")}</div>
          ) : !questionnaire ? (
            <div className="loading-container">{t("noQuestionnaire")}</div>
          ) : (
            <form onSubmit={handleSubmit}>
              {questionnaire.questions && questionnaire.questions.length > 0 && (
                <div className="form-section">
                  <h3>{t("questions")}</h3>
                  {questionnaire.questions.map((question) => renderQuestion(question))}
                </div>
              )}

              <button type="submit" className="submit-btn" disabled={isSubmitting}>
                {isSubmitting ? t("submitting") : t("submit")}
              </button>
            </form>
          )}
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

export default QuestionnaireClient
