const productModel = require('../models/productModel')
const aws = require('../aws/aws')
const validator = require('../validator/validator')

const mongoose = require('mongoose')


const createProduct = async function (req, res) {
    try {
        let data = req.body
        console.log(data)
        if (Object.keys(data).length == 0){
            return res.status(400).send({ status: false, mgs: 'Provide product details' })
        }
        if(!validator.isValid(data.title)){
            return res.status(400).send({status:false,mgs:'Plz,Provide Title'})
        }
        if(!validator.isValid(data.description)){
            return res.status(400).send({status:false,mgs:'Plz,Provide Description'})
        }

        if(!validator.isValid(data.price)){
            return res.status(400).send({status:false,mgs:'Plz,Provide Price '})
        }
        if(!validator.isValid(data.currencyId)){
            return res.status(400).send({status:false,mgs:'Plz,Provide currencyId '})
        }
        if(!validator.isValid(data.currencyFormat)){
            return res.status(400).send({status:false,mgs:'Plz,Provide currencyFormat '})
        }
        if(!validator.isValid(data.price)){
            return res.status(400).send({status:false,mgs:'Plz,Provide Price '})
        }
  
  
  
  
           


    } catch (error) {
        res.status(500).send({ status: false, message: error.message })

    }
}

module.exports = { createProduct }