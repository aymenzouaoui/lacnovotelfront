import "./SocialLinks.css"

const SocialLinks = () => {
  const socialLinks = [
    {
      name: "Facebook",
      url: "https://www.facebook.com/Novoteltunislac/",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ),
    },
    {
      name: "LinkedIn",
      url: "https://tn.linkedin.com/company/novotel-tunis-lac",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <rect x="2" y="9" width="4" height="12" stroke="currentColor" strokeWidth="2" />
          <circle cx="4" cy="4" r="2" stroke="currentColor" strokeWidth="2" />
        </svg>
      ),
    },
    {
      name: "Instagram",
      url: "https://www.instagram.com/novotel_tunis_lac/",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="2" y="2" width="20" height="20" rx="5" ry="5" stroke="currentColor" strokeWidth="2" />
          <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" stroke="currentColor" strokeWidth="2" />
          <line
            x1="17.5"
            y1="6.5"
            x2="17.51"
            y2="6.5"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      ),
    },
  ]

  return (
    <div className="novotel-v2-social">
      {socialLinks.map((link) => (
        <a
          key={link.name}
          href={link.url}
          className="novotel-v2-social-icon"
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Visit our ${link.name} page`}
        >
          {link.icon}
        </a>
      ))}
    </div>
  )
}

export default SocialLinks
