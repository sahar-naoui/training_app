const mongoose = require('mongoose');

const connectDB = async () => {
  const maxRetries = 5;
  let retries = 0;

  while (retries < maxRetries) {
    try {
      const conn = await mongoose.connect(process.env.MONGODB_URI, {
        serverSelectionTimeoutMS: 10000,
      });
      console.log(`MongoDB connecté: ${conn.connection.host}`);
      return;
    } catch (error) {
      retries++;
      console.error(`Tentative ${retries}/${maxRetries} - Erreur MongoDB: ${error.message}`);
      if (retries < maxRetries) {
        console.log(`Nouvelle tentative dans 5 secondes...`);
        await new Promise(resolve => setTimeout(resolve, 5000));
      }
    }
  }

  console.error('Impossible de se connecter à MongoDB après plusieurs tentatives.');
  console.error('Vérifiez que votre IP est autorisée sur MongoDB Atlas (Network Access → Add IP → Allow Access from Anywhere).');
  process.exit(1);
};

module.exports = connectDB;
