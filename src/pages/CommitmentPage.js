"use client"

import { useState, useEffect } from "react"

const CommitmentPage = () => {
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
      title: "Politique de développement durable",
      subtitle: "Notre chemin vers la durabilité.",
      intro: "Voyager, c'est bien, mais cela peut être encore mieux - pour vous et pour la planète.",
      introText:
        "La clé est de réduire son impact sur l'environnement. Ce n'est pas une mince affaire, mais nous nous efforçons d'apporter une contribution positive en réduisant notre empreinte carbone et en améliorant les communautés locales et les environnements qui nous entourent. Voici comment nous prenons l'initiative de devenir plus durables :",

      sustainableStaysTitle: "Séjours durables",
      sustainableStaysText:
        "Nous examinons l'ensemble de nos activités et continuons à rechercher des moyens plus nombreux et plus efficaces de réduire nos émissions de gaz à effet de serre et/ou de participer à l'économie circulaire.",
      sustainableStaysText2:
        "Les deux principaux changements durables que bon nombre de nos hôtels ont déjà effectués sont le passage à des sources d'énergie plus propres et l'élimination des plastiques à usage unique lors de votre séjour.",

      responsibleFoodTitle: "Cycle alimentaire responsable",
      responsibleFoodText:
        "La bonne nourriture est meilleure lorsqu'elle est vraiment bonne. De l'approvisionnement à l'extinction des feux dans nos restaurants chaque soir, nos objectifs sont de protéger la biodiversité, de minimiser l'impact sur l'environnement et de réduire le gaspillage alimentaire. Nous entretenons également des partenariats équitables avec les agriculteurs et les fournisseurs locaux.",

      localSupportTitle: "Soutien local",
      localSupportText:
        "Le confort de notre maison est au cœur de notre identité. C'est pourquoi la protection de ce confort pour nos hôtes dans leurs maisons est une priorité absolue. Nous nous efforçons d'enrichir les communautés et les écosystèmes qui nous accueillent sur le long terme, en fonction de leurs besoins. Cela inclut la préservation du patrimoine culturel et de la biodiversité locale, la création d'opportunités économiques et l'établissement de relations durables.",

      hotelActionsTitle: "Au Novotel , nous travaillons activement à minimiser notre impact sur l'environnement en...",
      hotelAction1: "Optimisant l'efficacité énergétique",
      hotelAction2: "Éliminant les plastiques à usage unique",
      hotelAction3: "En s'approvisionnant en nourriture de manière responsable",
      hotelAction4: "Conservant les écosystèmes et la biodiversité",

      greenKeyTitle: "Green Key",
      greenKeyText:
        "Nos efforts pour maximiser la durabilité comprennent la recherche d'une certification (a/an Ecolabel Name). Un jury indépendant composé d'experts de l'environnement et du tourisme décerne chaque année ce label aux établissements d'hébergement qui satisfont aux exigences les plus strictes.",
      greenKeyText2:
        "La conformité est vérifiée régulièrement et les améliorations continues sont encouragées, de sorte que la durabilité restera toujours une force motrice de nos opérations.",
      greenKeyText3: "Pour plus d'informations , visitez le site Web de l'Ecolabel.",

      tagline: "Vers une hospitalité #DURABLE",

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
      addressLine1: "Rue de la Feuille d'Érable - Cité Les Pins - Les Berges du Lac 2",
      addressLine2: "1053 Tunis, TN",
    },
    en: {
      back: "Back",
      title: "Sustainable Development Policy",
      subtitle: "Our path to sustainability.",
      intro: "Traveling is good, but it can be even better - for you and for the planet.",
      introText:
        "The key is to reduce your environmental impact. This is no small feat, but we strive to make a positive contribution by reducing our carbon footprint and improving the local communities and environments around us. Here's how we're taking the initiative to become more sustainable:",

      sustainableStaysTitle: "Sustainable Stays",
      sustainableStaysText:
        "We examine all of our operations and continue to look for more and more effective ways to reduce our greenhouse gas emissions and/or participate in the circular economy.",
      sustainableStaysText2:
        "The two main sustainable changes that many of our hotels have already made are switching to cleaner energy sources and eliminating single-use plastics during your stay.",

      responsibleFoodTitle: "Responsible Food Cycle",
      responsibleFoodText:
        "Good food is better when it's truly good. From sourcing to turning off the lights in our restaurants each night, our goals are to protect biodiversity, minimize environmental impact, and reduce food waste. We also maintain fair partnerships with local farmers and suppliers.",

      localSupportTitle: "Local Support",
      localSupportText:
        "The comfort of our home is at the heart of our identity. That's why protecting this comfort for our guests in their homes is a top priority. We strive to enrich the communities and ecosystems that host us in the long term, according to their needs. This includes preserving cultural heritage and local biodiversity, creating economic opportunities, and establishing lasting relationships.",

      hotelActionsTitle: "At Novotel, we are actively working to minimize our environmental impact by...",
      hotelAction1: "Optimizing energy efficiency",
      hotelAction2: "Eliminating single-use plastics",
      hotelAction3: "Sourcing food responsibly",
      hotelAction4: "Preserving ecosystems and biodiversity",

      greenKeyTitle: "Green Key",
      greenKeyText:
        "Our efforts to maximize sustainability include seeking certification (a/an Ecolabel Name). An independent jury of environmental and tourism experts awards this label annually to accommodation establishments that meet the strictest requirements.",
      greenKeyText2:
        "Compliance is regularly verified and continuous improvements are encouraged, so sustainability will always remain a driving force in our operations.",
      greenKeyText3: "For more information about the Green Key label, visit the Green Key website.",

      tagline: "Towards #SUSTAINABLE hospitality",

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
      addressLine1: "Rue de la Feuille d'Érable - Cité Les Pins - Les Berges du Lac 2",
      addressLine2: "1053 Tunis, TN",
    },
    ar: {
      back: "رجوع",
      title: "سياسة التنمية المستدامة",
      subtitle: "طريقنا نحو الاستدامة.",
      intro: "السفر أمر جيد، لكن يمكن أن يكون أفضل - لك وللكوكب.",
      introText:
        "المفتاح هو تقليل تأثيرك على البيئة. هذا ليس بالأمر السهل، لكننا نسعى جاهدين لتقديم مساهمة إيجابية من خلال تقليل بصمتنا الكربونية وتحسين المجتمعات المحلية والبيئات من حولنا. إليك كيف نتخذ المبادرة لنصبح أكثر استدامة:",

      sustainableStaysTitle: "إقامات مستدامة",
      sustainableStaysText:
        "نفحص جميع عملياتنا ونستمر في البحث عن المزيد من الطرق الفعالة لتقليل انبعاثات غازات الدفيئة و/أو المشاركة في الاقتصاد الدائري.",
      sustainableStaysText2:
        "التغييرات المستدامان الرئيسيان اللذان قامت بهما العديد من فنادقنا بالفعل هما التحول إلى مصادر طاقة أنظف والقضاء على البلاستيك ذو الاستخدام الواحد أثناء إقامتك.",

      responsibleFoodTitle: "دورة غذائية مسؤولة",
      responsibleFoodText:
        "الطعام الجيد أفضل عندما يكون جيدًا حقًا. من التوريد إلى إطفاء الأنوار في مطاعمنا كل ليلة، أهدافنا هي حماية التنوع البيولوجي وتقليل التأثير البيئي وتقليل هدر الطعام. نحافظ أيضًا على شراكات عادلة مع المزارعين والموردين المحليين.",

      localSupportTitle: "الدعم المحلي",
      localSupportText:
        "راحة منزلنا هي في صميم هويتنا. لهذا السبب فإن حماية هذه الراحة لضيوفنا في منازلهم هي أولوية قصوى. نسعى جاهدين لإثراء المجتمعات والنظم البيئية التي تستضيفنا على المدى الطويل، وفقًا لاحتياجاتها. يشمل ذلك الحفاظ على التراث الثقافي والتنوع البيولوجي المحلي، وخلق فرص اقتصادية، وإقامة علاقات دائمة.",

      hotelActionsTitle: "في نوفوتيل [اسم الفندق]، نعمل بنشاط على تقليل تأثيرنا البيئي من خلال...",
      hotelAction1: "تحسين كفاءة الطاقة",
      hotelAction2: "القضاء على البلاستيك ذو الاستخدام الواحد",
      hotelAction3: "التوريد المسؤول للطعام",
      hotelAction4: "الحفاظ على النظم البيئية والتنوع البيولوجي",

      greenKeyTitle: "المفتاح الأخضر",
      greenKeyText:
        "تشمل جهودنا لتعظيم الاستدامة السعي للحصول على شهادة (اسم الملصق البيئي). تمنح لجنة مستقلة من خبراء البيئة والسياحة هذا الملصق سنويًا لمؤسسات الإقامة التي تلبي أصعب المتطلبات.",
      greenKeyText2:
        "يتم التحقق من الامتثال بانتظام ويتم تشجيع التحسينات المستمرة، بحيث ستظل الاستدامة دائمًا قوة دافعة في عملياتنا.",
      greenKeyText3: "لمزيد من المعلومات حول المفتاح الأخضر، قم بزيارة موقع المفتاح الأخضر.",

      tagline: "نحو ضيافة #مستدامة",

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
      addressLine1: "شارع ورقة القيقب - مدينة الصنوبر - ضفاف البحيرة 2",
      addressLine2: "1053 تونس، تونس",
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
          overflow-x: hidden;
          width: 100%;
        }

        .hotel-app2 {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          overflow-x: hidden;
          width: 100%;
          max-width: 100vw;
        }

        .app-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1rem;
          background: white;
          position: relative;
          width: 100%;
        }

        .header-back-link {
          display: flex;
          align-items: center;
          gap: 8px;
          background: none;
          border: none;
          color: var(--primary);
          cursor: pointer;
          font-size: 14px;
          font-weight: 500;
          padding: 8px;
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
          max-width: 150px;
          object-fit: contain;
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
          padding: 1rem;
          width: 100%;
        }

        .policy-title {
          font-size: clamp(1.5rem, 5vw, 2.5rem);
          font-weight: 700;
          color: var(--primary);
          margin-bottom: 1.5rem;
          text-align: center;
          word-wrap: break-word;
        }

        .policy-subtitle {
          font-size: clamp(1rem, 3vw, 1.2rem);
          color: var(--text-secondary);
          margin-bottom: 2rem;
          text-align: center;
          line-height: 1.8;
          word-wrap: break-word;
        }

        .intro-section {
          margin-bottom: 2rem;
        }

        .intro-text-bold {
          font-size: clamp(1.1rem, 4vw, 1.5rem);
          font-weight: 600;
          color: var(--primary);
          margin-bottom: 1rem;
          text-align: center;
          word-wrap: break-word;
        }

        .intro-text {
          color: var(--text-secondary);
          line-height: 1.8;
          text-align: center;
          word-wrap: break-word;
          font-size: clamp(0.9rem, 2.5vw, 1rem);
        }

        .pillars-section {
          margin-bottom: 3rem;
        }

        .pillar {
          background: #f8f9fa;
          border-radius: 12px;
          padding: 1.5rem;
          margin-bottom: 1.5rem;
          border-left: 4px solid var(--primary);
          width: 100%;
        }

        .pillar-title {
          font-size: clamp(1.1rem, 4vw, 1.5rem);
          font-weight: 600;
          color: var(--primary);
          margin-bottom: 1rem;
          word-wrap: break-word;
        }

        .pillar-text {
          color: var(--text-secondary);
          line-height: 1.8;
          word-wrap: break-word;
          font-size: clamp(0.9rem, 2.5vw, 1rem);
        }

        .hotel-actions-section {
          margin-bottom: 3rem;
        }

        .section-title {
          font-size: clamp(1.1rem, 4vw, 1.5rem);
          font-weight: 600;
          color: var(--primary);
          margin-bottom: 1rem;
          text-align: center;
          word-wrap: break-word;
        }

        .actions-list {
          list-style-type: none;
          padding: 0;
        }

        .actions-list li {
          color: var(--text-secondary);
          line-height: 1.8;
          margin-bottom: 0.5rem;
          text-align: center;
          word-wrap: break-word;
          font-size: clamp(0.9rem, 2.5vw, 1rem);
        }

        .green-key-section {
          background: #f8f9fa;
          border-radius: 12px;
          padding: 1.5rem;
          margin-bottom: 2rem;
          width: 100%;
        }

        .green-key-title {
          font-size: clamp(1.3rem, 5vw, 2rem);
          font-weight: 600;
          color: var(--primary);
          margin-bottom: 1.5rem;
          text-align: center;
          word-wrap: break-word;
        }

        .partnership-text {
          color: var(--text-secondary);
          line-height: 1.8;
          margin-bottom: 1rem;
          word-wrap: break-word;
          font-size: clamp(0.9rem, 2.5vw, 1rem);
        }

        img {
          max-width: 100%;
          height: auto;
          display: block;
        }

        .call-to-action {
          background: linear-gradient(135deg, var(--primary), var(--primary-dark));
          border-radius: 12px;
          padding: 2rem 1rem;
          text-align: center;
          margin-bottom: 2rem;
          width: 100%;
        }

        .call-to-action-text {
          font-size: clamp(1rem, 3.5vw, 1.3rem);
          font-weight: 500;
          color: white;
          line-height: 1.8;
          word-wrap: break-word;
        }

        .app-footer {
          background: var(--surface);
          border-top: none;
          padding: 2rem 1rem 1rem;
          margin-top: auto;
          width: 100%;
        }

        .footer-content {
          max-width: 1200px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1.5rem;
          width: 100%;
        }

        .footer-section h4 {
          color: white;
          margin-bottom: 1rem;
          font-size: clamp(1rem, 3vw, 1.1rem);
          font-weight: 600;
        }

        .footer-section p {
          color: rgba(255, 255, 255, 0.8);
          margin-bottom: 0.5rem;
          font-size: clamp(0.85rem, 2.5vw, 1rem);
          word-wrap: break-word;
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
          font-size: clamp(0.8rem, 2.5vw, 0.9rem);
          word-wrap: break-word;
        }

        .copyright a {
          color: white;
          text-decoration: none;
        }

        @media (max-width: 768px) {
          .app-header {
            padding: 0.75rem;
          }

          .policy-content {
            padding: 1rem;
          }

          .policy-title {
            margin-bottom: 1rem;
          }

          .pillar {
            padding: 1rem;
            margin-bottom: 1rem;
          }

          .green-key-section {
            padding: 1.5rem 1rem;
          }

          .call-to-action {
            padding: 1.5rem 1rem;
          }

          .footer-content {
            grid-template-columns: 1fr;
            gap: 1.5rem;
          }

          .language-selector {
            top: 10px;
            left: 10px;
          }

          .rtl .language-selector {
            left: auto;
            right: 10px;
          }
        }

        @media (max-width: 375px) {
          .policy-content {
            padding: 0.75rem;
          }

          .pillar {
            padding: 0.75rem;
          }

          .green-key-section {
            padding: 1rem 0.75rem;
          }

          .call-to-action {
            padding: 1rem 0.75rem;
          }

          .app-footer {
            padding: 1.5rem 0.75rem 1rem;
          }

          .logo {
            height: 30px;
            max-width: 120px;
          }

          .language-toggle {
            padding: 6px 10px;
            font-size: 12px;
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
        <button className="header-back-link" onClick={() => (window.location.href = "/")}>
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

        <div className="intro-section">
          <p className="intro-text-bold">{t("intro")}</p>
          <p className="intro-text">{t("introText")}</p>
        </div>

        <div className="pillars-section">
          <div className="pillar">
            <h3 className="pillar-title">{t("sustainableStaysTitle")}</h3>
            <p className="pillar-text">{t("sustainableStaysText")}</p>
            <p className="pillar-text">{t("sustainableStaysText2")}</p>
          </div>

          <div className="pillar">
            <h3 className="pillar-title">{t("responsibleFoodTitle")}</h3>
            <p className="pillar-text">{t("responsibleFoodText")}</p>
          </div>

          <div className="pillar">
            <h3 className="pillar-title">{t("localSupportTitle")}</h3>
            <p className="pillar-text">{t("localSupportText")}</p>
          </div>
        </div>

        <div className="hotel-actions-section">
          <h3 className="section-title">{t("hotelActionsTitle")}</h3>
          <ul className="actions-list">
            <li>{t("hotelAction1")}</li>
            <li>{t("hotelAction2")}</li>
            <li>{t("hotelAction3")}</li>
            <li>{t("hotelAction4")}</li>
          </ul>
        </div>

        <div className="green-key-section">
          <h2 className="green-key-title">{t("greenKeyTitle")}</h2>
          <p className="partnership-text">{t("greenKeyText")}</p>
          <p className="partnership-text">{t("greenKeyText2")}</p>
          <p className="partnership-text">{t("greenKeyText3")}</p>
        </div>
        <img src="/images/greenkey.png" alt="Sustainability" />
        <div className="call-to-action">
          <p className="call-to-action-text">{t("tagline")}</p>
        </div>
      </main>

      <footer className="app-footer">
        <div className="footer-content">
          <div className="footer-section">
            <h4>{t("contact")}</h4>
            <p>+216 31 329 329</p>
            <p>H6145@accor.com</p>
          </div>
          <div className="footer-section">
            <h4>{t("address")}</h4>
            <p>{t("addressLine1")}</p>
            <p>{t("addressLine2")}</p>
          </div>
          <div className="footer-section">
            <h4>{t("reservations")}</h4>
            <p>+216 31 329 329</p>
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
              <a href="https://www.facebook.com/Novoteltunislac/" aria-label="Facebook" target="_blank" rel="noopener noreferrer">
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
              <a href="https://tn.linkedin.com/company/novotel-tunis-lac" aria-label="LinkedIn" target="_blank" rel="noopener noreferrer">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                  <rect x="2" y="9" width="4" height="12"></rect>
                  <circle cx="4" cy="4" r="2"></circle>
                </svg>
              </a>
              <a href="https://www.instagram.com/novotel_tunis_lac/" aria-label="Instagram" target="_blank" rel="noopener noreferrer">
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
            © {new Date().getFullYear()} Novotel Tunis Lac. {t("allRightsReserved")}.
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

export default CommitmentPage
