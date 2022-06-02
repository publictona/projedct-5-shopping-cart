const userModel = require('../models/userModel');
const cartModel = require("../models/cartModel")
const orderModel = require('../models/orderModel');

const validator = require("../validator/validator");
const mongoose = require('mongoose');


const createOrder = async function (req, res) {
    try {
        let data = req.body;
        let userId = req.params.userId;

        if (Object.keys(data).length === 0) {
            return res.status(400).send({ status: false, message: "Please enter data to create the order" })
        }
        if (!mongoose.isValidObjectId(userId)) {
            return res.status(400).send({ status: false, message: "Please enter a valid userId" })
        }
        if (!validator.isValid(userId)) {
            return res.status(400).send({ status: false, message: 'userId is required' })
        }

        // if (req.userId != userId) {
        //     return res.status(401).send({ status: false, message: "You are not Authorized" })
        // }

        //check for user exist or not
        let userExist = await userModel.findOne({ userId, isDeleted: false })
        if (!userExist) {
            return res.status(400).send({ status: false, message: "User is not found" })
        }

        const { cartId, cancellable, status } = data

        // if (!cartId) {
        //     return res.status(400).send({ status: false, message: "Cart Does not exists for UserId" })
        // }

        if (!mongoose.isValidObjectId(cartId)) {
            return res.status(400).send({ status: false, message: "Please enter a valid CartId" })
        }

        const searchCartDetails = await cartModel.findOne({ _id: cartId, userId: userId })
        if (!searchCartDetails) {
            return res.status(400).send({ status: false, message: "Cart doesn't belongs to userId" })
        }

        if (cancellable) {
            if (typeof cancellable != "boolean") {
                return res.status(400).send({ status: false, message: "Cancellable must be either 'true' or 'false'." })
            }
        }

        if (status) {
            if (!['pending', 'completed', 'cancelled'].includes(status)) {
                return res.status(400).send({ status: false, message: "Status Should be from ['pending', 'completed', 'cancelled']" })
            }
        }

        const reducer = (previousValue, currentValue) =>
        previousValue + currentValue

        let totalQuantity = searchCartDetails.items.map((x) => x.quantity).reduce(reducer)

        //create order
        let cartData = {
            userId: userId,
            items: searchCartDetails.items,
            totalPrice: searchCartDetails.totalPrice,
            totalItems: searchCartDetails.totalItems,
            totalQuantity: totalQuantity,
            cancellable,
            status

        }

        // let findOrder =await cartModel.findOne({_id:cartId})
        // if(findOrder.length){
        //     return res.status(404).send({status:false ,msg:"cart is empty "})
        // }


        let createOrder = await orderModel.create(cartData)

        await cartModel.findOneAndUpdate({_id:cartId, userId:userId},{
            $set:{
                items:[],
                
                totalPrice:0,
                totalItems:0,
            }
        })


        return res.status(201).send({ status: true, message: 'Succes', data: createOrder })

    }
    catch (error) {
        console.log(error.message)
        res.status(500).send({ status: false, message: error.message })

    }
}

//Update Order
const updateOrder = async function (req, res) {
    try {
        let orderId = req.params.orderId;
        console.log(orderId)
        let data = req.body;
        if (Object.keys(data).length === 0) {
            return res.status(400).send({ status: false, message: "Please enter data to update the order" })
        }
        if (!mongoose.isValidObjectId(orderId)) {
            return res.status(400).send({ status: false, message: "Please enter a valid orderId" })
        }
        if (!validator.isValid(orderId)) {
            return res.status(400).send({ status: false, message: "orderId is required" })
        }

        //updating order
        let updateOrder = await orderModel.findOneAndUpdate({ orderId, isDeleted: false }, data, { new: true })
        if (!updateOrder) {
            return res.status(400).send({ status: false, message: "Order is not found" })
        }
        return res.status(201).send({ status: true, message: "Order updated successfully", data: updateOrder })
    }
    catch (error) {
        res.status(500).send({ status: false, message: error.message })
    }
}


module.exports = { createOrder, updateOrder }