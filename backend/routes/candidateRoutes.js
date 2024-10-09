// routes/candidat.js
const express = require('express');
const User = require('../models/User'); // Modèle d'utilisateur
const authMiddleware = require('../middleware/authMiddleware'); // Middleware d'authentification
const router = express.Router();

// Récupérer les informations d'un candidat par ID
router.get('/:id', authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'Candidat non trouvé' });
        }
        res.json(user);
    } catch (error) {
        console.error('Erreur lors de la récupération du candidat:', error);
        res.status(500).json({ message: 'Erreur lors de la récupération du candidat' });
    }
});

module.exports = router;
