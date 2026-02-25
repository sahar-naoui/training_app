const express = require('express');
const router = express.Router();
const store = require('../data/store');

// GET /api/formations
router.get('/', async (req, res) => {
  try {
    const { level, search } = req.query;

    if (req.useMemory) {
      let results = [...store.formations];
      if (level) results = results.filter(f => f.level.number === parseInt(level));
      if (search) {
        const regex = new RegExp(search, 'i');
        results = results.filter(f => regex.test(f.title) || regex.test(f.subtitle));
      }
      results.sort((a, b) => a.level.number - b.level.number || a.order - b.order);
      return res.json(results);
    }

    const Formation = require('../models/Formation');
    let filter = {};
    if (level) filter['level.number'] = parseInt(level);
    if (search) {
      const regex = new RegExp(search, 'i');
      filter.$or = [{ title: { $regex: regex } }, { subtitle: { $regex: regex } }];
    }
    const formations = await Formation.find(filter).sort({ 'level.number': 1, order: 1 });
    res.json(formations);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
});

// GET /api/formations/featured
router.get('/featured', async (req, res) => {
  try {
    if (req.useMemory) {
      const results = store.formations.filter(f => f.featured).sort((a, b) => a.order - b.order);
      return res.json(results);
    }
    const Formation = require('../models/Formation');
    const formations = await Formation.find({ featured: true }).sort({ order: 1 });
    res.json(formations);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
});

// GET /api/formations/levels
router.get('/levels', async (req, res) => {
  try {
    const source = req.useMemory
      ? [...store.formations].sort((a, b) => a.level.number - b.level.number)
      : await require('../models/Formation').find().select('level').sort({ 'level.number': 1 });

    const levels = [];
    const seen = new Set();
    source.forEach(f => {
      if (!seen.has(f.level.number)) {
        seen.add(f.level.number);
        levels.push(f.level);
      }
    });
    res.json(levels);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
});

// GET /api/formations/:slug
router.get('/:slug', async (req, res) => {
  try {
    if (req.useMemory) {
      const formation = store.formations.find(f => f.slug === req.params.slug);
      if (!formation) return res.status(404).json({ message: 'Formation non trouvée' });
      return res.json(formation);
    }
    const Formation = require('../models/Formation');
    const formation = await Formation.findOne({ slug: req.params.slug });
    if (!formation) return res.status(404).json({ message: 'Formation non trouvée' });
    res.json(formation);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
});

module.exports = router;
