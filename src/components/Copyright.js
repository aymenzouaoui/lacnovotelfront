import "./Copyright.css"

const Copyright = ({ translations, currentLanguage, isDarkMode }) => {
  const t = (key) => translations[currentLanguage]?.[key] || translations.fr[key] || key

  const logoSrc = isDarkMode ? "/images/itbafa_logo_white.png" : "/images/itbafa_logo_dark.png"

  return (
    <div className="copyright" dir={currentLanguage === "ar" ? "rtl" : "ltr"}>
      <div className="copyright-inner">
        <p>
          © {new Date().getFullYear()} Novotel Tunis Lac. {t("allRightsReserved")}.
          <br />
          Rue de la Feuille d'Érable - Cité Les Pins - Les Berges du Lac 2, 1053 Tunis, TN
          <br />
          {t("createdBy")}{" "}
          <a href="https://www.itbafa.com" target="_blank" rel="noopener noreferrer" aria-label="ITBAFA Website">
            <img
              src={logoSrc}
              alt="ITBAFA Logo"
              className="copyright-logo"
            />
          </a>
        </p>
      </div>
    </div>
  )
}

export default Copyright
