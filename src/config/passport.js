const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const UserModel = require('../models/user.model');

// Sử dụng dotenv để tải các biến môi trường từ tệp .env
require('dotenv').config();

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID, // Sử dụng biến môi trường
    clientSecret: process.env.GOOGLE_CLIENT_SECRET, // Sử dụng biến môi trường
    callbackURL: '/auth/google/callback'
}, async (accessToken, refreshToken, profile, done) => {
    try {
        // Tìm hoặc tạo người dùng mới dựa trên Google profile
        let user = await UserModel.findOne({ googleId: profile.id });
        if (!user) {
            user = new UserModel({
                googleId: profile.id,
                username: profile.displayName,
                email: profile.emails[0].value,
                role: 'user'
            });
            await user.save();
        }
        done(null, user);
    } catch (error) {
        done(error, null);
    }
}));

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await UserModel.findById(id);
        done(null, user);
    } catch (error) {
        done(error, null);
    }
});

module.exports = passport;
