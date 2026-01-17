"use client"

import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import "./ReservationsPage.css" // Reusing the same CSS file
import API from "../services/api"

const NettoyagePage = () => {
  const navigate = useNavigate()
  const [user, setUser] = useState({ username: "", email: "" })
  const [isLoading, setIsLoading] = useState(true)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [currentTime, setCurrentTime] = useState(new Date())
  const [nettoyages, setNettoyages] = useState([])
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [deletingNettoyage, setDeletingNettoyage] = useState(null)

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (!token) navigate("/")

    const userData = JSON.parse(localStorage.getItem("user") || '{"username":"test","email":"test@gmail.com"}')
    setUser(userData)

    const loadTimer = setTimeout(() => setIsLoading(false), 800)
    const timer = setInterval(() => setCurrentTime(new Date()), 60000)

    fetchNettoyages()

    return () => {
      clearTimeout(loadTimer)
      clearInterval(timer)
    }
  }, [navigate])

  const fetchNettoyages = () => {
    API.get("/nettoyages")
      .then((res) => {
        setNettoyages(res.data || [])
      })
      .catch((err) => console.error("Nettoyage fetch error", err))
  }

  const deleteNettoyage = (id) => {
    API.delete(`/nettoyages/${id}`)
      .then(() => {
        fetchNettoyages() // Refresh the list after deletion
        setShowDeleteModal(false)
        setDeletingNettoyage(null)
      })
      .catch((err) => {
        console.error("Failed to delete nettoyage", err)
        alert("Erreur lors de la suppression")
      })
  }

  const formatDate = (date) => {
    const options = { weekday: "long", day: "numeric", month: "long", year: "numeric" }
    return new Date(date).toLocaleDateString("fr-FR", options)
  }

  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })
  }

  const formatDateTime = (date) => {
    return new Date(date).toLocaleString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    navigate("/")
  }

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen)
  }

  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="loading-logo">IT BAFA</div>
        <div className="loading-spinner">
          <div className="spinner-circle"></div>
          <div className="spinner-circle-inner"></div>
        </div>
        <div className="loading-text">Chargement...</div>
      </div>
    )
  }

  return (
    <div className="dashboard">
      <div className="mobile-header">
        <button className="menu-toggle" onClick={toggleSidebar}>
          <span></span>
          <span></span>
          <span></span>
        </button>
        <div className="mobile-logo">
          <span className="logo-text">IT BAFA</span>
        </div>
        <div className="mobile-user">
          <div className="user-avatar">{user.username.charAt(0)}</div>
        </div>
      </div>

      <div className={`sidebar ${isSidebarOpen ? "open" : ""}`}>
        <div className="sidebar-header">
          <div className="logo">
            <span className="logo-text">IT BAFA</span>
          </div>
          <button className="close-sidebar" onClick={toggleSidebar}>
            ×
          </button>
        </div>

        <div className="user-profile">
          <div className="user-avatar">{user.username.charAt(0)}</div>
          <div className="user-info">
            <div className="user-name">{user.username}</div>
            <div className="user-email">{user.email}</div>
          </div>
        </div>

        <div className="sidebar-date">
          <div className="date-display">{formatDate(currentTime)}</div>
          <div className="time-display">{formatTime(currentTime)}</div>
        </div>

        <nav className="sidebar-nav">
          <ul>
            <li>
              <a href="#dashboard" onClick={() => navigate("/dashboard")}>
                <span className="nav-icon">🏠</span>
                <span>Tableau de bord</span>
              </a>
            </li>
            <li>
              <a href="#reservations" onClick={() => navigate("/reservations")}>
                <span className="nav-icon">📅</span>
                <span>Réservations</span>
              </a>
            </li>
            <li className="active">
              <a href="#nettoyage">
                <span className="nav-icon">🧹</span>
                <span>Room Service </span>
              </a>
            </li>
            <li>
              <a href="#profile" onClick={() => navigate("/profile")}>
                <span className="nav-icon">👤</span>
                <span>Mon profil</span>
              </a>
            </li>
            <li>
              <a href="/settings" onClick={() => navigate("/settings")}>
                <span className="nav-icon">⚙️</span>
                <span>Paramètres</span>
              </a>
            </li>
          </ul>
        </nav>

        <div className="sidebar-footer">
          <button className="logout-button" onClick={handleLogout}>
            <span className="nav-icon">🚪</span>
            <span>Déconnexion</span>
          </button>
        </div>
      </div>

      <div className="main-content">
        <div className="welcome-section">
          <div className="welcome-header">
            <h1>
              Room Service <span className="wave-emoji">🧹</span>
            </h1>
            <div className="welcome-actions">
              <button className="action-button notifications">
                <span className="action-icon">🔔</span>
                <span className="notification-badge"></span>
              </button>
              <div className="user-avatar-small">{user.username.charAt(0)}</div>
            </div>
          </div>
          <p>Gérez toutes vos tâches de nettoyage en un seul endroit</p>
        </div>

        <div className="reservations-container">
          {nettoyages.length > 0 ? (
            nettoyages.map((nettoyage) => (
              <div key={nettoyage._id} className="reservation-card" style={{ "--card-color": "#4ECDC4" }}>
                <div className="reservation-header">
                  <div className="reservation-name">{nettoyage.name}</div>
                  <div className="reservation-status" style={{ backgroundColor: "#4ECDC4" }}>
                    Actif
                  </div>
                </div>

                <div className="reservation-details">
                  <div className="detail-group">
                    <div className="detail-label">Chambre:</div>
                    <div className="detail-value">{nettoyage.room}</div>
                  </div>

                  <div className="detail-group">
                    <div className="detail-label">Disponible de:</div>
                    <div className="detail-value">{formatDateTime(nettoyage.disponibleDe)}</div>
                  </div>

                  <div className="detail-group">
                    <div className="detail-label">Disponible à:</div>
                    <div className="detail-value">{formatDateTime(nettoyage.disponibleA)}</div>
                  </div>

                  <div className="detail-group">
                    <div className="detail-label">Créé le:</div>
                    <div className="detail-value">{formatDateTime(nettoyage.createdAt)}</div>
                  </div>

                  {nettoyage.updatedAt && (
                    <div className="detail-group">
                      <div className="detail-label">Modifié le:</div>
                      <div className="detail-value">{formatDateTime(nettoyage.updatedAt)}</div>
                    </div>
                  )}
                </div>

                <div className="reservation-actions">
                  <button
                    className="action-button cancel"
                    onClick={() => {
                      setDeletingNettoyage(nettoyage)
                      setShowDeleteModal(true)
                    }}
                  >
                    🗑️ 
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="no-reservations">
              <div className="no-data-icon">🧹</div>
              <h3>Aucune tâche de nettoyage trouvée</h3>
              <p>Il n'y a pas de tâches de nettoyage enregistrées pour le moment</p>
            </div>
          )}
        </div>
      </div>

      {showDeleteModal && deletingNettoyage && (
        <div className="modal-overlay" onClick={() => setShowDeleteModal(false)}>
          <div className="modal-container" onClick={(e) => e.stopPropagation()}>
            <h3>Confirmer la suppression</h3>
            <p>
              Êtes-vous sûr de vouloir supprimer la tâche de nettoyage "{deletingNettoyage.name}" pour la chambre "
              {deletingNettoyage.room}" ?
            </p>
            <div className="modal-actions">
              <button className="confirm" onClick={() => deleteNettoyage(deletingNettoyage._id)}>
                🗑️ Supprimer
              </button>
              <button className="cancel" onClick={() => setShowDeleteModal(false)}>
                ❌ Annuler
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default NettoyagePage
