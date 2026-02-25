const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const { initTransporter } = require('./utils/mailer');
initTransporter();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Injecter le mode mémoire (par défaut true, changé si MongoDB se connecte)
let useMemory = true;

app.use((req, res, next) => {
  req.useMemory = useMemory;
  next();
});

  // Routes
  app.use('/api/formations', require('./routes/formations'));
  app.use('/api/contact', require('./routes/contact'));
  app.use('/api/inscriptions', require('./routes/inscriptions'));
  app.use('/api/auth', require('./routes/auth'));
  app.use('/api/admin', require('./routes/admin'));

app.get('/api', (req, res) => {
  res.json({
    message: 'Bienvenue sur l\'API Qwesty-training',
    version: '1.0.0',
    mode: useMemory ? 'memoire' : 'MongoDB',
    endpoints: { formations: '/api/formations', contact: '/api/contact' }
  });
});

app.use((req, res) => {
  res.status(404).json({ message: 'Route non trouvee' });
});

// Démarrer le serveur HTTP d'abord (pour qu'il soit toujours accessible)
app.listen(PORT, () => {
  console.log(`Serveur Qwesty-training demarre sur le port ${PORT}`);
  console.log(`API disponible sur http://localhost:${PORT}/api`);

  // Tenter la connexion MongoDB en arrière-plan
  const mongoose = require('mongoose');
  mongoose.connect(process.env.MONGODB_URI, {
    serverSelectionTimeoutMS: 8000,
  })
  .then(async () => {
    useMemory = false;
    console.log(`MongoDB connecte: ${mongoose.connection.host}`);
    console.log('Mode MongoDB actif.');

    // Enregistrer les modèles et créer les collections si elles n'existent pas
    const Formation = require('./models/Formation');
    const Contact = require('./models/Contact');
    const Inscription = require('./models/Inscription');

    const db = mongoose.connection.db;
    const collections = await db.listCollections().toArray();
    const names = collections.map(c => c.name);

    if (!names.includes('formations')) {
      await Formation.createCollection();
      console.log('  -> Collection "formations" creee.');
    }
    if (!names.includes('demandes')) {
      await Contact.createCollection();
      console.log('  -> Collection "demandes" creee.');
    }
    if (!names.includes('inscriptions')) {
      await Inscription.createCollection();
      console.log('  -> Collection "inscriptions" creee.');
    }

    console.log('Collections MongoDB pretes: formations, demandes, inscriptions');
  })
  .catch((err) => {
    console.warn(`MongoDB indisponible - mode memoire actif.`);
    mongoose.disconnect().catch(() => {});
  });
});
