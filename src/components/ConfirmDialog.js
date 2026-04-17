/**
 * ConfirmDialog – modal asking the user to confirm a destructive action.
 * Props:
 *   open     {bool}   – whether dialog is visible
 *   message  {string} – question to display
 *   onConfirm {fn}    – called when user clicks "Confirmer"
 *   onCancel  {fn}    – called when user clicks "Annuler" or overlay
 */
const ConfirmDialog = ({ open, message, onConfirm, onCancel }) => {
  if (!open) return null

  return (
    <div
      onClick={onCancel}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 99998,
        background: "rgba(0,0,0,0.55)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backdropFilter: "blur(4px)",
        animation: "cfOverlayIn 0.2s ease",
        fontFamily: "'Inter','Segoe UI',sans-serif",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "linear-gradient(135deg,#1e293b 0%,#334155 100%)",
          border: "1px solid #475569",
          borderRadius: "20px",
          padding: "2.5rem 2rem",
          maxWidth: "420px",
          width: "90%",
          boxShadow: "0 20px 60px rgba(0,0,0,0.4)",
          animation: "cfBoxIn 0.25s ease",
          textAlign: "center",
        }}
      >
        <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🗑️</div>
        <h3 style={{
          color: "#f1f5f9",
          fontSize: "1.25rem",
          fontWeight: 700,
          marginBottom: "0.75rem",
        }}>Confirmer la suppression</h3>
        <p style={{
          color: "#94a3b8",
          fontSize: "0.95rem",
          marginBottom: "2rem",
          lineHeight: 1.6,
        }}>{message}</p>
        <div style={{ display: "flex", gap: "1rem", justifyContent: "center" }}>
          <button
            onClick={onCancel}
            style={{
              padding: "0.75rem 1.75rem",
              borderRadius: "12px",
              border: "2px solid #475569",
              background: "transparent",
              color: "#94a3b8",
              fontSize: "0.95rem",
              fontWeight: 600,
              cursor: "pointer",
              transition: "all 0.2s",
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = "#64748b"; e.currentTarget.style.color = "#f1f5f9" }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = "#475569"; e.currentTarget.style.color = "#94a3b8" }}
          >
            Annuler
          </button>
          <button
            onClick={onConfirm}
            style={{
              padding: "0.75rem 1.75rem",
              borderRadius: "12px",
              border: "none",
              background: "linear-gradient(45deg,#ef4444,#dc2626)",
              color: "#fff",
              fontSize: "0.95rem",
              fontWeight: 600,
              cursor: "pointer",
              boxShadow: "0 4px 12px rgba(239,68,68,0.35)",
              transition: "all 0.2s",
            }}
            onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 8px 20px rgba(239,68,68,0.45)" }}
            onMouseLeave={e => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = "0 4px 12px rgba(239,68,68,0.35)" }}
          >
            Supprimer
          </button>
        </div>
      </div>
      <style>{`
        @keyframes cfOverlayIn { from{opacity:0} to{opacity:1} }
        @keyframes cfBoxIn { from{opacity:0;transform:scale(0.92)} to{opacity:1;transform:scale(1)} }
      `}</style>
    </div>
  )
}

export default ConfirmDialog
