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
      let 


        let { productId, items, quantity, totalPrice, totalItems } = data

        let findCart = await cartModel.findOne({ _id: userId })
        if (!findCart) {

            // //userId validation
            if (!mongoose.isValidObjectId(userId))
                res.status(400).send({ status: false, msg: "Please enter a valid userId" })

            let findUser = await userModel.findById({ _id: userId })
            if (!findUser) {
                return res.status(404).send({ status: false, msg: "userId is not found" })
            }

            //product validation

            let findProduct = await productModel.findById({ _id: productId, isDeleted: false })
            if (!findProduct) {
                return res.status(404).send({ status: false, msg: "productId is not found" })
            }
            if (!mongoose.isValidObjectId(productId))
                res.status(400).send({ status: false, msg: "Please enter a valid productId" })


            if (!validator.isValid(items)) {
                return res.status(400).send({ status: false, msg: "items is required" })
            }
            if (!validator.isValid(quantity)) {
                return res.status(400).send({ status: false, msg: "quantity is required" })
            }
            if (!validator.isValid(totalPrice)) {
                return res.status(400).send({ status: false, msg: "totalPrice is required" })
            }
            if (!validator.isValid(totalItems)) {
                return res.status(400).send({ status: false, msg: "totalItems is required" })
            }


            savedData = await cartModel.create(data)
            res.status(201).send({ status: true, msg: "success", data: savedData })
        }
        if(findCart){
            let findProduct = await productModel.findOne({ _id: productId, isDeleted: false })
            if (!findProduct) {
                return res.status(404).send({ status: false, msg: "productId is not found" })
            }
            

}



    } catch (error) {
        console.log(error)
        res.status(500).send({ status: false, msg: "err.msg" })

    }
}



module.exports = { createCart }
