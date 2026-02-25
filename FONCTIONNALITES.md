# Toutes les fonctionnalités du site Qwesty-training

Ce document détaille chaque fonctionnalité du site, avec l'emplacement exact dans le code et une explication de comment ça fonctionne.

---

## Architecture générale

```
Utilisateur (navigateur)
    │
    ▼
Frontend React (port 3000)          ← client/src/
    │  appels API via axios
    ▼
Backend Express (port 5000)          ← server/
    │  requêtes Mongoose
    ▼
MongoDB Atlas (cloud)                ← base de données
    ├── formations                   ← catalogue des formations
    ├── demandes                     ← messages de contact
    └── inscriptions                 ← demandes d'inscription
```

### Mode de fonctionnement double

Le serveur a deux modes :
- **Mode MongoDB** (par défaut) : les données sont stockées dans MongoDB Atlas et persistent entre les redémarrages
- **Mode mémoire** (fallback) : si MongoDB est inaccessible, le serveur utilise un store en mémoire (`server/data/store.js`). Les formations sont chargées depuis `server/data/formations.js`, mais les demandes et inscriptions sont perdues au redémarrage.

Le mode est déterminé au démarrage dans `server/server.js` (lignes 55-63). La variable `useMemory` est injectée dans chaque requête via un middleware (ligne 20-23).

---

## PARTIE PUBLIQUE

---

## 1. NAVIGATION ET ROUTING

### Fichier : `client/src/App.jsx`

C'est le fichier principal qui définit toutes les routes du site :

**Routes publiques :**
```
/                → Page d'accueil (Home.jsx)
/catalogue       → Catalogue des formations (Catalogue.jsx)
/formation/:slug → Détail d'une formation (FormationDetail.jsx)
/demos           → Démonstrations interactives (Demos.jsx)
/contact         → Formulaire de contact (Contact.jsx)
```

**Routes admin (protégées) :**
```
/admin/login         → Page de connexion admin (Login.jsx)
/admin               → Dashboard admin (Dashboard.jsx)
/admin/formations    → Gestion des formations (Formations.jsx)
/admin/formations/new         → Créer une formation (FormationForm.jsx)
/admin/formations/:id/edit    → Modifier une formation (FormationForm.jsx)
/admin/demandes      → Liste des demandes de contact (Demandes.jsx)
/admin/demandes/:id  → Détail d'une demande (DemandeDetail.jsx)
/admin/inscriptions  → Gestion des inscriptions (Inscriptions.jsx)
```

**Comment ça marche :** `react-router-dom` intercepte les clics sur les liens et affiche le bon composant sans recharger la page. Les routes admin sont enveloppées dans un `ProtectedRoute` qui vérifie l'authentification.

---

### Fichier : `client/src/components/Navbar.jsx`

**Fonctionnalités :**
- Barre de navigation fixe en haut de page (sticky)
- Effet de transparence : transparente en haut → foncée avec flou (backdrop-blur) quand on scroll
- Menu hamburger sur mobile
- Le lien actif est surligné en indigo

**Comment ça marche (effet scroll) :**
- Un `useEffect` écoute l'événement `scroll` de la fenêtre
- `setIsScrolled(window.scrollY > 20)` : si on a scrollé de plus de 20px, `isScrolled` passe à `true`
- La classe CSS change dynamiquement : `bg-transparent` → `bg-slate-900/95 backdrop-blur-md`

---

### Fichier : `client/src/components/ScrollToTop.jsx`

**Fonctionnalité :** Quand on change de page, le scroll revient automatiquement en haut.

---

## 2. PAGE D'ACCUEIL

### Fichier : `client/src/pages/Home.jsx`

C'est la page principale avec 5 sections :

**Section 1 — Hero (`client/src/components/Hero.jsx`) :**
- Grand titre animé "Formez-vous à l'IA" avec un dégradé sur "l'IA"
- 2 boutons CTA : "Découvrir nos formations" → /catalogue, "Nous contacter" → /contact
- Éléments décoratifs flottants avec animation CSS (`animate-float`)
- Barre de statistiques : 8 Formations, 4 Niveaux, +500 Professionnels, Sur mesure

**Section 2 — "Pourquoi choisir Qwestinum ?" :**
- 4 cartes de propositions de valeur avec icônes
- Effet hover : bordure indigo + ombre

**Section 3 — "Nos formations phares" :**
- Appel API `getFeaturedFormations()` au chargement
- Affiche les formations marquées `featured: true` (4 formations)
- Utilise le composant `FormationCard`

**Section 4 — "Parcours de formation" :**
- Timeline visuelle avec 4 niveaux (vert → jaune → bleu → rouge)
- Chaque niveau est cliquable → catalogue filtré

**Section 5 — CTA final :**
- Fond sombre avec dégradé + bouton vers la page contact

---

## 3. CATALOGUE DES FORMATIONS

### Fichier : `client/src/pages/Catalogue.jsx`

**Filtrage par niveau :**
- 5 boutons : Tous, Niveau 1, 2, 3, 4
- Synchronisé avec l'URL (`?niveau=2`) via `useSearchParams()`

**Recherche :**
- Champ de texte avec icône loupe
- Recherche "debounced" : attend 300ms après la dernière frappe avant de lancer la requête

**Affichage :** Grille de cartes `FormationCard` en 3 colonnes sur grand écran.

### Fichier : `client/src/components/FormationCard.jsx`
Carte cliquable avec : badge de niveau, titre, sous-titre, durée, public, objectifs, lien "Voir la formation".

### Fichier : `client/src/components/LevelBadge.jsx`
Badge coloré selon le niveau (vert/jaune/bleu/rouge).

---

## 4. DÉTAIL D'UNE FORMATION

### Fichier : `client/src/pages/FormationDetail.jsx`

**Récupération des données :**
- `useParams()` extrait le `slug` de l'URL
- Appel API `getFormationBySlug(slug)` au chargement

**Système d'onglets :**
- 4 onglets : Objectifs, Programme, Livrables, Formats
- L'onglet actif a une bordure indigo en bas

**Sidebar sticky :**
- Carte qui reste visible au scroll avec : durée, public, niveau, prérequis

**Inscription :**
- Bouton "Demander une inscription" ouvre un modal (`InscriptionModal`)
- Le modal collecte : prénom, nom, email, téléphone, entreprise, message
- Envoi via `sendInscription()` → POST `/api/inscriptions`
- La demande est enregistrée en base de données

---

## 5. DÉMONSTRATIONS INTERACTIVES

### Fichier : `client/src/pages/Demos.jsx`

Cette page contient **4 démonstrations interactives** dans des composants `DemoCard` (accordéon expand/collapse).

---

### 5.1 GÉNÉRATEUR DE PROMPT PROFESSIONNEL

**Fonction :** `DemoPrompt`

**But :** Montrer concrètement la compétence de "prompt engineering" enseignée en formation.

**Fonctionnalités :**
- **Encart explicatif** : explique que la qualité de la réponse d'une IA dépend à 80% de l'instruction
- **Comparaison avant/après** : prompt vague (rouge) vs prompt structuré (vert) — montre la différence visuelle
- **6 catégories** : Email, Analyse de données, Contenu, Code, Stratégie, RH — chaque catégorie attribue un rôle d'expert spécialisé
- **4 tons** : Professionnel, Convaincant, Simple, Créatif — chaque ton adapte les consignes
- **Prompt structuré** généré avec la méthode professionnelle : RÔLE + CONTEXTE + TÂCHE + CONSIGNES + FORMAT + CONTRAINTES
- **Bouton "Copier"** : copie le prompt dans le presse-papier pour le coller dans ChatGPT

**Comment ça marche :**
- La fonction `buildPrompt(task, category, tone)` construit un prompt structuré en combinant le rôle (selon la catégorie), les contraintes (selon le ton), et la tâche de l'utilisateur
- Un `setTimeout` de 1.2s simule un temps de traitement
- Le prompt est affiché dans un bloc stylé avec header violet et instruction pour le copier

---

### 5.2 CALCULATEUR DE ROI (Retour sur Investissement)

**Fonction :** `DemoROI`

**But :** Convaincre les dirigeants que former leurs employés à l'IA est un investissement rentable.

**Fonctionnalités :**
- **Encart bleu explicatif** : "Le ROI mesure ce que vous gagnez par rapport à ce que vous investissez. L'investissement = former vos employés. Le gain = le temps économisé."
- **3 étapes visuelles** : Former → Travailler plus vite → Économiser
- **3 champs de saisie** : Nombre d'employés, Temps gagné/jour (min), Coût horaire (€)
- **Calcul en temps réel** : le résultat se met à jour instantanément sans bouton
- **Résultat détaillé** : économies en euros, heures économisées/an, équivalent en jours de travail
- **Formule visible** en bas du résultat

**Calcul :**
```
Économies = Employés × (Minutes/60) × 220 jours × Coût horaire
Heures/an = Employés × (Minutes/60) × 220
Jours équivalents = Heures/an ÷ 8
```
Exemple : 50 employés × 0.5h × 220 jours × 35€ = **192 500 €/an**

---

### 5.3 QUIZ IA

**Fonction :** `DemoQuiz`

**But :** Tester les connaissances du visiteur et l'orienter vers le niveau de formation adapté.

**Fonctionnalités :**
- **6 questions** à choix multiples sur l'IA (prompt engineering, IA générative, RAG, Vibecoding, hallucinations, intégration IA)
- **Barre de progression** qui montre l'avancement
- **Feedback immédiat** après chaque réponse : la bonne réponse est en vert, la mauvaise en rouge
- **Explication** après chaque réponse avec un lien vers la formation concernée
- **Bouton "Question suivante"** : l'utilisateur contrôle le rythme
- **Résultat final** avec score et orientation :
  - Score élevé → "Nos formations avancées (Niveau 3-4) sont faites pour vous"
  - Score moyen → "Nos formations Niveau 1-2 vous aideront"
  - Score faible → "Nos formations Niveau 1 sont le point de départ idéal"

---

### 5.4 CHATBOT DÉMO

**Fonction :** `DemoChatbot`

**But :** Montrer un exemple d'assistant IA conversationnel comme ceux créés en formation Niveau 2.

**Fonctionnalités :**
- Interface de messagerie avec bulles (utilisateur à droite, bot à gauche)
- Détection de mots-clés : formations, catalogue, contact, prix, qwestinum, vibecoding, inscription, IA
- Réponse après 800ms de délai simulé
- Support du texte multi-ligne dans les réponses

---

## 6. FORMULAIRE DE CONTACT

### Fichier : `client/src/pages/Contact.jsx`

**Sujets disponibles :**
- Demande d'information
- Formation sur mesure
- Partenariat
- Autre

**Note :** L'option "Inscription à une formation" a été retirée car une fonctionnalité dédiée existe désormais.

**Validation :** Champs obligatoires (prénom, nom, email, sujet, message), validation email par regex.

**Envoi :** POST `/api/contact` → enregistré dans la collection `demandes` de MongoDB.

---

## PARTIE ADMIN

---

## 7. AUTHENTIFICATION ADMIN

### Fichier : `client/src/context/AuthContext.jsx`

**Fonctionnalité :** Context React qui gère l'état d'authentification global.

**États fournis :**
- `user` : informations de l'admin connecté (email)
- `token` : JWT stocké dans le localStorage
- `isAuthenticated` : booléen
- `loading` : vrai pendant la vérification initiale du token

**Fonctions fournies :**
- `login(email, password)` : appelle POST `/api/auth/login`, stocke le token
- `logout()` : supprime le token, redirige vers /admin/login

**Persistance :** Au chargement, vérifie si un token existe dans le localStorage et le valide via GET `/api/auth/verify`.

### Fichier : `client/src/components/ProtectedRoute.jsx`

**Fonctionnalité :** Composant qui enveloppe les routes admin. Si l'utilisateur n'est pas authentifié, il est redirigé vers `/admin/login`.

### Fichier : `server/middleware/auth.js`

**Fonctionnalité :** Middleware Express qui vérifie le token JWT dans le header `Authorization: Bearer <token>`. Si le token est invalide ou absent, renvoie une erreur 401.

### Fichier : `server/routes/auth.js`

| Route | Méthode | Description |
|-------|---------|-------------|
| `/api/auth/login` | POST | Vérifie email/mot de passe, retourne un JWT |
| `/api/auth/verify` | GET | Vérifie la validité d'un token existant |

---

## 8. LAYOUT ADMIN

### Fichier : `client/src/components/AdminLayout.jsx`

**Fonctionnalité :** Layout commun à toutes les pages admin.

**Contenu :**
- **Sidebar gauche** avec liens de navigation : Dashboard, Formations, Demandes, Inscriptions
- **Header** avec nom de l'admin et bouton déconnexion
- **Zone de contenu** (`<Outlet />`) qui affiche la page admin active

---

## 9. DASHBOARD ADMIN

### Fichier : `client/src/pages/admin/Dashboard.jsx`

**Données affichées :**
- Nombre total de formations
- Demandes totales / nouvelles / traitées
- Inscriptions totales / nouvelles

**Tableaux :**
- 5 dernières demandes de contact (nom, email, sujet, statut, date)
- 5 dernières inscriptions (nom, formation, statut, date)

**API :** GET `/api/admin/dashboard` → retourne `{ stats, dernieresDemandes, dernieresInscriptions }`

---

## 10. GESTION DES FORMATIONS (ADMIN)

### Fichier : `client/src/pages/admin/Formations.jsx`

**Fonctionnalités :**
- Tableau de toutes les formations avec colonnes : Titre, Niveau, Durée, Public, Inscriptions, Mise en avant, Actions
- Compteur d'inscriptions par formation (badge violet si > 0)
- Boutons "Modifier" et "Supprimer" pour chaque formation
- Bouton "Nouvelle formation" en haut

### Fichier : `client/src/pages/admin/FormationForm.jsx`

**Fonctionnalités :**
- Formulaire de création/modification de formation
- Champs : titre, sous-titre, niveau, public, durée, prérequis, objectifs, programme, livrables, formats, mise en avant
- Détection automatique du mode (création si URL `/new`, édition si URL `/:id/edit`)

### Routes API admin formations

| Route | Méthode | Description |
|-------|---------|-------------|
| `/api/admin/formations` | GET | Liste toutes les formations + compteur inscriptions |
| `/api/admin/formations/:id` | GET | Détail d'une formation |
| `/api/admin/formations` | POST | Créer une formation |
| `/api/admin/formations/:id` | PUT | Modifier une formation |
| `/api/admin/formations/:id` | DELETE | Supprimer une formation |

---

## 11. GESTION DES DEMANDES DE CONTACT (ADMIN)

### Fichier : `client/src/pages/admin/Demandes.jsx`

**Fonctionnalités :**
- Liste de toutes les demandes avec filtrage par statut (Tous, Nouveau, Lu, Traité)
- Affichage : nom, email, sujet, statut (badge coloré), date
- Clic sur une demande → page de détail

### Fichier : `client/src/pages/admin/DemandeDetail.jsx`

**Fonctionnalités :**

**Changement de statut automatique :**
- Quand l'admin ouvre une demande, si le statut est "nouveau", il passe automatiquement à **"lu"** (côté backend dans `GET /api/admin/demandes/:id`)

**Affichage :**
- Sujet et date de réception
- Message complet de l'utilisateur
- Informations de contact dans la sidebar : nom, email (cliquable), téléphone, entreprise
- Indicateur de progression du statut : Nouveau → Lu → Traité

**Réponse par email :**
- Zone de texte pour écrire une réponse
- Indication de l'adresse email destinataire
- Bouton "Envoyer la réponse" qui :
  1. Enregistre la réponse dans la base de données
  2. Change le statut à "traité" automatiquement
  3. Envoie un email au contact (si SMTP configuré)
  4. Affiche un message de confirmation
- Si SMTP n'est pas configuré, l'email est simulé en console et la réponse est quand même enregistrée
- Si une réponse a déjà été envoyée, elle est affichée dans un bloc vert avec la date

**Suppression :** Bouton pour supprimer la demande.

### Fichier : `server/utils/mailer.js`

**Fonctionnalité :** Utilitaire d'envoi d'emails via Nodemailer.

**Fonctions :**
- `initTransporter()` : initialise le transporteur SMTP au démarrage. Si les variables SMTP ne sont pas configurées, active le mode simulation.
- `sendReplyEmail({ to, contactName, originalSubject, replyMessage })` : envoie un email HTML formaté avec le logo Qwestinum, le message de réponse, et les coordonnées.

**Template email :** Email HTML responsive avec :
- Header violet dégradé "Qwesty-Training"
- Référence au sujet original
- Message de réponse dans un bloc stylé
- Signature "L'équipe Qwestinum"

### Routes API admin demandes

| Route | Méthode | Description |
|-------|---------|-------------|
| `/api/admin/demandes` | GET | Liste les demandes (filtre optionnel `?statut=`) |
| `/api/admin/demandes/:id` | GET | Détail + passage automatique à "lu" |
| `/api/admin/demandes/:id/statut` | PATCH | Changer le statut manuellement |
| `/api/admin/demandes/:id/reply` | POST | Envoyer une réponse par email |
| `/api/admin/demandes/:id` | DELETE | Supprimer une demande |

---

## 12. GESTION DES INSCRIPTIONS (ADMIN)

### Fichier : `client/src/pages/admin/Inscriptions.jsx`

**Fonctionnalités :**
- Liste de toutes les demandes d'inscription
- Filtrage par statut : Tous, Nouveau, Confirmé, Refusé
- Affichage : nom, email, formation, statut (badge coloré), date
- Actions rapides : Confirmer, Refuser, Supprimer

### Routes API admin inscriptions

| Route | Méthode | Description |
|-------|---------|-------------|
| `/api/admin/inscriptions` | GET | Liste les inscriptions (filtre `?statut=`) |
| `/api/admin/inscriptions/:id/statut` | PATCH | Confirmer ou refuser |
| `/api/admin/inscriptions/:id` | DELETE | Supprimer |

### Route API publique inscription

| Route | Méthode | Description |
|-------|---------|-------------|
| `/api/inscriptions` | POST | Demande d'inscription (depuis FormationDetail) |

**Champs envoyés :** firstName, lastName, email, phone, company, formationId, message

---

## 13. BASE DE DONNÉES

### 3 collections MongoDB

**Collection `formations`** — Modèle : `server/models/Formation.js`
- title, slug, subtitle, level (number, label, color), public, duration
- prerequisites, objectives[], program[], deliverables[], formats[]
- featured, order
- Timestamps automatiques (createdAt, updatedAt)

**Collection `demandes`** — Modèle : `server/models/Contact.js`
- firstName, lastName, email, company, phone
- subject, formation (ref → Formation), message
- status : `nouveau` | `lu` | `traité`
- reply, repliedAt (ajoutés quand l'admin répond)
- Timestamps automatiques

**Collection `inscriptions`** — Modèle : `server/models/Inscription.js`
- firstName, lastName, email, phone, company
- formationId (ref → Formation), formationTitle, message
- status : `nouveau` | `confirmé` | `refusé`
- Timestamps automatiques

### Store mémoire : `server/data/store.js`

Fallback quand MongoDB est inaccessible. Contient :
- `formations[]` : chargées depuis `server/data/formations.js`
- `contacts[]` : vide au démarrage
- `inscriptions[]` : vide au démarrage
- Compteurs d'IDs pour chaque entité

---

## 14. SERVICES API (FRONTEND)

### Fichier : `client/src/services/api.js`

| Fonction | Appel HTTP | Utilisée par |
|----------|-----------|--------------|
| `getFormations(params)` | GET `/api/formations` | Catalogue.jsx |
| `getFeaturedFormations()` | GET `/api/formations/featured` | Home.jsx |
| `getFormationBySlug(slug)` | GET `/api/formations/:slug` | FormationDetail.jsx |
| `getLevels()` | GET `/api/formations/levels` | Home.jsx, Catalogue.jsx |
| `sendContact(data)` | POST `/api/contact` | Contact.jsx |
| `sendInscription(data)` | POST `/api/inscriptions` | FormationDetail.jsx |

---

## 15. STYLES ET DESIGN

### Fichier : `client/src/index.css`

- Import de la police Google Fonts (Inter + Space Grotesk)
- Configuration Tailwind de base (scroll-behavior, font-family)
- Animations personnalisées : `fadeIn`, `slideUp`, `float`
- Classes utilitaires : `gradient-hero`, `gradient-accent`, `glass`
- Variables de couleurs par niveau

### Favicon : `client/public/favicon.svg`

Icône personnalisée SVG représentant :
- Fond violet dégradé (couleurs Qwestinum)
- Cerveau/réseau neuronal (symbole IA)
- Étoile dorée (apprentissage)
- Livre ouvert (formations)

---

## 16. SEED (peuplement de la base)

### Fichier : `server/seed.js`

Contient les données des **8 formations** du catalogue Qwestinum :
- Niveau 1 (vert) : "IA pour décideurs" + "Travailler avec l'IA au quotidien"
- Niveau 2 (jaune) : "Automatiser ses processus" + "Créer un assistant IA interne"
- Niveau 3 (bleu) : "Feuille de route IA" + "Piloter la performance"
- Niveau 4 (rouge) : "Systèmes intelligents robustes" + "Sécurité et éthique"

---

## Résumé visuel de l'architecture

```
client/src/
├── App.jsx                     ← Routes (public + admin)
├── main.jsx                    ← Point d'entrée React
├── index.css                   ← Styles globaux + Tailwind
├── context/
│   └── AuthContext.jsx          ← Authentification admin
├── services/
│   └── api.js                   ← Appels HTTP centralisés
├── components/
│   ├── Navbar.jsx               ← Navigation publique
│   ├── Footer.jsx               ← Pied de page
│   ├── Hero.jsx                 ← Section héro accueil
│   ├── FormationCard.jsx        ← Carte formation
│   ├── LevelBadge.jsx           ← Badge de niveau
│   ├── ScrollToTop.jsx          ← Scroll auto en haut
│   ├── ProtectedRoute.jsx       ← Protection routes admin
│   └── AdminLayout.jsx          ← Layout sidebar admin
├── pages/
│   ├── Home.jsx                 ← Page d'accueil
│   ├── Catalogue.jsx            ← Catalogue formations
│   ├── FormationDetail.jsx      ← Détail + inscription
│   ├── Demos.jsx                ← 4 démos interactives
│   ├── Contact.jsx              ← Formulaire de contact
│   └── admin/
│       ├── Login.jsx            ← Connexion admin
│       ├── Dashboard.jsx        ← Tableau de bord
│       ├── Formations.jsx       ← Liste formations
│       ├── FormationForm.jsx    ← Créer/modifier formation
│       ├── Demandes.jsx         ← Liste demandes
│       ├── DemandeDetail.jsx    ← Détail + réponse email
│       └── Inscriptions.jsx     ← Gestion inscriptions

server/
├── server.js                    ← Point d'entrée Express
├── seed.js                      ← Script peuplement BD
├── .env                         ← Variables d'environnement
├── config/
│   └── db.js                    ← Connexion MongoDB
├── middleware/
│   └── auth.js                  ← Vérification JWT
├── models/
│   ├── Formation.js             ← Schéma formation
│   ├── Contact.js               ← Schéma demande (collection "demandes")
│   └── Inscription.js           ← Schéma inscription
├── routes/
│   ├── formations.js            ← Routes publiques formations
│   ├── contact.js               ← Routes publiques contact
│   ├── inscriptions.js          ← Routes publiques inscriptions
│   ├── auth.js                  ← Routes authentification
│   └── admin.js                 ← Routes admin (protégées)
├── data/
│   ├── formations.js            ← Données initiales formations
│   └── store.js                 ← Store mémoire (fallback)
└── utils/
    └── mailer.js                ← Envoi d'emails (Nodemailer)
```
