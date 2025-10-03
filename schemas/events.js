const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
    id: {
        type: Number,
        required: true,
        unique: true
    },
    nombre: {
        type: String,
        required: true,
        trim: true
    },
    descripcion: { type: String },
    cantidad: {
        type: Number,
        required: true,
        min: 0
    },
    fecha: {
        type: Date,
        required: true
    },
    tipo: {
        type: String,
        enum: ['ingreso', 'egreso'],
        required: true
    },
    adjunto: {
        type: String
    }
},{ versionKey: false });

const Event = mongoose.model('Event', eventSchema);

// Guardar
const saveEvent = (event, callback) => {
    const newEvent = new Event(event);
    newEvent.save()
        .then(() => {
            console.log('✅ Nuevo evento creado!');
            return callback(null, newEvent);
        })
        .catch(err => {
            console.error('❌ Error creando evento:', err);
            return callback(err);
        });
};

// Listar con filtros y paginación
const findAllEvents = (filter = {}, { page = 1, limit = 100 } = {}, callback) => {
    Event.find(filter)
        .skip((page - 1) * limit)
        .limit(limit)
        .then(results => {
            console.log('📋 Eventos encontrados con filtro:', filter, results);
            return callback(null, results);
        })
        .catch(err => {
            console.error('❌ Error buscando eventos:', err);
            return callback(err);
        });
};

// Buscar por id (campo id, no _id)
const findEventById = (id, callback) => {
    Event.findOne({ id })
        .then(result => {
            console.log('🔍 Encontrado:', result);
            return callback(null, result);
        })
        .catch(err => {
            console.error('❌ Error buscando evento:', err);
            return callback(err);
        });
};

// Actualizar
const updateEvent = (id, event, callback) => {
    Event.findOneAndUpdate({ id }, event, { new: true })
        .then(result => {
            console.log('🔄 Actualizado:', result);
            return callback(null, result);
        })
        .catch(err => {
            console.error('❌ Error actualizando evento:', err);
            return callback(err);
        });
};

// Eliminar
const deleteEvent = (id, callback) => {
    Event.findOneAndDelete({ id })
        .then(result => {
            console.log('🗑 Eliminado:', result);
            return callback(null, result);
        })
        .catch(err => {
            console.error('❌ Error eliminando evento:', err);
            return callback(err);
        });
};

module.exports = {
    Event,
    saveEvent,
    findAllEvents,
    findEventById,
    updateEvent,
    deleteEvent
};