// src/middleware/authMiddleware.js
const UserModel = require('../models/user.model');

async function ensureAuthenticated(req, res, next) {
    if (req.session && req.session.userId) {
        try {
            const user = await UserModel.findById(req.session.userId);
            if (!user) {
                return res.redirect('/admin/login');
            }
            if (user.role !== 'admin') {
                return res.status(403).send('Access denied');
            }
            req.user = user; // Gắn thông tin user vào req
            return next();
        } catch (error) {
            return res.status(500).send('Internal Server Error');
        }
    } else {
        res.redirect('/admin/login');
    }
}

module.exports = ensureAuthenticated;
