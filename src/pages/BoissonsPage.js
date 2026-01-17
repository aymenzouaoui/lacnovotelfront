"use client"

import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import API from "../services/api"
import "./BoissonsPage.css"
import CompressedFileInput from "../components/CompressedFileInput"

const BoissonsPage = () => {
  const navigate = useNavigate()
  const [categories, setCategories] = useState([])
  const [activeCategory, setActiveCategory] = useState(null)
  const [boissons, setBoissons] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [user, setUser] = useState({ username: "", email: "" })
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [currentTime, setCurrentTime] = useState(new Date())
  const [searchTerm, setSearchTerm] = useState("")
  const [sortOrder, setSortOrder] = useState("newest")
  const [viewMode, setViewMode] = useState("grid")
  const [categoryViewMode, setCategoryViewMode] = useState("grid")

  // Theme state with localStorage initialization
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem("theme")
    return savedTheme ? savedTheme === "dark" : true
  })

  const [showCategoryForm, setShowCategoryForm] = useState(false)
  const [categoryFormData, setCategoryFormData] = useState({
    name: "",
    image: null,
  })
  const [editCategoryId, setEditCategoryId] = useState(null)
  const [categoryPreviewImage, setCategoryPreviewImage] = useState(null)

  const [showBoissonForm, setShowBoissonForm] = useState(false)
  const [boissonFormData, setBoissonFormData] = useState({
    title: "",
    price: "",
    quantity: "",
    description: "",
    image: null,
  })
  const [editBoissonId, setEditBoissonId] = useState(null)
  const [previewImage, setPreviewImage] = useState(null)

  const fetchCategories = async () => {
    try {
      const res = await API.get("/categories-boisson")
      setCategories(res.data)
      if (res.data.length > 0) {
        setActiveCategory(res.data[0])
        fetchBoissons(res.data[0]._id)
      }
    } catch (error) {
      console.error("Error fetching categories:", error)
    }
  }

  const fetchBoissons = async (categoryId) => {
    setIsLoading(true)
    try {
      const res = await API.get("/boissons")
      const filtered = res.data.filter((b) => {
        return b.category?._id === categoryId || b.category === categoryId
      })
      setBoissons(filtered)
    } catch (error) {
      console.error("Error fetching boissons:", error)
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
    // Save theme preference to localStorage
    localStorage.setItem("theme", isDarkMode ? "dark" : "light")
  }, [isDarkMode])

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode)
  }

  const handleCategoryChange = (e) => {
    const { name, value, files } = e.target
    if (name === "image" && files && files[0]) {
      setCategoryFormData((prev) => ({ ...prev, image: files[0] }))
      const reader = new FileReader()
      reader.onloadend = () => setCategoryPreviewImage(reader.result)
      reader.readAsDataURL(files[0])
    } else {
      setCategoryFormData((prev) => ({ ...prev, [name]: value }))
    }
  }

  const handleCategorySubmit = async (e) => {
    e.preventDefault()
    try {
      const form = new FormData()
      form.append("name", categoryFormData.name)
      if (categoryFormData.image) {
        form.append("image", categoryFormData.image)
      }

      if (editCategoryId) {
        await API.put(`/categories-boisson/${editCategoryId}`, form, {
          headers: { "Content-Type": "multipart/form-data" },
        })
        alert("Catégorie mise à jour")
      } else {
        await API.post("/categories-boisson", form, {
          headers: { "Content-Type": "multipart/form-data" },
        })
        alert("Catégorie créée")
      }
      setCategoryFormData({ name: "", image: null })
      setCategoryPreviewImage(null)
      setEditCategoryId(null)
      setShowCategoryForm(false)
      fetchCategories()
    } catch (err) {
      alert("Erreur")
      console.error("Error submitting category:", err)
    }
  }

  const handleEditCategory = (cat) => {
    setCategoryFormData({
      name: cat.name,
      image: null,
    })
    setEditCategoryId(cat._id)
    setShowCategoryForm(true)

    if (cat.image) {
      setCategoryPreviewImage(`${cat.image}`)
    } else {
      setCategoryPreviewImage(null)
    }
  }

  const handleDeleteCategory = async (id) => {
    if (window.confirm("Supprimer cette catégorie ?")) {
      try {
        await API.delete(`/categories-boisson/${id}`)
        fetchCategories()
      } catch (error) {
        console.error("Error deleting category:", error)
        alert("Erreur lors de la suppression")
      }
    }
  }

  const handleBoissonSubmit = async (e) => {
    e.preventDefault()
    if (!activeCategory) return alert("Sélectionnez une catégorie")

    try {
      const form = new FormData()
      for (const key in boissonFormData) {
        form.append(key, boissonFormData[key])
      }
      form.append("category", activeCategory._id)

      if (editBoissonId) {
        await API.put(`/boissons/${editBoissonId}`, form, {
          headers: { "Content-Type": "multipart/form-data" },
        })
        alert("Boisson modifiée")
      } else {
        await API.post("/boissons", form, {
          headers: { "Content-Type": "multipart/form-data" },
        })
        alert("Boisson ajoutée")
      }

      setBoissonFormData({ title: "", price: "", quantity: "", description: "", image: null })
      setEditBoissonId(null)
      setShowBoissonForm(false)
      setPreviewImage(null)
      fetchBoissons(activeCategory._id)
    } catch (error) {
      console.error("Error submitting boisson:", error)
      alert("Erreur lors de l'enregistrement")
    }
  }

  const handleBoissonChange = (e) => {
    const { name, value, files } = e.target
    if (name === "image" && files && files[0]) {
      setBoissonFormData((prev) => ({ ...prev, image: files[0] }))
      const reader = new FileReader()
      reader.onloadend = () => setPreviewImage(reader.result)
      reader.readAsDataURL(files[0])
    } else {
      setBoissonFormData((prev) => ({ ...prev, [name]: value }))
    }
  }

  const handleEditBoisson = (boisson) => {
    setBoissonFormData({
      title: boisson.title,
      price: boisson.price,
      quantity: boisson.quantity,
      description: boisson.description || "",
      image: null,
    })
    setEditBoissonId(boisson._id)
    setShowBoissonForm(true)

    if (boisson.image) {
      setPreviewImage(`${boisson.image}`)
    } else {
      setPreviewImage(null)
    }
  }

  const handleDeleteBoisson = async (id) => {
    if (window.confirm("Voulez-vous supprimer cette boisson ?")) {
      try {
        await API.delete(`/boissons/${id}`)
        fetchBoissons(activeCategory._id)
        alert("Boisson supprimée")
      } catch (error) {
        console.error("Error deleting boisson:", error)
        alert("Erreur lors de la suppression")
      }
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

  const filteredBoissons = boissons
    .filter(
      (b) =>
        b.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        b.description?.toLowerCase().includes(searchTerm.toLowerCase()),
    )
    .sort((a, b) => {
      if (sortOrder === "newest") {
        return new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
      } else if (sortOrder === "oldest") {
        return new Date(a.createdAt || 0) - new Date(b.createdAt || 0)
      } else if (sortOrder === "alphabetical") {
        return a.title.localeCompare(b.title)
      } else if (sortOrder === "price-asc") {
        return Number.parseFloat(a.price) - Number.parseFloat(b.price)
      } else if (sortOrder === "price-desc") {
        return Number.parseFloat(b.price) - Number.parseFloat(a.price)
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
              <a href="#boissons">
                <span className={isDarkMode ? "nav-icon" : "light-nav-icon"}>🥤</span>
                <span>Boissons</span>
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
              Boissons <span className={isDarkMode ? "wave-emoji" : "light-wave-emoji"}>🥤</span>
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
          <p>Gérez vos boissons par catégorie</p>
        </div>

        <div className={isDarkMode ? "search-filter-container" : "light-search-filter-container"}>
          <div className={isDarkMode ? "search-container" : "light-search-container"}>
            <span className="search-icon">🔍</span>
            <input
              className={isDarkMode ? "search-input" : "light-search-input"}
              type="text"
              placeholder="Rechercher une boisson..."
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
              <option value="price-asc">Prix croissant</option>
              <option value="price-desc">Prix décroissant</option>
            </select>
          </div>
        </div>

        <div className={isDarkMode ? "dashboard-grid" : "light-dashboard-grid"}>
          <div className={isDarkMode ? "services-section" : "light-services-section"}>
            <div className={isDarkMode ? "section-header" : "light-section-header"}>
              <h2>Catégories</h2>
              <div className="section-actions">
                <div className="category-view-controls">
                  <div className="view-toggle">
                    <button
                      className={`view-btn ${categoryViewMode === "grid" ? "active" : ""}`}
                      onClick={() => setCategoryViewMode("grid")}
                      aria-label="Vue en grille pour catégories"
                      title="Vue en grille"
                    >
                      ▦
                    </button>
                    <button
                      className={`view-btn ${categoryViewMode === "list" ? "active" : ""}`}
                      onClick={() => setCategoryViewMode("list")}
                      aria-label="Vue en liste pour catégories"
                      title="Vue en liste"
                    >
                      ☰
                    </button>
                  </div>
                </div>
                <button
                  className={isDarkMode ? "section-action" : "light-section-action"}
                  onClick={() => setShowCategoryForm(!showCategoryForm)}
                >
                  <span>{showCategoryForm ? "Annuler" : "Ajouter"}</span>
                  <span className="action-icon">{showCategoryForm ? "❌" : "+"}</span>
                </button>
              </div>
            </div>

            {showCategoryForm && (
              <form onSubmit={handleCategorySubmit} className={isDarkMode ? "category-form" : "light-category-form"}>
                <input
                  type="text"
                  name="name"
                  placeholder="Nom de la catégorie"
                  value={categoryFormData.name}
                  onChange={handleCategoryChange}
                  required
                  className={isDarkMode ? "form-input" : "light-form-input"}
                />
                <div className="form-group">
                  <label htmlFor="categoryImage" className={isDarkMode ? "form-label" : "light-form-label"}>
                    Image de la catégorie
                  </label>
                  <CompressedFileInput
  type="file"
  id="categoryImage"
  name="image"
  accept="image/*"
  onChange={handleCategoryChange}
  className={isDarkMode ? "form-control" : "light-form-control"}
/>
                  {categoryPreviewImage && (
                    <div className="category-image-preview">
                      <img
                        src={categoryPreviewImage || "/placeholder.svg"}
                        alt="Aperçu de la catégorie"
                        className="preview-img"
                      />
                    </div>
                  )}
                </div>
                <button type="submit" className={isDarkMode ? "btn btn-success" : "light-btn light-btn-success"}>
                  {editCategoryId ? "✅ Modifier" : "✅ Créer"}
                </button>
              </form>
            )}

            {categories.length === 0 ? (
              <div className={isDarkMode ? "empty-state" : "light-empty-state"}>
                <div className="empty-icon">🥤</div>
                <h3>Aucune catégorie disponible</h3>
                <p>Commencez par créer une nouvelle catégorie</p>
                <button
                  className={isDarkMode ? "btn btn-primary" : "light-btn light-btn-primary"}
                  onClick={() => setShowCategoryForm(true)}
                >
                  Créer une catégorie
                </button>
              </div>
            ) : (
              <>
                <div
                  className={`${isDarkMode ? "category-container" : "light-category-container"} ${categoryViewMode}`}
                >
                  {categories.map((cat) => (
                    <div
                      key={cat._id}
                      className={`${isDarkMode ? "category-card" : "light-category-card"} ${
                        activeCategory?._id === cat._id
                          ? isDarkMode
                            ? "active-category"
                            : "light-active-category"
                          : ""
                      }`}
                    >
                      <div className="category-image-wrapper">
                        {cat.image ? (
                          <img
                            src={cat.image || "/placeholder.svg?height=120&width=120&query=category"}
                            alt={cat.name}
                            className="category-card-image"
                            onError={(e) => (e.target.src = "/abstract-categories.png")}
                          />
                        ) : (
                          <div className="category-placeholder">
                            <span className="category-icon">🥤</span>
                          </div>
                        )}
                        <div className="category-overlay">
                          <button
                            onClick={() => {
                              setActiveCategory(cat)
                              fetchBoissons(cat._id)
                            }}
                            className={isDarkMode ? "select-category-btn" : "light-select-category-btn"}
                          >
                            Sélectionner
                          </button>
                        </div>
                      </div>
                      <div className="category-card-content">
                        <h3 className="category-card-title">{cat.name}</h3>
                        <p className="category-card-description">
                          Découvrez notre sélection de boissons {cat.name.toLowerCase()}.
                        </p>
                        <div className="category-card-actions">
                          <button
                            onClick={() => handleEditCategory(cat)}
                            className={isDarkMode ? "category-action-btn edit" : "light-category-action-btn light-edit"}
                            title="Modifier la catégorie"
                          >
                            ✏️
                          </button>
                          <button
                            onClick={() => handleDeleteCategory(cat._id)}
                            className={
                              isDarkMode ? "category-action-btn delete" : "light-category-action-btn light-delete"
                            }
                            title="Supprimer la catégorie"
                          >
                            🗑️
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Category description and boisson form */}
                {activeCategory && (
                  <>
                    <div className={isDarkMode ? "active-category-info" : "light-active-category-info"}>
                      <div className="active-category-header">
                        <div className="active-category-image">
                          {activeCategory.image ? (
                            <img
                              src={activeCategory.image || "/placeholder.svg?height=80&width=80&query=active category"}
                              alt={activeCategory.name}
                              className="active-category-img"
                            />
                          ) : (
                            <div className="active-category-placeholder">
                              <span>🥤</span>
                            </div>
                          )}
                        </div>
                        <div className="active-category-details">
                          <h2 className={isDarkMode ? "active-category-title" : "light-active-category-title"}>
                            {activeCategory.name}
                          </h2>
                          <p className={isDarkMode ? "active-category-desc" : "light-active-category-desc"}>
                            Catégorie active • {filteredBoissons.length} boisson
                            {filteredBoissons.length !== 1 ? "s" : ""}
                          </p>
                        </div>
                        <button
                          onClick={() => setShowBoissonForm(!showBoissonForm)}
                          className={isDarkMode ? "add-boisson-btn" : "light-add-boisson-btn"}
                        >
                          {showBoissonForm ? "❌ Annuler" : "➕ Ajouter une boisson"}
                        </button>
                      </div>
                    </div>

                    {showBoissonForm && (
                      <form
                        onSubmit={handleBoissonSubmit}
                        className={isDarkMode ? "boisson-form" : "light-boisson-form"}
                      >
                        <div className="form-row">
                          <input
                            type="text"
                            name="title"
                            placeholder="Nom de la boisson"
                            value={boissonFormData.title}
                            onChange={handleBoissonChange}
                            required
                            className={isDarkMode ? "form-input" : "light-form-input"}
                          />
                          <input
                            type="number"
                            name="price"
                            placeholder="Prix (TND)"
                            value={boissonFormData.price}
                            onChange={handleBoissonChange}
                            required
                            className={isDarkMode ? "form-input" : "light-form-input"}
                          />
                        </div>
                        <div className="form-row">
                          <input
                            type="number"
                            name="quantity"
                            placeholder="Quantité disponible"
                            value={boissonFormData.quantity}
                            onChange={handleBoissonChange}
                            className={isDarkMode ? "form-input" : "light-form-input"}
                          />
                      <CompressedFileInput
  type="file"
  name="image"
  accept="image/*"
  onChange={handleBoissonChange}
  className={isDarkMode ? "form-input file-input" : "light-form-input light-file-input"}
/>

                        </div>
                        <textarea
                          name="description"
                          placeholder="Description de la boisson"
                          value={boissonFormData.description}
                          onChange={handleBoissonChange}
                          className={isDarkMode ? "form-textarea" : "light-form-textarea"}
                          rows="3"
                        />
                        {previewImage && (
                          <div className="image-preview-container">
                            <img src={previewImage || "/placeholder.svg"} alt="preview" className="form-preview-img" />
                          </div>
                        )}
                        <button
                          type="submit"
                          className={
                            isDarkMode ? "btn btn-success form-submit" : "light-btn light-btn-success light-form-submit"
                          }
                        >
                          {editBoissonId ? "✅ Modifier la boisson" : "✅ Créer la boisson"}
                        </button>
                      </form>
                    )}

                    {/* Enhanced boissons list */}
                    <div className={isDarkMode ? "category-boissons-container" : "light-category-boissons-container"}>
                      <div className={isDarkMode ? "boissons-section-header" : "light-boissons-section-header"}>
                        <h3>Liste des boissons</h3>
                        <div className="boissons-stats">
                          <span className="boissons-count">
                            {filteredBoissons.length} boisson{filteredBoissons.length !== 1 ? "s" : ""}
                          </span>
                        </div>
                      </div>

                      {isLoading ? (
                        <div className={isDarkMode ? "loading" : "light-loading"}>
                          <div className={isDarkMode ? "spinner" : "light-spinner"}></div>
                          <p>Chargement des boissons...</p>
                        </div>
                      ) : filteredBoissons.length === 0 ? (
                        <div className={isDarkMode ? "empty-message" : "light-empty-message"}>
                          <div className="empty-icon">🥤</div>
                          <h4>Aucune boisson dans cette catégorie</h4>
                          <p>Ajoutez votre première boisson pour commencer</p>
                        </div>
                      ) : (
                        <div className={`${isDarkMode ? "boisson-list" : "light-boisson-list"} ${viewMode}`}>
                          {filteredBoissons.map((boisson) => (
                            <div key={boisson._id} className={isDarkMode ? "boisson-card" : "light-boisson-card"}>
                              <div className="boisson-image-wrapper">
                                <img
                                  src={boisson.image ? `${boisson.image}` : "/refreshing-summer-drink.png"}
                                  alt={boisson.title}
                                  className="boisson-image"
                                  onError={(e) => (e.target.src = "/refreshing-summer-drink.png")}
                                />
                                <div className="boisson-badge">
                                  <span className="price-badge">{boisson.price} TND</span>
                                </div>
                              </div>
                              <div className={isDarkMode ? "boisson-details" : "light-boisson-details"}>
                                <h4 className="boisson-title">{boisson.title}</h4>
                                <div className="boisson-meta">
                                  <span className="quantity-info">
                                    <span className="quantity-icon">📦</span>
                                    Quantité: {boisson.quantity}
                                  </span>
                                </div>
                                {boisson.description && <p className="boisson-description">{boisson.description}</p>}
                                <div className={isDarkMode ? "boisson-card-actions" : "light-boisson-card-actions"}>
                                  <button
                                    onClick={() => handleEditBoisson(boisson)}
                                    className={
                                      isDarkMode
                                        ? "btn btn-secondary btn-sm"
                                        : "light-btn light-btn-secondary light-btn-sm"
                                    }
                                  >
                                    ✏️ Modifier
                                  </button>
                                  <button
                                    onClick={() => handleDeleteBoisson(boisson._id)}
                                    className={
                                      isDarkMode ? "btn btn-danger btn-sm" : "light-btn light-btn-danger light-btn-sm"
                                    }
                                  >
                                    🗑️ Supprimer
                                  </button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
/* Enhanced Category Styles */
.category-view-controls {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-right: 1rem;
}

.view-toggle {
  display: flex;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  padding: 4px;
  gap: 2px;
}

.view-btn {
  background: none;
  border: none;
  padding: 8px 12px;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
  color: #64748b;
  font-size: 1rem;
}

.view-btn:hover {
  background: rgba(236, 72, 153, 0.1);
  color: #ec4899;
}

.view-btn.active {
  background: linear-gradient(45deg, #ec4899, #8b5cf6);
  color: white;
  box-shadow: 0 2px 8px rgba(236, 72, 153, 0.3);
}

/* Category Container Styles */
.category-container {
  display: grid;
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.category-container.grid {
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
}

.category-container.list {
  grid-template-columns: 1fr;
}

.light-category-container {
  display: grid;
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.light-category-container.grid {
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
}

.light-category-container.list {
  grid-template-columns: 1fr;
}

/* Category Card Styles */
.category-card {
  background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
  border: 1px solid #475569;
  border-radius: 16px;
  overflow: hidden;
  transition: all 0.3s ease;
  position: relative;
  cursor: pointer;
}

.category-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 30px rgba(236, 72, 153, 0.2);
  border-color: #ec4899;
}

.category-card.active-category {
  border-color: #ec4899;
  box-shadow: 0 8px 25px rgba(236, 72, 153, 0.3);
  background: linear-gradient(135deg, #1e293b 0%, #2d1b69 100%);
}

.light-category-card {
  background: linear-gradient(135deg, #ffffff 0%, #fdf2f8 100%);
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  overflow: hidden;
  transition: all 0.3s ease;
  position: relative;
  cursor: pointer;
}

.light-category-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 30px rgba(236, 72, 153, 0.15);
  border-color: #ec4899;
}

.light-category-card.light-active-category {
  border-color: #ec4899;
  box-shadow: 0 8px 25px rgba(236, 72, 153, 0.2);
  background: linear-gradient(135deg, #ffffff 0%, #fdf2f8 100%);
}

/* Category Image Wrapper */
.category-image-wrapper {
  position: relative;
  height: 160px;
  overflow: hidden;
}

.category-card-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.category-card:hover .category-card-image {
  transform: scale(1.05);
}

.category-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #475569 0%, #64748b 100%);
}

.category-icon {
  font-size: 3rem;
  opacity: 0.7;
}

.category-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(236, 72, 153, 0.8), rgba(139, 92, 246, 0.8));
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.category-card:hover .category-overlay {
  opacity: 1;
}

.select-category-btn {
  background: white;
  color: #ec4899;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.select-category-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.light-select-category-btn {
  background: white;
  color: #ec4899;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.light-select-category-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

/* Category Card Content */
.category-card-content {
  padding: 1.5rem;
}

.category-card-title {
  color: #f1f5f9;
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.light-category-card .category-card-title {
  color: #1e293b;
}

.category-card-description {
  color: #94a3b8;
  font-size: 0.875rem;
  margin-bottom: 1rem;
  line-height: 1.5;
}

.light-category-card .category-card-description {
  color: #64748b;
}

.category-card-actions {
  display: flex;
  gap: 0.5rem;
  justify-content: flex-end;
}

.category-action-btn {
  background: none;
  border: 1px solid #475569;
  border-radius: 8px;
  padding: 0.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
  color: #94a3b8;
}

.category-action-btn:hover {
  border-color: #ec4899;
  color: #ec4899;
  background: rgba(236, 72, 153, 0.1);
}

.light-category-action-btn {
  background: none;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 0.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
  color: #64748b;
}

.light-category-action-btn:hover {
  border-color: #ec4899;
  color: #ec4899;
  background: rgba(236, 72, 153, 0.1);
}

/* Active Category Info */
.active-category-info {
  background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
  border: 1px solid #ec4899;
  border-radius: 16px;
  padding: 2rem;
  margin-bottom: 2rem;
  box-shadow: 0 8px 25px rgba(236, 72, 153, 0.2);
}

.light-active-category-info {
  background: linear-gradient(135deg, #ffffff 0%, #fdf2f8 100%);
  border: 1px solid #ec4899;
  border-radius: 16px;
  padding: 2rem;
  margin-bottom: 2rem;
  box-shadow: 0 8px 25px rgba(236, 72, 153, 0.15);
}

.active-category-header {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.active-category-image {
  width: 80px;
  height: 80px;
  border-radius: 12px;
  overflow: hidden;
  flex-shrink: 0;
}

.active-category-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.active-category-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #475569 0%, #64748b 100%);
  font-size: 2rem;
}

.active-category-details {
  flex: 1;
}

.active-category-title {
  color: #f1f5f9;
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 0.5rem;
}

.light-active-category-title {
  color: #1e293b;
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 0.5rem;
}

.active-category-desc {
  color: #94a3b8;
  font-size: 0.875rem;
}

.light-active-category-desc {
  color: #64748b;
  font-size: 0.875rem;
}

.add-boisson-btn {
  background: linear-gradient(45deg, #ec4899, #8b5cf6);
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 500;
  box-shadow: 0 4px 12px rgba(236, 72, 153, 0.3);
}

.add-boisson-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(236, 72, 153, 0.4);
}

.light-add-boisson-btn {
  background: linear-gradient(45deg, #ec4899, #8b5cf6);
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 500;
  box-shadow: 0 4px 12px rgba(236, 72, 153, 0.3);
}

.light-add-boisson-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(236, 72, 153, 0.4);
}

/* Enhanced Form Styles */
.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.form-textarea {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 2px solid #475569;
  border-radius: 12px;
  background: #1e293b;
  color: #f1f5f9;
  font-size: 1rem;
  transition: all 0.3s ease;
  font-family: inherit;
  resize: vertical;
  min-height: 80px;
}

.form-textarea:focus {
  outline: none;
  border-color: #ec4899;
  box-shadow: 0 0 0 3px rgba(236, 72, 153, 0.1);
}

.light-form-textarea {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  background: #ffffff;
  color: #1e293b;
  font-size: 1rem;
  transition: all 0.3s ease;
  font-family: inherit;
  resize: vertical;
  min-height: 80px;
}

.light-form-textarea:focus {
  outline: none;
  border-color: #ec4899;
  box-shadow: 0 0 0 3px rgba(236, 72, 153, 0.1);
}

.file-input {
  cursor: pointer;
}

.light-file-input {
  cursor: pointer;
}

.image-preview-container {
  display: flex;
  justify-content: center;
  margin: 1rem 0;
}

.form-preview-img {
  max-width: 200px;
  max-height: 200px;
  border-radius: 12px;
  object-fit: cover;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.form-submit {
  margin-top: 1rem;
  padding: 1rem 2rem;
  font-size: 1.1rem;
}

.light-form-submit {
  margin-top: 1rem;
  padding: 1rem 2rem;
  font-size: 1.1rem;
}

/* Enhanced Boissons Section */
.boissons-section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  padding: 1rem 0;
  border-bottom: 1px solid #475569;
}

.light-boissons-section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  padding: 1rem 0;
  border-bottom: 1px solid #e2e8f0;
}

.boissons-section-header h3 {
  color: #f1f5f9;
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
}

.light-boissons-section-header h3 {
  color: #1e293b;
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
}

.boissons-stats {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.boissons-count {
  background: linear-gradient(45deg, #ec4899, #8b5cf6);
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.875rem;
  font-weight: 500;
}

/* Enhanced Boisson Cards */
.boisson-image-wrapper {
  position: relative;
  height: 200px;
  overflow: hidden;
}

.boisson-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.boisson-card:hover .boisson-image {
  transform: scale(1.05);
}

.boisson-badge {
  position: absolute;
  top: 1rem;
  right: 1rem;
}

.price-badge {
  background: linear-gradient(45deg, #ec4899, #8b5cf6);
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-weight: 600;
  font-size: 0.875rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

.boisson-title {
  color: #f1f5f9;
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 0.75rem;
}

.light-boisson-details .boisson-title {
  color: #1e293b;
}

.boisson-meta {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 0.75rem;
}

.quantity-info {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #94a3b8;
  font-size: 0.875rem;
}

.light-boisson-details .quantity-info {
  color: #64748b;
}

.quantity-icon {
  font-size: 1rem;
}

.boisson-description {
  color: #94a3b8;
  font-size: 0.875rem;
  line-height: 1.5;
  margin-bottom: 1rem;
}

.light-boisson-details .boisson-description {
  color: #64748b;
}

.boisson-card-actions {
  display: flex;
  gap: 0.75rem;
  margin-top: 1rem;
}

.light-boisson-card-actions {
  display: flex;
  gap: 0.75rem;
  margin-top: 1rem;
}

.btn-sm {
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
}

.light-btn-sm {
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
}

/* Enhanced Empty States */
.empty-message {
  text-align: center;
  padding: 3rem 2rem;
  background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
  border: 1px solid #475569;
  border-radius: 16px;
  margin: 1rem 0;
}

.light-empty-message {
  text-align: center;
  padding: 3rem 2rem;
  background: linear-gradient(135deg, #ffffff 0%, #fdf2f8 100%);
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  margin: 1rem 0;
}

.empty-message .empty-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
  opacity: 0.7;
}

.empty-message h4 {
  color: #f1f5f9;
  margin-bottom: 0.5rem;
  font-size: 1.25rem;
}

.light-empty-message h4 {
  color: #1e293b;
  margin-bottom: 0.5rem;
  font-size: 1.25rem;
}

.empty-message p {
  color: #94a3b8;
  margin: 0;
}

.light-empty-message p {
  color: #64748b;
  margin: 0;
}

/* Responsive Design */
@media (max-width: 768px) {
  .category-container.grid,
  .light-category-container.grid {
    grid-template-columns: 1fr;
  }
  
  .active-category-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
  
  .form-row {
    grid-template-columns: 1fr;
  }
  
  .category-view-controls {
    margin-right: 0;
    margin-bottom: 1rem;
  }
  
  .section-actions {
    flex-direction: column;
    align-items: stretch;
    gap: 1rem;
  }
}

@media (max-width: 480px) {
  .category-image-wrapper {
    height: 120px;
  }
  
  .boisson-image-wrapper {
    height: 150px;
  }
  
  .active-category-image {
    width: 60px;
    height: 60px;
  }
}

/* Light Mode Styles for Boissons Page */
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

/* Ensure all buttons have proper pointer events */
.light-btn,
.light-btn-primary,
.light-btn-secondary,
.light-btn-success,
.light-btn-danger,
.light-section-action,
.light-tab,
.light-icon-btn,
.light-action-button,
.light-theme-toggle-button,
.light-logout-button {
  pointer-events: auto;
  cursor: pointer;
  position: relative;
  z-index: 1;
}

/* Remove problematic pseudo-elements */
.light-action-button::before,
.light-theme-toggle-button::before {
  display: none;
}

/* Ensure form inputs are interactive */
.light-form-input,
.light-form-control,
.light-search-input,
.light-sort-select {
  pointer-events: auto;
  cursor: text;
  position: relative;
  z-index: 1;
}

.light-sort-select {
  cursor: pointer;
}

/* Fix any overlay issues */
.light-dashboard * {
  pointer-events: auto;
}

/* Ensure no elements are blocking interactions */
.light-welcome-actions,
.light-section-actions,
.light-seminaire-card-actions {
  pointer-events: auto;
  position: relative;
  z-index: 2;
}

/* Ensure all interactive elements work */
button, input, select, textarea, a {
  pointer-events: auto !important;
  position: relative;
  z-index: 1;
}

/* Fix specific light mode interactive elements */
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
.light-dashboard textarea {
  cursor: text !important;
}

.light-welcome-section p {
  color: #64748b;
  font-size: 1.1rem;
  margin: 0;
}

/* Search and Filter Components */
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

/* Dashboard Grid */
.light-dashboard-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
}

.light-services-section {
  background: linear-gradient(135deg, #ffffff 0%, #fdf2f8 100%);
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

/* Section Headers */
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

/* Forms */
.light-category-form, .light-boisson-form {
  background: linear-gradient(135deg, #ffffff 0%, #fdf2f8 100%);
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  padding: 2rem;
  margin-bottom: 2rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

/* Form inputs in light mode */
.light-form-input, 
.light-form-control {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  background: #ffffff;
  color: #1e293b;
  font-size: 1rem;
  transition: all 0.3s ease;
  font-family: inherit;
  margin-bottom: 0.5rem;
}

.light-form-input:focus, 
.light-form-control:focus {
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

/* Buttons */
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

.light-btn-success {
  background: linear-gradient(45deg, #10b981, #059669);
  color: white;
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
}

.light-btn-success:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(16, 185, 129, 0.4);
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

/* Ensure buttons work in light mode */
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

.light-btn-primary,
.light-btn-success,
.light-btn-secondary,
.light-btn-danger {
  cursor: pointer;
}

/* Empty States */
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

/* Loading */
.light-loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem;
  color: #64748b;
}

.light-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f1f5f9;
  border-top: 4px solid #ec4899;
  border-radius: 50%;
  animation: lightSpin 1s linear infinite;
  margin-bottom: 1rem;
}

/* Boisson List and Cards */
.light-boisson-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
  margin-top: 1rem;
}

.light-boisson-list.list {
  grid-template-columns: 1fr;
}

.light-boisson-card {
  background: linear-gradient(135deg, #ffffff 0%, #fdf2f8 100%);
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
}

.light-boisson-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 25px rgba(236, 72, 153, 0.15);
}

.light-boisson-details {
  padding: 1.5rem;
}

.light-boisson-details h3 {
  color: #1e293b;
  margin-bottom: 1rem;
  font-size: 1.25rem;
  font-weight: 600;
}

.light-boisson-details p {
  color: #64748b;
  margin-bottom: 0.5rem;
}

.light-seminaire-card-actions {
  display: flex;
  gap: 0.5rem;
  margin-top: 1rem;
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

  .light-boisson-list {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 480px) {
  .light-welcome-header h1 {
    font-size: 1.5rem;
  }
}

/* Enhanced focus states for accessibility */
.light-action-button:focus,
.light-theme-toggle-button:focus,
.light-btn:focus,
.light-tab:focus,
.light-icon-btn:focus {
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

export default BoissonsPage
