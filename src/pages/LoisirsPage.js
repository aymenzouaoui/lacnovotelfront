"use client"

import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import API from "../services/api"
import "./LoisirsPage.css"
import CompressedFileInput from "../components/CompressedFileInput"

const LoisirsPage = () => {
  const navigate = useNavigate()
  const [loisirs, setLoisirs] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    image: null,
    ouverture: "",
    fermeture: "",
    translations: { fr: { name: "", description: "" }, ar: { name: "", description: "" } },
  })
  const [activeLoisirLang, setActiveLoisirLang] = useState("fr")
  const [editId, setEditId] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [previewImage, setPreviewImage] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [sortOrder, setSortOrder] = useState("newest")
  const [viewMode, setViewMode] = useState("grid")
  const [user, setUser] = useState({ username: "", email: "" })
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [currentTime, setCurrentTime] = useState(new Date())

  // Theme state with localStorage initialization
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem("theme")
    return savedTheme ? savedTheme === "dark" : true
  })

  const fetchLoisirs = async () => {
    setIsLoading(true)
    try {
      const res = await API.get("/loisirs")
      setLoisirs(res.data)
    } catch (error) {
      console.error("Erreur lors du chargement des Services:", error)
      alert("Impossible de charger les Services")
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

    fetchLoisirs()

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

  const handleChange = (e) => {
    const { name, value, files } = e.target
    if (name === "image" && files && files[0]) {
      setFormData((prev) => ({ ...prev, image: files[0] }))
      const reader = new FileReader()
      reader.onloadend = () => setPreviewImage(reader.result)
      reader.readAsDataURL(files[0])
    } else if (name.startsWith("tr_")) {
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

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const form = new FormData()
      form.append("name", formData.name ?? "")
      form.append("description", formData.description ?? "")
      form.append(
        "translations",
        JSON.stringify({
          fr: formData.translations?.fr || { name: "", description: "" },
          ar: formData.translations?.ar || { name: "", description: "" },
        }),
      )
      if (formData.image) form.append("image", formData.image)
      if (formData.ouverture) form.append("ouverture", formData.ouverture)
      if (formData.fermeture) form.append("fermeture", formData.fermeture)

      if (editId) {
        await API.put(`/loisirs/${editId}`, form, {
          headers: { "Content-Type": "multipart/form-data" },
        })
        alert("Service modifié avec succès")
      } else {
        await API.post("/loisirs", form, {
          headers: { "Content-Type": "multipart/form-data" },
        })
        alert("Service créé avec succès")
      }

      resetForm()
      fetchLoisirs()
    } catch (error) {
      console.error("Erreur lors de l'enregistrement:", error)
      alert(editId ? "Échec de la modification" : "Échec de la création")
      setIsLoading(false)
    }
  }

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      image: null,
      ouverture: "",
      fermeture: "",
      translations: { fr: { name: "", description: "" }, ar: { name: "", description: "" } },
    })
    setEditId(null)
    setShowForm(false)
    setPreviewImage(null)
    setIsLoading(false)
  }

  const formatDateForInput = (dateString) => {
    if (!dateString) return ""
    const date = new Date(dateString)
    return date.toISOString().slice(0, 16) // Format for datetime-local input
  }

  const formatDateForDisplay = (dateString) => {
    if (!dateString) return "Non définie"
    const date = new Date(dateString)
    return date.toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const renderStatusBadge = (loisir) => {
    const now = new Date()
    const start = loisir.ouverture ? new Date(loisir.ouverture) : null
    const end = loisir.fermeture ? new Date(loisir.fermeture) : null

    let label = "Sans date"
    let tone = "unknown"

    if (start && end) {
      if (now < start) {
        label = "À venir"
        tone = "upcoming"
      } else if (now > end) {
        label = "Terminé"
        tone = "ended"
      } else {
        label = "En cours"
        tone = "active"
      }
    }

    return (
      <span className={`loisir-status-badge loisir-status-${tone}`}>
        <span className="loisir-status-dot" />
        {label}
      </span>
    )
  }

  const handleEdit = (loisir) => {
    const tr = loisir.translations || {}
    setFormData({
      name: loisir.name ?? "",
      description: loisir.description ?? "",
      image: null,
      ouverture: formatDateForInput(loisir.ouverture),
      fermeture: formatDateForInput(loisir.fermeture),
      translations: {
        fr: { name: (tr.fr && tr.fr.name) || "", description: (tr.fr && tr.fr.description) || "" },
        ar: { name: (tr.ar && tr.ar.name) || "", description: (tr.ar && tr.ar.description) || "" },
      },
    })
    setEditId(loisir._id)
    setShowForm(true)
    setPreviewImage(loisir.image ? `${loisir.image}` : null)
  }

  const handleDelete = async (id) => {
    try {
      if (window.confirm("Êtes-vous sûr de vouloir supprimer ce Service ?")) {
        setIsLoading(true)
        await API.delete(`/loisirs/${id}`)
        alert("Service supprimé avec succès")
        fetchLoisirs()
      }
    } catch (error) {
      console.error("Erreur lors de la suppression:", error)
      alert("Échec de la suppression")
      setIsLoading(false)
    }
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

  const filteredLoisirs = loisirs
    .filter(
      (l) =>
        l.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        l.description?.toLowerCase().includes(searchTerm.toLowerCase()),
    )
    .sort((a, b) => {
      if (sortOrder === "newest") {
        return new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
      } else if (sortOrder === "oldest") {
        return new Date(a.createdAt || 0) - new Date(b.createdAt || 0)
      } else if (sortOrder === "alphabetical") {
        return a.name.localeCompare(b.name)
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
              <a href="#loisirs">
                <span className={isDarkMode ? "nav-icon" : "light-nav-icon"}>🎯</span>
                <span>Services</span>
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
              Services <span className={isDarkMode ? "wave-emoji" : "light-wave-emoji"}>🎯</span>
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
          <p>Gérez vos activités de Services</p>
        </div>

        <div className={isDarkMode ? "search-filter-container" : "light-search-filter-container"}>
          <div className={isDarkMode ? "search-container" : "light-search-container"}>
            <span className="search-icon">🔍</span>
            <input
              className={isDarkMode ? "search-input" : "light-search-input"}
              type="text"
              placeholder="Rechercher un Service..."
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

        <div className={isDarkMode ? "section-header" : "light-section-header"}>
          <h2>Liste des Services</h2>
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
            <form onSubmit={handleSubmit} className={isDarkMode ? "loisir-form" : "light-loisir-form"}>
              <label className={isDarkMode ? "form-label" : "light-form-label"}>Nom (par défaut) *</label>
              <input
                type="text"
                name="name"
                placeholder="Nom du Service"
                value={formData.name}
                onChange={handleChange}
                required
                className={isDarkMode ? "form-input" : "light-form-input"}
              />
              <label className={isDarkMode ? "form-label" : "light-form-label"}>Description (par défaut)</label>
              <textarea
                name="description"
                placeholder="Description du Service"
                value={formData.description}
                onChange={handleChange}
                className={isDarkMode ? "form-input" : "light-form-input"}
              />
              <div className={isDarkMode ? "form-label" : "light-form-label"} style={{ marginTop: "0.5rem" }}>Traductions (FR / AR)</div>
              <div style={{ display: "flex", gap: "0.5rem", marginBottom: "0.5rem" }}>
                <button type="button" className={activeLoisirLang === "fr" ? (isDarkMode ? "btn btn-primary" : "light-btn light-btn-primary") : (isDarkMode ? "btn btn-secondary" : "light-btn light-btn-secondary")} onClick={() => setActiveLoisirLang("fr")}>Français</button>
                <button type="button" className={activeLoisirLang === "ar" ? (isDarkMode ? "btn btn-primary" : "light-btn light-btn-primary") : (isDarkMode ? "btn btn-secondary" : "light-btn light-btn-secondary")} onClick={() => setActiveLoisirLang("ar")}>العربية</button>
              </div>
              <input type="text" name={`tr_${activeLoisirLang}_name`} value={formData.translations?.[activeLoisirLang]?.name ?? ""} onChange={handleChange} placeholder={activeLoisirLang === "fr" ? "Nom FR" : "الاسم"} className={isDarkMode ? "form-input" : "light-form-input"} />
              <textarea name={`tr_${activeLoisirLang}_description`} value={formData.translations?.[activeLoisirLang]?.description ?? ""} onChange={handleChange} placeholder={activeLoisirLang === "fr" ? "Description FR" : "الوصف"} className={isDarkMode ? "form-input" : "light-form-input"} rows={2} />

              <div className={isDarkMode ? "date-inputs" : "light-date-inputs"}>
                <div className={isDarkMode ? "date-input-group" : "light-date-input-group"}>
                  <label htmlFor="ouverture" className={isDarkMode ? "form-label" : "light-form-label"}>
                    Date d'ouverture:
                  </label>
                  <input
                    type="datetime-local"
                    id="ouverture"
                    name="ouverture"
                    value={formData.ouverture}
                    onChange={handleChange}
                    className={isDarkMode ? "form-input" : "light-form-input"}
                  />
                </div>

                <div className={isDarkMode ? "date-input-group" : "light-date-input-group"}>
                  <label htmlFor="fermeture" className={isDarkMode ? "form-label" : "light-form-label"}>
                    Date de fermeture:
                  </label>
                  <input
                    type="datetime-local"
                    id="fermeture"
                    name="fermeture"
                    value={formData.fermeture}
                    onChange={handleChange}
                    className={isDarkMode ? "form-input" : "light-form-input"}
                  />
                </div>
              </div>

         <CompressedFileInput
  type="file"
  name="image"
  accept="image/*"
  onChange={handleChange}
  className={isDarkMode ? "form-input" : "light-form-input"}
/>

              {previewImage && <img src={previewImage || "/placeholder.svg"} alt="Aperçu" className="preview-img" />}

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
                  disabled={isLoading}
                >
                  ❌ Annuler
                </button>
              </div>
            </form>
          </div>
        )}

        {filteredLoisirs.length === 0 ? (
          <div className={isDarkMode ? "empty-state" : "light-empty-state"}>
            <div className="empty-icon">🎯</div>
            <h3>Aucun Service trouvé</h3>
            <p>Commencez par créer un nouveau Service</p>
            <button
              className={isDarkMode ? "btn btn-primary" : "light-btn light-btn-primary"}
              onClick={() => setShowForm(true)}
            >
              Créer un Service
            </button>
          </div>
        ) : (
          <div
            className={`${isDarkMode ? "loisirs-list" : "light-loisirs-list"} ${viewMode === "list" ? "list-view" : ""}`}
          >
            {filteredLoisirs.map((loisir) => (
              <div key={loisir._id} className={isDarkMode ? "loisir-card" : "light-loisir-card"}>
                {loisir.image && (
                  <img
                    src={loisir.image || "/placeholder.svg"}
                    alt={loisir.name}
                    className="card-image"
                    onError={(e) => (e.target.src = "/placeholder.svg")}
                  />
                )}
                <div className="loisir-card-header">
                  <h2>{loisir.name}</h2>
                  {renderStatusBadge(loisir)}
                </div>
                <p>{loisir.description}</p>

                <div className={isDarkMode ? "date-info" : "light-date-info"}>
                  <div className={isDarkMode ? "date-item" : "light-date-item"}>
                    <strong>Ouverture:</strong> {formatDateForDisplay(loisir.ouverture)}
                  </div>
                  <div className={isDarkMode ? "date-item" : "light-date-item"}>
                    <strong>Fermeture:</strong> {formatDateForDisplay(loisir.fermeture)}
                  </div>
                </div>

                <div className={isDarkMode ? "seminaire-card-actions" : "light-seminaire-card-actions"}>
                  <button
                    onClick={() => handleEdit(loisir)}
                    className={isDarkMode ? "btn btn-secondary" : "light-btn light-btn-secondary"}
                  >
                    ✏️ Modifier
                  </button>
                  <button
                    onClick={() => handleDelete(loisir._id)}
                    className={isDarkMode ? "btn btn-danger" : "light-btn light-btn-danger"}
                  >
                    🗑️ Supprimer
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <style jsx>{`
/* Light Mode Styles for Loisirs Page */
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
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  z-index: 1;
}

.light-action-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(236, 72, 153, 0.2);
  background: linear-gradient(45deg, #ec4899, #8b5cf6);
  color: white;
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
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  font-size: 1.2rem;
  position: relative;
  z-index: 1;
}

.light-theme-toggle-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(236, 72, 153, 0.2);
  background: linear-gradient(45deg, #ec4899, #8b5cf6);
  color: white;
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
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: linear-gradient(45deg, #ec4899, #8b5cf6);
  color: white;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 500;
  box-shadow: 0 4px 12px rgba(236, 72, 153, 0.3);
}

.light-section-action:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(236, 72, 153, 0.4);
  background: linear-gradient(45deg, #db2777, #7c3aed);
}

.light-form-container {
  background: linear-gradient(135deg, #ffffff 0%, #fdf2f8 100%);
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  padding: 2rem;
  margin-bottom: 2rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.light-loisir-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.light-form-input {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  background: #ffffff;
  color: #1e293b;
  font-size: 1rem;
  transition: all 0.3s ease;
  font-family: inherit;
}

.light-form-input:focus {
  outline: none;
  border-color: #ec4899;
  box-shadow: 0 0 0 3px rgba(236, 72, 153, 0.1);
}

.light-form-input::placeholder {
  color: #94a3b8;
}

.light-form-label {
  color: #1e293b;
  font-weight: 500;
  margin-bottom: 0.5rem;
}

.light-date-inputs {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.light-date-input-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.light-form-actions {
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
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
  background: linear-gradient(45deg, #ec4899, #8b5cf6);
  color: white;
  box-shadow: 0 4px 12px rgba(236, 72, 153, 0.3);
}

.light-btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(236, 72, 153, 0.4);
  background: linear-gradient(45deg, #db2777, #7c3aed);
}

.light-btn-secondary {
  background: linear-gradient(135deg, #ffffff 0%, #f1f5f9 100%);
  color: #64748b;
  border: 2px solid #e2e8f0;
}

.light-btn-secondary:hover {
  background: linear-gradient(45deg, #ec4899, #8b5cf6);
  color: white;
  border-color: transparent;
}

.light-btn-danger {
  background: linear-gradient(45deg, #ef4444, #dc2626);
  color: white;
  box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);
}

.light-btn-danger:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(239, 68, 68, 0.4);
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

.light-loisirs-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
  margin-top: 1rem;
}

.light-loisirs-list.list-view {
  grid-template-columns: 1fr;
}

.light-loisir-card {
  background: linear-gradient(135deg, #ffffff 0%, #fdf2f8 100%);
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  padding: 1.5rem;
}

.light-loisir-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 25px rgba(236, 72, 153, 0.15);
}

.light-loisir-card h2 {
  color: #1e293b;
  margin-bottom: 1rem;
  font-size: 1.25rem;
  font-weight: 600;
}

.light-loisir-card p {
  color: #64748b;
  margin-bottom: 0.5rem;
}

.light-date-info {
  margin: 1rem 0;
  padding: 1rem;
  background: rgba(236, 72, 153, 0.05);
  border-radius: 8px;
  border-left: 4px solid #ec4899;
}

.light-date-item {
  margin-bottom: 0.5rem;
  color: #64748b;
}

.light-date-item strong {
  color: #1e293b;
}

.light-seminaire-card-actions {
  display: flex;
  gap: 0.5rem;
  margin-top: 1rem;
}

/* Status badge styles (shared light/dark) */
.loisir-card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 0.75rem;
}

.loisir-status-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 0.25rem 0.75rem;
  border-radius: 999px;
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.02em;
  border: 1px solid transparent;
  white-space: nowrap;
}

.loisir-status-dot {
  width: 8px;
  height: 8px;
  border-radius: 999px;
}

.loisir-status-active {
  background: rgba(34, 197, 94, 0.12);
  border-color: rgba(34, 197, 94, 0.4);
  color: #16a34a;
}

.loisir-status-active .loisir-status-dot {
  background: #22c55e;
}

.loisir-status-upcoming {
  background: rgba(59, 130, 246, 0.12);
  border-color: rgba(59, 130, 246, 0.4);
  color: #2563eb;
}

.loisir-status-upcoming .loisir-status-dot {
  background: #3b82f6;
}

.loisir-status-ended {
  background: rgba(148, 163, 184, 0.16);
  border-color: rgba(148, 163, 184, 0.5);
  color: #64748b;
}

.loisir-status-ended .loisir-status-dot {
  background: #94a3b8;
}

.loisir-status-unknown {
  background: rgba(251, 191, 36, 0.12);
  border-color: rgba(251, 191, 36, 0.4);
  color: #b45309;
}

.loisir-status-unknown .loisir-status-dot {
  background: #fbbf24;
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

  .light-date-inputs {
    grid-template-columns: 1fr;
  }

  .light-loisirs-list {
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

export default LoisirsPage
