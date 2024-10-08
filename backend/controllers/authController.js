const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { validationResult } = require('express-validator');

// Inscription d'un nouvel utilisateur
exports.register = async (req, res) => {
  console.log('Requête d\'inscription reçue:', req.body); // Ajout pour déboguer

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { name, email, password, role } = req.body;

  try {
    let user = await User.findOne({ email });

    // Vérifie si l'utilisateur existe déjà
    if (user) {
      return res.status(400).json({ msg: 'L’utilisateur existe déjà' });
    }

    // Crée un nouvel utilisateur
    user = new User({
      name,
      email,
      password,
      role: role || 'employee'
    });

    // Hash le mot de passe
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    // Enregistre l'utilisateur dans la base de données
    await user.save();

    // Crée le payload pour le JWT
    const payload = {
      user: {
        id: user.id,
        role: user.role
      }
    };

    // Signe le JWT
    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '5h' },
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      }
    );
  } catch (err) {
    console.error('Erreur lors de l\'inscription:', err.message);
    res.status(500).send('Erreur serveur');
  }
};

// Connexion d'un utilisateur
exports.login = async (req, res) => {
  console.log('Requête de connexion reçue:', req.body); // Ajout pour déboguer

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;

  try {
    let user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ msg: 'Identifiants invalides' });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ msg: 'Identifiants invalides' });
    }

    const payload = {
      user: {
        id: user.id,
        role: user.role
      }
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '5h' },
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      }
    );
  } catch (err) {
    console.error('Erreur lors de la connexion:', err.message);
    res.status(500).send('Erreur serveur');
  }
};
