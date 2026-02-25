const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const authMiddleware = require('../middleware/auth');

// Hash du mot de passe admin généré au démarrage
let adminPasswordHash = null;

const getAdminHash = async () => {
  if (!adminPasswordHash) {
    adminPasswordHash = await bcrypt.hash(process.env.ADMIN_PASSWORD, 10);
  }
  return adminPasswordHash;
};

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email et mot de passe requis.' });
    }

    // Vérifier l'email admin
    if (email !== process.env.ADMIN_EMAIL) {
      return res.status(401).json({ message: 'Identifiants incorrects.' });
    }

    // Vérifier le mot de passe
    const hash = await getAdminHash();
    const isMatch = await bcrypt.compare(password, hash);

    if (!isMatch) {
      return res.status(401).json({ message: 'Identifiants incorrects.' });
    }

    // Générer le token JWT (expire dans 24h)
    const token = jwt.sign(
      { email, role: 'admin' },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      message: 'Connexion réussie.',
      token,
      admin: { email, role: 'admin' }
    });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
});

// GET /api/auth/me - Vérifier le token
router.get('/me', authMiddleware, (req, res) => {
  res.json({ admin: req.admin });
});

module.exports = router;
