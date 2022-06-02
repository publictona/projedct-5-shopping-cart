const userModel =require('../models/userModel');
const cartModel =require("../models/cartModel")
const validator =require("../validator/validator");
const mongoose =require('mongoose');
const orderModel = require('../models/orderModel');



const  createOrder=async function(req,res){
    try {
        let data=req.body;
        let userId =req.params.userId;
        let cartId =req.params.cartId;
       
        //cartDetails=JSON.parse(data);
    if(Object.keys(data).length===0){
            return res.status(400).send({status:false,message:"Please enter data to create the order"})
        }
     if(!mongoose.isValidObjectId(userId)){
        return res.status(400).send({status:false,message:"Please enter a valid userId"})
    }
    if(!validator.isValid(userId)){
        return res.status(400).send({status:false,message:'userId is required'})
    }
 //check for user exist or not
let userExist=await userModel.findOne({userId,isDeleted:false})
if(!userExist){
    return res.status(400).send({status:false,message:"User is not found"})
}
//create order
  let cartData={

        userId:userId,
       items:[{
            productId:data.productId,
            quantity:data.quantity,
          
        }],
        totalPrice:data.totalPrice,
        totalItems:data.totalItems,
       totalQuantity:data.totalQuantity,
        cancellable:data.cancellable,
        status:data.status,

  }
 let createOrder= await orderModel.create(cartData)
 return res.status(201).send({status:true,message:'Succes',data:createOrder})
 
}
 catch (error) {
        res.status(500).send({status:false,message:error.message})
        
    }
}

//Update Order
const updateOrder=async function(req,res){
    try{
        let orderId=req.params.orderId;
        console.log(orderId)
        let data=req.body;
        if(Object.keys(data).length===0){
            return res.status(400).send({status:false,message:"Please enter data to update the order"})
        }
        if(!mongoose.isValidObjectId(orderId)){
            return res.status(400).send({status:false,message:"Please enter a valid orderId"})
        }
        if(!validator.isValid(orderId)){
            return res.status(400).send({status:false,message:"orderId is required"})
        }

        //updating order
        let updateOrder=await orderModel.findOneAndUpdate({orderId,isDeleted:false},data,{new:true})
        if(!updateOrder){
            return res.status(400).send({status:false,message:"Order is not found"})
        }
        return res.status(201).send({status:true,message:"Order updated successfully",data:updateOrder})
    }
    catch(error){
        res.status(500).send({status:false,message:error.message})
     }
}


module.exports={createOrder,updateOrder}