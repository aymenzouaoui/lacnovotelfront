"use client"

import { useState, useEffect } from "react"
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
import CompressedFileInput from "../components/CompressedFileInput"
import Toast from "../components/Toast"
import ConfirmDialog from "../components/ConfirmDialog"

/* Liste des allergènes avec icônes Lucide pour le formulaire items */
const ALLERGENS_LIST = [
  { key: "arachideAllergy", label: "Arachide", Icon: CircleDot },
  { key: "celeriAllergy", label: "Céleri", Icon: LeafyGreen },
  { key: "crustacesAllergy", label: "Crustacés", Icon: Shrimp },
  { key: "fruitsANoqueAllergy", label: "Fruits à coque", Icon: Nut },
  { key: "isGlutenFree", label: "Gluten", Icon: Wheat, invert: true },
  { key: "isLactoseFree", label: "Lactose", Icon: Milk, invert: true },
  { key: "lupinAllergy", label: "Lupin", Icon: Leaf },
  { key: "oeufAllergy", label: "Œuf", Icon: Egg },
  { key: "poissonAllergy", label: "Poisson", Icon: Fish },
  { key: "mollusquesAllergy", label: "Mollusques", Icon: Shell },
  { key: "moutardeAllergy", label: "Moutarde", Icon: Circle },
  { key: "sesameAllergy", label: "Sésame", Icon: Circle },
  { key: "sojaAllergy", label: "Soja", Icon: Bean },
  { key: "sulfitesAllergy", label: "Sulfites", Icon: Wine },
]

const RestaurantsAndMenusPage = () => {
  const navigate = useNavigate()
  const [restaurants, setRestaurants] = useState([])
  const [selectedRestaurant, setSelectedRestaurant] = useState(null)
  const [menus, setMenus] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [showRestaurantForm, setShowRestaurantForm] = useState(false)
  const [restaurantFormData, setRestaurantFormData] = useState({
    name: "",
    description: "",
    image: null,
    reservable: true,
    translations: { fr: { name: "", description: "" }, ar: { name: "", description: "" } },
  })
  const [activeRestaurantLang, setActiveRestaurantLang] = useState("fr")
  const [restaurantPreviewImage, setRestaurantPreviewImage] = useState(null)
  const [user, setUser] = useState({ username: "", email: "" })
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [currentTime, setCurrentTime] = useState(new Date())
  const [searchTerm, setSearchTerm] = useState("")
  const [sortOrder, setSortOrder] = useState("order")
  const [viewMode, setViewMode] = useState("grid")

  // Theme state with localStorage initialization
  const [toast, setToast] = useState({ message: "", type: "success" })
  const [confirmDialog, setConfirmDialog] = useState({ open: false, message: "", onConfirm: null })
  const showToast = (message, type = "success") => setToast({ message, type })
  const closeToast = () => setToast({ message: "", type: "success" })
  const openConfirm = (message, onConfirm) => setConfirmDialog({ open: true, message, onConfirm })
  const closeConfirm = () => setConfirmDialog({ open: false, message: "", onConfirm: null })

  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem("theme")
    return savedTheme ? savedTheme === "dark" : true
  })

  const defaultMenuItem = () => ({
    name: "",
    description: "",
    price: "",
    translations: { fr: { name: "", description: "" }, ar: { name: "", description: "" } },
    isVegetarian: false,
    isOrganic: false,
    isLocal: false,
    arachideAllergy: false,
    celeriAllergy: false,
    crustacesAllergy: false,
    fruitsANoqueAllergy: false,
    isGlutenFree: false,
    isLactoseFree: false,
    lupinAllergy: false,
    oeufAllergy: false,
    poissonAllergy: false,
    mollusquesAllergy: false,
    moutardeAllergy: false,
    sesameAllergy: false,
    sojaAllergy: false,
    sulfitesAllergy: false,
    isAvailable24_7: false,
    commandable: true,
  })
  const [formData, setFormData] = useState({
    title: "",
    order: 0,
    images: [],
    items: [defaultMenuItem()],
    translations: { fr: { title: "" }, ar: { title: "" } },
  })
  const [activeMenuLang, setActiveMenuLang] = useState("fr")
  const [activeItemLang, setActiveItemLang] = useState("fr")
  const [editId, setEditId] = useState(null)
  const [previewImages, setPreviewImages] = useState([]) // Changed to array
  const [editingRestaurantId, setEditingRestaurantId] = useState(null)

  const handleEditRestaurant = (restaurant) => {
    const tr = restaurant.translations || {}
    setEditingRestaurantId(restaurant._id)
    setRestaurantFormData({
      name: restaurant.name ?? "",
      description: restaurant.description ?? "",
      reservable: restaurant.reservable ?? true,
      image: null,
      translations: {
        fr: { name: (tr.fr && tr.fr.name) || "", description: (tr.fr && tr.fr.description) || "" },
        ar: { name: (tr.ar && tr.ar.name) || "", description: (tr.ar && tr.ar.description) || "" },
      },
    })
    setShowRestaurantForm(true)
    if (restaurant.image) setRestaurantPreviewImage(restaurant.image)
    else setRestaurantPreviewImage(null)
  }

  const fetchRestaurants = async () => {
    setIsLoading(true)
    try {
      const res = await API.get("/restaurants")
      setRestaurants(res.data)
    } catch (error) {
      console.error("Erreur chargement restaurants:", error)
      showToast("Erreur lors du chargement des restaurants", "error")
    } finally {
      setIsLoading(false)
    }
  }

  const fetchMenus = async (restaurantId) => {
    setIsLoading(true)
    try {
      const res = await API.get("/menus")
      const filteredMenus = res.data
        .filter((menu) => menu.restaurant?._id === restaurantId || menu.restaurant === restaurantId)
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

    fetchRestaurants()

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

  const handleSelectRestaurant = (restaurant) => {
    setSelectedRestaurant(restaurant)
    fetchMenus(restaurant._id)
    setShowForm(false)
    setEditId(null)
    resetForm()
  }

const handleChange = (e) => {
  const { name, value, files, type } = e.target
  if (name === "images" && files && files.length > 0) {
    // Handle multiple image files
    const imageFiles = Array.from(files)
    
    // Combine existing images with new ones when editing
    const currentImages = formData.images || [];
    const updatedImages = [...currentImages, ...imageFiles];
    
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

  const handleItemChange = (index, field, value) => {
    const updatedItems = [...formData.items]
    if (field.startsWith("tr_")) {
      const [, lang, f] = field.split("_")
      if (!updatedItems[index].translations) updatedItems[index].translations = { fr: { name: "", description: "" }, ar: { name: "", description: "" } }
      updatedItems[index].translations[lang] = { ...updatedItems[index].translations[lang], [f]: value }
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

const removePreviewImage = (index) => {
  const updatedImages = formData.images.filter((_, i) => i !== index);
  const updatedPreviews = previewImages.filter((_, i) => i !== index);
  setFormData((prev) => ({ ...prev, images: updatedImages }));
  setPreviewImages(updatedPreviews);
};

const handleSubmit = async (e) => {
  e.preventDefault()
  if (!selectedRestaurant) return showToast("Sélectionnez un restaurant d'abord", "info")

  try {
    setIsLoading(true)
    const form = new FormData()
    form.append("title", formData.title ?? "")
    form.append("order", String(Number(formData.order ?? 0)))
    form.append(
      "translations",
      JSON.stringify({
        fr: formData.translations?.fr || { title: "" },
        ar: formData.translations?.ar || { title: "" },
      }),
    )
    form.append("items", JSON.stringify(formData.items))
    form.append("restaurant", selectedRestaurant._id)

    // 🧠 Debugging logs before sending the request
    console.log("[MENU_DEBUG] 🔍 --- MENU UPDATE DEBUG START ---");
    console.log("[MENU_DEBUG] ➡️ Edit mode:", !!editId);
    console.log("[MENU_DEBUG] ➡️ Selected restaurant ID:", selectedRestaurant?._id);
    console.log("[MENU_DEBUG] ➡️ formData.title:", formData.title);
    console.log("[MENU_DEBUG] ➡️ formData.items:", formData.items);
    console.log("[MENU_DEBUG] ➡️ formData.images (raw):", formData.images);
    console.log("[MENU_DEBUG] ➡️ Number of images in formData:", formData.images?.length || 0);

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

    console.log("[MENU_DEBUG] ➡️ FormData entries before sending:");
    for (let pair of form.entries()) {
      console.log(`[MENU_DEBUG]   ${pair[0]} →`, pair[1]);
    }
    console.log("[MENU_DEBUG] 🔍 --- MENU UPDATE DEBUG END ---");

    if (editId) {
      await API.put(`/menus/${editId}`, form, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      showToast("Menu modifié avec succès", "success")
    } else {
      await API.post("/menus", form, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      showToast("Menu créé avec succès", "success")
    }

    fetchMenus(selectedRestaurant._id)
    resetForm()
    setShowForm(false)
  } catch (error) {
    console.error("Erreur lors de l'enregistrement du menu:", error)
    showToast("Erreur d'enregistrement", "error")
  } finally {
    setIsLoading(false)
  }
}

const handleEdit = (menu) => {
  console.log("Editing menu:", menu);
  const trMenu = menu.translations || {};
  const normalizedItems = (menu.items || []).map((item) => {
    const it = { ...defaultMenuItem(), ...item, price: item.price ?? "" };
    const tr = item.translations || {};
    it.translations = {
      fr: { name: (tr.fr && tr.fr.name) || "", description: (tr.fr && tr.fr.description) || "" },
      ar: { name: (tr.ar && tr.ar.name) || "", description: (tr.ar && tr.ar.description) || "" },
    };
    return it;
  });
  setFormData({
    title: menu.title ?? "",
    order: Number(menu.order) || 0,
    images: menu.images || [],
    items: normalizedItems,
    translations: {
      fr: { title: (trMenu.fr && trMenu.fr.title) || "" },
      ar: { title: (trMenu.ar && trMenu.ar.title) || "" },
    },
  });
  setEditId(menu._id);
  setShowForm(true);

  if (menu.images && menu.images.length > 0) {
    setPreviewImages(menu.images);
  } else {
    setPreviewImages([]);
  }
};

  const handleDelete = (menuId) => {
    openConfirm("Voulez-vous vraiment supprimer ce menu ?", async () => {
      closeConfirm()
      setIsLoading(true)
      try {
        await API.delete(`/menus/${menuId}`)
        fetchMenus(selectedRestaurant._id)
        showToast("Menu supprimé avec succès", "success")
      } catch (error) {
        console.error("Erreur suppression:", error)
        showToast("Erreur lors de la suppression", "error")
      } finally {
        setIsLoading(false)
      }
    })
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

const handleRestaurantChange = (e) => {
  const { name, type, value, checked, files } = e.target;

  if (name === "image" && files && files[0]) {
    const image = files[0];
    setRestaurantFormData((prev) => ({ ...prev, image }));
    const reader = new FileReader();
    reader.onloadend = () => setRestaurantPreviewImage(reader.result);
    reader.readAsDataURL(image);
  } else if (name.startsWith("tr_")) {
    const [, lang, field] = name.split("_");
    setRestaurantFormData((prev) => ({
      ...prev,
      translations: {
        ...prev.translations,
        [lang]: { ...prev.translations[lang], [field]: value },
      },
    }));
  } else {
    setRestaurantFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  }
};


  const handleRestaurantSubmit = async (e) => {
    e.preventDefault()
    try {
      setIsLoading(true)
      const form = new FormData()
      form.append("name", restaurantFormData.name ?? "")
      form.append("description", restaurantFormData.description ?? "")
      form.append("reservable", restaurantFormData.reservable)
      form.append(
        "translations",
        JSON.stringify({
          fr: restaurantFormData.translations?.fr || { name: "", description: "" },
          ar: restaurantFormData.translations?.ar || { name: "", description: "" },
        }),
      )
      if (restaurantFormData.image) form.append("image", restaurantFormData.image)

      if (editingRestaurantId) {
        await API.put(`/restaurants/${editingRestaurantId}`, form, {
          headers: { "Content-Type": "multipart/form-data" },
        })
        showToast("Restaurant modifié avec succès", "success")
      } else {
        await API.post("/restaurants", form, {
          headers: { "Content-Type": "multipart/form-data" },
        })
        showToast("Restaurant créé avec succès", "success")
      }

      fetchRestaurants()
      setShowRestaurantForm(false)
      setEditingRestaurantId(null)
      setRestaurantFormData({
        name: "",
        description: "",
        reservable: true,
        image: null,
        translations: { fr: { name: "", description: "" }, ar: { name: "", description: "" } },
      })
      setRestaurantPreviewImage(null)
    } catch (error) {
      console.error("Erreur soumission restaurant:", error)
      showToast("Erreur lors de la soumission", "error")
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteRestaurant = (id) => {
    openConfirm("Voulez-vous vraiment supprimer ce restaurant ?", async () => {
      closeConfirm()
      setIsLoading(true)
      try {
        await API.delete(`/restaurants/${id}`)
        showToast("Restaurant supprimé avec succès", "success")
        fetchRestaurants()
      } catch (error) {
        console.error("Erreur suppression:", error)
        showToast("Erreur lors de la suppression", "error")
      } finally {
        setIsLoading(false)
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
      if (sortOrder === "order") {
        return (a.order ?? 999) - (b.order ?? 999)
      } else if (sortOrder === "newest") {
        return new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
      } else if (sortOrder === "oldest") {
        return new Date(a.createdAt || 0) - new Date(b.createdAt || 0)
      } else if (sortOrder === "alphabetical") {
        return a.title.localeCompare(b.title)
      }
      return 0
    })

  const filteredRestaurants = restaurants
    .filter(
      (r) =>
        r.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.description?.toLowerCase().includes(searchTerm.toLowerCase()),
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

  useEffect(() => {
    if (selectedRestaurant) {
      setViewMode("grid")
    }
  }, [selectedRestaurant])

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
    <div
      className={`${isDarkMode ? "dashboard" : "light-dashboard"} ${selectedRestaurant ? "restaurant-selected" : ""}`}
    >
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
              <a href="#restaurants">
                <span className={isDarkMode ? "nav-icon" : "light-nav-icon"}>🏨</span>
                <span>Restaurants & Menus</span>
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
              {selectedRestaurant ? `${selectedRestaurant.name} - Menus` : "Restaurants & Menus"}{" "}
              <span className={isDarkMode ? "wave-emoji" : "light-wave-emoji"}>🏨</span>
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
            {selectedRestaurant
              ? `Gérez les menus du restaurant ${selectedRestaurant.name}`
              : "Gérez vos restaurants et leurs menus"}
          </p>
        </div>

        <div className={isDarkMode ? "search-filter-container" : "light-search-filter-container"}>
          <div className={isDarkMode ? "search-container" : "light-search-container"}>
            <span className="search-icon">🔍</span>
            <input
              className={isDarkMode ? "search-input" : "light-search-input"}
              type="text"
              placeholder={selectedRestaurant ? "Rechercher un menu..." : "Rechercher un restaurant..."}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="view-sort-container">
            {!selectedRestaurant && (
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
            )}

            <select
              className={isDarkMode ? "sort-select" : "light-sort-select"}
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
            >
              <option value="order">Ordre d'affichage</option>
              <option value="newest">Plus récent</option>
              <option value="oldest">Plus ancien</option>
              <option value="alphabetical">Alphabétique</option>
            </select>
          </div>
        </div>

        {!selectedRestaurant ? (
          <>
            <div className={isDarkMode ? "section-header" : "light-section-header"}>
              <h2>Liste des restaurants</h2>
              <div className="section-actions">
                <button
                  className={isDarkMode ? "section-action" : "light-section-action"}
                  onClick={() => setShowRestaurantForm(!showRestaurantForm)}
                >
                  <span>{showRestaurantForm ? "Annuler" : "Ajouter"}</span>
                  <span className="action-icon">{showRestaurantForm ? "❌" : "+"}</span>
                </button>
              </div>
            </div>

            {showRestaurantForm && (
              <div className={isDarkMode ? "form-container" : "light-form-container"}>
                <form
                  onSubmit={handleRestaurantSubmit}
                  className={isDarkMode ? "restaurant-form" : "light-restaurant-form"}
                >
                  <label className={isDarkMode ? "form-label" : "light-form-label"}>Nom (par défaut) *</label>
                  <input
                    type="text"
                    name="name"
                    placeholder="Nom du restaurant"
                    value={restaurantFormData.name}
                    onChange={handleRestaurantChange}
                    required
                    className={isDarkMode ? "form-input" : "light-form-input"}
                  />
                  <label className={isDarkMode ? "form-label" : "light-form-label"}>Description (par défaut)</label>
                  <textarea
                    name="description"
                    placeholder="Description"
                    value={restaurantFormData.description}
                    onChange={handleRestaurantChange}
                    className={isDarkMode ? "form-input" : "light-form-input"}
                  />
                  <div className={isDarkMode ? "form-label" : "light-form-label"} style={{ marginTop: "0.5rem" }}>Traductions (FR / AR)</div>
                  <div style={{ display: "flex", gap: "0.5rem", marginBottom: "0.5rem" }}>
                    <button type="button" className={activeRestaurantLang === "fr" ? (isDarkMode ? "btn btn-primary" : "light-btn light-btn-primary") : (isDarkMode ? "btn btn-secondary" : "light-btn light-btn-secondary")} onClick={() => setActiveRestaurantLang("fr")}>Français</button>
                    <button type="button" className={activeRestaurantLang === "ar" ? (isDarkMode ? "btn btn-primary" : "light-btn light-btn-primary") : (isDarkMode ? "btn btn-secondary" : "light-btn light-btn-secondary")} onClick={() => setActiveRestaurantLang("ar")}>العربية</button>
                  </div>
                  <input type="text" name={`tr_${activeRestaurantLang}_name`} value={restaurantFormData.translations?.[activeRestaurantLang]?.name ?? ""} onChange={handleRestaurantChange} placeholder={activeRestaurantLang === "fr" ? "Nom FR" : "الاسم"} className={isDarkMode ? "form-input" : "light-form-input"} />
                  <textarea name={`tr_${activeRestaurantLang}_description`} value={restaurantFormData.translations?.[activeRestaurantLang]?.description ?? ""} onChange={handleRestaurantChange} placeholder={activeRestaurantLang === "fr" ? "Description FR" : "الوصف"} className={isDarkMode ? "form-input" : "light-form-input"} rows={2} />
              <div className="restaurant-checkbox-wrapper">
  <label
    className={`restaurant-checkbox ${isDarkMode ? "dark" : "light"}`}
  >
    <input
      type="checkbox"
      name="reservable"
      checked={restaurantFormData.reservable}
      onChange={handleRestaurantChange}
      className="restaurant-checkbox-input"
    />
    Réservable
  </label>
</div>

                  <CompressedFileInput
  type="file"
  name="image"
  accept="image/*"
  onChange={handleRestaurantChange}
  className={isDarkMode ? "form-input" : "light-form-input"}
/>

                  {restaurantPreviewImage && (
                    <img src={restaurantPreviewImage || "/placeholder.svg"} alt="Aperçu" className="preview-img" />
                  )}

                  <div className={isDarkMode ? "form-actions" : "light-form-actions"}>
                    <button
                      type="submit"
                      className={isDarkMode ? "btn btn-primary" : "light-btn light-btn-primary"}
                      disabled={isLoading}
                    >
                      {isLoading ? "Chargement..." : editingRestaurantId ? "✅ Modifier" : "✅ Créer"}
                    </button>
                    <button
                      type="button"
                      className={isDarkMode ? "btn btn-secondary" : "light-btn light-btn-secondary"}
                      onClick={() => {
                        setShowRestaurantForm(false)
                        setEditingRestaurantId(null)
                        setRestaurantFormData({ name: "", description: "", reservable: true, image: null, translations: { fr: { name: "", description: "" }, ar: { name: "", description: "" } } })
                        setRestaurantPreviewImage(null)
                      }}
                      disabled={isLoading}
                    >
                      ❌ Annuler
                    </button>
                  </div>
                </form>
              </div>
            )}

            {filteredRestaurants.length === 0 ? (
              <div className={isDarkMode ? "empty-state" : "light-empty-state"}>
                <div className="empty-icon">🏨</div>
                <h3>Aucun restaurant trouvé</h3>
                <p>Commencez par créer un nouveau restaurant</p>
                <button
                  className={isDarkMode ? "btn btn-primary" : "light-btn light-btn-primary"}
                  onClick={() => setShowRestaurantForm(true)}
                >
                  Créer un restaurant
                </button>
              </div>
            ) : (
              <div
                className={`${isDarkMode ? "restaurants-list" : "light-restaurants-list"} ${viewMode === "list" ? "list-view" : "grid"}`}
              >
                {filteredRestaurants.map((r) => (
                  <div
                    key={r._id}
                    role="button"
                    tabIndex={0}
                    onClick={() => handleSelectRestaurant(r)}
                    onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); handleSelectRestaurant(r); } }}
                    className={isDarkMode ? "restaurant-card" : "light-restaurant-card"}
                    style={{ cursor: "pointer" }}
                  >
                    <img src={r.image || "/images/placeholder.png"} alt={r.name} className="card-image" onError={(e) => { e.target.onerror = null; e.target.src = "/images/placeholder.png"; }} />
                    <div className="restaurant-card-body">
                      <h2>{r.name}</h2>
                      <div className={isDarkMode ? "restaurant-card-description-wrap" : "light-restaurant-card-description-wrap"}>
                        <p>{r.description || "—"}</p>
                      </div>
                      <div className={isDarkMode ? "restaurant-card-actions" : "light-restaurant-card-actions"} onClick={(e) => e.stopPropagation()}>
                        <button
                          type="button"
                          onClick={() => handleEditRestaurant(r)}
                          className={isDarkMode ? "btn btn-secondary" : "light-btn light-btn-secondary"}
                        >
                          ✏️ Modifier
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteRestaurant(r._id)}
                          className={isDarkMode ? "btn btn-danger" : "light-btn light-btn-danger"}
                        >
                          🗑️ Supprimer
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
                  onClick={() => setSelectedRestaurant(null)}
                >
                  ← Retour aux restaurants
                </button>
              </div>
              <h2>Menus du restaurant: {selectedRestaurant.name}</h2>
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
                  <label className={isDarkMode ? "form-label" : "light-form-label"}>Titre du menu (par défaut) *</label>
                  <input
                    type="text"
                    name="title"
                    placeholder="Titre du menu"
                    value={formData.title}
                    onChange={handleChange}
                    required
                    className={isDarkMode ? "form-input" : "light-form-input"}
                  />
                  <div className={isDarkMode ? "form-label" : "light-form-label"} style={{ marginTop: "0.5rem" }}>Traductions menu (FR / AR)</div>
                  <div style={{ display: "flex", gap: "0.5rem", marginBottom: "0.5rem" }}>
                    <button type="button" className={activeMenuLang === "fr" ? (isDarkMode ? "btn btn-primary" : "light-btn light-btn-primary") : (isDarkMode ? "btn btn-secondary" : "light-btn light-btn-secondary")} onClick={() => setActiveMenuLang("fr")}>Français</button>
                    <button type="button" className={activeMenuLang === "ar" ? (isDarkMode ? "btn btn-primary" : "light-btn light-btn-primary") : (isDarkMode ? "btn btn-secondary" : "light-btn light-btn-secondary")} onClick={() => setActiveMenuLang("ar")}>العربية</button>
                  </div>
                  <input type="text" name={`tr_${activeMenuLang}_title`} value={formData.translations?.[activeMenuLang]?.title ?? ""} onChange={handleChange} placeholder={activeMenuLang === "fr" ? "Titre FR" : "العنوان"} className={isDarkMode ? "form-input" : "light-form-input"} />
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
                  <small className="image-upload-hint" style={{ display: "block", marginBottom: "1rem" }}>0 = premier menu affiché, 1 = deuxième, etc.</small>
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
                    <div className={isDarkMode ? "preview-images-container" : "light-preview-images-container"}>
                      <h4>Aperçu des images:</h4>
                      <div className={isDarkMode ? "preview-images-grid" : "light-preview-images-grid"}>
                        {previewImages.map((preview, index) => (
                          <div key={index} className={isDarkMode ? "preview-image-item" : "light-preview-image-item"}>
                            <img
                              src={preview || "/placeholder.svg"}
                              alt={`Preview ${index + 1}`}
                              className="preview-img"
                            />
                            <button
                              type="button"
                              className={isDarkMode ? "remove-image-btn" : "light-remove-image-btn"}
                              onClick={() => removePreviewImage(index)}
                            >
                              ❌
                            </button>
                          </div>
                        ))}
                      </div>
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

                      <div className="menu-item-body">
                        <div className="menu-item-fields-row">
                          <input
                            type="text"
                            placeholder="Nom de l'item"
                            value={item.name}
                            onChange={(e) => handleItemChange(index, "name", e.target.value)}
                            required
                            className={isDarkMode ? "form-input" : "light-form-input"}
                            style={{ margin: 0 }}
                          />
                          <input
                            type="number"
                            placeholder="Prix (TND)"
                            value={item.price}
                            onChange={(e) => handleItemChange(index, "price", e.target.value)}
                            required
                            className={isDarkMode ? "form-input" : "light-form-input"}
                            style={{ margin: 0 }}
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

                        <hr className="menu-item-section-divider" />

                        <div className={isDarkMode ? "form-label" : "light-form-label"} style={{ marginBottom: "0.4rem" }}>Traductions (FR / AR)</div>
                        <div style={{ display: "flex", gap: "0.5rem", marginBottom: "0.5rem" }}>
                          <button type="button" className={activeItemLang === "fr" ? (isDarkMode ? "btn btn-primary" : "light-btn light-btn-primary") : (isDarkMode ? "btn btn-secondary" : "light-btn light-btn-secondary")} style={{ padding: "0.35rem 0.75rem", fontSize: "0.9rem" }} onClick={() => setActiveItemLang("fr")}>FR</button>
                          <button type="button" className={activeItemLang === "ar" ? (isDarkMode ? "btn btn-primary" : "light-btn light-btn-primary") : (isDarkMode ? "btn btn-secondary" : "light-btn light-btn-secondary")} style={{ padding: "0.35rem 0.75rem", fontSize: "0.9rem" }} onClick={() => setActiveItemLang("ar")}>AR</button>
                        </div>
                        <input type="text" placeholder={activeItemLang === "fr" ? "Nom FR" : "الاسم"} value={item.translations?.[activeItemLang]?.name ?? ""} onChange={(e) => handleItemChange(index, "tr_" + activeItemLang + "_name", e.target.value)} className={isDarkMode ? "form-input" : "light-form-input"} style={{ marginBottom: "0.35rem" }} />
                        <textarea placeholder={activeItemLang === "fr" ? "Description FR" : "الوصف"} value={item.translations?.[activeItemLang]?.description ?? ""} onChange={(e) => handleItemChange(index, "tr_" + activeItemLang + "_description", e.target.value)} className={isDarkMode ? "form-input" : "light-form-input"} rows={2} />

                        <hr className="menu-item-section-divider" />

                        <span className="menu-item-options-label">Options</span>
                        <div className="menu-item-options-row">
                          {[
                            { key: "isVegetarian", label: "Végétarien", emoji: "🥦" },
                            { key: "isOrganic",    label: "Bio",         emoji: "🌿" },
                            { key: "isLocal",      label: "Local",       emoji: "📍" },
                            { key: "isAvailable24_7", label: "24/7",    emoji: "🕐" },
                            { key: "commandable",  label: "Commandable", emoji: "🛒" },
                          ].map(({ key, label, emoji }) => {
                            const checked = key === "commandable" ? item.commandable !== false : (item[key] || false)
                            return (
                              <label key={key} className={`option-chip ${isDarkMode ? "dark" : "light"} ${checked ? "selected" : ""}`}>
                                <input type="checkbox" checked={checked} onChange={(e) => handleItemChange(index, key, e.target.checked)} />
                                <span className="option-chip-emoji" aria-hidden>{emoji}</span>
                                <span>{label}</span>
                              </label>
                            )
                          })}
                        </div>

                        <hr className="menu-item-section-divider" />

                        <span className="menu-item-options-label">Allergènes (contient)</span>
                        <div className="menu-item-options-row menu-item-allergens-row">
                          {ALLERGENS_LIST.map(({ key, label, Icon, invert }) => {
                            const isSelected = invert ? !(item[key] ?? true) : (item[key] || false)
                            return (
                              <label key={key} className={`allergen-chip ${isDarkMode ? "dark" : "light"} ${isSelected ? "selected" : ""}`}>
                                <input type="checkbox" checked={isSelected} onChange={(e) => handleItemChange(index, key, invert ? !e.target.checked : e.target.checked)} />
                                <Icon size={16} strokeWidth={isSelected ? 2.5 : 2} className="allergen-option-icon" aria-hidden />
                                <span>{label}</span>
                              </label>
                            )
                          })}
                        </div>
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
                <p>Commencez par créer un nouveau menu pour ce restaurant</p>
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
                    <div className={isDarkMode ? "menu-images-display" : "light-menu-images-display"}>
                      {menu.images && menu.images.length > 0 ? (
                        <div className={isDarkMode ? "menu-images-carousel" : "light-menu-images-carousel"}>
                          <img
                            src={menu.images[0] || "/placeholder.svg"}
                            alt={menu.title}
                            className="card-image main-image"
                            onError={(e) => (e.target.src = "/images/placeholder.png")}
                          />
                          {(menu.images.length >= 1) && (
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
/* Light Mode Styles for Restaurants and Menus Page */
.light-dashboard {
  background: linear-gradient(135deg, #ffffff 0%, #fdf2f8 50%, #f8fafc 100%);
  color: #1e293b;
  min-height: 100vh;
  font-family: "Inter", "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
}
/* Wrapper forces left alignment */
.restaurant-checkbox-wrapper {
  display: block;
  text-align: left;
  margin: 10px 0; /* spacing from other elements */
}

/* Label styling */
.restaurant-checkbox {
  display: inline-flex; /* checkbox + text inline */
  align-items: center;  /* vertical alignment */
  gap: 10px;            /* space between checkbox and text */
  font-size: 16px;
  cursor: pointer;
  user-select: none;
  line-height: 1.4;      /* better spacing for text */
}

/* Checkbox styling */
.restaurant-checkbox-input {
  width: 20px;
  height: 20px;
  border-radius: 4px;
  accent-color: #4CAF50;  /* green check */
  border: 1px solid #ccc;
  flex-shrink: 0;           /* keep size consistent */
}

/* Light mode */
.restaurant-checkbox.light {
  color: #111; /* dark text */
}

.restaurant-checkbox.light .restaurant-checkbox-input {
  background-color: #fff;
  border: 1px solid #ccc;
}

/* Dark mode */
.restaurant-checkbox.dark {
  color: #eee; /* light text */
}

.restaurant-checkbox.dark .restaurant-checkbox-input {
  background-color: #222;
  border: 1px solid #555;
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
.remove-item-btn,
.light-remove-item-btn {
  align-self: flex-start !important; /* force alignment to top */
  margin-top: -6px !important;       /* adjust value to move up */
  position: relative !important;     /* ensure position can be adjusted */
  top: -2px !important;              /* additional fine-tune if needed */
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
  background: #ffffff;
  border-bottom: 1px solid #e2e8f0;
  padding: 1rem;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
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
  background: #ffffff;
  border-right: 1px solid #e2e8f0;
  height: 100vh;
  position: fixed;
  left: 0;
  top: 0;
  z-index: 1000;
  display: flex;
  flex-direction: column;
  box-shadow: 4px 0 24px rgba(0, 0, 0, 0.06);
  transition: transform 0.3s ease;
}

.light-sidebar-header {
  padding: 2rem 1.5rem 1rem;
  border-bottom: 1px solid #e2e8f0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #ffffff;
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
  background: #f8fafc;
}
.remove-item-btn {
  margin-top: -4px; /* adjust the value to move up more */
}

.light-remove-item-btn {
  margin-top: -4px; /* same for light mode */
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
  background: #f8fafc;
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
  background: #f8fafc;
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
  background: #f8fafc;
  background-image: linear-gradient(180deg, #ffffff 0%, #f8fafc 50%, #f1f5f9 100%);
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
  background: #ffffff;
  padding: 1.5rem;
  border-radius: 16px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
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
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  background: #ffffff;
  color: #1e293b;
  font-size: 1rem;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

.light-search-input:focus {
  outline: none;
  border-color: #8b5cf6;
  box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.12);
}

.light-sort-select {
  padding: 0.75rem 1rem;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  background: #ffffff;
  color: #1e293b;
  font-size: 1rem;
  cursor: pointer;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

.light-sort-select:focus {
  outline: none;
  border-color: #8b5cf6;
  box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.12);
}

.light-section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  background: #ffffff;
  padding: 1.5rem;
  border-radius: 16px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
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
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  padding: 2rem;
  margin-bottom: 2rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06), 0 4px 12px rgba(0, 0, 0, 0.04);
}

.light-restaurant-form, .light-menu-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.light-form-input {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  background: #ffffff;
  color: #1e293b;
  font-size: 1rem;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
  font-family: inherit;
}

.light-form-input:hover {
  border-color: #cbd5e1;
}

.light-form-input:focus {
  outline: none;
  border-color: #8b5cf6;
  box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.12);
}

.light-form-input::placeholder {
  color: #94a3b8;
}

.light-form-label {
  color: #1e293b;
  font-weight: 500;
  margin-bottom: 0.5rem;
}

.light-image-upload-section {
  margin: 1rem 0;
}

.light-image-upload-section label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
  color: #1e293b;
}

.light-image-upload-section small {
  display: block;
  margin-top: 0.25rem;
  color: #64748b;
  font-size: 0.85rem;
}

.light-preview-images-container {
  margin: 1rem 0;
  padding: 1rem;
  border: 1px dashed #e2e8f0;
  border-radius: 12px;
  background: #f8fafc;
}

.light-preview-images-container h4 {
  margin: 0 0 1rem 0;
  color: #1e293b;
}

.light-preview-images-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 1rem;
}

.light-preview-image-item {
  position: relative;
  border-radius: 8px;
  overflow: hidden;
  background: white;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.light-preview-image-item .preview-img {
  width: 100%;
  height: 120px;
  object-fit: cover;
  display: block;
}

.light-remove-image-btn {
  position: absolute;
  top: 4px;
  right: 4px;
  background: rgba(255, 255, 255, 0.9);
  border: none;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  transition: all 0.2s ease;
}

.light-remove-image-btn:hover {
  background: rgba(255, 0, 0, 0.1);
  transform: scale(1.1);
}

.light-menu-item {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 1.5rem;
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  margin-bottom: 1rem;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.04);
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
  background: #ffffff;
  color: #475569;
  border: 1px solid #e2e8f0;
}

.light-btn-secondary:hover {
  background: #f8fafc;
  color: #8b5cf6;
  border-color: #c4b5fd;
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
  padding: 3rem 2rem;
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
}

.light-empty-state h3 {
  color: #1e293b;
  margin-bottom: 0.5rem;
}

.light-empty-state p {
  color: #64748b;
  margin-bottom: 2rem;
}

.light-restaurants-list.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
  gap: 24px;
}

.light-restaurants-list.list-view {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.light-restaurant-card {
  background: linear-gradient(160deg, #ffffff 0%, #f8fafc 100%);
  border: 1px solid rgba(0, 0, 0, 0.06);
  border-radius: 20px;
  padding: 0;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.06), 0 2px 12px rgba(0, 0, 0, 0.03), inset 0 1px 0 rgba(255, 255, 255, 0.9);
  transition: transform 0.28s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.28s ease, border-color 0.2s ease;
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.light-restaurant-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 20px 48px rgba(0, 0, 0, 0.1), 0 8px 20px rgba(0, 0, 0, 0.05), inset 0 1px 0 rgba(255, 255, 255, 1);
  border-color: rgba(0, 0, 0, 0.08);
}

.light-restaurant-card .card-image {
  width: 100%;
  height: 220px;
  min-height: 180px;
  object-fit: cover;
  border-radius: 20px 20px 0 0;
  margin-bottom: 0;
  border: none;
  border-bottom: 1px solid rgba(0, 0, 0, 0.06);
  flex-shrink: 0;
}

.light-restaurant-card .restaurant-card-body {
  display: flex;
  flex-direction: column;
  flex: 1;
  min-width: 0;
  padding: 20px 22px;
}

.light-restaurant-card h2 {
  color: #0f172a;
  margin-bottom: 0.625rem;
  font-size: 1.2rem;
  font-weight: 600;
  line-height: 1.35;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  letter-spacing: 0.01em;
}

.light-restaurant-card-description-wrap {
  flex: 1;
  min-height: 3.5em;
  max-height: 10em;
  margin-bottom: 1rem;
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

.light-restaurant-card-description-wrap::-webkit-scrollbar {
  width: 6px;
}

.light-restaurant-card-description-wrap::-webkit-scrollbar-track {
  background: rgba(148, 163, 184, 0.15);
  border-radius: 3px;
}

.light-restaurant-card-description-wrap::-webkit-scrollbar-thumb {
  background: rgba(100, 116, 139, 0.4);
  border-radius: 3px;
}

.light-restaurant-card-description-wrap::-webkit-scrollbar-thumb:hover {
  background: rgba(100, 116, 139, 0.6);
}

.light-restaurant-card:hover .light-restaurant-card-description-wrap {
  background: #e2e8f0;
  border-color: #94a3b8;
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.8);
}

.light-restaurant-card p {
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
div.light-restaurants-list.grid div.light-restaurant-card .light-restaurant-card-description-wrap {
  min-height: 5.5em;
  max-height: 11em;
}

.light-restaurant-card-actions {
  display: flex !important;
  gap: 0.5rem;
  margin-top: auto;
  flex-wrap: nowrap;
  visibility: visible !important;
  opacity: 1 !important;
}

.light-restaurant-card-actions button,
.light-restaurant-card-actions .light-btn {
  opacity: 1 !important;
  visibility: visible !important;
}

.light-menus-container.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
  gap: 1.5rem;
}

.light-menu-card {
  background: linear-gradient(160deg, #ffffff 0%, #f8fafc 100%);
  border: 1px solid rgba(0, 0, 0, 0.06);
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.06), 0 2px 12px rgba(0, 0, 0, 0.03), inset 0 1px 0 rgba(255, 255, 255, 0.9);
  transition: transform 0.28s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.28s ease, border-color 0.2s ease;
  height: 460px;
  min-height: 460px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.light-menu-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 20px 48px rgba(0, 0, 0, 0.1), 0 8px 20px rgba(0, 0, 0, 0.05);
  border-color: rgba(0, 0, 0, 0.08);
}

.light-menu-images-display {
  position: relative;
  height: 240px;
  overflow: hidden;
}

.light-menu-images-carousel {
  position: relative;
  width: 100%;
  height: 100%;
}

.light-menu-images-carousel .main-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.light-image-count-badge {
  position: absolute;
  top: 10px;
  right: 10px;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border-radius: 9999px;
  font-size: 0.8rem;
  font-weight: 600;
  color: #1e293b;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  border: 1px solid rgba(0, 0, 0, 0.08);
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.12);
  z-index: 2;
}

.light-image-count-badge .image-count-icon {
  font-size: 0.9rem;
  line-height: 1;
}

.light-menu-content {
  padding: 1.5rem;
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
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
  gap: 0.5rem;
  margin-top: auto;
  visibility: visible !important;
  opacity: 1 !important;
}

.light-menu-card-actions .light-btn,
.light-menu-card-actions button {
  opacity: 1 !important;
  visibility: visible !important;
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
.light-dashboard input[type="file"],
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
    gap: 12px;
  }

  .light-view-toggle .light-view-btn,
  .light-view-toggle .view-btn {
    min-height: 44px;
    padding: 10px 16px;
    -webkit-tap-highlight-color: transparent;
  }

  .light-sort-select {
    min-height: 44px;
    padding: 12px 16px;
    -webkit-tap-highlight-color: transparent;
  }

  .light-restaurant-card-actions button,
  .light-menu-card-actions .light-btn {
    min-height: 44px;
    padding: 12px 16px;
    -webkit-tap-highlight-color: transparent;
  }

  .light-section-header {
    flex-direction: column;
    align-items: stretch;
    gap: 1rem;
  }

  .light-restaurants-list.grid {
    grid-template-columns: 1fr;
  }

  .light-menus-container,
  .light-menus-container.grid {
    display: grid !important;
    grid-template-columns: 1fr !important;
    gap: 1rem !important;
  }

  div.light-menus-container.grid div.light-menu-card,
  .light-menu-card {
    height: auto !important;
    min-height: unset !important;
    width: 100% !important;
    max-width: 100% !important;
  }

  .light-menu-images-display {
    height: 220px;
    min-height: 220px;
  }

  .light-menu-content {
    padding: 1rem;
  }

  .light-menu-content h3 {
    font-size: 1.1rem;
  }

  .light-menu-card-actions {
    flex-wrap: wrap;
    gap: 8px;
  }

  .light-menu-card-actions .light-btn,
  .light-menu-card-actions button {
    min-height: 48px;
    padding: 12px 14px;
    -webkit-tap-highlight-color: transparent;
    flex: 1 1 calc(50% - 4px);
    min-width: 0;
    justify-content: center;
  }

  .light-preview-images-grid {
    grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
  }

  .light-preview-image-item .preview-img {
    height: 80px;
  }

  .light-menu-item {
    gap: 1rem;
  }

  .light-form-actions {
    flex-direction: column;
  }

  .light-restaurant-card {
    padding: 1rem;
  }

  .light-restaurant-card .card-image {
    height: 160px;
    min-height: 120px;
  }

  .light-restaurant-card h2 {
    font-size: 1.1rem;
  }

  .light-restaurant-card-description-wrap {
    padding: 8px 10px;
  }

  .light-restaurant-card p {
    font-size: 0.8125rem;
    -webkit-line-clamp: 2;
  }

  div.light-restaurants-list.list-view div.light-restaurant-card {
    flex-direction: column !important;
  }

  div.light-restaurants-list.list-view div.light-restaurant-card .card-image {
    width: 100%;
    min-width: unset;
    height: 140px;
    min-height: 120px;
    margin-right: 0;
    border-right: none;
    border-bottom: 1px solid #e2e8f0;
    border-radius: 18px 18px 0 0;
  }

  .light-restaurant-card-actions {
    flex-wrap: nowrap;
  }
}

@media (max-width: 480px) {
  .light-menus-container.grid div.light-menu-card {
    min-height: unset !important;
  }

  .light-menu-images-display {
    height: 160px;
    min-height: 160px;
  }

  .light-menu-content h3 {
    font-size: 1rem;
  }

  .light-menu-card-actions {
    flex-direction: column;
    gap: 8px;
  }

  .light-menu-card-actions .light-btn,
  .light-menu-card-actions button {
    width: 100%;
    min-height: 48px;
    padding: 12px 14px;
    font-size: 0.9rem;
    -webkit-tap-highlight-color: transparent;
    justify-content: center;
  }
}

/* Light mode checkboxes (form items & options) */
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

/* Enhanced focus states for accessibility */
.light-action-button:focus,
.light-theme-toggle-button:focus,
.light-btn:focus,
.light-section-action:focus,
.light-back-button:focus,
.light-form-input:focus,
.light-search-input:focus {
  outline: 2px solid #8b5cf6;
  outline-offset: 2px;
}

/* Smooth transitions for theme switching (scoped to avoid jank) */
.light-dashboard,
.light-sidebar,
.light-main-content,
.light-form-container,
.light-menu-item,
.light-restaurant-card,
.light-menu-card,
.light-btn,
.light-form-input,
.light-search-input {
  transition: background-color 0.2s ease, border-color 0.2s ease, color 0.2s ease, box-shadow 0.2s ease, transform 0.2s ease;
}

/* Restaurant list grid and list view */
div.light-restaurants-list.grid {
  display: grid !important;
  grid-template-columns: repeat(auto-fill, minmax(min(100%, 340px), 1fr)) !important;
  gap: 24px !important;
}

div.light-restaurants-list.list-view {
  display: flex !important;
  flex-direction: column !important;
  gap: 16px !important;
}

/* Light list view – card horizontal (image left) */
div.light-restaurants-list.list-view div.light-restaurant-card {
  flex-direction: row !important;
  align-items: stretch;
}

div.light-restaurants-list.list-view div.light-restaurant-card .restaurant-card-body {
  padding: 14px 16px;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  align-items: flex-start;
}

div.light-restaurants-list.list-view div.light-restaurant-card .restaurant-card-body h2 {
  flex: 0 0 100%;
  margin-bottom: 8px;
}

div.light-restaurants-list.list-view div.light-restaurant-card .light-restaurant-card-description-wrap {
  min-height: 2.75em;
  max-height: 5em;
  margin-bottom: 0;
  margin-right: 12px;
  padding: 10px 12px;
  flex: 1;
  min-width: 0;
  align-self: stretch;
  display: flex;
  align-items: flex-start;
  overflow-y: auto;
  overflow-x: hidden;
  -webkit-overflow-scrolling: touch;
}

div.light-restaurants-list.list-view div.light-restaurant-card .light-restaurant-card-actions {
  flex-direction: column;
  margin-top: 0;
  gap: 8px;
  flex-shrink: 0;
}

div.light-restaurants-list.list-view div.light-restaurant-card p {
  font-size: 0.875rem;
  line-height: 1.5;
}

div.light-restaurants-list.list-view div.light-restaurant-card .card-image {
  width: 140px;
  min-width: 140px;
  height: 120px;
  min-height: 120px;
  margin-bottom: 0;
  margin-right: 0;
  border-bottom: none;
  border-right: 1px solid rgba(0, 0, 0, 0.06);
  border-radius: 20px 0 0 20px;
  object-fit: cover;
}

div.light-restaurants-list.list-view div.light-restaurant-card .restaurant-card-body {
  min-width: 0;
}

div.light-restaurants-list.list-view div.light-restaurant-card h2 {
  -webkit-line-clamp: 1;
}


/* Restaurant card flex styling – grid */
div.light-restaurants-list.grid div.light-restaurant-card {
  display: flex !important;
  flex-direction: column !important;
  height: 100% !important;
}

/* Menu card styling - add higher specificity and !important */
div.light-menus-container.grid div.light-menu-card {
  height: 460px !important;
  min-height: 460px !important;
  display: flex !important;
  flex-direction: column !important;
  justify-content: space-between !important;
}

div.light-menus-container.grid div.light-menu-card img.card-image {
  height: 240px !important;
  object-fit: cover !important;
}

.light-menu-card {
  width: 100% !important;
  min-width: 0;
  max-width: 100%;
}

.light-menus-container.grid {
  grid-template-columns: repeat(auto-fill, minmax(min(100%, 340px), 1fr));
  gap: 1.5rem;
}

.light-view-toggle {
  display: flex;
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.06);
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

.checkbox-input:focus {
  outline: none;
  box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
}

.checkbox-text {
  color: #495057;
}
      `}</style>
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

export default RestaurantsAndMenusPage
