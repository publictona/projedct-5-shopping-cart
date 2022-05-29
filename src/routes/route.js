const express = require('express');
const router = express.Router()

const userController = require("../controllers/userController")
const productController = require('../controllers/productController')
const cartController = require('../controllers/cartController')
const { userAuth } = require('../middleware/auth')



//@ USER ROUTE HANDLER
router.post('/register', userController.createUser)
router.post('/login', userController.loginUser)
router.get('/user/:userId/profile', userAuth, userController.getUser)
router.put('/user/:userId/profile', userAuth, userController.updateUserDetails)

//@ PRODUCT ROUTE HANDLER
router.post('/products', productController.createProduct)
router.get('/products', productController.getProducts)
router.get('/products/:productId', productController.getProductById)
router.put('/products/:productId', productController.updateProduct)
router.delete('/products/:productId', productController.deleteproduct)

//@CART ROUTE HANDLER
router.post('/users/:userId/cart',cartController.createCart)
router.put('/users/:userId/cart',cartController.updateCart)
router.get('/users/:userId/cart',cartController.getCart)





module.exports = router