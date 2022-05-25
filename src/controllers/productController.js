const productModel = require('../models/productModel')
const aws = require('../aws/aws')
const validator = require('../validator/validator')

const mongoose = require('mongoose')


const createProduct = async function (req, res) {
    try {
        let data = req.body
        let title=req.body.title
        console.log(data)
        if (Object.keys(data).length == 0){
            return res.status(400).send({ status: false, mgs: 'Provide product details' })
        }
        //data = JSON.parse(data)
        //uploading product image 
        let files =req.files
        if(!files ||files.length==0){
            return res.status(400).send({status:false,msg:'No filse found'})
        }
        const uploadedFileURL =await  aws.uploadFile(files[0])
        data.productImage= uploadedFileURL


       
        if(!validator.isValid(data.title)){
            return res.status(400).send({status:false,mgs:'Plz,Provide Title'})
        }


        //check title availablity
        let titleExisted =await productModel.findOne({title})
        if(titleExisted){
            return res.status(400).send({status:false,msg:"Title is already exist"})
         }
           
    
        if(!validator.isValid(data.description)){
            return res.status(400).send({status:false,mgs:'Plz,Provide Description'})
        }

        if(!validator.isValid(data.price)){
            return res.status(400).send({status:false,mgs:'Plz,Provide Price '})
        }
       // price format validation
        // if(data.price){
        //    let price= /^(?:(?:INR)\.?\s?)(\d+(:?\,\d+)?(\,\d+)?(\.\d{1,4})?)[., ]$/.test(price)
        //    if(!price){
        //        return res.status(400).send({status:false,msg:"Plz, enter valid format of price"})
        //    }
        // }
        if(!validator.isValid(data.currencyId)){
            return res.status(400).send({status:false,mgs:'Plz,Provide currencyId '})
        }
        if(!validator.isValid(data.currencyFormat)){
            return res.status(400).send({status:false,mgs:'Plz,Provide currencyFormat '})
        }
        // if(!validator.isValid(data.isFreeShipping)){
        //     return res.status(400).send({status:false,mgs:'Plz,Provide isFreeShiping '})
        // }


        if(!validator.isValid(data.productImage)){
            return res.status(400).send({status:false,mgs:'Plz,Provide ProductImage '})
        }


        if(!validator.isValid(data.availableSizes)){
            return res.status(400).send({status:false,mgs:'Plz,Provide availableSizes '})
        }
        if(data.availableSizes!=='S'&&
         data.availableSizes!=='XS'&&
         data.availableSizes!=='M' && 
         data.availableSizes!=='X'&& 
        data.availableSizes!=='L'&&
        data.availableSizes!=='XXL'&&
        data.availableSizes!=='XL'){
            return res.status(400).send({status:false,msg:'Provide Size among S,XS,M,X,L,XXL and XL'})
        }
        //req.data=data;
// Creating DOC in DB
        let savedPoduct =await productModel.create(data);
        res.status(201).send({status:true,msg:'Success',data:savedPoduct})
        
    } catch (error) {
        res.status(500).send({ status: false, message: error.message })

    }
}

module.exports = { createProduct }