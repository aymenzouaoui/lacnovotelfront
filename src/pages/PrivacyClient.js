"use client"

import { useState, useEffect } from "react"

const PolicyClient = () => {
  const [currentLanguage, setCurrentLanguage] = useState("fr")
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false)

  const languages = [
    { code: "fr", name: "Français", flag: "/images/fr-flag-v2.png" },
    { code: "en", name: "English", flag: "/images/en-flag-v2.png" },
    { code: "ar", name: "العربية", flag: "/images/ar-flag-v2.png" },
  ]

  const translations = {
    fr: {
      back: "Retour",
      title: "Les initiatives de Novotel en faveur du développement durable",
      subtitle:
        "Avec 600 hôtels répartis dans 68 pays et un réseau en pleine expansion, Novotel s'engage pour la protection de l'environnement, en particulier pour la préservation des océans, conformément aux quatre piliers de son Plan d'impact positif :",
      pillar1Title: "Réduire l'empreinte carbone",
      pillar1Text:
        "mettre en œuvre des plans d'action pour limiter au minimum l'utilisation de plastique, la consommation d'eau et les émissions de gaz à effet de serre",
      pillar2Title: "Promouvoir des choix alimentaires durables",
      pillar2Text:
        "repenser la restauration et les boissons afin de réduire la consommation de viande et de poisson, de minimiser le gaspillage alimentaire et d'adopter des politiques durables concernant les produits de la mer",
      pillar3Title: "Renforcer l'éducation et la sensibilisation à la protection des océans",
      pillar3Text:
        "sensibiliser les clients, le personnel et les communautés locales à l'importance de préserver les océans et aux gestes à adopter pour y contribuer de manière positive",
      pillar4Title: "Contribuer à la recherche et à l'innovation",
      pillar4Text:
        "faire progresser les connaissances scientifiques et les technologies qui favorisent la santé des océans en s'associant à des ONG et en investissant dans des innovations plus durables",
      partnershipTitle: "Zoom sur le partenariat entre Novotel et le WWF",
      partnershipText1:
        "Au cœur de l'engagement de Novotel en matière de développement durable se trouve son partenariat avec le WWF (World Wide Fund for Nature). Lancée en 2024 pour une durée de trois ans, cette collaboration vise à protéger le milieu marin grâce à un approvisionnement responsable en produits de la mer, à une sensibilisation des clients et à la promotion de bonnes pratiques au sein de l'industrie hôtelière.",
      partnershipText2:
        "Ce partenariat permet de financer plusieurs projets clés du WWF, notamment la protection de la posidonie, une plante sous-marine essentielle en Méditerranée, qui agit comme un puits de carbone naturel, ou encore la récupération des « engins fantômes », ces filets de pêche abandonnés qui menacent la faune marine.",
      partnershipText3:
        "Il soutient également le bateau Blue Panda du WWF France, qui parcourt la Méditerranée pour mener des missions de recherche et de sensibilisation du public, ainsi que la protection des tortues de mer en Asie-Pacifique et dans l'Atlantique Ouest.",
      callToAction:
        "Pour votre prochain voyage, n'hésitez pas à élargir vos critères habituels et recherchez des établissements en accord avec vos valeurs. En choisissant un hôtel engagé dans une démarche responsable, vous donnez plus de sens à votre voyage.",
      contact: "Contact",
      address: "Adresse",
      reservations: "Réservations",
      wifi: "Wi-Fi",
      network: "Réseau",
      password: "Mot de passe",
      availableAtReception: "Disponible à la réception",
      followUs: "Suivez-nous",
      allRightsReserved: "Tous droits réservés",
      createdBy: "Créé par",
      addressLine1: "Avenue Mohamed V",
      addressLine2: "1002 Tunis, Tunisie",
    },
    en: {
      back: "Back",
      title: "Novotel's Sustainable Development Initiatives",
      subtitle:
        "With 600 hotels across 68 countries and an expanding network, Novotel is committed to environmental protection, particularly ocean preservation, in accordance with the four pillars of its Positive Impact Plan:",
      pillar1Title: "Reduce carbon footprint",
      pillar1Text: "implement action plans to minimize plastic use, water consumption and greenhouse gas emissions",
      pillar2Title: "Promote sustainable food choices",
      pillar2Text:
        "rethink food and beverage to reduce meat and fish consumption, minimize food waste and adopt sustainable seafood policies",
      pillar3Title: "Strengthen education and awareness for ocean protection",
      pillar3Text:
        "raise awareness among customers, staff and local communities about the importance of preserving oceans and actions to contribute positively",
      pillar4Title: "Contribute to research and innovation",
      pillar4Text:
        "advance scientific knowledge and technologies that promote ocean health by partnering with NGOs and investing in more sustainable innovations",
      partnershipTitle: "Focus on the partnership between Novotel and WWF",
      partnershipText1:
        "At the heart of Novotel's commitment to sustainable development is its partnership with WWF (World Wide Fund for Nature). Launched in 2024 for three years, this collaboration aims to protect the marine environment through responsible seafood sourcing, customer awareness and promoting good practices within the hotel industry.",
      partnershipText2:
        "This partnership funds several key WWF projects, including the protection of posidonia, an essential underwater plant in the Mediterranean that acts as a natural carbon sink, and the recovery of 'ghost gear' - abandoned fishing nets that threaten marine life.",
      partnershipText3:
        "It also supports WWF France's Blue Panda boat, which travels the Mediterranean to conduct research and public awareness missions, as well as sea turtle protection in Asia-Pacific and the Western Atlantic.",
      callToAction:
        "For your next trip, don't hesitate to broaden your usual criteria and look for establishments that align with your values. By choosing a hotel committed to responsible practices, you give more meaning to your journey.",
      contact: "Contact",
      address: "Address",
      reservations: "Reservations",
      wifi: "Wi-Fi",
      network: "Network",
      password: "Password",
      availableAtReception: "Available at reception",
      followUs: "Follow us",
      allRightsReserved: "All rights reserved",
      createdBy: "Created by",
      addressLine1: "Avenue Mohamed V",
      addressLine2: "1002 1002 Tunis, Tunisia",
    },
    ar: {
      back: "رجوع",
      title: "مبادرات نوفوتيل لصالح التنمية المستدامة",
      subtitle:
        "مع 600 فندق موزعة في 68 دولة وشبكة في توسع مستمر، تلتزم نوفوتيل بحماية البيئة، وخاصة الحفاظ على المحيطات، وفقاً للركائز الأربع لخطة التأثير الإيجابي:",
      pillar1Title: "تقليل البصمة الكربونية",
      pillar1Text: "تنفيذ خطط عمل للحد من استخدام البلاستيك واستهلاك المياه وانبعاثات غازات الدفيئة إلى أدنى حد",
      pillar2Title: "تعزيز الخيارات الغذائية المستدامة",
      pillar2Text:
        "إعادة التفكير في الطعام والشراب لتقليل استهلاك اللحوم والأسماك، وتقليل هدر الطعام واعتماد سياسات مستدامة للمأكولات البحرية",
      pillar3Title: "تعزيز التعليم والتوعية لحماية المحيطات",
      pillar3Text:
        "توعية العملاء والموظفين والمجتمعات المحلية بأهمية الحفاظ على المحيطات والإجراءات للمساهمة بشكل إيجابي",
      pillar4Title: "المساهمة في البحث والابتكار",
      pillar4Text:
        "تطوير المعرفة العلمية والتقنيات التي تعزز صحة المحيطات من خلال الشراكة مع المنظمات غير الحكومية والاستثمار في ابتكارات أكثر استدامة",
      partnershipTitle: "التركيز على الشراكة بين نوفوتيل والصندوق العالمي للطبيعة",
      partnershipText1:
        "في قلب التزام نوفوتيل بالتنمية المستدامة تكمن شراكتها مع الصندوق العالمي للطبيعة. تم إطلاق هذا التعاون في عام 2024 لمدة ثلاث سنوات، ويهدف إلى حماية البيئة البحرية من خلال التوريد المسؤول للمأكولات البحرية وتوعية العملاء وتعزيز الممارسات الجيدة في صناعة الفنادق.",
      partnershipText2:
        "تمول هذه الشراكة عدة مشاريع رئيسية للصندوق العالمي للطبيعة، بما في ذلك حماية البوسيدونيا، وهي نبتة تحت الماء أساسية في البحر الأبيض المتوسط تعمل كمصرف طبيعي للكربون، واستعادة 'المعدات الشبح' - شباك الصيد المهجورة التي تهدد الحياة البحرية.",
      partnershipText3:
        "كما يدعم قارب البلو باندا التابع للصندوق العالمي للطبيعة فرنسا، الذي يجوب البحر الأبيض المتوسط لإجراء مهام البحث والتوعية العامة، بالإضافة إلى حماية السلاحف البحرية في آسيا والمحيط الهادئ والأطلسي الغربي.",
      callToAction:
        "لرحلتك القادمة، لا تتردد في توسيع معاييرك المعتادة والبحث عن المؤسسات التي تتماشى مع قيمك. باختيار فندق ملتزم بالممارسات المسؤولة، تعطي معنى أكبر لرحلتك.",
      contact: "اتصال",
      address: "العنوان",
      reservations: "الحجوزات",
      wifi: "واي فاي",
      network: "الشبكة",
      password: "كلمة المرور",
      availableAtReception: "متوفرة في الاستقبال",
      followUs: "تابعونا",
      allRightsReserved: "جميع الحقوق محفوظة",
      createdBy: "تم إنشاؤه بواسطة",
      addressLine1: "شارع محمد الخامس",
      addressLine2: "1002 تونس، تونس",
    },
  }

  const t = (key) => translations[currentLanguage][key] || key

  useEffect(() => {
    const savedLanguage = localStorage.getItem("novotel-language")
    if (savedLanguage && translations[savedLanguage]) {
      setCurrentLanguage(savedLanguage)
      document.documentElement.dir = savedLanguage === "ar" ? "rtl" : "ltr"
      document.documentElement.lang = savedLanguage
    }
  }, [])

  const changeLanguage = (langCode) => {
    setCurrentLanguage(langCode)
    localStorage.setItem("novotel-language", langCode)
    setShowLanguageDropdown(false)
    document.documentElement.dir = langCode === "ar" ? "rtl" : "ltr"
    document.documentElement.lang = langCode
  }

  const getCurrentLanguage = () => languages.find((lang) => lang.code === currentLanguage)

  return (
    <div className={`hotel-app2 ${currentLanguage === "ar" ? "rtl" : "ltr"}`}>
      <style jsx>{`
        :root {
          --primary: #0047ab;
          --primary-dark: #003d96;
          --secondary: #D4AF37;
          --background: #ffffff;
          --surface: #0047ab;
          --text: #333333;
          --text-secondary: #666666;
          --border: #e0e0e0;
        }

        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        body {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          background: var(--background);
          color: var(--text);
          line-height: 1.6;
        }

        .hotel-app2 {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
        }

   

         .rtl .header-back-link {
          flex-direction: row-reverse;
        }

        .rtl .header-back-link svg {
          margin-left: 8px;
          margin-right: 0;
        }
        .logo-container {
          flex: 1;
          display: flex;
          justify-content: center;
        }

        .logo {
          height: 40px;
          width: auto;
        }

        .language-selector {
          position: absolute;
          top: 15px;
          left: 15px;
          z-index: 20;
        }
        
        .language-toggle {
          display: flex;
          align-items: center;
          gap: 8px;
          background: rgba(0, 0, 0, 0.7);
          color: white;
          border: none;
          border-radius: 20px;
          padding: 8px 12px;
          cursor: pointer;
          font-size: 14px;
          font-weight: 500;
          transition: all 0.3s ease;
          backdrop-filter: blur(10px);
        }
        
        .language-toggle:hover {
          background: rgba(0, 0, 0, 0.8);
          transform: scale(1.05);
        }
        
        .language-flag {
          width: 20px;
          height: 15px;
          object-fit: cover;
          border-radius: 2px;
        }
        
        .language-dropdown {
          position: absolute;
          top: 100%;
          left: 0;
          background: rgba(0, 0, 0, 0.9);
          border-radius: 8px;
          padding: 8px 0;
          min-width: 150px;
          z-index: 1000;
          backdrop-filter: blur(10px);
          margin-top: 5px;
        }
        
        .language-option {
          display: flex;
          align-items: center;
          padding: 8px 16px;
          cursor: pointer;
          transition: background-color 0.2s;
          gap: 8px;
          color: white;
          font-size: 14px;
        }
        
        .language-option:hover {
          background: rgba(255, 255, 255, 0.1);
        }
        
        .language-option.active {
          background: rgba(255, 255, 255, 0.2);
        }
        
        .flag-small {
          width: 20px;
          height: 15px;
          object-fit: cover;
          border-radius: 2px;
        }

        .rtl {
          direction: rtl;
        }

        .rtl .language-selector {
          left: auto;
          right: 15px;
        }

        .rtl .language-dropdown {
          left: auto;
          right: 0;
          text-align: right;
        }



        .rtl .policy-content {
          text-align: right;
        }

        .rtl .footer-section {
          text-align: right;
        }

        .rtl .copyright {
          text-align: right;
        }

        .rtl .copyright a {
          margin-left: 0;
          margin-right: 5px;
        }

        .policy-content {
          flex: 1;
          max-width: 1200px;
          margin: 0 auto;
          padding: 2rem;
        }

        .policy-title {
          font-size: 2.5rem;
          font-weight: 700;
          color: var(--primary);
          margin-bottom: 2rem;
          text-align: center;
        }

        .policy-subtitle {
          font-size: 1.2rem;
          color: var(--text-secondary);
          margin-bottom: 3rem;
          text-align: center;
          line-height: 1.8;
        }

        .pillars-section {
          margin-bottom: 4rem;
        }

        .pillar {
          background: #f8f9fa;
          border-radius: 12px;
          padding: 2rem;
          margin-bottom: 2rem;
          border-left: 4px solid var(--primary);
        }

        .pillar-title {
          font-size: 1.5rem;
          font-weight: 600;
          color: var(--primary);
          margin-bottom: 1rem;
        }

        .pillar-text {
          color: var(--text-secondary);
          line-height: 1.8;
        }

        .partnership-section {
          background: #f8f9fa;
          border-radius: 12px;
          padding: 3rem;
          margin-bottom: 3rem;
        }

        .partnership-title {
          font-size: 2rem;
          font-weight: 600;
          color: var(--primary);
          margin-bottom: 2rem;
          text-align: center;
        }

        .partnership-text {
          color: var(--text-secondary);
          margin-bottom: 2rem;
          line-height: 1.8;
          font-size: 1.1rem;
        }

        .hero-image {
          width: 100%;
          max-width: 800px;
          height: 400px;
          object-fit: cover;
          border-radius: 12px;
          margin: 2rem auto;
          display: block;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
        }

        .call-to-action {
          background: linear-gradient(135deg, var(--primary), var(--primary-dark));
          border-radius: 12px;
          padding: 3rem;
          text-align: center;
          margin-bottom: 3rem;
        }

        .call-to-action-text {
          font-size: 1.3rem;
          font-weight: 500;
          color: white;
          line-height: 1.8;
        }

        .app-footer {
          background: var(--surface);
          border-top: none;
          padding: 3rem 2rem 1rem;
          margin-top: auto;
        }

        .footer-content {
          max-width: 1200px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 2rem;
        }

        .footer-section h4 {
          color: white;
          margin-bottom: 1rem;
          font-size: 1.1rem;
          font-weight: 600;
        }

        .footer-section p {
          color: rgba(255, 255, 255, 0.8);
          margin-bottom: 0.5rem;
        }

        .social-links {
          display: flex;
          gap: 1rem;
        }

        .social-links a {
          color: rgba(255, 255, 255, 0.8);
          transition: color 0.2s ease;
        }

        .social-links a:hover {
          color: white;
        }

        .copyright {
          text-align: center;
          padding-top: 2rem;
          margin-top: 2rem;
          border-top: 1px solid rgba(255, 255, 255, 0.2);
          color: rgba(255, 255, 255, 0.8);
        }

        .copyright a {
          color: white;
          text-decoration: none;
        }

        @media (max-width: 768px) {
          .app-header {
            padding: 1rem;
          }

          .policy-content {
            padding: 1rem;
          }

          .policy-title {
            font-size: 2rem;
          }

          .pillar {
            padding: 1.5rem;
          }

          .partnership-section {
            padding: 2rem;
          }

          .call-to-action {
            padding: 2rem;
          }

          .call-to-action-text {
            font-size: 1.1rem;
          }

          .hero-image {
            height: 250px;
          }
        }
      `}</style>

      <div className="language-selector">
        <button className="language-toggle" onClick={() => setShowLanguageDropdown(!showLanguageDropdown)}>
          <img
            src={getCurrentLanguage()?.flag || "/placeholder.svg"}
            alt={getCurrentLanguage()?.name}
            className="language-flag"
          />
          <span>{getCurrentLanguage()?.code.toUpperCase()}</span>
        </button>
        {showLanguageDropdown && (
          <div className="language-dropdown">
            {languages.map((lang) => (
              <div
                key={lang.code}
                className={`language-option ${currentLanguage === lang.code ? "active" : ""}`}
                onClick={(e) => {
                  e.stopPropagation()
                  changeLanguage(lang.code)
                }}
              >
                <img src={lang.flag || "/placeholder.svg"} alt={lang.name} className="flag-small" />
                <span>{lang.name}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      <header className="app-header">
        <button className="header-back-link" onClick={() => (window.location.href = "/Home")}>
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

      <main className="policy-content">
        <h1 className="policy-title">{t("title")}</h1>
        <p className="policy-subtitle">{t("subtitle")}</p>

        <div className="pillars-section">
          <div className="pillar">
            <h3 className="pillar-title">{t("pillar1Title")}</h3>
            <p className="pillar-text">{t("pillar1Text")}</p>
          </div>
          <div className="pillar">
            <h3 className="pillar-title">{t("pillar2Title")}</h3>
            <p className="pillar-text">{t("pillar2Text")}</p>
          </div>
          <div className="pillar">
            <h3 className="pillar-title">{t("pillar3Title")}</h3>
            <p className="pillar-text">{t("pillar3Text")}</p>
          </div>
          <div className="pillar">
            <h3 className="pillar-title">{t("pillar4Title")}</h3>
            <p className="pillar-text">{t("pillar4Text")}</p>
          </div>
        </div>

        <div className="partnership-section">
          <h2 className="partnership-title">{t("partnershipTitle")}</h2>
          <p className="partnership-text">{t("partnershipText1")}</p>
          <p className="partnership-text">{t("partnershipText2")}</p>

          <img
            src="https://m.ahstatic.com/is/image/accorhotels/GettyImages-2165342045?fmt=webp&op_usm=1.75,0.3,2,0&resMode=sharp2&iccEmbed=true&icc=sRGB&dpr=on,1.5&wid=1459&qlt=80"
            alt="Ocean conservation"
            className="hero-image"
          />

          <p className="partnership-text">{t("partnershipText3")}</p>
        </div>

        <div className="call-to-action">
          <p className="call-to-action-text">{t("callToAction")}</p>
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

export default PolicyClient
