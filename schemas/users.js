const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    id: { type: Number, required: true, unique: true },
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    age: { type: Number, required: true, min: 0 },
    password: { type: String, required: true },
    apiKey: { type: String },
    role: { type: String, enum:['admin','user'], default:'user' }
});

const User = mongoose.model('User', userSchema);

const saveUser = (user, callback) => {
    const newUser = new User(user);
    newUser.save().then(() => callback(null, newUser)).catch(err => callback(err));
};

const findAllUsers = (callback) => User.find().then(r => callback(null, r)).catch(err => callback(err));
const findUserById = (id, cb) => User.findOne({ id }).then(r => cb(null, r)).catch(err => cb(err));
const findUserByApiKey = (apiKey, cb) => User.findOne({ apiKey }).then(r => cb(null, r)).catch(err => cb(err));
const findUserByEmail = (email, callback) => { 
    User.findOne({ email })
        .then(result => {
            console.log('🔍 Usuario encontrado:', result);
            return callback(null, result);
        })
        .catch(err => {
            console.error('❌ Error en findUserByEmail:', err);
            return callback(err);
        });
};


module.exports = { User, saveUser, findAllUsers, findUserById, findUserByApiKey, findUserByEmail };
