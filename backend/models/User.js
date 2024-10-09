// models/User.js
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true // Cela nécessite que chaque nom d'utilisateur soit unique
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['technicien', 'salarié', 'admin'],
        default: 'salarié'
    }
});

// Méthode pour hasher le mot de passe avant de l'enregistrer
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

// Méthode pour comparer les mots de passe
userSchema.methods.comparePassword = function (password) {
    return bcrypt.compare(password, this.password);
};

const User = mongoose.model('User', userSchema);
module.exports = User;