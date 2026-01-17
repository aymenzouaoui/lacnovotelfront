"use client"

import { useEffect, useState, useRef } from "react"
import API from "../services/api"
 
import "./RestaurantsMenusNew.css"
import "./client-image-fix-dark.css"
import { motion } from "framer-motion"
import { ChevronLeft, ChevronRight } from "lucide-react"


const RestaurantsMenusClient = () => {
  const [restaurants, setRestaurants] = useState([])
  const [selectedRestaurant, setSelectedRestaurant] = useState(null)
  const [menus, setMenus] = useState([])
  const [currentMenuIndex, setCurrentMenuIndex] = useState(0)
  const [currentImageIndex, setCurrentImageIndex] = useState(0) // For image carousel
  const [isLoaded, setIsLoaded] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const bookRef = useRef(null)
  const [showModal, setShowModal] = useState(false)
  const [reservationData, setReservationData] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    from: "",
    to: new Date().toISOString().split("T")[0],
    people: null,
  })
  const [isMobile, setIsMobile] = useState(false)

  const fetchRestaurants = async () => {
    try {
      setIsLoading(true)
      const res = await API.get("/restaurants")
      setRestaurants(res.data)
      setIsLoaded(true)
    } catch (error) {
      console.error("Error fetching restaurants:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const fetchMenus = async (restaurantId) => {
    try {
      setIsLoading(true)
      const res = await API.get("/menus")
      const filteredMenus = res.data.filter(
        (menu) => menu.restaurant?._id === restaurantId || menu.restaurant === restaurantId,
      )
      setMenus(filteredMenus)
      setCurrentMenuIndex(0)
      setCurrentImageIndex(0) // Reset image index when switching menus
    } catch (error) {
      console.error("Error fetching menus:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleReservationSubmit = async () => {
    try {
      const payload = {
        ...reservationData,
        service: "restaurant",
        serviceDetails: selectedRestaurant?.name || "",
        status: "pending",
      }

      await API.post("/reservations", payload)
      alert("Réservation créée avec succès !")
      setShowModal(false)
      setReservationData({
        name: "",
        email: "",
        phoneNumber: "",
        from: "",
        to: new Date().toISOString().split("T")[0],
        people: null,
      })
    } catch (error) {
      console.error("Erreur de réservation:", error)
      alert("Erreur lors de la création de la réservation.")
    }
  }

  useEffect(() => {
    fetchRestaurants()
  }, [])

  useEffect(() => {
    if (!selectedRestaurant) return

    fetchMenus(selectedRestaurant._id)




 

  }, [selectedRestaurant])

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768)
    }

    handleResize() // Check initial size
    window.addEventListener("resize", handleResize)

    return () => window.removeEventListener("resize", handleResize)
  }, [])

  const nextMenu = () => {
    if (currentMenuIndex < menus.length - 1) {
      const menuContainer = document.querySelector(".menu-spread-new")
      if (menuContainer) {
        menuContainer.classList.add("slide-out-left-new")
        setTimeout(() => {
          setCurrentMenuIndex(currentMenuIndex + 1)
          setCurrentImageIndex(0) // Reset image index when changing menu
          menuContainer.classList.remove("slide-out-left-new")
          menuContainer.classList.add("slide-in-right-new")
          setTimeout(() => {
            menuContainer.classList.remove("slide-in-right-new")
          }, 300)
        }, 300)
      } else {
        setCurrentMenuIndex(currentMenuIndex + 1)
        setCurrentImageIndex(0)
      }
    }
  }

  const prevMenu = () => {
    if (currentMenuIndex > 0) {
      const menuContainer = document.querySelector(".menu-spread-new")
      if (menuContainer) {
        menuContainer.classList.add("slide-out-right-new")
        setTimeout(() => {
          setCurrentMenuIndex(currentMenuIndex - 1)
          setCurrentImageIndex(0) // Reset image index when changing menu
          menuContainer.classList.remove("slide-out-right-new")
          menuContainer.classList.add("slide-in-left-new")
          setTimeout(() => {
            menuContainer.classList.remove("slide-in-left-new")
          }, 300)
        }, 300)
      } else {
        setCurrentMenuIndex(currentMenuIndex - 1)
        setCurrentImageIndex(0)
      }
    }
  }

  // Image navigation functions
  const nextImage = () => {
    const currentMenu = menus[currentMenuIndex]
    if (currentMenu && currentMenu.images && currentImageIndex < currentMenu.images.length - 1) {
      setCurrentImageIndex(currentImageIndex + 1)
    }
  }

  const prevImage = () => {
    if (currentImageIndex > 0) {
      setCurrentImageIndex(currentImageIndex - 1)
    }
  }

  const goToImage = (index) => {
    setCurrentImageIndex(index)
  }

  // Restaurant card variants for animation
  const restaurantVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.5,
      },
    }),
  }

  return (
    <div className="hotel-app-new">
      <style jsx>{`
        /* Fixed image dimensions CSS - Smaller size to fit mobile containers */
        .menu-image-carousel-fixed {
          position: relative !important;
          width: 100% !important;
          height: 100% !important;
          display: flex !important;
          flex-direction: column !important;
          align-items: center !important;
          justify-content: center !important;
          gap: 12px !important;
          padding: 12px !important;
        }

        .carousel-container-fixed {
          position: relative !important;
          width: 180px !important;
          height: 140px !important;
          margin: 0 auto 12px auto !important;
          overflow: hidden !important;
          border-radius: 8px !important;
          flex-shrink: 0 !important;
          display: block !important;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1) !important;
        }

        .menu-image-fixed {
          width: 180px !important;
          height: 140px !important;
          min-width: 180px !important;
          min-height: 140px !important;
          max-width: 180px !important;
          max-height: 140px !important;
          object-fit: cover !important;
          object-position: center !important;
          display: block !important;
          border-radius: 8px !important;
          margin: 0 !important;
          padding: 0 !important;
        }

        .menu-image-side-fixed {
          flex: 1 !important;
          position: relative !important;
          background: #f8f9fa !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          padding: 12px !important;
          width: 100% !important;
          overflow: visible !important;
        }

        /* Mobile specific overrides */
        @media (max-width: 768px) {
          .menu-image-carousel-fixed {
            flex-direction: column !important;
            align-items: center !important;
            justify-content: center !important;
            gap: 12px !important;
            padding: 12px !important;
            width: 100% !important;
            min-height: 100% !important;
          }

          .carousel-container-fixed {
            width: 180px !important;
            height: 140px !important;
            margin: 0 auto 12px auto !important;
            flex-shrink: 0 !important;
            overflow: hidden !important;
            display: block !important;
          }

          .menu-image-fixed {
            width: 180px !important;
            height: 140px !important;
            min-width: 180px !important;
            min-height: 140px !important;
            max-width: 180px !important;
            max-height: 140px !important;
            object-fit: cover !important;
            object-position: center !important;
            display: block !important;
            margin: 0 !important;
            padding: 0 !important;
          }

          .menu-image-side-fixed {
            width: 100% !important;
            height: auto !important;
            min-height: auto !important;
            max-height: none !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            overflow: visible !important;
          }
        }

        /* Very small screens - even smaller images */
        @media (max-width: 480px) {
          .carousel-container-fixed {
            width: 160px !important;
            height: 120px !important;
            margin: 0 auto 10px auto !important;
          }

          .menu-image-fixed {
            width: 160px !important;
            height: 120px !important;
            min-width: 160px !important;
            min-height: 120px !important;
            max-width: 160px !important;
            max-height: 120px !important;
          }
        }

        /* Extra small screens */
        @media (max-width: 360px) {
          .carousel-container-fixed {
            width: 140px !important;
            height: 100px !important;
            margin: 0 auto 8px auto !important;
          }

          .menu-image-fixed {
            width: 140px !important;
            height: 100px !important;
            min-width: 140px !important;
            min-height: 100px !important;
            max-width: 140px !important;
            max-height: 100px !important;
          }
        }
      `}</style>

      <header className="app-header-new">
        <button
          className="header-back-link-new"
          onClick={() => {
            if (selectedRestaurant) {
              setSelectedRestaurant(null)
              setMenus([])
              setCurrentMenuIndex(0)
              setCurrentImageIndex(0)
            } else {
              window.location.href = "/Home"
            }
          }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M19 12H5M5 12L12 19M5 12L12 5"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          Retour
        </button>
        <div className="logo-container-new">
          <img src="/images/logo2.png" alt="Novotel Logo" className="logo-new" />
        </div>
        <div></div>
      </header>

      <main className="app-main-new">
        {!selectedRestaurant ? (
          <>
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="welcome-banner-new"
            >
              <h1>
                <span>Restaurants</span> & Menus
              </h1>
              <p>Découvrez nos restaurants et leurs spécialités culinaires</p>
            </motion.div>

            {isLoading ? (
              <div className="loading-container-new">
                <div className="loading-spinner-new"></div>
                <p>Chargement des restaurants...</p>
              </div>
            ) : (
              <div className="restaurants-grid-new">
                {restaurants.map((restaurant, index) => (
                  <motion.div
                    key={restaurant._id}
                    className="restaurant-card-new"
                    custom={index}
                    variants={restaurantVariants}
                    initial="hidden"
                    animate="visible"
                    whileHover={{
                      y: -10,
                      boxShadow: "0 15px 30px rgba(0, 71, 171, 0.2)",
                      borderColor: "var(--primary)",
                    }}
                  >
                    <div className="restaurant-card-image-new">
                      <img
                        src={restaurant.image || "/placeholder.svg"}
                        alt={restaurant.name}
                        onError={(e) => (e.target.src = "/placeholder.svg")}
                      />
                    </div>

                    <div className="restaurant-card-content-new">
                      <h3 className="restaurant-card-title-new">{restaurant.name}</h3>
                      <p className="restaurant-card-description-new">{restaurant.description}</p>

                      <div className="restaurant-card-buttons-new">
                        <button
                          className="view-menu-button-new"
                          onClick={(e) => {
                            e.stopPropagation()
                            setSelectedRestaurant(restaurant)
                          }}
                        >
                          Voir le menu
                        </button>
                        <button
                          className="reserve-button-new"
                          onClick={(e) => {
                            e.stopPropagation()
                            setShowModal(true)
                          }}
                        >
                          Réserver une table
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </>
        ) : (
          <>
            {isLoading ? (
              <div className="loading-container-new">
                <div className="loading-spinner-new"></div>
                <p>Chargement des menus...</p>
              </div>
            ) : menus.length === 0 ? (
              <div className="empty-state-new">
                <div className="empty-icon-new">🍽️</div>
                <h3>Aucun menu disponible</h3>
                <p>Revenez bientôt pour découvrir nos menus</p>
              </div>
            ) : (
              <div className="menu-display-container-new">
                {currentMenuIndex >= 0 && currentMenuIndex < menus.length && (
                  <div className="menu-spread-new" ref={bookRef}>
                    <div className="menu-content-new">
                      {/* Left side - Menu Images with Carousel */}
                      <div className={`menu-image-side-new ${isMobile ? "menu-image-side-fixed" : ""}`}>
                        {menus[currentMenuIndex].images && menus[currentMenuIndex].images.length > 0 ? (
                          <div
                            className={`menu-image-carousel-new menu-image-carousel-new-dark ${isMobile ? "menu-image-carousel-fixed" : ""}`}
                          >
                            {isMobile ? (
                              // Small screens: Show all images vertically with fixed dimensions
                              menus[currentMenuIndex].images.map((image, index) => (
                                <div key={index} className="carousel-container-fixed">
                                  <img
                                    src={image || "/placeholder.svg"}
                                    alt={`${menus[currentMenuIndex].title} - Image ${index + 1}`}
                                    className="menu-image-fixed"
                                    onError={(e) => (e.target.src = "/placeholder.svg")}
                                  />
                                </div>
                              ))
                            ) : (
                              // Large screens: Show carousel with navigation
                              <>
                                <div className="carousel-container-new carousel-container-new-dark">
                                  <img
                                    src={menus[currentMenuIndex].images[currentImageIndex] || "/placeholder.svg"}
                                    alt={`${menus[currentMenuIndex].title} - Image ${currentImageIndex + 1}`}
                                    className="menu-image-new menu-image-new-dark"
                                    onError={(e) => (e.target.src = "/placeholder.svg")}
                                  />

                                  {/* Navigation arrows - only on large screens */}
                                  {menus[currentMenuIndex].images.length > 1 && (
                                    <>
                                      <button
                                        className="image-nav-btn-new image-nav-btn-new-dark prev-image-new prev-image-new-dark"
                                        onClick={prevImage}
                                        disabled={currentImageIndex === 0}
                                        aria-label="Image précédente"
                                      >
                                        <ChevronLeft className="h-4 w-4" />
                                      </button>
                                      <button
                                        className="image-nav-btn-new image-nav-btn-new-dark next-image-new next-image-new-dark"
                                        onClick={nextImage}
                                        disabled={currentImageIndex === menus[currentMenuIndex].images.length - 1}
                                        aria-label="Image suivante"
                                      >
                                        <ChevronRight className="h-4 w-4" />
                                      </button>
                                    </>
                                  )}

                                  {/* Image counter - only on large screens */}
                                  {menus[currentMenuIndex].images.length > 1 && (
                                    <div className="image-counter-new image-counter-new-dark">
                                      {currentImageIndex + 1} / {menus[currentMenuIndex].images.length}
                                    </div>
                                  )}
                                </div>

                                {/* Image dots indicator - only on large screens */}
                                {menus[currentMenuIndex].images.length > 1 && (
                                  <div className="image-dots-new image-dots-new-dark">
                                    {menus[currentMenuIndex].images.map((_, index) => (
                                      <button
                                        key={index}
                                        className={`image-dot-new image-dot-new-dark ${index === currentImageIndex ? "active" : ""}`}
                                        onClick={() => goToImage(index)}
                                        aria-label={`Aller à l'image ${index + 1}`}
                                      />
                                    ))}
                                  </div>
                                )}
                              </>
                            )}
                          </div>
                        ) : (
                          <div className="menu-image-placeholder-new">
                            <span>{menus[currentMenuIndex].title}</span>
                          </div>
                        )}
                      </div>

                      {/* Right side - Menu Items */}
                      <div className="menu-items-side-new">
                        <h2 className="menu-title-new">{menus[currentMenuIndex].title}</h2>

                        {menus[currentMenuIndex].items?.length > 0 ? (
                          <div className="menu-items-list-new">
                            {menus[currentMenuIndex].items.map((item, idx) => (
                              <div key={idx} className="menu-item-new">
                                <div className="menu-item-header-new">
                                  <h3 className="menu-item-name-new">{item.name}</h3>
                                  <div className="menu-item-price-new">{item.price} TND</div>
                                </div>
                                <p className="menu-item-description-new">{item.description}</p>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="empty-menu-new">
                            <p>Aucun plat disponible dans ce menu</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                <div className="menu-navigation-new">
                  <button
                    className="nav-button-new prev"
                    onClick={prevMenu}
                    disabled={currentMenuIndex === 0}
                    aria-label="Menu précédent"
                  >
                    <ChevronLeft className="h-6 w-6" />
                  </button>

                  <button
                    className="nav-button-new next"
                    onClick={nextMenu}
                    disabled={currentMenuIndex === menus.length - 1}
                    aria-label="Menu suivant"
                  >
                    <ChevronRight className="h-6 w-6" />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </main>

      <footer className="app-footer">
        <div className="footer-content">
          <div className="footer-section">
            <h4>Contact</h4>
            <p>+216 71 142 900</p>
            <p>H6145@accor.com</p>
          </div>
          <div className="footer-section">
            <h4>Adresse</h4>
            <p>Avenue Mohamed V</p>
            <p>Tunis, Tunisie</p>
          </div>
          <div className="footer-section">
            <h4>Réservations</h4>
            <p>+216 71 142 900</p>
            <p>H6145@accor.com</p>
          </div>
          <div className="footer-section">
            <h4>Wi-Fi</h4>
            <p>Réseau: NOVOTEL_GUEST</p>
            <p>Mot de passe: Disponible à la réception</p>
          </div>
          <div className="footer-section">
            <h4>Suivez-nous</h4>
            <div className="social-links">
              <a href="https://www.facebook.com/NovotelTunis" aria-label="Facebook">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                </svg>
              </a>
              <a href="https://www.instagram.com/novotel.tunis" aria-label="Instagram">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                </svg>
              </a>
               
            </div>
          </div>
        </div>
        <div className="copyright">
          <p>
            © {new Date().getFullYear()} Novotel Tunis. Tous droits réservés.
            <br />
            Créé par{" "}
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

      {showModal && (
        <div className="modal-backdrop">
          <div className="modal">
            <h2>Réserver une table</h2>
            <input
              type="text"
              placeholder="Nom"
              value={reservationData.name}
              onChange={(e) => setReservationData({ ...reservationData, name: e.target.value })}
              required
            />
            <input
              type="email"
              placeholder="Email"
              value={reservationData.email}
              onChange={(e) => setReservationData({ ...reservationData, email: e.target.value })}
              required
            />
            <input
              type="tel"
              placeholder="Numéro de téléphone"
              value={reservationData.phoneNumber}
              onChange={(e) => setReservationData({ ...reservationData, phoneNumber: e.target.value })}
              required
            />
            <input
              type="datetime-local"
              value={reservationData.from}
              onChange={(e) => setReservationData({ ...reservationData, from: e.target.value })}
              required
            />
            <input
              type="number"
              min="1"
              placeholder="Nombre de personnes"
              value={reservationData.people}
              onChange={(e) => setReservationData({ ...reservationData, people: e.target.value })}
              required
            />
            <div className="modal-actions-new">
              <button onClick={handleReservationSubmit}>✅ Réserver</button>
              <button onClick={() => setShowModal(false)}>❌ Annuler</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default RestaurantsMenusClient
