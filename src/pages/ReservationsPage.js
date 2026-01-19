"use client"

import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import "./ReservationsPage.css"
import API from "../services/api"

const ReservationsPage = () => {
  const navigate = useNavigate()
  const [user, setUser] = useState({ username: "", email: "" })
  const [isLoading, setIsLoading] = useState(true)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [currentTime, setCurrentTime] = useState(new Date())
  const [reservations, setReservations] = useState([])
  const [allowedServiceTabs, setAllowedServiceTabs] = useState([])
  const [showEditModal, setShowEditModal] = useState(false)
  const [editingReservation, setEditingReservation] = useState(null)
  const [newDate, setNewDate] = useState("")

  const [activeServiceTab, setActiveServiceTab] = useState("") // no default
  const [activeStatusTab, setActiveStatusTab] = useState("pending")

  // Theme state with localStorage initialization
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem("theme")
    return savedTheme ? savedTheme === "dark" : true
  })

  const SERVICE_MAP = {
    restaurant: "restaurant",
    terrassepiscine: "terrassepiscine",
    seminaire: "seminaire",
    spa: "spa",
  }

  // First load user and compute allowed service tabs
  useEffect(() => {
    const token = localStorage.getItem("token")
    if (!token) navigate("/")

    const userData = JSON.parse(localStorage.getItem("user") || '{"username":"test","email":"test@gmail.com"}')
    setUser(userData)

    const rawRoles = Array.isArray(userData.role) ? userData.role : [userData.role]
    const roles = rawRoles.filter(Boolean)

    const allowedTabs = roles.includes("admin")
      ? Object.values(SERVICE_MAP)
      : roles.map((r) => SERVICE_MAP[r.toLowerCase()]).filter(Boolean)

    setAllowedServiceTabs(allowedTabs)

    // ✅ only set active tab if not already set and we have allowed tabs
    if (allowedTabs.length > 0 && !activeServiceTab) {
      setActiveServiceTab(allowedTabs[0])
    }

    const loadTimer = setTimeout(() => setIsLoading(false), 800)
    const timer = setInterval(() => setCurrentTime(new Date()), 60000)

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

  // Trigger fetch whenever tab values change (cleanly separated)
  useEffect(() => {
    if (activeServiceTab && activeStatusTab) {
      fetchReservations(activeServiceTab, activeStatusTab)
    }
  }, [activeServiceTab, activeStatusTab])

  const fetchReservations = (service, status) => {
    API.get(`/reservations?service=${service}&status=${status}`)
      .then((res) => {
        setReservations(res.data || [])
      })
      .catch((err) => console.error("Reservation fetch error", err))
  }

  const updateStatus = (id, newStatus) => {
    API.put(`/reservations/${id}`, { status: newStatus })
      .then(() => {
        // Refresh the list after update
        fetchReservations(activeServiceTab, activeStatusTab)
      })
      .catch((err) => {
        console.error("Failed to update reservation status", err)
        alert("Erreur lors de la mise à jour du statut")
      })
  }

  const formatDate = (date) => {
    const options = { weekday: "long", day: "numeric", month: "long", year: "numeric" }
    return new Date(date).toLocaleDateString("fr-FR", options)
  }

  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "#FFD166" // Yellow
      case "confirmed":
        return "#4ECDC4" // Green
      case "cancelled":
        return "#FF6B6B" // Red
      default:
        return "#64748b" // Default gray
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    navigate("/")
  }

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen)
  }

  const handleServiceTabChange = (service) => {
    setActiveServiceTab(service)
  }

  const handleStatusTabChange = (status) => {
    setActiveStatusTab(status)
  }

  // Filter reservations based on active tabs
  const filteredReservations = reservations.filter(
    (reservation) => reservation.service === activeServiceTab && reservation.status === activeStatusTab,
  )

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
            <li className="active">
              <a href="#reservations">
                <span className={isDarkMode ? "nav-icon" : "light-nav-icon"}>📅</span>
                <span>Réservations</span>
              </a>
            </li>
            <li>
              <a href="#profile" onClick={() => navigate("/profile")}>
                <span className={isDarkMode ? "nav-icon" : "light-nav-icon"}>👤</span>
                <span>Mon profil</span>
              </a>
            </li>
            <li>
              <a href="/settings" onClick={() => navigate("/settings")}>
                <span className={isDarkMode ? "nav-icon" : "light-nav-icon"}>⚙️</span>
                <span>Paramètres</span>
              </a>
            </li>
          </ul>
        </nav>

        <div className={isDarkMode ? "sidebar-footer" : "light-sidebar-footer"}>
          <button className={isDarkMode ? "logout-button" : "light-logout-button"} onClick={handleLogout}>
            <span className={isDarkMode ? "nav-icon" : "light-nav-icon"}>🚪</span>
            <span>Déconnexion</span>
          </button>
        </div>
      </div>

      <div className={isDarkMode ? "main-content" : "light-main-content"}>
        <div className={isDarkMode ? "welcome-section" : "light-welcome-section"}>
          <div className={isDarkMode ? "welcome-header" : "light-welcome-header"}>
            <h1>
              Réservations <span className={isDarkMode ? "wave-emoji" : "light-wave-emoji"}>📅</span>
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
          <p>Gérez toutes vos réservations en un seul endroit</p>
        </div>

        <div className={isDarkMode ? "tab-container" : "light-tab-container"}>
          <div className={isDarkMode ? "service-tabs" : "light-service-tabs"}>
            {allowedServiceTabs.map((service) => (
              <button
                key={service}
                className={`${isDarkMode ? "tab-button" : "light-tab-button"} ${activeServiceTab === service ? (isDarkMode ? "active" : "light-active") : ""}`}
                onClick={() => handleServiceTabChange(service)}
              >
                {service}
              </button>
            ))}
          </div>

          <div className={isDarkMode ? "status-tabs" : "light-status-tabs"}>
            {["pending", "confirmed", "cancelled"].map((status) => (
              <button
                key={status}
                className={`${isDarkMode ? "tab-button" : "light-tab-button"} ${activeStatusTab === status ? (isDarkMode ? "active" : "light-active") : ""}`}
                style={{
                  "--status-color": getStatusColor(status),
                }}
                onClick={() => handleStatusTabChange(status)}
              >
                {status === "pending" && "En attente"}
                {status === "confirmed" && "Confirmé"}
                {status === "cancelled" && "Annulé"}
              </button>
            ))}
          </div>
        </div>

        <div className={isDarkMode ? "reservations-container" : "light-reservations-container"}>
          {filteredReservations.length > 0 ? (
            filteredReservations.map((reservation) => (
              <div
                key={reservation.id}
                className={isDarkMode ? "reservation-card" : "light-reservation-card"}
                style={{ "--card-color": getStatusColor(reservation.status) }}
              >
                <div className={isDarkMode ? "reservation-header" : "light-reservation-header"}>
                  <div className={isDarkMode ? "reservation-name" : "light-reservation-name"}>{reservation.name}</div>
                  <div
                    className={isDarkMode ? "reservation-status" : "light-reservation-status"}
                    style={{ backgroundColor: getStatusColor(reservation.status) }}
                  >
                    {reservation.status === "pending" && "En attente"}
                    {reservation.status === "confirmed" && "Confirmé"}
                    {reservation.status === "cancelled" && "Annulé"}
                  </div>
                </div>

                <div className={isDarkMode ? "reservation-details" : "light-reservation-details"}>
                  <div className={isDarkMode ? "detail-group" : "light-detail-group"}>
                    <div className={isDarkMode ? "detail-label" : "light-detail-label"}>Email:</div>
                    <div className={isDarkMode ? "detail-value" : "light-detail-value"}>{reservation.email}</div>
                  </div>

                  <div className={isDarkMode ? "detail-group" : "light-detail-group"}>
                    <div className={isDarkMode ? "detail-label" : "light-detail-label"}>Téléphone:</div>
                    <div className={isDarkMode ? "detail-value" : "light-detail-value"}>{reservation.phoneNumber}</div>
                  </div>

                  <div className={isDarkMode ? "detail-group" : "light-detail-group"}>
                    <div className={isDarkMode ? "detail-label" : "light-detail-label"}>Date:</div>
                    <div className={isDarkMode ? "detail-value" : "light-detail-value"}>
                      {formatDate(new Date(reservation.from))}
                    </div>
                  </div>

                  <div className={isDarkMode ? "detail-group" : "light-detail-group"}>
                    <div className={isDarkMode ? "detail-label" : "light-detail-label"}>Horaire:</div>
                    <div className={isDarkMode ? "detail-value" : "light-detail-value"}>
                      {formatTime(new Date(reservation.from))}
                    </div>
                  </div>

                  <div className={isDarkMode ? "detail-group" : "light-detail-group"}>
                    <div className={isDarkMode ? "detail-label" : "light-detail-label"}>Personnes:</div>
                    <div className={isDarkMode ? "detail-value" : "light-detail-value"}>{reservation.people}</div>
                  </div>

                  {reservation.optionalMail && (
                    <div className={isDarkMode ? "detail-group" : "light-detail-group"}>
                      <div className={isDarkMode ? "detail-label" : "light-detail-label"}>Email secondaire:</div>
                      <div className={isDarkMode ? "detail-value" : "light-detail-value"}>
                        {reservation.optionalMail}
                      </div>
                    </div>
                  )}

                  <div className={isDarkMode ? "detail-group" : "light-detail-group"}>
                    <div className={isDarkMode ? "detail-label" : "light-detail-label"}>Service:</div>
                    <div className={isDarkMode ? "detail-value" : "light-detail-value"}>{reservation.service}</div>
                  </div>

                  <div className={isDarkMode ? "detail-group" : "light-detail-group"}>
                    <div className={isDarkMode ? "detail-label" : "light-detail-label"}>Détails:</div>
                    <div className={isDarkMode ? "detail-value" : "light-detail-value"}>
                      {reservation.serviceDetails}
                    </div>
                  </div>

                  <div className={isDarkMode ? "detail-group" : "light-detail-group"}>
                    <div className={isDarkMode ? "detail-label" : "light-detail-label"}>Chambre:</div>
                    <div className={isDarkMode ? "detail-value" : "light-detail-value"}>{reservation.room}</div>
                  </div>
                </div>

                <div className={isDarkMode ? "reservation-actions" : "light-reservation-actions"}>
                  {reservation.status === "pending" && (
                    <>
                      <button
                        className={isDarkMode ? "action-button confirm" : "light-action-button light-confirm"}
                        onClick={() => updateStatus(reservation._id, "confirmed")}
                      >
                        ✅
                      </button>
                      <button
                        className={isDarkMode ? "action-button cancel" : "light-action-button light-cancel"}
                        onClick={() => updateStatus(reservation._id, "cancelled")}
                      >
                        ❌
                      </button>
                    </>
                  )}
                  {reservation.status === "confirmed" && (
                    <button
                      className={isDarkMode ? "action-button cancel" : "light-action-button light-cancel"}
                      onClick={() => updateStatus(reservation._id, "cancelled")}
                    >
                      ❌
                    </button>
                  )}
                  {reservation.status === "cancelled" && (
                    <button
                      className={isDarkMode ? "action-button restore" : "light-action-button light-restore"}
                      onClick={() => updateStatus(reservation._id, "pending")}
                    >
                      ♻️
                    </button>
                  )}
                  <button
                    className={isDarkMode ? "action-button edit" : "light-action-button light-edit"}
                    onClick={() => {
                      setEditingReservation(reservation)
                      setNewDate(reservation.from?.slice(0, 16)) // Pre-fill with ISO string (datetime-local)
                      setShowEditModal(true)
                    }}
                  >
                    ✏️
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className={isDarkMode ? "no-reservations" : "light-no-reservations"}>
              <div className="no-data-icon">📅</div>
              <h3>Aucune réservation trouvée</h3>
              <p>
                Il n'y a pas de réservations {activeStatusTab} pour {activeServiceTab}
              </p>
            </div>
          )}
        </div>
      </div>

      {showEditModal && editingReservation && (
        <div className={isDarkMode ? "modal-overlay" : "light-modal-overlay"} onClick={() => setShowEditModal(false)}>
          <div
            className={isDarkMode ? "modal-container" : "light-modal-container"}
            onClick={(e) => e.stopPropagation()}
          >
            <h3>Modifier la date de réservation</h3>
            <input
              type="datetime-local"
              value={newDate}
              onChange={(e) => setNewDate(e.target.value)}
              className={isDarkMode ? "modal-input" : "light-modal-input"}
            />
            <div className={isDarkMode ? "modal-actions" : "light-modal-actions"}>
              <button
                className={isDarkMode ? "confirm" : "light-confirm"}
                onClick={() => {
                  API.put(`/reservations/${editingReservation._id}`, {
                    from: newDate,
                    status: "confirmed",
                  })
                    .then(() => {
                      fetchReservations(activeServiceTab, activeStatusTab)
                      setShowEditModal(false)
                      setEditingReservation(null)
                    })
                    .catch(() => alert("Erreur lors de la mise à jour"))
                }}
              >
                ✅ Confirmer
              </button>
              <button className={isDarkMode ? "cancel" : "light-cancel"} onClick={() => setShowEditModal(false)}>
                ❌ Annuler
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
/* Light Mode Styles for Reservations Page */
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

.light-tab-container {
  background: linear-gradient(135deg, #ffffff 0%, #fdf2f8 100%);
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  padding: 1.5rem;
  margin-bottom: 2rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.light-service-tabs, .light-status-tabs {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
  flex-wrap: wrap;
}

.light-status-tabs {
  margin-bottom: 0;
}

.light-tab-button {
  padding: 0.75rem 1.5rem;
  background: linear-gradient(135deg, #ffffff 0%, #f1f5f9 100%);
  color: #64748b;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 500;
  text-transform: capitalize;
}

.light-tab-button:hover {
  background: linear-gradient(45deg, #ec4899, #8b5cf6);
  color: white;
  border-color: transparent;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(236, 72, 153, 0.3);
}

.light-tab-button.light-active {
  background: linear-gradient(45deg, #ec4899, #8b5cf6);
  color: white;
  border-color: transparent;
  box-shadow: 0 4px 12px rgba(236, 72, 153, 0.3);
}

.light-reservations-container {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.light-reservation-card {
  background: #fff;
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  transition: transform 0.2s ease-in-out;
  border-left: 6px solid var(--card-color, #64748b);
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 100%;
  min-height: auto;
}

.light-reservation-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.light-reservation-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid #e2e8f0;
}

.light-reservation-name {
  font-size: 1.5rem;
  font-weight: 600;
  color: #1e293b;
}

.light-reservation-status {
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.875rem;
  font-weight: 500;
  color: #fff;
}

.light-reservation-details {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
}

.light-detail-group {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
  background-color: #f9fafb;
}

.light-detail-label {
  font-size: 0.875rem;
  font-weight: 600;
  color: #374151;
  min-width: 100px;
}

.light-detail-value {
  font-size: 0.875rem;
  color: #6b7280;
  text-align: right;
  word-break: break-word;
  flex: 1;
}

.light-reservation-actions {
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #e2e8f0;
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
}

.light-action-button {
  padding: 0.5rem 0.75rem;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: #fff;
  border: none;
  cursor: pointer;
  transition: background-color 0.2s ease-in-out;
}

.light-action-button.light-confirm {
  background-color: #16a34a;
}

.light-action-button.light-confirm:hover {
  background-color: #15803d;
}

.light-action-button.light-cancel {
  background-color: #dc2626;
}

.light-action-button.light-cancel:hover {
  background-color: #b91c1c;
}

.light-action-button.light-restore {
  background-color: #2563eb;
}

.light-action-button.light-restore:hover {
  background-color: #1e40af;
}

.light-action-button.light-edit {
  background-color: #ea580c;
}

.light-action-button.light-edit:hover {
  background-color: #d946ef;
}

.light-no-reservations {
  text-align: center;
  padding: 3rem 2rem;
  background: linear-gradient(135deg, #ffffff 0%, #fdf2f8 100%);
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.light-no-reservations h3 {
  color: #1e293b;
  margin-bottom: 0.5rem;
}

.light-no-reservations p {
  color: #64748b;
  margin-bottom: 2rem;
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
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
  max-width: 500px;
  width: 90%;
  padding: 2rem;
}

.light-modal-container h3 {
  color: #1e293b;
  font-size: 1.25rem;
  font-weight: 600;
  margin: 0 0 1.5rem 0;
}

.light-modal-input {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  background: #ffffff;
  color: #1e293b;
  font-size: 1rem;
  transition: all 0.3s ease;
  font-family: inherit;
  margin-bottom: 1.5rem;
}

.light-modal-input:focus {
  outline: none;
  border-color: #ec4899;
  box-shadow: 0 0 0 3px rgba(236, 72, 153, 0.1);
}

.light-modal-actions {
  display: flex;
  gap: 1rem;
}

.light-confirm {
  flex: 1;
  padding: 0.75rem 1.5rem;
  background: linear-gradient(45deg, #10b981, #059669);
  color: white;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 500;
  font-size: 1rem;
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
}

.light-confirm:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(16, 185, 129, 0.4);
}

.light-cancel {
  flex: 1;
  padding: 0.75rem 1.5rem;
  background: linear-gradient(45deg, #ef4444, #dc2626);
  color: white;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 500;
  font-size: 1rem;
  box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);
}

.light-cancel:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(239, 68, 68, 0.4);
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

.light-dashboard input[type="datetime-local"] {
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

  .light-service-tabs, .light-status-tabs {
    flex-direction: column;
  }

  .light-reservations-container {
    grid-template-columns: 1fr;
  }

  .light-modal-container {
    width: 95%;
    margin: 1rem;
  }

  .light-modal-actions {
    flex-direction: column;
  }
}

/* Enhanced focus states for accessibility */
.light-action-button:focus,
.light-theme-toggle-button:focus,
.light-tab-button:focus {
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

export default ReservationsPage
