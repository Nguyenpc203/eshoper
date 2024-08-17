// src/middleware/customerMiddleware.js
const UserModel = require('../models/user.model');

async function customerMiddleware(req, res, next) {
    if (req.session && req.session.userId) {
        try {
            const user = await UserModel.findById(req.session.userId);
            if (user) {
                req.user = user; // Gắn thông tin user vào req
                res.locals.user = user; // Gắn thông tin user vào res.locals để sử dụng trong views
            }
        } catch (error) {
            return res.status(500).send('Internal Server Error');
        }
    }
    next();
}

module.exports = customerMiddleware;
