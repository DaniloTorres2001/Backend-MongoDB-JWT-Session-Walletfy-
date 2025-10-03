const Users = require('../models/users');

module.exports = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({ code: 'UA', message: 'Authorization header is required!' });
    }

    const [type, credentials] = authHeader.split(' ');

    if (type !== 'Basic') {
        return res.status(401).json({ code: 'UA', message: 'Authorization type is not supported!' });
    }

    if (!credentials) {
        return res.status(401).json({ code: 'UA', message: 'Credentials are required!' });
    }

    const rawCredentials = Buffer.from(credentials, 'base64').toString('utf-8');
    const [email, password] = rawCredentials.split(':');

    if (!email || !password) {
        return res.status(401).json({ code: 'UA', message: 'Email and password are required!' });
    }

    return Users.getUserByEmail(email, (err, user) => {
        if (err) {
            return res.status(500).json({ code: 'ER', message: 'Error getting user!' });
        }
        if (!user || user.password !== password) {
            return res.status(401).json({ code: 'UA', message: 'Invalid credentials!' });
        }

        req.user = user; // usuario autenticado
        next();
    });
};
