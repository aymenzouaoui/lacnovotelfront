"use client"

import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import "./Dashboard.css"
import "./DashboardLight.css"
import API from "../services/api"
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  PieChart, 
  Pie, 
  Cell 
} from 'recharts';

const AnalyticsStats = () => {
  const navigate = useNavigate()
  const [user, setUser] = useState({ username: "", email: "" })
  const [isLoading, setIsLoading] = useState(true)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [currentTime, setCurrentTime] = useState(new Date())
  const [analyticsData, setAnalyticsData] = useState({
    totalViews: 0,
    dailyViews: [],
    pageViews: [],
    deviceData: [],
    trafficData: [],
    conversionData: {
      totalUsers: 0,
      engagedUsers: 0,
      engagementRate: "0%",
      totalEvents: 0,
      eventsPerUser: 0
    },
    summary: {
      sessions: 0,
      activeUsers: 0
    }
  })

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

    fetchAnalyticsData()
  }, [navigate])

  const fetchAnalyticsData = async () => {
    try {
      setIsLoading(true)
      
      // Fetch data in parallel from new backend endpoints
      const [
        viewsRes, 
        summaryRes, 
        dailyRes, 
        pagesRes, 
        devicesRes, 
        trafficRes, 
        conversionRes
      ] = await Promise.all([
        API.get("/analytics/views").catch(() => ({ data: { views: 0 } })),
        API.get("/analytics/summary?metrics=screenPageViews,sessions,activeUsers").catch(() => ({ data: { data: {} } })),
        API.get("/analytics/reports/daily").catch(() => ({ data: { data: [] } })),
        API.get("/analytics/reports/pages").catch(() => ({ data: { data: [] } })),
        API.get("/analytics/reports/devices").catch(() => ({ data: { data: [] } })),
        API.get("/analytics/reports/traffic").catch(() => ({ data: { data: [] } })),
        API.get("/analytics/reports/conversion").catch(() => ({ data: { data: {} } }))
      ])

      setAnalyticsData({
        totalViews: viewsRes.data.views || 0,
        summary: {
          sessions: summaryRes.data.data?.sessions || 0,
          activeUsers: summaryRes.data.data?.activeUsers || 0
        },
        dailyViews: dailyRes.data.data?.map(d => ({ name: d.day, views: d.views, sessions: d.sessions })) || [],
        pageViews: pagesRes.data.data?.map(p => ({ name: p.title, value: p.views, duration: p.avgDuration })) || [],
        deviceData: devicesRes.data.data?.map(dev => ({ name: dev.device, value: dev.sessions, users: dev.users })) || [],
        trafficData: trafficRes.data.data?.map(t => ({ name: t.source, value: t.sessions, views: t.views })) || [],
        conversionData: conversionRes.data.data || {
          totalUsers: 0,
          engagedUsers: 0,
          engagementRate: "0%",
          totalEvents: 0,
          eventsPerUser: 0
        }
      })
      
      setIsLoading(false)
    } catch (err) {
      console.error("Failed to fetch analytics data", err)
      setIsLoading(false)
    }
  }

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen)
  const toggleTheme = () => {
    const newTheme = !isDarkMode ? "dark" : "light"
    setIsDarkMode(!isDarkMode)
    localStorage.setItem("theme", newTheme)
  }

  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    navigate("/")
  }

  if (isLoading) {
    return (
      <div className={isDarkMode ? "loading-container" : "light-loading-container"}>
        <div className={isDarkMode ? "loading-spinner" : "light-loading-spinner"}></div>
        <div className={isDarkMode ? "loading-text" : "light-loading-text"}>Analyse des données GA4...</div>
      </div>
    )
  }

  return (
    <div
      className={isDarkMode ? "dashboard-container" : "light-dashboard-container"}
      style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}
    >
      <style>{`
        .stat-card, .light-stat-card {
          position: relative !important;
          overflow: visible !important;
          z-index: 1;
        }
        .stat-card:hover, .light-stat-card:hover {
          z-index: 10; /* Monte la carte au-dessus des autres lors du survol */
        }
        .stat-tooltip {
          position: absolute;
          bottom: calc(100% + 15px);
          left: 50%;
          transform: translateX(-50%) translateY(10px);
          background: ${isDarkMode ? "white" : "#1e293b"};
          color: ${isDarkMode ? "#1e293b" : "white"};
          padding: 12px 16px;
          border-radius: 10px;
          font-size: 13px;
          width: 250px;
          text-align: center;
          visibility: hidden;
          opacity: 0;
          transition: all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
          z-index: 99999 !important;
          box-shadow: 0 10px 30px rgba(0,0,0,0.4);
          pointer-events: none;
          line-height: 1.5;
          border: 1px solid ${isDarkMode ? "rgba(0,0,0,0.1)" : "rgba(255,255,255,0.2)"};
          font-weight: 500;
        }
        .stat-card:hover .stat-tooltip, .light-stat-card:hover .stat-tooltip {
          visibility: visible;
          opacity: 1;
          transform: translateX(-50%) translateY(0);
        }
        .stat-tooltip::after {
          content: "";
          position: absolute;
          top: 100%;
          left: 50%;
          transform: translateX(-50%);
          border-width: 8px;
          border-style: solid;
          border-color: ${isDarkMode ? "white" : "#1e293b"} transparent transparent transparent;
        }
        .info-icon {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 18px;
          height: 18px;
          background: ${isDarkMode ? "rgba(255, 255, 255, 0.15)" : "rgba(0, 0, 0, 0.1)"};
          border-radius: 50%;
          font-size: 12px;
          margin-left: 8px;
          cursor: help;
          transition: all 0.3s ease;
          border: 1px solid ${isDarkMode ? "rgba(255, 255, 255, 0.2)" : "rgba(0, 0, 0, 0.1)"};
        }
        .stat-card:hover .info-icon, .light-stat-card:hover .info-icon {
          background: ${isDarkMode ? "rgba(255, 255, 255, 0.3)" : "rgba(0, 0, 0, 0.2)"};
          transform: scale(1.1);
        }
      `}</style>

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
                width: "180px",
                height: "auto",
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

      {/* Sidebar - Reusing styles from Dashboard */}
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
          <button className={isDarkMode ? "close-sidebar" : "light-close-sidebar"} onClick={toggleSidebar}>×</button>
        </div>
        
        <nav className={isDarkMode ? "sidebar-nav" : "light-sidebar-nav"}>
          <ul>
            <li>
              <a onClick={() => navigate("/dashboard")}>
                <span className="nav-icon">🏠</span>
                <span>Tableau de bord</span>
              </a>
            </li>
            <li>
              <a onClick={() => navigate("/profile")}>
                <span className="nav-icon">👤</span>
                <span>Mon profil</span>
              </a>
            </li>
            <li>
              <a onClick={() => navigate("/settings")}>
                <span className="nav-icon">⚙️</span>
                <span>Paramètres</span>
              </a>
            </li>
            <li>
              <a onClick={() => navigate("/historique")}>
                <span className="nav-icon">📋</span>
                <span>Historique</span>
              </a>
            </li>
            <li>
              <a onClick={() => navigate("/statistiques")}>
                <span className="nav-icon">�</span>
                <span>Statistiques</span>
              </a>
            </li>
            <li className="active">
              <a onClick={() => navigate("/analytics-stats")}>
                <span className="nav-icon">👁️</span>
                <span>Vues GA4</span>
              </a>
            </li>
          </ul>
        </nav>

        <div className={isDarkMode ? "sidebar-footer" : "light-sidebar-footer"}>
          <button className={isDarkMode ? "logout-button" : "light-logout-button"} onClick={handleLogout}>
            <span className="nav-icon">🚪</span>
            <span>Déconnexion</span>
          </button>
        </div>
      </div>

      <div className={isDarkMode ? "main-content" : "light-main-content"}>
        <div className={isDarkMode ? "welcome-section" : "light-welcome-section"}>
          <div className={isDarkMode ? "welcome-header" : "light-welcome-header"}>
            <div className="flex items-center gap-4">
              <button className={isDarkMode ? "menu-toggle" : "light-menu-toggle"} onClick={toggleSidebar}>☰</button>
              <h1>Statistiques Google Analytics 4</h1>
            </div>
            <div className={isDarkMode ? "welcome-actions" : "light-welcome-actions"}>
              <button className={isDarkMode ? "theme-toggle-button" : "light-theme-toggle-button"} onClick={toggleTheme}>
                {isDarkMode ? "☀️" : "🌙"}
              </button>
              <div className={isDarkMode ? "user-avatar-small" : "light-user-avatar-small"}>
                {user.username.charAt(0)}
              </div>
            </div>
          </div>
          <p>Analyse détaillée du trafic et des interactions utilisateurs</p>
        </div>

        <div className={isDarkMode ? "stats-container" : "light-stats-container"}>
          <div className={isDarkMode ? "stat-card" : "light-stat-card"} style={{ "--card-color": "#4361EE" }}>
            <div className="stat-tooltip">Nombre total de pages consultées sur les 30 derniers jours (Home, Restaurant, etc.).</div>
            <div className="stat-icon">👁️</div>
            <div className="stat-info">
              <div className="stat-value">{analyticsData.totalViews}</div>
              <div className="stat-label">Vues (30j) <span className="info-icon">ⓘ</span></div>
            </div>
          </div>
          <div className={isDarkMode ? "stat-card" : "light-stat-card"} style={{ "--card-color": "#4ECDC4" }}>
            <div className="stat-tooltip">Nombre de visiteurs uniques ayant interagi avec votre site au moins une fois sur les 30 derniers jours.</div>
            <div className="stat-icon">👥</div>
            <div className="stat-info">
              <div className="stat-value">{analyticsData.summary.activeUsers}</div>
              <div className="stat-label">Utilisateurs Actifs <span className="info-icon">ⓘ</span></div>
            </div>
          </div>
          <div className={isDarkMode ? "stat-card" : "light-stat-card"} style={{ "--card-color": "#FFD166" }}>
            <div className="stat-tooltip">Période pendant laquelle un utilisateur interagit avec votre site. Une session expire après 30 min d'inactivité.</div>
            <div className="stat-icon">🚪</div>
            <div className="stat-info">
              <div className="stat-value">{analyticsData.summary.sessions}</div>
              <div className="stat-label">Sessions <span className="info-icon">ⓘ</span></div>
            </div>
          </div>
          <div className={isDarkMode ? "stat-card" : "light-stat-card"} style={{ "--card-color": "#FF6B6B" }}>
            <div className="stat-tooltip">
              <strong>Taux d'Engagement :</strong> Pourcentage de sessions engagées. 
              Une session est "engagée" si elle dure plus de 10 secondes, enregistre une conversion, ou comporte au moins 2 vues de page.
            </div>
            <div className="stat-icon">🎯</div>
            <div className="stat-info">
              <div className="stat-value">{analyticsData.conversionData.engagementRate}</div>
              <div className="stat-label">Taux d'Engagement <span className="info-icon">ⓘ</span></div>
            </div>
          </div>
        </div>

        <div className="analytics-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '20px', padding: '20px' }}>
          
          {/* Daily Traffic Chart */}
          <div className={isDarkMode ? "chart-card" : "light-chart-card"} style={{ background: isDarkMode ? '#1a1a1a' : '#fff', padding: '20px', borderRadius: '15px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
            <h3 style={{ marginBottom: '20px', color: isDarkMode ? '#fff' : '#333' }}>Trafic Hebdomadaire (Vues & Sessions)</h3>
            <div style={{ width: '100%', height: 300 }}>
              {analyticsData.dailyViews.length > 0 ? (
                <ResponsiveContainer>
                  <BarChart data={analyticsData.dailyViews}>
                    <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? '#333' : '#eee'} />
                    <XAxis dataKey="name" stroke={isDarkMode ? '#888' : '#666'} />
                    <YAxis stroke={isDarkMode ? '#888' : '#666'} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: isDarkMode ? '#1a1a1a' : '#fff', border: 'none', borderRadius: '8px', color: isDarkMode ? '#fff' : '#333' }}
                    />
                    <Bar dataKey="views" name="Vues" fill="#4361EE" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="sessions" name="Sessions" fill="#4ECDC4" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: isDarkMode ? '#888' : '#666' }}>
                  Chargement des données journalières...
                </div>
              )}
            </div>
          </div>

          {/* Traffic Source Distribution */}
          <div className={isDarkMode ? "chart-card" : "light-chart-card"} style={{ background: isDarkMode ? '#1a1a1a' : '#fff', padding: '20px', borderRadius: '15px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
            <h3 style={{ marginBottom: '20px', color: isDarkMode ? '#fff' : '#333' }}>Sources de Trafic</h3>
            <div style={{ width: '100%', height: 300 }}>
              {analyticsData.trafficData.length > 0 ? (
                <ResponsiveContainer>
                  <PieChart>
                    <Pie
                      data={analyticsData.trafficData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      fill="#8884d8"
                      paddingAngle={5}
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {analyticsData.trafficData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: isDarkMode ? '#888' : '#666' }}>
                  Chargement des sources de trafic...
                </div>
              )}
            </div>
          </div>

          {/* Device Distribution */}
          <div className={isDarkMode ? "chart-card" : "light-chart-card"} style={{ background: isDarkMode ? '#1a1a1a' : '#fff', padding: '20px', borderRadius: '15px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
            <h3 style={{ marginBottom: '20px', color: isDarkMode ? '#fff' : '#333' }}>Répartition par Appareil</h3>
            <div style={{ width: '100%', height: 300 }}>
              {analyticsData.deviceData.length > 0 ? (
                <ResponsiveContainer>
                  <PieChart>
                    <Pie
                      data={analyticsData.deviceData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      fill="#8884d8"
                      paddingAngle={5}
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {analyticsData.deviceData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: isDarkMode ? '#888' : '#666' }}>
                  Chargement des données d'appareil...
                </div>
              )}
            </div>
          </div>

          {/* Top Pages */}
          <div className={isDarkMode ? "chart-card" : "light-chart-card"} style={{ background: isDarkMode ? '#1a1a1a' : '#fff', padding: '20px', borderRadius: '15px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', gridColumn: 'span 2' }}>
            <h3 style={{ marginBottom: '20px', color: isDarkMode ? '#fff' : '#333' }}>Pages les plus consultées (30j)</h3>
            <div style={{ width: '100%', height: 300 }}>
              {analyticsData.pageViews.length > 0 ? (
                <ResponsiveContainer>
                  <BarChart data={analyticsData.pageViews} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? '#333' : '#eee'} />
                    <XAxis type="number" stroke={isDarkMode ? '#888' : '#666'} />
                    <YAxis dataKey="name" type="category" width={150} stroke={isDarkMode ? '#888' : '#666'} fontSize={12} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: isDarkMode ? '#1a1a1a' : '#fff', border: 'none', borderRadius: '8px', color: isDarkMode ? '#fff' : '#333' }}
                    />
                    <Bar dataKey="value" name="Vues" fill="#8884d8" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: isDarkMode ? '#888' : '#666' }}>
                  Chargement des pages populaires...
                </div>
              )}
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className={isDarkMode ? "copyright" : "light-copyright"} style={{ textAlign: "center", padding: "15px 0", fontSize: "14px", color: isDarkMode ? "#fff" : "#333", backgroundColor: isDarkMode ? "#222" : "#f8f9fa", width: "100%", marginTop: 'auto' }}>
          <p>© {new Date().getFullYear()} Novotel Tunis Lac. Tous droits réservés.</p>
        </div>
      </div>
    </div>
  )
}

export default AnalyticsStats;
