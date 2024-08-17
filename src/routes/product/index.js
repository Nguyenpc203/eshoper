const express = require('express');
const router = express.Router();
const ProductController = require('../../controllers/product.controller');

router.get('/', (req, res) => {
    res.send('Product route');
});

router.get('/list-product', ProductController.getListProduct);

router.get('/get-product/:_id', ProductController.getProduct);

router.post('/create-product', ProductController.createProduct);

router.post('/update-product/:_id', ProductController.updateProduct);

router.get('/delete-product/:_id', ProductController.deleteProduct);


module.exports = router;