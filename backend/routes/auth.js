// routes/auth.js
const express = require('express');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const router = express.Router(); // Crée une instance de Router

const JWT_SECRET = process.env.JWT_SECRET;

router.post('/register', async (req, res) => {
    console.log('Données reçues:', req.body); // Ajoute cette ligne pour voir les données reçues
    try {
        const { username, password, role } = req.body;
        if (!username || !password) {
            return res.status(400).json({ message: 'Username et mot de passe sont requis' });
        }
        const newUser = new User({ username, password, role });
        await newUser.save();
        res.status(201).json({ message: 'Utilisateur créé avec succès' });
    } catch (error) {
        console.error('Erreur:', error); // Affiche l'erreur dans la console
        res.status(400).json({ message: 'Erreur lors de la création de l’utilisateur', error });
    }
});

router.post('/login', async (req, res) => {
    console.log('Données de connexion reçues:', req.body); // Affiche les données de la requête
    console.log('Clé JWT utilisée:', JWT_SECRET); 

    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({ message: 'Username et mot de passe sont requis' });
    }

    try {
        const user = await User.findOne({ username });
        if (!user) return res.status(400).json({ message: 'Utilisateur non trouvé' });

        const isMatch = await user.comparePassword(password);
        if (!isMatch) return res.status(400).json({ message: 'Mot de passe incorrect' });

        const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: '1h' });
        res.json({ token, user: { id: user._id, username: user.username, role: user.role } });
    } catch (error) {
        console.error('Erreur lors de la connexion:', error); // Log de l'erreur
        res.status(400).json({ message: 'Erreur lors de la connexion', error });
    }
});


module.exports = router;