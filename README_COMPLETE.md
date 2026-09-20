# 🏨 Lac Novotel Front - Application Web de Gestion Hôtelière

Une application React moderne et complète pour la gestion et la consultation des services d'un hôtel, avec une interface responsive et des fonctionnalités avancées pour les clients et les administrateurs.

## 📋 Table des matières

- [Caractéristiques](#-caractéristiques)
- [Architecture du Projet](#-architecture-du-projet)
- [Installation](#-installation)
- [Scripts Disponibles](#-scripts-disponibles)
- [Structure des Fichiers](#-structure-des-fichiers)
- [Fonctionnalités Principales](#-fonctionnalités-principales)
- [Technologie Utilisée](#-technologie-utilisée)
- [Configuration](#-configuration)
- [Guide d'Utilisation](#-guide-dutilisation)
- [Contribution](#-contribution)

## 🌟 Caractéristiques

### Pour les Clients
- ✅ **Consultation des Chambres** - Visualisation complète des différentes types de chambres disponibles
- ✅ **Menu & Restaurants** - Accès aux menus du restaurant avec détails complets
- ✅ **Service de Boissons** - Consultation et commande de boissons
- ✅ **Loisirs** - Découverte des activités de loisirs disponibles
- ✅ **Événements** - Consultation des événements organisés à l'hôtel
- ✅ **Séminaires** - Détails sur les salles de séminaires et services
- ✅ **Spas** - Services de spa et bien-être disponibles
- ✅ **Offres Spéciales** - Promotions et offres exclusives
- ✅ **Terrasse & Piscine** - Information sur les installations extérieures
- ✅ **Service d'Étage** - Commande de service à la chambre
- ✅ **Réservations** - Gestion complète des réservations
- ✅ **Questionnaires** - Retours clients et sondages
- ✅ **Profil Client** - Gestion du compte utilisateur
- ✅ **Historique** - Historique des services utilisés

### Pour les Administrateurs
- ✅ **Dashboard** - Vue d'ensemble complète des données hôtelières
- ✅ **Statistiques & Analytics** - Graphiques et analyses détaillées
- ✅ **Gestion des Contenus** - Édition des contenus pages avec éditeur riche
- ✅ **Nettoyage des Chambres** - Suivi de l'état de nettoyage
- ✅ **Service d'Étage** - Gestion des commandes en temps réel
- ✅ **Gestion des Questionnaires** - Consultation et gestion des sondages
- ✅ **Engagement & Engagement** - Suivi de l'engagement des clients
- ✅ **Gestion des Pages** - Édition dynamique des contenus

### Fonctionnalités Générales
- 🌓 **Mode Sombre/Clair** - Thème personnalisable selon les préférences
- 📱 **Design Responsive** - Optimisé pour tous les appareils (desktop, tablette, mobile)
- 🔐 **Authentification** - Système de connexion sécurisé
- 📊 **Graphiques Interactifs** - Visualisation de données avec Recharts
- ⚡ **Performance Optimisée** - Chargement d'images progressif et optimisé
- 🔄 **Communication en Temps Réel** - Socket.io pour les mises à jour en direct
- 📄 **Export PDF** - Génération et export de rapports en PDF
- 🎨 **Éditeur Riche** - Édition de contenu avec TipTap
- 🔒 **Gestion de Fichiers** - Compression et upload de fichiers

## 🏗️ Architecture du Projet

L'application suit une architecture modulaire basée sur React :

```
lacnovotelfront/
├── src/
│   ├── components/           # Composants réutilisables
│   ├── pages/               # Pages principales de l'application
│   ├── services/            # Services API et utilitaires
│   ├── context/             # Contexte React (thème, état global)
│   ├── hooks/               # Hooks personnalisés
│   ├── styles/              # Fichiers CSS globaux
│   ├── utils/               # Utilitaires et helpers
│   ├── App.js               # Composant principal
│   └── index.js             # Point d'entrée
├── public/                  # Fichiers statiques
├── build/                   # Production build
└── package.json             # Dépendances du projet
```

## 💻 Installation

### Prérequis

- Node.js (v14 ou supérieur)
- npm ou yarn
- Accès à l'API backend (https://backendlac.novotellac.com)

### Étapes d'Installation

1. **Cloner le repository**
   ```bash
   git clone <url-du-repository>
   cd lacnovotelfront
   ```

2. **Installer les dépendances**
   ```bash
   npm install
   ```
   ou avec yarn:
   ```bash
   yarn install
   ```

3. **Configuration de l'environnement**
   
   Vérifier le fichier `src/services/api.js` pour vous assurer que l'URL du backend est correcte :
   ```javascript
   const API = axios.create({
     baseURL: "https://backendlac.novotellac.com/api",
   });
   ```

4. **Lancer l'application en développement**
   ```bash
   npm start
   ```
   L'application ouvrira automatiquement à [http://localhost:3000](http://localhost:3000)

## 📜 Scripts Disponibles

- **`npm start`** - Lance le serveur de développement avec hot-reload
- **`npm build`** - Crée une version optimisée pour la production
- **`npm test`** - Exécute les tests unitaires
- **`npm eject`** - Éjecte la configuration (non réversible)

## 📁 Structure des Fichiers

### Composants (`src/components/`)
- **CompressedFileInput.js** - Upload et compression de fichiers
- **ConfirmDialog.js** - Dialogue de confirmation réutilisable
- **Copyright.js** - Composant copyright du footer
- **FeatureCards.js** - Cartes de fonctionnalités
- **FooterNavigation.js** - Navigation du footer
- **HeroSection.js** - Section héroïque de la page
- **OffersPopup.js** - Popup d'affichage des offres
- **ProgressiveImage.js** - Chargement progressif des images
- **RichTextEditor.js** - Éditeur de texte enrichi (TipTap)
- **SkeletonLoader.js** - Skeleton loading pour UX meilleure
- **SlideshowBanner.js** - Carrousel de bannières
- **SocialLinks.js** - Liens vers réseaux sociaux
- **ThemeToggle.js** - Basculeur de thème sombre/clair
- **Toast.js** - Notifications temporaires

### Pages (`src/pages/`)

#### Pages Client
- **Home.js** - Page d'accueil
- **ChambresClient.js** - Consulter les chambres
- **BoissonsClient.js** - Consulter les boissons
- **EvenementsClient.js** - Consulter les événements
- **LoisirsClient.js** - Consulter les loisirs
- **OffresClient.js** - Consulter les offres spéciales
- **RestaurantsMenusClient.js** - Consulter menus et restaurants
- **SpasClient.js** - Services de spa
- **TerrassePiscineClient.js** - Terrasse et piscine
- **SeminaireClient.js** - Séminaires et réunions
- **RoomServiceClient.js** - Service d'étage
- **LivretClient.js** - Livret client
- **PrivacyClient.js** - Politique de confidentialité
- **QuestionnaireClient.js** - Répondre aux questionnaires
- **ProfilePage.js** - Profil utilisateur
- **ReservationsPage.js** - Gestion des réservations
- **RoomServiceOrders.js** - Commandes de service d'étage
- **SkipcleanClient.js** - Demande de nettoyage reporté

#### Pages Administrateur
- **Dashboard.js** - Dashboard principal
- **AnalyticsStats.js** - Statistiques et analytics
- **ChambresPage.js** - Gestion des chambres
- **BoissonsPage.js** - Gestion des boissons
- **EvenementsPage.js** - Gestion des événements
- **LoisirsPage.js** - Gestion des loisirs
- **OffresPage.js** - Gestion des offres
- **RestaurantsAndMenusPage.js** - Gestion restaurants/menus
- **SpasPage.js** - Gestion des spas
- **TerrassePiscinePage.js** - Gestion terrasse/piscine
- **SeminairePage.js** - Gestion des séminaires
- **RoomServicePage.js** - Gestion service d'étage
- **NettoyagePage.js** - Gestion nettoyage des chambres
- **QuestionnairePage.js** - Gestion des questionnaires
- **PageContentsPage.js** - Gestion des contenus pages
- **SkipcleanPage.js** - Gestion du service de nettoyage reporté
- **CommitmentPage.js** - Engagement/Commitment
- **Statistiques.js** - Statistiques détaillées
- **Historique.js** - Historique des opérations

#### Pages Authentification
- **LoginPage.js** - Connexion utilisateur
- **SignUpPage.js** - Inscription de nouvel utilisateur
- **SettingsPage.js** - Paramètres utilisateur

#### Pages Utilitaires
- **NotFoundPage.js** - Page 404
- **Questionnaire.js** - Composant questionnaire

### Services (`src/services/`)
- **api.js** - Configuration Axios pour les appels API

### Hooks (`src/hooks/`)
- **useOptimizedFetch.js** - Hook personnalisé pour les requêtes optimisées

### Contexte (`src/context/`)
- **ThemeContext.js** - Gestion du thème global (sombre/clair)

## 🎯 Fonctionnalités Principales

### 1. Système de Thème
L'application supporte un mode sombre et un mode clair via `ThemeContext`. Le thème est persistant dans le localStorage.

### 2. Éditeur de Contenu Riche
Utilise **TipTap** pour l'édition de contenu avec support pour :
- Texte enrichi (gras, italique, souligné)
- Listes et numérotation
- Couleurs personnalisées
- et bien plus...

### 3. Gestion des Fichiers
- Compression automatique des images via `browser-image-compression`
- Upload et validation de fichiers
- Support pour fichiers volumineux

### 4. Graphiques et Statistiques
Utilise **Recharts** pour visualiser :
- Occupancy rates
- Revenus
- Statistiques clients
- Graphiques d'activité

### 5. Communication Temps Réel
**Socket.io** intégré pour :
- Mises à jour en temps réel
- Notifications instantanées
- Synchronisation multi-utilisateurs

### 6. Export PDF
Génération de rapports et PDF avec **jsPDF** et **jsPDF-autotable**

### 7. Code QR
Génération de codes QR pour les réservations et identifiants

## 🔧 Technologie Utilisée

### Frontend Framework
- **React 18.3.1** - Bibliothèque UI principale
- **React Router DOM 7.5.1** - Routage et navigation
- **React Scripts 5.0.1** - Build tools

### État et Contexte
- **React Context API** - Gestion du thème global

### Appels API
- **Axios 1.8.4** - Client HTTP

### UI et Animations
- **Framer Motion 12.9.2** - Animations fluides
- **Lucide React 0.503.0** - Icônes modernes
- **Recharts 3.8.1** - Graphiques interactifs

### Édition de Contenu
- **TipTap 3.7.0** - Éditeur riche
- **React Quill 2.0.0** - Alternative editeur riche

### Génération de Documents
- **jsPDF 3.0.1** - Génération PDF
- **jsPDF-AutoTable 5.0.2** - Tableaux PDF
- **QRCode 1.5.4** - Génération codes QR

### Optimisation
- **browser-image-compression 2.0.2** - Compression d'images
- **web-vitals 2.1.4** - Métriques de performance

### Communication Temps Réel
- **Socket.io-client 4.8.1** - WebSocket

### Build Tools
- **@craco/craco 7.1.0** - Customization de Create React App
- **babel-plugin-transform-remove-console 6.9.4** - Suppression des console.log en prod

### Testing
- **@testing-library/react 16.3.0** - Tests React
- **@testing-library/jest-dom 6.6.3** - Matchers Jest
- **@testing-library/user-event 13.5.0** - Simulation d'événements utilisateur

## ⚙️ Configuration

### Configuration de l'API Backend

Modifier `src/services/api.js` :
```javascript
const API = axios.create({
  baseURL: "YOUR_BACKEND_URL/api", // Remplacer l'URL
});
```

### Variables d'Environnement

Créer un fichier `.env` à la racine du projet (optionnel) :
```env
REACT_APP_API_URL=https://backendlac.novotellac.com/api
REACT_APP_SOCKET_URL=https://backendlac.novotellac.com
```

### Configuration Craco

Le fichier `craco.config.js` contient la configuration personnalisée de Create React App.

## 🚀 Guide d'Utilisation

### Authentification
1. Accéder à la page de connexion
2. Entrer les identifiants
3. Le token d'authentification est conservé (implémenter dans les intercepteurs API)

### Côté Client
1. Naviguer via le menu pour consulter les différents services
2. Ajouter des items au panier (si applicable)
3. Passer commandes ou réservations
4. Consulter l'historique et le profil

### Côté Administrateur
1. Accéder au Dashboard après connexion admin
2. Visualiser les statistiques et analytics
3. Gérer les contenus des différentes sections
4. Suivre les commandes et réservations en temps réel

## 📱 Responsive Design

L'application est optimisée pour :
- **Desktop** - Écrans larges (1920px+)
- **Tablette** - Écrans moyens (768px - 1024px)
- **Mobile** - Petits écrans (320px - 767px)

CSS media queries et framework responsive assurent une expérience optimale sur tous les appareils.

## 🔐 Sécurité

- ✅ Authentification sécurisée (à implémenter avec JWT)
- ✅ Communication HTTPS avec le backend
- ✅ Validation des entrées utilisateur (à implémenter)
- ✅ Protection contre XSS via React
- ✅ CORS configuré sur le backend

## 🚀 Déploiement

### Production Build
```bash
npm run build
```

Cela crée un dossier `build/` optimisé prêt pour le déploiement.

### Hébergement Recommandé
- Vercel
- Netlify
- AWS S3 + CloudFront
- Heroku
- DigitalOcean

### Étapes de Déploiement

1. Build l'application
2. Upload le contenu du dossier `build/` vers votre serveur
3. Configurer les en-têtes CORS appropriés
4. Configurer les redirects pour React Router

## 📈 Performance

L'application implémente :
- ✅ Chargement d'images progressif
- ✅ Code splitting automatique
- ✅ Lazy loading des composants
- ✅ Optimisation des re-renders
- ✅ Suppression des logs console en production

## 🐛 Dépannage

### La page ne charge pas
- Vérifier la connexion internet
- Vérifier l'URL du backend dans `api.js`
- Vérifier la console pour les erreurs CORS

### Erreurs d'authentification
- Vérifier les identifiants
- Vérifier que le backend est en ligne
- Vérifier les tokens d'authentification

### Images qui ne s'affichent pas
- Vérifier les URLs des images
- Vérifier les permissions CORS
- Vérifier le format des images

## 📚 Documentation Supplémentaire

- [React Documentation](https://react.dev)
- [React Router Documentation](https://reactrouter.com)
- [Axios Documentation](https://axios-http.com)
- [TipTap Documentation](https://tiptap.dev)
- [Socket.io Documentation](https://socket.io/docs)

## 🤝 Contribution

Les contributions sont bienvenues ! Pour contribuer :

1. Fork le repository
2. Créer une branche pour votre fonctionnalité (`git checkout -b feature/AmazingFeature`)
3. Commit vos changements (`git commit -m 'Add some AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

## 📞 Support et Contact

Pour toute question ou support :
- Contacter l'équipe de développement
- Créer une issue dans le repository
- Consulter la documentation du projet

## 📄 Licence

Ce projet est sous licence propriétaire. Tous les droits sont réservés.

---

**Version** : 0.1.0  
**Dernière mise à jour** : 2026  
**Développé par** : Équipe Lac Novotel
