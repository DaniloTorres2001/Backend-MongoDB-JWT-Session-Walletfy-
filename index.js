const express = require('express');
const session = require('express-session')

/** Db */
const mongoose = require('./db');

/** Middlewares */
const performance = require('./middlewares/performance');

/** Controllers */
const eventsV1 = require('./controllers/v1/events');
const usersV1 = require('./controllers/v1/users');
const authV1 = require('./controllers/v1/auth');

//+++++++++++++++++++++++++++++++++++++++++++++//
const app = express();


app.use(express.json());

app.use(performance);

app.use(session({
    secret: 'esteesmyclavesecreta',
    resave: false,
    saveUninitialized: false,   
    cookie: {
        name: 'sess:id',
        maxAge: 8 * 60 * 60 * 1000, // 8h
        secure: false
    }
}));

const PORT = process.env.PORT || 3030;

/** Controllers */
app.use('/api/v1/events', eventsV1);
app.use('/api/v1/users', usersV1);
app.use('/api/v1/auth', authV1);

/** Health check */
app.get('/health', (req, res) => {
    res.json({
        status: 'ok',
        uptime: process.uptime(),
        db: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
    });
});

app.get('/', (req, res) => {
    res.send('Hello World');
});

app.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
});
