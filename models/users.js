const User = require('../schemas/users');

const getAllUsers = (cb) => User.findAllUsers(cb);
const getUserById = (id, cb) => User.findUserById(id, cb);
const getUserByApiKey = (apiKey, cb) => User.findUserByApiKey(apiKey, cb);
const getUserByEmail = (email, cb) => User.findUserByEmail(email, cb);
const saveUser = (user, cb) => User.saveUser(user, cb);

module.exports = { getAllUsers, getUserById, getUserByApiKey, getUserByEmail, saveUser };
