"use client"

import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import API from "../services/api"
import "./BoissonsPage.css"
import CompressedFileInput from "../components/CompressedFileInput"
import Toast from "../components/Toast"
import ConfirmDialog from "../components/ConfirmDialog"

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
  const [sortOrder, setSortOrder] = useState("order")
  const [viewMode, setViewMode] = useState("grid")

  // Theme state with localStorage initialization
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem("theme")
    return savedTheme ? savedTheme === "dark" : true
  })

  const [showCategoryForm, setShowCategoryForm] = useState(false)
  const [categoryFormData, setCategoryFormData] = useState({
    name: "",
    image: null,
    translations: {
      fr: { name: "" },
      ar: { name: "" },
    },
  })
  const [activeCategoryLang, setActiveCategoryLang] = useState("fr")
  const [editCategoryId, setEditCategoryId] = useState(null)
  const [categoryPreviewImage, setCategoryPreviewImage] = useState(null)

  const [showBoissonForm, setShowBoissonForm] = useState(false)
  const [boissonFormData, setBoissonFormData] = useState({
    title: "",
    order: 0,
    price: "",
    quantity: "",
    description: "",
    image: null,
    translations: {
      fr: { title: "", description: "" },
      ar: { title: "", description: "" },
    },
  })
  const [activeLang, setActiveLang] = useState("fr")
  const [editBoissonId, setEditBoissonId] = useState(null)
  const [previewImage, setPreviewImage] = useState(null)

  // Toast & Confirm dialog state
  const [toast, setToast] = useState({ message: "", type: "success" })
  const [confirmDialog, setConfirmDialog] = useState({ open: false, message: "", onConfirm: null })

  const showToast = (message, type = "success") => setToast({ message, type })
  const closeToast = () => setToast({ message: "", type: "success" })
  const openConfirm = (message, onConfirm) => setConfirmDialog({ open: true, message, onConfirm })
  const closeConfirm = () => setConfirmDialog({ open: false, message: "", onConfirm: null })

  const fetchCategories = async (keepActive = false) => {
    try {
      const res = await API.get("/categories-boisson")
      setCategories(res.data)
      if (res.data.length > 0) {
        setActiveCategory((prev) => {
          if (keepActive && prev) {
            const stillExists = res.data.find((c) => c._id === prev._id)
            if (stillExists) {
              fetchBoissons(prev._id)
              return stillExists
            }
          }
          fetchBoissons(res.data[0]._id)
          return res.data[0]
        })
      }
    } catch (error) {
      console.error("Error fetching categories:", error)
    }
  }

  const fetchBoissons = async (categoryId) => {
    setIsLoading(true)
    try {
      const res = await API.get("/boissons")
      const filtered = res.data
        .filter((b) => b.category?._id === categoryId || b.category === categoryId)
        .sort((a, b) => (a.order ?? 999) - (b.order ?? 999))
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
    } else if (name.startsWith("tr_")) {
      const [, lang, field] = name.split("_")
      setCategoryFormData((prev) => ({
        ...prev,
        translations: {
          ...prev.translations,
          [lang]: { ...prev.translations[lang], [field]: value },
        },
      }))
    } else {
      setCategoryFormData((prev) => ({ ...prev, [name]: value }))
    }
  }

  const handleCategorySubmit = async (e) => {
    e.preventDefault()
    try {
      const form = new FormData()
      form.append("name", categoryFormData.name ?? "")
      form.append(
        "translations",
        JSON.stringify({
          fr: categoryFormData.translations?.fr || { name: "" },
          ar: categoryFormData.translations?.ar || { name: "" },
        }),
      )
      if (categoryFormData.image) {
        form.append("image", categoryFormData.image)
      }

      if (editCategoryId) {
        await API.put(`/categories-boisson/${editCategoryId}`, form, {
          headers: { "Content-Type": "multipart/form-data" },
        })
        showToast("Catégorie mise à jour avec succès", "success")
      } else {
        await API.post("/categories-boisson", form, {
          headers: { "Content-Type": "multipart/form-data" },
        })
        showToast("Catégorie créée avec succès", "success")
      }
      setCategoryFormData({ name: "", image: null, translations: { fr: { name: "" }, ar: { name: "" } } })
      setCategoryPreviewImage(null)
      setEditCategoryId(null)
      setShowCategoryForm(false)
      fetchCategories(true)
    } catch (err) {
      showToast("Erreur lors de l'enregistrement de la catégorie", "error")
      console.error("Error submitting category:", err)
    }
  }

  const handleEditCategory = (cat) => {
    const tr = cat.translations || {}
    setCategoryFormData({
      name: cat.name ?? "",
      image: null,
      translations: {
        fr: { name: (tr.fr && tr.fr.name) || "" },
        ar: { name: (tr.ar && tr.ar.name) || "" },
      },
    })
    setEditCategoryId(cat._id)
    setShowCategoryForm(true)

    if (cat.image) {
      setCategoryPreviewImage(`${cat.image}`)
    } else {
      setCategoryPreviewImage(null)
    }
  }

  const handleDeleteCategory = (id) => {
    openConfirm("Voulez-vous vraiment supprimer cette catégorie ?", async () => {
      closeConfirm()
      try {
        await API.delete(`/categories-boisson/${id}`)
        fetchCategories(false)
        showToast("Catégorie supprimée avec succès", "success")
      } catch (error) {
        console.error("Error deleting category:", error)
        showToast("Erreur lors de la suppression", "error")
      }
    })
  }

  const handleBoissonSubmit = async (e) => {
    e.preventDefault()
    if (!activeCategory) return showToast("Sélectionnez une catégorie", "info")

    const currentCategoryId = activeCategory._id

    try {
      const form = new FormData()
      form.append("title", boissonFormData.title ?? "")
      form.append("description", boissonFormData.description ?? "")
      form.append("order", String(Number(boissonFormData.order ?? 0)))
      form.append("price", boissonFormData.price ?? "")
      form.append("quantity", boissonFormData.quantity ?? "")
      form.append(
        "translations",
        JSON.stringify({
          fr: boissonFormData.translations?.fr || { title: "", description: "" },
          ar: boissonFormData.translations?.ar || { title: "", description: "" },
        }),
      )
      if (boissonFormData.image) {
        form.append("image", boissonFormData.image)
      }
      form.append("category", currentCategoryId)

      if (editBoissonId) {
        await API.put(`/boissons/${editBoissonId}`, form, {
          headers: { "Content-Type": "multipart/form-data" },
        })
        showToast("Boisson modifiée avec succès", "success")
      } else {
        await API.post("/boissons", form, {
          headers: { "Content-Type": "multipart/form-data" },
        })
        showToast("Boisson ajoutée avec succès", "success")
      }

      setBoissonFormData({
        title: "",
        order: 0,
        price: "",
        quantity: "",
        description: "",
        image: null,
        translations: { fr: { title: "", description: "" }, ar: { title: "", description: "" } },
      })
      setEditBoissonId(null)
      setShowBoissonForm(false)
      setPreviewImage(null)
      fetchBoissons(currentCategoryId)
    } catch (error) {
      console.error("Error submitting boisson:", error)
      showToast("Erreur lors de l'enregistrement", "error")
    }
  }

  const handleBoissonChange = (e) => {
    const { name, value, files } = e.target
    if (name === "image" && files && files[0]) {
      setBoissonFormData((prev) => ({ ...prev, image: files[0] }))
      const reader = new FileReader()
      reader.onloadend = () => setPreviewImage(reader.result)
      reader.readAsDataURL(files[0])
    } else if (name === "order") {
      const raw = value.trim() === "" ? 0 : value
      const num = parseInt(raw, 10)
      setBoissonFormData((prev) => ({ ...prev, order: Number.isNaN(num) ? 0 : num }))
    } else if (name.startsWith("tr_")) {
      const [, lang, field] = name.split("_")
      setBoissonFormData((prev) => ({
        ...prev,
        translations: {
          ...prev.translations,
          [lang]: { ...prev.translations[lang], [field]: value },
        },
      }))
    } else {
      setBoissonFormData((prev) => ({ ...prev, [name]: value }))
    }
  }

  const handleEditBoisson = (boisson) => {
    const tr = boisson.translations || {}
    setBoissonFormData({
      title: boisson.title,
      order: Number(boisson.order) || 0,
      price: boisson.price,
      quantity: boisson.quantity,
      description: boisson.description || "",
      image: null,
      translations: {
        fr: { title: (tr.fr && tr.fr.title) || "", description: (tr.fr && tr.fr.description) || "" },
        ar: { title: (tr.ar && tr.ar.title) || "", description: (tr.ar && tr.ar.description) || "" },
      },
    })
    setEditBoissonId(boisson._id)
    setShowBoissonForm(true)
    setActiveLang("fr")

    if (boisson.image) {
      setPreviewImage(`${boisson.image}`)
    } else {
      setPreviewImage(null)
    }

    setTimeout(() => {
      const form = document.querySelector(".boisson-form, .light-boisson-form")
      if (form) form.scrollIntoView({ behavior: "smooth", block: "start" })
    }, 100)
  }

  const handleDeleteBoisson = (id) => {
    openConfirm("Voulez-vous vraiment supprimer cette boisson ?", async () => {
      closeConfirm()
      try {
        await API.delete(`/boissons/${id}`)
        fetchBoissons(activeCategory._id)
        showToast("Boisson supprimée avec succès", "success")
      } catch (error) {
        console.error("Error deleting boisson:", error)
        showToast("Erreur lors de la suppression", "error")
      }
    })
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
      if (sortOrder === "order") {
        return (a.order ?? 999) - (b.order ?? 999)
      } else if (sortOrder === "newest") {
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
      {/* ── Mobile header ── */}
      <div className={isDarkMode ? "mobile-header" : "light-mobile-header"}>
        <button className="light-menu-toggle" onClick={toggleSidebar}>
          <span></span><span></span><span></span>
        </button>
        <div className={isDarkMode ? "mobile-logo" : "light-mobile-logo"}>
          <img src={isDarkMode ? "/GUESTLY_LIGHT.jpg" : "/GUESTLY_DARK.jpg"} alt="Guestly" style={{ width: 140, height: "auto", objectFit: "contain" }} />
        </div>
        <div className={isDarkMode ? "user-avatar" : "light-user-avatar"}>{user.username.charAt(0)}</div>
      </div>

      {/* ── Sidebar ── */}
      <div className={`${isDarkMode ? "sidebar" : "light-sidebar"} ${isSidebarOpen ? "open" : ""}`}>
        <div className={isDarkMode ? "sidebar-header" : "light-sidebar-header"}>
          <img src={isDarkMode ? "/GUESTLY_LIGHT.jpg" : "/GUESTLY_DARK.jpg"} alt="Guestly" style={{ width: 150, height: "auto", objectFit: "contain" }} />
          <button className={isDarkMode ? "close-sidebar" : "light-close-sidebar"} onClick={toggleSidebar}>×</button>
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
            <li><a href="#dashboard" onClick={() => navigate("/dashboard")}><span className={isDarkMode ? "nav-icon" : "light-nav-icon"}>🏠</span><span>Tableau de bord</span></a></li>
            <li><a href="#profile" onClick={() => navigate("/profile")}><span className={isDarkMode ? "nav-icon" : "light-nav-icon"}>👤</span><span>Mon profil</span></a></li>
            <li><a href="#settings" onClick={() => navigate("/settings")}><span className={isDarkMode ? "nav-icon" : "light-nav-icon"}>⚙️</span><span>Paramètres</span></a></li>
            <li className="active"><a href="#boissons"><span className={isDarkMode ? "nav-icon" : "light-nav-icon"}>🥤</span><span>Boissons</span></a></li>
          </ul>
        </nav>
        <div className={isDarkMode ? "sidebar-footer" : "light-sidebar-footer"}>
          <button className={isDarkMode ? "logout-button" : "light-logout-button"} onClick={() => { localStorage.removeItem("token"); localStorage.removeItem("user"); navigate("/") }}>
            <span className={isDarkMode ? "nav-icon" : "light-nav-icon"}>🚪</span><span>Déconnexion</span>
          </button>
        </div>
      </div>

      {/* ── Main ── */}
      <div className={isDarkMode ? "main-content" : "light-main-content"}>

        {/* Page header */}
        <div className={`bp-page-header ${isDarkMode ? "bp-dark" : "bp-light"}`}>
          <div className="bp-page-header-left">
            <div className="bp-page-icon">🥤</div>
            <div>
              <h1 className="bp-page-title">Boissons</h1>
              <p className="bp-page-sub">Gérez vos boissons par catégorie</p>
            </div>
          </div>
          <div className="bp-page-header-right">
            <button className={`bp-icon-btn ${isDarkMode ? "bp-dark" : "bp-light"}`} title="Notifications">🔔</button>
            <button className={`bp-icon-btn ${isDarkMode ? "bp-dark" : "bp-light"}`} onClick={toggleTheme} title="Thème">{isDarkMode ? "☀️" : "🌙"}</button>
            <div className="bp-avatar">{user.username.charAt(0)}</div>
          </div>
        </div>

        {/* ── 2-column layout ── */}
        <div className="bp-layout">

          {/* LEFT — Categories panel */}
          <aside className={`bp-cat-panel ${isDarkMode ? "bp-dark" : "bp-light"}`}>
            <div className="bp-cat-panel-head">
              <span className="bp-cat-panel-title">Catégories</span>
              <button
                className={`bp-add-cat-btn ${isDarkMode ? "bp-dark" : "bp-light"} ${showCategoryForm ? "active" : ""}`}
                onClick={() => setShowCategoryForm(!showCategoryForm)}
                title={showCategoryForm ? "Fermer" : "Nouvelle catégorie"}
              >
                {showCategoryForm ? "✕" : "+"}
              </button>
            </div>

            {showCategoryForm && (
              <form onSubmit={handleCategorySubmit} className={`bp-form ${isDarkMode ? "bp-dark" : "bp-light"}`}>
                <p className="bp-form-title">{editCategoryId ? "Modifier la catégorie" : "Nouvelle catégorie"}</p>
                <label className="bp-label">Nom *</label>
                <input type="text" name="name" placeholder="Nom de la catégorie" value={categoryFormData.name} onChange={handleCategoryChange} required className="bp-input" />

                <label className="bp-label">Traduction</label>
                <div className="bp-lang-tabs">
                  <button type="button" className={`bp-lang-tab ${activeCategoryLang === "fr" ? "active" : ""}`} onClick={() => setActiveCategoryLang("fr")}>FR</button>
                  <button type="button" className={`bp-lang-tab ${activeCategoryLang === "ar" ? "active" : ""}`} onClick={() => setActiveCategoryLang("ar")}>AR</button>
                </div>
                <input type="text" name={`tr_${activeCategoryLang}_name`} value={categoryFormData.translations?.[activeCategoryLang]?.name ?? ""} onChange={handleCategoryChange} placeholder={activeCategoryLang === "fr" ? "Nom en français" : "الاسم بالعربية"} className="bp-input" />

                <label className="bp-label">Image</label>
                <CompressedFileInput type="file" id="categoryImage" name="image" accept="image/*" onChange={handleCategoryChange} className="bp-file-input" />
                {categoryPreviewImage && <img src={categoryPreviewImage} alt="aperçu" className="bp-preview-img" />}

                <div className="bp-form-actions">
                  <button type="button" className="bp-btn bp-btn-ghost" onClick={() => { setShowCategoryForm(false); setEditCategoryId(null); setCategoryPreviewImage(null) }}>Annuler</button>
                  <button type="submit" className="bp-btn bp-btn-primary">{editCategoryId ? "Enregistrer" : "Créer"}</button>
                </div>
              </form>
            )}

            {categories.length === 0 ? (
              <div className="bp-empty-cats">
                <span>🥤</span>
                <p>Aucune catégorie</p>
                <button className="bp-btn bp-btn-primary" onClick={() => setShowCategoryForm(true)}>Créer</button>
              </div>
            ) : (
              <ul className="bp-cat-list">
                {categories.map((cat) => (
                  <li
                    key={cat._id}
                    onClick={() => { setActiveCategory(cat); fetchBoissons(cat._id); setShowBoissonForm(false); setEditBoissonId(null) }}
                    className={`bp-cat-item ${activeCategory?._id === cat._id ? "active" : ""} ${isDarkMode ? "bp-dark" : "bp-light"}`}
                  >
                    <div className="bp-cat-thumb">
                      {cat.image
                        ? <img src={cat.image} alt={cat.name} onError={(e) => (e.target.src = "/abstract-categories.png")} />
                        : <span>🥤</span>}
                    </div>
                    <span className="bp-cat-name">{cat.name}</span>
                    {activeCategory?._id === cat._id && <span className="bp-cat-active-dot" />}
                    <div className="bp-cat-item-actions">
                      <button className="bp-icon-action" title="Modifier" onClick={(e) => { e.stopPropagation(); handleEditCategory(cat) }}>✏️</button>
                      <button className="bp-icon-action danger" title="Supprimer" onClick={(e) => { e.stopPropagation(); handleDeleteCategory(cat._id) }}>🗑️</button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </aside>

          {/* RIGHT — Boissons panel */}
          <main className={`bp-boissons-panel ${isDarkMode ? "bp-dark" : "bp-light"}`}>

            {!activeCategory ? (
              <div className="bp-select-prompt">
                <span>👈</span>
                <p>Sélectionnez une catégorie</p>
              </div>
            ) : (
              <>
                {/* Toolbar */}
                <div className="bp-toolbar">
                  <div className="bp-toolbar-left">
                    <div className="bp-active-cat-badge">
                      {activeCategory.image && <img src={activeCategory.image} alt="" className="bp-active-cat-img" onError={(e) => (e.target.src = "/abstract-categories.png")} />}
                      <span className="bp-active-cat-name">{activeCategory.name}</span>
                      <span className="bp-active-cat-count">{filteredBoissons.length}</span>
                    </div>
                  </div>
                  <div className="bp-toolbar-right">
                    <div className={`bp-search-box ${isDarkMode ? "bp-dark" : "bp-light"}`}>
                      <span className="bp-search-icon">🔍</span>
                      <input className="bp-search-input" type="text" placeholder="Rechercher…" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                    </div>
                    <select className={`bp-select ${isDarkMode ? "bp-dark" : "bp-light"}`} value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
                      <option value="order">Ordre</option>
                      <option value="newest">Récent</option>
                      <option value="oldest">Ancien</option>
                      <option value="alphabetical">A→Z</option>
                      <option value="price-asc">Prix ↑</option>
                      <option value="price-desc">Prix ↓</option>
                    </select>
                    <div className="bp-view-toggle">
                      <button className={`bp-view-btn ${viewMode === "grid" ? "active" : ""}`} onClick={() => setViewMode("grid")} title="Grille">▦</button>
                      <button className={`bp-view-btn ${viewMode === "list" ? "active" : ""}`} onClick={() => setViewMode("list")} title="Liste">☰</button>
                    </div>
                    <button
                      className={`bp-btn ${showBoissonForm ? "bp-btn-ghost" : "bp-btn-primary"}`}
                      onClick={() => {
                        if (showBoissonForm) {
                          setShowBoissonForm(false); setEditBoissonId(null); setPreviewImage(null)
                          setBoissonFormData({ title: "", order: 0, price: "", quantity: "", description: "", image: null, translations: { fr: { title: "", description: "" }, ar: { title: "", description: "" } } })
                        } else {
                          setEditBoissonId(null); setPreviewImage(null)
                          setBoissonFormData({ title: "", order: 0, price: "", quantity: "", description: "", image: null, translations: { fr: { title: "", description: "" }, ar: { title: "", description: "" } } })
                          setShowBoissonForm(true)
                        }
                      }}
                    >
                      {showBoissonForm ? "✕ Annuler" : "+ Ajouter"}
                    </button>
                  </div>
                </div>

                {/* Boisson form */}
                {showBoissonForm && (
                  <form onSubmit={handleBoissonSubmit} className={`bp-form bp-boisson-form ${isDarkMode ? "bp-dark" : "bp-light"}`}>
                    <p className="bp-form-title">{editBoissonId ? "Modifier la boisson" : "Nouvelle boisson"}</p>
                    <div className="bp-form-grid">
                      <div className="bp-form-col">
                        <label className="bp-label">Titre *</label>
                        <input type="text" name="title" placeholder="Nom de la boisson" value={boissonFormData.title} onChange={handleBoissonChange} required className="bp-input" />
                        <label className="bp-label">Description</label>
                        <textarea name="description" placeholder="Description…" value={boissonFormData.description} onChange={handleBoissonChange} className="bp-textarea" rows={3} />
                        <label className="bp-label">Traduction</label>
                        <div className="bp-lang-tabs">
                          <button type="button" className={`bp-lang-tab ${activeLang === "fr" ? "active" : ""}`} onClick={() => setActiveLang("fr")}>FR</button>
                          <button type="button" className={`bp-lang-tab ${activeLang === "ar" ? "active" : ""}`} onClick={() => setActiveLang("ar")}>AR</button>
                        </div>
                        <input type="text" name={`tr_${activeLang}_title`} value={boissonFormData.translations?.[activeLang]?.title ?? ""} onChange={handleBoissonChange} placeholder={activeLang === "fr" ? "Titre FR" : "العنوان"} className="bp-input" />
                        <textarea name={`tr_${activeLang}_description`} value={boissonFormData.translations?.[activeLang]?.description ?? ""} onChange={handleBoissonChange} placeholder={activeLang === "fr" ? "Description FR" : "الوصف"} className="bp-textarea" rows={2} />
                      </div>
                      <div className="bp-form-col">
                        <div className="bp-form-row3">
                          <div>
                            <label className="bp-label">Prix (TND) *</label>
                            <input type="number" name="price" placeholder="0.00" value={boissonFormData.price} onChange={handleBoissonChange} required className="bp-input" />
                          </div>
                          <div>
                            <label className="bp-label">Quantité</label>
                            <input type="number" name="quantity" placeholder="0" value={boissonFormData.quantity} onChange={handleBoissonChange} className="bp-input" />
                          </div>
                          <div>
                            <label className="bp-label">Ordre</label>
                            <input type="number" name="order" min={0} placeholder="0" value={Number(boissonFormData.order ?? 0)} onChange={handleBoissonChange} className="bp-input" />
                          </div>
                        </div>
                        <label className="bp-label">Image</label>
                        <CompressedFileInput type="file" name="image" accept="image/*" onChange={handleBoissonChange} className="bp-file-input" />
                        {previewImage && <img src={previewImage} alt="aperçu" className="bp-preview-img bp-preview-lg" />}
                      </div>
                    </div>
                    <div className="bp-form-actions">
                      <button type="button" className="bp-btn bp-btn-ghost" onClick={() => { setShowBoissonForm(false); setEditBoissonId(null); setPreviewImage(null) }}>Annuler</button>
                      <button type="submit" className="bp-btn bp-btn-primary">{editBoissonId ? "Enregistrer" : "Créer la boisson"}</button>
                    </div>
                  </form>
                )}

                {/* Boissons grid/list */}
                {isLoading ? (
                  <div className="bp-loading"><div className="bp-spinner" /><span>Chargement…</span></div>
                ) : filteredBoissons.length === 0 ? (
                  <div className="bp-empty">
                    <span className="bp-empty-icon">🥤</span>
                    <p>Aucune boisson dans cette catégorie</p>
                    <button className="bp-btn bp-btn-primary" onClick={() => setShowBoissonForm(true)}>Ajouter la première</button>
                  </div>
                ) : (
                  <div className={`bp-boisson-grid ${viewMode}`}>
                    {filteredBoissons.map((boisson) => (
                      <div key={boisson._id} className={`bp-boisson-card ${isDarkMode ? "bp-dark" : "bp-light"}`}>
                        <div className="bp-boisson-img-wrap">
                          <img
                            src={boisson.image || "/refreshing-summer-drink.png"}
                            alt={boisson.title}
                            className="bp-boisson-img"
                            onError={(e) => (e.target.src = "/refreshing-summer-drink.png")}
                          />
                          <span className="bp-price-tag">{boisson.price} TND</span>
                        </div>
                        <div className="bp-boisson-body">
                          <h4 className="bp-boisson-title">{boisson.title}</h4>
                          <div className="bp-boisson-meta">
                            <span className="bp-meta-chip">📦 {boisson.quantity}</span>
                            <span className="bp-meta-chip">#{boisson.order ?? 0}</span>
                          </div>
                          {boisson.description && <p className="bp-boisson-desc">{boisson.description}</p>}
                          <div className="bp-boisson-actions">
                            <button className="bp-btn bp-btn-sm bp-btn-ghost" onClick={() => handleEditBoisson(boisson)}>✏️ Modifier</button>
                            <button className="bp-btn bp-btn-sm bp-btn-danger" onClick={() => handleDeleteBoisson(boisson._id)}>🗑️</button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </main>
        </div>
      </div>

      <Toast message={toast.message} type={toast.type} onClose={closeToast} />
      <ConfirmDialog
        open={confirmDialog.open}
        message={confirmDialog.message}
        onConfirm={confirmDialog.onConfirm}
        onCancel={closeConfirm}
      />

    </div>
  )
}

export default BoissonsPage
