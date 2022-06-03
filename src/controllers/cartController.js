const userModel = require("../models/userModel")
const productModel = require("../models/productModel")
const cartModel = require("../models/cartModel")
const validator = require("../validator/validator")
const mongoose = require('mongoose')




const createCart = async function (req, res) {
    try {
        const _id = req.params.userId
        const data = req.body
        let { cartId, productId, quantity } = data

        if (!productId) {
            return res.status(400).send({ status: false, message: "Provide productId" })
        }

        if (!mongoose.isValidObjectId(productId)) {
            return res.status(400).send({ status: false, message: "Invalid productId" })
        }

        if (!quantity) {
            quantity = 1
        }

        if (!/^[0-9]+$/.test(quantity)) {
            return res.status(400).send({ status: false, message: "Quantity should be a valid number" })
        }

        const findProduct = await productModel.findOne({ _id: productId, isDeleted: false })
        if (!findProduct) {
            return res.status(404).send({ status: false, message: "product does not exists" })
        }

        if (!cartId) {
            const findCart = await cartModel.findOne({ userId: _id })

            if (findCart) {
                //doubt
                return res.status(400).send({ status: false, message: "cart is already created" })
            }

            if (!findCart) {
                const addToCart = {
                    userId: _id,
                    items: {
                        productId: productId,
                        quantity: quantity
                    },
                    totalPrice: findProduct.price * quantity,
                    totalItems: 1
                }

                const cart = await cartModel.create(addToCart)
                return res.status(201).send({ status: true, message: "cart created and product added to cart successfully", data: cart })
            }
        }


        if (cartId) {
            if (!mongoose.isValidObjectId(cartId)) {
                return res.status(400).send({ status: false, message: "Invalid cartId" })
            }

            const findRealCart = await cartModel.findOne({ userId: _id })
            if (findRealCart) {
                if (findRealCart._id != cartId) {
                    return res.status(400).send({ status: false, message: `Incorrect CartId  ` })
                }
            }

            const findCart = await cartModel.findOne({ _id: cartId })
            if (!findCart) {
                const addToCart = {
                    userId: _id,
                    items: {
                        productId: productId,
                        quantity: quantity
                    },
                    totalPrice: findProduct.price * quantity,
                    totalItems: 1
                }

                const cart = await cartModel.create(addToCart)

                return res.status(201).send({ status: true, message: "cart created and product added to cart successfully", data: cart })
            }

            if (findCart) {

                
                for (let i = 0; i < findCart.items.length; i++) {

                    if (`${findCart.items[i].productId}` == `${findProduct._id}`) {
                        findCart.items[i].quantity = findCart.items[i].quantity + quantity
                        findCart.totalPrice = (findProduct.price * quantity) + findCart.totalPrice
                        findCart.totalItems = findCart.items.length
                        findCart.save()
                        return res.status(200).send({ status: true, message: "product added to cart", data: findCart })
                    }
                }

               
                findCart.items[(findCart.items.length)] = { productId: productId, quantity: quantity }
                findCart.totalPrice = (findProduct.price * quantity) + findCart.totalPrice
                findCart.totalItems = findCart.items.length
                findCart.save()
                return res.status(200).send({ status: true, message: "product added to cart", data: findCart })
            }
        }

    }
     catch (error) {
        res.status(500).send({ status: false, message: error.message, });
    }
}

//===============================================Update Cart API========================================================
const updateCart = async function (req, res) {
    try {
        let userId = req.params.userId
        let data = req.body
        let userIdFromToken = req.userId

        if (Object.keys(data) == 0) {
            return res.status(400).send({ status: false, msg: "Bad Request, No Data Provided" })
        }
        //userId validation
        if (!mongoose.isValidObjectId(userId)) {
            return res.status(400).send({ status: false, msg: "Please enter a valid userId" })
        }

        if (!validator.isValid(userId)) {
            return res.status(400).send({ status: false, msg: "userId is required" })
        }

        let findUser = await userModel.findOne({ _id: userId })
        if (!findUser) {
            return res.status(400).send({ status: false, msg: "User is not found" })
        }

        if (userIdFromToken != userId) {
            return res.status(403).send({ status: false, message: "You are not authorized" })
        }

        const { cartId, productId, removeProduct } = data

        //cartId validation
        if (!mongoose.isValidObjectId(cartId))
            res.status(400).send({ status: false, msg: "Please enter a valid cartId" })

        if (!validator.isValid(cartId)) {
            return res.status(400).send({ status: false, msg: "cartId is required" })
        }

        let findCart = await cartModel.findOne({ _id: cartId })
        if (!findCart) {
            return res.status(400).send({ status: false, msg: "cart is not found" })
        }

        //productId validation
        if (!mongoose.isValidObjectId(productId))
            res.status(400).send({ status: false, msg: "Please enter a valid productId" })

        if (!validator.isValid(productId)) {
            return res.status(400).send({ status: false, msg: "productId is required" })
        }

        let findProduct = await productModel.findById({ _id: productId })
        if (!findProduct) {
            return res.status(400).send({ status: false, msg: "product is not found" })
        }

        if (!((removeProduct === 0) || (removeProduct === 1))) {
            return res.status(400).send({ status: false, msg: "Remove Product should be a valid number either 0 or 1" })
        }

        

        let updateCarts = await cartModel.findOneAndUpdate({ _id: userId, isDeleted: false }, { new: true })
        if (!updateCarts)
            return res.status(404).send({ status: false, message: "cart with this userId does not exist" })

        await cartModel.findOneAndUpdate({ _id: productId }, { removeProduct: findProduct.removeProduct - 1 }, { new: true })
        res.status(200).send({ status: false, message: "product removed from cart successfully", data: updateCarts })


    } catch (error) {
        console.log(error)
        res.status(500).send({ status: false, msg: error.msg })

    }
}
//===============================================getCart API========================================================
const getCart = async function (req, res) {
    try {
        let userId = req.params.userId
        let userIdFromToken = req.userId

        if (!mongoose.isValidObjectId(userId)) {
            return res.status(400).send({ status: false, msg: "Please enter a valid userId" })
        }
        // const userByUserId = await userModel.findById(userId)
        // if (!userByUserId) {
        //     return res.status(404).send({ status: false, message: "User not found" })
        // }

        if (userIdFromToken != userId) {
            return res.status(403).send({ status: false, message: "You are not authorized" })
        }

        const findCart = await cartModel.findOne({ userId: userId })
        if (!findCart) {
            return res.status(404).send({ status: false, msg: "No Cart exist with this userId" })
        }

        if (findCart.totalPrice === 0) {
            return res.status(404).send({ status: false, msg: "Your Cart is empty" })
        }

        return res.status(200).send({ status: true, msg: "Cart details found", data: findCart })

    } catch (error) {
        res.status(500).send({ status: false, message: error.message })
    }
}

//====================================== < Delete Cart > ============================================

const deleteCart = async function (req, res) {
    try {
        const userId = req.params.userId

        if (!validator.isValid(userId)) {
            return res.status(400).send({ status: false, msg: "userId is required" })
        }

        if (!mongoose.isValidObjectId(userId)) {
            res.status(400).send({ status: false, msg: "Please enter a valid userId" })
        }

        const findUser = await userModel.findOne({ _id: userId })
        if (!findUser) {
            return res.status(404).send({ status: false, msg: "User does not exist" })
        }

        if (req.userId != userId) {
            return res.status(401).send({ status: false, message: "You're not Authorized" })
        }

        const findCartById = await cartModel.findOne({ userId: userId })
        if (!findCartById) {
            return res.status(404).send({ status: false, message: "No Cart Available" })
        }

        
        if (findCartById.items.length == 0)
            return res.status(400).send({ status: false, message: `your cart is already empty` });

        const deletedCart = await cartModel.findOneAndUpdate({ userId: userId }, { $set: { items: [], totalItems: 0, totalPrice: 0 } }, { new: true })
        

        

        // await cartModel.findOne({ userId: userId })

        return res.status(204).send({ status: true, msg: "All Items in cart deleted Successfully", data: deletedCart })
    }
    catch (error) {
        res.status(500).send({ status: false, message: error.message })
    }
}

module.exports = { createCart, updateCart, getCart, deleteCart }
