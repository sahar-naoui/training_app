const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const store = require('../data/store');
const { sendReplyEmail } = require('../utils/mailer');

router.use(authMiddleware);

// =============================================
// DASHBOARD
// =============================================
router.get('/dashboard', async (req, res) => {
  try {
    if (req.useMemory) {
      const stats = {
        formations: store.formations.length,
        demandes_total: store.contacts.length,
        demandes_nouvelles: store.contacts.filter(c => c.status === 'nouveau').length,
        demandes_traitees: store.contacts.filter(c => c.status === 'traité').length,
        inscriptions_total: store.inscriptions.length,
        inscriptions_nouvelles: store.inscriptions.filter(i => i.status === 'nouveau').length,
      };
      const dernieresDemandes = [...store.contacts]
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 5);
      const dernieresInscriptions = [...store.inscriptions]
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 5);

      return res.json({ stats, dernieresDemandes, dernieresInscriptions });
    }

    const Formation = require('../models/Formation');
    const Contact = require('../models/Contact');
    const Inscription = require('../models/Inscription');

    const stats = {
      formations: await Formation.countDocuments(),
      demandes_total: await Contact.countDocuments(),
      demandes_nouvelles: await Contact.countDocuments({ status: 'nouveau' }),
      demandes_traitees: await Contact.countDocuments({ status: 'traité' }),
      inscriptions_total: await Inscription.countDocuments(),
      inscriptions_nouvelles: await Inscription.countDocuments({ status: 'nouveau' }),
    };
    const dernieresDemandes = await Contact.find().populate('formation', 'title slug').sort({ createdAt: -1 }).limit(5);
    const dernieresInscriptions = await Inscription.find().sort({ createdAt: -1 }).limit(5);

    res.json({ stats, dernieresDemandes, dernieresInscriptions });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
});

// =============================================
// CRUD FORMATIONS
// =============================================

const slugify = (text) =>
  text.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

router.get('/formations', async (req, res) => {
  try {
    if (req.useMemory) {
      const formations = [...store.formations]
        .sort((a, b) => a.level.number - b.level.number || a.order - b.order)
        .map(f => ({
          ...f,
          inscriptionsCount: store.inscriptions.filter(i => i.formationId === f._id).length,
        }));
      return res.json(formations);
    }

    const Formation = require('../models/Formation');
    const Inscription = require('../models/Inscription');

    const formations = await Formation.find().sort({ 'level.number': 1, order: 1 }).lean();
    for (const f of formations) {
      f.inscriptionsCount = await Inscription.countDocuments({ formationId: f._id });
    }

    res.json(formations);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
});

router.get('/formations/:id', async (req, res) => {
  try {
    if (req.useMemory) {
      const f = store.formations.find(f => f._id === req.params.id);
      return f ? res.json(f) : res.status(404).json({ message: 'Formation non trouvée' });
    }
    const Formation = require('../models/Formation');
    const f = await Formation.findById(req.params.id);
    return f ? res.json(f) : res.status(404).json({ message: 'Formation non trouvée' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
});

router.post('/formations', async (req, res) => {
  try {
    const { title, subtitle, level, public: pub, duration, prerequisites, objectives, program, deliverables, formats, featured } = req.body;
    if (!title || !level || !pub || !duration) {
      return res.status(400).json({ message: 'Titre, niveau, public et durée sont requis.' });
    }
    const slug = slugify(title);

    if (req.useMemory) {
      const newF = {
        _id: 'f' + (++store.nextFormationId),
        title, slug, subtitle: subtitle || '',
        level: typeof level === 'object' ? level : { number: parseInt(level), label: '', color: '' },
        public: pub, duration, prerequisites: prerequisites || 'Aucun',
        objectives: objectives || [], program: program || [],
        deliverables: deliverables || [], formats: formats || [],
        featured: featured || false, order: store.formations.length + 1,
        createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
      };
      store.formations.push(newF);
      return res.status(201).json({ message: 'Formation créée avec succès.', formation: newF });
    }

    const Formation = require('../models/Formation');
    const f = new Formation({ title, slug, subtitle, level, public: pub, duration, prerequisites, objectives, program, deliverables, formats, featured, order: (await Formation.countDocuments()) + 1 });
    await f.save();
    res.status(201).json({ message: 'Formation créée avec succès.', formation: f });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
});

router.put('/formations/:id', async (req, res) => {
  try {
    const { title, subtitle, level, public: pub, duration, prerequisites, objectives, program, deliverables, formats, featured } = req.body;

    if (req.useMemory) {
      const idx = store.formations.findIndex(f => f._id === req.params.id);
      if (idx === -1) return res.status(404).json({ message: 'Formation non trouvée' });
      const updated = {
        ...store.formations[idx],
        ...(title && { title, slug: slugify(title) }),
        ...(subtitle !== undefined && { subtitle }),
        ...(level && { level: typeof level === 'object' ? level : store.formations[idx].level }),
        ...(pub && { public: pub }),
        ...(duration && { duration }),
        ...(prerequisites !== undefined && { prerequisites }),
        ...(objectives && { objectives }),
        ...(program && { program }),
        ...(deliverables && { deliverables }),
        ...(formats && { formats }),
        ...(featured !== undefined && { featured }),
        updatedAt: new Date().toISOString(),
      };
      store.formations[idx] = updated;
      return res.json({ message: 'Formation mise à jour avec succès.', formation: updated });
    }

    const Formation = require('../models/Formation');
    const f = await Formation.findByIdAndUpdate(req.params.id, { ...req.body, slug: title ? slugify(title) : undefined }, { new: true, runValidators: true });
    return f ? res.json({ message: 'Formation mise à jour avec succès.', formation: f }) : res.status(404).json({ message: 'Formation non trouvée' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
});

router.delete('/formations/:id', async (req, res) => {
  try {
    if (req.useMemory) {
      const idx = store.formations.findIndex(f => f._id === req.params.id);
      if (idx === -1) return res.status(404).json({ message: 'Formation non trouvée' });
      store.formations.splice(idx, 1);
      return res.json({ message: 'Formation supprimée avec succès.' });
    }
    const Formation = require('../models/Formation');
    const f = await Formation.findByIdAndDelete(req.params.id);
    return f ? res.json({ message: 'Formation supprimée avec succès.' }) : res.status(404).json({ message: 'Formation non trouvée' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
});

// =============================================
// GESTION DES DEMANDES (CONTACTS)
// =============================================
router.get('/demandes', async (req, res) => {
  try {
    const { statut } = req.query;
    if (req.useMemory) {
      let contacts = [...store.contacts];
      if (statut) contacts = contacts.filter(c => c.status === statut);
      contacts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      return res.json(contacts);
    }
    const Contact = require('../models/Contact');
    let filter = {};
    if (statut) filter.status = statut;
    res.json(await Contact.find(filter).populate('formation', 'title slug').sort({ createdAt: -1 }));
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
});

router.get('/demandes/:id', async (req, res) => {
  try {
    if (req.useMemory) {
      const c = store.contacts.find(c => c._id === req.params.id);
      if (!c) return res.status(404).json({ message: 'Demande non trouvée' });
      if (c.status === 'nouveau') c.status = 'lu';
      return res.json(c);
    }
    const Contact = require('../models/Contact');
    const c = await Contact.findById(req.params.id).populate('formation', 'title slug');
    if (!c) return res.status(404).json({ message: 'Demande non trouvée' });
    if (c.status === 'nouveau') {
      c.status = 'lu';
      await c.save();
    }
    return res.json(c);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
});

router.patch('/demandes/:id/statut', async (req, res) => {
  try {
    const { statut } = req.body;
    if (!statut || !['nouveau', 'lu', 'traité'].includes(statut)) {
      return res.status(400).json({ message: 'Statut invalide.' });
    }
    if (req.useMemory) {
      const c = store.contacts.find(c => c._id === req.params.id);
      if (!c) return res.status(404).json({ message: 'Demande non trouvée' });
      c.status = statut;
      return res.json({ message: 'Statut mis à jour avec succès.', contact: c });
    }
    const Contact = require('../models/Contact');
    const c = await Contact.findByIdAndUpdate(req.params.id, { status: statut }, { new: true });
    return c ? res.json({ message: 'Statut mis à jour avec succès.', contact: c }) : res.status(404).json({ message: 'Demande non trouvée' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
});

router.post('/demandes/:id/reply', async (req, res) => {
  try {
    const { replyMessage } = req.body;
    if (!replyMessage || !replyMessage.trim()) {
      return res.status(400).json({ message: 'Le message de réponse est requis.' });
    }

    let contact;
    if (req.useMemory) {
      contact = store.contacts.find(c => c._id === req.params.id);
      if (!contact) return res.status(404).json({ message: 'Demande non trouvée' });
      contact.status = 'traité';
      contact.reply = replyMessage.trim();
      contact.repliedAt = new Date().toISOString();
    } else {
      const Contact = require('../models/Contact');
      contact = await Contact.findById(req.params.id);
      if (!contact) return res.status(404).json({ message: 'Demande non trouvée' });
      contact.status = 'traité';
      contact.reply = replyMessage.trim();
      contact.repliedAt = new Date();
      await contact.save();
    }

    const emailResult = await sendReplyEmail({
      to: contact.email,
      contactName: `${contact.firstName} ${contact.lastName}`,
      originalSubject: contact.subject || 'Votre demande',
      replyMessage: replyMessage.trim(),
    });

    res.json({
      message: emailResult.simulated
        ? 'Réponse enregistrée. Email simulé (SMTP non configuré).'
        : 'Réponse envoyée par email avec succès.',
      contact,
      emailSimulated: emailResult.simulated,
    });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de l\'envoi de la réponse', error: error.message });
  }
});

router.delete('/demandes/:id', async (req, res) => {
  try {
    if (req.useMemory) {
      const idx = store.contacts.findIndex(c => c._id === req.params.id);
      if (idx === -1) return res.status(404).json({ message: 'Demande non trouvée' });
      store.contacts.splice(idx, 1);
      return res.json({ message: 'Demande supprimée avec succès.' });
    }
    const Contact = require('../models/Contact');
    const c = await Contact.findByIdAndDelete(req.params.id);
    return c ? res.json({ message: 'Demande supprimée avec succès.' }) : res.status(404).json({ message: 'Demande non trouvée' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
});

// =============================================
// GESTION DES INSCRIPTIONS
// =============================================
router.get('/inscriptions', async (req, res) => {
  try {
    const { statut } = req.query;

    if (req.useMemory) {
      let inscriptions = [...store.inscriptions];
      if (statut) inscriptions = inscriptions.filter(i => i.status === statut);
      inscriptions.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      inscriptions = inscriptions.map(i => {
        const formation = store.formations.find(f => f._id === i.formationId);
        return { ...i, formationTitle: formation?.title || 'Formation supprimée' };
      });
      return res.json(inscriptions);
    }

    const Inscription = require('../models/Inscription');
    let filter = {};
    if (statut) filter.status = statut;
    const inscriptions = await Inscription.find(filter)
      .populate('formationId', 'title slug')
      .sort({ createdAt: -1 });

    const result = inscriptions.map(i => {
      const obj = i.toObject();
      obj.formationTitle = obj.formationId?.title || obj.formationTitle || 'Formation supprimée';
      return obj;
    });

    res.json(result);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
});

router.patch('/inscriptions/:id/statut', async (req, res) => {
  try {
    const { statut } = req.body;
    if (!statut || !['nouveau', 'confirmé', 'refusé'].includes(statut)) {
      return res.status(400).json({ message: 'Statut invalide.' });
    }

    if (req.useMemory) {
      const insc = store.inscriptions.find(i => i._id === req.params.id);
      if (!insc) return res.status(404).json({ message: 'Inscription non trouvée' });
      insc.status = statut;
      return res.json({ message: 'Statut mis à jour.', inscription: insc });
    }

    const Inscription = require('../models/Inscription');
    const insc = await Inscription.findByIdAndUpdate(req.params.id, { status: statut }, { new: true });
    return insc
      ? res.json({ message: 'Statut mis à jour.', inscription: insc })
      : res.status(404).json({ message: 'Inscription non trouvée' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
});

router.delete('/inscriptions/:id', async (req, res) => {
  try {
    if (req.useMemory) {
      const idx = store.inscriptions.findIndex(i => i._id === req.params.id);
      if (idx === -1) return res.status(404).json({ message: 'Inscription non trouvée' });
      store.inscriptions.splice(idx, 1);
      return res.json({ message: 'Inscription supprimée avec succès.' });
    }

    const Inscription = require('../models/Inscription');
    const insc = await Inscription.findByIdAndDelete(req.params.id);
    return insc
      ? res.json({ message: 'Inscription supprimée avec succès.' })
      : res.status(404).json({ message: 'Inscription non trouvée' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
});

module.exports = router;
