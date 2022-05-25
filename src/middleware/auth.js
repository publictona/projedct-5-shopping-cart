const jwt = require("jsonwebtoken")


const userAuth= async function (req, res, next) {
    try {
        let token = req.header("Authorization", "Bearer")
        if (!token) {
            return res.status(400).send({ status: false, msg: 'Login Is Required' })
        }

        let decodedToken = jwt.verify(token, "Project-05_group-13")
        if (!decodedToken) {
            return res.status(400).send({ status: false, msg: 'Invalid Token' })
        }

        req.userId = decodedToken.userId

        next();
    }
    catch (error) {
        res.status(500).send({ status: false, message: error.message });
    }
}







module.exports = { userAuth }