import { useLocation } from "react-router-dom"
import "./FooterNavigation.css"

const FooterNavigation = ({ translations, currentLanguage }) => {
  const location = useLocation()
  const t = (key) => translations[currentLanguage]?.[key] || translations.fr[key] || key

  const navItems = [
    {
      path: "/home",
      label: t("home"),
      icon: (
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <polyline
            points="9 22 9 12 15 12 15 22"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ),
    },
    {
      path: "/RestaurantsMenus-client",
      label: t("restaurants"),
      icon: (
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2M7 2v20M21 15V2a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ),
    },
    {
      path: "/boissons-client",
      label: t("bar"),
      icon: (
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M5 12V7a1 1 0 0 1 1-1h4l2-3h2l2 3h4a1 1 0 0 1 1 1v5M5 12l1.5 6h11L19 12M5 12h14"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ),
    },
    {
      path: "/loisirs-client",
      label: t("services"),
      icon: (
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M12 2L2 7l10 5 10-5M2 17l10 5 10-5M2 12l10 5 10-5"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ),
    },
    {
      path: "/spas-client",
      label: t("spa"),
      icon: (
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M12 3a6.364 6.364 0 0 0 9 9 9 9 0 1 1-9-9Z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ),
    },
    {
      path: null,
      label: t("feedback"),
      icon: (
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ),
      onClick: () => window.open("https://tinyurl.com/28npzs5f", "_blank"),
    },
  ]

  const isActive = (path) => {
    if (!path) return false
    // Handle home route specially
    if (path === "/home" && (location.pathname === "/" || location.pathname === "/home")) {
      return true
    }
    return location.pathname === path
  }

  return (
    <footer className="novotel-v2-footer">
      {navItems.map((item, index) => {
        if (item.onClick) {
          return (
            <button
              key={index}
              type="button"
              className="novotel-v2-nav-item"
              onClick={item.onClick}
              aria-label={item.label}
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          )
        }
        return (
          <a
            key={index}
            href={item.path}
            className={`novotel-v2-nav-item ${isActive(item.path) ? "active" : ""}`}
            aria-label={item.label}
          >
            {item.icon}
            <span>{item.label}</span>
          </a>
        )
      })}
    </footer>
  )
}

export default FooterNavigation
