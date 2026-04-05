"use client"

import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import {
  CircleDot,
  LeafyGreen,
  Shrimp,
  Wheat,
  Nut,
  Milk,
  Leaf,
  Egg,
  Fish,
  Shell,
  Circle,
  Bean,
  Wine,
  Pencil,
  Trash2,
  ImagePlus,
  ListOrdered,
  Plus,
} from "lucide-react"
import API from "../services/api"
import "./MenusPage.css"
import "./RoomServicePage.css"
import CompressedFileInput from "../components/CompressedFileInput"

const ALLERGENS_LIST = [
  { key: "allergenArachide", label: "Arachide", Icon: CircleDot },
  { key: "allergenCeleri", label: "Céleri", Icon: LeafyGreen },
  { key: "allergenCrustaces", label: "Crustacés", Icon: Shrimp },
  { key: "allergenGluten", label: "Gluten", Icon: Wheat },
  { key: "allergenFruitsANoque", label: "Fruits à coque", Icon: Nut },
  { key: "allergenLait", label: "Lait", Icon: Milk },
  { key: "allergenLupin", label: "Lupin", Icon: Leaf },
  { key: "allergenOeuf", label: "Œuf", Icon: Egg },
  { key: "allergenPoisson", label: "Poisson", Icon: Fish },
  { key: "allergenMollusques", label: "Mollusques", Icon: Shell },
  { key: "allergenMoutarde", label: "Moutarde", Icon: Circle },
  { key: "allergenSesame", label: "Sésame", Icon: Circle },
  { key: "allergenSoja", label: "Soja", Icon: Bean },
  { key: "allergenSulfites", label: "Sulfites", Icon: Wine },
]

// Gabarit commun pour les traductions de services (FR / EN / AR)
const EMPTY_SERVICE_TRANSLATIONS = {
  fr: { name: "", description: "" },
  en: { name: "", description: "" },
  ar: { name: "", description: "" },
}

const RoomServicePage = () => {
  const navigate = useNavigate()
  const [services, setServices] = useState([])
  const [selectedService, setSelectedService] = useState(null)
  const [menus, setMenus] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [showServiceForm, setShowServiceForm] = useState(false)
  const [serviceFormData, setServiceFormData] = useState({
    name: "",
    description: "",
    translations: EMPTY_SERVICE_TRANSLATIONS,
  })
  const defaultMenuItem = () => ({
    name: "",
    description: "",
    price: "",
    // Traductions item (FR / AR) comme sur les pages Restaurants / SkyLounge / Spas
    translations: { fr: { name: "", description: "" }, ar: { name: "", description: "" } },
    isVegetarian: false,
    isOrganic: false,
    isLocal: false,
    allergenArachide: false,
    allergenCeleri: false,
    allergenCrustaces: false,
    allergenGluten: false,
    allergenFruitsANoque: false,
    allergenLait: false,
    allergenLupin: false,
    allergenOeuf: false,
    allergenPoisson: false,
    allergenMollusques: false,
    allergenMoutarde: false,
    allergenSesame: false,
    allergenSoja: false,
    allergenSulfites: false,
    isAvailable24_7: false,
    commandable: true,
  })
  const [formData, setFormData] = useState({
    title: "",
    order: 0,
    images: [],
    items: [defaultMenuItem()],
    // Traductions menu (FR / AR) comme sur RestaurantsAndMenusPage / SkyLoungePage
    translations: { fr: { title: "" }, ar: { title: "" } },
  })
  const [activeMenuLang, setActiveMenuLang] = useState("fr")
  const [activeItemLang, setActiveItemLang] = useState("fr")
  const [editId, setEditId] = useState(null)
  const [previewImages, setPreviewImages] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [editingServiceId, setEditingServiceId] = useState(null)
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

  const handleEditService = (service) => {
    setEditingServiceId(service._id)
    const tr = service.translations || {}
    // Utiliser les traductions EN si disponibles, sinon le champ par défaut
    const enName = tr.en?.name || service.name || ""
    const enDescription = tr.en?.description || service.description || ""
    setServiceFormData({
      name: enName,
      description: enDescription,
      translations: {
        fr: {
          name: tr.fr?.name || "",
          description: tr.fr?.description || "",
        },
        en: {
          name: enName,
          description: enDescription,
        },
        ar: {
          name: tr.ar?.name || "",
          description: tr.ar?.description || "",
        },
      },
    })
    setShowServiceForm(true)
  }

  const fetchServices = async () => {
    setIsLoading(true)
    try {
      const res = await API.get("/room-services")
      setServices(res.data)
    } catch (error) {
      console.error("Erreur chargement services:", error)
      alert("Erreur lors du chargement des services")
    } finally {
      setIsLoading(false)
    }
  }

  const fetchMenus = async (serviceId) => {
    setIsLoading(true)
    try {
      const res = await API.get("/menus")
      const filteredMenus = res.data
        .filter((menu) => menu.roomService?._id === serviceId || menu.roomService === serviceId)
        .sort((a, b) => (a.order ?? 999) - (b.order ?? 999))
      setMenus(filteredMenus)
    } catch (error) {
      console.error("Erreur chargement menus:", error)
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

    fetchServices()

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

  const handleSelectService = (service) => {
    setSelectedService(service)
    fetchMenus(service._id)
    setShowForm(false)
    setEditId(null)
    resetForm()
    setViewMode("grid") // Always set to grid view when selecting a service
  }

const handleChange = (e) => {
  const { name, value, files } = e.target
  if (name === "images" && files && files.length > 0) {
    // Handle multiple image files
    const imageFiles = Array.from(files)

    // Combine existing images with new ones when editing
    const currentImages = formData.images || []
    const updatedImages = [...currentImages, ...imageFiles]

    setFormData((prev) => ({ ...prev, images: updatedImages }))

    // Create preview URLs for all NEW selected images only
    const newPreviewUrls = []
    imageFiles.forEach((file) => {
      const reader = new FileReader()
      reader.onloadend = () => {
        newPreviewUrls.push(reader.result)
        if (newPreviewUrls.length === imageFiles.length) {
          // Keep existing previews and add new ones
          setPreviewImages((prevPreviews) => [...prevPreviews, ...newPreviewUrls])
        }
      }
      reader.readAsDataURL(file)
    })
  } else if (name === "order") {
    const raw = value.trim() === "" ? 0 : value
    const num = parseInt(raw, 10)
    setFormData((prev) => ({ ...prev, order: Number.isNaN(num) ? 0 : num }))
  } else if (name.startsWith("tr_")) {
    // Gestion des traductions du menu (FR / AR) comme sur RestaurantsAndMenusPage
    const [, lang, field] = name.split("_")
    setFormData((prev) => ({
      ...prev,
      translations: {
        ...prev.translations,
        [lang]: { ...(prev.translations || {})[lang], [field]: value },
      },
    }))
  } else {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }
}
const removePreviewImage = (index) => {
  const updatedImages = formData.images.filter((_, i) => i !== index);
  const updatedPreviews = previewImages.filter((_, i) => i !== index);
  setFormData((prev) => ({ ...prev, images: updatedImages }));
  setPreviewImages(updatedPreviews);
};
  const handleItemChange = (index, field, value) => {
    const updatedItems = [...formData.items]
    if (field.startsWith("tr_")) {
      // Gestion des traductions item (FR / AR)
      const [, lang, f] = field.split("_")
      if (!updatedItems[index].translations) {
        updatedItems[index].translations = { fr: { name: "", description: "" }, ar: { name: "", description: "" } }
      }
      updatedItems[index].translations[lang] = {
        ...updatedItems[index].translations[lang],
        [f]: value,
      }
    } else {
      updatedItems[index][field] = value
    }
    setFormData((prev) => ({ ...prev, items: updatedItems }))
  }

  const addItem = () => {
    setFormData((prev) => ({
      ...prev,
      items: [...prev.items, defaultMenuItem()],
    }))
  }

  const removeItem = (index) => {
    const updatedItems = formData.items.filter((_, i) => i !== index)
    setFormData((prev) => ({ ...prev, items: updatedItems }))
  }

const handleSubmit = async (e) => {
  e.preventDefault()
  if (!selectedService) return alert("Sélectionnez un service d'abord!")

  try {
    setIsLoading(true)
    const form = new FormData()
    form.append("title", formData.title ?? "")
    form.append("order", String(Number(formData.order ?? 0)))
    // Ajout des traductions du menu (FR / AR) comme sur RestaurantsAndMenusPage / SkyLoungePage
    form.append(
      "translations",
      JSON.stringify({
        fr: formData.translations?.fr || { title: "" },
        ar: formData.translations?.ar || { title: "" },
      }),
    )
    form.append("items", JSON.stringify(formData.items))
    form.append("roomService", selectedService._id)

    // Separate existing images (URLs) from new images (Blob/File objects)
    const existingImages = []
    const newImageFiles = []

    if (formData.images && formData.images.length > 0) {
      formData.images.forEach((image, i) => {
        console.log(`[MENU_DEBUG] 🖼️ Image [${i}] type:`, typeof image, image);
        
        // Check if it's a Blob or File (new image)
        if (image instanceof Blob || image instanceof File) {
          console.log(`[MENU_DEBUG] ↳ Blob/File detected:`, image.name || 'unnamed', image.size, image.type);
          newImageFiles.push(image)
        } 
        // Check if it's a string URL (existing image)
        else if (typeof image === 'string' && image.startsWith('http')) {
          console.log(`[MENU_DEBUG] ↳ Existing URL detected:`, image);
          existingImages.push(image)
        }
        else {
          console.log(`[MENU_DEBUG] ↳ Unknown type:`, image);
        }
      })
    }

    console.log("[MENU_DEBUG] ➡️ existingImages prepared for backend:", existingImages);
    console.log("[MENU_DEBUG] ➡️ newImageFiles prepared for backend:", newImageFiles.length);

    // Append new image files (Blobs)
    if (newImageFiles.length > 0) {
      newImageFiles.forEach((image) => {
        form.append("images", image)
      })
    }

    // For edits, ALWAYS send existingImages (even if empty) so backend knows which images to keep
    if (editId) {
      form.append("existingImages", JSON.stringify(existingImages))
      console.log("[MENU_DEBUG] ➡️ Sending existingImages (may be empty):", existingImages);
    }

    if (!editId) {
      const res = await API.post("/menus", form, {
        headers: { "Content-Type": "multipart/form-data" },
      })

      const newMenuId = res.data._id

      // Now update the selected RoomService to include the new menu
      await API.put(`/room-services/${selectedService._id}`, {
        ...selectedService,
        menus: [...(selectedService.menus || []), newMenuId],
      })

      alert("Menu créé avec succès")
    } else {
      await API.put(`/menus/${editId}`, form, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      alert("Menu modifié avec succès")
    }

    fetchServices()
    fetchMenus(selectedService._id)
    resetForm()
    setShowForm(false)
  } catch (error) {
    console.error("Erreur lors de l'enregistrement du menu:", error)
    alert("Erreur d'enregistrement")
  } finally {
    setIsLoading(false)
  }
}

const handleEdit = (menu) => {
  console.log("Editing menu:", menu)
  const trMenu = menu.translations || {}
  const normalizedItems = (menu.items || []).map((item) => {
    const it = { ...defaultMenuItem(), ...item, price: item.price ?? "" }
    const tr = item.translations || {}
    it.translations = {
      fr: { name: (tr.fr && tr.fr.name) || "", description: (tr.fr && tr.fr.description) || "" },
      ar: { name: (tr.ar && tr.ar.name) || "", description: (tr.ar && tr.ar.description) || "" },
    }
    return it
  })

  setFormData({
    title: menu.title ?? "",
    order: Number(menu.order) || 0,
    images: menu.images || [],
    items: normalizedItems,
    translations: {
      fr: { title: (trMenu.fr && trMenu.fr.title) || "" },
      ar: { title: (trMenu.ar && trMenu.ar.title) || "" },
    },
  })
  setEditId(menu._id)
  setShowForm(true)

  if (menu.images && menu.images.length > 0) {
    setPreviewImages(menu.images)
  } else {
    setPreviewImages([])
  }
}

  const handleDelete = async (menuId) => {
    try {
      if (window.confirm("Voulez-vous supprimer ce menu ?")) {
        setIsLoading(true)
        await API.delete(`/menus/${menuId}`)

        // Check if this was the last menu and update service if needed
        const remainingMenus = menus.filter((menu) => menu._id !== menuId)
        if (remainingMenus.length === 0) {
          await API.put(`/room-services/${selectedService._id}`, {
            ...selectedService,
            hasMenus: false,
          })
          fetchServices()
        }

        fetchMenus(selectedService._id)
        alert("Menu supprimé")
      }
    } catch (error) {
      console.error("Erreur suppression:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const resetForm = () => {
    setFormData({
      title: "",
      order: 0,
      images: [],
      items: [defaultMenuItem()],
      translations: { fr: { title: "" }, ar: { title: "" } },
    })
    setPreviewImages([])
    setEditId(null)
  }

  const handleServiceSubmit = async (e) => {
    e.preventDefault()
    try {
      setIsLoading(true)

      // S'assurer que les traductions EN sont synchronisées avec les champs par défaut
      const dataToSubmit = {
        ...serviceFormData,
        translations: {
          ...serviceFormData.translations,
          en: {
            name: serviceFormData.name || serviceFormData.translations?.en?.name || "",
            description: serviceFormData.description || serviceFormData.translations?.en?.description || "",
          },
        },
      }

      if (editingServiceId) {
        await API.put(`/room-services/${editingServiceId}`, dataToSubmit)
        alert("Service modifié avec succès")
      } else {
        await API.post("/room-services", dataToSubmit)
        alert("Service créé avec succès")
      }

      fetchServices()
      setShowServiceForm(false)
      setEditingServiceId(null)
      setServiceFormData({
        name: "",
        description: "",
        translations: EMPTY_SERVICE_TRANSLATIONS,
      })
    } catch (error) {
      console.error("Erreur soumission service:", error)
      alert("Erreur lors de la soumission")
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteService = async (id) => {
    if (window.confirm("Voulez-vous vraiment supprimer ce service ?")) {
      try {
        setIsLoading(true)
        await API.delete(`/room-services/${id}`)
        alert("Service supprimé")
        fetchServices()
      } catch (error) {
        console.error("Erreur suppression:", error)
        alert("Erreur lors de la suppression")
      } finally {
        setIsLoading(false)
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

  const filteredServices = services
    .filter(
      (s) =>
        s.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.description?.toLowerCase().includes(searchTerm.toLowerCase()),
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

  const filteredMenus = menus
    .filter(
      (m) =>
        m.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.items?.some(
          (item) =>
            item.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.description?.toLowerCase().includes(searchTerm.toLowerCase()),
        ),
    )
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
        <button className="light-menu-toggle" onClick={toggleSidebar}>
          <span></span>
          <span></span>
          <span></span>
        </button>
        <div className={isDarkMode ? "mobile-logo" : "light-mobile-logo"}>
          <img
            src={isDarkMode ? "/GUESTLY_LIGHT.jpg" : "/GUESTLY_DARK.jpg"}
            alt="Guestly Logo"
            style={{ objectFit: "contain", transition: "opacity 0.3s ease" }}
          />
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
              <a href="#roomservice">
                <span className={isDarkMode ? "nav-icon" : "light-nav-icon"}>🛎️</span>
                <span>Room Service</span>
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
              {selectedService ? `${selectedService.name} - Menus` : "Room Service & Menus"}{" "}
              <span className={isDarkMode ? "wave-emoji" : "light-wave-emoji"}>🛎️</span>
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
          <p>
            {selectedService
              ? `Gérez les menus du service ${selectedService.name}`
              : "Gérez vos services et leurs menus"}
          </p>
        </div>

        <div className={isDarkMode ? "search-filter-container" : "light-search-filter-container"}>
          <div className={isDarkMode ? "search-container" : "light-search-container"}>
            <span className="search-icon">🔍</span>
            <input
              className={isDarkMode ? "search-input" : "light-search-input"}
              type="text"
              placeholder={selectedService ? "Rechercher un menu..." : "Rechercher un service..."}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="view-sort-container">
            {!selectedService && (
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
            )}

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

        {!selectedService ? (
          <>
            <div className={isDarkMode ? "section-header" : "light-section-header"}>
              <h2>Liste des services</h2>
              <div className="section-actions">
                <button
                  className={isDarkMode ? "section-action" : "light-section-action"}
                  onClick={() => setShowServiceForm(!showServiceForm)}
                >
                  <span>{showServiceForm ? "Annuler" : "Ajouter"}</span>
                  <span className="action-icon">{showServiceForm ? "❌" : "+"}</span>
                </button>
              </div>
            </div>

            {showServiceForm && (
              <div className={isDarkMode ? "form-container" : "light-form-container"}>
                <form onSubmit={handleServiceSubmit} className={isDarkMode ? "service-form" : "light-service-form"}>
                  <div className={isDarkMode ? "form-section" : "light-form-section"}>
                    <label className={isDarkMode ? "form-label" : "light-form-label"}>
                      English (Default) *
                    </label>
                    <input
                      type="text"
                      name="name"
                      placeholder="Service name"
                      value={serviceFormData.name}
                      onChange={(e) => setServiceFormData((prev) => ({ ...prev, name: e.target.value }))}
                      required
                      className={isDarkMode ? "form-input" : "light-form-input"}
                    />
                    <textarea
                      name="description"
                      placeholder="Service description"
                      value={serviceFormData.description}
                      onChange={(e) => setServiceFormData((prev) => ({ ...prev, description: e.target.value }))}
                      className={isDarkMode ? "form-input" : "light-form-input"}
                      rows={3}
                    />
                  </div>

                  <div className={isDarkMode ? "form-section" : "light-form-section"}>
                    <label className={isDarkMode ? "form-label" : "light-form-label"}>
                      Français
                    </label>
                    <input
                      type="text"
                      value={serviceFormData.translations?.fr?.name ?? ""}
                      onChange={(e) =>
                        setServiceFormData((prev) => ({
                          ...prev,
                          translations: {
                            ...(prev.translations || {}),
                            fr: {
                              ...(prev.translations?.fr || {}),
                              name: e.target.value,
                            },
                          },
                        }))
                      }
                      placeholder="Nom du service"
                      className={isDarkMode ? "form-input" : "light-form-input"}
                    />
                    <textarea
                      value={serviceFormData.translations?.fr?.description ?? ""}
                      onChange={(e) =>
                        setServiceFormData((prev) => ({
                          ...prev,
                          translations: {
                            ...(prev.translations || {}),
                            fr: {
                              ...(prev.translations?.fr || {}),
                              description: e.target.value,
                            },
                          },
                        }))
                      }
                      placeholder="Description du service"
                      className={isDarkMode ? "form-input" : "light-form-input"}
                      rows={3}
                    />
                  </div>

                  <div className={isDarkMode ? "form-section" : "light-form-section"}>
                    <label className={isDarkMode ? "form-label" : "light-form-label"}>
                      العربية
                    </label>
                    <input
                      type="text"
                      value={serviceFormData.translations?.ar?.name ?? ""}
                      onChange={(e) =>
                        setServiceFormData((prev) => ({
                          ...prev,
                          translations: {
                            ...(prev.translations || {}),
                            ar: {
                              ...(prev.translations?.ar || {}),
                              name: e.target.value,
                            },
                          },
                        }))
                      }
                      placeholder="اسم الخدمة"
                      className={isDarkMode ? "form-input" : "light-form-input"}
                      dir="rtl"
                    />
                    <textarea
                      value={serviceFormData.translations?.ar?.description ?? ""}
                      onChange={(e) =>
                        setServiceFormData((prev) => ({
                          ...prev,
                          translations: {
                            ...(prev.translations || {}),
                            ar: {
                              ...(prev.translations?.ar || {}),
                              description: e.target.value,
                            },
                          },
                        }))
                      }
                      placeholder="وصف الخدمة"
                      className={isDarkMode ? "form-input" : "light-form-input"}
                      rows={3}
                      dir="rtl"
                    />
                  </div>
                  <div className={isDarkMode ? "form-actions" : "light-form-actions"}>
                    <button
                      type="submit"
                      className={isDarkMode ? "btn btn-primary" : "light-btn light-btn-primary"}
                      disabled={isLoading}
                    >
                      {isLoading ? "Chargement..." : editingServiceId ? "✅ Modifier" : "✅ Créer"}
                    </button>
                    <button
                      type="button"
                      className={isDarkMode ? "btn btn-secondary" : "light-btn light-btn-secondary"}
                      onClick={() => {
                        setShowServiceForm(false)
                        setEditingServiceId(null)
                        setServiceFormData({
                          name: "",
                          description: "",
                          translations: EMPTY_SERVICE_TRANSLATIONS,
                        })
                      }}
                      disabled={isLoading}
                    >
                      ❌ Annuler
                    </button>
                  </div>
                </form>
              </div>
            )}

            {filteredServices.length === 0 ? (
              <div className={isDarkMode ? "empty-state" : "light-empty-state"}>
                <div className="empty-icon">🛎️</div>
                <h3>Aucun service trouvé</h3>
                <p>Commencez par créer un nouveau service</p>
                <button
                  className={isDarkMode ? "btn btn-primary" : "light-btn light-btn-primary"}
                  onClick={() => setShowServiceForm(true)}
                >
                  Créer un service
                </button>
              </div>
            ) : (
              <div className={`${isDarkMode ? "services-list" : "light-services-list"} ${viewMode}`}>
                {filteredServices.map((service) => (
                  <div
                    key={service._id}
                    role="button"
                    tabIndex={0}
                    onClick={() => handleSelectService(service)}
                    onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); handleSelectService(service); } }}
                    className={isDarkMode ? "service-card" : "light-service-card"}
                    style={{ cursor: "pointer" }}
                  >
                    <div className={isDarkMode ? "service-card-body" : "light-service-card-body"}>
                      <h2>{service.name}</h2>
                      <div className={isDarkMode ? "service-card-description-wrap" : "light-service-card-description-wrap"}>
                        <p>{service.description || "—"}</p>
                      </div>
                      <div className={isDarkMode ? "service-card-actions" : "light-service-card-actions"} onClick={(e) => e.stopPropagation()}>
                        <button
                          type="button"
                          onClick={() => handleEditService(service)}
                          className={isDarkMode ? "btn btn-secondary" : "light-btn light-btn-secondary"}
                          aria-label="Modifier le service"
                        >
                          <Pencil size={16} aria-hidden />
                          <span>Modifier</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteService(service._id)}
                          className={isDarkMode ? "btn btn-danger" : "light-btn light-btn-danger"}
                          aria-label="Supprimer le service"
                        >
                          <Trash2 size={16} aria-hidden />
                          <span>Supprimer</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        ) : (
          <>
            <div className={isDarkMode ? "section-header" : "light-section-header"}>
              <div className="back-button-container">
                <button
                  className={isDarkMode ? "back-button" : "light-back-button"}
                  onClick={() => setSelectedService(null)}
                >
                  ← Retour aux services
                </button>
              </div>
              <h2>Menus du service: {selectedService.name}</h2>
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
                <form onSubmit={handleSubmit} className={isDarkMode ? "menu-form" : "light-menu-form"}>
                  <label className={isDarkMode ? "form-label" : "light-form-label"}>
                    Titre du menu (par défaut) *
                  </label>
                  <input
                    type="text"
                    name="title"
                    placeholder="Titre du menu"
                    value={formData.title}
                    onChange={handleChange}
                    required
                    className={isDarkMode ? "form-input" : "light-form-input"}
                  />
                  <div
                    className={isDarkMode ? "form-label" : "light-form-label"}
                    style={{ marginTop: "0.5rem" }}
                  >
                    Traductions menu (FR / AR)
                  </div>
                  <div style={{ display: "flex", gap: "0.5rem", marginBottom: "0.5rem" }}>
                    <button
                      type="button"
                      className={
                        activeMenuLang === "fr"
                          ? isDarkMode
                            ? "btn btn-primary"
                            : "light-btn light-btn-primary"
                          : isDarkMode
                          ? "btn btn-secondary"
                          : "light-btn light-btn-secondary"
                      }
                      onClick={() => setActiveMenuLang("fr")}
                    >
                      Français
                    </button>
                    <button
                      type="button"
                      className={
                        activeMenuLang === "ar"
                          ? isDarkMode
                            ? "btn btn-primary"
                            : "light-btn light-btn-primary"
                          : isDarkMode
                          ? "btn btn-secondary"
                          : "light-btn light-btn-secondary"
                      }
                      onClick={() => setActiveMenuLang("ar")}
                    >
                      العربية
                    </button>
                  </div>
                  <input
                    type="text"
                    name={`tr_${activeMenuLang}_title`}
                    value={formData.translations?.[activeMenuLang]?.title ?? ""}
                    onChange={handleChange}
                    placeholder={activeMenuLang === "fr" ? "Titre FR" : "العنوان"}
                    className={isDarkMode ? "form-input" : "light-form-input"}
                  />
                  <label className={isDarkMode ? "form-label" : "light-form-label"} style={{ display: "block", marginTop: "0.5rem", marginBottom: "0.25rem" }}>
                    Ordre d'affichage
                  </label>
                  <input
                    type="number"
                    name="order"
                    min={0}
                    placeholder="0"
                    value={Number(formData.order ?? 0)}
                    onChange={handleChange}
                    className={isDarkMode ? "form-input" : "light-form-input"}
                    style={{ maxWidth: "120px" }}
                    title="Plus le nombre est bas, plus le menu s'affiche en premier"
                  />
                  <small className="image-upload-hint" style={{ display: "block", marginBottom: "1rem" }}>0 = premier, 1 = deuxième, etc.</small>
                  <div className={isDarkMode ? "image-upload-section" : "light-image-upload-section"}>
                    <span className={isDarkMode ? "form-label" : "light-form-label"}>
                      <ImagePlus size={20} aria-hidden />
                      Images du menu (max 5)
                    </span>
                    <label htmlFor="images" className="image-upload-zone">
                      <CompressedFileInput
                        type="file"
                        name="images"
                        id="images"
                        accept="image/*"
                        multiple
                        onChange={handleChange}
                        className="image-upload-zone-input"
                      />
                      <span className="image-upload-zone-icon" aria-hidden>
                        <ImagePlus size={32} strokeWidth={1.5} />
                      </span>
                      <span className="image-upload-zone-text">
                        {previewImages.length > 0
                          ? `${previewImages.length} image${previewImages.length > 1 ? "s" : ""} sélectionnée${previewImages.length > 1 ? "s" : ""}`
                          : "Cliquez pour choisir des images (max 5)"}
                      </span>
                    </label>
                    <small className="image-upload-hint">Vous pouvez sélectionner plusieurs images (maximum 5)</small>
                  </div>

               {previewImages.length > 0 && (
  <div className="preview-images">
    {previewImages.map((img, index) => (
      <div key={index} className="preview-image-container">
        <img
          src={img || "/placeholder.svg"}
          alt={`Preview ${index + 1}`}
          className="preview-img"
        />
        <button
          type="button"
          onClick={() => removePreviewImage(index)}
          className="remove-image-btn"
        >
          ×
        </button>
      </div>
    ))}
  </div>
)}
                  <h3 className={isDarkMode ? "form-subtitle" : "light-form-subtitle"}>
                    <ListOrdered size={22} strokeWidth={2} className="form-subtitle-icon" aria-hidden />
                    Éléments du menu
                  </h3>
                  {formData.items.map((item, index) => {
                    return (
                    <div key={index} className={isDarkMode ? "menu-item" : "light-menu-item"}>
                      <div className="menu-item-header">
                        <span className="menu-item-title">
                          <ListOrdered size={16} className="menu-item-title-icon" aria-hidden />
                          Item N° {index + 1}
                        </span>
                        <button type="button" onClick={() => removeItem(index)} className="menu-item-remove-btn" aria-label={`Supprimer l'item ${index + 1}`}>
                          <Trash2 size={16} aria-hidden />
                          <span>Supprimer</span>
                        </button>
                      </div>
                      <div className="menu-item-fields-row">
                        <input
                          type="text"
                          placeholder="Nom de l'item"
                          value={item.name}
                          onChange={(e) => handleItemChange(index, "name", e.target.value)}
                          required
                          className={isDarkMode ? "form-input" : "light-form-input"}
                        />
                        <input
                          type="number"
                          placeholder="Prix (TND)"
                          value={item.price}
                          onChange={(e) => handleItemChange(index, "price", e.target.value)}
                          required
                          className={isDarkMode ? "form-input" : "light-form-input"}
                        />
                      </div>
                      <div className="menu-item-description-row">
                        <textarea
                          placeholder="Description"
                          value={item.description}
                          onChange={(e) => handleItemChange(index, "description", e.target.value)}
                          className={isDarkMode ? "form-input" : "light-form-input"}
                        />
                      </div>
                      <div
                        className={isDarkMode ? "form-label" : "light-form-label"}
                        style={{ marginTop: "0.5rem", marginBottom: "0.25rem" }}
                      >
                        Traductions item (FR / AR)
                      </div>
                      <div style={{ display: "flex", gap: "0.5rem", marginBottom: "0.5rem" }}>
                        <button
                          type="button"
                          className={
                            activeItemLang === "fr"
                              ? isDarkMode
                                ? "btn btn-primary"
                                : "light-btn light-btn-primary"
                              : isDarkMode
                              ? "btn btn-secondary"
                              : "light-btn light-btn-secondary"
                          }
                          style={{ padding: "0.35rem 0.75rem", fontSize: "0.9rem" }}
                          onClick={() => setActiveItemLang("fr")}
                        >
                          FR
                        </button>
                        <button
                          type="button"
                          className={
                            activeItemLang === "ar"
                              ? isDarkMode
                                ? "btn btn-primary"
                                : "light-btn light-btn-primary"
                              : isDarkMode
                              ? "btn btn-secondary"
                              : "light-btn light-btn-secondary"
                          }
                          style={{ padding: "0.35rem 0.75rem", fontSize: "0.9rem" }}
                          onClick={() => setActiveItemLang("ar")}
                        >
                          AR
                        </button>
                      </div>
                      <input
                        type="text"
                        placeholder={activeItemLang === "fr" ? "Nom FR" : "الاسم"}
                        value={item.translations?.[activeItemLang]?.name ?? ""}
                        onChange={(e) =>
                          handleItemChange(index, "tr_" + activeItemLang + "_name", e.target.value)
                        }
                        className={isDarkMode ? "form-input" : "light-form-input"}
                        style={{ marginBottom: "0.35rem" }}
                      />
                      <textarea
                        placeholder={activeItemLang === "fr" ? "Description FR" : "الوصف"}
                        value={item.translations?.[activeItemLang]?.description ?? ""}
                        onChange={(e) =>
                          handleItemChange(index, "tr_" + activeItemLang + "_description", e.target.value)
                        }
                        className={isDarkMode ? "form-input" : "light-form-input"}
                        rows={2}
                      />
                      <span className="menu-item-options-label">Options</span>
                      <div className="menu-item-options-row">
                        <label className={isDarkMode ? "checkbox-label" : "light-checkbox-label"}>
                          <input type="checkbox" checked={item.isVegetarian || false} onChange={(e) => handleItemChange(index, "isVegetarian", e.target.checked)} className={isDarkMode ? "checkbox-input" : "light-checkbox-input"} />
                          <span className={isDarkMode ? "checkbox-text" : "light-checkbox-text"}>Végétarien</span>
                        </label>
                        <label className={isDarkMode ? "checkbox-label" : "light-checkbox-label"}>
                          <input type="checkbox" checked={item.isOrganic || false} onChange={(e) => handleItemChange(index, "isOrganic", e.target.checked)} className={isDarkMode ? "checkbox-input" : "light-checkbox-input"} />
                          <span className={isDarkMode ? "checkbox-text" : "light-checkbox-text"}>Bio</span>
                        </label>
                        <label className={isDarkMode ? "checkbox-label" : "light-checkbox-label"}>
                          <input type="checkbox" checked={item.isLocal || false} onChange={(e) => handleItemChange(index, "isLocal", e.target.checked)} className={isDarkMode ? "checkbox-input" : "light-checkbox-input"} />
                          <span className={isDarkMode ? "checkbox-text" : "light-checkbox-text"}>Local</span>
                        </label>
                        <label className={isDarkMode ? "checkbox-label" : "light-checkbox-label"}>
                          <input type="checkbox" checked={item.isAvailable24_7 || false} onChange={(e) => handleItemChange(index, "isAvailable24_7", e.target.checked)} className={isDarkMode ? "checkbox-input" : "light-checkbox-input"} />
                          <span className={isDarkMode ? "checkbox-text" : "light-checkbox-text"}>Disponible 24/7</span>
                        </label>
                        <label className={isDarkMode ? "checkbox-label" : "light-checkbox-label"}>
                          <input type="checkbox" checked={item.commandable !== false} onChange={(e) => handleItemChange(index, "commandable", e.target.checked)} className={isDarkMode ? "checkbox-input" : "light-checkbox-input"} />
                          <span className={isDarkMode ? "checkbox-text" : "light-checkbox-text"}>Commandable</span>
                        </label>
                      </div>
                      <span className="menu-item-options-label">Allergènes (contient)</span>
                      <div className="menu-item-options-row menu-item-allergens-row">
                        {ALLERGENS_LIST.map(({ key, label, Icon }) => (
                          <label key={key} className={isDarkMode ? "checkbox-label" : "light-checkbox-label"}>
                            <input type="checkbox" checked={item[key] || false} onChange={(e) => handleItemChange(index, key, e.target.checked)} className={isDarkMode ? "checkbox-input" : "light-checkbox-input"} />
                            <span className={isDarkMode ? "checkbox-text" : "light-checkbox-text"}><Icon size={16} strokeWidth={2} className="allergen-option-icon" aria-hidden /> {label}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  )})}
                  <button
                    type="button"
                    onClick={addItem}
                    className={
                      isDarkMode ? "btn btn-secondary add-item-btn" : "light-btn light-btn-secondary light-add-item-btn"
                    }
                    aria-label="Ajouter un item au menu"
                  >
                    <Plus size={18} aria-hidden />
                    <span>Ajouter un item</span>
                  </button>

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
                      onClick={() => {
                        resetForm()
                        setShowForm(false)
                      }}
                      disabled={isLoading}
                    >
                      ❌ Annuler
                    </button>
                  </div>
                </form>
              </div>
            )}

            {filteredMenus.length === 0 ? (
              <div className={isDarkMode ? "empty-state" : "light-empty-state"}>
                <div className="empty-icon">🍽️</div>
                <h3>Aucun menu trouvé</h3>
                <p>Commencez par créer un nouveau menu pour ce service</p>
                <button
                  className={isDarkMode ? "btn btn-primary" : "light-btn light-btn-primary"}
                  onClick={() => setShowForm(true)}
                >
                  Créer un menu
                </button>
              </div>
            ) : (
              <div className={isDarkMode ? "menus-container grid" : "light-menus-container grid"}>
                {filteredMenus.map((menu) => (
                  <div key={menu._id} className={isDarkMode ? "menu-card" : "light-menu-card"}>
                    <div className="menu-images-display">
                      {menu.images && menu.images.length > 0 ? (
                        <div className="menu-images-carousel">
                          <img
                            src={menu.images[0] || "/placeholder.svg"}
                            alt={menu.title}
                            className="card-image main-image"
                            onError={(e) => (e.target.src = "/images/placeholder.png")}
                          />
                          {menu.images && menu.images.length >= 1 && (
                            <div className={isDarkMode ? "image-count-badge" : "light-image-count-badge"} title={`${menu.images.length} image${menu.images.length > 1 ? "s" : ""} pour ce plat`}>
                              <span className="image-count-icon" aria-hidden>📷</span>
                              <span>{menu.images.length} image{menu.images.length > 1 ? "s" : ""}</span>
                            </div>
                          )}
                        </div>
                      ) : (
                        <img src="/images/placeholder.png" alt={menu.title} className="card-image" />
                      )}
                    </div>
                    <div className={isDarkMode ? "menu-content" : "light-menu-content"}>
                      <h3>{menu.title}</h3>
                      <span className={isDarkMode ? "menu-card-order" : "light-menu-card-order"} title="Ordre d'affichage côté client">
                        Ordre : {Number(menu.order) ?? 0}
                      </span>
                      <div
                        className={isDarkMode ? "menu-card-actions" : "light-menu-card-actions"}
                        style={isDarkMode ? { display: "flex", visibility: "visible", opacity: 1, gap: "8px", flexShrink: 0 } : undefined}
                      >
                        <button
                          onClick={() => handleEdit(menu)}
                          className={isDarkMode ? "btn btn-secondary" : "light-btn light-btn-secondary"}
                          aria-label="Modifier le menu"
                          style={isDarkMode ? { background: "rgba(148, 163, 184, 0.35)", color: "#f1f5f9", border: "1px solid rgba(148, 163, 184, 0.6)", opacity: 1, visibility: "visible" } : undefined}
                        >
                          <Pencil size={16} aria-hidden />
                          <span>Modifier</span>
                        </button>
                        <button
                          onClick={() => handleDelete(menu._id)}
                          className={isDarkMode ? "btn btn-danger" : "light-btn light-btn-danger"}
                          aria-label="Supprimer le menu"
                          style={isDarkMode ? { background: "#dc2626", color: "#ffffff", border: "1px solid rgba(248, 113, 113, 0.6)", opacity: 1, visibility: "visible" } : undefined}
                        >
                          <Trash2 size={16} aria-hidden />
                          <span>Supprimer</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>

      <style jsx>{`
/* Light Mode Styles for Room Service Page */
.light-dashboard {
  background: #f8fafc;
  background-image: linear-gradient(180deg, #ffffff 0%, #f8fafc 50%, #f1f5f9 100%);
  color: #1e293b;
  min-height: 100vh;
  font-family: "Inter", "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
}

.light-checkbox-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  color: #334155;
  font-size: 0.9rem;
}

.light-checkbox-input {
  width: 1.125rem;
  height: 1.125rem;
  border: 1.5px solid #cbd5e1;
  border-radius: 4px;
  background: #ffffff;
  cursor: pointer;
  accent-color: #8b5cf6;
  flex-shrink: 0;
}

.light-checkbox-input:focus {
  outline: none;
  box-shadow: 0 0 0 2px rgba(139, 92, 246, 0.25);
}

.light-checkbox-text {
  color: #475569;
}
.preview-image-container {
  position: relative;
  display: inline-block;
  margin: 0.5rem;
}

.remove-image-btn {
  position: absolute;
  top: -8px;
  right: -8px;
  background: #ef4444;
  color: white;
  border: none;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  cursor: pointer;
  font-size: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.remove-image-btn:hover {
  background: #dc2626;
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
.checkbox-container {
  display: flex;
  align-items: center;
  margin-bottom: 0.5rem;
}

.checkbox-label {
  display: flex;
  align-items: center;
  cursor: pointer;
}
.checkbox-label span {
  align-self: flex-start; /* push only the span up */
  margin-top: -3px;       /* fine tune */
}
.checkbox-input {
  margin-right: 0.5rem;
  appearance: none;
  background-color: #fff;
  border: 1px solid #ced4da;
  border-radius: 0.25rem;
  width: 1.25rem;
  height: 1.25rem;
  transition: all 0.2s ease;
}

.checkbox-input:checked {
  background-color: #198754;
  border-color: #198754;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23fff'%3E%3Cpath d='M9.5 16.5l-5-5 1.41-1.41L9.5 13.67 18.59 4.59 20 6l-10.5 10.5z'/%3E%3C/svg%3E");
  background-size: 70%;
  background-position: center;
  background-repeat: no-repeat;
}
.remove-item-btn,
.light-remove-item-btn {
  align-self: flex-start !important; /* force alignment to top */
  margin-top: -6px !important;       /* adjust value to move up */
  position: relative !important;     /* ensure position can be adjusted */
  top: -2px !important;              /* additional fine-tune if needed */
}
.checkbox-input:focus {
  outline: none;
  box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
}

.checkbox-text {
  color: #495057;
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

.light-back-button {
  background: linear-gradient(45deg, #64748b, #475569);
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  min-height: 44px;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 500;
  box-shadow: 0 4px 12px rgba(100, 116, 139, 0.3);
  display: inline-flex;
  align-items: center;
  gap: 8px;
  -webkit-tap-highlight-color: transparent;
}

.light-back-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(100, 116, 139, 0.4);
  background: linear-gradient(45deg, #475569, #334155);
}

.light-form-container {
  background: linear-gradient(135deg, #ffffff 0%, #fdf2f8 100%);
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  padding: 2rem;
  margin-bottom: 2rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.light-service-form, .light-menu-form {
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

.light-form-subtitle {
  color: #1e293b;
  font-size: 1.25rem;
  font-weight: 600;
  margin: 1.5rem 0 1rem 0;
}

.light-menu-item {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 1.5rem;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.8) 0%, rgba(253, 242, 248, 0.8) 100%);
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  margin-bottom: 1rem;
}

.light-remove-item-btn {
  background: linear-gradient(45deg, #ef4444, #dc2626);
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 500;
  font-size: 0.875rem;
  box-shadow: 0 2px 8px rgba(239, 68, 68, 0.3);
  align-self: flex-start;
}

.light-remove-item-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(239, 68, 68, 0.4);
}

.light-add-item-btn {
  margin-top: 1rem;
}

.light-form-actions {
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
}

.light-btn {
  padding: 0.75rem 1rem;
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

.light-view-menus-btn {
  background: linear-gradient(45deg, #3b82f6, #2563eb);
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 500;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
}

.light-view-menus-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(59, 130, 246, 0.4);
}

.light-empty-state {
  text-align: center;
  padding: 56px 32px;
  background: linear-gradient(145deg, #ffffff 0%, #f8fafc 100%);
  border: 1px solid #e2e8f0;
  border-radius: 20px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.06);
  max-width: 420px;
  margin: 0 auto;
}

.light-empty-state .empty-icon {
  font-size: 56px;
  margin-bottom: 20px;
  opacity: 0.9;
}

.light-empty-state h3 {
  color: #1e293b;
  font-size: 1.35rem;
  font-weight: 600;
  margin-bottom: 10px;
}

.light-empty-state p {
  color: #64748b;
  margin-bottom: 28px;
  font-size: 0.95rem;
  line-height: 1.5;
}

.light-services-list.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(min(100%, 340px), 1fr));
  gap: 24px;
}

.light-services-list.list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.light-service-card {
  background: linear-gradient(160deg, #ffffff 0%, #f8fafc 100%);
  border: 1px solid rgba(0, 0, 0, 0.06);
  border-radius: 20px;
  padding: 22px 24px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.06), 0 2px 12px rgba(0, 0, 0, 0.03), inset 0 1px 0 rgba(255, 255, 255, 0.9);
  transition: transform 0.28s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.28s ease, border-color 0.2s ease;
  height: 100%;
  display: flex;
  flex-direction: column;
  min-height: 260px;
}

.light-service-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 20px 48px rgba(0, 0, 0, 0.1), 0 8px 20px rgba(0, 0, 0, 0.05), inset 0 1px 0 rgba(255, 255, 255, 1);
  border-color: rgba(0, 0, 0, 0.08);
}

.light-service-card-body {
  display: flex;
  flex-direction: column;
  flex: 1;
  min-width: 0;
}

.light-service-card h2 {
  color: #0f172a;
  margin-bottom: 10px;
  font-size: 1.2rem;
  font-weight: 600;
  line-height: 1.35;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  letter-spacing: 0.01em;
}

.light-service-card-description-wrap {
  flex: 1;
  min-height: 3.5em;
  max-height: 10em;
  margin-bottom: 16px;
  padding: 14px 16px;
  border-radius: 12px;
  background: #f1f5f9;
  border: 1px solid #cbd5e1;
  overflow-y: auto;
  overflow-x: hidden;
  transition: background 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease;
  display: flex;
  align-items: flex-start;
  -webkit-overflow-scrolling: touch;
}

.light-service-card-description-wrap::-webkit-scrollbar {
  width: 6px;
}

.light-service-card-description-wrap::-webkit-scrollbar-track {
  background: rgba(148, 163, 184, 0.15);
  border-radius: 3px;
}

.light-service-card-description-wrap::-webkit-scrollbar-thumb {
  background: rgba(100, 116, 139, 0.4);
  border-radius: 3px;
}

.light-service-card-description-wrap::-webkit-scrollbar-thumb:hover {
  background: rgba(100, 116, 139, 0.6);
}

.light-service-card:hover .light-service-card-description-wrap {
  background: #e2e8f0;
  border-color: #94a3b8;
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.8);
}

.light-service-card p {
  color: #334155;
  margin: 0;
  font-size: 0.95rem;
  line-height: 1.6;
  word-break: break-word;
  text-align: left;
  width: 100%;
  flex: 1;
  min-width: 0;
}

/* Grid: hauteur de zone défilable */
.light-services-list.grid .light-service-card .light-service-card-description-wrap {
  min-height: 5.5em;
  max-height: 11em;
}

.light-service-card-actions {
  display: flex !important;
  gap: 8px;
  margin-top: auto;
  flex-wrap: nowrap;
  visibility: visible !important;
  opacity: 1 !important;
}

.light-service-card-actions .light-btn,
.light-service-card-actions button {
  opacity: 1 !important;
  visibility: visible !important;
}

.light-service-card-actions .light-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 10px 14px;
  font-size: 0.875rem;
}

.light-menus-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.light-menu-card {
  background: linear-gradient(135deg, #ffffff 0%, #fdf2f8 100%);
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  height: 460px;
  min-height: 460px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.light-menu-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 25px rgba(236, 72, 153, 0.15);
}

.light-menu-card .card-image {
  height: 240px;
  object-fit: cover;
}

.light-menu-content {
  padding: 1.5rem;
}

.light-menu-content h3 {
  color: #1e293b;
  margin-bottom: 0.5rem;
  font-size: 1.25rem;
  font-weight: 600;
}

.menu-card-order,
.light-menu-card-order {
  display: inline-block;
  font-size: 0.8rem;
  color: #64748b;
  margin-bottom: 0.75rem;
  padding: 0.2rem 0.5rem;
  background: rgba(0, 0, 0, 0.06);
  border-radius: 6px;
}

.menu-card-order {
  color: #94a3b8;
  background: rgba(255, 255, 255, 0.08);
}

.light-menu-card-actions {
  display: flex !important;
  gap: 0.75rem;
  margin-top: 1rem;
  justify-content: flex-end;
  flex-wrap: wrap;
  visibility: visible !important;
  opacity: 1 !important;
}

.light-menu-card-actions .light-btn,
.light-menu-card-actions button {
  opacity: 1 !important;
  visibility: visible !important;
}

.light-menu-card-actions .light-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
}

/* Enhanced menu card actions styling to ensure visibility */
.menu-card-actions {
  display: flex;
  gap: 0.75rem;
  margin-top: 1rem;
  justify-content: flex-end;
}

.menu-card-actions button {
  padding: 0.5rem 1rem;
  border-radius: 8px;
  font-weight: 500;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.3s ease;
  border: none;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
}

/* Enhanced button styles to ensure visibility */
.btn, .light-btn {
  padding: 0.75rem 1rem;
  border-radius: 8px;
  font-weight: 500;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.3s ease;
  border: none;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  text-decoration: none;
  min-height: 40px;
  justify-content: center;
}

.btn:hover, .light-btn:hover {
  transform: translateY(-1px);
}

.btn-secondary, .light-btn-secondary {
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
  color: white;
  border: none;
  box-shadow: 0 2px 8px rgba(99, 102, 241, 0.3);
}

.btn-secondary:hover, .light-btn-secondary:hover {
  background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
  box-shadow: 0 4px 12px rgba(99, 102, 241, 0.4);
}

.light-btn-secondary {
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
  color: white;
  border: none;
  box-shadow: 0 2px 8px rgba(99, 102, 241, 0.3);
}

.light-btn-secondary:hover {
  background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
  box-shadow: 0 4px 12px rgba(99, 102, 241, 0.4);
}

.btn-danger, .light-btn-danger {
  background: linear-gradient(45deg, #ef4444, #dc2626);
  color: white;
  box-shadow: 0 2px 8px rgba(239, 68, 68, 0.3);
}

.btn-danger:hover, .light-btn-danger:hover {
  background: linear-gradient(45deg, #dc2626, #b91c1c);
  box-shadow: 0 4px 12px rgba(239, 68, 68, 0.4);
}

      `}</style>
    </div>
  )
}

export default RoomServicePage
