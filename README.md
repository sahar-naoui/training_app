
## Installation

### 1. Cloner le projet

```bash
cd training_app
```

### 2. Backend

```bash
cd server
npm install
```

Créer un fichier `.env` (déjà présent avec les valeurs par défaut) :

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/qwesty-training
NODE_ENV=development
```

### 3. Frontend

```bash
cd client
npm install
```

## Lancement

### 1. Démarrer MongoDB

Assurez-vous que MongoDB est en cours d'exécution sur votre machine, ou utilisez une URI MongoDB Atlas dans le fichier `.env`.

### 2. Peupler la base de données

```bash
cd server
npm run seed
```

### 3. Lancer le serveur backend

```bash
cd server
npm run dev
```

Le serveur API démarre sur `http://localhost:5000`.

### 4. Lancer le frontend

Dans un autre terminal :

```bash
cd client
npm run dev
```

L'application démarre sur `http://localhost:3000`.

