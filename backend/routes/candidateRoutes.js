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

// Lister tous les candidats
router.get('/', authMiddleware, async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (error) {
        console.error('Erreur lors de la récupération des candidats:', error);
        res.status(500).json({ message: 'Erreur lors de la récupération des candidats' });
    }
});

// Créer un nouveau candidat
router.post('/', authMiddleware, async (req, res) => {
    const { username, password, role } = req.body; // Assurez-vous que ces champs existent dans votre modèle

    try {
        const newUser = new User({ username, password, role });
        await newUser.save();
        res.status(201).json(newUser);
    } catch (error) {
        console.error('Erreur lors de la création du candidat:', error);
        res.status(500).json({ message: 'Erreur lors de la création du candidat' });
    }
});

// Mettre à jour un candidat par ID
router.put('/:id', authMiddleware, async (req, res) => {
    const { username, password, role } = req.body; // Champs à mettre à jour

    try {
        const user = await User.findByIdAndUpdate(req.params.id, { username, password, role }, { new: true });
        if (!user) {
            return res.status(404).json({ message: 'Candidat non trouvé' });
        }
        res.json(user);
    } catch (error) {
        console.error('Erreur lors de la mise à jour du candidat:', error);
        res.status(500).json({ message: 'Erreur lors de la mise à jour du candidat' });
    }
});

// Supprimer un candidat par ID
router.delete('/:id', authMiddleware, async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'Candidat non trouvé' });
        }
        res.json({ message: 'Candidat supprimé avec succès' });
    } catch (error) {
        console.error('Erreur lors de la suppression du candidat:', error);
        res.status(500).json({ message: 'Erreur lors de la suppression du candidat' });
    }
});

module.exports = router;