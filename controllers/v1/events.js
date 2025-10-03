const router = require('express').Router();
const { query, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');

/* Models */
const Events = require('../../models/events');

/** Middlewares */
const apiKeyMiddleware = require('../../middlewares/apiKey');
const basicAuthMiddleware = require('../../middlewares/basicAuth');
const jwtAuthMiddleware = require('../../middlewares/jwtAuth');

const jwtSecret = 'thisismysecret';

// =============================================
// 🔑 Emitir token usando BasicAuth
// =============================================
router.get('/token', basicAuthMiddleware, (req, res)=> {
    jwt.sign({ user: req.user }, jwtSecret, { expiresIn: '1h' }, (err, token) => {
        if(err){
            return res.status(500).json({ code: 'ER', message: 'Error generating token!'});
        }
        res.json({ code: 'OK', message: 'Token generated successfully!', data: { token }});
    });
});

// =============================================
// 🔒 Proteger el resto de endpoints con JWT
// =============================================
router.use(jwtAuthMiddleware);

// =============================================
// CRUD de Events (lo que ya tenías en Tarea 2)
// =============================================


// Entity: events

// GET /api/v1/events/all -> todos los eventos (sin filtros, sin paginación)
router.get('/all', (req, res) => {
    return Events.getAllEvents({}, {}, (err, events) => {
        if (err) {
            return res.status(500).json({ code: 'ER', message: 'Error getting events!' });
        }
        res.json({ code: 'OK', message: 'Events are available!', data: { events, total: events.length } });
    });
});

// GET /api/v1/events -> con filtros y paginación
router.get('/',
    [
        query('tipo').optional().isIn(['ingreso', 'egreso']),
        query('mes').optional().matches(/^\d{4}-\d{2}$/),
        query('page').optional().isInt({ min: 1 }).toInt(),
        query('limit').optional().isInt({ min: 1, max: 100 }).toInt()
    ],
    (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.json({ code: 'PF', message: 'Invalid query params!' });
        }

        const { tipo, mes, page = 1, limit = 10 } = req.query;
        const filter = {};

        if (tipo) filter.tipo = tipo;
        if (mes) {
            const start = new Date(`${mes}-01`);
            const end = new Date(start);
            end.setMonth(end.getMonth() + 1);
            filter.fecha = { $gte: start, $lt: end };
        }

        return Events.getAllEvents(filter, { page, limit }, (err, events) => {
            if (err) {
                return res.status(500).json({ code: 'ER', message: 'Error getting events!' });
            }
            res.json({
                code: 'OK',
                message: 'Events retrieved!',
                data: { events, page, limit, total: events.length }
            });
        });
    }
);

// GET /api/v1/events/query?id=...
router.get('/query', query('id').notEmpty(), (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.json({ code: 'PF', message: 'Event ID is required!' });
    }

    const id = req.query.id;

    return Events.getEventById(id, (err, event) => {
        if (err) {
            return res.status(500).json({ code: 'ER', message: 'Error getting event!' });
        }
        if (!event) {
            return res.status(404).json({ code: 'NF', message: 'Event not found!' });
        }
        res.json({ code: 'OK', message: 'Event is available!', data: { event } });
    });
});

// POST /api/v1/events
router.post('/', (req, res) => {
    console.log('POST /events:', req.body);
    const { nombre, descripcion, cantidad, fecha, tipo, adjunto } = req.body;

    const newEvent = {
        id: new Date().getTime(),
        nombre,
        descripcion,
        cantidad,
        fecha,
        tipo,
        adjunto
    };

    return Events.saveEvent(newEvent, (err, event) => {
        if (err) {
            return res.status(500).json({ code: 'ER', message: 'Error creating event!' });
        }
        res.json({ code: 'OK', message: 'Event created successfully!', data: { event } });
    });
});

// PUT /api/v1/events/:id
router.put('/:id', (req, res) => {
    const id = req.params.id;
    const updated = req.body;

    return Events.updateEvent(id, updated, (err, event) => {
        if (err) {
            return res.status(500).json({ code: 'ER', message: 'Error updating event!' });
        }
        if (!event) {
            return res.status(404).json({ code: 'NF', message: 'Event not found!' });
        }
        res.json({ code: 'OK', message: 'Event updated successfully!', data: { event } });
    });
});

// DELETE /api/v1/events/:id
router.delete('/:id', (req, res) => {
    const id = req.params.id;
    console.log('DELETE /events/:id:', id);

    return Events.deleteEvent(id, (err, event) => {
        if (err) {
            return res.status(500).json({ code: 'ER', message: 'Error deleting event!' });
        }
        if (!event) {
            return res.status(404).json({ code: 'PF', message: 'Event not found!' });
        }
        res.json({ code: 'OK', message: 'Event deleted!', data: { event } });
    });
});

module.exports = router;
