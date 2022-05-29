 const mongoose = require('mongoose');
const productModel = require('./productModel');

const ObjectId=mongoose.Types.ObjectId;

const productSchema = new mongoose.Schema({

 userId: {
     type:ObjectId,
      refs:User, 
      required:true
    },
  items: [{
    productId: {types: ObjectId,
         refs:productModel, 
         required:true
        },
    quantity: {
        type:Number,
         required:true,
          default: 1}
  }],
  totalPrice: {
      type:Number, 
      required:true, 
        
    },
  totalItems: {
      type:Number,
       required:true,
        
    },
  totalQuantity: {
      type:Number,
       required:true,
         
    },
  cancellable: {
      type:Boolean, 
      default: true
    },
  status: {
      type:String,
       default: 'pending', 
       enum:['pending', 'completed', 'cancelled']},

  deletedAt: {
      type:Date, 
      default: null
    }, 
  isDeleted: {
      type:Boolean,
       default: false
    },
  },{timestamps:true});
  module.exports =mongoose.model('Order',productSchema);