const MONGO_URI = process.env.MONGO_URI;
const mongoose = require('mongoose');

const connectDB = () => {
  mongoose.connect(MONGO_URI).then(() => {
    console.log('Connexion à MongoDB réussie');
  }).catch((error) => {
    console.error('Erreur de connexion à MongoDB:', error);
  });
};



module.exports = connectDB;
