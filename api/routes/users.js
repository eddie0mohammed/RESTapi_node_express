
const express = require('express');

const userController = require('../controllers/users');

const router = express.Router();


router.post('/signup', userController.signUp);


router.get('/', userController.getAllUsers);

router.delete('/:userId', userController.deleteUser);


router.post('/login', userController.login)


module.exports = router;