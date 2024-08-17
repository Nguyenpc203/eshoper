//src/app.js
const express = require('express');
const session = require('express-session');
const passport = require('passport');
const bodyParser = require('body-parser');
const app = express();
const path = require('path');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./swagger');

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));
app.use(express.static('./public'));
app.use(bodyParser.json());
// Middleware cho session
app.use(session({
    secret: 'your_secret_key', // Thay thế bằng secret key của bạn
    resave: false,
    saveUninitialized: true
}));
app.use(bodyParser.urlencoded({ extended: false }));



// Khởi tạo Passport.js
app.use(passport.initialize());
app.use(passport.session());

require('./dbs/mongodb');
require('./dbs/redis');

app.use('/', require('./routes'));

// app.use('/add',require('./routes'))

module.exports = app;



