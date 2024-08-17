// src/swagger.js
const swaggerJSDoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API Documentation',
      version: '1.0.0',
      description: 'This is the API documentation for your application',
    },
    servers: [
      {
        url: 'http://localhost:3000', // URL của server
      },
    ],
  },
  apis: ['./src/routes/*.js'], // Đường dẫn đến file định nghĩa API
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec;
