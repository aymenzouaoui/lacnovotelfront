"use client"

import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import "./SettingsPage.css"
import API from "../services/api"

const SettingsPage = () => {
  const navigate = useNavigate()
  const [users, setUsers] = useState([])
  const [search, setSearch] = useState("")
  const [sortBy, setSortBy] = useState("username")
  const [sortAsc, setSortAsc] = useState(true)
  const [user, setUser] = useState({ username: "", email: "" })
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [showAddUserModal, setShowAddUserModal] = useState(false)
  const [newUser, setNewUser] = useState({ username: "", email: "", password: "" })
  const [currentTime, setCurrentTime] = useState(new Date())
  const [editingUser, setEditingUser] = useState(null)

  // Theme state with localStorage initialization
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem("theme")
    return savedTheme ? savedTheme === "dark" : true
  })

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (!token) return navigate("/")

    const userData = JSON.parse(localStorage.getItem("user") || "{}")

    // ⛔ If user is not admin, redirect with alert
    const roles = Array.isArray(userData.role)
      ? userData.role
      : typeof userData.role === "string"
        ? [userData.role]
        : []

    if (!roles.includes("admin")) {
      alert("Seul un administrateur peut accéder à cette page.")
      return navigate("/dashboard")
    }

    setUser(userData)

    const loadTimer = setTimeout(() => setIsLoading(false), 800)
    const timer = setInterval(() => setCurrentTime(new Date()), 60000)

    // Fetch users
    API.get("/users")
      .then((res) => setUsers(res.data || []))
      .catch((err) => console.error("User fetch error", err))

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

  const handleUpdateUser = () => {
    if (!editingUser) return

    API.put(`/users/${editingUser._id}`, editingUser)
      .then((res) => {
        setUsers(users.map((u) => (u._id === editingUser._id ? res.data : u)))
        setEditingUser(null)
      })
      .catch((err) => console.error("Update error", err))
  }

  const handleDelete = (id) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cet utilisateur ?")) {
      API.delete(`/users/${id}`)
        .then(() => {
          setUsers(users.filter((u) => u._id !== id))
        })
        .catch((err) => console.error("Delete error", err))
    }
  }

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortAsc(!sortAsc)
    } else {
      setSortBy(field)
      setSortAsc(true)
    }
  }

  const handleAddUser = () => {
    API.post("/users", newUser)
      .then((res) => {
        setUsers([...users, res.data])
        setNewUser({ username: "", email: "", password: "" })
        setShowAddUserModal(false)
      })
      .catch((err) => console.error("Add user error", err))
  }

  const sortedUsers = [...users]
    .filter(
      (u) =>
        u.username?.toLowerCase().includes(search.toLowerCase()) ||
        u.email?.toLowerCase().includes(search.toLowerCase()),
    )
    .sort((a, b) => {
      const valA = a[sortBy] || ""
      const valB = b[sortBy] || ""
      return sortAsc ? valA.localeCompare(valB) : valB.localeCompare(valA)
    })

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
            <li className="active">
              <a href="#settings">
                <span className={isDarkMode ? "nav-icon" : "light-nav-icon"}>⚙️</span>
                <span>Paramètres</span>
              </a>
            </li>
            <li>
              <a href="#qr" onClick={() => navigate("/dashboard")}>
                <span className={isDarkMode ? "nav-icon" : "light-nav-icon"}>📱</span>
                <span>Générer QR Code</span>
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
              Paramètres <span className={isDarkMode ? "wave-emoji" : "light-wave-emoji"}>⚙️</span>
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
          <p>Gérez les utilisateurs et les paramètres de l'application</p>
        </div>

        <div className={isDarkMode ? "dashboard-grid" : "light-dashboard-grid"}>
          <div className={isDarkMode ? "services-section" : "light-services-section"}>
            <div className={isDarkMode ? "section-header" : "light-section-header"}>
              <h2>Gestion des utilisateurs</h2>
              <div className="section-actions">
                <button
                  className={isDarkMode ? "section-action" : "light-section-action"}
                  onClick={() => setShowAddUserModal(true)}
                >
                  <span>Ajouter</span>
                  <span className="action-icon">+</span>
                </button>
              </div>
            </div>

            <div className={isDarkMode ? "search-filter-container" : "light-search-filter-container"}>
              <div className={isDarkMode ? "search-container" : "light-search-container"}>
                <span className="search-icon">🔍</span>
                <input
                  className={isDarkMode ? "search-input" : "light-search-input"}
                  type="text"
                  placeholder="Rechercher un utilisateur..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>

            <div className={isDarkMode ? "users-table-container" : "light-users-table-container"}>
              <table className={isDarkMode ? "users-table" : "light-users-table"}>
                <thead>
                  <tr>
                    <th onClick={() => handleSort("username")}>
                      Nom d'utilisateur
                      {sortBy === "username" && <span className="sort-icon">{sortAsc ? " ↑" : " ↓"}</span>}
                    </th>
                    <th onClick={() => handleSort("email")}>
                      Email
                      {sortBy === "email" && <span className="sort-icon">{sortAsc ? " ↑" : " ↓"}</span>}
                    </th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedUsers.length > 0 ? (
                    sortedUsers.map((u) => (
                      <tr key={u._id}>
                        <td>
                          <div className={isDarkMode ? "user-cell" : "light-user-cell"}>
                            <div className={isDarkMode ? "user-avatar-mini" : "light-user-avatar-mini"}>
                              {u.username.charAt(0)}
                            </div>
                            <span>{u.username}</span>
                          </div>
                        </td>
                        <td>{u.email}</td>
                        <td>
                          <div className="action-buttons">
                            <button
                              className="table-action edit"
                              onClick={() => setEditingUser({ ...u })} // clone to edit safely
                            >
                              <span>✏️</span>
                            </button>

                            <button className="table-action delete" onClick={() => handleDelete(u._id)}>
                              <span>🗑️</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="3" className={isDarkMode ? "no-results" : "light-no-results"}>
                        Aucun utilisateur trouvé
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className={isDarkMode ? "activity-section" : "light-activity-section"}>
            <div className={isDarkMode ? "section-header" : "light-section-header"}>
              <h2>Informations système</h2>
            </div>
            <div className={isDarkMode ? "activity-list" : "light-activity-list"}>
              <div
                className={isDarkMode ? "activity-item" : "light-activity-item"}
                style={{ "--activity-color": "#FF6B6B" }}
              >
                <div className="activity-icon">🖥️</div>
                <div className="activity-content">
                  <p className="activity-text">Version du système</p>
                  <p className="activity-time">v1.2.5</p>
                </div>
              </div>

              <div
                className={isDarkMode ? "activity-item" : "light-activity-item"}
                style={{ "--activity-color": "#FFD166" }}
              >
                <div className="activity-icon">📡</div>
                <div className="activity-content">
                  <p className="activity-text">Statut du serveur</p>
                  <p className="activity-time">En ligne</p>
                </div>
              </div>
              <div
                className={isDarkMode ? "activity-item" : "light-activity-item"}
                style={{ "--activity-color": "#6A0572" }}
              >
                <div className="activity-icon">🔒</div>
                <div className="activity-content">
                  <p className="activity-text">Sécurité</p>
                  <p className="activity-time">Protégé</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showAddUserModal && (
        <div
          className={isDarkMode ? "modal-overlay" : "light-modal-overlay"}
          onClick={() => setShowAddUserModal(false)}
        >
          <div
            className={isDarkMode ? "modal-container" : "light-modal-container"}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={isDarkMode ? "modal-header" : "light-modal-header"}>
              <h3>Ajouter un utilisateur</h3>
              <button
                className={isDarkMode ? "close-modal" : "light-close-modal"}
                onClick={() => setShowAddUserModal(false)}
              >
                ×
              </button>
            </div>
            <div className={isDarkMode ? "modal-content" : "light-modal-content"}>
              <div className={isDarkMode ? "form-group" : "light-form-group"}>
                <label>Nom d'utilisateur</label>
                <input
                  type="text"
                  value={newUser.username}
                  onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
                  placeholder="Entrez le nom d'utilisateur"
                  className={isDarkMode ? "" : "light-form-input"}
                />
              </div>
              <div className={isDarkMode ? "form-group" : "light-form-group"}>
                <label>Email</label>
                <input
                  type="email"
                  value={newUser.email}
                  onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                  placeholder="Entrez l'email"
                  className={isDarkMode ? "" : "light-form-input"}
                />
              </div>
              <div className={isDarkMode ? "form-group" : "light-form-group"}>
                <label>Mot de passe</label>
                <input
                  type="password"
                  value={newUser.password}
                  onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                  placeholder="Entrez le mot de passe"
                  className={isDarkMode ? "" : "light-form-input"}
                />
              </div>
            </div>
            <div className={isDarkMode ? "modal-actions" : "light-modal-actions"}>
              <button
                className={isDarkMode ? "cancel-button" : "light-cancel-button"}
                onClick={() => setShowAddUserModal(false)}
              >
                Annuler
              </button>
              <button className={isDarkMode ? "download-button" : "light-download-button"} onClick={handleAddUser}>
                Ajouter
              </button>
            </div>
          </div>
        </div>
      )}
      {editingUser && (
        <div className={isDarkMode ? "modal-overlay" : "light-modal-overlay"} onClick={() => setEditingUser(null)}>
          <div
            className={isDarkMode ? "modal-container" : "light-modal-container"}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={isDarkMode ? "modal-header" : "light-modal-header"}>
              <h3>Modifier l'utilisateur</h3>
              <button className={isDarkMode ? "close-modal" : "light-close-modal"} onClick={() => setEditingUser(null)}>
                ×
              </button>
            </div>
            <div className={isDarkMode ? "modal-content" : "light-modal-content"}>
              <div className={isDarkMode ? "form-group" : "light-form-group"}>
                <label>Nom d'utilisateur</label>
                <input
                  type="text"
                  value={editingUser.username}
                  onChange={(e) => setEditingUser({ ...editingUser, username: e.target.value })}
                  className={isDarkMode ? "" : "light-form-input"}
                />
              </div>
              <div className={isDarkMode ? "form-group" : "light-form-group"}>
                <label>Email</label>
                <input
                  type="email"
                  value={editingUser.email}
                  onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
                  className={isDarkMode ? "" : "light-form-input"}
                />
              </div>
              <div className={isDarkMode ? "form-group" : "light-form-group"}>
                <label>Rôles</label>
                <div className={isDarkMode ? "checkbox-group" : "light-checkbox-group"}>
                  {["admin", "terrassepiscine", "restaurant", "seminaire", "spa", "questionnaire","skip_clean"].map((roleOption) => (
                    <label key={roleOption} className={isDarkMode ? "checkbox-label" : "light-checkbox-label"}>
                      <input
                        type="checkbox"
                        value={roleOption}
                        checked={editingUser.role.includes(roleOption)}
                        onChange={(e) => {
                          const updatedRoles = e.target.checked
                            ? [...editingUser.role, roleOption]
                            : editingUser.role.filter((r) => r !== roleOption)
                          setEditingUser({ ...editingUser, role: updatedRoles })
                        }}
                      />
                      {roleOption.charAt(0).toUpperCase() + roleOption.slice(1)}
                    </label>
                  ))}
                </div>
              </div>
            </div>
            <div className={isDarkMode ? "modal-actions" : "light-modal-actions"}>
              <button
                className={isDarkMode ? "cancel-button" : "light-cancel-button"}
                onClick={() => setEditingUser(null)}
              >
                Annuler
              </button>
              <button className={isDarkMode ? "download-button" : "light-download-button"} onClick={handleUpdateUser}>
                Mettre à jour
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
/* Light Mode Styles for Settings Page */
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
.modal-container,
.light-modal-container {
  background: var(--modal-bg, white);
  border-radius: 12px;
  width: 90% !important;
  max-width: 500px !important;
  max-height: 80vh !important;
  overflow: hidden !important; /* hide scroll on container itself */
  padding: 0 !important; /* remove internal padding from wrapper */
  position: relative !important;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.3);
  display: flex !important;
  flex-direction: column !important;
}

/* ✅ Fixed header */
.modal-header,
.light-modal-header {
  position: sticky !important;
  top: 0 !important;
  background: inherit !important;
  z-index: 10 !important;
  padding: 16px 20px !important;
  border-bottom: 1px solid #ddd !important;
}

/* ✅ Scrollable content area only */
.modal-content,
.light-modal-content {
  overflow-y: auto !important;
  flex: 1 !important; /* take remaining height */
  padding: 20px !important;
}

/* Footer area (buttons) fixed at bottom inside modal */
.modal-actions,
.light-modal-actions {
  padding: 16px 20px !important;
  border-top: 1px solid #ddd !important;
  background: inherit !important;
  position: sticky !important;
  bottom: 0 !important;
  z-index: 9 !important;
}

/* Overlay scroll safety */
.modal-overlay,
.light-modal-overlay {
  align-items: center !important;
  justify-content: center !important;
  overflow-y: auto !important;
  padding: 20px !important;
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

/* Dashboard Grid */
.light-dashboard-grid {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 2rem;
  margin-bottom: 2rem;
}

/* Services Section */
.light-services-section {
  background: linear-gradient(135deg, #ffffff 0%, #fdf2f8 100%);
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

/* Activity Section */
.light-activity-section {
  background: linear-gradient(135deg, #ffffff 0%, #fdf2f8 100%);
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.light-activity-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.light-activity-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.8) 0%, rgba(253, 242, 248, 0.8) 100%);
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  transition: all 0.3s ease;
}

.light-activity-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(236, 72, 153, 0.1);
}

/* Search and Filter Components */
.light-search-filter-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  gap: 1rem;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.8) 0%, rgba(253, 242, 248, 0.8) 100%);
  padding: 1.5rem;
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
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

/* Section Headers */
.light-section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
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

/* Users Table */
.light-users-table-container {
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(253, 242, 248, 0.9) 100%);
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.light-users-table {
  width: 100%;
  border-collapse: collapse;
  background: transparent;
}

.light-users-table th {
  background: linear-gradient(135deg, #ffffff 0%, #fdf2f8 100%);
  color: #1e293b;
  font-weight: 600;
  padding: 1rem;
  text-align: left;
  border-bottom: 2px solid #e2e8f0;
  cursor: pointer;
  transition: all 0.3s ease;
}

.light-users-table th:hover {
  background: linear-gradient(45deg, rgba(236, 72, 153, 0.1), rgba(139, 92, 246, 0.1));
  color: #ec4899;
}

.light-users-table td {
  padding: 1rem;
  border-bottom: 1px solid #e2e8f0;
  color: #64748b;
}

.light-users-table tbody tr {
  transition: all 0.3s ease;
}

.light-users-table tbody tr:hover {
  background: linear-gradient(90deg, rgba(236, 72, 153, 0.05), rgba(139, 92, 246, 0.05));
}

.light-user-cell {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.light-user-avatar-mini {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: linear-gradient(45deg, #ec4899, #8b5cf6);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: bold;
  font-size: 0.875rem;
  box-shadow: 0 2px 8px rgba(236, 72, 153, 0.3);
}

/* Table Action Buttons - Works for both themes */
.table-action {
  padding: 0.5rem;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  margin: 0 0.25rem;
  position: relative;
  z-index: 1;
}

.table-action.edit {
  background: linear-gradient(45deg, #3b82f6, #1d4ed8);
  color: white;
  box-shadow: 0 2px 8px rgba(59, 130, 246, 0.3);
}

.table-action.edit:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
}

.table-action.delete {
  background: linear-gradient(45deg, #ef4444, #dc2626);
  color: white;
  box-shadow: 0 2px 8px rgba(239, 68, 68, 0.3);
}

.table-action.delete:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(239, 68, 68, 0.4);
}

.light-no-results {
  text-align: center;
  color: #94a3b8;
  font-style: italic;
  padding: 2rem;
}

/* Modal Styles */
.light-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10000;
  backdrop-filter: blur(4px);
}

.light-modal-container {
  background: linear-gradient(135deg, #ffffff 0%, #fdf2f8 100%);
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  width: 90%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
}

.light-modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid #e2e8f0;
  background: linear-gradient(135deg, #ffffff 0%, #fdf2f8 100%);
}

.light-modal-header h3 {
  margin: 0;
  color: #1e293b;
  font-size: 1.25rem;
  font-weight: 600;
}

.light-close-modal {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #64748b;
  padding: 0.5rem;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.light-close-modal:hover {
  background: rgba(236, 72, 153, 0.1);
  color: #ec4899;
}

.light-modal-content {
  padding: 1.5rem;
}

.light-form-group {
  margin-bottom: 1.5rem;
}

.light-form-group label {
  display: block;
  margin-bottom: 0.5rem;
  color: #1e293b;
  font-weight: 500;
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

.light-checkbox-group {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.light-checkbox-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #1e293b;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.light-checkbox-label:hover {
  background: rgba(236, 72, 153, 0.05);
}

.light-checkbox-label input[type="checkbox"] {
  width: 1.25rem;
  height: 1.25rem;
  accent-color: #ec4899;
}

.light-modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  padding: 1.5rem;
  border-top: 1px solid #e2e8f0;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(253, 242, 248, 0.9) 100%);
}

.light-cancel-button {
  padding: 0.75rem 1.5rem;
  background: linear-gradient(135deg, #ffffff 0%, #f1f5f9 100%);
  color: #64748b;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 500;
}

.light-cancel-button:hover {
  background: linear-gradient(45deg, #ec4899, #8b5cf6);
  color: white;
  border-color: transparent;
}

.light-download-button {
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

.light-download-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(236, 72, 153, 0.4);
  background: linear-gradient(45deg, #db2777, #7c3aed);
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

  .light-dashboard-grid {
    grid-template-columns: 1fr;
  }

  .light-search-filter-container {
    flex-direction: column;
    align-items: stretch;
  }
}

@media (max-width: 480px) {
  .light-welcome-header h1 {
    font-size: 1.5rem;
  }

  .light-users-table {
    font-size: 0.875rem;
  }

  .light-users-table th,
  .light-users-table td {
    padding: 0.75rem 0.5rem;
  }
}

/* Enhanced focus states for accessibility */
.light-action-button:focus,
.light-theme-toggle-button:focus,
.light-section-action:focus,
.table-action:focus {
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

export default SettingsPage
