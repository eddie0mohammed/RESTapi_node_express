
const express = require('express');
const mongoose = require('mongoose');


const Order = require('../models/orders');
const Product = require('../models/product');

const router = express.Router();


router.get('/', (req, res) => {

    Order.find()
    .select('_id product quantity')
    .populate('product')
    .exec()
    .then(docs => {
        // console.log(docs);
        res.status(200).json({
            count: docs.length,
            orders: docs.map(doc => {
                return {
                    _id: doc._id,
                    product: doc.product,
                    quantity: doc.quantity,
                    request: {
                        type: 'GET',
                        url: `http://localhost:5000/orders/${doc._id}`
                    }
                }
            })
        });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({error: err});
    })
})

router.post('/', (req, res) => {

    Product.findById(req.body.productId)
        .then(product => {

            if (!product){
                return res.status(404).json({
                    message: 'Product not found'
                })
            }
            
            const order = new Order({
                _id: new mongoose.Types.ObjectId(),
                product: req.body.productId,
                quantity: req.body.quantity
            });

            return order.save()        
        })
        .then(result => {
            console.log(result);
            res.status(201).json({
                message: 'order successfully created',
                order: {
                    _id: result._id,
                    product: result.product,
                    quantity: result.quantity
                },
                request: {
                    type: 'GET',
                    url: `http://localhost:5000/orders/${result._id}`
                }

            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ error: err});
        })
        // .catch(err => {
        //     console.log(err);
        //     res.status(500).json({
        //         message: 'Product not found',
        //         error: err
        //     })
        // })
    

    

})

router.get('/:orderId', (req, res) => {
    const orderId = req.params.orderId;
    Order.findById(orderId)
    .populate('product')
    .exec()
    .then(order => {
        if (!order){
            return res.status(404).json({
                error: 'Product not found'
            })
        }
        res.status(200).json({
            order: order,
            request: {
                type: 'GET',
                url: `http://localhost:5000/orders`
            }
        })
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        })
    })
})

router.delete('/:orderId', (req, res) => {

    const orderId = req.params.orderId;

    Order.remove({_id: orderId})
    .exec()
    .then(result => {
        res.status(201).json({
            message: 'order deleted',
            request: {
                type: 'POST',
                url: `http://localhost:5000/orders`,
                body: {productId: 'ID', quantity: 'NUMBER'}
                
            }
        })
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        })
    })
})



module.exports = router;