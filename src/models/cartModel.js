  const mongoose =     require('mongoose');
    
  const ObjectId =mongoose.Schema.Types.ObjectId
  const cartSchema = mongoose.Schema({
    userId: {
        type:ObjectId,
         ref :'User', 
         required:true,
          unique:true, 
          trim:true},
    items: [{
      productId: {
          ObjectId,
           ref: 'Product',
            required:true,
            unique:true,
            trime:true},
      quantity: {
          type:Number, 
          required:true,
          default:1,
          trim:true},
    }],
    totalPrice: {
        type:Number,
         required:true, 
         comment: "Holds total price of all the items in the cart"},

    totalItems: {
        type:Number,
         required:true, 
         comment: "Holds total number of items in the cart"},
    
  },{timestamps:true});
  module.exports = mongoose.model('Cart',cartSchema)