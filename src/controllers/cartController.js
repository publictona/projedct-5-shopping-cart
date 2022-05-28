const userModel = require("../models/userModel")
const productModel = require("../models/productModel")
const cartModel = require("../models/cartModel")
const validator = require("../validator/validator")
const mongoose = require('mongoose')

const createCart = async function (req, res) {
    try {
        let userId = req.params.userId
        let data = req.body

        if (Object.keys(data) == 0) {
            return res.status(400).send({ status: false, msg: "Bad Request, No Data Provided" })
        }

        let { productId, quantity } = data

        if (!validator.isValid(userId)) {
            return res.status(400).send({ status: false, msg: "UserId is required" })
        }

        if (!mongoose.isValidObjectId(userId)) {
            return res.status(400).send({ status: false, msg: "Please enter a valid userId" })
        }

        if (!validator.isValid(productId)) {
            return res.status(400).send({ status: false, msg: "ProductId is required" })
        }

        if (!mongoose.isValidObjectId(productId)) {
            return res.status(400).send({ status: false, msg: "Please enter a valid productId" })
        }

        if (!validator.isValid(quantity)) {
            return res.status(400).send({ status: false, msg: "quantity is required" })
        }

        if (quantity < 1) {
            return res.status(400).send({ status: false, msg: "Please provide Quantity" })
        }

        let findUser = await userModel.findById({ _id: userId })
        if (!findUser) {
            return res.status(404).send({ status: false, msg: "userId is not found" })
        }

        let findProduct = await productModel.findById({ _id: productId, isDeleted: false })
        if (!findProduct) {
            return res.status(404).send({ status: false, msg: "productId is not found" })
        }

        let findCart = await cartModel.findOne({ _id: userId })
        if (!findCart) {

            let data = {
                userId: userId,
                items: [{
                    productId: productId,
                    quantity: quantity
                }],
                totalPrice: findProduct.price * quantity,
                totalItems: 1
            }

            const createCart = await cartModel.create(data)
            return res.status(201).send({ status: true, msg: "Cart Created Successfully", data: createCart })
        }
    } catch (error) {
        console.log(error)
        res.status(500).send({ status: false, msg: "err.msg" })

    }
}


const updateCart = async function (req, res) {
    try {
        let userId = req.params.userId
        let data = req.body

        if (!Object.keys(data).length)
            return res.status(400).send({ status: false, message: "Please enter some data to update the cart." })

        //userId validation
        if (!mongoose.isValidObjectId(userId))
            res.status(400).send({ status: false, msg: "Please enter a valid userId" })

        if (!validator.isValid(userId)) {
            return res.status(400).send({ status: false, msg: "userId is required" })
        }

        let findUser = await cartModel.findOne({ _id: userId, isDeleted: false })//check
        if (!findUser) {
            return res.status(400).send({ status: false, msg: "User is not found" })
        }

        //cartId validation
        if (!mongoose.isValidObjectId(cartId))
            res.status(400).send({ status: false, msg: "Please enter a valid cartId" })

        if (!validator.isValid(cartId)) {
            return res.status(400).send({ status: false, msg: "cartId is required" })
        }

        let findCart = await cartModel.findOne({ _id: cartId, isDeleted: false })
        if (!findCart) {
            return res.status(400).send({ status: false, msg: "cart is not found" })
        }

        //productId validation
        if (!mongoose.isValidObjectId(productId))
            res.status(400).send({ status: false, msg: "Please enter a valid productId" })

        if (!validator.isValid(productId)) {
            return res.status(400).send({ status: false, msg: "productId is required" })
        }

        let findProduct = await cartModel.findbyId({ _id: productId, isDeleted: false })//check
        if (!findProduct) {
            return res.status(400).send({ status: false, msg: "product is not found" })
        }

        let updateCarts= await cartModel.findByIdAndUpdate({_id :userId ,isDeleted:false },{ new: true })
        if(!updateCarts)
        return res.status(404).send({status: false ,message :"cart with this userId does not exist"})

        await  cartModel.findByIdAndUpdate({_id :productId},{removeProduct :findProduct.removeProduct -1},{ new: true })
        res.status(204).send({status : false , message : "product removed from cart successfully" , data:updateCarts})


} catch (error) {
        console.log(error)
        res.status(500).send({ status: false, msg: error.msg })

    }
}

module.exports = { createCart, updateCart }
