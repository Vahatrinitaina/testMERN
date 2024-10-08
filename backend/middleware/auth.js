// middleware/auth.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Middleware pour authentifier les utilisateurs
const authenticate = async (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', ''); // Utilisation de l'opérateur de chaînage optionnel

  if (!token) {
    return res.status(401).json({ message: 'Accès non autorisé, token manquant' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Assurez-vous que JWT_SECRET est défini dans votre fichier .env
    req.userId = decoded.id; // Récupère l'ID de l'utilisateur décodé

    // Optionnel : récupérer l'utilisateur pour éventuellement l'utiliser dans les routes
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }

    req.user = user; // Stocke l'utilisateur dans la requête pour un accès ultérieur
    next(); // Passe au middleware suivant ou à la route
  } catch (error) {
    console.error(error); // Affiche l'erreur pour le débogage
    res.status(401).json({ message: 'Accès non autorisé, token invalide' });
  }
};

module.exports = authenticate;
