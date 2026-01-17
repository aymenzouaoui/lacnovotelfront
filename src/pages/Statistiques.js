"use client"

import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import "./Dashboard.css"
import "./DashboardLight.css"
import API from "../services/api"
import jsPDF from "jspdf"

const Statistiques = () => {
  const navigate = useNavigate()
  const [user, setUser] = useState({ username: "", email: "" })
  const [isLoading, setIsLoading] = useState(true)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [currentTime, setCurrentTime] = useState(new Date())
  const [allReservations, setAllReservations] = useState([])
  const [filteredReservations, setFilteredReservations] = useState([])
  const [fromDate, setFromDate] = useState("")
  const [toDate, setToDate] = useState("")

  // Theme state with localStorage initialization
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem("theme")
    return savedTheme ? savedTheme === "dark" : true
  })

  useEffect(() => {
    const interval = setInterval(() => setCurrentTime(new Date()), 60000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (!token) {
      navigate("/")
      return
    }

    const userData = JSON.parse(localStorage.getItem("user") || '{"username":"Admin","email":"admin@example.com"}')
    setUser(userData)

    const loadTimer = setTimeout(() => setIsLoading(false), 800)

    fetchAllReservations()

    return () => {
      clearTimeout(loadTimer)
    }
  }, [navigate])

  const fetchAllReservations = () => {
    API.get("/reservations")
      .then((res) => {
        const reservations = res.data || []
        setAllReservations(reservations)
        setFilteredReservations(reservations)
      })
      .catch((err) => {
        console.error("Failed to fetch reservations", err)
        fetchReservationsFallback()
      })
  }

  const fetchReservationsFallback = async () => {
    const services = ["restaurant", "skylounge", "seminaire", "spa"]
    const statuses = ["pending", "confirmed", "cancelled"]
    let allReservations = []

    try {
      for (const service of services) {
        for (const status of statuses) {
          const res = await API.get(`/reservations?service=${service}&status=${status}`)
          allReservations = [...allReservations, ...(res.data || [])]
        }
      }
      const uniqueReservations = allReservations.filter(
        (reservation, index, self) => index === self.findIndex((r) => r._id === reservation._id),
      )
      setAllReservations(uniqueReservations)
      setFilteredReservations(uniqueReservations)
    } catch (err) {
      console.error("Failed to fetch reservations fallback", err)
    }
  }

  const filterByDate = () => {
    if (!fromDate || !toDate) {
      setFilteredReservations(allReservations)
      return
    }

    const filtered = allReservations.filter((reservation) => {
      const reservationDate = new Date(reservation.from)
      const from = new Date(fromDate)
      const to = new Date(toDate)
      return reservationDate >= from && reservationDate <= to
    })
    setFilteredReservations(filtered)
  }

  const clearFilter = () => {
    setFromDate("")
    setToDate("")
    setFilteredReservations(allReservations)
  }

  const getServiceStats = () => {
    const stats = {}
    filteredReservations.forEach((reservation) => {
      stats[reservation.service] = (stats[reservation.service] || 0) + 1
    })
    return stats
  }

  const getStatusStats = () => {
    const stats = {}
    filteredReservations.forEach((reservation) => {
      stats[reservation.status] = (stats[reservation.status] || 0) + 1
    })
    return stats
  }

  const getMonthlyStats = () => {
    const stats = {}
    filteredReservations.forEach((reservation) => {
      const date = new Date(reservation.from)
      const monthYear = `${date.getMonth() + 1}/${date.getFullYear()}`
      stats[monthYear] = (stats[monthYear] || 0) + 1
    })
    return stats
  }

  const getAveragePartySize = () => {
    if (filteredReservations.length === 0) return 0
    const total = filteredReservations.reduce((sum, reservation) => sum + (reservation.people || 0), 0)
    return (total / filteredReservations.length).toFixed(1)
  }

  const downloadPDF = () => {
    const doc = new jsPDF()
    const serviceStats = getServiceStats()
    const statusStats = getStatusStats()
    const monthlyStats = getMonthlyStats()

    doc.setFont("helvetica")
    doc.setLanguage("fr")

    // Set up colors for consistency
    const serviceColors = ["#3b82f6", "#ef4444", "#10b981", "#f59e0b", "#8b5cf6", "#06b6d4", "#f97316", "#84cc16"]
    const statusColors = {
      confirmed: "#10b981",
      pending: "#f59e0b",
      cancelled: "#ef4444",
    }

    const checkPageBreak = (currentY: number, requiredSpace: number) => {
      if (currentY + requiredSpace > 280) {
        doc.addPage()
        return 20 // Reset Y position for new page
      }
      return currentY
    }

    // Header with gradient-like effect
    doc.setFillColor(59, 130, 246)
    doc.rect(0, 0, 210, 40, "F")

    doc.setTextColor(255, 255, 255)
    doc.setFontSize(24)
    doc.setFont("helvetica", "bold")
    doc.text("Rapport Statistiques", 20, 25)

    // Reset text color
    doc.setTextColor(0, 0, 0)
    doc.setFont("helvetica", "normal")
    doc.setFontSize(12)
    doc.text(`Periode: ${fromDate || "Debut"} - ${toDate || "Fin"}`, 20, 55)
    doc.text(`Genere le: ${new Date().toLocaleDateString("fr-FR")}`, 20, 65)

    let yPos = 85

    // Summary section with colored background
    yPos = checkPageBreak(yPos, 60)

    doc.setFillColor(248, 250, 252)
    doc.rect(15, yPos - 5, 180, 60, "F")
    doc.setDrawColor(226, 232, 240)
    doc.rect(15, yPos - 5, 180, 60, "S")

    doc.setFontSize(16)
    doc.setFont("helvetica", "bold")
    doc.text("Resume Executif", 20, yPos + 5)

    doc.setFontSize(12)
    doc.setFont("helvetica", "normal")
    doc.text(`Total reservations: ${filteredReservations.length}`, 25, yPos + 15)
    doc.text(`Taille moyenne groupe: ${getAveragePartySize()} personnes`, 25, yPos + 25)

    // Calculate confirmation rate
    const confirmedCount = statusStats.confirmed || 0
    const totalReservations = filteredReservations.length
    const confirmationRate = totalReservations > 0 ? ((confirmedCount / totalReservations) * 100).toFixed(1) : 0
    doc.text(`Taux de confirmation: ${confirmationRate}%`, 25, yPos + 35)

    // Most popular service
    const mostPopularService = Object.entries(serviceStats).reduce(
      (a, b) => (serviceStats[a[0]] > serviceStats[b[0]] ? a : b),
      ["", 0],
    )
    doc.text(`Service le plus populaire: ${mostPopularService[0] || "N/A"}`, 25, yPos + 45)

    yPos += 75

    // Service Statistics Chart
    yPos = checkPageBreak(yPos, 80)

    doc.setFontSize(16)
    doc.setFont("helvetica", "bold")
    doc.text("Repartition par Service", 20, yPos)
    yPos += 15

    const centerX = 60
    const centerY = yPos + 30
    const radius = 25
    let currentAngle = 0
    const total = Object.values(serviceStats).reduce((sum, val) => sum + val, 0)

    Object.entries(serviceStats).forEach(([service, count], index) => {
      const percentage = total > 0 ? count / total : 0
      const sliceAngle = percentage * 2 * Math.PI

      // Convert hex color to RGB
      const color = serviceColors[index % serviceColors.length]
      const r = Number.parseInt(color.slice(1, 3), 16)
      const g = Number.parseInt(color.slice(3, 5), 16)
      const b = Number.parseInt(color.slice(5, 7), 16)

      doc.setFillColor(r, g, b)

      // Draw proper pie slice using arc approximation
      if (percentage > 0) {
        const startAngle = currentAngle
        const endAngle = currentAngle + sliceAngle

        // Create path for pie slice
        const steps = Math.max(8, Math.floor(sliceAngle * 20)) // More steps for smoother curves

        // Start from center
        doc.moveTo(centerX, centerY)

        // Draw arc
        for (let i = 0; i <= steps; i++) {
          const angle = startAngle + (sliceAngle * i) / steps
          const x = centerX + radius * Math.cos(angle)
          const y = centerY + radius * Math.sin(angle)

          if (i === 0) {
            doc.lineTo(x, y)
          } else {
            doc.lineTo(x, y)
          }
        }

        // Close the slice
        doc.lineTo(centerX, centerY)
        doc.fill()

        currentAngle += sliceAngle
      }
    })

    // Service legend
    let legendY = yPos + 10
    Object.entries(serviceStats).forEach(([service, count], index) => {
      const color = serviceColors[index % serviceColors.length]
      const r = Number.parseInt(color.slice(1, 3), 16)
      const g = Number.parseInt(color.slice(3, 5), 16)
      const b = Number.parseInt(color.slice(5, 7), 16)

      doc.setFillColor(r, g, b)
      doc.rect(110, legendY - 3, 8, 6, "F")

      doc.setTextColor(0, 0, 0)
      doc.setFontSize(10)
      const percentage = total > 0 ? ((count / total) * 100).toFixed(1) : 0
      doc.text(`${service}: ${count} (${percentage}%)`, 125, legendY)
      legendY += 8
    })

    yPos += 80

    yPos = checkPageBreak(yPos, 80)

    doc.setFontSize(16)
    doc.setFont("helvetica", "bold")
    doc.text("Statut des Reservations", 20, yPos)
    yPos += 15

    // Status pie chart
    const statusCenterX = 60
    const statusCenterY = yPos + 30
    const statusRadius = 25
    let statusCurrentAngle = 0
    const statusTotal = Object.values(statusStats).reduce((sum, val) => sum + val, 0)

    Object.entries(statusStats).forEach(([status, count], index) => {
      const percentage = statusTotal > 0 ? count / statusTotal : 0
      const sliceAngle = percentage * 2 * Math.PI

      const color = statusColors[status] || "#6b7280"
      const r = Number.parseInt(color.slice(1, 3), 16)
      const g = Number.parseInt(color.slice(3, 5), 16)
      const b = Number.parseInt(color.slice(5, 7), 16)

      doc.setFillColor(r, g, b)

      // Draw proper pie slice using arc approximation
      if (percentage > 0) {
        const startAngle = statusCurrentAngle
        const endAngle = statusCurrentAngle + sliceAngle

        // Create path for pie slice
        const steps = Math.max(8, Math.floor(sliceAngle * 20))

        // Start from center
        doc.moveTo(statusCenterX, statusCenterY)

        // Draw arc
        for (let i = 0; i <= steps; i++) {
          const angle = startAngle + (sliceAngle * i) / steps
          const x = statusCenterX + statusRadius * Math.cos(angle)
          const y = statusCenterY + statusRadius * Math.sin(angle)

          if (i === 0) {
            doc.lineTo(x, y)
          } else {
            doc.lineTo(x, y)
          }
        }

        // Close the slice
        doc.lineTo(statusCenterX, statusCenterY)
        doc.fill()

        statusCurrentAngle += sliceAngle
      }
    })

    // Status legend
    let statusLegendY = yPos + 10
    Object.entries(statusStats).forEach(([status, count]) => {
      const statusText = status === "pending" ? "En attente" : status === "confirmed" ? "Confirme" : "Annule"
      const color = statusColors[status] || "#6b7280"
      const r = Number.parseInt(color.slice(1, 3), 16)
      const g = Number.parseInt(color.slice(3, 5), 16)
      const b = Number.parseInt(color.slice(5, 7), 16)

      doc.setFillColor(r, g, b)
      doc.rect(110, statusLegendY - 3, 8, 6, "F")

      doc.setTextColor(0, 0, 0)
      doc.setFontSize(10)
      const percentage = statusTotal > 0 ? ((count / statusTotal) * 100).toFixed(1) : 0
      doc.text(`${statusText}: ${count} (${percentage}%)`, 125, statusLegendY)
      statusLegendY += 8
    })

    yPos += 80

    yPos = checkPageBreak(yPos, 40)

    doc.setFontSize(16)
    doc.setFont("helvetica", "bold")
    doc.text("Periode analysee", 20, yPos)
    yPos += 10

    doc.setFontSize(12)
    doc.setFont("helvetica", "normal")
    const startDate = fromDate || "Debut"
    const endDate = toDate || "Fin"
    doc.text(`Du ${startDate} au ${endDate}`, 25, yPos)
    yPos += 20

    doc.setFontSize(16)
    doc.setFont("helvetica", "bold")
    doc.text("Performance", 20, yPos)
    yPos += 10

    doc.setFontSize(12)
    doc.setFont("helvetica", "normal")
    const avgDailyReservations = totalReservations > 0 ? (totalReservations / 30).toFixed(1) : 0
    doc.text(`Reservations moyennes par jour: ${avgDailyReservations}`, 25, yPos)
    yPos += 10
    doc.text(`Taux d'occupation: ${confirmationRate}%`, 25, yPos)
    yPos += 20

    if (Object.keys(monthlyStats).length > 1) {
      yPos = checkPageBreak(yPos, 90)

      doc.setFontSize(16)
      doc.setFont("helvetica", "bold")
      doc.text("Tendances Mensuelles", 20, yPos)
      yPos += 15

      const chartWidth = 160
      const chartHeight = 50
      const chartX = 25
      const chartY = yPos

      // Draw chart background
      doc.setFillColor(248, 250, 252)
      doc.rect(chartX, chartY, chartWidth, chartHeight, "F")
      doc.setDrawColor(226, 232, 240)
      doc.rect(chartX, chartY, chartWidth, chartHeight, "S")

      // Draw grid lines
      doc.setDrawColor(226, 232, 240)
      doc.setLineWidth(0.5)
      for (let i = 1; i < 4; i++) {
        const gridY = chartY + (i * chartHeight) / 4
        doc.line(chartX, gridY, chartX + chartWidth, gridY)
      }

      const monthEntries = Object.entries(monthlyStats).sort()
      const maxMonthlyCount = Math.max(...Object.values(monthlyStats))
      const colors = [
        [34, 197, 94], // Green
        [59, 130, 246], // Blue
        [168, 85, 247], // Purple
        [245, 158, 11], // Orange
        [239, 68, 68], // Red
        [20, 184, 166], // Teal
      ]

      if (monthEntries.length > 0) {
        const barWidth = Math.min(25, (chartWidth - 20) / monthEntries.length - 5)
        const spacing = (chartWidth - 20) / monthEntries.length

        monthEntries.forEach((entry, index) => {
          const [month, count] = entry
          const barHeight = (count / maxMonthlyCount) * (chartHeight - 10)
          const x = chartX + 10 + index * spacing + (spacing - barWidth) / 2
          const y = chartY + chartHeight - barHeight - 5

          // Draw column with color
          const color = colors[index % colors.length]
          doc.setFillColor(color[0], color[1], color[2])
          doc.rect(x, y, barWidth, barHeight, "F")

          // Add month labels
          doc.setTextColor(107, 114, 128)
          doc.setFontSize(8)
          const monthName = new Date(2024, Number.parseInt(month.split("/")[0]) - 1).toLocaleDateString("fr-FR", {
            month: "short",
          })
          const textWidth = doc.getTextWidth(monthName)
          doc.text(monthName, x + (barWidth - textWidth) / 2, chartY + chartHeight + 8)

          // Add value labels on top of bars
          doc.setTextColor(75, 85, 99)
          doc.setFontSize(8)
          const valueText = count.toString()
          const valueWidth = doc.getTextWidth(valueText)
          doc.text(valueText, x + (barWidth - valueWidth) / 2, y - 2)
        })

        // Add Y-axis labels
        doc.setTextColor(107, 114, 128)
        doc.setFontSize(8)
        for (let i = 0; i <= 4; i++) {
          const value = Math.round((maxMonthlyCount * i) / 4)
          const y = chartY + chartHeight - 5 - (i * (chartHeight - 10)) / 4
          doc.text(value.toString(), chartX - 10, y + 2)
        }
      }

      yPos += 70
    }

    const addFooter = (pageNumber: number, totalPages: number) => {
      doc.setFillColor(248, 250, 252)
      doc.rect(0, 280, 210, 17, "F")
      doc.setTextColor(107, 114, 128)
      doc.setFontSize(8)
      doc.text("Genere automatiquement par le systeme de gestion des reservations", 20, 290)
      doc.text(`Page ${pageNumber} sur ${totalPages}`, 170, 290)
    }

    const totalPages = doc.getNumberOfPages()
    for (let i = 1; i <= totalPages; i++) {
      doc.setPage(i)
      addFooter(i, totalPages)
    }

    doc.save("statistiques-reservations-avec-graphiques.pdf")
  }

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode)
    localStorage.setItem("theme", !isDarkMode ? "dark" : "light")
  }

  const logout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    navigate("/")
  }

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen)
  }

  const formatTime = (date) => {
    return date.toLocaleTimeString("fr-FR", {
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const formatDate = (date) => {
    const options = { weekday: "long", day: "numeric", month: "long", year: "numeric" }
    return date.toLocaleDateString("fr-FR", options)
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

  const serviceStats = getServiceStats()
  const statusStats = getStatusStats()
  const monthlyStats = getMonthlyStats()

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
              <a href="#historique" onClick={() => navigate("/historique")}>
                <span className={isDarkMode ? "nav-icon" : "light-nav-icon"}>📋</span>
                <span>Historique</span>
              </a>
            </li>
            <li className="active">
              <a href="#statistiques">
                <span className={isDarkMode ? "nav-icon" : "light-nav-icon"}>📊</span>
                <span>Statistiques</span>
              </a>
            </li>
          </ul>
        </nav>

        <div className={isDarkMode ? "sidebar-footer" : "light-sidebar-footer"}>
          <button className={isDarkMode ? "logout-button" : "light-logout-button"} onClick={logout}>
            <span className={isDarkMode ? "nav-icon" : "light-nav-icon"}>🚪</span>
            <span>Déconnexion</span>
          </button>
        </div>
      </div>

      <div className={isDarkMode ? "main-content" : "light-main-content"}>
        <div className={isDarkMode ? "welcome-section" : "light-welcome-section"}>
          <div className={isDarkMode ? "welcome-header" : "light-welcome-header"}>
            <h1>
              Statistiques des Réservations <span className={isDarkMode ? "wave-emoji" : "light-wave-emoji"}>📊</span>
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
          <p>Analysez les performances de vos services</p>
        </div>

        <div className={isDarkMode ? "services-section" : "light-services-section"} style={{ marginBottom: "20px" }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
              gap: "20px",
              marginBottom: "32px",
            }}
          >
            <div
              style={{
                background: isDarkMode
                  ? "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                  : "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                borderRadius: "16px",
                padding: "20px",
                color: "white",
                boxShadow: isDarkMode ? "0 8px 32px rgba(102, 126, 234, 0.3)" : "0 8px 32px rgba(102, 126, 234, 0.2)",
                position: "relative",
                overflow: "hidden",
                minHeight: "120px",
              }}
            >
              <div style={{ position: "absolute", top: "-10px", right: "-10px", fontSize: "60px", opacity: "0.1" }}>
                📊
              </div>
              <div style={{ fontSize: "13px", fontWeight: "500", opacity: "0.9", marginBottom: "8px" }}>
                Total Réservations
              </div>
              <div style={{ fontSize: "32px", fontWeight: "700", marginBottom: "4px" }}>
                {filteredReservations.length}
              </div>
              <div style={{ fontSize: "11px", opacity: "0.8" }}>
                {filteredReservations.length > 0 ? "+12% ce mois" : "Aucune donnée"}
              </div>
            </div>

            <div
              style={{
                background: isDarkMode
                  ? "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)"
                  : "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
                borderRadius: "16px",
                padding: "20px",
                color: "white",
                boxShadow: isDarkMode ? "0 8px 32px rgba(240, 147, 251, 0.3)" : "0 8px 32px rgba(240, 147, 251, 0.2)",
                position: "relative",
                overflow: "hidden",
                minHeight: "120px",
              }}
            >
              <div style={{ position: "absolute", top: "-10px", right: "-10px", fontSize: "60px", opacity: "0.1" }}>
                👥
              </div>
              <div style={{ fontSize: "13px", fontWeight: "500", opacity: "0.9", marginBottom: "8px" }}>
                Taille Moyenne Groupe
              </div>
              <div style={{ fontSize: "32px", fontWeight: "700", marginBottom: "4px" }}>{getAveragePartySize()}</div>
              <div style={{ fontSize: "11px", opacity: "0.8" }}>personnes par réservation</div>
            </div>

            <div
              style={{
                background: isDarkMode
                  ? "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)"
                  : "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
                borderRadius: "16px",
                padding: "20px",
                color: "white",
                boxShadow: isDarkMode ? "0 8px 32px rgba(67, 233, 123, 0.3)" : "0 8px 32px rgba(67, 233, 123, 0.2)",
                position: "relative",
                overflow: "hidden",
                minHeight: "120px",
              }}
            >
              <div style={{ position: "absolute", top: "-10px", right: "-10px", fontSize: "60px", opacity: "0.1" }}>
                ✅
              </div>
              <div style={{ fontSize: "13px", fontWeight: "500", opacity: "0.9", marginBottom: "8px" }}>
                Taux de Confirmation
              </div>
              <div style={{ fontSize: "32px", fontWeight: "700", marginBottom: "4px" }}>
                {filteredReservations.length > 0
                  ? Math.round(((statusStats.confirmed || 0) / filteredReservations.length) * 100)
                  : 0}
                %
              </div>
              <div style={{ fontSize: "11px", opacity: "0.8" }}>{statusStats.confirmed || 0} confirmées</div>
            </div>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))",
              gap: "24px",
              marginBottom: "32px",
            }}
          >
            <div
              style={{
                backgroundColor: isDarkMode ? "#1f2937" : "#ffffff",
                borderRadius: "16px",
                padding: "24px",
                boxShadow: isDarkMode ? "0 10px 25px rgba(0, 0, 0, 0.3)" : "0 10px 25px rgba(0, 0, 0, 0.1)",
                border: isDarkMode ? "1px solid #374151" : "1px solid #e5e7eb",
                transition: "all 0.3s ease",
              }}
            >
              <h3
                style={{
                  fontSize: "18px",
                  fontWeight: "600",
                  color: isDarkMode ? "#ffffff" : "#1f2937",
                  marginBottom: "20px",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                📊 Distribution des Services
              </h3>

              {/* Dynamic Donut Chart */}
              <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "250px" }}>
                <div style={{ position: "relative", width: "200px", height: "200px" }}>
                  <svg width="200" height="200" style={{ transform: "rotate(-90deg)" }}>
                    {Object.entries(serviceStats).map(([service, count], index) => {
                      const colors = [
                        "#3b82f6",
                        "#ef4444",
                        "#10b981",
                        "#f59e0b",
                        "#8b5cf6",
                        "#06b6d4",
                        "#f97316",
                        "#84cc16",
                      ]
                      const total = Object.values(serviceStats).reduce((sum, val) => sum + val, 0)
                      const percentage = total > 0 ? (count / total) * 100 : 0
                      const strokeDasharray = `${percentage * 2.51} 251.2` // 2π * 40 = 251.2
                      const strokeDashoffset = Object.values(serviceStats)
                        .slice(0, index)
                        .reduce((sum, val) => sum - (val / total) * 251.2, 0)

                      return (
                        <circle
                          key={service}
                          cx="100"
                          cy="100"
                          r="40"
                          fill="none"
                          stroke={colors[index % colors.length]}
                          strokeWidth="20"
                          strokeDasharray={strokeDasharray}
                          strokeDashoffset={strokeDashoffset}
                          style={{
                            transition: "all 0.5s ease",
                            filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.1))",
                          }}
                        />
                      )
                    })}
                  </svg>

                  {/* Center text showing total */}
                  <div
                    style={{
                      position: "absolute",
                      top: "50%",
                      left: "50%",
                      transform: "translate(-50%, -50%)",
                      textAlign: "center",
                      color: isDarkMode ? "#ffffff" : "#1f2937",
                    }}
                  >
                    <div style={{ fontSize: "24px", fontWeight: "700" }}>
                      {Object.values(serviceStats).reduce((sum, val) => sum + val, 0)}
                    </div>
                    <div style={{ fontSize: "12px", color: isDarkMode ? "#9ca3af" : "#6b7280" }}>Total</div>
                  </div>
                </div>
              </div>

              {/* Dynamic Legend */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
                  gap: "12px",
                  marginTop: "24px",
                }}
              >
                {Object.entries(serviceStats).map(([service, count], index) => {
                  const colors = [
                    "#3b82f6",
                    "#ef4444",
                    "#10b981",
                    "#f59e0b",
                    "#8b5cf6",
                    "#06b6d4",
                    "#f97316",
                    "#84cc16",
                  ]
                  const total = Object.values(serviceStats).reduce((sum, val) => sum + val, 0)
                  const percentage = total > 0 ? Math.round((count / total) * 100) : 0

                  return (
                    <div
                      key={service}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        padding: "8px",
                        borderRadius: "8px",
                        backgroundColor: isDarkMode ? "#374151" : "#f9fafb",
                        transition: "all 0.2s ease",
                      }}
                    >
                      <div
                        style={{
                          width: "12px",
                          height: "12px",
                          borderRadius: "50%",
                          backgroundColor: colors[index % colors.length],
                          flexShrink: 0,
                        }}
                      />
                      <div style={{ flex: 1 }}>
                        <div
                          style={{
                            color: isDarkMode ? "#ffffff" : "#1f2937",
                            fontSize: "13px",
                            fontWeight: "500",
                            textTransform: "capitalize",
                          }}
                        >
                          {service}
                        </div>
                        <div
                          style={{
                            color: isDarkMode ? "#9ca3af" : "#6b7280",
                            fontSize: "11px",
                          }}
                        >
                          {count} ({percentage}%)
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Status Donut Chart */}
            <div
              style={{
                backgroundColor: isDarkMode ? "#1a1a1a" : "#ffffff",
                borderRadius: "16px",
                padding: "24px",
                boxShadow: isDarkMode ? "0 4px 20px rgba(0, 0, 0, 0.3)" : "0 4px 20px rgba(0, 0, 0, 0.1)",
                border: isDarkMode ? "1px solid #333" : "1px solid #e5e7eb",
              }}
            >
              <h3
                style={{
                  color: isDarkMode ? "#ffffff" : "#1f2937",
                  fontSize: "18px",
                  fontWeight: "600",
                  marginBottom: "20px",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                <span style={{ fontSize: "20px" }}>🍩</span>
                Statut des Réservations
              </h3>
              <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "200px" }}>
                <div style={{ position: "relative", width: "160px", height: "160px" }}>
                  {Object.entries(statusStats).map(([status, count], index) => {
                    const statusConfig = {
                      confirmed: { color: "#10b981" },
                      pending: { color: "#f59e0b" },
                      cancelled: { color: "#ef4444" },
                    }
                    const config = statusConfig[status] || { color: "#6b7280" }
                    const total = Object.values(statusStats).reduce((sum, val) => sum + val, 0)
                    const percentage = total > 0 ? (count / total) * 100 : 0
                    const circumference = 2 * Math.PI * 70
                    const strokeDasharray = `${(percentage / 100) * circumference} ${circumference}`
                    const rotation = Object.values(statusStats)
                      .slice(0, index)
                      .reduce((sum, val) => sum + (val / total) * 360, 0)

                    return (
                      <svg
                        key={status}
                        style={{
                          position: "absolute",
                          width: "160px",
                          height: "160px",
                          transform: `rotate(${rotation - 90}deg)`,
                        }}
                      >
                        <circle
                          cx="80"
                          cy="80"
                          r="70"
                          fill="none"
                          stroke={config.color}
                          strokeWidth="20"
                          strokeDasharray={strokeDasharray}
                          strokeLinecap="round"
                        />
                      </svg>
                    )
                  })}
                  <div
                    style={{
                      position: "absolute",
                      top: "50%",
                      left: "50%",
                      transform: "translate(-50%, -50%)",
                      textAlign: "center",
                    }}
                  >
                    <div
                      style={{
                        fontSize: "24px",
                        fontWeight: "700",
                        color: isDarkMode ? "#ffffff" : "#1f2937",
                      }}
                    >
                      {Object.values(statusStats).reduce((sum, val) => sum + val, 0)}
                    </div>
                    <div
                      style={{
                        fontSize: "12px",
                        color: isDarkMode ? "#9ca3af" : "#6b7280",
                      }}
                    >
                      Total
                    </div>
                  </div>
                </div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginTop: "20px" }}>
                {Object.entries(statusStats).map(([status, count]) => {
                  const statusConfig = {
                    confirmed: { label: "Confirmé", color: "#10b981", icon: "✅" },
                    pending: { label: "En attente", color: "#f59e0b", icon: "⏳" },
                    cancelled: { label: "Annulé", color: "#ef4444", icon: "❌" },
                  }
                  const config = statusConfig[status] || { label: status, color: "#6b7280", icon: "📋" }
                  const total = Object.values(statusStats).reduce((sum, val) => sum + val, 0)
                  const percentage = total > 0 ? Math.round((count / total) * 100) : 0

                  return (
                    <div
                      key={status}
                      style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <div style={{ fontSize: "14px" }}>{config.icon}</div>
                        <div
                          style={{
                            color: isDarkMode ? "#ffffff" : "#374151",
                            fontSize: "14px",
                            fontWeight: "500",
                          }}
                        >
                          {config.label}
                        </div>
                      </div>
                      <div
                        style={{
                          color: config.color,
                          fontSize: "14px",
                          fontWeight: "600",
                        }}
                      >
                        {count} ({percentage}%)
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>

          <div
            style={{
              backgroundColor: isDarkMode ? "#1a1a1a" : "#ffffff",
              borderRadius: "16px",
              padding: "24px",
              boxShadow: isDarkMode ? "0 4px 20px rgba(0, 0, 0, 0.3)" : "0 4px 20px rgba(0, 0, 0, 0.1)",
              border: isDarkMode ? "1px solid #333" : "1px solid #e5e7eb",
              marginBottom: "24px",
            }}
          >
            <h3
              style={{
                color: isDarkMode ? "#ffffff" : "#1f2937",
                fontSize: "18px",
                fontWeight: "600",
                marginBottom: "20px",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <span style={{ fontSize: "20px" }}>📈</span>
              Tendances Mensuelles
            </h3>
            <div
              style={{
                display: "flex",
                alignItems: "end",
                justifyContent: "space-between",
                gap: "8px",
                height: "200px",
                padding: "20px 0",
                position: "relative",
              }}
            >
              {/* Grid lines */}
              {[0, 25, 50, 75, 100].map((line) => (
                <div
                  key={line}
                  style={{
                    position: "absolute",
                    left: "0",
                    right: "0",
                    bottom: `${(line / 100) * 160 + 40}px`,
                    height: "1px",
                    backgroundColor: isDarkMode ? "#333" : "#f3f4f6",
                    opacity: 0.5,
                  }}
                />
              ))}

              {Object.entries(monthlyStats).map(([month, count], index) => {
                const maxCount = Math.max(...Object.values(monthlyStats))
                const percentage = maxCount > 0 ? (count / maxCount) * 100 : 0
                const height = Math.max((percentage / 100) * 160, 8)

                return (
                  <div
                    key={month}
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: "12px",
                      flex: 1,
                      maxWidth: "80px",
                    }}
                  >
                    {/* Data point */}
                    <div
                      style={{
                        width: "8px",
                        height: "8px",
                        backgroundColor: "#667eea",
                        borderRadius: "50%",
                        position: "relative",
                        marginBottom: "4px",
                      }}
                    >
                      <div
                        style={{
                          position: "absolute",
                          bottom: "12px",
                          left: "50%",
                          transform: "translateX(-50%)",
                          color: isDarkMode ? "#ffffff" : "#374151",
                          fontSize: "12px",
                          fontWeight: "600",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {count}
                      </div>
                    </div>

                    {/* Bar */}
                    <div
                      style={{
                        width: "100%",
                        maxWidth: "40px",
                        height: `${height}px`,
                        background: "linear-gradient(180deg, #667eea 0%, #764ba2 100%)",
                        borderRadius: "4px 4px 0 0",
                        transition: "height 0.8s ease-in-out",
                        position: "relative",
                      }}
                    />
                    {/* Month label */}
                    <div
                      style={{
                        color: isDarkMode ? "#9ca3af" : "#6b7280",
                        fontSize: "11px",
                        fontWeight: "500",
                        textAlign: "center",
                        transform: "rotate(-45deg)",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {month}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
              gap: "16px",
              marginBottom: "24px",
            }}
          >
            <div
              style={{
                backgroundColor: isDarkMode ? "#1a1a1a" : "#ffffff",
                borderRadius: "12px",
                padding: "20px",
                boxShadow: isDarkMode ? "0 2px 10px rgba(0, 0, 0, 0.2)" : "0 2px 10px rgba(0, 0, 0, 0.05)",
                border: isDarkMode ? "1px solid #333" : "1px solid #e5e7eb",
                textAlign: "center",
                transition: "transform 0.2s ease-in-out",
              }}
              onMouseEnter={(e) => (e.target.style.transform = "translateY(-2px)")}
              onMouseLeave={(e) => (e.target.style.transform = "translateY(0px)")}
            >
              <div style={{ fontSize: "24px", marginBottom: "8px" }}>🎯</div>
              <div
                style={{
                  color: isDarkMode ? "#9ca3af" : "#6b7280",
                  fontSize: "12px",
                  marginBottom: "4px",
                }}
              >
                Service le plus populaire
              </div>
              <div
                style={{
                  color: isDarkMode ? "#ffffff" : "#1f2937",
                  fontSize: "14px",
                  fontWeight: "600",
                  textTransform: "capitalize",
                }}
              >
                {Object.entries(serviceStats).length > 0
                  ? Object.entries(serviceStats).reduce((a, b) => (serviceStats[a[0]] > serviceStats[b[0]] ? a : b))[0]
                  : "N/A"}
              </div>
            </div>

            <div
              style={{
                backgroundColor: isDarkMode ? "#1a1a1a" : "#ffffff",
                borderRadius: "12px",
                padding: "20px",
                boxShadow: isDarkMode ? "0 2px 10px rgba(0, 0, 0, 0.2)" : "0 2px 10px rgba(0, 0, 0, 0.05)",
                border: isDarkMode ? "1px solid #333" : "1px solid #e5e7eb",
                textAlign: "center",
                transition: "transform 0.2s ease-in-out",
              }}
              onMouseEnter={(e) => (e.target.style.transform = "translateY(-2px)")}
              onMouseLeave={(e) => (e.target.style.transform = "translateY(0px)")}
            >
              <div style={{ fontSize: "24px", marginBottom: "8px" }}>📅</div>
              <div
                style={{
                  color: isDarkMode ? "#9ca3af" : "#6b7280",
                  fontSize: "12px",
                  marginBottom: "4px",
                }}
              >
                Période analysée
              </div>
              <div
                style={{
                  color: isDarkMode ? "#ffffff" : "#1f2937",
                  fontSize: "14px",
                  fontWeight: "600",
                }}
              >
                {fromDate && toDate
                  ? `${new Date(fromDate).toLocaleDateString("fr-FR")} - ${new Date(toDate).toLocaleDateString("fr-FR")}`
                  : "Toutes les données"}
              </div>
            </div>

            <div
              style={{
                backgroundColor: isDarkMode ? "#1a1a1a" : "#ffffff",
                borderRadius: "12px",
                padding: "20px",
                boxShadow: isDarkMode ? "0 2px 10px rgba(0, 0, 0, 0.2)" : "0 2px 10px rgba(0, 0, 0, 0.05)",
                border: isDarkMode ? "1px solid #333" : "1px solid #e5e7eb",
                textAlign: "center",
                transition: "transform 0.2s ease-in-out",
              }}
              onMouseEnter={(e) => (e.target.style.transform = "translateY(-2px)")}
              onMouseLeave={(e) => (e.target.style.transform = "translateY(0px)")}
            >
              <div style={{ fontSize: "24px", marginBottom: "8px" }}>⭐</div>
              <div
                style={{
                  color: isDarkMode ? "#9ca3af" : "#6b7280",
                  fontSize: "12px",
                  marginBottom: "4px",
                }}
              >
                Performance
              </div>
              <div
                style={{
                  color: isDarkMode ? "#ffffff" : "#1f2937",
                  fontSize: "14px",
                  fontWeight: "600",
                }}
              >
                {filteredReservations.length > 0
                  ? Math.round(((statusStats.confirmed || 0) / filteredReservations.length) * 100) >= 70
                    ? "Excellente"
                    : Math.round(((statusStats.confirmed || 0) / filteredReservations.length) * 100) >= 50
                      ? "Bonne"
                      : "À améliorer"
                  : "N/A"}
              </div>
            </div>
          </div>

          <div
            style={{
              backgroundColor: isDarkMode ? "#1a1a1a" : "#ffffff",
              borderRadius: "16px",
              padding: "24px",
              boxShadow: isDarkMode ? "0 4px 20px rgba(0, 0, 0, 0.3)" : "0 4px 20px rgba(0, 0, 0, 0.1)",
              border: isDarkMode ? "1px solid #333" : "1px solid #e5e7eb",
              marginBottom: "24px",
            }}
          >
            <h3
              style={{
                color: isDarkMode ? "#ffffff" : "#1f2937",
                fontSize: "18px",
                fontWeight: "600",
                marginBottom: "20px",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <span style={{ fontSize: "20px" }}>🔍</span>
              Filtres et Actions
            </h3>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                gap: "16px",
                alignItems: "end",
              }}
            >
              <div>
                <label
                  style={{
                    display: "block",
                    color: isDarkMode ? "#9ca3af" : "#6b7280",
                    fontSize: "14px",
                    marginBottom: "8px",
                  }}
                >
                  Date de début
                </label>
                <input
                  type="date"
                  value={fromDate}
                  onChange={(e) => setFromDate(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "12px",
                    borderRadius: "8px",
                    border: isDarkMode ? "1px solid #333" : "1px solid #d1d5db",
                    backgroundColor: isDarkMode ? "#2a2a2a" : "#ffffff",
                    color: isDarkMode ? "#ffffff" : "#1f2937",
                    fontSize: "14px",
                  }}
                />
              </div>
              <div>
                <label
                  style={{
                    display: "block",
                    color: isDarkMode ? "#9ca3af" : "#6b7280",
                    fontSize: "14px",
                    marginBottom: "8px",
                  }}
                >
                  Date de fin
                </label>
                <input
                  type="date"
                  value={toDate}
                  onChange={(e) => setToDate(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "12px",
                    borderRadius: "8px",
                    border: isDarkMode ? "1px solid #333" : "1px solid #d1d5db",
                    backgroundColor: isDarkMode ? "#2a2a2a" : "#ffffff",
                    color: isDarkMode ? "#ffffff" : "#1f2937",
                    fontSize: "14px",
                  }}
                />
              </div>
              <div style={{ display: "flex", gap: "12px" }}>
                <button
                  onClick={filterByDate}
                  style={{
                    padding: "12px 20px",
                    borderRadius: "8px",
                    border: "none",
                    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                    color: "white",
                    fontSize: "14px",
                    fontWeight: "500",
                    cursor: "pointer",
                    transition: "transform 0.2s ease-in-out",
                  }}
                  onMouseEnter={(e) => (e.target.style.transform = "translateY(-1px)")}
                  onMouseLeave={(e) => (e.target.style.transform = "translateY(0px)")}
                >
                  Filtrer
                </button>
                <button
                  onClick={clearFilter}
                  style={{
                    padding: "12px 20px",
                    borderRadius: "8px",
                    border: isDarkMode ? "1px solid #333" : "1px solid #d1d5db",
                    backgroundColor: isDarkMode ? "#2a2a2a" : "#ffffff",
                    color: isDarkMode ? "#ffffff" : "#1f2937",
                    fontSize: "14px",
                    fontWeight: "500",
                    cursor: "pointer",
                    transition: "transform 0.2s ease-in-out",
                  }}
                  onMouseEnter={(e) => (e.target.style.transform = "translateY(-1px)")}
                  onMouseLeave={(e) => (e.target.style.transform = "translateY(0px)")}
                >
                  Effacer
                </button>
              </div>
              <div>
                <button
                  onClick={downloadPDF}
                  style={{
                    width: "100%",
                    padding: "12px 20px",
                    borderRadius: "8px",
                    border: "none",
                    background: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
                    color: "white",
                    fontSize: "14px",
                    fontWeight: "500",
                    cursor: "pointer",
                    transition: "transform 0.2s ease-in-out",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "8px",
                  }}
                  onMouseEnter={(e) => (e.target.style.transform = "translateY(-1px)")}
                  onMouseLeave={(e) => (e.target.style.transform = "translateY(0px)")}
                >
                  <span>📄</span>
                  Télécharger PDF
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Statistiques
