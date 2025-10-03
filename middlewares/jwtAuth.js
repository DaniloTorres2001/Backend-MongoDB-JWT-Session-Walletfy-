const jwt = require('jsonwebtoken');

const jwtSecret = 'thisismysecret';

module.exports = (req, res, next) => {
    const authorization = req.headers.authorization;

    if (!authorization) {
        return res.status(401).json({ code: 'UA', message: 'Authorization header is required!' });
    }

    const [type, token] = authorization.split(' ');

    if (type !== 'Bearer') {
        return res.status(401).json({ code: 'UA', message: 'Authorization type is not supported!' });
    }

    try {
        const { user } = jwt.verify(token, jwtSecret);
        req.user = user;
        console.log('User decoded from token:', user);
        next();
    } catch (err) {
        return res.status(401).json({ code: 'UA', message: 'Invalid or expired token!' });
    }
};
