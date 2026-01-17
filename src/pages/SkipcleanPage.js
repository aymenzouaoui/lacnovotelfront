"use client"

import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import API from "../services/api"
import "./SkipCleansPage.css"

const SkipCleansPage = () => {
  const navigate = useNavigate()
  const [skipCleans, setSkipCleans] = useState([])
  const [editId, setEditId] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [user, setUser] = useState({ username: "", email: "" })
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [currentTime, setCurrentTime] = useState(new Date())
  const [searchTerm, setSearchTerm] = useState("")
  const [sortOrder, setSortOrder] = useState("newest")
  const [viewMode, setViewMode] = useState("grid")

  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem("theme")
    return savedTheme ? savedTheme === "dark" : true
  })

  const [formData, setFormData] = useState({
    date: "",
    room: "",
    name: "",
    email: "",
  })

  const fetchSkipCleans = async () => {
    try {
      setIsLoading(true)
      const res = await API.get("/skipcleans")
      setSkipCleans(res.data)
    } catch (error) {
      console.error("Erreur chargement skip cleans:", error)
      alert("Erreur de chargement")
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer cette demande ?")) return

    try {
      setIsLoading(true)
      await API.delete(`/skipcleans/${id}`)
      alert("Demande supprimée avec succès")
      fetchSkipCleans()
    } catch (error) {
      console.error("Erreur suppression skip clean:", error)
      alert("Erreur lors de la suppression")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (!token) navigate("/")

    const userData = JSON.parse(localStorage.getItem("user") || '{"username":"Admin","email":"admin@hotel.com"}')
    setUser(userData)

    const loadTimer = setTimeout(() => setIsLoading(false), 800)
    const timer = setInterval(() => setCurrentTime(new Date()), 60000)

    fetchSkipCleans()

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
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      if (editId) {
        await API.put(`/skipcleans/${editId}`, formData)
        alert("Demande modifiée avec succès")
      } else {
        await API.post("/skipcleans", formData)
        alert("Demande créée avec succès")
      }

      fetchSkipCleans()
      resetForm()
    } catch (error) {
      console.error("Erreur enregistrement:", error)
      alert("Erreur lors de l'enregistrement")
    } finally {
      setIsLoading(false)
    }
  }

  const handleEdit = (skipClean) => {
    setFormData({
      date: skipClean.date ? new Date(skipClean.date).toISOString().split("T")[0] : "",
      room: skipClean.room || "",
      name: skipClean.name || "",
      email: skipClean.email || "",
    })
    setEditId(skipClean._id)
    setShowForm(true)
  }

  const resetForm = () => {
    setFormData({
      date: "",
      room: "",
      name: "",
      email: "",
    })
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

  const filteredSkipCleans = skipCleans
    .filter(
      (sc) =>
        sc.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sc.room?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sc.email?.toLowerCase().includes(searchTerm.toLowerCase()),
    )
    .sort((a, b) => {
      if (sortOrder === "newest") {
        return new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
      } else if (sortOrder === "oldest") {
        return new Date(a.createdAt || 0) - new Date(b.createdAt || 0)
      } else if (sortOrder === "alphabetical") {
        return (a.name || "").localeCompare(b.name || "")
      } else if (sortOrder === "date") {
        return new Date(a.date || 0) - new Date(b.date || 0)
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
      {/* Mobile Header */}
      <div className={isDarkMode ? "mobile-header" : "light-mobile-header"}>
        <button className={isDarkMode ? "menu-toggle" : "light-menu-toggle"} onClick={toggleSidebar}>
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

      {/* Sidebar */}
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
              <a href="#skipcleans">
                <span className={isDarkMode ? "nav-icon" : "light-nav-icon"}>🧹</span>
                <span>Skip Cleans</span>
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

      {/* Main Content */}
      <div className={isDarkMode ? "main-content" : "light-main-content"}>
        <div className={isDarkMode ? "welcome-section" : "light-welcome-section"}>
          <div className={isDarkMode ? "welcome-header" : "light-welcome-header"}>
            <h1>
              Skip Cleans <span className={isDarkMode ? "wave-emoji" : "light-wave-emoji"}>🧹</span>
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
          <p>Gérez les demandes de nettoyage différé</p>
        </div>

        <div className={isDarkMode ? "search-filter-container" : "light-search-filter-container"}>
          <div className={isDarkMode ? "search-container" : "light-search-container"}>
            <span className="search-icon">🔍</span>
            <input
              className={isDarkMode ? "search-input" : "light-search-input"}
              type="text"
              placeholder="Rechercher par nom, chambre ou email..."
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
              <option value="date">Par date de skip</option>
            </select>
          </div>
        </div>

        <div className={isDarkMode ? "section-header" : "light-section-header"}>
          <h2>Liste des demandes</h2>
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
            <form onSubmit={handleSubmit} className={isDarkMode ? "skipclean-form" : "light-skipclean-form"}>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                className={isDarkMode ? "form-input" : "light-form-input"}
              />
              <input
                type="text"
                name="room"
                value={formData.room}
                onChange={handleChange}
                placeholder="Numéro de chambre"
                className={isDarkMode ? "form-input" : "light-form-input"}
              />
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Nom du client"
                className={isDarkMode ? "form-input" : "light-form-input"}
              />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email"
                className={isDarkMode ? "form-input" : "light-form-input"}
              />

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

        {filteredSkipCleans.length === 0 ? (
          <div className={isDarkMode ? "empty-state" : "light-empty-state"}>
            <div className="empty-icon">🧹</div>
            <h3>Aucune demande trouvée</h3>
            <p>Les demandes de skip clean apparaîtront ici</p>
          </div>
        ) : (
          <div
            className={`${isDarkMode ? "skipcleans-list" : "light-skipcleans-list"} ${viewMode === "list" ? "list-view" : ""}`}
          >
            {filteredSkipCleans.map((skipClean) => (
              <div key={skipClean._id} className={isDarkMode ? "skipclean-card" : "light-skipclean-card"}>
                <h3>👤 {skipClean.name || "Sans nom"}</h3>
                <p>
                  <strong>🚪 Chambre:</strong> {skipClean.room || "N/A"}
                </p>
                <p>
                  <strong>📧 Email:</strong> {skipClean.email || "N/A"}
                </p>
                <p>
                  <strong>📅 Date de skip:</strong>{" "}
                  {skipClean.date ? new Date(skipClean.date).toLocaleDateString("fr-FR") : "N/A"}
                </p>
                <p>
                  <strong>🕒 Demandé le:</strong>{" "}
                  {skipClean.createdAt ? new Date(skipClean.createdAt).toLocaleString("fr-FR") : "N/A"}
                </p>
                <div className={isDarkMode ? "card-actions" : "light-card-actions"}>
                  <button
                    onClick={() => handleEdit(skipClean)}
                    className={isDarkMode ? "btn btn-secondary" : "light-btn light-btn-secondary"}
                  >
                    ✏️ Modifier
                  </button>
                  <button
                    onClick={() => handleDelete(skipClean._id)}
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
    </div>
  )
}

export default SkipCleansPage
