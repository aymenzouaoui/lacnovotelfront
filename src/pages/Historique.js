"use client"

import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import jsPDF from "jspdf"
import "./Dashboard.css"
import "./DashboardLight.css"
import API from "../services/api"

const Historique = () => {
  const navigate = useNavigate()
  const [user, setUser] = useState({ username: "", email: "" })
  const [isLoading, setIsLoading] = useState(true)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [currentTime, setCurrentTime] = useState(new Date())
  const [notifications, setNotifications] = useState([])
  const [filteredNotifications, setFilteredNotifications] = useState([])
  const [fromDate, setFromDate] = useState("")
  const [toDate, setToDate] = useState("")
  const [selectedService, setSelectedService] = useState("")

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
          : all.filter((n) => !n.service || userRoles.includes(n.service))

        const sorted = filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        setNotifications(sorted)
        setFilteredNotifications(sorted)
      })
      .catch((err) => console.error("Notifications fetch error", err))
  }, [user])

  const formatDate = (date) => {
    const options = { weekday: "long", day: "numeric", month: "long", year: "numeric" }
    return date.toLocaleDateString("fr-FR", options)
  }

  const formatTime = (date) => {
    return date.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })
  }

  const handleDeleteNotification = async (id) => {
    try {
      await API.delete(`/notifications/${id}`)
      setNotifications((prev) => prev.filter((n) => n._id !== id))
      setFilteredNotifications((prev) => prev.filter((n) => n._id !== id))
    } catch (err) {
      console.error("Delete notification error:", err)
      alert("Impossible de supprimer la notification.")
    }
  }

  const handleFilter = () => {
    let filtered = notifications

    if (fromDate || toDate) {
      filtered = filtered.filter((notif) => {
        const notifDate = new Date(notif.createdAt)
        const from = fromDate ? new Date(fromDate) : new Date("1900-01-01")
        const to = toDate ? new Date(toDate + "T23:59:59") : new Date("2100-12-31")
        return notifDate >= from && notifDate <= to
      })
    }

    if (selectedService) {
      filtered = filtered.filter((notif) => notif.service === selectedService)
    }

    setFilteredNotifications(filtered)
  }

  const clearFilters = () => {
    setFromDate("")
    setToDate("")
    setSelectedService("")
    setFilteredNotifications(notifications)
  }

  const downloadPDF = () => {
    const doc = new jsPDF()

    doc.setFontSize(20)
    doc.setTextColor(67, 97, 238) // #4361EE
    doc.text("Historique des Notifications", 20, 20)

    doc.setFontSize(12)
    doc.setTextColor(0, 0, 0)
    doc.text(`Généré le: ${new Date().toLocaleDateString("fr-FR")}`, 20, 30)
    doc.text(`Utilisateur: ${user.username}`, 20, 40)

    let yPosition = 50
    if (fromDate || toDate || selectedService) {
      const filterText = `Période: ${fromDate || "Début"} - ${toDate || "Fin"}${selectedService ? ` | Service: ${selectedService}` : ""}`
      doc.text(filterText, 20, yPosition)
      yPosition += 10
    }

    yPosition += 10
    doc.setFontSize(10)
    doc.setTextColor(67, 97, 238)
    doc.setFont(undefined, "bold")

    doc.text("#", 20, yPosition)
    doc.text("Description", 35, yPosition)
    doc.text("Service", 120, yPosition)
    doc.text("Date", 150, yPosition)
    doc.text("Heure", 180, yPosition)

    doc.setDrawColor(67, 97, 238)
    doc.line(20, yPosition + 2, 200, yPosition + 2)

    yPosition += 10
    doc.setFont(undefined, "normal")
    doc.setTextColor(0, 0, 0)

    filteredNotifications.forEach((notif, index) => {
      if (yPosition > 270) {
        doc.addPage()
        yPosition = 20
      }

      const description = notif.description || "N/A"
      const truncatedDesc = description.length > 35 ? description.substring(0, 32) + "..." : description

      doc.text((index + 1).toString(), 20, yPosition)
      doc.text(truncatedDesc, 35, yPosition)
      doc.text(notif.service || "Général", 120, yPosition)
      doc.text(new Date(notif.createdAt).toLocaleDateString("fr-FR"), 150, yPosition)
      doc.text(
        new Date(notif.createdAt).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" }),
        180,
        yPosition,
      )

      yPosition += 8
    })

    const pageCount = doc.internal.getNumberOfPages()
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i)
      doc.setFontSize(8)
      doc.setTextColor(128, 128, 128)
      doc.text(`© ${new Date().getFullYear()} Novotel Tunis - Créé par ITBAFA`, 20, doc.internal.pageSize.height - 10)
      doc.text(`Page ${i} sur ${pageCount}`, doc.internal.pageSize.width - 40, doc.internal.pageSize.height - 10)
    }

    doc.save(`historique-notifications-${new Date().toISOString().split("T")[0]}.pdf`)
  }

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen)
  }

  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    navigate("/")
  }

  const getUniqueServices = () => {
    const services = notifications.map((notif) => notif.service).filter((service) => service && service.trim() !== "")
    return [...new Set(services)].sort()
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
              <a href="/settings" onClick={() => navigate("/settings")}>
                <span className={isDarkMode ? "nav-icon" : "light-nav-icon"}>⚙️</span>
                <span>Paramètres</span>
              </a>
            </li>
            <li>
              <a href="/statistiques" onClick={() => navigate("/statistiques")}>
                <span className={isDarkMode ? "nav-icon" : "light-nav-icon"}>📊</span>
                <span>Statistiques</span>
              </a>
            </li>
            <li className="active">
              <a href="#historique">
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
              Historique des notifications <span className={isDarkMode ? "wave-emoji" : "light-wave-emoji"}>📋</span>
            </h1>
            <div className={isDarkMode ? "welcome-actions" : "light-welcome-actions"}>
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
          <p>Consultez et gérez l'historique de toutes vos notifications</p>
        </div>

        <div className={isDarkMode ? "services-section" : "light-services-section"} style={{ marginBottom: "20px" }}>
          <div className={isDarkMode ? "section-header" : "light-section-header"}>
            <h2>Filtres</h2>
          </div>
          <div
            style={{
              display: "flex",
              gap: "15px",
              alignItems: "end",
              flexWrap: "wrap",
              padding: "20px",
              backgroundColor: isDarkMode ? "#2a2a2a" : "#f8f9fa",
              borderRadius: "10px",
              marginBottom: "20px",
            }}
          >
            <div style={{ display: "flex", flexDirection: "column", gap: "5px", minWidth: "140px" }}>
              <label style={{ color: isDarkMode ? "#fff" : "#333", fontSize: "14px", fontWeight: "500" }}>Du:</label>
              <input
                type="date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                style={{
                  padding: "8px 12px",
                  borderRadius: "6px",
                  border: isDarkMode ? "1px solid #444" : "1px solid #ddd",
                  backgroundColor: isDarkMode ? "#333" : "#fff",
                  color: isDarkMode ? "#fff" : "#333",
                  fontSize: "14px",
                }}
              />
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "5px", minWidth: "140px" }}>
              <label style={{ color: isDarkMode ? "#fff" : "#333", fontSize: "14px", fontWeight: "500" }}>Au:</label>
              <input
                type="date"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
                style={{
                  padding: "8px 12px",
                  borderRadius: "6px",
                  border: isDarkMode ? "1px solid #444" : "1px solid #ddd",
                  backgroundColor: isDarkMode ? "#333" : "#fff",
                  color: isDarkMode ? "#fff" : "#333",
                  fontSize: "14px",
                }}
              />
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "5px", minWidth: "140px" }}>
              <label style={{ color: isDarkMode ? "#fff" : "#333", fontSize: "14px", fontWeight: "500" }}>
                Service:
              </label>
              <select
                value={selectedService}
                onChange={(e) => setSelectedService(e.target.value)}
                style={{
                  padding: "8px 12px",
                  borderRadius: "6px",
                  border: isDarkMode ? "1px solid #444" : "1px solid #ddd",
                  backgroundColor: isDarkMode ? "#333" : "#fff",
                  color: isDarkMode ? "#fff" : "#333",
                  fontSize: "14px",
                  height: "40px",
                }}
              >
                <option value="">Tous les services</option>
                {getUniqueServices().map((service) => (
                  <option key={service} value={service}>
                    {service}
                  </option>
                ))}
              </select>
            </div>
            <button
              onClick={handleFilter}
              style={{
                padding: "8px 16px",
                backgroundColor: "#4361EE",
                color: "white",
                border: "none",
                borderRadius: "6px",
                cursor: "pointer",
                fontSize: "14px",
                fontWeight: "500",
                transition: "background-color 0.3s ease",
                height: "40px",
              }}
              onMouseEnter={(e) => (e.target.style.backgroundColor = "#3A0CA3")}
              onMouseLeave={(e) => (e.target.style.backgroundColor = "#4361EE")}
            >
              Filtrer
            </button>
            <button
              onClick={clearFilters}
              style={{
                padding: "8px 16px",
                backgroundColor: isDarkMode ? "#666" : "#6c757d",
                color: "white",
                border: "none",
                borderRadius: "6px",
                cursor: "pointer",
                fontSize: "14px",
                fontWeight: "500",
                transition: "background-color 0.3s ease",
                height: "40px",
              }}
              onMouseEnter={(e) => (e.target.style.backgroundColor = isDarkMode ? "#555" : "#5a6268")}
              onMouseLeave={(e) => (e.target.style.backgroundColor = isDarkMode ? "#666" : "#6c757d")}
            >
              Effacer
            </button>
          </div>
        </div>

        <div className={isDarkMode ? "services-section" : "light-services-section"}>
          <div className={isDarkMode ? "section-header" : "light-section-header"}>
            <h2>Notifications ({filteredNotifications.length})</h2>
            <div className={isDarkMode ? "section-actions" : "light-section-actions"}>
              <button
                onClick={downloadPDF}
                style={{
                  padding: "10px 20px",
                  backgroundColor: "#F72585",
                  color: "white",
                  border: "none",
                  borderRadius: "8px",
                  cursor: "pointer",
                  fontSize: "14px",
                  fontWeight: "500",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  transition: "background-color 0.3s ease",
                }}
                onMouseEnter={(e) => (e.target.style.backgroundColor = "#D61355")}
                onMouseLeave={(e) => (e.target.style.backgroundColor = "#F72585")}
              >
                📄 Télécharger PDF
              </button>
            </div>
          </div>

          {filteredNotifications.length === 0 ? (
            <div
              style={{
                textAlign: "center",
                padding: "40px",
                color: isDarkMode ? "#888" : "#666",
                backgroundColor: isDarkMode ? "#2a2a2a" : "#f8f9fa",
                borderRadius: "10px",
                fontSize: "16px",
              }}
            >
              Aucune notification trouvée pour cette période
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {filteredNotifications.map((notif) => (
                <div
                  key={notif._id}
                  style={{
                    position: "relative",
                    padding: "15px 20px",
                    backgroundColor: isDarkMode ? "#2a2a2a" : "#fff",
                    borderRadius: "10px",
                    border: isDarkMode ? "1px solid #444" : "1px solid #e0e0e0",
                    boxShadow: isDarkMode ? "0 2px 4px rgba(0,0,0,0.3)" : "0 2px 4px rgba(0,0,0,0.1)",
                    transition: "transform 0.2s ease, box-shadow 0.2s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-2px)"
                    e.currentTarget.style.boxShadow = isDarkMode
                      ? "0 4px 8px rgba(0,0,0,0.4)"
                      : "0 4px 8px rgba(0,0,0,0.15)"
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)"
                    e.currentTarget.style.boxShadow = isDarkMode
                      ? "0 2px 4px rgba(0,0,0,0.3)"
                      : "0 2px 4px rgba(0,0,0,0.1)"
                  }}
                >
                  <button
                    onClick={() => handleDeleteNotification(notif._id)}
                    style={{
                      position: "absolute",
                      top: "10px",
                      right: "10px",
                      background: "transparent",
                      border: "none",
                      color: "#F72585",
                      fontWeight: "bold",
                      cursor: "pointer",
                      fontSize: "18px",
                      width: "24px",
                      height: "24px",
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      transition: "background-color 0.2s ease",
                    }}
                    onMouseEnter={(e) => (e.target.style.backgroundColor = isDarkMode ? "#444" : "#f0f0f0")}
                    onMouseLeave={(e) => (e.target.style.backgroundColor = "transparent")}
                    title="Supprimer la notification"
                  >
                    ×
                  </button>

                  <div style={{ paddingRight: "30px" }}>
                    <div
                      style={{
                        color: isDarkMode ? "#fff" : "#333",
                        fontSize: "16px",
                        fontWeight: "500",
                        marginBottom: "8px",
                        lineHeight: "1.6",
                        whiteSpace: "normal",
                        overflow: "visible",
                        textOverflow: "clip",
                        wordWrap: "break-word",
                        wordBreak: "break-word",
                        maxWidth: "none",
                        width: "100%",
                        minHeight: "40px",
                        display: "-webkit-box",
                        WebkitLineClamp: "3",
                        WebkitBoxOrient: "vertical",
                        overflow: "visible",
                      }}
                    >
                      {notif.description}
                    </div>

                    <div style={{ display: "flex", gap: "15px", alignItems: "center", flexWrap: "wrap" }}>
                      {notif.service && (
                        <span
                          style={{
                            backgroundColor: "#4361EE",
                            color: "white",
                            padding: "4px 8px",
                            borderRadius: "12px",
                            fontSize: "12px",
                            fontWeight: "500",
                          }}
                        >
                          {notif.service}
                        </span>
                      )}

                      <span
                        style={{
                          color: isDarkMode ? "#888" : "#666",
                          fontSize: "14px",
                        }}
                      >
                        📅 {new Date(notif.createdAt).toLocaleDateString("fr-FR")}
                      </span>

                      <span
                        style={{
                          color: isDarkMode ? "#888" : "#666",
                          fontSize: "14px",
                        }}
                      >
                        🕒{" "}
                        {new Date(notif.createdAt).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

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
          © {new Date().getFullYear()} Novotel Tunis. Tous droits réservés.
          <br />
          Créé par{" "}
          <a href="https://www.itbafa.com" target="_blank" rel="noopener noreferrer">
            ITBAFA
          </a>
        </p>
      </div>
    </div>
  )
}

export default Historique
