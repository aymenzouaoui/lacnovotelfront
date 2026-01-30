import React from "react";
import { useNavigate } from "react-router-dom";
import "./NotFoundPage.css";

const translations = {
  fr: {
    title: "Page introuvable",
    code: "404",
    message: "La page que vous recherchez n'existe pas ou a été déplacée.",
    backHome: "Retour à l'accueil",
  },
  en: {
    title: "Page not found",
    code: "404",
    message: "The page you're looking for doesn't exist or has been moved.",
    backHome: "Back to home",
  },
  ar: {
    title: "الصفحة غير موجودة",
    code: "404",
    message: "الصفحة التي تبحث عنها غير موجودة أو تم نقلها.",
    backHome: "العودة للرئيسية",
  },
};

function NotFoundPage() {
  const navigate = useNavigate();
  const lang = (typeof navigator !== "undefined" && navigator.language?.startsWith("fr")) ? "fr" : (navigator.language?.startsWith("ar") ? "ar" : "en");
  const t = translations[lang] || translations.en;

  return (
    <div className="not-found-page">
      <div className="not-found-content">
        <div className="not-found-visual">
          <span className="not-found-code" aria-hidden>{t.code}</span>
          <div className="not-found-icon" aria-hidden>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
              <line x1="12" y1="9" x2="12" y2="13" />
              <line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
          </div>
        </div>
        <h1 className="not-found-title">{t.title}</h1>
        <p className="not-found-message">{t.message}</p>
        <button type="button" className="not-found-btn" onClick={() => navigate("/home")}>
          {t.backHome}
        </button>
      </div>
    </div>
  );
}

export default NotFoundPage;
