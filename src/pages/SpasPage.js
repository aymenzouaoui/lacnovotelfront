"use client"

import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import API from "../services/api"
import "./SpasPage.css"
import CompressedFileInput from "../components/CompressedFileInput"

const SpaCategoriesPage = () => {
  const navigate = useNavigate()
  const [categories, setCategories] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    services: [
      {
        name: "",
        description: "",
        reservable: true,
        duration: "",
        prices: { TND: 0, EUR: 0 },
      },
    ],
  })
  const [imageFile, setImageFile] = useState(null)
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

  const fetchCategories = async () => {
    setIsLoading(true)
    try {
      const res = await API.get("/spa-categories")
      setCategories(res.data)
    } catch (error) {
      console.error("Erreur lors du chargement des catégories:", error)
      alert("Impossible de charger les catégories")
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (categoryId) => {
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer cette catégorie ?")) {
      return
    }

    setIsLoading(true)
    try {
      await API.delete(`/spa-categories/${categoryId}`)
      alert("Catégorie supprimée avec succès")
      fetchCategories()
    } catch (error) {
      console.error("Erreur lors de la suppression de la catégorie:", error)
      alert("Échec de la suppression")
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

    fetchCategories()

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

  const handleTitleChange = (value) => {
    setFormData({ ...formData, title: value })
  }

  const handleServiceChange = (serviceIndex, field, value) => {
    const updatedServices = [...formData.services]
    if (field === "prices") {
      updatedServices[serviceIndex].prices = value
    } else {
      updatedServices[serviceIndex][field] = value
    }
    setFormData({ ...formData, services: updatedServices })
  }

  const addService = () => {
    setFormData({
      ...formData,
      services: [
        ...formData.services,
        {
          name: "",
          description: "",
          reservable: true,
          duration: "",
          prices: { TND: 0, EUR: 0 },
        },
      ],
    })
  }

  const removeService = (serviceIndex) => {
    const updatedServices = formData.services.filter((_, index) => index !== serviceIndex)
    setFormData({ ...formData, services: updatedServices })
  }

  const handleImageChange = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      setImageFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreviewImage(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const formDataToSend = new FormData()
      formDataToSend.append("title", formData.title)
      formDataToSend.append("services", JSON.stringify(formData.services))

      if (imageFile) {
        formDataToSend.append("image", imageFile)
      }

      if (editId) {
        await API.put(`/spa-categories/${editId}`, formDataToSend, {
          headers: { "Content-Type": "multipart/form-data" },
        })
        alert("Catégorie modifiée avec succès")
      } else {
        await API.post("/spa-categories", formDataToSend, {
          headers: { "Content-Type": "multipart/form-data" },
        })
        alert("Catégorie créée avec succès")
      }

      resetForm()
      fetchCategories()
    } catch (error) {
      console.error("Erreur lors de l'enregistrement:", error)
      alert(editId ? "Échec de la modification" : "Échec de la création")
      setIsLoading(false)
    }
  }

  const resetForm = () => {
    setFormData({
      title: "",
      services: [
        {
          name: "",
          description: "",
          reservable: true,
          duration: "",
          prices: { TND: 0, EUR: 0 },
        },
      ],
    })
    setImageFile(null)
    setEditId(null)
    setShowForm(false)
    setPreviewImage(null)
    setIsLoading(false)
  }

  const handleEdit = (category) => {
    resetForm()

    setTimeout(() => {
      setFormData({
        title: category.title || "",
        services: category.services || [
          {
            name: "",
            description: "",
            reservable: true,
            duration: "",
            prices: { TND: 0, EUR: 0 },
          },
        ],
      })
      setPreviewImage(category.image || null)
      setEditId(category._id)
      setShowForm(true)
    }, 0)
  }

  const handleCreateNew = () => {
    resetForm()
    setTimeout(() => {
      setShowForm(true)
    }, 0)
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

  const filteredCategories = categories
    .filter((category) => {
      const searchLower = searchTerm.toLowerCase()
      return (
        category.title.toLowerCase().includes(searchLower) ||
        category.services?.some(
          (service) =>
            service.name.toLowerCase().includes(searchLower) || service.description.toLowerCase().includes(searchLower),
        )
      )
    })
    .sort((a, b) => {
      if (sortOrder === "newest") {
        return new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
      } else if (sortOrder === "oldest") {
        return new Date(a.createdAt || 0) - new Date(b.createdAt || 0)
      } else if (sortOrder === "alphabetical") {
        return a.title.localeCompare(b.title)
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
            <li className="active">
              <a href="#spa-categories">
                <span className={isDarkMode ? "nav-icon" : "light-nav-icon"}>💆‍♀️</span>
                <span>Catégories Spa</span>
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
              Catégories Spa <span className={isDarkMode ? "wave-emoji" : "light-wave-emoji"}>💆‍♀️</span>
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
          <p>Gérez les catégories de services spa</p>
        </div>

        <div className={isDarkMode ? "search-filter-container" : "light-search-filter-container"}>
          <div className={isDarkMode ? "search-container" : "light-search-container"}>
            <span className="search-icon">🔍</span>
            <input
              className={isDarkMode ? "search-input" : "light-search-input"}
              type="text"
              placeholder="Rechercher une catégorie..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="view-sort-container">
            <div className={isDarkMode ? "view-toggle" : "light-view-toggle"}>
              <button
                className={`${isDarkMode ? "view-btn" : "light-view-btn"} ${viewMode === "grid" ? "active" : ""}`}
                onClick={() => setViewMode("grid")}
                aria-label="Vue en grille"
              >
                ▦
              </button>
              <button
                className={`${isDarkMode ? "view-btn" : "light-view-btn"} ${viewMode === "list" ? "active" : ""}`}
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
          <h2>Liste des Catégories</h2>
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
            <form onSubmit={handleSubmit} className={isDarkMode ? "spa-form" : "light-spa-form"}>
              <div className="category-section">
                <h3>Informations de la Catégorie</h3>

                <div className="form-group">
                  <label>Titre de la catégorie</label>
                  <input
                    type="text"
                    placeholder="Ex: FORFAITS / PACKAGE"
                    value={formData.title}
                    onChange={(e) => handleTitleChange(e.target.value)}
                    required
                    className={isDarkMode ? "category-title-input" : "light-form-input category-title-input"}
                  />
                </div>

                <div className="form-group">
                  <label>Image de la catégorie</label>
               <CompressedFileInput
  type="file"
  accept="image/*"
  onChange={handleImageChange}
  className={isDarkMode ? "" : "light-form-input"}
/>

                  {previewImage && (
                    <div className="image-preview">
                      <img src={previewImage || "/placeholder.svg"} alt="Preview" />
                    </div>
                  )}
                </div>

                <div className="services-container">
                  <h4>Services</h4>
                  {formData.services.map((service, serviceIndex) => (
                    <div key={serviceIndex} className="service-section">
                      <div className="service-row">
                        <input
                          type="text"
                          placeholder="Nom du service"
                          value={service.name}
                          onChange={(e) => handleServiceChange(serviceIndex, "name", e.target.value)}
                          required
                          className={isDarkMode ? "" : "light-form-input"}
                        />
                        <input
                          type="text"
                          placeholder="Durée (ex: 90mn, 1H25)"
                          value={service.duration}
                          onChange={(e) => handleServiceChange(serviceIndex, "duration", e.target.value)}
                          className={isDarkMode ? "" : "light-form-input"}
                        />
                        {formData.services.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeService(serviceIndex)}
                            className="remove-service-btn"
                          >
                            ❌
                          </button>
                        )}
                      </div>

                      <textarea
                        placeholder="Description du service"
                        value={service.description}
                        onChange={(e) => handleServiceChange(serviceIndex, "description", e.target.value)}
                        className={isDarkMode ? "" : "light-form-input"}
                      />

                      <label className={`service-reservable-label ${isDarkMode ? "dark" : "light"}`}>
                        <input
                          type="checkbox"
                          checked={service.reservable}
                          onChange={(e) => handleServiceChange(serviceIndex, "reservable", e.target.checked)}
                          className="service-reservable-checkbox"
                        />
                        Réservable
                      </label>

                      <div className="prices-row">
                        <div className="price-input">
                          <label>Prix TND:</label>
                          <input
                            type="number"
                            step="0.01"
                            value={service.prices.TND}
                            onChange={(e) =>
                              handleServiceChange(serviceIndex, "prices", {
                                ...service.prices,
                                TND: Number.parseFloat(e.target.value) || 0,
                              })
                            }
                            className={isDarkMode ? "" : "light-form-input"}
                          />
                        </div>
                        <div className="price-input">
                          <label>Prix EUR:</label>
                          <input
                            type="number"
                            step="0.01"
                            value={service.prices.EUR}
                            onChange={(e) =>
                              handleServiceChange(serviceIndex, "prices", {
                                ...service.prices,
                                EUR: Number.parseFloat(e.target.value) || 0,
                              })
                            }
                            className={isDarkMode ? "" : "light-form-input"}
                          />
                        </div>
                      </div>
                    </div>
                  ))}

                  <button type="button" onClick={addService} className="add-service-btn">
                    + Ajouter un service
                  </button>
                </div>
              </div>

              <div className="form-actions">
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

        {filteredCategories.length === 0 ? (
          <div className={isDarkMode ? "empty-state" : "light-empty-state"}>
            <div className="empty-icon">💆‍♀️</div>
            <h3>Aucune catégorie trouvée</h3>
            <p>Commencez par créer une nouvelle catégorie</p>
            <button
              className={isDarkMode ? "btn btn-primary" : "light-btn light-btn-primary"}
              onClick={handleCreateNew}
            >
              Créer une catégorie
            </button>
          </div>
        ) : (
          <div
            className={`${isDarkMode ? "spas-list" : "light-spas-list"} ${viewMode === "list" ? "list-view" : "grid"}`}
          >
            {filteredCategories.map((category) => (
              <div key={category._id} className={isDarkMode ? "spa-card" : "light-spa-card"}>
                {category.image && (
                  <div className="category-image">
                    <img src={category.image || "/placeholder.svg"} alt={category.title} />
                  </div>
                )}
                <div className="spa-content">
                  <h3 className="category-title">{category.title}</h3>
                  <div className="services-list">
                    {category.services?.map((service, serviceIndex) => (
                      <div key={serviceIndex} className="service-item">
                        <div className="service-header">
                          <h4 className="service-name">{service.name}</h4>
                          {service.duration && <span className="service-duration">{service.duration}</span>}
                        </div>
                        {service.description && <p className="service-description">{service.description}</p>}
                        {service.reservable && <span className="reservable-badge">✓ Réservable</span>}
                        <div className="service-prices">
                          <span className="price-tnd">{service.prices.TND} TND</span>
                          <span className="price-eur">{service.prices.EUR} EUR</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="spa-card-actions">
                  <button
                    onClick={() => handleEdit(category)}
                    className={isDarkMode ? "" : "light-btn light-btn-secondary"}
                  >
                    ✏️ Modifier
                  </button>
                  <button
                    onClick={() => handleDelete(category._id)}
                    className={isDarkMode ? "" : "light-btn light-btn-danger"}
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

/* Added styles for image preview and category image display */
.image-preview {
  margin-top: 1rem;
  max-width: 300px;
  border-radius: 8px;
  overflow: hidden;
  border: 2px solid ${isDarkMode ? "#4a5568" : "#e2e8f0"};
}

.image-preview img {
  width: 100%;
  height: auto;
  display: block;
}

.category-image {
  width: 100%;
  height: 200px;
  overflow: hidden;
  border-radius: 12px 12px 0 0;
  margin-bottom: 1rem;
}

.category-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
  color: ${isDarkMode ? "#e2e8f0" : "#374151"};
}

.reservable-badge {
  display: inline-block;
  background: linear-gradient(45deg, #10b981, #059669);
  color: white;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 500;
  margin: 0.5rem 0;
}

/* Light Mode Styles for Spas Page */
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

.service-reservable-label {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  font-size: 16px;
  margin-top: 5px;
  user-select: none;
}

.service-reservable-checkbox {
  width: 18px;
  height: 18px;
  accent-color: #4CAF50;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.service-reservable-label.light {
  color: #111;
}

.service-reservable-label.dark {
  color: #eee;
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
  border: 2px solid transparent;
  background-clip: padding-box;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.light-action-button::before {
  content: "";
  position: absolute;
  inset: 0;
  padding: 2px;
  background: linear-gradient(45deg, #ec4899, #8b5cf6);
  border-radius: 50%;
  mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  mask-composite: exclude;
  -webkit-mask-composite: xor;
}

.light-action-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(236, 72, 153, 0.2);
  background: linear-gradient(45deg, #ec4899, #8b5cf6);
  color: white;
}

.light-action-icon {
  font-size: 1.2rem;
  z-index: 1;
}

.light-theme-toggle-button {
  background: linear-gradient(135deg, #ffffff 0%, #fdf2f8 100%);
  border: 2px solid transparent;
  background-clip: padding-box;
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
}

.light-theme-toggle-button::before {
  content: "";
  position: absolute;
  inset: 0;
  padding: 2px;
  background: linear-gradient(45deg, #ec4899, #8b5cf6);
  border-radius: 50%;
  mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  mask-composite: exclude;
  -webkit-mask-composite: xor;
}

.light-theme-toggle-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(236, 72, 153, 0.2);
  background: linear-gradient(45deg, #ec4899, #8b5cf6);
  color: white;
}

.theme-toggle-button {
  background: linear-gradient(135deg, #2d3748 0%, #4a5568 100%);
  border: 2px solid transparent;
  background-clip: padding-box;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  font-size: 1.2rem;
  position: relative;
  color: #e2e8f0;
}

.theme-toggle-button::before {
  content: "";
  position: absolute;
  inset: 0;
  padding: 2px;
  background: linear-gradient(45deg, #ec4899, #8b5cf6);
  border-radius: 50%;
  mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  mask-composite: exclude;
  -webkit-mask-composite: xor;
}

.theme-toggle-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(236, 72, 153, 0.2);
  background: linear-gradient(45deg, #ec4899, #8b5cf6);
  color: white;
}

.light-user-avatar-small {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: linear-gradient(45deg, #ec4899, #8b5cf6);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: bold;
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

.search-icon {
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  font-size: 1.2rem;
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

.section-actions {
  display: flex;
  gap: 1rem;
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

.light-spa-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.light-form-input {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  background: linear-gradient(135deg, #ffffff 0%, #fdf2f8 100%);
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

.empty-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
}

.light-empty-state h3 {
  color: #1e293b;
  margin-bottom: 0.5rem;
}

.light-empty-state p {
  color: #64748b;
  margin-bottom: 2rem;
}

.light-spas-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.light-spa-card {
  background: linear-gradient(135deg, #ffffff 0%, #fdf2f8 100%);
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
}

.light-spa-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 25px rgba(236, 72, 153, 0.15);
}

.spa-content {
  flex: 1;
  padding: 1.5rem;
}

.category-title {
  color: ${isDarkMode ? "#ec4899" : "#be185d"};
  font-size: 1.2rem;
  font-weight: bold;
  margin-bottom: 1rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.services-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.service-item {
  background: ${isDarkMode ? "rgba(26, 32, 44, 0.3)" : "rgba(248, 250, 252, 0.5)"};
  border: 1px solid ${isDarkMode ? "#2d3748" : "#e2e8f0"};
  border-radius: 8px;
  padding: 1rem;
}

.service-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.service-name {
  color: ${isDarkMode ? "#e2e8f0" : "#1f2937"};
  font-size: 1rem;
  font-weight: 600;
  margin: 0;
}

.service-duration {
  background: linear-gradient(45deg, #8b5cf6, #a855f7);
  color: white;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 500;
}

.service-description {
  color: ${isDarkMode ? "#a0aec0" : "#6b7280"};
  font-size: 0.875rem;
  margin: 0.5rem 0;
  line-height: 1.4;
}

.service-prices {
  display: flex;
  gap: 1rem;
  margin-top: 0.5rem;
}

.price-tnd, .price-eur {
  background: linear-gradient(45deg, #10b981, #059669);
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 6px;
  font-size: 0.875rem;
  font-weight: 600;
}

.price-eur {
  background: linear-gradient(45deg, #3b82f6, #2563eb);
}

.spa-card-actions {
  display: flex;
  gap: 1rem;
  padding: 1rem 1.5rem;
  border-top: 1px solid ${isDarkMode ? "#2d3748" : "#e2e8f0"};
  background: ${isDarkMode ? "rgba(26, 32, 44, 0.3)" : "rgba(248, 250, 252, 0.5)"};
}

.spa-card-actions button {
  flex: 1;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.3s ease;
}

.spa-card-actions button:first-child {
  background: linear-gradient(45deg, #3b82f6, #2563eb);
  color: white;
}

.spa-card-actions button:first-child:hover {
  background: linear-gradient(45deg, #2563eb, #1d4ed8);
  transform: translateY(-1px);
}

.spa-card-actions button:last-child {
  background: linear-gradient(45deg, #ef4444, #dc2626);
  color: white;
}

.spa-card-actions button:last-child:hover {
  background: linear-gradient(45deg, #dc2626, #b91c1c);
  transform: translateY(-1px);
}

.light-view-toggle {
  display: flex;
  background: linear-gradient(135deg, #ffffff 0%, #fdf2f8 100%);
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.light-view-btn {
  background: transparent;
  border: none;
  padding: 0.75rem 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  color: #64748b;
  font-size: 1.2rem;
  font-weight: 600;
  position: relative;
  z-index: 1;
}

.light-view-btn:hover {
  background: linear-gradient(45deg, rgba(236, 72, 153, 0.1), rgba(139, 92, 246, 0.1));
  color: #ec4899;
}

.light-view-btn.active {
  background: linear-gradient(45deg, #ec4899, #8b5cf6);
  color: white;
  box-shadow: 0 2px 8px rgba(236, 72, 153, 0.3);
}

.view-sort-container {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.light-spas-list.grid {
  display: grid !important;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr)) !important;
  gap: 1.5rem !important;
}

.light-spas-list.list-view {
  display: flex !important;
  flex-direction: column !important;
  gap: 1rem !important;
}

.category-section {
  background: ${isDarkMode ? "rgba(45, 55, 72, 0.5)" : "rgba(255, 255, 255, 0.8)"};
  border: 1px solid ${isDarkMode ? "#4a5568" : "#e2e8f0"};
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
}

.category-section h3 {
  color: ${isDarkMode ? "#e2e8f0" : "#1e293b"};
  margin-bottom: 1.5rem;
  font-size: 1.25rem;
  font-weight: 600;
}

.category-title-input {
  flex: 1;
  font-weight: 600;
  font-size: 1.1rem;
}

.services-container h4 {
  color: ${isDarkMode ? "#e2e8f0" : "#374151"};
  margin-bottom: 1rem;
  font-size: 1rem;
  font-weight: 600;
}

.service-section {
  background: ${isDarkMode ? "rgba(26, 32, 44, 0.5)" : "rgba(248, 250, 252, 0.8)"};
  border: 1px solid ${isDarkMode ? "#2d3748" : "#e2e8f0"};
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 1rem;
}

.service-row {
  display: flex;
  gap: 1rem;
  margin-bottom: 0.5rem;
  align-items: center;
}

.service-row input {
  flex: 1;
}

.remove-service-btn {
  background: #f59e0b;
  color: white;
  border: none;
  border-radius: 6px;
  padding: 0.5rem;
  cursor: pointer;
  font-size: 1rem;
  transition: all 0.3s ease;
}

.remove-service-btn:hover {
  background: #d97706;
  transform: scale(1.05);
}

.service-section textarea {
  width: 100%;
  min-height: 80px;
  padding: 0.75rem 1rem;
  border: 2px solid ${isDarkMode ? "#4a5568" : "#e2e8f0"};
  border-radius: 8px;
  background: ${isDarkMode ? "rgba(26, 32, 44, 0.5)" : "#ffffff"};
  color: ${isDarkMode ? "#e2e8f0" : "#1e293b"};
  font-size: 1rem;
  font-family: inherit;
  resize: vertical;
  transition: all 0.3s ease;
}

.service-section textarea:focus {
  outline: none;
  border-color: #ec4899;
  box-shadow: 0 0 0 3px rgba(236, 72, 153, 0.1);
}

.prices-row {
  display: flex;
  gap: 1rem;
  margin-top: 0.5rem;
}

.price-input {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.price-input label {
  font-size: 0.875rem;
  font-weight: 500;
  color: ${isDarkMode ? "#a0aec0" : "#6b7280"};
}

.add-service-btn {
  background: linear-gradient(45deg, #10b981, #059669);
  color: white;
  border: none;
  border-radius: 8px;
  padding: 0.75rem 1rem;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.3s ease;
  margin-top: 1rem;
  width: 100%;
}

.add-service-btn:hover {
  background: linear-gradient(45deg, #059669, #047857);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
}

.form-actions {
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
  padding-top: 1.5rem;
  border-top: 1px solid ${isDarkMode ? "#4a5568" : "#e2e8f0"};
}

.form-actions button {
  flex: 1;
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

  .service-row {
    flex-direction: column;
  }
  
  .prices-row {
    flex-direction: column;
  }
  
  .service-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
  
  .service-prices {
    flex-direction: column;
    gap: 0.5rem;
  }

  .light-spas-list {
    grid-template-columns: 1fr !important;
  }
}

@media (max-width: 480px) {
  .light-welcome-header h1 {
    font-size: 1.5rem;
  }
}

.light-action-button:focus,
.light-theme-toggle-button:focus,
.light-btn:focus {
  outline: 2px solid #ec4899;
  outline-offset: 2px;
}

* {
  transition: background-color 0.3s ease, border-color 0.3s ease, color 0.3s ease;
}
      `}</style>
    </div>
  )
}

export default SpaCategoriesPage
