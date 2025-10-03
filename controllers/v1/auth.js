const router = require('express').Router();
const Users = require('../../models/users');

router.post('/login', (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ code: 'BR', message: 'Email and password required!' });
    }

    return Users.getUserByEmail(email, (err, user) => {
        if (err) {
            console.error('❌ Error en getUserByEmail:', err);   // 👈 imprime el error real
            return res.status(500).json({ code: 'ER', message: 'Error logging in!' });
        }

        if (!user) {
            return res.status(401).json({ code: 'UA', message: 'User not found!' });
        }

        if (user.password !== password) {
            return res.status(401).json({ code: 'UA', message: 'Invalid password!' });
        }

        // Guardar datos de sesión
        req.session.user = {
            id: user.id,
            email: user.email,
            role: user.role
        };

        res.json({ code: 'OK', message: 'Login successful!', data: { user: req.session.user } });
    });
});

router.post('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.status(500).json({ code: 'ER', message: 'Error logging out!' });
        }
        res.clearCookie('connect.sid');
        res.json({ code: 'OK', message: 'Logout successful!' });
    });
});

router.get('/session', (req, res) => {
    if (!req.session.user) {
        return res.status(401).json({ code: 'UA', message: 'No active session!' });
    }
    res.json({ code: 'OK', message: 'Active session!', data: { user: req.session.user } });
});

module.exports = router;
