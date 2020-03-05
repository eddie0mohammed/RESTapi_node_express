
const express = require('express');
const mongoose = require('mongoose');

const checkAuth = require('../middleware/check-auth');
const orderController = require('../controllers/orders');

// const Order = require('../models/orders');
// const Product = require('../models/product');

const router = express.Router();


router.get('/', checkAuth, orderController.getAllOrders);

router.post('/', checkAuth, orderController.postOrder);
    

router.get('/:orderId', checkAuth, orderController.getSpecificOrder);

router.delete('/:orderId', checkAuth, orderController.deleteOrder);


module.exports = router;