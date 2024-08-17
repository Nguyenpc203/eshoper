const mongoose = require('mongoose');
require('dotenv').config(); // Load biến môi trường từ file .env

class Mongo {
    constructor() {
        this._connect();
    }

    _connect() {
        mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true, 
            useUnifiedTopology: true
        })
            .then(() => {
                console.log('Database connection successfully');
            })
            .catch(err => {
                console.error('Database connection error');
            })
    }
} 

module.exports = new Mongo();
