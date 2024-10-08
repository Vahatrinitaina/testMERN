// routes/userRoutes.js
const express = require('express');
const bcrypt = require('bcrypt');
const User = require('../models/User');

const router = express.Router();

// Inscription d'un nouvel employé (accessible uniquement aux admins)
router.post('/register', async (req, res) => {
  const { username, password } = req.body;
  
  try {
    // Vérifier que l'utilisateur est un admin
    const admin = await User.findById(req.userId); 
    if (!admin || admin.role !== 'admin') {
      return res.status(403).json({ message: 'Accès refusé' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, password: hashedPassword, role: 'employee' });
    await newUser.save();
    res.status(201).json({ message: 'Employé ajouté avec succès' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de l\'ajout de l\'employé', error });
  }
});

// Connexion
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Mot de passe incorrect' });
    }

    // Ici tu pourrais générer un token JWT pour l'authentification
    res.status(200).json({ message: 'Connexion réussie', user });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la connexion', error });
  }
});

module.exports = router;
