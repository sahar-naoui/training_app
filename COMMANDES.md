# Toutes les commandes utilisées pour le projet Qwesty-training

Ce document explique chaque commande exécutée pour créer et lancer ce projet, dans l'ordre chronologique.

---

## 1. Création du projet Backend

### 1.1 Créer le dossier serveur
```bash
mkdir server
```
**Pourquoi ?** Crée le dossier `server/` qui contiendra tout le code backend (API, modèles, routes).

---

### 1.2 Installer les dépendances backend de base
```bash
cd server
npm install express mongoose cors dotenv nodemon
```
**Pourquoi ?** Installe les 5 librairies nécessaires au backend :

| Package | Rôle |
|---------|------|
| `express` | Framework web pour créer l'API REST (gère les routes HTTP GET, POST, etc.) |
| `mongoose` | Librairie pour se connecter à MongoDB et définir des modèles de données |
| `cors` | Autorise le frontend (port 3000) à communiquer avec le backend (port 5000) |
| `dotenv` | Charge les variables d'environnement depuis le fichier `.env` (URI MongoDB, port...) |
| `nodemon` | Redémarre automatiquement le serveur quand on modifie un fichier (utile en développement) |

**Résultat :** Un fichier `package.json` et un dossier `node_modules/` sont créés dans `server/`.

---

### 1.3 Installer les dépendances d'authentification admin
```bash
cd server
npm install bcryptjs jsonwebtoken
```
**Pourquoi ?** Installe les librairies nécessaires pour l'espace admin :

| Package | Rôle |
|---------|------|
| `bcryptjs` | Hachage sécurisé des mots de passe (l'admin ne stocke jamais le mot de passe en clair) |
| `jsonwebtoken` | Création et vérification de tokens JWT pour maintenir la session admin |

---

### 1.4 Installer Nodemailer pour l'envoi d'emails
```bash
cd server
npm install nodemailer
```
**Pourquoi ?** Permet d'envoyer de vrais emails (réponses aux demandes de contact) via un serveur SMTP (Gmail, Outlook, etc.).

| Package | Rôle |
|---------|------|
| `nodemailer` | Envoi d'emails depuis Node.js via SMTP. Utilisé quand l'admin répond à une demande de contact. |

---

## 2. Création du projet Frontend

### 2.1 Créer le projet React avec Vite
```bash
npm create vite@latest client -- --template react
```
**Pourquoi ?** Crée un projet React pré-configuré dans le dossier `client/` en utilisant Vite comme bundler (plus rapide que Create React App).

- `vite@latest` : utilise la dernière version de Vite
- `client` : nom du dossier créé
- `--template react` : utilise le template React (pas TypeScript, pas Vue, etc.)

**Résultat :** Un dossier `client/` avec une structure React complète (src/, index.html, vite.config.js...).

---

### 2.2 Installer les dépendances de base du frontend
```bash
cd client
npm install
```
**Pourquoi ?** Installe les dépendances listées dans le `package.json` généré par Vite (react, react-dom, etc.).

---

### 2.3 Installer les dépendances supplémentaires
```bash
npm install react-router-dom axios lucide-react
```
**Pourquoi ?** Installe 3 librairies supplémentaires :

| Package | Rôle |
|---------|------|
| `react-router-dom` | Gère la navigation entre les pages (/, /catalogue, /contact...) sans recharger la page |
| `axios` | Effectue les appels HTTP vers l'API backend (GET formations, POST contact...) |
| `lucide-react` | Fournit des icônes SVG modernes (flèches, menus, horloge, utilisateurs...) |

---

### 2.4 Installer TailwindCSS
```bash
npm install -D tailwindcss @tailwindcss/vite
```
**Pourquoi ?** Installe TailwindCSS v4 et son plugin Vite :

| Package | Rôle |
|---------|------|
| `tailwindcss` | Framework CSS utilitaire (on écrit `className="bg-blue-500 text-white"` au lieu de CSS personnalisé) |
| `@tailwindcss/vite` | Plugin qui intègre Tailwind directement dans le processus de build Vite |

Le `-D` signifie "devDependency" : c'est une dépendance de développement, pas nécessaire en production.

---

## 3. Configuration de l'environnement

### 3.1 Fichier `.env` (server/.env)
```env
PORT=5000
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/qwesty-training
NODE_ENV=development
JWT_SECRET=qwesty-training-secret-key-2026
ADMIN_EMAIL=admin@qwestinum.com
ADMIN_PASSWORD=admin123

# Configuration SMTP pour l'envoi d'emails
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=votre-email@gmail.com
SMTP_PASS=votre-mot-de-passe-application
SMTP_FROM=Qwesty-Training <noreply@qwestinum.com>
```

| Variable | Rôle |
|----------|------|
| `PORT` | Port du serveur backend |
| `MONGODB_URI` | URI de connexion à MongoDB Atlas (cloud) |
| `JWT_SECRET` | Clé secrète pour signer les tokens d'authentification admin |
| `ADMIN_EMAIL` | Email de connexion à l'espace admin |
| `ADMIN_PASSWORD` | Mot de passe admin (haché au premier login) |
| `SMTP_HOST/PORT/USER/PASS` | Configuration du serveur SMTP pour envoyer de vrais emails |
| `SMTP_FROM` | Adresse d'expéditeur affichée dans les emails |

**Pour configurer Gmail :**
1. Activer la validation en 2 étapes sur votre compte Google
2. Créer un "Mot de passe d'application" sur https://myaccount.google.com/apppasswords
3. Utiliser ce mot de passe dans `SMTP_PASS`

---

## 4. Peupler la base de données

### 4.1 Lancer le script de seed
```bash
cd server
node seed.js
```
**Pourquoi ?** Exécute le fichier `seed.js` qui :
1. Se connecte à MongoDB Atlas via l'URI dans `.env`
2. Supprime les formations existantes (pour repartir propre)
3. Insère les 8 formations du catalogue Qwestinum dans la base
4. Affiche un résumé et se déconnecte

**Quand l'utiliser ?** Uniquement au premier lancement, ou si vous voulez réinitialiser les données formations.

**Note :** Les collections `demandes` et `inscriptions` sont créées automatiquement au démarrage du serveur.

---

## 5. Lancer le projet

### 5.1 Démarrer le serveur backend
```bash
cd server
npm run dev
```
**Pourquoi ?** Lance le serveur API sur `http://localhost:5000`.

- `npm run dev` exécute la commande définie dans `package.json` → `nodemon server.js`
- `nodemon` surveille les fichiers et redémarre automatiquement si vous modifiez le code
- Le serveur se connecte à MongoDB et expose les routes API
- Les collections `formations`, `demandes` et `inscriptions` sont créées si elles n'existent pas

**Résultat attendu :**
```
[Mailer] SMTP non configuré — les emails seront simulés en console.
Serveur Qwesty-training demarre sur le port 5000
API disponible sur http://localhost:5000/api
MongoDB connecte: ...
Mode MongoDB actif.
  -> Collection "demandes" creee.
  -> Collection "inscriptions" creee.
Collections MongoDB pretes: formations, demandes, inscriptions
```

**Note :** Si MongoDB n'est pas accessible, le serveur fonctionne quand même en **mode mémoire** (les données sont perdues au redémarrage).

---

### 5.2 Démarrer le frontend (dans un AUTRE terminal)
```bash
cd client
npm run dev
```
**Pourquoi ?** Lance le serveur de développement Vite sur `http://localhost:3000`.

- Le proxy dans `vite.config.js` redirige automatiquement les appels `/api/*` vers le backend (port 5000)
- Hot Module Replacement (HMR) : les modifications dans le code sont reflétées instantanément dans le navigateur

**Résultat attendu :**
```
VITE v7.x.x  ready in 500 ms
➜  Local:   http://localhost:3000/
```

---

### 5.3 Ouvrir le site
- **Site public :** http://localhost:3000
- **Espace admin :** http://localhost:3000/admin/login
  - Email : `admin@qwestinum.com`
  - Mot de passe : `admin123`

---

## 6. Commandes utiles (bonus)

### Compiler le frontend pour la production
```bash
cd client
npm run build
```
**Pourquoi ?** Génère les fichiers optimisés dans `client/dist/` pour le déploiement en production. Les fichiers JS et CSS sont minifiés et compressés.

---

### Vérifier que l'API fonctionne
Ouvrez dans votre navigateur :
- `http://localhost:5000/api` → Message de bienvenue + mode actif (MongoDB ou mémoire)
- `http://localhost:5000/api/formations` → Liste JSON des 8 formations
- `http://localhost:5000/api/formations/featured` → Formations mises en avant

---

## Résumé des commandes dans l'ordre

```bash
# 1. Backend — Installation
cd server
npm install                                     # Dépendances de base
npm install bcryptjs jsonwebtoken               # Authentification admin
npm install nodemailer                          # Envoi d'emails

# 2. Frontend — Installation
cd client
npm install                                     # Dépendances de base
npm install react-router-dom axios lucide-react # Navigation, API, icônes
npm install -D tailwindcss @tailwindcss/vite    # CSS

# 3. Configurer l'environnement
# → Éditer server/.env avec vos valeurs MongoDB, SMTP, etc.

# 4. Peupler la base
cd server
node seed.js                                    # 8 formations insérées

# 5. Lancer (2 terminaux séparés)
# Terminal 1 :
cd server
npm run dev                                     # Backend sur :5000

# Terminal 2 :
cd client
npm run dev                                     # Frontend sur :3000
```
