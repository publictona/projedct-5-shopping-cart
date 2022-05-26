const productModel = require('../models/productModel')
const aws = require('../aws/aws')
const validator = require('../validator/validator')

const mongoose = require('mongoose')


const createProduct = async function (req, res) {
    try {
        let data = req.body
        let title = req.body.title
        if (Object.keys(data).length == 0) {
            return res.status(400).send({ status: false, mgs: 'Provide product details' })
        }
        //data = JSON.parse(data)
        //uploading product image 
        let files = req.files
        // console.log(files)
        if (!files || files.length == 0) {
            return res.status(400).send({ status: false, msg: 'No filse found' })
        }
        const uploadedFileURL = await aws.uploadFile(files[0])
        data.productImage = uploadedFileURL



        if (!validator.isValid(data.title)) {
            return res.status(400).send({ status: false, mgs: 'Plz,Provide Title' })
        }


        //check title availablity
        let titleExisted = await productModel.findOne({ title })
        if (titleExisted) {
            return res.status(400).send({ status: false, msg: "Title is already exist" })
        }


        if (!validator.isValid(data.description)) {
            return res.status(400).send({ status: false, mgs: 'Plz,Provide Description' })
        }

        if (!validator.isValid(data.price)) {
            return res.status(400).send({ status: false, mgs: 'Plz,Provide Price ' })
        }
        // price format validation
        // if(data.price){
        //    let price= /^(?:(?:INR)\.?\s?)(\d+(:?\,\d+)?(\,\d+)?(\.\d{1,4})?)[., ]$/.test(price)
        //    if(!price){
        //        return res.status(400).send({status:false,msg:"Plz, enter valid format of price"})
        //    }
        // }
        if (!validator.isValid(data.currencyId)) {
            return res.status(400).send({ status: false, mgs: 'Plz,Provide currencyId ' })
        }
        if (!validator.isValid(data.currencyFormat)) {
            return res.status(400).send({ status: false, mgs: 'Plz,Provide currencyFormat ' })
        }
        // if(!validator.isValid(data.isFreeShipping)){
        //     return res.status(400).send({status:false,mgs:'Plz,Provide isFreeShiping '})
        // }


        if (!validator.isValid(data.productImage)) {
            return res.status(400).send({ status: false, mgs: 'Plz,Provide ProductImage ' })
        }


        if (!validator.isValid(data.availableSizes)) {
            return res.status(400).send({ status: false, mgs: 'Plz,Provide availableSizes ' })
        }
        if (data.availableSizes !== 'S' &&
            data.availableSizes !== 'XS' &&
            data.availableSizes !== 'M' &&
            data.availableSizes !== 'X' &&
            data.availableSizes !== 'L' &&
            data.availableSizes !== 'XXL' &&
            data.availableSizes !== 'XL') {
            return res.status(400).send({ status: false, msg: 'Provide Size among S,XS,M,X,L,XXL and XL' })
        }
        //req.data=data;
        // Creating DOC in DB
        let savedPoduct = await productModel.create(data);
        res.status(201).send({ status: true, msg: 'Success', data: savedPoduct })

    } catch (error) {
        res.status(500).send({ status: false, message: error.message })

    }
}

//====================================== < Get Product > ==========================================

const getProducts = async function (req, res) {
    try {
        let data = req.query
        let filter = {}
        filter.isDeleted = false

        const { name, size, priceGreaterThan, priceLessThan, priceSort } = data

        const findName = await productModel.find({ isDeleted: false }).select({ title: 1, _id: 0 })
        for (let i = 0; i < findName.length; i++) {



        }


    } catch (error) {
        res.status(500).send({ status: false, msg: error.message })

    }
}
//==========================================<update productId>===========================================================================

// const updateProduct = async function(req, res){
// try {
//     let productId = req.params.productId
//     let data = req.body

//     if (productImage) {
//         if (files && files.length > 0) {
//             productImage = await uploadFile(files[0]);
//         }
//         updateUser["productImage"] = productImage;
//     }


//     if (Object.keys(data) == 0) {
//         return res.status(400).send({ status: false, msg: "Bad Request, No Data Provided" })
//     }

//     if(!mongoose.isValidObjectId(productId)){
//         return res.status(400).send({status:false ,msg :"productId is invalid to get product data"})
//     }
//      let findProduct = await productModel.findOne({_id:productId  ,isDeleted :false})
//      if(!findProduct){
//          return res.status(404).send({status:false ,message :"product not Found"})
//      }
//      res.status(200).send({status:true ,message:"success" ,data :findProduct})

//      let updateData = await productModel.findByIdAndUpdate(productId, updateProduct, { new: true });
//     //  if(updateData){
//     //      return res.status(400).send({status:false , msg: "datails required for product updation"})
//     //  }
//          res.status(200).send({ status: true, msg: "Product details Updated Successfully", data: updateData })



//     } catch (error) {
//         console.log(error)
//         res.status(500).send({status:false ,message: "error.message"})

//     }
// }


//=========================================================================================
const updateProduct = async function (req, res) {
    try {

        let productId = req.params.userId;
        let bodyData = req.body;


        if (!validator.isValid(productId)) {
            return res.status(400).send({ status: false, msg: "userId is required for update data" })
        }


        if (Object.keys(bodyData) == 0) {
            return res.status(400).send({ status: false, msg: "Bad Request, No Data Provided" })
        }


        if (req.userId != productId) {
            return res.status(401).send({ status: false, message: "You're not Authorized" })
        }

        const { title, description, price, currencyId, currencyFormat, isFreeShipping, productImage, style, availableSizes, installments } = bodyData;

        let updateUser = {};
        //title validation
        if (title == 0) {
            return res.status(400).send({ status: false, msg: "title should not be empty" })
        }
        updateUser["title"] = title;

        let titleExisted = await productModel.findOne({ title })
        if (titleExisted) {
            return res.status(400).send({ status: false, msg: "Title is already exist" })
        }


        if (description == 0) {
            return res.status(400).send({ status: false, msg: "description should not be empty" })
        }
        updateUser["description"] = description;


        if (price == 0) {
            return res.status(400).send({ status: false, msg: "price should not be empty" })
        }
        updateUser["price"] = price;


        if (currencyId == 0) {
            return res.status(400).send({ status: false, msg: "currencyId should not be empty" })
        }
        updateUser["currencyId"] = currencyId;


        if (currencyFormat == 0) {
            return res.status(400).send({ status: false, msg: "currencyFormat should not be empty" })
        }
        updateUser["currencyFormat"] = currencyFormat;


        if (isFreeShipping == 0) {
            return res.status(400).send({ status: false, msg: "isFreeShipping should not be empty" })
        }
        updateUser["isFreeShipping"] = isFreeShipping;

        if (style == 0) {
            return res.status(400).send({ status: false, msg: "style should not be empty" })
        }
        updateUser["style"] = style;

        if (availableSizes == 0) {
            return res.status(400).send({ status: false, msg: "availableSizes should not be empty" })
        }
        updateUser["availableSizes"] = availableSizes;

        if (installments == 0) {
            return res.status(400).send({ status: false, msg: "installments should not be empty" })
        }
        updateUser["installments"] = installments;

        if (productImage) {
            if (files && files.length > 0) {
                productImage = await uploadFile(files[0]);
            }
            updateUser["productImage"] = productImage;
        }



        let updateData = await userModel.findByIdAndUpdate(productId, updateUser, { new: true });

        res.status(200).send({ status: true, msg: "User Profile Updated Successfully", data: updateData })

    }
    catch (error) {
        console.log(error)
        res.status(500).send({ status: false, msg: "err.message" })
    }
}
module.exports = { createProduct, updateProduct }



