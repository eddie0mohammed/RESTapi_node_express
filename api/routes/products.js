
const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');

const checkAuth = require('../middleware/check-auth');
// const Product = require('../models/product');
const productController = require('../controllers/products');


const router = express.Router();

//multer for image upload and storage
const storage = multer.diskStorage({
    destination: function (req, file, cb){
        cb(null, './uploads');
    },
    filename: function (req, file, cb){
        cb(null, new Date().toISOString() + file.originalname);
    }
})

//filter according to fileType
const fileFilter = (req, file, cb) => {
    //reject a file
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png'){
        //store file
        cb(null, true);
    }else{
        // dont save
        cb(null, false);
    }
}

const upload = multer({
    storage: storage, 
    limits: {  fileSize: 1024 * 1024 * 3 },
    fileFilter: fileFilter
});



router.get('/', productController.getAllProducts);

router.post('/', checkAuth, upload.single('productImage'), productController.postProduct);

router.get('/:productId', productController.getSpecificProduct);

router.patch('/:productId', checkAuth, productController.patchProduct);

router.delete('/:productId', checkAuth, productController.deleteProduct);



module.exports = router;