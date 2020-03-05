
const User = require('../models/user');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


const signUp = (req, res, next) => {

    User.find({email: req.body.email})
    .exec()
    .then(user => {
        if (user.length >= 1){
            return res.status(409).json({
                message: 'Email already exists'
            })
        }else{

            bcrypt.hash(req.body.password, 10, (err, hash) => {
                if (err){
                    return res.status(500).json({
                        error: err
                    });
                }else{
                    const user = new User({
                        _id: new mongoose.Types.ObjectId(),
                        email: req.body.email,
                        password: hash
                    })
        
                    user.save()
                    .then(result => {
                        res.status(201).json({
                            message: 'User created'
                        })
                    })
                    .catch(err => {
                        console.log(err);
                        res.status(500).json({
                            error: err
                        })
                    })
                }
      
            })
        }
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        })
    })
}


const getAllUsers = (req, res, next) => {

    User.find()
    .then(result => {
        res.status(200).json(result);

    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        })
    })

}


const deleteUser = (req, res, next) => {
    User.remove({ _id: req.params.userId})
        .exec()
        .then( result => {
            // console.log(result);
            res.status(200).json({
                message: 'User deleted'
            })
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            })
        })

    }



const login = (req, res, next) => {

    User.find({email: req.body.email})
    .exec()
    .then(user => {
        
        if (user.length < 1){
            return res.status(401).json({
                message: 'Auth failed'
            })
        }else{

            // console.log(req.body.password);
            // console.log(user[0].password);

            bcrypt.compare(req.body.password, user[0].password, (err, result) => {
                // console.log(result);
                if (err){
                    return res.status(401).json({
                        message: 'Auth failed'
                    })
                }
                if (result){
                    //token
                    const token = jwt.sign({
                        email: user[0].email,
                        userId: user[0]._id
                    },
                        'SECRET_JWT_KEY',
                    {   expiresIn: '1h' }
                    
                    )

                    return res.status(200).json({
                        message: 'Auth successful',
                        token: token
                    })
                }

                res.status(401).json({
                    message: 'Auth failed'
                })
                          
            })  
        }
         
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        })
    })

}


module.exports = {
    signUp: signUp,
    getAllUsers: getAllUsers,
    deleteUser: deleteUser,
    login: login
}