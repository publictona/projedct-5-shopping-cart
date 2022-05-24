const userModel = require('../models/userModel')
const aws = require("../aws/aws.js")
const bcrypt = require("bcrypt")
const validator = require("../validator/validator.js")
const jwt = require("jsonwebtoken")




const createUser = async function (req, res) {
    try {
        let data = req.body
        if (Object.keys(data) == 0) {
            return res.status(400).send({ status: false, msg: "Bad Request, No Data Provided" })
        }

        let { fname, lname, profileImage, email, phone, password, address } = data

        // Profile Image Creation :-
        let files = req.files
        if (!files || files.length == 0) {
            return res.status(400).send({ status: false, msg: "No file found" })
        }
        const uploadedFileURL = await aws.uploadFile(files[0])
        data.profileImage = uploadedFileURL

        // fname Validation :-
        if (!validator.isValid(fname)) {
            return res.status(400).send({ status: false, msg: "fname is required" })
        }

        // lname Validation :-
        if (!validator.isValid(lname)) {
            return res.status(400).send({ status: false, msg: "lname is required" })
        }

        // Email Validation :-
        if (!validator.isValid(email)) {
            return res.status(400).send({ status: false.valueOf, msg: "Email is required" })
        }

        if (!(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email.trim()))) {
            return res.status(400).send({ status: false, msg: "Please provide a valid email" })
        }

        let uniqueEmail = await userModel.findOne({ email })
        if (uniqueEmail) {
            return res.status(400).send({ status: false, msg: "Email Already Exist" })
        }

        // Phone Number Validation :-
        if (!validator.isValid(phone)) {
            return res.status(400).send({ status: false, msg: "Phone Number Is Required" })
        }

        if (!(/^(?:(?:\+|0{0,2})91(\s*|[\-])?|[0]?)?([6789]\d{2}([ -]?)\d{3}([ -]?)\d{4})$/.test(phone.trim()))) {
            return res.status(400).send({ status: false, msg: "Please Provide a Valid Phone Number" })
        }

        let uniquePhone = await userModel.findOne({ phone })
        if (uniquePhone) {
            return res.status(400).send({ status: false, msg: "Phone Number Already Exist" })
        }

        // Password Validation :-
        if (!validator.isValid(password)) {
            return res.status(400).send({ status: false, msg: "Password is Required" })
        }

        if (!(password.length >= 8 && password.length <= 15)) {
            return res.status(400).send({ status: false, msg: "Password Should be minimum 8 characters and maximum 15 characters", });
        }





        // Address Validation :-
        if (!validator.isValid(address)) {
            return res.status(400).send({ status: false, msg: "Address is Required" })
        }

        // Shipping Address Validation :-
        if (!validator.isValid(address.shipping)) {
            return res.status(400).send({ status: false, msg: "Shipping Address is Required" })
        }

        if (!validator.isValid(address.shipping.street)) {
            return res.status(400).send({ status: false, msg: "Street of Shipping Address is Required" })
        }

        if (!validator.isValid(address.shipping.city)) {
            return res.status(400).send({ status: false, msg: "City of Shipping Address is Required" })
        }

        if (!validator.isValid(address.shipping.pincode)) {
            return res.status(400).send({ status: false, msg: "Pincode of Shipping Address is Required" })
        }

        if (!(/^[1-9][0-9]{5}$/.test(address.shipping.pincode.trim()))) {
            return res.status(400).send({ status: false, msg: "Enter Valid Pincode for Shipping Address" })
        }

        //Billing Address Validation :-
        if (!validator.isValid(address.billing)) {
            return res.status(400).send({ status: false, msg: "Billing Address is Required" })
        }

        if (!validator.isValid(address.billing.street)) {
            return res.status(400).send({ status: false, msg: "Street of Billing Address is Required" })
        }

        if (!validator.isValid(address.billing.city)) {
            return res.status(400).send({ status: false, msg: "City of Billing Address is Required" })
        }

        if (!validator.isValid(address.billing.pincode)) {
            return res.status(400).send({ status: false, msg: "Pincode of Billing Address is Required" })
        }

        if (!(/^[1-9][0-9]{5}$/.test(address.billing.pincode.trim()))) {
            return res.status(400).send({ status: false, msg: "Enter Valid Pincode for Billing Address" })
        }


        let savedData = await userModel.create(data)
        res.status(201).send({ status: true, msg: "Success", data: savedData })


    } catch (error) {
        res.status(500).send({ status: false, message: error.message });
    }

}

//====================================< >============================================================

const loginUser = async function (req, res) {
    try {
        const data = req.body;
        const { email, password } = data;

      
        if (Object.keys(data) == 0) {
            return res.status(400).send({ status: false, msg: "Bad Request, No Data Provided" })
        }

        if (!validator.isValid(email)) {
            return res.status(400).send({ status: false, message: "Email is required." });
        }

        if (!validator.isValid(password)) {
            return res.status(400).send({ status: false, message: "Password is required." });
        }

        const matchUser = await userModel.findOne({ email, password }).select({userId:1});
        if (!matchUser) {
            return res.status(404).send({ status: false, message: " Email/Password is Not Matched" });
        }

        const token = jwt.sign(
            {
                userId: matchUser._id.toString(),
                Project: "Products Management",
                expiresIn: "1200sec",
                iat: new Date().getTime() / 1000   //(iat)Issued At- the time at which the JWT was issued.   
            },

            "Project-05_group-13",
            
            {
                expiresIn: "1200sec",
            });

        // res.setHeader("x-user-key", token)
        return res.status(200).send({ status: true, message: "User Logged in successfully", data:{userId: matchUser, token: token}});
    }
    catch (error) {
        res.status(500).send({ status: false, message: error.message });
    }
};


module.exports = { createUser ,loginUser}