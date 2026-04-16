import { useTheme } from "../context/ThemeContext"

const ThemeToggle = () => {
  const { isDark, toggleTheme } = useTheme()

  return (
    <button
      onClick={toggleTheme}
      title={isDark ? "Passer en mode clair" : "Passer en mode sombre"}
      aria-label={isDark ? "Passer en mode clair" : "Passer en mode sombre"}
      style={{
        position:        "relative",
        display:         "inline-flex",
        alignItems:      "center",
        width:           "52px",
        height:          "28px",
        borderRadius:    "14px",
        border:          isDark
                           ? "1.5px solid rgba(79,158,255,0.35)"
                           : "1.5px solid rgba(0,0,0,0.12)",
        background:      isDark
                           ? "linear-gradient(135deg, #1a2c46, #0d1421)"
                           : "linear-gradient(135deg, #e0e7ff, #f0f4ff)",
        cursor:          "pointer",
        padding:         0,
        flexShrink:      0,
        boxShadow:       isDark
                           ? "0 0 0 1px rgba(79,158,255,0.15), 0 2px 8px rgba(0,0,0,0.5)"
                           : "0 1px 4px rgba(0,0,0,0.12), inset 0 1px 2px rgba(255,255,255,0.8)",
        transition:      "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
      }}
    >
      {/* Track icons */}
      <span style={{
        position:   "absolute",
        left:       "5px",
        fontSize:   "11px",
        lineHeight: 1,
        opacity:    isDark ? 1 : 0,
        transition: "opacity 0.2s ease",
        userSelect: "none",
      }}>🌙</span>
      <span style={{
        position:   "absolute",
        right:      "5px",
        fontSize:   "11px",
        lineHeight: 1,
        opacity:    isDark ? 0 : 1,
        transition: "opacity 0.2s ease",
        userSelect: "none",
      }}>☀️</span>

      {/* Sliding circle */}
      <span style={{
        position:     "absolute",
        top:          "3px",
        left:         isDark ? "26px" : "3px",
        width:        "20px",
        height:       "20px",
        borderRadius: "50%",
        background:   isDark
                        ? "linear-gradient(135deg, #4f9eff, #2d7de8)"
                        : "linear-gradient(135deg, #fff, #f0f4ff)",
        boxShadow:    isDark
                        ? "0 1px 6px rgba(79,158,255,0.5)"
                        : "0 1px 4px rgba(0,0,0,0.2)",
        transition:   "left 0.3s cubic-bezier(0.4, 0, 0.2, 1), background 0.3s ease",
      }} />
    </button>
  )
}

export default ThemeToggle
