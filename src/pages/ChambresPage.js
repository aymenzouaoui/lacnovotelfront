"use client"

import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import API from "../services/api"
import "./ChambresPage.css"
import CompressedFileInput from "../components/CompressedFileInput"

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

const ChambresPage = () => {
  const navigate = useNavigate()
  const [chambres, setChambres] = useState([])
  const [formData, setFormData] = useState({
    name: { fr: "", ar: "", en: "" },
    descriptionCourte: { fr: "", ar: "", en: "" },
    descriptionDetaillee: { fr: "", ar: "", en: "" },
    type: { fr: "", ar: "", en: "" },
    capacite: 2,
    reservable: true,
    imagePrincipale: null,
    images: [],
  })

  const [previewImagePrincipale, setPreviewImagePrincipale] = useState(null)
  const [previewImages, setPreviewImages] = useState([])
  const [editId, setEditId] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [user, setUser] = useState({ username: "", email: "" })
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [currentTime, setCurrentTime] = useState(new Date())
  const [searchTerm, setSearchTerm] = useState("")
  const [sortOrder, setSortOrder] = useState("newest")
  const [viewMode, setViewMode] = useState("grid")
  const [displayLanguage, setDisplayLanguage] = useState(() => {
    return localStorage.getItem("admin-display-language") || "fr"
  })
  const [formLanguageTab, setFormLanguageTab] = useState("fr")
  const [selectedChambreDetails, setSelectedChambreDetails] = useState(null)
  const [showDetailsModal, setShowDetailsModal] = useState(false)

  // Helper function to parse multilingual data
  const parseMultilingual = (data) => {
    if (!data) return { fr: "", ar: "", en: "" }
    
    // If it's a JSON string, parse it first
    if (typeof data === "string") {
      // Check if it's a JSON string (starts with { and ends with })
      if (data.trim().startsWith("{") && data.trim().endsWith("}")) {
        try {
          data = JSON.parse(data)
        } catch (e) {
          // If parsing fails, treat as regular string (backward compatibility)
          return { fr: data, ar: "", en: "" }
        }
      } else {
        // Regular string (backward compatibility)
        return { fr: data, ar: "", en: "" }
      }
    }
    
    // Now data should be an object
    if (typeof data === "object" && data !== null) {
      return {
        fr: data.fr || "",
        ar: data.ar || "",
        en: data.en || "",
      }
    }
    
    return { fr: "", ar: "", en: "" }
  }

  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem("theme")
    // Si aucun thème n'est sauvegardé, vérifier la préférence système
    if (!savedTheme) {
      // Vérifier la préférence système du navigateur
      if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
        return false
      }
      // Par défaut, retourner false (light mode) au lieu de true
      return false
    }
    return savedTheme === "dark"
  })

  const fetchChambres = async () => {
    try {
      setIsLoading(true)
      const res = await API.get("/chambres")
      setChambres(res.data || [])
    } catch (error) {
      console.error("Erreur chargement chambres:", error)
      alert("Erreur de chargement")
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer cette chambre ?")) return

    try {
      setIsLoading(true)
      await API.delete(`/chambres/${id}`)
      alert("Chambre supprimée avec succès")
      fetchChambres()
    } catch (error) {
      console.error("Erreur suppression chambre:", error)
      alert("Erreur lors de la suppression")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (!token) navigate("/")

    const userData = JSON.parse(localStorage.getItem("user") || '{"username":"test","email":"test@gmail.com"}')
    setUser(userData)

    const loadTimer = setTimeout(() => setIsLoading(false), 800)
    const timer = setInterval(() => setCurrentTime(new Date()), 60000)

    fetchChambres()

    return () => {
      clearTimeout(loadTimer)
      clearInterval(timer)
    }
  }, [navigate])

  useEffect(() => {
    localStorage.setItem("theme", isDarkMode ? "dark" : "light")
  }, [isDarkMode])

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode)
  }

  const handleChange = (e) => {
    const { name, value, files, type, checked } = e.target

    if (name === "imagePrincipale" && files && files[0]) {
      const image = files[0]
      setFormData((prev) => ({ ...prev, imagePrincipale: image }))
      const reader = new FileReader()
      reader.onloadend = () => setPreviewImagePrincipale(reader.result)
      reader.readAsDataURL(image)
    } else if (name === "images" && files && files.length > 0) {
      const imageFiles = Array.from(files)
      const currentImages = formData.images || []
      const updatedImages = [...currentImages, ...imageFiles]
      setFormData((prev) => ({ ...prev, images: updatedImages }))

      const newPreviewUrls = []
      imageFiles.forEach((file) => {
        const reader = new FileReader()
        reader.onloadend = () => {
          newPreviewUrls.push(reader.result)
          if (newPreviewUrls.length === imageFiles.length) {
            setPreviewImages((prevPreviews) => [...prevPreviews, ...newPreviewUrls])
          }
        }
        reader.readAsDataURL(file)
      })
    } else if (type === "checkbox") {
      setFormData((prev) => ({ ...prev, [name]: checked }))
    } else if (type === "number") {
      setFormData((prev) => ({ ...prev, [name]: parseFloat(value) || 0 }))
    } else if (name.includes("_")) {
      // Handle multilingual fields: name_fr, name_ar, name_en, etc.
      const [fieldName, lang] = name.split("_")
      if (["name", "descriptionCourte", "descriptionDetaillee", "type"].includes(fieldName) && ["fr", "ar", "en"].includes(lang)) {
        setFormData((prev) => ({
          ...prev,
          [fieldName]: {
            ...prev[fieldName],
            [lang]: value,
          },
        }))
      }
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }))
    }
  }

  const removePreviewImage = (index) => {
    const updatedImages = formData.images.filter((_, i) => i !== index)
    const updatedPreviews = previewImages.filter((_, i) => i !== index)
    setFormData((prev) => ({ ...prev, images: updatedImages }))
    setPreviewImages(updatedPreviews)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const form = new FormData()
      
      // Multilingual fields - send as JSON strings
      if (formData.name && (formData.name.fr || formData.name.ar || formData.name.en)) {
        form.append("name", JSON.stringify(formData.name))
      }
      
      if (formData.descriptionCourte && (formData.descriptionCourte.fr || formData.descriptionCourte.ar || formData.descriptionCourte.en)) {
        form.append("descriptionCourte", JSON.stringify(formData.descriptionCourte))
      }
      
      if (formData.descriptionDetaillee && (formData.descriptionDetaillee.fr || formData.descriptionDetaillee.ar || formData.descriptionDetaillee.en)) {
        form.append("descriptionDetaillee", JSON.stringify(formData.descriptionDetaillee))
      }
      
      if (formData.type && (formData.type.fr || formData.type.ar || formData.type.en)) {
        form.append("type", JSON.stringify(formData.type))
      }
      
      form.append("capacite", formData.capacite)
      form.append("reservable", formData.reservable)

      if (formData.imagePrincipale) {
        form.append("imagePrincipale", formData.imagePrincipale)
      }

      if (formData.images && formData.images.length > 0) {
        formData.images.forEach((image) => {
          if (image instanceof File || image instanceof Blob) {
            form.append("images", image)
          }
        })
      }

      if (editId) {
        await API.put(`/chambres/${editId}`, form, {
          headers: { "Content-Type": "multipart/form-data" },
        })
        alert("Chambre modifiée avec succès")
      } else {
        await API.post("/chambres", form, {
          headers: { "Content-Type": "multipart/form-data" },
        })
        alert("Chambre créée avec succès")
      }

      fetchChambres()
      resetForm()
    } catch (error) {
      console.error("Erreur enregistrement:", error)
      alert("Erreur lors de l'enregistrement")
    } finally {
      setIsLoading(false)
    }
  }

  const handleEdit = (chambre) => {
    setFormData({
      name: parseMultilingual(chambre.name),
      descriptionCourte: parseMultilingual(chambre.descriptionCourte),
      descriptionDetaillee: parseMultilingual(chambre.descriptionDetaillee || chambre.description),
      type: parseMultilingual(chambre.type),
      capacite: chambre.capacite || 2,
      reservable: chambre.reservable !== undefined ? chambre.reservable : true,
      imagePrincipale: null,
      images: chambre.images || [],
    })
    setPreviewImagePrincipale(chambre.imagePrincipale || null)
    setPreviewImages(chambre.images || [])
    setEditId(chambre._id)
    setShowForm(true)
  }

  const resetForm = () => {
    setFormData({
      name: { fr: "", ar: "", en: "" },
      descriptionCourte: { fr: "", ar: "", en: "" },
      descriptionDetaillee: { fr: "", ar: "", en: "" },
      type: { fr: "", ar: "", en: "" },
      capacite: 2,
      reservable: true,
      imagePrincipale: null,
      images: [],
    })
    setPreviewImagePrincipale(null)
    setPreviewImages([])
    setEditId(null)
    setShowForm(false)
  }

  const formatDate = (date) => {
    const options = { weekday: "long", day: "numeric", month: "long", year: "numeric" }
    return date.toLocaleDateString("fr-FR", options)
  }

  const formatTime = (date) => {
    return date.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })
  }

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen)
  }

  const filteredChambres = chambres
    .filter((chambre) => {
      if (!searchTerm) return true
      const searchLower = searchTerm.toLowerCase()
      const name = getName(chambre, displayLanguage).toLowerCase()
      const descriptionCourte = getDescriptionCourte(chambre, displayLanguage).toLowerCase()
      const descriptionDetaillee = getDescriptionDetaillee(chambre, displayLanguage).toLowerCase()
      const type = getType(chambre, displayLanguage).toLowerCase()
      return name.includes(searchLower) || descriptionCourte.includes(searchLower) || descriptionDetaillee.includes(searchLower) || type.includes(searchLower)
    })
    .sort((a, b) => {
      if (sortOrder === "newest") {
        return new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
      } else if (sortOrder === "oldest") {
        return new Date(a.createdAt || 0) - new Date(b.createdAt || 0)
      } else if (sortOrder === "alphabetical") {
        return getName(a, displayLanguage).localeCompare(getName(b, displayLanguage))
      }
      return 0
    })

  if (isLoading && chambres.length === 0) {
    return (
      <div className={isDarkMode ? "loading-container" : "light-loading-container"}>
        <div className={isDarkMode ? "loading-logo" : "light-loading-logo"}>
          <img
            src={isDarkMode ? "/GUESTLY_LIGHT.jpg" : "/GUESTLY_DARK.jpg"}
            alt="Guestly Logo"
            className="logo-image"
          />
        </div>
        <div className={isDarkMode ? "loading-spinner" : "light-loading-spinner"}>
          <div className={isDarkMode ? "spinner-circle" : "light-spinner-circle"}></div>
          <div className={isDarkMode ? "spinner-circle-inner" : "light-spinner-circle-inner"}></div>
        </div>
        <div className={isDarkMode ? "loading-text" : "light-loading-text"}>Chargement...</div>
      </div>
    )
  }

  return (
    <div className={isDarkMode ? "dashboard" : "light-dashboard"}>
      {/* Sidebar and main content structure similar to other admin pages */}
      <div className={isDarkMode ? "mobile-header" : "light-mobile-header"}>
        <button className={isDarkMode ? "menu-toggle" : "light-menu-toggle"} onClick={toggleSidebar}>
          <span></span>
          <span></span>
          <span></span>
        </button>
        <div className={isDarkMode ? "mobile-logo" : "light-mobile-logo"}>
          <img
            src={isDarkMode ? "/GUESTLY_LIGHT.jpg" : "/GUESTLY_DARK.jpg"}
            alt="Guestly Logo"
            style={{ width: "180px", height: "auto", objectFit: "contain" }}
          />
        </div>
        <div className={isDarkMode ? "mobile-user" : "light-mobile-user"}>
          <div className={isDarkMode ? "user-avatar" : "light-user-avatar"}>{user.username.charAt(0)}</div>
        </div>
      </div>

      <div className={`${isDarkMode ? "sidebar" : "light-sidebar"} ${isSidebarOpen ? "open" : ""}`}>
        <div className={isDarkMode ? "sidebar-header" : "light-sidebar-header"}>
          <div className={isDarkMode ? "logo" : "light-logo"}>
            <img
              src={isDarkMode ? "/GUESTLY_LIGHT.jpg" : "/GUESTLY_DARK.jpg"}
              alt="Guestly Logo"
              style={{ width: "180px", height: "auto", objectFit: "contain" }}
            />
          </div>
          <button className={isDarkMode ? "close-sidebar" : "light-close-sidebar"} onClick={toggleSidebar}>
            ×
          </button>
        </div>

        <div className={isDarkMode ? "user-profile" : "light-user-profile"}>
          <div className={isDarkMode ? "user-avatar" : "light-user-avatar"}>{user.username.charAt(0)}</div>
          <div className={isDarkMode ? "user-info" : "light-user-info"}>
            <div className={isDarkMode ? "user-name" : "light-user-name"}>{user.username}</div>
            <div className={isDarkMode ? "user-email" : "light-user-email"}>{user.email}</div>
          </div>
        </div>

        <div className={isDarkMode ? "sidebar-date" : "light-sidebar-date"}>
          <div className={isDarkMode ? "date-display" : "light-date-display"}>{formatDate(currentTime)}</div>
          <div className={isDarkMode ? "time-display" : "light-time-display"}>{formatTime(currentTime)}</div>
        </div>

        <nav className={isDarkMode ? "sidebar-nav" : "light-sidebar-nav"}>
          <ul>
            <li>
              <a href="#dashboard" onClick={() => navigate("/dashboard")}>
                <span className={isDarkMode ? "nav-icon" : "light-nav-icon"}>🏠</span>
                <span>Tableau de bord</span>
              </a>
            </li>
            <li>
              <a href="#chambres" onClick={() => navigate("/chambres")}>
                <span>Chambres</span>
              </a>
            </li>
          </ul>
        </nav>

        <div className={isDarkMode ? "sidebar-footer" : "light-sidebar-footer"}>
          <div className={isDarkMode ? "theme-switch-container" : "light-theme-switch-container"}>
            <span className={isDarkMode ? "theme-switch-label" : "light-theme-switch-label"}>
              {isDarkMode ? "🌙" : "☀️"}
            </span>
            <button 
              className={`theme-switch ${isDarkMode ? "theme-switch-dark" : "theme-switch-light"}`}
              onClick={toggleTheme}
              role="switch"
              aria-checked={isDarkMode}
              aria-label={isDarkMode ? "Passer en mode clair" : "Passer en mode sombre"}
            >
              <span className="theme-switch-slider"></span>
            </button>
            <span className={isDarkMode ? "theme-switch-label" : "light-theme-switch-label"}>
              {isDarkMode ? "☀️" : "🌙"}
            </span>
          </div>
          <button
            className={isDarkMode ? "logout-btn" : "light-logout-btn"}
            onClick={() => {
              localStorage.removeItem("token")
              localStorage.removeItem("user")
              navigate("/")
            }}
          >
            <span className={isDarkMode ? "logout-icon" : "light-logout-icon"}>🚪</span>
            <span className={isDarkMode ? "logout-text" : "light-logout-text"}>Déconnexion</span>
          </button>
        </div>
      </div>

      <div className={isDarkMode ? "main-content" : "light-main-content"}>
        <div className={isDarkMode ? "section-header" : "light-section-header"}>
          <div className="header-content-wrapper">
            <div>
              <h2>Gestion des Chambres</h2>
              <p className="section-subtitle">
                {filteredChambres.length} {filteredChambres.length === 1 ? "chambre" : "chambres"} 
                {chambres.length !== filteredChambres.length && ` (${chambres.length} au total)`}
              </p>
            </div>
            <div className="section-actions" style={{ display: "flex", gap: "12px", alignItems: "center" }}>
            <button
              className={isDarkMode ? "section-action" : "light-section-action"}
              onClick={() => setShowForm(!showForm)}
            >
              <span>{showForm ? "Annuler" : "Ajouter"}</span>
              <span className="action-icon">{showForm ? "❌" : "+"}</span>
            </button>
          </div>
          </div>
        </div>
        
        {/* Statistics Cards */}
        {chambres.length > 0 && (
          <div className="stats-cards-container">
            <div className={`stat-card ${isDarkMode ? "stat-card-dark" : "stat-card-light"}`}>
              <div className="stat-icon"></div>
              <div className="stat-content">
                <div className="stat-value">{chambres.length}</div>
                <div className="stat-label">Total Chambres</div>
              </div>
            </div>
            <div className={`stat-card ${isDarkMode ? "stat-card-dark" : "stat-card-light"}`}>
              <div className="stat-icon"></div>
              <div className="stat-content">
                <div className="stat-value">{chambres.filter(c => c.reservable).length}</div>
                <div className="stat-label">Réservables</div>
              </div>
            </div>
            <div className={`stat-card ${isDarkMode ? "stat-card-dark" : "stat-card-light"}`}>
              <div className="stat-icon"></div>
              <div className="stat-content">
                <div className="stat-value">{chambres.filter(c => c.images && c.images.length > 0).length}</div>
                <div className="stat-label">Avec Galerie</div>
              </div>
            </div>
          </div>
        )}

        {showForm && (
          <div className={isDarkMode ? "form-container" : "light-form-container"} style={{ animation: "slideDown 0.3s ease" }}>
            <div className={isDarkMode ? "form-header" : "light-form-header"}>
              <h3>{editId ? "Modifier la chambre" : "Ajouter une nouvelle chambre"}</h3>
            </div>
            <form onSubmit={handleSubmit} className={isDarkMode ? "offre-form" : "light-offre-form"}>
              {/* Language Tabs for Multilingual Fields */}
              <div className="language-tabs-container">
                <div className="language-tabs">
                  <button
                    type="button"
                    className={`language-tab ${formLanguageTab === "fr" ? "active" : ""}`}
                    onClick={() => setFormLanguageTab("fr")}
                  >
                    🇫🇷 Français
                  </button>
                  <button
                    type="button"
                    className={`language-tab ${formLanguageTab === "ar" ? "active" : ""}`}
                    onClick={() => setFormLanguageTab("ar")}
                  >
                    🇹🇳 العربية
                  </button>
                  <button
                    type="button"
                    className={`language-tab ${formLanguageTab === "en" ? "active" : ""}`}
                    onClick={() => setFormLanguageTab("en")}
                  >
                    🇬🇧 English
                  </button>
                </div>
              </div>

              <div className="form-section">
                <h4 className="form-section-title">📝 Nom de la chambre *</h4>
                <div className="tabbed-inputs">
                  <div className={`tab-content ${formLanguageTab === "fr" ? "active" : ""}`}>
                    <input
                      type="text"
                      name="name_fr"
                      value={formData.name.fr}
                      onChange={handleChange}
                      placeholder="Nom en français"
                      required
                      className={isDarkMode ? "form-input" : "light-form-input"}
                    />
                  </div>
                  <div className={`tab-content ${formLanguageTab === "ar" ? "active" : ""}`}>
                    <input
                      type="text"
                      name="name_ar"
                      value={formData.name.ar}
                      onChange={handleChange}
                      placeholder="الاسم بالعربية"
                      className={isDarkMode ? "form-input" : "light-form-input"}
                    />
                  </div>
                  <div className={`tab-content ${formLanguageTab === "en" ? "active" : ""}`}>
                    <input
                      type="text"
                      name="name_en"
                      value={formData.name.en}
                      onChange={handleChange}
                      placeholder="Name in English"
                      className={isDarkMode ? "form-input" : "light-form-input"}
                    />
                  </div>
                </div>
              </div>

              <div className="form-section">
                <h4 className="form-section-title">📄 Description courte</h4>
                <div className="tabbed-inputs">
                  <div className={`tab-content ${formLanguageTab === "fr" ? "active" : ""}`}>
                    <textarea
                      name="descriptionCourte_fr"
                      value={formData.descriptionCourte.fr}
                      onChange={handleChange}
                      placeholder="Description courte en français"
                      className={isDarkMode ? "form-input" : "light-form-input"}
                      rows="4"
                    />
                  </div>
                  <div className={`tab-content ${formLanguageTab === "ar" ? "active" : ""}`}>
                    <textarea
                      name="descriptionCourte_ar"
                      value={formData.descriptionCourte.ar}
                      onChange={handleChange}
                      placeholder="وصف قصير بالعربية"
                      className={isDarkMode ? "form-input" : "light-form-input"}
                      rows="4"
                    />
                  </div>
                  <div className={`tab-content ${formLanguageTab === "en" ? "active" : ""}`}>
                    <textarea
                      name="descriptionCourte_en"
                      value={formData.descriptionCourte.en}
                      onChange={handleChange}
                      placeholder="Short description in English"
                      className={isDarkMode ? "form-input" : "light-form-input"}
                      rows="4"
                    />
                  </div>
                </div>
              </div>

              <div className="form-section">
                <h4 className="form-section-title">📖 Description détaillée</h4>
                <div className="tabbed-inputs">
                  <div className={`tab-content ${formLanguageTab === "fr" ? "active" : ""}`}>
                    <textarea
                      name="descriptionDetaillee_fr"
                      value={formData.descriptionDetaillee.fr}
                      onChange={handleChange}
                      placeholder="Description détaillée en français"
                      className={isDarkMode ? "form-input" : "light-form-input"}
                      rows="6"
                    />
                  </div>
                  <div className={`tab-content ${formLanguageTab === "ar" ? "active" : ""}`}>
                    <textarea
                      name="descriptionDetaillee_ar"
                      value={formData.descriptionDetaillee.ar}
                      onChange={handleChange}
                      placeholder="وصف مفصل بالعربية"
                      className={isDarkMode ? "form-input" : "light-form-input"}
                      rows="6"
                    />
                  </div>
                  <div className={`tab-content ${formLanguageTab === "en" ? "active" : ""}`}>
                    <textarea
                      name="descriptionDetaillee_en"
                      value={formData.descriptionDetaillee.en}
                      onChange={handleChange}
                      placeholder="Detailed description in English"
                      className={isDarkMode ? "form-input" : "light-form-input"}
                      rows="6"
                    />
                  </div>
                </div>
              </div>

              <div className="form-section">
                <h4 className="form-section-title">Détails de la chambre</h4>
                
                <div className="form-section">
                  <h5 className="form-subsection-title">Type de chambre</h5>
                  <div className="tabbed-inputs">
                    <div className={`tab-content ${formLanguageTab === "fr" ? "active" : ""}`}>
                      <input
                        type="text"
                        name="type_fr"
                        value={formData.type.fr}
                        onChange={handleChange}
                        placeholder="Ex: Standard, Deluxe, Suite..."
                        className={isDarkMode ? "form-input" : "light-form-input"}
                      />
                    </div>
                    <div className={`tab-content ${formLanguageTab === "ar" ? "active" : ""}`}>
                      <input
                        type="text"
                        name="type_ar"
                        value={formData.type.ar}
                        onChange={handleChange}
                        placeholder="مثال: ستاندرد، ديلوكس، سويت..."
                        className={isDarkMode ? "form-input" : "light-form-input"}
                      />
                    </div>
                    <div className={`tab-content ${formLanguageTab === "en" ? "active" : ""}`}>
                      <input
                        type="text"
                        name="type_en"
                        value={formData.type.en}
                        onChange={handleChange}
                        placeholder="Ex: Standard, Deluxe, Suite..."
                        className={isDarkMode ? "form-input" : "light-form-input"}
                      />
                    </div>
                  </div>
                </div>

                <div className="input-group">
                  <label className="input-label">Capacité (personnes)</label>
                  <input
                    type="number"
                    name="capacite"
                    value={formData.capacite}
                    onChange={handleChange}
                    placeholder="Nombre de personnes"
                    min="1"
                    className={isDarkMode ? "form-input" : "light-form-input"}
                  />
                </div>

                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    name="reservable"
                    checked={formData.reservable}
                    onChange={handleChange}
                    className="custom-checkbox"
                  />
                  <span className="checkbox-text">Chambre réservable</span>
                </label>
              </div>

              <div className="form-section">
                <h4 className="form-section-title">Images</h4>
                <div className="input-group">
                  <label className="input-label">Image principale *</label>
                  <div className="file-input-wrapper">
                    <CompressedFileInput
                      type="file"
                      name="imagePrincipale"
                      accept="image/*"
                      onChange={handleChange}
                      className={isDarkMode ? "form-input file-input" : "light-form-input file-input"}
                    />
                    <span className="file-input-hint">Format: JPG, PNG, WEBP (max 5MB)</span>
                  </div>
                  {previewImagePrincipale && (
                    <div className="preview-container">
                      <img
                        src={previewImagePrincipale}
                        alt="Aperçu principale"
                        className="preview-img-main"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setPreviewImagePrincipale(null)
                          setFormData((prev) => ({ ...prev, imagePrincipale: null }))
                        }}
                        className="preview-remove-btn"
                      >
                        ✕
                      </button>
                    </div>
                  )}
                </div>

                <div className="input-group">
                  <label className="input-label">Images supplémentaires (jusqu'à 20)</label>
                  <div className="file-input-wrapper">
                    <CompressedFileInput
                      type="file"
                      name="images"
                      accept="image/*"
                      multiple
                      onChange={handleChange}
                      className={isDarkMode ? "form-input file-input" : "light-form-input file-input"}
                    />
                    <span className="file-input-hint">Vous pouvez sélectionner plusieurs images</span>
                  </div>
                  {previewImages.length > 0 && (
                    <div className="preview-images-grid">
                      {previewImages.map((preview, index) => (
                        <div key={index} className="preview-image-item">
                          <img
                            src={preview}
                            alt={`Aperçu ${index + 1}`}
                            className="preview-img-thumb"
                          />
                          <button
                            type="button"
                            onClick={() => removePreviewImage(index)}
                            className="preview-remove-btn-small"
                            title="Supprimer cette image"
                          >
                            ✕
                          </button>
                          <span className="preview-number">{index + 1}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className={isDarkMode ? "form-actions" : "light-form-actions"}>
                <button
                  type="submit"
                  className={isDarkMode ? "btn btn-primary" : "light-btn light-btn-primary"}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <span className="spinner-small"></span>
                      Enregistrement...
                    </>
                  ) : editId ? (
                    <>
                      Modifier la chambre
                    </>
                  ) : (
                    <>
                      Créer la chambre
                    </>
                  )}
                </button>
                <button
                  type="button"
                  className={isDarkMode ? "btn btn-secondary" : "light-btn light-btn-secondary"}
                  onClick={resetForm}
                >
                  ❌ Annuler
                </button>
              </div>
            </form>
          </div>
        )}

        <div className={isDarkMode ? "search-filter-container" : "light-search-filter-container"}>
          <div className={isDarkMode ? "search-container" : "light-search-container"}>
            <span className="search-icon">🔍</span>
            <input
              className={isDarkMode ? "search-input" : "light-search-input"}
              type="text"
              placeholder="Rechercher une chambre..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="view-sort-container">
            <div className="view-toggle">
              <button
                className={`view-btn ${viewMode === "grid" ? "active" : ""}`}
                onClick={() => setViewMode("grid")}
                aria-label="Vue en grille"
              >
                ▦
              </button>
              <button
                className={`view-btn ${viewMode === "list" ? "active" : ""}`}
                onClick={() => setViewMode("list")}
                aria-label="Vue en liste"
              >
                ☰
              </button>
            </div>

            <select
              className={isDarkMode ? "sort-select" : "light-sort-select"}
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
            >
              <option value="newest">Plus récent</option>
              <option value="oldest">Plus ancien</option>
              <option value="alphabetical">Alphabétique</option>
            </select>
          </div>
        </div>

        {filteredChambres.length === 0 ? (
          <div className={isDarkMode ? "empty-state" : "light-empty-state"}>
            <div className="empty-icon"></div>
            <h3>Aucune chambre trouvée</h3>
            <p>Commencez par créer une nouvelle chambre</p>
            <button
              className={isDarkMode ? "btn btn-primary" : "light-btn light-btn-primary"}
              onClick={() => setShowForm(true)}
            >
              Créer une chambre
            </button>
          </div>
        ) : (
          <div className={`${isDarkMode ? "boisson-list" : "light-boisson-list"} ${viewMode}`}>
            {filteredChambres.map((chambre) => (
              <div key={chambre._id} className={isDarkMode ? "boisson-card" : "light-boisson-card"}>
                {chambre.imagePrincipale && (
                  <div className="boisson-image-wrapper">
                    <img
                      src={chambre.imagePrincipale}
                      alt={getName(chambre, displayLanguage) || "Chambre"}
                      className="boisson-image"
                      onError={(e) => (e.target.src = "/placeholder.svg")}
                    />
                    {chambre.images && chambre.images.length > 0 && (
                      <div className="boisson-badge">
                        <span className="price-badge">{chambre.images.length} image{chambre.images.length > 1 ? "s" : ""}</span>
                      </div>
                    )}
                  </div>
                )}
                <div className={isDarkMode ? "boisson-details" : "light-boisson-details"}>
                  <h4 className="boisson-title">{getName(chambre, displayLanguage) || "Sans nom"}</h4>
                  <div className="boisson-meta">
                    {getType(chambre, displayLanguage) && (
                      <span className="quantity-info">
                        <span className="quantity-icon">🏷️</span>
                        Type: {getType(chambre, displayLanguage)}
                      </span>
                    )}
                    {chambre.capacite && (
                      <span className="quantity-info">
                        <span className="quantity-icon">👥</span>
                        Capacité: {chambre.capacite}
                      </span>
                    )}
                    <span className="quantity-info">
                      <span className="quantity-icon">{chambre.reservable ? "✓" : "✗"}</span>
                      {chambre.reservable ? "Réservable" : "Non réservable"}
                    </span>
                  </div>
                  {getDescriptionCourte(chambre, displayLanguage) && (
                    <p className="boisson-description">{getDescriptionCourte(chambre, displayLanguage)}</p>
                  )}
                  <div className={isDarkMode ? "boisson-card-actions" : "light-boisson-card-actions"}>
                    <button
                      onClick={() => {
                        setSelectedChambreDetails(chambre)
                        setShowDetailsModal(true)
                      }}
                      className={
                        isDarkMode
                          ? "btn btn-primary btn-sm"
                          : "light-btn light-btn-primary light-btn-sm"
                      }
                    >
                      Détails
                    </button>
                    <button
                      onClick={() => handleEdit(chambre)}
                      className={
                        isDarkMode
                          ? "btn btn-secondary btn-sm"
                          : "light-btn light-btn-secondary light-btn-sm"
                      }
                    >
                      Modifier
                    </button>
                    <button
                      onClick={() => handleDelete(chambre._id)}
                      className={
                        isDarkMode ? "btn btn-danger btn-sm" : "light-btn light-btn-danger light-btn-sm"
                      }
                    >
                      Supprimer
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Details Modal */}
        {showDetailsModal && selectedChambreDetails && (
          <div 
            className="details-modal-overlay"
            onClick={() => setShowDetailsModal(false)}
          >
            <div 
              className={`details-modal ${isDarkMode ? "details-modal-dark" : "details-modal-light"}`}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="details-modal-header">
                <h2>{getName(selectedChambreDetails, displayLanguage) || "Détails de la chambre"}</h2>
                <button
                  className="details-modal-close"
                  onClick={() => setShowDetailsModal(false)}
                >
                  ✕
                </button>
              </div>

              <div className="details-modal-content">
                {/* Main Image */}
                {selectedChambreDetails.imagePrincipale && (
                  <div className="details-main-image">
                    <img
                      src={selectedChambreDetails.imagePrincipale}
                      alt={getName(selectedChambreDetails, displayLanguage)}
                      onError={(e) => (e.target.src = "/placeholder.svg")}
                    />
                  </div>
                )}

                {/* Gallery */}
                {selectedChambreDetails.images && selectedChambreDetails.images.length > 0 && (
                  <div className="details-gallery">
                    <h3>Galerie d'images ({selectedChambreDetails.images.length})</h3>
                    <div className="details-gallery-grid">
                      {selectedChambreDetails.images.map((img, idx) => (
                        <div key={idx} className="details-gallery-item">
                          <img
                            src={img}
                            alt={`${getName(selectedChambreDetails, displayLanguage)} ${idx + 1}`}
                            onError={(e) => (e.target.src = "/placeholder.svg")}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Information Grid */}
                <div className="details-info-grid">
                  <div className="details-info-section">
                    <h3>Informations générales</h3>
                    <div className="details-info-item">
                      <span className="details-info-label">Nom (FR):</span>
                      <span className="details-info-value">{getName(selectedChambreDetails, "fr") || "N/A"}</span>
                    </div>
                    {getName(selectedChambreDetails, "ar") && (
                      <div className="details-info-item">
                        <span className="details-info-label">Nom (AR):</span>
                        <span className="details-info-value">{getName(selectedChambreDetails, "ar")}</span>
                      </div>
                    )}
                    {getName(selectedChambreDetails, "en") && (
                      <div className="details-info-item">
                        <span className="details-info-label">Nom (EN):</span>
                        <span className="details-info-value">{getName(selectedChambreDetails, "en")}</span>
                      </div>
                    )}
                    {getType(selectedChambreDetails, displayLanguage) && (
                      <div className="details-info-item">
                        <span className="details-info-label">Type:</span>
                        <span className="details-info-value">{getType(selectedChambreDetails, displayLanguage)}</span>
                      </div>
                    )}
                    {selectedChambreDetails.capacite && (
                      <div className="details-info-item">
                        <span className="details-info-label">Capacité:</span>
                        <span className="details-info-value">{selectedChambreDetails.capacite} {selectedChambreDetails.capacite === 1 ? "personne" : "personnes"}</span>
                      </div>
                    )}
                    <div className="details-info-item">
                      <span className="details-info-label">Statut:</span>
                      <span className={`details-info-value ${selectedChambreDetails.reservable ? "reservable" : "not-reservable"}`}>
                        {selectedChambreDetails.reservable ? "Réservable" : "Non réservable"}
                      </span>
                    </div>
                  </div>

                  {/* Descriptions */}
                  {(getDescriptionCourte(selectedChambreDetails, displayLanguage) || getDescriptionDetaillee(selectedChambreDetails, displayLanguage)) && (
                    <div className="details-info-section">
                      <h3>📄 Descriptions</h3>
                      {getDescriptionCourte(selectedChambreDetails, displayLanguage) && (
                        <div className="details-description">
                          <span className="details-info-label">Description courte:</span>
                          <div className={`details-description-content ${isDarkMode ? "page-content-html" : "page-content-html-light"}`}>
                            <p>{getDescriptionCourte(selectedChambreDetails, displayLanguage)}</p>
                          </div>
                        </div>
                      )}
                      {getDescriptionDetaillee(selectedChambreDetails, displayLanguage) && (
                        <div className="details-description">
                          <span className="details-info-label">Description détaillée:</span>
                          <div 
                            className={`details-description-content ${isDarkMode ? "page-content-html" : "page-content-html-light"}`}
                            dangerouslySetInnerHTML={{ __html: getDescriptionDetaillee(selectedChambreDetails, displayLanguage) }}
                          />
                        </div>
                      )}
                    </div>
                  )}

                  {/* Dates */}
                  <div className="details-info-section">
                    <h3>📅 Dates</h3>
                    {selectedChambreDetails.createdAt && (
                      <div className="details-info-item">
                        <span className="details-info-label">Créé le:</span>
                        <span className="details-info-value">
                          {new Date(selectedChambreDetails.createdAt).toLocaleDateString("fr-FR", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit"
                          })}
                        </span>
                      </div>
                    )}
                    {selectedChambreDetails.updatedAt && (
                      <div className="details-info-item">
                        <span className="details-info-label">Modifié le:</span>
                        <span className="details-info-value">
                          {new Date(selectedChambreDetails.updatedAt).toLocaleDateString("fr-FR", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit"
                          })}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="details-modal-actions">
                  <button
                    onClick={() => {
                      setShowDetailsModal(false)
                      handleEdit(selectedChambreDetails)
                    }}
                    className={`${isDarkMode ? "btn btn-secondary" : "light-btn light-btn-secondary"}`}
                  >
                    Modifier
                  </button>
                  <button
                    onClick={() => {
                      if (window.confirm("Êtes-vous sûr de vouloir supprimer cette chambre ?")) {
                        handleDelete(selectedChambreDetails._id)
                        setShowDetailsModal(false)
                      }
                    }}
                    className={`${isDarkMode ? "btn btn-danger" : "light-btn light-btn-danger"}`}
                  >
                    Supprimer
                  </button>
                  <button
                    onClick={() => setShowDetailsModal(false)}
                    className={`${isDarkMode ? "btn btn-primary" : "light-btn light-btn-primary"}`}
                  >
                    Fermer
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default ChambresPage
