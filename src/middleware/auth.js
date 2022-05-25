const userModel = require("../models/userModel")
const jwt = require("jsonwebtoken")


const authentication = async function (req, res, next) {
    try {
        let token = req.headers['authorization']
        if (!token) {
            return res.status(400).send({ status: false, msg: 'Plz, provide the token' })
        }
        //let splitToken =token.split(' ')
        let decodeToken = jwt.verify(token, "Project-05_group-13")
        if (!decodeToken) {
            return res.status(400).send({ status: false, msg: 'Plz, provide the token' })
        }
        next()
    }
    catch (err) {
        res.status(500).send({ status: false, message: error.message });

    }
}
module.exports={authentication}