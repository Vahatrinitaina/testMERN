// server.js ou app.js
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors'); 
const authRoutes = require('./routes/auth'); 
const connectDB = require('./config/db');
const candidateRoutes = require('./routes/candidateRoutes')

const app = express();

connectDB();

// Middleware pour parser les requêtes JSON
app.use(express.json());

// Middleware CORS
app.use(cors({
    origin: 'http://localhost:3000', // Autoriser pour le front d'acceder a l'API
}));

// Routes d'authentification
app.use('/api/auth', authRoutes); 

// Routes pour les candidats
app.use('/api/candidate', candidateRoutes); 
console.log("Routes candidates chargées");


// Démarrer le serveur,
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Serveur en cours d'exécution sur le port ${PORT}`);
});
