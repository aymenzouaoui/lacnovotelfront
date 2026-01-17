"use client"

import { useEffect, useState } from "react"
import API from "../services/api"
import translations from "../services/translations"
import { formatTimeOnly } from "../services/utils"
import { Facebook, Instagram } from "lucide-react"
import "./LoisirsClient.css"

const LoisirsClient = () => {
  const [loisirs, setLoisirs] = useState([])
  const [isLoaded, setIsLoaded] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [currentLanguage, setCurrentLanguage] = useState("fr")
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false)

  // Get translation function
  const t = (key) => translations[currentLanguage][key] || translations.fr[key] || key

  const fetchLoisirs = async () => {
    try {
      setIsLoading(true)
      const res = await API.get("/loisirs")
      setLoisirs(res.data)
      setIsLoaded(true)
    } catch (error) {
      console.error("Erreur chargement des loisirs:", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchLoisirs()
    window.scrollTo(0, 0)

    const savedLanguage = localStorage.getItem("novotel-language")
    if (savedLanguage && translations[savedLanguage]) {
      setCurrentLanguage(savedLanguage)
      document.documentElement.dir = savedLanguage === "ar" ? "rtl" : "ltr"
      document.documentElement.lang = savedLanguage
    }

    const timer = setTimeout(() => {
      setIsLoaded(true)
    }, 100)

    return () => {
      clearTimeout(timer)
    }
  }, [])

  const scrollToLoisir = (loisirId) => {
    const element = document.getElementById(`loisir-${loisirId}`)
    if (element) {
      const offset = 100 // Offset for fixed header
      const elementPosition = element.getBoundingClientRect().top + window.pageYOffset
      window.scrollTo({
        top: elementPosition - offset,
        behavior: "smooth",
      })
    }
  }

  return (
    <div className={`hotel-app4 ${currentLanguage === "ar" ? "rtl" : "ltr"}`}>
      <style jsx>{`
        /* Updated header section to position "Get Informed" text inside the image */
        .loisir-header-container {
          position: relative;
          width: 100%;
          height: 300px;
        }

        .loisir-header-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }

        .get-informed-overlay {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          padding: 30px 20px;
          background: linear-gradient(to top, rgba(0, 0, 0, 0.5), transparent);
        }

        .get-informed-title {
          font-size: 2.5rem;
          font-weight: 700;
          margin: 0;
          color: white;
          text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
          text-align: left;
        }

        /* Updated navigation tabs to scroll horizontally without wrapping */
        .loisir-nav-tabs {
          display: flex;
          gap: 15px;
          padding: 20px;
          background: white;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          overflow-x: auto;
          overflow-y: hidden;
          white-space: nowrap;
          -webkit-overflow-scrolling: touch;
          scrollbar-width: thin;
          scrollbar-color: #1f22aa #f1f1f1;
        }

        .loisir-nav-tabs::-webkit-scrollbar {
          height: 8px;
        }

        .loisir-nav-tabs::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 4px;
        }

        .loisir-nav-tabs::-webkit-scrollbar-thumb {
          background: #1f22aa;
          border-radius: 4px;
        }

        .loisir-nav-tabs::-webkit-scrollbar-thumb:hover {
          background: #1f22aa;
        }

        .loisir-nav-tab {
          padding: 12px 24px;
          background: #1f22aa;
          color: white;
          border: none;
          border-radius: 25px;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 4px 6px rgba(102, 126, 234, 0.3);
          flex-shrink: 0;
          white-space: nowrap;
        }

        .loisir-nav-tab:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 12px rgba(102, 126, 234, 0.4);
        }

        .loisir-nav-tab:active {
          transform: translateY(0);
        }

        .loisir-section {
          padding: 40px 20px;
          max-width: 1200px;
          margin: 0 auto;
        }

        .loisir-section:nth-child(even) {
          background: #f8f9fa;
        }

        .loisir-section-title {
          font-size: 2rem;
          font-weight: 700;
          color: #1f22aa;
          margin-bottom: 20px;
          text-align: center;
          padding-bottom: 10px;
          border-bottom: 3px solid #1f22aa;
        }

        .loisir-content {
          display: flex;
          gap: 30px;
          align-items: center;
          flex-wrap: wrap;
        }

        .loisir-image-container {
          flex: 1;
          min-width: 300px;
        }

        .loisir-image {
          width: 100%;
          height: 400px;
          object-fit: cover;
          border-radius: 12px;
          box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);
        }

        .loisir-details {
          flex: 1;
          min-width: 300px;
        }

        .loisir-description {
          font-size: 1.1rem;
          line-height: 1.8;
          color: #333;
          margin-bottom: 20px;
        }

        .loisir-hours {
          background: linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%);
          border-radius: 12px;
          padding: 20px;
          border-left: 5px solid #1f22aa;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
        }

        .loisir-hours-title {
          font-size: 1.2rem;
          font-weight: 600;
          color: #1e293b;
          margin-bottom: 15px;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .loisir-hours-content {
          display: flex;
          gap: 20px;
          justify-content: center;
        }

        .loisir-hour-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 6px;
          padding: 12px 20px;
          background: white;
          border-radius: 8px;
          border: 1px solid #e2e8f0;
        }

        .loisir-hour-label {
          font-size: 0.875rem;
          color: #64748b;
          font-weight: 500;
          text-transform: uppercase;
        }

        .loisir-hour-value {
          font-size: 1.25rem;
          color: #1e293b;
          font-weight: 700;
          font-family: 'Courier New', monospace;
        }

        @media (max-width: 768px) {
          .loisir-header-container {
            height: 200px;
          }

          .get-informed-title {
            font-size: 1.8rem;
          }

          .loisir-nav-tabs {
            padding: 15px;
            gap: 10px;
          }

          .loisir-nav-tab {
            padding: 10px 20px;
            font-size: 0.9rem;
          }

          .loisir-content {
            flex-direction: column;
          }

          .loisir-image {
            height: 250px;
          }

          .loisir-hours-content {
            flex-direction: column;
            gap: 12px;
          }

          .loisir-hour-item {
            width: 100%;
          }
        }

        .rtl .loisir-section-title,
        .rtl .get-informed-title {
          text-align: center;
        }

        .rtl .get-informed-title {
          text-align: right;
        }

        .rtl .loisir-description {
          text-align: right;
        }

        .rtl .loisir-hours {
          border-left: none;
          border-right: 5px solid #1f22aa;
        }
      `}</style>

      <header className="app-header">
        <button
          className="header-back-link"
          onClick={() => {
            window.location.href = "/Home"
          }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d={currentLanguage === "ar" ? "M5 12H19M19 12L12 5M19 12L12 19" : "M19 12H5M5 12L12 19M5 12L12 5"}
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          {t("back")}
        </button>
        <div className="logo-container">
          <img src="/images/logo2.png" alt="Novotel Logo" className="logo" />
        </div>
        <div></div>
      </header>

      <main className="app-main">
        <div className="loisir-header-container">
          <img
            src="/images/loisir_header.png"
            alt="Loisirs Header"
            className="loisir-header-image"
            onError={(e) => {
              e.target.src =
                "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-Pd5mRsaGJHBNeLgK1sr3fjJT0MW39D.png"
            }}
          />
          <div className="get-informed-overlay">
            <h1 className="get-informed-title">{t("getInformed")}</h1>
          </div>
        </div>

        {!isLoading && loisirs.length > 0 && (
          <div className="loisir-nav-tabs">
            {loisirs.map((loisir) => (
              <button key={loisir._id} className="loisir-nav-tab" onClick={() => scrollToLoisir(loisir._id)}>
                {loisir.name}
              </button>
            ))}
          </div>
        )}

        <div className="content-container">
          {isLoading ? (
            <div className="loading-container">
            </div>
          ) : loisirs.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">🔍</div>
              <h3>{t("noServiceFound")}</h3>
              <p>{t("comeBackSoonActivities")}</p>
            </div>
          ) : (
            <>
              {loisirs.map((loisir) => (
                <div key={loisir._id} id={`loisir-${loisir._id}`} className="loisir-section">
                  <h2 className="loisir-section-title">{loisir.name}</h2>
                  <div className="loisir-content">
                    <div className="loisir-image-container">
                      <img
                        src={loisir.image || "/placeholder.svg"}
                        alt={loisir.name}
                        className="loisir-image"
                        onError={(e) => {
                          e.target.src = `/placeholder.svg?height=400&width=500&text=${loisir.name}`
                        }}
                      />
                    </div>
                    <div className="loisir-details">
                      <p className="loisir-description">{loisir.description || t("noDescriptionAvailable")}</p>
                      <div className="loisir-hours">
                        <div className="loisir-hours-title">
                          <span className="time-icon">🕒</span>
                          {t("openingHours")}
                        </div>
                        <div className="loisir-hours-content">
                          <div className="loisir-hour-item">
                            <span className="loisir-hour-label">{t("opening")}</span>
                            <span className="loisir-hour-value">{formatTimeOnly(loisir.ouverture)}</span>
                          </div>
                          <div className="loisir-hour-item">
                            <span className="loisir-hour-label">{t("closing")}</span>
                            <span className="loisir-hour-value">{formatTimeOnly(loisir.fermeture)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </>
          )}
        </div>
      </main>

      <footer className="app-footer">
        <div className="footer-content">
          <div className="footer-section">
            <h4>{t("contact")}</h4>
            <p>+216 71 142 900</p>
            <p>H6145@accor.com</p>
          </div>
          <div className="footer-section">
            <h4>{t("address")}</h4>
            <p>{t("addressLine1")}</p>
            <p>{t("addressLine2")}</p>
          </div>
          <div className="footer-section">
            <h4>{t("reservations")}</h4>
            <p>+216 71 142 900</p>
            <p>H6145@accor.com</p>
          </div>
          <div className="footer-section">
            <h4>{t("wifi")}</h4>
            <p>
              {t("password")}: {t("availableAtReception")}
            </p>
          </div>
          <div className="footer-section">
            <h4>{t("followUs")}</h4>
            <div className="social-links">
              <a href="https://www.facebook.com/NovotelTunis" aria-label="Facebook">
                <Facebook width="24" height="24" />
              </a>
              <a href="https://www.instagram.com/novotel.tunis" aria-label="Instagram">
                <Instagram width="24" height="24" />
              </a>
            </div>
          </div>
        </div>
        <div className="copyright">
          <p>
            © {new Date().getFullYear()} Novotel Tunis. {t("allRightsReserved")}.
            <br />
            {t("createdBy")}{" "}
            <a href="https://www.itbafa.com" target="_blank" rel="noopener noreferrer">
              <img
                src="/images/itbafa_logo_white.png"
                alt="ITBAFA Logo"
                style={{ height: "20px", verticalAlign: "middle", marginLeft: "5px" }}
              />
            </a>
          </p>
        </div>
      </footer>
    </div>
  )
}

export default LoisirsClient
