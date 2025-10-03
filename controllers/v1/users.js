const router = require('express').Router();
const { query, validationResult } = require('express-validator');
const Users = require('../../models/users');
const jwt = require('jsonwebtoken');

const jwtSecret = 'thisismysecret';

// Generar token con BasicAuth
router.get('/token', (req, res) => {
    // Si usas basicAuth como middleware:
    // req.user viene del basicAuth
    jwt.sign({ user: req.user }, jwtSecret, { expiresIn: '1h' }, (err, token) => {
        if (err) {
            return res.status(500).json({ code: 'ER', message: 'Error generating token!' });
        }
        res.json({ code: 'OK', message: 'Token generated!', data: { token } });
    });
});

// Crear usuario
router.post('/', (req, res) => {
    const { name, email, age, password, apiKey } = req.body;
    if (!name || !email || !age || !password) {
        return res.status(400).json({ code: 'BR', message: 'Missing required fields!' });
    }

    const newUser = {
        id: Date.now(),
        name,
        email,
        age,
        password,
        apiKey
    };

    return Users.saveUser(newUser, (err, user) => {
        if (err) return res.status(500).json({ code: 'ER', message: 'Error creating user!' });
        res.json({ code: 'OK', message: 'User created successfully!', data: { user } });
    });
});

module.exports = router;
