// Moderators Controls
// ------------------------- IMPORTS -------------------------

// ---- import Models
const User = require('../models/User');
const Post = require('../models/Post');
const Comment = require('../models/Comment');


// ============================================================
// -------------------------- CONTROLS ------------------------



exports.getAllUsers = (req, res, next) => {
    User.findAll()
        .then(users => res.status(201).json(users))
        .catch(error => res.status(500).json({ error }));
};


exports.deleteUser = (req, res, next) => {

};
