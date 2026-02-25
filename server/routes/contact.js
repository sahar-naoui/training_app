const express = require('express');
const router = express.Router();
const store = require('../data/store');

// POST /api/contact
router.post('/', async (req, res) => {
  try {
    const { firstName, lastName, email, company, phone, subject, formation, message } = req.body;

    if (!firstName || !lastName || !email || !subject || !message) {
      return res.status(400).json({
        message: 'Veuillez remplir tous les champs obligatoires (prénom, nom, email, sujet, message)'
      });
    }

    if (req.useMemory) {
      const contact = {
        _id: 'c' + (++store.nextContactId),
        firstName, lastName, email,
        company: company || '',
        phone: phone || '',
        subject,
        formation: formation || null,
        message,
        status: 'nouveau',
        createdAt: new Date().toISOString()
      };
      store.contacts.push(contact);
      return res.status(201).json({
        message: 'Votre message a bien été envoyé. Nous vous répondrons dans les plus brefs délais.',
        contact
      });
    }

    const Contact = require('../models/Contact');
    const contact = new Contact({ firstName, lastName, email, company, phone, subject, formation: formation || null, message });
    await contact.save();
    res.status(201).json({ message: 'Votre message a bien été envoyé. Nous vous répondrons dans les plus brefs délais.', contact });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(e => e.message);
      return res.status(400).json({ message: messages.join(', ') });
    }
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
});

// GET /api/contact
router.get('/', async (req, res) => {
  try {
    if (req.useMemory) return res.json(store.contacts);
    const Contact = require('../models/Contact');
    const contacts = await Contact.find().populate('formation', 'title slug').sort({ createdAt: -1 });
    res.json(contacts);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
});

module.exports = router;
