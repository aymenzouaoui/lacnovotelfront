"use client"

import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import API from "../services/api"
import "./OffresPage.css"
import CompressedFileInput from "../components/CompressedFileInput"

// Composant pour générer une miniature à partir d'une vidéo
const VideoThumbnail = ({ src, alt }) => {
  const [thumbnail, setThumbnail] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!src) {
      setIsLoading(false)
      return
    }

    let isCancelled = false
    const video = document.createElement("video")

    video.crossOrigin = "anonymous"
    video.src = src
    video.muted = true
    video.playsInline = true
    video.preload = "metadata"

    const cleanup = () => {
      video.removeEventListener("loadeddata", handleLoadedData)
      video.removeEventListener("seeked", handleSeeked)
      video.removeEventListener("error", handleError)
      video.pause()
      video.src = ""
    }

    const captureFrame = () => {
      try {
        const canvas = document.createElement("canvas")
        const width = video.videoWidth || 640
        const height = video.videoHeight || 360

        canvas.width = width
        canvas.height = height

        const ctx = canvas.getContext("2d")
        if (!ctx) {
          throw new Error("Canvas context not available")
        }

        ctx.drawImage(video, 0, 0, width, height)
        const dataUrl = canvas.toDataURL("image/jpeg", 0.8)

        if (!isCancelled) {
          setThumbnail(dataUrl)
          setIsLoading(false)
        }
      } catch (error) {
        console.error("Erreur génération miniature vidéo:", error)
        if (!isCancelled) {
          setIsLoading(false)
        }
      }
    }

    const handleLoadedData = () => {
      try {
        const targetTime = video.duration && !Number.isNaN(video.duration) ? Math.min(1, video.duration / 2) : 0
        video.currentTime = targetTime
      } catch (error) {
        captureFrame()
      }
    }

    const handleSeeked = () => {
      captureFrame()
      cleanup()
    }

    const handleError = () => {
      if (!isCancelled) {
        setIsLoading(false)
      }
      cleanup()
    }

    video.addEventListener("loadeddata", handleLoadedData)
    video.addEventListener("seeked", handleSeeked)
    video.addEventListener("error", handleError)

    video.load()

    return () => {
      isCancelled = true
      cleanup()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [src])

  if (thumbnail) {
    return (
      <div className="card-video-thumbnail-wrapper">
        <img src={thumbnail} alt={alt} className="card-image" />
        <div className="card-video-play-overlay">
          <div className="play-button-circle">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="play-icon">
              <path d="M8 5v14l11-7z" fill="currentColor" />
            </svg>
          </div>
        </div>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="card-video-loading">
        <div className="card-video-loading-spinner"></div>
        <span>Chargement...</span>
      </div>
    )
  }

  // Fallback si on ne peut pas générer la miniature
  return (
    <div className="card-video-fallback">
      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M8 5v14l11-7z" fill="currentColor" />
      </svg>
      <span>Vidéo</span>
    </div>
  )
}

const OffresPage = () => {
  const navigate = useNavigate()
  const [offres, setOffres] = useState([])
  // Update the formData state to include images or video
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    discountPercentage: "",
    startDate: "",
    endDate: "",
    active: true,
    images: [],
    video: null,
    mediaType: "images",
    translations: {
      en: { title: "", description: "" },
      fr: { title: "", description: "" },
      ar: { title: "", description: "" },
    },
  })
  const [activeLang, setActiveLang] = useState("en")

  // Add preview states
  const [previewImages, setPreviewImages] = useState([])
  const [previewVideo, setPreviewVideo] = useState(null)

  const [editId, setEditId] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [user, setUser] = useState({ username: "", email: "" })
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [currentTime, setCurrentTime] = useState(new Date())
  const [searchTerm, setSearchTerm] = useState("")
  const [sortOrder, setSortOrder] = useState("newest")
  const [viewMode, setViewMode] = useState("grid")
  const [imageIndices, setImageIndices] = useState({}) // Track current image index for each offer

  // Theme state with localStorage initialization
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem("theme")
    return savedTheme ? savedTheme === "dark" : true
  })

  const fetchOffres = async () => { 
    try {
      setIsLoading(true)
      const res = await API.get("/offres")
      setOffres(res.data)
    } catch (error) {
      console.error("Erreur chargement offres:", error)
      alert("Erreur de chargement")
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (id) => {
    try {
      setIsLoading(true)
      await API.delete(`/offres/${id}`)
      alert("Offre supprimée avec succès")
      fetchOffres()
    } catch (error) {
      console.error("Erreur suppression offre:", error)
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

    fetchOffres()

    return () => {
      clearTimeout(loadTimer)
      clearInterval(timer)
    }
  }, [navigate])

  useEffect(() => {
    // Save theme preference to localStorage
    localStorage.setItem("theme", isDarkMode ? "dark" : "light")
  }, [isDarkMode])

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode)
  }

  // Handle media type change
  const handleMediaTypeChange = (type) => {
    setFormData((prev) => ({
      ...prev,
      mediaType: type,
      images: type === "video" ? [] : prev.images,
      video: type === "images" ? null : prev.video,
    }))
    if (type === "video") {
      setPreviewImages([])
    } else {
      setPreviewVideo(null)
    }
  }

  // Handle multiple images
  const handleImagesChange = (e) => {
    const files = Array.from(e.target.files || [])
    if (files.length === 0) return

    const imageFiles = files.filter((file) => file.type.startsWith("image/"))
    const newImages = [...formData.images, ...imageFiles]
    setFormData((prev) => ({ ...prev, images: newImages }))

    // Create previews for new images
    imageFiles.forEach((file) => {
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreviewImages((prev) => [...prev, reader.result])
      }
      reader.readAsDataURL(file)
    })
  }

  // Handle video upload
  const handleVideoChange = (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.type.startsWith("video/")) {
      setFormData((prev) => ({ ...prev, video: file }))
      const reader = new FileReader()
      reader.onloadend = () => setPreviewVideo(reader.result)
      reader.readAsDataURL(file)
    } else {
      alert("Veuillez sélectionner un fichier vidéo")
    }
  }

  // Remove image from preview
  const removeImage = (index) => {
    const updatedImages = formData.images.filter((_, i) => i !== index)
    const updatedPreviews = previewImages.filter((_, i) => i !== index)
    setFormData((prev) => ({ ...prev, images: updatedImages }))
    setPreviewImages(updatedPreviews)
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    if (name.startsWith("tr_")) {
      const [, lang, field] = name.split("_")
      setFormData((prev) => ({
        ...prev,
        translations: {
          ...prev.translations,
          [lang]: { ...prev.translations[lang], [field]: value },
        },
      }))
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }))
    }
  }

  // Update the handleSubmit function to use FormData for image upload
  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const form = new FormData()
      form.append("title", formData.translations?.en?.title ?? formData.title ?? "")
      form.append("description", formData.translations?.en?.description ?? formData.description ?? "")
      form.append(
        "translations",
        JSON.stringify({
          fr: formData.translations?.fr || { title: "", description: "" },
          ar: formData.translations?.ar || { title: "", description: "" },
        }),
      )
      // Envoyer 0 si le champ remise est vide, sinon envoyer la valeur
      if (formData.discountPercentage && formData.discountPercentage !== "" && Number(formData.discountPercentage) > 0) {
        form.append("discountPercentage", formData.discountPercentage)
      } else {
        form.append("discountPercentage", "0")
      }
      form.append("startDate", formData.startDate)
      form.append("endDate", formData.endDate)
      form.append("active", formData.active)
      form.append("mediaType", formData.mediaType)

      // Handle images or video
      if (formData.mediaType === "images" && formData.images.length > 0) {
        // Separate existing images (URLs) from new images (Files)
        const existingImages = []
        const newImageFiles = []

        formData.images.forEach((image) => {
          if (image instanceof Blob || image instanceof File) {
            newImageFiles.push(image)
          } else if (typeof image === "string" && image.startsWith("http")) {
            existingImages.push(image)
          }
        })

        // Append new image files
        newImageFiles.forEach((image) => {
          form.append("images", image)
        })

        // For edits, send existing images
        if (editId && existingImages.length > 0) {
          form.append("existingImages", JSON.stringify(existingImages))
        }
      } else if (formData.mediaType === "video" && formData.video) {
        form.append("video", formData.video)
      }

      if (editId) {
        await API.put(`/offres/${editId}`, form, {
          headers: { "Content-Type": "multipart/form-data" },
        })
        alert("Offre modifiée avec succès")
      } else {
        await API.post("/offres", form, {
          headers: { "Content-Type": "multipart/form-data" },
        })
        alert("Offre créée avec succès")
      }

      fetchOffres()
      resetForm()
    } catch (error) {
      console.error("Erreur enregistrement:", error)
      alert("Erreur lors de l'enregistrement")
    } finally {
      setIsLoading(false)
    }
  }

  const handleEdit = (offre) => {
    const tr = offre.translations || {}
    const mediaType = offre.video ? "video" : offre.images && offre.images.length > 0 ? "images" : offre.image ? "images" : "images"
    const mediaData = offre.video
      ? { video: null, images: [] }
      : {
          video: null,
          images: offre.images && offre.images.length > 0 ? offre.images : offre.image ? [offre.image] : [],
        }

    setFormData({
      title: offre.title,
      description: offre.description,
      discountPercentage: offre.discountPercentage || "",
      startDate: new Date(offre.startDate).toISOString().slice(0, 16),
      endDate: new Date(offre.endDate).toISOString().slice(0, 16),
      active: offre.active,
      mediaType,
      ...mediaData,
      translations: {
        en: { title: offre.title || "", description: offre.description || "" },
        fr: { title: (tr.fr && tr.fr.title) || "", description: (tr.fr && tr.fr.description) || "" },
        ar: { title: (tr.ar && tr.ar.title) || "", description: (tr.ar && tr.ar.description) || "" },
      },
    })

    // Set previews - keep URLs as strings for existing images
    if (mediaType === "video" && offre.video) {
      setPreviewVideo(offre.video)
      setPreviewImages([])
    } else {
      const images = offre.images || (offre.image ? [offre.image] : [])
      // Keep existing images as URLs (strings) for preview
      setPreviewImages(images)
      setPreviewVideo(null)
    }

    setEditId(offre._id)
    setShowForm(true)
  }

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      discountPercentage: "",
      startDate: "",
      endDate: "",
      active: true,
      images: [],
      video: null,
      mediaType: "images",
      translations: {
        en: { title: "", description: "" },
        fr: { title: "", description: "" },
        ar: { title: "", description: "" },
      },
    })
    setPreviewImages([])
    setPreviewVideo(null)
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

  const filteredOffres = offres
    .filter(
      (o) =>
        o.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        o.description?.toLowerCase().includes(searchTerm.toLowerCase()),
    )
    .sort((a, b) => {
      if (sortOrder === "newest") {
        return new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
      } else if (sortOrder === "oldest") {
        return new Date(a.createdAt || 0) - new Date(b.createdAt || 0)
      } else if (sortOrder === "alphabetical") {
        return a.title.localeCompare(b.title)
      } else if (sortOrder === "discount-high") {
        return b.discount - a.discount
      } else if (sortOrder === "discount-low") {
        return a.discount - b.discount
      }
      return 0
    })

  if (isLoading) {
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
      <div className={isDarkMode ? "mobile-header" : "light-mobile-header"}>
        <button className="light-menu-toggle" onClick={toggleSidebar}>
          <span></span>
          <span></span>
          <span></span>
        </button>
        <div className={isDarkMode ? "mobile-logo" : "light-mobile-logo"}>
          <span style={{ display: "inline-block", verticalAlign: "middle" }}>
  <img
    src={isDarkMode ? "/GUESTLY_LIGHT.jpg" : "/GUESTLY_DARK.jpg"}
    alt="Guestly Logo"
    style={{
      width: "180px",        // wide logo
      height: "auto",        // maintain aspect ratio
      objectFit: "contain",
      transition: "opacity 0.3s ease"
    }}
  />
</span>

        </div>
        <div className={isDarkMode ? "mobile-user" : "light-mobile-user"}>
          <div className={isDarkMode ? "user-avatar" : "light-user-avatar"}>{user.username.charAt(0)}</div>
        </div>
      </div>

      <div className={`${isDarkMode ? "sidebar" : "light-sidebar"} ${isSidebarOpen ? "open" : ""}`}>
        <div className={isDarkMode ? "sidebar-header" : "light-sidebar-header"}>
          <div className={isDarkMode ? "logo" : "light-logo"}>
            <span style={{ display: "inline-block", verticalAlign: "middle" }}>
  <img
    src={isDarkMode ? "/GUESTLY_LIGHT.jpg" : "/GUESTLY_DARK.jpg"}
    alt="Guestly Logo"
    style={{
      width: "180px",        // wide logo
      height: "auto",        // maintain aspect ratio
      objectFit: "contain",
      transition: "opacity 0.3s ease"
    }}
  />
</span>

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
              <a href="#profile" onClick={() => navigate("/profile")}>
                <span className={isDarkMode ? "nav-icon" : "light-nav-icon"}>👤</span>
                <span>Mon profil</span>
              </a>
            </li>
            <li>
              <a href="#settings" onClick={() => navigate("/settings")}>
                <span className={isDarkMode ? "nav-icon" : "light-nav-icon"}>⚙️</span>
                <span>Paramètres</span>
              </a>
            </li>
            <li className="active">
              <a href="#offres">
                <span className={isDarkMode ? "nav-icon" : "light-nav-icon"}>🎯</span>
                <span>Offres Spéciales</span>
              </a>
            </li>
          </ul>
        </nav>

        <div className={isDarkMode ? "sidebar-footer" : "light-sidebar-footer"}>
          <button
            className={isDarkMode ? "logout-button" : "light-logout-button"}
            onClick={() => {
              localStorage.removeItem("token")
              localStorage.removeItem("user")
              navigate("/")
            }}
          >
            <span className={isDarkMode ? "nav-icon" : "light-nav-icon"}>🚪</span>
            <span>Déconnexion</span>
          </button>
        </div>
      </div>

      <div className={isDarkMode ? "main-content" : "light-main-content"}>
        <div className={isDarkMode ? "welcome-section" : "light-welcome-section"}>
          <div className={isDarkMode ? "welcome-header" : "light-welcome-header"}>
            <h1>
              Offres Spéciales <span className={isDarkMode ? "wave-emoji" : "light-wave-emoji"}>🎯</span>
            </h1>
            <div className={isDarkMode ? "welcome-actions" : "light-welcome-actions"}>
              <button
                className={isDarkMode ? "action-button notifications" : "light-action-button light-notifications"}
              >
                <span className={isDarkMode ? "action-icon" : "light-action-icon"}>🔔</span>
                <span className="notification-badge"></span>
              </button>

              <button
                className={isDarkMode ? "theme-toggle-button" : "light-theme-toggle-button"}
                onClick={toggleTheme}
                title={isDarkMode ? "Passer en mode clair" : "Passer en mode sombre"}
              >
                {isDarkMode ? "☀️" : "🌙"}
              </button>

              <div className={isDarkMode ? "user-avatar-small" : "light-user-avatar-small"}>
                {user.username.charAt(0)}
              </div>
            </div>
          </div>
          <p>Gérez vos offres et promotions spéciales</p>
        </div>

        <div className={isDarkMode ? "search-filter-container" : "light-search-filter-container"}>
          <div className={isDarkMode ? "search-container" : "light-search-container"}>
            <span className="search-icon">🔍</span>
            <input
              className={isDarkMode ? "search-input" : "light-search-input"}
              type="text"
              placeholder="Rechercher une offre..."
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
              <option value="discount-high">Remise (décroissant)</option>
              <option value="discount-low">Remise (croissant)</option>
            </select>
          </div>
        </div>

        <div className={isDarkMode ? "section-header" : "light-section-header"}>
          <h2>Liste des offres</h2>
          <div className="section-actions">
            <button
              className={isDarkMode ? "section-action" : "light-section-action"}
              onClick={() => setShowForm(!showForm)}
            >
              <span>{showForm ? "Annuler" : "Ajouter"}</span>
              <span className="action-icon">{showForm ? "❌" : "+"}</span>
            </button>
          </div>
        </div>

        {showForm && (
          <div className={isDarkMode ? "form-container" : "light-form-container"}>
            <form onSubmit={handleSubmit} className={isDarkMode ? "offre-form" : "light-offre-form"}>
              <div className={isDarkMode ? "form-label" : "light-form-label"} style={{ marginBottom: "0.5rem" }}>
                Langues (EN par défaut — FR / AR dans translations)
              </div>
              <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1rem" }}>
                <button
                  type="button"
                  className={activeLang === "en" ? (isDarkMode ? "btn btn-primary" : "light-btn light-btn-primary") : (isDarkMode ? "btn btn-secondary" : "light-btn light-btn-secondary")}
                  onClick={() => setActiveLang("en")}
                >
                  English (défaut)
                </button>
                <button
                  type="button"
                  className={activeLang === "fr" ? (isDarkMode ? "btn btn-primary" : "light-btn light-btn-primary") : (isDarkMode ? "btn btn-secondary" : "light-btn light-btn-secondary")}
                  onClick={() => setActiveLang("fr")}
                >
                  Français
                </button>
                <button
                  type="button"
                  className={activeLang === "ar" ? (isDarkMode ? "btn btn-primary" : "light-btn light-btn-primary") : (isDarkMode ? "btn btn-secondary" : "light-btn light-btn-secondary")}
                  onClick={() => setActiveLang("ar")}
                >
                  العربية
                </button>
              </div>
              <label className={isDarkMode ? "form-label" : "light-form-label"}>
                📝 Titre ({activeLang === "fr" ? "Français" : activeLang === "ar" ? "العربية" : "English"}) <span style={{ color: "#ef4444" }}>*</span>
                <input
                  type="text"
                  name={`tr_${activeLang}_title`}
                  value={formData.translations?.[activeLang]?.title ?? ""}
                  onChange={handleChange}
                  placeholder={activeLang === "fr" ? "Ex: Offre spéciale été 2024" : activeLang === "ar" ? "عنوان العرض" : "Ex: Special summer offer 2024"}
                  required={activeLang === "en"}
                  className={isDarkMode ? "form-input" : "light-form-input"}
                />
              </label>
              <label className={isDarkMode ? "form-label" : "light-form-label"}>
                📄 Description ({activeLang === "fr" ? "Français" : activeLang === "ar" ? "العربية" : "English"})
                <textarea
                  name={`tr_${activeLang}_description`}
                  value={formData.translations?.[activeLang]?.description ?? ""}
                  onChange={handleChange}
                  placeholder={activeLang === "fr" ? "Décrivez votre offre..." : activeLang === "ar" ? "وصف العرض" : "Describe your offer..."}
                  rows="4"
                  className={isDarkMode ? "form-input" : "light-form-input"}
                />
              </label>
              <label className={isDarkMode ? "form-label" : "light-form-label"}>
                💰 Remise (%): <span style={{ fontSize: "0.875rem", color: "#64748b", fontWeight: "normal" }}>(Optionnel)</span>
                <input
                  type="number"
                  name="discountPercentage"
                  value={formData.discountPercentage}
                  onChange={handleChange}
                  placeholder="Ex: 20 pour 20%"
                  min="0"
                  max="100"
                  className={isDarkMode ? "form-input" : "light-form-input"}
                />
              </label>
              <label className={isDarkMode ? "form-label" : "light-form-label"}>
                📅 Date de début:
                <input
                  type="datetime-local"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleChange}
                  required
                  className={isDarkMode ? "form-input" : "light-form-input"}
                />
              </label>
              <label className={isDarkMode ? "form-label" : "light-form-label"}>
                📅 Date de fin:
                <input
                  type="datetime-local"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleChange}
                  required
                  className={isDarkMode ? "form-input" : "light-form-input"}
                />
              </label>
              <label className={isDarkMode ? "form-label checkbox-label" : "light-form-label light-checkbox-label"}>
                <span className="checkbox-label-text">
                  {formData.active ? (
                    <>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ marginRight: "8px", color: "#4ade80" }}>
                        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
                        <path d="M8 12l2 2 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      Statut: <strong style={{ color: formData.active ? "#4ade80" : "#f87171" }}>Active</strong>
                    </>
                  ) : (
                    <>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ marginRight: "8px", color: "#f87171" }}>
                        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
                        <path d="M15 9l-6 6M9 9l6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                      </svg>
                      Statut: <strong style={{ color: formData.active ? "#4ade80" : "#f87171" }}>Inactive</strong>
                    </>
                  )}
                </span>
                <div className={isDarkMode ? "custom-checkbox-wrapper" : "light-custom-checkbox-wrapper"}>
                  <input
                    type="checkbox"
                    name="active"
                    checked={formData.active}
                    onChange={(e) => setFormData((prev) => ({ ...prev, active: e.target.checked }))}
                    className={isDarkMode ? "form-checkbox custom-checkbox" : "light-form-checkbox light-custom-checkbox"}
                    id="active-checkbox"
                  />
                  <label htmlFor="active-checkbox" className={isDarkMode ? "custom-checkbox-label" : "light-custom-checkbox-label"}>
                    <span className={isDarkMode ? "custom-checkbox-indicator" : "light-custom-checkbox-indicator"}></span>
                  </label>
                </div>
              </label>
              {/* Media Type Selector */}
              <div className={isDarkMode ? "media-type-selector" : "light-media-type-selector"}>
                <label className={isDarkMode ? "form-label" : "light-form-label"}>
                  Type de média:
                </label>
                <div className="media-type-buttons">
                  <button
                    type="button"
                    className={`media-type-btn ${formData.mediaType === "images" ? "active" : ""} ${isDarkMode ? "" : "light"}`}
                    onClick={() => handleMediaTypeChange("images")}
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2" />
                      <circle cx="8.5" cy="8.5" r="1.5" fill="currentColor" />
                      <path d="M21 15l-5-5L5 21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    Images multiples
                  </button>
                  <button
                    type="button"
                    className={`media-type-btn ${formData.mediaType === "video" ? "active" : ""} ${isDarkMode ? "" : "light"}`}
                    onClick={() => handleMediaTypeChange("video")}
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M23 7l-7 5 7 5V7z" fill="currentColor" />
                      <rect x="1" y="5" width="15" height="14" rx="2" stroke="currentColor" strokeWidth="2" />
                    </svg>
                    Vidéo
                  </button>
                </div>
              </div>

              {/* Images Upload */}
              {formData.mediaType === "images" && (
                <div className={isDarkMode ? "media-upload-section" : "light-media-upload-section"}>
                  <label className={isDarkMode ? "form-label" : "light-form-label"}>
                    📷 Images (plusieurs images possibles):
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleImagesChange}
                      className={isDarkMode ? "form-input" : "light-form-input"}
                    />
                  </label>
                  {previewImages.length > 0 && (
                    <div className="preview-images-grid">
                      {previewImages.map((preview, index) => (
                        <div key={index} className="preview-image-item">
                          <img src={preview} alt={`Aperçu ${index + 1}`} className="preview-img" />
                          <button
                            type="button"
                            className="remove-image-btn"
                            onClick={() => removeImage(index)}
                            aria-label="Supprimer l'image"
                          >
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
                              <path d="M15 9l-6 6M9 9l6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                            </svg>
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Video Upload */}
              {formData.mediaType === "video" && (
                <div className={isDarkMode ? "media-upload-section" : "light-media-upload-section"}>
                  <label className={isDarkMode ? "form-label" : "light-form-label"}>
                    🎥 Vidéo:
                    <input
                      type="file"
                      accept="video/*"
                      onChange={handleVideoChange}
                      className={isDarkMode ? "form-input" : "light-form-input"}
                    />
                  </label>
                  {previewVideo && (
                    <div className="preview-video-container">
                      <video src={previewVideo} controls className="preview-video">
                        Votre navigateur ne supporte pas la lecture de vidéos.
                      </video>
                      <button
                        type="button"
                        className="remove-video-btn"
                        onClick={() => {
                          setFormData((prev) => ({ ...prev, video: null }))
                          setPreviewVideo(null)
                        }}
                        aria-label="Supprimer la vidéo"
                      >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
                          <path d="M15 9l-6 6M9 9l6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                        </svg>
                      </button>
                    </div>
                  )}
                </div>
              )}

              <div className={isDarkMode ? "form-actions" : "light-form-actions"}>
                <button
                  type="submit"
                  className={isDarkMode ? "btn btn-primary" : "light-btn light-btn-primary"}
                  disabled={isLoading}
                >
                  {isLoading ? "Chargement..." : editId ? "✅ Modifier" : "✅ Créer"}
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

        {filteredOffres.length === 0 ? (
          <div className={isDarkMode ? "empty-state" : "light-empty-state"}>
            <div className="empty-icon">🎯</div>
            <h3>Aucune offre trouvée</h3>
            <p>Commencez par créer une nouvelle offre</p>
            <button
              className={isDarkMode ? "btn btn-primary" : "light-btn light-btn-primary"}
              onClick={() => setShowForm(true)}
            >
              Créer une offre
            </button>
          </div>
        ) : (
          <div
            className={`${isDarkMode ? "offres-list" : "light-offres-list"} ${viewMode === "list" ? "list-view" : ""}`}
          >
            {filteredOffres.map((offre) => {
              // Determine media type and data
              const mediaType = offre.video ? "video" : (offre.images && offre.images.length > 0) ? "images" : offre.image ? "image" : null
              const images = offre.images && offre.images.length > 0 ? offre.images : offre.image ? [offre.image] : []
              const currentImageIndex = imageIndices[offre._id] || 0
              
              const setCurrentImageIndex = (index) => {
                setImageIndices((prev) => ({ ...prev, [offre._id]: index }))
              }
              
              return (
              <div key={offre._id} className={isDarkMode ? "offre-card" : "light-offre-card"}>
                {/* Media Container */}
                <div className="card-media-container">
                  {mediaType === "video" && offre.video ? (
                    <div className="card-video-wrapper">
                      <VideoThumbnail src={offre.video} alt={offre.title} />
                      <div className="media-type-indicator video-indicator">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M8 5v14l11-7z" fill="currentColor" />
                        </svg>
                        <span>Vidéo</span>
                      </div>
                    </div>
                  ) : images.length > 0 ? (
                    <div className="card-images-carousel">
                      <div 
                        className="carousel-track" 
                        style={{ transform: `translateX(-${currentImageIndex * 100}%)` }}
                      >
                        {images.map((img, idx) => (
                          <div key={idx} className="carousel-slide">
                            <img 
                              src={img || "/placeholder.svg"} 
                              alt={`${offre.title} - Image ${idx + 1}`} 
                              className="card-image" 
                            />
                          </div>
                        ))}
                      </div>
                      
                      {/* Image indicators */}
                      {images.length > 1 && (
                        <>
                          <div className="carousel-indicators">
                            {images.map((_, idx) => (
                              <button
                                key={idx}
                                className={`carousel-dot ${idx === currentImageIndex ? "active" : ""}`}
                                onClick={() => setCurrentImageIndex(idx)}
                                aria-label={`Aller à l'image ${idx + 1}`}
                              />
                            ))}
                          </div>
                          <div className="carousel-counter">
                            {currentImageIndex + 1} / {images.length}
                          </div>
                          <button 
                            className="carousel-nav carousel-prev"
                            onClick={() => setCurrentImageIndex((currentImageIndex - 1 + images.length) % images.length)}
                            aria-label="Image précédente"
                          >
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                          </button>
                          <button 
                            className="carousel-nav carousel-next"
                            onClick={() => setCurrentImageIndex((currentImageIndex + 1) % images.length)}
                            aria-label="Image suivante"
                          >
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                          </button>
                        </>
                      )}
                      {images.length > 1 && (
                        <div className="media-type-indicator images-indicator">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2"/>
                            <circle cx="8.5" cy="8.5" r="1.5" fill="currentColor"/>
                            <path d="M21 15l-5-5L5 21" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                          </svg>
                          <span>{images.length} images</span>
                        </div>
                      )}
                    </div>
                  ) : null}
                </div>
                <h3>{offre.title}</h3>
                <p>{offre.description}</p>
                {offre.discountPercentage != null && 
                 offre.discountPercentage !== "" && 
                 Number(offre.discountPercentage) > 0 && (
                  <p>
                    💸 <strong>Remise:</strong> {offre.discountPercentage}%
                  </p>
                )}
                <p>
                  🕓 <strong>Du:</strong> {new Date(offre.startDate).toLocaleString("fr-FR")} au{" "}
                  {new Date(offre.endDate).toLocaleString("fr-FR")}
                </p>
                <div className="offre-status-container">
                  <span className={offre.active ? (isDarkMode ? "status-badge status-active-dark" : "status-badge status-active-light") : (isDarkMode ? "status-badge status-inactive-dark" : "status-badge status-inactive-light")}>
                    {offre.active ? (
                      <>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
                          <path d="M8 12l2 2 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        Active
                      </>
                    ) : (
                      <>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
                          <path d="M15 9l-6 6M9 9l6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                        </svg>
                        Inactive
                      </>
                    )}
                  </span>
                </div>
                <div className={isDarkMode ? "seminaire-card-actions" : "light-seminaire-card-actions"}>
                  <button
                    onClick={() => handleEdit(offre)}
                    className={isDarkMode ? "edit-btn btn btn-secondary" : "light-btn light-btn-secondary"}
                  >
                    ✏️ Modifier
                  </button>
                  <button
                    onClick={() => handleDelete(offre._id)}
                    className={isDarkMode ? "btn-delete btn btn-danger" : "light-btn light-btn-danger"}
                  >
                    🗑️ Supprimer
                  </button>
                </div>
              </div>
              )
            })}
          </div>
        )}
      </div>

      <style jsx>{`
/* Light Mode Styles for Offres Page - Same base styles as Loisirs */
.light-dashboard {
  background: linear-gradient(135deg, #ffffff 0%, #fdf2f8 50%, #f8fafc 100%);
  color: #1e293b;
  min-height: 100vh;
  font-family: "Inter", "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
}

.light-loading-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #fdf2f8 0%, #f3e8ff 50%, #ffffff 100%);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

.light-loading-logo {
  font-size: 3rem;
  font-weight: bold;
  background: linear-gradient(45deg, #ec4899, #8b5cf6);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 2rem;
  animation: lightPulse 2s ease-in-out infinite;
}

.light-loading-spinner {
  position: relative;
  width: 80px;
  height: 80px;
  margin-bottom: 2rem;
}

.light-spinner-circle {
  position: absolute;
  width: 100%;
  height: 100%;
  border: 4px solid #f1f5f9;
  border-top: 4px solid #ec4899;
  border-radius: 50%;
  animation: lightSpin 1s linear infinite;
}

.light-spinner-circle-inner {
  position: absolute;
  top: 10px;
  left: 10px;
  width: calc(100% - 20px);
  height: calc(100% - 20px);
  border: 2px solid transparent;
  border-top: 2px solid #8b5cf6;
  border-radius: 50%;
  animation: lightSpin 0.8s linear infinite reverse;
}

.light-loading-text {
  font-size: 1.2rem;
  color: #64748b;
  font-weight: 500;
}

@keyframes lightPulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.7; }
}

@keyframes lightSpin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.light-mobile-header {
  display: none;
  background: linear-gradient(135deg, #ffffff 0%, #fdf2f8 100%);
  border-bottom: 1px solid #e2e8f0;
  padding: 1rem;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);
}

.light-menu-toggle {
  background: none;
  border: none;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 8px;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.light-menu-toggle:hover {
  background: rgba(236, 72, 153, 0.1);
}

.light-menu-toggle span {
  width: 25px;
  height: 3px;
  background: linear-gradient(45deg, #ec4899, #8b5cf6);
  border-radius: 2px;
  transition: all 0.3s ease;
}

.light-mobile-logo .light-logo-text {
  font-size: 1.5rem;
  font-weight: bold;
  background: linear-gradient(45deg, #ec4899, #8b5cf6);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.light-mobile-user .light-user-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: linear-gradient(45deg, #ec4899, #8b5cf6);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: bold;
  box-shadow: 0 4px 12px rgba(236, 72, 153, 0.3);
}

.light-sidebar {
  width: 280px;
  background: linear-gradient(180deg, #ffffff 0%, #fdf2f8 100%);
  border-right: 1px solid #e2e8f0;
  height: 100vh;
  position: fixed;
  left: 0;
  top: 0;
  z-index: 1000;
  display: flex;
  flex-direction: column;
  box-shadow: 4px 0 20px rgba(0, 0, 0, 0.08);
  transition: transform 0.3s ease;
}

.light-sidebar-header {
  padding: 2rem 1.5rem 1rem;
  border-bottom: 1px solid #e2e8f0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: linear-gradient(135deg, #ffffff 0%, #fdf2f8 100%);
}

.light-logo .light-logo-text {
  font-size: 2rem;
  font-weight: bold;
  background: linear-gradient(45deg, #ec4899, #8b5cf6);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.light-close-sidebar {
  display: none;
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #64748b;
  padding: 8px;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.light-close-sidebar:hover {
  background: rgba(236, 72, 153, 0.1);
  color: #ec4899;
}

.light-user-profile {
  padding: 1.5rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  border-bottom: 1px solid #e2e8f0;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.8) 0%, rgba(253, 242, 248, 0.8) 100%);
}

.light-user-avatar {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: linear-gradient(45deg, #ec4899, #8b5cf6);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: bold;
  font-size: 1.2rem;
  box-shadow: 0 4px 12px rgba(236, 72, 153, 0.3);
}

.light-user-info {
  flex: 1;
}

.light-user-name {
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 0.25rem;
}

.light-user-email {
  font-size: 0.875rem;
  color: #64748b;
}

.light-sidebar-date {
  padding: 1rem 1.5rem;
  border-bottom: 1px solid #e2e8f0;
  text-align: center;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(253, 242, 248, 0.9) 100%);
}

.light-date-display {
  font-size: 0.875rem;
  color: #64748b;
  margin-bottom: 0.25rem;
}

.light-time-display {
  font-size: 1.5rem;
  font-weight: bold;
  background: linear-gradient(45deg, #ec4899, #8b5cf6);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.light-sidebar-nav {
  flex: 1;
  padding: 1rem 0;
}

.light-sidebar-nav ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.light-sidebar-nav li {
  margin: 0.25rem 0;
}

.light-sidebar-nav a {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.75rem 1.5rem;
  color: #64748b;
  text-decoration: none;
  transition: all 0.3s ease;
  border-radius: 0 25px 25px 0;
  margin-right: 1rem;
  position: relative;
}

.light-sidebar-nav a::before {
  content: "";
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 4px;
  background: linear-gradient(45deg, #ec4899, #8b5cf6);
  border-radius: 0 4px 4px 0;
  transform: scaleY(0);
  transition: transform 0.3s ease;
}

.light-sidebar-nav a:hover {
  background: linear-gradient(90deg, rgba(236, 72, 153, 0.1), rgba(139, 92, 246, 0.1));
  color: #ec4899;
  transform: translateX(5px);
}

.light-sidebar-nav a:hover::before {
  transform: scaleY(1);
}

.light-sidebar-nav li.active a {
  background: linear-gradient(90deg, rgba(236, 72, 153, 0.15), rgba(139, 92, 246, 0.15));
  color: #ec4899;
  font-weight: 600;
}

.light-sidebar-nav li.active a::before {
  transform: scaleY(1);
}

.light-nav-icon {
  font-size: 1.2rem;
}

.light-sidebar-footer {
  padding: 1rem 1.5rem;
  border-top: 1px solid #e2e8f0;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(253, 242, 248, 0.9) 100%);
}

.light-logout-button {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.75rem;
  background: linear-gradient(45deg, #ec4899, #8b5cf6);
  color: white;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 500;
  box-shadow: 0 4px 12px rgba(236, 72, 153, 0.3);
}

.light-logout-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(236, 72, 153, 0.4);
  background: linear-gradient(45deg, #db2777, #7c3aed);
}

.light-main-content {
  margin-left: 280px;
  padding: 2rem;
  min-height: 100vh;
  background: linear-gradient(135deg, #ffffff 0%, #fdf2f8 30%, #f8fafc 100%);
}

.light-welcome-section {
  margin-bottom: 2rem;
}

.light-welcome-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.light-welcome-header h1 {
  font-size: 2.5rem;
  font-weight: bold;
  color: #1e293b;
  margin: 0;
}

.light-wave-emoji {
  animation: lightWave 2s ease-in-out infinite;
}

@keyframes lightWave {
  0%, 100% { transform: rotate(0deg); }
  25% { transform: rotate(20deg); }
  75% { transform: rotate(-10deg); }
}

.light-welcome-actions {
  display: flex;
  align-items: center;
  gap: 1rem;
  position: relative;
}

.light-action-button {
  position: relative;
  background: linear-gradient(135deg, #ffffff 0%, #fdf2f8 100%);
  border: 2px solid #ec4899;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  box-shadow: 0 4px 12px rgba(236, 72, 153, 0.2),
              inset 0 1px 0 rgba(255, 255, 255, 0.8);
  z-index: 1;
  overflow: hidden;
}

.light-action-button::before {
  content: "";
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  border-radius: 50%;
  background: linear-gradient(45deg, #ec4899, #8b5cf6);
  transform: translate(-50%, -50%);
  transition: width 0.5s ease, height 0.5s ease;
  z-index: -1;
}

.light-action-button:hover::before {
  width: 100%;
  height: 100%;
}

.light-action-button:hover {
  transform: translateY(-4px) scale(1.1) rotate(5deg);
  box-shadow: 0 8px 25px rgba(236, 72, 153, 0.35),
              inset 0 1px 0 rgba(255, 255, 255, 0.3);
  border-color: #8b5cf6;
  color: white;
}

.light-action-button:active {
  transform: translateY(-2px) scale(1.05);
  box-shadow: 0 4px 15px rgba(236, 72, 153, 0.3);
}

.light-action-icon {
  font-size: 1.2rem;
  z-index: 2;
  position: relative;
}

.light-theme-toggle-button {
  background: linear-gradient(135deg, #ffffff 0%, #fdf2f8 100%);
  border: 2px solid #ec4899;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  box-shadow: 0 4px 12px rgba(236, 72, 153, 0.2),
              inset 0 1px 0 rgba(255, 255, 255, 0.8);
  font-size: 1.2rem;
  position: relative;
  z-index: 1;
  overflow: hidden;
}

.light-theme-toggle-button::before {
  content: "";
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  border-radius: 50%;
  background: linear-gradient(45deg, #ec4899, #8b5cf6);
  transform: translate(-50%, -50%);
  transition: width 0.5s ease, height 0.5s ease;
  z-index: -1;
}

.light-theme-toggle-button:hover::before {
  width: 100%;
  height: 100%;
}

.light-theme-toggle-button:hover {
  transform: translateY(-4px) scale(1.1) rotate(10deg);
  box-shadow: 0 8px 25px rgba(236, 72, 153, 0.35),
              inset 0 1px 0 rgba(255, 255, 255, 0.3);
  border-color: #8b5cf6;
  color: white;
}

.light-theme-toggle-button:active {
  transform: translateY(-2px) scale(1.05);
  box-shadow: 0 4px 15px rgba(236, 72, 153, 0.3);
}

.light-user-avatar-small {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: linear-gradient(45deg, #ec4899, #8b5cf6);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: bold;
  font-size: 1rem;
  box-shadow: 0 4px 12px rgba(236, 72, 153, 0.3);
}

.light-welcome-section p {
  color: #64748b;
  font-size: 1.1rem;
  margin: 0;
}

.light-search-filter-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  gap: 1rem;
  background: linear-gradient(135deg, #ffffff 0%, #fdf2f8 100%);
  padding: 1.5rem;
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  border: 1px solid #e2e8f0;
}

.light-search-container {
  position: relative;
  flex: 1;
  max-width: 400px;
}

.light-search-input {
  width: 100%;
  padding: 0.75rem 1rem 0.75rem 3rem;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  background: linear-gradient(135deg, #ffffff 0%, #fdf2f8 100%);
  color: #1e293b;
  font-size: 1rem;
  transition: all 0.3s ease;
}

.light-search-input:focus {
  outline: none;
  border-color: #ec4899;
  box-shadow: 0 0 0 3px rgba(236, 72, 153, 0.1);
}

.light-sort-select {
  padding: 0.75rem 1rem;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  background: linear-gradient(135deg, #ffffff 0%, #fdf2f8 100%);
  color: #1e293b;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.light-sort-select:focus {
  outline: none;
  border-color: #ec4899;
  box-shadow: 0 0 0 3px rgba(236, 72, 153, 0.1);
}

.light-section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  background: linear-gradient(135deg, #ffffff 0%, #fdf2f8 100%);
  padding: 1.5rem;
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  border: 1px solid #e2e8f0;
}

.light-section-header h2 {
  font-size: 1.5rem;
  font-weight: bold;
  color: #1e293b;
  margin: 0;
}

.light-section-action {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.875rem 1.75rem;
  background: linear-gradient(135deg, #ec4899 0%, #8b5cf6 50%, #a855f7 100%);
  background-size: 200% 200%;
  color: white;
  border: none;
  border-radius: 14px;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  font-weight: 600;
  font-size: 15px;
  box-shadow: 0 6px 20px rgba(236, 72, 153, 0.4),
              0 2px 8px rgba(236, 72, 153, 0.2),
              inset 0 1px 0 rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.1);
  letter-spacing: 0.3px;
  position: relative;
  overflow: hidden;
}

.light-section-action::before {
  content: "";
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.25);
  transform: translate(-50%, -50%);
  transition: width 0.6s ease, height 0.6s ease;
  z-index: 0;
}

.light-section-action:hover::before {
  width: 400px;
  height: 400px;
}

.light-section-action > * {
  position: relative;
  z-index: 1;
}

.light-section-action:hover {
  background-position: 100% 0;
  transform: translateY(-4px) scale(1.05);
  box-shadow: 0 10px 30px rgba(236, 72, 153, 0.5),
              0 4px 12px rgba(236, 72, 153, 0.3),
              inset 0 1px 0 rgba(255, 255, 255, 0.3);
}

.light-section-action:active {
  transform: translateY(-2px) scale(1.02);
  box-shadow: 0 4px 15px rgba(236, 72, 153, 0.4);
}

.light-form-container {
  background: linear-gradient(135deg, #ffffff 0%, #fdf2f8 100%);
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  padding: 2rem;
  margin-bottom: 2rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.light-offre-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.light-offre-form textarea {
  min-height: 120px;
  line-height: 1.6;
  resize: vertical;
}

.light-form-input {
  width: 100%;
  padding: 0.875rem 1.125rem;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  background: #ffffff;
  color: #1e293b;
  font-size: 1rem;
  transition: all 0.3s ease;
  font-family: inherit;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.light-form-input:hover {
  border-color: #cbd5e1;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
}

.light-form-input:focus {
  outline: none;
  border-color: #ec4899;
  box-shadow: 0 0 0 4px rgba(236, 72, 153, 0.1), 0 2px 8px rgba(0, 0, 0, 0.1);
  background: #ffffff;
}

.light-form-input::placeholder {
  color: #94a3b8;
  font-style: italic;
}

.light-form-label {
  color: #1e293b;
  font-weight: 600;
  margin-bottom: 0.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  font-size: 15px;
}

.light-form-label span {
  font-size: 0.875rem;
  color: #64748b;
  font-weight: normal;
}

.light-checkbox-label {
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 1rem;
  background: rgba(236, 72, 153, 0.05);
  border-radius: 12px;
  border: 2px solid rgba(236, 72, 153, 0.1);
  transition: all 0.3s ease;
}

.light-checkbox-label:hover {
  background: rgba(236, 72, 153, 0.08);
  border-color: rgba(236, 72, 153, 0.2);
}

.checkbox-label-text {
  display: flex;
  align-items: center;
  font-size: 15px;
  font-weight: 600;
  color: #1e293b;
}

.light-custom-checkbox-wrapper {
  display: flex;
  align-items: center;
  position: relative;
}

.light-custom-checkbox {
  position: absolute;
  opacity: 0;
  cursor: pointer;
  height: 0;
  width: 0;
}

.light-custom-checkbox-label {
  display: flex;
  align-items: center;
  cursor: pointer;
  position: relative;
}

.light-custom-checkbox-indicator {
  width: 48px;
  height: 26px;
  background: rgba(239, 68, 68, 0.2);
  border-radius: 26px;
  position: relative;
  transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  border: 2px solid rgba(239, 68, 68, 0.4);
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.1);
}

.light-custom-checkbox-indicator::before {
  content: "";
  position: absolute;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: white;
  top: 1px;
  left: 1px;
  transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.light-custom-checkbox:checked + .light-custom-checkbox-label .light-custom-checkbox-indicator {
  background: linear-gradient(135deg, rgba(34, 197, 94, 0.3) 0%, rgba(22, 163, 74, 0.2) 100%);
  border-color: rgba(34, 197, 94, 0.5);
  box-shadow: 0 0 0 4px rgba(34, 197, 94, 0.1),
              inset 0 2px 4px rgba(0, 0, 0, 0.05);
}

.light-custom-checkbox:checked + .light-custom-checkbox-label .light-custom-checkbox-indicator::before {
  transform: translateX(22px);
  background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%);
  box-shadow: 0 2px 6px rgba(34, 197, 94, 0.3);
}

.light-custom-checkbox:focus + .light-custom-checkbox-label .light-custom-checkbox-indicator {
  box-shadow: 0 0 0 4px rgba(236, 72, 153, 0.2);
}

.light-form-checkbox {
  width: auto;
  margin: 0;
}

.light-form-actions {
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
  padding-top: 1.5rem;
  border-top: 2px solid #e2e8f0;
}

.light-btn {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 500;
  font-size: 1rem;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  text-decoration: none;
  pointer-events: auto !important;
  position: relative;
  z-index: 1;
}

.light-btn-primary {
  background: linear-gradient(135deg, #ec4899 0%, #8b5cf6 50%, #a855f7 100%);
  background-size: 200% 200%;
  color: white;
  box-shadow: 0 6px 20px rgba(236, 72, 153, 0.4),
              0 2px 8px rgba(236, 72, 153, 0.2),
              inset 0 1px 0 rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.1);
  position: relative;
  overflow: hidden;
}

.light-btn-primary::before {
  content: "";
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.25);
  transform: translate(-50%, -50%);
  transition: width 0.6s ease, height 0.6s ease;
  z-index: 0;
}

.light-btn-primary:hover::before {
  width: 400px;
  height: 400px;
}

.light-btn-primary > * {
  position: relative;
  z-index: 1;
}

.light-btn-primary:hover {
  background-position: 100% 0;
  transform: translateY(-4px) scale(1.05);
  box-shadow: 0 10px 30px rgba(236, 72, 153, 0.5),
              0 4px 12px rgba(236, 72, 153, 0.3),
              inset 0 1px 0 rgba(255, 255, 255, 0.3);
}

.light-btn-primary:active {
  transform: translateY(-2px) scale(1.02);
  box-shadow: 0 4px 15px rgba(236, 72, 153, 0.4);
}

.light-btn-secondary {
  background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
  color: #475569;
  border: 2px solid #e2e8f0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05),
              inset 0 1px 0 rgba(255, 255, 255, 0.8);
}

.light-btn-secondary:hover {
  background: linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%);
  border-color: #cbd5e1;
  color: #334155;
  transform: translateY(-3px) scale(1.02);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1),
              inset 0 1px 0 rgba(255, 255, 255, 0.9);
}

.light-btn-secondary:active {
  transform: translateY(-1px) scale(1);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.light-btn-danger {
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 50%, #b91c1c 100%);
  background-size: 200% 200%;
  color: white;
  box-shadow: 0 6px 20px rgba(239, 68, 68, 0.4),
              0 2px 8px rgba(239, 68, 68, 0.2),
              inset 0 1px 0 rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.1);
  position: relative;
  overflow: hidden;
}

.light-btn-danger::before {
  content: "";
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.25);
  transform: translate(-50%, -50%);
  transition: width 0.6s ease, height 0.6s ease;
  z-index: 0;
}

.light-btn-danger:hover::before {
  width: 400px;
  height: 400px;
}

.light-btn-danger > * {
  position: relative;
  z-index: 1;
}

.light-btn-danger:hover {
  background-position: 100% 0;
  transform: translateY(-4px) scale(1.05);
  box-shadow: 0 10px 30px rgba(239, 68, 68, 0.5),
              0 4px 12px rgba(239, 68, 68, 0.3),
              inset 0 1px 0 rgba(255, 255, 255, 0.3);
}

.light-btn-danger:active {
  transform: translateY(-2px) scale(1.02);
  box-shadow: 0 4px 15px rgba(239, 68, 68, 0.4);
}

.light-empty-state {
  text-align: center;
  padding: 3rem 2rem;
  background: linear-gradient(135deg, #ffffff 0%, #fdf2f8 100%);
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.light-empty-state h3 {
  color: #1e293b;
  margin-bottom: 0.5rem;
}

.light-empty-state p {
  color: #64748b;
  margin-bottom: 2rem;
}

.light-offres-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
  margin-top: 1rem;
}

.light-offres-list.list-view {
  grid-template-columns: 1fr;
}

.light-offre-card {
  background: linear-gradient(135deg, #ffffff 0%, #fdf2f8 100%);
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  padding: 1.5rem;
}

.light-offre-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 25px rgba(236, 72, 153, 0.15);
}

.light-offre-card:hover .carousel-nav {
  opacity: 1;
}

/* Light Mode Card Media Styles */
.light-offre-card .card-media-container {
  background: #f8fafc;
  border: 1px solid #e2e8f0;
}

.light-offre-card .carousel-nav {
  background: rgba(255, 255, 255, 0.95);
  border-color: rgba(236, 72, 153, 0.3);
  color: #ec4899;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.light-offre-card .carousel-nav:hover {
  background: white;
  border-color: #ec4899;
  box-shadow: 0 6px 20px rgba(236, 72, 153, 0.3);
}

.light-offre-card .carousel-indicators {
  background: rgba(255, 255, 255, 0.9);
  border: 1px solid #e2e8f0;
}

.light-offre-card .carousel-dot {
  background: rgba(148, 163, 184, 0.5);
}

.light-offre-card .carousel-dot:hover {
  background: rgba(148, 163, 184, 0.8);
}

.light-offre-card .carousel-dot.active {
  background: linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%);
  box-shadow: 0 2px 8px rgba(236, 72, 153, 0.4);
}

.light-offre-card .carousel-counter {
  background: rgba(255, 255, 255, 0.95);
  color: #1e293b;
  border-color: #e2e8f0;
}

.light-offre-card .media-type-indicator {
  background: rgba(255, 255, 255, 0.95);
  color: #1e293b;
  border-color: #e2e8f0;
}

.light-offre-card .video-indicator {
  background: linear-gradient(135deg, rgba(239, 68, 68, 0.9) 0%, rgba(220, 38, 38, 0.9) 100%);
  color: white;
}

.light-offre-card .images-indicator {
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.9) 0%, rgba(37, 99, 235, 0.9) 100%);
  color: white;
}

.light-offre-card h3 {
  color: #1e293b;
  margin-bottom: 1rem;
  font-size: 1.25rem;
  font-weight: 600;
}

.light-offre-card p {
  color: #64748b;
  margin-bottom: 0.5rem;
}

.light-offre-card .card-image,
.light-offre-card video {
  width: 100%;
  height: 180px;
  object-fit: cover;
  border-radius: 12px;
  margin-bottom: 16px;
  border: 1px solid #e2e8f0;
}

.light-offre-card video {
  background: #000;
}

/* Light Mode Media Type Selector */
.light-media-type-selector .media-type-buttons {
  display: flex;
  gap: 1rem;
  margin-top: 0.75rem;
}

.light-media-type-selector .media-type-btn.light {
  border-color: #e2e8f0;
  background: #ffffff;
  color: #64748b;
}

.light-media-type-selector .media-type-btn.light:hover {
  background: #f8fafc;
  border-color: #cbd5e1;
  transform: translateY(-2px);
}

.light-media-type-selector .media-type-btn.light.active {
  background: linear-gradient(135deg, rgba(236, 72, 153, 0.15) 0%, rgba(139, 92, 246, 0.15) 100%);
  border-color: #ec4899;
  color: #ec4899;
  box-shadow: 0 4px 12px rgba(236, 72, 153, 0.2);
}

/* Light Mode Preview Images */
.light-media-upload-section .preview-images-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 1rem;
  margin-top: 1rem;
}

.light-media-upload-section .preview-image-item {
  position: relative;
  border-radius: 12px;
  overflow: hidden;
  aspect-ratio: 16/9;
  background: #f8fafc;
  border: 2px solid #e2e8f0;
  transition: all 0.3s ease;
}

.light-media-upload-section .preview-image-item:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
  border-color: #cbd5e1;
}

.light-media-upload-section .preview-video-container {
  position: relative;
  margin-top: 1rem;
  border-radius: 12px;
  overflow: hidden;
  background: #000;
  border: 2px solid #e2e8f0;
}

.light-media-upload-section .preview-video {
  width: 100%;
  max-height: 400px;
  display: block;
  border-radius: 12px;
}

.light-media-upload-section .remove-video-btn {
  position: absolute;
  top: 12px;
  right: 12px;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: rgba(239, 68, 68, 0.9);
  border: 2px solid white;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
}

.light-media-upload-section .remove-video-btn:hover {
  background: rgba(220, 38, 38, 1);
  transform: scale(1.1) rotate(90deg);
  box-shadow: 0 4px 12px rgba(239, 68, 68, 0.5);
}

.light-media-upload-section .remove-image-btn {
  position: absolute;
  top: 8px;
  right: 8px;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: rgba(239, 68, 68, 0.9);
  border: 2px solid white;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
}

.light-media-upload-section .remove-image-btn:hover {
  background: rgba(220, 38, 38, 1);
  transform: scale(1.1) rotate(90deg);
  box-shadow: 0 4px 12px rgba(239, 68, 68, 0.5);
}

/* Status Badge Styles - Light Mode */
.light-offre-card .offre-status-container {
  margin: 12px 0;
  display: flex;
  align-items: center;
}

/* Active Status - Light Mode */
.status-active-light {
  background: linear-gradient(135deg, rgba(34, 197, 94, 0.15) 0%, rgba(22, 163, 74, 0.1) 100%);
  color: #16a34a;
  border-color: rgba(34, 197, 94, 0.3);
  box-shadow: 0 2px 8px rgba(34, 197, 94, 0.15),
              inset 0 1px 0 rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
}

.status-active-light::before {
  content: "";
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(34, 197, 94, 0.15), transparent);
  transition: left 0.5s ease;
}

.status-active-light:hover::before {
  left: 100%;
}

.status-active-light:hover {
  background: linear-gradient(135deg, rgba(34, 197, 94, 0.25) 0%, rgba(22, 163, 74, 0.2) 100%);
  border-color: rgba(34, 197, 94, 0.5);
  color: #15803d;
  transform: translateY(-2px) scale(1.05);
  box-shadow: 0 4px 14px rgba(34, 197, 94, 0.25),
              inset 0 1px 0 rgba(255, 255, 255, 0.9);
}

/* Inactive Status - Light Mode */
.status-inactive-light {
  background: linear-gradient(135deg, rgba(239, 68, 68, 0.15) 0%, rgba(220, 38, 38, 0.1) 100%);
  color: #dc2626;
  border-color: rgba(239, 68, 68, 0.3);
  box-shadow: 0 2px 8px rgba(239, 68, 68, 0.15),
              inset 0 1px 0 rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
}

.status-inactive-light::before {
  content: "";
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(239, 68, 68, 0.15), transparent);
  transition: left 0.5s ease;
}

.status-inactive-light:hover::before {
  left: 100%;
}

.status-inactive-light:hover {
  background: linear-gradient(135deg, rgba(239, 68, 68, 0.25) 0%, rgba(220, 38, 38, 0.2) 100%);
  border-color: rgba(239, 68, 68, 0.5);
  color: #b91c1c;
  transform: translateY(-2px) scale(1.05);
  box-shadow: 0 4px 14px rgba(239, 68, 68, 0.25),
              inset 0 1px 0 rgba(255, 255, 255, 0.9);
}

.light-seminaire-card-actions {
  display: flex;
  gap: 0.75rem;
  margin-top: 1.25rem;
  flex-wrap: wrap;
}

.light-seminaire-card-actions .light-btn {
  flex: 1;
  min-width: 100px;
  padding: 10px 18px;
  font-size: 14px;
}

/* Ensure all interactive elements work properly */
button, input, select, textarea, a {
  pointer-events: auto !important;
  position: relative;
  z-index: 1;
}

.light-dashboard button,
.light-dashboard input,
.light-dashboard select,
.light-dashboard textarea {
  pointer-events: auto !important;
  cursor: pointer;
}

.light-dashboard input[type="text"],
.light-dashboard input[type="number"],
.light-dashboard input[type="email"],
.light-dashboard input[type="file"],
.light-dashboard input[type="datetime-local"],
.light-dashboard textarea {
  cursor: text !important;
}

.light-dashboard input[type="checkbox"] {
  cursor: pointer !important;
}

@media (max-width: 768px) {
  .light-mobile-header {
    display: flex;
  }

  .light-sidebar {
    transform: translateX(-100%);
  }

  .light-sidebar.open {
    transform: translateX(0);
  }

  .light-close-sidebar {
    display: block;
  }

  .light-main-content {
    margin-left: 0;
    padding: 1rem;
  }

  .light-welcome-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }

  .light-welcome-header h1 {
    font-size: 2rem;
  }

  .light-search-filter-container {
    flex-direction: column;
    align-items: stretch;
  }

  .light-section-header {
    flex-direction: column;
    align-items: stretch;
    gap: 1rem;
  }

  .light-offres-list {
    grid-template-columns: 1fr;
  }
}

/* Enhanced focus states for accessibility */
.light-action-button:focus,
.light-theme-toggle-button:focus,
.light-btn:focus,
.light-section-action:focus {
  outline: 2px solid #ec4899;
  outline-offset: 2px;
}

/* Smooth transitions for theme switching */
* {
  transition: background-color 0.3s ease, border-color 0.3s ease, color 0.3s ease;
}
      `}</style>
    </div>
  )
}

export default OffresPage
