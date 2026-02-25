const express = require('express');
const router = express.Router();
const store = require('../data/store');

// POST /api/inscriptions - Demander une inscription
router.post('/', async (req, res) => {
  try {
    const { firstName, lastName, email, phone, company, formationId, message } = req.body;

    if (!firstName || !lastName || !email || !formationId) {
      return res.status(400).json({
        message: 'Veuillez remplir tous les champs obligatoires (prénom, nom, email, formation).'
      });
    }

    if (req.useMemory) {
      const formation = store.formations.find(f => f._id === formationId);
      if (!formation) {
        return res.status(404).json({ message: 'Formation non trouvée.' });
      }

      const inscription = {
        _id: 'i' + (++store.nextInscriptionId),
        firstName, lastName, email,
        phone: phone || '', company: company || '',
        formationId, formationTitle: formation.title,
        message: message || '', status: 'nouveau',
        createdAt: new Date().toISOString()
      };
      store.inscriptions.push(inscription);

      return res.status(201).json({
        message: `Votre demande d'inscription à "${formation.title}" a bien été envoyée. Nous vous contacterons rapidement.`,
        inscription
      });
    }

    const Formation = require('../models/Formation');
    const Inscription = require('../models/Inscription');

    const formation = await Formation.findById(formationId);
    if (!formation) {
      return res.status(404).json({ message: 'Formation non trouvée.' });
    }

    const inscription = new Inscription({
      firstName, lastName, email,
      phone: phone || '', company: company || '',
      formationId: formation._id,
      formationTitle: formation.title,
      message: message || ''
    });
    await inscription.save();

    res.status(201).json({
      message: `Votre demande d'inscription à "${formation.title}" a bien été envoyée. Nous vous contacterons rapidement.`,
      inscription
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(e => e.message);
      return res.status(400).json({ message: messages.join(', ') });
    }
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
});

module.exports = router;
