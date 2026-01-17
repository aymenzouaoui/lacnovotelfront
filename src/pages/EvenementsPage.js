"use client"

import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import API from "../services/api"
import "./EvenementsPage.css"
import CompressedFileInput from "../components/CompressedFileInput"

const EvenementPage = () => {
  const navigate = useNavigate()
  const [evenements, setEvenements] = useState([])
  const [selectedEvenement, setSelectedEvenement] = useState(null)
  const [participants, setParticipants] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [showEvenementForm, setShowEvenementForm] = useState(false)
  const [evenementFormData, setEvenementFormData] = useState({
    name: "",
    description: "",
    price: "",
    image: null,
  })
  const [evenementPreviewImage, setEvenementPreviewImage] = useState(null)
  const [user, setUser] = useState({ username: "", email: "" })
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [currentTime, setCurrentTime] = useState(new Date())
  const [searchTerm, setSearchTerm] = useState("")
  const [sortOrder, setSortOrder] = useState("newest")
  const [viewMode, setViewMode] = useState("grid")

  // Theme state with localStorage initialization
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem("theme")
    return savedTheme ? savedTheme === "dark" : true
  })

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    notes: "",
  })
  const [editId, setEditId] = useState(null)
  const [editingEvenementId, setEditingEvenementId] = useState(null)

  const handleEditEvenement = (evenement) => {
    setEditingEvenementId(evenement._id)
    setEvenementFormData({
      name: evenement.name,
      description: evenement.description,
      price: evenement.price || "",
      image: null,
    })
    setShowEvenementForm(true)
  }

  const fetchEvenements = async () => {
    setIsLoading(true)
    try {
      const res = await API.get("/evenements")
      setEvenements(res.data)
    } catch (error) {
      console.error("Erreur chargement événements:", error)
      alert("Erreur lors du chargement des événements")
    } finally {
      setIsLoading(false)
    }
  }

  const fetchParticipants = async (evenementId) => {
    setIsLoading(true)
    try {
      const res = await API.get(`/evenements/${evenementId}/participants`)
      setParticipants(res.data)
    } catch (error) {
      console.error("Erreur chargement participants:", error)
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

    fetchEvenements()

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

  const handleSelectEvenement = (evenement) => {
    setSelectedEvenement(evenement)
    fetchParticipants(evenement._id)
    setShowForm(false)
    setEditId(null)
    resetForm()
  }

  const handleChange = (e) => {
    const { name, value, files } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!selectedEvenement) return alert("Sélectionnez un événement d'abord!")

    try {
      setIsLoading(true)
      const participantData = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        notes: formData.notes,
        evenement: selectedEvenement._id,
      }

      if (editId) {
        await API.put(`/participants/${editId}`, participantData)
        alert("Participant modifié avec succès")
      } else {
        await API.post("/participants", participantData)
        alert("Participant ajouté avec succès")
      }

      fetchParticipants(selectedEvenement._id)
      resetForm()
      setShowForm(false)
    } catch (error) {
      console.error("Erreur lors de l'enregistrement du participant:", error)
      alert("Erreur d'enregistrement")
    } finally {
      setIsLoading(false)
    }
  }

  const handleEdit = (participant) => {
    setFormData({
      name: participant.name,
      email: participant.email,
      phone: participant.phone || "",
      notes: participant.notes || "",
    })
    setEditId(participant._id)
    setShowForm(true)
  }

  const handleDelete = async (participantId) => {
    try {
      if (window.confirm("Voulez-vous supprimer ce participant ?")) {
        setIsLoading(true)
        await API.delete(`/participants/${participantId}`)
        fetchParticipants(selectedEvenement._id)
        alert("Participant supprimé")
      }
    } catch (error) {
      console.error("Erreur suppression:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      phone: "",
      notes: "",
    })
    setEditId(null)
  }

  const handleEvenementChange = (e) => {
    const { name, value, files } = e.target
    if (name === "image" && files && files[0]) {
      const image = files[0]
      setEvenementFormData((prev) => ({ ...prev, image }))

      const reader = new FileReader()
      reader.onloadend = () => setEvenementPreviewImage(reader.result)
      reader.readAsDataURL(image)
    } else {
      setEvenementFormData((prev) => ({ ...prev, [name]: value }))
    }
  }

  const handleEvenementSubmit = async (e) => {
    e.preventDefault()
    try {
      setIsLoading(true)
      const form = new FormData()
      form.append("name", evenementFormData.name)
      form.append("description", evenementFormData.description)
      form.append("price", evenementFormData.price)
      if (evenementFormData.image) form.append("image", evenementFormData.image)

      if (editingEvenementId) {
        await API.put(`/evenements/${editingEvenementId}`, form, {
          headers: { "Content-Type": "multipart/form-data" },
        })
        alert("Événement modifié avec succès")
      } else {
        await API.post("/evenements", form, {
          headers: { "Content-Type": "multipart/form-data" },
        })
        alert("Événement créé avec succès")
      }

      fetchEvenements()
      setShowEvenementForm(false)
      setEditingEvenementId(null)
      setEvenementFormData({
        name: "",
        description: "",
        price: "",
        image: null,
      })
      setEvenementPreviewImage(null)
    } catch (error) {
      console.error("Erreur soumission événement:", error)
      alert("Erreur lors de la soumission")
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteEvenement = async (id) => {
    if (window.confirm("Voulez-vous vraiment supprimer cet événement ?")) {
      try {
        setIsLoading(true)
        await API.delete(`/evenements/${id}`)
        alert("Événement supprimé")
        fetchEvenements()
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

  const filteredParticipants = participants
    .filter(
      (p) =>
        p.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.notes?.toLowerCase().includes(searchTerm.toLowerCase()),
    )
    .sort((a, b) => {
      if (sortOrder === "alphabetical") {
        return a.name.localeCompare(b.name)
      }
      return 0
    })

  const filteredEvenements = evenements
    .filter(
      (e) =>
        e.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        e.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        e.price?.toLowerCase().includes(searchTerm.toLowerCase()),
    )
    .sort((a, b) => {
      if (sortOrder === "alphabetical") {
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
              <a href="#evenements">
                <span className={isDarkMode ? "nav-icon" : "light-nav-icon"}>🎉</span>
                <span>Événements</span>
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
              {selectedEvenement ? `${selectedEvenement.name} - Participants` : "Événements"}{" "}
              <span className={isDarkMode ? "wave-emoji" : "light-wave-emoji"}>🎉</span>
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
            {selectedEvenement
              ? `Gérez les participants de l'événement ${selectedEvenement.name}`
              : "Gérez vos événements et leurs participants"}
          </p>
        </div>

        <div className={isDarkMode ? "search-filter-container" : "light-search-filter-container"}>
          <div className={isDarkMode ? "search-container" : "light-search-container"}>
            <span className="search-icon">🔍</span>
            <input
              className={isDarkMode ? "search-input" : "light-search-input"}
              type="text"
              placeholder={selectedEvenement ? "Rechercher un participant..." : "Rechercher un événement..."}
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

        {!selectedEvenement ? (
          <>
            <div className={isDarkMode ? "section-header" : "light-section-header"}>
              <h2>Liste des événements</h2>
              <div className="section-actions">
                <button
                  className={isDarkMode ? "section-action" : "light-section-action"}
                  onClick={() => setShowEvenementForm(!showEvenementForm)}
                >
                  <span>{showEvenementForm ? "Annuler" : "Ajouter"}</span>
                  <span className="action-icon">{showEvenementForm ? "❌" : "+"}</span>
                </button>
              </div>
            </div>

            {showEvenementForm && (
              <div className={isDarkMode ? "form-container" : "light-form-container"}>
                <form
                  onSubmit={handleEvenementSubmit}
                  className={isDarkMode ? "restaurant-form" : "light-restaurant-form"}
                >
                  <input
                    type="text"
                    name="name"
                    placeholder="Titre de l'événement"
                    value={evenementFormData.name}
                    onChange={handleEvenementChange}
                    required
                    className={isDarkMode ? "" : "light-form-input"}
                  />
                  <textarea
                    name="description"
                    placeholder="Description"
                    value={evenementFormData.description}
                    onChange={handleEvenementChange}
                    className={isDarkMode ? "" : "light-form-input"}
                  />

                  <input
                    type="text"
                    name="price"
                    placeholder="prix"
                    value={evenementFormData.price}
                    onChange={handleEvenementChange}
                    className={isDarkMode ? "" : "light-form-input"}
                  />
                <CompressedFileInput
  type="file"
  name="image"
  accept="image/*"
  onChange={handleEvenementChange}
  className={isDarkMode ? "" : "light-form-input"}
/>

                  {evenementPreviewImage && (
                    <img src={evenementPreviewImage || "/placeholder.svg"} alt="Aperçu" className="preview-img" />
                  )}

                  <div className="form-actions">
                    <button
                      type="submit"
                      className={isDarkMode ? "btn btn-primary" : "light-btn light-btn-primary"}
                      disabled={isLoading}
                    >
                      {isLoading ? "Chargement..." : editingEvenementId ? "✅ Modifier" : "✅ Créer"}
                    </button>
                    <button
                      type="button"
                      className={isDarkMode ? "btn btn-secondary" : "light-btn light-btn-secondary"}
                      onClick={() => {
                        setShowEvenementForm(false)
                        setEditingEvenementId(null)
                        setEvenementFormData({
                          name: "",
                          description: "",
                          price: "",
                          image: null,
                        })
                        setEvenementPreviewImage(null)
                      }}
                      disabled={isLoading}
                    >
                      ❌ Annuler
                    </button>
                  </div>
                </form>
              </div>
            )}

            {filteredEvenements.length === 0 ? (
              <div className={isDarkMode ? "empty-state" : "light-empty-state"}>
                <div className="empty-icon">🎉</div>
                <h3>Aucun événement trouvé</h3>
                <p>Commencez par créer un nouvel événement</p>
                <button
                  className={isDarkMode ? "btn btn-primary" : "light-btn light-btn-primary"}
                  onClick={() => setShowEvenementForm(true)}
                >
                  Créer un événement
                </button>
              </div>
            ) : (
              <div
                className={`${isDarkMode ? "restaurants-list" : "light-restaurants-list"} ${viewMode === "list" ? "list-view" : "grid"}`}
              >
                {filteredEvenements.map((e) => (
                  <div key={e._id} className={isDarkMode ? "restaurant-card" : "light-restaurant-card"}>
                    {e.image && <img src={e.image || "/placeholder.svg"} alt={e.name} className="card-image" />}
                    <h2 onClick={() => handleSelectEvenement(e)} style={{ cursor: "pointer" }}>
                      {e.name}
                    </h2>
                    <p onClick={() => handleSelectEvenement(e)} style={{ cursor: "pointer" }}>
                      {e.description}
                    </p>
                    <div className="event-details">{e.price && <div className="event-price"> {e.price} TND</div>}</div>
                    <div className="restaurant-card-actions">
                      <button
                        onClick={() => handleEditEvenement(e)}
                        className={isDarkMode ? "" : "light-btn light-btn-secondary"}
                      >
                        ✏️ Modifier
                      </button>
                      <button
                        onClick={() => handleDeleteEvenement(e._id)}
                        className={isDarkMode ? "" : "light-btn light-btn-danger"}
                      >
                        🗑️ Supprimer
                      </button>
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
                  onClick={() => setSelectedEvenement(null)}
                >
                  ← Retour aux événements
                </button>
              </div>
              <h2>Participants à l'événement: {selectedEvenement.name}</h2>
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
                  <input
                    type="text"
                    name="name"
                    placeholder="Nom du participant"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className={isDarkMode ? "" : "light-form-input"}
                  />
                  <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className={isDarkMode ? "" : "light-form-input"}
                  />
                  <input
                    type="tel"
                    name="phone"
                    placeholder="Téléphone"
                    value={formData.phone}
                    onChange={handleChange}
                    className={isDarkMode ? "" : "light-form-input"}
                  />
                  <textarea
                    name="notes"
                    placeholder="Notes"
                    value={formData.notes}
                    onChange={handleChange}
                    className={isDarkMode ? "" : "light-form-input"}
                  />

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

            {filteredParticipants.length === 0 ? (
              <div className={isDarkMode ? "empty-state" : "light-empty-state"}>
                <div className="empty-icon">👥</div>
                <h3>Aucun participant trouvé</h3>
                <p>Commencez par ajouter un participant à cet événement</p>
                <button
                  className={isDarkMode ? "btn btn-primary" : "light-btn light-btn-primary"}
                  onClick={() => setShowForm(true)}
                >
                  Ajouter un participant
                </button>
              </div>
            ) : (
              <div className={`${isDarkMode ? "menus-container" : "light-menus-container"} ${viewMode}`}>
                {filteredParticipants.map((participant) => (
                  <div key={participant._id} className={isDarkMode ? "menu-card" : "light-menu-card"}>
                    <div className="participant-avatar card-image">{participant.name.charAt(0).toUpperCase()}</div>
                    <div className={isDarkMode ? "menu-content" : "light-menu-content"}>
                      <h3>{participant.name}</h3>
                      <div className="menu-items-count">
                        {participant.email}
                        {participant.phone && <div>📞 {participant.phone}</div>}
                      </div>
                      <div className="menu-card-actions">
                        <button
                          onClick={() => handleEdit(participant)}
                          className={isDarkMode ? "btn btn-secondary" : "light-btn light-btn-secondary"}
                        >
                          ✏️ Modifier
                        </button>
                        <button
                          onClick={() => handleDelete(participant._id)}
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
        )}
      </div>

      <style jsx>{`
/* Light Mode Styles for Evenement Page */
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
.light-form-container {
  background: linear-gradient(135deg, #ffffff 0%, #fdf2f8 100%);
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  padding: 2rem;
  margin-bottom: 2rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.light-restaurant-form, .light-menu-form {
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

.light-btn-danger {
  background: linear-gradient(45deg, #ef4444, #dc2626);
  color: white;
  box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);
}

.light-btn-danger:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(239, 68, 68, 0.4);
}

/* Back Button */
.light-back-button {
  padding: 0.75rem 1.5rem;
  background: linear-gradient(135deg, #ffffff 0%, #fdf2f8 100%);
  color: #64748b;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 500;
}

.light-back-button:hover {
  background: linear-gradient(45deg, #ec4899, #8b5cf6);
  color: white;
  border-color: transparent;
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

/* Restaurant/Event Lists and Cards */
.light-restaurants-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.light-restaurant-card {
  background: linear-gradient(135deg, #ffffff 0%, #fdf2f8 100%);
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  padding: 1.5rem;
}

.light-restaurant-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 25px rgba(236, 72, 153, 0.15);
}

.light-restaurant-card h2 {
  color: #1e293b;
  margin-bottom: 1rem;
  font-size: 1.25rem;
  font-weight: 600;
}

.light-restaurant-card p {
  color: #64748b;
  margin-bottom: 1rem;
}

/* Menu/Participant Cards */
.light-menus-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
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
}

.light-menu-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 25px rgba(236, 72, 153, 0.15);
}

.light-menu-content {
  padding: 1.5rem;
}

.light-menu-content h3 {
  color: #1e293b;
  margin-bottom: 1rem;
  font-size: 1.25rem;
  font-weight: 600;
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
}

@media (max-width: 480px) {
  .light-welcome-header h1 {
    font-size: 1.5rem;
  }
}

/* Enhanced focus states for accessibility */
.light-action-button:focus,
.light-theme-toggle-button:focus,
.light-btn:focus {
  outline: 2px solid #ec4899;
  outline-offset: 2px;
}

/* Smooth transitions for theme switching */
* {
  transition: background-color 0.3s ease, border-color 0.3s ease, color 0.3s ease;
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

/* Restaurant list grid and list view for light mode */
.light-restaurants-list.grid {
  display: grid !important;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr)) !important;
  gap: 1.5rem !important;
}

.light-restaurants-list.list-view {
  display: flex !important;
  flex-direction: column !important;
  gap: 1rem !important;
}

/* Ensure proper layout for list view */
.light-restaurants-list.list-view .light-restaurant-card {
  display: flex !important;
  flex-direction: row !important;
  align-items: center !important;
  padding: 1rem 1.5rem !important;
}

.light-restaurants-list.list-view .light-restaurant-card .card-image {
  width: 80px !important;
  height: 80px !important;
  margin-right: 1rem !important;
  flex-shrink: 0 !important;
}
`}
</style>
    </div>
  )
}

export default EvenementPage