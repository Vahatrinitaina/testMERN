// server.js ou app.js
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const authRoutes = require('./routes/auth'); 
const authMiddleware = require('./middleware/authMiddleware');
const connectDB = require('./config/db');

const app = express();

connectDB();

// Middleware pour parser les requêtes JSON
app.use(express.json());

// Routes d'authentification
app.use('/api/auth', authRoutes); 

// Exemple de route protégée
app.get('/api/protected', authMiddleware, (req, res) => {
    res.json({ message: 'Vous êtes connecté', user: req.user });
});

// Démarrer le serveur
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Serveur en cours d'exécution sur le port ${PORT}`);
});
