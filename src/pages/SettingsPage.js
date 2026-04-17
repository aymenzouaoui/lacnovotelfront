"use client"

import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import "./SettingsPage.css"
import API from "../services/api"

const ROLE_CONFIG = {
  admin: { label: "Admin", color: "#ef4444", bg: "rgba(239,68,68,0.12)" },
  terrassepiscine: { label: "Piscine", color: "#3b82f6", bg: "rgba(59,130,246,0.12)" },
  restaurant: { label: "Restaurant", color: "#f59e0b", bg: "rgba(245,158,11,0.12)" },
  seminaire: { label: "Séminaire", color: "#8b5cf6", bg: "rgba(139,92,246,0.12)" },
  spa: { label: "Spa", color: "#ec4899", bg: "rgba(236,72,153,0.12)" },
  questionnaire: { label: "Questionnaire", color: "#10b981", bg: "rgba(16,185,129,0.12)" },
  skip_clean: { label: "Skip Clean", color: "#64748b", bg: "rgba(100,116,139,0.12)" },
}

const RoleBadge = ({ role }) => {
  const cfg = ROLE_CONFIG[role] || { label: role, color: "#64748b", bg: "rgba(100,116,139,0.12)" }
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", padding: "2px 8px",
      borderRadius: "20px", fontSize: "0.7rem", fontWeight: 600,
      color: cfg.color, background: cfg.bg, border: `1px solid ${cfg.color}33`,
      whiteSpace: "nowrap",
    }}>
      {cfg.label}
    </span>
  )
}

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
  const [notification, setNotification] = useState(null)
  const [confirmDialog, setConfirmDialog] = useState(null) // { type, user, onConfirm }

  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem("theme")
    return savedTheme ? savedTheme === "dark" : true
  })

  const showNotification = (message, type = "success") => {
    setNotification({ message, type })
    setTimeout(() => setNotification(null), 3000)
  }

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (!token) return navigate("/")

    const userData = JSON.parse(localStorage.getItem("user") || "{}")
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

    API.get("/users")
      .then((res) => setUsers(res.data || []))
      .catch((err) => console.error("User fetch error", err))

    return () => {
      clearTimeout(loadTimer)
      clearInterval(timer)
    }
  }, [navigate])

  useEffect(() => {
    localStorage.setItem("theme", isDarkMode ? "dark" : "light")
  }, [isDarkMode])

  const toggleTheme = () => setIsDarkMode(!isDarkMode)

  const handleUpdateUser = () => {
    if (!editingUser) return
    setConfirmDialog({
      type: "update",
      user: editingUser,
      onConfirm: () => {
        API.put(`/users/${editingUser._id}`, editingUser)
          .then((res) => {
            setUsers(users.map((u) => (u._id === editingUser._id ? res.data : u)))
            setEditingUser(null)
            setConfirmDialog(null)
            showNotification("Utilisateur mis à jour avec succès")
          })
          .catch((err) => {
            console.error("Update error", err)
            setConfirmDialog(null)
            showNotification("Erreur lors de la mise à jour", "error")
          })
      },
    })
  }

  const handleDelete = (id) => {
    const target = users.find((u) => u._id === id)
    setConfirmDialog({
      type: "delete",
      user: target,
      onConfirm: () => {
        API.delete(`/users/${id}`)
          .then(() => {
            setUsers(users.filter((u) => u._id !== id))
            setConfirmDialog(null)
            showNotification("Utilisateur supprimé")
          })
          .catch((err) => {
            console.error("Delete error", err)
            setConfirmDialog(null)
            showNotification("Erreur lors de la suppression", "error")
          })
      },
    })
  }

  const handleSort = (field) => {
    if (sortBy === field) setSortAsc(!sortAsc)
    else { setSortBy(field); setSortAsc(true) }
  }

  const handleAddUser = () => {
    if (!newUser.username || !newUser.email || !newUser.password) {
      showNotification("Veuillez remplir tous les champs", "error")
      return
    }
    API.post("/users", newUser)
      .then((res) => {
        setUsers([...users, res.data])
        setNewUser({ username: "", email: "", password: "" })
        setShowAddUserModal(false)
        showNotification("Utilisateur ajouté avec succès")
      })
      .catch((err) => {
        console.error("Add user error", err)
        showNotification("Erreur lors de l'ajout", "error")
      })
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

  const formatDate = (date) => date.toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long", year: "numeric" })
  const formatTime = (date) => date.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })
  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen)

  const dm = isDarkMode

  if (isLoading) {
    return (
      <div className={dm ? "loading-container" : "light-loading-container"}>
        <div className={dm ? "loading-logo" : "light-loading-logo"}>
          <img src={dm ? "/GUESTLY_LIGHT.jpg" : "/GUESTLY_DARK.jpg"} alt="Guestly Logo" className="logo-image" />
        </div>
        <div className={dm ? "loading-spinner" : "light-loading-spinner"}>
          <div className={dm ? "spinner-circle" : "light-spinner-circle"}></div>
          <div className={dm ? "spinner-circle-inner" : "light-spinner-circle-inner"}></div>
        </div>
        <div className={dm ? "loading-text" : "light-loading-text"}>Chargement...</div>
      </div>
    )
  }

  const adminCount = users.filter(u => {
    const r = Array.isArray(u.role) ? u.role : [u.role]
    return r.includes("admin")
  }).length

  return (
    <div className={dm ? "dashboard" : "light-dashboard"}>
      {/* Toast Notification */}
      {notification && (
        <div className={`sp-toast sp-toast--${notification.type}`}>
          <span className="sp-toast__icon">{notification.type === "success" ? "✓" : "✕"}</span>
          {notification.message}
        </div>
      )}

      {/* Mobile Header */}
      <div className={dm ? "mobile-header" : "light-mobile-header"}>
        <button className={dm ? "menu-toggle" : "light-menu-toggle"} onClick={toggleSidebar}>
          <span></span><span></span><span></span>
        </button>
        <div className={dm ? "mobile-logo" : "light-mobile-logo"}>
          <img src={dm ? "/GUESTLY_LIGHT.jpg" : "/GUESTLY_DARK.jpg"} alt="Guestly Logo"
            style={{ width: "180px", height: "auto", objectFit: "contain" }} />
        </div>
        <div className={dm ? "mobile-user" : "light-mobile-user"}>
          <div className={dm ? "user-avatar" : "light-user-avatar"}>{user.username.charAt(0)}</div>
        </div>
      </div>

      {/* Sidebar */}
      <div className={`${dm ? "sidebar" : "light-sidebar"} ${isSidebarOpen ? "open" : ""}`}>
        <div className={dm ? "sidebar-header" : "light-sidebar-header"}>
          <div className={dm ? "logo" : "light-logo"}>
            <img src={dm ? "/GUESTLY_LIGHT.jpg" : "/GUESTLY_DARK.jpg"} alt="Guestly Logo"
              style={{ width: "180px", height: "auto", objectFit: "contain" }} />
          </div>
          <button className={dm ? "close-sidebar" : "light-close-sidebar"} onClick={toggleSidebar}>×</button>
        </div>

        <div className={dm ? "user-profile" : "light-user-profile"}>
          <div className={dm ? "user-avatar" : "light-user-avatar"}>{user.username.charAt(0)}</div>
          <div className={dm ? "user-info" : "light-user-info"}>
            <div className={dm ? "user-name" : "light-user-name"}>{user.username}</div>
            <div className={dm ? "user-email" : "light-user-email"}>{user.email}</div>
          </div>
        </div>

        <div className={dm ? "sidebar-date" : "light-sidebar-date"}>
          <div className={dm ? "date-display" : "light-date-display"}>{formatDate(currentTime)}</div>
          <div className={dm ? "time-display" : "light-time-display"}>{formatTime(currentTime)}</div>
        </div>

        <nav className={dm ? "sidebar-nav" : "light-sidebar-nav"}>
          <ul>
            <li><a href="#dashboard" onClick={() => navigate("/dashboard")}>
              <span className={dm ? "nav-icon" : "light-nav-icon"}>🏠</span><span>Tableau de bord</span>
            </a></li>
            <li><a href="#profile" onClick={() => navigate("/profile")}>
              <span className={dm ? "nav-icon" : "light-nav-icon"}>👤</span><span>Mon profil</span>
            </a></li>
            <li className="active"><a href="#settings">
              <span className={dm ? "nav-icon" : "light-nav-icon"}>⚙️</span><span>Paramètres</span>
            </a></li>
            <li><a href="#qr" onClick={() => navigate("/dashboard")}>
              <span className={dm ? "nav-icon" : "light-nav-icon"}>📱</span><span>Générer QR Code</span>
            </a></li>
          </ul>
        </nav>

        <div className={dm ? "sidebar-footer" : "light-sidebar-footer"}>
          <button className={dm ? "logout-button" : "light-logout-button"}
            onClick={() => { localStorage.removeItem("token"); localStorage.removeItem("user"); navigate("/") }}>
            <span className={dm ? "nav-icon" : "light-nav-icon"}>🚪</span><span>Déconnexion</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className={dm ? "main-content" : "light-main-content"}>
        {/* Page Header */}
        <div className={dm ? "welcome-section" : "light-welcome-section"}>
          <div className={dm ? "welcome-header" : "light-welcome-header"}>
            <div>
              <h1>Paramètres <span className={dm ? "wave-emoji" : "light-wave-emoji"}>⚙️</span></h1>
              <p style={{ margin: "4px 0 0", color: dm ? "#94a3b8" : "#64748b", fontSize: "1rem" }}>
                Gérez les utilisateurs et les paramètres de l'application
              </p>
            </div>
            <div className={dm ? "welcome-actions" : "light-welcome-actions"}>
              <button className={dm ? "action-button notifications" : "light-action-button light-notifications"}>
                <span className={dm ? "action-icon" : "light-action-icon"}>🔔</span>
                <span className="notification-badge"></span>
              </button>
              <button className={dm ? "theme-toggle-button" : "light-theme-toggle-button"} onClick={toggleTheme}
                title={dm ? "Passer en mode clair" : "Passer en mode sombre"}>
                {dm ? "☀️" : "🌙"}
              </button>
              <div className={dm ? "user-avatar-small" : "light-user-avatar-small"}>{user.username.charAt(0)}</div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="sp-stats-row">
          <div className={`sp-stat-card ${dm ? "sp-stat-card--dark" : ""}`}>
            <div className="sp-stat-card__icon" style={{ background: "rgba(139,92,246,0.15)", color: "#8b5cf6" }}>👥</div>
            <div className="sp-stat-card__body">
              <div className="sp-stat-card__value">{users.length}</div>
              <div className="sp-stat-card__label">Utilisateurs</div>
            </div>
          </div>
          <div className={`sp-stat-card ${dm ? "sp-stat-card--dark" : ""}`}>
            <div className="sp-stat-card__icon" style={{ background: "rgba(239,68,68,0.15)", color: "#ef4444" }}>🛡️</div>
            <div className="sp-stat-card__body">
              <div className="sp-stat-card__value">{adminCount}</div>
              <div className="sp-stat-card__label">Administrateurs</div>
            </div>
          </div>
          <div className={`sp-stat-card ${dm ? "sp-stat-card--dark" : ""}`}>
            <div className="sp-stat-card__icon" style={{ background: "rgba(16,185,129,0.15)", color: "#10b981" }}>✅</div>
            <div className="sp-stat-card__body">
              <div className="sp-stat-card__value" style={{ color: "#10b981" }}>En ligne</div>
              <div className="sp-stat-card__label">Serveur</div>
            </div>
          </div>
          <div className={`sp-stat-card ${dm ? "sp-stat-card--dark" : ""}`}>
            <div className="sp-stat-card__icon" style={{ background: "rgba(59,130,246,0.15)", color: "#3b82f6" }}>🔒</div>
            <div className="sp-stat-card__body">
              <div className="sp-stat-card__value">v1.2.5</div>
              <div className="sp-stat-card__label">Version</div>
            </div>
          </div>
        </div>

        {/* Grid */}
        <div className={dm ? "dashboard-grid" : "light-dashboard-grid"}>
          {/* Users Table */}
          <div className={dm ? "services-section" : "light-services-section"}>
            <div className={dm ? "section-header" : "light-section-header"}>
              <h2>Gestion des utilisateurs</h2>
              <button className={dm ? "section-action" : "light-section-action"} onClick={() => setShowAddUserModal(true)}>
                <span>+ Ajouter</span>
              </button>
            </div>

            <div className={dm ? "search-filter-container" : "light-search-filter-container"}>
              <div className={dm ? "search-container" : "light-search-container"}>
                <span className="search-icon">🔍</span>
                <input className={dm ? "search-input" : "light-search-input"} type="text"
                  placeholder="Rechercher un utilisateur..." value={search}
                  onChange={(e) => setSearch(e.target.value)} />
              </div>
              <div className="sp-result-count">
                {sortedUsers.length} résultat{sortedUsers.length !== 1 ? "s" : ""}
              </div>
            </div>

            <div className={dm ? "users-table-container" : "light-users-table-container"}>
              <table className={dm ? "users-table" : "light-users-table"}>
                <thead>
                  <tr>
                    <th onClick={() => handleSort("username")} className="sp-th-sortable">
                      Utilisateur {sortBy === "username" && <span className="sort-icon">{sortAsc ? "↑" : "↓"}</span>}
                    </th>
                    <th onClick={() => handleSort("email")} className="sp-th-sortable">
                      Email {sortBy === "email" && <span className="sort-icon">{sortAsc ? "↑" : "↓"}</span>}
                    </th>
                    <th>Rôles</th>
                    <th style={{ textAlign: "center" }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedUsers.length > 0 ? sortedUsers.map((u) => {
                    const roles = Array.isArray(u.role) ? u.role : u.role ? [u.role] : []
                    return (
                      <tr key={u._id} className="sp-table-row">
                        <td>
                          <div className={dm ? "user-cell" : "light-user-cell"}>
                            <div className={`${dm ? "user-avatar-mini" : "light-user-avatar-mini"} sp-avatar-initial`}>
                              {u.username.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <div style={{ fontWeight: 600, fontSize: "0.9rem" }}>{u.username}</div>
                            </div>
                          </div>
                        </td>
                        <td style={{ fontSize: "0.875rem", color: dm ? "#94a3b8" : "#64748b" }}>{u.email}</td>
                        <td>
                          <div className="sp-role-badges">
                            {roles.length > 0
                              ? roles.map(r => <RoleBadge key={r} role={r} />)
                              : <span style={{ color: "#94a3b8", fontSize: "0.8rem" }}>Aucun rôle</span>}
                          </div>
                        </td>
                        <td>
                          <div className="sp-action-btns">
                            <button className="sp-btn-icon sp-btn-icon--edit" title="Modifier"
                              onClick={() => setEditingUser({ ...u, role: roles })}>
                              ✏️
                            </button>
                            <button className="sp-btn-icon sp-btn-icon--delete" title="Supprimer"
                              onClick={() => handleDelete(u._id)}>
                              🗑️
                            </button>
                          </div>
                        </td>
                      </tr>
                    )
                  }) : (
                    <tr>
                      <td colSpan="4" className="sp-empty-state">
                        <div className="sp-empty-icon">🔍</div>
                        <div>Aucun utilisateur trouvé</div>
                        {search && <div className="sp-empty-hint">Essayez un autre terme de recherche</div>}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* System Info */}
          <div className={dm ? "activity-section" : "light-activity-section"}>
            <div className={dm ? "section-header" : "light-section-header"}>
              <h2>Informations système</h2>
            </div>
            <div className={dm ? "activity-list" : "light-activity-list"}>
              {[
                { icon: "🖥️", label: "Version du système", value: "v1.2.5", color: "#8b5cf6", status: null },
                { icon: "📡", label: "Statut du serveur", value: "En ligne", color: "#10b981", status: "online" },
                { icon: "🔒", label: "Sécurité", value: "Protégé", color: "#3b82f6", status: "ok" },
                { icon: "👥", label: "Total utilisateurs", value: users.length, color: "#ec4899", status: null },
              ].map((item, i) => (
                <div key={i} className={`${dm ? "activity-item" : "light-activity-item"} sp-sys-item`}
                  style={{ "--activity-color": item.color }}>
                  <div className="sp-sys-icon" style={{ background: `${item.color}20` }}>{item.icon}</div>
                  <div className="activity-content" style={{ flex: 1 }}>
                    <p className="activity-text" style={{ margin: 0, fontSize: "0.875rem", color: dm ? "#94a3b8" : "#64748b" }}>{item.label}</p>
                    <p className="activity-time" style={{ margin: "2px 0 0", fontWeight: 600, color: item.color }}>{item.value}</p>
                  </div>
                  {item.status && (
                    <span className={`sp-status-dot sp-status-dot--${item.status}`}></span>
                  )}
                </div>
              ))}
            </div>

            {/* Role Legend */}
            <div className={`sp-role-legend ${dm ? "sp-role-legend--dark" : ""}`}>
              <div className="sp-role-legend__title">Rôles disponibles</div>
              <div className="sp-role-legend__list">
                {Object.entries(ROLE_CONFIG).map(([key]) => (
                  <RoleBadge key={key} role={key} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add User Modal */}
      {showAddUserModal && (
        <div className={dm ? "modal-overlay" : "light-modal-overlay"} onClick={() => setShowAddUserModal(false)}>
          <div className={dm ? "modal-container" : "light-modal-container"} onClick={(e) => e.stopPropagation()}>
            <div className={dm ? "modal-header" : "light-modal-header"}>
              <div className="sp-modal-title">
                <span className="sp-modal-title__icon">👤</span>
                <h3>Ajouter un utilisateur</h3>
              </div>
              <button className={dm ? "close-modal" : "light-close-modal"} onClick={() => setShowAddUserModal(false)}>×</button>
            </div>
            <div className={dm ? "modal-content" : "light-modal-content"}>
              {[
                { label: "Nom d'utilisateur", key: "username", type: "text", placeholder: "ex: jean.dupont", icon: "👤" },
                { label: "Adresse email", key: "email", type: "email", placeholder: "ex: jean@hotel.com", icon: "📧" },
                { label: "Mot de passe", key: "password", type: "password", placeholder: "Min. 8 caractères", icon: "🔒" },
              ].map(({ label, key, type, placeholder, icon }) => (
                <div key={key} className={dm ? "form-group" : "light-form-group"}>
                  <label className="sp-form-label">{icon} {label}</label>
                  <input type={type} value={newUser[key]} placeholder={placeholder}
                    className={`sp-form-input ${dm ? "sp-form-input--dark" : ""}`}
                    onChange={(e) => setNewUser({ ...newUser, [key]: e.target.value })} />
                </div>
              ))}
            </div>
            <div className={dm ? "modal-actions" : "light-modal-actions"}>
              <button className={dm ? "cancel-button" : "light-cancel-button"} onClick={() => setShowAddUserModal(false)}>Annuler</button>
              <button className={dm ? "download-button" : "light-download-button"} onClick={handleAddUser}>
                ✓ Ajouter
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit User Modal */}
      {editingUser && (
        <div className={dm ? "modal-overlay" : "light-modal-overlay"} onClick={() => setEditingUser(null)}>
          <div className={dm ? "modal-container" : "light-modal-container"} onClick={(e) => e.stopPropagation()}>
            <div className={dm ? "modal-header" : "light-modal-header"}>
              <div className="sp-modal-title">
                <div className="sp-modal-avatar">{editingUser.username.charAt(0).toUpperCase()}</div>
                <div>
                  <h3 style={{ margin: 0 }}>Modifier l'utilisateur</h3>
                  <p style={{ margin: 0, fontSize: "0.8rem", color: "#94a3b8" }}>{editingUser.email}</p>
                </div>
              </div>
              <button className={dm ? "close-modal" : "light-close-modal"} onClick={() => setEditingUser(null)}>×</button>
            </div>
            <div className={dm ? "modal-content" : "light-modal-content"}>
              <div className={dm ? "form-group" : "light-form-group"}>
                <label className="sp-form-label">👤 Nom d'utilisateur</label>
                <input type="text" value={editingUser.username}
                  className={`sp-form-input ${dm ? "sp-form-input--dark" : ""}`}
                  onChange={(e) => setEditingUser({ ...editingUser, username: e.target.value })} />
              </div>
              <div className={dm ? "form-group" : "light-form-group"}>
                <label className="sp-form-label">📧 Adresse email</label>
                <input type="email" value={editingUser.email}
                  className={`sp-form-input ${dm ? "sp-form-input--dark" : ""}`}
                  onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })} />
              </div>
              <div className={dm ? "form-group" : "light-form-group"}>
                <label className="sp-form-label">🛡️ Rôles attribués</label>
                <div className="sp-roles-grid">
                  {Object.entries(ROLE_CONFIG).map(([roleOption, cfg]) => {
                    const checked = editingUser.role.includes(roleOption)
                    return (
                      <label key={roleOption}
                        className={`sp-role-chip ${checked ? "sp-role-chip--active" : ""} ${dm ? "sp-role-chip--dark" : ""}`}
                        style={checked ? { borderColor: cfg.color, background: cfg.bg, color: cfg.color } : {}}>
                        <input type="checkbox" value={roleOption} checked={checked}
                          style={{ display: "none" }}
                          onChange={(e) => {
                            const updatedRoles = e.target.checked
                              ? [...editingUser.role, roleOption]
                              : editingUser.role.filter((r) => r !== roleOption)
                            setEditingUser({ ...editingUser, role: updatedRoles })
                          }} />
                        <span className="sp-role-chip__dot" style={{ background: cfg.color }}></span>
                        {cfg.label}
                      </label>
                    )
                  })}
                </div>
              </div>
            </div>
            <div className={dm ? "modal-actions" : "light-modal-actions"}>
              <button className={dm ? "cancel-button" : "light-cancel-button"} onClick={() => setEditingUser(null)}>Annuler</button>
              <button className={dm ? "download-button" : "light-download-button"} onClick={handleUpdateUser}>
                ✓ Mettre à jour
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirm Dialog */}
      {confirmDialog && (
        <div className="sp-confirm-overlay" onClick={() => setConfirmDialog(null)}>
          <div className="sp-confirm-box" onClick={(e) => e.stopPropagation()}>
            <div className={`sp-confirm-icon-wrap sp-confirm-icon-wrap--${confirmDialog.type}`}>
              {confirmDialog.type === "delete" ? "🗑️" : "✏️"}
            </div>
            <h3 className="sp-confirm-title">
              {confirmDialog.type === "delete" ? "Supprimer l'utilisateur" : "Confirmer la modification"}
            </h3>
            <p className="sp-confirm-desc">
              {confirmDialog.type === "delete" ? (
                <>
                  Vous allez supprimer définitivement{" "}
                  <strong>{confirmDialog.user?.username}</strong>.
                  <br />Cette action est irréversible.
                </>
              ) : (
                <>
                  Confirmer les modifications apportées à{" "}
                  <strong>{confirmDialog.user?.username}</strong> ?
                </>
              )}
            </p>
            {confirmDialog.user && (
              <div className="sp-confirm-user-pill">
                <div className="sp-confirm-avatar">{confirmDialog.user.username.charAt(0).toUpperCase()}</div>
                <div>
                  <div className="sp-confirm-uname">{confirmDialog.user.username}</div>
                  <div className="sp-confirm-uemail">{confirmDialog.user.email}</div>
                </div>
              </div>
            )}
            <div className="sp-confirm-actions">
              <button className="sp-confirm-btn sp-confirm-btn--cancel" onClick={() => setConfirmDialog(null)}>
                Annuler
              </button>
              <button
                className={`sp-confirm-btn sp-confirm-btn--${confirmDialog.type}`}
                onClick={confirmDialog.onConfirm}
              >
                {confirmDialog.type === "delete" ? "🗑️ Supprimer" : "✓ Confirmer"}
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
/* ──────────────────────────────────────────
   Confirm Dialog
────────────────────────────────────────── */
.sp-confirm-overlay {
  position: fixed; inset: 0; z-index: 99998;
  background: rgba(0,0,0,0.6);
  backdrop-filter: blur(6px);
  display: flex; align-items: center; justify-content: center;
  animation: sp-fadeIn 0.2s ease;
}
.sp-confirm-box {
  background: #fff;
  border-radius: 20px;
  padding: 2rem;
  width: 90%;
  max-width: 400px;
  text-align: center;
  box-shadow: 0 24px 60px rgba(0,0,0,0.2);
  animation: sp-popIn 0.25s cubic-bezier(0.34,1.56,0.64,1);
}
@keyframes sp-fadeIn { from { opacity:0 } to { opacity:1 } }
@keyframes sp-popIn  { from { opacity:0; transform:scale(0.85) translateY(20px) } to { opacity:1; transform:scale(1) translateY(0) } }

.sp-confirm-icon-wrap {
  width: 64px; height: 64px; border-radius: 50%;
  margin: 0 auto 1.25rem;
  display: flex; align-items: center; justify-content: center;
  font-size: 1.8rem;
}
.sp-confirm-icon-wrap--delete { background: rgba(239,68,68,0.12); }
.sp-confirm-icon-wrap--update { background: rgba(59,130,246,0.12); }

.sp-confirm-title {
  margin: 0 0 0.6rem;
  font-size: 1.2rem;
  font-weight: 700;
  color: #1e293b;
}
.sp-confirm-desc {
  margin: 0 0 1.25rem;
  font-size: 0.9rem;
  color: #64748b;
  line-height: 1.6;
}
.sp-confirm-user-pill {
  display: flex; align-items: center; gap: 12px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 10px 14px;
  margin-bottom: 1.5rem;
  text-align: left;
}
.sp-confirm-avatar {
  width: 38px; height: 38px; border-radius: 50%;
  background: linear-gradient(45deg, #ec4899, #8b5cf6);
  display: flex; align-items: center; justify-content: center;
  color: #fff; font-weight: 700; font-size: 1rem; flex-shrink: 0;
}
.sp-confirm-uname { font-weight: 600; font-size: 0.9rem; color: #1e293b; }
.sp-confirm-uemail { font-size: 0.78rem; color: #94a3b8; }

.sp-confirm-actions {
  display: flex; gap: 10px; justify-content: center;
}
.sp-confirm-btn {
  flex: 1; padding: 0.75rem 1.25rem;
  border: none; border-radius: 12px; font-weight: 600; font-size: 0.9rem;
  cursor: pointer; transition: all 0.2s ease;
}
.sp-confirm-btn--cancel {
  background: #f1f5f9; color: #64748b; border: 2px solid #e2e8f0;
}
.sp-confirm-btn--cancel:hover { background: #e2e8f0; }
.sp-confirm-btn--delete {
  background: linear-gradient(45deg, #ef4444, #dc2626);
  color: #fff; box-shadow: 0 4px 14px rgba(239,68,68,0.35);
}
.sp-confirm-btn--delete:hover { transform: translateY(-2px); box-shadow: 0 8px 20px rgba(239,68,68,0.45); }
.sp-confirm-btn--update {
  background: linear-gradient(45deg, #3b82f6, #1d4ed8);
  color: #fff; box-shadow: 0 4px 14px rgba(59,130,246,0.35);
}
.sp-confirm-btn--update:hover { transform: translateY(-2px); box-shadow: 0 8px 20px rgba(59,130,246,0.45); }

/* ──────────────────────────────────────────
   Toast Notification
────────────────────────────────────────── */
.sp-toast {
  position: fixed;
  top: 24px;
  right: 24px;
  z-index: 99999;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 14px 20px;
  border-radius: 12px;
  font-weight: 500;
  font-size: 0.9rem;
  box-shadow: 0 8px 24px rgba(0,0,0,0.15);
  animation: sp-slideIn 0.3s ease;
  min-width: 260px;
}
.sp-toast--success { background: #10b981; color: #fff; }
.sp-toast--error   { background: #ef4444; color: #fff; }
.sp-toast__icon { font-size: 1.1rem; }
@keyframes sp-slideIn {
  from { opacity: 0; transform: translateX(40px); }
  to   { opacity: 1; transform: translateX(0); }
}

/* ──────────────────────────────────────────
   Stats Row
────────────────────────────────────────── */
.sp-stats-row {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;
  margin-bottom: 1.5rem;
}
.sp-stat-card {
  display: flex;
  align-items: center;
  gap: 1rem;
  background: #fff;
  border: 1px solid #e2e8f0;
  border-radius: 14px;
  padding: 1.2rem 1.4rem;
  box-shadow: 0 2px 8px rgba(0,0,0,0.06);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}
.sp-stat-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0,0,0,0.1);
}
.sp-stat-card--dark {
  background: rgba(255,255,255,0.05);
  border-color: rgba(255,255,255,0.1);
}
.sp-stat-card__icon {
  width: 44px; height: 44px;
  border-radius: 12px;
  display: flex; align-items: center; justify-content: center;
  font-size: 1.3rem;
  flex-shrink: 0;
}
.sp-stat-card__value {
  font-size: 1.4rem;
  font-weight: 700;
  line-height: 1;
}
.sp-stat-card__label {
  font-size: 0.78rem;
  color: #94a3b8;
  margin-top: 3px;
}

/* ──────────────────────────────────────────
   Table Enhancements
────────────────────────────────────────── */
.sp-th-sortable { cursor: pointer; user-select: none; }
.sp-th-sortable:hover { color: #ec4899; }

.sp-table-row { transition: background 0.15s ease; }

.sp-role-badges {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
}

.sp-action-btns {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
}

.sp-btn-icon {
  width: 34px; height: 34px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  font-size: 0.95rem;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}
.sp-btn-icon--edit {
  background: rgba(59,130,246,0.12);
  color: #3b82f6;
}
.sp-btn-icon--edit:hover {
  background: #3b82f6; color: #fff;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(59,130,246,0.35);
}
.sp-btn-icon--delete {
  background: rgba(239,68,68,0.12);
  color: #ef4444;
}
.sp-btn-icon--delete:hover {
  background: #ef4444; color: #fff;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(239,68,68,0.35);
}

.sp-avatar-initial {
  text-transform: uppercase;
  font-weight: 700 !important;
}

.sp-result-count {
  font-size: 0.8rem;
  color: #94a3b8;
  white-space: nowrap;
}

/* Empty state */
.sp-empty-state {
  text-align: center;
  padding: 3rem 2rem !important;
  color: #94a3b8;
}
.sp-empty-icon { font-size: 2.5rem; margin-bottom: 0.75rem; }
.sp-empty-hint { font-size: 0.8rem; margin-top: 4px; color: #cbd5e1; }

/* ──────────────────────────────────────────
   System Info Panel
────────────────────────────────────────── */
.sp-sys-item { position: relative; }
.sp-sys-icon {
  width: 40px; height: 40px;
  border-radius: 10px;
  display: flex; align-items: center; justify-content: center;
  font-size: 1.2rem;
  flex-shrink: 0;
}
.sp-status-dot {
  width: 10px; height: 10px;
  border-radius: 50%;
  flex-shrink: 0;
}
.sp-status-dot--online { background: #10b981; box-shadow: 0 0 6px #10b981; animation: sp-pulse 2s infinite; }
.sp-status-dot--ok     { background: #3b82f6; }
@keyframes sp-pulse {
  0%, 100% { opacity: 1; }
  50%       { opacity: 0.4; }
}

/* Role legend */
.sp-role-legend {
  margin-top: 1.5rem;
  background: rgba(0,0,0,0.03);
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 1rem;
}
.sp-role-legend--dark {
  background: rgba(255,255,255,0.05);
  border-color: rgba(255,255,255,0.08);
}
.sp-role-legend__title {
  font-size: 0.75rem;
  font-weight: 600;
  color: #94a3b8;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 0.75rem;
}
.sp-role-legend__list {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

/* ──────────────────────────────────────────
   Modal Enhancements
────────────────────────────────────────── */
.sp-modal-title {
  display: flex;
  align-items: center;
  gap: 12px;
}
.sp-modal-title h3 { margin: 0; font-size: 1.1rem; }
.sp-modal-title__icon { font-size: 1.4rem; }
.sp-modal-avatar {
  width: 42px; height: 42px;
  border-radius: 50%;
  background: linear-gradient(45deg, #ec4899, #8b5cf6);
  display: flex; align-items: center; justify-content: center;
  color: #fff;
  font-weight: 700;
  font-size: 1.1rem;
  flex-shrink: 0;
}

.sp-form-label {
  display: block;
  margin-bottom: 6px;
  font-size: 0.875rem;
  font-weight: 500;
  color: inherit;
}

.sp-form-input {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 2px solid #e2e8f0;
  border-radius: 10px;
  font-size: 0.95rem;
  background: #fff;
  color: #1e293b;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
  font-family: inherit;
  box-sizing: border-box;
}
.sp-form-input--dark {
  background: rgba(255,255,255,0.07);
  border-color: rgba(255,255,255,0.12);
  color: #e2e8f0;
}
.sp-form-input:focus {
  outline: none;
  border-color: #ec4899;
  box-shadow: 0 0 0 3px rgba(236,72,153,0.12);
}
.sp-form-input--dark:focus {
  border-color: #ec4899;
}

/* Role chip grid for edit modal */
.sp-roles-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 8px;
  margin-top: 4px;
}
.sp-role-chip {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  border: 2px solid #e2e8f0;
  border-radius: 10px;
  cursor: pointer;
  font-size: 0.85rem;
  font-weight: 500;
  transition: all 0.2s ease;
  color: #64748b;
  background: transparent;
  user-select: none;
}
.sp-role-chip--dark {
  border-color: rgba(255,255,255,0.12);
  color: #94a3b8;
}
.sp-role-chip:hover { border-color: #ec4899; color: #ec4899; }
.sp-role-chip--active { font-weight: 600; }
.sp-role-chip__dot {
  width: 8px; height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
}

/* ──────────────────────────────────────────
   Light Mode Base (unchanged)
────────────────────────────────────────── */
.light-dashboard {
  background: linear-gradient(135deg, #ffffff 0%, #fdf2f8 50%, #f8fafc 100%);
  color: #1e293b;
  min-height: 100vh;
  font-family: "Inter", "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
}
.light-loading-container {
  position: fixed; top: 0; left: 0; width: 100%; height: 100%;
  background: linear-gradient(135deg, #fdf2f8 0%, #f3e8ff 50%, #ffffff 100%);
  display: flex; flex-direction: column; justify-content: center; align-items: center; z-index: 9999;
}
.modal-container, .light-modal-container {
  background: var(--modal-bg, white); border-radius: 12px;
  width: 90% !important; max-width: 500px !important; max-height: 80vh !important;
  overflow: hidden !important; padding: 0 !important; position: relative !important;
  box-shadow: 0 8px 20px rgba(0,0,0,0.3);
  display: flex !important; flex-direction: column !important;
}
.modal-header, .light-modal-header {
  position: sticky !important; top: 0 !important; background: inherit !important;
  z-index: 10 !important; padding: 16px 20px !important; border-bottom: 1px solid #ddd !important;
}
.modal-content, .light-modal-content {
  overflow-y: auto !important; flex: 1 !important; padding: 20px !important;
}
.modal-actions, .light-modal-actions {
  padding: 16px 20px !important; border-top: 1px solid #ddd !important;
  background: inherit !important; position: sticky !important; bottom: 0 !important; z-index: 9 !important;
  display: flex; justify-content: flex-end; gap: 10px;
}
.modal-overlay, .light-modal-overlay {
  position: fixed; top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,0.55); backdrop-filter: blur(4px);
  display: flex; align-items: center !important; justify-content: center !important;
  overflow-y: auto !important; padding: 20px !important; z-index: 10000;
}
.light-loading-logo {
  font-size: 3rem; font-weight: bold;
  background: linear-gradient(45deg, #ec4899, #8b5cf6);
  -webkit-background-clip: text; -webkit-text-fill-color: transparent;
  background-clip: text; margin-bottom: 2rem; animation: lightPulse 2s ease-in-out infinite;
}
.light-loading-spinner { position: relative; width: 80px; height: 80px; margin-bottom: 2rem; }
.light-spinner-circle {
  position: absolute; width: 100%; height: 100%;
  border: 4px solid #f1f5f9; border-top: 4px solid #ec4899;
  border-radius: 50%; animation: lightSpin 1s linear infinite;
}
.light-spinner-circle-inner {
  position: absolute; top: 10px; left: 10px;
  width: calc(100% - 20px); height: calc(100% - 20px);
  border: 2px solid transparent; border-top: 2px solid #8b5cf6;
  border-radius: 50%; animation: lightSpin 0.8s linear infinite reverse;
}
.light-loading-text { font-size: 1.2rem; color: #64748b; font-weight: 500; }
@keyframes lightPulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.7; } }
@keyframes lightSpin  { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }

.light-mobile-header {
  display: none; background: linear-gradient(135deg, #ffffff 0%, #fdf2f8 100%);
  border-bottom: 1px solid #e2e8f0; padding: 1rem;
  justify-content: space-between; align-items: center;
  box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1); backdrop-filter: blur(10px);
}
.light-menu-toggle {
  background: none; border: none; cursor: pointer; display: flex;
  flex-direction: column; gap: 4px; padding: 8px; border-radius: 8px; transition: all 0.3s ease;
}
.light-menu-toggle:hover { background: rgba(236,72,153,0.1); }
.light-menu-toggle span { width: 25px; height: 3px; background: linear-gradient(45deg, #ec4899, #8b5cf6); border-radius: 2px; }
.light-sidebar {
  width: 280px; background: linear-gradient(180deg, #ffffff 0%, #fdf2f8 100%);
  border-right: 1px solid #e2e8f0; height: 100vh; position: fixed; left: 0; top: 0;
  z-index: 1000; display: flex; flex-direction: column;
  box-shadow: 4px 0 20px rgba(0,0,0,0.08); transition: transform 0.3s ease;
}
.light-sidebar-header {
  padding: 2rem 1.5rem 1rem; border-bottom: 1px solid #e2e8f0;
  display: flex; justify-content: space-between; align-items: center;
  background: linear-gradient(135deg, #ffffff 0%, #fdf2f8 100%);
}
.light-close-sidebar {
  display: none; background: none; border: none; font-size: 1.5rem;
  cursor: pointer; color: #64748b; padding: 8px; border-radius: 8px; transition: all 0.3s ease;
}
.light-close-sidebar:hover { background: rgba(236,72,153,0.1); color: #ec4899; }
.light-user-profile {
  padding: 1.5rem; display: flex; align-items: center; gap: 1rem;
  border-bottom: 1px solid #e2e8f0;
}
.light-user-avatar {
  width: 50px; height: 50px; border-radius: 50%;
  background: linear-gradient(45deg, #ec4899, #8b5cf6);
  display: flex; align-items: center; justify-content: center;
  color: white; font-weight: bold; font-size: 1.2rem;
  box-shadow: 0 4px 12px rgba(236,72,153,0.3);
}
.light-user-name { font-weight: 600; color: #1e293b; margin-bottom: 0.25rem; }
.light-user-email { font-size: 0.875rem; color: #64748b; }
.light-sidebar-date { padding: 1rem 1.5rem; border-bottom: 1px solid #e2e8f0; text-align: center; }
.light-date-display { font-size: 0.875rem; color: #64748b; margin-bottom: 0.25rem; }
.light-time-display {
  font-size: 1.5rem; font-weight: bold;
  background: linear-gradient(45deg, #ec4899, #8b5cf6);
  -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
}
.light-sidebar-nav { flex: 1; padding: 1rem 0; }
.light-sidebar-nav ul { list-style: none; padding: 0; margin: 0; }
.light-sidebar-nav li { margin: 0.25rem 0; }
.light-sidebar-nav a {
  display: flex; align-items: center; gap: 1rem;
  padding: 0.75rem 1.5rem; color: #64748b; text-decoration: none;
  transition: all 0.3s ease; border-radius: 0 25px 25px 0; margin-right: 1rem; position: relative;
}
.light-sidebar-nav a::before {
  content: ""; position: absolute; left: 0; top: 0; bottom: 0; width: 4px;
  background: linear-gradient(45deg, #ec4899, #8b5cf6); border-radius: 0 4px 4px 0;
  transform: scaleY(0); transition: transform 0.3s ease;
}
.light-sidebar-nav a:hover { background: linear-gradient(90deg, rgba(236,72,153,0.1), rgba(139,92,246,0.1)); color: #ec4899; transform: translateX(5px); }
.light-sidebar-nav a:hover::before { transform: scaleY(1); }
.light-sidebar-nav li.active a { background: linear-gradient(90deg, rgba(236,72,153,0.15), rgba(139,92,246,0.15)); color: #ec4899; font-weight: 600; }
.light-sidebar-nav li.active a::before { transform: scaleY(1); }
.light-nav-icon { font-size: 1.2rem; }
.light-sidebar-footer {
  padding: 1rem 1.5rem; border-top: 1px solid #e2e8f0;
  background: linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(253,242,248,0.9) 100%);
}
.light-logout-button {
  width: 100%; display: flex; align-items: center; gap: 1rem; padding: 0.75rem;
  background: linear-gradient(45deg, #ec4899, #8b5cf6); color: white; border: none;
  border-radius: 12px; cursor: pointer; transition: all 0.3s ease; font-weight: 500;
  box-shadow: 0 4px 12px rgba(236,72,153,0.3);
}
.light-logout-button:hover { transform: translateY(-2px); box-shadow: 0 8px 20px rgba(236,72,153,0.4); }
.light-main-content { margin-left: 280px; padding: 2rem; min-height: 100vh; background: linear-gradient(135deg, #ffffff 0%, #fdf2f8 30%, #f8fafc 100%); }
.light-welcome-section { margin-bottom: 1.5rem; }
.light-welcome-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem; }
.light-welcome-header h1 { font-size: 2.2rem; font-weight: bold; color: #1e293b; margin: 0; }
.light-wave-emoji { animation: lightWave 2s ease-in-out infinite; }
@keyframes lightWave { 0%, 100% { transform: rotate(0deg); } 25% { transform: rotate(20deg); } 75% { transform: rotate(-10deg); } }
.light-welcome-actions { display: flex; align-items: center; gap: 1rem; }
.light-action-button, .light-theme-toggle-button {
  position: relative; background: linear-gradient(135deg, #ffffff 0%, #fdf2f8 100%);
  border: 2px solid transparent; background-clip: padding-box; border-radius: 50%;
  width: 46px; height: 46px; display: flex; align-items: center; justify-content: center;
  cursor: pointer; transition: all 0.3s ease; box-shadow: 0 4px 12px rgba(0,0,0,0.1); font-size: 1.1rem;
}
.light-action-button:hover, .light-theme-toggle-button:hover { transform: translateY(-2px); background: linear-gradient(45deg, #ec4899, #8b5cf6); color: white; }
.light-user-avatar-small {
  width: 46px; height: 46px; border-radius: 50%;
  background: linear-gradient(45deg, #ec4899, #8b5cf6);
  display: flex; align-items: center; justify-content: center;
  color: white; font-weight: bold; box-shadow: 0 4px 12px rgba(236,72,153,0.3);
}
.light-dashboard-grid { display: grid; grid-template-columns: 2fr 1fr; gap: 2rem; margin-bottom: 2rem; }
.light-services-section, .light-activity-section {
  background: linear-gradient(135deg, #ffffff 0%, #fdf2f8 100%);
  border: 1px solid #e2e8f0; border-radius: 16px; padding: 2rem;
  box-shadow: 0 4px 12px rgba(0,0,0,0.08);
}
.light-activity-list { display: flex; flex-direction: column; gap: 1rem; }
.light-activity-item {
  display: flex; align-items: center; gap: 1rem; padding: 1rem;
  background: rgba(255,255,255,0.8); border: 1px solid #e2e8f0; border-radius: 12px; transition: all 0.3s ease;
}
.light-activity-item:hover { transform: translateY(-2px); box-shadow: 0 8px 20px rgba(236,72,153,0.1); }
.light-search-filter-container {
  display: flex; justify-content: space-between; align-items: center;
  margin-bottom: 1.5rem; gap: 1rem; padding: 1rem 1.25rem;
  background: rgba(255,255,255,0.8); border-radius: 14px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05); border: 1px solid #e2e8f0;
}
.light-search-container { position: relative; flex: 1; max-width: 400px; }
.light-search-input {
  width: 100%; padding: 0.7rem 1rem 0.7rem 3rem; border: 2px solid #e2e8f0;
  border-radius: 10px; background: #fff; color: #1e293b; font-size: 0.95rem; transition: all 0.3s ease;
  box-sizing: border-box;
}
.light-search-input:focus { outline: none; border-color: #ec4899; box-shadow: 0 0 0 3px rgba(236,72,153,0.1); }
.light-section-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; }
.light-section-header h2 { font-size: 1.4rem; font-weight: bold; color: #1e293b; margin: 0; }
.light-section-action {
  display: flex; align-items: center; gap: 0.5rem; padding: 0.65rem 1.25rem;
  background: linear-gradient(45deg, #ec4899, #8b5cf6); color: white; border: none;
  border-radius: 10px; cursor: pointer; transition: all 0.3s ease; font-weight: 600; font-size: 0.9rem;
  box-shadow: 0 4px 12px rgba(236,72,153,0.3);
}
.light-section-action:hover { transform: translateY(-2px); box-shadow: 0 8px 20px rgba(236,72,153,0.4); }
.light-users-table-container { border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden; }
.light-users-table { width: 100%; border-collapse: collapse; }
.light-users-table th {
  background: linear-gradient(135deg, #f8fafc 0%, #fdf2f8 100%);
  color: #1e293b; font-weight: 600; padding: 0.9rem 1rem; text-align: left;
  border-bottom: 2px solid #e2e8f0; transition: all 0.2s ease;
}
.light-users-table td { padding: 0.9rem 1rem; border-bottom: 1px solid #e2e8f0; vertical-align: middle; }
.light-users-table tbody tr:hover { background: linear-gradient(90deg, rgba(236,72,153,0.04), rgba(139,92,246,0.04)); }
.light-users-table tbody tr:last-child td { border-bottom: none; }
.light-user-cell { display: flex; align-items: center; gap: 0.75rem; }
.light-user-avatar-mini {
  width: 34px; height: 34px; border-radius: 50%;
  background: linear-gradient(45deg, #ec4899, #8b5cf6);
  display: flex; align-items: center; justify-content: center;
  color: white; font-weight: bold; font-size: 0.85rem; flex-shrink: 0;
}
.light-modal-header {
  display: flex; justify-content: space-between; align-items: center;
  padding: 1.25rem 1.5rem; border-bottom: 1px solid #e2e8f0;
  background: linear-gradient(135deg, #ffffff 0%, #fdf2f8 100%);
}
.light-modal-header h3 { margin: 0; color: #1e293b; font-size: 1.1rem; font-weight: 600; }
.light-close-modal {
  background: none; border: none; font-size: 1.5rem; cursor: pointer;
  color: #64748b; padding: 0.4rem 0.6rem; border-radius: 8px; transition: all 0.2s ease; line-height: 1;
}
.light-close-modal:hover { background: rgba(236,72,153,0.1); color: #ec4899; }
.light-form-group { margin-bottom: 1.25rem; }
.light-form-group label { display: block; margin-bottom: 6px; color: #1e293b; font-weight: 500; font-size: 0.875rem; }
.light-cancel-button {
  padding: 0.65rem 1.25rem; background: #f1f5f9; color: #64748b;
  border: 2px solid #e2e8f0; border-radius: 10px; cursor: pointer; transition: all 0.2s ease; font-weight: 500;
}
.light-cancel-button:hover { background: #e2e8f0; }
.light-download-button {
  padding: 0.65rem 1.25rem; background: linear-gradient(45deg, #ec4899, #8b5cf6); color: white;
  border: none; border-radius: 10px; cursor: pointer; transition: all 0.2s ease; font-weight: 600;
  box-shadow: 0 4px 12px rgba(236,72,153,0.3);
}
.light-download-button:hover { transform: translateY(-1px); box-shadow: 0 6px 16px rgba(236,72,153,0.4); }

.theme-toggle-button {
  background: linear-gradient(135deg, #2d3748 0%, #4a5568 100%); border: none;
  border-radius: 50%; width: 46px; height: 46px;
  display: flex; align-items: center; justify-content: center;
  cursor: pointer; transition: all 0.3s ease; font-size: 1.1rem; color: #e2e8f0;
  box-shadow: 0 4px 12px rgba(0,0,0,0.3);
}
.theme-toggle-button:hover { transform: translateY(-2px); background: linear-gradient(45deg, #ec4899, #8b5cf6); }

@media (max-width: 1024px) {
  .sp-stats-row { grid-template-columns: repeat(2, 1fr); }
}
@media (max-width: 768px) {
  .light-mobile-header { display: flex; }
  .light-sidebar { transform: translateX(-100%); }
  .light-sidebar.open { transform: translateX(0); }
  .light-close-sidebar { display: block; }
  .light-main-content { margin-left: 0; padding: 1rem; }
  .light-welcome-header { flex-direction: column; align-items: flex-start; gap: 1rem; }
  .light-welcome-header h1 { font-size: 1.8rem; }
  .light-dashboard-grid { grid-template-columns: 1fr; }
  .sp-stats-row { grid-template-columns: repeat(2, 1fr); }
  .sp-roles-grid { grid-template-columns: 1fr; }
}
@media (max-width: 480px) {
  .sp-stats-row { grid-template-columns: 1fr; }
  .light-users-table th, .light-users-table td { padding: 0.6rem 0.5rem; font-size: 0.8rem; }
}
* { transition: background-color 0.3s ease, border-color 0.3s ease, color 0.3s ease; }
`}</style>
    </div>
  )
}

export default SettingsPage
