const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

// Créer un utilisateur (uniquement admin)
const addUser = async (req, res) => {
    const { username, password, role } = req.body;

    // Vérifier si l'utilisateur qui effectue la requête est admin
    if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Accès refusé, seuls les administrateurs peuvent ajouter des utilisateurs.' });
    }

    try {
        // Vérifier si l'utilisateur existe déjà
        const userExist = await User.findOne({ username });
        if (userExist) {
            return res.status(400).json({ message: 'Cet utilisateur existe déjà.' });
        }

        // Hasher le mot de passe
        const hashedPassword = await bcrypt.hash(password, 10);

        // Créer un nouvel utilisateur
        const newUser = new User({
            username,
            password: hashedPassword,
            role
        });

        await newUser.save();

        res.status(201).json({ message: 'Utilisateur créé avec succès' });
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la création de l’utilisateur', error });
    }
};

// Supprimer un utilisateur (uniquement admin)
const deleteUser = async (req, res) => {
    const { userId } = req.params;

    // Vérifier si l'utilisateur est admin
    if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Accès refusé, seuls les administrateurs peuvent supprimer des utilisateurs.' });
    }

    try {
        // Vérifier si l'utilisateur existe
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'Utilisateur non trouvé.' });
        }

        await User.findByIdAndDelete(userId);

        res.status(200).json({ message: 'Utilisateur supprimé avec succès.' });
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la suppression de l’utilisateur', error });
    }
};

module.exports = {
    addUser,
    deleteUser
};
