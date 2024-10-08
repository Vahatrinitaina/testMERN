// app.js
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const userRoutes = require('./routes/userRoutes'); 
const auth = require('./middleware/auth'); // Si vous avez un middleware d'authentification
require('dotenv').config();


const app = express();

// Middleware
app.use(bodyParser.json()); // Pour parser le JSON dans le corps des requêtes

// Connexion à MongoDB
mongoose.connect('mongodb://localhost:27017/mern_api', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Connecté à MongoDB !'))
.catch(err => console.error('Erreur de connexion à MongoDB:', err));

// Routes
app.use('/api/users', userRoutes); // Utilisation de tes routes utilisateurs

// Écoute du serveur
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Le serveur fonctionne sur le port ${PORT}`);
});
