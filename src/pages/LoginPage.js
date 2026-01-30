"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import API from "../services/api"
import "./LoginPage.css"

// Translations
const translations = {
  fr: {
    login: "Connexion",
    subtitle: "Accédez à votre espace d'administration",
    email: "Adresse email",
    emailPlaceholder: "nom@exemple.com",
    password: "Mot de passe",
    rememberMe: "Se souvenir de moi",
    loginButton: "Se connecter",
    loggingIn: "Connexion...",
    needHelp: "Besoin d'aide ?",
    contactSupport: "Contacter le support",
    brandingTitle: "Plateforme d'administration Novotel Tunis Lac",
    brandingDescription: "Gérez vos services, restaurants, réservations et bien plus encore depuis votre tableau de bord centralisé.",
    poweredBy: "Propulsé par",
    errorDefault: "Identifiants incorrects. Veuillez réessayer.",
    showPassword: "Afficher",
    hidePassword: "Masquer"
  },
  en: {
    login: "Login",
    subtitle: "Access your administration dashboard",
    email: "Email address",
    emailPlaceholder: "name@example.com",
    password: "Password",
    rememberMe: "Remember me",
    loginButton: "Sign in",
    loggingIn: "Signing in...",
    needHelp: "Need help?",
    contactSupport: "Contact support",
    brandingTitle: "Novotel Tunis Lac Administration Platform",
    brandingDescription: "Manage your services, restaurants, reservations and more from your centralized dashboard.",
    poweredBy: "Powered by",
    errorDefault: "Invalid credentials. Please try again.",
    showPassword: "Show",
    hidePassword: "Hide"
  },
  ar: {
    login: "تسجيل الدخول",
    subtitle: "الوصول إلى لوحة الإدارة الخاصة بك",
    email: "البريد الإلكتروني",
    emailPlaceholder: "الاسم@مثال.com",
    password: "كلمة المرور",
    rememberMe: "تذكرني",
    loginButton: "تسجيل الدخول",
    loggingIn: "جاري تسجيل الدخول...",
    needHelp: "تحتاج مساعدة؟",
    contactSupport: "اتصل بالدعم",
    brandingTitle: "منصة إدارة نوفوتيل تونس لاك",
    brandingDescription: "إدارة خدماتك ومطاعمك وحجوزاتك والمزيد من لوحة التحكم المركزية الخاصة بك.",
    poweredBy: "مدعوم من",
    errorDefault: "بيانات الاعتماد غير صحيحة. يرجى المحاولة مرة أخرى.",
    showPassword: "إظهار",
    hidePassword: "إخفاء"
  }
}

const languages = [
  { code: "fr", name: "FR", flag: "/images/fr-flag-v2.png" },
  { code: "en", name: "EN", flag: "/images/en-flag-v2.png" },
  { code: "ar", name: "AR", flag: "/images/ar-flag-v2.png" }
]

// SVG Icons
const EyeIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
    <circle cx="12" cy="12" r="3"/>
  </svg>
)

const EyeOffIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
    <line x1="1" y1="1" x2="23" y2="23"/>
  </svg>
)

const AlertCircleIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/>
    <line x1="12" y1="8" x2="12" y2="12"/>
    <line x1="12" y1="16" x2="12.01" y2="16"/>
  </svg>
)

const SunIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="5"/>
    <line x1="12" y1="1" x2="12" y2="3"/>
    <line x1="12" y1="21" x2="12" y2="23"/>
    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
    <line x1="1" y1="12" x2="3" y2="12"/>
    <line x1="21" y1="12" x2="23" y2="12"/>
    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
  </svg>
)

const MoonIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
  </svg>
)

function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [currentLanguage, setCurrentLanguage] = useState("fr")
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem("theme")
    return savedTheme ? savedTheme === "dark" : true
  })
  const navigate = useNavigate()

  // Translation function
  const t = (key) => translations[currentLanguage]?.[key] || translations.fr[key] || key

  // Load saved language and remembered email on mount
  useEffect(() => {
    const savedLanguage = localStorage.getItem("novotel-language")
    if (savedLanguage && translations[savedLanguage]) {
      setCurrentLanguage(savedLanguage)
    }

    const rememberedEmail = localStorage.getItem("rememberedEmail")
    if (rememberedEmail) {
      setEmail(rememberedEmail)
      setRememberMe(true)
    }
  }, [])

  // Update document direction for RTL languages
  useEffect(() => {
    document.documentElement.dir = currentLanguage === "ar" ? "rtl" : "ltr"
    document.documentElement.lang = currentLanguage
  }, [currentLanguage])

  // Save theme preference
  useEffect(() => {
    localStorage.setItem("theme", isDarkMode ? "dark" : "light")
  }, [isDarkMode])

  const changeLanguage = (langCode) => {
    setCurrentLanguage(langCode)
    localStorage.setItem("novotel-language", langCode)
  }

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode)
  }

  const handleLogin = async (e) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      const response = await API.post("/auth/login", { email, password })
      
      localStorage.setItem("token", response.data.token)
      localStorage.setItem("user", JSON.stringify(response.data.user))
      
      if (rememberMe) {
        localStorage.setItem("rememberedEmail", email)
      } else {
        localStorage.removeItem("rememberedEmail")
      }
      
      navigate("/dashboard")
      
    } catch (err) {
      setError(err.response?.data?.message || t("errorDefault"))
      setIsLoading(false)
    }
  }

  const themeClass = isDarkMode ? "dark" : "light"
  const rtlClass = currentLanguage === "ar" ? "rtl" : ""

  return (
    <div className={`login-page ${themeClass} ${rtlClass}`}>
      {/* Left Panel - Branding (Desktop only) */}
      <div className="login-branding-panel">
        <div className="login-branding-content">
          <div>
            <img 
              src="/GUESTLY_LIGHT.jpg" 
              alt="Guestly" 
              className="login-branding-logo" 
            />
          </div>
          
          <div className="login-branding-text">
            <h1 className="login-branding-title">
              {t("brandingTitle")}
            </h1>
            <p className="login-branding-description">
              {t("brandingDescription")}
            </p>
          </div>
          
          <div className="login-branding-footer">
            <span>{t("poweredBy")}</span>
            <a href="https://www.itbafa.com" target="_blank" rel="noopener noreferrer">
              <img src="/images/itbafa_logo_white.png" alt="ITBAFA" />
            </a>
          </div>
        </div>
      </div>

      {/* Right Panel - Login Form */}
      <div className="login-form-panel">
        <div className="login-container">
          {/* Top Bar: Language Selector & Theme Toggle */}
          <div className="login-top-bar">
            <div className="login-language-selector">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  className={`login-lang-btn ${currentLanguage === lang.code ? "active" : ""}`}
                  onClick={() => changeLanguage(lang.code)}
                  title={lang.name}
                >
                  <img src={lang.flag} alt={lang.name} className="login-lang-flag" />
                  <span>{lang.name}</span>
                </button>
              ))}
            </div>
            
            <button 
              className="login-theme-toggle"
              onClick={toggleTheme}
              aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
            >
              {isDarkMode ? <SunIcon /> : <MoonIcon />}
            </button>
          </div>

          {/* Mobile Logo */}
          <div className="login-mobile-logo">
            <img src={isDarkMode ? "/GUESTLY_LIGHT.jpg" : "/GUESTLY_DARK.jpg"} alt="Guestly" />
          </div>

          {/* Header */}
          <div className="login-header">
            <h2 className="login-title">{t("login")}</h2>
            <p className="login-subtitle">{t("subtitle")}</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="login-error">
              <span className="login-error-icon"><AlertCircleIcon /></span>
              <span>{error}</span>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleLogin} className="login-form">
            {/* Email */}
            <div className="login-input-group">
              <label htmlFor="email" className="login-input-label">
                {t("email")}
              </label>
              <div className="login-input-wrapper">
                <input
                  id="email"
                  type="email"
                  className={`login-input ${error ? "has-error" : ""}`}
                  placeholder={t("emailPlaceholder")}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Password */}
            <div className="login-input-group">
              <label htmlFor="password" className="login-input-label">
                {t("password")}
              </label>
              <div className="login-input-wrapper">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  className={`login-input ${error ? "has-error" : ""}`}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                  disabled={isLoading}
                  style={{ paddingRight: "44px" }}
                />
                <button
                  type="button"
                  className="login-password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                  tabIndex={-1}
                  aria-label={showPassword ? t("hidePassword") : t("showPassword")}
                >
                  {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                </button>
              </div>
            </div>

            {/* Options */}
            <div className="login-options">
              <div className="login-remember">
                <input
                  type="checkbox"
                  id="rememberMe"
                  className="login-checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  disabled={isLoading}
                />
                <label htmlFor="rememberMe" className="login-remember-label">
                  {t("rememberMe")}
                </label>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="login-button"
              disabled={isLoading}
            >
              <span className="login-button-content">
                {isLoading ? (
                  <>
                    <span className="login-button-spinner"></span>
                    <span>{t("loggingIn")}</span>
                  </>
                ) : (
                  <span>{t("loginButton")}</span>
                )}
              </span>
            </button>
          </form>

          {/* Footer */}
          <div className="login-footer">
            <p className="login-footer-text">
              {t("needHelp")}{" "}
              <a href="mailto:support@novotel-tunis.com" className="login-footer-link">
                {t("contactSupport")}
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoginPage
