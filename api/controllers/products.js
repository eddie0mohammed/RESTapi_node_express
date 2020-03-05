const mongoose = require('mongoose');

const Product = require('../models/product');


const getAllProducts = (req, res) => {

    Product.find()
        .select('name price _id productImage')
        .exec()
        .then(docs => {
            
            const response = {
                count: docs.length,
                products: docs.map(doc => {
                    return {
                        name: doc.name,
                        price: doc.price,
                        _id: doc._id,
                        productImage: doc.productImage,
                        request: {
                            type: "GET",
                            url: `http://localhost:5000/products/${doc._id}`
                        }
                    }
                })
            }
            res.status(200).json(response);

        })
        .catch(err => {
            // console.log(err);
            res.status(500).json({message: 'No entry found'});
        })
    }



const postProduct = (req, res) => {

    console.log(req.file);
    //create product
    const product = new Product({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        price: req.body.price,
        productImage: req.file.path
    })
    //save to db
    product.save().then(result => {
        // console.log(result);

        res.status(201).json({
            message: 'successfully created product',
            createdProduct: {
                name: result.name,
                price: result.price,
                _id: result._id,
                productImage: result.productImage,
                request: {
                    type: 'GET',
                    url: `http://localhost:5000/products/${result._id}`
                }
            }
        })
    })
    .catch(err => {
        // console.log(err);
        res.status(500).json({error: err});
    })
    
}



const getSpecificProduct = (req, res) => {
    const productId = req.params.productId;
    //find product
    Product.findById(productId)
        .select('name price _id productImage')
        .exec()
        .then(doc => {
            // console.log(doc);
            if (doc){
                res.status(200).json({
                    name: doc.name,
                    price: doc.price,
                    _id: doc._id,
                    productImage: doc.productImage,
                    request: {
                        type: 'GET',
                        url: `http://localhost:5000/products/${doc._id}`
                    }
                });
            }else{
                res.status(404).json({message: 'No entry found for provided ID'});
            }
        })
        .catch(err => {
            // console.log(err);
            res.status(500).json({error: err});
        })
    
}


const patchProduct = (req, res) => {
    
    const productId = req.params.productId;

    let updatedObj = {};
    for (let key in req.body){
        updatedObj[key] = req.body[key];
    }
    
    Product.update({_id: productId}, { $set: updatedObj}).exec()
        .then(result => {
            // console.log(result);
            res.status(200).json({
                message: 'product updated',
                request: {
                    type: 'GET',
                    url: `http://localhost:5000/products/${productId}`
                }
            });
        })
        .catch(err => {
            // console.log(err);
            res.status(500).json({error: err});
        })
}



const deleteProduct = (req, res) => {
    
    const productId = req.params.productId;

    Product.remove({_id: productId}).exec()
        .then(result => {
            // console.log(result);
            res.status(200).json({
                message: 'Product successfully deleted'
            });
        })
        .catch(err => {
            // console.log(err);
            res.status(500).json({error: err});
        })
}





module.exports = {
    getAllProducts: getAllProducts,
    postProduct: postProduct,
    getSpecificProduct: getSpecificProduct,
    patchProduct: patchProduct,
    deleteProduct: deleteProduct
}