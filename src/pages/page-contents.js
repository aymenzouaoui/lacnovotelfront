"use client"

import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import API from "../services/api"
import "./PageContentsPage.css"
import CompressedFileInput from "../components/CompressedFileInput"
import RichTextEditor from "../components/RichTextEditor"

const PageContentsPage = () => {
  const navigate = useNavigate()
  const [pageContents, setPageContents] = useState([])
  const [formData, setFormData] = useState({
    pageName: "",
    description: "",
    image: null,
  })

  // Add image preview state
  const [previewImage, setPreviewImage] = useState(null)

  const [editId, setEditId] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [user, setUser] = useState({ username: "", email: "" })
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [currentTime, setCurrentTime] = useState(new Date())
  const [searchTerm, setSearchTerm] = useState("")
  const [sortOrder, setSortOrder] = useState("newest")
  const [viewMode, setViewMode] = useState("grid")

  // Theme state with localStorage initialization
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem("theme")
    return savedTheme ? savedTheme === "dark" : true
  })

  const fetchPageContents = async () => {
    try {
      setIsLoading(true)
      const res = await API.get("/page-contents")
      setPageContents(res.data)
    } catch (error) {
      console.error("Erreur chargement contenus de page:", error)
      alert("Erreur de chargement")
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (id) => {
    try {
      setIsLoading(true)
      await API.delete(`/page-contents/${id}`)
      alert("Contenu de page supprimé avec succès")
      fetchPageContents()
    } catch (error) {
      console.error("Erreur suppression contenu de page:", error)
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

    fetchPageContents()

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

  // Update the handleChange function to handle image files
  const handleChange = (e) => {
    const { name, value, files } = e.target

    if (name === "image" && files && files[0]) {
      const image = files[0]
      setFormData((prev) => ({ ...prev, image }))

      // Create preview for the image
      const reader = new FileReader()
      reader.onloadend = () => setPreviewImage(reader.result)
      reader.readAsDataURL(image)
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const form = new FormData()
      form.append("pageName", formData.pageName)
      form.append("description", formData.description)

      if (formData.image) {
        form.append("image", formData.image)
      }

      if (editId) {
        await API.put(`/page-contents/${editId}`, form, {
          headers: { "Content-Type": "multipart/form-data" },
        })
        alert("Contenu de page modifié avec succès")
      } else {
        await API.post("/page-contents", form, {
          headers: { "Content-Type": "multipart/form-data" },
        })
        alert("Contenu de page créé avec succès")
      }

      fetchPageContents()
      resetForm()
    } catch (error) {
      console.error("Erreur enregistrement:", error)
      alert("Erreur lors de l'enregistrement")
    } finally {
      setIsLoading(false)
    }
  }

  const handleEdit = (pageContent) => {
    setFormData({
      pageName: pageContent.pageName,
      description: pageContent.description,
      image: null,
    })
    setPreviewImage(pageContent.image)
    setEditId(pageContent._id)
    setShowForm(true)
  }

  const resetForm = () => {
    setFormData({
      pageName: "",
      description: "",
      image: null,
    })
    setPreviewImage(null)
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

  const filteredPageContents = pageContents
    .filter(
      (pc) =>
        pc.pageName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pc.description?.toLowerCase().includes(searchTerm.toLowerCase()),
    )
    .sort((a, b) => {
      if (sortOrder === "newest") {
        return new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
      } else if (sortOrder === "oldest") {
        return new Date(a.createdAt || 0) - new Date(b.createdAt || 0)
      } else if (sortOrder === "alphabetical") {
        return a.pageName.localeCompare(b.pageName)
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
            <li>
              <a href="#offres" onClick={() => navigate("/offres")}>
                <span className={isDarkMode ? "nav-icon" : "light-nav-icon"}>🎯</span>
                <span>Offres Spéciales</span>
              </a>
            </li>
            <li className="active">
              <a href="#page-contents">
                <span className={isDarkMode ? "nav-icon" : "light-nav-icon"}>📄</span>
                <span>Contenus de Pages</span>
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
              Contenus de Pages <span className={isDarkMode ? "wave-emoji" : "light-wave-emoji"}>📄</span>
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
          <p>Gérez le contenu de vos différentes pages</p>
        </div>

        <div className={isDarkMode ? "search-filter-container" : "light-search-filter-container"}>
          <div className={isDarkMode ? "search-container" : "light-search-container"}>
            <span className="search-icon">🔍</span>
            <input
              className={isDarkMode ? "search-input" : "light-search-input"}
              type="text"
              placeholder="Rechercher un contenu de page..."
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
          <h2>Liste des contenus de pages</h2>
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
              <div style={{ marginBottom: "15px" }}>
                <label style={{ display: "block", marginBottom: "8px", fontWeight: "600" }}>
                  Page où le contenu sera affiché :
                </label>
                <select
                  name="pageName"
                  value={formData.pageName}
                  onChange={handleChange}
                  required
                  className={isDarkMode ? "form-input" : "light-form-input"}
                  style={{ width: "100%" }}
                >
                  <option value="">Sélectionner une page</option>
                  <option value="Spa">Spa (affiché sur /spas-client)</option>
                  <option value="Restaurants">Restaurants (affiché sur /RestaurantsMenus-client)</option>
                  <option value="Boissons">Boissons (affiché sur /boissons-client)</option>
                  <option value="TerrassePiscine">Terrasse Piscine (affiché sur /terrasse-piscine-client)</option>
                  <option value="Seminaire">Séminaire (affiché sur /seminaires-client)</option>
                  <option value="Roomservice">Room Service (affiché sur /roomservices-client)</option>
                  <option value="Chambres">Chambres (affiché sur /chambres-client)</option>
                </select>
                {formData.pageName && (
                  <div
                    style={{
                      marginTop: "8px",
                      padding: "10px",
                      backgroundColor: isDarkMode ? "rgba(0, 41, 132, 0.1)" : "rgba(0, 41, 132, 0.05)",
                      borderRadius: "6px",
                      fontSize: "13px",
                      color: isDarkMode ? "#a0c4ff" : "#002984",
                    }}
                  >
                    📍 Ce contenu sera visible sur la page client :{" "}
                    <strong>
                      {formData.pageName === "Spa" && "/spas-client"}
                      {formData.pageName === "Restaurants" && "/RestaurantsMenus-client"}
                      {formData.pageName === "Boissons" && "/boissons-client"}
                      {formData.pageName === "TerrassePiscine" && "/terrasse-piscine-client"}
                      {formData.pageName === "Seminaire" && "/seminaires-client"}
                      {formData.pageName === "Roomservice" && "/roomservices-client"}
                      {formData.pageName === "Chambres" && "/chambres-client"}
                    </strong>
                  </div>
                )}
              </div>
              <RichTextEditor
                content={formData.description}
                onChange={(html) => setFormData(prev => ({ ...prev, description: html }))}
                isDarkMode={isDarkMode}
              />

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
                >
                  ❌ Annuler
                </button>
              </div>
            </form>
          </div>
        )}

        {filteredPageContents.length === 0 ? (
          <div className={isDarkMode ? "empty-state" : "light-empty-state"}>
            <div className="empty-icon">📄</div>
            <h3>Aucun contenu de page trouvé</h3>
            <p>Commencez par créer un nouveau contenu de page</p>
            <button
              className={isDarkMode ? "btn btn-primary" : "light-btn light-btn-primary"}
              onClick={() => setShowForm(true)}
            >
              Créer un contenu
            </button>
          </div>
        ) : (
          <div
            className={`${isDarkMode ? "offres-list" : "light-offres-list"} ${viewMode === "list" ? "list-view" : ""}`}
          >
            {filteredPageContents.map((pageContent) => (
              <div key={pageContent._id} className={isDarkMode ? "offre-card" : "light-offre-card"}>
                {pageContent.image && (
                  <img
                    src={pageContent.image || "/placeholder.svg"}
                    alt={pageContent.pageName}
                    className="card-image"
                  />
                )}
                <h3>{pageContent.pageName}</h3>
                <div
                  style={{
                    marginBottom: "10px",
                    padding: "8px 12px",
                    backgroundColor: isDarkMode ? "rgba(0, 41, 132, 0.15)" : "rgba(0, 41, 132, 0.08)",
                    borderRadius: "6px",
                    fontSize: "12px",
                    color: isDarkMode ? "#a0c4ff" : "#002984",
                  }}
                >
                  🌐 <strong>Affiché sur:</strong>{" "}
                  {pageContent.pageName === "Spa" && "/spas-client"}
                  {pageContent.pageName === "Restaurants" && "/RestaurantsMenus-client"}
                  {pageContent.pageName === "Boissons" && "/boissons-client"}
                  {pageContent.pageName === "TerrassePiscine" && "/terrasse-piscine-client"}
                  {pageContent.pageName === "Seminaire" && "/seminaires-client"}
                  {pageContent.pageName === "Roomservice" && "/roomservices-client"}
                  {pageContent.pageName === "Chambres" && "/chambres-client"}
                </div>
                <div
                  className={isDarkMode ? "page-content-html" : "page-content-html-light"}
                  dangerouslySetInnerHTML={{ __html: pageContent.description }}
                />
                <p>
                  📅 <strong>Créé le:</strong> {new Date(pageContent.createdAt).toLocaleDateString("fr-FR")}
                </p>
                <p>
                  🔄 <strong>Modifié le:</strong> {new Date(pageContent.updatedAt).toLocaleDateString("fr-FR")}
                </p>
                <div className={isDarkMode ? "seminaire-card-actions" : "light-seminaire-card-actions"}>
                  <button
                    onClick={() => handleEdit(pageContent)}
                    className={isDarkMode ? "edit-btn btn btn-secondary" : "light-btn light-btn-secondary"}
                  >
                    ✏️ Modifier
                  </button>
                  <button
                    onClick={() => handleDelete(pageContent._id)}
                    className={isDarkMode ? "btn-delete btn btn-danger" : "light-btn light-btn-danger"}
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

.light-offre-form {
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
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.light-checkbox-label {
  flex-direction: row;
  align-items: center;
  gap: 0.5rem;
}

.light-form-checkbox {
  width: auto;
  margin: 0;
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

.light-seminaire-card-actions {
  display: flex;
  gap: 0.5rem;
  margin-top: 1rem;
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

export default PageContentsPage
