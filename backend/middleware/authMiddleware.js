const JWT_SECRET = process.env.JWT_SECRET;
const authMiddleware = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) {
        console.log("Pas de token fourni");
        return res.status(401).json({ message: 'Accès refusé' });
    }

    try {
        const verified = jwt.verify(token, JWT_SECRET);
        req.user = verified;
        console.log("Token vérifié avec succès :", verified);
        next();
    } catch (error) {
        console.error("Erreur de vérification du token :", error);
        res.status(400).json({ message: 'Token invalide' });
    }
};

module.exports = authMiddleware;
