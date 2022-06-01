const express = require('express');
const router = express.Router()

const userController = require("../controllers/userController")
const productController = require('../controllers/productController')
const cartController = require('../controllers/cartController')
const orderController = require('../controllers/orderController')
const { userAuth } = require('../middleware/auth')




//@ FEATURE 1 : USER ROUTE HANDLER
router.post('/register', userController.createUser)
router.post('/login', userController.loginUser)
router.get('/user/:userId/profile', userAuth, userController.getUser)
router.put('/user/:userId/profile', userAuth, userController.updateUserDetails)


//@ FEATURE 2 : PRODUCT ROUTE HANDLER
router.post('/products', productController.createProduct)
router.get('/products', productController.getProducts)
router.get('/products/:productId', productController.getProductById)
router.put('/products/:productId', productController.updateProduct)
router.delete('/products/:productId', productController.deleteproduct)

//@ FEATURE 3 : CART ROUTE HANDLER
router.post('/users/:userId/cart',cartController.createCart)
router.put('/users/:userId/cart',cartController.updateCart)
router.get('/users/:userId/cart',cartController.getCart)
router.delete('/users/:userId/cart', userAuth,cartController.deleteCart)

// FEATURE 4 : ORDER ROUTE HANDLER
router.post('/users/:userId/orders',orderController.createOrder)
router.put('/users/:userId/orders',orderController.updateOrder)





module.exports = router