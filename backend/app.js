// server.js ou app.js
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const authRoutes = require('./routes/auth'); // Assure-toi que le chemin est correct
const authMiddleware = require('./middleware/authMiddleware');
const MONGO_URI = process.env.MONGO_URI;


const app = express();

mongoose.connect('mongodb://localhost:27017/test-mern-api', { 
  useNewUrlParser: true, 
  useUnifiedTopology: true 
}).then(() => {
  console.log('Connexion à MongoDB réussie');
}).catch((error) => {
  console.error('Erreur de connexion à MongoDB:', error);
});


// Middleware pour parser les requêtes JSON
app.use(express.json());

// Routes d'authentification
app.use('/api/auth', authRoutes); // Assure-toi que ça pointe vers le bon fichier

// Exemple de route protégée
app.get('/api/protected', authMiddleware, (req, res) => {
    res.json({ message: 'Vous êtes connecté', user: req.user });
});

// Démarrer le serveur
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Serveur en cours d'exécution sur le port ${PORT}`);
});
