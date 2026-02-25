const formationsData = require('./formations');

// Store centralisé partagé entre toutes les routes
const store = {
  formations: [...formationsData],
  contacts: [],
  inscriptions: [],
  nextFormationId: 100,
  nextContactId: 0,
  nextInscriptionId: 0,
};

module.exports = store;
