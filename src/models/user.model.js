const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        unique: false
    },
    googleId: {
        type: String,
        unique: true,
        sparse: true
    },
    password: {
        type: String,
        required: function() {
            return !this.googleId; // Yêu cầu mật khẩu nếu không có googleId
        }
    },
    role: {
        type: String,
        required: true,
        enum: ['admin', 'user'], // Chỉ chấp nhận các giá trị 'admin' và 'user'
        default: 'user'
    },
    status: {
        type: String,
        enum: ['Work','Lock'],
        default: 'Work'
    },
    created_at: {
        type: Date,
        default: Date.now
    },
    updated_at: {
        type: Date,
        default: Date.now
    }
});

const User = mongoose.model('User', userSchema);

module.exports = User;

