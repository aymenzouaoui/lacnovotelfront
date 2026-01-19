import "./Copyright.css"

const Copyright = ({ translations, currentLanguage }) => {
  const t = (key) => translations[currentLanguage]?.[key] || translations.fr[key] || key

  return (
    <div className="copyright">
      <p>
        © {new Date().getFullYear()} Novotel Tunis Lac. {t("allRightsReserved")}.
        <br />
        Rue de la Feuille d'Érable - Cité Les Pins - Les Berges du Lac 2, 1053 Tunis, TN
        <br />
        {t("createdBy")}{" "}
        <a href="https://www.itbafa.com" target="_blank" rel="noopener noreferrer" aria-label="ITBAFA Website">
          <img
            src="/images/itbafa_logo_dark.png"
            alt="ITBAFA Logo"
            className="copyright-logo"
          />
        </a>
      </p>
    </div>
  )
}

export default Copyright
