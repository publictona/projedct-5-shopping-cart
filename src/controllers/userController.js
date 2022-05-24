
const userModel=require('../models/userModel')


const createUser =async function(req,res){
    let data = req.body
     

    let savedData=await userModel.create(data)
    res.status(201).send({status:true,msg:"Success", data:savedData})

}
module.exports={createUser}