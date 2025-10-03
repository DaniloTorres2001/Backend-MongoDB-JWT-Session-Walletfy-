let counter = 0;

module.exports = (req, res, next) => {
    /** APM: Application Performance Monitoring */
    console.log(`${req.method} ${req.url}`);

    if (req.body && Object.keys(req.body).length > 0) {
        console.log('Body:', JSON.stringify(req.body, null, 2));
    }

    console.log('--------------------------------');
    console.log('Request IP:', req.ip);
    console.log('Request Time:', new Date().toISOString());

    /** Contador de requests */
    counter++;
    req.counter = counter;

    console.log('Headers:', req.headers);

    next();
};
