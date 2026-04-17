import { useEffect } from "react"

/**
 * Toast – lightweight success/error notification popup.
 * Props:
 *   message  {string}  – text to display
 *   type     {"success"|"error"|"info"}
 *   onClose  {fn}      – called after duration or when user clicks ×
 *   duration {number}  – ms before auto-close (default 3000)
 */
const Toast = ({ message, type = "success", onClose, duration = 3000 }) => {
  useEffect(() => {
    if (!message) return
    const t = setTimeout(onClose, duration)
    return () => clearTimeout(t)
  }, [message, onClose, duration])

  if (!message) return null

  const colors = {
    success: { bg: "linear-gradient(45deg,#10b981,#059669)", icon: "✅" },
    error:   { bg: "linear-gradient(45deg,#ef4444,#dc2626)", icon: "❌" },
    info:    { bg: "linear-gradient(45deg,#ec4899,#8b5cf6)", icon: "ℹ️" },
  }
  const { bg, icon } = colors[type] || colors.info

  return (
    <div style={{
      position: "fixed",
      bottom: "2rem",
      right: "2rem",
      zIndex: 99999,
      background: bg,
      color: "#fff",
      padding: "1rem 1.5rem",
      borderRadius: "14px",
      boxShadow: "0 8px 30px rgba(0,0,0,0.25)",
      display: "flex",
      alignItems: "center",
      gap: "0.75rem",
      minWidth: "260px",
      maxWidth: "380px",
      animation: "toastSlideIn 0.3s ease",
      fontFamily: "'Inter','Segoe UI',sans-serif",
      fontSize: "0.95rem",
      fontWeight: 500,
    }}>
      <span style={{ fontSize: "1.3rem" }}>{icon}</span>
      <span style={{ flex: 1 }}>{message}</span>
      <button
        onClick={onClose}
        style={{
          background: "rgba(255,255,255,0.25)",
          border: "none",
          borderRadius: "50%",
          width: "24px",
          height: "24px",
          cursor: "pointer",
          color: "#fff",
          fontSize: "1rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >×</button>
      <style>{`
        @keyframes toastSlideIn {
          from { opacity:0; transform:translateY(20px); }
          to   { opacity:1; transform:translateY(0); }
        }
      `}</style>
    </div>
  )
}

export default Toast
