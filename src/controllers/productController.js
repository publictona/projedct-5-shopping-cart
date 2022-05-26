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

//======================================== < Get Product By Params > =================================

const getProductById = async function (req, res) {
    try {
        let productId = req.params.productId

        if (!mongoose.isValidObjectId(productId))
            res.status(400).send({ status: false, msg: "Please enter a valid ProductId" })

        let foundProduct = await productModel.findOne({ _id: productId, isDeleted: false })
        if (!foundProduct) {
            return res.status(400).send({ status: false, msg: 'No product found' })
        }
        return res.status(200).send({ status: true, msg: 'Sucess', data: foundProduct })

    }
    catch (error) {
        res.status(500).send({ status: false, message: error.message })

    }
}

//========================================== < Update Product >=======================================

const updateProduct = async function (req, res) {
    try {

        let productId = req.params.productId;
        let bodyData = req.body;


        if (!validator.isValid(productId)) {
            return res.status(400).send({ status: false, msg: "userId is required for update data" })
        }


        if (Object.keys(bodyData) == 0) {
            return res.status(400).send({ status: false, msg: "Bad Request, No Data Provided" })
        }


        const { title, description, price, currencyId, currencyFormat, isFreeShipping, productImage, style, availableSizes, installments } = bodyData;

        let updateUser = {};

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



        let updateData = await productModel.findByIdAndUpdate(productId, updateUser, { new: true });

        res.status(200).send({ status: true, msg: "Product Updated Successfully", data: updateData })

    }
    catch (error) {
        console.log(error)
        res.status(500).send({ status: false, msg: "err.message" })
    }
}


//==================================== < Delete Product >======================================

const deleteproduct = async function (req, res) {

    try {
        let productId = req.params.productId;

        // Check valid for ProductId
        if (!mongoose.isValidObjectId(productId))
            res.status(400).send({ status: false, msg: "Please enter a valid productId" })

        // Find product in DB by productId
        let deletedProduct = await productModel.findById({ _id: productId })

        if (!deletedProduct) {
            return res.status(404).send({ status: false, msg: "Product Not found" })
        }

        if (deletedProduct.isDeleted == true) {
            return res.status(400).send({ status: false, msg: "Product is already deleted" })
        }
        else {
            const deleteProduct = await productModel.findOneAndUpdate({ _id: productId }, { $set: { isDeleted: true } }, { new: true })
            return res.status(200).send({ status: true, message: "Product Deleted Successfully", data: deleteProduct })
        }

    } catch (error) {
        res.status(500).send({ status: false, message: error.message });
    }
}

module.exports = { createProduct, getProducts, getProductById, updateProduct, deleteproduct }



