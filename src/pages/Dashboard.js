"use client"

import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import QRCode from "qrcode"
import "./Dashboard.css"
import "./DashboardLight.css"
import API from "../services/api"

const Dashboard = () => {
  const navigate = useNavigate()
  const [qrCodeUrl, setQrCodeUrl] = useState("")
  const [showQrDialog, setShowQrDialog] = useState(false)
  const [user, setUser] = useState({ username: "", email: "" })
  const [isLoading, setIsLoading] = useState(true)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [activeService, setActiveService] = useState(null)
  const [currentTime, setCurrentTime] = useState(new Date())
  const [roomServiceCount, setRoomServiceCount] = useState(0)
  const [userCount, setUserCount] = useState(0)
  const [reservationCount, setReservationCount] = useState(0)
  const [notifications, setNotifications] = useState([])
  const [showNotifications, setShowNotifications] = useState(false)
  const [viewCount, setViewCount] = useState(0)

  // Theme state with localStorage initialization
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem("theme")
    return savedTheme ? savedTheme === "dark" : true
  })

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode)
  }

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (!token) navigate("/")

    const userData = JSON.parse(localStorage.getItem("user") || '{"username":"test","email":"test@gmail.com"}')
    setUser(userData)

    const loadTimer = setTimeout(() => setIsLoading(false), 800)
    const timer = setInterval(() => setCurrentTime(new Date()), 60000)

    // Axios-based API calls
    API.get("/roomservice-orders")
      .then((res) => {
        const pendingOrders = res.data.filter((order) => order.status === "pending")
        setRoomServiceCount(pendingOrders.length || 0)
      })
      .catch((err) => console.error("Room service fetch error", err))

    API.get("/users")
      .then((res) => setUserCount(res.data.length || 0))
      .catch((err) => console.error("User fetch error", err))

    console.log("Fetching view count...")

    API.get("/analytics/views")
      .then((res) => {
        console.log("GA response:", res)
        const views = res.data.views || 0
        console.log("Setting view count to:", views)
        setViewCount(views)
      })
      .catch((err) => {
        console.error("Views fetch error:", err)
      })

    return () => {
      clearTimeout(loadTimer)
      clearInterval(timer)
    }
  }, [navigate])

  useEffect(() => {
    if (!user || !user.role) return

    const rawUserRoles = Array.isArray(user.role) ? user.role : [user.role]
    const userRoles = rawUserRoles.filter(Boolean)

    API.get("/notifications")
      .then((res) => {
        const all = res.data || []

        const filtered = userRoles.includes("admin")
          ? all
          : all.filter((n) => !n.service || userRoles.includes(n.service)) // show if no service or service matches role

        setNotifications(filtered)
      })
      .catch((err) => console.error("Notifications fetch error", err))
  }, [user])

  useEffect(() => {
    if (!user || !user.role) return

    const rawUserRoles = Array.isArray(user.role) ? user.role : [user.role]
    const userRoles = rawUserRoles.filter(Boolean)

    API.get("/reservations")
      .then((res) => {
        const all = res.data || []
        const filtered = userRoles.includes("admin")
          ? all.filter((r) => r.status === "pending")
          : all.filter((r) => r.status === "pending" && userRoles.includes(r.service))

        setReservationCount(filtered.length)
        console.log("User roles:", userRoles)
        console.log("Filtered reservations:", filtered)
      })
      .catch((err) => console.error("Reservation fetch error", err))
  }, [user]) // 👈 re-run when `user` is set

  const formatDate = (date) => {
    const options = { weekday: "long", day: "numeric", month: "long", year: "numeric" }
    return date.toLocaleDateString("fr-FR", options)
  }

  const formatTime = (date) => {
    return date.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })
  }
  const sections = [
    {
      icon: "🍽️",
      title: "Restaurant Novotel",
      description: "Gérez vos restaurants",
      path: "/restaurants",
      color: "#F72585",
    },
    {
      icon: "🥤",
      title: "Bar",
      description: "Gérez votre carte des boissons",
      path: "/boissons",
      color: "#FFD166",
    },
    {
      icon: "🏷️",
      title: "Offres spéciales",
      description: "Gérez vos offres promotionnelles",
      path: "/offres",
      color: "#4361EE",
    },
    {
      icon: "🛎️",
      title: "Restauration en chambre",
      description: "Gérez vos services en chambre",
      path: "/roomservices",
      color: "#7209B7",
    },
    {
      icon: "🌆",
      title: "Terrasse Piscine",
      description: "Gérez votre Terrasse Piscine",
      path: "/terrasse-piscine",
      color: "#4CC9F0",
    },
    {
      icon: "🔑",
      title: "Meeting AT Novotel",
      description: "Gérez vos séminaires",
      path: "/seminaires",
      color: "#FF6B6B",
    },
    {
      icon: "💆",
      title: "IN BALANCE BY NOVOTEL",
      description: "Créez et modifiez vos espaces bien-être",
      path: "/spas",
      color: "#4ECDC4",
    },
    {
      icon: "🧰",
      title: "S'informer",
      description: "Gérez les services proposés",
      path: "/loisirs",
      color: "#8D99AE",
    },
        {
      icon: "📄",
      title: "Contenu des pages",
      description: "Gérez le contenu de vos pages",
      path: "/page-contents",
      color: "#7191c9ff",
    },
    {
      icon: "🛏️",
      title: "Chambres",
      description: "Gérez les types de chambres",
      path: "/chambres",
      color: "#9b59b6ff",
    },
           {
      icon: "❔",
      title: "Questionnaires",
      description: "Gérez vos questionnaires",
      path: "/questionnaires",
      color: "#1f3761ff",
    },
           {
      icon: "🧹",
      title: "Skip cleans",
      description: "Gérez vos skip cleans",
      path: "/skipcleans ",
      color: "#eebd9eff",
    },
  ]
      const rawUserRoles = Array.isArray(user.role) ? user.role : [user.role]
    const userRoles = rawUserRoles.filter(Boolean)
const filteredSections = sections.filter((section) => {
  if (section.title === "Questionnaires") {
    return userRoles.includes("admin") || userRoles.includes("questionnaire");
  }
  if (section.title === "Skip cleans") {
    return userRoles.includes("admin") || userRoles.includes("skip_clean");
  }
  return true; // show all other sections
});


  const stats = [
    { label: "Restauration en chambre", value: roomServiceCount.toString(), icon: "🍽️", color: "#FF6B6B" },
    { label: "Utilisateurs", value: userCount.toString(), icon: "👤", color: "#4ECDC4" },
    { label: "Réservations", value: reservationCount.toString(), icon: "📦", color: "#6A0572" },
    { label: "Vues", value: viewCount.toString(), icon: "👁️", color: "#FFD166" },
  ]

  const recentActivities = [
    { text: "Vous avez créé une nouvelle présentation", time: "Il y a 2 heures", icon: "🧾", color: "#FF6B6B" },
    { text: "Vous avez modifié le menu 'Été 2023'", time: "Hier", icon: "📋", color: "#4ECDC4" },
    { text: "Vous avez généré un QR code", time: "Il y a 2 jours", icon: "📱", color: "#FFD166" },
    { text: "Nouvelle réservation pour 'Séminaire Marketing'", time: "Il y a 3 jours", icon: "📌", color: "#6A0572" },
  ]

  const generateQR = async () => {
    try {
      setIsLoading(true)
      const qrData = "https://lac.novotel-tunis.com/Home"
      const url = await QRCode.toDataURL(qrData)
      setQrCodeUrl(url)
      setShowQrDialog(true)
      setIsLoading(false)
    } catch (err) {
      console.error("Error generating QR code:", err)
      alert("Impossible de générer le QR code")
      setIsLoading(false)
    }
  }

  const downloadQrCode = () => {
    const a = document.createElement("a")
    a.href = qrCodeUrl
    a.download = "qr_presentation.png"
    a.click()
    alert("QR Code téléchargé avec succès")
  }

  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    navigate("/")
  }
  const handleDeleteNotification = async (id) => {
    try {
      await API.delete(`/notifications/${id}`)
      setNotifications((prev) => prev.filter((n) => n._id !== id))
    } catch (err) {
      console.error("Delete notification error:", err)
      alert("Impossible de supprimer la notification.")
    }
  }

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen)
  }

  const handleServiceClick = (index, path) => {
    setActiveService(index)
    navigate(path)
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
    <div
      className={isDarkMode ? "dashboard" : "light-dashboard"}
      style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}
    >
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
            <li className="active">
              <a href="#dashboard">
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
              <a href="/settings" onClick={() => navigate("/settings")}>
                <span className={isDarkMode ? "nav-icon" : "light-nav-icon"}>⚙️</span>
                <span>Paramètres</span>
              </a>
            </li>
             
                       <li>
              <a href="#statistiques" onClick={() => navigate("/statistiques")}>
                <span className={isDarkMode ? "nav-icon" : "light-nav-icon"}>📊</span>
                <span>Statistiques</span>
              </a>
            </li>
            <li>
              <a href="#analytics" onClick={() => navigate("/analytics-stats")}>
                <span className={isDarkMode ? "nav-icon" : "light-nav-icon"}>👁️</span>
                <span>Vues GA4</span>
              </a>
            </li>
            <li>
              <a href="#historique" onClick={() => navigate("/historique")}>
                <span className={isDarkMode ? "nav-icon" : "light-nav-icon"}>📋</span>
                <span>Historique</span>
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
              Bienvenue, {user.username} <span className={isDarkMode ? "wave-emoji" : "light-wave-emoji"}>👋</span>
            </h1>
            <div className={isDarkMode ? "welcome-actions" : "light-welcome-actions"}>
              <button
                className={isDarkMode ? "action-button notifications" : "light-action-button light-notifications"}
                onClick={() => setShowNotifications(!showNotifications)}
              >
                <span className={isDarkMode ? "action-icon" : "light-action-icon"}>🔔</span>
                {notifications.length > 0 && (
                  <span className={isDarkMode ? "notification-badge" : "light-notification-badge"}>
                    {notifications.length}
                  </span>
                )}
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
          <p>Gérez vos modules en toute simplicité</p>
        </div>

        <div className={isDarkMode ? "stats-container" : "light-stats-container"}>
          {stats.map((stat, index) => {
            const isReservationCard = stat.label === "Réservations"
            const isNettoyageCard = stat.label === "Restauration en chambre"
            const isUtilisateursCard = stat.label === "Utilisateurs"
            const isViewsCard = stat.label === "Vues"
            const isClickable = isReservationCard || isNettoyageCard || isUtilisateursCard || isViewsCard

            return (
              <div
                key={index}
                className={isDarkMode ? "stat-card" : "light-stat-card"}
                style={{ "--card-color": stat.color, cursor: isClickable ? "pointer" : "default" }}
                onClick={() => {
                  if (isReservationCard) navigate("/reservations")
                  if (isNettoyageCard) navigate("/roomserviceorders")
                  if (isUtilisateursCard) navigate("/settings")
                  if (isViewsCard) navigate("/analytics-stats")
                }}
              >
                <div className={isDarkMode ? "stat-icon" : "light-stat-icon"}>{stat.icon}</div>
                <div className={isDarkMode ? "stat-info" : "light-stat-info"}>
                  <div className={isDarkMode ? "stat-value" : "light-stat-value"}>{stat.value}</div>
                  <div className={isDarkMode ? "stat-label" : "light-stat-label"}>{stat.label}</div>
                </div>
                <div className={isDarkMode ? "stat-graph" : "light-stat-graph"}>
                  <div
                    className={isDarkMode ? "graph-bar" : "light-graph-bar"}
                    style={{ height: `${Math.random() * 50 + 30}%` }}
                  ></div>
                  <div
                    className={isDarkMode ? "graph-bar" : "light-graph-bar"}
                    style={{ height: `${Math.random() * 50 + 30}%` }}
                  ></div>
                  <div
                    className={isDarkMode ? "graph-bar" : "light-graph-bar"}
                    style={{ height: `${Math.random() * 50 + 30}%` }}
                  ></div>
                  <div
                    className={isDarkMode ? "graph-bar" : "light-graph-bar"}
                    style={{ height: `${Math.random() * 50 + 30}%` }}
                  ></div>
                </div>
              </div>
            )
          })}
        </div>

        <div className={isDarkMode ? "dashboard-grid" : "light-dashboard-grid"}>
          <div className={isDarkMode ? "services-section" : "light-services-section"}>
            <div className={isDarkMode ? "section-header" : "light-section-header"}>
              <h2>Vos services</h2>
              <div className={isDarkMode ? "section-actions" : "light-section-actions"}></div>
            </div>
            <div className={isDarkMode ? "services-grid" : "light-services-grid"}>
              {filteredSections.map((service, index) => (
                <div
                  key={index}
                  className={`${isDarkMode ? "service-card" : "light-service-card"} ${activeService === index ? "active" : ""}`}
                  onClick={() => handleServiceClick(index, service.path)}
                  style={{ "--card-color": service.color }}
                >
                  <div className={isDarkMode ? "service-icon" : "light-service-icon"}>{service.icon}</div>
                  <div className={isDarkMode ? "service-content" : "light-service-content"}>
                    <h3 className={isDarkMode ? "service-title" : "light-service-title"}>{service.title}</h3>
                    {service.badge && (
                      <span className={isDarkMode ? "service-badge" : "light-service-badge"}>{service.badge}</span>
                    )}
                    <p className={isDarkMode ? "service-description" : "light-service-description"}>
                      {service.description}
                    </p>
                  </div>
                  <div className={isDarkMode ? "service-arrow" : "light-service-arrow"}>→</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <button
        className={isDarkMode ? "floating-qr-button" : "light-floating-qr-button"}
        onClick={generateQR}
        style={{
          position: "fixed",
          bottom: "20px",
          right: "20px",
          width: "60px",
          height: "60px",
          borderRadius: "50%",
          border: "none",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "24px",
          zIndex: 1000,
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.3)",
          backgroundColor: isDarkMode ? "#4361EE" : "#007bff",
          color: "white",
          transition: "all 0.3s ease",
        }}
        onMouseEnter={(e) => {
          e.target.style.transform = "scale(1.1)"
          e.target.style.backgroundColor = isDarkMode ? "#3A0CA3" : "#0056b3"
        }}
        onMouseLeave={(e) => {
          e.target.style.transform = "scale(1)"
          e.target.style.backgroundColor = isDarkMode ? "#4361EE" : "#007bff"
        }}
      >
        <span>📱</span>
      </button>

      {showQrDialog && (
        <div className={isDarkMode ? "modal-overlay" : "light-modal-overlay"} onClick={() => setShowQrDialog(false)}>
          <div
            className={isDarkMode ? "modal-container" : "light-modal-container"}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={isDarkMode ? "modal-header" : "light-modal-header"}>
              <h3>QR Code généré</h3>
              <button
                className={isDarkMode ? "close-modal" : "light-close-modal"}
                onClick={() => setShowQrDialog(false)}
              >
                ×
              </button>
            </div>
            <p className={isDarkMode ? "modal-description" : "light-modal-description"}>
              Scannez ce QR code pour accéder à votre présentation.
            </p>
            <div className={isDarkMode ? "qr-container" : "light-qr-container"}>
              {qrCodeUrl && (
                <img
                  src={qrCodeUrl || "/placeholder.svg"}
                  alt="QR Code"
                  className={isDarkMode ? "qr-image" : "light-qr-image"}
                />
              )}
            </div>
            <div className={isDarkMode ? "modal-actions" : "light-modal-actions"}>
              <button
                className={isDarkMode ? "cancel-button" : "light-cancel-button"}
                onClick={() => setShowQrDialog(false)}
              >
                Fermer
              </button>
              <button className={isDarkMode ? "download-button" : "light-download-button"} onClick={downloadQrCode}>
                Télécharger
              </button>
            </div>
          </div>
        </div>
      )}

      {showNotifications && (
        <div className={isDarkMode ? "notifications-popup" : "light-notifications-popup"}>
          <div className={isDarkMode ? "notifications-header" : "light-notifications-header"}>
            <span>Notifications</span>
            <button
              className={isDarkMode ? "close-notifications" : "light-close-notifications"}
              onClick={() => setShowNotifications(false)}
            >
              ×
            </button>
          </div>
          {notifications.length === 0 ? (
            <div className={isDarkMode ? "notification-item" : "light-notification-item"}>Aucune notification</div>
          ) : (
            notifications.map((notif) => (
              <div
                key={notif._id}
                className={isDarkMode ? "notification-item" : "light-notification-item"}
                style={{ position: "relative" }}
              >
                <span className={isDarkMode ? "notif-text" : "light-notif-text"}>{notif.description}</span>
                <span className={isDarkMode ? "notif-time" : "light-notif-time"}>
                  {new Date(notif.createdAt).toLocaleString()}
                </span>
                <button
                  onClick={() => handleDeleteNotification(notif._id)}
                  className={isDarkMode ? "delete-notif-button" : "light-delete-notif-button"}
                  aria-label="Supprimer la notification"
                  style={{
                    position: "absolute",
                    top: "5px",
                    right: "5px",
                    background: "transparent",
                    border: "none",
                    color: isDarkMode ? "#888" : "#666",
                    fontWeight: "bold",
                    cursor: "pointer",
                    fontSize: "16px",
                  }}
                >
                  ×
                </button>
              </div>
            ))
          )}
        </div>
      )}
      {/* Footer */}
      <div
        className={isDarkMode ? "copyright" : "light-copyright"}
        style={{
          textAlign: "center",
          padding: "15px 0",
          fontSize: "14px",
          color: isDarkMode ? "#fff" : "#333",
          backgroundColor: isDarkMode ? "#222" : "#f8f9fa",
          width: "100%",
        }}
      >
        <p>
          © {new Date().getFullYear()} Novotel Tunis Lac. Tous droits réservés.
          <br />
          Créé par{" "}
          <a href="https://www.itbafa.com" target="_blank" rel="noopener noreferrer">
            <img
              src={
                isDarkMode
                  ? "/images/itbafa_logo_white.png"
                  : "/images/itbafa_logo_dark.png"
              }
              alt="ITBAFA Logo"
              style={{ height: "20px", verticalAlign: "middle", marginLeft: "5px" }}
            />
          </a>
        </p>
      </div>
    </div>
  )
}

export default Dashboard
