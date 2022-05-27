const userModel = require("../models/userModel")
const productModel = require("../models/productModel")
const cartModel = require ("../models/cartModel")
const validator =require("../validator/validator") 
const mongoose = require('mongoose')

const CreateCart = async function(req,res){
    try {
        let userId = req.params.userId
        let productId = req.body

        if (!mongoose.isValidObjectId(userId))
        res.status(400).send({ status: false, msg: "Please enter a valid userId" })

        let findUser = await userModel.findById({_id:userId})
        if(!findUser){
            return res.status(404).send({status:false ,msg:"userId is not found"})
        }
        
    
    
    
    
    } catch (error) {
        
    }
}
// ## POST /users/:userId/cart (Add to cart)
// - Create a cart for the user if it does not exist. Else add product(s) in cart.
// - Get cart id in request body.
// - Get productId in request body.
// - Make sure that cart exist.
// - Add a product(s) for a user in the cart.
// - Make sure the userId in params and in JWT token match.
// - Make sure the user exist
// - Make sure the product(s) are valid and not deleted.
// - Get product(s) details in response body.
